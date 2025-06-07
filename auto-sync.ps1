#!/usr/bin/env pwsh

Write-Host "🔄 Auto-syncing National Park Directory repository..." -ForegroundColor Cyan
Write-Host ""

# Change to script directory
Set-Location $PSScriptRoot

try {
    Write-Host "📡 Fetching latest changes from remote..." -ForegroundColor Yellow
    git fetch origin main
    
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to fetch from remote"
    }

    # Check if local is behind remote
    $behindCount = git rev-list --count HEAD..origin/main
    $behind = [int]$behindCount

    if ($behind -gt 0) {
        Write-Host "📥 Found $behind new commit(s). Pulling changes..." -ForegroundColor Green
        git pull origin main
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Repository synchronized successfully!" -ForegroundColor Green
            Write-Host "🎉 $behind new blog post(s) now available locally" -ForegroundColor Green
            
            # List new blog files
            try {
                $newFiles = git diff --name-only HEAD~$behind HEAD | Where-Object { $_ -like "src/content/blog/*" }
                if ($newFiles.Count -gt 0) {
                    Write-Host ""
                    Write-Host "📝 New blog posts:" -ForegroundColor Cyan
                    foreach ($file in $newFiles) {
                        Write-Host "   • $file" -ForegroundColor White
                    }
                }
            } catch {
                Write-Host "ℹ️ Could not list specific files, but sync was successful" -ForegroundColor Yellow
            }
        } else {
            throw "Failed to pull changes"
        }
    } else {
        Write-Host "✅ Repository is already up to date" -ForegroundColor Green
    }

    Write-Host ""
    Write-Host "📊 Current status:" -ForegroundColor Yellow
    git status --porcelain

    Write-Host ""
    Write-Host "⏰ Sync completed at $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Cyan

} catch {
    Write-Host "❌ Error during sync: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}