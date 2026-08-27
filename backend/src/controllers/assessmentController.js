const supabase = require("../config/supabase");

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

    const questionPath =`${req.user.id}/${id}/question-${Date.now()}-${questionPaper.originalname}`;

    const answerPath =`${req.user.id}/${id}/answer-${Date.now()}-${answerSheet.originalname}`;

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
    });
  }
};

module.exports = {createAssessment, uploadAssessmentFiles};