const supabase = require("../config/supabase");
const {downloadAnswerSheet, downloadQuestionPaper} = require("../services/storageService");

const { extractTextWithOCR } = require("../services/ocrService");
const { extractLocations } = require("../services/highlightService");

const {structureAssessment, evaluateAnswer} = require("../services/llmService");

const sanitizeFileName = (fileName) => {
  return fileName
    .normalize("NFKD")
    .replace(/[^\w.-]/g, "_");
};

const createAssessment = async (req, res) => {
  try {
    const { data, error } = await supabase.from("assessments").insert({
        user_id: req.user.id,
        status: "created",
      })
      .select()
      .single(); // instead of returning array of objects we'll be returning single object

    if (error) {
      console.error("Assessment creation error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to create assessment",
      });
    }

    return res.status(201).json({
      success: true,
      assessment: data,
    });
  } catch (error) {
    console.error("Assessment controller error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};


const uploadAssessmentFiles = async (req, res) => {
  try {
    const { id } = req.params;

    const questionPaper = req.files?.questionPaper?.[0];
    const answerSheet = req.files?.answerSheet?.[0];

    if (!questionPaper || !answerSheet) {
      return res.status(400).json({
        success: false,
        message: "Both question paper and answer sheet are required.",
      });
    }

    // Verify assessment exists and belongs to authenticated user
    const { data: assessment, error: assessmentError } = await supabase
      .from("assessments")
      .select("*")
      .eq("id", id)
      .eq("user_id", req.user.id)
      .single();

    if (assessmentError || !assessment) {
      return res.status(404).json({
        success: false,
        message: "Assessment not found.",
      });
    }

    const questionFileName = sanitizeFileName(questionPaper.originalname);
    const answerFileName = sanitizeFileName(answerSheet.originalname);

    const questionPath = `${req.user.id}/${id}/question-${Date.now()}-${questionFileName}`;

    const answerPath = `${req.user.id}/${id}/answer-${Date.now()}-${answerFileName}`;

    // Upload question paper
    const { error: questionUploadError } = await supabase.storage.from("question-papers").upload(questionPath, questionPaper.buffer, {
        contentType: questionPaper.mimetype,
        upsert: false,
      });

    if (questionUploadError) {
      throw questionUploadError;
    }

    // Upload answer sheet
    const { error: answerUploadError } = await supabase.storage.from("answer-sheets").upload(answerPath, answerSheet.buffer, {
        contentType: answerSheet.mimetype,
        upsert: false,
      });

    if (answerUploadError) {
      throw answerUploadError;
    }

    // Save paths in assessment
    const { data: updatedAssessment, error: updateError } = await supabase
      .from("assessments")
      .update({
        question_file_path: questionPath,
        answer_file_path: answerPath,
        status: "uploaded",
      })
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    return res.status(200).json({
      success: true,
      message: "Files uploaded successfully.",
      assessment: updatedAssessment,
    });
  } catch (error) {
    console.error("File upload error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to upload files.",
      error: error.message,
    });
  }
};

const processAssessment = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Find assessment and verify ownership
    const { data: assessment, error: assessmentError } =
      await supabase
        .from("assessments")
        .select("*")
        .eq("id", id)
        .eq("user_id", req.user.id)
        .single();

    if (assessmentError || !assessment) {
      return res.status(404).json({
        success: false,
        message: "Assessment not found.",
      });
    }

    if (
      !assessment.question_file_path ||
      !assessment.answer_file_path
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Both question paper and answer sheet must be uploaded.",
      });
    }

    // 2. Download both files from Supabase

    const questionBuffer = await downloadQuestionPaper(
      assessment.question_file_path
    );

    const answerBuffer = await downloadAnswerSheet(
      assessment.answer_file_path
    );

    // 3. OCR both files

    const questionOCR = await extractTextWithOCR(
      questionBuffer,
      "question-paper.pdf"
    );

    const answerOCR = await extractTextWithOCR(
      answerBuffer,
      "answer-sheet.pdf"
    );

    console.log("Question OCR completed.");
    console.log("Answer OCR completed.");

    // 4. Gemini structures the assessment

    const structuredAssessment =
      await structureAssessment(
        questionOCR.text,
        answerOCR.text
      );

    console.log(
      `Gemini identified ${structuredAssessment.questions.length} questions.`
    );

    // 5. Evaluate every answer

    const evaluatedQuestions = [];

    let totalScore = 0;
    let totalMarks = 0;

