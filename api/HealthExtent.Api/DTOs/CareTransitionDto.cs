namespace HealthExtent.Api.DTOs;

public class CareTransitionDto
{
    public int CareTransitionKey { get; set; }
    public string TenantKey { get; set; } = string.Empty;
    public int EncounterKey { get; set; }
    public int PatientKey { get; set; }
    public int HospitalKey { get; set; }
    public string VisitNumber { get; set; } = string.Empty;
    public string? CareManagerUserKey { get; set; }
    public string? AssignedToUserKey { get; set; }
    public string? AssignedTeam { get; set; }
    public long? FollowUpProviderKey { get; set; }
    public DateTime? FollowUpApptDateTime { get; set; }
    public DateTime? CommunicationSentDate { get; set; }
    public DateTime? OutreachDate { get; set; }
    public string? OutreachMethod { get; set; }
    public DateTime? TcmSchedule1 { get; set; }
    public DateTime? TcmSchedule2 { get; set; }
    public string Status { get; set; } = "New";
    public string? Priority { get; set; }
    public string? RiskTier { get; set; }
    public int? ReadmissionRiskScore { get; set; }
    public bool? ConsentConfirmed { get; set; }
    public string? PreferredLanguage { get; set; }
    public int OutreachAttempts { get; set; }
    public DateTime? LastOutreachDate { get; set; }
    public DateTime? NextOutreachDate { get; set; }
    public string? ContactOutcome { get; set; }
    public string? CloseReason { get; set; }
    public string? ClosedByUserKey { get; set; }
    public DateTime? ClosedUtc { get; set; }
    public string? Notes { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedUtc { get; set; }
    public DateTime LastUpdatedUtc { get; set; }

    // Nested information
    public PatientInfoDto? Patient { get; set; }
    public ProviderDto? FollowUpProvider { get; set; }
    public EncounterInfoDto? Encounter { get; set; }
}

public class CreateCareTransitionRequest
{
    public string TenantKey { get; set; } = string.Empty;
    public int EncounterKey { get; set; }
    public int PatientKey { get; set; }
    public int HospitalKey { get; set; }
    public string VisitNumber { get; set; } = string.Empty;
    public string? CareManagerUserKey { get; set; }
    public string? AssignedToUserKey { get; set; }
    public string? AssignedTeam { get; set; }
    public long? FollowUpProviderKey { get; set; }
    public string? FollowUpApptDateTime_TS { get; set; }  // HL7 timestamp format
    public string? CommunicationSentDate_TS { get; set; }
    public string? OutreachDate_TS { get; set; }
    public string? OutreachMethod { get; set; }
    public string? TcmSchedule1_TS { get; set; }
    public string? TcmSchedule2_TS { get; set; }
    public string? Status { get; set; }
    public string? Priority { get; set; }
    public string? RiskTier { get; set; }
    public int? ReadmissionRiskScore { get; set; }
    public bool? ConsentConfirmed { get; set; }
    public string? PreferredLanguage { get; set; }
    public string? Notes { get; set; }
}

public class UpdateCareTransitionRequest
{
    public string TenantKey { get; set; } = string.Empty;
    public int CareTransitionKey { get; set; }
    public string? CareManagerUserKey { get; set; }
    public string? AssignedToUserKey { get; set; }
    public string? AssignedTeam { get; set; }
    public long? FollowUpProviderKey { get; set; }
    public string? FollowUpApptDateTime_TS { get; set; }
    public string? CommunicationSentDate_TS { get; set; }
    public string? OutreachDate_TS { get; set; }
    public string? OutreachMethod { get; set; }
    public string? TcmSchedule1_TS { get; set; }
    public string? TcmSchedule2_TS { get; set; }
    public string? Status { get; set; }
    public string? Priority { get; set; }
    public string? RiskTier { get; set; }
    public int? ReadmissionRiskScore { get; set; }
    public bool? ConsentConfirmed { get; set; }
    public string? PreferredLanguage { get; set; }
    public int? OutreachAttempts { get; set; }
    public string? LastOutreachDate_TS { get; set; }
    public string? NextOutreachDate_TS { get; set; }
    public string? ContactOutcome { get; set; }
    public string? Notes { get; set; }
}

public class CloseCareTransitionRequest
{
    public string TenantKey { get; set; } = string.Empty;
    public int CareTransitionKey { get; set; }
    public string CloseReason { get; set; } = string.Empty;
    public string ClosedByUserKey { get; set; } = string.Empty;
}

public class CareTransitionResponse
{
    public int? CareTransitionKey { get; set; }
    public bool Success { get; set; }
    public string? Message { get; set; }
}

public class CareTransitionSummaryDto
{
    public int CareTransitionKey { get; set; }
    public string TenantKey { get; set; } = string.Empty;
    public int EncounterKey { get; set; }
    public int PatientKey { get; set; }
    public string? PatientName { get; set; }
    public int HospitalKey { get; set; }
    public string VisitNumber { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string? Priority { get; set; }
    public string? RiskTier { get; set; }
    public DateTime? TcmSchedule1 { get; set; }
    public DateTime? TcmSchedule2 { get; set; }
    public DateTime? NextOutreachDate { get; set; }
    public int OutreachAttempts { get; set; }
    public DateTime CreatedUtc { get; set; }
    public DateTime LastUpdatedUtc { get; set; }

    // Assignment fields
    public string? CareManagerUserKey { get; set; }
    public string? AssignedToUserKey { get; set; }
    public string? AssignedTeam { get; set; }

    // Nested encounter information
    public EncounterInfoDto? Encounter { get; set; }

    // Nested patient information
    public PatientInfoDto? Patient { get; set; }

    // Nested hospital information
    public HospitalInfoDto? Hospital { get; set; }
}

public class HospitalInfoDto
{
    public int HospitalKey { get; set; }
    public string HospitalCode { get; set; } = string.Empty;
    public string HospitalName { get; set; } = string.Empty;
    public string? AssigningAuthority { get; set; }
    public string? City { get; set; }
    public string? State { get; set; }
    public bool IsActive { get; set; }
}

public class LogOutreachRequest
{
    public string TenantKey { get; set; } = string.Empty;
    public int CareTransitionKey { get; set; }
    public string? OutreachMethod { get; set; }
    public string? OutreachDate { get; set; }  // ISO timestamp
    public string? ContactOutcome { get; set; }
    public string? NextOutreachDate_TS { get; set; }  // HL7 timestamp
    public string? Notes { get; set; }
    public string? AssignedToUserKey { get; set; }
    public string? LastOutreachDate { get; set; }  // ISO timestamp
    public string? Status { get; set; }  // Status
    public int? OutreachAttempts { get; set; }
}

public class CareTransitionAssignmentDto
{
    public int CareTransitionKey { get; set; }
    public string TenantKey { get; set; } = string.Empty;
    public string? CareManagerUserKey { get; set; }
    public string? AssignedToUserKey { get; set; }
    public string? AssignedTeam { get; set; }
    public DateTime LastUpdatedUtc { get; set; }
}

public class AssignCareManagerRequest
{
    public string TenantKey { get; set; } = string.Empty;
    public int CareTransitionKey { get; set; }
    public string? CareManagerUserKey { get; set; }
    public string? AssignedToUserKey { get; set; }
    public string? AssignedTeam { get; set; }
}

public class UpdatePriorityRequest
{
    public string TenantKey { get; set; } = string.Empty;
    public int CareTransitionKey { get; set; }
    public string Priority { get; set; } = string.Empty;
}

public class UpdateRiskTierRequest
{
    public string TenantKey { get; set; } = string.Empty;
    public int CareTransitionKey { get; set; }
    public string RiskTier { get; set; } = string.Empty;
}

public class TcmMetricsDto
{
    public int TotalActiveCareTransitions { get; set; }
    public int TotalClosedCareTransitions { get; set; }
    public int HighRiskCount { get; set; }
    public int MediumRiskCount { get; set; }
    public int LowRiskCount { get; set; }
    public int PendingOutreachCount { get; set; }
    public int CompletedTcm14DayCount { get; set; }
    public int CompletedTcm7DayCount { get; set; }
    public double AverageOutreachAttempts { get; set; }
    public Dictionary<string, int> StatusBreakdown { get; set; } = new();
}

public class TimelineEventDto
{
    public int EventId { get; set; }
    public string EventType { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime EventTimestamp { get; set; }
    public string? PerformedBy { get; set; }
    public Dictionary<string, string>? Metadata { get; set; }
}

public class OverdueTcmEncounterDto
{
    public long EncounterKey { get; set; }
    public int CareTransitionKey { get; set; }
    public string TenantKey { get; set; } = string.Empty;
    public string PatientName { get; set; } = string.Empty;
    public string? Location { get; set; }
    public DateTime? DischargeDateTime { get; set; }
    public DateTime? TcmSchedule1 { get; set; }
    public string DaysPassed { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string? Priority { get; set; }
    public string? RiskTier { get; set; }
    public string VisitNumber { get; set; } = string.Empty;
}
