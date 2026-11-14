# DevOps (CI/CD, Docker, Kubernetes) — Quick Traps

> Tricky spots interviewers love: what goes wrong, a tiny example, and the right answer.

### 1. `latest` tag in production
- ❌ `image: myapp:latest` → you can't tell what's running or roll back cleanly.
- ✅ Tag with the version or git commit (`myapp:3f9a2c1`).

### 2. Continuous Delivery vs Deployment
- ❌ Using them as the same thing.
- ✅ Delivery = always *ready* to release (a person clicks). Deployment = released automatically.

### 3. Copying everything first in the Dockerfile
- ❌ `COPY . .` then `RUN mvn package` → every code change re-downloads all dependencies.
- ✅ Copy the dependency file first, install, then copy the source (layer caching).

### 4. Secrets in images
- ❌ `ENV DB_PASSWORD=secret` in the Dockerfile.
- ✅ Anyone with the image can read it. Pass secrets at runtime from a secrets store.

### 5. Running as root
- ❌ Containers running as root by default.
- ✅ Add a `USER` to the Dockerfile.

### 6. Liveness probe checks the database
- ❌ The DB has a blip → every pod restarts.
- ✅ Liveness = "is this process alive?". Put dependency checks in readiness.

### 7. No resource limits
- ❌ One pod eats all node memory.
- ✅ Set requests and limits. Over the memory limit → the pod is `OOMKilled`.

### 8. `CrashLoopBackOff` panic
- ❌ Not knowing where to look.
- ✅ `kubectl logs <pod> --previous` and `kubectl describe pod` (events, exit code).

### 9. Kubernetes Secrets are encrypted
- ❌ Assuming they're safe as-is.
- ✅ They're only base64 by default. Turn on encryption at rest and restrict access.

### 10. Containers persist data
- ❌ Saving uploads inside the container.
- ✅ The data is lost when it restarts. Use volumes or object storage (S3).
