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
import { useToast } from '@/hooks/use-toast';
import { 
  Users, Play, FileText, LogOut, Plus, TrendingUp, 
  AlertTriangle, CheckCircle, Loader2, Download
} from 'lucide-react';
import swarLogo from '@/assets/swar-logo.png';
import { downloadPDF } from '@/lib/pdfExport';

interface Student {
  id: string;
  name: string;
  age: number | null;
  grade: number;
}

interface Session {
  id: string;
  student_id: string;
  session_type: string;
  status: string;
  overall_score: number | null;
  flagged: boolean | null;
  created_at: string;
}

const sampleStudents: Student[] = [
  { id: '1', name: 'Aarav Sharma', age: 8, grade: 3 },
  { id: '2', name: 'Priya Patel', age: 9, grade: 4 },
  { id: '3', name: 'Rohan Kumar', age: 7, grade: 2 },
  { id: '4', name: 'Ananya Singh', age: 10, grade: 5 },
  { id: '5', name: 'Vikram Reddy', age: 8, grade: 3 },
];

const sampleSessions: (Session & { studentName: string; studentGrade: number })[] = [
  { id: '1', student_id: '1', studentName: 'Aarav Sharma', studentGrade: 3, session_type: 'dyslexia', status: 'completed', overall_score: 72, flagged: true, created_at: '2026-01-10' },
  { id: '2', student_id: '2', studentName: 'Priya Patel', studentGrade: 4, session_type: 'dyscalculia', status: 'completed', overall_score: 85, flagged: false, created_at: '2026-01-09' },
  { id: '3', student_id: '3', studentName: 'Rohan Kumar', studentGrade: 2, session_type: 'dyslexia', status: 'in_progress', overall_score: null, flagged: null, created_at: '2026-01-11' },
  { id: '4', student_id: '4', studentName: 'Ananya Singh', studentGrade: 5, session_type: 'dyslexia', status: 'completed', overall_score: 92, flagged: false, created_at: '2026-01-08' },
];

