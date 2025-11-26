variable "subscription_id" { type = string }
variable "location" {
  type    = string
  default = "eastus2"
}

variable "rg_data" {
  type    = string
  default = "he-rg-data-dev-eus2"
}

variable "rg_apps" {
  type    = string
  default = "he-rg-apps-dev-eus2"
}

variable "acr_name" {
  type    = string
  default = "heacrdev01"
}

variable "hds_workspace_name" {
  type    = string
  default = "hehdswsdev01"
}

variable "fhir_name" {
  type    = string
  default = "hefhirdev01"
}

variable "cae_name" {
  type    = string
  default = "he-cae-dev-eus2"
}

variable "log_analytics_name" {
  type    = string
  default = "he-log-dev-01"
}
