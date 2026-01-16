import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, Play, FileText, LogOut, Plus, TrendingUp, 
  AlertTriangle, CheckCircle, Loader2, Download, BookOpen,
  Mail, Edit2, History
} from 'lucide-react';
import swarLogo from '@/assets/swar-logo.png';
import { downloadPDF } from '@/lib/pdfExport';
import TeacherTraining from '@/components/TeacherTraining';
import PracticeWorksheet from '@/components/PracticeWorksheet';
import ProgressChart from '@/components/ProgressChart';
import SessionHistory from '@/components/SessionHistory';

interface Student {
  id: string;
  name: string;
  age: number | null;
  grade: number;
  parent_email?: string | null;
}

interface Session {
  id: string;
  student_id: string;
  session_type: string;
  status: string;
  overall_score: number | null;
  flagged: boolean | null;
  created_at: string;
  studentName?: string;
  studentGrade?: number;
}

const getScoreInterpretation = (score: number | null, sessionType: string, t: (key: string) => string): { text: string; variant: 'default' | 'secondary' | 'destructive' } => {
  if (score === null) return { text: '-', variant: 'secondary' };
  
  if (score >= 85) {
    return { text: t('score.excellent'), variant: 'default' };
  } else if (score >= 70) {
    return { text: t('score.good'), variant: 'default' };
  } else if (score >= 55) {
    return { text: t('score.moderate'), variant: 'secondary' };
  } else {
    return { 
      text: sessionType === 'dyslexia' ? t('score.concernDyslexia') : t('score.concernDyscalculia'), 
      variant: 'destructive' 
    };
  }
};

