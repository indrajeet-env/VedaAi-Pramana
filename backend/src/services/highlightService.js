const extractLocations = (studentAnswer, ocrParsedResults) => {
  if (!studentAnswer || !ocrParsedResults?.length) return [];

  const answerTokens = studentAnswer
    .split(/\s+/)
    .map(t => t.toLowerCase().replace(/[^a-z0-9]/g, ""))
    .filter(Boolean);

  if (!answerTokens.length) return [];

  const results = [];

  ocrParsedResults.forEach((page, pageIndex) => {
    const words = [];

    if (!page.TextOverlay?.Lines) return;

    page.TextOverlay.Lines.forEach(line => {
      line.Words?.forEach(word => {
        words.push({
          text: word.WordText,
          page: pageIndex + 1,
          left: word.Left,
          top: word.Top,
          width: word.Width,
          height: word.Height
        });
      });
    });

    if (!words.length) return;

    const sourceWords = words.map(w =>
      w.text.toLowerCase().replace(/[^a-z0-9]/g, "")
    );

    let bestStart = -1;
    let bestEnd = -1;
    let maxScore = 0;

    const padding = Math.floor(answerTokens.length * 0.5) + 5;
    const windowSize = answerTokens.length + padding;

    for (let i = 0; i < sourceWords.length; i++) {
      let score = 0;
      let tempStart = -1;
      let tempEnd = -1;
      let sIdx = i;

      for (
        let tIdx = 0;
        tIdx < answerTokens.length &&
        sIdx < Math.min(i + windowSize, sourceWords.length);
        tIdx++
      ) {
        const target = answerTokens[tIdx];

        for (
          let searchIdx = sIdx;
          searchIdx < Math.min(sIdx + 3, sourceWords.length);
          searchIdx++
        ) {
          const source = sourceWords[searchIdx];

          if (
            source &&
            target &&
            (
              source === target ||
              (target.length > 3 &&
                (source.includes(target) || target.includes(source)))
            )
          ) {
            score++;

            if (tempStart === -1) tempStart = searchIdx;

            tempEnd = searchIdx;
            sIdx = searchIdx + 1;
            break;
          }
        }
      }

      if (score > maxScore) {
        maxScore = score;
        bestStart = tempStart;
        bestEnd = tempEnd;
      }
    }

    if (
      bestStart === -1 ||
      bestEnd === -1 ||
      maxScore < Math.max(2, answerTokens.length * 0.15)
    ) {
      return;
    }

    const matchedWords = words.slice(bestStart, bestEnd + 1);

    const grouped = [];

    matchedWords.forEach(word => {
      const last = grouped[grouped.length - 1];

      if (
        last &&
        Math.abs(word.top - last.top) < 25
      ) {
        const right = Math.max(
          last.left + last.width,
          word.left + word.width
        );

        last.width = right - last.left;
        last.top = Math.min(last.top, word.top);
        last.height = Math.max(
          last.height,
          word.top + word.height - last.top
        );
      } else {
        grouped.push({
          page: word.page,
          left: word.left,
          top: word.top,
          width: word.width,
          height: word.height
        });
      }
    });

    results.push(...grouped);
  });

  return results;
};

module.exports = { extractLocations };
