data "archive_file" "server_function" {
  type        = "zip"
  output_path = "${var.folder_path}/server-function.zip"
  source_dir  = "${var.folder_path}/server-function"
  # Ignore package.json because YCloud tries to install packages even if node_modules are present already
  excludes = ["package.json"]
}

data "archive_file" "image_optimization_function" {
  type        = "zip"
  output_path = "${var.folder_path}/image-optimization-function.zip"
  source_dir  = "${var.folder_path}/image-optimization-function"
  # Ignore package.json because YCloud tries to install packages even if node_modules are present already
  excludes = ["package.json", "package-lock.json"]
}

module "bucket" {
  source      = "github.com/terraform-yc-modules/terraform-yc-s3"
  acl         = "public-read"
  bucket_name = "functions-sources-bucket"
  # 50GB
  max_size = 53687091200
  storage_admin_service_account = {
    name_prefix = "storage-admin"
  }
  anonymous_access_flags = {
    read        = true
    list        = false
    config_read = false
  }
}

resource "yandex_storage_object" "server_function_zip" {
  bucket = module.bucket.bucket_name
  key = replace(
    basename(data.archive_file.server_function.output_path),
    ".zip",
    "-${data.archive_file.server_function.output_md5}.zip"
  )
  source     = data.archive_file.server_function.output_path
  access_key = module.bucket.storage_admin_access_key
  secret_key = module.bucket.storage_admin_secret_key
}

resource "yandex_storage_object" "image_optimization_function_zip" {
  bucket = module.bucket.bucket_name
  key = replace(
    basename(data.archive_file.image_optimization_function.output_path),
    ".zip",
    "-${data.archive_file.image_optimization_function.output_md5}.zip"
  )
  source     = data.archive_file.image_optimization_function.output_path
  access_key = module.bucket.storage_admin_access_key
  secret_key = module.bucket.storage_admin_secret_key
}

module "single_zone" {
  source      = "../modules/tf-yc-open-next"
  folder_path = var.folder_path
  website_bucket = {
    force_destroy = true
  }
  server_function = {
    function_code = {
      s3 = {
        bucket = yandex_storage_object.server_function_zip.bucket
        key    = yandex_storage_object.server_function_zip.id
        hash   = data.archive_file.server_function.output_base64sha256
      }
      handler = "index.handler2"
    }
  }
  image_optimization_function = {
    function_code = {
      s3 = {
        bucket = yandex_storage_object.image_optimization_function_zip.bucket
        key    = yandex_storage_object.image_optimization_function_zip.id
        hash   = data.archive_file.image_optimization_function.output_base64sha256
      }
    }
  }
}
