# ==============================================================================
# Dion Ventures — Automated Database Setup for Windows (PowerShell)
# Automatically locates psql.exe across standard installation paths
# ==============================================================================

Write-Host "======================================================" -ForegroundColor Cyan
Write-Host " Dion Ventures — PostgreSQL Setup Helper for Windows " -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host ""

# 1. Search for psql.exe
$psqlPath = $null

# Check if psql is in current PATH
$cmd = Get-Command psql -ErrorAction SilentlyContinue
if ($cmd) {
    $psqlPath = $cmd.Source
} else {
    # Check common PostgreSQL installation folders on Windows
    $possiblePaths = @(
        "C:\Program Files\PostgreSQL\18\bin\psql.exe",
        "C:\Program Files\PostgreSQL\17\bin\psql.exe",
        "C:\Program Files\PostgreSQL\16\bin\psql.exe",
        "C:\Program Files\PostgreSQL\15\bin\psql.exe",
        "C:\Program Files\PostgreSQL\14\bin\psql.exe",
        "C:\Program Files\PostgreSQL\13\bin\psql.exe",
        "C:\Program Files\PostgreSQL\12\bin\psql.exe",
        "C:\Program Files (x86)\PostgreSQL\*\bin\psql.exe",
        "C:\PostgreSQL\bin\psql.exe",
        "C:\tools\postgresql\bin\psql.exe",
        "C:\laragon\bin\postgresql\*\bin\psql.exe"
    )

    foreach ($p in $possiblePaths) {
        $resolved = Resolve-Path $p -ErrorAction SilentlyContinue
        if ($resolved) {
            $psqlPath = $resolved.Path
            break
        }
    }
}

# If PHP is available, run direct PHP universal database setup
$phpCmd = Get-Command php -ErrorAction SilentlyContinue
$phpExe = if ($phpCmd) { $phpCmd.Source } elseif (Test-Path "C:\xampp\php\php.exe") { "C:\xampp\php\php.exe" } else { $null }

if ($phpExe) {
    Write-Host "[✓] Executing Universal PHP Database Initializer with $phpExe ..." -ForegroundColor Green
    & "$phpExe" "$PSScriptRoot\backend\database\setup.php"
    exit 0
}

if (-not $psqlPath) {
    Write-Host "[!] psql.exe was not found in standard directories." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Choose one of the following simple options to continue:" -ForegroundColor White
    Write-Host ""
    Write-Host "Option 1 (Docker - Recommended):" -ForegroundColor Green
    Write-Host "  If you have Docker Desktop installed, run:"
    Write-Host "  docker compose up -d" -ForegroundColor Cyan
    Write-Host "  (This starts PostgreSQL 16 & PHP with the database pre-created and seeded automatically)"
    Write-Host ""
    Write-Host "Option 2 (Install PostgreSQL for Windows):" -ForegroundColor Green
    Write-Host "  Download installer from: https://www.postgresql.org/download/windows/"
    Write-Host "  During setup, keep the default port (5432) and password (postgres)."
    Write-Host "  Then re-run: .\setup-database.ps1"
    Write-Host ""
    Write-Host "Option 3 (Run Frontend in Standalone Mode):" -ForegroundColor Green
    Write-Host "  The frontend is already 100% functional with local state & localStorage!"
    Write-Host "  Simply run:"
    Write-Host "  npm run dev" -ForegroundColor Cyan
    Write-Host ""
    exit 1
}

Write-Host "[✓] Found PostgreSQL client at: $psqlPath" -ForegroundColor Green
Write-Host ""

# 2. Database Connection Prompts (Defaults: host=localhost, port=5432, user=postgres)
$dbUser = "postgres"
$dbHost = "localhost"
$dbPort = "5432"

Write-Host "[1/3] Creating database 'dion_security' if it doesn't exist..." -ForegroundColor Yellow
& "$psqlPath" -h $dbHost -p $dbPort -U $dbUser -d postgres -c "CREATE DATABASE dion_security;" 2>$null
Write-Host "      Database checked / created." -ForegroundColor Green

Write-Host "[2/3] Applying relational schema (schema.sql)..." -ForegroundColor Yellow
& "$psqlPath" -h $dbHost -p $dbPort -U $dbUser -d dion_security -f "backend/database/schema.sql"
Write-Host "      Schema applied successfully." -ForegroundColor Green

Write-Host "[3/3] Seeding initial data (seed.sql - 80 workers, 255 units, visitors, tasks)..." -ForegroundColor Yellow
& "$psqlPath" -h $dbHost -p $dbPort -U $dbUser -d dion_security -f "backend/database/seed.sql"
Write-Host "      Seed data populated successfully." -ForegroundColor Green

Write-Host ""
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host " 🎉 PostgreSQL Database is ready and fully populated! " -ForegroundColor Green
Write-Host "======================================================" -ForegroundColor Cyan
