-- Performance and Data Integrity Improvements Migration
-- Created: 2026-01-17

-- Add missing indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_assessment_sessions_student_id 
  ON public.assessment_sessions(student_id);

CREATE INDEX IF NOT EXISTS idx_assessment_sessions_teacher_id 
  ON public.assessment_sessions(teacher_id);

CREATE INDEX IF NOT EXISTS idx_assessment_sessions_created_at 
  ON public.assessment_sessions(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_session_responses_session_id 
  ON public.session_responses(session_id);

CREATE INDEX IF NOT EXISTS idx_students_teacher_id 
  ON public.students(teacher_id);

CREATE INDEX IF NOT EXISTS idx_students_parent_id 
  ON public.students(parent_id);

-- Add composite index for common queries
CREATE INDEX IF NOT EXISTS idx_assessment_sessions_teacher_status 
  ON public.assessment_sessions(teacher_id, status);

CREATE INDEX IF NOT EXISTS idx_assessment_sessions_student_created 
  ON public.assessment_sessions(student_id, created_at DESC);

-- Add check constraint to ensure grade is within valid range
ALTER TABLE public.students 
  ADD CONSTRAINT check_grade_range 
  CHECK (grade IS NULL OR (grade::integer >= 1 AND grade::integer <= 12));

-- Add check constraint to ensure scores are between 0 and 100
ALTER TABLE public.assessment_sessions 
  ADD CONSTRAINT check_overall_score_range 
  CHECK (overall_score IS NULL OR (overall_score >= 0 AND overall_score <= 100));

ALTER TABLE public.assessment_sessions 
  ADD CONSTRAINT check_phoneme_error_rate_range 
  CHECK (phoneme_error_rate IS NULL OR (phoneme_error_rate >= 0 AND phoneme_error_rate <= 100));

-- Add check constraint for response time (should be positive)
ALTER TABLE public.session_responses 
  ADD CONSTRAINT check_response_time_positive 
  CHECK (response_time_ms IS NULL OR response_time_ms > 0);

-- Create function to prevent duplicate students for same teacher
CREATE OR REPLACE FUNCTION public.check_duplicate_student()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Check if student with same name and grade already exists for this teacher
  IF EXISTS (
    SELECT 1 FROM public.students 
    WHERE teacher_id = NEW.teacher_id 
      AND LOWER(name) = LOWER(NEW.name) 
      AND grade = NEW.grade 
      AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)
  ) THEN
    RAISE EXCEPTION 'A student with name "%" and grade "%" already exists for this teacher', NEW.name, NEW.grade;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to check for duplicate students
DROP TRIGGER IF EXISTS trigger_check_duplicate_student ON public.students;
CREATE TRIGGER trigger_check_duplicate_student
BEFORE INSERT OR UPDATE ON public.students
FOR EACH ROW
EXECUTE FUNCTION public.check_duplicate_student();

-- Add updated_at trigger for assessment_sessions
CREATE TRIGGER update_assessment_sessions_updated_at
BEFORE UPDATE ON public.assessment_sessions
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Add function to clean up orphaned records when teacher is deleted
CREATE OR REPLACE FUNCTION public.handle_teacher_deletion()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- When a teacher profile is deleted, update their sessions to mark them
  UPDATE public.assessment_sessions
  SET notes = COALESCE(notes || E'\n', '') || '[Teacher account deleted]'
  WHERE teacher_id = OLD.id;
  
  -- Optionally, you could also unassign students or handle differently
  -- For now, we keep students assigned but mark them
  UPDATE public.students
  SET updated_at = now()
  WHERE teacher_id = OLD.id;
  
  RETURN OLD;
END;
$$;

-- Create trigger for teacher deletion
DROP TRIGGER IF EXISTS trigger_handle_teacher_deletion ON public.profiles;
CREATE TRIGGER trigger_handle_teacher_deletion
BEFORE DELETE ON public.profiles
FOR EACH ROW
WHEN (OLD.role = 'teacher')
EXECUTE FUNCTION public.handle_teacher_deletion();

-- Add function to update session status based on timestamps
CREATE OR REPLACE FUNCTION public.auto_update_session_status()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Auto-update status based on timestamps
  IF NEW.started_at IS NOT NULL AND NEW.completed_at IS NULL THEN
    NEW.status = 'in_progress';
  ELSIF NEW.completed_at IS NOT NULL THEN
    NEW.status = 'completed';
  ELSIF NEW.started_at IS NULL AND NEW.completed_at IS NULL THEN
    NEW.status = 'pending';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for auto status update
DROP TRIGGER IF EXISTS trigger_auto_update_session_status ON public.assessment_sessions;
CREATE TRIGGER trigger_auto_update_session_status
BEFORE INSERT OR UPDATE ON public.assessment_sessions
FOR EACH ROW
EXECUTE FUNCTION public.auto_update_session_status();

-- Create view for session statistics (helps with performance)
CREATE OR REPLACE VIEW public.session_statistics AS
SELECT 
  teacher_id,
  COUNT(*) as total_sessions,
  COUNT(*) FILTER (WHERE status = 'completed') as completed_sessions,
  COUNT(*) FILTER (WHERE flagged = true) as flagged_sessions,
  ROUND(AVG(overall_score) FILTER (WHERE status = 'completed'), 2) as avg_score,
  COUNT(DISTINCT student_id) as unique_students
FROM public.assessment_sessions
GROUP BY teacher_id;

-- Grant access to the view
GRANT SELECT ON public.session_statistics TO authenticated;

-- Add comment to explain the migration
COMMENT ON INDEX idx_assessment_sessions_student_id IS 'Improves query performance when filtering sessions by student';
COMMENT ON INDEX idx_assessment_sessions_teacher_id IS 'Improves query performance when filtering sessions by teacher';
COMMENT ON INDEX idx_assessment_sessions_created_at IS 'Improves sorting performance for session lists';
