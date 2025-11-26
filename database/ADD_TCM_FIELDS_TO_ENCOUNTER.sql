-- Add TCM (Transitional Care Management) schedule fields to Encounter table
-- TcmSchedule1 and TcmSchedule2 are for tracking follow-up appointments

USE [he-healthcare-db];
GO

-- Add TcmSchedule1 and TcmSchedule2 fields to Encounter table
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('he.Encounter') AND name = 'TcmSchedule1')
BEGIN
    ALTER TABLE he.Encounter
    ADD TcmSchedule1 DATETIME2(3) NULL;

    PRINT 'Added TcmSchedule1 field to Encounter table';
END
ELSE
BEGIN
    PRINT 'TcmSchedule1 field already exists in Encounter table';
END
GO

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('he.Encounter') AND name = 'TcmSchedule2')
BEGIN
    ALTER TABLE he.Encounter
    ADD TcmSchedule2 DATETIME2(3) NULL;

    PRINT 'Added TcmSchedule2 field to Encounter table';
END
ELSE
BEGIN
    PRINT 'TcmSchedule2 field already exists in Encounter table';
END
GO

-- Update the UpsertEncounter_Tenant stored procedure to include TCM fields
IF OBJECT_ID('he.UpsertEncounter_Tenant', 'P') IS NOT NULL
    DROP PROCEDURE he.UpsertEncounter_Tenant;
GO

