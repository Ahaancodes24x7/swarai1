# 🚀 How to Apply Database Migrations to Supabase

You have **3 migration files** that need to be applied to your Supabase database:

1. ✅ `20260111111456_*.sql` - Initial schema (probably already applied)
2. ✅ `20260114032017_*.sql` - Parent email linking (probably already applied)
3. ⚠️ `20260117000000_performance_improvements.sql` - **NEEDS TO BE APPLIED**
4. ⚠️ `20260117010000_fix_rls_policies.sql` - **NEEDS TO BE APPLIED** (just created)

---

## 🎯 Quick Start (Choose ONE Method)

### **Method 1: Supabase Dashboard (Easiest - 2 minutes)**

1. **Go to your Supabase Dashboard:**
   - Visit: https://supabase.com/dashboard
   - Select your project

2. **Open SQL Editor:**
   - Click **"SQL Editor"** in left sidebar
   - Click **"New Query"**

3. **Apply Performance Migration:**
   - Open file: `supabase/migrations/20260117000000_performance_improvements.sql`
   - Copy ALL contents (Ctrl+A, Ctrl+C)
   - Paste into Supabase SQL Editor
   - Click **"Run"** (or press Ctrl+Enter)
   - Wait for success message

4. **Apply RLS Fixes:**
   - Open file: `supabase/migrations/20260117010000_fix_rls_policies.sql`
   - Copy ALL contents
   - Paste into NEW query in SQL Editor
   - Click **"Run"**
   - Wait for success message

5. **Verify It Worked:**
   ```sql
   -- Copy and run this verification query:
   SELECT 
     'students' as table_name, 
     COUNT(*) as policy_count 
   FROM pg_policies 
   WHERE tablename = 'students'
   UNION ALL
   SELECT 
     'session_responses', 
     COUNT(*) 
   FROM pg_policies 
   WHERE tablename = 'session_responses'
   UNION ALL
   SELECT 
     'assessment_sessions', 
     COUNT(*) 
   FROM pg_policies 
   WHERE tablename = 'assessment_sessions';
   ```
   
   **Expected Results:**
   - students: 4 policies
   - session_responses: 3 policies
   - assessment_sessions: should have parent access policy

---

### **Method 2: Supabase CLI (Developers)**

1. **Check if Supabase CLI is installed:**
   ```powershell
   supabase --version
   ```
   
   If not installed:
   ```powershell
   npm install -g supabase
   ```

2. **Login to Supabase:**
   ```powershell
   supabase login
   ```

3. **Link to your project:**
   ```powershell
   cd C:\Users\chilk\Downloads\swarai1-main\swarai1-main
   supabase link --project-ref YOUR_PROJECT_REF
   ```
   
   Find YOUR_PROJECT_REF at: https://supabase.com/dashboard → Settings → API

4. **Push migrations:**
   ```powershell
   supabase db push
   ```

5. **Verify:**
   ```powershell
   supabase db remote list
   ```

---

## ✅ How to Verify Everything Works

After applying migrations, test with these steps:

### **Test 1: Parent Can See Children (RLS Fix)**
1. **As Teacher:**
   - Login to app
   - Add student with:
     - Name: "Test Child"
     - Parent Email: "testparent@example.com"
   
2. **As Parent:**
   - Logout
   - Sign up new account with email: "testparent@example.com"
   - Login
   - Go to Parent Dashboard
   - ✅ **Should see "Test Child"** immediately
   - ❌ **If empty** → RLS policy not applied correctly

### **Test 2: Session Saves Correctly**
1. **As Teacher:**
   - Start a session for any student
   - Answer 2-3 questions
   - Complete session
   
2. **Verify in Supabase:**
   - Go to Supabase Dashboard → Table Editor
   - Click **"assessment_sessions"** table
   - ✅ **Should see new row** with status "completed"
   - Click **"session_responses"** table
   - ✅ **Should see 2-3 rows** (one per question)
   - ❌ **If no rows in session_responses** → RLS policy missing

### **Test 3: Performance (Indexes Working)**
1. **Check indexes exist:**
   ```sql
   -- Run in SQL Editor:
   SELECT 
     schemaname, 
     tablename, 
     indexname 
   FROM pg_indexes 
   WHERE tablename IN ('students', 'assessment_sessions', 'session_responses')
   ORDER BY tablename, indexname;
   ```
   
   ✅ **Should see:**
   - `idx_students_teacher_id`
   - `idx_students_parent_id`
   - `idx_students_parent_email`
   - `idx_assessment_sessions_student_id`
   - `idx_assessment_sessions_teacher_id`
   - `idx_session_responses_session_id`
   - And more...

