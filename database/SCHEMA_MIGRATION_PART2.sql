/*
===============================================================================
Health Extent Database Schema Migration - Part 2
===============================================================================
This script creates the remaining stored procedures with updated signatures
for NVARCHAR(64) TenantKey and new fields.

Run this after SCHEMA_MIGRATION.sql completes successfully.
===============================================================================
*/

USE [he-healthcare-db];
GO

-- Drop existing stored procedures if they exist
IF OBJECT_ID('he.UpsertEncounter_Tenant', 'P') IS NOT NULL DROP PROCEDURE he.UpsertEncounter_Tenant;
IF OBJECT_ID('he.WriteAudit_Tenant', 'P') IS NOT NULL DROP PROCEDURE he.WriteAudit_Tenant;
GO

-- ============================================================================
-- UpsertEncounter_Tenant: Create or update encounter with Status field
-- ============================================================================
CREATE PROCEDURE he.UpsertEncounter_Tenant
    @TenantKey NVARCHAR(64),
    @HospitalCode NVARCHAR(64),
    @VisitNumber NVARCHAR(64),
    @PatientKey BIGINT,
    @Admit_TS NVARCHAR(14) = NULL,
    @Discharge_TS NVARCHAR(14) = NULL,
    @PatientClass NVARCHAR(10) = NULL,
    @Location NVARCHAR(100) = NULL,
    @AttendingDoctor NVARCHAR(200) = NULL,
    @PrimaryDoctor NVARCHAR(200) = NULL,
    @AdmittingDoctor NVARCHAR(200) = NULL,
    @AdmitSource NVARCHAR(64) = NULL,
    @VisitStatus NVARCHAR(32) = NULL,
    @Notes NVARCHAR(MAX) = NULL,
    @AdmitMessageId NVARCHAR(64) = NULL,
    @DischargeMessageId NVARCHAR(64) = NULL,
    @Status INT = 1
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @AdmitDateTime DATETIME2(3) = NULL;
    DECLARE @DischargeDateTime DATETIME2(3) = NULL;
    DECLARE @HospitalKey INT = NULL;

    -- Parse HL7 datetime format (YYYYMMDDHHmmss or YYYYMMDD)
    IF @Admit_TS IS NOT NULL AND LEN(@Admit_TS) >= 8
    BEGIN
        BEGIN TRY
            SET @AdmitDateTime = CAST(
                SUBSTRING(@Admit_TS, 1, 4) + '-' +
                SUBSTRING(@Admit_TS, 5, 2) + '-' +
                SUBSTRING(@Admit_TS, 7, 2) +
                CASE WHEN LEN(@Admit_TS) >= 14 THEN
                    ' ' + SUBSTRING(@Admit_TS, 9, 2) + ':' +
                    SUBSTRING(@Admit_TS, 11, 2) + ':' +
                    SUBSTRING(@Admit_TS, 13, 2)
                ELSE
                    ''
                END AS DATETIME2(3));
        END TRY
        BEGIN CATCH
            SET @AdmitDateTime = NULL;
        END CATCH
    END

    IF @Discharge_TS IS NOT NULL AND LEN(@Discharge_TS) >= 8
    BEGIN
        BEGIN TRY
            SET @DischargeDateTime = CAST(
                SUBSTRING(@Discharge_TS, 1, 4) + '-' +
                SUBSTRING(@Discharge_TS, 5, 2) + '-' +
                SUBSTRING(@Discharge_TS, 7, 2) +
                CASE WHEN LEN(@Discharge_TS) >= 14 THEN
                    ' ' + SUBSTRING(@Discharge_TS, 9, 2) + ':' +
                    SUBSTRING(@Discharge_TS, 11, 2) + ':' +
                    SUBSTRING(@Discharge_TS, 13, 2)
                ELSE
                    ''
                END AS DATETIME2(3));
        END TRY
        BEGIN CATCH
            SET @DischargeDateTime = NULL;
        END CATCH
    END

    -- Lookup hospital
    SELECT @HospitalKey = HospitalKey
    FROM he.Hospital
    WHERE TenantKey = @TenantKey AND HospitalCode = @HospitalCode;

    IF @HospitalKey IS NULL
        THROW 50001, 'Hospital not found for the given TenantKey and HospitalCode', 1;

    -- Upsert logic
    MERGE he.Encounter AS target
    USING (SELECT @TenantKey AS TenantKey,
                  @HospitalKey AS HospitalKey,
                  @VisitNumber AS VisitNumber) AS source
    ON target.TenantKey = source.TenantKey
       AND target.HospitalKey = source.HospitalKey
       AND target.VisitNumber = source.VisitNumber
    WHEN MATCHED THEN
        UPDATE SET
            PatientKey = @PatientKey,
            AdmitDateTime = COALESCE(@AdmitDateTime, target.AdmitDateTime),
            DischargeDateTime = COALESCE(@DischargeDateTime, target.DischargeDateTime),
            PatientClass = COALESCE(@PatientClass, target.PatientClass),
            Location = COALESCE(@Location, target.Location),
            AttendingDoctor = COALESCE(@AttendingDoctor, target.AttendingDoctor),
            PrimaryDoctor = COALESCE(@PrimaryDoctor, target.PrimaryDoctor),
            AdmittingDoctor = COALESCE(@AdmittingDoctor, target.AdmittingDoctor),
            AdmitSource = COALESCE(@AdmitSource, target.AdmitSource),
            VisitStatus = COALESCE(@VisitStatus, target.VisitStatus),
            Notes = COALESCE(@Notes, target.Notes),
            AdmitMessageId = COALESCE(@AdmitMessageId, target.AdmitMessageId),
            DischargeMessageId = COALESCE(@DischargeMessageId, target.DischargeMessageId),
            [Status] = COALESCE(@Status, target.[Status]),
            LastUpdatedUtc = GETUTCDATE()
    WHEN NOT MATCHED THEN
        INSERT (TenantKey, HospitalKey, PatientKey, VisitNumber, AdmitDateTime, DischargeDateTime,
                PatientClass, Location, AttendingDoctor, PrimaryDoctor, AdmittingDoctor, AdmitSource,
                VisitStatus, Notes, AdmitMessageId, DischargeMessageId, [Status], LastUpdatedUtc)
        VALUES (@TenantKey, @HospitalKey, @PatientKey, @VisitNumber, @AdmitDateTime, @DischargeDateTime,
                @PatientClass, @Location, @AttendingDoctor, @PrimaryDoctor, @AdmittingDoctor, @AdmitSource,
                @VisitStatus, @Notes, @AdmitMessageId, @DischargeMessageId, @Status, GETUTCDATE());
