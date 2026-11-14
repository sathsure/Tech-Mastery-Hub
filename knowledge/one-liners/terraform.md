# Terraform & IaC — One-liners

> The most asked questions, each answered in one sentence.

1. **What is Infrastructure as Code?** — Managing servers, networks and services through code files instead of manual clicks.
2. **Declarative vs imperative?** — Declarative describes the end state; imperative lists the steps to get there.
3. **What is a provider?** — A plugin that lets Terraform talk to a platform like AWS or Azure.
4. **Resource vs data source?** — A resource is something Terraform creates; a data source reads something that already exists.
5. **What does `terraform init` do?** — Downloads providers and modules and sets up the state backend.
6. **What does `terraform plan` do?** — Shows what would change without changing anything.
7. **What does `terraform apply` do?** — Makes the real infrastructure match the code.
8. **What is the state file?** — A record mapping your code to the real resources it manages.
9. **Why use remote state?** — So the team shares one copy, with locking and encryption.
10. **What is state locking?** — Preventing two people from changing the same state at once.
11. **What is drift?** — When real infrastructure no longer matches the code, usually after manual changes.
12. **What does `terraform import` do?** — Brings an existing resource under Terraform management.
13. **What is a module?** — A reusable group of Terraform files with inputs and outputs.
14. **`count` vs `for_each`?** — `count` makes copies by index; `for_each` makes copies by key, which is safer when items change.
15. **What are workspaces?** — Separate states for the same code, often used for environments.
16. **What does `prevent_destroy` do?** — Blocks Terraform from deleting a critical resource.
17. **What is `.terraform.lock.hcl`?** — A file that pins exact provider versions.
18. **What does `sensitive = true` do?** — Hides a value in CLI output, though it is still stored in state.
19. **Terraform vs Ansible?** — Terraform provisions infrastructure; Ansible mainly configures software on servers.
20. **What is OpenTofu?** — An open-source fork of Terraform.
