# Terraform & IaC — Explain Like I'm 5

> Hard ideas as everyday pictures, then what they really mean.

## Infrastructure as Code
📐 A house blueprint: give it to any builder and you get the same house every time.
**Really:** describe servers and networks in code so they're built the same way every time.

## Declarative
🍽️ Telling the waiter *what* you want ("a pizza"), not how to make it.
**Really:** you describe the end state; Terraform works out the steps.

## Plan vs apply
🛍️ Plan: looking at your shopping list and the total before paying. Apply: paying.
**Really:** preview the changes, then make them.

## State file
📋 The builder's checklist of what's already built, so they don't build a second kitchen.
**Really:** Terraform's record of which real resources match your code.

## Drift
🛋️ Someone moved the furniture without telling the designer — the plan no longer matches the room.
**Really:** real infrastructure was changed outside Terraform.

## Module
🧩 A ready-made LEGO set you reuse in many models.
**Really:** a reusable group of Terraform code.
