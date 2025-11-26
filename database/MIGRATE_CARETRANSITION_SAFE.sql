-- ============================================================================
-- Safe Migration Script: Convert CareTransition Key Fields to NVARCHAR
-- ============================================================================
-- This script safely converts key fields, checking if conversion is needed
-- ============================================================================

USE [healthextent];
GO

SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
GO

PRINT '============================================================================';
PRINT 'Safe CareTransition Key Migration to NVARCHAR(64)';
PRINT '============================================================================';
PRINT '';

-- Check if CareTransitionKey is already NVARCHAR
DECLARE @CareTransitionKeyType NVARCHAR(50);
SELECT @CareTransitionKeyType = t.name
FROM sys.columns c
INNER JOIN sys.types t ON c.user_type_id = t.user_type_id
WHERE c.object_id = OBJECT_ID('he.CareTransition')
    AND c.name = 'CareTransitionKey';

PRINT 'Current CareTransitionKey type: ' + ISNULL(@CareTransitionKeyType, 'NOT FOUND');

IF @CareTransitionKeyType = 'nvarchar'
BEGIN
    PRINT 'CareTransitionKey is already NVARCHAR. No migration needed.';
    PRINT '';
    PRINT 'Current schema:';

    SELECT
        c.name AS ColumnName,
        t.name AS DataType,
        CASE WHEN t.name = 'nvarchar' THEN c.max_length / 2 ELSE c.max_length END AS MaxLength,
        c.is_nullable AS IsNullable
    FROM sys.columns c
    INNER JOIN sys.types t ON c.user_type_id = t.user_type_id
    WHERE c.object_id = OBJECT_ID('he.CareTransition')
        AND c.name IN ('CareTransitionKey', 'CareManagerUserKey', 'AssignedToUserKey', 'ClosedByUserKey')
    ORDER BY c.name;

    PRINT '';
    PRINT 'Migration skipped - schema is already correct.';
END
ELSE
BEGIN
    PRINT 'CareTransitionKey is ' + @CareTransitionKeyType + '. Starting migration...';
    PRINT '';

    BEGIN TRANSACTION;

    BEGIN TRY
        -- Drop constraints first
        PRINT 'Step 1: Dropping constraints...';

        IF EXISTS (SELECT * FROM sys.indexes WHERE name = 'UQ_CareTransition_Encounter' AND object_id = OBJECT_ID('he.CareTransition'))
        BEGIN
            ALTER TABLE [he].[CareTransition] DROP CONSTRAINT [UQ_CareTransition_Encounter];
            PRINT '  Dropped UQ_CareTransition_Encounter';
        END

        IF EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_CareTransition_Patient' AND object_id = OBJECT_ID('he.CareTransition'))
        BEGIN
            DROP INDEX [IX_CareTransition_Patient] ON [he].[CareTransition];
            PRINT '  Dropped IX_CareTransition_Patient';
        END

        IF EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_CareTransition_Status' AND object_id = OBJECT_ID('he.CareTransition'))
        BEGIN
            DROP INDEX [IX_CareTransition_Status] ON [he].[CareTransition];
            PRINT '  Dropped IX_CareTransition_Status';
        END

        IF EXISTS (SELECT * FROM sys.key_constraints WHERE name = 'PK_CareTransition' AND parent_object_id = OBJECT_ID('he.CareTransition'))
        BEGIN
            ALTER TABLE [he].[CareTransition] DROP CONSTRAINT [PK_CareTransition];
            PRINT '  Dropped PK_CareTransition';
        END

        -- Convert columns
        PRINT '';
        PRINT 'Step 2: Converting columns...';

        -- Convert CareTransitionKey
        ALTER TABLE [he].[CareTransition]
        ALTER COLUMN [CareTransitionKey] NVARCHAR(64) NOT NULL;
        PRINT '  Converted CareTransitionKey to NVARCHAR(64)';

        -- Convert CareManagerUserKey
        ALTER TABLE [he].[CareTransition]
        ALTER COLUMN [CareManagerUserKey] NVARCHAR(64) NULL;
        PRINT '  Converted CareManagerUserKey to NVARCHAR(64)';

        -- Convert AssignedToUserKey
        ALTER TABLE [he].[CareTransition]
        ALTER COLUMN [AssignedToUserKey] NVARCHAR(64) NULL;
        PRINT '  Converted AssignedToUserKey to NVARCHAR(64)';

        -- Convert ClosedByUserKey
        ALTER TABLE [he].[CareTransition]
        ALTER COLUMN [ClosedByUserKey] NVARCHAR(64) NULL;
        PRINT '  Converted ClosedByUserKey to NVARCHAR(64)';

        -- Recreate constraints
        PRINT '';
        PRINT 'Step 3: Recreating constraints...';

        ALTER TABLE [he].[CareTransition]
        ADD CONSTRAINT [PK_CareTransition] PRIMARY KEY CLUSTERED ([CareTransitionKey]);
        PRINT '  Created PK_CareTransition';

        ALTER TABLE [he].[CareTransition]
        ADD CONSTRAINT [UQ_CareTransition_Encounter] UNIQUE ([TenantKey], [EncounterKey]);
        PRINT '  Created UQ_CareTransition_Encounter';

        CREATE NONCLUSTERED INDEX [IX_CareTransition_Patient]
        ON [he].[CareTransition] ([TenantKey], [PatientKey]);
        PRINT '  Created IX_CareTransition_Patient';

        CREATE NONCLUSTERED INDEX [IX_CareTransition_Status]
        ON [he].[CareTransition] ([TenantKey], [Status]);
        PRINT '  Created IX_CareTransition_Status';

        COMMIT TRANSACTION;

        PRINT '';
        PRINT '============================================================================';
        PRINT 'Migration completed successfully!';
        PRINT '============================================================================';

        -- Show final schema
        PRINT '';
        PRINT 'Final schema:';
        SELECT
            c.name AS ColumnName,
            t.name AS DataType,
            CASE WHEN t.name = 'nvarchar' THEN c.max_length / 2 ELSE c.max_length END AS MaxLength,
            c.is_nullable AS IsNullable
        FROM sys.columns c
        INNER JOIN sys.types t ON c.user_type_id = t.user_type_id
        WHERE c.object_id = OBJECT_ID('he.CareTransition')
            AND c.name IN ('CareTransitionKey', 'CareManagerUserKey', 'AssignedToUserKey', 'ClosedByUserKey')
        ORDER BY c.name;

    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;

        PRINT '';
        PRINT 'ERROR: Migration failed!';
        PRINT 'Error Message: ' + ERROR_MESSAGE();
        PRINT 'Error Line: ' + CAST(ERROR_LINE() AS NVARCHAR(10));

        THROW;
    END CATCH
END

GO
