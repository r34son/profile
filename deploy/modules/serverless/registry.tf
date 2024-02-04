resource "yandex_container_registry" "this" {
  name      = "default"
  folder_id = var.folder_id
}

resource "yandex_container_repository" "this" {
  name = "${yandex_container_registry.this.id}/${var.repository_name}"
}

data "github_repository" "this" {
  full_name = var.github_repository
}

resource "github_actions_environment_secret" "DOCKER_REGISTRY_PATH" {
  repository      = data.github_repository.this.name
  environment     = var.environment
  secret_name     = "DOCKER_REGISTRY_PATH"
  plaintext_value = "cr.yandex/${yandex_container_repository.this.name}"
}
