# Terraform & IaC — Code Snippets

> Code interviewers ask you to write or explain.

### 1. Remote state with locking
```hcl
terraform {
  required_version = ">= 1.6"
  required_providers {
    aws = { source = "hashicorp/aws", version = "~> 5.0" }
  }
  backend "s3" {
    bucket       = "acme-tf-state"
    key          = "prod/network/terraform.tfstate"
    region       = "ap-south-1"
    encrypt      = true
    use_lockfile = true          # S3-native locking (older setups: dynamodb_table)
  }
}
```

### 2. Variables with validation
```hcl
variable "env" {
  type = string
  validation {
    condition     = contains(["dev", "staging", "prod"], var.env)
    error_message = "env must be dev, staging or prod."
  }
}
locals {
  tags = { env = var.env, team = "payments", managed_by = "terraform" }
}
```

### 3. `for_each` over a map
```hcl
variable "buckets" {
  default = { logs = "private", assets = "public-read" }
}
resource "aws_s3_bucket" "this" {
  for_each = var.buckets
  bucket   = "${var.env}-${each.key}"
  tags     = local.tags
}
```

### 4. A reusable module
```hcl
# modules/web-sg/main.tf
variable "vpc_id" { type = string }
resource "aws_security_group" "web" {
  vpc_id = var.vpc_id
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
output "id" { value = aws_security_group.web.id }

# root module
module "web_sg" {
  source = "./modules/web-sg"
  vpc_id = aws_vpc.main.id
}
```

### 5. Protect and refactor safely
```hcl
resource "aws_db_instance" "main" {
  # ...
  lifecycle { prevent_destroy = true }
}

moved {                                   # rename without destroy + recreate
  from = aws_s3_bucket.logs
  to   = aws_s3_bucket.app_logs
}

import {                                  # adopt an existing resource
  to = aws_s3_bucket.legacy
  id = "old-bucket-name"
}
```

### 6. Everyday commands
```bash
terraform fmt -recursive && terraform validate
terraform plan -out=tfplan -var-file=prod.tfvars
terraform apply tfplan
terraform state list
terraform plan -refresh-only          # see drift without changing anything
```
