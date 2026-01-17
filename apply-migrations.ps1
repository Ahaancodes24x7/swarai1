# ========================================
# SWARAI Database Migration Helper
# ========================================

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "SWARAI Database Migration Helper" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Your Supabase Project ID: " -NoNewline
Write-Host "akfwuvlyztijtigrmruc`n" -ForegroundColor Yellow

Write-Host "Opening Supabase SQL Editor in browser...`n" -ForegroundColor Green
Start-Process "https://supabase.com/dashboard/project/akfwuvlyztijtigrmruc/sql/new"

Start-Sleep -Seconds 2

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "STEP-BY-STEP INSTRUCTIONS:" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "[1/4] " -ForegroundColor Yellow -NoNewline
Write-Host "Login to Supabase (browser opened)`n"

Write-Host "[2/4] " -ForegroundColor Yellow -NoNewline
Write-Host "Apply FIRST Migration (Performance):"
Write-Host "      File: " -NoNewline
Write-Host "supabase\migrations\20260117000000_performance_improvements.sql" -ForegroundColor Green
Write-Host "      - Open the file in VS Code"
Write-Host "      - Select ALL (Ctrl+A)"
Write-Host "      - Copy (Ctrl+C)"
Write-Host "      - Paste into Supabase SQL Editor"
Write-Host "      - Click " -NoNewline
Write-Host "RUN" -ForegroundColor Green -NoNewline
Write-Host " button"
Write-Host "      - Wait for " -NoNewline
Write-Host "Success" -ForegroundColor Green -NoNewline
Write-Host " message`n"

Write-Host "[3/4] " -ForegroundColor Yellow -NoNewline
Write-Host "Apply SECOND Migration (RLS Fixes):"
Write-Host "      File: " -NoNewline
Write-Host "supabase\migrations\20260117010000_fix_rls_policies.sql" -ForegroundColor Green
Write-Host "      - Click 'New Query' in SQL Editor"
Write-Host "      - Open the file in VS Code"
Write-Host "      - Select ALL (Ctrl+A)"
Write-Host "      - Copy (Ctrl+C)"
Write-Host "      - Paste into Supabase SQL Editor"
Write-Host "      - Click " -NoNewline
Write-Host "RUN" -ForegroundColor Green -NoNewline
Write-Host " button"
Write-Host "      - Wait for " -NoNewline
Write-Host "Success" -ForegroundColor Green -NoNewline
Write-Host " message`n"

Write-Host "[4/4] " -ForegroundColor Yellow -NoNewline
Write-Host "Verify migrations worked:"
Write-Host "      Run this query in SQL Editor:`n" 

Write-Host "      SELECT policyname FROM pg_policies" -ForegroundColor Magenta
Write-Host "      WHERE tablename IN ('students', 'session_responses');" -ForegroundColor Magenta

Write-Host "`n      Expected: You should see multiple policy names" -ForegroundColor Green
Write-Host "      Including: 'Parents can view their children'" -ForegroundColor Green
Write-Host "                'Teachers can insert session responses'`n" -ForegroundColor Green

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "WHAT GETS FIXED:" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "[✓] " -ForegroundColor Green -NoNewline
Write-Host "Parents can see children added before they signed up"

Write-Host "[✓] " -ForegroundColor Green -NoNewline
Write-Host "Session responses save to database correctly"

Write-Host "[✓] " -ForegroundColor Green -NoNewline
Write-Host "Database indexes for fast queries"

Write-Host "[✓] " -ForegroundColor Green -NoNewline
Write-Host "Auto-linking when parents sign up"

Write-Host "[✓] " -ForegroundColor Green -NoNewline
Write-Host "Duplicate student prevention"

Write-Host "[✓] " -ForegroundColor Green -NoNewline
Write-Host "Data validation constraints`n"

Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Press any key to close..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
