import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  Mic, MicOff, ArrowRight, ArrowLeft, CheckCircle, 
  AlertTriangle, Loader2, Volume2, RotateCcw
} from 'lucide-react';
import swarLogo from '@/assets/swar-logo.png';

interface Question {
  id: number;
  text: string;
  expectedAnswer: string;
  audioPrompt?: string;
  type: 'phoneme' | 'word' | 'sentence' | 'number' | 'calculation';
}

const dyslexiaQuestions: Question[] = [
  { id: 1, text: 'Please say the word: "APPLE"', expectedAnswer: 'apple', type: 'word' },
  { id: 2, text: 'Please say the word: "BUTTERFLY"', expectedAnswer: 'butterfly', type: 'word' },
  { id: 3, text: 'Say the sounds in "CAT" (C-A-T)', expectedAnswer: 'c a t', type: 'phoneme' },
  { id: 4, text: 'Read this sentence: "The quick brown fox jumps"', expectedAnswer: 'the quick brown fox jumps', type: 'sentence' },
  { id: 5, text: 'Please say the word: "ELEPHANT"', expectedAnswer: 'elephant', type: 'word' },
  { id: 6, text: 'Say these letters: B, D, P, Q', expectedAnswer: 'b d p q', type: 'phoneme' },
  { id: 7, text: 'What rhymes with "CAT"?', expectedAnswer: 'bat hat mat sat', type: 'phoneme' },
  { id: 8, text: 'Please say: "CHOCOLATE"', expectedAnswer: 'chocolate', type: 'word' },
];

const dyscalculiaQuestions: Question[] = [
  { id: 1, text: 'Count from 1 to 10', expectedAnswer: '1 2 3 4 5 6 7 8 9 10', type: 'number' },
  { id: 2, text: 'What is 5 + 3?', expectedAnswer: '8', type: 'calculation' },
  { id: 3, text: 'What is 10 - 4?', expectedAnswer: '6', type: 'calculation' },
  { id: 4, text: 'Count backwards from 10 to 1', expectedAnswer: '10 9 8 7 6 5 4 3 2 1', type: 'number' },
  { id: 5, text: 'What is 2 × 3?', expectedAnswer: '6', type: 'calculation' },
  { id: 6, text: 'What number comes after 15?', expectedAnswer: '16', type: 'number' },
  { id: 7, text: 'What is 12 ÷ 4?', expectedAnswer: '3', type: 'calculation' },
  { id: 8, text: 'Skip count by 2s: 2, 4, 6...', expectedAnswer: '2 4 6 8 10', type: 'number' },
];

const sampleStudents = [
  { id: '1', name: 'Aarav Sharma' },
  { id: '2', name: 'Priya Patel' },
  { id: '3', name: 'Rohan Kumar' },
  { id: '4', name: 'Ananya Singh' },
  { id: '5', name: 'Vikram Reddy' },
];

