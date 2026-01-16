-- Create user roles enum
CREATE TYPE public.user_role AS ENUM ('parent', 'teacher');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  email TEXT NOT NULL,
  full_name TEXT,
  role user_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create students table
CREATE TABLE public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  age INTEGER,
  grade TEXT,
  parent_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  teacher_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create assessment sessions table
CREATE TABLE public.assessment_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  teacher_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL NOT NULL,
  session_type TEXT NOT NULL CHECK (session_type IN ('dyslexia', 'dyscalculia')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  phoneme_error_rate DECIMAL(5,2),
  overall_score DECIMAL(5,2),
  flagged BOOLEAN DEFAULT false,
  notes TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create session responses table (for storing test answers)
CREATE TABLE public.session_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.assessment_sessions(id) ON DELETE CASCADE NOT NULL,
  question_number INTEGER NOT NULL,
  question_text TEXT NOT NULL,
  expected_answer TEXT,
  student_response TEXT,
  is_correct BOOLEAN,
  audio_url TEXT,
  response_time_ms INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create progress reports table
CREATE TABLE public.progress_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  report_date DATE NOT NULL DEFAULT CURRENT_DATE,
  dyslexia_score DECIMAL(5,2),
  dyscalculia_score DECIMAL(5,2),
  improvement_percentage DECIMAL(5,2),
  recommendations TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_reports ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Students policies (parents can see their children, teachers can see their students)
CREATE POLICY "Parents can view their children"
ON public.students FOR SELECT
USING (
  parent_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  OR teacher_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
);

CREATE POLICY "Teachers can manage students"
ON public.students FOR ALL
USING (teacher_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Teachers can insert students"
ON public.students FOR INSERT
WITH CHECK (teacher_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- Assessment sessions policies
CREATE POLICY "Teachers can manage their sessions"
ON public.assessment_sessions FOR ALL
USING (teacher_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Parents can view their children sessions"
ON public.assessment_sessions FOR SELECT
USING (
  student_id IN (
    SELECT id FROM public.students 
    WHERE parent_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  )
);

-- Session responses policies
CREATE POLICY "Teachers can manage session responses"
ON public.session_responses FOR ALL
USING (
  session_id IN (
    SELECT id FROM public.assessment_sessions 
    WHERE teacher_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  )
);

CREATE POLICY "Parents can view their children responses"
ON public.session_responses FOR SELECT
USING (
  session_id IN (
    SELECT ass.id FROM public.assessment_sessions ass
    JOIN public.students s ON ass.student_id = s.id
    WHERE s.parent_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  )
);

-- Progress reports policies
CREATE POLICY "Teachers can manage progress reports"
ON public.progress_reports FOR ALL
USING (
  student_id IN (
    SELECT id FROM public.students 
    WHERE teacher_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  )
);

CREATE POLICY "Parents can view their children progress"
ON public.progress_reports FOR SELECT
USING (
  student_id IN (
    SELECT id FROM public.students 
    WHERE parent_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  )
);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for timestamp updates
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_students_updated_at
BEFORE UPDATE ON public.students
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();