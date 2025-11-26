using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HealthExtent.Api.DTOs;
using HealthExtent.Api.Services;
using FluentValidation;

namespace HealthExtent.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class CareTransitionsController : ControllerBase
{
    private readonly IHealthExtentService _service;
    private readonly ILogger<CareTransitionsController> _logger;
    private readonly IValidator<CreateCareTransitionRequest>? _createValidator;
    private readonly IValidator<UpdateCareTransitionRequest>? _updateValidator;

    public CareTransitionsController(
        IHealthExtentService service,
        ILogger<CareTransitionsController> logger,
        IValidator<CreateCareTransitionRequest>? createValidator = null,
        IValidator<UpdateCareTransitionRequest>? updateValidator = null)
    {
        _service = service;
        _logger = logger;
        _createValidator = createValidator;
        _updateValidator = updateValidator;
    }

    /// <summary>
    /// Create a new care transition for an encounter
    /// </summary>
    [HttpPost("create")]
    [ProducesResponseType(typeof(CareTransitionResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<CareTransitionResponse>> CreateCareTransition([FromBody] CreateCareTransitionRequest request)
    {
        if (_createValidator != null)
        {
            var validationResult = await _createValidator.ValidateAsync(request);
            if (!validationResult.IsValid)
                return BadRequest(validationResult.Errors);
        }

        var result = await _service.CreateCareTransitionAsync(request);

        if (!result.Success)
            return BadRequest(result);

        return Ok(result);
    }

    /// <summary>
    /// Update an existing care transition
    /// </summary>
    [HttpPut("update")]
    [ProducesResponseType(typeof(CareTransitionResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<CareTransitionResponse>> UpdateCareTransition([FromBody] UpdateCareTransitionRequest request)
    {
        if (_updateValidator != null)
        {
            var validationResult = await _updateValidator.ValidateAsync(request);
            if (!validationResult.IsValid)
                return BadRequest(validationResult.Errors);
        }

        var result = await _service.UpdateCareTransitionAsync(request);

        if (!result.Success)
            return BadRequest(result);

        return Ok(result);
    }

    /// <summary>
    /// Close a care transition
    /// </summary>
    [HttpPost("close")]
    [ProducesResponseType(typeof(CareTransitionResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<CareTransitionResponse>> CloseCareTransition([FromBody] CloseCareTransitionRequest request)
    {
        var result = await _service.CloseCareTransitionAsync(request);

        if (!result.Success)
            return BadRequest(result);

        return Ok(result);
    }

    /// <summary>
    /// Get care transition by key
    /// </summary>
    [HttpGet("{careTransitionKey}")]
    [ProducesResponseType(typeof(CareTransitionDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<CareTransitionDto>> GetCareTransition(int careTransitionKey, [FromQuery] string tenantKey)
    {
        var careTransition = await _service.GetCareTransitionByKeyAsync(careTransitionKey, tenantKey);

        if (careTransition == null)
            return NotFound();

        return Ok(careTransition);
    }

    /// <summary>
    /// Get care transition by encounter key
    /// </summary>
    [HttpGet("encounter/{encounterKey}")]
    [ProducesResponseType(typeof(CareTransitionDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<CareTransitionDto>> GetCareTransitionByEncounter(int encounterKey, [FromQuery] string tenantKey)
    {
        var careTransition = await _service.GetCareTransitionByEncounterAsync(encounterKey, tenantKey);

        if (careTransition == null)
            return NotFound();

        return Ok(careTransition);
    }

    /// <summary>
    /// Get all care transitions for a patient
    /// </summary>
    [HttpGet("patient/{patientKey}")]
    [ProducesResponseType(typeof(IEnumerable<CareTransitionDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<CareTransitionDto>>> GetCareTransitionsByPatient(
        int patientKey,
        [FromQuery] string tenantKey)
    {
        var careTransitions = await _service.GetCareTransitionsByPatientAsync(patientKey, tenantKey);
        return Ok(careTransitions);
    }

    /// <summary>
    /// Get care transitions by status
    /// </summary>
    [HttpGet("status/{status}")]
    [ProducesResponseType(typeof(IEnumerable<CareTransitionSummaryDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<CareTransitionSummaryDto>>> GetCareTransitionsByStatus(
        string status,
        [FromQuery] string tenantKey,
        [FromQuery] int skip = 0,
        [FromQuery] int take = 100)
    {
        var careTransitions = await _service.GetCareTransitionsByStatusAsync(status, tenantKey, skip, take);
        return Ok(careTransitions);
    }

    /// <summary>
    /// Get all active care transitions
    /// </summary>
    [HttpGet("active")]
    [ProducesResponseType(typeof(IEnumerable<CareTransitionSummaryDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<CareTransitionSummaryDto>>> GetActiveCareTransitions(
        [FromQuery] string tenantKey,
        [FromQuery] int skip = 0,
        [FromQuery] int take = 100)
    {
        var careTransitions = await _service.GetActiveCareTransitionsAsync(tenantKey, skip, take);
        return Ok(careTransitions);
    }

    /// <summary>
    /// Get all care transitions for a tenant with pagination
    /// </summary>
    [HttpGet("tenant/{tenantKey}")]
    [ProducesResponseType(typeof(IEnumerable<CareTransitionSummaryDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<CareTransitionSummaryDto>>> GetCareTransitionsByTenant(
        string tenantKey,
        [FromQuery] int skip = 0,
        [FromQuery] int take = 100)
    {
        var careTransitions = await _service.GetCareTransitionsByTenantAsync(tenantKey, skip, take);
        return Ok(careTransitions);
    }

    /// <summary>
    /// Log an outreach attempt for a care transition
    /// </summary>
    [HttpPost("{careTransitionKey}/outreach")]
    [ProducesResponseType(typeof(CareTransitionResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<CareTransitionResponse>> LogOutreach(
        int careTransitionKey,
        [FromBody] LogOutreachRequest request)
    {
        // Ensure careTransitionKey in URL matches the request
        if (request.CareTransitionKey == 0)
            request.CareTransitionKey = careTransitionKey;
        else if (request.CareTransitionKey != careTransitionKey)
            return BadRequest("CareTransitionKey in URL does not match request body");

        var result = await _service.LogOutreachAsync(request);

        if (!result.Success)
            return BadRequest(result);

        return Ok(result);
    }

    /// <summary>
    /// Get current assignment information for a care transition
    /// </summary>
    [HttpGet("{careTransitionKey}/assign")]
    [ProducesResponseType(typeof(CareTransitionAssignmentDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<CareTransitionAssignmentDto>> GetCareTransitionAssignment(
        int careTransitionKey,
        [FromQuery] string tenantKey,
        [FromQuery] string? assignedToUserKey = null)
    {
        var assignment = await _service.GetCareTransitionAssignmentAsync(careTransitionKey, tenantKey);

        if (assignment == null)
            return NotFound();

        // If assignedToUserKey is provided, validate it matches
        if (!string.IsNullOrEmpty(assignedToUserKey) &&
            assignment.AssignedToUserKey != assignedToUserKey)
        {
            return NotFound($"Care transition is not assigned to user {assignedToUserKey}");
        }

        return Ok(assignment);
    }

    /// <summary>
    /// Assign or reassign a care manager to a care transition
    /// </summary>
    [HttpPost("{careTransitionKey}/assign")]
    [ProducesResponseType(typeof(CareTransitionResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<CareTransitionResponse>> AssignCareManager(
        int careTransitionKey,
        [FromBody] AssignCareManagerRequest request)
    {
        // Ensure careTransitionKey in URL matches the request
        if (request.CareTransitionKey == 0)
            request.CareTransitionKey = careTransitionKey;
        else if (request.CareTransitionKey != careTransitionKey)
            return BadRequest("CareTransitionKey in URL does not match request body");

        var result = await _service.AssignCareManagerAsync(request);

        if (!result.Success)
            return BadRequest(result);

        return Ok(result);
    }

    /// <summary>
    /// Get timeline/audit trail for a care transition
    /// </summary>
    [HttpGet("{careTransitionKey}/timeline")]
    [ProducesResponseType(typeof(IEnumerable<TimelineEventDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<IEnumerable<TimelineEventDto>>> GetTimeline(
        int careTransitionKey,
        [FromQuery] string tenantKey)
    {
        var timeline = await _service.GetTimelineAsync(careTransitionKey, tenantKey);

        if (!timeline.Any())
            return NotFound();

        return Ok(timeline);
    }

    /// <summary>
    /// Update priority for a care transition
    /// </summary>
    [HttpPost("{careTransitionKey}/priority")]
    [ProducesResponseType(typeof(CareTransitionResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<CareTransitionResponse>> UpdatePriority(
        int careTransitionKey,
        [FromBody] UpdatePriorityRequest request)
    {
        if (request.CareTransitionKey == 0)
            request.CareTransitionKey = careTransitionKey;
        else if (request.CareTransitionKey != careTransitionKey)
            return BadRequest("CareTransitionKey in URL does not match request body");

        var result = await _service.UpdatePriorityAsync(request);

        if (!result.Success)
            return BadRequest(result);

        return Ok(result);
    }

    /// <summary>
    /// Update risk tier for a care transition
    /// </summary>
    [HttpPost("{careTransitionKey}/riskTier")]
    [ProducesResponseType(typeof(CareTransitionResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<CareTransitionResponse>> UpdateRiskTier(
        int careTransitionKey,
        [FromBody] UpdateRiskTierRequest request)
    {
        if (request.CareTransitionKey == 0)
            request.CareTransitionKey = careTransitionKey;
        else if (request.CareTransitionKey != careTransitionKey)
            return BadRequest("CareTransitionKey in URL does not match request body");

        var result = await _service.UpdateRiskTierAsync(request);

        if (!result.Success)
            return BadRequest(result);

        return Ok(result);
    }
}

/// <summary>
/// TCM (Transitional Care Management) Metrics Controller
/// </summary>
[Authorize]
[ApiController]
[Route("api/tcm")]
[Produces("application/json")]
public class TcmController : ControllerBase
{
    private readonly IHealthExtentService _service;
    private readonly ILogger<TcmController> _logger;

    public TcmController(
        IHealthExtentService service,
        ILogger<TcmController> logger)
    {
        _service = service;
        _logger = logger;
    }

    /// <summary>
    /// Get TCM metrics for KPI tiles and graphs
    /// </summary>
    [HttpGet("metrics")]
    [ProducesResponseType(typeof(TcmMetricsDto), StatusCodes.Status200OK)]
    public async Task<ActionResult<TcmMetricsDto>> GetMetrics(
        [FromQuery] string tenantKey,
        [FromQuery] DateTime? from = null,
        [FromQuery] DateTime? to = null)
    {
        var metrics = await _service.GetTcmMetricsAsync(tenantKey, from, to);
        return Ok(metrics);
    }

    /// <summary>
    /// Get overdue TCM encounters where TCMSchedule1 has passed and status is not Closed
    /// </summary>
    [HttpGet("overdue")]
    [ProducesResponseType(typeof(IEnumerable<OverdueTcmEncounterDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<OverdueTcmEncounterDto>>> GetOverdueEncounters(
        [FromQuery] string tenantKey)
    {
        var overdueEncounters = await _service.GetOverdueTcmEncountersAsync(tenantKey);
        return Ok(overdueEncounters);
    }

    /// <summary>
    /// Get overdue TCM encounters where TCMSchedule2 has passed and status is not Closed
    /// </summary>
    [HttpGet("overdue2")]
    [ProducesResponseType(typeof(IEnumerable<OverdueTcmEncounterDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<OverdueTcmEncounterDto>>> GetOverdue2Encounters(
        [FromQuery] string tenantKey)
    {
        var overdueEncounters = await _service.GetOverdueTcm2EncountersAsync(tenantKey);
        return Ok(overdueEncounters);
    }
}
