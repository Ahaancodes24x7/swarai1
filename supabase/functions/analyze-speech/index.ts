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
  allResponses?: Array<{
    transcript: string;
    expectedAnswer: string;
    questionType: string;
    responseTimeMs?: number;
  }>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const { transcript, expectedAnswer, questionType, sessionType, grade, allResponses } = await req.json() as SpeechAnalysisRequest;

    const systemPrompt = sessionType === 'dyslexia' 
      ? `You are an expert speech-language pathologist specializing in dyslexia assessment. Analyze speech responses for signs of dyslexia.

DYSLEXIA FLAGGING CRITERIA:
1. Phoneme Error Rate (PER): Calculate if >10% errors on reading/naming tasks
2. Phoneme Confusions: Look for consistent confusion between labials (b,p,m), fricatives (s,f,v), stops (t,d,k,g)
3. Syllable Stress Pattern Deviance: Incorrect stress patterns in multi-syllable words
4. Letter Reversals: b/d, p/q confusions
5. Word Substitutions: Replacing words with visually similar ones
6. Omissions/Additions: Missing or extra phonemes

For grade ${grade} students, consider age-appropriate expectations.

Analyze the response and provide:
- phonemeErrorRate: percentage (0-100)
- phonemeConfusions: array of confused phoneme pairs
- syllableStressErrors: boolean
- letterReversals: array of reversed letters
- wordSubstitutions: array of substituted words
- overallAccuracy: percentage (0-100)
- confidence: your confidence in this analysis (0-100)
- detailedAnalysis: brief text explanation
- isFlagged: boolean (true if meets flagging criteria)`
      : `You are an expert in dyscalculia assessment. Analyze numerical/mathematical responses for signs of dyscalculia.

DYSCALCULIA FLAGGING CRITERIA:
1. Transcoding Errors: Confusing number words/digits (21↔12, 6↔9)
2. Place-Value Misunderstanding: Reading "5007" as "five hundred seven" instead of "five thousand seven"
3. Counting Errors: Miscounting, skip-counting errors
4. Operation Confusion: Confusing +, -, ×, ÷
5. Number Sequence Errors: Incorrect ordering or missing numbers
6. Calculation Accuracy: Consistent arithmetic errors
7. Response Latency: Slow responses indicating retrieval difficulties

For grade ${grade} students, consider age-appropriate expectations.

Analyze the response and provide:
- transcodingErrors: array of transcoding mistakes
- placeValueErrors: boolean
- countingAccuracy: percentage (0-100)
- operationConfusion: boolean
- sequenceErrors: array of sequence mistakes
- calculationAccuracy: percentage (0-100)
- overallAccuracy: percentage (0-100)
- confidence: your confidence in this analysis (0-100)
- detailedAnalysis: brief text explanation
- isFlagged: boolean (true if meets flagging criteria)`;

    const userPrompt = allResponses 
      ? `Analyze this complete session with multiple responses:

${allResponses.map((r, i) => `Question ${i + 1}:
- Type: ${r.questionType}
- Expected: "${r.expectedAnswer}"
- Response: "${r.transcript}"
- Response Time: ${r.responseTimeMs ? r.responseTimeMs + 'ms' : 'N/A'}`).join('\n\n')}

Provide a comprehensive session analysis with overall flagging decision.`
      : `Analyze this single response:
- Question Type: ${questionType}
- Expected Answer: "${expectedAnswer}"
- Student's Response: "${transcript}"

Provide analysis in JSON format.`;

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
