# PowerShell Script to Run CareTransition Migration
# This script will execute the database migration to convert key fields to strings

param(
    [Parameter(Mandatory=$false)]
    [string]$ServerInstance = "localhost",

    [Parameter(Mandatory=$false)]
    [string]$Database = "healthextent",

    [Parameter(Mandatory=$false)]
    [string]$Username,

    [Parameter(Mandatory=$false)]
    [string]$Password
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "CareTransition Key Migration Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$scriptPath = Join-Path $PSScriptRoot "database\MIGRATE_CARETRANSITION_KEYS_TO_STRING.sql"

if (-not (Test-Path $scriptPath)) {
    Write-Host "Error: Migration script not found at: $scriptPath" -ForegroundColor Red
    exit 1
}

Write-Host "Migration script found: $scriptPath" -ForegroundColor Green
Write-Host ""
Write-Host "Database Details:" -ForegroundColor Yellow
Write-Host "  Server: $ServerInstance" -ForegroundColor White
Write-Host "  Database: $Database" -ForegroundColor White
Write-Host ""

# Build connection parameters
$sqlcmdParams = @(
    "-S", $ServerInstance,
    "-d", $Database,
    "-i", $scriptPath
)

# Add credentials if provided
if ($Username -and $Password) {
    Write-Host "Using SQL Server Authentication" -ForegroundColor Yellow
    $sqlcmdParams += "-U"
    $sqlcmdParams += $Username
    $sqlcmdParams += "-P"
    $sqlcmdParams += $Password
} else {
    Write-Host "Using Windows Authentication" -ForegroundColor Yellow
    $sqlcmdParams += "-E"
}

Write-Host ""
Write-Host "WARNING: This migration will:" -ForegroundColor Yellow
Write-Host "  1. Convert CareTransitionKey from INT to NVARCHAR(64)" -ForegroundColor White
Write-Host "  2. Convert CareManagerUserKey from INT to NVARCHAR(64)" -ForegroundColor White
Write-Host "  3. Convert AssignedToUserKey from INT to NVARCHAR(64)" -ForegroundColor White
Write-Host "  4. Convert ClosedByUserKey from INT to NVARCHAR(64)" -ForegroundColor White
Write-Host "  5. Drop and recreate constraints/indexes" -ForegroundColor White
Write-Host ""
Write-Host "IMPORTANT: Make sure you have a database backup before proceeding!" -ForegroundColor Red
Write-Host ""

$confirm = Read-Host "Do you want to proceed? (yes/no)"

if ($confirm -ne "yes") {
    Write-Host "Migration cancelled." -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "Running migration..." -ForegroundColor Cyan
Write-Host ""

try {
    # Check if sqlcmd is available
    $sqlcmdExists = Get-Command sqlcmd -ErrorAction SilentlyContinue

    if (-not $sqlcmdExists) {
        Write-Host "Error: sqlcmd not found. Please install SQL Server Command Line Tools." -ForegroundColor Red
        Write-Host "Download from: https://learn.microsoft.com/en-us/sql/tools/sqlcmd/sqlcmd-utility" -ForegroundColor Yellow
        exit 1
    }

    # Execute the migration
    & sqlcmd @sqlcmdParams

    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "Migration completed successfully!" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "Next steps:" -ForegroundColor Yellow
        Write-Host "  1. Restart your API application" -ForegroundColor White
        Write-Host "  2. Test the CareTransitions endpoints" -ForegroundColor White
        Write-Host "  3. Verify that string keys are working properly" -ForegroundColor White
    } else {
        Write-Host ""
        Write-Host "Migration failed with exit code: $LASTEXITCODE" -ForegroundColor Red
        Write-Host "Please check the error messages above." -ForegroundColor Yellow
        exit 1
    }
} catch {
    Write-Host ""
    Write-Host "Error executing migration: $_" -ForegroundColor Red
    exit 1
}
