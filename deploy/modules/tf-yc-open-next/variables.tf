variable "prefix" {
  description = "A prefix which will be attached to the resource name to ensure resources are random"
  type        = string
  default     = null
}

variable "suffix" {
  description = "A suffix which will be attached to the resource name to ensure resources are random"
  type        = string
  default     = null
}

# variable "s3_folder_prefix" {
#   description = "An optional folder to store files under"
#   type        = string
#   default     = null
# }

# variable "zone_suffix" {
#   description = "An optional zone suffix to add to the assets and cache folder to allow files to be loaded correctly"
#   type        = string
#   default     = null
# }

variable "folder_path" {
  description = "The path to the open next artifacts"
  type        = string
  default     = "./.open-next"
}

# variable "s3_exclusion_regex" {
#   description = "A regex of files to exclude from the s3 copy"
#   type        = string
#   default     = null
# }

# variable "function_architecture" {
#   description = "The default instruction set architecture for the lambda functions. This can be overridden for each function"
#   type        = string
#   default     = "arm64"
# }

# variable "iam" {
#   description = "The default IAM configuration. This can be overridden for each function"
#   type = object({
#     path                 = optional(string, "/")
#     permissions_boundary = optional(string)
#   })
#   default = {}
# }

# variable "cloudwatch_log" {
#   description = "The default cloudwatch log group. This can be overridden for each function"
#   type = object({
#     retention_in_days = number
#   })
#   default = {
#     retention_in_days = 7
#   }
# }

# variable "vpc" {
#   description = "The default VPC configuration for the lambda resources. This can be overridden for each function"
#   type = object({
#     security_group_ids = list(string),
#     subnet_ids         = list(string)
#   })
#   default = null
# }

# variable "aliases" {
#   description = "The production and staging aliases to use"
#   type = object({
#     production = string
#     staging    = string
#   })
#   default = null
# }

variable "cache_control_immutable_assets_regex" {
  description = "Regex to set public,max-age=31536000,immutable on immutable resources"
  type        = string
  default     = "^.*(\\.next)$"
}

# variable "warmer_function" {
#   description = "Configuration for the warmer function"
#   type = object({
#     enabled = optional(bool, false)
#     warm_staging = optional(object({
#       enabled     = optional(bool, false)
#       concurrency = optional(number)
#     }))
#     function_code = optional(object({
#       handler = optional(string, "index.handler")
#       zip = optional(object({
#         path = string
#         hash = string
#       }))
#       s3 = optional(object({
#         bucket         = string
#         key            = string
#         object_version = optional(string)
#       }))
#     }))
#     runtime                          = optional(string, "nodejs20.x")
#     concurrency                      = optional(number, 20)
#     timeout                          = optional(number, 15 * 60) // 15 minutes
#     memory_size                      = optional(number, 1024)
#     function_architecture            = optional(string)
#     schedule                         = optional(string, "rate(5 minutes)")
#     additional_environment_variables = optional(map(string), {})
#     additional_iam_policies = optional(list(object({
#       name   = string,
#       arn    = optional(string)
#       policy = optional(string)
#     })), [])
#     vpc = optional(object({
#       security_group_ids = list(string),
#       subnet_ids         = list(string)
#     }))
#     iam = optional(object({
#       path                 = optional(string)
#       permissions_boundary = optional(string)
#     }))
#     cloudwatch_log = optional(object({
#       retention_in_days = number
#     }))
#     timeouts = optional(object({
#       create = optional(string)
#       update = optional(string)
#       delete = optional(string)
#     }), {})
#   })
#   default = {}
# }

variable "server_function" {
  description = "Configuration for the server function"
  type = object({
    function_code = optional(object({
      #   open-next exports function in index.mjs as handler
      handler = optional(string, "index.handler")
      zip = optional(object({
        path = string
        hash = string
      }))
      s3 = optional(object({
        bucket         = string
        key            = string
        object_version = optional(string)
      }))
    }))
    # enable_streaming                 = optional(bool, false)
    runtime                 = optional(string, "nodejs18")
    backend_deployment_type = optional(string, "REGIONAL_LAMBDA")
    timeout                 = optional(number, 10)
    memory_size             = optional(number, 1024)
    # function_architecture            = optional(string)
    additional_environment_variables = optional(map(string), {})
    # additional_iam_policies = optional(list(object({
    #   name   = string,
    #   arn    = optional(string)
    #   policy = optional(string)
    # })), [])
    # vpc = optional(object({
    #   security_group_ids = list(string),
    #   subnet_ids         = list(string)
    # }))
    # iam = optional(object({
    #   path                 = optional(string)
    #   permissions_boundary = optional(string)
    # }))
    # cloudwatch_log = optional(object({
    #   retention_in_days = number
    # }))
    # timeouts = optional(object({
    #   create = optional(string)
    #   update = optional(string)
    #   delete = optional(string)
    # }), {})
  })
  default = {}

  #   validation {
  #     condition     = contains(["REGIONAL_LAMBDA_WITH_AUTH_LAMBDA", "REGIONAL_LAMBDA", "EDGE_LAMBDA"], var.server_function.backend_deployment_type)
  #     error_message = "The server function backend deployment type can be one of REGIONAL_LAMBDA_WITH_AUTH_LAMBDA, REGIONAL_LAMBDA or EDGE_LAMBDA"
  #   }
}

