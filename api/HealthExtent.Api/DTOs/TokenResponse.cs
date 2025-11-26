namespace HealthExtent.Api.DTOs;

public class TokenResponse
{
    public string Token { get; set; } = string.Empty;
    public DateTime Expires { get; set; }
    public string TenantKey { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
}
