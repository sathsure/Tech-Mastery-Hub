# DevOps (CI/CD, Docker, Kubernetes) — Code Snippets

> Config files interviewers ask you to write or explain.

### 1. Dockerfile: Spring Boot (multi-stage)
```dockerfile
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn -q dependency:go-offline          # cached until pom.xml changes
COPY src ./src
RUN mvn -q package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
USER 1000                                  # don't run as root
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### 2. Dockerfile: Node / Angular / React (static build served by Nginx)
```dockerfile
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1.27-alpine
COPY --from=build /app/dist/ /usr/share/nginx/html
```

### 3. docker-compose for local development
```yaml
services:
  api:
    build: .
    ports: ["8080:8080"]
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://db:5432/app
    depends_on: [db]
  db:
    image: postgres:16
    environment: { POSTGRES_DB: app, POSTGRES_PASSWORD: secret }
    volumes: [pgdata:/var/lib/postgresql/data]
volumes:
  pgdata:
```

### 4. Kubernetes Deployment + Service
```yaml
apiVersion: apps/v1
kind: Deployment
metadata: { name: api }
spec:
  replicas: 3
  selector: { matchLabels: { app: api } }
  template:
    metadata: { labels: { app: api } }
    spec:
      containers:
        - name: api
          image: registry.example.com/api:3f9a2c1          # immutable tag
          ports: [{ containerPort: 8080 }]
          resources:
            requests: { cpu: 250m, memory: 512Mi }
            limits:   { memory: 1Gi }
          readinessProbe: { httpGet: { path: /actuator/health/readiness, port: 8080 } }
          livenessProbe:  { httpGet: { path: /actuator/health/liveness,  port: 8080 }, initialDelaySeconds: 30 }
          envFrom: [{ configMapRef: { name: api-config } }, { secretRef: { name: api-secrets } }]
---
apiVersion: v1
kind: Service
metadata: { name: api }
spec:
  selector: { app: api }
  ports: [{ port: 80, targetPort: 8080 }]
```

### 5. Autoscaling
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata: { name: api }
spec:
  scaleTargetRef: { apiVersion: apps/v1, kind: Deployment, name: api }
  minReplicas: 3
  maxReplicas: 10
  metrics:
    - type: Resource
      resource: { name: cpu, target: { type: Utilization, averageUtilization: 70 } }
```

### 6. GitHub Actions: build, test, push image
```yaml
name: ci
on:
  push: { branches: [main] }
  pull_request:
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with: { distribution: temurin, java-version: 21, cache: maven }
      - run: ./mvnw -B verify
      - name: Build and push image
        if: github.ref == 'refs/heads/main'
        run: |
          echo "${{ secrets.REGISTRY_TOKEN }}" | docker login registry.example.com -u ci --password-stdin
          docker build -t registry.example.com/api:${{ github.sha }} .
          docker push registry.example.com/api:${{ github.sha }}
```

### 7. Debugging commands
```bash
kubectl get pods -o wide
kubectl describe pod api-7d9f            # events: image pull errors, OOMKilled, failed probes
kubectl logs api-7d9f --previous         # logs from the crashed container
kubectl exec -it api-7d9f -- sh
kubectl rollout undo deployment/api      # roll back
```
