using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HealthExtent.Api.Models;
using HealthExtent.Api.Services;
using HealthExtent.Api.DTOs;

namespace HealthExtent.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class HospitalsController : ControllerBase
{
    private readonly IHealthExtentService _service;
    private readonly ILogger<HospitalsController> _logger;

    public HospitalsController(IHealthExtentService service, ILogger<HospitalsController> logger)
    {
        _service = service;
        _logger = logger;
    }

    /// <summary>
    /// Get all hospitals for a tenant (both active and inactive)
    /// </summary>
    [HttpGet("tenant/{tenantKey}")]
    [ProducesResponseType(typeof(IEnumerable<Hospital>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<Hospital>>> GetHospitalsByTenant(string tenantKey)
    {
        var hospitals = await _service.GetHospitalsByTenantAsync(tenantKey);
        return Ok(hospitals);
    }
    /// <summary>
    /// Set a hospital's active status for a tenant.
    /// </summary>
    [HttpPatch("tenant/{tenantKey}/{hospitalKey:int}/status")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> SetHospitalStatus(
        string tenantKey,
        int hospitalKey,
        [FromBody] SetHospitalStatusRequest request)
    {
        if (request is null)
        {
            return BadRequest("Request body is required.");
        }

        var ok = await _service.SetHospitalStatusAsync(tenantKey, hospitalKey, request.IsActive);

        if (!ok)
        {
            _logger.LogWarning(
                "SetHospitalStatus failed: tenantKey={TenantKey}, hospitalKey={HospitalKey}",
                tenantKey, hospitalKey);
            return NotFound();
        }

        return NoContent();
    }
}
