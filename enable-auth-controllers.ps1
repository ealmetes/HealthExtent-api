# Enable [Authorize] attributes on all controllers
$controllersPath = "C:\Users\Edwin Almetes\Projects\healthextent\api\HealthExtent.Api\Controllers"
$controllers = @(
    "PatientsController.cs",
    "EncountersController.cs",
    "HospitalsController.cs",
    "ProvidersController.cs",
    "CareTransitionsController.cs",
    "AuditController.cs"
)

Write-Host "Enabling [Authorize] attributes on controllers..." -ForegroundColor Yellow

foreach ($controller in $controllers) {
    $filePath = Join-Path $controllersPath $controller

    if (Test-Path $filePath) {
        $content = Get-Content $filePath -Raw

        # Remove the commented [Authorize] and keep it active
        $content = $content -replace '// \[Authorize\]  // TEMPORARILY DISABLED FOR TESTING', '[Authorize]'

        $content | Set-Content $filePath -NoNewline

        Write-Host "  Success: $controller" -ForegroundColor Green
    }
    else {
        Write-Host "  Error: $controller (not found)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "SUCCESS: All controllers now require authorization!" -ForegroundColor Green
