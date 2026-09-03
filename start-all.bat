@echo off
echo ======================================================
echo  Dion Ventures — Full Stack Launcher (All Services)
echo ======================================================
echo.

cd /d "%~dp0"

echo [1/2] Starting PHP Backend (Port 8000)...
start "Dion Ventures PHP Backend" cmd /k "%~dp0start-backend.bat"

timeout /t 2 >nul

echo [2/2] Starting React Frontend (Port 3000)...
cd /d "%~dp0frontend"
npm run dev
