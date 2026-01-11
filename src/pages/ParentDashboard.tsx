import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  LogOut, TrendingUp, Calendar, BookOpen, 
  Video, FileText, ExternalLink, Loader2, User
} from 'lucide-react';
import swarLogo from '@/assets/swar-logo.png';

// Sample data
const childData = {
  name: 'Aarav Sharma',
  age: 8,
  grade: '3rd',
  totalSessions: 12,
  lastSession: '2026-01-10',
  dyslexiaProgress: 72,
  dyscalculiaProgress: 85,
};

const sessionHistory = [
  { id: '1', date: '2026-01-10', type: 'Dyslexia', score: 72, status: 'Flagged' },
  { id: '2', date: '2026-01-08', type: 'Dyscalculia', score: 85, status: 'Normal' },
  { id: '3', date: '2026-01-05', type: 'Dyslexia', score: 68, status: 'Flagged' },
  { id: '4', date: '2026-01-03', type: 'Dyscalculia', score: 78, status: 'Moderate' },
];

const learningResources = [
  {
    title: 'Understanding Dyslexia',
    description: 'A comprehensive guide for parents',
    type: 'Article',
    link: '#',
  },
  {
    title: 'Phonics Practice Games',
    description: 'Interactive games to improve reading',
    type: 'Interactive',
    link: '#',
  },
  {
    title: 'Supporting Your Child at Home',
    description: 'Video series with expert tips',
    type: 'Video',
    link: '#',
  },
  {
    title: 'Math Visualization Techniques',
    description: 'Help your child understand numbers',
    type: 'Guide',
    link: '#',
  },
];

const ParentDashboard = () => {
  const { user, profile, signOut, loading } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || profile?.role !== 'parent')) {
      navigate('/auth?role=parent');
    }
  }, [user, profile, loading, navigate]);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  if (loading) {
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
              <h1 className="text-xl font-bold">Parent Dashboard</h1>
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
        {/* Child Overview */}
        <Card className="mb-8 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="h-10 w-10 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-1">{childData.name}</h2>
                <p className="text-muted-foreground">
                  {childData.grade} Grade • Age {childData.age}
                </p>
                <div className="flex flex-wrap gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Last session: {childData.lastSession}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{childData.totalSessions} total sessions</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Progress Overview */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  {t('dashboard.progress')}
                </CardTitle>
                <CardDescription>Your child's assessment progress</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Dyslexia Assessment</span>
                    <span className="text-muted-foreground">{childData.dyslexiaProgress}%</span>
                  </div>
                  <Progress value={childData.dyslexiaProgress} className="h-3" />
                  <p className="text-sm text-muted-foreground mt-1">
                    Phonological processing shows improvement
                  </p>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Dyscalculia Assessment</span>
                    <span className="text-muted-foreground">{childData.dyscalculiaProgress}%</span>
                  </div>
                  <Progress value={childData.dyscalculiaProgress} className="h-3" />
                  <p className="text-sm text-muted-foreground mt-1">
                    Number sense development is on track
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Session History */}
            <Card>
              <CardHeader>
                <CardTitle>{t('dashboard.sessions')}</CardTitle>
                <CardDescription>Recent assessment sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sessionHistory.map((session) => (
                    <div 
                      key={session.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-border"
                    >
                      <div>
                        <p className="font-medium">{session.type} Assessment</p>
                        <p className="text-sm text-muted-foreground">{session.date}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant={
                          session.status === 'Normal' ? 'default' :
                          session.status === 'Moderate' ? 'secondary' : 'destructive'
                        }>
                          {session.status}
                        </Badge>
                        <span className="text-lg font-semibold">{session.score}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Learning Resources */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                {t('dashboard.resources')}
              </CardTitle>
              <CardDescription>Help your child succeed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {learningResources.map((resource, idx) => (
                <a
                  key={idx}
                  href={resource.link}
                  className="block p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-sm">{resource.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{resource.description}</p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0" />
                  </div>
                  <Badge variant="outline" className="mt-2 text-xs">
                    {resource.type === 'Video' && <Video className="h-3 w-3 mr-1" />}
                    {resource.type}
                  </Badge>
                </a>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ParentDashboard;
