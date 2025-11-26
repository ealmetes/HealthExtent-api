# Protect token generation endpoint - only allow in development
$filePath = "C:\Users\Edwin Almetes\Projects\healthextent\api\HealthExtent.Api\Controllers\AuthController.cs"

Write-Host "Protecting token generation endpoint..." -ForegroundColor Yellow

# Read the file
$content = Get-Content $filePath -Raw

# Add IWebHostEnvironment to the class
$oldConstructor = @'
    private readonly IConfiguration _configuration;
    private readonly ILogger<AuthController> _logger;

    public AuthController(IConfiguration configuration, ILogger<AuthController> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }
'@

$newConstructor = @'
    private readonly IConfiguration _configuration;
    private readonly ILogger<AuthController> _logger;
    private readonly IWebHostEnvironment _environment;

    public AuthController(IConfiguration configuration, ILogger<AuthController> logger, IWebHostEnvironment environment)
    {
        _configuration = configuration;
        _logger = logger;
        _environment = environment;
    }
'@

$content = $content -replace [regex]::Escape($oldConstructor), $newConstructor

# Add environment check at the beginning of GenerateToken
$oldMethodStart = @'
    public IActionResult GenerateToken([FromBody] TokenRequest request)
    {
        _logger.LogInformation("Token generation requested for user: {Username}, tenant: {TenantKey}",
            request.Username, request.TenantKey);

        var jwtSecretKey = _configuration["Jwt:SecretKey"];
'@

$newMethodStart = @'
    public IActionResult GenerateToken([FromBody] TokenRequest request)
    {
        // SECURITY: Only allow token generation in Development environment
        if (!_environment.IsDevelopment())
        {
            _logger.LogWarning("Token generation attempted in non-development environment");
            return StatusCode(403, new { error = "Token generation is only available in Development environment. Use a proper identity provider in Production." });
        }

        _logger.LogInformation("Token generation requested for user: {Username}, tenant: {TenantKey}",
            request.Username, request.TenantKey);

        var jwtSecretKey = _configuration["Jwt:SecretKey"];
'@

$content = $content -replace [regex]::Escape($oldMethodStart), $newMethodStart

# Write back
$content | Set-Content $filePath -NoNewline

Write-Host "SUCCESS: Token endpoint is now protected!" -ForegroundColor Green
Write-Host "  - Only available in Development environment" -ForegroundColor Cyan
Write-Host "  - Returns 403 Forbidden in Production" -ForegroundColor Cyan
