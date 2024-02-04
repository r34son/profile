variable "organization_id" {
  description = <<EOF
    (Required) Yandex.Cloud Organization that the Cloud belongs to. If value is omitted, the default provider Organization ID is used.
    For more information see https://cloud.yandex.com/en/docs/organization/
  EOF
  type        = string
  default     = null
}

variable "billing_account_id" {
  description = <<EOF
    (Required) ID of billing account to bind Cloud to.
    For more information see https://cloud.yandex.com/en/docs/billing/concepts/billing-account.
  EOF
  type        = string
  default     = null
}

variable "cloud_name" {
  description = <<EOF
    (Required) The name of the Cloud.
  EOF
  type        = string
}

variable "cloud_description" {
  description = <<EOF
    (Optional) Description of the Cloud.
  EOF
  type        = string
}
