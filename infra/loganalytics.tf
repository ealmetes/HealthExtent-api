resource "azurerm_log_analytics_workspace" "law" {
  name                = var.log_analytics_name
  location            = data.azurerm_resource_group.rg_apps.location
  resource_group_name = data.azurerm_resource_group.rg_apps.name
  sku                 = "PerGB2018"
  retention_in_days   = 30
}
