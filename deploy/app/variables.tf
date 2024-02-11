variable "name_prefix" {
  description = "(Required) Prefix name of serverless container and api gateway."
  type        = string
}

variable "folder_id" {
  description = <<EOF
    (Optional) The ID of the Yandex Cloud Folder that the resources belongs to.
  EOF
  type        = string
  default     = null
}

variable "image_url" {
  description = "(Required) Docker image url."
  type        = string
}

variable "service_account_id" {
  description = "(Required) Service account id."
  type        = string
}
