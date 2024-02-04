# resource "yandex_cm_certificate" "le-certificate" {
#   name    = "r34s0ntech"
#   domains = ["r34s0n.tech", "*.r34s0n.tech"]
#   # Prod folder
#   folder_id = module.cloud.folders[0].id

#   managed {
#     challenge_type  = "DNS_CNAME"
#     challenge_count = 1
#   }
# }

# DNS zone is occupied
# resource "yandex_dns_zone" "default-dns-zone" {
#   zone = "r34s0n.tech."
#   # Prod folder
#   folder_id = module.cloud.folders[0].id
#   public    = true
# }

# resource "yandex_dns_recordset" "cert-challenge" {
#   count   = yandex_cm_certificate.le-certificate.managed[0].challenge_count
#   zone_id = yandex_dns_zone.default-dns-zone.id
#   name    = yandex_cm_certificate.le-certificate.challenges[count.index].dns_name
#   type    = yandex_cm_certificate.le-certificate.challenges[count.index].dns_type
#   data    = [yandex_cm_certificate.le-certificate.challenges[count.index].dns_value]
#   ttl     = 60
# }
