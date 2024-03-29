variable "folder_path" {
  description = "The path to the open next artifacts"
  type        = string
}

variable "cache_control_immutable_assets_regex" {
  description = "Regex to set public,max-age=31536000,immutable on immutable resources"
  type        = string
  default     = "^.*(\\.next)$"
}

variable "bucket_name" {
  description = "The name of the bucket to upload files to"
  type        = string
}

variable "access_key" {
  description = "(Optional) The access key to use when applying changes. If omitted, storage_access_key specified in config is used."
  type        = string
  default     = null

}

variable "secret_key" {
  description = "(Optional) The secret key to use when applying changes. If omitted, storage_secret_key specified in config is used."
  type        = string
  sensitive   = true
  default     = null
}
