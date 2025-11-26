output "container_apps_env_id" {
  value = data.azurerm_container_app_environment.cae.id
}
output "log_analytics_id" {
  value = azurerm_log_analytics_workspace.law.id
}
output "acr_login_server" {
  value = data.azurerm_container_registry.acr.login_server
}
