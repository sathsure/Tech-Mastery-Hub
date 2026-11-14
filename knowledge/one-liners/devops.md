# DevOps (CI/CD, Docker, Kubernetes) — One-liners

> The most asked questions, each answered in one sentence.

1. **What is CI?** — Automatically building and testing every change pushed to the repository.
2. **Continuous delivery vs deployment?** — Delivery keeps every change ready to release; deployment releases it automatically.
3. **What are DORA metrics?** — Deployment frequency, lead time for changes, change failure rate and time to restore.
4. **Image vs container?** — An image is a packaged template; a container is a running instance of it.
5. **Container vs VM?** — Containers share the host kernel and are light; VMs run a full OS each.
6. **What is a multi-stage Docker build?** — Building in one stage and copying only the result into a small final image.
7. **`CMD` vs `ENTRYPOINT`?** — `ENTRYPOINT` is the fixed command; `CMD` gives default arguments that are easy to override.
8. **What is a Docker volume?** — Storage that keeps data after a container is removed.
9. **What is a Pod?** — The smallest Kubernetes unit: one or more containers sharing network and storage.
10. **What is a Deployment?** — A Kubernetes object that keeps a set number of pods running and handles rolling updates.
11. **What is a Service in Kubernetes?** — A stable name and IP that routes traffic to a set of pods.
12. **What is an Ingress?** — HTTP routing from outside the cluster to services by host or path.
13. **ConfigMap vs Secret?** — A ConfigMap holds settings; a Secret holds sensitive values (base64, should also be encrypted).
14. **Liveness vs readiness probe?** — Liveness restarts a stuck container; readiness controls whether it receives traffic.
15. **Requests vs limits?** — Requests are what a pod is guaranteed; limits are the maximum it may use.
16. **What is an HPA?** — The Horizontal Pod Autoscaler, which adds or removes pods based on load.
17. **What is a StatefulSet?** — A controller for pods that need stable names and storage, like databases.
18. **Blue-green vs canary?** — Blue-green switches all traffic between two environments; canary sends a small share to the new version first.
19. **What is Helm?** — A package manager and templating tool for Kubernetes manifests.
20. **What is GitOps?** — Using Git as the source of truth for what runs in the cluster, synced by tools like ArgoCD.
21. **What does `CrashLoopBackOff` mean?** — The container keeps crashing and Kubernetes waits longer between restarts.
