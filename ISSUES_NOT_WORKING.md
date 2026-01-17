# 🚨 SWARAI - Features NOT Working (Requires Action)

**Analysis Date:** January 17, 2026  
**Status:** 🔴 5 Critical Issues | 🟠 3 High Priority | 🟡 2 Medium

---

## 🔴 CRITICAL ISSUES (Must Fix Immediately)

### 1. Database Migration Not Applied ❌
**Status:** Code exists, database NOT updated  
**Impact:** HIGH - Core features won't work

**Problem:**
The performance migration file exists locally but **hasn't been applied to your Supabase database yet**.

**What's NOT Working:**
- ❌ Parent auto-linking triggers (parents won't see children)
- ❌ Duplicate student prevention (can create duplicates)
- ❌ Session status auto-updates (stays "pending" forever)
- ❌ Performance indexes (dashboard will be SLOW with >100 records)

**How to Fix:**
```bash
# Option 1: Using Supabase CLI
cd supabase
supabase db push

# Option 2: Manual (Supabase Studio)
1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to SQL Editor
4. Copy contents of: supabase/migrations/20260117000000_performance_improvements.sql
5. Run the SQL
```

**Verify It Worked:**
```sql
-- Check if indexes exist:
SELECT indexname FROM pg_indexes WHERE tablename = 'students';
-- Should see: idx_students_teacher_id, idx_students_parent_id, idx_students_parent_email

-- Check if triggers exist:
SELECT tgname FROM pg_trigger WHERE tgname LIKE '%link%';
-- Should see: trigger_link_student_to_parent, trigger_link_children_to_new_parent
```

---

### 2. RLS Policy Blocks Parent Access ❌
**Status:** Database policy incomplete  
**Impact:** HIGH - Parents cannot see their children

**Problem:**
Row Level Security policy only checks `parent_id`, NOT `parent_email`. This means:
- Teacher adds student with parent email "john@example.com"
- Parent signs up later with "john@example.com"  
- Parent's dashboard shows **EMPTY** (no children)

**Current Policy (BROKEN):**
```sql
CREATE POLICY "Parents can view their children"
ON public.students FOR SELECT
USING (
  parent_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  OR teacher_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
);
```

**Fixed Policy:**
```sql
-- Run this in Supabase SQL Editor:

-- First, drop the old policy
DROP POLICY IF EXISTS "Parents can view their children" ON public.students;

-- Create updated policy that checks BOTH parent_id AND parent_email
CREATE POLICY "Parents can view their children"
ON public.students FOR SELECT
USING (
  parent_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  OR parent_email IN (SELECT email FROM public.profiles WHERE user_id = auth.uid())
  OR teacher_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
);
```

**Test After Fix:**
1. Teacher adds student with parent email
2. Parent signs up with that email
3. Parent dashboard should now show the child

---

### 3. Session Responses RLS Missing ❌
**Status:** No policies defined  
**Impact:** HIGH - Sessions save but responses don't

**Problem:**
The `session_responses` table has RLS enabled but **NO policies created**. This means:
- ✅ Session header saves (assessment_sessions table)
- ❌ Question responses DON'T save (blocked by RLS)
- Teacher sees "Session saved" but it's incomplete

**Fix Required:**
```sql
-- Run this in Supabase SQL Editor:

-- Allow teachers to insert responses for their sessions
CREATE POLICY "Teachers can insert session responses"
ON public.session_responses FOR INSERT
WITH CHECK (
  session_id IN (
    SELECT id FROM public.assessment_sessions 
    WHERE teacher_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  )
);

-- Allow teachers to view responses for their sessions
CREATE POLICY "Teachers can view session responses"
ON public.session_responses FOR SELECT
USING (
  session_id IN (
    SELECT id FROM public.assessment_sessions 
    WHERE teacher_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  )
);

-- Allow parents to view responses for their children's sessions
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
```

**Verify:**
```sql
-- Check policies exist:
SELECT policyname FROM pg_policies WHERE tablename = 'session_responses';
-- Should show 3 policies
```

---

### 4. Assessment Sessions RLS Incomplete ❌
**Status:** Missing parent access policy  
**Impact:** MEDIUM-HIGH - Parents can't see session history

**Problem:**
Parents need to view `assessment_sessions` to see child's history, but policy doesn't exist.

**Fix:**
```sql
-- Add policy for parents to view children's sessions
CREATE POLICY "Parents can view their children's sessions"
ON public.assessment_sessions FOR SELECT
USING (
  student_id IN (
    SELECT id FROM public.students
    WHERE parent_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
       OR parent_email IN (SELECT email FROM public.profiles WHERE user_id = auth.uid())
  )
);
```

---

### 5. Answer Validation NOT Actually Used ❌
**Status:** Code imported but not called  
**Impact:** MEDIUM - All answers use strict matching

**Problem:**
The `answerValidation.ts` module exists (180 lines) but Session.tsx doesn't actually USE it.

**Current Code Issue:**
```typescript
// Session.tsx line ~300-320
const handleSubmitResponse = () => {
  // This is using simple exact matching:
  const isCorrect = transcript.toLowerCase() === questions[currentQuestion].answer.toLowerCase();
  
  // Should be using:
  const validation = validateAnswer(
    transcript,
    questions[currentQuestion].answer,
    sessionType === 'dyscalculia' ? 'number' : 'word'
  );
  const isCorrect = validation.isCorrect;
  const confidence = validation.confidence;
};
```

**Where to Check:**
- File: [src/pages/Session.tsx](src/pages/Session.tsx)
- Look for: `handleSubmitResponse` or similar function
- Search for: `validateAnswer(` - should be called but might not be

**Impact:**
- Student says "apple" but answer is "aple" → Marked WRONG (should be 85% match)
- Student says "seven" but answer is "7" → Marked WRONG (should accept both)
- Math answers with rounding → Marked WRONG (should have tolerance)

---

## 🟠 HIGH PRIORITY ISSUES

### 6. Real-time Updates Only in Parent Dashboard 🔶
**Status:** Partially implemented  
**Impact:** Teacher dashboard needs manual refresh

**What Works:**
- ✅ ParentDashboard updates when student added/changed

**What Doesn't:**
- ❌ TeacherDashboard requires manual refresh
- ❌ Session list doesn't auto-update when session completed
- ❌ Student list doesn't update when parent links

**Fix for TeacherDashboard.tsx:**
```typescript
// Add after line ~50 (after other useEffects)
useEffect(() => {
  if (!profile?.id) return;

  const studentsChannel = supabase
    .channel('teacher-students-realtime')
    .on('postgres_changes', 
      { 
        event: '*', 
        schema: 'public', 
        table: 'students',
        filter: `teacher_id=eq.${profile.id}`
      },
      () => {
        console.log('Student changed, refreshing...');
        fetchStudents();
      }
    )
    .subscribe();

  const sessionsChannel = supabase
    .channel('teacher-sessions-realtime')
    .on('postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'assessment_sessions',
        filter: `teacher_id=eq.${profile.id}`
      },
      () => {
        console.log('Session changed, refreshing...');
        fetchSessions();
      }
    )
    .subscribe();

  return () => {
    studentsChannel.unsubscribe();
    sessionsChannel.unsubscribe();
  };
}, [profile?.id]);
```

---

### 7. Session Recovery Might Not Work ⚠️
**Status:** Code exists but untested edge cases  
**Impact:** Users might lose progress

**Potential Issues:**
1. **2-hour window might be too short**
   - User takes lunch break → session lost
   - Suggestion: Increase to 24 hours

2. **No manual recovery option**
   - localStorage has data but no UI to restore
   - Suggestion: Add "Resume Session" button on dashboard

3. **Multiple students conflict**
   - Teacher does session for Student A
   - Opens new tab for Student B
   - Both use same localStorage key → overwrite

**Suggested Fix:**
```typescript
// In Session.tsx, change localStorage key to include student ID:
const STORAGE_KEY = `swar_session_backup_${studentId}`;

// Add recovery UI in TeacherDashboard.tsx:
const hasBackup = localStorage.getItem(`swar_session_backup_${student.id}`);
{hasBackup && (
  <Button onClick={() => navigate(`/session?student=${student.id}&recover=true`)}>
    Resume Incomplete Session
  </Button>
)}
```

---

### 8. Email Validation Regex Too Simple ⚠️
**Status:** Basic validation might allow invalid emails  
**Impact:** Invalid parent emails stored

**Current:**
```typescript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
```

**Issues:**
- Allows: `test@.com` (invalid)
- Allows: `@example.com` (invalid)  
- Allows: `test@example` (no TLD)

**Better Regex:**
```typescript
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
```

---

## 🟡 MEDIUM PRIORITY ISSUES

### 9. No Error Recovery for Failed Saves 🔶
**Status:** Retry exists but no user action  
**Impact:** Data loss possible

**Problem:**
If all 2 retries fail:
- Toast shows "Failed to save session"
- localStorage has backup
- **User has NO way to retry manually**

**Suggested Fix:**
```typescript
const [saveError, setSaveError] = useState(false);

// After failed save:
if (!success after retries) {
  setSaveError(true);
}

// In JSX:
{saveError && (
  <Alert variant="destructive">
    <AlertTitle>Session Not Saved</AlertTitle>
    <AlertDescription>
      <Button onClick={() => saveSessionToDatabase()}>
        Retry Save
      </Button>
      <Button onClick={() => downloadPDF()}>
        Download as PDF
      </Button>
    </AlertDescription>
  </Alert>
)}
```

---

### 10. Speech Recognition Locale Issues 🔶
**Status:** Hard-coded locales might not match user's system  
**Impact:** Speech recognition might fail

**Current Mapping:**
```typescript
const languageToLocale: Record<Language, string> = {
  en: 'en-IN',  // India English
  hi: 'hi-IN',
  pa: 'pa-IN',
  ta: 'ta-IN',
  te: 'te-IN',
};
```

**Issues:**
- US/UK users forced to use Indian English
- Some browsers don't support all Indian languages
- No fallback if locale not supported

**Suggested Fix:**
```typescript
const languageToLocale: Record<Language, string[]> = {
  en: ['en-IN', 'en-US', 'en-GB'],  // Try in order
  hi: ['hi-IN', 'hi'],
  pa: ['pa-IN', 'pa'],
  ta: ['ta-IN', 'ta'],
  te: ['te-IN', 'te'],
};

// Try each locale until one works:
const initSpeechRecognition = () => {
  const locales = languageToLocale[activeLanguage];
  for (const locale of locales) {
    try {
      recognitionRef.current.lang = locale;
      break;
    } catch (e) {
      console.warn(`Locale ${locale} not supported, trying next...`);
    }
  }
};
```

---

## ✅ WHAT IS WORKING

These features are confirmed working:
- ✅ User authentication (login/signup)
- ✅ Teacher can add students (saves to DB)
- ✅ Teacher can delete students (with confirmation)
- ✅ Session UI loads questions
- ✅ Speech recognition records audio
- ✅ Session completes and shows results
- ✅ localStorage backup saves on each question
- ✅ Parent dashboard shows children (if RLS fixed)
- ✅ Form validation (name, age, grade)
- ✅ PDF export functionality
- ✅ Multi-language support (UI translation)
- ✅ Progress bars and animations

---

## 🎯 PRIORITY FIX ORDER

**Do These First (Today):**
1. Apply database migration (#1)
2. Fix RLS policies (#2, #3, #4)
3. Verify answer validation is used (#5)

**Do These Soon (This Week):**
4. Add real-time to TeacherDashboard (#6)
5. Test session recovery (#7)
6. Improve email validation (#8)

**Can Wait (Nice to Have):**
7. Add manual save retry UI (#9)
8. Improve speech locale handling (#10)

---

## 🧪 HOW TO TEST

After applying fixes, test this flow:

### Test 1: Parent-Child Linking
1. Teacher logs in
2. Add student: Name="Test Child", Parent Email="parent@test.com"
3. Logout
4. Sign up as parent with email "parent@test.com"
5. ✅ Parent dashboard should show "Test Child"
6. ❌ If empty → RLS policy not fixed

### Test 2: Session Save
1. Teacher starts session
2. Answer 3-4 questions
3. Open DevTools → Network tab
4. Submit another answer
5. ✅ Should see POST to session_responses
6. ❌ If 403 error → RLS policy missing

### Test 3: Answer Validation
1. Start dyslexia session
2. Question: "apple", Answer: "aple" (typo)
3. ✅ Should mark as ~80% correct
4. ❌ If marked wrong → validation not used

### Test 4: Real-time Updates
1. Teacher opens dashboard
2. Open second tab → add new student
3. Switch back to first tab
4. ✅ Student should appear automatically (if fixed)
5. ❌ If requires refresh → real-time not added

---

## 📞 NEED HELP?

**Most Common Issue:**
> "Parent dashboard is empty"
→ Fix RLS policies (#2 and #4)

**Second Most Common:**
> "Session says saved but responses missing"
→ Fix session_responses RLS (#3)

**Database Access:**
- Supabase Dashboard: https://supabase.com/dashboard
- Your project → SQL Editor
- Copy/paste the SQL fixes above

**Still Stuck?**
1. Check browser console for errors (F12)
2. Check Supabase logs (Dashboard → Logs)
3. Verify migrations applied: `SELECT * FROM supabase_migrations;`
