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

module.exports = {createAssessment};