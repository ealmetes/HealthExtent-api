# Check Azure quota across multiple regions
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Checking Azure Quota Across Regions" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$regions = @(
    @{Name="eastus"; Display="East US"},
    @{Name="eastus2"; Display="East US 2"},
    @{Name="westus"; Display="West US"},
    @{Name="westus2"; Display="West US 2"},
    @{Name="centralus"; Display="Central US"},
    @{Name="southcentralus"; Display="South Central US"},
    @{Name="northcentralus"; Display="North Central US"},
    @{Name="westus3"; Display="West US 3"}
)

$results = @()

foreach ($region in $regions) {
    Write-Host "Checking $($region.Display) ($($region.Name))..." -ForegroundColor Yellow

    try {
        $usage = az vm list-usage --location $region.Name 2>$null | ConvertFrom-Json

        if ($usage) {
            # Check for Standard A family (typically used by App Services)
            $standardA = $usage | Where-Object { $_.localName -like "Standard A*" } | Select-Object -First 1

            if ($standardA) {
                $result = [PSCustomObject]@{
                    Region = $region.Display
                    Location = $region.Name
                    CurrentUsage = $standardA.currentValue
                    Limit = $standardA.limit
                    Available = $standardA.limit - $standardA.currentValue
                    Status = if ($standardA.limit -gt 0) { "✅ Has Quota" } else { "❌ No Quota" }
                }

                $results += $result

                if ($standardA.limit -gt 0) {
                    Write-Host "  ✅ Quota available: $($standardA.limit) vCPUs" -ForegroundColor Green
                } else {
                    Write-Host "  ❌ No quota available" -ForegroundColor Red
                }
            } else {
                Write-Host "  ⚠ Could not determine quota" -ForegroundColor Yellow
            }
        }
    } catch {
        Write-Host "  ❌ Error checking region" -ForegroundColor Red
    }

    Write-Host ""
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$results | Format-Table -AutoSize

# Find regions with available quota
$availableRegions = $results | Where-Object { $_.Limit -gt 0 }

if ($availableRegions.Count -gt 0) {
    Write-Host ""
    Write-Host "✅ GOOD NEWS: Found $($availableRegions.Count) region(s) with available quota!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Recommended regions:" -ForegroundColor Yellow

    foreach ($region in $availableRegions) {
        Write-Host "  - $($region.Region) ($($region.Location)): $($region.Limit) vCPUs available" -ForegroundColor Green
    }

    Write-Host ""
    Write-Host "To use a different region, update the scripts:" -ForegroundColor Yellow
    Write-Host "  1. Edit create-app-service-free.ps1" -ForegroundColor White
    Write-Host "  2. Change: [string]`$Location = ""$($availableRegions[0].Location)""" -ForegroundColor White
    Write-Host "  3. Run: .\create-app-service-free.ps1" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "❌ No regions found with available quota" -ForegroundColor Red
    Write-Host ""
    Write-Host "This means your Free Trial subscription has 0 quota across all regions." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Options:" -ForegroundColor Yellow
    Write-Host "  1. Upgrade subscription (recommended) - See SUBSCRIPTION_UPGRADE_GUIDE.md" -ForegroundColor White
    Write-Host "  2. Request quota increase - See DEPLOYMENT_OPTIONS.md" -ForegroundColor White
    Write-Host "  3. Use Azure Container Instances - No quota limits" -ForegroundColor White
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
