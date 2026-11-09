# 🐧 Linux & Shell Interview Preparation

## Basics

### ❓ What is Linux, and why do developers need it?

Linux is an open-source operating system that runs most servers, containers and cloud machines. Even if you code on Windows or a Mac, your application almost certainly runs on Linux in production.

- Docker containers, Kubernetes nodes and most AWS EC2 instances run Linux.
- You need it to read logs, check processes, fix permissions and debug a server over SSH.

**Example:** your Spring Boot app is slow in production — you SSH into the server and use `top` and `tail -f app.log` to see what is happening.

#### ↳ Follow-up: What is the difference between Linux and Unix?

↪ Unix is the original 1970s operating system family; Linux is a free Unix-like kernel written from scratch in 1991. They share commands and ideas, so most skills transfer.

---

### ❓ What is the Linux file system structure?

Everything starts from one root directory `/`; there are no drive letters like `C:`. Each top-level folder has a job.

| Folder | What lives there |
|---|---|
| `/home` | Users' personal files (`/home/priya`) |
| `/etc` | Configuration files (`/etc/nginx/nginx.conf`) |
| `/var` | Data that changes: logs in `/var/log` |
| `/tmp` | Temporary files, often cleared on reboot |
| `/usr/bin`, `/bin` | Programs and commands |
| `/opt` | Optional, third-party software |
| `/proc` | Live information about running processes |

**Example:** app won't start? Check its config in `/etc/myapp/` and its logs in `/var/log/myapp/`.

---

### ❓ What are the most used Linux commands?

| Task | Command |
|---|---|
| Where am I / list files | `pwd`, `ls -la` |
| Move around | `cd /var/log`, `cd ..`, `cd ~` |
| Create / copy / move / delete | `mkdir -p a/b`, `cp -r src dst`, `mv old new`, `rm -rf dir` |
| Read a file | `cat`, `less`, `head -n 20`, `tail -n 50` |
| Follow a log live | `tail -f app.log` |
| Search inside files | `grep -rn "ERROR" /var/log/myapp` |
| Find files | `find / -name "*.log" -mtime -1` |
| Disk usage | `df -h` (disks), `du -sh *` (folders) |
| Who uses the port | `ss -tulpn` or `lsof -i :8080` |

Careful with `rm -rf` — there is no recycle bin.

---

## Permissions & Users

### ❓ How do file permissions work in Linux?

Every file has an owner, a group, and three sets of permissions — for the **user** (owner), the **group**, and **others**. Each set can allow **r**ead, **w**rite and e**x**ecute.

```text
-rwxr-x---  1 app  devs  2048  deploy.sh
 │  │  │
 │  │  └── others: no access
 │  └───── group (devs): read + execute
 └──────── owner (app): read + write + execute
```

As numbers: r = 4, w = 2, x = 1, added per set. `750` = rwx for owner, r-x for group, nothing for others.

```bash
chmod 750 deploy.sh        # set permissions
chmod +x deploy.sh         # make it executable
chown app:devs deploy.sh   # change owner and group
```

#### ↳ Follow-up: Why is `chmod 777` a bad idea?

↪ It lets every user on the machine read, change and run the file. Give only the access needed — usually `644` for files and `755` for folders and scripts.

---

### ❓ What is sudo and the root user?

**root** is the all-powerful admin account. **sudo** runs a single command as root, so you don't stay logged in as root.

- `sudo systemctl restart nginx` — restart a service.
- Who may use sudo is set in `/etc/sudoers` (edit with `visudo`).
- Best practice: no direct root login over SSH; give people sudo only for what they need.

---

## Processes & Services

### ❓ How do you find and stop a process?

A process is a running program with an ID (PID).

```bash
ps aux | grep java          # find the Java process and its PID
top                         # live CPU and memory per process (htop is friendlier)
kill 12345                  # ask PID 12345 to stop (SIGTERM)
kill -9 12345               # force stop (SIGKILL) — last resort
pkill -f myapp.jar          # stop by name
```

Always try plain `kill` first: SIGTERM lets the app close connections and finish work; `-9` stops it instantly and can leave files or transactions half-done.

---

### ❓ What is systemd and how do you manage a service?

systemd starts programs at boot, restarts them if they crash, and collects their logs. A program it manages is a **service** (unit).

```bash
sudo systemctl start myapp       # start
sudo systemctl stop myapp        # stop
sudo systemctl restart myapp     # restart after a config change
sudo systemctl enable myapp      # start automatically at boot
systemctl status myapp           # is it running? last log lines
journalctl -u myapp -f           # follow its logs
```

