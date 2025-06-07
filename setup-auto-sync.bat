@echo off
echo 🔧 Setting up automatic repository sync...
echo.

set SCRIPT_DIR=%~dp0
set TASK_NAME=NationalParkDirectory-AutoSync

echo 📋 Creating Windows Task Scheduler task: %TASK_NAME%
echo 🔄 Will run every hour to check for new blog posts

schtasks /create /tn "%TASK_NAME%" /tr "powershell.exe -ExecutionPolicy Bypass -File \"%SCRIPT_DIR%auto-sync.ps1\"" /sc hourly /ru SYSTEM /f

if %ERRORLEVEL% EQU 0 (
    echo ✅ Auto-sync task created successfully!
    echo.
    echo 📅 The task will run every hour and automatically pull new blog posts
    echo 🔍 To check task status: schtasks /query /tn "%TASK_NAME%"
    echo ❌ To remove task: schtasks /delete /tn "%TASK_NAME%" /f
    echo.
    echo 🧪 Testing sync now...
    powershell.exe -ExecutionPolicy Bypass -File "%SCRIPT_DIR%auto-sync.ps1"
) else (
    echo ❌ Failed to create auto-sync task
    echo 💡 Try running as Administrator
)

pause 