# Linux & Shell — Code Snippets

> Commands and scripts interviewers ask you to write.

### 1. Top 10 IPs hitting a server
```bash
awk '{print $1}' /var/log/nginx/access.log | sort | uniq -c | sort -nr | head -10
```

### 2. Count errors per hour
```bash
grep "ERROR" app.log | awk '{print substr($2, 1, 2)}' | sort | uniq -c
```

### 3. Find big files
```bash
find / -type f -size +500M -exec ls -lh {} \; 2>/dev/null
du -ah /var | sort -rh | head -20
```

### 4. What's using port 8080? Stop it gracefully
```bash
ss -tulpn | grep 8080        # or: lsof -i :8080
kill -15 <PID>
```

### 5. Safe deploy-style script
```bash
#!/usr/bin/env bash
set -euo pipefail                         # stop on errors, unset vars, failed pipes

APP_DIR="/opt/app"
BACKUP="$APP_DIR/backup-$(date +%Y%m%d-%H%M%S).tgz"

log() { echo "[$(date '+%F %T')] $*"; }

log "Backing up"
tar -czf "$BACKUP" -C "$APP_DIR" current

log "Deploying $1"
cp "$1" "$APP_DIR/current/app.jar"
systemctl restart app

if ! curl -fsS --retry 5 --retry-delay 3 http://localhost:8080/actuator/health > /dev/null; then
  log "Health check failed, rolling back"
  tar -xzf "$BACKUP" -C "$APP_DIR"
  systemctl restart app
  exit 1
fi
log "Done"
```

### 6. Delete logs older than 7 days (cron)
```bash
# crontab -e
0 3 * * * find /var/log/app -name "*.log" -mtime +7 -delete
```

### 7. Loop over lines of a file
```bash
while IFS= read -r host; do
  if ping -c1 -W1 "$host" > /dev/null; then echo "$host up"; else echo "$host DOWN"; fi
done < hosts.txt
```

### 8. Quick health snapshot of a server
```bash
uptime; free -h; df -h; top -b -n1 | head -15; ss -s
```

### 9. systemd service file
```ini
# /etc/systemd/system/app.service
[Unit]
Description=My App
After=network.target

[Service]
User=app
ExecStart=/usr/bin/java -jar /opt/app/current/app.jar
Restart=on-failure
EnvironmentFile=/etc/app/env

[Install]
WantedBy=multi-user.target
```
```bash
systemctl daemon-reload && systemctl enable --now app
```