const TeacherDashboard = () => {
  const { user, profile, signOut, loading } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [students, setStudents] = useState<Student[]>(sampleStudents);
  const [sessions] = useState(sampleSessions);
  const [sessionDialogOpen, setSessionDialogOpen] = useState(false);
  const [addStudentDialogOpen, setAddStudentDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [selectedGrade, setSelectedGrade] = useState<string>('');
  const [sessionType, setSessionType] = useState<'dyslexia' | 'dyscalculia'>('dyslexia');
  
  // New student form state
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentAge, setNewStudentAge] = useState('');
  const [newStudentGrade, setNewStudentGrade] = useState('');
  const [isAddingStudent, setIsAddingStudent] = useState(false);

  useEffect(() => {
    if (!loading && (!user || profile?.role !== 'teacher')) {
      navigate('/auth?role=teacher');
    }
  }, [user, profile, loading, navigate]);

  useEffect(() => {
    if (profile?.id) {
      fetchStudents();
    }
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
    
    if (data && data.length > 0) {
      const formattedStudents: Student[] = data.map(s => ({
        id: s.id,
        name: s.name,
        age: s.age,
        grade: parseInt(s.grade || '1') || 1,
      }));
      setStudents(formattedStudents);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const handleAddStudent = async () => {
    // Validation
    const name = newStudentName.trim();
    if (!name) {
      toast({ title: 'Name is required', variant: 'destructive' });
      return;
    }
    if (name.length > 100) {
      toast({ title: 'Name must be less than 100 characters', variant: 'destructive' });
      return;
    }
    
    const age = parseInt(newStudentAge);
    if (newStudentAge && (isNaN(age) || age < 3 || age > 25)) {
      toast({ title: 'Age must be between 3 and 25', variant: 'destructive' });
      return;
    }
    
    const grade = parseInt(newStudentGrade);
    if (!newStudentGrade || isNaN(grade) || grade < 1 || grade > 12) {
      toast({ title: 'Grade must be between 1 and 12', variant: 'destructive' });
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
          name: name,
          age: newStudentAge ? age : null,
          grade: String(grade),
          teacher_id: profile.id,
        })
        .select()
        .single();

      if (error) throw error;

      const newStudent: Student = {
        id: data.id,
        name: data.name,
        age: data.age,
        grade: parseInt(data.grade || '1') || 1,
      };

      setStudents([...students, newStudent]);
      setAddStudentDialogOpen(false);
      setNewStudentName('');
      setNewStudentAge('');
      setNewStudentGrade('');
      toast({ title: 'Student added successfully!' });
    } catch (error: any) {
      console.error('Error adding student:', error);
      toast({ title: 'Failed to add student', description: error.message, variant: 'destructive' });
    } finally {
      setIsAddingStudent(false);
    }
  };

  const handleStartSession = () => {
    if (!selectedStudent) {
      toast({ title: 'Please select a student', variant: 'destructive' });
      return;
    }
    const student = students.find(s => s.id === selectedStudent);
    const grade = selectedGrade || student?.grade || 1;
    setSessionDialogOpen(false);
    navigate(`/session?student=${selectedStudent}&type=${sessionType}&grade=${grade}`);
  };

  const handleExportPDF = (session: typeof sampleSessions[0]) => {
    downloadPDF({
      studentName: session.studentName,
      studentGrade: session.studentGrade,
      sessionType: session.session_type as 'dyslexia' | 'dyscalculia',
      date: new Date(session.created_at).toLocaleDateString(),
      responses: [],
      score: session.overall_score || 0,
      isFlagged: session.flagged || false,
      teacherName: profile?.full_name || undefined,
    });
    toast({ title: 'PDF Report Generated', description: 'Opening in new window...' });
  };

  const stats = {
    totalStudents: students.length,
    totalSessions: sessions.length,
    flaggedStudents: sessions.filter(s => s.flagged).length,
    avgScore: Math.round(sessions.filter(s => s.overall_score).reduce((acc, s) => acc + (s.overall_score || 0), 0) / sessions.filter(s => s.overall_score).length) || 0,
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
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={swarLogo} alt="SWAR" className="h-10" />
            <div>
              <h1 className="text-xl font-bold">Teacher Dashboard</h1>
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
          <Card><CardContent className="p-4 flex items-center gap-4"><div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center"><AlertTriangle className="h-6 w-6 text-destructive" /></div><div><p className="text-2xl font-bold">{stats.flaggedStudents}</p><p className="text-sm text-muted-foreground">Flagged</p></div></CardContent></Card>
          <Card><CardContent className="p-4 flex items-center gap-4"><div className="w-12 h-12 rounded-full bg-chart-3/20 flex items-center justify-center"><TrendingUp className="h-6 w-6 text-chart-3" /></div><div><p className="text-2xl font-bold">{stats.avgScore}%</p><p className="text-sm text-muted-foreground">Avg Score</p></div></CardContent></Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between">
              <div><CardTitle>{t('dashboard.students')}</CardTitle><CardDescription>Manage your students</CardDescription></div>
              <Dialog open={addStudentDialogOpen} onOpenChange={setAddStudentDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm"><Plus className="h-4 w-4" /></Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Student</DialogTitle>
                    <DialogDescription>Enter the student's details below</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="studentName">Student Name *</Label>
                      <Input
                        id="studentName"
                        placeholder="Enter student's full name"
                        value={newStudentName}
                        onChange={(e) => setNewStudentName(e.target.value)}
                        maxLength={100}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="studentAge">Age (optional)</Label>
                      <Input
                        id="studentAge"
                        type="number"
                        placeholder="Enter age (3-25)"
                        value={newStudentAge}
                        onChange={(e) => setNewStudentAge(e.target.value)}
                        min={3}
                        max={25}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Grade Level *</Label>
                      <Select value={newStudentGrade} onValueChange={setNewStudentGrade}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select grade (1-12)" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 12 }, (_, i) => (
                            <SelectItem key={i + 1} value={String(i + 1)}>
                              Grade {i + 1}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button 
                      onClick={handleAddStudent} 
                      className="w-full"
                      disabled={isAddingStudent}
                    >
                      {isAddingStudent ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Student
                        </>
                      )}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="space-y-3">
              {students.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No students yet. Add your first student!</p>
              ) : (
                students.map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-muted-foreground">Grade {student.grade} {student.age ? `• Age ${student.age}` : ''}</p>
                    </div>
                    <Button size="sm" onClick={() => { setSelectedStudent(student.id); setSelectedGrade(String(student.grade)); setSessionDialogOpen(true); }}>
                      <Play className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div><CardTitle>{t('dashboard.sessions')}</CardTitle><CardDescription>Recent assessment sessions</CardDescription></div>
              <Dialog open={sessionDialogOpen} onOpenChange={setSessionDialogOpen}>
                <DialogTrigger asChild><Button><Play className="h-4 w-4 mr-2" />{t('dashboard.startSession')}</Button></DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Start New Session</DialogTitle><DialogDescription>Select student, grade level, and assessment type</DialogDescription></DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Select Student</Label>
                      <Select value={selectedStudent} onValueChange={(v) => { setSelectedStudent(v); const s = students.find(st => st.id === v); if (s) setSelectedGrade(String(s.grade)); }}>
                        <SelectTrigger><SelectValue placeholder="Choose a student" /></SelectTrigger>
                        <SelectContent>{students.map((student) => (<SelectItem key={student.id} value={student.id}>{student.name}</SelectItem>))}</SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Grade Level (1-12)</Label>
                      <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                        <SelectTrigger><SelectValue placeholder="Select grade" /></SelectTrigger>
                        <SelectContent>{Array.from({ length: 12 }, (_, i) => (<SelectItem key={i + 1} value={String(i + 1)}>Grade {i + 1}</SelectItem>))}</SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Assessment Type</Label>
                      <Select value={sessionType} onValueChange={(v) => setSessionType(v as 'dyslexia' | 'dyscalculia')}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent><SelectItem value="dyslexia">Dyslexia Assessment</SelectItem><SelectItem value="dyscalculia">Dyscalculia Assessment</SelectItem></SelectContent>
                      </Select>
                    </div>
                    <Button onClick={handleStartSession} className="w-full">Start Session</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${session.flagged ? 'bg-destructive/10' : 'bg-chart-3/20'}`}>
                        {session.flagged ? <AlertTriangle className="h-5 w-5 text-destructive" /> : <CheckCircle className="h-5 w-5 text-chart-3" />}
                      </div>
                      <div><p className="font-medium">{session.studentName}</p><p className="text-sm text-muted-foreground capitalize">{session.session_type} • Grade {session.studentGrade}</p></div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant={session.status === 'completed' ? 'default' : 'secondary'}>{session.status}</Badge>
                      {session.overall_score && <span className="text-lg font-semibold">{session.overall_score}%</span>}
                      {session.status === 'completed' && (
                        <Button variant="ghost" size="sm" onClick={() => handleExportPDF(session)}><Download className="h-4 w-4" /></Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default TeacherDashboard;