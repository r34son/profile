locals {
  # should_create_isr_tag_mapping = var.tag_mapping_db.deployment == "CREATE"
  # isr_tag_mapping_file_path     = "${var.folder_path}/dynamodb-provider/dynamodb-cache.json"
  # isr_tag_mapping               = local.should_create_isr_tag_mapping && fileexists(local.isr_tag_mapping_file_path) ? jsondecode(file(local.isr_tag_mapping_file_path)) : []
  # isr_tag_mapping_with_tf_key   = [for tag_mapping in local.isr_tag_mapping : merge(tag_mapping, { tf_key = length([for isr_tag_mapping in local.isr_tag_mapping : isr_tag_mapping if isr_tag_mapping.tag.S == tag_mapping.tag.S]) > 1 ? "${tag_mapping.tag.S}-${tag_mapping.path.S}" : tag_mapping.tag.S })]
  # isr_tag_mapping_db_name       = local.should_create_isr_tag_mapping ? one(yandex_ydb_table.isr_table[*].path) : null
  # isr_tag_mapping_db_arn        = local.should_create_isr_tag_mapping ? one(yandex_ydb_table.isr_table[*].arn) : null

  should_create_website_bucket = var.website_bucket.deployment == "CREATE"

  #   website_bucket_arn           = local.should_create_website_bucket ? one(aws_s3_bucket.bucket[*].arn) : var.website_bucket.arn
  website_bucket_name = local.should_create_website_bucket ? one(module.bucket[*].bucket_name) : var.website_bucket.name
  # website_bucket_region = local.should_create_website_bucket ? data.aws_region.current.name : var.website_bucket.region
  #   website_bucket_domain_name   = local.should_create_website_bucket ? one(aws_s3_bucket.bucket[*].bucket_regional_domain_name) : var.website_bucket.domain_name

  #   create_distribution = var.distribution.deployment == "CREATE"

  prefix = var.prefix == null ? "" : "${var.prefix}-"
  suffix = var.suffix == null ? "" : "-${var.suffix}"

  server_at_edge = var.server_function.backend_deployment_type == "EDGE_LAMBDA"
  server_function_env_variables = merge(
    {
      "X_YCF_NO_RUNTIME_POOL" : 1,
      "AWS_ENDPOINT_URL"      = "https://storage.yandexcloud.net",
      "AWS_REGION"            = "ru-central1",
      "AWS_ACCESS_KEY_ID"     = one(module.bucket[*].storage_admin_access_key)
      "AWS_SECRET_ACCESS_KEY" = one(module.bucket[*].storage_admin_secret_key),
      "CACHE_BUCKET_NAME" : local.website_bucket_name,
      "CACHE_BUCKET_REGION" : "ru-central1",
      "CACHE_BUCKET_KEY_PREFIX" : "cache",
      # "REVALIDATION_QUEUE_URL" : aws_sqs_queue.revalidation_queue.url,
      # "REVALIDATION_QUEUE_REGION" : data.aws_region.current.name,
    },
    # local.isr_tag_mapping_db_name != null ? { "CACHE_DYNAMO_TABLE" : local.isr_tag_mapping_db_name } : {},
    var.server_function.additional_environment_variables
  )
}

# S3

module "bucket" {
  count = local.should_create_website_bucket ? 1 : 0

  source        = "github.com/terraform-yc-modules/terraform-yc-s3"
  acl           = "public-read"
  bucket_name   = "${local.prefix}website-bucket${local.suffix}"
  force_destroy = var.website_bucket.force_destroy

  # anonymous_access_flags = {
  #   read        = true
  #   list        = false
  #   config_read = false
  # }
}

# resource "aws_s3_bucket_policy" "bucket_policy" {
#   bucket = one(aws_s3_bucket.bucket[*].id)
#   policy = jsonencode({
#     "Version" : "2012-10-17",
#     "Statement" : [
#       {
#         "Principal" : {
#           "Service" : "cloudfront.amazonaws.com"
#         },
#         "Action" : [
#           "s3:GetObject"
#         ],
#         "Resource" : "${one(aws_s3_bucket.bucket[*].arn)}/*",
#         "Effect" : "Allow",
#         "Condition" : {
#           "StringEquals" : {
#             "AWS:SourceArn" : compact([try(one(module.public_resources[*].arn), null), try(one(module.public_resources[*].staging_arn), null)])
#           }
#         }
#       }
#     ]
#   })
# }

module "s3_assets" {
  source = "../tf-yc-open-next-s3-assets"

