namespace HealthExtent.Api.DTOs;

public class ProviderDto
{
    public long ProviderKey { get; set; }
    public string TenantKey { get; set; } = string.Empty;
    public string? FamilyName { get; set; }
    public string? GivenName { get; set; }
    public string? Prefix { get; set; }
    public int Status { get; set; }
    public string? NPI { get; set; }
    public DateTime LastUpdatedUtc { get; set; }
}

public class UpsertProviderRequest
{
    public string TenantKey { get; set; } = string.Empty;
    public string? FamilyName { get; set; }
    public string? GivenName { get; set; }
    public string? Prefix { get; set; }
    public int Status { get; set; } = 1;
    public string NPI { get; set; } = string.Empty;  // Required for upsert
}

public class UpsertProviderResponse
{
    public long? ProviderKey { get; set; }
    public int Success { get; set; }
    public string? Message { get; set; }
}
