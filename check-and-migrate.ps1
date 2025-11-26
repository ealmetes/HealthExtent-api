# PowerShell Script to Check and Migrate CareTransition Schema
param(
    [Parameter(Mandatory=$false)]
    [string]$ServerInstance = "localhost",

    [Parameter(Mandatory=$false)]
    [string]$Database = "healthextent"
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "CareTransition Schema Check & Migration" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check current schema
Write-Host "Step 1: Checking current schema..." -ForegroundColor Yellow
Write-Host ""

$checkScript = Join-Path $PSScriptRoot "database\CHECK_CARETRANSITION_SCHEMA.sql"
$migrateScript = Join-Path $PSScriptRoot "database\MIGRATE_CARETRANSITION_SAFE.sql"

if (-not (Test-Path $checkScript)) {
    Write-Host "Error: Check script not found at: $checkScript" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $migrateScript)) {
    Write-Host "Error: Migration script not found at: $migrateScript" -ForegroundColor Red
    exit 1
}

try {
    # Check if sqlcmd is available
    $sqlcmdExists = Get-Command sqlcmd -ErrorAction SilentlyContinue
    if (-not $sqlcmdExists) {
        Write-Host "Error: sqlcmd not found." -ForegroundColor Red
        Write-Host "Please install SQL Server Command Line Tools." -ForegroundColor Yellow
        exit 1
    }

    # Run check script
    Write-Host "Running schema check..." -ForegroundColor Cyan
    & sqlcmd -S $ServerInstance -d $Database -E -i $checkScript

    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""

    # Ask if user wants to run migration
    $runMigration = Read-Host "Do you want to run the migration? (yes/no)"

    if ($runMigration -eq "yes") {
        Write-Host ""
        Write-Host "Step 2: Running migration..." -ForegroundColor Yellow
        Write-Host ""

        & sqlcmd -S $ServerInstance -d $Database -E -i $migrateScript

        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "========================================" -ForegroundColor Green
            Write-Host "Migration completed successfully!" -ForegroundColor Green
            Write-Host "========================================" -ForegroundColor Green
            Write-Host ""
            Write-Host "IMPORTANT: Please restart your API application!" -ForegroundColor Yellow
        }
    } else {
        Write-Host ""
        Write-Host "Migration skipped." -ForegroundColor Yellow
    }

} catch {
    Write-Host ""
    Write-Host "Error: $_" -ForegroundColor Red
    exit 1
}