  bucket_name                          = local.website_bucket_name
  folder_path                          = var.folder_path
  cache_control_immutable_assets_regex = var.cache_control_immutable_assets_regex

  access_key = one(module.bucket[*].storage_admin_access_key)
  secret_key = one(module.bucket[*].storage_admin_secret_key)
}

# Server Function

# As lambda@edge does not support environment variables, the module will injected them at the top of the server code prior to the code being uploaded to AWS, credit to SST for the inspiration behind this. https://github.com/sst/sst/blob/3b792053d90c49d9ca693308646a3389babe9ceb/packages/sst/src/constructs/EdgeFunction.ts#L193
# resource "local_file" "lambda_at_edge_modifications" {
#   count = local.server_at_edge && try(var.server_function.function_code.zip, null) == null && try(var.server_function.function_code.s3, null) == null ? 1 : 0

#   content  = "process.env = { ...process.env, ...${jsonencode(local.server_function_env_variables)} };\r\n${file("${var.folder_path}/server-function/index.mjs")}"
#   filename = "${var.folder_path}/server-function/index.js"
# }

module "server_function" {
  source = "../tf-yc-function"

  function_name = "server-function"
  function_code = {
    zip = try(var.server_function.function_code.zip, null)
    s3  = try(var.server_function.function_code.s3, null)
  }

  runtime = var.server_function.runtime
  handler = try(var.server_function.function_code.handler, "index.handler")

  memory_size = var.server_function.memory_size
  timeout     = var.server_function.timeout

  #   additional_iam_policies = var.server_function.additional_iam_policies
  #   iam_policy_statements = [
  #     {
  #       "Action" : [
  #         "s3:GetObject*",
  #         "s3:GetBucket*",
  #         "s3:List*",
  #         "s3:DeleteObject*",
  #         "s3:PutObject",
  #         "s3:PutObjectLegalHold",
  #         "s3:PutObjectRetention",
  #         "s3:PutObjectTagging",
  #         "s3:PutObjectVersionTagging",
  #         "s3:Abort*"
  #       ],
  #       "Resource" : [
  #         local.website_bucket_arn,
  #         "${local.website_bucket_arn}/*"
  #       ],
  #       "Effect" : "Allow"
  #     },
  #     {
  #       "Action" : [
  #         "sqs:SendMessage"
  #       ],
  #       "Resource" : aws_sqs_queue.revalidation_queue.arn,
  #       "Effect" : "Allow"
  #     },
  #     {
  #       "Action" : [
  #         "dynamodb:GetItem",
  #         "dynamodb:Query"
  #       ],
  #       "Resource" : [
  #         local.isr_tag_mapping_db_arn,
  #         "${local.isr_tag_mapping_db_arn}/index/*"
  #       ],
  #       "Effect" : "Allow"
  #     }
  #   ]

  environment_variables = local.server_at_edge ? {} : local.server_function_env_variables

  #   architecture = try(coalesce(var.server_function.function_architecture, var.function_architecture), null)
  #   cloudwatch_log = try(coalesce(var.server_function.cloudwatch_log, var.cloudwatch_log), null)
  #   iam            = try(coalesce(var.server_function.iam, var.iam), null)
  #   vpc = try(coalesce(var.server_function.vpc, var.vpc), null)

  prefix = var.prefix
  suffix = var.suffix

  #   aliases = {
  #     create          = true
  #     names           = local.aliases
  #     alias_to_update = local.staging_alias
  #   }

  run_at_edge = local.server_at_edge

  #   function_url = {
  #     create             = local.server_at_edge == false
  #     authorization_type = var.server_function.backend_deployment_type == "REGIONAL_LAMBDA_WITH_AUTH_LAMBDA" ? "AWS_IAM" : "NONE"
  #     enable_streaming   = var.server_function.enable_streaming
  #   }

  #   scripts = var.scripts

  #   providers = {
  #     aws     = aws.server_function
  #     aws.iam = aws.iam
  #   }
}

# Warmer Function

# module "warmer_function" {
#   for_each = toset(try(var.warmer_function.warm_staging.enabled, false) && var.continuous_deployment.deployment != "NONE" ? local.aliases : var.warmer_function.enabled ? [local.production_alias] : [])
#   source   = "../tf-aws-lambda"

#   function_name = "${each.value}-warmer-function"
#   function_code = {
#     zip = try(var.warmer_function.function_code.s3, null) == null ? coalesce(try(var.warmer_function.function_code.zip, null), {
#       path = one(data.archive_file.warmer_function[*].output_path)
#       hash = one(data.archive_file.warmer_function[*].output_base64sha256)
#     }) : null
#     s3 = try(var.warmer_function.function_code.s3, null)
#   }

