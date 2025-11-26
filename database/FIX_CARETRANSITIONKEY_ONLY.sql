-- ============================================================================
-- Fix CareTransitionKey Column Only - Convert INT to NVARCHAR(64)
-- ============================================================================
USE [healthextent];
GO

SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
GO

PRINT '============================================================================';
PRINT 'Converting CareTransitionKey from INT to NVARCHAR(64)';
PRINT '============================================================================';
PRINT '';

BEGIN TRANSACTION;

BEGIN TRY
    -- Step 1: Drop primary key constraint
    PRINT 'Step 1: Dropping primary key constraint...';
    IF EXISTS (SELECT * FROM sys.key_constraints WHERE name = 'PK_CareTransition' AND parent_object_id = OBJECT_ID('he.CareTransition'))
    BEGIN
        ALTER TABLE [he].[CareTransition] DROP CONSTRAINT [PK_CareTransition];
        PRINT '  Dropped PK_CareTransition';
    END

    -- Step 2: Drop unique constraint (depends on CareTransitionKey indirectly)
    PRINT '';
    PRINT 'Step 2: Dropping unique constraint...';
    IF EXISTS (SELECT * FROM sys.indexes WHERE name = 'UQ_CareTransition_Encounter' AND object_id = OBJECT_ID('he.CareTransition'))
    BEGIN
        ALTER TABLE [he].[CareTransition] DROP CONSTRAINT [UQ_CareTransition_Encounter];
        PRINT '  Dropped UQ_CareTransition_Encounter';
    END

    -- Step 3: Add temporary column
    PRINT '';
    PRINT 'Step 3: Creating temporary column...';
    ALTER TABLE [he].[CareTransition]
    ADD [CareTransitionKey_Temp] NVARCHAR(64) NULL;
    PRINT '  Created CareTransitionKey_Temp';

    -- Step 4: Copy data from INT to NVARCHAR
    PRINT '';
    PRINT 'Step 4: Migrating data...';
    UPDATE [he].[CareTransition]
    SET [CareTransitionKey_Temp] = CAST([CareTransitionKey] AS NVARCHAR(64));

    DECLARE @rowCount INT = @@ROWCOUNT;
    PRINT '  Migrated ' + CAST(@rowCount AS NVARCHAR(10)) + ' rows';

    -- Step 5: Drop old INT column
    PRINT '';
    PRINT 'Step 5: Dropping old INT column...';
    ALTER TABLE [he].[CareTransition]
    DROP COLUMN [CareTransitionKey];
    PRINT '  Dropped old CareTransitionKey column';

    -- Step 6: Rename temp column
    PRINT '';
    PRINT 'Step 6: Renaming new column...';
    EXEC sp_rename 'he.CareTransition.CareTransitionKey_Temp', 'CareTransitionKey', 'COLUMN';
    PRINT '  Renamed CareTransitionKey_Temp to CareTransitionKey';

    -- Step 7: Make column NOT NULL
    PRINT '';
    PRINT 'Step 7: Setting NOT NULL constraint...';
    ALTER TABLE [he].[CareTransition]
    ALTER COLUMN [CareTransitionKey] NVARCHAR(64) NOT NULL;
    PRINT '  Set CareTransitionKey to NOT NULL';

    -- Step 8: Recreate primary key
    PRINT '';
    PRINT 'Step 8: Recreating primary key...';
    ALTER TABLE [he].[CareTransition]
    ADD CONSTRAINT [PK_CareTransition] PRIMARY KEY CLUSTERED ([CareTransitionKey]);
    PRINT '  Created PK_CareTransition';

    -- Step 9: Recreate unique constraint
    PRINT '';
    PRINT 'Step 9: Recreating unique constraint...';
    ALTER TABLE [he].[CareTransition]
    ADD CONSTRAINT [UQ_CareTransition_Encounter] UNIQUE ([TenantKey], [EncounterKey]);
    PRINT '  Created UQ_CareTransition_Encounter';

    COMMIT TRANSACTION;

    PRINT '';
    PRINT '============================================================================';
    PRINT 'Migration completed successfully!';
    PRINT '============================================================================';
    PRINT '';

    -- Verify final schema
    PRINT 'Final schema for key columns:';
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
    PRINT 'Sample data (first 3 rows):';
    SELECT TOP 3
        CareTransitionKey,
        TenantKey,
        CareManagerUserKey,
        AssignedToUserKey,
        ClosedByUserKey
    FROM [he].[CareTransition]
    ORDER BY CreatedUtc DESC;

END TRY
BEGIN CATCH
    ROLLBACK TRANSACTION;

    PRINT '';
    PRINT 'ERROR: Migration failed!';
    PRINT 'Error Message: ' + ERROR_MESSAGE();
    PRINT 'Error Line: ' + CAST(ERROR_LINE() AS NVARCHAR(10));
    PRINT '';

    -- Show current schema on error
    PRINT 'Current schema:';
    SELECT
        c.name AS ColumnName,
        t.name AS DataType,
        CASE WHEN t.name = 'nvarchar' THEN c.max_length / 2 ELSE c.max_length END AS MaxLength,
        c.is_nullable AS IsNullable
    FROM sys.columns c
    INNER JOIN sys.types t ON c.user_type_id = t.user_type_id
    WHERE c.object_id = OBJECT_ID('he.CareTransition')
        AND c.name LIKE '%CareTransitionKey%'
    ORDER BY c.name;

    THROW;
END CATCH

GO
