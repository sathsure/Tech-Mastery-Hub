/** Display names for topic ids, shared by the web app, chat suggestions and the roadmap generator. */
export const TOPIC_LABELS: Record<string, string> = {
  javascript: "JavaScript", typescript: "TypeScript", html: "HTML", css: "CSS", angular: "Angular", react: "React",
  rxjs: "RxJS", nodejs: "Node.js", java: "Java", spring: "Spring Boot", "spring-security": "Spring Security",
  "spring-cloud": "Spring Cloud", microservices: "Microservices", "rest-api": "REST API", "database/sql": "SQL",
  devops: "DevOps", aws: "AWS", "web-architecture": "Web Architecture", "web-vitals": "Web Vitals",
  dsa: "DSA (Python)", messaging: "Kafka & RabbitMQ", ai: "AI & LLMs", "under-the-hood": "Under the Hood",
  "system-design": "System Design", "design-patterns": "Design Patterns", testing: "Testing", git: "Git",
  caching: "Caching & Redis", networking: "Networking & HTTP", behavioral: "Behavioral & HR",
  "it-roles": "IT Roles", "it-terminology": "Glossary", "tech-stack": "Tech Stack", "it-careers": "Careers & Salary",
  roadmaps: "Roadmaps",
};

export const topicLabel = (topic: string): string => TOPIC_LABELS[topic] ?? topic;

/** One line on what each topic covers; shown before its list of sections. */
export const TOPIC_DESCRIPTIONS: Record<string, string> = {
  javascript: "The language of the web: types, scope and closures, the event loop, async code and the DOM.",
  typescript: "JavaScript with static types: type annotations, interfaces, generics and compiler settings.",
  html: "The structure of web pages: elements, semantics, forms, accessibility and browser behaviour.",
  css: "Styling and layout: the box model, selectors, Flexbox, Grid, responsive design and animation.",
  angular: "Google's TypeScript framework: components, modules, dependency injection, routing and change detection.",
  react: "A library for building UIs from components: JSX, state, hooks, rendering and performance.",
  rxjs: "Reactive programming with observables: operators, subjects and handling async streams.",
  nodejs: "JavaScript on the server: the runtime, modules, streams, the event loop and building APIs.",
  java: "Core Java for backend work: OOP, collections, Java 8+ features, concurrency and the JVM.",
  spring: "Spring Boot for Java services: dependency injection, auto-configuration, REST, data access and testing.",
  "spring-security": "Securing Spring applications: authentication, authorization, JWT, OAuth2 and filters.",
  "spring-cloud": "Spring tools for microservices: configuration, discovery, gateways and resilience.",
  microservices: "Building systems as small services: design, communication, data, resilience and deployment.",
  "rest-api": "Designing HTTP APIs: resources, methods, status codes, versioning and security.",
  "database/sql": "Relational databases and SQL: queries, joins, indexes, transactions and tuning.",
  devops: "Shipping and running software: CI/CD, containers, infrastructure and monitoring.",
  aws: "Amazon Web Services: core compute, storage, networking and deployment services.",
  "web-architecture": "How web applications fit together: clients, servers, caching, scaling and rendering choices.",
  "web-vitals": "Measuring and improving page experience: loading, interactivity and visual stability.",
  dsa: "Data structures and algorithms for coding interviews: Big O, patterns and LeetCode problems solved in Python.",
  messaging: "Asynchronous messaging: RabbitMQ task queues, Kafka event streams, and when to choose which.",
  "under-the-hood": "How software works internally: compilers, interpreters, JIT and AOT, runtimes, and how code reaches the CPU and memory.",
  ai: "AI for developers: LLMs, tokens, RAG, embeddings, vector databases, agents, MCP and Spring Boot integration.",
  "system-design": "Designing systems that scale: load balancers, caches, databases, classic design questions and distributed-systems basics.",
  "design-patterns": "Code that is easy to change: the SOLID principles and the most used design patterns, with Java examples.",
  testing: "Testing with confidence: the test pyramid, JUnit 5, Mockito, Spring Boot tests and frontend testing.",
  git: "Version control with Git: everyday commands, branching, merge vs rebase, and undoing mistakes.",
  caching: "Making systems fast: caching strategies, eviction and invalidation, and Redis in practice.",
  networking: "How the web works underneath: DNS, TCP/UDP, HTTP versions, HTTPS, cookies, CORS and real-time communication.",
  behavioral: "Non-technical interview rounds: the STAR method, behavioral stories and HR questions.",
  "it-roles": "What each IT job involves: day-to-day work, skills, tools, experience needed and where it leads.",
  "it-terminology": "Short definitions of the terms you hear at work and in interviews, grouped by area (SDLC, frontend, backend, cloud, AI, security, business).",
  "tech-stack": "Which tools and technologies are used at each layer of a system, and what each one is for.",
  "it-careers": "Career ladders, salary ranges in India (LPA) by role and experience, and working abroad.",
  roadmaps: "Step-by-step learning paths: study paths per topic and roadmaps per job role.",
};

export const topicDescription = (topic: string): string | null => TOPIC_DESCRIPTIONS[topic] ?? null;