### **Test 4: Auto-Linking Works (Triggers)**
1. **Check triggers exist:**
   ```sql
   -- Run in SQL Editor:
   SELECT 
     tgname, 
     tgrelid::regclass 
   FROM pg_trigger 
   WHERE tgname LIKE '%link%' 
      OR tgname LIKE '%duplicate%'
      OR tgname LIKE '%status%';
   ```
   
   ✅ **Should see:**
   - `trigger_link_student_to_parent`
   - `trigger_link_children_to_new_parent`
   - `trigger_check_duplicate_student`
   - `trigger_auto_update_session_status`

2. **Test auto-linking:**
   - Teacher adds student with parent email "newparent@test.com"
   - Parent signs up with email "newparent@test.com"
   - ✅ Student should automatically link (parent_id gets filled)
   - Check in Table Editor → students table → parent_id column should have UUID

---

## 🐛 Troubleshooting

### **Error: "policy already exists"**
- **Solution:** This is OK! It means policy was already created. Continue.

### **Error: "permission denied"**
- **Solution:** Make sure you're logged in as the project owner in Supabase dashboard.

### **Error: "relation does not exist"**
- **Solution:** You need to apply the first 2 migrations first:
  1. Apply `20260111111456_*.sql`
  2. Apply `20260114032017_*.sql`
  3. Then apply the new ones

### **Parent Dashboard Still Empty**
- **Check 1:** Verify RLS policies applied:
  ```sql
  SELECT policyname FROM pg_policies WHERE tablename = 'students';
  ```
  Should show: "Parents can view their children"

- **Check 2:** Check student has parent_email:
  ```sql
  SELECT name, parent_email, parent_id FROM students;
  ```

- **Check 3:** Check parent profile email matches:
  ```sql
  SELECT email, role FROM profiles WHERE role = 'parent';
  ```

### **Session Responses Not Saving**
- **Check:** Run this to see if policies exist:
  ```sql
  SELECT policyname FROM pg_policies WHERE tablename = 'session_responses';
  ```
  
  Should show at least:
  - "Teachers can insert session responses"
  - "Teachers can view session responses"

---

## 📋 Complete Migration Checklist

- [ ] **Step 1:** Login to Supabase Dashboard
- [ ] **Step 2:** Open SQL Editor
- [ ] **Step 3:** Apply `20260117000000_performance_improvements.sql`
- [ ] **Step 4:** Verify no errors
- [ ] **Step 5:** Apply `20260117010000_fix_rls_policies.sql`
- [ ] **Step 6:** Verify no errors
- [ ] **Step 7:** Run verification queries
- [ ] **Step 8:** Test parent dashboard (add student with parent email)
- [ ] **Step 9:** Test session saving (complete a session)
- [ ] **Step 10:** Check indexes exist
- [ ] **Step 11:** Check triggers exist
- [ ] **Step 12:** Test auto-linking (parent signs up)

---

## 🎉 Success Indicators

After applying migrations, you should have:

✅ **8 Database Indexes** for performance
✅ **4 Data Constraints** preventing invalid data
✅ **4 Triggers** for automation
✅ **1 Statistics View** for dashboard
✅ **RLS Policies** allowing parent access
✅ **Session Responses** saving correctly
✅ **Auto-linking** when parents sign up
✅ **Duplicate Prevention** for students

---

## 🚨 IMPORTANT NOTES

1. **These migrations are SAFE:**
   - No data is deleted
   - All changes are additive (indexes, constraints, policies)
   - Existing data remains unchanged

2. **Apply in ORDER:**
   - First: performance_improvements.sql
   - Second: fix_rls_policies.sql

3. **Backup recommended:**
   - Supabase auto-backups daily
   - Or export tables before applying: Table Editor → Export to CSV

4. **Takes ~30 seconds:**
   - Each migration runs in 10-15 seconds
   - Supabase shows progress indicator

---

## 💡 Quick Reference

**Supabase Dashboard:** https://supabase.com/dashboard  
**SQL Editor:** Dashboard → SQL Editor (left sidebar)  
**Table Editor:** Dashboard → Table Editor  
**Logs:** Dashboard → Logs (to debug issues)  

**Files to Apply:**
1. `supabase/migrations/20260117000000_performance_improvements.sql`
2. `supabase/migrations/20260117010000_fix_rls_policies.sql`

**Questions?**
- Check Supabase docs: https://supabase.com/docs
- Review error in SQL Editor output
- Check browser console (F12) for frontend errors
