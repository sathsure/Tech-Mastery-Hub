/*
 * Role Readiness Test — second half of the question bank, and the roles.
 * Merged with role-test-data.js into window.ROLE_TEST = { topics, roles, comingSoon }.
 */
(function (root) {
  const topics = {
    microservices: { label: "Microservices", q: [
      { l: 1, q: "What is the main benefit of microservices over a monolith?", o: ["Fewer network calls", "Services can be deployed and scaled independently by separate teams", "Simpler debugging", "No need for databases"], a: 1, e: "The cost: network calls, distributed data and more operations work." },
      { l: 1, q: "Should two microservices share one database?", o: ["Yes, always", "Generally no — each service should own its data and expose it through an API or events", "Only for reads", "Only in production"], a: 1, e: "Shared databases couple services and block independent deployment." },
      { l: 2, q: "What does an API gateway do?", o: ["Stores data", "A single entry point that routes requests and handles auth, rate limits and logging", "Runs batch jobs", "Replaces load balancers entirely"], a: 1, e: "Examples: Spring Cloud Gateway, Kong, AWS API Gateway." },
      { l: 2, q: "What does a circuit breaker do when a downstream service keeps failing?", o: ["Retries forever", "Stops calling it for a while and returns a fallback, preventing cascading failures", "Restarts the service", "Deletes the failing requests"], a: 1, e: "Resilience4j is the common Java library." },
      { l: 3, q: "How do you keep data consistent across services without a distributed transaction?", o: ["Two-phase commit everywhere", "The Saga pattern: local transactions with compensating actions on failure", "Share one database", "Ignore consistency"], a: 1, e: "e.g. payment fails → cancel the order and release stock." },
      { l: 3, q: "Why use the transactional outbox pattern?", o: ["To speed up queries", "To save a DB change and the event to publish in one local transaction, so events are never lost or sent for rolled-back changes", "To replace Kafka", "To encrypt messages"], a: 1, e: "A relay (or CDC) reads the outbox table and publishes the events." },
    ]},
    caching: { label: "Caching & Redis", q: [
      { l: 1, q: "What is the main purpose of a cache?", o: ["Permanent storage", "Serve frequently used data faster and reduce load on the source", "Encrypt data", "Replace the database"], a: 1, e: "Caches trade freshness for speed." },
      { l: 1, q: "What does TTL mean in caching?", o: ["Total transfer limit", "Time to live — how long an entry stays before it expires", "Thread lock time", "Top-tier latency"], a: 1, e: "Short TTLs keep data fresher; long TTLs give more hits." },
      { l: 2, q: "In the cache-aside pattern, who loads data into the cache?", o: ["The database", "The application: on a miss it reads the DB and writes the cache", "The CDN", "Redis automatically"], a: 1, e: "The most common pattern; invalidate or update the cache on writes." },
      { l: 2, q: "Which Redis data structure fits a leaderboard?", o: ["List", "Sorted set (ZSET)", "String", "Hash"], a: 1, e: "Sorted sets keep members ordered by score: ZADD, ZREVRANGE." },
      { l: 3, q: "What is a cache stampede, and one fix?", o: ["Too many cache servers; remove some", "Many requests miss an expired hot key at once and hit the DB; fix with a lock/single flight or early refresh", "A full disk; add space", "Slow network; compress"], a: 1, e: "Also add jitter to TTLs so keys don't expire together." },
      { l: 3, q: "Which eviction policy removes the least recently used keys when memory is full?", o: ["noeviction", "allkeys-lru", "volatile-ttl", "FIFO"], a: 1, e: "allkeys-lfu (least frequently used) is another common choice." },
    ]},
    messaging: { label: "Kafka & RabbitMQ", q: [
      { l: 1, q: "Why put a message queue between two services?", o: ["To make calls synchronous", "To decouple them, smooth traffic spikes and survive a consumer being down", "To encrypt data", "To replace the database"], a: 1, e: "The producer doesn't wait for the consumer." },
      { l: 1, q: "In Kafka, what is a topic split into for parallelism?", o: ["Queues", "Partitions", "Exchanges", "Shards of the producer"], a: 1, e: "Each partition is an ordered log; consumers in a group share partitions." },
      { l: 2, q: "How does Kafka guarantee ordering?", o: ["Across the whole topic", "Only within a partition — use the same key (e.g. orderId) to keep related events in order", "It doesn't at all", "By timestamp across brokers"], a: 1, e: "Messages with the same key go to the same partition." },
      { l: 2, q: "When would you choose RabbitMQ over Kafka?", o: ["For replaying months of events", "For task queues with flexible routing, priorities and per-message acknowledgment", "For very high-throughput event streaming", "Never"], a: 1, e: "Kafka shines at event streaming and replay; RabbitMQ at work queues and routing." },
      { l: 3, q: "With at-least-once delivery, how do you avoid processing a message twice?", o: ["Turn off retries", "Make consumers idempotent, e.g. store processed message IDs or use upserts", "Use bigger partitions", "It can't happen"], a: 1, e: "Duplicates are normal in distributed systems; design for them." },
      { l: 3, q: "What is a dead-letter queue used for?", o: ["Deleting old messages", "Holding messages that keep failing, so they don't block the queue and can be inspected", "Speeding up consumers", "Encrypting messages"], a: 1, e: "Alert on DLQ growth and replay after fixing the bug." },
    ]},
    "system-design": { label: "System Design", q: [
      { l: 1, q: "What does a load balancer do?", o: ["Stores sessions", "Spreads traffic across servers and stops sending to unhealthy ones", "Compresses images", "Runs database queries"], a: 1, e: "Enables horizontal scaling and high availability." },
      { l: 1, q: "Horizontal scaling means…", o: ["A bigger machine", "Adding more machines", "Faster disks", "More threads"], a: 1, e: "Vertical = bigger machine; horizontal = more machines (needs stateless apps)." },
      { l: 2, q: "Why use a CDN?", o: ["To run backend logic", "To serve static content from servers close to users, cutting latency and origin load", "To store passwords", "To replace DNS"], a: 1, e: "Examples: CloudFront, Cloudflare, Akamai." },
      { l: 2, q: "What does the CAP theorem say happens during a network partition?", o: ["Nothing", "You must choose between consistency and availability", "You lose durability", "Latency drops"], a: 1, e: "Partitions can't be avoided, so the real choice is C or A while one lasts." },
      { l: 3, q: "For a URL shortener with 100× more reads than writes, what matters most?", o: ["Write throughput", "Fast reads: caching hot short codes and a read-optimised key-value lookup", "Complex joins", "Strong multi-region transactions"], a: 1, e: "Generate unique codes (e.g. Base62 of an ID) and cache redirects." },
      { l: 3, q: "What is the main trade-off of database sharding?", o: ["None", "Scales writes and storage, but cross-shard queries, transactions and rebalancing get harder", "It removes the need for indexes", "It only helps reads"], a: 1, e: "Choose the shard key carefully (e.g. customer_id) to avoid hot shards." },
    ]},
    testing: { label: "Testing", q: [
      { l: 1, q: "What does a unit test check?", o: ["The whole system end to end", "One function or class in isolation", "Only the UI", "Performance under load"], a: 1, e: "Fast and many; the base of the test pyramid." },
      { l: 1, q: "What is mocking used for?", o: ["Making tests slower", "Replacing real dependencies (DB, APIs) with controlled fakes", "Testing CSS", "Deploying code"], a: 1, e: "e.g. Mockito's when(...).thenReturn(...)." },
      { l: 2, q: "What does the test pyramid recommend?", o: ["Mostly end-to-end tests", "Many unit tests, fewer integration tests, few end-to-end tests", "Only manual testing", "Equal numbers of each"], a: 1, e: "E2E tests are slow and fragile; keep them for key journeys." },
      { l: 2, q: "Which Spring Boot annotation loads only the web layer for controller tests?", o: ["@SpringBootTest", "@WebMvcTest", "@DataJpaTest", "@MockBean"], a: 1, e: "@DataJpaTest is the equivalent slice for repositories." },
      { l: 3, q: "Why use Testcontainers for integration tests?", o: ["To mock the database", "To run real dependencies (PostgreSQL, Kafka) in Docker, so tests match production behaviour", "To speed up unit tests", "To test CSS"], a: 1, e: "H2 differs from your real database in subtle ways." },
      { l: 3, q: "Code coverage is 90%, but bugs still reach production. Why can that happen?", o: ["Coverage tools are broken", "Coverage shows code ran, not that tests assert the right behaviour or edge cases", "90% is too high", "Unit tests can't find bugs"], a: 1, e: "Check assertions and edge cases; mutation testing measures test quality." },
    ]},
    security: { label: "Security (OWASP)", q: [
      { l: 1, q: "What is the main defence against SQL injection?", o: ["Hiding error messages", "Parameterised queries / prepared statements", "Using POST instead of GET", "Encrypting the database"], a: 1, e: "User input is never treated as SQL code." },
      { l: 1, q: "How should passwords be stored?", o: ["Encrypted with AES", "Hashed with a slow, salted algorithm like bcrypt or Argon2", "Base64 encoded", "Plain text in a secure table"], a: 1, e: "Fast hashes like MD5 or SHA-256 are too easy to brute-force." },
      { l: 2, q: "What is #1 in the OWASP Top 10 (2025)?", o: ["Injection", "Broken access control", "Cryptographic failures", "Security misconfiguration"], a: 1, e: "Users reaching data or actions they shouldn't — e.g. IDOR." },
      { l: 2, q: "Which cookie attributes help protect a session cookie?", o: ["Public; Max-Age", "Secure; HttpOnly; SameSite", "Path=/ only", "Domain=*"], a: 1, e: "HttpOnly blocks JavaScript access; SameSite helps against CSRF." },
      { l: 3, q: "GET /api/orders/1043 returns another customer's order to a logged-in user. What is this called?", o: ["XSS", "IDOR — insecure direct object reference (broken access control)", "CSRF", "SSRF"], a: 1, e: "Fix: check the order belongs to the caller on every request." },
      { l: 3, q: "What does a Content-Security-Policy header mainly protect against?", o: ["SQL injection", "XSS, by limiting where scripts can load and run from", "DDoS", "Weak passwords"], a: 1, e: "It's a second layer — still escape output." },
    ]},
    git: { label: "Git", q: [
      { l: 1, q: "What does git pull do?", o: ["Uploads your commits", "Fetches remote changes and merges (or rebases) them into your branch", "Deletes a branch", "Creates a tag"], a: 1, e: "git pull = git fetch + git merge (by default)." },
      { l: 1, q: "What is a pull request?", o: ["A Git command", "A request to review and merge a branch's changes", "A way to download a repo", "A backup"], a: 1, e: "Called a merge request on GitLab." },
      { l: 2, q: "What is the difference between merge and rebase?", o: ["None", "Merge adds a merge commit and keeps history; rebase replays your commits on top for a linear history", "Rebase deletes commits", "Merge only works on main"], a: 1, e: "Don't rebase commits others have already pulled." },
      { l: 2, q: "You committed to the wrong branch but haven't pushed. What's a clean fix?", o: ["Delete the repo", "Create/switch to the right branch, then reset the wrong branch back (git reset)", "git push --force to main", "Edit .git by hand"], a: 1, e: "Or cherry-pick the commit onto the right branch and reset the wrong one." },
      { l: 3, q: "Which command safely undoes a commit that's already pushed and shared?", o: ["git reset --hard", "git revert <commit>", "git rebase -i", "git commit --amend"], a: 1, e: "revert adds a new commit that undoes the change without rewriting history." },
      { l: 3, q: "What does git bisect help you do?", o: ["Split a repo", "Find the commit that introduced a bug by binary search", "Merge two branches", "Squash commits"], a: 1, e: "Mark good and bad commits; Git checks out the midpoint each step." },
    ]},
    linux: { label: "Linux & Shell", q: [
      { l: 1, q: "Which command follows a log file as new lines are written?", o: ["cat app.log", "tail -f app.log", "head app.log", "ls app.log"], a: 1, e: "Combine with grep to filter: tail -f app.log | grep ERROR." },
      { l: 1, q: "What does chmod 755 script.sh give?", o: ["Everyone full access", "Owner rwx; group and others r-x", "Only the owner can read", "No one can execute"], a: 1, e: "r=4, w=2, x=1 per user/group/others." },
      { l: 2, q: "Where are system configuration files usually kept?", o: ["/home", "/etc", "/tmp", "/bin"], a: 1, e: "Logs are usually under /var/log." },
      { l: 2, q: "Which command shows which process is using port 8080?", o: ["ps 8080", "ss -tulpn | grep :8080 (or lsof -i :8080)", "df -h", "chmod 8080"], a: 1, e: "Common when an app fails with 'Address already in use'." },
      { l: 3, q: "Why try kill (SIGTERM) before kill -9 (SIGKILL)?", o: ["-9 is slower", "SIGTERM lets the app shut down cleanly; SIGKILL stops it instantly and can leave work half-done", "SIGTERM restarts the process", "They are the same"], a: 1, e: "Use -9 only when a process won't stop." },
      { l: 3, q: "On a 4-core server the load average is 12. What does that suggest?", o: ["The server is idle", "Work is queuing — about 3× more runnable tasks than cores", "Disk is full", "Memory is free"], a: 1, e: "Check top/htop for the busy processes, and I/O wait." },
    ]},
    devops: { label: "DevOps, Docker & Kubernetes", q: [
      { l: 1, q: "What is a Docker image?", o: ["A running container", "A read-only template with the app and its dependencies, used to start containers", "A virtual machine", "A Kubernetes cluster"], a: 1, e: "Image = blueprint; container = running instance." },
      { l: 1, q: "What does CI (continuous integration) do?", o: ["Deploys to production manually", "Automatically builds and tests every code change", "Monitors servers", "Writes tests for you"], a: 1, e: "CD then automates releasing what passed." },
      { l: 2, q: "Why use multi-stage Docker builds?", o: ["To run several apps in one container", "To build in one stage and copy only the output into a small runtime image", "To speed up the network", "They are required by Kubernetes"], a: 1, e: "Smaller images: faster pulls and fewer vulnerabilities." },
      { l: 2, q: "What is a Kubernetes pod?", o: ["A cluster", "The smallest deployable unit: one or more containers sharing network and storage", "A load balancer", "A Docker image"], a: 1, e: "Deployments manage ReplicaSets, which manage pods." },
      { l: 3, q: "A pod is in CrashLoopBackOff. What do you check first?", o: ["Delete the cluster", "kubectl logs --previous and kubectl describe pod (events, exit code, probes, OOMKilled)", "Restart your laptop", "Scale to zero"], a: 1, e: "Common causes: bad config or secrets, failing probes, too little memory." },
      { l: 3, q: "What is the difference between liveness and readiness probes?", o: ["None", "Liveness restarts a stuck container; readiness stops sending traffic until the app can serve", "Readiness restarts the pod", "Liveness controls autoscaling"], a: 1, e: "A too-strict liveness probe can cause restart loops under load." },
    ]},
    terraform: { label: "Terraform & IaC", q: [
      { l: 1, q: "What is Infrastructure as Code?", o: ["Writing app code on servers", "Defining infrastructure in version-controlled code instead of clicking in consoles", "A cloud provider", "A monitoring tool"], a: 1, e: "Repeatable, reviewable, recoverable environments." },
      { l: 1, q: "Which command shows what Terraform will change without changing anything?", o: ["terraform apply", "terraform plan", "terraform destroy", "terraform init"], a: 1, e: "Always read the plan before applying." },
      { l: 2, q: "Why store Terraform state remotely with locking?", o: ["It's faster", "So the team shares one source of truth and two applies can't run at once and corrupt it", "To hide it from Git", "Terraform requires the cloud"], a: 1, e: "e.g. an S3 backend with locking enabled." },
      { l: 2, q: "What is a Terraform module?", o: ["A provider", "A reusable folder of Terraform code with inputs and outputs", "A state file", "A cloud region"], a: 1, e: "Like a function for infrastructure; pin shared module versions." },
      { l: 3, q: "Why is for_each usually safer than count for a list of users?", o: ["It's faster", "Resources are keyed by name, so removing one doesn't shift the others and force recreation", "count is deprecated", "for_each skips the plan"], a: 1, e: "count indexes shift when an item in the middle is removed." },
      { l: 3, q: "Someone changed a security group in the console. What is this, and what does plan show?", o: ["A bug in Terraform", "Drift — plan shows the changes needed to bring it back to what the code says", "Nothing; Terraform ignores it", "A state lock"], a: 1, e: "Either update the code to match the intended change or apply to revert it." },
    ]},
    aws: { label: "AWS", q: [
      { l: 1, q: "Which AWS service gives you virtual servers?", o: ["S3", "EC2", "RDS", "Lambda"], a: 1, e: "S3 = object storage, RDS = managed databases, Lambda = serverless functions." },
      { l: 1, q: "What is an Availability Zone?", o: ["A country", "One or more isolated data centres within a region", "A pricing plan", "A VPC"], a: 1, e: "Spread across 2–3 AZs for high availability." },
      { l: 2, q: "How should an EC2 app get permission to read an S3 bucket?", o: ["Hard-code access keys in the app", "Attach an IAM role to the instance with least-privilege permissions", "Make the bucket public", "Use the root account"], a: 1, e: "Roles give short-lived credentials automatically." },
      { l: 2, q: "What is the difference between a security group and a network ACL?", o: ["None", "Security groups are stateful and attach to instances; NACLs are stateless and apply to subnets", "NACLs attach to instances", "Security groups only allow outbound"], a: 1, e: "Stateful = return traffic is allowed automatically." },
      { l: 3, q: "When is Lambda a poor fit?", o: ["Event-driven tasks", "Long-running jobs (over 15 minutes) or steady high-throughput workloads where cold starts and per-request cost hurt", "Spiky traffic", "Scheduled jobs"], a: 1, e: "Use containers (ECS/EKS) or EC2 for those." },
      { l: 3, q: "Private-subnet instances need to download updates from the internet. What do you add?", o: ["An internet gateway on the private subnet", "A NAT gateway in a public subnet, with a route from the private subnet", "Public IPs on each instance", "A VPN to every user"], a: 1, e: "Outbound only; nothing on the internet can start a connection in." },
    ]},
    observability: { label: "Observability & SRE", q: [
      { l: 1, q: "What are the three pillars of observability?", o: ["CPU, memory, disk", "Logs, metrics and traces", "Dev, QA, Prod", "Alerts, tickets, emails"], a: 1, e: "They work together to find what broke and why." },
      { l: 1, q: "What is an SLO?", o: ["A contract with penalties", "An internal reliability target, e.g. 99.9% of requests succeed", "A log format", "A deployment tool"], a: 1, e: "SLI = what you measure; SLA = the customer contract." },
      { l: 2, q: "Why alert on p95/p99 latency rather than the average?", o: ["Averages are illegal", "Averages hide the slow requests that real users feel", "Percentiles are cheaper", "Averages can't be graphed"], a: 1, e: "p99 shows the slowest 1% of requests." },
      { l: 2, q: "With a 99.9% SLO over 30 days, roughly how much downtime is the error budget?", o: ["4 minutes", "About 43 minutes", "About 7 hours", "1 day"], a: 1, e: "0.1% of 30 days ≈ 43 minutes." },
      { l: 3, q: "Errors spike right after a deploy. What is the first priority?", o: ["Find the root cause in the code", "Mitigate: roll back or disable the feature flag, then investigate", "Write the postmortem", "Scale down"], a: 1, e: "Stop user impact first; debug calmly after." },
      { l: 3, q: "What does distributed tracing add that logs alone don't?", o: ["Log storage", "The path and timing of one request across services, to find which hop is slow", "CPU graphs", "Alert routing"], a: 1, e: "A shared trace ID ties the spans together (OpenTelemetry)." },
    ]},
    networking: { label: "Networking & HTTP", q: [
      { l: 1, q: "What does DNS do?", o: ["Encrypts traffic", "Translates domain names into IP addresses", "Routes packets between routers", "Stores cookies"], a: 1, e: "A wrong DNS record is a common cause of 'site not reachable'." },
      { l: 1, q: "Which port does HTTPS use by default?", o: ["80", "443", "22", "8080"], a: 1, e: "80 = HTTP, 22 = SSH." },
      { l: 2, q: "What is the key difference between TCP and UDP?", o: ["UDP is encrypted", "TCP guarantees ordered, reliable delivery; UDP doesn't, but has less overhead", "TCP is only for email", "No difference"], a: 1, e: "UDP suits video calls and gaming; HTTP/3 builds reliability on top of UDP (QUIC)." },
      { l: 2, q: "What does CORS control?", o: ["Server CPU usage", "Whether a browser lets a page from one origin read responses from another origin", "Cookie size", "TLS versions"], a: 1, e: "The server allows origins with Access-Control-Allow-Origin." },
      { l: 3, q: "What does HTTP/2 improve over HTTP/1.1?", o: ["Adds encryption by default", "Multiplexes many requests over one connection and compresses headers", "Replaces TCP with UDP", "Removes status codes"], a: 1, e: "HTTP/3 goes further by using QUIC over UDP." },
      { l: 3, q: "What happens during a TLS handshake?", o: ["Data is compressed", "Client and server agree on keys, and the server proves its identity with a certificate", "DNS is resolved", "Cookies are set"], a: 1, e: "After the handshake, traffic is encrypted with the agreed symmetric keys." },
    ]},
    python: { label: "Python", q: [
      { l: 1, q: "Which Python type is immutable?", o: ["list", "dict", "tuple", "set"], a: 2, e: "Immutable types (tuple, str, int) can be dict keys." },
      { l: 1, q: "What does a list comprehension like [x * 2 for x in nums if x > 0] produce?", o: ["A generator", "A new list of doubled positive numbers", "A dict", "It modifies nums"], a: 1, e: "Use round brackets for a lazy generator instead." },
      { l: 2, q: "What is the problem with def add(item, bucket=[])?", o: ["Syntax error", "The default list is created once and shared between calls", "Lists can't be defaults", "It's slower"], a: 1, e: "Use bucket=None and create the list inside the function." },
      { l: 2, q: "What does yield make a function?", o: ["Asynchronous", "A generator that produces values one at a time", "Faster", "A class"], a: 1, e: "Great for large files and streams." },
      { l: 3, q: "Because of the GIL, which approach speeds up CPU-bound Python work?", o: ["threading", "multiprocessing / ProcessPoolExecutor", "asyncio", "More decorators"], a: 1, e: "Threads and asyncio help I/O-bound work." },
      { l: 3, q: "What happens if you call time.sleep(5) inside an async function?", o: ["Only that task waits", "The whole event loop is blocked; use await asyncio.sleep(5)", "It raises an error", "It runs in a thread automatically"], a: 1, e: "Never call blocking functions in async code." },
    ]},
    "data-engineering": { label: "Data Engineering", q: [
      { l: 1, q: "What is the difference between ETL and ELT?", o: ["None", "ETL transforms before loading; ELT loads raw data first and transforms in the warehouse", "ELT skips loading", "ETL is only for streaming"], a: 1, e: "ELT is the modern cloud default (e.g. dbt on Snowflake)." },
      { l: 1, q: "Which system is designed for analytics over large historical data?", o: ["OLTP database", "Data warehouse (OLAP)", "Redis", "A message queue"], a: 1, e: "Examples: Snowflake, BigQuery, Redshift." },
      { l: 2, q: "In a star schema, what does the fact table hold?", o: ["Descriptive attributes", "Measurements/events plus foreign keys to dimensions", "Only dates", "User passwords"], a: 1, e: "Dimensions describe the facts (product, customer, date)." },
      { l: 2, q: "Why is Parquet preferred over CSV for analytics?", o: ["It's human-readable", "Columnar storage with compression and types — queries read only needed columns", "It's the only format Spark reads", "It has no schema"], a: 1, e: "Often 5–10× smaller and much cheaper to scan." },
      { l: 3, q: "A daily pipeline must be safe to re-run. What makes it idempotent?", o: ["Appending rows each run", "Overwriting the day's partition or using MERGE/upsert on a key", "Running it only once", "Using CSV files"], a: 1, e: "Retries and backfills then never double-count." },
      { l: 3, q: "A Spark join is slow because one key has far more rows than the rest. What is this?", o: ["A shuffle bug", "Data skew — fix with salting the key or broadcasting the small table", "Too many partitions always", "A driver crash"], a: 1, e: "One task ends up doing most of the work." },
    ]},
    ai: { label: "AI & LLMs", q: [
      { l: 1, q: "What is a token for an LLM?", o: ["A login credential", "A chunk of text the model reads and writes, roughly ¾ of a word", "A GPU", "A prompt template"], a: 1, e: "Pricing and context limits are counted in tokens." },
      { l: 1, q: "What is a hallucination?", o: ["A model crash", "The model confidently producing false information", "A slow response", "A refusal"], a: 1, e: "Reduce it with grounding (RAG) and checking important answers." },
      { l: 2, q: "What does RAG do?", o: ["Retrains the model", "Retrieves relevant documents first and gives them to the model to answer from", "Compresses the model", "Translates prompts"], a: 1, e: "Fresh, source-backed answers without fine-tuning." },
      { l: 2, q: "What does an embedding represent?", o: ["An image file", "Text meaning as a vector, so similar meanings are close together", "A model's weights", "A database index type"], a: 1, e: "Stored in vector databases for semantic search." },
      { l: 3, q: "When should you fine-tune instead of using RAG?", o: ["To add new facts that change daily", "To teach a consistent style, format or narrow task; use RAG for fresh or private facts", "Never", "Always first"], a: 1, e: "Many products use both." },
      { l: 3, q: "What is the best defence against prompt injection in an agent that can call tools?", o: ["A longer system prompt", "Treat retrieved content as data, limit tool permissions, and require approval for risky actions", "Higher temperature", "Bigger context window"], a: 1, e: "Assume any text the model reads may contain instructions." },
    ]},
  };

  /*
   * Roles: core topics count double and get 3 questions (easy, medium, hard); supporting topics get 2 (easy, medium).
   * choice: lets the candidate pick between options (e.g. Angular or React) before starting.
   */
  const roles = [
    { name: "Full Stack Developer", icon: "layers", color: "#4f46e5", blurb: "Java + Spring backend with a modern frontend", core: ["java", "spring", "rest-api", "sql", "javascript", "@frontend"], support: ["html", "css", "typescript", "git", "system-design", "testing"], choice: { key: "@frontend", label: "Frontend framework", options: ["angular", "react"] } },
    { name: "Backend Developer", icon: "server", color: "#0ea5a4", blurb: "Java services, APIs, data and distributed systems", core: ["java", "spring", "rest-api", "sql", "microservices", "system-design"], support: ["caching", "messaging", "security", "testing", "git"] },
    { name: "Frontend Developer", icon: "layout", color: "#ec4899", blurb: "UI engineering, performance and accessibility", core: ["html", "css", "javascript", "typescript", "@frontend"], support: ["web-vitals", "testing", "git", "rest-api"], choice: { key: "@frontend", label: "Frontend framework", options: ["angular", "react"] } },
    { name: "DevOps Engineer", icon: "flow", color: "#f59e0b", blurb: "CI/CD, containers, cloud and infrastructure as code", core: ["linux", "devops", "aws", "terraform", "git"], support: ["networking", "observability", "security", "python"] },
    { name: "Cloud Engineer", icon: "cloud", color: "#0284c7", blurb: "Building and running workloads on AWS", core: ["aws", "terraform", "linux", "networking"], support: ["devops", "security", "observability", "python"] },
    { name: "Site Reliability Engineer (SRE)", icon: "pulse", color: "#16a34a", blurb: "Reliability, monitoring and incident response", core: ["observability", "linux", "devops", "aws"], support: ["networking", "terraform", "python", "system-design"] },
    { name: "Data Engineer", icon: "database", color: "#7c3aed", blurb: "Pipelines, warehouses and data quality", core: ["sql", "python", "data-engineering"], support: ["aws", "linux", "git", "system-design"] },
    { name: "AI / LLM Engineer", icon: "sparkles", color: "#db2777", blurb: "LLMs, RAG and AI features in production", core: ["python", "ai", "rest-api"], support: ["system-design", "security", "sql", "git"] },
    { name: "Automation Test Engineer (SDET)", icon: "check", color: "#65a30d", blurb: "Test automation for APIs, UIs and pipelines", core: ["testing", "java", "javascript", "rest-api"], support: ["sql", "git", "devops", "web-vitals"] },
  ];

  const merged = Object.assign({}, root.ROLE_TEST_TOPICS_A || (typeof require !== "undefined" ? require("./role-test-data.js") : {}), topics);
  const api = { topics: merged, roles };
  root.ROLE_TEST = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
