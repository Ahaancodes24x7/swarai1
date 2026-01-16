// ==============================
// SWAR – Grade-wise Question Bank
// NCERT-aligned + DSM-5 inspired
// Speech-first screening (not diagnosis)
// ==============================

export interface Question {
  id: number;
  text: string;
  expectedAnswer: string;
  type: 'phoneme' | 'word' | 'sentence' | 'number' | 'calculation';
}

// ======================================================
// DYSLEXIA QUESTION BANK (Grades 1–12)
// Focus: phonological awareness, decoding, fluency,
// morphology (from Grade 4+), stress & academic reading
// ======================================================

export const dyslexiaQuestionsByGrade: Record<number, Question[]> = {
  1: [
    { id: 1, text: 'Say the sound of the letter: B', expectedAnswer: 'b', type: 'phoneme' },
    { id: 2, text: 'Say the word shown: CAT', expectedAnswer: 'cat', type: 'word' },
    { id: 3, text: 'Say the first sound in the word: SUN', expectedAnswer: 's', type: 'phoneme' },
    { id: 4, text: 'Say the word: DOG', expectedAnswer: 'dog', type: 'word' },
    { id: 5, text: 'Say each sound in the word: BAT', expectedAnswer: 'b a t', type: 'phoneme' },
    { id: 6, text: 'Which word rhymes with CAT?', expectedAnswer: 'bat', type: 'phoneme' },
    { id: 7, text: 'Say the word: RED', expectedAnswer: 'red', type: 'word' },
    { id: 8, text: 'Read aloud: I see a cat', expectedAnswer: 'i see a cat', type: 'sentence' },
  ],

  2: [
    { id: 1, text: 'Say the word: HAPPY', expectedAnswer: 'happy', type: 'word' },
    { id: 2, text: 'Say all sounds in the word: STOP', expectedAnswer: 's t o p', type: 'phoneme' },
    { id: 3, text: 'Which sound does PH make?', expectedAnswer: 'f', type: 'phoneme' },
    { id: 4, text: 'Read aloud: The dog is big', expectedAnswer: 'the dog is big', type: 'sentence' },
    { id: 5, text: 'Say the word: PLAY', expectedAnswer: 'play', type: 'word' },
    { id: 6, text: 'Say the last sound in the word: JUMP', expectedAnswer: 'p', type: 'phoneme' },
    { id: 7, text: 'Say the word: FRIEND', expectedAnswer: 'friend', type: 'word' },
    { id: 8, text: 'Read aloud: We play in the park', expectedAnswer: 'we play in the park', type: 'sentence' },
  ],

  3: [
    { id: 1, text: 'Say the word: BUTTERFLY', expectedAnswer: 'butterfly', type: 'word' },
    { id: 2, text: 'Break the word into sounds: STREAM', expectedAnswer: 's t r ea m', type: 'phoneme' },
    { id: 3, text: 'Say the word: CHOCOLATE', expectedAnswer: 'chocolate', type: 'word' },
    { id: 4, text: 'Read aloud: The quick brown fox jumps', expectedAnswer: 'the quick brown fox jumps', type: 'sentence' },
    { id: 5, text: 'Say the word: BEAUTIFUL', expectedAnswer: 'beautiful', type: 'word' },
    { id: 6, text: 'Say these letters aloud: b d p q', expectedAnswer: 'b d p q', type: 'phoneme' },
    { id: 7, text: 'Say the word: SCHOOL', expectedAnswer: 'school', type: 'word' },
    { id: 8, text: 'Read aloud: She went to school yesterday', expectedAnswer: 'she went to school yesterday', type: 'sentence' },
  ],

  4: [
    { id: 1, text: 'Say the word: GOVERNMENT', expectedAnswer: 'government', type: 'word' },
    { id: 2, text: 'Identify the silent letter in the word: KNIFE', expectedAnswer: 'k', type: 'phoneme' },
    { id: 3, text: 'Read aloud: The mysterious castle stood on the hill', expectedAnswer: 'the mysterious castle stood on the hill', type: 'sentence' },
    { id: 4, text: 'Break the word into parts: UNHAPPY', expectedAnswer: 'un happy', type: 'phoneme' },
    { id: 5, text: 'Say the word: PRONUNCIATION', expectedAnswer: 'pronunciation', type: 'word' },
    { id: 6, text: 'Say the difficult sound in the word: THOUGHT', expectedAnswer: 'th', type: 'phoneme' },
    { id: 7, text: 'Say the word: SCIENCE', expectedAnswer: 'science', type: 'word' },
    { id: 8, text: 'Read aloud: Scientists discovered a new species', expectedAnswer: 'scientists discovered a new species', type: 'sentence' },
  ],

  5: [
    { id: 1, text: 'Say the word: INFORMATION', expectedAnswer: 'information', type: 'word' },
    { id: 2, text: 'Break the word into syllables: UNBELIEVABLE', expectedAnswer: 'un be lieve a ble', type: 'phoneme' },
    { id: 3, text: 'Read aloud: The expedition crossed the mountain range', expectedAnswer: 'the expedition crossed the mountain range', type: 'sentence' },
    { id: 4, text: 'Say the word: DEVELOPMENT', expectedAnswer: 'development', type: 'word' },
    { id: 5, text: 'Identify the prefix in the word: DISAGREE', expectedAnswer: 'dis', type: 'phoneme' },
    { id: 6, text: 'Say the word: EDUCATION', expectedAnswer: 'education', type: 'word' },
    { id: 7, text: 'Read aloud: Reading regularly improves vocabulary', expectedAnswer: 'reading regularly improves vocabulary', type: 'sentence' },
    { id: 8, text: 'Say the word: ENVIRONMENT', expectedAnswer: 'environment', type: 'word' },
  ],

  6: [
    { id: 1, text: 'Say the word: COMMUNICATION', expectedAnswer: 'communication', type: 'word' },
    { id: 2, text: 'Break the word into parts: REACTION', expectedAnswer: 're act ion', type: 'phoneme' },
    { id: 3, text: 'Read aloud: Technological advancement changed communication', expectedAnswer: 'technological advancement changed communication', type: 'sentence' },
    { id: 4, text: 'Say the word: PHILOSOPHY', expectedAnswer: 'philosophy', type: 'word' },
    { id: 5, text: 'Identify the stressed syllable in: PHOTOGRAPH', expectedAnswer: 'pho TO graph', type: 'phoneme' },
    { id: 6, text: 'Say the word: DEMOCRACY', expectedAnswer: 'democracy', type: 'word' },
    { id: 7, text: 'Read aloud: Education plays a vital role in society', expectedAnswer: 'education plays a vital role in society', type: 'sentence' },
    { id: 8, text: 'Say the word: RESPONSIBILITY', expectedAnswer: 'responsibility', type: 'word' },
  ],

  7: [
    { id: 1, text: 'Say the word: ENTREPRENEUR', expectedAnswer: 'entrepreneur', type: 'word' },
    { id: 2, text: 'Break the word into morphemes: ELECTROMAGNETIC', expectedAnswer: 'electro magnetic', type: 'phoneme' },
    { id: 3, text: 'Read aloud: Scientific discoveries influence technological progress', expectedAnswer: 'scientific discoveries influence technological progress', type: 'sentence' },
    { id: 4, text: 'Say the word: ANALYSIS', expectedAnswer: 'analysis', type: 'word' },
    { id: 5, text: 'Identify stress in the word: ECONOMIC', expectedAnswer: 'eco NO mic', type: 'phoneme' },
    { id: 6, text: 'Say the word: GLOBALIZATION', expectedAnswer: 'globalization', type: 'word' },
    { id: 7, text: 'Read aloud: Critical thinking helps solve complex problems', expectedAnswer: 'critical thinking helps solve complex problems', type: 'sentence' },
    { id: 8, text: 'Say the word: INNOVATION', expectedAnswer: 'innovation', type: 'word' },
  ],

  8: [
    { id: 1, text: 'Say the word: INTERPRETATION', expectedAnswer: 'interpretation', type: 'word' },
    { id: 2, text: 'Break the word into morphemes: INTERNATIONALIZATION', expectedAnswer: 'inter nation al ization', type: 'phoneme' },
    { id: 3, text: 'Read aloud: Socioeconomic factors affect educational outcomes', expectedAnswer: 'socioeconomic factors affect educational outcomes', type: 'sentence' },
    { id: 4, text: 'Say the word: METHODOLOGY', expectedAnswer: 'methodology', type: 'word' },
    { id: 5, text: 'Identify stress in the word: PHILOSOPHICAL', expectedAnswer: 'phi lo SO phi cal', type: 'phoneme' },
    { id: 6, text: 'Say the word: CONSTITUTIONAL', expectedAnswer: 'constitutional', type: 'word' },
    { id: 7, text: 'Read aloud: Logical reasoning strengthens decision making', expectedAnswer: 'logical reasoning strengthens decision making', type: 'sentence' },
    { id: 8, text: 'Say the word: GOVERNANCE', expectedAnswer: 'governance', type: 'word' },
  ],

  9: [
    { id: 1, text: 'Say the word: PHENOMENOLOGY', expectedAnswer: 'phenomenology', type: 'word' },
    { id: 2, text: 'Analyze the word roots in: DEMOCRATIC', expectedAnswer: 'demo cratic', type: 'phoneme' },
    { id: 3, text: 'Read aloud: Scientific inquiry requires systematic observation', expectedAnswer: 'scientific inquiry requires systematic observation', type: 'sentence' },
    { id: 4, text: 'Say the word: CONTEMPORARY', expectedAnswer: 'contemporary', type: 'word' },
    { id: 5, text: 'Identify stress in the word: ECONOMICS', expectedAnswer: 'eco NO mics', type: 'phoneme' },
    { id: 6, text: 'Say the word: ENVIRONMENTAL', expectedAnswer: 'environmental', type: 'word' },
    { id: 7, text: 'Read aloud: Research findings must be evaluated critically', expectedAnswer: 'research findings must be evaluated critically', type: 'sentence' },
    { id: 8, text: 'Say the word: SUSTAINABILITY', expectedAnswer: 'sustainability', type: 'word' },
  ],

  10: [
    { id: 1, text: 'Say the word: INTERNATIONALIZATION', expectedAnswer: 'internationalization', type: 'word' },
    { id: 2, text: 'Break into morphemes: MULTIDIMENSIONAL', expectedAnswer: 'multi dimension al', type: 'phoneme' },
    { id: 3, text: 'Read aloud: Scientific research requires careful observation and analysis', expectedAnswer: 'scientific research requires careful observation and analysis', type: 'sentence' },
    { id: 4, text: 'Say the word: EVALUATION', expectedAnswer: 'evaluation', type: 'word' },
    { id: 5, text: 'Identify stress in the word: POLITICAL', expectedAnswer: 'po LI ti cal', type: 'phoneme' },
    { id: 6, text: 'Say the word: CONSTITUTIONALISM', expectedAnswer: 'constitutionalism', type: 'word' },
    { id: 7, text: 'Read aloud: Logical reasoning underpins scientific thinking', expectedAnswer: 'logical reasoning underpins scientific thinking', type: 'sentence' },
    { id: 8, text: 'Say the word: PHILOSOPHICAL', expectedAnswer: 'philosophical', type: 'word' },
  ],

  11: [
    { id: 1, text: 'Say the word: METACOGNITION', expectedAnswer: 'metacognition', type: 'word' },
    { id: 2, text: 'Analyze the morphemes in: DECONTEXTUALIZATION', expectedAnswer: 'de context ual ization', type: 'phoneme' },
    { id: 3, text: 'Read aloud: Philosophical inquiry examines the nature of knowledge', expectedAnswer: 'philosophical inquiry examines the nature of knowledge', type: 'sentence' },
    { id: 4, text: 'Say the word: EPISTEMOLOGY', expectedAnswer: 'epistemology', type: 'word' },
    { id: 5, text: 'Identify stress in the word: METAPHYSICAL', expectedAnswer: 'meta PHY si cal', type: 'phoneme' },
    { id: 6, text: 'Say the word: INTERDISCIPLINARY', expectedAnswer: 'interdisciplinary', type: 'word' },
    { id: 7, text: 'Read aloud: Analytical reasoning is central to academic success', expectedAnswer: 'analytical reasoning is central to academic success', type: 'sentence' },
    { id: 8, text: 'Say the word: CONCEPTUALIZATION', expectedAnswer: 'conceptualization', type: 'word' },
  ],

  12: [
    { id: 1, text: 'Say the word: PHENOMENOLOGICAL', expectedAnswer: 'phenomenological', type: 'word' },
    { id: 2, text: 'Analyze the derivation of: ANTIDISESTABLISHMENTARIANISM', expectedAnswer: 'anti dis establish ment arian ism', type: 'phoneme' },
    { id: 3, text: 'Read aloud: The interpretation of complex texts requires contextual awareness', expectedAnswer: 'the interpretation of complex texts requires contextual awareness', type: 'sentence' },
    { id: 4, text: 'Say the word: HERMENEUTICAL', expectedAnswer: 'hermeneutical', type: 'word' },
    { id: 5, text: 'Identify stress in the word: TELEOLOGICAL', expectedAnswer: 'te le o LO gi cal', type: 'phoneme' },
    { id: 6, text: 'Say the word: CONCEPTUAL FRAMEWORK', expectedAnswer: 'conceptual framework', type: 'word' },
    { id: 7, text: 'Read aloud: Critical interpretation bridges theory and empirical observation', expectedAnswer: 'critical interpretation bridges theory and empirical observation', type: 'sentence' },
    { id: 8, text: 'Say the word: METAPHILOSOPHY', expectedAnswer: 'metaphilosophy', type: 'word' },
  ],
};

