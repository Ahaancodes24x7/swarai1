import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SpeechAnalysisRequest {
  transcript: string;
  expectedAnswer: string;
  questionType: 'phoneme' | 'word' | 'sentence' | 'number' | 'calculation';
  sessionType: 'dyslexia' | 'dyscalculia';
  grade: number;
  language?: string;
  allResponses?: Array<{
    transcript: string;
    expectedAnswer: string;
    questionType: string;
    responseTimeMs?: number;
  }>;
}

// Language names for AI prompts
const languageNames: Record<string, string> = {
  en: 'English',
  hi: 'Hindi',
  pa: 'Punjabi',
  ta: 'Tamil',
  te: 'Telugu',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const { transcript, expectedAnswer, questionType, sessionType, grade, language = 'en', allResponses } = await req.json() as SpeechAnalysisRequest;

    const languageName = languageNames[language] || 'English';

    const systemPrompt = sessionType === 'dyslexia' 
      ? `You are an expert speech-language pathologist specializing in dyslexia assessment for ${languageName}-speaking children in India.

IMPORTANT: The student is responding in ${languageName}. Analyze their responses considering:
- ${languageName}-specific phonological patterns
- Common pronunciation variations in Indian ${languageName}
- Regional accent differences are NOT indicators of dyslexia

DYSLEXIA FLAGGING CRITERIA (DSM-5 compliant):
1. Phoneme Error Rate (PER): Calculate if >10% errors on reading/naming tasks
2. Phoneme Confusions: Look for consistent confusion between similar sounds in ${languageName}
3. Syllable Stress Pattern Deviance: Incorrect stress patterns
4. Letter/Character Reversals: Common reversals for the script
5. Word Substitutions: Replacing words with similar ones
6. Omissions/Additions: Missing or extra phonemes

For grade ${grade} students, consider age-appropriate expectations for ${languageName} literacy.

Provide analysis in JSON with:
- phonemeErrorRate: percentage (0-100)
- phonemeConfusions: array of confused sound pairs
- syllableStressErrors: boolean
- overallAccuracy: percentage (0-100)
- confidence: your confidence in this analysis (0-100)
- detailedAnalysis: brief text explanation in ${languageName} AND English
- isFlagged: boolean (true if meets flagging criteria)
- recommendedActions: array of suggested next steps`
      : `You are an expert in dyscalculia assessment for ${languageName}-speaking children in India.

IMPORTANT: The student is responding in ${languageName}. Analyze their numerical responses considering:
- ${languageName} number naming conventions
- How numbers are spoken in ${languageName}
- Regional variations in mathematical terminology

DYSCALCULIA FLAGGING CRITERIA (DSM-5 compliant):
1. Transcoding Errors: Confusing number words/digits
2. Place-Value Misunderstanding: Errors in reading multi-digit numbers
3. Counting Errors: Miscounting, skip-counting errors
4. Operation Confusion: Confusing mathematical operations
5. Number Sequence Errors: Incorrect ordering
6. Calculation Accuracy: Consistent arithmetic errors
7. Response Latency: Slow responses indicating retrieval difficulties

For grade ${grade} students, consider age-appropriate mathematical expectations.

Provide analysis in JSON with:
- transcodingErrors: array of transcoding mistakes
- placeValueErrors: boolean
- countingAccuracy: percentage (0-100)
- operationConfusion: boolean
- calculationAccuracy: percentage (0-100)
- overallAccuracy: percentage (0-100)
- confidence: your confidence in this analysis (0-100)
- detailedAnalysis: brief text explanation in ${languageName} AND English
- isFlagged: boolean (true if meets flagging criteria)
- recommendedActions: array of suggested next steps`;

    const userPrompt = allResponses 
      ? `Analyze this complete ${sessionType} assessment session for a Grade ${grade} student responding in ${languageName}:

${allResponses.map((r, i) => `Question ${i + 1}:
- Type: ${r.questionType}
- Expected: "${r.expectedAnswer}"
- Student's Response: "${r.transcript}"
- Response Time: ${r.responseTimeMs ? r.responseTimeMs + 'ms' : 'N/A'}`).join('\n\n')}

Provide a comprehensive session analysis with:
1. Overall performance summary
2. Specific error patterns identified
3. Whether the student should be flagged for further evaluation
4. Recommended next steps for teachers/parents
5. Provide the detailed analysis in both ${languageName} and English for parent communication`
      : `Analyze this single response from a Grade ${grade} ${languageName}-speaking student:
- Question Type: ${questionType}
- Expected Answer: "${expectedAnswer}"
- Student's Response: "${transcript}"

Provide analysis in JSON format.`;

    console.log(`Analyzing speech for ${languageName} speaker, grade ${grade}, session type: ${sessionType}`);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required, please add funds to your workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const analysisContent = data.choices?.[0]?.message?.content;
    
    let analysis;
    try {
      analysis = JSON.parse(analysisContent);
    } catch {
      analysis = { 
        overallAccuracy: 0, 
        isFlagged: true, 
        detailedAnalysis: analysisContent,
        error: "Could not parse structured response"
      };
    }

    console.log("Analysis complete:", JSON.stringify(analysis).slice(0, 200));

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Speech analysis error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error",
      isFlagged: false,
      overallAccuracy: 0
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
