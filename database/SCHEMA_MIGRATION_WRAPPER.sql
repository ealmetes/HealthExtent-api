SET QUOTED_IDENTIFIER ON;
SET ANSI_NULLS ON;
GO

USE [he-healthcare-db];
GO

-- Step 1: Backup existing data (if any)
IF OBJECT_ID('he.Patient_Backup', 'U') IS NOT NULL DROP TABLE he.Patient_Backup;
IF OBJECT_ID('he.Hospital_Backup', 'U') IS NOT NULL DROP TABLE he.Hospital_Backup;
IF OBJECT_ID('he.Encounter_Backup', 'U') IS NOT NULL DROP TABLE he.Encounter_Backup;
IF OBJECT_ID('he.Hl7MessageAudit_Backup', 'U') IS NOT NULL DROP TABLE he.Hl7MessageAudit_Backup;
IF OBJECT_ID('he.Hl7Source_Backup', 'U') IS NOT NULL DROP TABLE he.Hl7Source_Backup;
GO

SELECT * INTO he.Patient_Backup FROM he.Patient;
SELECT * INTO he.Hospital_Backup FROM he.Hospital;
SELECT * INTO he.Encounter_Backup FROM he.Encounter;
SELECT * INTO he.Hl7MessageAudit_Backup FROM he.Hl7MessageAudit;
SELECT * INTO he.Hl7Source_Backup FROM he.Hl7Source;
GO

-- Step 2: Drop all foreign key constraints
DECLARE @sql NVARCHAR(MAX) = '';
SELECT @sql += 'ALTER TABLE ' + QUOTENAME(OBJECT_SCHEMA_NAME(parent_object_id)) + '.' + QUOTENAME(OBJECT_NAME(parent_object_id)) +
               ' DROP CONSTRAINT ' + QUOTENAME(name) + ';' + CHAR(13)
FROM sys.foreign_keys
WHERE OBJECT_SCHEMA_NAME(parent_object_id) = 'he';

EXEC sp_executesql @sql;
GO

-- Step 3: Drop old tables
DROP TABLE IF EXISTS he.Hl7MessageAudit;
DROP TABLE IF EXISTS he.Encounter;
DROP TABLE IF EXISTS he.Patient;
DROP TABLE IF EXISTS he.Hl7Source;
DROP TABLE IF EXISTS he.Hospital;
DROP TABLE IF EXISTS he.Tenant;
GO

-- Step 4: Recreate Hospital table with new schema
CREATE TABLE he.Hospital (
    HospitalKey INT IDENTITY(1,1) NOT NULL,
    TenantKey NVARCHAR(64) NOT NULL,
    HospitalCode NVARCHAR(64) NOT NULL,
    HospitalName NVARCHAR(200) NOT NULL,
    AssigningAuthority NVARCHAR(64) NULL,
    City NVARCHAR(100) NULL,
    [State] NVARCHAR(50) NULL,
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedUtc DATETIME2(7) NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT PK_Hospital PRIMARY KEY (HospitalKey),
    CONSTRAINT UQ_Hospital UNIQUE (TenantKey, HospitalCode)
);
GO

CREATE NONCLUSTERED INDEX IX_Hospital_TenantKey ON he.Hospital(TenantKey);
GO

-- Step 5: Recreate Patient table with new schema
CREATE TABLE he.Patient (
    PatientKey BIGINT IDENTITY(1,1) NOT NULL,
    TenantKey NVARCHAR(64) NOT NULL,
    PatientIdExternal NVARCHAR(64) NOT NULL,
    AssigningAuthority NVARCHAR(64) NULL,
    MRN NVARCHAR(64) NULL,
    SSN NVARCHAR(11) NULL,
    FamilyName NVARCHAR(100) NULL,
    GivenName NVARCHAR(100) NULL,
    DOB DATE NULL,
    Sex NVARCHAR(1) NULL,
    Phone NVARCHAR(50) NULL,
    CustodianName NVARCHAR(200) NULL,
    CustodianPhone NVARCHAR(50) NULL,
    AddressLine1 NVARCHAR(200) NULL,
    City NVARCHAR(100) NULL,
    [State] NVARCHAR(50) NULL,
    PostalCode NVARCHAR(20) NULL,
    Country NVARCHAR(50) NULL,
    FirstSeenHospitalKey INT NULL,
    LastUpdatedUtc DATETIME2(7) NOT NULL DEFAULT GETUTCDATE(),
    AssigningAuthorityNorm AS ISNULL(AssigningAuthority, '') PERSISTED,
    CONSTRAINT PK_Patient PRIMARY KEY (PatientKey),
    CONSTRAINT FK_Patient_Hospital FOREIGN KEY (FirstSeenHospitalKey) REFERENCES he.Hospital(HospitalKey),
    CONSTRAINT UQ_Patient_Natural UNIQUE (TenantKey, PatientIdExternal, AssigningAuthorityNorm)
);
GO