END
GO

-- ============================================================================
-- WriteAudit_Tenant: Write HL7 message audit record
-- ============================================================================
CREATE PROCEDURE he.WriteAudit_Tenant
    @TenantKey NVARCHAR(64),
    @MessageControlId NVARCHAR(64),
    @MessageType NVARCHAR(16),
    @EventTimestamp_TS NVARCHAR(14) = NULL,
    @SourceCode NVARCHAR(64) = NULL,
    @HospitalCode NVARCHAR(64) = NULL,
    @RawMessage NVARCHAR(MAX) = NULL,
    @Status NVARCHAR(16),
    @ErrorText NVARCHAR(4000) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @EventTimestamp DATETIME2(3) = NULL;
    DECLARE @SourceKey INT = NULL;
    DECLARE @HospitalKey INT = NULL;

    -- Parse HL7 datetime format (YYYYMMDDHHmmss or YYYYMMDD)
    IF @EventTimestamp_TS IS NOT NULL AND LEN(@EventTimestamp_TS) >= 8
    BEGIN
        BEGIN TRY
            SET @EventTimestamp = CAST(
                SUBSTRING(@EventTimestamp_TS, 1, 4) + '-' +
                SUBSTRING(@EventTimestamp_TS, 5, 2) + '-' +
                SUBSTRING(@EventTimestamp_TS, 7, 2) +
                CASE WHEN LEN(@EventTimestamp_TS) >= 14 THEN
                    ' ' + SUBSTRING(@EventTimestamp_TS, 9, 2) + ':' +
                    SUBSTRING(@EventTimestamp_TS, 11, 2) + ':' +
                    SUBSTRING(@EventTimestamp_TS, 13, 2)
                ELSE
                    ''
                END AS DATETIME2(3));
        END TRY
        BEGIN CATCH
            SET @EventTimestamp = NULL;
        END CATCH
    END

    -- Lookup source
    IF @SourceCode IS NOT NULL
    BEGIN
        SELECT @SourceKey = SourceKey
        FROM he.Hl7Source
        WHERE TenantKey = @TenantKey AND SourceCode = @SourceCode;
    END

    -- Lookup hospital
    IF @HospitalCode IS NOT NULL
    BEGIN
        SELECT @HospitalKey = HospitalKey
        FROM he.Hospital
        WHERE TenantKey = @TenantKey AND HospitalCode = @HospitalCode;
    END

    -- Insert or update audit record
    MERGE he.Hl7MessageAudit AS target
    USING (SELECT @TenantKey AS TenantKey,
                  @MessageControlId AS MessageControlId) AS source
    ON target.TenantKey = source.TenantKey
       AND target.MessageControlId = source.MessageControlId
    WHEN MATCHED THEN
        UPDATE SET
            MessageType = @MessageType,
            EventTimestamp = COALESCE(@EventTimestamp, target.EventTimestamp),
            SourceKey = COALESCE(@SourceKey, target.SourceKey),
            HospitalKey = COALESCE(@HospitalKey, target.HospitalKey),
            RawMessage = COALESCE(@RawMessage, target.RawMessage),
            [Status] = @Status,
            ErrorText = @ErrorText,
            ProcessedUtc = GETUTCDATE()
    WHEN NOT MATCHED THEN
        INSERT (TenantKey, MessageControlId, MessageType, EventTimestamp, SourceKey, HospitalKey,
                RawMessage, [Status], ErrorText, ProcessedUtc)
        VALUES (@TenantKey, @MessageControlId, @MessageType, @EventTimestamp, @SourceKey, @HospitalKey,
                @RawMessage, @Status, @ErrorText, GETUTCDATE());
