/*
 * Role Readiness Test — extra questions (part 2 of 2): Microservices to AI.
 * Appended to window.ROLE_TEST.topics; every topic ends with 12 questions (4 easy, 4 medium, 4 hard).
 */
(function (root) {
  const extra = {
    microservices: [
      { l: 1, q: "What is service discovery?", o: ["Finding bugs", "A way for services to find each other's current network addresses", "A monitoring dashboard", "A test framework"], a: 1, e: "Examples: Kubernetes Services/DNS, Eureka, Consul." },
      { l: 1, q: "How do microservices usually talk to each other?", o: ["Shared memory", "HTTP/REST or gRPC calls, and asynchronous messages through a broker", "A shared database table", "FTP"], a: 1, e: "Prefer async events where the caller doesn't need an immediate answer." },
      { l: 2, q: "What is the 'database per service' pattern?", o: ["One database server for all", "Each service owns its data and others access it only through its API or events", "Every table in its own database", "Using NoSQL only"], a: 1, e: "It keeps services independently deployable." },
      { l: 2, q: "Why add a correlation ID to requests across services?", o: ["For security", "To trace one user request through every service's logs", "To speed up calls", "For caching"], a: 1, e: "Distributed tracing (OpenTelemetry) carries it automatically." },
      { l: 3, q: "What is the strangler fig pattern?", o: ["A load balancing algorithm", "Gradually replacing parts of a monolith with new services, routing traffic piece by piece", "Deleting unused services", "A database migration tool"], a: 1, e: "Avoids a risky big-bang rewrite." },
      { l: 3, q: "When is a modular monolith a better choice than microservices?", o: ["Never", "For a small team or early product, where independent deployment doesn't yet justify the operational cost", "Only for frontends", "When using Java"], a: 1, e: "Clear module boundaries let you split later if needed." },
    ],
    caching: [
      { l: 1, q: "What is a cache hit?", o: ["An error", "When requested data is found in the cache", "When the cache is full", "When data is written"], a: 1, e: "Hit rate = hits ÷ total lookups; higher is better." },
      { l: 1, q: "Where does Redis keep data while running?", o: ["Only on disk", "In memory (RAM), optionally persisted to disk", "In the browser", "In a CDN"], a: 1, e: "That's why reads are sub-millisecond." },
      { l: 2, q: "What does write-through caching mean?", o: ["Writes skip the cache", "Every write goes to the cache and the database together", "Writes go only to the cache", "Cache is cleared on write"], a: 1, e: "Fresher cache, slower writes; write-behind writes the DB later." },
      { l: 2, q: "Why add random jitter to cache TTLs?", o: ["To save memory", "So many keys don't expire at the same moment and hit the database together", "To encrypt data", "For logging"], a: 1, e: "Prevents synchronised stampedes after a bulk load." },
      { l: 3, q: "What is cache penetration, and one fix?", o: ["Hacking the cache; use a password", "Repeated requests for keys that don't exist go straight to the DB; cache 'not found' results briefly or use a Bloom filter", "Too much memory use; add RAM", "Slow writes; batch them"], a: 1, e: "Attackers can exploit it with random IDs." },
      { l: 3, q: "Why is caching user-specific data at a public CDN dangerous?", o: ["It's slower", "Another user could receive someone else's private response", "CDNs can't store JSON", "It breaks HTTPS"], a: 1, e: "Use Cache-Control: private or no-store for personal data." },
    ],
    messaging: [
      { l: 1, q: "What are a producer and a consumer?", o: ["Two databases", "The producer sends messages; the consumer receives and processes them", "Two load balancers", "Frontend and backend"], a: 1, e: "They don't need to be running at the same time." },
      { l: 1, q: "What does asynchronous messaging mean for the sender?", o: ["It waits for the reply", "It doesn't wait for the work to be done — it continues after sending", "It blocks the database", "It must retry forever"], a: 1, e: "Good for emails, notifications and long processing." },
      { l: 2, q: "What is a Kafka consumer group?", o: ["A set of topics", "Consumers that share a topic's partitions so each message is processed by one of them", "A backup cluster", "A security role"], a: 1, e: "Add consumers (up to the partition count) to process faster." },
      { l: 2, q: "What does Kafka's message retention allow that a classic queue doesn't?", o: ["Encryption", "Replaying old events — new consumers can read history", "Priorities", "Smaller messages"], a: 1, e: "Messages stay for a set time even after being read." },
      { l: 3, q: "What is 'exactly-once' processing, and is it easy?", o: ["The default everywhere", "Each message affects the result exactly once; it needs idempotent writes or transactions — hard end to end", "Sending every message twice", "Only possible with RabbitMQ"], a: 1, e: "Most systems use at-least-once plus idempotent consumers." },
      { l: 3, q: "Consumer lag keeps growing in Kafka. What does it mean?", o: ["The broker is down", "Consumers process slower than producers write; scale consumers, speed up processing or add partitions", "Messages are lost", "Nothing — it's normal"], a: 1, e: "Alert on lag; it delays every downstream process." },
    ],
    "system-design": [
      { l: 1, q: "What is latency?", o: ["Total requests per second", "The time one request takes from start to finish", "Server memory", "Disk size"], a: 1, e: "Throughput is how many requests per second." },
      { l: 1, q: "Why make app servers stateless?", o: ["To save disk", "So any server can handle any request, making scaling and failover easy", "For security only", "To avoid databases"], a: 1, e: "Store sessions in Redis or a database, not server memory." },
      { l: 2, q: "What is a read replica used for?", o: ["Backups only", "Serving read queries to take load off the primary database", "Handling writes", "Caching images"], a: 1, e: "Reads may be slightly behind (replication lag)." },
      { l: 2, q: "What is rate limiting's main purpose in a system design?", o: ["Speed", "Protecting the system from overload and abuse by capping requests per client", "Encryption", "Logging"], a: 1, e: "Algorithms: token bucket, sliding window." },
      { l: 3, q: "How would you generate unique IDs across many servers without a single database sequence?", o: ["Random 4-digit numbers", "Snowflake-style IDs (timestamp + machine ID + counter) or UUIDs", "Use the server's IP", "Auto-increment on each server"], a: 1, e: "Snowflake IDs are also roughly time-ordered, which helps indexes." },
      { l: 3, q: "What is eventual consistency?", o: ["Data is never consistent", "Replicas may differ briefly but converge to the same value if no new writes happen", "Strong consistency with delays", "A backup strategy"], a: 1, e: "Common in high-availability systems like DynamoDB and Cassandra." },
    ],
    testing: [
      { l: 1, q: "What is a regression test?", o: ["A test of new features only", "Re-running tests to make sure old features still work after a change", "A performance test", "A manual check"], a: 1, e: "Automated regression suites run in CI on every change." },
      { l: 1, q: "What does an assertion do in a test?", o: ["Logs output", "Checks that an actual result matches the expected one, failing the test if not", "Runs setup code", "Mocks a class"], a: 1, e: "e.g. assertEquals(900, discount(1000, 10))." },
      { l: 2, q: "What is the AAA pattern in tests?", o: ["Async, await, assert", "Arrange, Act, Assert", "API, auth, audit", "Add, alter, apply"], a: 1, e: "Set up data, run the code, check the result — readable tests." },
      { l: 2, q: "What is a flaky test?", o: ["A slow test", "A test that sometimes passes and sometimes fails without code changes", "A skipped test", "A test with no assertions"], a: 1, e: "Common causes: timing, shared state, real network calls." },
      { l: 3, q: "What is contract testing (e.g. Pact)?", o: ["Legal review of APIs", "Verifying a provider API still meets what its consumers expect, without full end-to-end tests", "Load testing", "UI snapshot testing"], a: 1, e: "Useful between microservices owned by different teams." },
      { l: 3, q: "What does mutation testing measure?", o: ["Code speed", "How good tests are, by changing code slightly and checking if tests fail", "Memory usage", "Coverage percentage only"], a: 1, e: "Surviving mutants reveal weak assertions. Tool: PIT for Java." },
    ],
    security: [
      { l: 1, q: "What does HTTPS protect?", o: ["Server CPU", "Data in transit — it's encrypted and the server's identity is verified", "Passwords in the database", "Against SQL injection"], a: 1, e: "HTTPS doesn't fix application bugs like injection or broken access control." },
      { l: 1, q: "What is the principle of least privilege?", o: ["Give admins all access", "Give each user or service only the access it needs", "Use one shared account", "Disable logging"], a: 1, e: "Limits damage if credentials are stolen." },
      { l: 2, q: "How should API keys and DB passwords be stored?", o: ["In Git", "In a secrets manager or environment variables injected at runtime", "In frontend code", "In the README"], a: 1, e: "Rotate any secret that was ever committed." },
      { l: 2, q: "What does CSRF exploit?", o: ["Weak passwords", "The browser automatically sending cookies with requests from another site", "SQL queries", "Open ports"], a: 1, e: "Fix with CSRF tokens and SameSite cookies." },
      { l: 3, q: "Why is a long-lived JWT in localStorage risky?", o: ["It's too large", "Any XSS script can steal it, and it stays valid until expiry", "Browsers delete it", "It breaks CORS"], a: 1, e: "Prefer short-lived access tokens and HttpOnly refresh cookies." },
      { l: 3, q: "What is the main SSRF defence for a 'fetch this URL' feature?", o: ["Longer timeouts", "Allow-list destinations and block internal/metadata IP ranges", "Use POST", "Compress responses"], a: 1, e: "On AWS also require IMDSv2." },
    ],
    git: [
      { l: 1, q: "What does git status show?", o: ["Commit history", "Changed, staged and untracked files in your working directory", "Remote branches only", "Who is online"], a: 1, e: "Run it often before committing." },
      { l: 1, q: "What is .gitignore for?", o: ["Deleting files", "Listing files Git should not track, like build output and secrets", "Ignoring merge conflicts", "Hiding branches"], a: 1, e: "Already-tracked files need git rm --cached to stop tracking." },
      { l: 2, q: "What does git stash do?", o: ["Deletes changes", "Saves uncommitted changes aside so you can switch branches, then restore them", "Pushes to the remote", "Creates a tag"], a: 1, e: "git stash pop brings them back." },
      { l: 2, q: "What is the difference between git fetch and git pull?", o: ["None", "fetch downloads remote changes without merging; pull fetches and merges", "pull only works on main", "fetch deletes local branches"], a: 1, e: "fetch is safe to run any time." },
      { l: 3, q: "Why should you avoid git push --force on shared branches?", o: ["It's slow", "It rewrites remote history and can delete teammates' commits", "It needs admin rights", "It skips CI"], a: 1, e: "Use --force-with-lease, and only on your own branches." },
      { l: 3, q: "What does git cherry-pick do?", o: ["Deletes a commit", "Applies the changes from a specific commit onto your current branch", "Merges two repos", "Squashes commits"], a: 1, e: "Handy for backporting a fix to a release branch." },
    ],
    linux: [
      { l: 1, q: "Which command shows disk space usage of mounted file systems?", o: ["du -h", "df -h", "ls -l", "free -h"], a: 1, e: "du -sh * shows sizes of folders; free -h shows memory." },
      { l: 1, q: "What does sudo do?", o: ["Switches users permanently", "Runs one command with administrator (root) privileges", "Shuts down the system", "Edits files"], a: 1, e: "Who may use it is set in /etc/sudoers." },
      { l: 2, q: "What does the pipe | do in a shell?", o: ["Runs commands in parallel", "Sends one command's output as input to the next", "Saves output to a file", "Comments out a line"], a: 1, e: "e.g. grep ERROR app.log | wc -l." },
      { l: 2, q: "What does set -euo pipefail do in a bash script?", o: ["Enables colours", "Stops on errors, unset variables and failed pipeline steps", "Runs as root", "Hides output"], a: 1, e: "Makes scripts fail fast instead of continuing silently." },
      { l: 3, q: "An app gets 'Too many open files'. What is likely and how do you check?", o: ["Disk full; run df", "It hit the file-descriptor limit; check ulimit -n and lsof -p <pid>", "Out of CPU; run top", "Bad permissions; run chmod"], a: 1, e: "Often caused by leaked connections or files not being closed." },
      { l: 3, q: "What does the OOM killer do?", o: ["Kills idle users", "When memory runs out, the kernel kills a process to free memory", "Cleans temp files", "Restarts services"], a: 1, e: "Check dmesg for 'Out of memory: Killed process'." },
    ],
    devops: [
      { l: 1, q: "What is a container registry?", o: ["A list of servers", "A store for container images, e.g. Docker Hub, ECR", "A logging tool", "A DNS service"], a: 1, e: "CI pushes images; Kubernetes pulls them." },
      { l: 1, q: "What does continuous delivery add on top of continuous integration?", o: ["Code reviews", "Keeping every passing build ready to release to production at any time", "Manual testing", "Monitoring"], a: 1, e: "Continuous deployment goes further and releases automatically." },
      { l: 2, q: "What is a blue-green deployment?", o: ["Two colour themes", "Two identical environments; switch traffic to the new one and switch back instantly if needed", "Deploying twice a day", "A testing tool"], a: 1, e: "Canary releases send a small % of traffic first." },
      { l: 2, q: "What does a Kubernetes Service do?", o: ["Builds images", "Gives a set of pods one stable address and load-balances traffic between them", "Stores secrets", "Schedules cron jobs"], a: 1, e: "Ingress or Gateway exposes services outside the cluster." },
      { l: 3, q: "Why set CPU and memory requests and limits on Kubernetes pods?", o: ["For logging", "So the scheduler places pods correctly and one pod can't starve others", "To speed up builds", "They're cosmetic"], a: 1, e: "Exceeding the memory limit gets the container OOMKilled." },
      { l: 3, q: "What is GitOps?", o: ["Using Git for docs", "Git holds the desired deployment state and a tool (Argo CD, Flux) keeps the cluster matching it", "Running Git on servers", "A branching strategy"], a: 1, e: "Every change is a reviewed pull request and easy to roll back." },
    ],
    terraform: [
      { l: 1, q: "What does terraform init do?", o: ["Creates resources", "Downloads providers and modules and sets up the state backend", "Deletes state", "Formats code"], a: 1, e: "Run it first in a new folder or after adding providers." },
      { l: 1, q: "What is a Terraform provider?", o: ["A cloud account", "A plugin that lets Terraform manage a platform's resources (AWS, Azure, GitHub…)", "A state file", "A module registry"], a: 1, e: "Pin provider versions for repeatable builds." },
      { l: 2, q: "What are Terraform outputs used for?", o: ["Logging errors", "Exposing values (like a load balancer URL) to users or other modules", "Storing secrets", "Running scripts"], a: 1, e: "Mark sensitive outputs with sensitive = true." },
      { l: 2, q: "What does terraform import do?", o: ["Imports modules", "Brings an existing, manually created resource under Terraform management", "Copies state between workspaces", "Downloads providers"], a: 1, e: "Newer versions support import blocks and config generation." },
      { l: 3, q: "How do you stop Terraform from ever deleting a critical database?", o: ["Don't run plan", "lifecycle { prevent_destroy = true } plus the cloud's deletion protection", "Use count = 0", "Remove it from state"], a: 1, e: "And require reviewed plans before apply in CI." },
      { l: 3, q: "Why can Terraform state contain sensitive data?", o: ["It stores your Git history", "It records resource attributes, which can include generated passwords and keys", "It stores your SSH keys", "It doesn't"], a: 1, e: "Encrypt the backend and restrict who can read it." },
    ],
    aws: [
      { l: 1, q: "What is Amazon S3 used for?", o: ["Running containers", "Storing objects/files such as images, backups and logs", "Relational databases", "DNS"], a: 1, e: "Highly durable; use lifecycle rules to move old data to cheaper tiers." },
      { l: 1, q: "What is IAM?", o: ["A database", "Identity and Access Management — users, roles and permissions", "A monitoring tool", "A CDN"], a: 1, e: "Prefer roles with short-lived credentials over long-lived access keys." },
      { l: 2, q: "What is RDS?", o: ["A cache", "A managed relational database service (MySQL, PostgreSQL, etc.)", "A container service", "A file system"], a: 1, e: "AWS handles backups, patching and Multi-AZ failover." },
      { l: 2, q: "What does an Application Load Balancer do?", o: ["Stores files", "Routes HTTP(S) traffic to healthy targets, by path or host if needed", "Runs functions", "Manages DNS records"], a: 1, e: "NLB handles TCP/UDP at very high throughput." },
      { l: 3, q: "How do you make an app highly available across failures of one data centre?", o: ["One large EC2 instance", "Run instances in multiple Availability Zones behind a load balancer, with a Multi-AZ database", "Use a bigger region", "Take daily snapshots"], a: 1, e: "Multi-region adds protection against a whole-region outage." },
      { l: 3, q: "What is the difference between SQS and SNS?", o: ["None", "SQS is a queue consumers pull from; SNS pushes each message to many subscribers (fan-out)", "SNS stores files", "SQS sends emails"], a: 1, e: "SNS → multiple SQS queues is a common fan-out pattern." },
    ],
    observability: [
      { l: 1, q: "What is a metric?", o: ["A log line", "A number measured over time, like requests per second or CPU usage", "A trace span", "An alert"], a: 1, e: "Stored in tools like Prometheus and graphed in Grafana." },
      { l: 1, q: "What is an SLA?", o: ["An internal target", "A contractual promise to customers, often with penalties if missed", "A log format", "A metric type"], a: 1, e: "SLOs are usually stricter than the SLA for a safety margin." },
      { l: 2, q: "Why use structured (JSON) logs?", o: ["They're smaller", "Tools can search, filter and count fields like userId or traceId", "They're required by Java", "They encrypt data"], a: 1, e: "Never log passwords or card numbers." },
      { l: 2, q: "What are the four golden signals?", o: ["CPU, RAM, disk, network", "Latency, traffic, errors and saturation", "Logs, metrics, traces, alerts", "Dev, test, stage, prod"], a: 1, e: "From Google's SRE book." },
      { l: 3, q: "What makes an alert actionable?", o: ["It fires often", "It reflects user impact, needs a human now, and links to a runbook", "It covers every metric", "It goes to everyone"], a: 1, e: "Noisy alerts cause alert fatigue." },
      { l: 3, q: "What is a blameless postmortem?", o: ["Skipping the review", "An incident review focused on system causes and fixes, not blaming people", "A legal report", "Only for outages over a day"], a: 1, e: "Honest timelines lead to real fixes." },
    ],
    networking: [
      { l: 1, q: "What is an IP address?", o: ["A website name", "A numeric address that identifies a device on a network", "A port number", "A MAC address"], a: 1, e: "IPv4 like 192.168.1.10; IPv6 is much longer." },
      { l: 1, q: "What does 127.0.0.1 (localhost) refer to?", o: ["Google's DNS", "The same machine you're on", "The router", "A public server"], a: 1, e: "Requests to localhost never leave your computer." },
      { l: 2, q: "What does a reverse proxy do?", o: ["Hides the client from the server", "Receives requests for backend servers and forwards them — adding TLS, caching or load balancing", "Blocks all traffic", "Assigns IP addresses"], a: 1, e: "Examples: Nginx, HAProxy, cloud load balancers." },
      { l: 2, q: "What is a CDN edge server?", o: ["The origin database", "A server near users that caches and serves content quickly", "A DNS root server", "A firewall"], a: 1, e: "Cuts latency and origin load." },
      { l: 3, q: "Why do WebSockets start with an HTTP request?", o: ["They don't", "The client sends an HTTP Upgrade request, then the connection switches to a two-way WebSocket", "For caching", "To get a cookie only"], a: 1, e: "Proxies and load balancers must support the upgrade." },
      { l: 3, q: "What does HTTP/3 change at the transport layer?", o: ["Nothing", "It runs over QUIC (on UDP) instead of TCP, avoiding head-of-line blocking", "It drops encryption", "It uses FTP"], a: 1, e: "Faster on lossy mobile networks." },
    ],
    python: [
      { l: 1, q: "How do you create a virtual environment?", o: ["pip install venv", "python -m venv .venv", "python --env", "virtualenv is built into pip"], a: 1, e: "Activate it, then pip install your dependencies." },
      { l: 1, q: "What is the output of len({1, 2, 2, 3})?", o: ["4", "3", "2", "Error"], a: 1, e: "Sets keep only unique values." },
      { l: 2, q: "What does a decorator do?", o: ["Formats strings", "Wraps a function to add behaviour without changing its code", "Defines a class", "Imports modules"], a: 1, e: "e.g. @functools.lru_cache, @app.get in FastAPI." },
      { l: 2, q: "What is the difference between is and ==?", o: ["None", "is checks identity (same object); == checks equal values", "== checks identity", "is compares types"], a: 1, e: "Use is only for None and singletons." },
      { l: 3, q: "What does a context manager (with) guarantee?", o: ["Faster code", "Cleanup code runs even if an exception occurs", "Thread safety", "Lazy loading"], a: 1, e: "Files close and locks release automatically." },
      { l: 3, q: "What does Pydantic do in FastAPI?", o: ["Runs the server", "Validates and parses request data from type hints, returning 422 for invalid input", "Manages databases", "Handles authentication"], a: 1, e: "It also generates the OpenAPI schema." },
    ],
    "data-engineering": [
      { l: 1, q: "What is a data pipeline?", o: ["A database index", "An automated flow that moves and transforms data from sources to a destination", "A network cable", "A BI dashboard"], a: 1, e: "Often scheduled with Airflow." },
      { l: 1, q: "What is a data lake?", o: ["A relational database", "Cheap storage (like S3) for raw data in any format", "A cache", "A message queue"], a: 1, e: "Lakehouses add tables and transactions on top." },
      { l: 2, q: "What is Apache Airflow used for?", o: ["Storing data", "Scheduling and monitoring pipeline tasks defined as DAGs", "Streaming video", "Running SQL only"], a: 1, e: "Tasks have dependencies, retries and alerts." },
      { l: 2, q: "What is a slowly changing dimension (Type 2)?", o: ["A slow query", "Keeping history by adding a new row with valid-from/valid-to dates when an attribute changes", "Deleting old rows", "A partitioning scheme"], a: 1, e: "Past facts still join to the old value." },
      { l: 3, q: "What is Change Data Capture (CDC)?", o: ["Copying whole tables nightly", "Streaming every insert, update and delete from a database's log as it happens", "A data quality check", "A compression method"], a: 1, e: "Example: Debezium reading MySQL's binlog into Kafka." },
      { l: 3, q: "What does dbt add to SQL transformations?", o: ["A new database", "Version-controlled SQL models with tests, documentation and dependency ordering", "Streaming", "GPU support"], a: 1, e: "Tests like not_null and unique fail the pipeline before bad data spreads." },
    ],
    ai: [
      { l: 1, q: "What is a context window?", o: ["The chat UI", "The maximum amount of text (tokens) a model can consider at once", "A model's training data", "A GPU setting"], a: 1, e: "Prompt plus answer must fit inside it." },
      { l: 1, q: "What does temperature control?", o: ["GPU heat", "How random or creative the output is", "Response length", "Model size"], a: 1, e: "Low for facts and code, higher for creative text." },
      { l: 2, q: "What is a vector database used for?", o: ["Storing images only", "Finding the most similar embeddings quickly, for semantic search and RAG", "Training models", "Caching HTTP"], a: 1, e: "Examples: pgvector, Pinecone, Weaviate." },
      { l: 2, q: "What is tool (function) calling?", o: ["Calling the model twice", "The model returns a structured request to call a function you defined; your code runs it", "A plugin store", "A way to fine-tune"], a: 1, e: "The basis of AI agents." },
      { l: 3, q: "What are evals in AI engineering?", o: ["Performance reviews", "Automated tests that score model output quality on a fixed set of examples", "Model training runs", "Cost reports"], a: 1, e: "Run them before and after changing prompts or models." },
      { l: 3, q: "Why chunk documents before embedding them for RAG?", o: ["To save disk", "Smaller focused chunks retrieve more precisely and fit in the context window", "Models can't read PDFs", "It's required by law"], a: 1, e: "Tune chunk size and overlap; keep source metadata for citations." },
    ],
  };
  const bank = root.ROLE_TEST || (typeof require !== "undefined" ? require("./role-test-data-3.js") : null);
  for (const [id, qs] of Object.entries(extra)) bank.topics[id].q.push(...qs);
  if (typeof module !== "undefined" && module.exports) module.exports = bank;
})(typeof window !== "undefined" ? window : globalThis);
