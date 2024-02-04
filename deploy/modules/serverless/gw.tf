resource "yandex_api_gateway" "this" {
  name      = "${var.environment}-gw"
  folder_id = var.folder_id
  # custom_domains {
  #   fqdn           = "test.example.com"
  #   certificate_id = "<certificate_id_from_cert_manager>"
  # }
  log_options {
    folder_id = var.folder_id
    min_level = "ERROR"
  }
  spec = <<-EOT
openapi: 3.0.0
info:
  title: Profile API
  version: 1.0.0
paths:
  /hello:
    get:
      summary: Say hello
      operationId: hello
      parameters:
        - name: user
          in: query
          description: User name to appear in greetings
          required: false
          schema:
            type: string
            default: 'world'
      responses:
        '200':
          description: Greeting
          content:
            'text/plain':
               schema:
                 type: "string"
      x-yc-apigateway-integration:
        type: dummy
        http_code: 200
        http_headers:
          'Content-Type': "text/plain"
        content:
          'text/plain': "Hello, {user}!\n"
# paths:
#   /{proxy+}:
#     x-yc-apigateway-any-method:
#       x-yc-apigateway-integration:
#         type: serverless_containers
#         container_id: bbath3r4jsuho1nlqghh
#       parameters:
#       - explode: false
#         in: path
#         name: proxy
#         required: false
#         schema:
#           default: '-'
#           type: string
#         style: simple
EOT
}
