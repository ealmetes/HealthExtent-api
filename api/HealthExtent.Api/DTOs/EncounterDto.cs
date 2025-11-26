namespace HealthExtent.Api.DTOs;

public class EncounterDto
{
    public long EncounterKey { get; set; }
    public string TenantKey { get; set; } = string.Empty;
    public int HospitalKey { get; set; }
    public long PatientKey { get; set; }
    public string VisitNumber { get; set; } = string.Empty;
    public DateTime? AdmitDateTime { get; set; }
    public DateTime? DischargeDateTime { get; set; }
    public string? PatientClass { get; set; }
    public string? Location { get; set; }
    public string? AttendingDoctor { get; set; }
    public string? PrimaryDoctor { get; set; }
    public string? AdmittingDoctor { get; set; }
    public string? AdmitSource { get; set; }
    public string? VisitStatus { get; set; }
    public string? Notes { get; set; }
    public string? AdmitMessageId { get; set; }
    public string? DischargeMessageId { get; set; }
    public int Status { get; set; }
    public DateTime? TcmSchedule1 { get; set; }
    public DateTime? TcmSchedule2 { get; set; }
    public DateTime LastUpdatedUtc { get; set; }

    // Patient information
    public PatientInfoDto? Patient { get; set; }
}

public class PatientInfoDto
{
    public long PatientKey { get; set; }
    public string PatientIdExternal { get; set; } = string.Empty;
    public string? PatientName { get; set; }
    public string? MRN { get; set; }
    public string? SSN { get; set; }
    public string? FamilyName { get; set; }
    public string? GivenName { get; set; }
    public DateTime? DOB { get; set; }
    public string? Sex { get; set; }
    public string? Phone { get; set; }
    public string? CustodianName { get; set; }
    public string? CustodianPhone { get; set; }
    public string? AddressLine1 { get; set; }
    public string? City { get; set; }
    public string? State { get; set; }
    public string? PostalCode { get; set; }
}

public class EncounterInfoDto
{
    public long EncounterKey { get; set; }
    public DateTime? AdmitDateTime { get; set; }
    public DateTime? DischargeDateTime { get; set; }
    public string? Location { get; set; }
    public string? VisitStatus { get; set; }
    public string? Notes { get; set; }
    public string? AttendingDoctor { get; set; }
    public string? PrimaryDoctor { get; set; }
    public string? AdmittingDoctor { get; set; }
}

public class UpsertEncounterRequest
{
    public string TenantKey { get; set; } = string.Empty;
    public string HospitalCode { get; set; } = string.Empty;
    public string VisitNumber { get; set; } = string.Empty;
    public long PatientKey { get; set; }
    public string? Admit_TS { get; set; }  // HL7 timestamp format
    public string? Discharge_TS { get; set; }  // HL7 timestamp format
    public string? PatientClass { get; set; }
    public string? Location { get; set; }
    public string? AttendingDoctor { get; set; }
    public string? PrimaryDoctor { get; set; }
    public string? AdmittingDoctor { get; set; }
    public string? AdmitSource { get; set; }
    public string? VisitStatus { get; set; }
    public string? Notes { get; set; }
    public string? AdmitMessageId { get; set; }
    public string? DischargeMessageId { get; set; }
    public int? Status { get; set; }
    public string? TcmSchedule1_TS { get; set; }  // HL7 timestamp format
    public string? TcmSchedule2_TS { get; set; }  // HL7 timestamp format
}

public class UpsertEncounterResponse
{
    public long? EncounterKey { get; set; }
    public bool Success { get; set; }
    public string? Message { get; set; }
}

public class EncounterCountsDto
{
    public int AdmittedCount { get; set; }
    public int DischargedCount { get; set; }
}

public class AdmittedEncounterDto
{
    public long EncounterKey { get; set; }
    public string TenantKey { get; set; } = string.Empty;
    public int HospitalKey { get; set; }
    public string HospitalName { get; set; } = string.Empty;
    public long PatientKey { get; set; }
    public string? PatientName { get; set; }
    public string VisitNumber { get; set; } = string.Empty;
    public DateTime? AdmitDateTime { get; set; }
    public string? Location { get; set; }
    public string? AttendingDoctor { get; set; }
    public string? VisitStatus { get; set; }
}

public class DischargedEncounterDto
{
    public int CareTransitionKey { get; set; }
    public long EncounterKey { get; set; }
    public string TenantKey { get; set; } = string.Empty;
    public int HospitalKey { get; set; }
    public string HospitalName { get; set; } = string.Empty;
    public long PatientKey { get; set; }
    public string? PatientName { get; set; }
    public string VisitNumber { get; set; } = string.Empty;
    public DateTime? AdmitDateTime { get; set; }
    public DateTime? DischargeDateTime { get; set; }
    public string? Location { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? Priority { get; set; }
    public string? RiskTier { get; set; }
    public DateTime? TcmSchedule1 { get; set; }
    public DateTime? TcmSchedule2 { get; set; }
    public string? AssignedToUserKey { get; set; }
    public DateTime LastUpdatedUtc { get; set; }
}
