# Linux & Shell — Quick Traps

> Tricky spots interviewers love: what goes wrong, a tiny example, and the right answer.

### 1. Deleted log, disk still full
- ❌ `rm app.log` but `df -h` still shows 100%.
- ✅ A running process still holds the file. Find it with `lsof | grep deleted` and restart it (or truncate with `> app.log`).

### 2. `kill -9` first
- ❌ Always force-killing.
- ✅ Try `kill -15` (SIGTERM) first so the app can clean up.

### 3. Disk full but space left
- ❌ `df -h` shows free space, yet "No space left on device".
- ✅ Inodes are used up (many tiny files). Check `df -i`.

### 4. `chmod 777`
- ❌ Fixing permission errors with 777.
- ✅ Give the least needed (e.g. `755` for scripts, `600` for keys) and fix the owner.

### 5. Unquoted variables
- ❌ `rm -rf $DIR/` with `DIR` empty → `rm -rf /`.
- ✅ Quote variables (`"$DIR"`) and use `set -u`.

### 6. Script keeps going after an error
- ❌ A failed step, then the script deploys anyway.
- ✅ `set -euo pipefail` at the top.

### 7. Cron "works in the terminal"
- ❌ A cron job fails while the same command works manually.
- ✅ Cron has a tiny PATH and no profile. Use full paths and log output.

### 8. `>` vs `>>`
- ❌ `echo line > important.log` → wipes the file.
- ✅ `>>` appends.

### 9. High load ≠ high CPU
- ❌ Load average 20 → "the CPU is maxed".
- ✅ Load also counts processes waiting on disk. Check `%wa` in `top`.

### 10. Hard vs soft link
- ❌ Thinking a soft link survives deleting the original.
- ✅ A soft link breaks; a hard link still works (same data).
