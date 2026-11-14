# DevOps (CI/CD, Docker, Kubernetes) — Explain Like I'm 5

> Hard ideas as everyday pictures, then what they really mean.

## CI/CD
🏭 A car factory line: every car is built, checked by robots, and driven out automatically.
**Really:** every code change is built, tested and released by automation.

## Docker image vs container
🍰 A recipe (image) and the cake you bake from it (container). One recipe, many cakes.
**Really:** an image is a packaged template; a container is a running copy.

## Container vs VM
🏠 A VM is a separate house with its own plumbing. Containers are flats in one building sharing the plumbing.
**Really:** containers share the host OS kernel; VMs each have a full OS.

## Kubernetes
🎼 An orchestra conductor: tells each musician (container) when to play, replaces anyone who leaves.
**Really:** runs, scales and heals containers across many machines.

## Pod
🫛 A pea pod: one or more peas that always travel together.
**Really:** the smallest unit — containers sharing network and storage.

## Liveness vs readiness
🏥 Liveness: "Is the patient breathing?" Readiness: "Is the doctor ready to see patients?"
**Really:** restart if stuck vs send traffic only when ready.

## Blue-green / canary
🍲 Blue-green: cook a whole new pot and swap it in. Canary: let one guest taste the new recipe first.
**Really:** switch all traffic at once vs try the new version on a few users.