#   runtime = var.warmer_function.runtime
#   handler = try(var.warmer_function.function_code.handler, "index.handler")

#   memory_size = var.warmer_function.memory_size
#   timeout     = var.warmer_function.timeout

#   environment_variables = merge({
#     "FUNCTION_NAME" : "${module.server_function.name}:${each.value}",
#     "CONCURRENCY" : each.value == local.production_alias ? var.warmer_function.concurrency : coalesce(try(var.warmer_function.warm_staging.concurrency, null), var.warmer_function.concurrency)
#   }, var.warmer_function.additional_environment_variables)

#   additional_iam_policies = var.warmer_function.additional_iam_policies
#   iam_policy_statements = [
#     {
#       "Action" : [
#         "lambda:InvokeFunction"
#       ],
#       "Resource" : "${module.server_function.arn}:${each.value}",
#       "Effect" : "Allow"
#     }
#   ]

#   architecture   = try(coalesce(var.warmer_function.function_architecture, var.function_architecture), null)
#   cloudwatch_log = try(coalesce(var.warmer_function.cloudwatch_log, var.cloudwatch_log, null))
#   iam            = try(coalesce(var.warmer_function.iam, var.iam), null)
#   vpc            = try(coalesce(var.warmer_function.vpc, var.vpc), null)

#   prefix = var.prefix
#   suffix = var.suffix

#   function_url = {
#     create = false
#   }

#   schedule = var.warmer_function.schedule
#   timeouts = var.warmer_function.timeouts

#   scripts = var.scripts

#   providers = {
#     aws.iam = aws.iam
#   }
# }

# Image Optimization Function

module "image_optimization_function" {
  count  = var.image_optimization_function.create ? 1 : 0
  source = "../tf-yc-function"

  function_name = "image-optimization-function"
  function_code = {
    zip = try(var.image_optimization_function.function_code.zip, null)
    s3  = try(var.image_optimization_function.function_code.s3, null)
  }

  runtime = var.image_optimization_function.runtime
  handler = try(var.image_optimization_function.function_code.handler, "index.handler")

  memory_size = var.image_optimization_function.memory_size
  timeout     = var.image_optimization_function.timeout


  environment_variables = merge({
    "AWS_ENDPOINT_URL"      = "https://storage.yandexcloud.net",
    "AWS_REGION"            = "ru-central1",
    "AWS_ACCESS_KEY_ID"     = one(module.bucket[*].storage_admin_access_key)
    "AWS_SECRET_ACCESS_KEY" = one(module.bucket[*].storage_admin_secret_key),
    "BUCKET_NAME"           = local.website_bucket_name,
    "BUCKET_KEY_PREFIX"     = "assets"
  }, var.image_optimization_function.additional_environment_variables)

  # additional_iam_policies = var.image_optimization_function.additional_iam_policies
  # iam_policy_statements = [
  #   {
  #     "Action" : [
  #       "s3:GetObject"
  #     ],
  #     "Resource" : "${local.website_bucket_arn}/*",
  #     "Effect" : "Allow"
  #   }
  # ]

  # architecture   = try(coalesce(var.image_optimization_function.function_architecture, var.function_architecture), null)
  # cloudwatch_log = try(coalesce(var.image_optimization_function.cloudwatch_log, var.cloudwatch_log), null)
  # iam            = try(coalesce(var.image_optimization_function.iam, var.iam), null)
  # vpc            = try(coalesce(var.image_optimization_function.vpc, var.vpc), null)

  prefix = var.prefix
  suffix = var.suffix

  # function_url = {
  #   create             = true
  #   authorization_type = var.image_optimization_function.backend_deployment_type == "REGIONAL_LAMBDA_WITH_AUTH_LAMBDA" ? "AWS_IAM" : "NONE"
  # }

  # aliases = {
  #   create          = true
  #   names           = local.aliases
  #   alias_to_update = local.staging_alias
  # }

  # timeouts = var.image_optimization_function.timeouts

  # scripts = var.scripts

  # providers = {
  #   aws.iam = aws.iam
  # }
}

# Revalidation Function

# module "revalidation_function" {
#   source = "../tf-aws-lambda"