CREATE PROCEDURE he.UpsertEncounter_Tenant
    @TenantKey NVARCHAR(64),
    @HospitalCode NVARCHAR(50),
    @VisitNumber NVARCHAR(64),
    @PatientKey BIGINT,
    @Admit_TS NVARCHAR(50) = NULL,
    @Discharge_TS NVARCHAR(50) = NULL,
    @PatientClass NVARCHAR(10) = NULL,
    @Location NVARCHAR(100) = NULL,
    @AttendingDoctor NVARCHAR(200) = NULL,
    @PrimaryDoctor NVARCHAR(200) = NULL,
    @AdmittingDoctor NVARCHAR(200) = NULL,
    @AdmitSource NVARCHAR(100) = NULL,
    @VisitStatus NVARCHAR(10) = NULL,
    @Notes NVARCHAR(MAX) = NULL,
    @AdmitMessageId NVARCHAR(100) = NULL,
    @DischargeMessageId NVARCHAR(100) = NULL,
    @Status INT = 1,
    @TcmSchedule1_TS NVARCHAR(50) = NULL,
    @TcmSchedule2_TS NVARCHAR(50) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    -- Set session context for RLS
    EXEC sys.sp_set_session_context @key=N'tenant_id', @value=@TenantKey, @read_only=0;

    DECLARE @EncounterKey BIGINT;
    DECLARE @HospitalKey INT;
    DECLARE @Message NVARCHAR(500);
    DECLARE @AdmitDateTime DATETIME2(3);
    DECLARE @DischargeDateTime DATETIME2(3);
    DECLARE @TcmSchedule1 DATETIME2(3);
    DECLARE @TcmSchedule2 DATETIME2(3);

    BEGIN TRY
        BEGIN TRANSACTION;

        -- Get HospitalKey from HospitalCode
        SELECT @HospitalKey = HospitalKey
        FROM he.Hospital
        WHERE TenantKey = @TenantKey AND HospitalCode = @HospitalCode;

        IF @HospitalKey IS NULL
        BEGIN
            SET @Message = 'Hospital not found for code: ' + @HospitalCode;
            ROLLBACK TRANSACTION;
            SELECT NULL AS EncounterKey, 0 AS Success, @Message AS Message;
            RETURN;
        END

        -- Parse HL7 timestamps
        SET @AdmitDateTime = TRY_CAST(
            STUFF(STUFF(STUFF(@Admit_TS, 13, 0, ':'), 11, 0, ':'), 9, 0, ' ')
            AS DATETIME2(3));

        SET @DischargeDateTime = TRY_CAST(
            STUFF(STUFF(STUFF(@Discharge_TS, 13, 0, ':'), 11, 0, ':'), 9, 0, ' ')
            AS DATETIME2(3));

        SET @TcmSchedule1 = TRY_CAST(
            STUFF(STUFF(STUFF(@TcmSchedule1_TS, 13, 0, ':'), 11, 0, ':'), 9, 0, ' ')
            AS DATETIME2(3));

        SET @TcmSchedule2 = TRY_CAST(
            STUFF(STUFF(STUFF(@TcmSchedule2_TS, 13, 0, ':'), 11, 0, ':'), 9, 0, ' ')
            AS DATETIME2(3));

        -- Check if encounter exists
        SELECT @EncounterKey = EncounterKey
        FROM he.Encounter WITH (UPDLOCK, SERIALIZABLE)
        WHERE TenantKey = @TenantKey
          AND HospitalKey = @HospitalKey
          AND VisitNumber = @VisitNumber;

        IF @EncounterKey IS NOT NULL
        BEGIN
            -- Update existing encounter
            UPDATE he.Encounter
            SET
                PatientKey = COALESCE(@PatientKey, PatientKey),
                AdmitDateTime = COALESCE(@AdmitDateTime, AdmitDateTime),
                DischargeDateTime = COALESCE(@DischargeDateTime, DischargeDateTime),
                PatientClass = COALESCE(@PatientClass, PatientClass),
                Location = COALESCE(@Location, Location),
                AttendingDoctor = COALESCE(@AttendingDoctor, AttendingDoctor),
                PrimaryDoctor = COALESCE(@PrimaryDoctor, PrimaryDoctor),
                AdmittingDoctor = COALESCE(@AdmittingDoctor, AdmittingDoctor),
                AdmitSource = COALESCE(@AdmitSource, AdmitSource),
                VisitStatus = COALESCE(@VisitStatus, VisitStatus),
                Notes = COALESCE(@Notes, Notes),
                AdmitMessageId = COALESCE(@AdmitMessageId, AdmitMessageId),
                DischargeMessageId = COALESCE(@DischargeMessageId, DischargeMessageId),
                Status = COALESCE(@Status, Status),
                TcmSchedule1 = COALESCE(@TcmSchedule1, TcmSchedule1),
                TcmSchedule2 = COALESCE(@TcmSchedule2, TcmSchedule2),
                LastUpdatedUtc = GETUTCDATE()
            WHERE EncounterKey = @EncounterKey;

            SET @Message = 'Encounter updated successfully';
        END
        ELSE
        BEGIN
            -- Insert new encounter
            INSERT INTO he.Encounter (
                TenantKey, HospitalKey, PatientKey, VisitNumber,
                AdmitDateTime, DischargeDateTime, PatientClass, Location,
                AttendingDoctor, PrimaryDoctor, AdmittingDoctor, AdmitSource,
                VisitStatus, Notes, AdmitMessageId, DischargeMessageId, Status,
                TcmSchedule1, TcmSchedule2, LastUpdatedUtc
            )
            VALUES (
                @TenantKey, @HospitalKey, @PatientKey, @VisitNumber,
                @AdmitDateTime, @DischargeDateTime, @PatientClass, @Location,
                @AttendingDoctor, @PrimaryDoctor, @AdmittingDoctor, @AdmitSource,
                @VisitStatus, @Notes, @AdmitMessageId, @DischargeMessageId, @Status,
                @TcmSchedule1, @TcmSchedule2, GETUTCDATE()
            );

            SET @EncounterKey = SCOPE_IDENTITY();
            SET @Message = 'Encounter created successfully';
        END

        COMMIT TRANSACTION;

        SELECT
            @EncounterKey AS EncounterKey,
            1 AS Success,
            @Message AS Message;

    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        SELECT
            NULL AS EncounterKey,
            0 AS Success,
            ERROR_MESSAGE() AS Message;
    END CATCH
END;
GO

PRINT 'TCM fields added to Encounter table successfully!';
PRINT 'UpsertEncounter_Tenant stored procedure updated with TCM fields.';
GO