**Example unit file** `/etc/systemd/system/myapp.service`:

```ini
[Unit]
Description=My Spring Boot app
After=network.target

[Service]
User=app
ExecStart=/usr/bin/java -jar /opt/myapp/app.jar
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

---

### ❓ What is the difference between a process and a thread in Linux?

A **process** has its own memory; a **thread** runs inside a process and shares its memory with the other threads. Processes are isolated and safer; threads are lighter and share data easily but need locking.

**Example:** one JVM is one process with many threads — one per request in Tomcat. `top -H -p <pid>` shows the threads of a process.

---

## Shell Scripting & Pipes

### ❓ What are pipes and redirection?

A **pipe** `|` sends one command's output into the next command. **Redirection** sends output to a file.

```bash
grep "ERROR" app.log | wc -l                 # count error lines
cat access.log | awk '{print $1}' | sort | uniq -c | sort -rn | head   # top client IPs
java -jar app.jar > out.log 2>&1             # stdout and stderr to a file
echo "done" >> run.log                       # append instead of overwrite
```

`>` overwrites, `>>` appends, `2>&1` sends errors to the same place as normal output.

---

### ❓ How do you write a simple shell script?

A shell script is a text file of commands run in order. Start with a shebang line, make it executable, and stop on errors.

```bash
#!/usr/bin/env bash
set -euo pipefail            # stop on errors, unset variables and failed pipes

APP_DIR=/opt/myapp
LOG="$APP_DIR/deploy.log"

echo "Deploying at $(date)" >> "$LOG"
if [ ! -f "$APP_DIR/app.jar" ]; then
  echo "app.jar missing" >&2
  exit 1
fi
for svc in myapp worker; do
  sudo systemctl restart "$svc"
done
```

Run it with `chmod +x deploy.sh && ./deploy.sh`. Always quote variables (`"$LOG"`) so paths with spaces don't break.

---

### ❓ What are grep, sed and awk used for?

Three text tools for logs and files:

- **grep** finds lines: `grep -i "timeout" app.log`
- **sed** edits text in a stream: `sed 's/localhost/db.prod/g' app.conf`
- **awk** works with columns: `awk '{print $9}' access.log | sort | uniq -c` counts HTTP status codes

**Example:** `grep " 500 " access.log | awk '{print $7}' | sort | uniq -c | sort -rn | head` — which URLs return the most server errors.

---

### ❓ What are environment variables?

Named values the shell passes to programs, used for configuration and secrets so they aren't hard-coded.

```bash
export SPRING_PROFILES_ACTIVE=prod   # set for this shell and its children
echo $PATH                           # where the shell looks for commands
env | grep JAVA                      # list variables
```

Put permanent ones in `~/.bashrc` (one user) or the service's systemd file (`Environment=...`). Never commit secrets in scripts — use a secrets manager or the platform's secret store.

---

## Troubleshooting

### ❓ A server is slow. What do you check first?

Check the four resources, then the app:

1. **CPU:** `top` / `htop` — which process is busy? Load average above the CPU count means a queue.
2. **Memory:** `free -h` — is swap in use? `dmesg | grep -i oom` shows processes killed for lack of memory.
3. **Disk:** `df -h` (full disk breaks writes and logs), `iostat -x 1` (slow disk).
4. **Network:** `ss -s` (connection counts), `ping` / `curl -w "%{time_total}"` (latency).
5. **The app:** its logs (`journalctl -u myapp`), thread dump for Java (`jstack <pid>`).

**Example:** disk at 100% because logs weren't rotated → app can't write → requests fail. Fix: free space, then set up `logrotate`.

#### ↳ Follow-up: What does load average mean?

↪ The average number of processes running or waiting for CPU (or disk) over 1, 5 and 15 minutes. On a 4-core machine, a load of 4 means fully busy; 8 means work is queuing.

---

### ❓ How do you check which process is using a port?

```bash
sudo ss -tulpn | grep :8080      # modern
sudo lsof -i :8080               # alternative
```

Common when an app fails with "Address already in use": an old instance is still running. Stop it gracefully, or change the port.

---

### ❓ How do you connect to a server securely and copy files?

Use **SSH** with a key pair instead of a password.

```bash
ssh-keygen -t ed25519                     # create a key pair once
ssh-copy-id app@10.0.1.5                  # install your public key on the server
ssh app@10.0.1.5                          # log in
scp app.jar app@10.0.1.5:/opt/myapp/      # copy a file
rsync -avz ./dist/ app@10.0.1.5:/var/www/ # sync a folder (only changes)
```

Keep the private key secret (permission `600`); disable password login on servers.
