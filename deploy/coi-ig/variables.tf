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

variable "vm_user" {
  type    = string
  default = "yc-user"
}

variable "ssh_key" {
  type      = string
  sensitive = true
}

variable "domain" {
  type = string
}
