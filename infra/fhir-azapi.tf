resource "azapi_resource" "hds_workspace" {
  type      = "Microsoft.HealthcareApis/workspaces@2024-03-31"
  name      = var.hds_workspace_name
  location  = data.azurerm_resource_group.rg_data.location
  parent_id = data.azurerm_resource_group.rg_data.id
  body = {
    properties = {}
  }
}

resource "azapi_resource" "fhir_service" {
  type      = "Microsoft.HealthcareApis/workspaces/fhirservices@2024-03-31"
  name      = var.fhir_name
  location  = data.azurerm_resource_group.rg_data.location
  parent_id = azapi_resource.hds_workspace.id

  schema_validation_enabled = false

  body = {
    kind = "fhir-R4"
    properties = {
      authenticationConfiguration = { smartProxyEnabled = true }
      corsConfiguration = {
        origins          = ["*"]
        headers          = ["*"]
        methods          = ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"]
        maxAge           = 3600
        allowCredentials = false
      }
    }
  }

  response_export_values = ["properties.serviceUrl"]

  lifecycle {
    ignore_changes = [body]
  }
}

output "fhir_service_id" {
  value = azapi_resource.fhir_service.id
}
