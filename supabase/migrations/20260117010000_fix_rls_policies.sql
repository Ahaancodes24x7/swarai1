-- Fix RLS Policies for Parent Access and Session Responses
-- This migration fixes critical issues preventing parents from seeing children and sessions from saving

-- ============================================================================
-- 1. FIX STUDENTS TABLE - Allow parents to see children by parent_email
-- ============================================================================

-- Drop the old restrictive policy
DROP POLICY IF EXISTS "Parents can view their children" ON public.students;

-- Create updated policy that checks BOTH parent_id AND parent_email
CREATE POLICY "Parents can view their children"
ON public.students FOR SELECT
USING (
  -- Parent can see if parent_id matches their profile
  parent_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  -- OR if parent_email matches their profile email
  OR parent_email IN (SELECT email FROM public.profiles WHERE user_id = auth.uid())
  -- OR if they are the teacher
  OR teacher_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
);

-- Also fix the INSERT and UPDATE policies for parents
DROP POLICY IF EXISTS "Teachers can insert students" ON public.students;
CREATE POLICY "Teachers can insert students"
ON public.students FOR INSERT
WITH CHECK (
  teacher_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
);

DROP POLICY IF EXISTS "Teachers can update their students" ON public.students;
CREATE POLICY "Teachers can update their students"
ON public.students FOR UPDATE
USING (
  teacher_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
)
WITH CHECK (
  teacher_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
);

DROP POLICY IF EXISTS "Teachers can delete their students" ON public.students;
CREATE POLICY "Teachers can delete their students"
ON public.students FOR DELETE
USING (
  teacher_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
);

-- ============================================================================
-- 2. FIX SESSION_RESPONSES TABLE - Add missing RLS policies
-- ============================================================================

-- Drop any existing policies first
DROP POLICY IF EXISTS "Teachers can insert session responses" ON public.session_responses;
DROP POLICY IF EXISTS "Teachers can view session responses" ON public.session_responses;
DROP POLICY IF EXISTS "Parents can view their children's responses" ON public.session_responses;

-- Allow teachers to INSERT responses for their sessions
CREATE POLICY "Teachers can insert session responses"
ON public.session_responses FOR INSERT
WITH CHECK (
  session_id IN (
    SELECT id FROM public.assessment_sessions 
    WHERE teacher_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  )
);

-- Allow teachers to VIEW responses for their sessions
CREATE POLICY "Teachers can view session responses"
ON public.session_responses FOR SELECT
USING (
  session_id IN (
    SELECT id FROM public.assessment_sessions 
    WHERE teacher_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  )
);

-- Allow parents to VIEW responses for their children's sessions (using both parent_id and parent_email)
CREATE POLICY "Parents can view their children's responses"
ON public.session_responses FOR SELECT
USING (
  session_id IN (
    SELECT s.id FROM public.assessment_sessions s
    JOIN public.students st ON s.student_id = st.id
    WHERE st.parent_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
       OR st.parent_email IN (SELECT email FROM public.profiles WHERE user_id = auth.uid())
  )
);

-- ============================================================================
-- 3. FIX ASSESSMENT_SESSIONS TABLE - Add parent access policy
-- ============================================================================

-- Drop old policy if exists
DROP POLICY IF EXISTS "Parents can view their children's sessions" ON public.assessment_sessions;

-- Allow parents to view their children's sessions (using both parent_id and parent_email)
CREATE POLICY "Parents can view their children's sessions"
ON public.assessment_sessions FOR SELECT
USING (
  student_id IN (
    SELECT id FROM public.students
    WHERE parent_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
       OR parent_email IN (SELECT email FROM public.profiles WHERE user_id = auth.uid())
  )
);

-- ============================================================================
-- 4. FIX PROGRESS_REPORTS TABLE - Add parent access policy
-- ============================================================================

-- Drop old policy if exists
DROP POLICY IF EXISTS "Parents can view their children's reports" ON public.progress_reports;

-- Allow parents to view their children's progress reports
CREATE POLICY "Parents can view their children's reports"
ON public.progress_reports FOR SELECT
USING (
  student_id IN (
    SELECT id FROM public.students
    WHERE parent_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
       OR parent_email IN (SELECT email FROM public.profiles WHERE user_id = auth.uid())
  )
);

-- Also ensure teachers can insert progress reports
DROP POLICY IF EXISTS "Teachers can insert progress reports" ON public.progress_reports;
CREATE POLICY "Teachers can insert progress reports"
ON public.progress_reports FOR INSERT
WITH CHECK (
  student_id IN (
    SELECT id FROM public.students
    WHERE teacher_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  )
);

-- ============================================================================
-- VERIFICATION QUERIES (run these to check policies were created)
-- ============================================================================

-- Check students policies
-- SELECT policyname FROM pg_policies WHERE tablename = 'students';

-- Check session_responses policies  
-- SELECT policyname FROM pg_policies WHERE tablename = 'session_responses';

-- Check assessment_sessions policies
-- SELECT policyname FROM pg_policies WHERE tablename = 'assessment_sessions';

-- Check progress_reports policies
-- SELECT policyname FROM pg_policies WHERE tablename = 'progress_reports';
