# Create Azure Container Registry for HealthExtent API
param(
    [Parameter(Mandatory=$false)]
    [string]$RegistryName = "heacrdeveus2",

    [Parameter(Mandatory=$false)]
    [string]$ResourceGroup = "he-rg-apps-dev-eus2",

    [Parameter(Mandatory=$false)]
    [string]$Location = "eastus2",

    [Parameter(Mandatory=$false)]
    [string]$Sku = "Basic"
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Create Azure Container Registry" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Configuration:" -ForegroundColor Yellow
Write-Host "  Registry: $RegistryName" -ForegroundColor White
Write-Host "  Resource Group: $ResourceGroup" -ForegroundColor White
Write-Host "  Location: $Location" -ForegroundColor White
Write-Host "  SKU: $Sku" -ForegroundColor White
Write-Host ""

# Step 1: Ensure Resource Group exists
Write-Host "Step 1: Ensuring Resource Group exists..." -ForegroundColor Cyan
$rgExists = az group exists --name $ResourceGroup

if ($rgExists -eq "false") {
    Write-Host "  Creating Resource Group..." -ForegroundColor Yellow
    az group create --name $ResourceGroup --location $Location --output table

    if ($LASTEXITCODE -eq 0) {
        Write-Host "  SUCCESS: Resource Group created!" -ForegroundColor Green
    } else {
        Write-Host "  ERROR: Failed to create Resource Group" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "  Resource Group already exists!" -ForegroundColor Green
}
Write-Host ""

# Step 2: Create Container Registry
Write-Host "Step 2: Creating Container Registry..." -ForegroundColor Cyan
Write-Host "  This may take 2-3 minutes..." -ForegroundColor Yellow
Write-Host ""

az acr create `
    --name $RegistryName `
    --resource-group $ResourceGroup `
    --location $Location `
    --sku $Sku `
    --admin-enabled true `
    --output table

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "  SUCCESS: Container Registry created!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "  ERROR: Failed to create Container Registry" -ForegroundColor Red
    Write-Host "  The registry name might be taken globally" -ForegroundColor Yellow
    exit 1
}
Write-Host ""

# Step 3: Get registry credentials
Write-Host "Step 3: Getting registry credentials..." -ForegroundColor Cyan

$registry = az acr show --name $RegistryName --resource-group $ResourceGroup | ConvertFrom-Json
$loginServer = $registry.loginServer

$credentials = az acr credential show --name $RegistryName --resource-group $ResourceGroup | ConvertFrom-Json
$username = $credentials.username
$password = $credentials.passwords[0].value

Write-Host "  Login Server: $loginServer" -ForegroundColor White
Write-Host "  Username: $username" -ForegroundColor White
Write-Host "  Password: ***hidden***" -ForegroundColor Gray
Write-Host ""

# Step 4: Save configuration
Write-Host "Step 4: Saving configuration..." -ForegroundColor Cyan

$config = @{
    RegistryName = $RegistryName
    ResourceGroup = $ResourceGroup
    Location = $Location
    LoginServer = $loginServer
    Username = $username
    Password = $password
    ImageName = "healthextent-api"
    ImageTag = "latest"
} | ConvertTo-Json

$config | Out-File "acr-config.json" -Encoding UTF8

Write-Host "  Configuration saved to: acr-config.json" -ForegroundColor Green
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Container Registry Created!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Summary:" -ForegroundColor Yellow
Write-Host "  Registry: $RegistryName" -ForegroundColor White
Write-Host "  Login Server: $loginServer" -ForegroundColor White
Write-Host "  SKU: $Sku" -ForegroundColor White
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Build and push image: .\deploy-container.ps1" -ForegroundColor White
Write-Host "  2. Create container instance: .\create-container-instance.ps1" -ForegroundColor White
Write-Host ""
Write-Host "Login to registry:" -ForegroundColor Yellow
Write-Host "  az acr login --name $RegistryName" -ForegroundColor White
Write-Host "  docker login $loginServer -u $username -p ********" -ForegroundColor Gray
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
