const supabase = require("../config/supabase");

const downloadAnswerSheet = async (filePath) => {
  const { data, error } = await supabase.storage
    .from("answer-sheets")
    .download(filePath);

  if (error) {
    throw error;
  }

  const arrayBuffer = await data.arrayBuffer();

  return Buffer.from(arrayBuffer);
};

module.exports = {
  downloadAnswerSheet,
};