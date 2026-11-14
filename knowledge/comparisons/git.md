# Git — Comparisons

> The classic "X vs Y" questions, side by side.

## Merge vs rebase vs squash
| | Merge | Rebase | Squash |
|---|---|---|---|
| History | real, with merge commits | straight line | one commit per branch |
| Rewrites commits | ❌ | ✅ | ✅ |
| Safe on shared branches | ✅ | ❌ | at merge time |

## `fetch` vs `pull`
| | `fetch` | `pull` |
|---|---|---|
| Downloads | ✅ | ✅ |
| Changes your branch | ❌ | ✅ (merge/rebase) |

## `reset` vs `revert`
| | `reset` | `revert` |
|---|---|---|
| How | moves the branch back | adds an undo commit |
| Rewrites history | ✅ | ❌ |
| Safe after push | ❌ | ✅ |

## `reset --soft` vs `--mixed` vs `--hard`
| | Commit undone | Changes kept | Staged |
|---|---|---|---|
| `--soft` | ✅ | ✅ | ✅ |
| `--mixed` | ✅ | ✅ | ❌ |
| `--hard` | ✅ | ❌ | ❌ |

## `stash` vs `commit`
| | Stash | Commit |
|---|---|---|
| In history | ❌ | ✅ |
| Use for | quick, temporary parking | saved work |

## `checkout` vs `switch` vs `restore`
| | Does |
|---|---|
| `checkout` | old all-in-one (branches + files) |
| `switch` | change branches |
| `restore` | restore files |

## Git Flow vs GitHub Flow vs trunk-based
| | Branches | Best for |
|---|---|---|
| Git Flow | main, develop, feature, release, hotfix | versioned releases |
| GitHub Flow | main + feature branches | web apps, frequent deploys |
| Trunk-based | main + tiny branches | CI/CD, feature flags |

## `--force` vs `--force-with-lease`
| | Overwrites others' new commits |
|---|---|
| `--force` | ✅ |
| `--force-with-lease` | ❌ (refuses) |

## Git vs GitHub
| | Git | GitHub |
|---|---|---|
| Is | version control tool | hosting + PRs + CI |