const TeacherDashboard = () => {
  const { user, profile, signOut, loading } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [students, setStudents] = useState<Student[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [sessionDialogOpen, setSessionDialogOpen] = useState(false);
  const [addStudentDialogOpen, setAddStudentDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [selectedGrade, setSelectedGrade] = useState<string>('');
  const [sessionType, setSessionType] = useState<'dyslexia' | 'dyscalculia'>('dyslexia');
  const [selectedStudentForReport, setSelectedStudentForReport] = useState<string>('');
  
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentAge, setNewStudentAge] = useState('');
  const [newStudentGrade, setNewStudentGrade] = useState('');
  const [newStudentParentEmail, setNewStudentParentEmail] = useState('');
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [editParentEmail, setEditParentEmail] = useState('');

  useEffect(() => {
    if (!loading && (!user || profile?.role !== 'teacher')) {
      navigate('/auth?role=teacher');
    }
  }, [user, profile, loading, navigate]);

  useEffect(() => {
    if (profile?.id) {
      fetchStudents();
      fetchSessions();
    }
  }, [profile?.id]);

  // Set up real-time subscription for sessions
  useEffect(() => {
    if (!profile?.id) return;

    const channel = supabase
      .channel('teacher-sessions')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'assessment_sessions',
          filter: `teacher_id=eq.${profile.id}`,
        },
        (payload) => {
          console.log('Real-time session update:', payload);
          fetchSessions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile?.id]);

  const fetchStudents = async () => {
    if (!profile?.id) return;
    
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('teacher_id', profile.id);
    
    if (error) {
      console.error('Error fetching students:', error);
      return;
    }
    
    if (data) {
      const formattedStudents: Student[] = data.map(s => ({
        id: s.id,
        name: s.name,
        age: s.age,
        grade: parseInt(s.grade || '1') || 1,
        parent_email: s.parent_email,
      }));
      setStudents(formattedStudents);
    }
  };

  const fetchSessions = async () => {
    if (!profile?.id) return;
    setSessionsLoading(true);
    
    const { data, error } = await supabase
      .from('assessment_sessions')
      .select('*, students(name, grade)')
      .eq('teacher_id', profile.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching sessions:', error);
      setSessionsLoading(false);
      return;
    }
    
    if (data) {
      const formattedSessions: Session[] = data.map(s => ({
        id: s.id,
        student_id: s.student_id,
        session_type: s.session_type,
        status: s.status,
        overall_score: s.overall_score,
        flagged: s.flagged,
        created_at: s.created_at,
        studentName: (s.students as any)?.name || 'Unknown',
        studentGrade: parseInt((s.students as any)?.grade || '1') || 1,
      }));
      setSessions(formattedSessions);
    }
    setSessionsLoading(false);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const handleAddStudent = async () => {
    const name = newStudentName.trim();
    if (!name) {
      toast({ title: t('teacher.studentName') + ' required', variant: 'destructive' });
      return;
    }
    
    const age = parseInt(newStudentAge);
    if (newStudentAge && (isNaN(age) || age < 3 || age > 25)) {
      toast({ title: t('teacher.age') + ' must be 3-25', variant: 'destructive' });
      return;
    }
    
    const grade = parseInt(newStudentGrade);
    if (!newStudentGrade || isNaN(grade) || grade < 1 || grade > 12) {
      toast({ title: t('teacher.gradeLevel') + ' must be 1-12', variant: 'destructive' });
      return;
    }

    if (!profile?.id) {
      toast({ title: 'Not authenticated', variant: 'destructive' });
      return;
    }

    setIsAddingStudent(true);
    
    try {
      const { data, error } = await supabase
        .from('students')
        .insert({ 
          name, 
          age: newStudentAge ? age : null, 
          grade: String(grade), 
          teacher_id: profile.id,
          parent_email: newStudentParentEmail.trim() || null
        })
        .select()
        .single();

      if (error) throw error;

      setStudents([...students, { 
        id: data.id, 
        name: data.name, 
        age: data.age, 
        grade: parseInt(data.grade || '1') || 1,
        parent_email: data.parent_email
      }]);
      setAddStudentDialogOpen(false);
      setNewStudentName('');
      setNewStudentAge('');
      setNewStudentGrade('');
      setNewStudentParentEmail('');
      toast({ title: t('teacher.studentAdded') });
    } catch (error: any) {
      toast({ title: 'Failed to add student', description: error.message, variant: 'destructive' });
    } finally {
      setIsAddingStudent(false);
    }
  };

  const handleUpdateParentEmail = async () => {
    if (!editingStudent) return;
    
    try {
      const { error } = await supabase
        .from('students')
        .update({ parent_email: editParentEmail.trim() || null })
        .eq('id', editingStudent.id);

      if (error) throw error;

      setStudents(students.map(s => 
        s.id === editingStudent.id 
          ? { ...s, parent_email: editParentEmail.trim() || null }
          : s
      ));
      setEditingStudent(null);
      setEditParentEmail('');
      toast({ title: 'Parent email updated successfully' });
    } catch (error: any) {
      toast({ title: 'Failed to update parent email', description: error.message, variant: 'destructive' });
    }
  };

  const handleStartSession = () => {
    if (!selectedStudent) {
      toast({ title: t('teacher.selectStudent'), variant: 'destructive' });
      return;
    }
    const student = students.find(s => s.id === selectedStudent);
    const grade = selectedGrade || student?.grade || 1;
    setSessionDialogOpen(false);
    navigate(`/session?student=${selectedStudent}&type=${sessionType}&grade=${grade}&lang=${language}`);
  };

  const handleExportPDF = (session: Session) => {
    const interpretation = getScoreInterpretation(session.overall_score, session.session_type, t);
    downloadPDF({
      studentName: session.studentName || 'Unknown',
      studentGrade: session.studentGrade || 1,
      sessionType: session.session_type as 'dyslexia' | 'dyscalculia',
      date: new Date(session.created_at).toLocaleDateString(),
      responses: [],
      score: session.overall_score || 0,
      isFlagged: session.flagged || false,
      teacherName: profile?.full_name || undefined,
      interpretation: interpretation.text,
    });
    toast({ title: t('session.pdfGenerated') });
  };

  const completedSessions = sessions.filter(s => s.status === 'completed');
  const stats = {
    totalStudents: students.length,
    totalSessions: sessions.length,
    flaggedStudents: sessions.filter(s => s.flagged).length,
    avgScore: completedSessions.length > 0 
      ? Math.round(completedSessions.reduce((acc, s) => acc + (s.overall_score || 0), 0) / completedSessions.length) 
      : 0,
  };

  const selectedStudentData = students.find(s => s.id === selectedStudentForReport);
  const selectedStudentSessions = sessions.filter(s => s.student_id === selectedStudentForReport && s.status === 'completed');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={swarLogo} alt="SWAR" className="h-10" />
            <div>
              <h1 className="text-xl font-bold">{t('teacher.dashboard')}</h1>
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card><CardContent className="p-4 flex items-center gap-4"><div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center"><Users className="h-6 w-6 text-primary" /></div><div><p className="text-2xl font-bold">{stats.totalStudents}</p><p className="text-sm text-muted-foreground">{t('dashboard.students')}</p></div></CardContent></Card>
          <Card><CardContent className="p-4 flex items-center gap-4"><div className="w-12 h-12 rounded-full bg-chart-2/20 flex items-center justify-center"><FileText className="h-6 w-6 text-chart-2" /></div><div><p className="text-2xl font-bold">{stats.totalSessions}</p><p className="text-sm text-muted-foreground">{t('dashboard.sessions')}</p></div></CardContent></Card>
          <Card><CardContent className="p-4 flex items-center gap-4"><div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center"><AlertTriangle className="h-6 w-6 text-destructive" /></div><div><p className="text-2xl font-bold">{stats.flaggedStudents}</p><p className="text-sm text-muted-foreground">{t('teacher.flagged')}</p></div></CardContent></Card>
          <Card><CardContent className="p-4 flex items-center gap-4"><div className="w-12 h-12 rounded-full bg-chart-3/20 flex items-center justify-center"><TrendingUp className="h-6 w-6 text-chart-3" /></div><div><p className="text-2xl font-bold">{stats.avgScore}%</p><p className="text-sm text-muted-foreground">{t('teacher.avgScore')}</p></div></CardContent></Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">{t('dashboard.students')}</TabsTrigger>
            <TabsTrigger value="reports">{t('dashboard.reports')}</TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Session History
            </TabsTrigger>
            <TabsTrigger value="training" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              {t('training.title')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid lg:grid-cols-3 gap-8">
              <Card className="lg:col-span-1">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div><CardTitle>{t('dashboard.students')}</CardTitle><CardDescription>{t('teacher.manageStudents')}</CardDescription></div>
                  <Dialog open={addStudentDialogOpen} onOpenChange={setAddStudentDialogOpen}>
                    <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4" /></Button></DialogTrigger>
                    <DialogContent>
                      <DialogHeader><DialogTitle>{t('teacher.addStudent')}</DialogTitle><DialogDescription>{t('teacher.enterDetails')}</DialogDescription></DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="studentName">{t('teacher.studentName')} *</Label>
                          <Input id="studentName" placeholder={t('teacher.studentName')} value={newStudentName} onChange={(e) => setNewStudentName(e.target.value)} maxLength={100} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="studentAge">{t('teacher.age')} ({t('teacher.optional')})</Label>
                          <Input id="studentAge" type="number" placeholder="3-25" value={newStudentAge} onChange={(e) => setNewStudentAge(e.target.value)} min={3} max={25} />
                        </div>
                        <div className="space-y-2">
                          <Label>{t('teacher.gradeLevel')} *</Label>
                          <Select value={newStudentGrade} onValueChange={setNewStudentGrade}>
                            <SelectTrigger><SelectValue placeholder={t('teacher.selectGrade')} /></SelectTrigger>
                            <SelectContent>{Array.from({ length: 12 }, (_, i) => (<SelectItem key={i + 1} value={String(i + 1)}>{t('teacher.grade')} {i + 1}</SelectItem>))}</SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="parentEmail">Parent Email ({t('teacher.optional')})</Label>
                          <Input 
                            id="parentEmail" 
                            type="email" 
                            placeholder="parent@example.com" 
                            value={newStudentParentEmail} 
                            onChange={(e) => setNewStudentParentEmail(e.target.value)} 
                            maxLength={255} 
                          />
                          <p className="text-xs text-muted-foreground">
                            <Mail className="h-3 w-3 inline mr-1" />
                            Student will be automatically linked when parent signs up with this email
                          </p>
                        </div>
                        <Button onClick={handleAddStudent} className="w-full" disabled={isAddingStudent}>
                          {isAddingStudent ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />{t('teacher.adding')}</> : <><Plus className="h-4 w-4 mr-2" />{t('teacher.addStudent')}</>}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent className="space-y-3">
                  {students.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">{t('teacher.noStudents')}</p>
                  ) : (
                    students.map((student) => (
                      <div key={student.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                        <div className="flex-1">
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-muted-foreground">{t('teacher.grade')} {student.grade} {student.age ? `• ${t('teacher.age')} ${student.age}` : ''}</p>
                          {student.parent_email ? (
                            <p className="text-xs text-chart-3 flex items-center gap-1 mt-1">
                              <Mail className="h-3 w-3" />
                              Linked: {student.parent_email}
                            </p>
                          ) : (
                            <button 
                              onClick={() => { setEditingStudent(student); setEditParentEmail(student.parent_email || ''); }}
                              className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 mt-1"
                            >
                              <Edit2 className="h-3 w-3" />
                              Add parent email
                            </button>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="ghost" onClick={() => { setEditingStudent(student); setEditParentEmail(student.parent_email || ''); }}>
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button size="sm" onClick={() => { setSelectedStudent(student.id); setSelectedGrade(String(student.grade)); setSessionDialogOpen(true); }}>
                            <Play className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div><CardTitle>{t('dashboard.sessions')}</CardTitle><CardDescription>{t('teacher.recentSessions')}</CardDescription></div>
                  <Dialog open={sessionDialogOpen} onOpenChange={setSessionDialogOpen}>
                    <DialogTrigger asChild><Button><Play className="h-4 w-4 mr-2" />{t('dashboard.startSession')}</Button></DialogTrigger>
                    <DialogContent>
                      <DialogHeader><DialogTitle>{t('teacher.startNewSession')}</DialogTitle></DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label>{t('teacher.selectStudent')}</Label>
                          <Select value={selectedStudent} onValueChange={(v) => { setSelectedStudent(v); const s = students.find(st => st.id === v); if (s) setSelectedGrade(String(s.grade)); }}>
                            <SelectTrigger><SelectValue placeholder={t('teacher.chooseStudent')} /></SelectTrigger>
                            <SelectContent>{students.map((student) => (<SelectItem key={student.id} value={student.id}>{student.name}</SelectItem>))}</SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>{t('teacher.gradeLevel')}</Label>
                          <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                            <SelectTrigger><SelectValue placeholder={t('teacher.selectGrade')} /></SelectTrigger>
                            <SelectContent>{Array.from({ length: 12 }, (_, i) => (<SelectItem key={i + 1} value={String(i + 1)}>{t('teacher.grade')} {i + 1}</SelectItem>))}</SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>{t('teacher.assessmentType')}</Label>
                          <Select value={sessionType} onValueChange={(v) => setSessionType(v as 'dyslexia' | 'dyscalculia')}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="dyslexia">{t('teacher.dyslexiaAssessment')}</SelectItem>
                              <SelectItem value="dyscalculia">{t('teacher.dyscalculiaAssessment')}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button onClick={handleStartSession} className="w-full">{t('dashboard.startSession')}</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  {sessionsLoading ? (
                    <div className="text-center py-8"><Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" /></div>
                  ) : sessions.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No sessions yet. Start an assessment!</p>
                  ) : (
                    <div className="space-y-4">
                      {sessions.slice(0, 5).map((session) => {
                        const interpretation = getScoreInterpretation(session.overall_score, session.session_type, t);
                        return (
                          <div key={session.id} className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/50 transition-colors">
                            <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${session.flagged ? 'bg-destructive/10' : 'bg-chart-3/20'}`}>
                                {session.flagged ? <AlertTriangle className="h-5 w-5 text-destructive" /> : <CheckCircle className="h-5 w-5 text-chart-3" />}
                              </div>
                              <div>
                                <p className="font-medium">{session.studentName}</p>
                                <p className="text-sm text-muted-foreground capitalize">{session.session_type} • {t('teacher.grade')} {session.studentGrade}</p>
                                {session.overall_score !== null && (
                                  <p className={`text-xs mt-1 ${interpretation.variant === 'destructive' ? 'text-destructive' : 'text-muted-foreground'}`}>{interpretation.text}</p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <Badge variant={session.status === 'completed' ? 'default' : 'secondary'}>{session.status}</Badge>
                              {session.overall_score !== null && <span className="text-lg font-semibold">{session.overall_score}%</span>}
                              {session.status === 'completed' && (
                                <Button variant="ghost" size="sm" onClick={() => handleExportPDF(session)}><Download className="h-4 w-4" /></Button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reports">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('dashboard.reports')}</CardTitle>
                    <CardDescription>View and export detailed assessment reports</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <Label>Select Student for Progress Report</Label>
                      <Select value={selectedStudentForReport} onValueChange={setSelectedStudentForReport}>
                        <SelectTrigger><SelectValue placeholder="Choose a student" /></SelectTrigger>
                        <SelectContent>{students.map((student) => (<SelectItem key={student.id} value={student.id}>{student.name}</SelectItem>))}</SelectContent>
                      </Select>
                    </div>
                    
                    {selectedStudentForReport && selectedStudentData && (
                      <ProgressChart 
                        studentName={selectedStudentData.name}
                        sessions={selectedStudentSessions.map(s => ({
                          id: s.id,
                          date: s.created_at,
                          score: s.overall_score || 0,
                          sessionType: s.session_type,
                        }))}
                      />
                    )}
                    
                    <div className="space-y-4 mt-6">
                      {completedSessions.map((session) => {
                        const interpretation = getScoreInterpretation(session.overall_score, session.session_type, t);
                        return (
                          <div key={session.id} className="flex items-center justify-between p-4 rounded-lg border border-border">
                            <div className="flex-1">
                              <div className="flex items-center gap-3">
                                <p className="font-medium">{session.studentName}</p>
                                <Badge variant={interpretation.variant}>{session.overall_score}%</Badge>
                                {session.flagged && <Badge variant="destructive">{t('teacher.flagged')}</Badge>}
                              </div>
                              <p className="text-sm text-muted-foreground capitalize mt-1">{session.session_type} • {t('teacher.grade')} {session.studentGrade} • {new Date(session.created_at).toLocaleDateString()}</p>
                              <p className="text-sm mt-2">{interpretation.text}</p>
                            </div>
                            <Button variant="outline" onClick={() => handleExportPDF(session)}>
                              <Download className="h-4 w-4 mr-2" />{t('session.exportPDF')}
                            </Button>
                          </div>
                        );
                      })}
                      {completedSessions.length === 0 && <p className="text-center text-muted-foreground py-8">No completed sessions yet.</p>}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                {selectedStudentForReport && selectedStudentData && selectedStudentSessions.length > 0 && (
                  <PracticeWorksheet 
                    studentName={selectedStudentData.name}
                    sessionType={selectedStudentSessions[0].session_type as 'dyslexia' | 'dyscalculia'}
                    score={selectedStudentSessions[0].overall_score || 50}
                    grade={selectedStudentData.grade}
                  />
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <SessionHistory 
              sessions={sessions.map(s => ({
                ...s,
                studentName: s.studentName,
                studentGrade: s.studentGrade,
              }))}
              viewType="teacher"
              onExportPDF={handleExportPDF}
            />
          </TabsContent>

          <TabsContent value="training">
            <TeacherTraining />
          </TabsContent>
        </Tabs>

        {/* Edit Parent Email Dialog */}
        <Dialog open={!!editingStudent} onOpenChange={(open) => { if (!open) { setEditingStudent(null); setEditParentEmail(''); } }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Link Parent Account</DialogTitle>
              <DialogDescription>
                Enter the parent's email address to link this student to their parent account.
                The student will automatically appear in the parent's dashboard.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Student</Label>
                <p className="font-medium">{editingStudent?.name}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="editParentEmail">Parent Email</Label>
                <Input 
                  id="editParentEmail" 
                  type="email" 
                  placeholder="parent@example.com" 
                  value={editParentEmail} 
                  onChange={(e) => setEditParentEmail(e.target.value)} 
                  maxLength={255} 
                />
                <p className="text-xs text-muted-foreground">
                  <Mail className="h-3 w-3 inline mr-1" />
                  When a parent signs up with this email, the student will be automatically linked to their account.
                </p>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleUpdateParentEmail} className="flex-1">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button variant="outline" onClick={() => { setEditingStudent(null); setEditParentEmail(''); }}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default TeacherDashboard;
