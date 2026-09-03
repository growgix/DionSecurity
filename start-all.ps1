# ==============================================================================
# Dion Ventures — Unified Launcher (Backend + Frontend)
# ==============================================================================

Set-Location -Path $PSScriptRoot

Write-Host "======================================================" -ForegroundColor Cyan
Write-Host " Dion Ventures — Full Stack Launcher" -ForegroundColor Cyan
Write-Host " Backend: http://localhost:8000" -ForegroundColor Yellow
Write-Host " Frontend: http://localhost:3000" -ForegroundColor Green
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host ""

# Start backend in a background process
$backendProcess = Start-Process powershell -ArgumentList "-ExecutionPolicy Bypass -NoExit -File `"$PSScriptRoot\start-backend.ps1`"" -PassThru
Write-Host "[✓] Started PHP Backend Server (PID: $($backendProcess.Id))" -ForegroundColor Green

# Start frontend
Set-Location -Path "$PSScriptRoot\frontend"
Write-Host "[✓] Starting Frontend Vite Server on http://localhost:3000 ..." -ForegroundColor Cyan
npm run dev
