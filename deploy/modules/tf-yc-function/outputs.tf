output "id" {
  description = "The lambda function id"
  value       = yandex_function.server_function.id
}

output "name" {
  description = "The lambda function name"
  value       = yandex_function.server_function.name
}

# output "arn" {
#   description = "The lambda ARN"
#   value       = yandex_function.server_function.arn
# }

output "version" {
  description = "The function version that is deployed"
  value       = yandex_function.server_function.version
}

# output "qualified_arn" {
#   description = "The function qualified ARN"
#   value       = yandex_function.server_function.qualified_arn
# }

# output "url_hostnames" {
#   description = "The hostname for the lambda function urls"
#   value       = length(aws_lambda_function_url.function_url) > 0 ? { for url in aws_lambda_function_url.function_url : url.qualifier => trimsuffix(trimprefix(aws_lambda_function_url.function_url[url.qualifier].function_url, "https://"), "/") } : {}
# }

output "function_service_account_id" {
  description = "Service account id for invoking server function"
  value       = yandex_iam_service_account.service_account.id
}
