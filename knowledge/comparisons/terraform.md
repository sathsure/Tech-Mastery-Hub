# Terraform & IaC — Comparisons

> The classic "X vs Y" questions, side by side.

## Terraform vs CloudFormation vs Pulumi vs Ansible
| | Terraform | CloudFormation | Pulumi | Ansible |
|---|---|---|---|---|
| Clouds | any | AWS only | any | any |
| Language | HCL | YAML/JSON | TS, Python, Go… | YAML |
| Main job | provisioning | provisioning | provisioning | configuring servers |
| State | state file | managed by AWS | state backend | none |

## Declarative vs imperative
| | Declarative | Imperative |
|---|---|---|
| You write | the end state | the steps |
| Example | Terraform | shell scripts |

## `count` vs `for_each`
| | `count` | `for_each` |
|---|---|---|
| Keyed by | index (0, 1, 2) | map/set key |
| Removing a middle item | shifts and recreates others | affects only that item |

## Resource vs data source
| | Resource | Data source |
|---|---|---|
| Creates things | ✅ | ❌ |
| Reads existing things | — | ✅ |

## Local vs remote state
| | Local | Remote (S3, TF Cloud) |
|---|---|---|
| Team sharing | ❌ | ✅ |
| Locking | ❌ | ✅ |

## Workspaces vs separate folders
| | Workspaces | Folders per environment |
|---|---|---|
| Code | shared | can differ |
| Clarity | lower | higher (common choice) |

## `plan` vs `apply` vs `refresh-only`
| | Changes infra | Changes state |
|---|---|---|
| `plan` | ❌ | ❌ |
| `apply` | ✅ | ✅ |
| `plan -refresh-only` + apply | ❌ | ✅ |

## Mutable vs immutable infrastructure
| | Mutable | Immutable |
|---|---|---|
| Updates | change servers in place | replace with new ones |
| Drift risk | higher | lower |
