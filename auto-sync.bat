@echo off
echo 🔄 Auto-syncing National Park Directory repository...
echo.

cd /d "%~dp0"

echo 📡 Fetching latest changes from remote...
git fetch origin main

echo 🔍 Checking if local is behind remote...
for /f "tokens=*" %%i in ('git rev-list --count HEAD..origin/main') do set BEHIND=%%i

if %BEHIND% GTR 0 (
    echo 📥 Found %BEHIND% new commit(s). Pulling changes...
    git pull origin main
    echo ✅ Repository synchronized successfully!
    echo 🎉 %BEHIND% new blog post(s) now available locally
) else (
    echo ✅ Repository is already up to date
)

echo.
echo 📊 Current status:
git status --porcelain

echo.
echo ⏰ Sync completed at %DATE% %TIME% 