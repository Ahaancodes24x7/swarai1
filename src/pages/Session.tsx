import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Mic, MicOff, ArrowRight, ArrowLeft, CheckCircle, AlertTriangle, Loader2, RotateCcw, Download, Brain } from 'lucide-react';
import swarLogo from '@/assets/swar-logo.png';
import { getQuestionsForGrade, Question } from '@/lib/gradeQuestions';
import { downloadPDF } from '@/lib/pdfExport';

interface ResponseData {
  questionId: number;
  questionText: string;
  expectedAnswer: string;
  response: string;
  isCorrect: boolean;
  responseTimeMs: number;
}

const sampleStudents = [
  { id: '1', name: 'Aarav Sharma', grade: 3 },
  { id: '2', name: 'Priya Patel', grade: 4 },
  { id: '3', name: 'Rohan Kumar', grade: 2 },
  { id: '4', name: 'Ananya Singh', grade: 5 },
  { id: '5', name: 'Vikram Reddy', grade: 3 },
];

const Session = () => {
  const [searchParams] = useSearchParams();
  const studentId = searchParams.get('student') || '1';
  const sessionType = searchParams.get('type') as 'dyslexia' | 'dyscalculia' || 'dyslexia';
  const gradeParam = parseInt(searchParams.get('grade') || '3');
  const navigate = useNavigate();
  const { user, profile, loading: authLoading } = useAuth();
  const { toast } = useToast();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [responses, setResponses] = useState<ResponseData[]>([]);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);

  const recognitionRef = useRef<any>(null);
  const questions = getQuestionsForGrade(gradeParam, sessionType);
  const student = sampleStudents.find(s => s.id === studentId);
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  useEffect(() => {
    if (!authLoading && !user) navigate('/auth?role=teacher');
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.onresult = (event: any) => setTranscript(event.results[event.results.length - 1][0].transcript);
      recognitionRef.current.onerror = () => setIsRecording(false);
      recognitionRef.current.onend = () => setIsRecording(false);
    }
    return () => { if (recognitionRef.current) recognitionRef.current.abort(); };
  }, []);

  useEffect(() => { setQuestionStartTime(Date.now()); }, [currentQuestion]);

  const startRecording = async () => {
    setTranscript('');
    setIsRecording(true);
    if (recognitionRef.current) recognitionRef.current.start();
    else { toast({ title: 'Speech Recognition Not Available', variant: 'destructive' }); setIsRecording(false); }
  };

  const stopRecording = () => {
    if (recognitionRef.current) recognitionRef.current.stop();
    setIsRecording(false);
  };

  const submitResponse = () => {
    if (!transcript) { toast({ title: 'No Response Recorded', variant: 'destructive' }); return; }
    const currentQ = questions[currentQuestion];
    const responseTime = Date.now() - questionStartTime;
    const isCorrect = transcript.toLowerCase().includes(currentQ.expectedAnswer.toLowerCase().split(' ')[0]);
    const newResponse: ResponseData = { questionId: currentQ.id, questionText: currentQ.text, expectedAnswer: currentQ.expectedAnswer, response: transcript, isCorrect, responseTimeMs: responseTime };
    const newResponses = [...responses, newResponse];
    setResponses(newResponses);
    if (currentQuestion < questions.length - 1) { setCurrentQuestion(currentQuestion + 1); setTranscript(''); }
    else { setSessionComplete(true); runAIAnalysis(newResponses); }
  };

  const runAIAnalysis = async (allResponses: ResponseData[]) => {
    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-speech', {
        body: { allResponses: allResponses.map(r => ({ transcript: r.response, expectedAnswer: r.expectedAnswer, questionType: questions.find(q => q.id === r.questionId)?.type || 'word', responseTimeMs: r.responseTimeMs })), sessionType, grade: gradeParam }
      });
      if (error) throw error;
      setAiAnalysis(data);
    } catch (error) {
      console.error('AI Analysis error:', error);
      toast({ title: 'AI Analysis failed', description: 'Using basic scoring', variant: 'destructive' });
    } finally { setIsAnalyzing(false); }
  };

  const calculateScore = () => Math.round((responses.filter(r => r.isCorrect).length / questions.length) * 100);
  const isFlagged = () => aiAnalysis?.isFlagged ?? calculateScore() < 75;

  const handleExportPDF = () => {
    downloadPDF({ studentName: student?.name || 'Unknown', studentGrade: gradeParam, sessionType, date: new Date().toLocaleDateString(), responses, score: calculateScore(), isFlagged: isFlagged(), aiAnalysis, teacherName: profile?.full_name || undefined });
    toast({ title: 'PDF Report Generated' });
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  if (sessionComplete) {
    const score = calculateScore();
    const flagged = isFlagged();
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl text-center">
          <CardHeader>
            <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${flagged ? 'bg-destructive/10' : 'bg-chart-3/20'}`}>
              {flagged ? <AlertTriangle className="h-10 w-10 text-destructive" /> : <CheckCircle className="h-10 w-10 text-chart-3" />}
            </div>
            <CardTitle className="text-2xl">Session Complete</CardTitle>
            <CardDescription>{sessionType === 'dyslexia' ? 'Dyslexia' : 'Dyscalculia'} Assessment • Grade {gradeParam} • {student?.name}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-5xl font-bold text-primary">{score}%</div>
            <p className="text-muted-foreground">{responses.filter(r => r.isCorrect).length} of {questions.length} correct</p>
            {isAnalyzing && <div className="flex items-center justify-center gap-2 text-primary"><Brain className="h-5 w-5 animate-pulse" /><span>AI analyzing speech patterns...</span></div>}
            {aiAnalysis && (
              <div className="p-4 rounded-lg bg-muted text-left">
                <h4 className="font-semibold mb-2 flex items-center gap-2"><Brain className="h-4 w-4" /> AI Analysis</h4>
                <p className="text-sm text-muted-foreground">{aiAnalysis.detailedAnalysis}</p>
                {aiAnalysis.phonemeErrorRate !== undefined && <p className="text-sm mt-2">Phoneme Error Rate: <span className={aiAnalysis.phonemeErrorRate > 10 ? 'text-destructive' : 'text-chart-3'}>{aiAnalysis.phonemeErrorRate.toFixed(1)}%</span></p>}
              </div>
            )}
            {flagged && <div className="p-4 rounded-lg bg-destructive/10 text-destructive"><p className="font-medium">⚠️ Flagged for further evaluation</p></div>}
            <div className="flex gap-4 justify-center pt-4">
              <Button variant="outline" onClick={() => navigate('/teacher-dashboard')}><ArrowLeft className="h-4 w-4 mr-2" />Dashboard</Button>
              <Button variant="outline" onClick={handleExportPDF}><Download className="h-4 w-4 mr-2" />Export PDF</Button>
              <Button onClick={() => { setCurrentQuestion(0); setResponses([]); setSessionComplete(false); setTranscript(''); setAiAnalysis(null); }}><RotateCcw className="h-4 w-4 mr-2" />Retry</Button>
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
            <div><h1 className="text-lg font-bold capitalize">{sessionType} Assessment</h1><p className="text-sm text-muted-foreground">{student?.name} • Grade {gradeParam}</p></div>
          </div>
          <Button variant="outline" onClick={() => navigate('/teacher-dashboard')}>Exit</Button>
        </div>
      </header>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-4 mb-2"><span className="text-sm text-muted-foreground">Question {currentQuestion + 1}/{questions.length}</span><span className="text-sm font-medium">{Math.round(progress)}%</span></div>
        <Progress value={progress} className="h-2" />
      </div>
      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl mb-4">{questions[currentQuestion].text}</CardTitle>
            <CardDescription className="text-lg capitalize">{questions[currentQuestion].type} exercise</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="flex flex-col items-center gap-6">
              <button onClick={isRecording ? stopRecording : startRecording} className={`w-32 h-32 rounded-full flex items-center justify-center transition-all ${isRecording ? 'bg-destructive animate-pulse' : 'bg-primary hover:bg-primary/90'}`}>
                {isRecording ? <MicOff className="h-12 w-12 text-primary-foreground" /> : <Mic className="h-12 w-12 text-primary-foreground" />}
              </button>
              <p className="text-muted-foreground">{isRecording ? 'Recording... Click to stop' : 'Click to start recording'}</p>
            </div>
            {transcript && <div className="p-4 rounded-lg bg-muted"><p className="text-sm text-muted-foreground mb-1">Recorded Response:</p><p className="text-lg font-medium">{transcript}</p></div>}
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => { if (currentQuestion > 0) { setCurrentQuestion(currentQuestion - 1); setTranscript(''); } }} disabled={currentQuestion === 0}><ArrowLeft className="h-4 w-4 mr-2" />Previous</Button>
              <Button onClick={submitResponse} disabled={!transcript}>{currentQuestion === questions.length - 1 ? 'Finish' : 'Next'}<ArrowRight className="h-4 w-4 ml-2" /></Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Session;