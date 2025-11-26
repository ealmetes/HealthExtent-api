$runId = 18944439493
$jobsUrl = "https://api.github.com/repos/ealmetes/HealthExtent-webclient/actions/runs/$runId/jobs"

Write-Host "Fetching workflow job details..." -ForegroundColor Cyan
$response = Invoke-RestMethod -Uri $jobsUrl

foreach ($job in $response.jobs) {
    Write-Host "`n=== Job: $($job.name) ===" -ForegroundColor Yellow
    Write-Host "Status: $($job.status)" -ForegroundColor $(if ($job.conclusion -eq 'success') { 'Green' } else { 'Red' })
    Write-Host "Conclusion: $($job.conclusion)" -ForegroundColor $(if ($job.conclusion -eq 'success') { 'Green' } else { 'Red' })

    Write-Host "`nSteps:" -ForegroundColor Cyan
    foreach ($step in $job.steps) {
        $color = if ($step.conclusion -eq 'success') { 'Green' } elseif ($step.conclusion -eq 'failure') { 'Red' } else { 'Yellow' }
        Write-Host "  - $($step.name): $($step.conclusion)" -ForegroundColor $color

        if ($step.conclusion -eq 'failure') {
            Write-Host "    ^ THIS STEP FAILED ^" -ForegroundColor Red -BackgroundColor Black
        }
    }
}

Write-Host "`n`nView full logs at:" -ForegroundColor Cyan
Write-Host "https://github.com/ealmetes/HealthExtent-webclient/actions/runs/$runId" -ForegroundColor Green
