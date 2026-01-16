import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { TrendingUp, TrendingDown, Minus, BarChart3 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SessionData {
  id: string;
  date: string;
  score: number;
  sessionType: string;
}

interface ProgressChartProps {
  sessions: SessionData[];
  studentName: string;
}

const ProgressChart = ({ sessions, studentName }: ProgressChartProps) => {
  const { t } = useLanguage();

  if (sessions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Progress Chart
          </CardTitle>
          <CardDescription>Track student progress over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No completed sessions yet.</p>
            <p className="text-sm">Complete assessments to see progress charts.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Prepare chart data
  const chartData = sessions
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((session, index) => ({
      name: `Session ${index + 1}`,
      date: new Date(session.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      score: session.score,
      type: session.sessionType,
    }));

  // Calculate trend
  const calculateTrend = () => {
    if (sessions.length < 2) return { trend: 'neutral', change: 0 };
    
    const recent = sessions.slice(-3).reduce((acc, s) => acc + s.score, 0) / Math.min(3, sessions.length);
    const earlier = sessions.slice(0, Math.min(3, sessions.length - 1)).reduce((acc, s) => acc + s.score, 0) / Math.min(3, sessions.length - 1);
    
    const change = recent - earlier;
    
    if (change > 5) return { trend: 'up', change: Math.round(change) };
    if (change < -5) return { trend: 'down', change: Math.round(change) };
    return { trend: 'neutral', change: Math.round(change) };
  };

  const trendInfo = calculateTrend();
  const averageScore = Math.round(sessions.reduce((acc, s) => acc + s.score, 0) / sessions.length);
  const highestScore = Math.max(...sessions.map(s => s.score));
  const lowestScore = Math.min(...sessions.map(s => s.score));

  // Separate by session type for comparison
  const dyslexiaSessions = sessions.filter(s => s.sessionType === 'dyslexia');
  const dyscalculiaSessions = sessions.filter(s => s.sessionType === 'dyscalculia');

  const comparisonData = [
    {
      type: 'Dyslexia',
      sessions: dyslexiaSessions.length,
      avgScore: dyslexiaSessions.length > 0 
        ? Math.round(dyslexiaSessions.reduce((acc, s) => acc + s.score, 0) / dyslexiaSessions.length)
        : 0,
    },
    {
      type: 'Dyscalculia',
      sessions: dyscalculiaSessions.length,
      avgScore: dyscalculiaSessions.length > 0
        ? Math.round(dyscalculiaSessions.reduce((acc, s) => acc + s.score, 0) / dyscalculiaSessions.length)
        : 0,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Progress Chart - {studentName}
        </CardTitle>
        <CardDescription>
          Track assessment scores over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <p className="text-2xl font-bold text-primary">{sessions.length}</p>
            <p className="text-xs text-muted-foreground">Total Sessions</p>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <p className="text-2xl font-bold">{averageScore}%</p>
            <p className="text-xs text-muted-foreground">Average Score</p>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <p className="text-2xl font-bold text-chart-3">{highestScore}%</p>
            <p className="text-xs text-muted-foreground">Highest</p>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-center gap-1">
              {trendInfo.trend === 'up' && <TrendingUp className="h-5 w-5 text-chart-3" />}
              {trendInfo.trend === 'down' && <TrendingDown className="h-5 w-5 text-destructive" />}
              {trendInfo.trend === 'neutral' && <Minus className="h-5 w-5 text-muted-foreground" />}
              <span className={`text-lg font-bold ${
                trendInfo.trend === 'up' ? 'text-chart-3' : 
                trendInfo.trend === 'down' ? 'text-destructive' : 
                'text-muted-foreground'
              }`}>
                {trendInfo.change > 0 ? '+' : ''}{trendInfo.change}%
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Trend</p>
          </div>
        </div>

        {/* Line Chart */}
        <div className="h-64 mb-8">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="date" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis domain={[0, 100]} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2 }}
                activeDot={{ r: 6, fill: 'hsl(var(--primary))' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Comparison by Type */}
        {(dyslexiaSessions.length > 0 || dyscalculiaSessions.length > 0) && (
          <div>
            <h4 className="font-semibold mb-4">Performance by Assessment Type</h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData.filter(d => d.sessions > 0)} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="type" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis domain={[0, 100]} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="avgScore" name="Avg Score %" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="sessions" name="Sessions" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Interpretation */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h4 className="font-semibold mb-2">Analysis</h4>
          <p className="text-sm text-muted-foreground">
            {trendInfo.trend === 'up' && (
              <>
                Great progress! {studentName}'s scores are <strong className="text-chart-3">improving</strong> with an 
                average increase of {trendInfo.change}% in recent sessions. Continue the current support strategies.
              </>
            )}
            {trendInfo.trend === 'down' && (
              <>
                {studentName}'s recent scores show a <strong className="text-destructive">declining trend</strong> of {Math.abs(trendInfo.change)}%. 
                Consider reviewing the current support strategies and providing additional practice.
              </>
            )}
            {trendInfo.trend === 'neutral' && (
              <>
                {studentName}'s scores are <strong>stable</strong> with an average of {averageScore}%. 
                {averageScore >= 70 
                  ? ' Continue maintaining consistent practice.' 
                  : ' Consider introducing new support strategies to improve scores.'}
              </>
            )}
          </p>
          {averageScore < 55 && (
            <Badge variant="destructive" className="mt-2">
              Professional evaluation recommended
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressChart;
