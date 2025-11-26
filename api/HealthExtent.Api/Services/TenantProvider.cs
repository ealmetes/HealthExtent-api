namespace HealthExtent.Api.Services;

public class TenantProvider : ITenantProvider
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public TenantProvider(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public string? GetTenantKey()
    {
        var httpContext = _httpContextAccessor.HttpContext;
        if (httpContext == null)
            return null;

        // Check custom header first (X-Tenant-Key or X-Tenant-Id for backward compatibility)
        if (httpContext.Request.Headers.TryGetValue("X-Tenant-Key", out var tenantKeyHeader))
        {
            return tenantKeyHeader;
        }

        if (httpContext.Request.Headers.TryGetValue("X-Tenant-Id", out var tenantIdHeader))
        {
            return tenantIdHeader;
        }

        // Check if tenant key is in claims (from JWT token)
        var tenantClaim = httpContext.User.FindFirst("tenant_id");
        if (tenantClaim != null)
        {
            return tenantClaim.Value;
        }

        return null;
    }

    public string? GetTenantCode()
    {
        var httpContext = _httpContextAccessor.HttpContext;
        if (httpContext == null)
            return null;

        // Check custom header
        if (httpContext.Request.Headers.TryGetValue("X-Tenant-Code", out var tenantCode))
        {
            return tenantCode;
        }

        // Check if tenant code is in claims
        var tenantClaim = httpContext.User.FindFirst("tenant_code");
        return tenantClaim?.Value;
    }
}
