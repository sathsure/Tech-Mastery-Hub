# 🏗 Terraform & Infrastructure as Code Interview Preparation

## Basics

### ❓ What is Infrastructure as Code (IaC)?

Defining servers, networks, databases and other infrastructure in **code files** instead of clicking in a cloud console. The code lives in Git, gets reviewed like application code, and creates the same environment every time.

- **Repeatable:** dev, staging and prod built from the same code.
- **Reviewable and auditable:** every change is a pull request with history.
- **Recoverable:** rebuild an environment after a disaster.

Tools: **Terraform** / **OpenTofu**, AWS **CloudFormation** / CDK, **Pulumi**, Azure **Bicep**. Configuration tools like **Ansible** set up what runs *on* servers.

---

### ❓ What is Terraform, and how does it work?

Terraform is an IaC tool where you **declare** the infrastructure you want in HCL (HashiCorp Configuration Language). Terraform compares that with what exists and makes only the changes needed.

- **Providers** talk to platforms (AWS, Azure, GCP, Kubernetes, GitHub…).
- **Resources** are the things you create.
- **State** records what Terraform manages.

```hcl
provider "aws" {
  region = "ap-south-1"
}

resource "aws_s3_bucket" "reports" {
  bucket = "acme-reports-prod"
  tags   = { team = "data", env = "prod" }
}
```

**Declarative** means you describe the end result ("one bucket with these tags"), not the steps to get there.

---

### ❓ What is the Terraform workflow?

```bash
terraform init      # download providers and modules, connect to the state backend
terraform fmt       # format the code
terraform validate  # check syntax and references
terraform plan      # show exactly what will be created, changed or destroyed
terraform apply     # make the changes (after you confirm)
terraform destroy   # remove everything this configuration manages
```

Always read the **plan** before applying — look especially for anything marked `destroy` or `-/+` (replace).

---

## State

### ❓ What is Terraform state, and why does it matter?

The state file maps your code to real resources (resource IDs, attributes) so Terraform knows what it already created and what to change.

- **Store it remotely**, never only on a laptop: an S3 bucket with locking (S3 native lock files, or a DynamoDB table on older setups), Terraform Cloud, or Azure Blob storage.
- **Locking** stops two people from applying at the same time and corrupting state.
- State can contain **secrets** (database passwords, keys) — encrypt it and restrict access.
- Never edit it by hand; use `terraform state mv`, `terraform state rm` or `import`.

```hcl
terraform {
  backend "s3" {
    bucket       = "acme-terraform-state"
    key          = "prod/network.tfstate"
    region       = "ap-south-1"
    encrypt      = true
    use_lockfile = true
  }
}
```

---

### ❓ What is drift, and how do you handle it?

**Drift** is when real infrastructure no longer matches the code — someone changed a setting in the console, or another tool changed it.

- `terraform plan` shows drift as changes Terraform wants to make to restore the code's version.
- Fix it by either updating the code to match the intended change, or applying to reset it.
- Prevent it: limit console write access, and run scheduled plans in CI that alert on drift.

---

### ❓ How do you bring existing resources under Terraform?

Use **import**, so Terraform starts managing something that was created by hand without recreating it.

```hcl
import {
  to = aws_s3_bucket.reports
  id = "acme-reports-prod"
}
```

Run `terraform plan -generate-config-out=generated.tf` to have Terraform draft the resource code, review it, and then apply. (Older versions use the `terraform import` command.)

---

## Writing Good Terraform

### ❓ What are variables, outputs and locals?

- **Variables** — inputs that make code reusable (`var.environment`).
- **Locals** — named values computed inside the module, to avoid repetition.
- **Outputs** — values a module exposes to others or prints after apply (a load balancer DNS name, for example).

```hcl
variable "environment" {
  type    = string
  default = "dev"
}

locals {
  name_prefix = "shop-${var.environment}"
}

output "bucket_name" {
  value = aws_s3_bucket.reports.bucket
}
```

Set values per environment with `.tfvars` files: `terraform apply -var-file=prod.tfvars`.

---

### ❓ What are modules, and why use them?

A module is a reusable folder of Terraform code with inputs (variables) and outputs — like a function for infrastructure.

```hcl
module "network" {
  source     = "./modules/vpc"
  cidr_block = "10.20.0.0/16"
  azs        = ["ap-south-1a", "ap-south-1b"]
}
```

Build a standard module once (for example "VPC with public and private subnets") and every team reuses it. Pin versions of shared modules (`version = "~> 5.0"`) so updates don't surprise you.

---

### ❓ What is the difference between `count` and `for_each` in Terraform?

Both create several copies of a resource.

- **`count`** creates copies by number (`[0]`, `[1]`…). Removing an item from the middle shifts the numbers, so Terraform may destroy and recreate the wrong resources.
- **`for_each`** creates copies by key from a map or set — stable addresses like `aws_iam_user.devs["priya"]`. Prefer it for collections.

```hcl
resource "aws_iam_user" "devs" {
  for_each = toset(["priya", "arjun", "meera"])
  name     = each.key
}
```

---

### ❓ How do you manage multiple environments (dev, staging, prod)?

Common approaches:

1. **Separate folders per environment** that call the same modules with different `.tfvars` — the clearest and safest; each environment has its own state.
2. **Workspaces** — one configuration, several state files. Fine for short-lived copies, but easy to apply to the wrong one.
3. Tools like **Terragrunt** to reduce repetition across many environments.

Keep prod in a separate cloud account or subscription with stricter permissions.

---

### ❓ How do you handle secrets in Terraform?

- Don't hard-code secrets in `.tf` files or commit them in `.tfvars`.
- Read them at apply time from a secrets manager (AWS Secrets Manager, Vault) using **data sources**, or from CI secret variables.
- Mark variables and outputs `sensitive = true` so they aren't printed in plans and logs.
- Remember that state may still contain the values — encrypt it and restrict access.

---

### ❓ How do you protect important resources from being destroyed?

```hcl
resource "aws_db_instance" "orders" {
  # ...
  deletion_protection = true

  lifecycle {
    prevent_destroy = true            # Terraform refuses any plan that would delete it
    ignore_changes  = [engine_version] # changed outside Terraform on purpose
  }
}
```

Also: review every plan, run applies only from CI with approvals for prod, and keep backups.

---

## Terraform in Practice

### ❓ How do you run Terraform in a CI/CD pipeline?

1. On a pull request: `fmt -check`, `validate`, security scanning (Checkov, tfsec / Trivy), then `plan` — post the plan as a PR comment.
2. A reviewer approves the code **and** the plan.
3. On merge to main: `apply` that reviewed plan, with a manual approval step for prod.
4. The pipeline uses short-lived cloud credentials (OIDC roles), not long-lived keys.

Tools: GitHub Actions, GitLab CI, Atlantis, HCP Terraform, Spacelift.

---

### ❓ Terraform vs CloudFormation vs Pulumi vs Ansible — what's the difference?

| Tool | What it is | Best for |
|---|---|---|
| **Terraform / OpenTofu** | Declarative HCL, any cloud through providers | Multi-cloud or SaaS infrastructure, the most common choice |
| **CloudFormation / CDK** | AWS-native templates (CDK lets you use TypeScript or Python) | AWS-only teams; no state file to manage |
| **Pulumi** | IaC in general-purpose languages (TypeScript, Python, Go) | Teams that want loops, tests and types in real code |
| **Ansible** | Configuration management and automation over SSH | Installing and configuring software on servers |

**OpenTofu** is an open-source fork of Terraform, created after HashiCorp moved Terraform to the Business Source License in 2023; it is largely compatible with Terraform code.
