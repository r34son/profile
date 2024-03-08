locals {
  assets_folder = "${var.folder_path}/assets"
  cache_folder  = "${var.folder_path}/cache"
  content_type_lookup = {
    css   = "text/css"
    woff2 = "font/woff2"
    js    = "text/javascript"
    svg   = "image/svg+xml"
    ico   = "image/x-icon"
    html  = "text/html"
    htm   = "text/html"
    json  = "application/json"
    png   = "image/png"
    jpg   = "image/jpeg"
    jpeg  = "image/jpeg"
  }
}

# Static Assets
resource "yandex_storage_object" "assets" {
  for_each = fileset(local.assets_folder, "**")

  bucket      = var.bucket_name
  key         = "assets/${each.value}"
  source      = "${local.assets_folder}/${each.value}"
  source_hash = filemd5("${local.assets_folder}/${each.value}")
  #   cache_control = length(regexall(var.cache_control_immutable_assets_regex, file)) > 0 ? "public,max-age=31536000,immutable" : "public,max-age=0,s-maxage=31536000,must-revalidate"
  content_type = lookup(local.content_type_lookup, split(".", each.value)[length(split(".", each.value)) - 1], "text/plain")
  access_key   = var.access_key
  secret_key   = var.secret_key
}

# Cached Files
resource "yandex_storage_object" "cache" {
  for_each = fileset(local.cache_folder, "**")

  bucket       = var.bucket_name
  key          = "cache/${each.value}"
  source       = "${local.cache_folder}/${each.value}"
  source_hash  = filemd5("${local.cache_folder}/${each.value}")
  content_type = lookup(local.content_type_lookup, split(".", each.value)[length(split(".", each.value)) - 1], "text/plain")
  access_key   = var.access_key
  secret_key   = var.secret_key
}
