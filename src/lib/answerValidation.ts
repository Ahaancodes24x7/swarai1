// Levenshtein distance algorithm for better answer matching
export function levenshteinDistance(str1: string, str2: string): number {
  const track = new Array(str2.length + 1).fill(null).map(() =>
    new Array(str1.length + 1).fill(null));
  
  for (let i = 0; i <= str1.length; i += 1) {
    track[0][i] = i;
  }
  
  for (let j = 0; j <= str2.length; j += 1) {
    track[j][0] = j;
  }
  
  for (let j = 1; j <= str2.length; j += 1) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      track[j][i] = Math.min(
        track[j][i - 1] + 1, // deletion
        track[j - 1][i] + 1, // insertion
        track[j - 1][i - 1] + indicator, // substitution
      );
    }
  }
  
  return track[str2.length][str1.length];
}

// Calculate similarity percentage
export function calculateSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) {
    return 100;
  }
  
  const distance = levenshteinDistance(longer, shorter);
  return ((longer.length - distance) / longer.length) * 100;
}

// Normalize text for comparison
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replaceAll(/[^\w\s]/g, '') // Remove punctuation
    .replaceAll(/\s+/g, ' '); // Normalize spaces
}

// Check if answer is correct with improved validation
export function validateAnswer(
  studentResponse: string,
  expectedAnswer: string,
  questionType: string
): { isCorrect: boolean; confidence: number; reason: string } {
  const normalizedResponse = normalizeText(studentResponse);
  const normalizedExpected = normalizeText(expectedAnswer);
  
  // Empty response
  if (!normalizedResponse) {
    return {
      isCorrect: false,
      confidence: 0,
      reason: 'No response provided'
    };
  }
  
  // Exact match
  if (normalizedResponse === normalizedExpected) {
    return {
      isCorrect: true,
      confidence: 100,
      reason: 'Exact match'
    };
  }
  
  // Calculate similarity
  const similarity = calculateSimilarity(normalizedResponse, normalizedExpected);
  
  // For single words or short answers, require higher accuracy
  const threshold = questionType === 'word' || normalizedExpected.split(' ').length <= 2 
    ? 80 
    : 70;
  
  // Check if key words are present
  const expectedWords = normalizedExpected.split(' ').filter(w => w.length > 2);
  const responseWords = normalizedResponse.split(' ');
  const keyWordsMatched = expectedWords.filter(word => 
    responseWords.some(rWord => calculateSimilarity(word, rWord) >= 70)
  ).length;
  
  const keyWordPercentage = expectedWords.length > 0 
    ? (keyWordsMatched / expectedWords.length) * 100 
    : 0;
  
  // Combined scoring
  const finalScore = (similarity * 0.6) + (keyWordPercentage * 0.4);
  
  if (finalScore >= threshold) {
    return {
      isCorrect: true,
      confidence: Math.round(finalScore),
      reason: `${Math.round(similarity)}% similar, ${keyWordsMatched}/${expectedWords.length} key words matched`
    };
  }
  
  // Partial credit check
  if (finalScore >= 50) {
    return {
      isCorrect: false,
      confidence: Math.round(finalScore),
      reason: `Close but not quite - ${Math.round(similarity)}% similar`
    };
  }
  
  return {
    isCorrect: false,
    confidence: Math.round(finalScore),
    reason: 'Response does not match expected answer'
  };
}

// Extract numeric answer for math questions
export function extractNumber(text: string): number | null {
  const regex = /-?\d+\.?\d*/;
  const match = regex.exec(text);
  return match ? Number.parseFloat(match[0]) : null;
}

// Validate numeric answer for dyscalculia questions
export function validateNumericAnswer(
  studentResponse: string,
  expectedAnswer: string
): { isCorrect: boolean; confidence: number; reason: string } {
  const studentNum = extractNumber(studentResponse);
  const expectedNum = extractNumber(expectedAnswer);
  
  if (studentNum === null) {
    return {
      isCorrect: false,
      confidence: 0,
      reason: 'No number found in response'
    };
  }
  
  if (expectedNum === null) {
    return {
      isCorrect: false,
      confidence: 0,
      reason: 'Invalid expected answer'
    };
  }
  
  if (studentNum === expectedNum) {
    return {
      isCorrect: true,
      confidence: 100,
      reason: 'Correct numeric answer'
    };
  }
  
  // Check if close (for decimals or rounding errors)
  const difference = Math.abs(studentNum - expectedNum);
  const percentDiff = (difference / Math.abs(expectedNum)) * 100;
  
  if (percentDiff < 5) {
    return {
      isCorrect: true,
      confidence: 95,
      reason: 'Answer within acceptable range'
    };
  }
  
  return {
    isCorrect: false,
    confidence: 0,
    reason: `Incorrect - expected ${expectedNum}, got ${studentNum}`
  };
}
