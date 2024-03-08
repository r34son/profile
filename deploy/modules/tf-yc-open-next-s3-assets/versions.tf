terraform {
  required_version = ">= 1.7.1"

  required_providers {
    yandex = {
      source  = "yandex-cloud/yandex"
      version = ">= 0.107.0"
    }
  }

  # terraform = {
  #   source = "terraform.io/builtin/terraform"
  # }
}

