import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Mic, MicOff, ArrowRight, ArrowLeft, CheckCircle, AlertTriangle, Loader2, RotateCcw, Download, Brain } from 'lucide-react';
import swarLogo from '@/assets/swar-logo.png';
import { getQuestionsForGrade } from '@/lib/gradeQuestions';
import { getTranslatedQuestions, hasTranslations } from '@/lib/translatedQuestions';
import { downloadPDF } from '@/lib/pdfExport';
import { validateAnswer, validateNumericAnswer } from '@/lib/answerValidation';

interface ResponseData {
  questionId: number;
  questionText: string;
  expectedAnswer: string;
  response: string;
  isCorrect: boolean;
  responseTimeMs: number;
}

interface StudentData {
  id: string;
  name: string;
  grade: number;
  age: number | null;
}

// Language to speech recognition locale mapping
const languageToLocale: Record<Language, string> = {
  en: 'en-IN',
  hi: 'hi-IN',
  pa: 'pa-IN',
  ta: 'ta-IN',
  te: 'te-IN',
};

const Session = () => {
  const [searchParams] = useSearchParams();
  const studentId = searchParams.get('student') || '1';
  const sessionType = searchParams.get('type') as 'dyslexia' | 'dyscalculia' || 'dyslexia';
  const gradeParam = Number.parseInt(searchParams.get('grade') || '3');
  const langParam = (searchParams.get('lang') as Language) || 'en';
  const navigate = useNavigate();
  const { user, profile, loading: authLoading } = useAuth();
  const { t, language } = useLanguage();
  const { toast } = useToast();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [responses, setResponses] = useState<ResponseData[]>([]);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isSavingSession, setIsSavingSession] = useState(false);
  const [student, setStudent] = useState<StudentData | null>(null);
  const [studentLoading, setStudentLoading] = useState(true);

  const recognitionRef = useRef<any>(null);
  
  // Use the language from URL params or context
  const activeLanguage = langParam || language;
  const speechLocale = languageToLocale[activeLanguage];
  
  // Get translated questions if available, otherwise use English
  const translatedQuestions = hasTranslations(gradeParam, activeLanguage) 
    ? getTranslatedQuestions(gradeParam, sessionType, activeLanguage)
    : [];
  const questions = translatedQuestions.length > 0 
    ? translatedQuestions 
    : getQuestionsForGrade(gradeParam, sessionType);
  
  const progress = ((currentQuestion + 1) / questions.length) * 100;


  useEffect(() => {
    if (!authLoading && !user) navigate('/auth?role=teacher');
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchStudent = async () => {
      if (!studentId) {
        setStudentLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('students')
          .select('*')
          .eq('id', studentId)
          .single();
        
        if (error) throw error;
        
        if (data) {
          setStudent({
            id: data.id,
            name: data.name,
            grade: Number.parseInt(data.grade || '1') || gradeParam,
            age: data.age,
          });
        }
      } catch (error) {
        console.error('Error fetching student:', error);
        toast({ 
          title: 'Student not found', 
          description: 'Using session parameters',
          variant: 'destructive' 
        });
      } finally {
        setStudentLoading(false);
      }
    };
    
    fetchStudent();
  }, [studentId, gradeParam]);

  useEffect(() => {
    if ('webkitSpeechRecognition' in globalThis || 'SpeechRecognition' in globalThis) {
      const SpeechRecognition = (globalThis as any).webkitSpeechRecognition || (globalThis as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = speechLocale;
      recognitionRef.current.onresult = (event: any) => setTranscript(event.results[event.results.length - 1][0].transcript);
      recognitionRef.current.onerror = () => setIsRecording(false);
      recognitionRef.current.onend = () => setIsRecording(false);
    }
    return () => { if (recognitionRef.current) recognitionRef.current.abort(); };
  }, [speechLocale]);

  useEffect(() => { setQuestionStartTime(Date.now()); }, [currentQuestion]);

  // Auto-save session state to localStorage
  useEffect(() => {
    if (responses.length > 0 && !sessionComplete) {
      const sessionState = {
        studentId,
        sessionType,
        gradeParam,
        currentQuestion,
        responses,
        timestamp: Date.now()
      };
      localStorage.setItem('swar_session_backup', JSON.stringify(sessionState));
    }
  }, [responses, currentQuestion, sessionComplete]);

  // Warn before leaving if session in progress
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (responses.length > 0 && !sessionComplete) {
        e.preventDefault();
        return '';
      }
    };
    
    globalThis.addEventListener('beforeunload', handleBeforeUnload);
    return () => globalThis.removeEventListener('beforeunload', handleBeforeUnload);
  }, [responses.length, sessionComplete]);

  // Check for saved session on mount
  useEffect(() => {
    const savedSession = localStorage.getItem('swar_session_backup');
    if (savedSession) {
      try {
        const state = JSON.parse(savedSession);
        // Only restore if it's recent (within 2 hours) and same session
        if (Date.now() - state.timestamp < 2 * 60 * 60 * 1000 && 
            state.studentId === studentId && 
            state.sessionType === sessionType) {
          toast({
            title: 'Session recovered',
            description: `Restored progress: ${state.responses.length} questions answered`,
          });
          setResponses(state.responses);
          setCurrentQuestion(state.currentQuestion);
        } else {
          localStorage.removeItem('swar_session_backup');
        }
      } catch (e: unknown) {
        console.error('Error recovering session:', e);
        localStorage.removeItem('swar_session_backup');
      }
    }
  }, []);

  const startRecording = async () => {
    setTranscript('');
    setIsRecording(true);
    if (recognitionRef.current) {
      recognitionRef.current.lang = speechLocale;
      recognitionRef.current.start();
    }
    else { toast({ title: t('session.speechNotAvailable'), variant: 'destructive' }); setIsRecording(false); }
  };

  const stopRecording = () => {
    if (recognitionRef.current) recognitionRef.current.stop();
    setIsRecording(false);
  };

  const submitResponse = () => {
    if (!transcript) { toast({ title: t('session.noResponse'), variant: 'destructive' }); return; }
    const currentQ = questions[currentQuestion];
    const responseTime = Date.now() - questionStartTime;
    
    // Use improved validation
    const validation = sessionType === 'dyscalculia' && currentQ.type === 'calculation'
      ? validateNumericAnswer(transcript, currentQ.expectedAnswer)
      : validateAnswer(transcript, currentQ.expectedAnswer, currentQ.type);
    
    const newResponse: ResponseData = { 
      questionId: currentQ.id, 
      questionText: currentQ.text, 
      expectedAnswer: currentQ.expectedAnswer, 
      response: transcript, 
      isCorrect: validation.isCorrect, 
      responseTimeMs: responseTime 
    };
    
    // Show feedback
    if (validation.confidence < 100) {
      toast({
        title: validation.isCorrect ? 'Correct!' : 'Incorrect',
        description: validation.reason,
        variant: validation.isCorrect ? 'default' : 'destructive'
      });
    }
    
    const newResponses = [...responses, newResponse];
    setResponses(newResponses);
    if (currentQuestion < questions.length - 1) { setCurrentQuestion(currentQuestion + 1); setTranscript(''); }
    else { 
      setSessionComplete(true); 
      localStorage.removeItem('swar_session_backup');
      saveSessionToDatabase(newResponses); 
      runAIAnalysis(newResponses); 
    }
  };

  const saveSessionToDatabase = async (allResponses: ResponseData[], retryCount = 0) => {
    if (!profile?.id || !studentId) return;
    
    setIsSavingSession(true);
    try {
      const score = Math.round((allResponses.filter(r => r.isCorrect).length / questions.length) * 100);
      const flagged = score < 75;
      
      // Create session record
      const { data: sessionData, error: sessionError } = await supabase
        .from('assessment_sessions')
        .insert({
          student_id: studentId,
          teacher_id: profile.id,
          session_type: sessionType,
          status: 'completed',
          overall_score: score,
          flagged: flagged,
          started_at: new Date().toISOString(),
          completed_at: new Date().toISOString(),
        })
        .select()
        .single();
      
      if (sessionError) throw sessionError;
      
      if (sessionData) {
        setSessionId(sessionData.id);
        
        // Save individual responses
        const responsesToInsert = allResponses.map((r, index) => ({
          session_id: sessionData.id,
          question_number: index + 1,
          question_text: r.questionText,
          expected_answer: r.expectedAnswer,
          student_response: r.response,
          is_correct: r.isCorrect,
          response_time_ms: r.responseTimeMs,
        }));
        
        const { error: responsesError } = await supabase
          .from('session_responses')
          .insert(responsesToInsert);
        
        if (responsesError) throw responsesError;
        
        toast({ title: 'Session saved successfully!', variant: 'default' });
      }
    } catch (error: any) {
      console.error('Error saving session:', error);
      
      // Retry up to 2 times
      if (retryCount < 2) {
        toast({ 
          title: `Retrying save (${retryCount + 1}/2)...`, 
          variant: 'default'
        });
        setTimeout(() => saveSessionToDatabase(allResponses, retryCount + 1), 2000);
      } else {
        toast({ 
          title: 'Session saved locally only', 
          description: 'Database save failed but you can still export PDF',
          variant: 'destructive' 
        });
      }
    } finally {
      setIsSavingSession(false);
    }
  };

  const runAIAnalysis = async (allResponses: ResponseData[]) => {
    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-speech', {
        body: { 
          allResponses: allResponses.map(r => ({ 
            transcript: r.response, 
            expectedAnswer: r.expectedAnswer, 
            questionType: questions.find(q => q.id === r.questionId)?.type || 'word', 
            responseTimeMs: r.responseTimeMs 
          })), 
          sessionType, 
          grade: gradeParam,
          language: activeLanguage
        }
      });
      if (error) throw error;
      setAiAnalysis(data);
      
      // Update session with AI analysis results
      if (sessionId && data) {
        await supabase
          .from('assessment_sessions')
          .update({
            phoneme_error_rate: data.phonemeErrorRate,
            flagged: data.isFlagged,
            notes: data.detailedAnalysis,
          })
          .eq('id', sessionId);
      }
    } catch (error) {
      console.error('AI Analysis error:', error);
      toast({ title: 'AI Analysis failed', description: 'Using basic scoring', variant: 'destructive' });
    } finally { setIsAnalyzing(false); }
  };

  const calculateScore = () => Math.round((responses.filter(r => r.isCorrect).length / questions.length) * 100);
  const isFlagged = () => aiAnalysis?.isFlagged ?? calculateScore() < 75;

  const getScoreInterpretation = (score: number): string => {
    if (score >= 85) return t('score.excellent');
    if (score >= 70) return t('score.good');
    if (score >= 55) return t('score.moderate');
    return sessionType === 'dyslexia' ? t('score.concernDyslexia') : t('score.concernDyscalculia');
  };

  const handleExportPDF = () => {
    const score = calculateScore();
    downloadPDF({ 
      studentName: student?.name || 'Unknown', 
      studentGrade: gradeParam, 
      sessionType, 
      date: new Date().toLocaleDateString(), 
      responses, 
      score, 
      isFlagged: isFlagged(), 
      aiAnalysis, 
      teacherName: profile?.full_name || undefined,
      interpretation: getScoreInterpretation(score)
    });
    toast({ title: t('session.pdfGenerated') });
  };

  if (authLoading || studentLoading) return <div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  if (sessionComplete) {
    const score = calculateScore();
    const flagged = isFlagged();
    const interpretation = getScoreInterpretation(score);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl text-center">
          <CardHeader>
            <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${flagged ? 'bg-destructive/10' : 'bg-chart-3/20'}`}>
              {flagged ? <AlertTriangle className="h-10 w-10 text-destructive" /> : <CheckCircle className="h-10 w-10 text-chart-3" />}
            </div>
            <CardTitle className="text-2xl">{t('session.complete')}</CardTitle>
            <CardDescription>
              {sessionType === 'dyslexia' ? t('teacher.dyslexiaAssessment') : t('teacher.dyscalculiaAssessment')} • {t('teacher.grade')} {gradeParam} • {student?.name}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-5xl font-bold text-primary">{score}%</div>
            <p className="text-muted-foreground">{responses.filter(r => r.isCorrect).length} {t('session.of')} {questions.length} {t('session.correct')}</p>
            
            {/* Score Interpretation */}
            <div className={`p-4 rounded-lg ${flagged ? 'bg-destructive/10 text-destructive' : 'bg-chart-3/10 text-chart-3'}`}>
              <p className="font-medium">{interpretation}</p>
            </div>
            
            {isAnalyzing && <div className="flex items-center justify-center gap-2 text-primary"><Brain className="h-5 w-5 animate-pulse" /><span>{t('session.aiAnalyzing')}</span></div>}
            {isSavingSession && <div className="flex items-center justify-center gap-2 text-primary"><Loader2 className="h-5 w-5 animate-spin" /><span>Saving session...</span></div>}
            {aiAnalysis && (
              <div className="p-4 rounded-lg bg-muted text-left">
                <h4 className="font-semibold mb-2 flex items-center gap-2"><Brain className="h-4 w-4" /> {t('session.aiAnalysis')}</h4>
                <p className="text-sm text-muted-foreground">{aiAnalysis.detailedAnalysis}</p>
                {aiAnalysis.phonemeErrorRate !== undefined && <p className="text-sm mt-2">{t('session.phonemeError')}: <span className={aiAnalysis.phonemeErrorRate > 10 ? 'text-destructive' : 'text-chart-3'}>{aiAnalysis.phonemeErrorRate.toFixed(1)}%</span></p>}
              </div>
            )}
            {flagged && <div className="p-4 rounded-lg bg-destructive/10 text-destructive"><p className="font-medium">⚠️ {t('session.flaggedEvaluation')}</p></div>}
            <div className="flex gap-4 justify-center pt-4">
              <Button variant="outline" onClick={() => navigate('/teacher-dashboard')}><ArrowLeft className="h-4 w-4 mr-2" />{t('teacher.dashboard')}</Button>
              <Button variant="outline" onClick={handleExportPDF}><Download className="h-4 w-4 mr-2" />{t('session.exportPDF')}</Button>
              <Button onClick={() => { setCurrentQuestion(0); setResponses([]); setSessionComplete(false); setTranscript(''); setAiAnalysis(null); setSessionId(null); }}><RotateCcw className="h-4 w-4 mr-2" />{t('session.retry')}</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={swarLogo} alt="SWAR" className="h-10" />
            <div>
              <h1 className="text-lg font-bold capitalize">
                {sessionType === 'dyslexia' ? t('teacher.dyslexiaAssessment') : t('teacher.dyscalculiaAssessment')}
              </h1>
              <p className="text-sm text-muted-foreground">{student?.name} • {t('teacher.grade')} {gradeParam}</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => navigate('/teacher-dashboard')}>{t('session.exit')}</Button>
        </div>
      </header>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-4 mb-2">
          <span className="text-sm text-muted-foreground">{t('session.question')} {currentQuestion + 1}/{questions.length}</span>
          <span className="text-sm font-medium">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl mb-4">{questions[currentQuestion].text}</CardTitle>
            <CardDescription className="text-lg capitalize">{questions[currentQuestion].type} {t('session.exercise')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="flex flex-col items-center gap-6">
              <button onClick={isRecording ? stopRecording : startRecording} className={`w-32 h-32 rounded-full flex items-center justify-center transition-all ${isRecording ? 'bg-destructive animate-pulse' : 'bg-primary hover:bg-primary/90'}`}>
                {isRecording ? <MicOff className="h-12 w-12 text-primary-foreground" /> : <Mic className="h-12 w-12 text-primary-foreground" />}
              </button>
              <p className="text-muted-foreground">{isRecording ? t('session.recording') : t('session.clickToStart')}</p>
            </div>
            {transcript && <div className="p-4 rounded-lg bg-muted"><p className="text-sm text-muted-foreground mb-1">{t('session.recordedResponse')}:</p><p className="text-lg font-medium">{transcript}</p></div>}
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => { if (currentQuestion > 0) { setCurrentQuestion(currentQuestion - 1); setTranscript(''); } }} disabled={currentQuestion === 0}><ArrowLeft className="h-4 w-4 mr-2" />{t('session.previous')}</Button>
              <Button onClick={submitResponse} disabled={!transcript}>{currentQuestion === questions.length - 1 ? t('session.finish') : t('session.next')}<ArrowRight className="h-4 w-4 ml-2" /></Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Session;
