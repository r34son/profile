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

variable "environment" {
  description = "(Required) Name of environment."
  type        = string
}
