# AWS — One-liners

> The most asked questions, each answered in one sentence.

1. **Region vs Availability Zone?** — A region is a geographic area; an AZ is a separate data centre within it.
2. **What is the shared responsibility model?** — AWS secures the cloud's infrastructure; you secure your data, access and configuration.
3. **What is EC2?** — Virtual servers you rent and control.
4. **What is Lambda?** — Functions that run on demand without managing servers, for up to 15 minutes.
5. **What is a cold start?** — The extra delay when Lambda starts a new execution environment.
6. **ECS vs EKS vs Fargate?** — ECS is AWS's container service, EKS is managed Kubernetes, Fargate runs containers without servers.
7. **ALB vs NLB?** — ALB routes HTTP by path and host; NLB handles fast TCP/UDP traffic.
8. **What is an Auto Scaling Group?** — A group of EC2 instances that grows or shrinks with demand.
9. **S3 vs EBS vs EFS?** — S3 stores objects, EBS is a disk for one instance, EFS is a shared file system.
10. **What is S3 Glacier?** — Low-cost storage for archives that are rarely read.
11. **RDS Multi-AZ vs read replica?** — Multi-AZ is a standby for failover; read replicas add read capacity.
12. **What is DynamoDB?** — A serverless NoSQL key-value database with fast, predictable performance.
13. **What is a VPC?** — Your private network inside AWS.
14. **Public vs private subnet?** — A public subnet routes to the internet gateway; a private one doesn't.
15. **What is a NAT Gateway?** — It lets private subnets reach the internet for outbound traffic only.
16. **Security Group vs NACL?** — A security group is a stateful firewall on instances; a NACL is a stateless firewall on subnets.
17. **What is IAM?** — The service that controls who can do what in AWS.
18. **Why use IAM roles?** — They give temporary credentials, so no long-lived keys are stored in apps.
19. **SQS vs SNS?** — SQS is a queue for one consumer group; SNS pushes a message to many subscribers.
20. **CloudWatch vs CloudTrail?** — CloudWatch monitors metrics and logs; CloudTrail records API calls for auditing.
21. **What is CloudFront?** — AWS's CDN for serving content from edge locations.
22. **What is Route 53?** — AWS's DNS service with routing policies like latency and failover.