END
GO

-- ============================================================================
-- Update UpsertPatient_Tenant to include new fields
-- ============================================================================
IF OBJECT_ID('he.UpsertPatient_Tenant', 'P') IS NOT NULL DROP PROCEDURE he.UpsertPatient_Tenant;
GO

CREATE PROCEDURE he.UpsertPatient_Tenant
    @TenantKey NVARCHAR(64),
    @PatientIdExternal NVARCHAR(64),
    @AssigningAuthority NVARCHAR(64) = NULL,
    @MRN NVARCHAR(64) = NULL,
    @SSN NVARCHAR(11) = NULL,
    @FamilyName NVARCHAR(100) = NULL,
    @GivenName NVARCHAR(100) = NULL,
    @DOB_TS NVARCHAR(8) = NULL,
    @Sex NVARCHAR(1) = NULL,
    @Phone NVARCHAR(50) = NULL,
    @CustodianName NVARCHAR(200) = NULL,
    @CustodianPhone NVARCHAR(50) = NULL,
    @AddressLine1 NVARCHAR(200) = NULL,
    @City NVARCHAR(100) = NULL,
    @State NVARCHAR(50) = NULL,
    @PostalCode NVARCHAR(20) = NULL,
    @Country NVARCHAR(50) = NULL,
    @FirstSeenHospitalCode NVARCHAR(64) = NULL,
    @OutPatientKey BIGINT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @DOB DATE = NULL;
    DECLARE @FirstSeenHospitalKey INT = NULL;

    -- Parse HL7 date format (YYYYMMDD)
    IF @DOB_TS IS NOT NULL AND LEN(@DOB_TS) = 8
    BEGIN
        BEGIN TRY
            SET @DOB = CAST(SUBSTRING(@DOB_TS, 1, 4) + '-' +
                           SUBSTRING(@DOB_TS, 5, 2) + '-' +
                           SUBSTRING(@DOB_TS, 7, 2) AS DATE);
        END TRY
        BEGIN CATCH
            SET @DOB = NULL;
        END CATCH
    END

    -- Lookup hospital
    IF @FirstSeenHospitalCode IS NOT NULL
    BEGIN
        SELECT @FirstSeenHospitalKey = HospitalKey
        FROM he.Hospital
        WHERE TenantKey = @TenantKey AND HospitalCode = @FirstSeenHospitalCode;
    END

    -- Upsert logic
    MERGE he.Patient AS target
    USING (SELECT @TenantKey AS TenantKey,
                  @PatientIdExternal AS PatientIdExternal,
                  ISNULL(@AssigningAuthority, '') AS AssigningAuthorityNorm) AS source
    ON target.TenantKey = source.TenantKey
       AND target.PatientIdExternal = source.PatientIdExternal
       AND target.AssigningAuthorityNorm = source.AssigningAuthorityNorm
    WHEN MATCHED THEN
        UPDATE SET
            MRN = COALESCE(@MRN, target.MRN),
            SSN = COALESCE(@SSN, target.SSN),
            FamilyName = COALESCE(@FamilyName, target.FamilyName),
            GivenName = COALESCE(@GivenName, target.GivenName),
            DOB = COALESCE(@DOB, target.DOB),
            Sex = COALESCE(@Sex, target.Sex),
            Phone = COALESCE(@Phone, target.Phone),
            CustodianName = COALESCE(@CustodianName, target.CustodianName),
            CustodianPhone = COALESCE(@CustodianPhone, target.CustodianPhone),
            AddressLine1 = COALESCE(@AddressLine1, target.AddressLine1),
            City = COALESCE(@City, target.City),
            [State] = COALESCE(@State, target.[State]),
            PostalCode = COALESCE(@PostalCode, target.PostalCode),
            Country = COALESCE(@Country, target.Country),
            FirstSeenHospitalKey = COALESCE(@FirstSeenHospitalKey, target.FirstSeenHospitalKey),
            LastUpdatedUtc = GETUTCDATE()
    WHEN NOT MATCHED THEN
        INSERT (TenantKey, PatientIdExternal, AssigningAuthority, MRN, SSN, FamilyName, GivenName,
                DOB, Sex, Phone, CustodianName, CustodianPhone, AddressLine1, City, [State], PostalCode, Country,
                FirstSeenHospitalKey, LastUpdatedUtc)
        VALUES (@TenantKey, @PatientIdExternal, @AssigningAuthority, @MRN, @SSN, @FamilyName, @GivenName,
                @DOB, @Sex, @Phone, @CustodianName, @CustodianPhone, @AddressLine1, @City, @State, @PostalCode, @Country,
                @FirstSeenHospitalKey, GETUTCDATE());

    SELECT @OutPatientKey = PatientKey
    FROM he.Patient
    WHERE TenantKey = @TenantKey
      AND PatientIdExternal = @PatientIdExternal
      AND ISNULL(AssigningAuthority, '') = ISNULL(@AssigningAuthority, '');