variable "image_optimization_function" {
  description = "Configuration for the image optimization function"
  type = object({
    create = optional(bool, true)
    function_code = optional(object({
      handler = optional(string, "index.handler")
      zip = optional(object({
        path = string
        hash = string
      }))
      s3 = optional(object({
        bucket         = string
        key            = string
        object_version = optional(string)
        hash           = string
      }))
    }))
    runtime                          = optional(string, "nodejs18")
    backend_deployment_type          = optional(string, "REGIONAL_LAMBDA")
    timeout                          = optional(number, 25)
    memory_size                      = optional(number, 1536)
    additional_environment_variables = optional(map(string), {})
    # function_architecture            = optional(string)
    # additional_iam_policies = optional(list(object({
    #   name   = string,
    #   arn    = optional(string)
    #   policy = optional(string)
    # })), [])
    # vpc = optional(object({
    #   security_group_ids = list(string),
    #   subnet_ids         = list(string)
    # }))
    # iam = optional(object({
    #   path                 = optional(string)
    #   permissions_boundary = optional(string)
    # }))
    # cloudwatch_log = optional(object({
    #   retention_in_days = number
    # }))
    # timeouts = optional(object({
    #   create = optional(string)
    #   update = optional(string)
    #   delete = optional(string)
    # }), {})
  })
  default = {}

  # validation {
  #   condition     = contains(["REGIONAL_LAMBDA_WITH_AUTH_LAMBDA", "REGIONAL_LAMBDA"], var.image_optimisation_function.backend_deployment_type)
  #   error_message = "The server function backend deployment type can be one of REGIONAL_LAMBDA_WITH_AUTH_LAMBDA or REGIONAL_LAMBDA"
  # }
}

# variable "revalidation_function" {
#   description = "Configuration for the revalidation function"
#   type = object({
#     function_code = optional(object({
#       handler = optional(string, "index.handler")
#       zip = optional(object({
#         path = string
#         hash = string
#       }))
#       s3 = optional(object({
#         bucket         = string
#         key            = string
#         object_version = optional(string)
#       }))
#     }))
#     runtime                          = optional(string, "nodejs20.x")
#     timeout                          = optional(number, 25)
#     memory_size                      = optional(number, 1536)
#     additional_environment_variables = optional(map(string), {})
#     function_architecture            = optional(string)
#     additional_iam_policies = optional(list(object({
#       name   = string,
#       arn    = optional(string)
#       policy = optional(string)
#     })), [])
#     vpc = optional(object({
#       security_group_ids = list(string),
#       subnet_ids         = list(string)
#     }))
#     iam = optional(object({
#       path                 = optional(string)
#       permissions_boundary = optional(string)
#     }))
#     cloudwatch_log = optional(object({
#       retention_in_days = number
#     }))
#     timeouts = optional(object({
#       create = optional(string)
#       update = optional(string)
#       delete = optional(string)
#     }), {})
#   })
#   default = {}
# }

variable "tag_mapping_db" {
  description = "Configuration for the ISR tag mapping database"
  type = object({
    deployment = optional(string, "CREATE")
    revalidate_gsi = optional(object({
      read_capacity  = optional(number)
      write_capacity = optional(number)
    }), {})
  })
  default = {}
}

variable "website_bucket" {
  description = "Configuration for the website S3 bucket"
  type = object({
    deployment           = optional(string, "CREATE")
    create_bucket_policy = optional(bool, true)
    force_destroy        = optional(bool, false)
    arn                  = optional(string)
    region               = optional(string)
    name                 = optional(string)
    domain_name          = optional(string)
  })
  default = {}
}

# variable "domain_config" {
#   description = "Configuration for CloudFront distribution domain"
#   type = object({
#     evaluate_target_health = optional(bool, true)
#     sub_domain             = optional(string)
#     hosted_zones = list(object({
#       name         = string
#       id           = optional(string)
#       private_zone = optional(bool, false)
#     }))
#     create_route53_entries = optional(bool, true)
#     viewer_certificate = optional(object({
#       acm_certificate_arn      = string
#       ssl_support_method       = optional(string, "sni-only")
#       minimum_protocol_version = optional(string, "TLSv1.2_2021")
#     }))
#   })
#   default = null
# }

# variable "continuous_deployment" {
#   description = "Configuration for continuous deployment config for CloudFront"
#   type = object({
#     use        = optional(bool, true)
#     deployment = optional(string, "NONE")
#     traffic_config = optional(object({
#       header = optional(object({
#         name  = string
#         value = string
#       }))
#       weight = optional(object({
#         percentage = number
#         session_stickiness = optional(object({
#           idle_ttl    = number
#           maximum_ttl = number
#         }))
#       }))
#     }))
#   })
#   default = {}
# }
