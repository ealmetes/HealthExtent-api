-- Script to check CareTransition table schema
USE [healthextent];
GO

PRINT 'Checking CareTransition table schema...';
PRINT '';

-- Check column types
SELECT
    c.name AS ColumnName,
    t.name AS DataType,
    c.max_length AS MaxLength,
    c.is_nullable AS IsNullable,
    c.is_identity AS IsIdentity
FROM sys.columns c
INNER JOIN sys.types t ON c.user_type_id = t.user_type_id
WHERE c.object_id = OBJECT_ID('he.CareTransition')
ORDER BY c.column_id;

PRINT '';
PRINT 'Key columns detail:';
SELECT
    c.name AS ColumnName,
    t.name AS DataType,
    c.max_length AS MaxLength,
    CASE WHEN t.name = 'nvarchar' THEN c.max_length / 2 ELSE c.max_length END AS CharLength,
    c.is_nullable AS IsNullable
FROM sys.columns c
INNER JOIN sys.types t ON c.user_type_id = t.user_type_id
WHERE c.object_id = OBJECT_ID('he.CareTransition')
    AND c.name IN ('CareTransitionKey', 'CareManagerUserKey', 'AssignedToUserKey', 'ClosedByUserKey')
ORDER BY c.name;

PRINT '';
PRINT 'Sample data (first 5 rows):';
SELECT TOP 5
    CareTransitionKey,
    CareManagerUserKey,
    AssignedToUserKey,
    ClosedByUserKey,
    TenantKey
FROM [he].[CareTransition];
