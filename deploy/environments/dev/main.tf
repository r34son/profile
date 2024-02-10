terraform {
  required_providers {
    yandex = {
      source  = "yandex-cloud/yandex"
      version = ">= 0.107.0"
    }

    github = {
      source = "integrations/github"
    }
  }

  backend "s3" {
    endpoints = {
      s3       = "https://storage.yandexcloud.net"
      dynamodb = "https://docapi.serverless.yandexcloud.net/ru-central1/b1g0dp5ilnp8qi98d85v/etn1sm46buml7gnuvjea"
    }
    bucket         = "profile-tf-remote-state"
    region         = "ru-central1"
    key            = "dev/terraform.tfstate"
    dynamodb_table = "state-lock-table"

    skip_s3_checksum            = true
    skip_region_validation      = true
    skip_credentials_validation = true
    skip_requesting_account_id  = true
  }

  required_version = ">= 1.7.1"
}

provider "yandex" {
  cloud_id = var.cloud_id
  zone     = var.zone
}

provider "github" {}

provider "aws" {
  skip_region_validation      = true
  skip_credentials_validation = true
  skip_requesting_account_id  = true
}

module "github" {
  source            = "../../modules/github"
  github_user       = var.github_user
  github_repository = var.github_repository
  environment       = "dev"
}

resource "yandex_resourcemanager_folder" "this" {
  cloud_id    = var.cloud_id
  name        = "dev"
  description = "Development environment"
  labels = {
    environment = "dev"
  }
}

data "github_repository" "this" {
  full_name = var.github_repository
}

resource "github_actions_environment_secret" "FOLDER_ID" {
  repository      = data.github_repository.this.name
  environment     = "dev"
  secret_name     = "FOLDER_ID"
  plaintext_value = yandex_resourcemanager_folder.this.id
}

module "bucket" {
  source             = "../../modules/s3"
  bucket_name_prefix = "profile"
  folder_id          = yandex_resourcemanager_folder.this.id
  github_repository  = var.github_repository
  environment        = "dev"
}

module "serverless" {
  source            = "../../modules/serverless"
  folder_id         = yandex_resourcemanager_folder.this.id
  github_repository = var.github_repository
  repository_name   = "profile"
  environment       = "dev"
}