const Session = () => {
  const [searchParams] = useSearchParams();
  const studentId = searchParams.get('student') || '1';
  const sessionType = searchParams.get('type') as 'dyslexia' | 'dyscalculia' || 'dyslexia';
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [responses, setResponses] = useState<{ questionId: number; response: string; isCorrect: boolean }[]>([]);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [transcript, setTranscript] = useState('');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recognitionRef = useRef<any>(null);

  const questions = sessionType === 'dyslexia' ? dyslexiaQuestions : dyscalculiaQuestions;
  const student = sampleStudents.find(s => s.id === studentId);
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth?role=teacher');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const result = event.results[event.results.length - 1];
        setTranscript(result[0].transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      setTranscript('');
      setIsRecording(true);

      if (recognitionRef.current) {
        recognitionRef.current.start();
      } else {
        toast({
          title: 'Speech Recognition Not Available',
          description: 'Your browser does not support speech recognition. Please use Chrome.',
          variant: 'destructive',
        });
        setIsRecording(false);
      }
    } catch (error) {
      console.error('Recording error:', error);
      toast({
        title: 'Microphone Error',
        description: 'Unable to access microphone. Please check permissions.',
        variant: 'destructive',
      });
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  const submitResponse = () => {
    if (!transcript) {
      toast({
        title: 'No Response Recorded',
        description: 'Please record your response first.',
        variant: 'destructive',
      });
      return;
    }

    const currentQ = questions[currentQuestion];
    const isCorrect = transcript.toLowerCase().includes(currentQ.expectedAnswer.toLowerCase().split(' ')[0]);

    setResponses([...responses, {
      questionId: currentQ.id,
      response: transcript,
      isCorrect,
    }]);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setTranscript('');
    } else {
      setSessionComplete(true);
    }
  };

  const calculateScore = () => {
    const correct = responses.filter(r => r.isCorrect).length;
    return Math.round((correct / questions.length) * 100);
  };

  const isFlagged = () => {
    const score = calculateScore();
    return score < 75;
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (sessionComplete) {
    const score = calculateScore();
    const flagged = isFlagged();

    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 flex items-center justify-center p-4">
        <Card className="w-full max-w-lg text-center">
          <CardHeader>
            <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${
              flagged ? 'bg-destructive/10' : 'bg-chart-3/20'
            }`}>
              {flagged ? (
                <AlertTriangle className="h-10 w-10 text-destructive" />
              ) : (
                <CheckCircle className="h-10 w-10 text-chart-3" />
              )}
            </div>
            <CardTitle className="text-2xl">Session Complete</CardTitle>
            <CardDescription>
              {sessionType === 'dyslexia' ? 'Dyslexia' : 'Dyscalculia'} Assessment for {student?.name}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-5xl font-bold text-primary">{score}%</div>
            <p className="text-muted-foreground">
              {responses.filter(r => r.isCorrect).length} of {questions.length} correct responses
            </p>
            
            {flagged && (
              <div className="p-4 rounded-lg bg-destructive/10 text-destructive">
                <p className="font-medium">⚠️ This student has been flagged for further evaluation</p>
                <p className="text-sm mt-1">Score falls below the 75th percentile threshold</p>
              </div>
            )}

            <div className="flex gap-4 justify-center pt-4">
              <Button variant="outline" onClick={() => navigate('/teacher-dashboard')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <Button onClick={() => {
                setCurrentQuestion(0);
                setResponses([]);
                setSessionComplete(false);
                setTranscript('');
              }}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Retry Assessment
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={swarLogo} alt="SWAR" className="h-10" />
            <div>
              <h1 className="text-lg font-bold capitalize">{sessionType} Assessment</h1>
              <p className="text-sm text-muted-foreground">Student: {student?.name}</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => navigate('/teacher-dashboard')}>
            Exit Session
          </Button>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-4 mb-2">
          <span className="text-sm text-muted-foreground">Question {currentQuestion + 1} of {questions.length}</span>
          <span className="text-sm font-medium">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question Card */}
      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl mb-4">{questions[currentQuestion].text}</CardTitle>
            <CardDescription className="text-lg capitalize">
              {questions[currentQuestion].type} exercise
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Recording Section */}
            <div className="flex flex-col items-center gap-6">
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`w-32 h-32 rounded-full flex items-center justify-center transition-all ${
                  isRecording 
                    ? 'bg-destructive animate-pulse' 
                    : 'bg-primary hover:bg-primary/90'
                }`}
              >
                {isRecording ? (
                  <MicOff className="h-12 w-12 text-primary-foreground" />
                ) : (
                  <Mic className="h-12 w-12 text-primary-foreground" />
                )}
              </button>
              <p className="text-muted-foreground">
                {isRecording ? 'Recording... Click to stop' : 'Click to start recording'}
              </p>
            </div>

            {/* Transcript Display */}
            {transcript && (
              <div className="p-4 rounded-lg bg-muted">
                <p className="text-sm text-muted-foreground mb-1">Recorded Response:</p>
                <p className="text-lg font-medium">{transcript}</p>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  if (currentQuestion > 0) {
                    setCurrentQuestion(currentQuestion - 1);
                    setTranscript('');
                  }
                }}
                disabled={currentQuestion === 0}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              <Button onClick={submitResponse} disabled={!transcript}>
                {currentQuestion === questions.length - 1 ? 'Finish' : 'Next'}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Session;
