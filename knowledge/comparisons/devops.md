# DevOps (CI/CD, Docker, Kubernetes) — Comparisons

> The classic "X vs Y" questions, side by side.

## CI vs Continuous Delivery vs Continuous Deployment
| | Automatic build + test | Ready to release | Released automatically |
|---|---|---|---|
| CI | ✅ | ❌ | ❌ |
| Continuous Delivery | ✅ | ✅ | ❌ (a person clicks) |
| Continuous Deployment | ✅ | ✅ | ✅ |

## Container vs VM
| | Container | VM |
|---|---|---|
| OS | shares host kernel | full OS each |
| Start time | seconds | minutes |
| Size | MBs | GBs |
| Isolation | good | stronger |

## `CMD` vs `ENTRYPOINT`
| | `CMD` | `ENTRYPOINT` |
|---|---|---|
| Purpose | default arguments | the main command |
| Overridden by `docker run … args` | ✅ | ❌ (args are appended) |

## `COPY` vs `ADD`
| | `COPY` | `ADD` |
|---|---|---|
| Unpacks archives, URLs | ❌ | ✅ |
| Recommended | ✅ | only when needed |

## Docker vs Kubernetes
| | Docker | Kubernetes |
|---|---|---|
| Does | builds and runs containers | runs containers across many machines |
| Scaling, self-healing | ❌ | ✅ |

## Deployment vs StatefulSet vs DaemonSet
| | Use for |
|---|---|
| Deployment | stateless apps |
| StatefulSet | databases (stable names, storage) |
| DaemonSet | one pod per node (log agents) |

## ClusterIP vs NodePort vs LoadBalancer vs Ingress
| | Reachable from |
|---|---|
| ClusterIP | inside the cluster |
| NodePort | a port on every node |
| LoadBalancer | outside, via a cloud load balancer |
| Ingress | outside, HTTP routing by host/path |

## Liveness vs readiness vs startup probe
| | If it fails |
|---|---|
| Liveness | container is restarted |
| Readiness | no traffic sent to it |
| Startup | other probes wait (slow starters) |

## Requests vs limits
| | Requests | Limits |
|---|---|---|
| Meaning | guaranteed | maximum |
| Over memory limit | — | OOMKilled |

## Rolling vs blue-green vs canary
| | How | Rollback |
|---|---|---|
| Rolling | replace pods gradually | slower |
| Blue-green | switch all traffic between two envs | instant |
| Canary | small % first | shift traffic back |

## ConfigMap vs Secret
| | ConfigMap | Secret |
|---|---|---|
| Holds | settings | passwords, keys |
| Encoding | plain | base64 (encrypt at rest!) |

## Jenkins vs GitHub Actions
| | Jenkins | GitHub Actions |
|---|---|---|
| Hosting | self-hosted | GitHub-hosted (or self) |
| Config | Jenkinsfile | YAML workflows |
