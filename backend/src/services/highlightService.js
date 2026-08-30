const extractLocations = (studentAnswer, ocrParsedResults) => {
  if (!studentAnswer || !ocrParsedResults || !ocrParsedResults.length) return [];

  // Flatten OCR words
  const allWords = [];
  ocrParsedResults.forEach((page, pageIndex) => {
    if (page.TextOverlay && page.TextOverlay.Lines) {
      page.TextOverlay.Lines.forEach(line => {
        if (line.Words) {
          line.Words.forEach(word => {
            allWords.push({
              text: word.WordText,
              page: pageIndex + 1,
              left: word.Left,
              top: word.Top,
              width: word.Width,
              height: word.Height
            });
          });
        }
      });
    }
  });

  if (allWords.length === 0) return [];

  // Tokenize student answer
  const answerTokens = studentAnswer.split(/\s+/).filter(t => t.trim().length > 0);
  if (answerTokens.length === 0) return [];

  const targetWords = answerTokens.map(w => w.toLowerCase().replace(/[^a-z0-9]/g, '')).filter(w => w.length > 0);
  const sourceWords = allWords.map(w => w.text.toLowerCase().replace(/[^a-z0-9]/g, ''));

  if (targetWords.length === 0) return [];

  const padding = Math.floor(targetWords.length * 0.5) + 5;
  const windowSize = targetWords.length + padding;

  let bestStart = -1;
  let bestEnd = -1;
  let maxScore = 0;

  for (let i = 0; i <= sourceWords.length - 1; i++) {
    let score = 0;
    let tempStart = -1;
    let tempEnd = -1;
    let sIdx = i;
    
    for (let tIdx = 0; tIdx < targetWords.length && sIdx < Math.min(i + windowSize, sourceWords.length); tIdx++) {
      let found = false;
      for (let searchIdx = sIdx; searchIdx < Math.min(sIdx + 3, sourceWords.length); searchIdx++) {
        const sWord = sourceWords[searchIdx];
        const tWord = targetWords[tIdx];
        if (sWord && tWord && (sWord === tWord || (tWord.length > 3 && (sWord.includes(tWord) || tWord.includes(sWord))))) {
          score++;
          if (tempStart === -1) tempStart = searchIdx;
          tempEnd = searchIdx;
          sIdx = searchIdx + 1;
          found = true;
          break;
        }
      }
    }

    if (score > maxScore) {
      maxScore = score;
      bestStart = tempStart !== -1 ? tempStart : i;
      bestEnd = tempEnd !== -1 ? tempEnd : i + targetWords.length - 1;
    }
  }

  if (maxScore < Math.max(2, targetWords.length * 0.15) || bestStart === -1 || bestEnd === -1) {
    return []; // too little match
  }

  bestEnd = Math.min(bestEnd, allWords.length - 1);

  // extract bounding boxes from start to end
  const boxes = [];
  for (let i = bestStart; i <= bestEnd; i++) {
    boxes.push({
      page: allWords[i].page,
      left: allWords[i].left,
      top: allWords[i].top,
      width: allWords[i].width,
      height: allWords[i].height
    });
  }

  // merge contiguous boxes on the same line/page
  const mergedBoxes = [];
  if (boxes.length > 0) {
    let currentBox = { ...boxes[0] };
    for (let i = 1; i < boxes.length; i++) {
      const b = boxes[i];
      // if same page and roughly same top, merge
      if (b.page === currentBox.page && Math.abs(b.top - currentBox.top) < 25) {
        const newRight = Math.max(currentBox.left + currentBox.width, b.left + b.width);
        currentBox.width = newRight - currentBox.left;
        currentBox.top = Math.min(currentBox.top, b.top);
        currentBox.height = Math.max(currentBox.height, b.height);
      } else {
        mergedBoxes.push(currentBox);
        currentBox = { ...b };
      }
    }
    mergedBoxes.push(currentBox);
  }

  return mergedBoxes;
};

module.exports = { extractLocations };
