using Microsoft.EntityFrameworkCore;
using Microsoft.Data.SqlClient;
using HealthExtent.Api.Data;
using HealthExtent.Api.DTOs;
using HealthExtent.Api.Models;

namespace HealthExtent.Api.Services;

public class HealthExtentService : IHealthExtentService
{
    private readonly HealthExtentDbContext _context;
    private readonly ILogger<HealthExtentService> _logger;

    public HealthExtentService(HealthExtentDbContext context, ILogger<HealthExtentService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<UpsertPatientResponse> UpsertPatientAsync(UpsertPatientRequest request)
    {
        try
        {
            _logger.LogInformation("Starting patient upsert for TenantKey={TenantKey}, PatientId={PatientId}, AssigningAuthority={AssigningAuthority}",
                request.TenantKey, request.PatientIdExternal, request.AssigningAuthority);

            var outputParam = new SqlParameter
            {
                ParameterName = "@OutPatientKey",
                SqlDbType = System.Data.SqlDbType.BigInt,
                Direction = System.Data.ParameterDirection.Output
            };

            await _context.Database.ExecuteSqlRawAsync(
                "EXEC he.UpsertPatient_Tenant @TenantKey, @PatientIdExternal, @AssigningAuthority, @MRN, @SSN, @FamilyName, @GivenName, @DOB_TS, @Sex, @Phone, @CustodianName, @CustodianPhone, @AddressLine1, @City, @State, @PostalCode, @Country, @FirstSeenHospitalCode, @OutPatientKey OUTPUT",
                new SqlParameter("@TenantKey", request.TenantKey),
                new SqlParameter("@PatientIdExternal", request.PatientIdExternal),
                new SqlParameter("@AssigningAuthority", (object?)request.AssigningAuthority ?? DBNull.Value),
                new SqlParameter("@MRN", (object?)request.MRN ?? DBNull.Value),
                new SqlParameter("@SSN", (object?)request.SSN ?? DBNull.Value),
                new SqlParameter("@FamilyName", (object?)request.FamilyName ?? DBNull.Value),
                new SqlParameter("@GivenName", (object?)request.GivenName ?? DBNull.Value),
                new SqlParameter("@DOB_TS", (object?)request.DOB_TS ?? DBNull.Value),
                new SqlParameter("@Sex", (object?)request.Sex ?? DBNull.Value),
                new SqlParameter("@Phone", (object?)request.Phone ?? DBNull.Value),
                new SqlParameter("@CustodianName", (object?)request.CustodianName ?? DBNull.Value),
                new SqlParameter("@CustodianPhone", (object?)request.CustodianPhone ?? DBNull.Value),
                new SqlParameter("@AddressLine1", (object?)request.AddressLine1 ?? DBNull.Value),
                new SqlParameter("@City", (object?)request.City ?? DBNull.Value),
                new SqlParameter("@State", (object?)request.State ?? DBNull.Value),
                new SqlParameter("@PostalCode", (object?)request.PostalCode ?? DBNull.Value),
                new SqlParameter("@Country", (object?)request.Country ?? DBNull.Value),
                new SqlParameter("@FirstSeenHospitalCode", (object?)request.FirstSeenHospitalCode ?? DBNull.Value),
                outputParam);

            var patientKey = (long)outputParam.Value;

            _logger.LogInformation("Patient upserted successfully with PatientKey={PatientKey}", patientKey);

            return new UpsertPatientResponse
            {
                PatientKey = patientKey,
                Success = true,
                Message = "Patient upserted successfully"
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error upserting patient for TenantKey={TenantKey}, PatientId={PatientId}. Error: {ErrorMessage}",
                request.TenantKey, request.PatientIdExternal, ex.Message);
            return new UpsertPatientResponse
            {
                Success = false,
                Message = $"Error: {ex.Message}"
            };
        }
    }

    public async Task<PatientDto?> GetPatientByKeyAsync(long patientKey, string tenantKey)
    {
        // Set tenant context for RLS
        await _context.Database.ExecuteSqlRawAsync(
            "EXEC sys.sp_set_session_context @key=N'tenant_id', @value={0}",
            tenantKey);

        var patient = await _context.Patients
            .Where(p => p.PatientKey == patientKey && p.TenantKey == tenantKey)
            .Select(p => new PatientDto
            {
                PatientKey = p.PatientKey,
                TenantKey = p.TenantKey,
                PatientIdExternal = p.PatientIdExternal,
                AssigningAuthority = p.AssigningAuthority,
                MRN = p.MRN,
                SSN = p.SSN,
                FamilyName = p.FamilyName,
                GivenName = p.GivenName,
                DOB = p.DOB,
                Sex = p.Sex,
                Phone = p.Phone,
                CustodianName = p.CustodianName,
                CustodianPhone = p.CustodianPhone,
                AddressLine1 = p.AddressLine1,
                City = p.City,
                State = p.State,
                PostalCode = p.PostalCode,
                Country = p.Country,
                FirstSeenHospitalKey = p.FirstSeenHospitalKey,
                LastUpdatedUtc = p.LastUpdatedUtc
            })
            .FirstOrDefaultAsync();

        return patient;
    }

    public async Task<IEnumerable<PatientDto>> GetPatientsByTenantAsync(string tenantKey, int skip = 0, int take = 100)
    {
        await _context.Database.ExecuteSqlRawAsync(
            "EXEC sys.sp_set_session_context @key=N'tenant_id', @value={0}",
            tenantKey);

        return await _context.Patients
            .Where(p => p.TenantKey == tenantKey)
            .OrderByDescending(p => p.LastUpdatedUtc)
            .Skip(skip)
            .Take(take)
            .Select(p => new PatientDto
            {
                PatientKey = p.PatientKey,
                TenantKey = p.TenantKey,
                PatientIdExternal = p.PatientIdExternal,
                AssigningAuthority = p.AssigningAuthority,
                MRN = p.MRN,
                SSN = p.SSN,
                FamilyName = p.FamilyName,
                GivenName = p.GivenName,
                DOB = p.DOB,
                Sex = p.Sex,
                Phone = p.Phone,
                CustodianName = p.CustodianName,
                CustodianPhone = p.CustodianPhone,
                AddressLine1 = p.AddressLine1,
                City = p.City,
                State = p.State,
                PostalCode = p.PostalCode,
                Country = p.Country,
                FirstSeenHospitalKey = p.FirstSeenHospitalKey,
                LastUpdatedUtc = p.LastUpdatedUtc
            })
            .ToListAsync();
    }

    public async Task<IEnumerable<PatientDto>> SearchPatientsAsync(string tenantKey, string searchTerm, int skip = 0, int take = 100)
    {
        await _context.Database.ExecuteSqlRawAsync(
            "EXEC sys.sp_set_session_context @key=N'tenant_id', @value={0}",
            tenantKey);

        var searchTrimmed = searchTerm.Trim();

        // Get all patients for the tenant first
        var patients = await _context.Patients
            .Where(p => p.TenantKey == tenantKey)
            .ToListAsync();

        // If wildcard (*), return all patients
        if (searchTrimmed == "*")
        {
            return patients
                .OrderByDescending(p => p.LastUpdatedUtc)
                .Skip(skip)
                .Take(take)
                .Select(p => new PatientDto
                {
                    PatientKey = p.PatientKey,
                    TenantKey = p.TenantKey,
                    PatientIdExternal = p.PatientIdExternal,
                    AssigningAuthority = p.AssigningAuthority,
                    MRN = p.MRN,
                    SSN = p.SSN,
                    FamilyName = p.FamilyName,
                    GivenName = p.GivenName,
                    DOB = p.DOB,
                    Sex = p.Sex,
                    Phone = p.Phone,
                    CustodianName = p.CustodianName,
                    CustodianPhone = p.CustodianPhone,
                    AddressLine1 = p.AddressLine1,
                    City = p.City,
                    State = p.State,
                    PostalCode = p.PostalCode,
                    Country = p.Country,
                    FirstSeenHospitalKey = p.FirstSeenHospitalKey,
                    LastUpdatedUtc = p.LastUpdatedUtc
                })
                .ToList();
        }

        var searchLower = searchTrimmed.ToLower();
        var searchWords = searchLower.Split(' ', StringSplitOptions.RemoveEmptyEntries);

        // Filter in memory for more flexible searching
        var filteredPatients = patients.Where(p =>
        {
            // Single word search - check each field individually
            if (searchWords.Length == 1)
            {
                var word = searchWords[0];
                return (p.GivenName != null && p.GivenName.ToLower().Contains(word)) ||
                       (p.FamilyName != null && p.FamilyName.ToLower().Contains(word)) ||
                       (p.MRN != null && p.MRN.ToLower().Contains(word));
            }
            // Multi-word search - check if words match first and last name combination
            else if (searchWords.Length >= 2)
            {
                var firstWord = searchWords[0];
                var lastWord = searchWords[searchWords.Length - 1];

                // Check if first word matches GivenName and last word matches FamilyName
                var matchesFirstLast = (p.GivenName != null && p.GivenName.ToLower().Contains(firstWord)) &&
                                       (p.FamilyName != null && p.FamilyName.ToLower().Contains(lastWord));

                // Check if first word matches FamilyName and last word matches GivenName (reverse order)
                var matchesLastFirst = (p.FamilyName != null && p.FamilyName.ToLower().Contains(firstWord)) &&
                                       (p.GivenName != null && p.GivenName.ToLower().Contains(lastWord));

                // Check if full search term matches MRN
                var matchesMRN = p.MRN != null && p.MRN.ToLower().Contains(searchLower);

                return matchesFirstLast || matchesLastFirst || matchesMRN;
            }

            return false;
        })
        .OrderByDescending(p => p.LastUpdatedUtc)
        .Skip(skip)
        .Take(take)
        .Select(p => new PatientDto
        {
            PatientKey = p.PatientKey,
            TenantKey = p.TenantKey,
            PatientIdExternal = p.PatientIdExternal,
            AssigningAuthority = p.AssigningAuthority,
            MRN = p.MRN,
            SSN = p.SSN,
            FamilyName = p.FamilyName,
            GivenName = p.GivenName,
            DOB = p.DOB,
            Sex = p.Sex,
            Phone = p.Phone,
            CustodianName = p.CustodianName,
            CustodianPhone = p.CustodianPhone,
            AddressLine1 = p.AddressLine1,
            City = p.City,
            State = p.State,
            PostalCode = p.PostalCode,
            Country = p.Country,
            FirstSeenHospitalKey = p.FirstSeenHospitalKey,
            LastUpdatedUtc = p.LastUpdatedUtc
        })
        .ToList();

        return filteredPatients;
    }

    public async Task<UpsertEncounterResponse> UpsertEncounterAsync(UpsertEncounterRequest request)
    {
        try
        {
            await _context.Database.ExecuteSqlRawAsync(
                "EXEC he.UpsertEncounter_Tenant @TenantKey, @HospitalCode, @VisitNumber, @PatientKey, @Admit_TS, @Discharge_TS, @PatientClass, @Location, @AttendingDoctor, @PrimaryDoctor, @AdmittingDoctor, @AdmitSource, @VisitStatus, @Notes, @AdmitMessageId, @DischargeMessageId, @Status, @TcmSchedule1_TS, @TcmSchedule2_TS",
                new SqlParameter("@TenantKey", request.TenantKey),
                new SqlParameter("@HospitalCode", request.HospitalCode),
                new SqlParameter("@VisitNumber", request.VisitNumber),
                new SqlParameter("@PatientKey", request.PatientKey),
                new SqlParameter("@Admit_TS", (object?)request.Admit_TS ?? DBNull.Value),
                new SqlParameter("@Discharge_TS", (object?)request.Discharge_TS ?? DBNull.Value),
                new SqlParameter("@PatientClass", (object?)request.PatientClass ?? DBNull.Value),
                new SqlParameter("@Location", (object?)request.Location ?? DBNull.Value),
                new SqlParameter("@AttendingDoctor", (object?)request.AttendingDoctor ?? DBNull.Value),
                new SqlParameter("@PrimaryDoctor", (object?)request.PrimaryDoctor ?? DBNull.Value),
                new SqlParameter("@AdmittingDoctor", (object?)request.AdmittingDoctor ?? DBNull.Value),
                new SqlParameter("@AdmitSource", (object?)request.AdmitSource ?? DBNull.Value),
                new SqlParameter("@VisitStatus", (object?)request.VisitStatus ?? DBNull.Value),
                new SqlParameter("@Notes", (object?)request.Notes ?? DBNull.Value),
                new SqlParameter("@AdmitMessageId", (object?)request.AdmitMessageId ?? DBNull.Value),
                new SqlParameter("@DischargeMessageId", (object?)request.DischargeMessageId ?? DBNull.Value),
                new SqlParameter("@Status", request.Status ?? 1),
                new SqlParameter("@TcmSchedule1_TS", (object?)request.TcmSchedule1_TS ?? DBNull.Value),
                new SqlParameter("@TcmSchedule2_TS", (object?)request.TcmSchedule2_TS ?? DBNull.Value));

            return new UpsertEncounterResponse
            {
                Success = true,
                Message = "Encounter upserted successfully"
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error upserting encounter");
            return new UpsertEncounterResponse
            {
                Success = false,
                Message = $"Error: {ex.Message}"
            };
        }
    }

    public async Task<EncounterDto?> GetEncounterByKeyAsync(long encounterKey, string tenantKey)
    {
        await _context.Database.ExecuteSqlRawAsync(
            "EXEC sys.sp_set_session_context @key=N'tenant_id', @value={0}",
            tenantKey);

        return await _context.Encounters
            .Where(e => e.EncounterKey == encounterKey && e.TenantKey == tenantKey)
            .Join(_context.Patients,
                e => e.PatientKey,
                p => p.PatientKey,
                (e, p) => new { Encounter = e, Patient = p })
            .Select(ep => new EncounterDto
            {
                EncounterKey = ep.Encounter.EncounterKey,
                TenantKey = ep.Encounter.TenantKey,
                HospitalKey = ep.Encounter.HospitalKey,
                PatientKey = ep.Encounter.PatientKey,
                VisitNumber = ep.Encounter.VisitNumber,
                AdmitDateTime = ep.Encounter.AdmitDateTime,
                DischargeDateTime = ep.Encounter.DischargeDateTime,
                PatientClass = ep.Encounter.PatientClass,
                Location = ep.Encounter.Location,
                AttendingDoctor = ep.Encounter.AttendingDoctor,
                PrimaryDoctor = ep.Encounter.PrimaryDoctor,
                AdmittingDoctor = ep.Encounter.AdmittingDoctor,
                AdmitSource = ep.Encounter.AdmitSource,
                VisitStatus = ep.Encounter.VisitStatus,
                Notes = ep.Encounter.Notes,
                AdmitMessageId = ep.Encounter.AdmitMessageId,
                DischargeMessageId = ep.Encounter.DischargeMessageId,
                Status = ep.Encounter.Status,
                TcmSchedule1 = ep.Encounter.TcmSchedule1,
                TcmSchedule2 = ep.Encounter.TcmSchedule2,
                LastUpdatedUtc = ep.Encounter.LastUpdatedUtc,
                Patient = new PatientInfoDto
                {
                    PatientKey = ep.Patient.PatientKey,
                    PatientIdExternal = ep.Patient.PatientIdExternal,
                    MRN = ep.Patient.MRN,
                    SSN = ep.Patient.SSN,
                    FamilyName = ep.Patient.FamilyName,
                    GivenName = ep.Patient.GivenName,
                    DOB = ep.Patient.DOB,
                    Sex = ep.Patient.Sex,
                    Phone = ep.Patient.Phone,
                    CustodianName = ep.Patient.CustodianName,
                    CustodianPhone = ep.Patient.CustodianPhone,
                    AddressLine1 = ep.Patient.AddressLine1,
                    City = ep.Patient.City,
                    State = ep.Patient.State,
                    PostalCode = ep.Patient.PostalCode
                }
            })
            .FirstOrDefaultAsync();
    }

    public async Task<IEnumerable<EncounterDto>> GetEncountersByPatientAsync(long patientKey, string tenantKey)
    {
        await _context.Database.ExecuteSqlRawAsync(
            "EXEC sys.sp_set_session_context @key=N'tenant_id', @value={0}",
            tenantKey);

        return await _context.Encounters
            .Where(e => e.PatientKey == patientKey && e.TenantKey == tenantKey)
            .Join(_context.Patients,
                e => e.PatientKey,
                p => p.PatientKey,
                (e, p) => new { Encounter = e, Patient = p })
            .OrderByDescending(ep => ep.Encounter.LastUpdatedUtc)
            .Select(ep => new EncounterDto
            {
                EncounterKey = ep.Encounter.EncounterKey,
                TenantKey = ep.Encounter.TenantKey,
                HospitalKey = ep.Encounter.HospitalKey,
                PatientKey = ep.Encounter.PatientKey,
                VisitNumber = ep.Encounter.VisitNumber,
                AdmitDateTime = ep.Encounter.AdmitDateTime,
                DischargeDateTime = ep.Encounter.DischargeDateTime,
                PatientClass = ep.Encounter.PatientClass,
                Location = ep.Encounter.Location,
                AttendingDoctor = ep.Encounter.AttendingDoctor,
                PrimaryDoctor = ep.Encounter.PrimaryDoctor,
                AdmittingDoctor = ep.Encounter.AdmittingDoctor,
                AdmitSource = ep.Encounter.AdmitSource,
                VisitStatus = ep.Encounter.VisitStatus,
                Notes = ep.Encounter.Notes,
                AdmitMessageId = ep.Encounter.AdmitMessageId,
                DischargeMessageId = ep.Encounter.DischargeMessageId,
                Status = ep.Encounter.Status,
                TcmSchedule1 = ep.Encounter.TcmSchedule1,
                TcmSchedule2 = ep.Encounter.TcmSchedule2,
                LastUpdatedUtc = ep.Encounter.LastUpdatedUtc,
                Patient = new PatientInfoDto
                {
                    PatientKey = ep.Patient.PatientKey,
                    PatientIdExternal = ep.Patient.PatientIdExternal,
                    MRN = ep.Patient.MRN,
                    SSN = ep.Patient.SSN,
                    FamilyName = ep.Patient.FamilyName,
                    GivenName = ep.Patient.GivenName,
                    DOB = ep.Patient.DOB,
                    Sex = ep.Patient.Sex,
                    Phone = ep.Patient.Phone,
                    CustodianName = ep.Patient.CustodianName,
                    CustodianPhone = ep.Patient.CustodianPhone,
                    AddressLine1 = ep.Patient.AddressLine1,
                    City = ep.Patient.City,
                    State = ep.Patient.State,
                    PostalCode = ep.Patient.PostalCode
                }
            })
            .ToListAsync();
    }

    public async Task<IEnumerable<EncounterDto>> GetEncountersByTenantAsync(string tenantKey, int skip = 0, int take = 100)
    {
        await _context.Database.ExecuteSqlRawAsync(
            "EXEC sys.sp_set_session_context @key=N'tenant_id', @value={0}",
            tenantKey);

        return await _context.Encounters
            .Where(e => e.TenantKey == tenantKey)
            .Join(_context.Patients,
                e => e.PatientKey,
                p => p.PatientKey,
                (e, p) => new { Encounter = e, Patient = p })
            .OrderByDescending(ep => ep.Encounter.LastUpdatedUtc)
            .Skip(skip)
            .Take(take)
            .Select(ep => new EncounterDto
            {
                EncounterKey = ep.Encounter.EncounterKey,
                TenantKey = ep.Encounter.TenantKey,
                HospitalKey = ep.Encounter.HospitalKey,
                PatientKey = ep.Encounter.PatientKey,
                VisitNumber = ep.Encounter.VisitNumber,
                AdmitDateTime = ep.Encounter.AdmitDateTime,
                DischargeDateTime = ep.Encounter.DischargeDateTime,
                PatientClass = ep.Encounter.PatientClass,
                Location = ep.Encounter.Location,
                AttendingDoctor = ep.Encounter.AttendingDoctor,
                PrimaryDoctor = ep.Encounter.PrimaryDoctor,
                AdmittingDoctor = ep.Encounter.AdmittingDoctor,
                AdmitSource = ep.Encounter.AdmitSource,
                VisitStatus = ep.Encounter.VisitStatus,
                Notes = ep.Encounter.Notes,
                AdmitMessageId = ep.Encounter.AdmitMessageId,
                DischargeMessageId = ep.Encounter.DischargeMessageId,
                Status = ep.Encounter.Status,
                TcmSchedule1 = ep.Encounter.TcmSchedule1,
                TcmSchedule2 = ep.Encounter.TcmSchedule2,
                LastUpdatedUtc = ep.Encounter.LastUpdatedUtc,
                Patient = new PatientInfoDto
                {
                    PatientKey = ep.Patient.PatientKey,
                    PatientIdExternal = ep.Patient.PatientIdExternal,
                    MRN = ep.Patient.MRN,
                    SSN = ep.Patient.SSN,
                    FamilyName = ep.Patient.FamilyName,
                    GivenName = ep.Patient.GivenName,
                    DOB = ep.Patient.DOB,
                    Sex = ep.Patient.Sex,
                    Phone = ep.Patient.Phone,
                    CustodianName = ep.Patient.CustodianName,
                    CustodianPhone = ep.Patient.CustodianPhone,
                    AddressLine1 = ep.Patient.AddressLine1,
                    City = ep.Patient.City,
                    State = ep.Patient.State,
                    PostalCode = ep.Patient.PostalCode
                }
            })
            .ToListAsync();
    }

    public async Task<EncounterCountsDto> GetEncounterCountsAsync(string tenantKey)
    {
        await _context.Database.ExecuteSqlRawAsync(
            "EXEC sys.sp_set_session_context @key=N'tenant_id', @value={0}",
            tenantKey);

        // Get all encounter keys that are already in CareTransition
        var careTransitionEncounterKeys = await _context.CareTransitions
            .Where(ct => ct.TenantKey == tenantKey)
            .Select(ct => ct.EncounterKey)
            .ToListAsync();

        // Get encounters that are NOT in CareTransition
        var encountersNotInTransition = await _context.Encounters
            .Where(e => e.TenantKey == tenantKey && !careTransitionEncounterKeys.Contains((int)e.EncounterKey))
            .ToListAsync();

        // Count admitted encounters (not in CareTransition)
        var admittedCount = encountersNotInTransition
            .Count(e => e.VisitStatus != null && e.VisitStatus.Equals("Admitted", StringComparison.OrdinalIgnoreCase));

        // Count discharged - CareTransition records with Status = "Open"
        var dischargedCount = await _context.CareTransitions
            .Where(ct => ct.TenantKey == tenantKey && ct.Status == "Open")
            .CountAsync();

        return new EncounterCountsDto
        {
            AdmittedCount = admittedCount,
            DischargedCount = dischargedCount
        };
    }

    public async Task<IEnumerable<AdmittedEncounterDto>> GetAdmittedEncountersAsync(string tenantKey, int skip = 0, int take = 100)
    {
        await _context.Database.ExecuteSqlRawAsync(
            "EXEC sys.sp_set_session_context @key=N'tenant_id', @value={0}",
            tenantKey);

        // Get all encounter keys that are already in CareTransition
        var careTransitionEncounterKeys = await _context.CareTransitions
            .Where(ct => ct.TenantKey == tenantKey)
            .Select(ct => ct.EncounterKey)
            .ToListAsync();

        // Get admitted encounters NOT in CareTransition
        var admittedEncounters = await _context.Encounters
            .Where(e => e.TenantKey == tenantKey
                && e.VisitStatus != null
                && e.VisitStatus == "Admitted"
                && !careTransitionEncounterKeys.Contains((int)e.EncounterKey))
            .Join(_context.Patients,
                e => e.PatientKey,
                p => p.PatientKey,
                (e, p) => new { Encounter = e, Patient = p })
            .Join(_context.Hospitals,
                ep => ep.Encounter.HospitalKey,
                h => h.HospitalKey,
                (ep, h) => new { ep.Encounter, ep.Patient, Hospital = h })
            .OrderByDescending(eph => eph.Encounter.AdmitDateTime)
            .Skip(skip)
            .Take(take)
            .Select(eph => new AdmittedEncounterDto
            {
                EncounterKey = eph.Encounter.EncounterKey,
                TenantKey = eph.Encounter.TenantKey,
                HospitalKey = eph.Encounter.HospitalKey,
                HospitalName = eph.Hospital.HospitalName,
                PatientKey = eph.Encounter.PatientKey,
                PatientName = ((eph.Patient.GivenName ?? "") + " " + (eph.Patient.FamilyName ?? "")).Trim(),
                VisitNumber = eph.Encounter.VisitNumber,
                AdmitDateTime = eph.Encounter.AdmitDateTime,
                Location = eph.Encounter.Location,
                AttendingDoctor = eph.Encounter.AttendingDoctor,
                VisitStatus = eph.Encounter.VisitStatus
            })
            .ToListAsync();

        return admittedEncounters;
    }

    public async Task<IEnumerable<DischargedEncounterDto>> GetDischargedEncountersAsync(string tenantKey, string? status = null, int skip = 0, int take = 100)
    {
        await _context.Database.ExecuteSqlRawAsync(
            "EXEC sys.sp_set_session_context @key=N'tenant_id', @value={0}",
            tenantKey);

        // Get discharged encounters from CareTransition with status filter
        // Default to "Open" status if no status provided
        var filterStatus = string.IsNullOrEmpty(status) ? "Open" : status;

        var query = _context.CareTransitions
            .Where(ct => ct.TenantKey == tenantKey && ct.Status == filterStatus);

        var dischargedEncounters = await query
            .Join(_context.Encounters,
                ct => ct.EncounterKey,
                e => (int)e.EncounterKey,
                (ct, e) => new { CareTransition = ct, Encounter = e })
            .Join(_context.Patients,
                cte => cte.Encounter.PatientKey,
                p => p.PatientKey,
                (cte, p) => new { cte.CareTransition, cte.Encounter, Patient = p })
            .Join(_context.Hospitals,
                ctep => ctep.CareTransition.HospitalKey,
                h => h.HospitalKey,
                (ctep, h) => new { ctep.CareTransition, ctep.Encounter, ctep.Patient, Hospital = h })
            .OrderByDescending(cteph => cteph.CareTransition.LastUpdatedUtc)
            .Skip(skip)
            .Take(take)
            .Select(cteph => new DischargedEncounterDto
            {
                CareTransitionKey = cteph.CareTransition.CareTransitionKey,
                EncounterKey = cteph.Encounter.EncounterKey,
                TenantKey = cteph.CareTransition.TenantKey,
                HospitalKey = cteph.CareTransition.HospitalKey,
                HospitalName = cteph.Hospital.HospitalName,
                PatientKey = cteph.Encounter.PatientKey,
                PatientName = ((cteph.Patient.GivenName ?? "") + " " + (cteph.Patient.FamilyName ?? "")).Trim(),
                VisitNumber = cteph.CareTransition.VisitNumber,
                AdmitDateTime = cteph.Encounter.AdmitDateTime,
                DischargeDateTime = cteph.Encounter.DischargeDateTime,
                Location = cteph.Encounter.Location,
                Status = cteph.CareTransition.Status,
                Priority = cteph.CareTransition.Priority,
                RiskTier = cteph.CareTransition.RiskTier,
                TcmSchedule1 = cteph.CareTransition.TcmSchedule1,
                TcmSchedule2 = cteph.CareTransition.TcmSchedule2,
                AssignedToUserKey = cteph.CareTransition.AssignedToUserKey,
                LastUpdatedUtc = cteph.CareTransition.LastUpdatedUtc
            })
            .ToListAsync();

        return dischargedEncounters;
    }

    public async Task<WriteAuditResponse> WriteAuditAsync(WriteAuditRequest request)
    {
        try
        {
            await _context.Database.ExecuteSqlRawAsync(
                "EXEC he.WriteAudit_Tenant @TenantKey, @MessageControlId, @MessageType, @EventTimestamp_TS, @SourceCode, @HospitalCode, @RawMessage, @Status, @ErrorText",
                new SqlParameter("@TenantKey", request.TenantKey),
                new SqlParameter("@MessageControlId", request.MessageControlId),
                new SqlParameter("@MessageType", request.MessageType),
                new SqlParameter("@EventTimestamp_TS", (object?)request.EventTimestamp_TS ?? DBNull.Value),
                new SqlParameter("@SourceCode", (object?)request.SourceCode ?? DBNull.Value),
                new SqlParameter("@HospitalCode", (object?)request.HospitalCode ?? DBNull.Value),
                new SqlParameter("@RawMessage", (object?)request.RawMessage ?? DBNull.Value),
                new SqlParameter("@Status", request.Status),
                new SqlParameter("@ErrorText", (object?)request.ErrorText ?? DBNull.Value));

            return new WriteAuditResponse
            {
                Success = true,
                Message = "Audit record written successfully"
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error writing audit");
            return new WriteAuditResponse
            {
                Success = false,
                Message = $"Error: {ex.Message}"
            };
        }
    }

    public async Task<IEnumerable<Hl7MessageAuditDto>> GetAuditsByTenantAsync(string tenantKey, int skip = 0, int take = 100)
    {
        await _context.Database.ExecuteSqlRawAsync(
            "EXEC sys.sp_set_session_context @key=N'tenant_id', @value={0}",
            tenantKey);

        return await _context.Hl7MessageAudits
            .Where(a => a.TenantKey == tenantKey)
            .OrderByDescending(a => a.ProcessedUtc)
            .Skip(skip)
            .Take(take)
            .Select(a => new Hl7MessageAuditDto
            {
                TenantKey = a.TenantKey,
                MessageControlId = a.MessageControlId,
                MessageType = a.MessageType,
                EventTimestamp = a.EventTimestamp,
                SourceKey = a.SourceKey,
                HospitalKey = a.HospitalKey,
                RawMessage = a.RawMessage,
                ProcessedUtc = a.ProcessedUtc,
                Status = a.Status,
                ErrorText = a.ErrorText
            })
            .ToListAsync();
    }

    public async Task<IEnumerable<Hospital>> GetHospitalsByTenantAsync(string tenantKey)
    {
        await _context.Database.ExecuteSqlRawAsync(
            "EXEC sys.sp_set_session_context @key=N'tenant_id', @value={0}",
            tenantKey);

        return await _context.Hospitals
            .Where(h => h.TenantKey == tenantKey)
            .ToListAsync();
    }

    public async Task<bool> SetHospitalStatusAsync(string tenantKey, int hospitalKey, bool isActive)
    {
        try
        {
            await _context.Database.ExecuteSqlRawAsync(
                "EXEC sys.sp_set_session_context @key=N'tenant_id', @value={0}",
                tenantKey);

            var hospital = await _context.Hospitals
                .Where(h => h.HospitalKey == hospitalKey && h.TenantKey == tenantKey)
                .FirstOrDefaultAsync();

            if (hospital == null)
                return false;

            hospital.IsActive = isActive;
            await _context.SaveChangesAsync();

            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error setting hospital status for HospitalKey={HospitalKey}, TenantKey={TenantKey}",
                hospitalKey, tenantKey);
            return false;
        }
    }

    // Provider operations
    public async Task<UpsertProviderResponse> UpsertProviderAsync(UpsertProviderRequest request)
    {
        try
        {
            var results = await _context.Database
                .SqlQueryRaw<UpsertProviderResponse>(
                    "EXEC he.UpsertProvider_Tenant @TenantKey, @NPI, @FamilyName, @GivenName, @Prefix, @Status",
                    new SqlParameter("@TenantKey", request.TenantKey),
                    new SqlParameter("@NPI", request.NPI),
                    new SqlParameter("@FamilyName", (object?)request.FamilyName ?? DBNull.Value),
                    new SqlParameter("@GivenName", (object?)request.GivenName ?? DBNull.Value),
                    new SqlParameter("@Prefix", (object?)request.Prefix ?? DBNull.Value),
                    new SqlParameter("@Status", request.Status))
                .ToListAsync();

            var result = results.FirstOrDefault();

            return result ?? new UpsertProviderResponse
            {
                Success = 0,
                Message = "Failed to upsert provider"
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error upserting provider");
            return new UpsertProviderResponse
            {
                Success = 0,
                Message = $"Error: {ex.Message}"
            };
        }
    }

    public async Task<ProviderDto?> GetProviderByKeyAsync(long providerKey, string tenantKey)
    {
        await _context.Database.ExecuteSqlRawAsync(
            "EXEC sys.sp_set_session_context @key=N'tenant_id', @value={0}",
            tenantKey);

        return await _context.Providers
            .Where(p => p.ProviderKey == providerKey && p.TenantKey == tenantKey)
            .Select(p => new ProviderDto
            {
                ProviderKey = p.ProviderKey,
                TenantKey = p.TenantKey,
                FamilyName = p.FamilyName,
                GivenName = p.GivenName,
                Prefix = p.Prefix,
                Status = p.Status,
                NPI = p.NPI,
                LastUpdatedUtc = p.LastUpdatedUtc
            })
            .FirstOrDefaultAsync();
    }

    public async Task<ProviderDto?> GetProviderByNPIAsync(string npi, string tenantKey)
    {
        await _context.Database.ExecuteSqlRawAsync(
            "EXEC sys.sp_set_session_context @key=N'tenant_id', @value={0}",
            tenantKey);

        return await _context.Providers
            .Where(p => p.NPI == npi && p.TenantKey == tenantKey)
            .Select(p => new ProviderDto
            {
                ProviderKey = p.ProviderKey,
                TenantKey = p.TenantKey,
                FamilyName = p.FamilyName,
                GivenName = p.GivenName,
                Prefix = p.Prefix,
                Status = p.Status,
                NPI = p.NPI,
                LastUpdatedUtc = p.LastUpdatedUtc
            })
            .FirstOrDefaultAsync();
    }

    public async Task<IEnumerable<ProviderDto>> GetProvidersByTenantAsync(string tenantKey, int skip = 0, int take = 100)
    {
        await _context.Database.ExecuteSqlRawAsync(
            "EXEC sys.sp_set_session_context @key=N'tenant_id', @value={0}",
            tenantKey);

        return await _context.Providers
            .Where(p => p.TenantKey == tenantKey)
            .OrderBy(p => p.FamilyName)
            .ThenBy(p => p.GivenName)
            .Skip(skip)
            .Take(take)
            .Select(p => new ProviderDto
            {
                ProviderKey = p.ProviderKey,
                TenantKey = p.TenantKey,
                FamilyName = p.FamilyName,
                GivenName = p.GivenName,
                Prefix = p.Prefix,
                Status = p.Status,
                NPI = p.NPI,
                LastUpdatedUtc = p.LastUpdatedUtc
            })
            .ToListAsync();
    }

    // CareTransition operations
    public async Task<CareTransitionResponse> CreateCareTransitionAsync(CreateCareTransitionRequest request)
    {
        try
        {
            // Set tenant context
            await _context.Database.ExecuteSqlRawAsync(
                "EXEC sys.sp_set_session_context @key=N'tenant_id', @value={0}",
                request.TenantKey);

            // Parse HL7 timestamps
            var followUpApptDateTime = ParseHL7Timestamp(request.FollowUpApptDateTime_TS);
            var communicationSentDate = ParseHL7Timestamp(request.CommunicationSentDate_TS);
            var outreachDate = ParseHL7Timestamp(request.OutreachDate_TS);
            var tcmSchedule1 = ParseHL7Timestamp(request.TcmSchedule1_TS);
            var tcmSchedule2 = ParseHL7Timestamp(request.TcmSchedule2_TS);

            var careTransition = new CareTransition
            {
                TenantKey = request.TenantKey,
                EncounterKey = request.EncounterKey,
                PatientKey = request.PatientKey,
                HospitalKey = request.HospitalKey,
                VisitNumber = request.VisitNumber,
                CareManagerUserKey = request.CareManagerUserKey,
                AssignedToUserKey = request.AssignedToUserKey,
                AssignedTeam = request.AssignedTeam,
                FollowUpProviderKey = request.FollowUpProviderKey,
                FollowUpApptDateTime = followUpApptDateTime,
                CommunicationSentDate = communicationSentDate,
                OutreachDate = outreachDate,
                OutreachMethod = request.OutreachMethod,
                TcmSchedule1 = tcmSchedule1,
                TcmSchedule2 = tcmSchedule2,
                Status = request.Status ?? "New",
                Priority = request.Priority,
                RiskTier = request.RiskTier,
                ReadmissionRiskScore = request.ReadmissionRiskScore,
                ConsentConfirmed = request.ConsentConfirmed,
                PreferredLanguage = request.PreferredLanguage,
                Notes = request.Notes,
                IsActive = true,
                CreatedUtc = DateTime.UtcNow,
                LastUpdatedUtc = DateTime.UtcNow
            };

            _context.CareTransitions.Add(careTransition);
            await _context.SaveChangesAsync();

            return new CareTransitionResponse
            {
                CareTransitionKey = careTransition.CareTransitionKey,
                Success = true,
                Message = "Care transition created successfully"
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating care transition");
            return new CareTransitionResponse
            {
                Success = false,
                Message = $"Error: {ex.Message}"
            };
        }
    }

    public async Task<CareTransitionResponse> UpdateCareTransitionAsync(UpdateCareTransitionRequest request)
    {
        try
        {
            await _context.Database.ExecuteSqlRawAsync(
                "EXEC sys.sp_set_session_context @key=N'tenant_id', @value={0}",
                request.TenantKey);

            var careTransition = await _context.CareTransitions
                .Where(ct => ct.CareTransitionKey == request.CareTransitionKey && ct.TenantKey == request.TenantKey)
                .FirstOrDefaultAsync();

            if (careTransition == null)
                return new CareTransitionResponse { Success = false, Message = "Care transition not found" };

            // Update fields
            if (!string.IsNullOrEmpty(request.CareManagerUserKey))
                careTransition.CareManagerUserKey = request.CareManagerUserKey;
            if (!string.IsNullOrEmpty(request.AssignedToUserKey))
                careTransition.AssignedToUserKey = request.AssignedToUserKey;
            if (request.AssignedTeam != null)
                careTransition.AssignedTeam = request.AssignedTeam;
            if (request.FollowUpProviderKey.HasValue)
                careTransition.FollowUpProviderKey = request.FollowUpProviderKey;
            if (request.FollowUpApptDateTime_TS != null)
                careTransition.FollowUpApptDateTime = ParseHL7Timestamp(request.FollowUpApptDateTime_TS);
            if (request.CommunicationSentDate_TS != null)
                careTransition.CommunicationSentDate = ParseHL7Timestamp(request.CommunicationSentDate_TS);
            if (request.OutreachDate_TS != null)
                careTransition.OutreachDate = ParseHL7Timestamp(request.OutreachDate_TS);
            if (request.OutreachMethod != null)
                careTransition.OutreachMethod = request.OutreachMethod;
            if (request.TcmSchedule1_TS != null)
                careTransition.TcmSchedule1 = ParseHL7Timestamp(request.TcmSchedule1_TS);
            if (request.TcmSchedule2_TS != null)
                careTransition.TcmSchedule2 = ParseHL7Timestamp(request.TcmSchedule2_TS);
            if (request.Status != null)
                careTransition.Status = request.Status;
            if (request.Priority != null)
                careTransition.Priority = request.Priority;
            if (request.RiskTier != null)
                careTransition.RiskTier = request.RiskTier;
            if (request.ReadmissionRiskScore.HasValue)
                careTransition.ReadmissionRiskScore = request.ReadmissionRiskScore;
            if (request.ConsentConfirmed.HasValue)
                careTransition.ConsentConfirmed = request.ConsentConfirmed;
            if (request.PreferredLanguage != null)
                careTransition.PreferredLanguage = request.PreferredLanguage;
            if (request.OutreachAttempts.HasValue)
                careTransition.OutreachAttempts = request.OutreachAttempts.Value;
            if (request.LastOutreachDate_TS != null)
                careTransition.LastOutreachDate = ParseHL7Timestamp(request.LastOutreachDate_TS);
            if (request.NextOutreachDate_TS != null)
                careTransition.NextOutreachDate = ParseHL7Timestamp(request.NextOutreachDate_TS);
            if (request.ContactOutcome != null)
                careTransition.ContactOutcome = request.ContactOutcome;
            if (request.Notes != null)
                careTransition.Notes = request.Notes;

            careTransition.LastUpdatedUtc = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return new CareTransitionResponse
            {
                CareTransitionKey = careTransition.CareTransitionKey,
                Success = true,
                Message = "Care transition updated successfully"
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating care transition");
            return new CareTransitionResponse
            {
                Success = false,
                Message = $"Error: {ex.Message}"
            };
        }
    }

    public async Task<CareTransitionResponse> CloseCareTransitionAsync(CloseCareTransitionRequest request)
    {
        try
        {
            await _context.Database.ExecuteSqlRawAsync(
                "EXEC sys.sp_set_session_context @key=N'tenant_id', @value={0}",
                request.TenantKey);

            var careTransition = await _context.CareTransitions
                .Where(ct => ct.CareTransitionKey == request.CareTransitionKey && ct.TenantKey == request.TenantKey)
                .FirstOrDefaultAsync();

            if (careTransition == null)
                return new CareTransitionResponse { Success = false, Message = "Care transition not found" };

            careTransition.Status = "Closed";
            careTransition.CloseReason = request.CloseReason;
            careTransition.ClosedByUserKey = request.ClosedByUserKey;
            careTransition.ClosedUtc = DateTime.UtcNow;
            careTransition.IsActive = false;
            careTransition.LastUpdatedUtc = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return new CareTransitionResponse
            {
                CareTransitionKey = careTransition.CareTransitionKey,
                Success = true,
                Message = "Care transition closed successfully"
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error closing care transition");
            return new CareTransitionResponse
            {
                Success = false,
                Message = $"Error: {ex.Message}"
            };
        }
    }

    public async Task<CareTransitionDto?> GetCareTransitionByKeyAsync(int careTransitionKey, string tenantKey)
    {
        await _context.Database.ExecuteSqlRawAsync(
            "EXEC sys.sp_set_session_context @key=N'tenant_id', @value={0}",
            tenantKey);

        return await _context.CareTransitions
            .Where(ct => ct.CareTransitionKey == careTransitionKey && ct.TenantKey == tenantKey)
            .Select(ct => new CareTransitionDto
            {
                CareTransitionKey = ct.CareTransitionKey,
                TenantKey = ct.TenantKey,
                EncounterKey = ct.EncounterKey,
                PatientKey = ct.PatientKey,
                HospitalKey = ct.HospitalKey,
                VisitNumber = ct.VisitNumber,
                CareManagerUserKey = ct.CareManagerUserKey,
                AssignedToUserKey = ct.AssignedToUserKey,
                AssignedTeam = ct.AssignedTeam,
                FollowUpProviderKey = ct.FollowUpProviderKey,
                FollowUpApptDateTime = ct.FollowUpApptDateTime,
                CommunicationSentDate = ct.CommunicationSentDate,
                OutreachDate = ct.OutreachDate,
                OutreachMethod = ct.OutreachMethod,
                TcmSchedule1 = ct.TcmSchedule1,
                TcmSchedule2 = ct.TcmSchedule2,
                Status = ct.Status,
                Priority = ct.Priority,
                RiskTier = ct.RiskTier,
                ReadmissionRiskScore = ct.ReadmissionRiskScore,
                ConsentConfirmed = ct.ConsentConfirmed,
                PreferredLanguage = ct.PreferredLanguage,
                OutreachAttempts = ct.OutreachAttempts,
                LastOutreachDate = ct.LastOutreachDate,
                NextOutreachDate = ct.NextOutreachDate,
                ContactOutcome = ct.ContactOutcome,
                CloseReason = ct.CloseReason,
                ClosedByUserKey = ct.ClosedByUserKey,
                ClosedUtc = ct.ClosedUtc,
                Notes = ct.Notes,
                IsActive = ct.IsActive,
                CreatedUtc = ct.CreatedUtc,
                LastUpdatedUtc = ct.LastUpdatedUtc,
                Patient = null,  // Navigation properties removed due to type mismatch
                FollowUpProvider = null  // Navigation properties removed due to type mismatch
            })
            .FirstOrDefaultAsync();
    }

    public async Task<CareTransitionDto?> GetCareTransitionByEncounterAsync(int encounterKey, string tenantKey)
    {
        await _context.Database.ExecuteSqlRawAsync(
            "EXEC sys.sp_set_session_context @key=N'tenant_id', @value={0}",
            tenantKey);

        var careTransition = await _context.CareTransitions
            .Where(ct => ct.EncounterKey == encounterKey && ct.TenantKey == tenantKey)
            .FirstOrDefaultAsync();

        if (careTransition == null)
            return null;

        // Get related patient information
        var patient = await _context.Patients
            .Where(p => p.PatientKey == careTransition.PatientKey && p.TenantKey == tenantKey)
            .Select(p => new PatientInfoDto
            {
                PatientKey = p.PatientKey,
                PatientName = (p.GivenName ?? "") + " " + (p.FamilyName ?? ""),
                GivenName = p.GivenName,
                FamilyName = p.FamilyName,
                MRN = p.MRN,
                PatientIdExternal = p.PatientIdExternal,
                Phone = p.Phone,
                DOB = p.DOB
            })
            .FirstOrDefaultAsync();

        // Get related encounter information
        var encounter = await _context.Encounters
            .Where(e => e.EncounterKey == careTransition.EncounterKey && e.TenantKey == tenantKey)
            .FirstOrDefaultAsync();

        // Get follow-up provider if exists
        ProviderDto? followUpProvider = null;
        if (careTransition.FollowUpProviderKey.HasValue)
        {
            followUpProvider = await GetProviderByKeyAsync(careTransition.FollowUpProviderKey.Value, tenantKey);
        }

        return new CareTransitionDto
        {
            CareTransitionKey = careTransition.CareTransitionKey,
            TenantKey = careTransition.TenantKey,
            EncounterKey = careTransition.EncounterKey,
            PatientKey = careTransition.PatientKey,
            HospitalKey = careTransition.HospitalKey,
            VisitNumber = careTransition.VisitNumber,
            CareManagerUserKey = careTransition.CareManagerUserKey,
            AssignedToUserKey = careTransition.AssignedToUserKey,
            AssignedTeam = careTransition.AssignedTeam,
            FollowUpProviderKey = careTransition.FollowUpProviderKey,
            FollowUpApptDateTime = careTransition.FollowUpApptDateTime,
            CommunicationSentDate = careTransition.CommunicationSentDate,
            OutreachDate = careTransition.OutreachDate,
            OutreachMethod = careTransition.OutreachMethod,
            TcmSchedule1 = careTransition.TcmSchedule1,
            TcmSchedule2 = careTransition.TcmSchedule2,
            Status = careTransition.Status,
            Priority = careTransition.Priority,
            RiskTier = careTransition.RiskTier,
            ReadmissionRiskScore = careTransition.ReadmissionRiskScore,
            ConsentConfirmed = careTransition.ConsentConfirmed,
            PreferredLanguage = careTransition.PreferredLanguage,
            OutreachAttempts = careTransition.OutreachAttempts,
            LastOutreachDate = careTransition.LastOutreachDate,
            NextOutreachDate = careTransition.NextOutreachDate,
            ContactOutcome = careTransition.ContactOutcome,
            CloseReason = careTransition.CloseReason,
            ClosedByUserKey = careTransition.ClosedByUserKey,
            ClosedUtc = careTransition.ClosedUtc,
            Notes = careTransition.Notes,
            IsActive = careTransition.IsActive,
            CreatedUtc = careTransition.CreatedUtc,
            LastUpdatedUtc = careTransition.LastUpdatedUtc,
            Patient = patient,
            FollowUpProvider = followUpProvider,
            Encounter = encounter != null ? new EncounterInfoDto
            {
                EncounterKey = encounter.EncounterKey,
                AdmitDateTime = encounter.AdmitDateTime,
                DischargeDateTime = encounter.DischargeDateTime,
                Location = encounter.Location,
                VisitStatus = encounter.VisitStatus,
                Notes = encounter.Notes,
                AttendingDoctor = encounter.AttendingDoctor,
                PrimaryDoctor = encounter.PrimaryDoctor,
                AdmittingDoctor = encounter.AdmittingDoctor
            } : null
        };
    }

    public async Task<IEnumerable<CareTransitionDto>> GetCareTransitionsByPatientAsync(int patientKey, string tenantKey)
    {
        await _context.Database.ExecuteSqlRawAsync(
            "EXEC sys.sp_set_session_context @key=N'tenant_id', @value={0}",
            tenantKey);

        return await _context.CareTransitions
            .Where(ct => ct.PatientKey == patientKey && ct.TenantKey == tenantKey)
            
            
            .OrderByDescending(ct => ct.CreatedUtc)
            .Select(ct => new CareTransitionDto
            {
                CareTransitionKey = ct.CareTransitionKey,
                TenantKey = ct.TenantKey,
                EncounterKey = ct.EncounterKey,
                PatientKey = ct.PatientKey,
                HospitalKey = ct.HospitalKey,
                VisitNumber = ct.VisitNumber,
                Status = ct.Status,
                Priority = ct.Priority,
                RiskTier = ct.RiskTier,
                TcmSchedule1 = ct.TcmSchedule1,
                TcmSchedule2 = ct.TcmSchedule2,
                NextOutreachDate = ct.NextOutreachDate,
                OutreachAttempts = ct.OutreachAttempts,
                IsActive = ct.IsActive,
                CreatedUtc = ct.CreatedUtc,
                LastUpdatedUtc = ct.LastUpdatedUtc,
                Patient = null  // Navigation properties removed
            })
            .ToListAsync();
    }

    public async Task<IEnumerable<CareTransitionSummaryDto>> GetCareTransitionsByStatusAsync(string status, string tenantKey, int skip = 0, int take = 100)
    {
        await _context.Database.ExecuteSqlRawAsync(
            "EXEC sys.sp_set_session_context @key=N'tenant_id', @value={0}",
            tenantKey);

        return await _context.CareTransitions
            .Where(ct => ct.Status == status && ct.TenantKey == tenantKey)
            
            .OrderBy(ct => ct.NextOutreachDate ?? ct.TcmSchedule1 ?? ct.CreatedUtc)
            .Skip(skip)
            .Take(take)
            .Select(ct => new CareTransitionSummaryDto
            {
                CareTransitionKey = ct.CareTransitionKey,
                TenantKey = ct.TenantKey,
                PatientKey = ct.PatientKey,
                PatientName = null,
                VisitNumber = ct.VisitNumber,
                Status = ct.Status,
                Priority = ct.Priority,
                RiskTier = ct.RiskTier,
                TcmSchedule1 = ct.TcmSchedule1,
                TcmSchedule2 = ct.TcmSchedule2,
                NextOutreachDate = ct.NextOutreachDate,
                OutreachAttempts = ct.OutreachAttempts,
                CreatedUtc = ct.CreatedUtc,
                LastUpdatedUtc = ct.LastUpdatedUtc
            })
            .ToListAsync();
    }

    public async Task<IEnumerable<CareTransitionSummaryDto>> GetActiveCareTransitionsAsync(string tenantKey, int skip = 0, int take = 100)
    {
        await _context.Database.ExecuteSqlRawAsync(
            "EXEC sys.sp_set_session_context @key=N'tenant_id', @value={0}",
            tenantKey);

        return await _context.CareTransitions
            .Where(ct => ct.IsActive && ct.TenantKey == tenantKey)
            
            .OrderBy(ct => ct.NextOutreachDate ?? ct.TcmSchedule1 ?? ct.CreatedUtc)
            .Skip(skip)
            .Take(take)
            .Select(ct => new CareTransitionSummaryDto
            {
                CareTransitionKey = ct.CareTransitionKey,
                TenantKey = ct.TenantKey,
                PatientKey = ct.PatientKey,
                PatientName = null,
                VisitNumber = ct.VisitNumber,
                Status = ct.Status,
                Priority = ct.Priority,
                RiskTier = ct.RiskTier,
                TcmSchedule1 = ct.TcmSchedule1,
                TcmSchedule2 = ct.TcmSchedule2,
                NextOutreachDate = ct.NextOutreachDate,
                OutreachAttempts = ct.OutreachAttempts,
                CreatedUtc = ct.CreatedUtc,
                LastUpdatedUtc = ct.LastUpdatedUtc
            })
            .ToListAsync();
    }

    public async Task<IEnumerable<CareTransitionSummaryDto>> GetCareTransitionsByTenantAsync(string tenantKey, int skip = 0, int take = 100)
    {
        await _context.Database.ExecuteSqlRawAsync(
            "EXEC sys.sp_set_session_context @key=N'tenant_id', @value={0}",
            tenantKey);

        var careTransitions = await _context.CareTransitions
            .Where(ct => ct.TenantKey == tenantKey)
            .OrderByDescending(ct => ct.CreatedUtc)
            .Skip(skip)
            .Take(take)
            .ToListAsync();

        var encounterKeys = careTransitions.Select(ct => (long)ct.EncounterKey).Distinct().ToList();
        var encounters = await _context.Encounters
            .Where(e => e.TenantKey == tenantKey && encounterKeys.Contains(e.EncounterKey))
            .ToDictionaryAsync(e => (int)e.EncounterKey, e => e);

        var patientKeys = careTransitions.Select(ct => (long)ct.PatientKey).Distinct().ToList();
        var patients = await _context.Patients
            .Where(p => p.TenantKey == tenantKey && patientKeys.Contains(p.PatientKey))
            .ToDictionaryAsync(p => (int)p.PatientKey, p => p);

        var hospitalKeys = careTransitions.Select(ct => ct.HospitalKey).Distinct().ToList();
        var hospitals = await _context.Hospitals
            .Where(h => h.TenantKey == tenantKey && hospitalKeys.Contains(h.HospitalKey))
            .ToDictionaryAsync(h => h.HospitalKey, h => h);

        return careTransitions.Select(ct =>
        {
            encounters.TryGetValue(ct.EncounterKey, out var encounter);
            patients.TryGetValue(ct.PatientKey, out var patient);
            hospitals.TryGetValue(ct.HospitalKey, out var hospital);

            return new CareTransitionSummaryDto
            {
                CareTransitionKey = ct.CareTransitionKey,
                TenantKey = ct.TenantKey,
                EncounterKey = ct.EncounterKey,
                PatientKey = ct.PatientKey,
                PatientName = patient != null
                    ? patient.FamilyName + ", " + patient.GivenName
                    : null,
                HospitalKey = ct.HospitalKey,
                VisitNumber = ct.VisitNumber,
                Status = ct.Status,
                Priority = ct.Priority,
                RiskTier = ct.RiskTier,
                TcmSchedule1 = ct.TcmSchedule1,
                TcmSchedule2 = ct.TcmSchedule2,
                NextOutreachDate = ct.NextOutreachDate,
                OutreachAttempts = ct.OutreachAttempts,
                CreatedUtc = ct.CreatedUtc,
                LastUpdatedUtc = ct.LastUpdatedUtc,
                CareManagerUserKey = ct.CareManagerUserKey,
                AssignedToUserKey = ct.AssignedToUserKey,
                AssignedTeam = ct.AssignedTeam,
                Encounter = encounter != null ? new EncounterInfoDto
                {
                    EncounterKey = encounter.EncounterKey,
                    AdmitDateTime = encounter.AdmitDateTime,
                    DischargeDateTime = encounter.DischargeDateTime
                } : null,
                Patient = patient != null ? new PatientInfoDto
                {
                    PatientKey = patient.PatientKey,
                    PatientIdExternal = patient.PatientIdExternal,
                    PatientName = patient.FamilyName + ", " + patient.GivenName,
                    MRN = patient.MRN,
                    SSN = patient.SSN,
                    FamilyName = patient.FamilyName,
                    GivenName = patient.GivenName,
                    DOB = patient.DOB,
                    Sex = patient.Sex,
                    Phone = patient.Phone,
                    CustodianName = patient.CustodianName,
                    CustodianPhone = patient.CustodianPhone,
                    AddressLine1 = patient.AddressLine1,
                    City = patient.City,
                    State = patient.State,
                    PostalCode = patient.PostalCode
                } : null,
                Hospital = hospital != null ? new HospitalInfoDto
                {
                    HospitalKey = hospital.HospitalKey,
                    HospitalCode = hospital.HospitalCode,
                    HospitalName = hospital.HospitalName,
                    AssigningAuthority = hospital.AssigningAuthority,
                    City = hospital.City,
                    State = hospital.State,
                    IsActive = hospital.IsActive
                } : null
            };
        }).ToList();
    }

    public async Task<CareTransitionResponse> LogOutreachAsync(LogOutreachRequest request)
    {
        try
        {
            var careTransition = await _context.CareTransitions
                .Where(ct => ct.CareTransitionKey == request.CareTransitionKey && ct.TenantKey == request.TenantKey)
                .FirstOrDefaultAsync();

            if (careTransition == null)
            {
                return new CareTransitionResponse
                {
                    Success = false,
                    Message = "CareTransition not found"
                };
            }

            // Always increment outreach attempts (ignore client-provided value)
            careTransition.OutreachAttempts++;

            // Update outreach date and last outreach date
            DateTime outreachDateTime;
            if (!string.IsNullOrWhiteSpace(request.OutreachDate))
            {
                if (DateTime.TryParse(request.OutreachDate, out var parsedDate))
                    outreachDateTime = parsedDate;
                else
                    outreachDateTime = DateTime.UtcNow;
            }
            else
            {
                outreachDateTime = DateTime.UtcNow;
            }

            careTransition.OutreachDate = outreachDateTime;
            careTransition.LastOutreachDate = outreachDateTime;

            // Update outreach method if provided
            if (!string.IsNullOrWhiteSpace(request.OutreachMethod))
                careTransition.OutreachMethod = request.OutreachMethod;

            // Update contact outcome if provided
            if (!string.IsNullOrWhiteSpace(request.ContactOutcome))
                careTransition.ContactOutcome = request.ContactOutcome;

            // Update next outreach date if provided
            if (!string.IsNullOrWhiteSpace(request.NextOutreachDate_TS))
                careTransition.NextOutreachDate = ParseHL7Timestamp(request.NextOutreachDate_TS);

            // Update assigned user if provided
            if (!string.IsNullOrEmpty(request.AssignedToUserKey))
                careTransition.AssignedToUserKey = request.AssignedToUserKey;

            // Update status if provided, otherwise set to "In Progress"
            if (!string.IsNullOrWhiteSpace(request.Status))
                careTransition.Status = request.Status;
            else
                careTransition.Status = "InProgress";

            // Append notes if provided
            if (!string.IsNullOrWhiteSpace(request.Notes))
            {
                var timestamp = DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss UTC");
                var newNote = $"[{timestamp}] Outreach #{careTransition.OutreachAttempts}: {request.Notes}";
                careTransition.Notes = string.IsNullOrWhiteSpace(careTransition.Notes)
                    ? newNote
                    : careTransition.Notes + "\n" + newNote;
            }

            careTransition.LastUpdatedUtc = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return new CareTransitionResponse
            {
                CareTransitionKey = careTransition.CareTransitionKey,
                Success = true,
                Message = "Outreach logged successfully"
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error logging outreach for CareTransition {CareTransitionKey}", request.CareTransitionKey);
            return new CareTransitionResponse
            {
                Success = false,
                Message = $"Error: {ex.Message}"
            };
        }
    }

    public async Task<CareTransitionAssignmentDto?> GetCareTransitionAssignmentAsync(int careTransitionKey, string tenantKey)
    {
        try
        {
            // Set tenant context for RLS
            await _context.Database.ExecuteSqlRawAsync(
                "EXEC sys.sp_set_session_context @key=N'tenant_id', @value={0}",
                tenantKey);

            var assignment = await _context.CareTransitions
                .Where(ct => ct.CareTransitionKey == careTransitionKey && ct.TenantKey == tenantKey)
                .Select(ct => new CareTransitionAssignmentDto
                {
                    CareTransitionKey = ct.CareTransitionKey,
                    TenantKey = ct.TenantKey,
                    CareManagerUserKey = ct.CareManagerUserKey,
                    AssignedToUserKey = ct.AssignedToUserKey,
                    AssignedTeam = ct.AssignedTeam,
                    LastUpdatedUtc = ct.LastUpdatedUtc
                })
                .FirstOrDefaultAsync();

            return assignment;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting assignment for CareTransition {CareTransitionKey}", careTransitionKey);
            return null;
        }
    }

    public async Task<CareTransitionResponse> AssignCareManagerAsync(AssignCareManagerRequest request)
    {
        try
        {
            // Set tenant context for RLS
            await _context.Database.ExecuteSqlRawAsync(
                "EXEC sys.sp_set_session_context @key=N'tenant_id', @value={0}",
                request.TenantKey);

            var careTransition = await _context.CareTransitions
                .Where(ct => ct.CareTransitionKey == request.CareTransitionKey && ct.TenantKey == request.TenantKey)
                .FirstOrDefaultAsync();

            if (careTransition == null)
            {
                return new CareTransitionResponse
                {
                    Success = false,
                    Message = "CareTransition not found"
                };
            }

            // Update assignment fields
            careTransition.CareManagerUserKey = request.CareManagerUserKey;
            careTransition.AssignedToUserKey = request.AssignedToUserKey;
            careTransition.AssignedTeam = request.AssignedTeam;
            careTransition.LastUpdatedUtc = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return new CareTransitionResponse
            {
                CareTransitionKey = careTransition.CareTransitionKey,
                Success = true,
                Message = "Care manager assigned successfully"
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error assigning care manager for CareTransition {CareTransitionKey}", request.CareTransitionKey);
            return new CareTransitionResponse
            {
                Success = false,
                Message = $"Error: {ex.Message}"
            };
        }
    }

    public async Task<CareTransitionResponse> UpdatePriorityAsync(UpdatePriorityRequest request)
    {
        try
        {
            await _context.Database.ExecuteSqlRawAsync(
                "EXEC sys.sp_set_session_context @key=N'tenant_id', @value={0}",
                request.TenantKey);

            var careTransition = await _context.CareTransitions
                .Where(ct => ct.CareTransitionKey == request.CareTransitionKey && ct.TenantKey == request.TenantKey)
                .FirstOrDefaultAsync();

            if (careTransition == null)
            {
                return new CareTransitionResponse
                {
                    Success = false,
                    Message = "CareTransition not found"
                };
            }

            careTransition.Priority = request.Priority;
            careTransition.LastUpdatedUtc = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return new CareTransitionResponse
            {
                CareTransitionKey = careTransition.CareTransitionKey,
                Success = true,
                Message = "Priority updated successfully"
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating priority for CareTransition {CareTransitionKey}", request.CareTransitionKey);
            return new CareTransitionResponse
            {
                Success = false,
                Message = $"Error: {ex.Message}"
            };
        }
    }

    public async Task<CareTransitionResponse> UpdateRiskTierAsync(UpdateRiskTierRequest request)
    {
        try
        {
            await _context.Database.ExecuteSqlRawAsync(
                "EXEC sys.sp_set_session_context @key=N'tenant_id', @value={0}",
                request.TenantKey);

            var careTransition = await _context.CareTransitions
                .Where(ct => ct.CareTransitionKey == request.CareTransitionKey && ct.TenantKey == request.TenantKey)
                .FirstOrDefaultAsync();

            if (careTransition == null)
            {
                return new CareTransitionResponse
                {
                    Success = false,
                    Message = "CareTransition not found"
                };
            }

            careTransition.RiskTier = request.RiskTier;
            careTransition.LastUpdatedUtc = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return new CareTransitionResponse
            {
                CareTransitionKey = careTransition.CareTransitionKey,
                Success = true,
                Message = "Risk tier updated successfully"
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating risk tier for CareTransition {CareTransitionKey}", request.CareTransitionKey);
            return new CareTransitionResponse
            {
                Success = false,
                Message = $"Error: {ex.Message}"
            };
        }
    }

    public async Task<TcmMetricsDto> GetTcmMetricsAsync(string tenantKey, DateTime? from, DateTime? to)
    {
        try
        {
            var query = _context.CareTransitions
                .Where(ct => ct.TenantKey == tenantKey);

            // Apply date filters if provided
            if (from.HasValue)
                query = query.Where(ct => ct.CreatedUtc >= from.Value);

            if (to.HasValue)
                query = query.Where(ct => ct.CreatedUtc <= to.Value);

            var careTransitions = await query.ToListAsync();

            var metrics = new TcmMetricsDto
            {
                TotalActiveCareTransitions = careTransitions.Count(ct => ct.IsActive),
                TotalClosedCareTransitions = careTransitions.Count(ct => !ct.IsActive),
                HighRiskCount = careTransitions.Count(ct => ct.IsActive && ct.RiskTier == "High"),
                MediumRiskCount = careTransitions.Count(ct => ct.IsActive && ct.RiskTier == "Medium"),
                LowRiskCount = careTransitions.Count(ct => ct.IsActive && ct.RiskTier == "Low"),
                PendingOutreachCount = careTransitions.Count(ct => ct.IsActive && ct.NextOutreachDate <= DateTime.UtcNow),
                CompletedTcm14DayCount = careTransitions.Count(ct => ct.TcmSchedule2.HasValue && ct.TcmSchedule2.Value <= DateTime.UtcNow),
                CompletedTcm7DayCount = careTransitions.Count(ct => ct.TcmSchedule1.HasValue && ct.TcmSchedule1.Value <= DateTime.UtcNow),
                AverageOutreachAttempts = careTransitions.Any() ? careTransitions.Average(ct => ct.OutreachAttempts) : 0,
                StatusBreakdown = careTransitions
                    .GroupBy(ct => ct.Status)
                    .ToDictionary(g => g.Key, g => g.Count())
            };

            return metrics;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving TCM metrics for tenant {TenantKey}", tenantKey);
            return new TcmMetricsDto(); // Return empty metrics on error
        }
    }

    public async Task<IEnumerable<TimelineEventDto>> GetTimelineAsync(int careTransitionKey, string tenantKey)
    {
        try
        {
            var careTransition = await _context.CareTransitions
                .Where(ct => ct.CareTransitionKey == careTransitionKey && ct.TenantKey == tenantKey)
                .FirstOrDefaultAsync();

            if (careTransition == null)
                return Enumerable.Empty<TimelineEventDto>();

            var timeline = new List<TimelineEventDto>();
            int eventId = 1;

            // Created event
            timeline.Add(new TimelineEventDto
            {
                EventId = eventId++,
                EventType = "Created",
                Description = "Care transition created",
                EventTimestamp = careTransition.CreatedUtc
            });

            // Assignment events
            if (!string.IsNullOrEmpty(careTransition.CareManagerUserKey))
            {
                timeline.Add(new TimelineEventDto
                {
                    EventId = eventId++,
                    EventType = "Assignment",
                    Description = "Care manager assigned",
                    EventTimestamp = careTransition.CreatedUtc,
                    Metadata = new Dictionary<string, string>
                    {
                        ["CareManagerUserKey"] = careTransition.CareManagerUserKey
                    }
                });
            }

            // Communication events
            if (careTransition.CommunicationSentDate.HasValue)
            {
                timeline.Add(new TimelineEventDto
                {
                    EventId = eventId++,
                    EventType = "Communication",
                    Description = "Communication sent to patient",
                    EventTimestamp = careTransition.CommunicationSentDate.Value
                });
            }

            // TCM Contact events
            if (careTransition.OutreachDate.HasValue)
            {
                timeline.Add(new TimelineEventDto
                {
                    EventId = eventId++,
                    EventType = "TCM Contact",
                    Description = $"TCM contact made via {careTransition.OutreachMethod ?? "unknown method"}",
                    EventTimestamp = careTransition.OutreachDate.Value,
                    Metadata = new Dictionary<string, string>
                    {
                        ["ContactMethod"] = careTransition.OutreachMethod ?? ""
                    }
                });
            }

            // Outreach events
            if (careTransition.OutreachAttempts > 0 && careTransition.LastOutreachDate.HasValue)
            {
                timeline.Add(new TimelineEventDto
                {
                    EventId = eventId++,
                    EventType = "Outreach",
                    Description = $"{careTransition.OutreachAttempts} outreach attempt(s) - Last: {careTransition.ContactOutcome ?? "No outcome recorded"}",
                    EventTimestamp = careTransition.LastOutreachDate.Value,
                    Metadata = new Dictionary<string, string>
                    {
                        ["OutreachAttempts"] = careTransition.OutreachAttempts.ToString(),
                        ["ContactOutcome"] = careTransition.ContactOutcome ?? ""
                    }
                });
            }

            // Follow-up appointment scheduled
            if (careTransition.FollowUpApptDateTime.HasValue)
            {
                timeline.Add(new TimelineEventDto
                {
                    EventId = eventId++,
                    EventType = "Appointment",
                    Description = "Follow-up appointment scheduled",
                    EventTimestamp = careTransition.FollowUpApptDateTime.Value,
                    Metadata = new Dictionary<string, string>
                    {
                        ["ProviderKey"] = careTransition.FollowUpProviderKey?.ToString() ?? ""
                    }
                });
            }

            // Closed event
            if (!careTransition.IsActive && careTransition.ClosedUtc.HasValue)
            {
                timeline.Add(new TimelineEventDto
                {
                    EventId = eventId++,
                    EventType = "Closed",
                    Description = $"Care transition closed: {careTransition.CloseReason ?? "No reason provided"}",
                    EventTimestamp = careTransition.ClosedUtc.Value,
                    Metadata = new Dictionary<string, string>
                    {
                        ["CloseReason"] = careTransition.CloseReason ?? "",
                        ["ClosedByUserKey"] = careTransition.ClosedByUserKey?.ToString() ?? ""
                    }
                });
            }

            return timeline.OrderBy(e => e.EventTimestamp).ToList();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving timeline for CareTransition {CareTransitionKey}", careTransitionKey);
            return Enumerable.Empty<TimelineEventDto>();
        }
    }

    public async Task<IEnumerable<OverdueTcmEncounterDto>> GetOverdueTcmEncountersAsync(string tenantKey)
    {
        try
        {
            await _context.Database.ExecuteSqlRawAsync(
                "EXEC sys.sp_set_session_context @key=N'tenant_id', @value={0}",
                tenantKey);

            var now = DateTime.UtcNow;

            // Get all care transitions with TcmSchedule1 that are not closed, with patient and hospital info
            var overdueEncounters = await _context.CareTransitions
                .Where(ct => ct.TenantKey == tenantKey
                    && ct.TcmSchedule1 != null
                    && ct.Status != "Closed")
                .Join(_context.Patients,
                    ct => ct.PatientKey,
                    p => p.PatientKey,
                    (ct, p) => new { CareTransition = ct, Patient = p })
                .Join(_context.Hospitals,
                    ctp => ctp.CareTransition.HospitalKey,
                    h => h.HospitalKey,
                    (ctp, h) => new { ctp.CareTransition, ctp.Patient, Hospital = h })
                .Join(_context.Encounters,
                    ctph => ctph.CareTransition.EncounterKey,
                    e => e.EncounterKey,
                    (ctph, e) => new
                    {
                        ctph.CareTransition,
                        ctph.Patient,
                        ctph.Hospital,
                        Encounter = e
                    })
                .ToListAsync();

            _logger.LogInformation("Found {Count} care transitions with TcmSchedule1 for tenant {TenantKey}",
                overdueEncounters.Count, tenantKey);

            // Filter in memory to handle DateTime kind issues and create DTOs
            var result = overdueEncounters
                .Where(x => x.CareTransition.TcmSchedule1.HasValue && x.CareTransition.TcmSchedule1.Value < now)
                .Select(x => new OverdueTcmEncounterDto
                {
                    EncounterKey = x.CareTransition.EncounterKey,
                    CareTransitionKey = x.CareTransition.CareTransitionKey,
                    TenantKey = x.CareTransition.TenantKey,
                    PatientName = ((x.Patient.GivenName ?? "") + " " + (x.Patient.FamilyName ?? "")).Trim(),
                    Location = x.Hospital.HospitalName + (x.Hospital.City != null ? ", " + x.Hospital.City : ""),
                    DischargeDateTime = x.Encounter.DischargeDateTime,
                    TcmSchedule1 = x.CareTransition.TcmSchedule1,
                    DaysPassed = x.CareTransition.TcmSchedule1 != null
                        ? Math.Floor((now - x.CareTransition.TcmSchedule1.Value).TotalDays) + "d"
                        : "0d",
                    Status = x.CareTransition.Status,
                    Priority = x.CareTransition.Priority ?? "",
                    RiskTier = x.CareTransition.RiskTier ?? "",
                    VisitNumber = x.CareTransition.VisitNumber
                })
                .OrderByDescending(x => x.TcmSchedule1)
                .ToList();

            _logger.LogInformation("Returning {Count} overdue TCM encounters for tenant {TenantKey}",
                result.Count, tenantKey);

            return result;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving overdue TCM encounters for tenant {TenantKey}", tenantKey);
            return Enumerable.Empty<OverdueTcmEncounterDto>();
        }
    }

    public async Task<IEnumerable<OverdueTcmEncounterDto>> GetOverdueTcm2EncountersAsync(string tenantKey)
    {
        try
        {
            await _context.Database.ExecuteSqlRawAsync(
                "EXEC sys.sp_set_session_context @key=N'tenant_id', @value={0}",
                tenantKey);

            var now = DateTime.UtcNow;

            // Get all care transitions with TcmSchedule2 that are not closed, with patient and hospital info
            var overdueEncounters = await _context.CareTransitions
                .Where(ct => ct.TenantKey == tenantKey
                    && ct.TcmSchedule2 != null
                    && ct.Status != "Closed")
                .Join(_context.Patients,
                    ct => ct.PatientKey,
                    p => p.PatientKey,
                    (ct, p) => new { CareTransition = ct, Patient = p })
                .Join(_context.Hospitals,
                    ctp => ctp.CareTransition.HospitalKey,
                    h => h.HospitalKey,
                    (ctp, h) => new { ctp.CareTransition, ctp.Patient, Hospital = h })
                .Join(_context.Encounters,
                    ctph => ctph.CareTransition.EncounterKey,
                    e => e.EncounterKey,
                    (ctph, e) => new
                    {
                        ctph.CareTransition,
                        ctph.Patient,
                        ctph.Hospital,
                        Encounter = e
                    })
                .ToListAsync();

            _logger.LogInformation("Found {Count} care transitions with TcmSchedule2 for tenant {TenantKey}",
                overdueEncounters.Count, tenantKey);

            // Filter in memory to handle DateTime kind issues and create DTOs
            var result = overdueEncounters
                .Where(x => x.CareTransition.TcmSchedule2.HasValue && x.CareTransition.TcmSchedule2.Value < now)
                .Select(x => new OverdueTcmEncounterDto
                {
                    EncounterKey = x.CareTransition.EncounterKey,
                    CareTransitionKey = x.CareTransition.CareTransitionKey,
                    TenantKey = x.CareTransition.TenantKey,
                    PatientName = ((x.Patient.GivenName ?? "") + " " + (x.Patient.FamilyName ?? "")).Trim(),
                    Location = x.Hospital.HospitalName + (x.Hospital.City != null ? ", " + x.Hospital.City : ""),
                    DischargeDateTime = x.Encounter.DischargeDateTime,
                    TcmSchedule1 = x.CareTransition.TcmSchedule2, // Using TcmSchedule2 in this field
                    DaysPassed = x.CareTransition.TcmSchedule2 != null
                        ? Math.Floor((now - x.CareTransition.TcmSchedule2.Value).TotalDays) + "d"
                        : "0d",
                    Status = x.CareTransition.Status,
                    Priority = x.CareTransition.Priority ?? "",
                    RiskTier = x.CareTransition.RiskTier ?? "",
                    VisitNumber = x.CareTransition.VisitNumber
                })
                .OrderByDescending(x => x.TcmSchedule1)
                .ToList();

            _logger.LogInformation("Returning {Count} overdue TCM2 encounters for tenant {TenantKey}",
                result.Count, tenantKey);

            return result;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving overdue TCM2 encounters for tenant {TenantKey}", tenantKey);
            return Enumerable.Empty<OverdueTcmEncounterDto>();
        }
    }

    private DateTime? ParseHL7Timestamp(string? timestamp)
    {
        if (string.IsNullOrWhiteSpace(timestamp))
            return null;

        // First, try parsing as ISO 8601 / standard DateTime format (e.g., "2025-10-27T14:07:00.000Z")
        if (DateTime.TryParse(timestamp, out var isoDate))
            return isoDate;

        // If that fails and it's at least 8 characters, try parsing as HL7 format (e.g., "20251027140700")
        if (timestamp.Length < 8)
            return null;

        try
        {
            var dateStr = timestamp.Substring(0, 4) + "-" + timestamp.Substring(4, 2) + "-" + timestamp.Substring(6, 2);
            if (timestamp.Length >= 14)
            {
                dateStr += " " + timestamp.Substring(8, 2) + ":" + timestamp.Substring(10, 2) + ":" + timestamp.Substring(12, 2);
            }
            return DateTime.Parse(dateStr);
        }
        catch
        {
            return null;
        }
    }
}
