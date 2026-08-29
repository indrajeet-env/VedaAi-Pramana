const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const MODEL = "gemini-3.6-flash";

// Zod Schemas

const questionSchema = z.object({
  questionNumber: z.string(),
  question: z.string(),
  maxMarks: z.number().nonnegative(),
  studentAnswer: z.string(),
  unclearParts: z.array(z.string()),
});

const assessmentSchema = z.object({
  questions: z.array(questionSchema),
});

const evaluationSchema = z.object({
  score: z.number().nonnegative(),
  maxMarks: z.number().nonnegative(),
  feedback: z.string(),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
});


const parseGeminiJson = (text, schema, name) => {
  try {
    const parsed = JSON.parse(text);

    return schema.parse(parsed);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(
        `${name} returned invalid structure: ${error.message}`
      );
    }

    throw new Error(`${name} returned invalid JSON.`);
  }
};


const structureAssessment = async (
  questionText,
  answerText
) => {
  const prompt = `
You are an academic assessment processing system.

You will receive OCR text from:
1. A question paper
2. A student's answer sheet

The OCR may contain spelling mistakes, missing characters,
or incorrectly recognized words.

Your task is to:

- Identify every question in the question paper.
- Identify the corresponding answer written by the student.
- Match answers to the correct questions.
- Identify the maximum marks for each question.
- Correct obvious OCR errors only when the intended meaning is clear.
- Preserve the student's actual meaning.
- Do NOT invent content that the student did not write.
- If an answer or part of an answer is unclear, mention it
  in "unclearParts".
- Preserve question numbering.
- If maximum marks cannot be determined, use 0.

Return ONLY valid JSON in exactly this structure:

{
  "questions": [
    {
      "questionNumber": "1",
      "question": "The question text",
      "maxMarks": 5,
      "studentAnswer": "The student's answer",
      "unclearParts": []
    }
  ]
}

QUESTION PAPER OCR:
${questionText}

STUDENT ANSWER OCR:
${answerText}
`;

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      temperature: 0,
    },
  });

  return parseGeminiJson(
    response.text,
    assessmentSchema,
    "Assessment structuring"
  );
};


// Evaluate Individual Answer

const evaluateAnswer = async (
  question,
  studentAnswer,
  maxMarks
) => {
  const prompt = `
You are an expert academic evaluator.

Evaluate the student's answer against the question.

QUESTION:
${question}

STUDENT ANSWER:
${studentAnswer}

MAXIMUM MARKS:
${maxMarks}

Evaluate based on:

- Correctness
- Relevance
- Completeness
- Conceptual understanding
- Important points expected in the answer

Important rules:

- Do not reward an answer simply because it is long.
- Do not penalize obvious OCR spelling mistakes when
  the intended meaning is clear.
- Do not invent points that the student did not provide.
- Be strict but fair.
- The score must be between 0 and ${maxMarks}.

Return ONLY valid JSON:

{
  "score": 0,
  "maxMarks": ${maxMarks},
  "feedback": "Brief explanation of the score",
  "strengths": [],
  "weaknesses": []
}
`;

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      temperature: 0,
    },
  });

  const evaluation = parseGeminiJson(
    response.text,
    evaluationSchema,
    "Answer evaluation"
  );

  // Extra safety check
  if (evaluation.score > maxMarks) {
    throw new Error(
      `Gemini returned score ${evaluation.score}, ` +
      `but maximum marks are ${maxMarks}.`
    );
  }

  return evaluation;
};


module.exports = {
  structureAssessment,
  evaluateAnswer,
};