@echo off
echo ======================================================
echo  Dion Ventures — Starting PHP REST API Server
echo ======================================================
echo.

:: Change to root directory of the project
cd /d "%~dp0"

:: Check if php is in PATH or XAMPP
where php >nul 2>nul
if %errorlevel% neq 0 (
    if exist "C:\xampp\php\php.exe" (
        set "PATH=C:\xampp\php;%PATH%"
    ) else (
        echo [ERROR] PHP executable not found. Please install PHP or XAMPP.
        pause
        exit /b 1
    )
)

echo Starting PHP server at http://localhost:8000 ...
echo Press Ctrl+C to stop the server.
echo.

php -S localhost:8000 -t backend/public
pause
