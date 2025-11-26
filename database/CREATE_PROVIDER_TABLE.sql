-- Create Provider table in he-healthcare-db
-- This table stores healthcare provider information

USE [he-healthcare-db];
GO

-- Drop table if exists (for development)
IF OBJECT_ID('he.Provider', 'U') IS NOT NULL
    DROP TABLE he.Provider;
GO

-- Create Provider table
CREATE TABLE he.Provider
(
    ProviderKey BIGINT IDENTITY(1,1) NOT NULL,
    TenantKey NVARCHAR(64) NOT NULL,
    FamilyName NVARCHAR(100) NULL,
    GivenName NVARCHAR(100) NULL,
    Prefix NVARCHAR(20) NULL,
    Status INT NOT NULL DEFAULT 1,  -- 1=Active, 0=Inactive
    NPI NVARCHAR(10) NULL,  -- National Provider Identifier (10 digits)
    LastUpdatedUtc DATETIME2(3) NOT NULL DEFAULT GETUTCDATE(),

    CONSTRAINT PK_Provider PRIMARY KEY CLUSTERED (ProviderKey),
    INDEX IX_Provider_TenantKey NONCLUSTERED (TenantKey),
    INDEX IX_Provider_NPI NONCLUSTERED (NPI),
    INDEX IX_Provider_FamilyName NONCLUSTERED (FamilyName)
);
GO

-- Enable Row Level Security
ALTER TABLE he.Provider ENABLE CHANGE_TRACKING WITH (TRACK_COLUMNS_UPDATED = ON);
GO

-- Add Row Level Security policy
IF EXISTS (SELECT * FROM sys.security_policies WHERE name = 'ProviderAccessPolicy')
    DROP SECURITY POLICY he.ProviderAccessPolicy;
GO

CREATE SECURITY POLICY he.ProviderAccessPolicy
ADD FILTER PREDICATE he.fn_TenantAccessPredicate(TenantKey) ON he.Provider,
ADD BLOCK PREDICATE he.fn_TenantAccessPredicate(TenantKey) ON he.Provider AFTER INSERT
WITH (STATE = ON);
GO

-- Create stored procedure for upserting providers
IF OBJECT_ID('he.UpsertProvider_Tenant', 'P') IS NOT NULL
    DROP PROCEDURE he.UpsertProvider_Tenant;
GO

CREATE PROCEDURE he.UpsertProvider_Tenant
    @TenantKey NVARCHAR(64),
    @NPI NVARCHAR(10),
    @FamilyName NVARCHAR(100) = NULL,
    @GivenName NVARCHAR(100) = NULL,
    @Prefix NVARCHAR(20) = NULL,
    @Status INT = 1
AS
BEGIN
    SET NOCOUNT ON;

    -- Set session context for RLS
    EXEC sys.sp_set_session_context @key=N'tenant_id', @value=@TenantKey, @read_only=0;

    DECLARE @ProviderKey BIGINT;
    DECLARE @Message NVARCHAR(500);

    BEGIN TRY
        BEGIN TRANSACTION;

        -- Check if provider exists by NPI and TenantKey
        SELECT @ProviderKey = ProviderKey
        FROM he.Provider WITH (UPDLOCK, SERIALIZABLE)
        WHERE TenantKey = @TenantKey AND NPI = @NPI;

        IF @ProviderKey IS NOT NULL
        BEGIN
            -- Update existing provider
            UPDATE he.Provider
            SET
                FamilyName = COALESCE(@FamilyName, FamilyName),
                GivenName = COALESCE(@GivenName, GivenName),
                Prefix = COALESCE(@Prefix, Prefix),
                Status = @Status,
                LastUpdatedUtc = GETUTCDATE()
            WHERE ProviderKey = @ProviderKey;

            SET @Message = 'Provider updated successfully';
        END
        ELSE
        BEGIN
            -- Insert new provider
            INSERT INTO he.Provider (TenantKey, FamilyName, GivenName, Prefix, Status, NPI, LastUpdatedUtc)
            VALUES (@TenantKey, @FamilyName, @GivenName, @Prefix, @Status, @NPI, GETUTCDATE());

            SET @ProviderKey = SCOPE_IDENTITY();
            SET @Message = 'Provider created successfully';
        END

        COMMIT TRANSACTION;

        -- Return result
        SELECT
            @ProviderKey AS ProviderKey,
            1 AS Success,
            @Message AS Message;

    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        SELECT
            NULL AS ProviderKey,
            0 AS Success,
            ERROR_MESSAGE() AS Message;
    END CATCH
END;
GO

PRINT 'Provider table created successfully!';
GO
