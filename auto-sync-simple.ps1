Write-Host "Auto-syncing National Park Directory repository..." -ForegroundColor Cyan
Write-Host ""

Set-Location $PSScriptRoot

Write-Host "Fetching latest changes from remote..." -ForegroundColor Yellow
git fetch origin main

$behindCount = git rev-list --count HEAD..origin/main
$behind = [int]$behindCount

if ($behind -gt 0) {
    Write-Host "Found $behind new commit(s). Pulling changes..." -ForegroundColor Green
    git pull origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Repository synchronized successfully!" -ForegroundColor Green
        Write-Host "$behind new blog post(s) now available locally" -ForegroundColor Green
    } else {
        Write-Host "Failed to pull changes" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "Repository is already up to date" -ForegroundColor Green
}

Write-Host ""
Write-Host "Current status:" -ForegroundColor Yellow
git status --porcelain

Write-Host ""
Write-Host "Sync completed at $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Cyan 