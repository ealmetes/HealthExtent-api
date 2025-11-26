# Fix the HTTPS section in Program.cs
$filePath = "C:\Users\Edwin Almetes\Projects\healthextent\api\HealthExtent.Api\Program.cs"

# Read all lines
$lines = Get-Content $filePath

# Find and replace the problematic line
$newLines = @()
for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match "// Enable HTTPS redirection in productionn{n}") {
        # Replace with proper code
        $newLines += "// Enable HTTPS redirection in production"
        $newLines += "if (!app.Environment.IsDevelopment())"
        $newLines += "{"
        $newLines += "    app.UseHttpsRedirection();"
        $newLines += "}"
    }
    else {
        $newLines += $lines[$i]
    }
}

# Write back
$newLines | Set-Content $filePath

Write-Host "SUCCESS: HTTPS section fixed!" -ForegroundColor Green
