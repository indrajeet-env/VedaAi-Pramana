const extractTextWithOCR = async (fileBuffer, fileName) => {
  const formData = new FormData();

  formData.append(
    "apikey",
    process.env.OCR_SPACE_API_KEY
  );

  formData.append("language", "eng");
  formData.append("isOverlayRequired", "true");
  formData.append("OCREngine", "2");

  const blob = new Blob([fileBuffer], {
    type: "application/pdf",
  });

  formData.append("file", blob, fileName);

  const response = await fetch(
    "https://api.ocr.space/parse/image",
    {
      method: "POST",
      body: formData,
    }
  );

  const responseText = await response.text();

  if (!response.ok) {
    console.error("OCR.space error:", responseText);

    throw new Error(
      `OCR API request failed: ${response.status} - ${responseText}`
    );
  }

  const result = JSON.parse(responseText);

  if (result.IsErroredOnProcessing) {
    throw new Error(
      result.ErrorMessage?.join(", ") ||
        "OCR processing failed"
    );
  }

  const extractedText = result.ParsedResults
    ?.map((result) => result.ParsedText)
    .join("\n");

  return {
    text: extractedText || "",
    parsedResults: result.ParsedResults || [],
  };
};

module.exports = {
  extractTextWithOCR,
};