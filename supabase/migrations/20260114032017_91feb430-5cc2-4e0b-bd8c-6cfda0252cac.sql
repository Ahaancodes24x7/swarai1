-- Add parent_email column to students table for linking
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS parent_email text;

-- Create an index on parent_email for faster lookups
CREATE INDEX IF NOT EXISTS idx_students_parent_email ON public.students(parent_email);

-- Create a function to automatically link students to parents based on email
CREATE OR REPLACE FUNCTION public.link_student_to_parent()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  parent_profile_id uuid;
BEGIN
  -- If parent_email is set, find the parent profile with that email
  IF NEW.parent_email IS NOT NULL AND NEW.parent_email != '' THEN
    SELECT id INTO parent_profile_id
    FROM public.profiles
    WHERE email = NEW.parent_email AND role = 'parent'
    LIMIT 1;
    
    IF parent_profile_id IS NOT NULL THEN
      NEW.parent_id := parent_profile_id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to auto-link students when parent_email is set
DROP TRIGGER IF EXISTS trigger_link_student_to_parent ON public.students;
CREATE TRIGGER trigger_link_student_to_parent
BEFORE INSERT OR UPDATE OF parent_email ON public.students
FOR EACH ROW
EXECUTE FUNCTION public.link_student_to_parent();

-- Also create trigger for when a parent signs up to link their children
CREATE OR REPLACE FUNCTION public.link_children_to_new_parent()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- When a new parent profile is created, link any students with matching parent_email
  IF NEW.role = 'parent' THEN
    UPDATE public.students
    SET parent_id = NEW.id
    WHERE parent_email = NEW.email AND parent_id IS NULL;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger on profiles for new parent signups
DROP TRIGGER IF EXISTS trigger_link_children_to_new_parent ON public.profiles;
CREATE TRIGGER trigger_link_children_to_new_parent
AFTER INSERT ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.link_children_to_new_parent();