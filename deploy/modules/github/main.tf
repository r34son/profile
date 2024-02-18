data "github_user" "current" {
  username = var.github_user
}

data "github_repository" "this" {
  full_name = var.github_repository
}

resource "github_repository_environment" "this" {
  environment = var.environment
  repository  = data.github_repository.this.name
  reviewers {
    users = [data.github_user.current.id]
  }
  deployment_branch_policy {
    protected_branches     = var.environment == "production"
    custom_branch_policies = var.environment != "production"
  }
}
