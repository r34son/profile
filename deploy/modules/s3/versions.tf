terraform {
  required_providers {
    github = {
      source = "integrations/github"
    }
  }

  required_version = ">= 1.7.1"
}

provider "aws" {
  skip_region_validation      = true
  skip_credentials_validation = true
  skip_requesting_account_id  = true
}
