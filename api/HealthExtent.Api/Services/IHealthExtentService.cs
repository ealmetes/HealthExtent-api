using HealthExtent.Api.DTOs;
using HealthExtent.Api.Models;

namespace HealthExtent.Api.Services;

public interface IHealthExtentService
{
    // Patient operations
    Task<UpsertPatientResponse> UpsertPatientAsync(UpsertPatientRequest request);
    Task<PatientDto?> GetPatientByKeyAsync(long patientKey, string tenantKey);
    Task<IEnumerable<PatientDto>> GetPatientsByTenantAsync(string tenantKey, int skip = 0, int take = 100);
    Task<IEnumerable<PatientDto>> SearchPatientsAsync(string tenantKey, string searchTerm, int skip = 0, int take = 100);

    // Encounter operations
    Task<UpsertEncounterResponse> UpsertEncounterAsync(UpsertEncounterRequest request);
    Task<EncounterDto?> GetEncounterByKeyAsync(long encounterKey, string tenantKey);
    Task<IEnumerable<EncounterDto>> GetEncountersByPatientAsync(long patientKey, string tenantKey);
    Task<IEnumerable<EncounterDto>> GetEncountersByTenantAsync(string tenantKey, int skip = 0, int take = 100);
    Task<EncounterCountsDto> GetEncounterCountsAsync(string tenantKey);
    Task<IEnumerable<AdmittedEncounterDto>> GetAdmittedEncountersAsync(string tenantKey, int skip = 0, int take = 100);
    Task<IEnumerable<DischargedEncounterDto>> GetDischargedEncountersAsync(string tenantKey, string? status = null, int skip = 0, int take = 100);

    // Audit operations
    Task<WriteAuditResponse> WriteAuditAsync(WriteAuditRequest request);
    Task<IEnumerable<Hl7MessageAuditDto>> GetAuditsByTenantAsync(string tenantKey, int skip = 0, int take = 100);

    // Hospital operations
    Task<IEnumerable<Hospital>> GetHospitalsByTenantAsync(string tenantKey);
    Task<bool> SetHospitalStatusAsync(string tenantKey, int hospitalKey, bool isActive);

    // Provider operations
    Task<UpsertProviderResponse> UpsertProviderAsync(UpsertProviderRequest request);
    Task<ProviderDto?> GetProviderByKeyAsync(long providerKey, string tenantKey);
    Task<ProviderDto?> GetProviderByNPIAsync(string npi, string tenantKey);
    Task<IEnumerable<ProviderDto>> GetProvidersByTenantAsync(string tenantKey, int skip = 0, int take = 100);

    // CareTransition operations
    Task<CareTransitionResponse> CreateCareTransitionAsync(CreateCareTransitionRequest request);
    Task<CareTransitionResponse> UpdateCareTransitionAsync(UpdateCareTransitionRequest request);
    Task<CareTransitionResponse> CloseCareTransitionAsync(CloseCareTransitionRequest request);
    Task<CareTransitionDto?> GetCareTransitionByKeyAsync(int careTransitionKey, string tenantKey);
    Task<CareTransitionDto?> GetCareTransitionByEncounterAsync(int encounterKey, string tenantKey);
    Task<IEnumerable<CareTransitionDto>> GetCareTransitionsByPatientAsync(int patientKey, string tenantKey);
    Task<IEnumerable<CareTransitionSummaryDto>> GetCareTransitionsByStatusAsync(string status, string tenantKey, int skip = 0, int take = 100);
    Task<IEnumerable<CareTransitionSummaryDto>> GetActiveCareTransitionsAsync(string tenantKey, int skip = 0, int take = 100);
    Task<IEnumerable<CareTransitionSummaryDto>> GetCareTransitionsByTenantAsync(string tenantKey, int skip = 0, int take = 100);
    Task<CareTransitionResponse> LogOutreachAsync(LogOutreachRequest request);
    Task<CareTransitionAssignmentDto?> GetCareTransitionAssignmentAsync(int careTransitionKey, string tenantKey);
    Task<CareTransitionResponse> AssignCareManagerAsync(AssignCareManagerRequest request);
    Task<CareTransitionResponse> UpdatePriorityAsync(UpdatePriorityRequest request);
    Task<CareTransitionResponse> UpdateRiskTierAsync(UpdateRiskTierRequest request);
    Task<TcmMetricsDto> GetTcmMetricsAsync(string tenantKey, DateTime? from, DateTime? to);
    Task<IEnumerable<TimelineEventDto>> GetTimelineAsync(int careTransitionKey, string tenantKey);
    Task<IEnumerable<OverdueTcmEncounterDto>> GetOverdueTcmEncountersAsync(string tenantKey);
    Task<IEnumerable<OverdueTcmEncounterDto>> GetOverdueTcm2EncountersAsync(string tenantKey);
}
