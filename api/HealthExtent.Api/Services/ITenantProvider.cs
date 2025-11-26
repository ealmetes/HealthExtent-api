namespace HealthExtent.Api.Services;

public interface ITenantProvider
{
    string? GetTenantKey();
    string? GetTenantCode();
}
