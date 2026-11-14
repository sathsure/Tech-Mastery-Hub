# Linux & Shell — Comparisons

> The classic "X vs Y" questions, side by side.

## Hard link vs soft link
| | Hard link | Soft link |
|---|---|---|
| Points to | the file data (inode) | a path |
| Survives deleting the original | ✅ | ❌ |
| Across file systems / to folders | ❌ | ✅ |

## `kill -15` vs `kill -9`
| | SIGTERM (15) | SIGKILL (9) |
|---|---|---|
| Can be caught | ✅ | ❌ |
| Cleanup runs | ✅ | ❌ |

## Process vs thread
| | Process | Thread |
|---|---|---|
| Memory | own | shared with its process |
| Cost to create | higher | lower |

## `>` vs `>>` vs `|`
| | Does |
|---|---|
| `>` | write output to a file (overwrite) |
| `>>` | append output to a file |
| `\|` | send output to another command |

## `df` vs `du`
| | `df -h` | `du -sh` |
|---|---|---|
| Shows | free space per disk | size of files/folders |

## `apt` vs `yum`/`dnf`
| | `apt` | `yum` / `dnf` |
|---|---|---|
| Distros | Debian, Ubuntu | RHEL, CentOS, Fedora |

## `grep` vs `find`
| | `grep` | `find` |
|---|---|---|
| Searches | text inside files | file names/attributes |

## `scp` vs `rsync`
| | `scp` | `rsync` |
|---|---|---|
| Copies only changes | ❌ | ✅ |
| Resume | ❌ | ✅ |

## Soft vs hard ulimits
| | Soft | Hard |
|---|---|---|
| User can raise to | the hard limit | — (root only) |
