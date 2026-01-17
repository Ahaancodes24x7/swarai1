@echo off
echo ========================================
echo SWARAI Database Migration Helper
echo ========================================
echo.
echo This will open your browser to apply database migrations.
echo.
echo Your Supabase Project ID: akfwuvlyztijtigrmruc
echo.
echo STEP 1: Opening Supabase SQL Editor...
echo.
start https://supabase.com/dashboard/project/akfwuvlyztijtigrmruc/sql/new
echo.
echo ========================================
echo MANUAL STEPS TO FOLLOW:
echo ========================================
echo.
echo 1. Login to Supabase Dashboard (browser should open now)
echo 2. You should see the SQL Editor
echo.
echo 3. FIRST MIGRATION - Performance Improvements:
echo    - Open: supabase\migrations\20260117000000_performance_improvements.sql
echo    - Copy ALL contents (Ctrl+A, Ctrl+C)
echo    - Paste into SQL Editor
echo    - Click RUN button
echo    - Wait for "Success" message
echo.
echo 4. SECOND MIGRATION - Fix RLS Policies:
echo    - Click "New Query" in SQL Editor
echo    - Open: supabase\migrations\20260117010000_fix_rls_policies.sql
echo    - Copy ALL contents (Ctrl+A, Ctrl+C)
echo    - Paste into SQL Editor
echo    - Click RUN button
echo    - Wait for "Success" message
echo.
echo ========================================
echo VERIFICATION (Run this in SQL Editor):
echo ========================================
echo.
echo SELECT policyname FROM pg_policies WHERE tablename IN ('students', 'session_responses');
echo.
echo Expected: Multiple policy names showing parent and teacher access
echo.
echo ========================================
pause
