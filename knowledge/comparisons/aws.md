# AWS — Comparisons

> The classic "X vs Y" questions, side by side.

## EC2 vs Lambda vs ECS/Fargate
| | EC2 | Lambda | ECS / Fargate |
|---|---|---|---|
| You manage | the server | only code | containers |
| Max run time | unlimited | 15 min | unlimited |
| Billing | per second running | per request + duration | per task resources |
| Best for | full control | events, spiky load | containerized services |

## S3 vs EBS vs EFS
| | S3 | EBS | EFS |
|---|---|---|---|
| Type | objects | block disk | shared file system |
| Attach to | anything (HTTP) | one EC2 (one AZ) | many EC2s |

## RDS vs Aurora vs DynamoDB
| | RDS | Aurora | DynamoDB |
|---|---|---|---|
| Type | relational | relational (AWS-built) | NoSQL key-value |
| Scaling | vertical + replicas | faster replicas, auto storage | automatic |
| Joins / SQL | ✅ | ✅ | ❌ |

## Multi-AZ vs read replica
| | Multi-AZ | Read replica |
|---|---|---|
| Purpose | failover | read scaling |
| Serves reads | ❌ (standby) | ✅ |

## Security Group vs NACL
| | Security Group | NACL |
|---|---|---|
| Level | instance | subnet |
| Stateful | ✅ | ❌ |
| Deny rules | ❌ | ✅ |

## ALB vs NLB
| | ALB | NLB |
|---|---|---|
| Layer | 7 (HTTP) | 4 (TCP/UDP) |
| Path/host routing | ✅ | ❌ |
| Static IP | ❌ | ✅ |

## SQS vs SNS vs EventBridge vs Kinesis
| | Model | Use for |
|---|---|---|
| SQS | queue | background jobs |
| SNS | pub/sub push | fan-out notifications |
| EventBridge | event bus with rules | routing events between services |
| Kinesis | stream | real-time data, replay |

## On-Demand vs Reserved vs Spot
| | Price | Can be taken away |
|---|---|---|
| On-Demand | full | ❌ |
| Reserved / Savings Plans | lower (1–3 yr commit) | ❌ |
| Spot | lowest | ✅ |

## CloudWatch vs CloudTrail vs X-Ray
| | Answers |
|---|---|
| CloudWatch | how is it performing? (metrics, logs, alarms) |
| CloudTrail | who did what? (API audit) |
| X-Ray | where is the request slow? (tracing) |

## IAM user vs role
| | User | Role |
|---|---|---|
| Credentials | long-lived keys | temporary |
| For | people (prefer SSO) | services, apps |

## Internet Gateway vs NAT Gateway
| | Internet Gateway | NAT Gateway |
|---|---|---|
| Direction | in and out | out only |
| For | public subnets | private subnets |
