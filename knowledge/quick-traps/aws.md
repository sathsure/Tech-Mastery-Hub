# AWS — Quick Traps

> Tricky spots interviewers love: what goes wrong, a tiny example, and the right answer.

### 1. Multi-AZ vs read replicas
- ❌ "Multi-AZ makes reads faster."
- ✅ Multi-AZ = standby for failover (availability). Read replicas = more read capacity.

### 2. Security Group vs NACL
- ❌ Adding an outbound rule for responses in a Security Group.
- ✅ Security Groups are stateful (replies allowed). NACLs are stateless (need both directions) and support deny.

### 3. Access keys in code
- ❌ `AWS_SECRET_ACCESS_KEY` in the app config or Git.
- ✅ Use IAM roles for EC2/Lambda/ECS.

### 4. Public S3 buckets
- ❌ Making a bucket public to share one file.
- ✅ Keep "Block Public Access" on; share with pre-signed URLs or CloudFront.

### 5. Lambda for long jobs
- ❌ A 1-hour batch job on Lambda.
- ✅ Lambda stops at 15 minutes. Use ECS/Fargate, Batch or Step Functions.

### 6. Spot for critical servers
- ❌ Running the only database on Spot.
- ✅ Spot can be taken back with 2 minutes' notice. Use it for stateless or batch work.

### 7. One AZ
- ❌ All servers in one Availability Zone.
- ✅ Spread across at least two.

### 8. Hidden costs
- ❌ Forgetting NAT Gateway and data-transfer-out charges.
- ✅ Use VPC endpoints for S3/DynamoDB; watch Cost Explorer.

### 9. SQS Standard order
- ❌ Expecting strict order and no duplicates.
- ✅ Standard may reorder and repeat. Use FIFO if order matters; make consumers idempotent anyway.

### 10. Explicit deny
- ❌ "I added an Allow, why is it still denied?"
- ✅ Any explicit Deny (policy, SCP, bucket policy) wins over Allow.
