# Build and deploy HealthExtent API container to Azure Container Registry
param(
    [Parameter(Mandatory=$false)]
    [string]$RegistryName = "heacrdeveus2",

    [Parameter(Mandatory=$false)]
    [string]$ImageName = "healthextent-api",

    [Parameter(Mandatory=$false)]
    [string]$ImageTag = "latest"
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Build and Deploy Container" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$apiPath = "C:\Users\Edwin Almetes\Projects\healthextent\api\HealthExtent.Api"

# Step 1: Check if Docker is running
Write-Host "Step 1: Checking Docker..." -ForegroundColor Cyan
docker --version 2>&1 | Out-Null

if ($LASTEXITCODE -ne 0) {
    Write-Host "  ERROR: Docker is not installed or not running" -ForegroundColor Red
    Write-Host ""
    Write-Host "Install Docker Desktop from: https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
    exit 1
}
Write-Host "  Docker is running!" -ForegroundColor Green
Write-Host ""

# Step 2: Login to Azure Container Registry
Write-Host "Step 2: Logging in to Azure Container Registry..." -ForegroundColor Cyan

az acr login --name $RegistryName

if ($LASTEXITCODE -ne 0) {
    Write-Host "  ERROR: Failed to login to Azure Container Registry" -ForegroundColor Red
    Write-Host "  Make sure the registry exists: .\create-container-registry.ps1" -ForegroundColor Yellow
    exit 1
}
Write-Host "  Successfully logged in!" -ForegroundColor Green
Write-Host ""

# Get login server
$registry = az acr show --name $RegistryName | ConvertFrom-Json
$loginServer = $registry.loginServer

$fullImageName = "$loginServer/${ImageName}:$ImageTag"

Write-Host "  Image will be: $fullImageName" -ForegroundColor White
Write-Host ""

# Step 3: Build Docker image
Write-Host "Step 3: Building Docker image..." -ForegroundColor Cyan
Write-Host "  This may take 3-5 minutes for first build..." -ForegroundColor Yellow
Write-Host ""

cd $apiPath

docker build -t $fullImageName -f Dockerfile .

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "  ERROR: Docker build failed!" -ForegroundColor Red
    exit 1
}
Write-Host ""
Write-Host "  SUCCESS: Docker image built!" -ForegroundColor Green
Write-Host ""

# Step 4: Tag image for registry
Write-Host "Step 4: Tagging image..." -ForegroundColor Cyan
Write-Host "  Tag: $fullImageName" -ForegroundColor White
Write-Host "  Image already tagged during build!" -ForegroundColor Green
Write-Host ""

# Step 5: Push to Azure Container Registry
Write-Host "Step 5: Pushing image to Azure Container Registry..." -ForegroundColor Cyan
Write-Host "  This may take 2-5 minutes..." -ForegroundColor Yellow
Write-Host ""

docker push $fullImageName

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "  ERROR: Failed to push image!" -ForegroundColor Red
    exit 1
}
Write-Host ""
Write-Host "  SUCCESS: Image pushed to registry!" -ForegroundColor Green
Write-Host ""

# Step 6: Verify image in registry
Write-Host "Step 6: Verifying image in registry..." -ForegroundColor Cyan

az acr repository show --name $RegistryName --repository $ImageName --output table

Write-Host "  Image verified in registry!" -ForegroundColor Green
Write-Host ""

# Get image digest
$manifest = az acr repository show-manifests `
    --name $RegistryName `
    --repository $ImageName `
    --orderby time_desc `
    --top 1 | ConvertFrom-Json

$digest = $manifest.digest
$createdTime = $manifest.timestamp

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Container Deployed to Registry!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Summary:" -ForegroundColor Yellow
Write-Host "  Registry: $loginServer" -ForegroundColor White
Write-Host "  Image: $ImageName" -ForegroundColor White
Write-Host "  Tag: $ImageTag" -ForegroundColor White
Write-Host "  Full name: $fullImageName" -ForegroundColor White
Write-Host "  Digest: $digest" -ForegroundColor Gray
Write-Host "  Created: $createdTime" -ForegroundColor Gray
Write-Host ""
Write-Host "Next step:" -ForegroundColor Yellow
Write-Host "  Create container instance: .\create-container-instance.ps1" -ForegroundColor White
Write-Host ""
Write-Host "To test locally:" -ForegroundColor Yellow
Write-Host "  docker run -p 8080:8080 -e KeyVaultUri=https://he-kv-dev-eus2.vault.azure.net/ $fullImageName" -ForegroundColor Gray
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan

cd "C:\Users\Edwin Almetes\Projects\healthextent"
