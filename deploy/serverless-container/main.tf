resource "yandex_serverless_container" "this" {
  name               = var.name_prefix
  folder_id          = var.folder_id
  memory             = 128
  execution_timeout  = "3s"
  cores              = 1
  core_fraction      = 100
  service_account_id = var.service_account_id
  image {
    url = var.image_url
  }
  log_options {
    folder_id = var.folder_id
    min_level = "ERROR"
  }
}

resource "yandex_api_gateway" "this" {
  name      = "${var.name_prefix}-gw"
  folder_id = var.folder_id
  # custom_domains {
  #   fqdn           = "test.example.com"
  #   certificate_id = "<certificate_id_from_cert_manager>"
  # }
  log_options {
    folder_id = var.folder_id
    min_level = "ERROR"
  }
  spec = templatefile("apigw.yaml", {
    container_id       = yandex_serverless_container.this.id,
    service_account_id = var.service_account_id,
  })
}

output "api_gateway_domain" {
  value = "https://${yandex_api_gateway.this.domain}"
}
