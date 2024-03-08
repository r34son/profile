terraform {
  required_version = ">= 1.7.1"

  required_providers {
    archive = {
      source  = "hashicorp/archive"
      version = ">= 2.3.0"
    }

    yandex = {
      source  = "yandex-cloud/yandex"
      version = ">= 0.107.0"
    }

    local = {
      source  = "hashicorp/local"
      version = ">= 2.4.0"
    }

    # terraform = {
    #   source = "terraform.io/builtin/terraform"
    # }
  }
}

# https://terraform-provider.yandexcloud.net/
provider "yandex" {
  folder_id = "b1gtlpgu6rv8iuols96r"
}

provider "aws" {
  skip_region_validation      = true
  skip_credentials_validation = true
  skip_requesting_account_id  = true
}
