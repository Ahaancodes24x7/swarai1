import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  FileText, Calendar, Clock, CheckCircle, AlertTriangle, 
  Download, TrendingUp, Brain, Calculator
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface SessionData {
  id: string;
  student_id: string;
  session_type: string;
  status: string;
  overall_score: number | null;
  flagged: boolean | null;
  created_at: string;
  completed_at?: string | null;
  notes?: string | null;
  studentName?: string;
  studentGrade?: number;
}

interface SessionHistoryProps {
  sessions: SessionData[];
  viewType: 'teacher' | 'parent';
  onExportPDF?: (session: SessionData) => void;
}

const SessionHistory = ({ sessions, viewType, onExportPDF }: SessionHistoryProps) => {
  const { t } = useLanguage();

  const getScoreColor = (score: number | null): string => {
    if (score === null) return 'text-muted-foreground';
    if (score >= 85) return 'text-chart-3';
    if (score >= 70) return 'text-chart-2';
    if (score >= 55) return 'text-chart-4';
    return 'text-destructive';
  };

  const getScoreInterpretation = (score: number | null, type: string): string => {
    if (score === null) return 'Pending';
    if (score >= 85) return 'Excellent - No concerns detected';
    if (score >= 70) return 'Good - Minor areas for practice';
    if (score >= 55) return 'Moderate - Some support recommended';
    return `Flagged - ${type === 'dyslexia' ? 'Dyslexia' : 'Dyscalculia'} indicators present`;
  };

  const getRecommendations = (score: number | null, type: string): string[] => {
    if (score === null) return [];
    if (score >= 85) {
      return [
        'Continue current learning practices',
        'Encourage reading for pleasure',
        'Challenge with age-appropriate materials'
      ];
    }
    if (score >= 70) {
      return type === 'dyslexia' ? [
        'Practice phonics games 10-15 min daily',
        'Use audiobooks alongside printed books',
        'Play rhyming and word games'
      ] : [
        'Use manipulatives for math concepts',
        'Practice number facts through games',
        'Connect math to real-life situations'
      ];
    }
    if (score >= 55) {
      return type === 'dyslexia' ? [
        'Consider structured literacy intervention',
        'Request classroom accommodations',
        'Read aloud together daily',
        'Use multi-sensory learning techniques'
      ] : [
        'Use visual aids and number lines',
        'Break math problems into steps',
        'Allow calculator for complex calculations',
        'Consider tutoring support'
      ];
    }
    return type === 'dyslexia' ? [
      'Strongly recommend professional evaluation',
      'Request formal accommodations at school',
      'Implement intensive reading intervention',
      'Connect with a reading specialist',
      'Explore assistive technology options'
    ] : [
      'Strongly recommend professional evaluation',
      'Request formal math accommodations',
      'Use hands-on manipulatives consistently',
      'Consider specialized math tutoring',
      'Explore assistive technology for math'
    ];
  };

  const groupSessionsByMonth = (sessions: SessionData[]) => {
    const grouped: { [key: string]: SessionData[] } = {};
    sessions.forEach(session => {
      const date = new Date(session.created_at);
      const key = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(session);
    });
    return grouped;
  };

  const groupedSessions = groupSessionsByMonth(sessions);

  if (sessions.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No session history available yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Detailed Session History
        </CardTitle>
        <CardDescription>
          {viewType === 'teacher' 
            ? 'Complete record of all assessment sessions with recommendations' 
            : 'Your child\'s assessment history and progress'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {Object.entries(groupedSessions).map(([month, monthSessions]) => (
            <AccordionItem key={month} value={month}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{month}</span>
                  <Badge variant="secondary">{monthSessions.length} sessions</Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-2">
                  {monthSessions.map((session) => {
                    const recommendations = getRecommendations(session.overall_score, session.session_type);
                    return (
                      <div 
                        key={session.id}
                        className="border rounded-lg p-4 space-y-3"
                      >
                        {/* Session Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              session.flagged ? 'bg-destructive/10' : 'bg-primary/10'
                            }`}>
                              {session.session_type === 'dyslexia' 
                                ? <Brain className={`h-5 w-5 ${session.flagged ? 'text-destructive' : 'text-primary'}`} />
                                : <Calculator className={`h-5 w-5 ${session.flagged ? 'text-destructive' : 'text-primary'}`} />
                              }
                            </div>
                            <div>
                              {session.studentName && viewType === 'teacher' && (
                                <p className="font-medium">{session.studentName}</p>
                              )}
                              <p className="text-sm text-muted-foreground capitalize">
                                {session.session_type} Assessment
                              </p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                <Clock className="h-3 w-3" />
                                {new Date(session.created_at).toLocaleDateString()} at {new Date(session.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {session.overall_score !== null && (
                              <span className={`text-2xl font-bold ${getScoreColor(session.overall_score)}`}>
                                {session.overall_score}%
                              </span>
                            )}
                            <Badge variant={session.status === 'completed' ? 'default' : 'secondary'}>
                              {session.status}
                            </Badge>
                            {session.flagged && (
                              <Badge variant="destructive">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Flagged
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Interpretation */}
                        {session.status === 'completed' && (
                          <div className="bg-muted/50 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-2">
                              {session.flagged ? (
                                <AlertTriangle className="h-4 w-4 text-destructive" />
                              ) : (
                                <CheckCircle className="h-4 w-4 text-chart-3" />
                              )}
                              <span className="font-medium text-sm">
                                {getScoreInterpretation(session.overall_score, session.session_type)}
                              </span>
                            </div>
                            
                            {/* Grade Level Info for Teachers */}
                            {viewType === 'teacher' && session.studentGrade && (
                              <p className="text-xs text-muted-foreground mb-2">
                                Grade Level: {session.studentGrade}
                              </p>
                            )}
                          </div>
                        )}

                        {/* Recommendations */}
                        {session.status === 'completed' && recommendations.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-sm font-medium flex items-center gap-2">
                              <TrendingUp className="h-4 w-4 text-primary" />
                              {viewType === 'teacher' ? 'Recommendations for Support:' : 'What You Can Do at Home:'}
                            </p>
                            <ul className="space-y-1 ml-6">
                              {recommendations.map((rec, idx) => (
                                <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                                  <span className="text-primary mt-1">•</span>
                                  {rec}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Notes (Teacher View) */}
                        {viewType === 'teacher' && session.notes && (
                          <div className="border-t pt-3 mt-3">
                            <p className="text-sm font-medium mb-1">Session Notes:</p>
                            <p className="text-sm text-muted-foreground">{session.notes}</p>
                          </div>
                        )}

                        {/* Export Button */}
                        {viewType === 'teacher' && session.status === 'completed' && onExportPDF && (
                          <div className="flex justify-end pt-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => onExportPDF(session)}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Export PDF
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default SessionHistory;