#   function_name = "revalidation-function"
#   function_code = {
#     zip = try(var.revalidation_function.function_code.s3, null) == null ? coalesce(try(var.revalidation_function.function_code.zip, null), {
#       path = one(data.archive_file.revalidation_function[*].output_path)
#       hash = one(data.archive_file.revalidation_function[*].output_base64sha256)
#     }) : null
#     s3 = try(var.revalidation_function.function_code.s3, null)
#   }

#   runtime = var.revalidation_function.runtime
#   handler = try(var.revalidation_function.function_code.handler, "index.handler")

#   memory_size = var.revalidation_function.memory_size
#   timeout     = var.revalidation_function.timeout

#   environment_variables = var.revalidation_function.additional_environment_variables

#   additional_iam_policies = var.revalidation_function.additional_iam_policies
#   iam_policy_statements = [
#     {
#       "Action" : [
#         "sqs:ReceiveMessage",
#         "sqs:ChangeMessageVisibility",
#         "sqs:GetQueueUrl",
#         "sqs:DeleteMessage",
#         "sqs:GetQueueAttributes"
#       ],
#       "Resource" : aws_sqs_queue.revalidation_queue.arn,
#       "Effect" : "Allow"
#     }
#   ]

#   architecture   = try(coalesce(var.revalidation_function.function_architecture, var.function_architecture), null)
#   cloudwatch_log = try(coalesce(var.revalidation_function.cloudwatch_log, var.cloudwatch_log), null)
#   iam            = try(coalesce(var.revalidation_function.iam, var.iam), null)
#   vpc            = try(coalesce(var.revalidation_function.vpc, var.vpc), null)

#   prefix = var.prefix
#   suffix = var.suffix

#   scripts = var.scripts

#   providers = {
#     aws.iam = aws.iam
#   }
# }

# SQS

# resource "aws_sqs_queue" "revalidation_queue" {
#   name                        = "${local.prefix}isr-queue${local.suffix}.fifo"
#   fifo_queue                  = true
#   content_based_deduplication = true
# }

# resource "aws_lambda_event_source_mapping" "revalidation_queue_source" {
#   event_source_arn = aws_sqs_queue.revalidation_queue.arn
#   function_name    = module.revalidation_function.arn
# }

# DynamoDB

# resource "yandex_ydb_database_serverless" "isr_database" {
#   count     = local.should_create_isr_tag_mapping ? 1 : 0
#   name      = "${local.prefix}isr-tag-mapping${local.suffix}"
#   folder_id = data.yandex_client_config.client.folder_id

#   deletion_protection = true
# }

# resource "yandex_ydb_table" "isr_table" {
#   count             = local.should_create_isr_tag_mapping ? 1 : 0
#   path              = "isr"
#   connection_string = one(yandex_ydb_database_serverless.isr_database[*].ydb_full_endpoint)

#   column {
#     name = "tag"
#     type = "Utf8"
#   }
#   column {
#     name = "path"
#     type = "Utf8"
#   }
#   column {
#     name = "revalidatedAt"
#     type = "Int32"
#   }

#   primary_key = ["tag"]
# }

# resource "terraform_data" "isr_table_item" {
#   for_each = { for item in local.isr_tag_mapping_with_tf_key : item.tf_key => item }

#   provisioner "local-exec" {
#     command = "/bin/bash ${path.module}/scripts/save-item-to-dynamo.sh"

#     environment = {
#       "ENDPOINT"   = one(yandex_ydb_database_serverless.isr_database[*].document_api_endpoint)
#       "TABLE_NAME" = local.isr_tag_mapping_db_name
#       "ITEM"       = jsonencode({ for name, value in each.value : name => value if name != "tf_key" })
#     }
#   }
# }

data "yandex_client_config" "client" {}

resource "yandex_api_gateway" "this" {
  name = "${local.prefix}server-gw${local.suffix}"
  # custom_domains {
  #   fqdn           = "test.example.com"
  #   certificate_id = "<certificate_id_from_cert_manager>"
  # }
  log_options {
    folder_id = data.yandex_client_config.client.folder_id
    min_level = "ERROR"
  }
  spec = templatefile("${path.module}/apigw.yaml", {
    bucket_name                                    = local.website_bucket_name,
    bucket_service_account_id                      = one(module.bucket[*].storage_admin_service_account_id)
    server_function_id                             = module.server_function.id,
    server_function_service_account_id             = module.server_function.function_service_account_id
    image_optimization_function_id                 = one(module.image_optimization_function[*].id)
    image_optimization_function_service_account_id = one(module.image_optimization_function[*].function_service_account_id)
  })
}
