# Terraform & IaC — Cheat Sheet

> **In one line:** describe your cloud setup in code files; Terraform works out what to create, change or delete to match them.

## Why Infrastructure as Code (IaC)?
- Same setup every time (dev = test = prod).
- Changes are reviewed like code and kept in Git history.
- No manual clicking in the console; quick rebuild after a disaster.
- **Declarative** — you say *what* you want; Terraform figures out *how*.
- Terraform (any cloud) vs CloudFormation (AWS only) vs Ansible (mainly configures servers).

## Building blocks
```hcl
provider "aws" { region = "ap-south-1" }

variable "env" { type = string }

resource "aws_s3_bucket" "logs" {
  bucket = "${var.env}-app-logs"
}

output "bucket_name" { value = aws_s3_bucket.logs.bucket }
```
- **Provider** — plugin that talks to a cloud (AWS, Azure, GCP).
- **Resource** — something to create (a bucket, a server).
- **Data source** — read something that already exists.
- **Variable** — an input. **Output** — a value to show or pass on. **Locals** — helper values.
- **Module** — a reusable folder of Terraform code.

## The workflow
1. `terraform init` — download providers, connect to the state backend.
2. `terraform plan` — show what will change (review this!).
3. `terraform apply` — make the changes.
4. `terraform destroy` — delete everything it manages.

## State
- The **state file** records which real resources belong to which code.
- Keep it **remote** (S3, Terraform Cloud) so the team shares one copy.
- **Locking** stops two people applying at the same time.
- It can contain secrets → encrypt it and limit access.
- Useful commands: `state list`, `state mv` (rename), `import` (adopt an existing resource).

## Drift
Someone changed the cloud by hand. `terraform plan` shows the difference; apply to fix it, or update the code to match.

## Environments
- Separate folders (and separate state) for dev / staging / prod — most common.
- Or **workspaces**: same code, separate state.

## Handy features
- `count` — make N copies. `for_each` — one copy per item in a map/set (safer when the list changes).
- `lifecycle { prevent_destroy = true }` — protect important resources.
- `depends_on` — force an order.

## In CI/CD
Pull request → `fmt` + `validate` + `plan` (posted for review) → merge → `apply`.
- Scan code for security issues (tfsec, Checkov).
