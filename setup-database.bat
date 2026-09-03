@echo off
echo ======================================================
echo  Dion Ventures - Automated PostgreSQL Database Setup
echo ======================================================
echo.

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0setup-database.ps1"

pause
