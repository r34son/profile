variable "bucket_name_prefix" {
  description = "(Required) Bucket name prefix."
  type        = string
}

variable "environment" {
  description = "(Required) Name of environment."
  type        = string
}

variable "folder_id" {
  description = <<EOF
    (Optional) The ID of the Yandex Cloud Folder that the resources belongs to.

    Allows to create bucket in different folder.
    It will try to create bucket using IAM-token in provider config, not using access_key.
    If omitted, folder_id specified in provider config and access_key is used.
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