CREATE NONCLUSTERED INDEX IX_Patient_MRN ON he.Patient(TenantKey, MRN, AssigningAuthorityNorm);
CREATE NONCLUSTERED INDEX IX_Patient_TenantKey ON he.Patient(TenantKey);
GO

-- Step 6: Recreate Encounter table with new schema
CREATE TABLE he.Encounter (
    EncounterKey BIGINT IDENTITY(1,1) NOT NULL,
    TenantKey NVARCHAR(64) NOT NULL,
    HospitalKey INT NOT NULL,
    PatientKey BIGINT NOT NULL,
    VisitNumber NVARCHAR(64) NOT NULL,
    AdmitDateTime DATETIME2(3) NULL,
    DischargeDateTime DATETIME2(3) NULL,
    PatientClass NVARCHAR(10) NULL,
    Location NVARCHAR(100) NULL,
    AttendingDoctor NVARCHAR(200) NULL,
    PrimaryDoctor NVARCHAR(200) NULL,
    AdmittingDoctor NVARCHAR(200) NULL,
    AdmitSource NVARCHAR(64) NULL,
    VisitStatus NVARCHAR(32) NULL,
    Notes NVARCHAR(MAX) NULL,
    AdmitMessageId NVARCHAR(64) NULL,
    DischargeMessageId NVARCHAR(64) NULL,
    [Status] INT NOT NULL DEFAULT 1,
    LastUpdatedUtc DATETIME2(7) NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT PK_Encounter PRIMARY KEY (EncounterKey),
    CONSTRAINT FK_Encounter_Hospital FOREIGN KEY (HospitalKey) REFERENCES he.Hospital(HospitalKey),
    CONSTRAINT FK_Encounter_Patient FOREIGN KEY (PatientKey) REFERENCES he.Patient(PatientKey),
    CONSTRAINT UQ_Encounter_Natural UNIQUE (TenantKey, HospitalKey, VisitNumber)
);
GO

CREATE NONCLUSTERED INDEX IX_Encounter_TenantKey ON he.Encounter(TenantKey);
CREATE NONCLUSTERED INDEX IX_Encounter_Patient ON he.Encounter(PatientKey);
GO

-- Step 7: Recreate Hl7Source table
CREATE TABLE he.Hl7Source (
    SourceKey INT IDENTITY(1,1) NOT NULL,
    TenantKey NVARCHAR(64) NOT NULL,
    SourceCode NVARCHAR(64) NOT NULL,
    Description NVARCHAR(200) NULL,
    HospitalKey INT NULL,
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedUtc DATETIME2(7) NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT PK_Hl7Source PRIMARY KEY (SourceKey),
    CONSTRAINT FK_Hl7Source_Hospital FOREIGN KEY (HospitalKey) REFERENCES he.Hospital(HospitalKey),
    CONSTRAINT UQ_Hl7Source UNIQUE (TenantKey, SourceCode)
);
GO

CREATE NONCLUSTERED INDEX IX_Hl7Source_TenantKey ON he.Hl7Source(TenantKey);
GO

-- Step 8: Recreate Hl7MessageAudit table
CREATE TABLE he.Hl7MessageAudit (
    TenantKey NVARCHAR(64) NOT NULL,
    MessageControlId NVARCHAR(64) NOT NULL,
    MessageType NVARCHAR(16) NOT NULL,
    EventTimestamp DATETIME2(3) NULL,
    SourceKey INT NULL,
    HospitalKey INT NULL,
    RawMessage NVARCHAR(MAX) NULL,
    ProcessedUtc DATETIME2(7) NOT NULL DEFAULT GETUTCDATE(),
    [Status] NVARCHAR(16) NOT NULL,
    ErrorText NVARCHAR(4000) NULL,
    CONSTRAINT PK_Hl7MessageAudit PRIMARY KEY (TenantKey, MessageControlId),
    CONSTRAINT FK_Hl7MessageAudit_Source FOREIGN KEY (SourceKey) REFERENCES he.Hl7Source(SourceKey),
    CONSTRAINT FK_Hl7MessageAudit_Hospital FOREIGN KEY (HospitalKey) REFERENCES he.Hospital(HospitalKey)
);
GO

CREATE NONCLUSTERED INDEX IX_Audit_Type_Time ON he.Hl7MessageAudit(TenantKey, MessageType, ProcessedUtc);
GO

PRINT 'Schema migration completed - Part 1';
PRINT 'Run stored procedure updates next';
GO
