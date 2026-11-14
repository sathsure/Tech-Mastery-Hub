# Terraform & IaC — Quick Traps

> Tricky spots interviewers love: what goes wrong, a tiny example, and the right answer.

### 1. Local state in a team
- ❌ `terraform.tfstate` on one laptop (or committed to Git).
- ✅ Remote backend with locking (S3, Terraform Cloud).

### 2. Secrets in state
- ❌ Thinking `sensitive = true` hides values from the state file.
- ✅ It only hides them in output. State still has them — encrypt and restrict it.

### 3. `count` index shifting
- ❌ `count` over `["a", "b", "c"]`, remove `"a"` → `b` and `c` get destroyed and recreated.
- ✅ Use `for_each` with keys.

### 4. Applying without reading the plan
- ❌ `terraform apply -auto-approve` straight to prod.
- ✅ Review `plan`; in CI apply the saved plan file.

### 5. Editing state by hand
- ❌ Opening the state JSON to fix something.
- ✅ Use `terraform state mv`, `rm`, `import`, or `moved` blocks.

### 6. Unpinned versions
- ❌ No provider version → a new release breaks your plan.
- ✅ Pin versions and commit `.terraform.lock.hcl`.

### 7. Manual changes in the console
- ❌ "Quick fix" in the AWS console.
- ✅ Next apply reverts it (drift). Change the code instead.

### 8. One giant state for everything
- ❌ Network, database and apps in one state → slow plans, big blast radius.
- ✅ Split into smaller states per component/environment.

### 9. Renaming a resource
- ❌ Renaming `aws_s3_bucket.logs` to `.app_logs` → destroy + create (data loss!).
- ✅ Add a `moved` block or run `terraform state mv`.
