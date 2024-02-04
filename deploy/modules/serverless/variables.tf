variable "environment" {
  description = "(Required) Name of environment."
  type        = string
}

variable "folder_id" {
  description = <<EOF
    (Optional) The ID of the Yandex Cloud Folder that the resources belongs to.
  EOF
  type        = string
  default     = null
}

variable "github_repository" {
  description = <<EOF
    (Required) Full name of the repository (in org/name format).
  EOF
  type        = string
}

variable "repository_name" {
  description = <<EOF
    (Required) A name of the repository. The name of the repository should start with id of a container registry and match the name of the images that will be pushed in the repository.
  EOF
  type        = string
}