// ======================================================
// DYSCALCULIA QUESTION BANK (Grades 1–12)
// Focus: number sense, counting, transcoding,
// arithmetic fact retrieval, verbal math reasoning
// ======================================================

export const dyscalculiaQuestionsByGrade: Record<number, Question[]> = {
  1: [
    { id: 1, text: 'Count aloud from 1 to 10', expectedAnswer: '1 2 3 4 5 6 7 8 9 10', type: 'number' },
    { id: 2, text: 'What is 2 plus 1?', expectedAnswer: '3', type: 'calculation' },
    { id: 3, text: 'Which number is bigger: 3 or 5?', expectedAnswer: '5', type: 'number' },
    { id: 4, text: 'Count backwards from 5', expectedAnswer: '5 4 3 2 1', type: 'number' },
    { id: 5, text: 'How many fingers are on one hand?', expectedAnswer: '5', type: 'number' },
    { id: 6, text: 'What comes after 7?', expectedAnswer: '8', type: 'number' },
    { id: 7, text: 'What is 4 minus 1?', expectedAnswer: '3', type: 'calculation' },
    { id: 8, text: 'Count the objects shown aloud', expectedAnswer: 'correct count', type: 'number' },
  ],

  2: [
    { id: 1, text: 'Count aloud from 1 to 20', expectedAnswer: '1 2 3 ... 20', type: 'number' },
    { id: 2, text: 'What is 5 plus 3?', expectedAnswer: '8', type: 'calculation' },
    { id: 3, text: 'What is 10 minus 4?', expectedAnswer: '6', type: 'calculation' },
    { id: 4, text: 'Count backwards from 10', expectedAnswer: '10 9 8 7 6 5 4 3 2 1', type: 'number' },
    { id: 5, text: 'What comes after 15?', expectedAnswer: '16', type: 'number' },
    { id: 6, text: 'What is 8 minus 3?', expectedAnswer: '5', type: 'calculation' },
    { id: 7, text: 'Which is bigger: 14 or 41?', expectedAnswer: '41', type: 'number' },
    { id: 8, text: 'Skip count by 2s starting from 2', expectedAnswer: '2 4 6 8 10', type: 'number' },
  ],

  3: [
    { id: 1, text: 'What is 12 plus 15?', expectedAnswer: '27', type: 'calculation' },
    { id: 2, text: 'What is 25 minus 13?', expectedAnswer: '12', type: 'calculation' },
    { id: 3, text: 'What is 3 multiplied by 4?', expectedAnswer: '12', type: 'calculation' },
    { id: 4, text: 'Count by 5s from 5 to 50', expectedAnswer: '5 10 15 20 25 30 35 40 45 50', type: 'number' },
    { id: 5, text: 'What is 100 minus 45?', expectedAnswer: '55', type: 'calculation' },
    { id: 6, text: 'What is 12 divided by 4?', expectedAnswer: '3', type: 'calculation' },
    { id: 7, text: 'Which is bigger: 306 or 360?', expectedAnswer: '360', type: 'number' },
    { id: 8, text: 'Read the number aloud: 507', expectedAnswer: 'five hundred seven', type: 'number' },
  ],

  4: [
    { id: 1, text: 'What is 156 plus 287?', expectedAnswer: '443', type: 'calculation' },
    { id: 2, text: 'What is 500 minus 234?', expectedAnswer: '266', type: 'calculation' },
    { id: 3, text: 'What is 12 multiplied by 11?', expectedAnswer: '132', type: 'calculation' },
    { id: 4, text: 'What is 144 divided by 12?', expectedAnswer: '12', type: 'calculation' },
    { id: 5, text: 'Read the number aloud: 5007', expectedAnswer: 'five thousand seven', type: 'number' },
    { id: 6, text: 'What is 9 multiplied by 8?', expectedAnswer: '72', type: 'calculation' },
    { id: 7, text: 'Which is bigger: 4025 or 4250?', expectedAnswer: '4250', type: 'number' },
    { id: 8, text: 'What is 81 divided by 9?', expectedAnswer: '9', type: 'calculation' },
  ],

  5: [
    { id: 1, text: 'What is 2.5 plus 3.7?', expectedAnswer: '6.2', type: 'calculation' },
    { id: 2, text: 'What is one half plus one fourth?', expectedAnswer: 'three fourth or 0.75', type: 'calculation' },
    { id: 3, text: 'What is 15 multiplied by 15?', expectedAnswer: '225', type: 'calculation' },
    { id: 4, text: 'What is 25 percent of 100?', expectedAnswer: '25', type: 'calculation' },
    { id: 5, text: 'Read the number aloud: 45678', expectedAnswer: 'forty five thousand six hundred seventy eight', type: 'number' },
    { id: 6, text: 'What is 7.5 minus 2.3?', expectedAnswer: '5.2', type: 'calculation' },
    { id: 7, text: 'Which is larger: 3/4 or 2/3?', expectedAnswer: '3/4', type: 'number' },
    { id: 8, text: 'What is 625 divided by 25?', expectedAnswer: '25', type: 'calculation' },
  ],

  6: [
    { id: 1, text: 'What is negative five plus eight?', expectedAnswer: '3', type: 'calculation' },
    { id: 2, text: 'What is three fourth multiplied by two thirds?', expectedAnswer: 'one half', type: 'calculation' },
    { id: 3, text: 'What is twelve squared?', expectedAnswer: '144', type: 'calculation' },
    { id: 4, text: 'What is fifty percent of two hundred fifty?', expectedAnswer: '125', type: 'calculation' },
    { id: 5, text: 'Convert zero point seven five into a fraction', expectedAnswer: 'three fourth', type: 'number' },
    { id: 6, text: 'What is negative three multiplied by negative four?', expectedAnswer: '12', type: 'calculation' },
    { id: 7, text: 'What is the square root of sixty four?', expectedAnswer: '8', type: 'calculation' },
    { id: 8, text: 'What is two point five multiplied by four point two?', expectedAnswer: '10.5', type: 'calculation' },
  ],

  7: [
    { id: 1, text: 'Solve: two x plus five equals thirteen', expectedAnswer: '4', type: 'calculation' },
    { id: 2, text: 'What is five cubed?', expectedAnswer: '125', type: 'calculation' },
    { id: 3, text: 'What is fifteen percent of four hundred?', expectedAnswer: '60', type: 'calculation' },
    { id: 4, text: 'What is negative twelve divided by negative three?', expectedAnswer: '4', type: 'calculation' },
    { id: 5, text: 'Convert three eighth into decimal', expectedAnswer: '0.375', type: 'number' },
    { id: 6, text: 'What is the absolute value of negative seventeen?', expectedAnswer: '17', type: 'calculation' },
    { id: 7, text: 'What is two point four multiplied by zero point five?', expectedAnswer: '1.2', type: 'calculation' },
    { id: 8, text: 'If y equals three x and x is four, what is y?', expectedAnswer: '12', type: 'calculation' },
  ],

  8: [
    { id: 1, text: 'Solve: three x minus seven equals fourteen', expectedAnswer: '7', type: 'calculation' },
    { id: 2, text: 'What is the square root of one hundred twenty one?', expectedAnswer: '11', type: 'calculation' },
    { id: 3, text: 'What is two power four multiplied by two power three?', expectedAnswer: '128', type: 'calculation' },
    { id: 4, text: 'Calculate: open bracket five plus three close bracket multiplied by open bracket seven minus two close bracket', expectedAnswer: '40', type: 'calculation' },
    { id: 5, text: 'What is one third of ninety?', expectedAnswer: '30', type: 'calculation' },
    { id: 6, text: 'Simplify the fraction twelve by eighteen', expectedAnswer: 'two third', type: 'number' },
    { id: 7, text: 'What is the slope of y equals two x plus five?', expectedAnswer: '2', type: 'calculation' },
    { id: 8, text: 'Solve: x square equals forty nine', expectedAnswer: '7 or -7', type: 'calculation' },
  ],

  9: [
    { id: 1, text: 'Factor: x square plus plus five x plus six', expectedAnswer: '(x+2)(x+3)', type: 'calculation' },
    { id: 2, text: 'What is sine thirty degrees?', expectedAnswer: 'one half', type: 'calculation' },
    { id: 3, text: 'Solve: two x square equals fifty', expectedAnswer: '5 or -5', type: 'calculation' },
    { id: 4, text: 'What is log base ten of one thousand?', expectedAnswer: '3', type: 'calculation' },
    { id: 5, text: 'Find the hypotenuse of a right triangle with sides three and four', expectedAnswer: '5', type: 'calculation' },
    { id: 6, text: 'What is three factorial?', expectedAnswer: '6', type: 'calculation' },
    { id: 7, text: 'Simplify x square raised to power three', expectedAnswer: 'x six', type: 'calculation' },
    { id: 8, text: 'What is cosine sixty degrees?', expectedAnswer: 'one half', type: 'calculation' },
  ],

  10: [
    { id: 1, text: 'Solve: log base two of x equals five', expectedAnswer: '32', type: 'calculation' },
    { id: 2, text: 'What is tangent forty five degrees?', expectedAnswer: '1', type: 'calculation' },
    { id: 3, text: 'Factor x square minus nine', expectedAnswer: '(x+3)(x-3)', type: 'calculation' },
    { id: 4, text: 'What is the derivative of x cube?', expectedAnswer: '3x square', type: 'calculation' },
    { id: 5, text: 'Calculate five factorial divided by three factorial', expectedAnswer: '20', type: 'calculation' },
    { id: 6, text: 'Solve: e power x equals one', expectedAnswer: '0', type: 'calculation' },
    { id: 7, text: 'What is the area of a circle with radius five?', expectedAnswer: 'twenty five pi or seventy eight point five', type: 'calculation' },
    { id: 8, text: 'Simplify natural log of e power four', expectedAnswer: '4', type: 'calculation' },
  ],

  11: [
    { id: 1, text: 'What is the integral of two x?', expectedAnswer: 'x square plus c', type: 'calculation' },
    { id: 2, text: 'Solve sine square x plus cosine square x', expectedAnswer: '1', type: 'calculation' },
    { id: 3, text: 'What is the limit of sine x by x as x approaches zero?', expectedAnswer: '1', type: 'calculation' },
    { id: 4, text: 'Factor x cube minus eight', expectedAnswer: '(x-2)(x square + 2x + 4)', type: 'calculation' },
    { id: 5, text: 'What is the derivative of sine x?', expectedAnswer: 'cos x', type: 'calculation' },
    { id: 6, text: 'Calculate combinations five choose two', expectedAnswer: '10', type: 'calculation' },
    { id: 7, text: 'What is e power i pi plus one?', expectedAnswer: '0', type: 'calculation' },
    { id: 8, text: 'Solve dy by dx equals two x', expectedAnswer: 'x square plus c', type: 'calculation' },
  ],

  12: [
    { id: 1, text: 'What is the integral of one by x?', expectedAnswer: 'ln x plus c', type: 'calculation' },
    { id: 2, text: 'What is the first term of the Taylor series of e power x?', expectedAnswer: '1', type: 'calculation' },
    { id: 3, text: 'Solve second derivative of y equals minus y', expectedAnswer: 'a cos x plus b sin x', type: 'calculation' },
    { id: 4, text: 'What is the determinant of a two by two matrix one two three four?', expectedAnswer: '-2', type: 'calculation' },
    { id: 5, text: 'Evaluate the limit of one plus one by n whole power n as n approaches infinity', expectedAnswer: 'e', type: 'calculation' },
    { id: 6, text: 'What is the divergence of vector field x y z?', expectedAnswer: '3', type: 'calculation' },
    { id: 7, text: 'Evaluate the integral from zero to one of x square dx', expectedAnswer: 'one by three', type: 'calculation' },
    { id: 8, text: 'What is the Laplace transform of one?', expectedAnswer: 'one by s', type: 'calculation' },
  ],
};

// ======================================================
// HELPER: Get questions safely by grade & session type
// ======================================================

export function getQuestionsForGrade(
  grade: number,
  sessionType: 'dyslexia' | 'dyscalculia'
): Question[] {
  const gradeNum = Math.max(1, Math.min(12, grade));
  const questionBank =
    sessionType === 'dyslexia'
      ? dyslexiaQuestionsByGrade
      : dyscalculiaQuestionsByGrade;

  return questionBank[gradeNum] || questionBank[1];
}
