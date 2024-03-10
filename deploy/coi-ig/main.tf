resource "yandex_iam_service_account" "ig-sa" {
  name        = "ig-sa"
  description = "Сервисный аккаунт для управления группой ВМ."
}

resource "yandex_resourcemanager_folder_iam_member" "vm-autoscale-sa-role-image-puller" {
  folder_id = var.folder_id
  role      = "container-registry.images.puller"
  member    = "serviceAccount:${yandex_iam_service_account.ig-sa.id}"
}

resource "yandex_resourcemanager_folder_iam_member" "vm-autoscale-sa-role-compute" {
  folder_id = var.folder_id
  role      = "editor"
  member    = "serviceAccount:${yandex_iam_service_account.ig-sa.id}"
  depends_on = [
    yandex_iam_service_account.ig-sa,
  ]
}

resource "yandex_vpc_network" "vm-autoscale-network" {
  name = "vm-autoscale-network"
}

resource "yandex_vpc_subnet" "vm-autoscale-subnet-a" {
  name           = "vm-autoscale-subnet-a"
  zone           = "ru-central1-a"
  v4_cidr_blocks = ["192.168.1.0/24"]
  network_id     = yandex_vpc_network.vm-autoscale-network.id
}

resource "yandex_vpc_subnet" "vm-autoscale-subnet-b" {
  name           = "vm-autoscale-subnet-b"
  zone           = "ru-central1-b"
  v4_cidr_blocks = ["192.168.2.0/24"]
  network_id     = yandex_vpc_network.vm-autoscale-network.id
}

resource "yandex_vpc_security_group" "sg-1" {
  name       = "sg-autoscale"
  network_id = yandex_vpc_network.vm-autoscale-network.id
  egress {
    protocol       = "ANY"
    description    = "any"
    v4_cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    protocol       = "TCP"
    description    = "ssh"
    v4_cidr_blocks = ["0.0.0.0/0"]
    port           = 22
  }
  ingress {
    protocol       = "TCP"
    description    = "ext-http"
    v4_cidr_blocks = ["0.0.0.0/0"]
    port           = 3000
  }
  ingress {
    protocol          = "TCP"
    description       = "healthchecks"
    predefined_target = "loadbalancer_healthchecks"
    port              = 3000
  }
}

data "yandex_compute_image" "container-optimized-image" {
  family = "container-optimized-image"
}

resource "yandex_compute_instance_group" "ig-with-coi" {
  service_account_id  = yandex_iam_service_account.ig-sa.id
  deletion_protection = true
  instance_template {
    service_account_id = yandex_iam_service_account.ig-sa.id
    platform_id        = "standard-v3"
    resources {
      memory = 2
      cores  = 2
    }
    boot_disk {
      mode = "READ_WRITE"
      initialize_params {
        image_id = data.yandex_compute_image.container-optimized-image.id
      }
    }
    network_interface {
      network_id = yandex_vpc_network.vm-autoscale-network.id
      subnet_ids = [
        yandex_vpc_subnet.vm-autoscale-subnet-a.id,
        yandex_vpc_subnet.vm-autoscale-subnet-b.id
      ]
      security_group_ids = [yandex_vpc_security_group.sg-1.id]
      nat                = true
    }
    metadata = {
      docker-container-declaration = templatefile("${path.module}/declaration.yaml", { image_url = var.image_url })
      user-data                    = templatefile("${path.module}/cloud_config.yaml", { user = var.vm_user, ssh_key = var.ssh_key })
    }
  }
  scale_policy {
    fixed_scale {
      size = 1
    }
  }
  allocation_policy {
    zones = [
      "ru-central1-a",
      "ru-central1-b"
    ]
  }
  deploy_policy {
    max_unavailable = 1
    max_creating    = 1
    max_expansion   = 1
    max_deleting    = 1
  }
  load_balancer {
    target_group_name        = "auto-group-tg"
    target_group_description = "load balancer target group"
  }

  depends_on = [yandex_resourcemanager_folder_iam_member.vm-autoscale-sa-role-compute]
}

resource "yandex_lb_network_load_balancer" "balancer" {
  name = "group-balancer"

  listener {
    name        = "http"
    port        = 80
    target_port = 3000
  }

  attached_target_group {
    target_group_id = yandex_compute_instance_group.ig-with-coi.load_balancer[0].target_group_id
    healthcheck {
      name = "http"
      tcp_options {
        port = 3000
      }
    }
  }
}
