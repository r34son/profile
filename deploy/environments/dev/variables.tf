variable "cloud_id" {
  description = "(Required) The ID of the cloud to apply any resources to."
}

variable "zone" {
  description = "(Optional) The default availability zone to operate under, if not specified by a given resource."
  default     = "ru-central1-a"
}

variable "github_user" {
  description = <<EOF
    (Required) Github username.
  EOF
  type        = string
}

variable "github_repository" {
  description = <<EOF
    (Required) Full name of the repository (in org/name format).
  EOF
  type        = string
}
