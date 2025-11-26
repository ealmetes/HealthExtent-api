-- ============================================================================
-- Migration Script: Convert CareTransition Key Fields to NVARCHAR
-- ============================================================================
-- This script converts CareTransitionKey, CareManagerUserKey, AssignedToUserKey,
-- and ClosedByUserKey from INT to NVARCHAR(64) to support string identifiers
-- ============================================================================

USE [healthextent];
GO

SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
GO

PRINT 'Starting CareTransition key migration to string types...';
GO

BEGIN TRANSACTION;
GO

-- ============================================================================
-- STEP 1: Drop existing constraints and indexes
-- ============================================================================

PRINT 'Step 1: Dropping constraints and indexes...';
GO

-- Drop foreign key constraints if any exist
-- (Add here if there are FK constraints referencing CareTransitionKey)

-- Drop existing unique constraint on EncounterKey
IF EXISTS (SELECT * FROM sys.indexes WHERE name = 'UQ_CareTransition_Encounter' AND object_id = OBJECT_ID('he.CareTransition'))
BEGIN
    ALTER TABLE [he].[CareTransition] DROP CONSTRAINT [UQ_CareTransition_Encounter];
    PRINT '  - Dropped UQ_CareTransition_Encounter constraint';
END
GO

-- Drop existing indexes
IF EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_CareTransition_Patient' AND object_id = OBJECT_ID('he.CareTransition'))
BEGIN
    DROP INDEX [IX_CareTransition_Patient] ON [he].[CareTransition];
    PRINT '  - Dropped IX_CareTransition_Patient index';
END
GO

IF EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_CareTransition_Status' AND object_id = OBJECT_ID('he.CareTransition'))
BEGIN
    DROP INDEX [IX_CareTransition_Status] ON [he].[CareTransition];
    PRINT '  - Dropped IX_CareTransition_Status index';
END
GO

-- Drop primary key constraint
IF EXISTS (SELECT * FROM sys.key_constraints WHERE name = 'PK_CareTransition' AND parent_object_id = OBJECT_ID('he.CareTransition'))
BEGIN
    ALTER TABLE [he].[CareTransition] DROP CONSTRAINT [PK_CareTransition];
    PRINT '  - Dropped PK_CareTransition constraint';
END
GO

-- ============================================================================
-- STEP 2: Add new NVARCHAR columns
-- ============================================================================

PRINT 'Step 2: Adding new NVARCHAR columns...';
GO

-- Add new CareTransitionKey column
ALTER TABLE [he].[CareTransition]
ADD [CareTransitionKey_New] NVARCHAR(64) NULL;
PRINT '  - Added CareTransitionKey_New column';
GO

-- Add new user key columns
ALTER TABLE [he].[CareTransition]
ADD [CareManagerUserKey_New] NVARCHAR(64) NULL,
    [AssignedToUserKey_New] NVARCHAR(64) NULL,
    [ClosedByUserKey_New] NVARCHAR(64) NULL;
PRINT '  - Added new user key columns';
GO

-- ============================================================================
-- STEP 3: Migrate data from INT to NVARCHAR
-- ============================================================================

PRINT 'Step 3: Migrating data to new columns...';
GO

UPDATE [he].[CareTransition]
SET
    [CareTransitionKey_New] = CAST([CareTransitionKey] AS NVARCHAR(64)),
    [CareManagerUserKey_New] = CAST([CareManagerUserKey] AS NVARCHAR(64)),
    [AssignedToUserKey_New] = CAST([AssignedToUserKey] AS NVARCHAR(64)),
    [ClosedByUserKey_New] = CAST([ClosedByUserKey] AS NVARCHAR(64));

DECLARE @rowCount INT = @@ROWCOUNT;
PRINT '  - Migrated ' + CAST(@rowCount AS NVARCHAR(10)) + ' rows';
GO

-- ============================================================================
-- STEP 4: Drop old columns
-- ============================================================================

PRINT 'Step 4: Dropping old INT columns...';
GO

ALTER TABLE [he].[CareTransition]
DROP COLUMN 
            [CareManagerUserKey],
            [AssignedToUserKey],
            [ClosedByUserKey];
PRINT '  - Dropped old INT columns';
GO

-- ============================================================================
-- STEP 5: Rename new columns to original names
-- ============================================================================

PRINT 'Step 5: Renaming new columns...';
GO

EXEC sp_rename 'he.CareTransition.CareTransitionKey_New', 'CareTransitionKey', 'COLUMN';
PRINT '  - Renamed CareTransitionKey_New to CareTransitionKey';
GO

EXEC sp_rename 'he.CareTransition.CareManagerUserKey_New', 'CareManagerUserKey', 'COLUMN';
EXEC sp_rename 'he.CareTransition.AssignedToUserKey_New', 'AssignedToUserKey', 'COLUMN';
EXEC sp_rename 'he.CareTransition.ClosedByUserKey_New', 'ClosedByUserKey', 'COLUMN';
PRINT '  - Renamed user key columns';
GO

-- ============================================================================
-- STEP 6: Make CareTransitionKey NOT NULL and add constraints
-- ============================================================================

PRINT 'Step 6: Adding constraints and indexes...';
GO

-- Make CareTransitionKey NOT NULL
ALTER TABLE [he].[CareTransition]
ALTER COLUMN [CareTransitionKey] NVARCHAR(64) NOT NULL;
PRINT '  - Made CareTransitionKey NOT NULL';
GO

-- Add primary key constraint
ALTER TABLE [he].[CareTransition]
ADD CONSTRAINT [PK_CareTransition] PRIMARY KEY CLUSTERED ([CareTransitionKey]);
PRINT '  - Added PK_CareTransition constraint';
GO

-- Recreate unique constraint on TenantKey + EncounterKey
ALTER TABLE [he].[CareTransition]
ADD CONSTRAINT [UQ_CareTransition_Encounter] UNIQUE ([TenantKey], [EncounterKey]);
PRINT '  - Added UQ_CareTransition_Encounter constraint';
GO

-- Recreate indexes
CREATE NONCLUSTERED INDEX [IX_CareTransition_Patient]
ON [he].[CareTransition] ([TenantKey], [PatientKey]);
PRINT '  - Created IX_CareTransition_Patient index';
GO

CREATE NONCLUSTERED INDEX [IX_CareTransition_Status]
ON [he].[CareTransition] ([TenantKey], [Status]);
PRINT '  - Created IX_CareTransition_Status index';
GO

-- ============================================================================
-- STEP 7: Verify migration
-- ============================================================================

PRINT 'Step 7: Verifying migration...';
GO

-- Check column types
SELECT
    c.name AS ColumnName,
    t.name AS DataType,
    c.max_length AS MaxLength,
    c.is_nullable AS IsNullable
FROM sys.columns c
INNER JOIN sys.types t ON c.user_type_id = t.user_type_id
WHERE c.object_id = OBJECT_ID('he.CareTransition')
    AND c.name IN ('CareTransitionKey', 'CareManagerUserKey', 'AssignedToUserKey', 'ClosedByUserKey')
ORDER BY c.name;
GO

-- Check row count
SELECT COUNT(*) AS TotalRows FROM [he].[CareTransition];
GO

PRINT 'Migration completed successfully!';
GO

COMMIT TRANSACTION;
GO

PRINT '============================================================================';
PRINT 'CareTransition key fields successfully migrated to NVARCHAR(64)';
PRINT '============================================================================';
GO