// Currently this makes one gemini call per question, later on improve this for making one gemini call for atleast one side of the question paper

    for (const question of structuredAssessment.questions) {
      const evaluation = await evaluateAnswer(
        question.question,
        question.studentAnswer,
        question.maxMarks
      );

      const answerLocations = extractLocations(
        question.studentAnswer, 
        answerOCR.parsedResults
      );

      evaluatedQuestions.push({
        questionNumber: question.questionNumber,
        question: question.question,
        studentAnswer: question.studentAnswer,
        maxMarks: question.maxMarks,
        score: evaluation.score,
        feedback: evaluation.feedback,
        strengths: evaluation.strengths,
        weaknesses: evaluation.weaknesses,
        unclearParts: question.unclearParts,
        answerLocations: answerLocations
      });

      totalScore += evaluation.score;
      totalMarks += question.maxMarks;
    }

    // 6. Calculate aggregate result

    const percentage = totalMarks > 0 ? Number(((totalScore / totalMarks) * 100).toFixed(2)): 0;

    const result = {questions: evaluatedQuestions};

    // 7. Save result to database

    const { error: resultUpdateError } = await supabase
      .from("assessments")
      .update({
        total_score: totalScore,
        total_marks: totalMarks,
        percentage,
        result,
        status: "evaluated",
      })
      .eq("id", id)
      .eq("user_id", req.user.id);

    if (resultUpdateError) {
      throw resultUpdateError;
    }

    // 8. Return final result

    return res.status(200).json({
      success: true,
      message: "Assessment processed successfully.",
      assessmentId: id,
      result: {
        totalScore,
        totalMarks,
        percentage,
        questions: evaluatedQuestions,
      },
    });
  } catch (error) {
    console.error(
      "Assessment processing error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to process assessment.",
      error: error.message,
    });
  }
};


const getAssessments = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("assessments")
      .select(
        "id, question_file_path, answer_file_path, status, total_score, total_marks, percentage, created_at, updated_at"
      )
      .eq("user_id", req.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch assessments error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch assessments.",
      });
    }

    return res.status(200).json({
      success: true,
      assessments: data,
    });
  } catch (error) {
    console.error("Get assessments controller error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
};

const getAssessmentById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: assessment, error } = await supabase
      .from("assessments")
      .select("*")
      .eq("id", id)
      .eq("user_id", req.user.id)
      .single();

    if (error || !assessment) {
      return res.status(404).json({
        success: false,
        message: "Assessment not found.",
      });
    }

    let questionFileUrl = null;
    let answerFileUrl = null;

    if (assessment.question_file_path) {
      const { data: qData, error: qError } = await supabase.storage
        .from("question-papers")
        .createSignedUrl(assessment.question_file_path, 3600);
      if (!qError && qData) questionFileUrl = qData.signedUrl;
    }

    if (assessment.answer_file_path) {
      const { data: aData, error: aError } = await supabase.storage
        .from("answer-sheets")
        .createSignedUrl(assessment.answer_file_path, 3600);
      if (!aError && aData) answerFileUrl = aData.signedUrl;
    }

    return res.status(200).json({
      success: true,
      assessment: {
        ...assessment,
        questionFileUrl,
        answerFileUrl,
      },
    });
  } catch (error) {
    console.error("Get assessment by id error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
};

const getAnswerSheet = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: assessment, error } = await supabase
      .from("assessments")
      .select("answer_file_path")
      .eq("id", id)
      .eq("user_id", req.user.id)
      .single();

    if (error || !assessment || !assessment.answer_file_path) {
      return res.status(404).json({ success: false, message: "Answer sheet not found." });
    }

    const buffer = await downloadAnswerSheet(assessment.answer_file_path);
    
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="answer-sheet-${id}.pdf"`);
    return res.send(buffer);
  } catch (error) {
    console.error("Get answer sheet error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load PDF.",
    });
  }
};


module.exports = {createAssessment, uploadAssessmentFiles, processAssessment, getAssessments, getAssessmentById, getAnswerSheet};