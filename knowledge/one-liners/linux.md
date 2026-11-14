# Linux & Shell — One-liners

> The most asked questions, each answered in one sentence.

1. **What does `chmod 755` mean?** — The owner can read, write and execute; group and others can read and execute.
2. **Hard link vs soft link?** — A hard link is another name for the same file data; a soft link points to a path and breaks if it's deleted.
3. **What is an inode?** — The record holding a file's metadata and data location.
4. **`kill -15` vs `kill -9`?** — 15 asks the process to stop gracefully; 9 forces it immediately.
5. **What is a zombie process?** — A finished process whose parent hasn't collected its exit status.
6. **What is load average?** — The average number of processes running or waiting, over 1, 5 and 15 minutes.
7. **How do you find which process uses a port?** — `ss -tulpn` or `lsof -i :8080`.
8. **How do you follow a log?** — `tail -f app.log`.
9. **What does `grep -r` do?** — Searches text recursively in files under a folder.
10. **What do `>`, `>>` and `2>&1` do?** — Overwrite a file, append to a file, and send errors to the same place as output.
11. **What is a pipe?** — `|` sends one command's output into another's input.
12. **What is `systemctl`?** — The command to manage systemd services (start, stop, enable).
13. **What is cron?** — A scheduler for running commands at set times.
14. **How do you check disk space?** — `df -h` for disks and `du -sh` for folder sizes.
15. **How do you check memory?** — `free -h`.
16. **What is `sudo`?** — Running a command with admin (root) rights.
17. **What does `set -e` do in a script?** — Stops the script when a command fails.
18. **What is `$?`?** — The exit code of the last command (0 means success).
19. **What is SSH?** — A secure way to log in to and run commands on a remote machine.
20. **What does `/etc/hosts` do?** — Maps hostnames to IPs locally, before DNS.