END
GO

-- ============================================================================
-- Update Row Level Security policies for NVARCHAR TenantKey
-- ============================================================================

-- Drop existing RLS policies and function if they exist
IF EXISTS (SELECT 1 FROM sys.security_policies WHERE name = 'RLS_TenantPolicy')
    DROP SECURITY POLICY he.RLS_TenantPolicy;
GO

IF OBJECT_ID('he.fn_TenantAccessPredicate', 'IF') IS NOT NULL
    DROP FUNCTION he.fn_TenantAccessPredicate;
GO

-- Create RLS predicate function for NVARCHAR TenantKey
CREATE FUNCTION he.fn_TenantAccessPredicate(@TenantKey NVARCHAR(64))
RETURNS TABLE
WITH SCHEMABINDING
AS
RETURN SELECT 1 AS result
WHERE @TenantKey = CAST(SESSION_CONTEXT(N'tenant_id') AS NVARCHAR(64))
   OR SESSION_CONTEXT(N'tenant_id') IS NULL;  -- Allow queries without context (e.g., system processes)
GO

-- Create security policy
CREATE SECURITY POLICY he.RLS_TenantPolicy
ADD FILTER PREDICATE he.fn_TenantAccessPredicate(TenantKey) ON he.Patient,
ADD FILTER PREDICATE he.fn_TenantAccessPredicate(TenantKey) ON he.Encounter,
ADD FILTER PREDICATE he.fn_TenantAccessPredicate(TenantKey) ON he.Hospital,
ADD FILTER PREDICATE he.fn_TenantAccessPredicate(TenantKey) ON he.Hl7Source,
ADD FILTER PREDICATE he.fn_TenantAccessPredicate(TenantKey) ON he.Hl7MessageAudit
WITH (STATE = ON, SCHEMABINDING = ON);
GO

-- ============================================================================
-- Verification queries
-- ============================================================================
PRINT 'Schema migration completed successfully!';
PRINT '';
PRINT 'Verification:';
SELECT 'Hospital' AS TableName, COUNT(*) AS RowCount FROM he.Hospital
UNION ALL
SELECT 'Patient', COUNT(*) FROM he.Patient
UNION ALL
SELECT 'Encounter', COUNT(*) FROM he.Encounter
UNION ALL
SELECT 'Hl7Source', COUNT(*) FROM he.Hl7Source
UNION ALL
SELECT 'Hl7MessageAudit', COUNT(*) FROM he.Hl7MessageAudit;

PRINT '';
PRINT 'Stored Procedures:';
SELECT name, create_date, modify_date
FROM sys.procedures
WHERE schema_id = SCHEMA_ID('he')
ORDER BY name;

PRINT '';
PRINT 'Migration complete. Please test the API with the new schema.';
GO
