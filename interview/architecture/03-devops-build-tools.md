## 1️⃣ Docker – Basic Conceptual Questions

### ❓ What is Docker and why is it used?

- What problem does Docker solve?
- Why do teams prefer Docker over traditional deployment?

---

### ❓ What is the difference between Docker and a Virtual Machine?

- How is resource usage different?
- Why are containers faster to start?

---

### ❓ What is a Docker image?

- What does an image contain?
- Is an image mutable or immutable?

---

### ❓ What is a Docker container?

- How is it created?
- What happens when a container stops?

---

### ❓ What is a Dockerfile?

- Why do we need it?
- What kind of instructions does it contain?

---

### ❓ Why should applications inside Docker be stateless?

- What happens if containers store data locally?

---

### ❓ How do you pass configuration to a Docker container?

- Environment variables
- External config files

---

### ❓ What are common benefits of using Docker in projects?

- Development
- Testing
- Deployment

---

## 2️⃣ Jenkins + Groovy – CI/CD Basics

### ❓ What is Jenkins?

- What role does Jenkins play in software development?

---

### ❓ What is CI/CD?

- What is Continuous Integration?
- What is Continuous Deployment / Delivery?

---

### ❓ Why do teams use Jenkins for CI/CD?

- What problems does it solve?

---

### ❓ What is a Jenkins pipeline?

- Why are pipelines preferred over manual jobs?

---

### ❓ What is a Jenkinsfile?

- Why is it stored in the repository?

---

### ❓ Why is Jenkinsfile written in Groovy?

- Why not Java or YAML?

---

### ❓ What is Groovy?

- How is Groovy related to Java?

---

### ❓ Is Groovy statically typed or dynamically typed?

- Why is dynamic typing useful in pipelines?

---

### ❓ What are common stages in a Jenkins pipeline?

- Build
- Test
- Package
- Deploy

---

### ❓ How does Jenkins trigger a pipeline?

- Git commit
- Pull request
- Manual trigger

---

### ❓ What happens when a Jenkins build fails?

- How are developers notified?

---

### ❓ What is the difference between Jenkins master and agent?

- Why are agents required?

---

### ❓ Where is Groovy mostly used in Jenkins?

- Pipeline scripts
- Shared libraries

---

### ❓ What are common problems seen in Jenkins pipelines?

- Flaky builds
- Long execution time
- Environment mismatch

---

## 3️⃣ Tomcat – Application Server Basics

### ❓ What is Apache Tomcat?

- Is it a web server or application server?

---

### ❓ What kind of applications run on Tomcat?

- Why is Tomcat commonly used with Java?

---

### ❓ How does Tomcat handle incoming requests?

- Thread-per-request concept

---

### ❓ What is a WAR file?

- How is it deployed in Tomcat?

---

### ❓ Difference between embedded Tomcat and external Tomcat?

- Why Spring Boot uses embedded Tomcat?

---

### ❓ What are common issues seen in Tomcat?

- Port conflicts
- Memory issues
- Thread exhaustion

---

### ❓ How do you restart or redeploy applications in Tomcat?

- Manual vs automated approaches

---

## 4️⃣ Maven – Build Tool Fundamentals

### ❓ What is Maven and why is it used?

- What problems does it solve?

---

### ❓ What is a `pom.xml` file?

- What information does it contain?

---

### ❓ What is dependency management in Maven?

- How does Maven download dependencies?

---

### ❓ What are Maven repositories?

- Local
- Central
- Remote

---

### ❓ What is the Maven build lifecycle?

- Compile
- Test
- Package
- Install
- Deploy

---

### ❓ What is a Maven plugin?

- Why are plugins important?

---

### ❓ What is a multi-module Maven project?

- Why do teams use it?

---

### ❓ How does Maven help maintain consistency across environments?

- Same build everywhere concept

---

## 5️⃣ How These Tools Work Together (Very Common)

### ❓ Typical CI/CD flow using these tools?

- Code commit
- Jenkins build
- Maven build
- Docker image creation
- Deployment

---

### ❓ How do Maven, Jenkins, and Docker work together?

- Responsibility of each tool?

---

### ❓ Where does Tomcat fit in this flow?

- Inside Docker container
- Embedded in Spring Boot app

---

### ❓ What problems do these tools solve together?

- Environment inconsistency
- Manual deployments
- Build failures

---
