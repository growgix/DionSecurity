# Change location to project root
Set-Location -Path $PSScriptRoot

Write-Host "======================================================" -ForegroundColor Cyan
Write-Host " Dion Ventures — PHP REST API Server (Port 8000)" -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host ""

$phpCmd = Get-Command php -ErrorAction SilentlyContinue
if (-not $phpCmd) {
    if (Test-Path "C:\xampp\php\php.exe") {
        $env:Path = "C:\xampp\php;" + $env:Path
    } else {
        Write-Host "[!] PHP executable not found. Please install PHP or XAMPP." -ForegroundColor Red
        exit 1
    }
}

Write-Host "[✓] Starting PHP Built-in Server on http://localhost:8000" -ForegroundColor Green
Write-Host "    Document root: backend/public" -ForegroundColor Gray
Write-Host "    Press Ctrl+C to terminate." -ForegroundColor Yellow
Write-Host ""

php -S localhost:8000 -t backend/public
