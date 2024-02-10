resource "yandex_iam_service_account" "deploy_sa" {
  name        = "${var.environment}-deploy-sa"
  description = "Deploy service account"
  folder_id   = var.folder_id
}

resource "github_actions_environment_secret" "DEPLOY_SA_ID" {
  repository      = data.github_repository.this.name
  environment     = var.environment
  secret_name     = "DEPLOY_SA_ID"
  plaintext_value = yandex_iam_service_account.deploy_sa.id
}

resource "yandex_resourcemanager_folder_iam_member" "cr_pusher" {
  folder_id = var.folder_id
  role      = "container-registry.images.pusher"
  member    = "serviceAccount:${yandex_iam_service_account.deploy_sa.id}"
}

# https://cloud.yandex.ru/ru/docs/troubleshooting/serverless-containers/known-issues/service-account-is-not-available
resource "yandex_resourcemanager_folder_iam_member" "sa_user" {
  folder_id = var.folder_id
  role      = "iam.serviceAccounts.user"
  member    = "serviceAccount:${yandex_iam_service_account.deploy_sa.id}"
}

resource "yandex_resourcemanager_folder_iam_member" "sls_editor" {
  folder_id = var.folder_id
  role      = "serverless.containers.editor"
  member    = "serviceAccount:${yandex_iam_service_account.deploy_sa.id}"
}

resource "yandex_resourcemanager_folder_iam_member" "sls_admin" {
  folder_id = var.folder_id
  role      = "serverless-containers.admin"
  member    = "serviceAccount:${yandex_iam_service_account.deploy_sa.id}"
}

resource "yandex_resourcemanager_folder_iam_member" "gw_editor" {
  folder_id = var.folder_id
  role      = "api-gateway.editor"
  member    = "serviceAccount:${yandex_iam_service_account.deploy_sa.id}"
}

resource "yandex_iam_service_account_key" "deploy_sa_auth_key" {
  service_account_id = yandex_iam_service_account.deploy_sa.id
  description        = "key for deploy service account"
  key_algorithm      = "RSA_4096"
}

resource "github_actions_environment_secret" "YC_SA_JSON_CREDENTIALS" {
  repository  = data.github_repository.this.name
  environment = var.environment
  secret_name = "YC_SA_JSON_CREDENTIALS"
  plaintext_value = jsonencode({
    "id" : "${yandex_iam_service_account_key.deploy_sa_auth_key.id}",
    "service_account_id" : "${yandex_iam_service_account.deploy_sa.id}",
    "created_at" : "${yandex_iam_service_account_key.deploy_sa_auth_key.created_at}",
    "key_algorithm" : "${yandex_iam_service_account_key.deploy_sa_auth_key.key_algorithm}",
    "public_key" : "${yandex_iam_service_account_key.deploy_sa_auth_key.public_key}",
    "private_key" : "${yandex_iam_service_account_key.deploy_sa_auth_key.private_key}"
  })
}
