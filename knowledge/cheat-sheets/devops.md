# DevOps (CI/CD, Docker, Kubernetes) — Cheat Sheet

> **In one line:** automate building, testing and releasing software so small changes reach users often and safely.

## CI/CD
- **CI (Continuous Integration)** — every push is built and tested automatically.
- **Continuous Delivery** — every change is *ready* to release with one click.
- **Continuous Deployment** — every passing change goes live automatically.
- **DORA metrics** — how often you deploy, how fast changes reach prod, how often releases fail, how fast you recover.

## A typical pipeline
`code push → build → unit tests → code & security scans → build Docker image → push to registry → deploy to staging → integration tests → approve → deploy to prod → monitor`
- Tools: GitHub Actions, GitLab CI, Jenkins, Azure DevOps, ArgoCD.

```yaml
# GitHub Actions
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: ./mvnw -B verify
```

## Docker
- **Image** — a packaged app + everything it needs (read-only).
- **Container** — a running image.
- **Registry** — where images are stored (Docker Hub, AWS ECR).
- **Container vs VM** — containers share the host's OS kernel (light, start in seconds); VMs each have a full OS (heavy).

```dockerfile
# Multi-stage build: build with Maven, run on a small Java image
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn -q dependency:go-offline        # cached until pom.xml changes
COPY src ./src
RUN mvn -q package -DskipTests

FROM eclipse-temurin:21-jre-alpine
COPY --from=build /app/target/app.jar /app.jar
USER 1000
ENTRYPOINT ["java", "-jar", "/app.jar"]
```
- `CMD` — default command (easy to override). `ENTRYPOINT` — the main command.
- **Volumes** keep data after the container stops. **docker compose** runs several containers together locally.
- Good habits: small base images, multi-stage builds, don't run as root, scan images.

## Kubernetes (K8s)
Runs and manages containers across many machines.
- **Pod** — the smallest unit: one or more containers.
- **Deployment** — keeps N copies of a pod running; rolling updates and rollback.
- **Service** — a stable name/IP to reach pods (ClusterIP inside, LoadBalancer outside).
- **Ingress** — routes outside HTTP traffic to services by host/path.
- **ConfigMap / Secret** — settings / passwords given to pods.
- **StatefulSet** — for databases (stable names and storage).
- **HPA** — adds or removes pods based on load.
- **Namespace** — separates teams or environments.
- **Probes** — *liveness* (restart if stuck), *readiness* (send traffic only when ready).
- **Requests / limits** — guaranteed / maximum CPU and memory.
- **Helm** — templates/packages for Kubernetes files.

```bash
kubectl get pods
kubectl describe pod api-7d9f    # why is it failing?
kubectl logs -f api-7d9f
```

## Release strategies
- **Rolling** — replace pods a few at a time.
- **Blue-green** — two full environments; switch traffic at once (instant rollback).
- **Canary** — send 5% of users to the new version first.
- **Feature flags** — ship code turned off, switch it on later.

## GitOps
Git holds the desired state of the cluster; ArgoCD/Flux keep the cluster matching it.

## Secrets
Never in code or images — use a vault or the cloud's secrets manager.
