# AWS — Cheat Sheet

> **In one line:** Amazon's cloud — rent servers, storage, databases and many ready-made services, and pay for what you use.

## Global setup
- **Region** — a geographic area (e.g. Mumbai `ap-south-1`).
- **Availability Zone (AZ)** — a separate data centre inside a region. Use 2+ AZs to survive one failing.
- **Edge location** — CDN points close to users (CloudFront).
- **Shared responsibility** — AWS secures the hardware and data centres; you secure your data, users and settings.

## Compute
- **EC2** — virtual servers. Full control.
- **Lambda** — run a function on demand, pay per call (max 15 minutes). No servers to manage.
- **ECS / Fargate** — run Docker containers (Fargate = no servers to manage).
- **EKS** — managed Kubernetes.
- **Auto Scaling Group** — adds/removes EC2 servers with load.
- **Load balancer** — **ALB** (HTTP, routes by path/host) or **NLB** (TCP, very fast).
- EC2 pricing: **On-Demand** (flexible), **Reserved/Savings Plans** (commit 1–3 years, cheaper), **Spot** (very cheap, can be taken away).

## Storage
- **S3** — store files (objects); extremely durable. Classes from Standard down to **Glacier** (cheap archive).
- **EBS** — a disk attached to one EC2.
- **EFS** — a shared file system for many EC2s.

## Databases
- **RDS** — managed MySQL/Postgres/etc. **Multi-AZ** = automatic failover; **read replicas** = more read capacity.
- **Aurora** — AWS's faster MySQL/Postgres-compatible database.
- **DynamoDB** — serverless NoSQL key-value store; very fast at any scale.
- **ElastiCache** — managed Redis/Memcached.
- **Redshift** — data warehouse. **Athena** — SQL over files in S3.

## Networking
- **VPC** — your private network in AWS.
- **Public subnet** — reachable from the internet (via an Internet Gateway).
- **Private subnet** — not reachable from outside; goes out through a **NAT Gateway**.
- **Security Group** — firewall on a server (allow rules; return traffic allowed automatically).
- **NACL** — firewall on a subnet (allow and deny; checks both directions).
- **Route 53** — DNS. **CloudFront** — CDN. **API Gateway** — managed APIs.

## Security
- **IAM** — users, groups, **roles** and **policies** (JSON permissions).
- Give apps **roles**, not access keys. Least privilege. MFA. Don't use the root account.
- An explicit **Deny** always wins.
- **KMS** (encryption keys), **Secrets Manager** (passwords), **Cognito** (user login), **WAF** (web attack filter).

## Messaging
- **SQS** — a queue. Standard (fast, may repeat/reorder) or FIFO (ordered).
- **SNS** — publish to many subscribers.
- **EventBridge** — event bus with routing rules. **Kinesis** — real-time streams.

## Monitoring
- **CloudWatch** — metrics, logs and alarms.
- **CloudTrail** — who did what in your account (audit).
- **X-Ray** — request tracing.

## A classic 3-tier setup
```
Route 53 → CloudFront → ALB (public subnets)
  → EC2/ECS in an Auto Scaling Group (private subnets, 2 AZs)
  → RDS Multi-AZ + ElastiCache (private)     files → S3
```

## Well-Architected pillars
Operational excellence · Security · Reliability · Performance · Cost · Sustainability.
