module "bucket" {
  source      = "github.com/terraform-yc-modules/terraform-yc-s3"
  acl         = "public-read"
  bucket_name = "${var.bucket_name_prefix}-${var.environment}-bucket"
  folder_id   = var.folder_id
  # 50GB
  max_size = 53687091200
  storage_admin_service_account = {
    name_prefix = "${var.environment}-storage-admin"
  }
  anonymous_access_flags = {
    read        = true
    list        = false
    config_read = false
  }
  cors_rule = [{
    allowed_methods = ["GET"]
    allowed_origins = ["https://*.containers.yandexcloud.net", "https://*.apigw.yandexcloud.net"]
    max_age_seconds = 0
  }]
  tags = {
    environment = var.environment
  }
}

data "github_repository" "this" {
  full_name = var.github_repository
}

resource "github_actions_environment_secret" "AWS_ACCESS_KEY_ID" {
  repository      = data.github_repository.this.name
  environment     = var.environment
  secret_name     = "AWS_ACCESS_KEY_ID"
  plaintext_value = module.bucket.storage_admin_access_key
}

resource "github_actions_environment_secret" "AWS_SECRET_ACCESS_KEY" {
  repository      = data.github_repository.this.name
  environment     = var.environment
  secret_name     = "AWS_SECRET_ACCESS_KEY"
  plaintext_value = module.bucket.storage_admin_secret_key
}

resource "github_actions_environment_secret" "AWS_S3_BUCKET" {
  repository      = data.github_repository.this.name
  environment     = var.environment
  secret_name     = "AWS_S3_BUCKET"
  plaintext_value = module.bucket.bucket_name
}

