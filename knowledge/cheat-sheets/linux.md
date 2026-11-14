# Linux & Shell — Cheat Sheet

> **In one line:** most servers run Linux; you manage them by typing commands in a shell (bash).

## Important folders
- `/etc` — config files. `/var/log` — logs. `/home` — users' files.
- `/tmp` — temporary files. `/opt` — extra software. `/proc` — live system info.
- **Everything is a file** — even devices and processes show up as files.
- **Hard link** — a second name for the same file. **Soft link** (`ln -s`) — a shortcut to a path.

## Everyday commands
```bash
ls -la            # list files, with hidden ones
cd /var/log       # change folder
cp -r a b / mv a b / rm -rf dir
cat file / less file / tail -f app.log     # show / page through / follow a log
grep -rin "error" /var/log                 # search text
find / -name "*.log" -mtime -1             # find files changed in the last day
du -sh * / df -h                           # folder sizes / disk space
tar -czf backup.tgz dir                    # compress a folder
curl -I https://example.com                # call a URL, show headers
```

## Permissions
- Three groups: **user**, **group**, **others**; each gets **r**ead (4), **w**rite (2), e**x**ecute (1).
- `chmod 755 run.sh` → owner can do everything; others can read and run.
- `chmod 600 key.pem` → only the owner can read/write.
- `chown user:group file` — change the owner. `sudo` — run as admin (root).

## Processes
```bash
ps aux | grep java       # find a process
top / htop               # live CPU and memory
kill -15 PID             # ask it to stop (graceful)
kill -9 PID              # force stop
systemctl status nginx   # manage a service (start, stop, restart, enable)
journalctl -u nginx -f   # service logs
```
- **Zombie** — a finished process its parent hasn't cleaned up.

## Pipes & redirects
- `|` — send output of one command into the next.
- `>` — write to a file (overwrite). `>>` — append.
- `2>&1` — send errors to the same place as output. `/dev/null` — throw away.
```bash
grep ERROR app.log | sort | uniq -c | sort -nr    # count each distinct error
```

## Shell scripts
```bash
#!/usr/bin/env bash
set -euo pipefail          # stop on errors and unset variables
for f in *.log; do
  gzip "$f"
done
```
- `$1` — first argument. `$?` — last command's exit code (0 = success).
- **cron** — schedule jobs: `0 2 * * * /opt/backup.sh` (every day at 2 AM).

## Networking
```bash
ip a              # my IP addresses
ping host         # can I reach it?
ss -tulpn         # which ports are listening
dig example.com   # DNS lookup
curl -v url       # full request/response details
```

## A slow server — what to check
1. `uptime` — load compared with CPU count.
2. `top` — which process uses CPU or memory?
3. `free -h` — out of memory? Swapping?
4. `df -h` — disk full?
5. `iostat` / `vmstat` — disk or memory pressure.
6. Logs — `journalctl`, `/var/log`.

## Other basics
- Install software: `apt` (Ubuntu), `dnf`/`yum` (Red Hat).
- SSH: `ssh -i key.pem user@host`; keys live in `~/.ssh`.
- Environment variables: `export APP_ENV=prod`.
