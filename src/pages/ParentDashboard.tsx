import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LogOut, TrendingUp, Calendar, BookOpen, 
  Video, FileText, ExternalLink, Loader2, User,
  Brain, Heart, Home, Gamepad2, Music, Sparkles,
  Clock, Target, Award, HelpCircle, History
} from 'lucide-react';
import swarLogo from '@/assets/swar-logo.png';
import ParentHelp from '@/components/ParentHelp';
import ProgressChart from '@/components/ProgressChart';
import SessionHistory from '@/components/SessionHistory';

interface Student {
  id: string;
  name: string;
  age: number | null;
  grade: string | null;
}

interface Session {
  id: string;
  student_id: string;
  session_type: string;
  status: string;
  overall_score: number | null;
  flagged: boolean | null;
  created_at: string;
  completed_at: string | null;
}

const ParentDashboard = () => {
  const { user, profile, signOut, loading } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [children, setChildren] = useState<Student[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [selectedChildId, setSelectedChildId] = useState<string>('');

  useEffect(() => {
    if (!loading && (!user || profile?.role !== 'parent')) {
      navigate('/auth?role=parent');
    }
  }, [user, profile, loading, navigate]);

  useEffect(() => {
    if (profile?.id) {
      fetchChildren();
    }
  }, [profile?.id]);

  useEffect(() => {
    if (selectedChildId) {
      fetchSessions(selectedChildId);
    }
  }, [selectedChildId]);

  // Set up real-time subscription for sessions
  useEffect(() => {
    if (!selectedChildId) return;

    const channel = supabase
      .channel('parent-sessions')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'assessment_sessions',
          filter: `student_id=eq.${selectedChildId}`,
        },
        (payload) => {
          console.log('Real-time session update:', payload);
          fetchSessions(selectedChildId);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedChildId]);

  const fetchChildren = async () => {
    if (!profile?.id) return;
    
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('parent_id', profile.id);
    
    if (error) {
      console.error('Error fetching children:', error);
      setDataLoading(false);
      return;
    }
    
    if (data && data.length > 0) {
      setChildren(data);
      setSelectedChildId(data[0].id);
    }
    setDataLoading(false);
  };

  const fetchSessions = async (studentId: string) => {
    const { data, error } = await supabase
      .from('assessment_sessions')
      .select('*')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching sessions:', error);
      return;
    }
    
    if (data) {
      setSessions(data);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  // Helper function to get score interpretation
  const getScoreInterpretation = (score: number, type: string): { text: string; variant: 'default' | 'secondary' | 'destructive' } => {
    if (score >= 85) {
      return { text: t('score.excellent'), variant: 'default' };
    } else if (score >= 70) {
      return { text: t('score.good'), variant: 'default' };
    } else if (score >= 55) {
      return { text: t('score.moderate'), variant: 'secondary' };
    } else {
      return { 
        text: type === 'dyslexia' ? t('score.concernDyslexia') : t('score.concernDyscalculia'), 
        variant: 'destructive' 
      };
    }
  };

  const selectedChild = children.find(c => c.id === selectedChildId);
  const completedSessions = sessions.filter(s => s.status === 'completed');
  const latestDyslexiaSession = completedSessions.find(s => s.session_type === 'dyslexia');
  const latestDyscalculiaSession = completedSessions.find(s => s.session_type === 'dyscalculia');

  // Comprehensive learning resources with actual content
  const learningResources = [
    {
      title: 'Understanding Dyslexia - A Parent\'s Guide',
      description: 'Comprehensive guide explaining dyslexia, its signs, and how to support your child. Includes tips for daily activities and communication strategies.',
      type: 'Article',
      icon: Brain,
      content: 'Dyslexia is a neurological learning difference that affects reading, writing, and spelling. It is NOT related to intelligence...',
      link: '/help#dyslexia'
    },
    {
      title: 'Phonics Practice Games',
      description: 'Interactive games to improve reading skills through phonemic awareness, letter-sound relationships, and word building.',
      type: 'Interactive',
      icon: Gamepad2,
      activities: [
        'Rhyming Word Match - Find words that rhyme',
        'Sound Scavenger Hunt - Find objects starting with specific sounds',
        'Syllable Clap - Clap out syllables in words',
        'Letter Sound Bingo - Practice letter-sound associations'
      ],
      link: '#games'
    },
    {
      title: 'Daily Reading Activities',
      description: 'Simple 10-minute activities you can do each day to support your child\'s reading development.',
      type: 'Guide',
      icon: Clock,
      activities: [
        'Read aloud together for 10 minutes daily',
        'Let your child choose books they\'re interested in',
        'Point to words as you read them',
        'Ask questions about the story',
        'Use audiobooks alongside printed books'
      ],
      link: '#daily-reading'
    },
    {
      title: 'Math Visualization Techniques',
      description: 'Visual and hands-on methods to help your child understand numbers and mathematical concepts.',
      type: 'Video',
      icon: Target,
      activities: [
        'Use blocks or beads for counting',
        'Connect math to cooking and recipes',
        'Play board games with dice',
        'Use number lines for addition/subtraction',
        'Count money and make change'
      ],
      link: '#math-visual'
    },
    {
      title: 'Building Confidence at Home',
      description: 'Strategies for supporting your child\'s emotional well-being and self-esteem.',
      type: 'Article',
      icon: Heart,
      tips: [
        'Focus on effort, not just results',
        'Celebrate small victories',
        'Avoid comparisons with siblings',
        'Find activities where your child excels',
        'Talk openly about learning differences'
      ],
      link: '#confidence'
    },
    {
      title: 'Homework Help Strategies',
      description: 'Practical tips for making homework time more productive and less stressful.',
      type: 'Guide',
      icon: Home,
      tips: [
        'Create a consistent homework routine',
        'Break tasks into smaller chunks',
        'Use timers for focused work periods',
        'Take breaks every 15-20 minutes',
        'Reward completion with preferred activities'
      ],
      link: '#homework'
    },
    {
      title: 'Music & Movement for Learning',
      description: 'How music and physical activity can support learning and memory.',
      type: 'Interactive',
      icon: Music,
      activities: [
        'Alphabet songs with actions',
        'Counting songs and rhymes',
        'Movement breaks during study time',
        'Dancing to learn sequences',
        'Rhythmic chanting for memorization'
      ],
      link: '#music'
    },
    {
      title: 'Recommended Apps & Tools',
      description: 'Curated list of apps and tools designed to support children with learning differences.',
      type: 'Resources',
      icon: Sparkles,
      apps: [
        'Voice Dream Reader - Text-to-speech',
        'Learning Ally - Audiobooks',
        'ModMath - Math without writing',
        'Ginger Page - Writing assistant',
        'Starfall - Reading games'
      ],
      link: '#apps'
    }
  ];

  if (loading || dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={swarLogo} alt="SWAR" className="h-10" />
            <div>
              <h1 className="text-xl font-bold">{t('parent.dashboard')}</h1>
              <p className="text-sm text-muted-foreground">{t('dashboard.welcome')}, {profile?.full_name}</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            {t('dashboard.logout')}
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {children.length === 0 ? (
          <Card className="text-center p-8">
            <CardContent>
              <User className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">No Children Linked</h2>
              <p className="text-muted-foreground mb-4">
                Your account is not yet linked to any students. Please ask your child's teacher to link their profile to your account.
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Child Selector (if multiple children) */}
            {children.length > 1 && (
              <div className="mb-6 flex gap-2 flex-wrap">
                {children.map((child) => (
                  <Button
                    key={child.id}
                    variant={selectedChildId === child.id ? 'default' : 'outline'}
                    onClick={() => setSelectedChildId(child.id)}
                  >
                    {child.name}
                  </Button>
                ))}
              </div>
            )}

            {/* Child Overview */}
            {selectedChild && (
              <Card className="mb-8 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                      <User className="h-10 w-10 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold mb-1">{selectedChild.name}</h2>
                      <p className="text-muted-foreground">
                        {selectedChild.grade && `${t('teacher.grade')} ${selectedChild.grade}`} 
                        {selectedChild.age && ` • ${t('teacher.age')} ${selectedChild.age}`}
                      </p>
                      <div className="flex flex-wrap gap-4 mt-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {completedSessions.length > 0 
                              ? `${t('parent.lastSession')}: ${new Date(completedSessions[0].created_at).toLocaleDateString()}`
                              : 'No sessions yet'
                            }
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{completedSessions.length} {t('parent.totalSessions')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList>
                <TabsTrigger value="overview">{t('dashboard.progress')}</TabsTrigger>
                <TabsTrigger value="sessions">{t('dashboard.sessions')}</TabsTrigger>
                <TabsTrigger value="history" className="flex items-center gap-2">
                  <History className="h-4 w-4" />
                  History
                </TabsTrigger>
                <TabsTrigger value="resources">{t('dashboard.resources')}</TabsTrigger>
                <TabsTrigger value="help" className="flex items-center gap-2">
                  <HelpCircle className="h-4 w-4" />
                  Parent Help
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Progress Overview */}
                  <div className="lg:col-span-2 space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="h-5 w-5" />
                          {t('dashboard.progress')}
                        </CardTitle>
                        <CardDescription>{t('parent.childProgress')}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="font-medium">{t('teacher.dyslexiaAssessment')}</span>
                            <span className="text-muted-foreground">
                              {latestDyslexiaSession?.overall_score ?? '-'}%
                            </span>
                          </div>
                          <Progress value={latestDyslexiaSession?.overall_score ?? 0} className="h-3" />
                          {latestDyslexiaSession && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {getScoreInterpretation(latestDyslexiaSession.overall_score || 0, 'dyslexia').text}
                            </p>
                          )}
                        </div>
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="font-medium">{t('teacher.dyscalculiaAssessment')}</span>
                            <span className="text-muted-foreground">
                              {latestDyscalculiaSession?.overall_score ?? '-'}%
                            </span>
                          </div>
                          <Progress value={latestDyscalculiaSession?.overall_score ?? 0} className="h-3" />
                          {latestDyscalculiaSession && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {getScoreInterpretation(latestDyscalculiaSession.overall_score || 0, 'dyscalculia').text}
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Progress Chart */}
                    {completedSessions.length > 0 && selectedChild && (
                      <ProgressChart 
                        studentName={selectedChild.name}
                        sessions={completedSessions.map(s => ({
                          id: s.id,
                          date: s.created_at,
                          score: s.overall_score || 0,
                          sessionType: s.session_type,
                        }))}
                      />
                    )}
                  </div>

                  {/* Quick Stats */}
                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Award className="h-5 w-5 text-chart-4" />
                          Quick Stats
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Total Sessions</span>
                          <span className="font-bold">{completedSessions.length}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Dyslexia Tests</span>
                          <span className="font-bold">
                            {completedSessions.filter(s => s.session_type === 'dyslexia').length}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Dyscalculia Tests</span>
                          <span className="font-bold">
                            {completedSessions.filter(s => s.session_type === 'dyscalculia').length}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Average Score</span>
                          <span className="font-bold">
                            {completedSessions.length > 0
                              ? Math.round(completedSessions.reduce((acc, s) => acc + (s.overall_score || 0), 0) / completedSessions.length)
                              : '-'
                            }%
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="sessions">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('dashboard.sessions')}</CardTitle>
                    <CardDescription>{t('teacher.recentSessions')}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {sessions.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">
                        No sessions yet. Sessions will appear here after your child's teacher conducts assessments.
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {sessions.map((session) => {
                          const interpretation = session.overall_score 
                            ? getScoreInterpretation(session.overall_score, session.session_type)
                            : null;
                          return (
                            <div 
                              key={session.id}
                              className="flex items-center justify-between p-4 rounded-lg border border-border"
                            >
                              <div>
                                <p className="font-medium capitalize">{session.session_type} {t('session.assessment')}</p>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(session.created_at).toLocaleDateString()}
                                </p>
                                {interpretation && (
                                  <p className={`text-xs mt-1 ${interpretation.variant === 'destructive' ? 'text-destructive' : 'text-muted-foreground'}`}>
                                    {interpretation.text}
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center gap-4">
                                <Badge variant={session.status === 'completed' ? 'default' : 'secondary'}>
                                  {session.status}
                                </Badge>
                                {session.overall_score !== null && (
                                  <span className="text-lg font-semibold">{session.overall_score}%</span>
                                )}
                                {session.flagged && (
                                  <Badge variant="destructive">Flagged</Badge>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history">
                <SessionHistory 
                  sessions={sessions}
                  viewType="parent"
                />
              </TabsContent>

              <TabsContent value="resources">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      {t('dashboard.resources')}
                    </CardTitle>
                    <CardDescription>{t('parent.helpChild')}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {learningResources.map((resource, idx) => (
                        <Card key={idx} className="hover:border-primary/50 transition-colors">
                          <CardHeader className="pb-2">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                <resource.icon className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <CardTitle className="text-base">{resource.title}</CardTitle>
                                <Badge variant="outline" className="mt-1 text-xs">
                                  {resource.type}
                                </Badge>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground mb-3">{resource.description}</p>
                            
                            {resource.activities && (
                              <div className="mt-2">
                                <p className="text-xs font-semibold text-primary mb-1">Try These Activities:</p>
                                <ul className="text-xs text-muted-foreground space-y-1">
                                  {resource.activities.slice(0, 3).map((activity, aIdx) => (
                                    <li key={aIdx} className="flex items-start gap-1">
                                      <span className="text-primary">•</span>
                                      {activity}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            
                            {resource.tips && (
                              <div className="mt-2">
                                <p className="text-xs font-semibold text-primary mb-1">Quick Tips:</p>
                                <ul className="text-xs text-muted-foreground space-y-1">
                                  {resource.tips.slice(0, 3).map((tip, tIdx) => (
                                    <li key={tIdx} className="flex items-start gap-1">
                                      <span className="text-primary">•</span>
                                      {tip}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            
                            {resource.apps && (
                              <div className="mt-2">
                                <p className="text-xs font-semibold text-primary mb-1">Recommended Apps:</p>
                                <ul className="text-xs text-muted-foreground space-y-1">
                                  {resource.apps.slice(0, 3).map((app, appIdx) => (
                                    <li key={appIdx} className="flex items-start gap-1">
                                      <span className="text-primary">•</span>
                                      {app}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="help">
                <ParentHelp />
              </TabsContent>
            </Tabs>
          </>
        )}
      </main>
    </div>
  );
};

export default ParentDashboard;