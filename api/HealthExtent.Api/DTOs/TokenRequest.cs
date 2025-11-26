namespace HealthExtent.Api.DTOs;

public class TokenRequest
{
    public string Username { get; set; } = "api-user";
    public string TenantKey { get; set; } = string.Empty;
    public string? TenantCode { get; set; }
}
