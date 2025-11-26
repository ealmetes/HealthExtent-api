data "azurerm_container_app_environment" "cae" {
  name                = "he-mirth-env-dev"
  resource_group_name = "he-rg-data-dev-eus2"
}
