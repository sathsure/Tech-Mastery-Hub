# IT Roles & Terminology Atlas

> One-stop reference for IT career hierarchy, roles, terminology, languages, frameworks and tools. Generated from `it-atlas-data.js` — edit the data file, then re-run `node export-markdown.js`.

## Career Hierarchy

### Individual Contributor (Technical) Track

| Level | Title | Also called | Typical years | Scope |
|---|---|---|---|---|
| L1 | Intern / Trainee | Graduate Trainee, Apprentice | 0 | Learns basics; works on small, guided tasks. |
| L2 | Junior / Associate Software Engineer | SE I, Programmer Analyst | 0–2 | Delivers well-defined tasks with code review and guidance. |
| L3 | Software Engineer | SE II, Developer | 2–4 | Owns features end-to-end inside one team; works independently. |
| L4 | Senior Software Engineer | SE III, Sr. Developer | 4–8 | Owns components, designs solutions, mentors juniors, handles production issues. |
| L5 | Lead / Tech Lead | Lead Engineer, Module Lead | 6–10 | Sets technical direction for a team; splits work, reviews designs, unblocks people. |
| L6 | Staff Engineer | Senior Lead, Technical Architect | 8–12+ | Solves problems spanning multiple teams; drives standards and large designs. |
| L7 | Principal Engineer / Architect | Solution / Enterprise Architect | 12–15+ | Shapes architecture across an organisation; long-term technical strategy. |
| L8 | Distinguished Engineer / Fellow | Chief Architect | 15+ | Company-wide or industry-level technical influence. |

### Management (People) Track

| Level | Title | Also called | Typical years | Scope |
|---|---|---|---|---|
| M1 | Engineering Manager | Project Manager (service cos.) | 7–10+ | Manages one team: hiring, 1:1s, delivery, performance. |
| M2 | Senior Engineering Manager | Delivery Manager, Program Manager | 10–14+ | Manages several teams or managers; owns delivery of a product area. |
| M3 | Director of Engineering | Associate Director, Head of Engineering | 12–18+ | Owns a department; budgets, org design, cross-team strategy. |
| M4 | VP of Engineering | Senior Director | 15+ | Runs engineering execution for the whole company or business unit. |
| M5 | CTO / CIO | Chief Technology / Information Officer | 15–20+ | Owns technology vision (CTO) or internal IT systems (CIO); reports to CEO. |

- IC = Individual Contributor (technical track). M = Management (people track). Both tracks pay similarly at equal levels.
- Titles and years vary by company. Product companies use L-levels; service companies (TCS, Infosys, Accenture…) use titles like Associate → Senior → Lead → Manager → Senior Manager → AVP → VP.
- Switching between tracks is common around Senior/Lead level.
- Parallel ladders exist for QA, DevOps, Data, Design and Product — same shape: Junior → Mid → Senior → Lead → Principal/Head.

### Same level, different names

Approximate equivalents based on common public title ladders. Companies re-band often, and the same title can sit at different levels across business units — compare scope and pay, not just the title.

| Level | TCS | Infosys | Cognizant | Accenture | Amazon | Google | Microsoft |
|---|---|---|---|---|---|---|---|
| L1 Intern / Trainee | Assistant System Engineer – Trainee | Systems Engineer Trainee | Programmer Analyst Trainee | Associate Software Engineer (trainee) | SDE Intern | SWE Intern | SWE Intern |
| L2 Junior / Associate Software Engineer | Assistant System Engineer | Systems Engineer | Programmer Analyst | Associate Software Engineer (L12) | SDE I (L4) | Software Engineer II (L3) | Software Engineer (59–60) |
| L3 Software Engineer | System Engineer | Senior Systems Engineer | Associate | Software Engineer / Analyst (L11) | SDE I → SDE II | Software Engineer III (L4) | Software Engineer II (61–62) |
| L4 Senior Software Engineer | IT Analyst | Technology Analyst | Senior Associate | Senior Software Engineer (L10) | SDE II (L5) | Senior Software Engineer (L5) | Senior Software Engineer (63–64) |
| L5 Lead / Tech Lead | Assistant Consultant | Technology Lead | Senior Associate / Tech Lead | Team Lead / Associate Manager (L9–L8) | Senior SDE (L6) | Senior SWE / Tech Lead (L5–L6) | Senior SWE (64) |
| L6 Staff Engineer | Associate Consultant | Technology Architect | Manager / Architect | Manager (L7) | Senior SDE (L6) | Staff Software Engineer (L6) | Principal Software Engineer (65–66) |
| L7 Principal Engineer / Architect | Consultant / Senior Consultant | Senior Technology Architect | Senior Manager / Senior Architect | Senior Manager (L6) | Principal SDE (L7) | Senior Staff / Principal (L7–L8) | Principal (67) / Partner (68+) |
| L8 Distinguished Engineer / Fellow | Chief Architect / Distinguished Engineer | Distinguished Technologist / Fellow | Distinguished Architect | Principal Director / Fellow | Senior Principal / Distinguished (L8–L10) | Distinguished Engineer / Fellow (L9–L10) | Distinguished Engineer / Technical Fellow |
| M1 Engineering Manager | Project Manager | Project Manager | Manager – Projects | Associate Manager / Manager (L8–L7) | Software Development Manager (SDM) | Engineering Manager | Software Engineering Manager |
| M2 Senior Engineering Manager | Senior Project Manager / Delivery Manager | Senior Project Manager / Delivery Manager | Senior Manager | Senior Manager (L6) | Senior SDM (L7) | Senior Engineering Manager | Principal Engineering Manager |
| M3 Director of Engineering | Delivery Head / Program Director | Senior Delivery Manager / AVP | Associate Director / Director | Associate Director (L5) | Director (L8) | Director of Engineering | Partner Director |
| M4 VP of Engineering | Vice President / Business Unit Head | Vice President / Delivery Head | Vice President | Managing Director | Vice President (L10) | VP of Engineering | Corporate Vice President |
| M5 CTO / CIO | CTO / CIO | CTO / CIO | CTO / CIO | CTO / Chief Information Officer | CTO (Amazon) / CIO | SVP / CTO | CTO / EVP |

## IT Roles

### AI-Era & Emerging Roles

New roles created by GenAI, agents and new tech.

#### Forward Deployed Engineer (FDE) (New)

Engineer embedded with a customer to build and deploy the company's product (often AI) into the customer's real systems.

- **Also called:** Forward Deployed Software Engineer, Deployment Strategist, Solutions Engineer (AI), Customer-embedded AI Engineer
- **At IT services firms (TCS, Infosys, Wipro, Accenture):** AI Solutions Consultant / Implementation Lead
- **At product / Big Tech companies:** FDE (Palantir, OpenAI, Anthropic, Scale AI)
- **At startups:** Founding / Customer Engineer
- **Typical experience to be hired:** 3+ yrs
- **Next moves — grow:** AI Solutions Architect, Tech Lead · **lead:** Engineering Manager · **pivot:** AI Product Manager, Solutions / Sales Engineer
- **Why it exists now:** Popularised by Palantir; now hired by OpenAI, Anthropic, Scale AI and AI startups because enterprise AI only creates value once wired into messy real-world data and workflows.
- **Languages:** Python, TypeScript, SQL, Java/Go (varies)
- **Frameworks / Standards:** LLM SDKs (Claude, OpenAI), FastAPI, React/Next.js, MCP, LangGraph, Palantir Foundry/AIP
- **Tools:** AWS/Azure/GCP, Docker, Git, Jupyter, Postman, Customer data platforms
- **Technical skills:** Rapid prototyping, Full-stack development, Data integration & ETL, API integration with legacy systems, RAG & agent building, Debugging in customer environments, Solution scoping, Deployment & security reviews
- **Soft skills:** Customer discovery, Executive communication, Ownership, Comfort with ambiguity, Travel / on-site work
- **AI impact:** Core of AI go-to-market — turns a model into a working customer solution.

#### AI Agent Engineer (New)

Builds autonomous AI agents that plan, call tools and complete multi-step tasks.

- **Also called:** Agentic AI Engineer, LLM Application Engineer, AI Workflow Engineer
- **At IT services firms (TCS, Infosys, Wipro, Accenture):** GenAI Developer / Agentic AI Consultant
- **At product / Big Tech companies:** Software Engineer, Applied AI / Agents
- **At startups:** AI Engineer
- **Typical experience to be hired:** 2+ yrs
- **Next moves — grow:** AI / LLM Engineer, AI Solutions Architect · **lead:** Engineering Manager · **pivot:** Forward Deployed Engineer (FDE), AI Evaluation (Evals) Engineer
- **Narrower (sideways) roles:** Context / Prompt Engineer, AI Automation Engineer
- **Why it exists now:** LLMs gained reliable tool calling (2024–26), so companies now automate whole workflows, not single prompts.
- **Languages:** Python, TypeScript, Java
- **Frameworks / Standards:** LangGraph, Claude Agent SDK, OpenAI Agents SDK, CrewAI, AutoGen, Spring AI, MCP, A2A protocol
- **Tools:** Claude / GPT / Gemini APIs, Vector DBs, Langfuse / LangSmith, Temporal, Redis
- **Technical skills:** Tool / function calling, Agent planning & memory, Multi-agent orchestration, State management, Error handling & retries, Human-in-the-loop design, Guardrails, Cost & latency control, Agent evaluation
- **Soft skills:** Systems thinking, Risk awareness, Product sense
- **AI impact:** AI-native role — exists because of agentic AI.

#### Context / Prompt Engineer (New)

Designs the prompts, instructions, examples and retrieved context an AI model sees.

- **Also called:** Prompt Engineer, Context Engineer, LLM Prompt Designer
- **At IT services firms (TCS, Infosys, Wipro, Accenture):** GenAI Prompt Specialist
- **At product / Big Tech companies:** Applied AI Engineer (prompting & retrieval)
- **At startups:** AI Engineer
- **Typical experience to be hired:** 1+ yrs
- **Next moves — grow:** AI Agent Engineer, AI / LLM Engineer · **lead:** — · **pivot:** AI Evaluation (Evals) Engineer, Conversational AI Designer
- **Why it exists now:** Output quality depends heavily on context; prompt engineering has grown into 'context engineering' (what data, tools and memory to feed the model).
- **Languages:** Python, Markdown, JSON / YAML
- **Frameworks / Standards:** RAG, Few-shot prompting, Chain-of-thought, Structured outputs (JSON Schema), DSPy
- **Tools:** Model playgrounds / Workbench, promptfoo, Langfuse, Vector DBs
- **Technical skills:** Prompt design & versioning, Context window management, Retrieval tuning, Output formatting, Prompt testing & A/B, Prompt-injection defence, Domain knowledge capture
- **Soft skills:** Clear writing, Experimentation mindset, Attention to detail
- **AI impact:** Increasingly merged into AI Engineer and Agent Engineer roles.

#### AI Evaluation (Evals) Engineer (New)

Measures whether AI outputs are correct, safe and improving between versions.

- **Also called:** LLM Evaluation Engineer, AI Quality Engineer, Model Evaluation Scientist
- **At IT services firms (TCS, Infosys, Wipro, Accenture):** GenAI Test / Quality Engineer
- **At product / Big Tech companies:** Research Engineer, Evals / Applied AI Quality
- **At startups:** AI Engineer (evals)
- **Typical experience to be hired:** 2+ yrs
- **Next moves — grow:** AI / LLM Engineer, AI Red Teamer / AI Safety Engineer · **lead:** Engineering Manager · **pivot:** Machine Learning Engineer, Responsible AI / AI Governance Lead
- **Why it exists now:** AI output is non-deterministic; teams need automated tests ('evals') before shipping model or prompt changes.
- **Languages:** Python, SQL
- **Frameworks / Standards:** Ragas, DeepEval, OpenAI Evals, LLM-as-judge, Inspect
- **Tools:** Braintrust, LangSmith, Langfuse, promptfoo, Weights & Biases
- **Technical skills:** Test-set (golden dataset) design, Metrics: accuracy, groundedness, relevance, LLM-as-judge setup, Regression tracking, Statistics, Human review workflows, Error analysis
- **Soft skills:** Critical thinking, Rigor, Communication of results
- **AI impact:** AI-native role — the 'QA' of AI systems.

#### AI Red Teamer / AI Safety Engineer (New)

Attacks and stress-tests AI systems to find harmful, unsafe or insecure behaviour.

- **Also called:** AI Red Team Specialist, Trust & Safety Engineer (AI), Adversarial ML Engineer
- **At IT services firms (TCS, Infosys, Wipro, Accenture):** AI Security Consultant
- **At product / Big Tech companies:** Red Team / Safety Research Engineer
- **At startups:** AI Security Engineer
- **Typical experience to be hired:** 3+ yrs
- **Next moves — grow:** Responsible AI / AI Governance Lead, Application Security (AppSec) / DevSecOps Engineer · **lead:** — · **pivot:** Penetration Tester / Ethical Hacker, Cloud Security Engineer
- **Why it exists now:** Prompt injection, jailbreaks and data leakage are new attack types; regulation (EU AI Act) requires testing.
- **Languages:** Python
- **Frameworks / Standards:** OWASP Top 10 for LLMs, MITRE ATLAS, NIST AI RMF
- **Tools:** Garak, PyRIT, promptfoo, Guardrails AI, NeMo Guardrails
- **Technical skills:** Jailbreak & prompt-injection testing, Data-leakage testing, Bias & toxicity testing, Agent tool-abuse testing, Writing safety evals, Mitigation design, Reporting findings
- **Soft skills:** Adversarial mindset, Ethics, Clear reporting
- **AI impact:** AI-native security role.

#### AI Product Manager (New)

Decides which AI features to build and how to measure their value and risks.

- **Also called:** Product Manager – AI/ML, GenAI Product Owner, ML Product Manager
- **At IT services firms (TCS, Infosys, Wipro, Accenture):** AI Product Owner / Business Consultant (AI)
- **At product / Big Tech companies:** Product Manager, AI Platform / Applied AI
- **At startups:** Product Lead (AI)
- **Typical experience to be hired:** 4+ yrs
- **Next moves — grow:** — · **lead:** CTO / CIO · **pivot:** Forward Deployed Engineer (FDE), AI Solutions Architect
- **Narrower (sideways) roles:** Product Owner (PO)
- **Why it exists now:** AI products need different decisions: model choice, accuracy targets, cost per request, safety and user trust.
- **Languages:** SQL (basic), Python (helpful)
- **Frameworks / Standards:** Agile, OKRs, AI evaluation basics, Responsible AI
- **Tools:** Jira, Claude / ChatGPT, Model playgrounds, Amplitude, Figma
- **Technical skills:** AI use-case discovery, Model capability & limits, Defining eval metrics, Cost / latency trade-offs, Prototyping with no-code AI, Data requirements, AI UX patterns, Roadmapping
- **Soft skills:** Stakeholder management, Storytelling, Prioritisation
- **AI impact:** AI-native PM specialisation.

#### AI Solutions Architect (New)

Designs end-to-end AI systems — models, data, RAG, agents, security and cost.

- **Also called:** GenAI Architect, AI/ML Solutions Architect, AI Technical Architect
- **At IT services firms (TCS, Infosys, Wipro, Accenture):** GenAI Architect / AI CoE Architect
- **At product / Big Tech companies:** Solutions Architect – AI/ML (cloud vendors)
- **At startups:** Head of AI Engineering
- **Typical experience to be hired:** 8+ yrs
- **Next moves — grow:** Enterprise Architect · **lead:** CTO / CIO · **pivot:** Forward Deployed Engineer (FDE), AI Product Manager
- **Why it exists now:** Enterprises need someone to choose between models, cloud AI services and build-vs-buy options.
- **Languages:** Python, Java/TypeScript
- **Frameworks / Standards:** RAG architectures, Agent patterns, MCP, AWS/Azure Well-Architected (AI lens)
- **Tools:** AWS Bedrock, Azure AI Foundry / Azure OpenAI, Google Vertex AI, Vector DBs, Draw.io
- **Technical skills:** Model selection, RAG & agent design, Data privacy & governance, Cost estimation (tokens, GPUs), Scalability, Security & access control, Integration with enterprise systems
- **Soft skills:** Client communication, Trade-off reasoning, Presentation
- **AI impact:** AI-native architecture role.

#### AI Infrastructure / LLMOps Engineer (New)

Runs and scales model serving, GPUs and AI pipelines in production.

- **Also called:** LLMOps Engineer, LLM Platform Engineer, Inference Engineer, GPU Infrastructure Engineer
- **At IT services firms (TCS, Infosys, Wipro, Accenture):** MLOps / LLMOps Engineer
- **At product / Big Tech companies:** Software Engineer, ML Infrastructure / Inference
- **At startups:** Infra Engineer (AI)
- **Typical experience to be hired:** 3+ yrs
- **Next moves — grow:** Platform Engineer, AI Solutions Architect · **lead:** Engineering Manager · **pivot:** Machine Learning Engineer, Site Reliability Engineer (SRE)
- **Why it exists now:** Self-hosting and serving LLMs needs GPU clusters, fast inference and cost control.
- **Languages:** Python, Go, C++/CUDA (advanced), Bash
- **Frameworks / Standards:** vLLM, TensorRT-LLM, Text Generation Inference, Ray, Kubernetes
- **Tools:** NVIDIA GPUs, Ollama, Triton Inference Server, Prometheus, LiteLLM gateway
- **Technical skills:** Model serving & batching, Quantization, GPU scheduling, Autoscaling inference, Semantic caching, Model routing, Monitoring latency & cost, Fine-tuning pipelines
- **Soft skills:** Problem solving, Cost awareness
- **AI impact:** AI-native infra role; evolved from MLOps / DevOps.

#### AI Automation Engineer (New)

Automates business processes using AI plus workflow tools.

- **Also called:** Intelligent Automation Engineer, AI Workflow Developer, Automation Developer (GenAI)
- **At IT services firms (TCS, Infosys, Wipro, Accenture):** Intelligent Automation Consultant
- **At product / Big Tech companies:** Automation Engineer, Internal Tools
- **At startups:** Ops / Automation Engineer
- **Typical experience to be hired:** 1+ yrs
- **Next moves — grow:** AI Agent Engineer · **lead:** — · **pivot:** Forward Deployed Engineer (FDE), Business Analyst (BA)
- **Narrower (sideways) roles:** Low-Code / RPA Developer
- **Why it exists now:** LLMs can now read emails, documents and forms — so classic RPA is being replaced by AI-powered workflows.
- **Languages:** Python, JavaScript
- **Frameworks / Standards:** n8n, Make, Zapier, Power Automate + Copilot, UiPath (Agentic)
- **Tools:** Claude / OpenAI APIs, Google/Microsoft 365 APIs, Airtable, Webhooks
- **Technical skills:** Process mapping, API integration, Document AI (extraction), Prompting, Error handling, Security of credentials
- **Soft skills:** Business understanding, Communication
- **AI impact:** Evolution of RPA developer.

#### Responsible AI / AI Governance Lead (New)

Sets policies so AI is used legally, fairly and safely across the company.

- **Also called:** AI Ethics Lead, AI Risk Manager, AI Compliance Lead
- **At IT services firms (TCS, Infosys, Wipro, Accenture):** Responsible AI Consultant
- **At product / Big Tech companies:** Responsible AI Program Manager / Policy Lead
- **At startups:** Rare — usually part of Legal or Security
- **Typical experience to be hired:** 8+ yrs
- **Next moves — grow:** Enterprise Architect · **lead:** CTO / CIO · **pivot:** AI Product Manager
- **Narrower (sideways) roles:** GRC / Compliance Analyst
- **Why it exists now:** New laws (EU AI Act, 2024) and standards (ISO 42001) require AI risk management.
- **Languages:** —
- **Frameworks / Standards:** EU AI Act, ISO/IEC 42001, NIST AI RMF, GDPR
- **Tools:** Model cards, AI risk registers, Credo AI, OneTrust
- **Technical skills:** AI risk assessment, Policy writing, Bias & fairness review, Audit & documentation, Vendor AI assessment, Training staff
- **Soft skills:** Ethics, Negotiation, Cross-team influence
- **AI impact:** AI-native governance role.

#### AI Trainer / Data Annotation Specialist (New)

Creates and rates examples that teach and evaluate AI models.

- **Also called:** Data Annotator, RLHF Specialist, AI Tutor, Data Labeling Analyst
- **At IT services firms (TCS, Infosys, Wipro, Accenture):** Data Annotation Analyst / Process Associate
- **At product / Big Tech companies:** AI Trainer (contract), Data Specialist
- **At startups:** Annotation Contractor
- **Typical experience to be hired:** 0+ yrs
- **Next moves — grow:** AI Evaluation (Evals) Engineer, Context / Prompt Engineer · **lead:** — · **pivot:** Data Analyst, Manual QA / Test Engineer
- **Why it exists now:** Models improve through human feedback (RLHF) and expert-written data — in coding, law, medicine and more.
- **Languages:** Python (for coding trainers)
- **Frameworks / Standards:** RLHF, Rubric-based grading
- **Tools:** Scale AI, Labelbox, Surge AI, Label Studio
- **Technical skills:** Writing high-quality examples, Rating model responses, Domain expertise, Following detailed guidelines, Spotting errors & hallucinations
- **Soft skills:** Attention to detail, Consistency
- **AI impact:** AI-native role; demand shifts toward expert domain trainers.

#### Conversational AI Designer (New)

Designs how chatbots and voice assistants talk and behave.

- **Also called:** Conversation Designer, Chatbot Designer, Voice UX Designer
- **At IT services firms (TCS, Infosys, Wipro, Accenture):** Conversational AI Consultant
- **At product / Big Tech companies:** Conversation / Voice Experience Designer
- **At startups:** Product Designer (chat)
- **Typical experience to be hired:** 2+ yrs
- **Next moves — grow:** AI Product Manager · **lead:** — · **pivot:** Context / Prompt Engineer, UI/UX Designer
- **Why it exists now:** Every product is adding chat/voice assistants; their tone, flow and fallback behaviour need design.
- **Languages:** None required (JSON helpful)
- **Frameworks / Standards:** Conversation design, Voice UX
- **Tools:** Voiceflow, Dialogflow CX, Amazon Lex, Figma
- **Technical skills:** Dialog flow design, Persona & tone, Error / fallback handling, Prompt writing, Usability testing of bots
- **Soft skills:** Empathy, Writing
- **AI impact:** Grew from UX writing with GenAI chat.

#### Physical AI / Robotics Engineer (New)

Builds AI that controls robots, drones and autonomous machines.

- **Also called:** Robotics Software Engineer, Embodied AI Engineer, Autonomy Engineer
- **At IT services firms (TCS, Infosys, Wipro, Accenture):** Robotics / Industrial Automation Engineer
- **At product / Big Tech companies:** Software Engineer, Robotics / Autonomy
- **At startups:** Robotics Engineer
- **Typical experience to be hired:** 2+ yrs
- **Next moves — grow:** Tech Lead, AI Solutions Architect · **lead:** Engineering Manager · **pivot:** Machine Learning Engineer, Embedded / Firmware Engineer
- **Why it exists now:** Foundation models for robotics and humanoid robots are a major 2025–26 investment area.
- **Languages:** Python, C++
- **Frameworks / Standards:** ROS 2, PyTorch, NVIDIA Isaac, OpenCV
- **Tools:** Gazebo / Isaac Sim, Jetson, LiDAR & sensors
- **Technical skills:** Computer vision, Motion planning, Reinforcement learning, Sensor fusion, Simulation, Embedded deployment
- **Soft skills:** Hands-on testing, Safety mindset
- **AI impact:** AI-driven growth area.

#### XR (AR/VR) Developer (New)

Builds augmented and virtual reality apps for headsets and phones.

- **Also called:** AR/VR Developer, Unity / Unreal XR Developer, Spatial Computing Engineer
- **At IT services firms (TCS, Infosys, Wipro, Accenture):** XR Developer / Metaverse Consultant
- **At product / Big Tech companies:** Software Engineer, AR/VR
- **At startups:** Unity Developer
- **Typical experience to be hired:** 1+ yrs
- **Next moves — grow:** Tech Lead · **lead:** Engineering Manager · **pivot:** Game Developer, Mobile Developer, Physical AI / Robotics Engineer
- **Why it exists now:** Spatial computing devices (Apple Vision Pro, Meta Quest) opened new app platforms.
- **Languages:** C#, C++, Swift
- **Frameworks / Standards:** Unity, Unreal Engine, visionOS / RealityKit, OpenXR, WebXR
- **Tools:** Meta Quest, Apple Vision Pro, Blender
- **Technical skills:** 3D interaction design, Spatial UI, Performance optimisation, 3D math
- **Soft skills:** Creativity, User empathy
- **AI impact:** AI generates 3D assets and scenes faster.

#### Quantum Software Engineer (New)

Writes algorithms that run on quantum computers.

- **Also called:** Quantum Developer, Quantum Algorithm Engineer, Quantum Computing Researcher
- **At IT services firms (TCS, Infosys, Wipro, Accenture):** Quantum Computing Consultant
- **At product / Big Tech companies:** Quantum Software Engineer / Research Scientist
- **At startups:** Quantum Engineer
- **Typical experience to be hired:** 3+ yrs
- **Next moves — grow:** Tech Lead · **lead:** — · **pivot:** Machine Learning Engineer, Data Scientist
- **Why it exists now:** Early-stage field; cloud access to quantum hardware lets companies experiment now.
- **Languages:** Python, Q#
- **Frameworks / Standards:** Qiskit, Cirq, PennyLane
- **Tools:** IBM Quantum, Amazon Braket, Azure Quantum
- **Technical skills:** Linear algebra, Quantum circuits, Quantum algorithms, Hybrid classical-quantum workflows
- **Soft skills:** Research mindset
- **AI impact:** Niche; research-heavy.

#### Developer Advocate (DevRel) (New)

Helps developers succeed with a platform through content, demos and community.

- **Also called:** Developer Relations Engineer, Developer Evangelist, Community Engineer
- **At IT services firms (TCS, Infosys, Wipro, Accenture):** Rare — Technical Evangelist
- **At product / Big Tech companies:** Developer Advocate / DevRel Engineer
- **At startups:** DevRel / Founding Community Lead
- **Typical experience to be hired:** 3+ yrs
- **Next moves — grow:** Product Manager (PM) · **lead:** Engineering Manager · **pivot:** Solutions / Sales Engineer, Forward Deployed Engineer (FDE)
- **Narrower (sideways) roles:** Technical Writer
- **Why it exists now:** AI and API platforms compete for developers; DevRel drives adoption.
- **Languages:** Python, JavaScript/TypeScript
- **Frameworks / Standards:** Platform SDKs, Docs-as-code
- **Tools:** GitHub, YouTube, Discord, Docusaurus
- **Technical skills:** Sample apps & demos, Technical writing, Public speaking, Community building, Feedback to product teams
- **Soft skills:** Communication, Empathy, Networking
- **AI impact:** In high demand at AI / API companies.

### Software Development

Build applications and services.

#### Frontend Developer

Builds the user interface people see and click in the browser.

- **Also called:** UI Developer, Front-End Engineer, React / Angular Developer, Web Developer
- **At IT services firms (TCS, Infosys, Wipro, Accenture):** UI Developer / Angular Developer
- **At product / Big Tech companies:** Software Engineer, Frontend / SDE (UI)
- **At startups:** Frontend Engineer
- **Typical experience to be hired:** 0+ yrs
- **Next moves — grow:** Full Stack Developer, Tech Lead · **lead:** Engineering Manager · **pivot:** Mobile Developer, AI Agent Engineer, UI/UX Designer, Developer Advocate (DevRel)
- **Languages:** HTML, CSS, JavaScript, TypeScript
- **Frameworks / Standards:** Angular, React, Vue, Next.js, Tailwind CSS, RxJS
- **Tools:** VS Code, Chrome DevTools, npm/pnpm, Vite, Figma, Jest, Playwright, Storybook
- **Technical skills:** Responsive design, Accessibility (WCAG), State management, Web performance (Core Web Vitals), REST/GraphQL integration, Component design, Browser security (XSS, CORS), Unit & E2E testing, SEO basics, Cross-browser testing
- **Soft skills:** Design collaboration, Attention to detail, User empathy
- **AI impact:** AI generates UI code from designs; focus shifts to UX quality, accessibility and review.

#### Backend Developer

Builds server-side logic, APIs and database access.

- **Also called:** Server-side Developer, API Developer, Java / Python / .NET Developer
- **At IT services firms (TCS, Infosys, Wipro, Accenture):** Java Developer / Systems Engineer (Java)
- **At product / Big Tech companies:** Software Engineer / SDE (Backend)
- **At startups:** Backend Engineer
- **Typical experience to be hired:** 0+ yrs
- **Next moves — grow:** Full Stack Developer, Tech Lead, Solution Architect · **lead:** Engineering Manager · **pivot:** AI / LLM Engineer, Data Engineer, Platform Engineer, Forward Deployed Engineer (FDE)
- **Languages:** Java, Python, C#, Go, Node.js (JS/TS), SQL
- **Frameworks / Standards:** Spring Boot, Django, FastAPI, .NET, Express, NestJS, Hibernate/JPA
- **Tools:** IntelliJ, Postman, Maven/Gradle, Docker, Git, Kafka, Redis
- **Technical skills:** REST/GraphQL/gRPC APIs, Database design & SQL tuning, Caching, Authentication & security, Concurrency, Messaging (Kafka/RabbitMQ), Unit & integration testing, Logging & monitoring, Microservices, DSA & Big-O
- **Soft skills:** Problem solving, Ownership, Documentation
- **AI impact:** Adds LLM integration, RAG and tool APIs to the backend skill set.

#### Full Stack Developer

Works on both frontend and backend of an application.

- **Also called:** Full Stack Engineer, MERN / MEAN Developer, Java Full Stack Developer
- **At IT services firms (TCS, Infosys, Wipro, Accenture):** Java Full Stack Developer
- **At product / Big Tech companies:** Software Engineer (generalist)
- **At startups:** Full Stack / Product Engineer
- **Typical experience to be hired:** 0+ yrs
- **Next moves — grow:** Tech Lead, Solution Architect, Cloud Architect · **lead:** Engineering Manager · **pivot:** AI / LLM Engineer, Forward Deployed Engineer (FDE), AI Agent Engineer, Platform Engineer, Product Manager (PM)
- **Narrower (sideways) roles:** Frontend Developer, Backend Developer
- **Languages:** JavaScript/TypeScript, Java or Python or C#, SQL
- **Frameworks / Standards:** Angular/React, Spring Boot/Node.js/.NET, MEAN/MERN stacks
- **Tools:** Git, Docker, Postman, CI/CD, Cloud (AWS/Azure)
- **Technical skills:** End-to-end feature delivery, API design, DB design, Auth (OAuth/JWT), Deployment & CI/CD, Testing across layers, Debugging across stack, Basic cloud & containers
- **Soft skills:** Versatility, Communication, Prioritisation
- **AI impact:** AI coding assistants make one engineer more productive end-to-end.

#### Mobile Developer

Builds apps for Android and iOS phones and tablets.

- **Also called:** Android Developer, iOS Developer, Flutter / React Native Developer
- **At IT services firms (TCS, Infosys, Wipro, Accenture):** Mobile Application Developer
- **At product / Big Tech companies:** Software Engineer, Android / iOS
- **At startups:** Mobile Engineer
- **Typical experience to be hired:** 0+ yrs
- **Next moves — grow:** Full Stack Developer, Tech Lead · **lead:** Engineering Manager · **pivot:** XR (AR/VR) Developer, AI Agent Engineer, Product Manager (PM)
- **Languages:** Kotlin, Java, Swift, Dart, TypeScript
- **Frameworks / Standards:** Android SDK, Jetpack Compose, SwiftUI, Flutter, React Native
- **Tools:** Android Studio, Xcode, Firebase, TestFlight, Fastlane
- **Technical skills:** Mobile UI, Offline storage, Push notifications, App store release, Mobile security, Performance & battery optimisation, API integration, Mobile testing (Espresso/XCTest)
- **Soft skills:** User empathy, Attention to detail
- **AI impact:** On-device AI (Apple Intelligence, Gemini Nano) adds new app features.

#### Embedded / Firmware Engineer

Writes low-level software that runs on hardware devices.

- **Also called:** Firmware Developer, Embedded Software Engineer, Device Driver Engineer
- **At IT services firms (TCS, Infosys, Wipro, Accenture):** Embedded Engineer (ER&D units)
- **At product / Big Tech companies:** Firmware / Embedded Software Engineer
- **At startups:** Hardware-Software Engineer
- **Typical experience to be hired:** 0+ yrs
- **Next moves — grow:** Tech Lead, Solution Architect · **lead:** Engineering Manager · **pivot:** Physical AI / Robotics Engineer, AI Infrastructure / LLMOps Engineer
- **Languages:** C, C++, Rust, Assembly
- **Frameworks / Standards:** RTOS (FreeRTOS, Zephyr), Embedded Linux, Arduino
- **Tools:** Oscilloscope, JTAG debuggers, Keil, GCC
- **Technical skills:** Memory management, Hardware protocols (I2C, SPI, UART, CAN), Real-time systems, Low-power design, Reading datasheets, Firmware updates (OTA), Hardware debugging
- **Soft skills:** Patience, Precision
- **AI impact:** Edge AI (TinyML) brings models onto devices.

#### Game Developer

Builds games — gameplay, graphics, physics and engines.

- **Also called:** Game Programmer, Gameplay Engineer, Unity / Unreal Developer
- **At IT services firms (TCS, Infosys, Wipro, Accenture):** Game Developer (gaming services)
- **At product / Big Tech companies:** Gameplay / Engine Programmer
- **At startups:** Game Developer
- **Typical experience to be hired:** 0+ yrs
- **Next moves — grow:** Tech Lead · **lead:** Engineering Manager · **pivot:** XR (AR/VR) Developer, Physical AI / Robotics Engineer, Full Stack Developer
- **Languages:** C++, C#, Lua
- **Frameworks / Standards:** Unity, Unreal Engine, Godot
- **Tools:** Blender, Visual Studio, Perforce
- **Technical skills:** 3D math, Rendering & shaders, Physics, Performance optimisation, Gameplay scripting, Multiplayer networking
- **Soft skills:** Creativity, Collaboration with artists
- **AI impact:** AI generates assets, NPC dialogue and testing.

#### Mainframe Developer

Maintains core banking/insurance systems on IBM mainframes.

- **Also called:** COBOL Developer, Mainframe Programmer, z/OS Developer
- **At IT services firms (TCS, Infosys, Wipro, Accenture):** Mainframe Developer / Technology Analyst (Mainframe)
- **At product / Big Tech companies:** Mainframe Engineer (banks, insurers)
- **At startups:** Rare
- **Typical experience to be hired:** 0+ yrs
- **Next moves — grow:** Tech Lead, Solution Architect · **lead:** Project Manager · **pivot:** Backend Developer, Cloud Engineer, Data Engineer
- **Languages:** COBOL, JCL, PL/I, REXX
- **Frameworks / Standards:** CICS, IMS
- **Tools:** IBM z/OS, DB2, ISPF, Endevor
- **Technical skills:** Batch processing, VSAM files, DB2 SQL, Legacy modernisation, Debugging production jobs
- **Soft skills:** Reliability, Documentation
- **AI impact:** AI helps translate COBOL to Java (e.g. IBM watsonx Code Assistant).

#### ERP / CRM Developer

Customises business platforms like SAP and Salesforce.

- **Also called:** SAP ABAP Developer, Salesforce Developer, ServiceNow Developer, Dynamics 365 Developer
- **At IT services firms (TCS, Infosys, Wipro, Accenture):** SAP / Salesforce Consultant (technical)
- **At product / Big Tech companies:** Business Systems Engineer
- **At startups:** Salesforce Admin / Developer
- **Typical experience to be hired:** 0+ yrs
- **Next moves — grow:** Solution Architect, Tech Lead · **lead:** Project Manager · **pivot:** Business Analyst (BA), Pre-Sales / Solutions Consultant, AI Automation Engineer
- **Languages:** ABAP (SAP), Apex (Salesforce), X++ (Dynamics), JavaScript
- **Frameworks / Standards:** SAP S/4HANA, Salesforce Lightning, ServiceNow
- **Tools:** SAP GUI, Salesforce DX, ServiceNow Studio
- **Technical skills:** Business processes (finance, HR, sales), Integrations, Configuration over code, Data migration, Reports & workflows
- **Soft skills:** Business understanding, Client communication
- **AI impact:** Platforms add built-in AI agents (Salesforce Agentforce, SAP Joule).

#### Blockchain Developer

Builds smart contracts and decentralised applications.

- **Also called:** Smart Contract Developer, Web3 Engineer, Solidity Developer
- **At IT services firms (TCS, Infosys, Wipro, Accenture):** Blockchain Consultant
- **At product / Big Tech companies:** Software Engineer, Blockchain / Protocol
- **At startups:** Web3 / Protocol Engineer
- **Typical experience to be hired:** 1+ yrs
- **Next moves — grow:** Tech Lead, Solution Architect · **lead:** — · **pivot:** Backend Developer, Full Stack Developer, Application Security (AppSec) / DevSecOps Engineer
- **Languages:** Solidity, Rust, Go, JavaScript
- **Frameworks / Standards:** Ethereum, Hardhat, Hyperledger
- **Tools:** MetaMask, Foundry, Web3.js / ethers.js
- **Technical skills:** Cryptography basics, Smart-contract security, Gas optimisation, Token standards (ERC-20/721), Auditing
- **Soft skills:** Security mindset
- **AI impact:** AI assists smart-contract auditing.

#### Low-Code / RPA Developer

Automates business tasks with visual tools and bots.

- **Also called:** RPA Developer, UiPath / Power Platform Developer, Automation Developer
- **At IT services firms (TCS, Infosys, Wipro, Accenture):** RPA Developer / Automation Consultant
- **At product / Big Tech companies:** Business Automation Engineer
- **At startups:** No-code / Ops Engineer
- **Typical experience to be hired:** 0+ yrs
- **Next moves — grow:** Solution Architect · **lead:** Project Manager · **pivot:** AI Automation Engineer, AI Agent Engineer, Business Analyst (BA)
- **Languages:** VB.NET, C#, Python
- **Frameworks / Standards:** UiPath, Power Automate, Automation Anywhere, OutSystems
- **Tools:** UiPath Studio, Power Apps
- **Technical skills:** Process mapping, Workflow automation, Exception handling, Bot deployment & monitoring
- **Soft skills:** Business understanding
- **AI impact:** Evolving into AI Automation Engineer (agentic automation).

### Data & AI

Collect, analyse and learn from data.

#### Data Analyst

Turns data into reports, dashboards and business answers.

- **Also called:** Business Analyst (Data), Reporting Analyst, MIS Analyst, Product Analyst
- **At IT services firms (TCS, Infosys, Wipro, Accenture):** Data Analyst / MIS Executive
- **At product / Big Tech companies:** Data Analyst / Business Intelligence Analyst
- **At startups:** Growth / Product Analyst
- **Typical experience to be hired:** 0+ yrs
- **Next moves — grow:** Analytics Engineer, Data Scientist · **lead:** Product Manager (PM) · **pivot:** Data Engineer, Business Analyst (BA)
- **Narrower (sideways) roles:** BI Developer
- **Languages:** SQL, Python, R, Excel formulas
- **Frameworks / Standards:** pandas, DAX
- **Tools:** Excel, Power BI, Tableau, Looker
- **Technical skills:** Data cleaning, Visualisation, Statistics basics, KPIs, Excel pivots & lookups, A/B test reading, Dashboard design, Data storytelling
- **Soft skills:** Business curiosity, Presenting insights
- **AI impact:** Natural-language-to-SQL tools speed analysis; storytelling matters more.

#### Analytics Engineer

Builds clean, tested data models that analysts and BI tools use.

- **Also called:** dbt Developer, Data Modeler (analytics), Analytics Data Engineer
- **At IT services firms (TCS, Infosys, Wipro, Accenture):** Data Engineer (analytics)
- **At product / Big Tech companies:** Analytics Engineer
- **At startups:** Data Engineer (dbt)
- **Typical experience to be hired:** 2+ yrs
- **Next moves — grow:** Data Engineer, Data Architect · **lead:** Engineering Manager · **pivot:** Data Scientist, AI / LLM Engineer
- **Narrower (sideways) roles:** BI Developer
- **Languages:** SQL, Python, Jinja
- **Frameworks / Standards:** dbt, Dimensional modelling
- **Tools:** Snowflake, BigQuery, Databricks, Looker, Git
- **Technical skills:** Data modelling, Data testing, Version-controlled SQL, Metrics layer, Documentation
- **Soft skills:** Bridging analysts and engineers
- **AI impact:** Semantic layers feed AI assistants that answer data questions.

#### Data Engineer

Builds pipelines that move and transform data into warehouses and lakes.

- **Also called:** Big Data Engineer, ETL Developer, Data Pipeline Engineer, Spark Developer
- **At IT services firms (TCS, Infosys, Wipro, Accenture):** Big Data Engineer / ETL Developer
- **At product / Big Tech companies:** Data Engineer / Software Engineer, Data
- **At startups:** Data Engineer
- **Typical experience to be hired:** 0+ yrs
- **Next moves — grow:** Data Architect, Tech Lead · **lead:** Engineering Manager · **pivot:** Machine Learning Engineer, MLOps Engineer, AI / LLM Engineer, Platform Engineer
- **Narrower (sideways) roles:** Analytics Engineer, BI Developer
- **Languages:** Python, SQL, Scala, Java
- **Frameworks / Standards:** Apache Spark, Kafka, Airflow, dbt, Flink, Delta Lake / Iceberg
- **Tools:** Snowflake, Databricks, BigQuery, Redshift, AWS Glue
- **Technical skills:** ETL/ELT, Data modelling, Data quality, Batch & streaming, Orchestration, Partitioning & performance, Data governance, Cloud storage (S3/ADLS)
- **Soft skills:** Reliability, Collaboration
- **AI impact:** Builds data pipelines for RAG and AI training data.

#### Data Scientist

Uses statistics and ML to find patterns and make predictions.

- **Also called:** Applied Scientist, Decision Scientist, Statistician, Research Data Scientist
- **At IT services firms (TCS, Infosys, Wipro, Accenture):** Data Scientist / AI Consultant
- **At product / Big Tech companies:** Data Scientist / Applied Scientist (Amazon)
- **At startups:** Data Scientist (often also ML Engineer)
- **Typical experience to be hired:** 1+ yrs
- **Next moves — grow:** Machine Learning Engineer, AI / LLM Engineer · **lead:** AI Product Manager, Engineering Manager · **pivot:** AI Evaluation (Evals) Engineer, Forward Deployed Engineer (FDE)
- **Narrower (sideways) roles:** Data Analyst
- **Languages:** Python, R, SQL
- **Frameworks / Standards:** scikit-learn, pandas, NumPy, XGBoost, TensorFlow/PyTorch
- **Tools:** Jupyter, Databricks, MLflow
- **Technical skills:** Statistics & probability, Feature engineering, Experimentation (A/B tests), Model evaluation, Time-series forecasting, Data visualisation, Causal inference
- **Soft skills:** Curiosity, Business storytelling
- **AI impact:** Shifts from building models to using and evaluating foundation models.

#### Machine Learning Engineer

Puts ML models into production and keeps them working.

- **Also called:** ML Engineer, Applied ML Engineer, Deep Learning Engineer
- **At IT services firms (TCS, Infosys, Wipro, Accenture):** ML Engineer / AI Developer
- **At product / Big Tech companies:** Machine Learning Engineer / SDE (ML)
- **At startups:** ML Engineer
- **Typical experience to be hired:** 2+ yrs
- **Next moves — grow:** AI / LLM Engineer, AI Solutions Architect, Tech Lead · **lead:** Engineering Manager · **pivot:** AI Infrastructure / LLMOps Engineer, Forward Deployed Engineer (FDE), AI Agent Engineer
- **Languages:** Python, Java, C++
- **Frameworks / Standards:** PyTorch, TensorFlow, Hugging Face, ONNX
- **Tools:** MLflow, Kubeflow, SageMaker, Vertex AI, Docker
- **Technical skills:** Model serving, MLOps, Monitoring drift, Scaling inference, Feature pipelines, Fine-tuning, Software engineering best practices
- **Soft skills:** Collaboration with scientists
- **AI impact:** Overlaps strongly with AI Engineer for LLM workloads.

#### AI / LLM Engineer

Builds apps on top of large language models — chatbots, agents, RAG.

- **Also called:** AI Engineer, GenAI Engineer, LLM Engineer, Applied AI Engineer
- **At IT services firms (TCS, Infosys, Wipro, Accenture):** GenAI Developer / GenAI Engineer
- **At product / Big Tech companies:** Software Engineer, Applied AI
- **At startups:** AI Engineer
- **Typical experience to be hired:** 2+ yrs
- **Next moves — grow:** AI Solutions Architect, Tech Lead · **lead:** AI Product Manager, Engineering Manager · **pivot:** Forward Deployed Engineer (FDE), AI Agent Engineer, AI Infrastructure / LLMOps Engineer
- **Narrower (sideways) roles:** Context / Prompt Engineer
- **Languages:** Python, TypeScript, Java
- **Frameworks / Standards:** LangChain, LlamaIndex, Semantic Kernel, Spring AI, MCP SDKs, Vercel AI SDK
- **Tools:** Claude / OpenAI / Gemini APIs, Vector DBs (pgvector, Pinecone), Langfuse / LangSmith
- **Technical skills:** Prompt & context engineering, RAG, Tool calling, Agents, Structured outputs, AI evaluation & safety, Embeddings & vector search, Cost & latency optimisation, Fine-tuning basics
- **Soft skills:** Experimentation, Product sense
- **AI impact:** One of the fastest-growing engineering roles.

#### MLOps Engineer

Automates training, deployment and monitoring of ML models.

- **Also called:** ML Platform Engineer, ML Infrastructure Engineer, Model Ops Engineer
- **At IT services firms (TCS, Infosys, Wipro, Accenture):** MLOps Engineer
- **At product / Big Tech companies:** Software Engineer, ML Platform
- **At startups:** ML Infra Engineer
- **Typical experience to be hired:** 3+ yrs
- **Next moves — grow:** AI Infrastructure / LLMOps Engineer, Platform Engineer · **lead:** Engineering Manager · **pivot:** Machine Learning Engineer, Site Reliability Engineer (SRE)
- **Languages:** Python, Bash, YAML
- **Frameworks / Standards:** Kubeflow, MLflow, Airflow
- **Tools:** Kubernetes, Docker, SageMaker, Weights & Biases
- **Technical skills:** CI/CD for models, Feature stores, Model registry, Model monitoring, Data versioning (DVC), Infrastructure as Code
- **Soft skills:** Process discipline
- **AI impact:** Expanding into LLMOps (prompts, evals, GPU serving).

#### BI Developer

Builds enterprise reporting and data models for business users.

- **Also called:** Power BI Developer, Tableau Developer, Reporting Developer
- **At IT services firms (TCS, Infosys, Wipro, Accenture):** Power BI / Tableau Developer
- **At product / Big Tech companies:** BI Engineer
- **At startups:** Analytics Engineer
- **Typical experience to be hired:** 0+ yrs
- **Next moves — grow:** Analytics Engineer, Data Engineer · **lead:** Project Manager · **pivot:** Data Scientist, Business Analyst (BA)
- **Languages:** SQL, DAX, MDX
- **Frameworks / Standards:** SSIS, SSAS
- **Tools:** Power BI, Tableau, Qlik, SSRS
- **Technical skills:** Star schema, Data warehousing, Dashboard design, Row-level security, Report performance
- **Soft skills:** Requirement gathering
- **AI impact:** Copilot in Power BI / Tableau AI auto-builds reports.

#### Database Administrator (DBA)

Installs, tunes, backs up and secures databases.

- **Also called:** Database Engineer, Oracle / SQL Server DBA, Database Reliability Engineer
- **At IT services firms (TCS, Infosys, Wipro, Accenture):** Oracle DBA / SQL DBA
- **At product / Big Tech companies:** Database Engineer / DBRE
- **At startups:** Usually covered by Backend / DevOps
- **Typical experience to be hired:** 1+ yrs
- **Next moves — grow:** Data Engineer, Data Architect · **lead:** — · **pivot:** Cloud Engineer, Site Reliability Engineer (SRE), Platform Engineer
- **Languages:** SQL, PL/SQL, T-SQL, Bash
- **Frameworks / Standards:** Oracle, SQL Server, PostgreSQL, MySQL, MongoDB
- **Tools:** pgAdmin, SSMS, Oracle Enterprise Manager
- **Technical skills:** Backup & recovery, Replication & HA, Query tuning, Access control, Upgrades & patching, Capacity planning, Cloud DBs (RDS, Azure SQL)
- **Soft skills:** Reliability, Calm under pressure
- **AI impact:** Autonomous / managed databases reduce routine tasks.

### Cloud, DevOps & Infrastructure

Run, ship and scale systems.

#### DevOps Engineer

Automates building, testing and deploying software.

- **Also called:** CI/CD Engineer, DevOps Consultant, Infrastructure Automation Engineer
- **At IT services firms (TCS, Infosys, Wipro, Accenture):** DevOps Engineer / DevOps Consultant
- **At product / Big Tech companies:** Software Engineer, Infrastructure / DevOps
- **At startups:** DevOps / Infra Engineer
- **Typical experience to be hired:** 1+ yrs
- **Next moves — grow:** Platform Engineer, Site Reliability Engineer (SRE), Cloud Architect · **lead:** Engineering Manager · **pivot:** AI Infrastructure / LLMOps Engineer, MLOps Engineer, Application Security (AppSec) / DevSecOps Engineer, Cloud Security Engineer
- **Narrower (sideways) roles:** Release / Build Engineer
- **Languages:** Bash, Python, YAML, Groovy, HCL
- **Frameworks / Standards:** Docker, Kubernetes, Terraform, Ansible
- **Tools:** Jenkins, GitHub Actions, GitLab CI, Argo CD, Helm, SonarQube
- **Technical skills:** CI/CD pipelines, Infrastructure as Code, Containers, Monitoring, Linux administration, Cloud services, Secrets management, Release strategies (blue-green, canary), Git workflows
- **Soft skills:** Collaboration, Automation mindset
- **AI impact:** AI writes pipelines and IaC; engineers review and secure them.

#### Cloud Engineer

Builds and manages infrastructure on AWS, Azure or GCP.

- **Also called:** AWS / Azure / GCP Engineer, Cloud Infrastructure Engineer, Cloud Operations Engineer
- **At IT services firms (TCS, Infosys, Wipro, Accenture):** Cloud Engineer / Cloud Consultant
- **At product / Big Tech companies:** Cloud Infrastructure Engineer
- **At startups:** DevOps Engineer
- **Typical experience to be hired:** 1+ yrs
- **Next moves — grow:** Cloud Architect, Platform Engineer, Site Reliability Engineer (SRE) · **lead:** Engineering Manager · **pivot:** Cloud Security Engineer, FinOps Engineer / Analyst, AI Infrastructure / LLMOps Engineer
- **Languages:** Python, Bash, HCL, JSON/YAML
- **Frameworks / Standards:** Terraform, CloudFormation, Bicep, CDK
- **Tools:** AWS, Azure, Google Cloud, CLI tools
- **Technical skills:** Networking (VPC, DNS, load balancers), IAM, Compute & storage, Cost control, Serverless, Backup & DR, Cloud security, Migration
- **Soft skills:** Documentation, Planning
- **AI impact:** Adds managed AI services (Bedrock, Azure OpenAI, Vertex AI).

#### Site Reliability Engineer (SRE)

Keeps production reliable using software engineering practices.

- **Also called:** Reliability Engineer, Production Engineer (Meta), Systems Engineer (Ops)
- **At IT services firms (TCS, Infosys, Wipro, Accenture):** SRE / Production Support Lead
- **At product / Big Tech companies:** SRE (Google) / Production Engineer (Meta)
- **At startups:** Infra / DevOps Engineer
- **Typical experience to be hired:** 3+ yrs
- **Next moves — grow:** Platform Engineer, Cloud Architect, Tech Lead · **lead:** Engineering Manager · **pivot:** AI Infrastructure / LLMOps Engineer, Cloud Security Engineer
- **Languages:** Go, Python, Bash
- **Frameworks / Standards:** Kubernetes, OpenTelemetry
- **Tools:** Prometheus, Grafana, PagerDuty, Datadog, ELK
- **Technical skills:** SLI/SLO/SLA, Incident response, Capacity planning, Automation, Chaos engineering, Postmortems, Performance tuning, On-call
- **Soft skills:** Calm under pressure, Blameless culture
- **AI impact:** AIOps tools detect anomalies and suggest root causes.

#### Platform Engineer

Builds internal platforms so developers can ship without friction.

- **Also called:** Internal Developer Platform Engineer, Infrastructure Engineer, Kubernetes Engineer
- **At IT services firms (TCS, Infosys, Wipro, Accenture):** Platform Engineer / Kubernetes Consultant
- **At product / Big Tech companies:** Software Engineer, Developer Platform
- **At startups:** Infra Engineer
- **Typical experience to be hired:** 4+ yrs
- **Next moves — grow:** Cloud Architect, Tech Lead · **lead:** Engineering Manager · **pivot:** AI Infrastructure / LLMOps Engineer
- **Languages:** Go, Python, TypeScript
- **Frameworks / Standards:** Kubernetes, Backstage, Crossplane
- **Tools:** Terraform, Argo CD, Helm
- **Technical skills:** Developer experience, Self-service tooling, Golden paths, Internal developer portals, Policy as code
- **Soft skills:** Product thinking for developers
- **AI impact:** Platforms now include internal AI gateways and agent tooling.

#### FinOps Engineer / Analyst

Tracks and reduces cloud and AI spend.

- **Also called:** Cloud Cost Analyst, Cloud Financial Analyst, Cloud Economist
- **At IT services firms (TCS, Infosys, Wipro, Accenture):** FinOps Consultant
- **At product / Big Tech companies:** FinOps Engineer / Cloud Cost Analyst
- **At startups:** Part of DevOps
- **Typical experience to be hired:** 3+ yrs
- **Next moves — grow:** Cloud Architect · **lead:** Delivery / Program Manager · **pivot:** Cloud Engineer, Product Manager (PM)
- **Languages:** SQL, Python
- **Frameworks / Standards:** FinOps Framework
- **Tools:** AWS Cost Explorer, Azure Cost Management, CloudHealth, Kubecost
- **Technical skills:** Cost allocation & tagging, Rightsizing, Reserved / savings plans, Forecasting, GPU & token cost tracking
- **Soft skills:** Negotiation, Reporting
- **AI impact:** AI token and GPU costs make this role more important.

#### System Administrator

Manages servers, OS, users and patches.

- **Also called:** SysAdmin, Linux / Windows Administrator, Server Administrator
- **At IT services firms (TCS, Infosys, Wipro, Accenture):** System Administrator / Wintel / Linux Admin
- **At product / Big Tech companies:** Systems Engineer / Corporate IT Engineer
- **At startups:** IT Admin
- **Typical experience to be hired:** 0+ yrs
- **Next moves — grow:** Cloud Engineer, DevOps Engineer · **lead:** — · **pivot:** Site Reliability Engineer (SRE), Network Engineer, Security Analyst (SOC)
- **Languages:** Bash, PowerShell, Python
- **Frameworks / Standards:** Linux, Windows Server, Active Directory
- **Tools:** VMware, Ansible, Nagios
- **Technical skills:** OS administration, Patching, Backups, Permissions, Scripting, Virtualisation, Troubleshooting
- **Soft skills:** Reliability
- **AI impact:** Shifting toward cloud and automation roles.

#### Network Engineer

Designs and maintains networks, routers, firewalls and VPNs.

- **Also called:** Network Administrator, CCNA / CCNP Engineer, Network Operations Engineer
- **At IT services firms (TCS, Infosys, Wipro, Accenture):** Network Engineer / Network Consultant
- **At product / Big Tech companies:** Network Engineer / Network Development Engineer
- **At startups:** Usually outsourced
- **Typical experience to be hired:** 0+ yrs
- **Next moves — grow:** Cloud Engineer, Cloud Architect · **lead:** — · **pivot:** Cloud Security Engineer, Security Analyst (SOC)
- **Narrower (sideways) roles:** NOC Engineer
- **Languages:** Python, Bash
- **Frameworks / Standards:** TCP/IP, BGP, OSPF, SD-WAN
- **Tools:** Cisco IOS, Wireshark, Palo Alto, Juniper
- **Technical skills:** Routing & switching, Subnetting, Firewalls, Load balancers, VPN, Network automation, Cloud networking
- **Soft skills:** Methodical troubleshooting
- **AI impact:** AI-driven network monitoring and automation.

#### Release / Build Engineer

Manages versions, builds and release schedules.

- **Also called:** Build & Release Engineer, Release Manager, Configuration Manager
- **At IT services firms (TCS, Infosys, Wipro, Accenture):** Build & Release Engineer
- **At product / Big Tech companies:** Release Engineer
- **At startups:** Part of DevOps
- **Typical experience to be hired:** 1+ yrs
- **Next moves — grow:** DevOps Engineer, Platform Engineer · **lead:** — · **pivot:** Site Reliability Engineer (SRE)
- **Languages:** Bash, Groovy, Python
- **Frameworks / Standards:** Maven, Gradle, Bazel
- **Tools:** Jenkins, Artifactory, Nexus, Git
- **Technical skills:** Branching strategy, Versioning, Release notes, Build optimisation, Dependency management
- **Soft skills:** Coordination
- **AI impact:** Often merged into DevOps / Platform roles.

### Quality & Testing

Make sure software works correctly.

#### Manual QA / Test Engineer

Tests software by hand to find bugs before users do.

- **Also called:** QA Engineer, Software Tester, Test Analyst, QA Analyst
- **At IT services firms (TCS, Infosys, Wipro, Accenture):** Test Engineer / Test Analyst
- **At product / Big Tech companies:** QA Engineer
- **At startups:** QA Engineer
- **Typical experience to be hired:** 0+ yrs
- **Next moves — grow:** Automation Test Engineer (SDET) · **lead:** Scrum Master / Agile Coach, Project Manager · **pivot:** Business Analyst (BA), AI Evaluation (Evals) Engineer, Performance Test Engineer
- **Languages:** SQL (basic)
- **Frameworks / Standards:** STLC, Test case design
- **Tools:** Jira, TestRail, Zephyr, Postman
- **Technical skills:** Test cases, Bug reporting, Regression testing, Exploratory testing, Boundary-value & equivalence partitioning, API testing basics, UAT support
- **Soft skills:** Attention to detail, Curiosity
- **AI impact:** AI generates test cases; manual testers are moving to automation and AI testing.

#### Automation Test Engineer (SDET)

Writes code that tests software automatically.

- **Also called:** SDET, QA Automation Engineer, Test Automation Engineer, Selenium Tester
- **At IT services firms (TCS, Infosys, Wipro, Accenture):** Automation Test Engineer / Senior Test Engineer
- **At product / Big Tech companies:** SDET / Software Engineer in Test
- **At startups:** QA Automation Engineer
- **Typical experience to be hired:** 1+ yrs
- **Next moves — grow:** Tech Lead · **lead:** Engineering Manager · **pivot:** Backend Developer, Full Stack Developer, AI Evaluation (Evals) Engineer, DevOps Engineer
- **Narrower (sideways) roles:** Manual QA / Test Engineer
- **Languages:** Java, Python, JavaScript/TypeScript
- **Frameworks / Standards:** Selenium, Playwright, Cypress, TestNG, JUnit, Cucumber (BDD), REST Assured
- **Tools:** Jenkins, Appium, BrowserStack
- **Technical skills:** Test frameworks, API testing, CI integration, Page Object Model, Test data management, Mocking, Reporting, Flaky-test handling
- **Soft skills:** Quality ownership
- **AI impact:** AI self-healing tests; new need for testing AI features.

#### Performance Test Engineer

Checks speed, load and stability under heavy traffic.

- **Also called:** Performance Engineer, Load Test Engineer, JMeter / LoadRunner Tester
- **At IT services firms (TCS, Infosys, Wipro, Accenture):** Performance Test Engineer
- **At product / Big Tech companies:** Performance Engineer
- **At startups:** Rare — Backend owns it
- **Typical experience to be hired:** 2+ yrs
- **Next moves — grow:** Site Reliability Engineer (SRE), Tech Lead · **lead:** — · **pivot:** Platform Engineer, Backend Developer
- **Narrower (sideways) roles:** Manual QA / Test Engineer
- **Languages:** Java, JavaScript, Scala
- **Frameworks / Standards:** JMeter, k6, Gatling, LoadRunner
- **Tools:** Grafana, APM tools
- **Technical skills:** Load/stress/soak tests, Bottleneck analysis, Latency percentiles, Profiling, Capacity planning
- **Soft skills:** Analytical thinking
- **AI impact:** Load-testing LLM endpoints (tokens/sec, time-to-first-token) is new.

### Security

Protect systems, data and users.

#### Security Analyst (SOC)

Monitors alerts and responds to security incidents.

- **Also called:** SOC Analyst L1/L2, Cybersecurity Analyst, Threat Analyst, Incident Responder
- **At IT services firms (TCS, Infosys, Wipro, Accenture):** SOC Analyst / Information Security Analyst
- **At product / Big Tech companies:** Security Engineer, Detection & Response
- **At startups:** Security Engineer (generalist)
- **Typical experience to be hired:** 0+ yrs
- **Next moves — grow:** Penetration Tester / Ethical Hacker, Cloud Security Engineer · **lead:** — · **pivot:** Application Security (AppSec) / DevSecOps Engineer, AI Red Teamer / AI Safety Engineer, IAM Engineer
- **Languages:** Python, KQL, SPL
- **Frameworks / Standards:** MITRE ATT&CK, NIST
- **Tools:** Splunk, Microsoft Sentinel, CrowdStrike, QRadar
- **Technical skills:** Log analysis, Threat detection, Incident response, Malware basics, Phishing analysis, Threat intelligence
- **Soft skills:** Calm under pressure
- **AI impact:** AI copilots (Security Copilot) triage alerts faster.

#### Penetration Tester / Ethical Hacker

Legally attacks systems to find weaknesses before criminals do.

- **Also called:** Pentester, Ethical Hacker, Offensive Security Engineer, VAPT Analyst
- **At IT services firms (TCS, Infosys, Wipro, Accenture):** VAPT Analyst / Security Consultant
- **At product / Big Tech companies:** Offensive Security / Red Team Engineer
- **At startups:** Security Engineer
- **Typical experience to be hired:** 2+ yrs
- **Next moves — grow:** AI Red Teamer / AI Safety Engineer, Application Security (AppSec) / DevSecOps Engineer · **lead:** — · **pivot:** Cloud Security Engineer
- **Languages:** Python, Bash, PowerShell
- **Frameworks / Standards:** OWASP Top 10, PTES
- **Tools:** Burp Suite, Metasploit, Nmap, Kali Linux
- **Technical skills:** Web/app exploitation, Network scanning, Privilege escalation, Active Directory attacks, Reporting
- **Soft skills:** Ethics, Persistence
- **AI impact:** Expanding into AI red teaming.

#### Application Security (AppSec) / DevSecOps Engineer

Builds security into code and pipelines.

- **Also called:** AppSec Engineer, Product Security Engineer, DevSecOps Engineer
- **At IT services firms (TCS, Infosys, Wipro, Accenture):** Application Security Consultant
- **At product / Big Tech companies:** Product Security Engineer
- **At startups:** Security Engineer
- **Typical experience to be hired:** 3+ yrs
- **Next moves — grow:** Cloud Security Engineer, Solution Architect · **lead:** Engineering Manager · **pivot:** AI Red Teamer / AI Safety Engineer
- **Languages:** Java, Python, Go
- **Frameworks / Standards:** OWASP, SAST/DAST, Threat modelling (STRIDE)
- **Tools:** SonarQube, Snyk, Checkmarx, Trivy, OWASP ZAP
- **Technical skills:** Secure code review, Dependency scanning, Secrets management, SBOM & supply-chain security, Container security, Developer training
- **Soft skills:** Influence without authority
- **AI impact:** Must secure AI-generated code and LLM features.

#### Cloud Security Engineer

Secures cloud accounts, identities and data.

- **Also called:** Cloud Security Architect, AWS / Azure Security Engineer, Infrastructure Security Engineer
- **At IT services firms (TCS, Infosys, Wipro, Accenture):** Cloud Security Consultant
- **At product / Big Tech companies:** Security Engineer, Cloud
- **At startups:** Security Engineer
- **Typical experience to be hired:** 4+ yrs
- **Next moves — grow:** Cloud Architect, Enterprise Architect · **lead:** Engineering Manager · **pivot:** AI Red Teamer / AI Safety Engineer, Responsible AI / AI Governance Lead
- **Languages:** Python, HCL
- **Frameworks / Standards:** CIS Benchmarks, Zero Trust
- **Tools:** AWS IAM/KMS/GuardDuty, Azure Defender, Wiz, Prisma Cloud
- **Technical skills:** IAM policies, Encryption, Compliance, Network security, CSPM, Incident response in cloud
- **Soft skills:** Risk communication
- **AI impact:** Secures AI data, model access and agent permissions.

#### IAM Engineer

Manages who can log in and what they can access.

- **Also called:** Identity Engineer, Okta / SailPoint / CyberArk Engineer, Access Management Engineer
- **At IT services firms (TCS, Infosys, Wipro, Accenture):** IAM Consultant / SailPoint Developer
- **At product / Big Tech companies:** Identity & Access Engineer
- **At startups:** Part of Security / IT
- **Typical experience to be hired:** 2+ yrs
- **Next moves — grow:** Cloud Security Engineer · **lead:** — · **pivot:** Application Security (AppSec) / DevSecOps Engineer, GRC / Compliance Analyst
- **Languages:** PowerShell, Python
- **Frameworks / Standards:** OAuth 2.0, OIDC, SAML, SCIM
- **Tools:** Okta, Microsoft Entra ID (Azure AD), Keycloak, SailPoint
- **Technical skills:** SSO, MFA, Role-based access, Access reviews, Privileged access (PAM), Lifecycle provisioning
- **Soft skills:** Process discipline
- **AI impact:** New problem: identity and permissions for AI agents.

#### GRC / Compliance Analyst

Ensures the company follows security laws and standards.

- **Also called:** Risk & Compliance Analyst, IT Auditor, ISO 27001 / SOC 2 Analyst
- **At IT services firms (TCS, Infosys, Wipro, Accenture):** GRC Consultant / IT Risk Analyst
- **At product / Big Tech companies:** Security Compliance Analyst
- **At startups:** Compliance Lead (often part-time)
- **Typical experience to be hired:** 1+ yrs
- **Next moves — grow:** Responsible AI / AI Governance Lead · **lead:** Delivery / Program Manager · **pivot:** Cloud Security Engineer, Business Analyst (BA)
- **Languages:** —
- **Frameworks / Standards:** ISO 27001, SOC 2, GDPR, PCI-DSS, HIPAA
- **Tools:** Vanta, Drata, ServiceNow GRC
- **Technical skills:** Risk assessment, Audits, Policy writing, Vendor risk, Evidence collection
- **Soft skills:** Organisation, Communication
- **AI impact:** Adds AI regulations (EU AI Act, ISO 42001).

### Product & Design

Decide what to build and how it feels.

#### Product Manager (PM)

Decides what to build and why, based on user and business needs.

- **Also called:** Product Lead, Associate Product Manager (APM), Technical Product Manager
- **At IT services firms (TCS, Infosys, Wipro, Accenture):** Rare — Product Owner / Business Consultant
- **At product / Big Tech companies:** Product Manager (Amazon: PM / PM-T)
- **At startups:** Product Manager / Founder's Office
- **Typical experience to be hired:** 3+ yrs
- **Next moves — grow:** AI Product Manager · **lead:** CTO / CIO · **pivot:** Solutions / Sales Engineer
- **Narrower (sideways) roles:** Product Owner (PO)
- **Languages:** SQL (basic)
- **Frameworks / Standards:** Agile, OKRs, RICE prioritisation
- **Tools:** Jira, Confluence, Productboard, Amplitude, Mixpanel
- **Technical skills:** Roadmaps, User research, Prioritisation, Metrics, PRD writing, Competitor analysis, Go-to-market, Pricing basics
- **Soft skills:** Stakeholder management, Decision making, Storytelling
- **AI impact:** PMs prototype with AI tools and must understand AI capabilities.

#### Product Owner (PO)

Owns the backlog for a Scrum team and accepts finished work.

- **Also called:** Business Product Owner, Scrum Product Owner
- **At IT services firms (TCS, Infosys, Wipro, Accenture):** Product Owner / Business Analyst (Agile)
- **At product / Big Tech companies:** Product Manager (PO role merged)
- **At startups:** Product Manager
- **Typical experience to be hired:** 3+ yrs
- **Next moves — grow:** Product Manager (PM), AI Product Manager · **lead:** Delivery / Program Manager · **pivot:** UX Researcher
- **Languages:** —
- **Frameworks / Standards:** Scrum, User stories, Acceptance criteria
- **Tools:** Jira, Azure Boards
- **Technical skills:** Backlog refinement, Story writing, Sprint goal setting, Release planning, Acceptance testing
- **Soft skills:** Stakeholder management, Decisiveness
- **AI impact:** AI drafts user stories and acceptance criteria.

#### UI/UX Designer

Designs how a product looks (UI) and how easy it is to use (UX).

- **Also called:** Product Designer, UX Designer, Interaction Designer, Visual Designer
- **At IT services firms (TCS, Infosys, Wipro, Accenture):** UX Designer / UI Designer
- **At product / Big Tech companies:** Product Designer
- **At startups:** Product Designer
- **Typical experience to be hired:** 0+ yrs
- **Next moves — grow:** Conversational AI Designer · **lead:** Product Manager (PM) · **pivot:** Frontend Developer, XR (AR/VR) Developer, UX Researcher
- **Languages:** HTML/CSS (helpful)
- **Frameworks / Standards:** Design systems, Material Design, Design Thinking
- **Tools:** Figma, Adobe XD, Sketch, Miro
- **Technical skills:** Wireframes, Prototypes, Usability testing, Accessibility, Visual design, Interaction design, Information architecture, Design handoff
- **Soft skills:** Empathy, Presenting design rationale
- **AI impact:** AI generates layouts; designers focus on research and AI interaction patterns.

#### UX Researcher

Studies users to learn their needs and problems.

- **Also called:** User Researcher, Design Researcher, Usability Analyst
- **At IT services firms (TCS, Infosys, Wipro, Accenture):** UX Research Consultant
- **At product / Big Tech companies:** UX Researcher
- **At startups:** Rare — Designers do research
- **Typical experience to be hired:** 1+ yrs
- **Next moves — grow:** Product Manager (PM) · **lead:** — · **pivot:** Conversational AI Designer, AI Evaluation (Evals) Engineer
- **Languages:** —
- **Frameworks / Standards:** Interviews, Surveys, Card sorting
- **Tools:** Maze, Hotjar, Dovetail
- **Technical skills:** Research planning, Synthesis, Personas, Journey mapping, Usability studies
- **Soft skills:** Listening, Neutrality
- **AI impact:** AI summarises interviews; researchers validate insights.

### Architecture & Leadership

Set technical direction and lead teams.

#### Solution Architect

Designs the technical solution for a specific business problem or project.

- **Also called:** Technical Architect, Application Architect, Solutions Architect
- **At IT services firms (TCS, Infosys, Wipro, Accenture):** Solution Architect / Technology Architect
- **At product / Big Tech companies:** Solutions Architect (vendors) / Staff Engineer
- **At startups:** Principal / Founding Engineer
- **Typical experience to be hired:** 8+ yrs
- **Next moves — grow:** Enterprise Architect, AI Solutions Architect, Cloud Architect · **lead:** CTO / CIO, Engineering Manager · **pivot:** Pre-Sales / Solutions Consultant, Forward Deployed Engineer (FDE)
- **Languages:** Java/C#/Python (background)
- **Frameworks / Standards:** Microservices, Event-driven, TOGAF (optional)
- **Tools:** Draw.io, Lucidchart, C4 model, ArchiMate
- **Technical skills:** System design, Trade-offs, Cost estimation, Non-functional requirements, Integration patterns, Cloud architecture, Security architecture, ADRs
- **Soft skills:** Client communication, Influence, Presentation
- **AI impact:** Must now design AI components (RAG, agents) into solutions.

#### Enterprise Architect

Aligns technology across the whole organisation with business strategy.

- **Also called:** EA, Chief Architect, TOGAF Architect
- **At IT services firms (TCS, Infosys, Wipro, Accenture):** Enterprise Architect / Principal Consultant
- **At product / Big Tech companies:** Enterprise Architect (large orgs)
- **At startups:** Rare
- **Typical experience to be hired:** 12+ yrs
- **Next moves — grow:** CTO / CIO · **lead:** CTO / CIO · **pivot:** AI Solutions Architect, Responsible AI / AI Governance Lead
- **Languages:** —
- **Frameworks / Standards:** TOGAF, Zachman
- **Tools:** LeanIX, ArchiMate, Sparx EA
- **Technical skills:** Capability mapping, Governance, Technology roadmaps, Portfolio rationalisation, Standards
- **Soft skills:** Executive communication, Strategic thinking
- **AI impact:** Owns enterprise AI strategy and platform choices.

#### Cloud Architect

Designs secure, scalable, cost-effective cloud systems.

- **Also called:** AWS / Azure Solutions Architect, Cloud Solutions Architect, Infrastructure Architect
- **At IT services firms (TCS, Infosys, Wipro, Accenture):** Cloud Architect / Cloud Practice Lead
- **At product / Big Tech companies:** Solutions Architect (AWS, Microsoft, Google Cloud)
- **At startups:** Head of Infra
- **Typical experience to be hired:** 7+ yrs
- **Next moves — grow:** Enterprise Architect, AI Solutions Architect · **lead:** CTO / CIO, Engineering Manager · **pivot:** Pre-Sales / Solutions Consultant
- **Languages:** HCL, Python
- **Frameworks / Standards:** AWS Well-Architected, Azure Well-Architected
- **Tools:** AWS, Azure, GCP, Terraform
- **Technical skills:** Multi-region design, Migration, FinOps, Landing zones, DR strategy, Hybrid cloud
- **Soft skills:** Trade-off communication
- **AI impact:** Designs GPU and AI-service capacity.

#### Data Architect

Designs how data is stored, connected and governed.

- **Also called:** Data Platform Architect, Data Modeler, Big Data Architect
- **At IT services firms (TCS, Infosys, Wipro, Accenture):** Data Architect / Data Practice Lead
- **At product / Big Tech companies:** Data Architect / Staff Data Engineer
- **At startups:** Head of Data
- **Typical experience to be hired:** 8+ yrs
- **Next moves — grow:** Enterprise Architect, AI Solutions Architect · **lead:** CTO / CIO · **pivot:** AI Infrastructure / LLMOps Engineer
- **Languages:** SQL, Python
- **Frameworks / Standards:** Data Mesh, Lakehouse, Kimball / Inmon
- **Tools:** ERwin, Snowflake, Databricks
- **Technical skills:** Data modelling, Governance, Master data, Data lineage, Data security & privacy
- **Soft skills:** Cross-team alignment
- **AI impact:** Makes data AI-ready (quality, access, vector stores).

#### Tech Lead

Leads a team technically while still writing code.

- **Also called:** Technical Lead, Lead Engineer, Module Lead, Team Lead
- **At IT services firms (TCS, Infosys, Wipro, Accenture):** Technical Lead / Technology Lead (Infosys) / Module Lead
- **At product / Big Tech companies:** Senior / Staff Engineer acting as TL
- **At startups:** Lead Engineer
- **Typical experience to be hired:** 6+ yrs
- **Next moves — grow:** Solution Architect, Cloud Architect, AI Solutions Architect · **lead:** Engineering Manager · **pivot:** Forward Deployed Engineer (FDE), Product Manager (PM)
- **Languages:** Team's main stack
- **Frameworks / Standards:** Team's main stack
- **Tools:** Git, Jira, Code review tools
- **Technical skills:** Design reviews, Mentoring, Task breakdown, Unblocking, Code quality standards, Estimation, Production ownership, Technical decisions
- **Soft skills:** Leadership, Communication, Conflict resolution
- **AI impact:** Sets team rules for AI coding tools and reviews AI-generated code.

#### Engineering Manager

Manages engineers — hiring, growth and delivery.

- **Also called:** Software Development Manager (Amazon), Development Manager, Delivery Lead
- **At IT services firms (TCS, Infosys, Wipro, Accenture):** Project Manager / Engineering Manager
- **At product / Big Tech companies:** Engineering Manager / SDM
- **At startups:** Head of Engineering
- **Typical experience to be hired:** 7+ yrs
- **Next moves — grow:** Delivery / Program Manager, CTO / CIO · **lead:** CTO / CIO · **pivot:** Product Manager (PM), AI Product Manager
- **Languages:** —
- **Frameworks / Standards:** Agile, OKRs
- **Tools:** Jira, Lattice, Confluence
- **Technical skills:** 1:1s, Hiring, Performance reviews, Planning, Career development, Delivery metrics (DORA), Budgeting basics
- **Soft skills:** Empathy, Coaching, Decision making
- **AI impact:** Measures and manages AI-driven productivity changes.

#### CTO / CIO

Top technology executive (CTO: product tech; CIO: internal IT).

- **Also called:** Chief Technology Officer, Chief Information Officer, Head of Technology, Chief Digital Officer
- **At IT services firms (TCS, Infosys, Wipro, Accenture):** CTO / Chief Digital Officer
- **At product / Big Tech companies:** CTO / SVP Engineering
- **At startups:** Co-founder & CTO
- **Typical experience to be hired:** 15+ yrs
- **Next moves — grow:** — · **lead:** — · **pivot:** AI Solutions Architect
- **Languages:** —
- **Frameworks / Standards:** Business strategy, IT governance
- **Tools:** —
- **Technical skills:** Vision, Budget, Org design, Board communication, Vendor strategy, Risk management
- **Soft skills:** Leadership, Influence
- **AI impact:** Owns company-wide AI adoption; some firms add a Chief AI Officer (CAIO).

### IT Support & Operations

Keep internal IT and users running.

#### IT Support / Help Desk (L1/L2)

Fixes user issues with laptops, accounts, email and access.

- **Also called:** Service Desk Analyst, Desktop Support Engineer, Technical Support Engineer
- **At IT services firms (TCS, Infosys, Wipro, Accenture):** Service Desk Analyst / Process Associate
- **At product / Big Tech companies:** IT Support Engineer / Corporate IT
- **At startups:** IT Admin
- **Typical experience to be hired:** 0+ yrs
- **Next moves — grow:** System Administrator, Production / Application Support (L2/L3) · **lead:** — · **pivot:** Cloud Engineer, Security Analyst (SOC), Network Engineer, Manual QA / Test Engineer
- **Languages:** PowerShell (basic)
- **Frameworks / Standards:** ITIL
- **Tools:** ServiceNow, Jira Service Management, Active Directory, Microsoft 365 admin
- **Technical skills:** Troubleshooting, Ticket handling, Hardware & OS setup, Account & password resets, Remote support, Knowledge-base writing
- **Soft skills:** Patience, Communication
- **AI impact:** AI chatbots handle common tickets; staff handle complex cases.

#### Production / Application Support (L2/L3)

Keeps live business apps running and fixes production issues.

- **Also called:** Application Support Engineer, L2/L3 Support, Production Support Analyst
- **At IT services firms (TCS, Infosys, Wipro, Accenture):** Application Support Analyst / AMS Engineer
- **At product / Big Tech companies:** Support Engineer / On-call Engineer
- **At startups:** Done by developers on call
- **Typical experience to be hired:** 1+ yrs
- **Next moves — grow:** Site Reliability Engineer (SRE), DevOps Engineer · **lead:** Project Manager · **pivot:** Backend Developer, Cloud Engineer
- **Narrower (sideways) roles:** IT Support / Help Desk (L1/L2)
- **Languages:** SQL, Bash, Python
- **Frameworks / Standards:** ITIL, Runbooks
- **Tools:** Splunk, ServiceNow, Dynatrace, AppDynamics
- **Technical skills:** Log analysis, Root-cause analysis, Incident management, Batch job monitoring, Data fixes, Shift handover
- **Soft skills:** Calm under pressure, Clear updates
- **AI impact:** AIOps automates alert triage and RCA suggestions.

#### NOC Engineer

Watches network and system health 24/7 from an operations centre.

- **Also called:** Network Operations Center Engineer, Monitoring Engineer, Command Center Analyst
- **At IT services firms (TCS, Infosys, Wipro, Accenture):** NOC Engineer / Command Centre Analyst
- **At product / Big Tech companies:** Network Operations Engineer
- **At startups:** Rare
- **Typical experience to be hired:** 0+ yrs
- **Next moves — grow:** Network Engineer, Site Reliability Engineer (SRE) · **lead:** — · **pivot:** Security Analyst (SOC), Cloud Engineer
- **Languages:** Bash
- **Frameworks / Standards:** ITIL
- **Tools:** SolarWinds, Nagios, Zabbix
- **Technical skills:** Monitoring, Escalation, Alert triage, Basic networking
- **Soft skills:** Alertness, Shift discipline
- **AI impact:** Heavily automated by AIOps.

### Business & Delivery

Connect business needs to tech teams.

#### Business Analyst (BA)

Gathers business requirements and translates them for developers.

- **Also called:** IT Business Analyst, Functional Consultant, Requirements Analyst
- **At IT services firms (TCS, Infosys, Wipro, Accenture):** Business Analyst / Functional Consultant
- **At product / Big Tech companies:** Business Analyst / Product Analyst
- **At startups:** Product Analyst / PM
- **Typical experience to be hired:** 0+ yrs
- **Next moves — grow:** Product Owner (PO), Product Manager (PM) · **lead:** Project Manager · **pivot:** Data Analyst, AI Product Manager, Pre-Sales / Solutions Consultant
- **Languages:** SQL (basic)
- **Frameworks / Standards:** BABOK, UML, BPMN
- **Tools:** Jira, Confluence, Visio, Excel
- **Technical skills:** Requirements (BRD/FRD), Process mapping, Gap analysis, User stories, UAT coordination, Data analysis
- **Soft skills:** Listening, Facilitation
- **AI impact:** AI drafts requirements; BAs validate and handle stakeholders.

#### Scrum Master / Agile Coach

Runs Scrum ceremonies and removes blockers for the team.

- **Also called:** Agile Coach, Agile Delivery Lead, Iteration Manager
- **At IT services firms (TCS, Infosys, Wipro, Accenture):** Scrum Master / Agile Coach
- **At product / Big Tech companies:** Technical Program Manager (often absorbs it)
- **At startups:** Rare — EM runs ceremonies
- **Typical experience to be hired:** 3+ yrs
- **Next moves — grow:** Delivery / Program Manager, Product Owner (PO) · **lead:** Delivery / Program Manager · **pivot:** Business Analyst (BA), Product Manager (PM)
- **Languages:** —
- **Frameworks / Standards:** Scrum, Kanban, SAFe
- **Tools:** Jira, Miro
- **Technical skills:** Facilitation, Coaching, Team metrics (velocity), Impediment removal, Retrospective formats
- **Soft skills:** Servant leadership, Conflict resolution
- **AI impact:** Role is often merged with Delivery Manager or EM.

#### Project Manager

Plans scope, schedule, budget and risk for a project.

- **Also called:** IT Project Manager, Project Lead, PMP Project Manager
- **At IT services firms (TCS, Infosys, Wipro, Accenture):** Project Manager
- **At product / Big Tech companies:** Technical Program Manager (TPM)
- **At startups:** Rare — EM / PM covers it
- **Typical experience to be hired:** 5+ yrs
- **Next moves — grow:** Delivery / Program Manager · **lead:** Delivery / Program Manager · **pivot:** Product Manager (PM)
- **Narrower (sideways) roles:** Scrum Master / Agile Coach
- **Languages:** —
- **Frameworks / Standards:** PMP / PMBOK, PRINCE2, Waterfall, Agile
- **Tools:** MS Project, Jira, Smartsheet
- **Technical skills:** Planning, Risk management, Status reporting, Budget tracking, Change control, Vendor coordination
- **Soft skills:** Organisation, Negotiation
- **AI impact:** AI automates status reports and risk tracking.

#### Delivery / Program Manager

Oversees several projects and client delivery commitments.

- **Also called:** Delivery Manager, Program Manager, Technical Program Manager
- **At IT services firms (TCS, Infosys, Wipro, Accenture):** Delivery Manager / Senior Project Manager
- **At product / Big Tech companies:** Technical Program Manager / Senior TPM
- **At startups:** Head of Delivery
- **Typical experience to be hired:** 8+ yrs
- **Next moves — grow:** CTO / CIO · **lead:** CTO / CIO · **pivot:** Product Manager (PM)
- **Narrower (sideways) roles:** Project Manager
- **Languages:** —
- **Frameworks / Standards:** SAFe, PMP
- **Tools:** Jira, Power BI, Excel
- **Technical skills:** Client management, Resource planning, Escalations, Profitability (margins), Contract (SOW) management
- **Soft skills:** Leadership, Negotiation
- **AI impact:** Plans AI-augmented delivery and pricing.

#### Solutions / Sales Engineer

Technical expert who supports sales with demos and proofs of concept.

- **Also called:** Sales Engineer, Solutions Engineer, Pre-Sales Engineer
- **At IT services firms (TCS, Infosys, Wipro, Accenture):** Pre-Sales Solution Architect
- **At product / Big Tech companies:** Solutions / Sales Engineer
- **At startups:** Founding Solutions Engineer
- **Typical experience to be hired:** 3+ yrs
- **Next moves — grow:** Pre-Sales / Solutions Consultant, Solution Architect · **lead:** — · **pivot:** Forward Deployed Engineer (FDE), Product Manager (PM), Developer Advocate (DevRel)
- **Languages:** Python, JavaScript, SQL
- **Frameworks / Standards:** POC delivery
- **Tools:** Demo environments, CRM (Salesforce), Postman
- **Technical skills:** Product demos, Technical discovery, POCs, RFP responses, Integration guidance
- **Soft skills:** Persuasion, Listening
- **AI impact:** Close cousin of FDE — FDE continues after the sale.

#### Customer Success Engineer

Helps customers adopt and get value from a product after purchase.

- **Also called:** Technical Customer Success Manager, Implementation Engineer, Onboarding Engineer
- **At IT services firms (TCS, Infosys, Wipro, Accenture):** Implementation Consultant
- **At product / Big Tech companies:** Customer Success / Technical Account Manager
- **At startups:** Customer Engineer
- **Typical experience to be hired:** 1+ yrs
- **Next moves — grow:** Solutions / Sales Engineer, Forward Deployed Engineer (FDE) · **lead:** — · **pivot:** Product Manager (PM)
- **Languages:** SQL, Python (basic)
- **Frameworks / Standards:** Onboarding playbooks
- **Tools:** Zendesk, Gainsight, Jira
- **Technical skills:** Onboarding, Troubleshooting, Product training, Health metrics, Feedback loops
- **Soft skills:** Empathy, Relationship building
- **AI impact:** AI handles routine questions; CSEs handle complex accounts.

#### Technical Writer

Writes user guides, API docs and internal documentation.

- **Also called:** Documentation Engineer, Content Developer, API Writer, Information Developer
- **At IT services firms (TCS, Infosys, Wipro, Accenture):** Technical Writer / Information Developer
- **At product / Big Tech companies:** Technical Writer / Docs Engineer
- **At startups:** DevRel / Docs (part-time)
- **Typical experience to be hired:** 0+ yrs
- **Next moves — grow:** Developer Advocate (DevRel) · **lead:** — · **pivot:** Product Owner (PO), UX Researcher, Context / Prompt Engineer
- **Languages:** Markdown, HTML
- **Frameworks / Standards:** Docs-as-code, OpenAPI
- **Tools:** Confluence, Docusaurus, MkDocs, Swagger
- **Technical skills:** Clear writing, Information architecture, API documentation, Diagrams, Style guides
- **Soft skills:** Curiosity, Interviewing engineers
- **AI impact:** Docs now also written for AI (llms.txt, chatbot-friendly content).

#### Pre-Sales / Solutions Consultant

Explains technical solutions to clients during sales.

- **Also called:** Pre-Sales Consultant, Bid Manager (technical), Solution Consultant
- **At IT services firms (TCS, Infosys, Wipro, Accenture):** Pre-Sales Consultant / Solution Architect (Deals)
- **At product / Big Tech companies:** Solutions Consultant
- **At startups:** Founder / Sales Engineer
- **Typical experience to be hired:** 5+ yrs
- **Next moves — grow:** Solution Architect, Enterprise Architect · **lead:** Delivery / Program Manager · **pivot:** Product Manager (PM), Forward Deployed Engineer (FDE)
- **Languages:** —
- **Frameworks / Standards:** RFP/RFI responses
- **Tools:** PowerPoint, Demo environments, CRM (Salesforce)
- **Technical skills:** Demos, Estimation, Client communication, Solution proposals, Competitive positioning
- **Soft skills:** Presentation, Persuasion
- **AI impact:** AI drafts proposals and RFP answers.

## Expected Pay Abroad (typical software engineer, by experience)

Estimates from public salary surveys and job ads for a typical software engineer, shifted by role. Gross pay before tax unless marked tax-free; cost of living differs a lot — compare take-home, rent and schooling before deciding. The ₹ figure uses an approximate exchange rate and is only for comparison.

| Country | Period | 0–2 yrs | 2–5 yrs | 5–8 yrs | 8–12 yrs | 12+ yrs | Tax |
|---|---|---|---|---|---|---|---|
| Germany | per year (EUR) | 45,000–56,000 | 55,000–68,000 | 65,000–82,000 | 75,000–95,000 | 85,000–110,000 | gross |
| UAE (Dubai/Abu Dhabi) | per month (AED) | 9,000–14,000 | 14,000–21,000 | 19,000–28,000 | 23,000–34,000 | 30,000–45,000 | tax-free |
| Netherlands | per year (EUR) | 40,000–50,000 | 50,000–62,000 | 60,000–76,000 | 70,000–90,000 | 80,000–105,000 | gross (30% ruling may apply) |
| Ireland | per year (EUR) | 40,000–52,000 | 55,000–70,000 | 65,000–85,000 | 80,000–105,000 | 95,000–130,000 | gross |
| Remote for global companies | per year (USD) | 15,000–30,000 | 25,000–45,000 | 40,000–65,000 | 55,000–90,000 | 70,000–120,000 | gross, paid to you in India |
| Japan | per year (JPY) | 4,000,000–5,500,000 | 5,500,000–7,500,000 | 7,000,000–9,500,000 | 8,500,000–12,000,000 | 10,000,000–15,000,000 | gross |
| Australia | per year (AUD) | 75,000–95,000 | 95,000–125,000 | 120,000–150,000 | 140,000–175,000 | 160,000–200,000 | gross, plus 11.5% super |
| United Kingdom | per year (GBP) | 32,000–42,000 | 42,000–58,000 | 55,000–75,000 | 70,000–95,000 | 85,000–120,000 | gross (London ~15% higher) |
| Singapore | per month (SGD) | 4,500–6,500 | 6,000–9,000 | 8,500–12,000 | 11,000–16,000 | 14,000–20,000 | gross, low income tax |
| Canada | per year (CAD) | 65,000–80,000 | 80,000–100,000 | 95,000–125,000 | 115,000–150,000 | 135,000–175,000 | gross |
| United States | per year (USD) | 90,000–120,000 | 115,000–150,000 | 140,000–185,000 | 165,000–220,000 | 190,000–260,000 | gross, base salary (Big Tech adds stock) |

Role multipliers vs a generic software engineer: Full Stack Developer ×1, Frontend Developer ×0.95, Backend Developer (Java) ×1, Data Engineer ×1.05, Data Scientist / ML Engineer ×1.05, AI / LLM Engineer ×1.2, Forward Deployed Engineer (FDE) ×1.15, DevOps / Cloud / SRE ×1.05, QA / Test Automation (SDET) ×0.85, Cybersecurity ×1.05, Mobile Developer ×0.95, SAP / Salesforce / ServiceNow ×1, Business Analyst ×0.85, Product Manager ×1.1, Project / Delivery Manager ×1.05.

## Glossary

### SDLC & Releases

| Term | Meaning |
|---|---|
| **SDLC** (Software Development Life Cycle) | A structured process for building and maintaining software, in stages: requirements → design → development → testing → deployment → maintenance. It helps teams plan work, keep quality high and deliver predictably. Example: a banking app goes through all six stages before and after each release. |
| **STLC** (Software Testing Life Cycle) | The testing side of the SDLC: requirement analysis → test planning → test case design → environment setup → execution → closure. It makes testing planned and measurable instead of ad hoc. Example: QA writes test cases from the login story before developers finish coding it. |
| **Environment** | A separate copy of the system used for one purpose, so work in progress never breaks what real users see. Code moves step by step: DEV (developers) → QA/TEST (testers) → UAT (business users) → STAGING (production-like rehearsal) → PROD (live). Each has its own database and settings. |
| **Production (Prod)** | The live system that real customers use, with real data and money. Changes reach it only after testing in lower environments, usually through an approved release. Example: a bug in PROD affects every user, so teams fix it with a hotfix and a postmortem. |
| **UAT** (User Acceptance Testing) | The final testing stage, where business users check that the software solves their real problem before release. Developers and QA confirm it works; UAT confirms it is what the business wanted. Example: the finance team runs month-end reports in UAT and signs off before go-live. |
| **POC** (Proof of Concept) | A small, quick experiment to prove an idea or technology works before investing in it. It is thrown away or rebuilt properly afterwards; it is not meant for users. Example: a 2-week POC checks whether an LLM can read invoices accurately before the full project is approved. |
| **MVP** (Minimum Viable Product) | The smallest version of a product with just enough features for real users to use and give feedback. It lets a team learn what customers want before building everything. Example: a food-delivery MVP has ordering and payment only — no ratings, offers or tracking yet. |
| **Hotfix / Patch** | An urgent fix released straight to production, outside the normal release schedule, for a serious bug or security issue. It is kept small to reduce risk and then merged back into the main branch. Example: a payment failure on sale day gets a same-day hotfix. |
| **Semantic Versioning** (SemVer) | A version number format MAJOR.MINOR.PATCH that tells users how risky an upgrade is. MAJOR = breaking change, MINOR = new feature that is backward compatible, PATCH = bug fix. Example: 2.4.1 → 2.5.0 is safe to upgrade; 2.x → 3.0.0 may need code changes. |

### Git & Version Control

| Term | Meaning |
|---|---|
| **Version Control / Git** | A system that records every change to code over time, so a team can work together, see history and undo mistakes. Git is the standard tool, and GitHub, GitLab and Bitbucket host Git repositories online. Example: git log shows who changed a file, when and why. |
| **Branch / Merge / PR** | A branch is a separate line of work so you can change code without disturbing others; a merge combines it back. A PR (Pull Request) asks teammates to review the branch before merging. Example: feature/login branch → PR → review and tests pass → merge into main. |
| **Commit** | A saved snapshot of your changes in Git, with a message, author, time and a unique ID (hash). Small commits with clear messages make history easy to read and changes easy to undo. Example: git commit -m "Fix tax rounding on payslip". |
| **Clone / Fork** | Clone makes a full local copy of a repository on your machine. Fork makes your own copy of someone else's repository on the server, so you can change it and send back a pull request. Example: fork an open-source library on GitHub, clone your fork, fix a bug, open a PR. |
| **Rebase** | Moves your commits so they sit on top of the latest version of another branch, giving a straight, linear history. It rewrites commit IDs, so never rebase commits others are already using. Example: git rebase main updates your feature branch with the newest main before a PR. |
| **Merge Conflict** | Happens when two branches changed the same lines and Git cannot decide which version to keep. You open the file, pick or combine the changes, then commit. Example: two developers both edit the same price formula — Git marks both versions for you to resolve. |
| **Tag** | A permanent name attached to one commit, usually to mark a release. Unlike a branch it doesn't move, so you can always rebuild exactly what shipped. Example: tag v1.4.0 marks the commit deployed to production on release day. |

### Programming Basics

| Term | Meaning |
|---|---|
| **Legacy System** | An old system still running important business work, often built with outdated technology and few people who understand it. It is risky to change but too critical to switch off. Example: a 25-year-old COBOL mainframe that still processes a bank's daily transactions. |
| **Technical Debt** | The future cost of taking shortcuts today — quick fixes, missing tests or messy design that slow every later change. Like financial debt, it grows 'interest' until you pay it back by refactoring. Example: copying the same validation into 10 places means a rule change now needs 10 edits. |
| **Refactoring** | Improving the internal structure of code without changing what it does for users. It makes code easier to read, test and change, and is safest with good tests in place. Example: splitting a 500-line method into small named methods with the same output. |
| **IDE** (Integrated Development Environment) | A code editor with built-in tools to write, run, debug and refactor code in one place. It adds autocomplete, error highlighting and Git integration to save time. Examples: IntelliJ IDEA for Java, VS Code for web, Eclipse, Android Studio. |
| **SDK** (Software Development Kit) | A ready-made kit of libraries, tools and docs for building software on a particular platform or service. It saves you from writing low-level code yourself. Example: the AWS SDK for Java lets you upload a file to S3 with one method call. |
| **Library vs Framework** | With a library, your code is in charge and calls it when needed. With a framework, the framework is in charge and calls your code at the right time (inversion of control). Example: you call Lodash functions yourself; Spring Boot calls your @RestController methods when requests arrive. |
| **Open Source** | Software whose source code is public, so anyone can use, study and improve it under its licence. Licences differ — MIT/Apache allow almost anything, GPL requires sharing your changes. Examples: Linux, Kubernetes, React, PostgreSQL. |
| **Compiled vs Interpreted** | Compiled languages are turned into machine code before running, so they start and run fast (C, Go, Rust). Interpreted languages are run by another program as they go (Python, classic JavaScript). Java and C# are in between: compiled to bytecode, then run and optimised by a virtual machine (JIT). |
| **Runtime** | The environment that actually runs your program and provides memory management, threads and standard libraries. Your code needs the right runtime installed to run. Examples: JVM for Java, Node.js for server JavaScript, .NET CLR for C#, the browser for front-end JavaScript. |

### Frontend

| Term | Meaning |
|---|---|
| **DOM** (Document Object Model) | The browser's tree of objects built from a page's HTML; each tag becomes a node JavaScript can read and change. Changing the DOM updates what the user sees without reloading. Example: document.getElementById('total').textContent = '₹500' updates the price on screen. |
| **SPA** (Single Page Application) | A web app that loads one HTML page once and then swaps content with JavaScript instead of reloading pages. It feels fast like a desktop app, but needs extra work for SEO and first load. Examples: Gmail, and most Angular or React apps. |
| **SSR / CSR / SSG** | Three ways to build a page's HTML. CSR: the browser builds it with JavaScript; SSR: the server builds it per request (faster first view, better SEO); SSG: HTML is built once at deploy time (fastest, for content that rarely changes). Example: blog → SSG, dashboard → CSR, e-commerce product page → SSR. |
| **Responsive Design** | Designing one website that adjusts its layout to any screen size — phone, tablet or desktop. It uses flexible grids, relative units and CSS media queries. Example: a three-column desktop layout becomes a single column on a phone. |
| **Component** | A reusable, self-contained piece of UI with its own template, styles and logic. Pages are built by combining components, so a fix in one place applies everywhere it is used. Example: one <product-card> component used on the home, search and wishlist pages. |
| **State Management** | Keeping data shared by many parts of the UI (logged-in user, cart, filters) in one predictable place. It prevents screens showing different values for the same data. Tools: NgRx or Signals (Angular), Redux or Zustand (React). Example: adding an item updates the cart badge and the cart page together. |
| **Accessibility (a11y)** | Making apps usable by everyone, including people using screen readers, keyboards only or with low vision. It follows the WCAG standard and is a legal requirement in many countries. Example: alt text on images, visible focus outlines and enough colour contrast. |
| **Core Web Vitals** | Google's three metrics for real user experience: LCP (main content loads in under 2.5 s), INP (page responds to clicks in under 200 ms) and CLS (layout doesn't jump, under 0.1). They affect search ranking. Example: reserving space for images stops content jumping and improves CLS. |
| **Bundler** | A build tool that combines many JavaScript/CSS files and packages into a few optimised files for the browser. It also minifies code, removes unused code and splits bundles for faster loading. Examples: Vite, Webpack, esbuild (Angular's build uses esbuild). |
| **PWA** (Progressive Web App) | A website that behaves like an installed app — it can work offline, be added to the home screen and send notifications. It uses a service worker and a web manifest. Example: Starbucks and Twitter/X offer PWAs that work on slow or no network. |
| **Design System** | A shared library of UI components, colours, fonts and usage rules that keeps every screen consistent. Designers and developers build from the same parts, so work is faster and the product looks unified. Examples: Google's Material Design, IBM Carbon. |
| **Lazy Loading** | Loading code, images or data only when they are actually needed, instead of everything at startup. It makes the first page load faster and saves data. Example: an Angular admin module or below-the-fold images load only when the user navigates or scrolls to them. |

### Backend & APIs

| Term | Meaning |
|---|---|
| **API** (Application Programming Interface) | A defined contract that lets one program request data or actions from another without knowing how it works inside. It specifies the requests you can make and the responses you get. Example: a weather app calls GET /weather?city=Chennai and receives JSON with the temperature. |
| **REST** (Representational State Transfer) | A popular style for web APIs where everything is a resource with a URL, and HTTP methods say what to do: GET read, POST create, PUT/PATCH update, DELETE remove. It is simple, stateless and works over plain HTTP with JSON. Example: GET /api/orders/42 returns order 42. |
| **GraphQL** | An API query language where the client asks for exactly the fields it needs in one request, through a single endpoint. It avoids over-fetching and multiple round trips, but caching and security need more care. Example: a mobile app requests just a user's name and last 3 orders in one query. |
| **gRPC** | A fast API framework from Google that sends compact binary messages (Protocol Buffers) over HTTP/2. It generates client and server code from a .proto contract and supports streaming. Common for service-to-service calls where speed matters; browsers need a proxy to use it. |
| **Webhook** | A callback where a service sends an HTTP request to your URL as soon as an event happens, instead of you checking repeatedly (polling). You register the URL once and verify each call's signature. Example: Razorpay calls your /payment-webhook when a payment succeeds. |
| **WebSocket** | A connection that stays open so the server and browser can send messages to each other at any time. Unlike normal HTTP, the server can push updates without being asked. Used for chat, live scores, trading prices and multiplayer games. |
| **JSON / XML / YAML** | Text formats for structured data. JSON is light and the default for APIs; XML is verbose with tags, still used in banking, SOAP and older systems; YAML is indentation-based and used for config files. Example: {"id": 1} in JSON; a Kubernetes deployment written in YAML. |
| **HTTP Status Codes** | Three-digit codes in every HTTP response that say what happened. 2xx success (200 OK, 201 Created), 3xx redirect, 4xx client error (400 bad request, 401 not logged in, 403 forbidden, 404 not found), 5xx server error (500, 503). Correct codes help clients and monitoring react properly. |
| **Endpoint** | One specific URL plus HTTP method that an API exposes for one operation. An API is a collection of endpoints. Example: GET /api/orders lists orders, POST /api/orders creates one, GET /api/orders/42 fetches order 42. |
| **Middleware** | Code that runs between receiving a request and sending the response, to handle common work like logging, authentication or compression. The term also means software that connects separate systems (message brokers, integration tools). Example: an Express middleware that checks the JWT before every route. |
| **ORM** (Object-Relational Mapping) | A library that maps database tables to classes and rows to objects, so you work with objects instead of writing most SQL by hand. It saves code but can hide slow queries (like the N+1 problem). Examples: Hibernate/JPA (Java), Entity Framework (.NET), Prisma (Node.js). |
| **Dependency Injection (DI)** | A design where an object receives the things it needs (its dependencies) from outside instead of creating them itself. This makes code loosely coupled and easy to test with mocks. Example: Spring passes a PaymentService into OrderService's constructor; in tests you pass a fake one. |
| **OOP** (Object-Oriented Programming) | A way of organising code as objects that bundle data with the methods that work on it. Its four pillars are encapsulation (protect data), abstraction (hide details), inheritance (reuse) and polymorphism (one interface, many forms). Example: a BankAccount class keeps balance private and changes it only through deposit() and withdraw(). |
| **SOLID** | Five principles for code that is easy to change: Single responsibility, Open/closed, Liskov substitution, Interface segregation, Dependency inversion. Following them keeps classes small, focused and loosely coupled. Example: adding a new payment type by adding a class, without editing existing ones (open/closed). |
| **Design Patterns** | Proven, named solutions to common design problems, so teams don't reinvent them and can talk in shared terms. Examples: Singleton (one instance), Factory (create objects), Builder (step-by-step construction), Strategy (swap algorithms), Observer (notify listeners), Adapter (make interfaces fit). |
| **Concurrency / Multithreading** | Running several tasks at overlapping times, often on multiple threads, to use CPUs fully and keep apps responsive. The hard part is shared data — without locks or thread-safe structures you get race conditions. Example: a server handles 200 requests at once, each on its own thread. |
| **Idempotency** | An operation is idempotent if doing it once or many times has the same effect. It makes retries safe after timeouts and network errors. Example: a payment API takes an idempotency key, so a retried 'pay ₹500' request charges the customer only once. |
| **Rate Limiting** | Limiting how many requests a client can make in a time window, to protect a service from overload and abuse. Extra requests get HTTP 429 Too Many Requests. Example: a public API allows 100 requests per minute per API key. |
| **Swagger / OpenAPI** | OpenAPI is a standard format (YAML/JSON) for describing a REST API's endpoints, inputs and outputs; Swagger is the popular toolset around it. From one spec you get interactive docs, client code and contract tests. Example: Spring Boot with springdoc shows a Swagger UI at /swagger-ui.html. |
| **Big-O Notation** | Describes how an algorithm's time or memory grows as the input grows, ignoring constants. Common classes, fastest to slowest: O(1), O(log n), O(n), O(n log n), O(n²). Example: finding an item in a HashMap is O(1); searching an unsorted list is O(n). |
| **DSA** (Data Structures & Algorithms) | Data structures (arrays, lists, stacks, queues, hash maps, trees, graphs) are ways to store data; algorithms (sorting, searching, traversal, dynamic programming) are ways to process it. Choosing the right pair makes programs fast, and DSA is the core of coding interviews. Example: use a HashSet to find duplicates in O(n). |

### Architecture

| Term | Meaning |
|---|---|
| **Monolith** | An application built, tested and deployed as one single unit, with all features in one codebase. It is simple to start and debug, but becomes slow to change and scale as teams and code grow. Example: one Spring Boot app containing users, orders, payments and reports. |
| **Microservices** | An architecture where a system is split into small services, each owning one business area and its own data, deployed independently. Teams can release and scale services separately, at the cost of network calls, distributed data and more operations work. Example: separate order, payment and inventory services. |
| **Modular Monolith** | A single deployable application divided into strict modules that communicate only through clear interfaces. You get most of the clean boundaries of microservices without the network and operations overhead, and can split a module out later. Example: one app with separate billing, catalog and user modules. |
| **Serverless** | Running code without managing servers — the cloud provider starts it on demand, scales it and bills per request or millisecond. Great for spiky or event-driven work, but has cold starts and time limits. Examples: AWS Lambda, Azure Functions, Google Cloud Functions. |
| **Event-Driven Architecture** | A design where services announce events ("OrderPlaced") and other services react to them, instead of calling each other directly. It decouples services and handles spikes well, but makes flows harder to trace. Example: OrderPlaced → payment, email and inventory services each react on their own. |
| **Message Queue / Broker** | A middleman that stores messages from producers until consumers process them, so services can work asynchronously. It smooths traffic spikes and survives a consumer being down. Examples: RabbitMQ (task queues), Kafka (event streams), AWS SQS. |
| **API Gateway** | A single entry point in front of many backend services that routes each request and handles shared concerns: authentication, rate limiting, logging and SSL. Clients call one URL instead of many services. Examples: Spring Cloud Gateway, Kong, AWS API Gateway. |
| **Load Balancer** | A component that spreads incoming traffic across several servers so none is overloaded, and stops sending traffic to unhealthy ones. It enables both scaling and high availability. Examples: AWS ALB, Nginx, HAProxy. |
| **Caching** | Keeping frequently used data in fast storage (memory) so later requests don't have to hit the slow source again. It cuts latency and database load, but cached data can go stale, so it needs expiry rules. Example: storing product details in Redis for 10 minutes. |
| **CDN** (Content Delivery Network) | A network of servers around the world that keeps copies of static content (images, JS, CSS, videos) close to users. Pages load faster and the origin server gets less traffic. Examples: Cloudflare, AWS CloudFront, Akamai. |
| **Scalability (Horizontal / Vertical)** | A system's ability to handle more load. Vertical scaling uses a bigger machine (more CPU/RAM) — simple but limited; horizontal scaling adds more machines behind a load balancer — needs stateless apps but grows much further. Example: going from 2 to 10 app servers during a sale. |
| **High Availability (HA)** | Designing a system to stay up even when parts fail, by removing single points of failure with redundancy. It is measured in uptime: 99.9% allows about 8.8 hours of downtime a year, 99.99% about 53 minutes. Example: running servers in two availability zones with automatic failover. |
| **Fault Tolerance / Resilience** | The ability to keep working, perhaps in a reduced way, when some parts fail. Techniques include timeouts, retries with backoff, circuit breakers, fallbacks and redundancy. Example: if the recommendation service is down, the shop page still loads without recommendations. |
| **Circuit Breaker** | A pattern that stops calling a failing service for a while after repeated errors, returning a fallback instead. This prevents threads piling up and failures spreading; after a pause it lets a few test calls through. Example: Resilience4j opens the circuit after 50% of calls to the payment API fail. |
| **CAP Theorem** | In a distributed system, when the network splits (a partition), you must choose between consistency (everyone sees the same latest data) and availability (every request gets an answer). Partitions can't be avoided, so the real choice is C or A during one. Example: a bank balance favours consistency; a social feed favours availability. |
| **Saga Pattern** | A way to keep data consistent across microservices without one big transaction: each service does its local step, and if a later step fails, earlier steps are undone with compensating actions. Example: order created → payment taken → stock fails → refund payment and cancel order. |
| **CQRS** (Command Query Responsibility Segregation) | Using separate models (and often separate databases) for writes (commands) and reads (queries). Each side can be optimised and scaled on its own, at the cost of extra complexity and slightly delayed reads. Example: orders are written to PostgreSQL and copied to Elasticsearch for fast search. |
| **DDD** (Domain-Driven Design) | An approach that designs software around the business domain, using the same language as business experts. It splits a large system into bounded contexts, each with its own model. Example: 'customer' means different things in Billing and Shipping, so each context has its own Customer model. |
| **Hexagonal / Clean Architecture** | Architectures that keep core business logic at the centre, independent of frameworks, UI and databases, which plug in through interfaces (ports and adapters). This makes the core easy to test and technology easy to swap. Example: switching MySQL to MongoDB changes only an adapter, not the business rules. |
| **Service Mesh** | An infrastructure layer, usually sidecar proxies next to each service, that handles service-to-service traffic: encryption (mTLS), retries, routing and metrics — without changing application code. Useful when you run many microservices. Examples: Istio, Linkerd. |
| **Non-Functional Requirements (NFRs)** | Requirements about how well the system works rather than what it does: performance, scalability, availability, security, usability, maintainability. They drive architecture choices and must be measurable. Example: 'search must respond in under 300 ms for 5,000 concurrent users'. |
| **ADR** (Architecture Decision Record) | A short document that records one important architecture decision: the context, the options considered, the choice and its consequences. It tells future team members why things are the way they are. Example: 'ADR-007: Use Kafka instead of RabbitMQ for order events because we need replay'. |

### Data & Databases

| Term | Meaning |
|---|---|
| **RDBMS / SQL** | A relational database stores data in tables of rows and columns linked by keys, and you query it with SQL. It gives strong consistency through transactions and is the default choice for business data. Examples: PostgreSQL, MySQL, Oracle, SQL Server. |
| **NoSQL** | Databases that don't use fixed relational tables, built for flexible schemas or huge scale. Main types: document (MongoDB), key-value (Redis, DynamoDB), wide-column (Cassandra), graph (Neo4j). Example: a product catalogue with varying attributes fits a document store well. |
| **ACID** | Four guarantees of a database transaction. Atomicity: all or nothing; Consistency: rules always hold; Isolation: concurrent transactions don't interfere; Durability: committed data survives crashes. Example: a money transfer never debits one account without crediting the other. |
| **Transaction** | A group of database operations treated as one unit — either all succeed (commit) or all are undone (rollback). It protects data from half-finished changes. Example: placing an order inserts the order, reduces stock and records payment in one transaction. |
| **Index** | An extra data structure (usually a B+ tree) that lets the database find rows without scanning the whole table, like a book's index. It makes reads much faster but slows writes and uses storage. Example: an index on email makes WHERE email = ? instant on a million users. |
| **Normalization** | Organising tables so each fact is stored once, by splitting data into related tables (1NF, 2NF, 3NF). It avoids duplicate data and update mistakes. Example: store the customer's address in a customers table instead of repeating it on every order; reporting databases sometimes denormalise for speed. |
| **Primary / Foreign Key** | A primary key uniquely identifies each row in a table (like an ID). A foreign key in another table points to that primary key, linking the tables and preventing orphan data. Example: orders.customer_id is a foreign key to customers.id. |
| **Join** | Combines rows from two or more tables using a related column. INNER returns only matching rows, LEFT keeps all left rows (nulls where there is no match), RIGHT is the reverse, FULL keeps all rows from both. Example: customers LEFT JOIN orders lists every customer, even those with no orders. |
| **Stored Procedure** | A named block of SQL logic saved inside the database and called like a function. It cuts network round trips and keeps data logic close to the data, but is harder to version and test than application code. Example: CALL calculate_monthly_interest(); run by a nightly job. |
| **Sharding / Partitioning** | Splitting large data into smaller pieces. Partitioning divides a table inside one database (e.g. by month); sharding spreads data across multiple database servers (e.g. by customer ID) so each holds a part. It scales storage and writes but makes cross-shard queries harder. |
| **Replication** | Keeping copies of the same data on multiple database servers. It adds availability (a replica takes over on failure) and lets reads spread across replicas, but replicas can lag a little behind. Example: one primary MySQL handles writes; two read replicas serve reports. |
| **ETL / ELT** | Ways to move data into a warehouse. ETL: Extract from sources, Transform (clean, join), then Load. ELT: Load raw data first, then transform inside the warehouse — the modern cloud approach. Example: nightly ELT copies sales data into Snowflake and dbt models clean it. |
| **Data Warehouse** | A central database designed for analytics and reporting on large amounts of historical, cleaned data from many sources. It is optimised for big read queries, not for app transactions. Examples: Snowflake, Google BigQuery, Amazon Redshift. |
| **Data Lake / Lakehouse** | A data lake stores huge amounts of raw data in any format (files, logs, images) cheaply, usually in object storage. A lakehouse adds warehouse features on top — tables, transactions and fast SQL. Examples: S3 data lake; Databricks with Delta Lake. |
| **Data Pipeline** | An automated series of steps that moves data from sources to a destination and transforms it along the way, on a schedule or in real time. It replaces manual exports and keeps reports up to date. Example: app DB → Kafka → Spark job → warehouse → Power BI dashboard, orchestrated by Airflow. |
| **Batch vs Streaming** | Batch processing handles data in large chunks on a schedule (hourly or nightly) — simple and efficient. Streaming processes each event as it arrives, within seconds — needed for real-time use. Example: monthly payroll is batch; card fraud detection is streaming. |
| **Big Data** | Data too large, fast or varied for one machine or traditional database — often described by volume, velocity and variety. It is processed across clusters of machines. Tools: Apache Spark, Hadoop, Kafka, Flink. |
| **OLTP vs OLAP** | OLTP systems handle many small, fast transactions for running the business (orders, payments). OLAP systems run large analytical queries over history for reporting. Example: placing an order hits the OLTP database; 'sales by region for 5 years' runs on an OLAP warehouse. |
| **BI** (Business Intelligence) | Business Intelligence turns business data into dashboards and reports that help managers make decisions. It sits on top of data warehouses. Examples: Power BI, Tableau, Looker — e.g. a dashboard showing daily revenue by city. |
| **Schema Migration** | Versioned, scripted changes to a database's structure (add a column, create an index), applied in order in every environment. It keeps all databases in sync with the code and makes changes repeatable. Tools: Flyway, Liquibase — e.g. V12__add_phone_to_users.sql. |

### Cloud & DevOps

| Term | Meaning |
|---|---|
| **Cloud Computing** | Renting computing resources — servers, storage, databases, AI — over the internet and paying for what you use, instead of buying hardware. You can scale up or down in minutes. The big three providers are AWS, Microsoft Azure and Google Cloud. |
| **IaaS / PaaS / SaaS** | Three levels of cloud service. IaaS: you rent raw servers and manage the OS (AWS EC2); PaaS: you just deploy code and the platform runs it (Azure App Service, Heroku); SaaS: ready-to-use software (Gmail, Salesforce). Moving up, you manage less but control less. |
| **Public / Private / Hybrid Cloud** | Public cloud is shared infrastructure from a provider like AWS, rented by many customers. Private cloud is dedicated to one organisation, often on-premises. Hybrid mixes both — e.g. a bank keeps sensitive data on-premises and runs customer apps on AWS. |
| **Region / Availability Zone** | A region is a geographic area with cloud data centres (e.g. AWS Mumbai ap-south-1). An availability zone is a separate data centre inside a region, with its own power and network. Running across 2–3 zones protects you if one fails; using a nearby region reduces latency. |
| **VM** (Virtual Machine) | A software-based computer running its own full operating system on shared physical hardware, managed by a hypervisor. It isolates workloads but is heavier and slower to start than a container. Example: an AWS EC2 instance running Ubuntu. |
| **Container / Docker** | A lightweight package containing an app with all its dependencies, so it runs the same on a laptop, test server or cloud. Containers share the host's OS kernel, so they start in seconds. Docker is the common tool: you write a Dockerfile, build an image and run containers from it. |
| **Kubernetes (K8s)** | A platform that runs and manages containers across many machines — scheduling, scaling, restarting failed ones and rolling out updates. Key terms: pod (running container group), deployment (desired copies), service (stable network address). Managed versions: EKS, AKS, GKE. |
| **DevOps** | A culture and set of practices that bring development and operations together to deliver software faster and more reliably. It relies on automation (CI/CD, IaC), monitoring and shared ownership of production. Result: frequent, small, low-risk releases instead of rare big ones. |
| **CI/CD** | Continuous Integration: every code push is automatically built and tested, catching problems early. Continuous Delivery keeps the code always ready to release with one click; Continuous Deployment releases every passing change automatically. Example: a push to main → build → tests → deploy to staging. |
| **Pipeline** | An automated sequence of steps that takes code from commit to deployment: build → test → security scan → package → deploy. It makes releases repeatable and stops bad code early. Tools: Jenkins, GitHub Actions, GitLab CI, Azure DevOps. |
| **IaC** (Infrastructure as Code) | Defining servers, networks and other infrastructure in code files instead of clicking in consoles. The code is versioned in Git, reviewed and applied the same way every time, so environments are repeatable. Tools: Terraform, AWS CloudFormation, Pulumi. |
| **Configuration Management** | Automating how servers are set up and kept in a desired state — installed software, config files, users — across many machines. It prevents 'works on one server only' drift. Tools: Ansible, Chef, Puppet — e.g. one Ansible playbook installs Java on 50 servers. |
| **GitOps** | Running deployments where Git is the single source of truth for what should run; a tool in the cluster keeps the live state matching the repository. Changes happen by pull request, so every release is reviewed and can be undone with git revert. Tools: Argo CD, Flux. |
| **Blue-Green / Canary Deployment** | Safer release strategies. Blue-green runs two identical environments and switches all traffic to the new one, with instant rollback. Canary sends a small share of users (e.g. 5%) to the new version first and grows it if metrics stay healthy. |
| **Feature Flag** | A switch in code or config that turns a feature on or off at runtime without redeploying. It allows gradual rollouts, A/B tests and an instant kill switch. Example: enable the new checkout for 10% of users, then everyone. Tools: LaunchDarkly, Unleash. |
| **Observability** | Being able to understand what is happening inside a running system from its outputs: logs (events), metrics (numbers over time) and traces (a request's path through services). It helps find the cause of problems quickly. Tools: OpenTelemetry, Prometheus, Grafana, Datadog. |
| **SLA / SLO / SLI** | SLI is what you measure (e.g. % of successful requests). SLO is your internal target for it (99.9%). SLA is the promise to customers in a contract, often with penalties if missed (99.5%). Keeping SLOs stricter than SLAs gives a safety margin. |
| **Auto Scaling** | Automatically adding or removing servers or containers based on load, such as CPU usage or queue length. You handle peaks without paying for idle capacity at quiet times. Example: an AWS Auto Scaling group grows from 2 to 8 instances during a sale. |
| **FinOps** | A practice that brings finance, engineering and business together to understand and control cloud spending. It covers cost visibility, tagging, budgets, rightsizing and discounts like reserved instances. Example: finding and deleting unused volumes saves ₹2 lakh a month. |
| **Artifact / Registry** | An artifact is the built output of a build — a JAR, npm package or Docker image. A registry stores versioned artifacts so the same tested build is deployed everywhere. Examples: Nexus, JFrog Artifactory, Docker Hub, AWS ECR. |

### AI & ML

| Term | Meaning |
|---|---|
| **AI** (Artificial Intelligence) | Machines doing tasks that normally need human intelligence — understanding language, recognising images, making decisions. Older AI used hand-written rules; modern AI mostly learns from data. Everyday examples: spam filters, face unlock, maps traffic prediction, chatbots like Claude. |
| **Machine Learning (ML)** | A branch of AI where systems learn patterns from example data instead of following hand-written rules, and use them to predict new cases. The more good data, the better the model usually gets. Example: a model trained on past transactions flags new ones as likely fraud. |
| **Deep Learning** | Machine learning using neural networks with many layers, which learn complex patterns directly from raw data such as pixels, audio or text. It needs lots of data and GPUs. It powers image recognition, speech-to-text and large language models. |
| **Supervised / Unsupervised Learning** | Supervised learning trains on labelled examples (input plus correct answer) to predict labels — e.g. emails marked spam or not spam. Unsupervised learning finds structure in unlabelled data — e.g. grouping customers into segments by buying behaviour. |
| **Model / Training / Inference** | A model is the learned function that makes predictions. Training is the expensive phase where it learns from data; inference is using the trained model to answer new inputs. Example: training an LLM takes months on GPUs; inference is each answer it gives you. |
| **Generative AI (GenAI)** | AI that creates new content — text, code, images, audio or video — from a prompt, instead of only classifying or predicting. It is built mostly on large foundation models. Examples: Claude or ChatGPT writing code, Midjourney creating images. |
| **LLM** (Large Language Model) | A very large neural network trained on huge amounts of text to predict the next token, which lets it understand and generate language, answer questions and write code. Its knowledge has a cutoff date and it can make mistakes. Examples: Claude, GPT, Gemini, Llama. |
| **Token / Context Window** | A token is a small chunk of text a model reads — roughly ¾ of an English word. The context window is the maximum number of tokens the model can consider at once (prompt plus answer). Pricing and limits are counted in tokens; very long documents may need to be split. |
| **Prompt Engineering** | Writing clear instructions, context and examples so a model gives better, more reliable output. Good prompts state the role, task, format and constraints. Example: 'Return only JSON with fields name and city' instead of 'extract the details'. |
| **Embedding** | A list of numbers (a vector) that represents the meaning of text, images or code, so similar meanings have nearby vectors. It powers semantic search and recommendations. Example: 'reset my password' and 'forgot login' get close embeddings even though they share no words. |
| **Vector Database** | A database that stores embeddings and quickly finds the ones most similar to a query vector. It is the retrieval engine behind RAG and semantic search. Examples: pgvector (PostgreSQL), Pinecone, Weaviate, Milvus. |
| **RAG** (Retrieval-Augmented Generation) | Retrieval-Augmented Generation: first search your own documents for relevant passages, then give them to the LLM so it answers from that material. It gives up-to-date, source-backed answers without retraining the model. Example: an HR chatbot answering leave-policy questions from the company handbook. |
| **Fine-tuning** | Further training an existing model on your own examples so it learns a specific style, format or task. Use it for consistent behaviour; use RAG instead when the model needs fresh facts. Example: fine-tuning a small model on 5,000 support tickets to classify new ones. |
| **Hallucination** | When an AI model confidently produces information that is false or made up, such as fake citations or wrong numbers. It happens because models predict likely text, not verified facts. Reduce it with grounding (RAG), asking for sources, and checking important answers. |
| **AI Agent** | An AI system where an LLM works in a loop — plans steps, calls tools (search, code, APIs), looks at results and decides the next step — until the goal is done. It can handle multi-step tasks, not just single answers. Example: a coding agent that reads a bug report, edits files and runs tests. |
| **Tool / Function Calling** | A feature where the model, instead of plain text, returns a structured request to call a function you defined, with arguments. Your code runs the function and sends the result back. Example: the model returns get_weather(city="Pune"); your app calls the weather API. |
| **MCP** (Model Context Protocol) | Model Context Protocol: an open standard for connecting AI apps to tools and data sources through one common interface. Build an MCP server once, and any MCP-compatible client (Claude, IDEs, agents) can use it. Example: an MCP server that lets an assistant query your Jira or database. |
| **Guardrails** | Checks around an AI system that keep inputs and outputs safe, on-topic and in the right format. They can block harmful requests, remove personal data and validate answers. Example: a banking chatbot refuses to give investment advice and masks card numbers. |
| **MLOps / LLMOps** | Practices and tools to deploy, monitor, version and update ML or LLM systems in production reliably — like DevOps for models. They cover data and model versioning, evaluation, drift monitoring and cost tracking. Tools: MLflow, SageMaker, Langfuse. |
| **NLP / Computer Vision** | Two big AI fields. NLP (Natural Language Processing) works with human language — translation, sentiment, chatbots. Computer Vision works with images and video — face recognition, defect detection, self-driving cars. |
| **Agentic AI** | AI systems that act with some independence — they plan, use tools and take multiple steps toward a goal, instead of only answering one prompt. They need limits and oversight because their actions have real effects. Example: an agent that books travel within a budget and asks before paying. |
| **Multi-Agent System** | Several specialised AI agents working together, each with its own role and tools, coordinated by an orchestrator. Splitting the work can improve quality on complex tasks but adds cost and coordination issues. Example: a planner agent, a research agent and a writer agent producing a report. |
| **Context Engineering** | Deciding exactly what goes into a model's context window — instructions, retrieved documents, tool definitions, memory and history — and in what form. Models answer only from what they see, so good context matters more than clever wording. Example: giving an agent only the 3 relevant files instead of the whole repository. |
| **Evals** (Evaluations) | Automated tests that measure AI output quality on a fixed set of examples, run before and after every change. They catch regressions when you change prompts, models or retrieval. Example: 200 support questions with expected answers, scored on accuracy after each prompt edit. |
| **LLM-as-a-Judge** | Using an LLM with a clear scoring guide to grade another model's answers for qualities like correctness, relevance or tone. It scales evaluation beyond what humans can review, but should be checked against human ratings. Example: a judge model rates chatbot answers 1–5 for helpfulness. |
| **Grounding** | Making an AI answer from trusted, provided sources instead of its general memory, often with citations. It reduces hallucination and lets users verify answers. Example: a support bot that answers only from the product manual and links the page it used. |
| **Human-in-the-Loop (HITL)** | A design where a person reviews, corrects or approves AI work at key steps, especially before risky or irreversible actions. It combines AI speed with human judgement. Example: an AI drafts refund decisions, and an agent approves any refund over ₹10,000. |
| **Prompt Injection / Jailbreak** | Attacks on AI systems. Prompt injection hides malicious instructions in content the model reads (a web page or email) to make it ignore its rules. A jailbreak is a crafted prompt that tricks the model into bypassing its safety limits. Defences: treat input as data, limit tool permissions, add guardrails. |
| **Foundation Model** | A large model trained on broad data that can be adapted to many tasks through prompting, RAG or fine-tuning, instead of training a new model per task. Most GenAI products are built on one. Examples: Claude, GPT, Gemini, Llama. |
| **Multimodal** | A model that understands and/or generates more than one type of data — text, images, audio or video — in the same conversation. Example: upload a photo of a whiteboard diagram and ask the model to turn it into code or a written summary. |
| **Reasoning Model** | A model that works through a problem step by step internally before giving the final answer. It is better at maths, coding and multi-step logic, but slower and more costly per answer. Use it for hard problems and a faster model for simple ones. |
| **SLM** (Small Language Model) | A Small Language Model with far fewer parameters than a frontier LLM, so it is cheap, fast and can run on a laptop or phone. It suits narrow tasks such as classification or on-device assistants. Examples: Microsoft Phi, Google Gemma, small Llama models. |
| **Open-Weight Model** | A model whose trained weights are published so you can download, run and fine-tune it on your own hardware. It gives control over data privacy and cost, but you handle hosting and safety. Examples: Llama, Mistral, Qwen, DeepSeek. |
| **Temperature** | A setting that controls how random a model's output is. Low temperature (0–0.3) gives focused, repeatable answers for facts, code and extraction; higher (0.7–1) gives more varied, creative text. Example: use temperature 0 to extract invoice fields reliably. |
| **Structured Output** | Making a model return data in an exact format, usually JSON that matches a schema, instead of free text. Your code can then parse it safely. Example: asking for {"name": string, "amount": number} from an invoice and getting valid JSON every time. |
| **RLHF** (Reinforcement Learning from Human Feedback) | A training step where humans rank a model's answers and the model is tuned to prefer the highly ranked ones. It makes models more helpful, honest and safe in conversation. It is one reason chat models follow instructions better than raw pretrained ones. |
| **LoRA / PEFT** | PEFT (Parameter-Efficient Fine-Tuning) methods adapt a big model by training only a small number of extra weights. LoRA, the most popular, adds small low-rank matrices to the layers. This makes fine-tuning possible on one GPU, and adapters are only megabytes in size. |
| **Quantization** | Storing a model's numbers with fewer bits (e.g. 16-bit → 8-bit or 4-bit) so it uses less memory and runs faster, with a small loss in quality. It is how large open models run on laptops and cheaper GPUs. Example: a 4-bit 8B model fits in about 5 GB of memory. |
| **Distillation** | Training a smaller 'student' model to copy the outputs of a larger 'teacher' model. The student keeps much of the teacher's quality at a fraction of the cost and speed. Example: a small model distilled from a large one to run customer-support replies cheaply. |
| **MoE** (Mixture of Experts) | Mixture of Experts: a model with many expert sub-networks where a router activates only a few for each token. It gives the knowledge of a huge model while using the compute of a smaller one per token. Examples: Mixtral, and several large frontier models. |
| **Inference Serving / GPU** | Running trained models to answer user requests, usually on GPUs, with batching and caching to serve many users quickly and cheaply. Serving engines manage memory and throughput. Tools: vLLM, TensorRT-LLM, Ollama (local), or managed APIs like Amazon Bedrock. |
| **TTFT / Tokens per Second** | Two LLM speed metrics. TTFT (time to first token) is how long before the answer starts appearing — key for chat feeling responsive. Tokens per second is how fast the rest streams out. Example: TTFT 400 ms and 60 tokens/s feels instant to a user. |
| **Semantic Caching** | Caching LLM answers and reusing them when a new question means the same thing, found by comparing embeddings, not exact text. It cuts cost and response time for repeated questions. Example: 'how do I reset my password?' and 'forgot password steps' return the same cached answer. |
| **Model Router / AI Gateway** | A layer between your apps and AI providers that picks a model for each request (cheap for simple, strong for hard) and handles API keys, rate limits, fallbacks, logging and cost tracking in one place. Examples: LiteLLM, Portkey, cloud AI gateways. |
| **A2A** (Agent-to-Agent Protocol) | Agent-to-Agent Protocol: an open protocol that lets AI agents built by different vendors discover each other's skills and hand off tasks in a standard way. MCP connects an agent to tools; A2A connects agents to other agents. Example: a travel agent asking a separate payments agent to complete a booking. |
| **AI Copilot / Assistant** | AI built into a tool you already use, helping you while you stay in control — suggesting, drafting and answering questions. It speeds up work but its output still needs review. Examples: GitHub Copilot suggesting code, Microsoft 365 Copilot drafting emails. |
| **Vibe Coding** | Building software mostly by describing what you want to an AI and accepting its code with little line-by-line review. It is fast for prototypes and personal tools but risky for production, where bugs and security issues can slip in. Good practice: add tests and review before shipping. |
| **Spec-Driven Development** | Writing a clear specification first — requirements, inputs and outputs, edge cases, acceptance tests — and then letting AI coding agents implement it. The spec becomes the source of truth and the way to check the AI's work. Example: a markdown spec plus tests, which the agent must make pass. |
| **Synthetic Data** | Artificially generated data that mimics real data's patterns, used when real data is scarce, sensitive or expensive. It is used for training models and testing systems without exposing personal data. Example: generating fake but realistic patient records to test a hospital app. |
| **Edge AI / TinyML** | Running AI models directly on devices — phones, cameras, sensors — instead of sending data to the cloud. It gives low latency, works offline and keeps data private. Example: a phone recognising your face, or a factory sensor detecting faults on a microcontroller (TinyML). |
| **Responsible AI** | Building and using AI that is fair, transparent, private, safe and accountable. It includes testing for bias, explaining decisions, protecting data and having humans responsible for outcomes. Example: checking a loan-approval model gives similar results across genders and regions. |
| **EU AI Act / ISO 42001** | The EU AI Act is a law that classifies AI systems by risk (banned, high, limited, minimal) and sets rules for each, including for companies outside the EU serving EU users. ISO/IEC 42001 is an international standard for running an AI management system. Both shape AI compliance work. |
| **AGI** (Artificial General Intelligence) | Artificial General Intelligence: a hypothetical AI that could learn and perform most intellectual tasks as well as a human, across domains. Today's systems are strong in many areas but not considered AGI. Its definition and timeline are widely debated. |

### Testing & Quality

| Term | Meaning |
|---|---|
| **Unit Test** | A small automated test that checks one function or class on its own, with its dependencies replaced by mocks. Unit tests run in milliseconds, so you run hundreds on every change. Example: a JUnit test checking calculateTax(1500000) returns the expected amount. Tools: JUnit, Jest, pytest. |
| **Integration Test** | A test that checks several parts working together for real — such as an API with its database, or two services. It catches problems unit tests miss, like wrong SQL or bad configuration. Example: a Spring Boot test that calls POST /orders and checks the row in a Testcontainers MySQL database. |
| **E2E Test** (End-to-End) | A test that runs a full user journey through the real UI in a browser, from start to finish, like a user would. It gives the most confidence but is slowest and most fragile, so keep only key flows. Example: log in → add to cart → pay → see confirmation. Tools: Playwright, Cypress, Selenium. |
| **Regression Test** | Re-running existing tests after a change to make sure features that used to work still work. Automating it lets you release often without fear. Example: after changing the discount logic, the full checkout test suite runs again to confirm nothing else broke. |
| **Smoke / Sanity Test** | Quick checks after a build or deployment. A smoke test confirms the main features work at all (app starts, login works) before deeper testing. A sanity test checks that one specific fix or change works. Example: after deploying, hit /health and log in once. |
| **Performance / Load Test** | Tests that measure how fast and stable a system is under traffic. Load tests use expected traffic; stress tests push beyond it to find the breaking point. Example: simulating 5,000 users checking out to confirm response time stays under 2 s. Tools: JMeter, k6, Gatling. |
| **TDD / BDD** | TDD (Test-Driven Development): write a failing test first, write just enough code to pass, then refactor (red → green → refactor). BDD (Behaviour-Driven Development): describe behaviour in plain Given-When-Then scenarios that business and developers share. Example BDD tool: Cucumber. |
| **Mocking** | Replacing a real dependency (database, API, email service) with a fake that returns controlled answers during a test. It keeps tests fast and focused on the code under test. Example: Mockito makes PaymentGateway.charge() return 'success' so OrderService can be tested without a real payment. |
| **Code Coverage** | The percentage of code lines or branches that run during your tests. It shows untested areas, but high coverage doesn't prove tests check the right things. Many teams aim for 70–80% on business logic. Tools: JaCoCo (Java), Istanbul/nyc (JavaScript). |
| **Static Code Analysis** | Tools that scan source code without running it to find bugs, security issues, code smells and style problems. It runs in the IDE and in CI so problems are caught before review. Examples: SonarQube, ESLint, Checkstyle, SpotBugs. |
| **Code Review** | Teammates read and comment on code changes, usually in a pull request, before they are merged. It catches bugs, spreads knowledge and keeps code consistent. Good reviews are small, quick and focused on correctness and clarity, not personal style. |
| **Bug / Defect Severity vs Priority** | Severity is how badly a bug affects the system (set by QA); priority is how soon it must be fixed (set by the business). They don't always match. Example: a typo in the company name on the home page is low severity but high priority; a crash in a rarely used report may be high severity but lower priority. |

### Security

| Term | Meaning |
|---|---|
| **Authentication (AuthN)** | Proving who you are to a system — with a password, OTP, fingerprint or security key. It happens before the system decides what you may do. Example: logging in with email + password + an OTP; the server then issues a session or token. |
| **Authorization (AuthZ)** | Deciding what an already-authenticated user is allowed to do or see. It is checked on every request, usually by roles or permissions. Example: an employee can view their own payslip, but only HR can view everyone's (otherwise HTTP 403 Forbidden). |
| **OAuth 2.0 / OIDC** | OAuth 2.0 lets an app access your data on another service without your password, using limited, revocable tokens (delegated access). OpenID Connect (OIDC) adds a standard login layer on top that tells the app who you are. Example: 'Sign in with Google' uses OIDC. |
| **JWT** (JSON Web Token) | A compact, signed token that carries claims such as user ID, roles and expiry, so a server can verify the user without a session lookup. It is signed, not encrypted — don't put secrets in it — and should be short-lived with refresh tokens. Format: header.payload.signature. |
| **SSO** (Single Sign-On) | Logging in once with one identity and getting access to many applications without signing in again. It improves user experience and lets IT control access centrally. Example: one company login opens email, Jira and payroll. Providers: Okta, Microsoft Entra ID, Google. |
| **MFA / 2FA** | Requiring two or more kinds of proof to log in: something you know (password), something you have (phone OTP, authenticator app, security key) or something you are (fingerprint). Even a stolen password isn't enough. Example: bank login with password plus an OTP. |
| **RBAC** (Role-Based Access Control) | Giving permissions to roles (admin, editor, viewer) and then assigning roles to users, instead of setting permissions per person. It is simple to manage and audit. Example: in Jira, a 'Project Admin' role can change workflows; 'Developer' can only edit issues. |
| **Encryption (at rest / in transit)** | Scrambling data so only holders of the key can read it. At rest protects stored data (disks, databases, backups); in transit protects data moving over networks, using TLS (HTTPS). Example: a stolen database backup is useless without the encryption key. |
| **Hashing** | A one-way function that turns data into a fixed-length value that can't be turned back into the original. Passwords are stored as slow, salted hashes so even a leaked database doesn't reveal them. Use bcrypt or Argon2 for passwords; SHA-256 for checking file integrity. |
| **OWASP Top 10** | A regularly updated list of the ten most critical web application security risks, published by the OWASP foundation. It is the common checklist for secure coding and security testing. Examples: broken access control, injection, security misconfiguration, vulnerable components. |
| **SQL Injection / XSS / CSRF** | Three common web attacks. SQL injection: input changes your database query (prevent with parameterised queries). XSS: attackers inject scripts into pages others view (prevent by escaping output). CSRF: a malicious site makes your browser send unwanted requests (prevent with CSRF tokens or SameSite cookies). |
| **Firewall / WAF** | A firewall allows or blocks network traffic by rules on IP addresses, ports and protocols. A WAF (Web Application Firewall) inspects HTTP requests and blocks web attacks like SQL injection and XSS before they reach your app. Examples: AWS Security Groups (firewall), AWS WAF, Cloudflare WAF. |
| **Zero Trust** | A security model that trusts no user or device by default, even inside the office network. Every request must prove identity, device health and permission, with least-privilege access. Example: staff need SSO with MFA and a managed laptop to reach internal apps, even on office Wi-Fi. |
| **Vulnerability / CVE** | A vulnerability is a weakness attackers can exploit. A CVE is the public ID given to a known vulnerability so everyone can track and patch it, usually with a severity score (CVSS). Example: CVE-2021-44228 (Log4Shell) in Log4j forced companies worldwide to upgrade urgently. |
| **SAST / DAST** | Two kinds of automated security testing. SAST scans source code for insecure patterns without running it, early in CI. DAST attacks the running application from outside, like a hacker would. Examples: SonarQube or Checkmarx (SAST), OWASP ZAP or Burp Suite (DAST). |
| **Secrets Management** | Storing passwords, API keys and certificates securely in a dedicated vault instead of in code or config files, with access control, audit logs and rotation. Apps fetch secrets at runtime. Tools: HashiCorp Vault, AWS Secrets Manager, Azure Key Vault. |
| **SIEM / SOC** | A SIEM is a platform that collects and analyses security logs from across an organisation to detect threats and raise alerts. A SOC (Security Operations Centre) is the team that watches those alerts 24×7 and responds to incidents. Example SIEMs: Splunk, Microsoft Sentinel. |
| **Penetration Testing** | An authorised, simulated attack on a system by security experts to find weaknesses before real attackers do. It ends with a report of findings and fixes, and is often required for compliance. Example: a yearly pen test of a banking app before an audit. |

### Networking

| Term | Meaning |
|---|---|
| **IP Address** | A numeric address that identifies a device on a network so data can be delivered to it. IPv4 looks like 192.168.1.10 (addresses are running out); IPv6 is much longer (2001:db8::1). Private IPs work inside a network; public IPs are reachable on the internet. |
| **DNS** (Domain Name System) | The internet's phone book: it translates names like google.com into IP addresses computers use. Results are cached to keep lookups fast. Example: typing a site name triggers a DNS lookup first; wrong DNS records are a common cause of 'site not reachable'. |
| **HTTP / HTTPS** | HTTP is the request-response protocol browsers and APIs use to exchange data. HTTPS is HTTP encrypted with TLS, which hides the data from eavesdroppers and proves the site's identity with a certificate. Today every site and API should use HTTPS. |
| **TCP / UDP** | Two transport protocols. TCP sets up a connection and guarantees ordered, complete delivery (web pages, APIs, email). UDP just sends packets with no guarantee — faster, for cases where speed matters more than every packet (video calls, gaming, DNS). |
| **Port** | A number that identifies which program on a machine should receive network traffic, so one server can run many services. Common ports: 80 HTTP, 443 HTTPS, 22 SSH, 3306 MySQL, 5432 PostgreSQL, 8080 dev servers. Example: localhost:8080 means port 8080 on your own machine. |
| **VPN** (Virtual Private Network) | An encrypted tunnel over the internet into a private network, making your device act as if it were inside that network. Companies use it so staff can reach internal systems safely from home. Example: connecting to the office VPN to open an internal Jenkins server. |
| **VPC / Subnet** | A VPC is your own isolated private network inside a cloud provider. Subnets divide it: public subnets for internet-facing resources (load balancers), private subnets for things that shouldn't be reachable directly (databases). Example: an app server in a public subnet talks to RDS in a private subnet. |
| **Proxy / Reverse Proxy** | A forward proxy sits in front of clients and sends their requests out to the internet (e.g. a company web filter). A reverse proxy sits in front of servers and receives requests for them — handling SSL, caching, load balancing and routing. Example: Nginx as a reverse proxy in front of Node.js apps. |
| **Latency / Bandwidth / Throughput** | Latency is the delay for one request to travel and get a response (milliseconds). Bandwidth is the maximum data a link can carry. Throughput is how much data or how many requests actually get through per second. Example: a road's speed limit is like latency, its number of lanes like bandwidth. |
| **OSI Model** | A 7-layer reference model of how network communication works: Physical, Data Link, Network (IP), Transport (TCP/UDP), Session, Presentation, Application (HTTP). It helps people describe where a problem is. Example: 'it's a layer 7 issue' means the application, not the network. |
| **SSH** (Secure Shell) | A secure, encrypted way to log in to and run commands on a remote server, usually using key pairs instead of passwords. It is also used to copy files securely and by Git. Example: ssh ubuntu@10.0.1.5 to open a terminal on a cloud server. |

### Agile & Process

| Term | Meaning |
|---|---|
| **Agile** | A way of working that delivers software in small increments with frequent feedback, instead of one big release at the end. Teams adapt plans as they learn. Scrum and Kanban are the most common Agile methods. Example: shipping a usable feature every two weeks and adjusting from user feedback. |
| **Waterfall** | A sequential approach where each phase — requirements, design, build, test, deploy — finishes completely before the next starts. It suits fixed, well-understood requirements but makes late changes costly. Still used in some government, regulated and fixed-price projects. |
| **Scrum** | An Agile framework where a small team delivers work in fixed sprints. It has three roles — Product Owner (what to build), Scrum Master (process coach) and Developers — plus regular events and artifacts like the backlog. It gives a steady rhythm of planning, delivery and improvement. |
| **Kanban** | An Agile method that shows work on a board (To Do → In Progress → Done) and limits how many items can be in progress at once. Work flows continuously instead of in sprints, which suits support and operations teams. Key metric: lead time from request to done. |
| **Sprint** | A fixed time box, usually two weeks, in which a Scrum team commits to and delivers a set of backlog items. Each sprint ends with a potentially releasable increment and a review. Example: Sprint 14 (1–14 March) delivers the new payslip download feature. |
| **Scrum Ceremonies** | The regular meetings in Scrum: Sprint Planning (choose the work), Daily Stand-up (15 minutes on progress and blockers), Sprint Review (demo to stakeholders) and Retrospective (how to work better). Together they keep the team aligned and improving. |
| **Backlog** | An ordered list of everything the product might need — features, bugs, improvements — with the most important items at the top. The Product Owner keeps it prioritised; the team pulls the top items into each sprint. Items near the top are detailed; items lower down can stay rough. |
| **Epic / Story / Task / Bug** | Ways to split work in tools like Jira. An epic is a large goal spanning sprints; a story is a user-facing piece of it; a task is a technical step; a bug is a defect. Example: Epic 'Online payments' → Story 'Pay by UPI' → Tasks 'Add Razorpay SDK', 'Write webhook'. |
| **User Story** | A short requirement written from the user's point of view: 'As a <user>, I want <goal>, so that <benefit>.' It keeps the focus on value and starts a conversation rather than being a full spec. Example: 'As an employee, I want to download my payslip, so that I can apply for a loan.' |
| **Acceptance Criteria** | Specific, testable conditions a user story must meet to be accepted as done. They remove ambiguity between business, developers and testers, often written as Given-When-Then. Example: 'Given I am logged in, when I click Download, then the payslip PDF for the chosen month downloads.' |
| **Definition of Done (DoD)** | A checklist the whole team agrees every item must meet before it counts as done. It keeps quality consistent and avoids 'done but not tested'. Example: code reviewed, unit tests passing, documentation updated, deployed to QA and accepted by the PO. |
| **Story Points / Velocity** | Story points estimate relative effort and complexity (often 1, 2, 3, 5, 8, 13), not hours. Velocity is the average number of points a team completes per sprint, used to plan future sprints. Example: a team with velocity 30 plans about 30 points next sprint. Don't compare velocity across teams. |
| **SAFe** (Scaled Agile Framework) | The Scaled Agile Framework: a structured way to run Agile across many teams working on one large product. Teams are grouped into Agile Release Trains that plan together in PI (Program Increment) Planning every 8–12 weeks. Common in large enterprises and banks. |
| **ITIL** | A widely used framework of best practices for IT service management — running IT services reliably for the business. It defines processes such as incident, problem, change and service request management. Tools like ServiceNow and Jira Service Management follow ITIL. |
| **Incident / Problem / Change** | ITIL terms. An incident is an unplanned outage or degradation to restore fast. A problem is the underlying cause of one or more incidents, investigated to stop repeats. A change is a planned, approved modification to production. Example: checkout down (incident) → memory leak found (problem) → fix deployed (change). |
| **RCA** (Root Cause Analysis) | Root Cause Analysis: investigating an issue until you find the real underlying cause, not just the symptom, so it doesn't happen again. Common methods: 5 Whys and fishbone diagrams. Example: 'site down' → disk full → logs not rotated → missing log-rotation config (root cause). |
| **Postmortem** | A written, blameless review after an incident: what happened, the timeline, impact, root cause and action items to prevent a repeat. 'Blameless' means focusing on systems and processes, not punishing people, so teams share honestly. Example: a postmortem after a 2-hour payment outage. |
| **On-Call** | A rotation where an engineer is responsible for responding to production alerts outside normal hours, for a set period such as a week. They triage, fix or escalate issues following runbooks. Often paid with an on-call allowance. Tools: PagerDuty, Opsgenie. |
| **Runbook / Playbook** | A step-by-step guide for handling a known operational task or incident, so anyone on call can follow it under pressure. Runbooks are specific procedures; playbooks cover broader scenarios and decisions. Example: 'Database CPU above 90%: check slow queries → kill long-running query → scale up'. |

### Business & Company

| Term | Meaning |
|---|---|
| **Forward Deployed Engineering** | A model where engineers work directly with a customer's team to understand their problems and deploy, customise and integrate the product on site. It blends software engineering, consulting and solutions work. Popularised by Palantir and now common at AI companies; see the FDE role. |
| **AI-Native Company** | A company whose product and internal workflows are built around AI from day one, rather than adding AI to an existing product. Small teams use AI agents for coding, support and operations. Example: a startup whose whole product is an AI agent, with AI handling most first-line support. |
| **CAIO** (Chief AI Officer) | Chief AI Officer: the executive responsible for an organisation's AI strategy — where to use AI, which platforms to adopt, governance, risk and return on investment. The role is growing as AI moves from experiments to core business. They usually work with the CTO, CIO and legal teams. |
| **Product Company vs Service Company** | A product company builds and sells its own software (Google, Zoho, Freshworks), so engineers own one product long-term. A service company builds software for clients (TCS, Infosys, Accenture), so engineers work on different client projects. Product companies usually pay more; service companies offer variety and scale. |
| **Startup / MNC / GCC** | A startup is an early-stage company growing fast, with more risk and ownership. An MNC is a large multinational with established processes. A GCC (Global Capability Centre) is an in-house offshore unit of a global company, e.g. a US bank's technology centre in Bengaluru, doing core work rather than outsourced projects. |
| **Onsite / Offshore** | Delivery terms in IT services. Onsite means working at the client's location, often abroad; offshore means working from the vendor's delivery centre, usually in India. Projects often mix both: a few onsite coordinators with a larger offshore team. |
| **Client / Stakeholder** | The client is the organisation paying for the work. A stakeholder is anyone affected by or able to influence the project — users, managers, other teams, regulators. Identifying stakeholders early avoids surprises late. Example: for a payroll system, stakeholders include HR, finance, employees and auditors. |
| **BRD / FRD / SRS** | Requirement documents at different levels. BRD (Business Requirements Document): what the business needs and why. FRD (Functional Requirements Document): how the system should behave to meet it. SRS (Software Requirements Specification): detailed functional and non-functional requirements for builders. |
| **SOW** (Statement of Work) | Statement of Work: a contract document that defines a project's scope, deliverables, timelines, milestones, acceptance criteria and payment terms between client and vendor. Anything outside it is a change request. Example: an SOW for building a mobile app in 6 months for a fixed fee. |
| **RFP / RFI / RFQ** | Documents a company sends to vendors when buying. RFI (Request for Information): learn what vendors offer. RFP (Request for Proposal): ask for a detailed solution and price for a defined need. RFQ (Request for Quotation): ask for prices when the exact requirement is already known. |
| **T&M vs Fixed Price** | Two ways to bill a project. Time & Material: the client pays for actual hours or days worked — flexible when scope changes. Fixed price: one agreed cost for a fixed scope — predictable for the client but risky for the vendor if estimates are wrong. |
| **KPI / OKR** | A KPI (Key Performance Indicator) is a metric you track continuously to see how something is performing, e.g. uptime or monthly active users. OKRs (Objectives and Key Results) set an ambitious goal plus 3–5 measurable results for a quarter. Example OKR: 'Make checkout faster' → 'cut p95 latency from 3 s to 1 s'. |
| **ROI** (Return on Investment) | Return on Investment: how much benefit you get compared to what you spent, usually as a percentage — (gain − cost) ÷ cost × 100. It is used to justify projects and tools. Example: automation costing ₹10 lakh that saves ₹25 lakh a year has 150% first-year ROI. |
| **Bench** | A service-company term for employees who are not currently assigned to a billable client project. Bench time is used for training and internal work while waiting for the next project; long bench periods can affect appraisals. Example: 'I've been on the bench for 3 weeks since my project ended.' |
| **Appraisal / Hike / Band** | An appraisal is the yearly (sometimes half-yearly) performance review that sets your rating. A hike is the salary increase that follows, as a % of current pay. A band or grade is your level, with a salary range for it. Example: a rating of 'Exceeds' in band L4 gets a 12% hike. |
| **CTC** (Cost to Company) | Cost to Company: the total yearly amount a company spends on you — fixed salary, variable pay, employer PF, gratuity and benefits. It is the headline number in offer letters, but your take-home is lower because part of it is never paid monthly. Example: ₹15 LPA CTC gives roughly ₹96,000 a month in hand (new regime). See Salary & Payslips. |
| **LPA** (Lakhs Per Annum) | Lakhs Per Annum — the usual way Indian salaries are quoted: 1 LPA = ₹1,00,000 a year, and 100 LPA = ₹1 crore. It almost always refers to CTC, not take-home. Example: '12 LPA' means ₹12,00,000 CTC a year, or ₹1 lakh a month before deductions. |
| **Fixed vs Variable Pay** | Fixed pay is the guaranteed part of salary paid every month. Variable pay is a performance-linked bonus, usually paid yearly or quarterly, that may be paid only partly or not at all. Example: ₹20 LPA with 10% variable = ₹18 L guaranteed + up to ₹2 L bonus. Compare offers on fixed pay first. |
| **In-Hand Salary** | The amount actually credited to your bank account each month after employee PF, professional tax and income tax are deducted. Because CTC also includes variable pay, employer PF and gratuity, in-hand is usually around 70–90% of fixed CTC ÷ 12, lower at higher tax slabs. Example: ₹15 LPA CTC → about ₹96,000 a month. |
| **ESOP / RSU** | Two ways companies share ownership. ESOPs (common in startups) give the right to buy shares later at a low fixed price; RSUs (common at listed companies) give shares free as they vest. Both usually vest over about 4 years and are taxed as salary when you exercise (ESOP) or when they vest (RSU). |
| **Joining Bonus / Notice Buyout** | A joining bonus is a one-time payment for accepting an offer, often to cover a bonus you lose by leaving, and usually must be repaid if you quit within a year. A notice buyout is paying your current employer (often the new employer reimburses it) so you can leave before finishing your notice period. |
| **Notice Period** | The time you must keep working after resigning before your last day, as written in your contract — typically 30–90 days in India. It lets the company hand over your work and hire a replacement. You can sometimes shorten it with leave adjustment or a buyout. |
| **B2B / B2C** | Business models by who the customer is. B2B companies sell to other businesses (Salesforce, Zoho, AWS) — fewer, larger customers with longer sales cycles. B2C companies sell directly to consumers (Swiggy, Flipkart) — many customers and a focus on user experience and scale. |
| **Go-Live** | The moment a new system or major release is switched on for real users in production. It is usually planned with a checklist, a rollback plan and extra support standing by. Example: the new payroll system goes live on 1 April, the start of the financial year. |
| **Hypercare** | A short period of intensive support right after go-live, typically 2–6 weeks, when the project team watches the system closely and fixes issues fast. After hypercare, support moves to the normal support team. Example: developers stay on daily calls with users in the first month after launch. |

## Technology Stack Map

### Programming Languages

| Technology | Used for |
|---|---|
| Java | Enterprise backends, Android, big data |
| Python | AI/ML, data, automation, backends |
| JavaScript | Web frontends, Node.js backends |
| TypeScript | Typed JavaScript for large apps (Angular, React, Node) |
| C# | .NET backends, Windows apps, Unity games |
| Go | Cloud tools, microservices, DevOps (Docker, K8s written in Go) |
| Kotlin | Android apps, modern JVM backends |
| Swift | iOS / macOS apps |
| C / C++ | Systems, embedded, games, high performance |
| Rust | Safe systems programming, performance tools |
| PHP | Websites, WordPress, Laravel |
| Ruby | Web apps (Ruby on Rails) |
| Scala | Big data (Spark), functional JVM |
| R | Statistics, data analysis |
| SQL | Querying relational databases |
| Bash / PowerShell | Scripting and automation |
| Dart | Flutter cross-platform apps |
| COBOL | Mainframe banking and insurance |

### Frontend Frameworks & Libraries

| Technology | Used for |
|---|---|
| Angular | Full framework by Google (TypeScript) |
| React | UI library by Meta |
| Vue | Lightweight progressive framework |
| Next.js / Nuxt | React / Vue with server rendering |
| Svelte | Compile-time UI framework |
| RxJS | Reactive streams (used heavily in Angular) |
| Tailwind / Bootstrap | CSS frameworks |
| Angular Material / MUI | Ready-made UI components |

### Backend Frameworks

| Technology | Used for |
|---|---|
| Spring Boot | Java — the enterprise standard |
| .NET / ASP.NET Core | C# — Microsoft stack |
| Node.js + Express / NestJS | JavaScript/TypeScript servers |
| Django / Flask / FastAPI | Python web frameworks |
| Ruby on Rails | Ruby web framework |
| Laravel | PHP web framework |
| Gin / Fiber | Go web frameworks |
| Quarkus / Micronaut | Cloud-native Java |

### Mobile

| Technology | Used for |
|---|---|
| Android (Kotlin) | Native Android |
| iOS (Swift) | Native iPhone/iPad |
| Flutter | Cross-platform (Dart) |
| React Native | Cross-platform (JS/TS) |

### Databases

| Technology | Used for |
|---|---|
| PostgreSQL / MySQL | Open-source relational |
| Oracle / SQL Server | Enterprise relational |
| MongoDB | Document NoSQL |
| Redis | In-memory cache / key-value |
| Cassandra | Wide-column, massive scale |
| DynamoDB / Cosmos DB | Managed cloud NoSQL |
| Elasticsearch / OpenSearch | Full-text search & logs |
| Neo4j | Graph database |
| Snowflake / BigQuery / Redshift | Cloud data warehouses |

### Cloud Platforms

| Technology | Used for |
|---|---|
| AWS | Market leader — EC2, S3, Lambda, RDS |
| Microsoft Azure | Enterprise / Microsoft shops — VMs, AKS, Functions |
| Google Cloud (GCP) | Data & AI strengths — GKE, BigQuery |
| Oracle Cloud / IBM Cloud | Enterprise niches |

### DevOps & Infrastructure

| Technology | Used for |
|---|---|
| Git + GitHub / GitLab / Bitbucket | Source control & collaboration |
| Jenkins / GitHub Actions / GitLab CI / Azure DevOps | CI/CD pipelines |
| Docker | Containers |
| Kubernetes / OpenShift | Container orchestration |
| Helm / Argo CD | K8s packaging / GitOps deploys |
| Terraform / CloudFormation | Infrastructure as Code |
| Ansible | Configuration management |
| Maven / Gradle / npm | Build & dependency tools |
| Nexus / Artifactory | Artifact repositories |

### Monitoring & Observability

| Technology | Used for |
|---|---|
| Prometheus + Grafana | Metrics and dashboards |
| ELK (Elasticsearch, Logstash, Kibana) | Log search |
| Splunk | Enterprise logs & security |
| Datadog / New Relic / Dynatrace / AppDynamics | APM (Application Performance Monitoring) |
| OpenTelemetry | Standard for traces, metrics, logs |
| CloudWatch / Azure Monitor | Cloud-native monitoring |

### Messaging & Streaming

| Technology | Used for |
|---|---|
| Apache Kafka | High-throughput event streaming |
| RabbitMQ / ActiveMQ | Traditional message brokers |
| AWS SQS / SNS / EventBridge | Managed cloud messaging |
| Azure Service Bus | Managed Azure messaging |

### Testing

| Technology | Used for |
|---|---|
| JUnit / TestNG / Mockito | Java unit testing & mocks |
| Jest / Vitest / Jasmine / Karma (deprecated) | JavaScript unit testing (Angular now defaults to Vitest) |
| pytest | Python testing |
| Selenium / Playwright / Cypress | Browser automation & E2E |
| Appium | Mobile automation |
| Postman / REST Assured | API testing |
| JMeter / k6 / Gatling | Load testing |
| Cucumber | BDD (Given-When-Then) |

### AI & Data Tools

| Technology | Used for |
|---|---|
| PyTorch / TensorFlow | Deep learning frameworks |
| scikit-learn / pandas / NumPy | Classic ML & data handling |
| Hugging Face | Open model hub & libraries |
| LangChain / LlamaIndex | LLM app frameworks |
| Claude / GPT / Gemini / Llama | Large language models |
| Apache Spark / Databricks | Big data processing |
| Airflow / dbt | Pipeline orchestration / SQL transforms |
| Jupyter | Interactive notebooks |

### GenAI Application Stack (New)

| Technology | Used for |
|---|---|
| Claude / GPT / Gemini | Frontier closed models via API |
| Llama / Mistral / Qwen / DeepSeek / Gemma | Open-weight models to self-host |
| AWS Bedrock / Azure AI Foundry / Vertex AI | Managed cloud model access |
| MCP (Model Context Protocol) | Standard to connect AI to tools & data |
| LangGraph / CrewAI / AutoGen | Agent & multi-agent orchestration |
| Claude Agent SDK / OpenAI Agents SDK | Vendor agent frameworks |
| Spring AI / Semantic Kernel / Vercel AI SDK | AI in Java / .NET / TypeScript apps |
| pgvector / Pinecone / Weaviate / Qdrant / Chroma | Vector databases for RAG |
| Unstructured / LlamaParse / Docling | Document parsing for RAG |
| Langfuse / LangSmith / Braintrust | Tracing & observability for LLM apps |
| Ragas / DeepEval / promptfoo | AI evaluation & testing |
| Guardrails AI / NeMo Guardrails / Llama Guard | Safety filters |
| n8n / Zapier / Make | AI workflow automation |
| Voiceflow / Dialogflow CX | Conversational AI design |

### AI Infrastructure & LLMOps (New)

| Technology | Used for |
|---|---|
| NVIDIA GPUs + CUDA | Hardware & platform for AI compute |
| vLLM / TGI / TensorRT-LLM | High-throughput LLM serving |
| Ollama / LM Studio / llama.cpp | Run models locally |
| Ray / Kubernetes + GPU operator | Distributed AI workloads |
| LiteLLM / Portkey | AI gateway & model routing |
| Hugging Face Hub | Model & dataset registry |
| Unsloth / PEFT / Axolotl | Fine-tuning (LoRA) |
| Weights & Biases / MLflow | Experiment tracking |
| Scale AI / Labelbox / Label Studio | Data labelling & RLHF |

### AI Coding & Developer Tools (New)

| Technology | Used for |
|---|---|
| Claude Code | Agentic coding in terminal & IDE |
| GitHub Copilot | AI pair programmer & coding agent |
| Cursor / Windsurf | AI-first code editors |
| OpenAI Codex / Gemini CLI | Coding agents |
| v0 / Lovable / Bolt | Generate full apps & UIs from prompts |
| CodeRabbit / Copilot review | AI code review |

### Collaboration & Productivity

| Technology | Used for |
|---|---|
| Jira / Azure Boards | Work tracking |
| Confluence / Notion | Documentation & wikis |
| Slack / Microsoft Teams | Team chat |
| Figma / Miro | Design / whiteboarding |
| ServiceNow | IT service management & tickets |

## Skills vs Salary — India (LPA)

> Rough estimates, not offers. Ranges are total CTC in LPA for Indian metros, built from published 2026 salary guides and surveys (checked 8 Nov 2026) plus general market knowledge — not live data. Company type and interview performance move your pay more than anything here. Check AmbitionBox, Levels.fyi, Glassdoor or Naukri before negotiating.

### Full Stack Developer

Stack: Java/Spring Boot or Node + Angular/React + SQL

| Experience (yrs) | Typical skills | Typical LPA | + Add these (skills / certs) | Potential LPA |
|---|---|---|---|---|
| 0–2 | HTML, CSS, JS/TS, one framework (Angular/React), Java or Node basics, SQL, Git | 3.5–7 LPA | Strong DSA, 2–3 deployed projects, Spring Boot REST APIs | 8–15 LPA |
| 2–4 | Angular/React + Spring Boot/Node REST APIs, JPA/ORM, SQL joins, unit tests, Agile | 6–12 LPA | Microservices, Docker, AWS Developer Associate, DSA (LeetCode medium), basic system design | 14–25 LPA |
| 4–6 | Owns features end-to-end, microservices, CI/CD, Docker, cloud basics, code reviews, performance fixes | 12–20 LPA | System design (HLD/LLD), Kubernetes, Kafka, Redis, AWS Solutions Architect Associate, GenAI integration (RAG, LLM APIs) | 22–40 LPA |
| 6–9 | Senior/Lead: designs modules, mentors, production ownership, security, DB tuning | 18–30 LPA | Distributed systems design, cloud architecture, AI agents/MCP in apps, leading a team, strong interview prep | 30–55 LPA |
| 9–12 | Tech Lead / Architect: cross-team design, NFRs, estimation, stakeholder communication | 28–45 LPA | AWS/Azure Solutions Architect Professional, AI solution architecture, Staff-level system design, measurable impact stories | 45–75 LPA |
| 12+ | Principal / Architect / Engineering Manager: org-level strategy, multiple teams | 40–70 LPA | Enterprise/AI architecture leadership, Big Tech or GCC leadership roles | 70 LPA – 1.2 Cr |

### Frontend Developer

Stack: Angular / React + TypeScript

| Experience (yrs) | Typical skills | Typical LPA | + Add these (skills / certs) | Potential LPA |
|---|---|---|---|---|
| 0–2 | HTML, CSS, JavaScript, one framework, responsive design, Git | 3–6 LPA | TypeScript, React/Next.js, portfolio projects, DSA basics | 7–12 LPA |
| 2–4 | Angular/React, TypeScript, state management, REST integration, unit tests | 6–11 LPA | Next.js/SSR, web performance, accessibility, testing (Playwright), design systems | 12–22 LPA |
| 4–7 | Owns UI architecture, performance, reusable component libraries, mentoring | 11–20 LPA | Frontend system design, micro-frontends, Node/BFF, AI-powered UI features | 22–40 LPA |
| 7+ | Lead / Frontend Architect: standards, tooling, cross-team UI platform | 20–35 LPA | Full-stack breadth or Staff-level frontend platform ownership | 35–65 LPA |

### Backend Developer (Java)

Stack: Java + Spring Boot + SQL + Microservices

| Experience (yrs) | Typical skills | Typical LPA | + Add these (skills / certs) | Potential LPA |
|---|---|---|---|---|
| 0–2 | Core Java, OOP, collections, SQL, Spring Boot basics, Git | 3.5–7 LPA | DSA, Spring Boot REST + JPA project, Java 17+ features | 8–15 LPA |
| 2–4 | Spring Boot, REST, JPA/Hibernate, SQL tuning, JUnit/Mockito, exceptions & logging | 6–13 LPA | Microservices, Kafka, Redis, Docker, AWS, concurrency, DSA | 15–26 LPA |
| 4–7 | Microservices, messaging, caching, CI/CD, cloud deploys, production debugging | 13–24 LPA | System design, Kubernetes, observability, distributed transactions, GenAI/Spring AI | 25–45 LPA |
| 7–10 | Senior/Lead: service ownership, design reviews, scalability, mentoring | 22–38 LPA | Staff-level design, cloud certification (Professional), leading migrations | 38–65 LPA |
| 10+ | Architect / Principal: platform architecture, standards | 35–60 LPA | Enterprise/AI architecture, Big Tech roles | 60 LPA – 1.1 Cr |

### Data Engineer

Stack: Python + SQL + Spark + Cloud data platforms

| Experience (yrs) | Typical skills | Typical LPA | + Add these (skills / certs) | Potential LPA |
|---|---|---|---|---|
| 0–2 | SQL, Python, basic ETL, Excel, one cloud basics | 4–8 LPA | PySpark, Airflow, a cloud data cert (Azure DP-203 successor / AWS Data Engineer) | 8–14 LPA |
| 2–4 | PySpark, Airflow, data modelling, warehouse (Snowflake/BigQuery/Redshift) | 8–15 LPA | Databricks/Snowflake certification, streaming (Kafka), dbt | 15–26 LPA |
| 4–7 | Designs pipelines, lakehouse, data quality, performance tuning | 15–28 LPA | Data architecture, real-time streaming, data for GenAI/RAG | 28–45 LPA |
| 7+ | Lead / Data Architect: platform design, governance | 25–45 LPA | Data platform leadership, AI data infrastructure | 45–80 LPA |

### Data Scientist / ML Engineer

Stack: Python + ML + Statistics

| Experience (yrs) | Typical skills | Typical LPA | + Add these (skills / certs) | Potential LPA |
|---|---|---|---|---|
| 0–2 | Python, pandas, statistics, scikit-learn, SQL | 5–10 LPA | End-to-end ML projects, deep learning basics, Kaggle-level work | 10–18 LPA |
| 2–4 | Model building & evaluation, feature engineering, A/B tests | 10–18 LPA | MLOps (MLflow, deployment), PyTorch, LLM fine-tuning & RAG | 18–32 LPA |
| 4–7 | Production models, MLOps, stakeholder impact | 18–32 LPA | LLM/GenAI specialisation, ML system design | 32–55 LPA |
| 7+ | Lead / Principal DS: strategy, team, research direction | 30–55 LPA | AI leadership, Big Tech / AI labs | 55 LPA – 1 Cr |

### AI / LLM Engineer (New)

Stack: Python/TS/Java + LLM APIs + RAG + Agents

| Experience (yrs) | Typical skills | Typical LPA | + Add these (skills / certs) | Potential LPA |
|---|---|---|---|---|
| 0–2 | Python, LLM APIs, prompt engineering, basic RAG with a vector DB | 6–14 LPA | Agents (LangGraph/SDKs), evals, deployed AI apps on GitHub | 12–22 LPA |
| 2–4 | RAG pipelines, tool calling, structured outputs, evaluation basics | 14–28 LPA | Multi-agent systems, MCP, guardrails, LLMOps, cost optimisation | 28–45 LPA |
| 4–7 | Production AI systems, agent orchestration, evals & monitoring (often ex-backend engineers) | 25–45 LPA | AI system architecture, fine-tuning, inference optimisation | 45–85 LPA |
| 7+ | AI Lead / AI Architect: enterprise AI strategy, platform | 40–70 LPA | Leading AI platforms at GCCs / AI-first product companies | 70 LPA – 1.5 Cr |

### Forward Deployed Engineer (FDE) (New)

Stack: Full stack + AI + customer-facing

| Experience (yrs) | Typical skills | Typical LPA | + Add these (skills / certs) | Potential LPA |
|---|---|---|---|---|
| 2–5 | Strong full-stack or data engineering, Python/TS, APIs, client communication | 18–35 LPA | LLM apps (RAG/agents), Palantir Foundry or AI platform experience, travel readiness | 35–55 LPA |
| 5+ | Leads customer deployments end-to-end, solution scoping, exec communication | 35–60 LPA | Deep AI deployment track record at AI-first companies | 60 LPA – 1 Cr |

### DevOps / Cloud / SRE

Stack: Linux + CI/CD + Docker/K8s + AWS/Azure + Terraform

| Experience (yrs) | Typical skills | Typical LPA | + Add these (skills / certs) | Potential LPA |
|---|---|---|---|---|
| 0–2 | Linux, shell scripting, Git, Jenkins basics, one cloud basics | 3.5–7 LPA | Docker, AWS/Azure Associate cert, Terraform | 7–12 LPA |
| 2–4 | CI/CD pipelines, Docker, Kubernetes basics, Terraform, monitoring | 7–14 LPA | CKA/CKAD, AWS DevOps Professional, GitOps (Argo CD) | 14–24 LPA |
| 4–7 | Owns platforms, K8s at scale, IaC modules, observability, incident response | 14–25 LPA | SRE practices (SLOs), platform engineering, DevSecOps, FinOps | 25–40 LPA |
| 7+ | Lead / Cloud Architect: multi-account, multi-region design | 25–42 LPA | Cloud Architect Professional, AI infrastructure (GPU, LLMOps) | 42–75 LPA |

### QA / Test Automation (SDET)

Stack: Manual → Selenium/Playwright + Java/Python + API testing

| Experience (yrs) | Typical skills | Typical LPA | + Add these (skills / certs) | Potential LPA |
|---|---|---|---|---|
| 0–2 | Manual testing, test cases, bug reporting, SQL basics | 2.5–5 LPA | Selenium/Playwright with Java or Python, API testing (Postman, REST Assured) | 5–9 LPA |
| 2–4 | Automation framework usage, API tests, CI integration | 5–10 LPA | Framework design, Playwright, performance testing, ISTQB | 10–18 LPA |
| 4–7 | Builds frameworks, test strategy, CI/CD quality gates | 10–18 LPA | SDET-level coding & DSA, testing AI features, contract testing | 18–32 LPA |
| 7+ | QA Lead / Test Architect / Quality Manager | 18–32 LPA | Quality engineering leadership, AI test automation | 32–50 LPA |

### Cybersecurity

Stack: Networking + Linux + Security tools

| Experience (yrs) | Typical skills | Typical LPA | + Add these (skills / certs) | Potential LPA |
|---|---|---|---|---|
| 0–2 | Networking, Linux, SOC tools basics, Security+ level knowledge | 3.5–7 LPA | CEH / CompTIA Security+, SIEM (Splunk/Sentinel), scripting | 7–12 LPA |
| 2–4 | SOC L2, incident response, vulnerability assessment, pentest basics | 7–14 LPA | OSCP, cloud security cert, AppSec/DevSecOps | 14–25 LPA |
| 4–7 | Pentesting / AppSec / cloud security ownership | 14–26 LPA | CISSP, cloud security architecture, AI red teaming | 26–45 LPA |
| 7+ | Security Architect / Lead / Manager | 26–45 LPA | CISSP + leadership, CISO track | 45–80 LPA |

### Mobile Developer

Stack: Kotlin/Swift or Flutter/React Native

| Experience (yrs) | Typical skills | Typical LPA | + Add these (skills / certs) | Potential LPA |
|---|---|---|---|---|
| 0–2 | One platform (Android/iOS) or Flutter, UI, API calls | 3.5–7 LPA | Published apps, Jetpack Compose/SwiftUI, DSA | 7–13 LPA |
| 2–5 | Architecture (MVVM), offline storage, performance, release process | 7–16 LPA | Cross-platform + native, mobile system design, on-device AI | 16–30 LPA |
| 5+ | Lead mobile engineer: architecture, CI/CD for mobile | 16–32 LPA | Mobile platform ownership at product companies | 32–55 LPA |

### SAP / Salesforce / ServiceNow

Stack: ERP / CRM platforms

| Experience (yrs) | Typical skills | Typical LPA | + Add these (skills / certs) | Potential LPA |
|---|---|---|---|---|
| 0–2 | Platform basics, configuration, one module | 4–7 LPA | Official certification (Salesforce Admin/PD1, SAP module, ServiceNow CSA) | 6–10 LPA |
| 2–5 | Customisation, integrations, multiple modules | 7–15 LPA | Advanced certs, S/4HANA migration, Agentforce / platform AI | 15–25 LPA |
| 5+ | Lead consultant / solution architect on the platform | 15–30 LPA | Platform architect certs, client-facing leadership | 30–50 LPA |

### Business Analyst

Stack: Requirements + SQL + Domain

| Experience (yrs) | Typical skills | Typical LPA | + Add these (skills / certs) | Potential LPA |
|---|---|---|---|---|
| 0–2 | Documentation, Excel, SQL basics, user stories | 4–7 LPA | SQL, Power BI, domain knowledge (BFSI, healthcare) | 7–11 LPA |
| 2–5 | Requirements, process mapping, UAT, stakeholder management | 7–14 LPA | CBAP/PMI-PBA, product thinking, data analysis | 14–22 LPA |
| 5+ | Lead BA / move to Product Owner or Product Manager | 14–26 LPA | Transition to Product Management | 26–45 LPA |

### Product Manager

Stack: Product sense + Data + Tech understanding

| Experience (yrs) | Typical skills | Typical LPA | + Add these (skills / certs) | Potential LPA |
|---|---|---|---|---|
| 0–2 | APM: user research, specs, analytics basics (often from top colleges/engineering) | 10–20 LPA | SQL, analytics tools, shipped feature ownership | 18–28 LPA |
| 2–5 | Owns a product area, roadmap, metrics, cross-team delivery | 18–35 LPA | AI product skills, growth/monetisation, strong case stories | 35–55 LPA |
| 5+ | Senior PM / Group PM / Director of Product | 35–70 LPA | Leadership of product lines, AI product strategy | 70 LPA – 1.3 Cr |

### Project / Delivery Manager

Stack: Delivery + Agile + Client management

| Experience (yrs) | Typical skills | Typical LPA | + Add these (skills / certs) | Potential LPA |
|---|---|---|---|---|
| 8–12 | Project Manager: planning, risk, client reporting, team of 8–20 | 18–30 LPA | PMP, SAFe, cloud/AI program delivery | 28–40 LPA |
| 12+ | Delivery / Program Manager: multiple projects, P&L, escalations | 28–50 LPA | Account leadership, GCC program leadership | 50–80 LPA |

### Company Type vs Pay

| Company type | Examples | Pay vs IT services |
|---|---|---|
| IT Services | TCS, Infosys, Wipro, HCL, Cognizant, Tech Mahindra, Accenture, Capgemini | Baseline (lower end) |
| GCC / MNC Captive | JPMorgan, Walmart Global Tech, Target, Lowe's, Goldman Sachs, Deloitte USI, Oracle | ~1.3–1.8× services |
| Indian Product & Funded Startups | Flipkart, Swiggy, Zomato, Razorpay, PhonePe, Freshworks, CRED, Meesho | ~1.5–2.5× services |
| Top Product / Big Tech / HFT | Google, Microsoft, Amazon, Atlassian, Uber, Salesforce, Adobe, trading firms | ~2–4× services (incl. stock) |

### Salary Adjustment Factors (multiplied on the experience band)

- **City:** Bengaluru ×1.1; Hyderabad ×1.05; Delhi NCR (Gurugram/Noida) ×1.05; Mumbai ×1.05; Pune ×1; Chennai ×0.97; Tier-2 (Kochi, Coimbatore, Jaipur, Ahmedabad, Kolkata, Indore…) ×0.8
- **Company type:** Not sure / Any ×1; IT Services ×0.8; GCC / MNC Captive ×1.15; Indian Product / Funded Startup ×1.35; Top Product / Big Tech ×1.9
- **Work mode:** Office / Hybrid ×1; Remote (Indian company) ×0.95; Remote (US/EU company, contract) ×1.6

### Expected Resume Skills by Role and Level

`A / B` = any one of them. Mid = 4+ yrs, Senior = 7+ yrs. Adding more than the listed limit of languages, frameworks or clouds signals breadth over depth.

#### Full Stack Developer

- **All levels:** HTML/CSS, JavaScript, TypeScript, Angular / React / Vue, Java / Node.js / Python / C# / .NET, Spring Boot / Express/NestJS / Django / FastAPI / ASP.NET Core, REST APIs, SQL, PostgreSQL / MySQL / Oracle / MongoDB, Git, Agile/Scrum
- **Mid (4+ yrs):** Microservices, Docker, AWS / Azure / GCP, CI/CD, JUnit/Mockito / Jest, DSA, Redis, Kafka / RabbitMQ
- **Senior (7+ yrs):** System Design, Kubernetes, Design Patterns, Mentoring, Technical Leadership, RAG / AI Agents (LangGraph) / LLM APIs
- **High-value add-ons:** Next.js, Web Performance, Micro-frontends, Spring Boot, Microservices, Kafka, Spring AI, DSA, System Design, DB Performance Tuning, AWS, Azure, GCP, Docker, Kubernetes, LLM APIs, RAG, Vector Databases, AI Agents (LangGraph), MCP, Playwright, Technical Leadership, AWS Solutions Architect Associate, AWS Solutions Architect Professional, Azure AZ-104 / AZ-305

#### Frontend Developer

- **All levels:** HTML/CSS, JavaScript, TypeScript, Angular / React / Vue, Responsive Design, REST APIs, Git
- **Mid (4+ yrs):** RxJS / NgRx/Redux, Jest / Playwright / Cypress, Web Performance, Accessibility (WCAG), Next.js, CI/CD
- **Senior (7+ yrs):** Micro-frontends, System Design, Design Patterns, Mentoring, Technical Leadership
- **High-value add-ons:** Next.js, Web Performance, Micro-frontends, DSA, System Design, Playwright, Technical Leadership

#### Backend Developer (Java)

- **All levels:** Java / Python / C# / .NET / Go / Node.js, Spring Boot / Django / FastAPI / ASP.NET Core / Express/NestJS, REST APIs, SQL, PostgreSQL / MySQL / Oracle / MongoDB, Git, JUnit/Mockito, DSA
- **Mid (4+ yrs):** Microservices, Docker, Kafka / RabbitMQ, Redis, AWS / Azure / GCP, CI/CD, Concurrency/Multithreading, Hibernate/JPA
- **Senior (7+ yrs):** System Design, Kubernetes, Design Patterns, DB Performance Tuning, Technical Leadership, Mentoring
- **High-value add-ons:** Go, Rust, Spring Boot, Microservices, Kafka, Concurrency/Multithreading, Spring AI, DSA, System Design, DB Performance Tuning, AWS, Azure, GCP, Docker, Kubernetes, LLM APIs, RAG, Vector Databases, AI Agents (LangGraph), MCP, Technical Leadership, AWS Solutions Architect Associate, AWS Solutions Architect Professional, Azure AZ-104 / AZ-305, CKA / CKAD

#### Data Engineer

- **All levels:** Python, SQL, PySpark/Spark, Airflow, Data Modelling, Git, AWS / Azure / GCP
- **Mid (4+ yrs):** Kafka, dbt, Snowflake / Databricks, Docker, CI/CD
- **Senior (7+ yrs):** System Design, Technical Leadership, Mentoring
- **High-value add-ons:** Kafka, DSA, System Design, DB Performance Tuning, AWS, Azure, GCP, Docker, PySpark/Spark, Snowflake, Databricks, Technical Leadership, AWS Solutions Architect Associate, Azure AZ-104 / AZ-305, Databricks / Snowflake Cert

#### Data Scientist / ML Engineer

- **All levels:** Python, SQL, pandas, Statistics, scikit-learn, Git
- **Mid (4+ yrs):** PyTorch / TensorFlow, MLflow, A/B Testing, Databricks, Docker
- **Senior (7+ yrs):** LLM APIs, Fine-tuning (LoRA), Technical Leadership, Mentoring
- **High-value add-ons:** DSA, PySpark/Spark, Snowflake, Databricks, PyTorch, LLM APIs, RAG, AI Evals, Fine-tuning (LoRA), Technical Leadership, Databricks / Snowflake Cert

#### AI / LLM Engineer

- **All levels:** Python, LLM APIs, Prompt Engineering, RAG, Vector Databases, REST APIs, SQL, Git
- **Mid (4+ yrs):** AI Agents (LangGraph), MCP, AI Evals, FastAPI, Docker, AWS / Azure / GCP
- **Senior (7+ yrs):** System Design, Fine-tuning (LoRA), Guardrails, Kubernetes, Technical Leadership
- **High-value add-ons:** Spring AI, DSA, System Design, AWS, Azure, GCP, Docker, Kubernetes, Databricks, PyTorch, LLM APIs, RAG, Vector Databases, AI Agents (LangGraph), MCP, AI Evals, Fine-tuning (LoRA), Technical Leadership, AWS Solutions Architect Associate, AWS Solutions Architect Professional

#### Forward Deployed Engineer (FDE)

- **All levels:** Python, TypeScript, SQL, REST APIs, LLM APIs, Stakeholder Management, Git
- **Mid (4+ yrs):** RAG, AI Agents (LangGraph), React, FastAPI, Docker, AWS / Azure / GCP
- **Senior (7+ yrs):** System Design, MCP, Technical Leadership
- **High-value add-ons:** Next.js, Spring Boot, DSA, System Design, AWS, Azure, GCP, Docker, LLM APIs, RAG, Vector Databases, AI Agents (LangGraph), MCP, AI Evals, Technical Leadership, AWS Solutions Architect Associate

#### DevOps / Cloud / SRE

- **All levels:** Linux, Bash/Shell, Git, Docker, CI/CD, AWS / Azure / GCP
- **Mid (4+ yrs):** Kubernetes, Terraform, Prometheus/Grafana, Helm, Python, Ansible
- **Senior (7+ yrs):** Argo CD/GitOps, System Design, Network Security, Technical Leadership, Mentoring
- **High-value add-ons:** Go, Microservices, System Design, AWS, Azure, GCP, Docker, Kubernetes, Terraform, Argo CD/GitOps, Technical Leadership, AWS Solutions Architect Associate, AWS Solutions Architect Professional, Azure AZ-104 / AZ-305, CKA / CKAD

#### QA / Test Automation (SDET)

- **All levels:** Manual Testing, SQL, Postman, Jira, Agile/Scrum
- **Mid (4+ yrs):** Selenium / Playwright / Cypress, Java / Python / JavaScript, REST Assured, TestNG / Cucumber (BDD), CI/CD, JMeter/k6
- **Senior (7+ yrs):** Test Framework Design, Appium, Technical Leadership, Mentoring
- **High-value add-ons:** DSA, AI Evals, Playwright, Test Framework Design, Technical Leadership

#### Cybersecurity

- **All levels:** Linux, Network Security, OWASP Top 10, SIEM (Splunk/Sentinel), Python / Bash/Shell
- **Mid (4+ yrs):** Penetration Testing, Burp Suite, IAM / OAuth2, Threat Modelling, AWS / Azure / GCP
- **Senior (7+ yrs):** CISSP / OSCP, Technical Leadership, Mentoring
- **High-value add-ons:** AWS, Azure, GCP, Penetration Testing, Threat Modelling, Technical Leadership, OSCP, CISSP

#### Mobile Developer

- **All levels:** Android (Kotlin) / iOS (Swift) / Flutter / React Native, REST APIs, Git, Firebase
- **Mid (4+ yrs):** Jetpack Compose / SwiftUI, DSA, Design Patterns, CI/CD
- **Senior (7+ yrs):** System Design, Technical Leadership, Mentoring
- **High-value add-ons:** DSA, System Design, Technical Leadership

#### SAP / Salesforce / ServiceNow

- **All levels:** Salesforce / SAP S/4HANA / ServiceNow, SQL, Agile/Scrum
- **Mid (4+ yrs):** Apex / ABAP, REST APIs, Requirements (BRD/FRD), Salesforce PD1 / SAP Cert
- **Senior (7+ yrs):** Stakeholder Management, Technical Leadership
- **High-value add-ons:** Technical Leadership, Salesforce PD1 / SAP Cert

#### Business Analyst

- **All levels:** Requirements (BRD/FRD), User Stories, SQL, Excel, Jira, Agile/Scrum
- **Mid (4+ yrs):** BPMN/Process Mapping, Power BI / Tableau, Stakeholder Management, Postman
- **Senior (7+ yrs):** CBAP, Product Analytics, Mentoring
- **High-value add-ons:** Product Analytics, CBAP

#### Product Manager

- **All levels:** User Stories, Roadmapping, Product Analytics, SQL, Agile/Scrum, Stakeholder Management
- **Mid (4+ yrs):** A/B Testing, Jira, Prompt Engineering, Power BI / Tableau
- **Senior (7+ yrs):** Budgeting / P&L, Mentoring
- **High-value add-ons:** LLM APIs, Product Analytics, Budgeting / P&L, PMP

#### Project / Delivery Manager

- **All levels:** Agile/Scrum, Jira, Risk Management, Stakeholder Management, Excel
- **Mid (4+ yrs):** PMP / SAFe, CSM / PSM, Budgeting / P&L
- **Senior (7+ yrs):** Mentoring, Technical Leadership
- **High-value add-ons:** Budgeting / P&L, CISSP, PMP

Focus limits (under 8 yrs / 8+ yrs): Backend Language 2/3; Frontend Framework 2/2; Backend Framework 2/3; Cloud 2/2; Mobile Platform 2/2; ERP/CRM Platform 1/2.

### Biggest Salary Boosters

- **Switching companies:** Typically 30–60% hike vs ~6–7% appraisal at IT services (Aon: 6.6% in 2026 and 2027) — the single biggest lever.
- **DSA + System Design:** Unlocks product / Big Tech interviews — often 1.5–2.5× pay.
- **GenAI / Agents / RAG / MCP skills:** Strongest premium in 2026: ~25–40% above peers at the same level.
- **Cloud certification (AWS/Azure/GCP):** Associate helps shortlisting; Professional + real experience helps pay.
- **Kubernetes (CKA/CKAD):** High demand for DevOps / platform roles.
- **Databricks / Snowflake certs:** Strong signal for data engineering roles.
- **OSCP / CISSP:** Top-valued security certifications.
- **PMP / SAFe / CSM:** Useful for manager and delivery roles; less impact for engineers.
- **Domain expertise (BFSI, healthcare, payments):** GCCs pay more for domain + tech combination.
- **Public proof of work:** GitHub projects, blogs, talks — help get interviews at better-paying companies.

### Market Reality (Nov 2026)

- Company type beats years. Same experience, product/Big Tech pays 3–5× IT services. ([source](https://resources.instahyre.com/blog/software-engineer-salary-in-india/))
- Aon (Oct 2026): India-wide raises averaged 9% in 2026 and are projected at 9.1% for 2027. IT services/consulting is lowest at 6.6% (both years); tech product companies 9.5%. Attrition is back up to ~18%. ([source](https://www.aon.com/apac/in-the-press/asia-newsroom/2026/aon-study-finds-salaries-in-india-projected-to-fise-9-1-in-2027-employers-balance-growth-and-cost-pressures))
- Naukri JobSpeak (Oct 2026): white-collar hiring up 14% year on year (helped by a low Diwali-hit base), AI/ML roles up 32%, IT services up only 5%. ([source](https://www.naukri.com/blog/naukri-jobspeak-october-2026-white-collar-hiring-ai-ml-growth/))
- Standard services fresher pay is still ~₹3.4–9 LPA (most land at 4–6). Specialist AI/cloud/data fresher roles go up to ~₹21 LPA. ([source](https://www.bwpeople.in/article/infosys-to-offer-freshers-salaries-up-to-rs-21-lakh-585056))
- GenAI/LLM engineers earn ~25–40% more than generalist ML engineers at the same level. ([source](https://resources.instahyre.com/blog/ai-engineer-salary-in-india/))

## Working Abroad from India (checked 8 Nov 2026)

> Visa rules and news below were checked on 8 Nov 2026 and change often. The official link on each country is the source of truth. Pay ranges are typical market estimates. Not legal advice.

Ordered from most realistic to hardest for Indian IT professionals.

| Country | Odds from India | Typical pay | Visa route | Usual minimum experience |
|---|---|---|---|---|
| Germany | Realistic | €60k–85k | EU Blue Card · Opportunity Card | 3+ yrs |
| UAE (Dubai/Abu Dhabi) | Realistic | AED 25k–45k/month, tax-free | Employer work visa · Golden Visa | 2+ yrs |
| Netherlands | Moderate | €55k–85k | Highly Skilled Migrant | 3+ yrs |
| Ireland | Moderate | €60k–95k | Critical Skills Employment Permit | 3+ yrs |
| Remote for global companies | Moderate | 1.5–3× Indian market (USD contracts) | No visa — stay in India | 4+ yrs |
| Japan | Moderate | ¥5M–9M/yr | Engineer/Specialist · Highly Skilled Professional | 2+ yrs |
| Australia | Hard | AUD 110k–170k | Skills in Demand (482) · 189/190 PR | 3+ yrs |
| United Kingdom | Hard | £55k–80k (London mid–senior) | Skilled Worker · Global Talent | 5+ yrs |
| Singapore | Hard | S$84k–150k | Employment Pass | 5+ yrs |
| Canada | Hard | CAD 90k–140k | Express Entry (PR) · PNP | 3+ yrs |
| United States | Very hard | $120k–200k+ (senior SWE) | H-1B · L-1 · O-1 | 5+ yrs |

### Germany — Realistic

**Latest (8 Nov 2026):** 2026 Blue Card floors: €50,700 standard, €45,934.20 for IT and shortage jobs — including IT specialists without a degree who have 3+ yrs relevant experience. No sponsor licence needed: any German employer can hire you.

**Blunt take:** The best odds in the West for Indian engineers. English-only jobs exist, but German B1+ roughly triples your options.

- **Visa rule:** Blue Card 2026: €50,700/yr, or €45,934.20 for IT/shortage jobs. Opportunity Card (Chancenkarte) gives a job-search stay.
- **High demand roles:** Backend Developer (Java), Full Stack Developer, DevOps / Cloud / SRE, SAP / Salesforce / ServiceNow, Data Engineer, AI / LLM Engineer, Cybersecurity
- **Some demand:** QA / Test Automation (SDET), Frontend Developer, Mobile Developer, Data Scientist / ML Engineer, Forward Deployed Engineer (FDE), Business Analyst, Product Manager, Project / Delivery Manager
- **Official source:** https://www.make-it-in-germany.com/en/visa-residence/types/eu-blue-card

**How to get in (best route first):**

1. Apply directly to German companies — no sponsor licence is needed, so most can hire you
2. Filter job boards for 'English' + 'visa sponsorship' (see live feed below)
3. Get your degree checked on anabin, or rely on the 3-yrs-experience IT route
4. Start German now — B1 opens mid-size companies, not just startups
5. Opportunity Card only if you have savings: job-search on the ground

### UAE (Dubai/Abu Dhabi) — Realistic

**Latest (8 Nov 2026):** 2026: a 3-year AI Specialist visa (announced Mar 2026; reported AED 30,000/month basic salary + STEM degree) can fast-track to the 10-year Golden Visa. Strong demand in AI and cloud.

**Blunt take:** The easiest move for Indians. Good tax-free pay, but no citizenship path, and packages vary wildly.

- **Visa rule:** No lottery: the employer sponsors your visa. Golden Visa (10-yr) for Level 1–2 tech roles with basic salary AED 30,000+/month.
- **High demand roles:** AI / LLM Engineer, Full Stack Developer, Backend Developer (Java), DevOps / Cloud / SRE, Cybersecurity, SAP / Salesforce / ServiceNow, Project / Delivery Manager, Forward Deployed Engineer (FDE)
- **Some demand:** Data Engineer, Data Scientist / ML Engineer, Mobile Developer, Frontend Developer, Business Analyst, Product Manager, QA / Test Automation (SDET)
- **Official source:** https://u.ae/en/information-and-services/visa-and-emirates-id/residence-visas/golden-visa

**How to get in (best route first):**

1. Ask your Indian employer about Gulf client projects — the fastest, zero-risk route
2. Apply on LinkedIn and Bayt to product firms and banks, not just staffing agencies
3. Many people interview in person on a visit visa — budget 4–6 weeks if you try it
4. Negotiate basic salary high: it decides Golden Visa eligibility and end-of-service pay

### Netherlands — Moderate

**Latest (8 Nov 2026):** 2026: salary floors up ~4.5% (€5,688 → €5,942 for 30+). The IND applies the threshold in force on the day the application is filed, and only fixed, guaranteed pay counts.

**Blunt take:** A fast visa once you have an offer, and English works at work. Housing is the real pain.

- **Visa rule:** €5,942/month (30+), €4,357/month (under 30), excluding holiday pay. Only IND-recognised sponsors can hire you.
- **High demand roles:** Backend Developer (Java), Data Engineer, DevOps / Cloud / SRE, AI / LLM Engineer, Full Stack Developer
- **Some demand:** Frontend Developer, Data Scientist / ML Engineer, Cybersecurity, Product Manager, Mobile Developer, QA / Test Automation (SDET)
- **Official source:** https://ind.nl/en/residence-permits/work/highly-skilled-migrant

**How to get in (best route first):**

1. Only apply to companies on the IND public register of recognised sponsors
2. Target Amsterdam scale-ups and fintech (Adyen, Booking, ING tech)
3. Internal transfer from an MNC office in India
4. Budget for housing before accepting — it eats offers

### Ireland — Moderate

**Latest (8 Nov 2026):** 1 Mar 2026: permit salary floors raised (€40,904 for listed ICT roles, from €38,000); the government roadmap plans further rises up to 2030.

**Blunt take:** EU HQs of big tech, all in English. Fewer openings than Germany, and Dublin rents are brutal.

- **Visa rule:** €40,904/yr for listed ICT roles (software, security, data), or €68,911 for others. Residency (Stamp 4) after 2 years.
- **High demand roles:** Cybersecurity, DevOps / Cloud / SRE, Data Engineer, Backend Developer (Java), AI / LLM Engineer, Full Stack Developer
- **Some demand:** Product Manager, Frontend Developer, Data Scientist / ML Engineer, Business Analyst, Forward Deployed Engineer (FDE)
- **Official source:** https://enterprise.gov.ie/en/what-we-do/workplace-and-skills/employment-permits/permit-types/critical-skills-employment-permit/

**How to get in (best route first):**

1. Internal transfer from Google/Microsoft/Salesforce/Stripe India to their Dublin HQs
2. Apply directly to Dublin HQ roles — your software/security/data role is on the critical-skills list
3. Referrals from Indian engineers already in Dublin

### Remote for global companies — Moderate

**Latest (8 Nov 2026):** 2026: fewer 'worldwide' roles than in 2021–22; most now require US/EU time-zone overlap.

**Blunt take:** No visa risk, but you compete with the whole world. Public proof of work matters more than your CV.

- **Visa rule:** Paid as a contractor or through an Employer of Record (Deel, Remote.com). Tax is paid in India.
- **High demand roles:** Full Stack Developer, AI / LLM Engineer, DevOps / Cloud / SRE, Frontend Developer, Mobile Developer
- **Some demand:** Backend Developer (Java), Data Engineer, QA / Test Automation (SDET), Forward Deployed Engineer (FDE), Data Scientist / ML Engineer
- **Official source:** https://remotive.com/remote-jobs/software-dev

**How to get in (best route first):**

1. Build public proof: GitHub, a shipped product, technical writing
2. Apply only to roles open to India/APAC (live feed below)
3. Offer US/EU time-zone overlap — it removes the #1 objection
4. Start as a contractor; convert to full-time later

### Japan — Moderate

**Latest (8 Nov 2026):** India–Japan action plan (Aug 2025): an aspirational target of 50,000 skilled Indians moving to Japan over 5 years, mainly IT. Large IT shortage persists.

**Blunt take:** Big demand, lower pay than the West. Most jobs expect Japanese (JLPT N2).

- **Visa rule:** Engineer visa needs a degree or 10 yrs experience. HSP points can lead to PR in 1–3 years.
- **High demand roles:** Backend Developer (Java), Mobile Developer, QA / Test Automation (SDET), Full Stack Developer, DevOps / Cloud / SRE
- **Some demand:** Frontend Developer, AI / LLM Engineer, Data Engineer, SAP / Salesforce / ServiceNow
- **Official source:** https://www.isa.go.jp/en/applications/procedures/16-3.html

**How to get in (best route first):**

1. Learn Japanese to N3 → N2 — this is the real gate
2. Use Japan-focused placement programmes in India that hire directly
3. English-only roles: Rakuten, Mercari, PayPay, global firms in Tokyo

### Australia — Hard

**Latest (8 Nov 2026):** 15 Oct 2026 round: about 20,000 subclass 189 invitations, with ICT cut-offs up to 100 points (ICT Security Specialist). No date announced for the next round. Sponsor threshold (CSIT) AUD 79,423 from 1 Jul 2026.

**Blunt take:** PR without a job is possible from India, but only with high points (age, PTE 79+, experience).

- **Visa rule:** Points-based PR (189/190) needs an ACS skills assessment and a high score. Employer sponsorship usually needs local presence.
- **High demand roles:** Backend Developer (Java), Full Stack Developer, Cybersecurity, Business Analyst, Project / Delivery Manager, Data Engineer, DevOps / Cloud / SRE
- **Some demand:** QA / Test Automation (SDET), Data Scientist / ML Engineer, AI / LLM Engineer, Frontend Developer, Product Manager
- **Official source:** https://immi.homeaffairs.gov.au/visas/working-in-australia/skillselect

**How to get in (best route first):**

1. Get an ACS skills assessment
2. Max out English: PTE 79+ gives the biggest single points jump
3. Apply for state nomination (190) where ICT is listed
4. Employer sponsorship mostly after you're in the country

### United Kingdom — Hard

**Latest (8 Nov 2026):** Oct 2026 rule changes (HC 584) left salary thresholds unchanged. Since Jan 2026 most new Skilled Worker applicants need B2 English. Market remains tight for mid-level.

**Blunt take:** Sponsors exist, but mid-level is crowded. Senior and niche skills get callbacks.

- **Visa rule:** £41,700/yr or the role's going rate, whichever is higher. The employer must hold a sponsor licence.
- **High demand roles:** AI / LLM Engineer, Cybersecurity, Data Engineer, DevOps / Cloud / SRE
- **Some demand:** Backend Developer (Java), Full Stack Developer, Data Scientist / ML Engineer, Product Manager, Forward Deployed Engineer (FDE)
- **Official source:** https://www.gov.uk/skilled-worker-visa

**How to get in (best route first):**

1. Internal transfer from a bank/consultancy GCC in India (Barclays, HSBC, LSEG, Accenture)
2. Apply only to firms on the official Register of Licensed Sponsors
3. Senior/specialist roles only — the salary floor rules out most junior offers
4. Global Talent visa if you have a strong public track record

### Singapore — Hard

**Latest (8 Nov 2026):** EP minimum S$5,600/month in 2026, rising to S$6,000 from 1 Jan 2027 (S$6,600 in financial services). Shortage roles (AI, cloud, security, data) earn bonus COMPASS points.

**Blunt take:** Getting harder. COMPASS gives fewer points when a firm already has many staff of your nationality.

- **Visa rule:** EP minimum salary (higher with age) plus 40 points on COMPASS.
- **High demand roles:** AI / LLM Engineer, Cybersecurity, Data Engineer, DevOps / Cloud / SRE
- **Some demand:** Backend Developer (Java), Full Stack Developer, Data Scientist / ML Engineer, Product Manager
- **Official source:** https://www.mom.gov.sg/passes-and-permits/employment-pass

**How to get in (best route first):**

1. Target shortage-list roles (AI, cloud, security, data) — they get bonus points
2. Choose firms with diverse teams; avoid Indian-heavy employers
3. Internal transfer to a regional HQ

### Canada — Hard

**Latest (8 Nov 2026):** 5 Nov 2026 levels plan (2027–29): 380,000 PR a year, temporary workers capped at 220,000 a year, Express Entry cut to 100,000. Since the Feb 2026 overhaul, software developers and data scientists are not on the Express Entry STEM list.

**Blunt take:** Much harder than in 2019–22. PR without a job needs a very high CRS, and the tech job market there is tight for newcomers.

- **Visa rule:** General Express Entry draws often need CRS 500+. Cybersecurity is still on the STEM list.
- **High demand roles:** Cybersecurity
- **Some demand:** Data Engineer, DevOps / Cloud / SRE, AI / LLM Engineer, Data Scientist / ML Engineer, Backend Developer (Java), Full Stack Developer
- **Official source:** https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry.html

**How to get in (best route first):**

1. Check your CRS on the official calculator first — below ~480, don't spend money
2. IELTS CLB 9+ is the cheapest big points boost
3. Watch provincial (PNP) tech streams
4. Intra-company transfer if your employer has a Canada office

### United States — Very hard

**Latest (8 Nov 2026):** H-1B is NOT stopped (no blanket suspension as of 8 Nov 2026). But: a Sept 18 executive order makes an employer's layoffs count against its H-1B petitions. On Oct 8, Microsoft, Adobe, TCS, Infosys, Wipro, HCL, Cognizant and Capgemini were suspended from green card sponsorship (PERM). The $100k H-1B fee was extended on paper to Sept 2027 but remains blocked in court. The lottery is now wage-weighted.

**Blunt take:** The hardest route right now. The classic Indian IT services path (TCS/Infosys/Wipro → H-1B → green card) just got much worse.

- **Visa rule:** Wage-weighted H-1B lottery since Feb 2026: higher offered wage = better odds.
- **High demand roles:** AI / LLM Engineer, Data Scientist / ML Engineer
- **Some demand:** Backend Developer (Java), Cybersecurity, Data Engineer, DevOps / Cloud / SRE, Full Stack Developer, Forward Deployed Engineer (FDE)
- **Official source:** https://www.uscis.gov/working-in-the-united-states/h-1b-specialty-occupations

**How to get in (best route first):**

1. L-1 transfer from a US product company's India office (not IT services) after 12+ months
2. A high-wage offer for a senior/AI role improves lottery odds under the new rules
3. O-1 if you have a strong public record (patents, talks, major open source)
4. US master's → OPT → H-1B: costly and slow, but still the most common path

### How to Actually Get an Interview

1. Internal transfer beats everything. Join an MNC/GCC in India with offices abroad, perform, and ask after 12–18 months.
2. Get a referral. Cold applications from India mostly go unread; message engineers at target companies with a short, specific ask.
3. Apply only where you can legally be hired. Check sponsor registers (UK, Netherlands) or pick countries with no licence rule (Germany).
4. Prepare like it's a product company: DSA, system design, behavioural rounds.
5. Learn the language where it's the gate: German B1+ or Japanese N2.
6. Use the local CV format: 1–2 pages, no photo or date of birth (UK/US/IE), numbers in every bullet.
7. A master's abroad works, but it's the most expensive route. Only do it with a clear job plan.
8. Never pay an agent for a job offer. That's a scam, every time.

> Live job and news feeds are only available in the interactive page (Arbeitnow, Remotive, Jobicy, Hacker News search).

## Income Tax by Country

> Checked November 2026. Rules for a single employee who is tax resident there, with salary as the only income. Local taxes, family allowances and many credits are left out, so treat estimates as a guide and use the official calculator linked on each card for exact numbers.

The Atlas's **Pay & Tax** tab turns these tax rules into a take-home calculator, an offer comparison and rough estimates.

### Income tax in United States

**Tax year:** Tax year 2026 (calendar year)

Federal income tax plus Social Security and Medicare (FICA). Most states add their own income tax (none in Texas, Washington or Florida; up to about 13% in California).

**Federal, single filer**

| Taxable income | Rate |
|---|---|
| Up to $12,400 | 10% |
| $12,400 – $50,400 | 12% |
| $50,400 – $105,700 | 22% |
| $105,700 – $201,775 | 24% |
| $201,775 – $256,225 | 32% |
| $256,225 – $640,600 | 35% |
| Above $640,600 | 37% |

Standard deduction $16,100 (2026, after the One Big Beautiful Bill Act).

**Employee contributions:**

- Social Security 6.2% up to $184,500 of wages
- Medicare 1.45% on all wages, plus 0.9% above $200,000

**Good to know:**

- H-1B holders are taxed like residents once they pass the substantial-presence test.
- 401(k) contributions (up to the yearly limit) reduce taxable income — not included here.
- Not in the Atlas estimate: State and city income tax.

**Official sources:**

- [IRS: federal income tax rates and brackets](https://www.irs.gov/filing/federal-income-tax-rates-and-brackets)
- [SSA: contribution and benefit base](https://www.ssa.gov/oact/cola/cbb.html)

### Income tax in United Kingdom

**Tax year:** Tax year 2026/27 (6 Apr 2026 – 5 Apr 2027)

Income tax above a £12,570 personal allowance, plus National Insurance. Rates shown are for England, Wales and Northern Ireland; Scotland has its own bands.

**England, Wales & NI**

| Taxable income | Rate |
|---|---|
| Up to £37,700 | 20% |
| £37,700 – £125,140 | 40% |
| Above £125,140 | 45% |

Bands apply to income above the personal allowance. The allowance shrinks by £1 for every £2 earned above £100,000, and is zero from £125,140.

**Employee contributions:**

- National Insurance (Class 1): 8% on £12,570–£50,270, 2% above

**Good to know:**

- Thresholds are frozen until April 2031.
- Skilled Worker visa holders pay the same tax as residents.
- Not in the Atlas estimate: Student loan repayments and pension contributions.

**Official sources:**

- [GOV.UK: Income Tax rates](https://www.gov.uk/income-tax-rates)
- [GOV.UK: rates and thresholds 2026 to 2027](https://www.gov.uk/guidance/rates-and-thresholds-for-employers-2026-to-2027)

### Income tax in Canada

**Tax year:** Tax year 2026 (calendar year)

Federal income tax plus provincial income tax (each province has its own brackets, roughly 5–21%), CPP pension and EI insurance.

**Federal**

| Taxable income | Rate |
|---|---|
| Up to C$58,523 | 14% |
| C$58,523 – C$117,045 | 20.5% |
| C$117,045 – C$181,440 | 26% |
| C$181,440 – C$258,482 | 29% |
| Above C$258,482 | 33% |

Basic personal amount $16,452 (a 14% credit, about $2,303). The lowest rate was cut from 15% to 14% from July 2025.

**Employee contributions:**

- CPP 5.95% on earnings from $3,500 to $74,600 (max $4,230.45), plus CPP2 4% up to about $85,000
- EI 1.63% up to $68,900 (max $1,123.07)

**Good to know:**

- Quebec has its own pension plan and EI rate.
- RRSP contributions reduce taxable income — not included here.
- Not in the Atlas estimate: Provincial income tax (e.g. Ontario adds about 5–13%).

**Official sources:**

- [CRA: income tax rates](https://www.canada.ca/en/revenue-agency/services/tax/individuals/frequently-asked-questions-individuals/canadian-income-tax-rates-individuals-current-previous-years.html)
- [CRA: payroll deductions 2026 (T4032)](https://www.canada.ca/en/revenue-agency/services/forms-publications/payroll/t4032-payroll-deductions-tables/t4032oc-jan/t4032oc-january-general-information.html)

### Income tax in Germany

**Tax year:** Tax year 2026 (calendar year)

Income tax rises smoothly from 14% to 42% (45% for very high incomes), plus social insurance of about 21% of pay up to the ceilings. Tax class I (single) shown.

**Income tax (§32a EStG)**

| Taxable income | Rate |
|---|---|
| Up to €12,348 | 0% |
| €12,348 – €69,879 | 14% rising to 42% |
| €69,879 – €277,826 | 42% |
| Above €277,826 | 45% |

Tax-free allowance €12,348. Between €12,348 and €69,878 the rate climbs gradually from 14% to 42% (a formula, not fixed steps).

**Employee contributions:**

- Pension 9.3% and unemployment 1.3% up to €101,400 a year
- Health 7.3% + half the fund's extra rate (average 2.9% → about 8.75%) and long-term care 1.8% (2.4% if childless, 23+) up to €69,750 a year

**Good to know:**

- Solidarity surcharge (5.5%) now applies only to high incomes.
- EU Blue Card holders are taxed like residents.
- Not in the Atlas estimate: Church tax (8–9% of income tax, if a member).

**Official sources:**

- [BMF official tax calculator](https://www.bmf-steuerrechner.de/)
- [Social insurance rates 2026 (TK)](https://www.tk.de/firmenkunden/versicherung/beitraege-faq/beitragssaetze/aktuelle-beitragssaetze-in-der-sozialversicherung-2031554)

### Income tax in Netherlands

**Tax year:** Tax year 2026

Box 1 tax on wages already includes national insurance in the first bracket. Two tax credits — the general credit and the labour credit — lower the bill a lot at middle incomes; the estimate includes both.

**Box 1, below state-pension age**

| Taxable income | Rate |
|---|---|
| Up to €38,883 | 35.75% |
| €38,883 – €78,426 | 37.56% |
| Above €78,426 | 49.5% |

General tax credit: €3,115, reduced by 6.398% of income above €29,736 (zero from €78,426). Labour credit: up to €5,685, reduced by 6.51% of income above €45,592 (zero from €132,921). Credits can't make tax negative.

**Employee contributions:**

- National insurance is inside the first-bracket rate
- Health insurance is bought privately (about €150/month)

**Good to know:**

- 30% ruling for skilled migrants: up to 30% of salary tax-free in 2026, falling to 27% from 2027 (minimum salary rules apply). Tick it in the estimator to see the effect.
- Not in the Atlas estimate: Private health insurance (about €1,800 a year) and employee pension contributions.

**Official sources:**

- [Belastingdienst (official)](https://www.belastingdienst.nl/wps/wcm/connect/en/individuals/individuals)
- [Belastingdienst: labour credit table 2026](https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/inkomstenbelasting/heffingskortingen_boxen_tarieven/heffingskortingen/arbeidskorting/tabel-arbeidskorting-2026)
- [Dutch tax system for expats (IamExpat)](https://www.iamexpat.nl/expat-info/taxation/dutch-tax-system)

### Income tax in Ireland

**Tax year:** Tax year 2026 (calendar year)

Income tax at 20% and 40%, reduced by tax credits, plus USC and PRSI on gross pay.

**Single person**

| Taxable income | Rate |
|---|---|
| Up to €44,000 | 20% |
| Above €44,000 | 40% |

Personal credit €2,000 + employee (PAYE) credit €2,000 are subtracted from the tax.

**Employee contributions:**

- USC: 0.5% to €12,012, 2% to €28,700, 3% to €70,044, 8% above (none if income is €13,000 or less)
- PRSI: 4.2% Jan–Sep 2026, 4.35% from 1 Oct 2026

**Good to know:**

- Critical Skills Employment Permit holders are taxed like residents.

**Official sources:**

- [Revenue: tax rates, bands and reliefs](https://www.revenue.ie/en/personal-tax-credits-reliefs-and-exemptions/tax-relief-charts/index.aspx)
- [gov.ie: PRSI Class A rates](https://www.gov.ie/en/publication/ffa563-prsi-class-a-rates)
- [Budget 2026 income tax measures (Chartered Accountants Ireland)](https://www.charteredaccountants.ie/News/income-tax-measures-budget-2026)

### Income tax in Singapore

**Tax year:** Year of Assessment 2026 (income earned in 2025)

Low progressive tax from 0% to 24% for residents. Foreigners on an Employment Pass don't pay CPF.

**Tax resident**

| Taxable income | Rate |
|---|---|
| Up to S$20,000 | 0% |
| S$20,000 – S$30,000 | 2% |
| S$30,000 – S$40,000 | 3.5% |
| S$40,000 – S$80,000 | 7% |
| S$80,000 – S$120,000 | 11.5% |
| S$120,000 – S$160,000 | 15% |
| S$160,000 – S$200,000 | 18% |
| S$200,000 – S$240,000 | 19% |
| S$240,000 – S$280,000 | 19.5% |
| S$280,000 – S$320,000 | 20% |
| S$320,000 – S$500,000 | 22% |
| S$500,000 – S$1,000,000 | 23% |
| Above S$1,000,000 | 24% |

Earned income relief $1,000 applied. Resident = in Singapore 183+ days in the year.

**Employee contributions:**

- CPF (about 20% employee) applies only to citizens and permanent residents

**Good to know:**

- Non-residents pay 15% flat or resident rates, whichever is higher.

**Official sources:**

- [IRAS: individual income tax rates](https://www.iras.gov.sg/taxes/individual-income-tax/basics-of-individual-income-tax/tax-residency-and-tax-rates/individual-income-tax-rates)

### Income tax in Japan

**Tax year:** Tax year 2026 (calendar year)

National income tax 5–45% plus 2.1% reconstruction surtax, a flat 10% resident tax (charged from the second year), and social insurance of about 15%.

**National income tax**

| Taxable income | Rate |
|---|---|
| Up to ¥1,950,000 | 5% |
| ¥1,950,000 – ¥3,300,000 | 10% |
| ¥3,300,000 – ¥6,950,000 | 20% |
| ¥6,950,000 – ¥9,000,000 | 23% |
| ¥9,000,000 – ¥18,000,000 | 33% |
| ¥18,000,000 – ¥40,000,000 | 40% |
| Above ¥40,000,000 | 45% |

Applied after deductions. 2026 reform (applied from the December 2026 year-end adjustment): employment income deduction at least ¥740,000 (¥690,000 + ¥50,000 temporary); basic deduction ¥1,040,000 when income after that deduction is up to ¥4.89 million, ¥670,000 up to ¥6.55 million, ¥620,000 up to ¥23.5 million — so no income tax on salaries up to about ¥1.78 million.

**Employee contributions:**

- Health ~5% (varies by insurer and prefecture), pension 9.15% (capped at ¥650,000 monthly pay), employment insurance ~0.5% — about 15% in total
- Resident tax ~10% of last year's income, charged from your second year

**Good to know:**

- Reconstruction surtax (2.1% of national tax) runs until 2037.
- The 2026 deduction changes apply to income tax from 2026 and to resident tax from 2027.
- Not in the Atlas estimate: Nursing-care insurance (age 40+), bonus-specific caps, and spouse or dependant deductions.

**Official sources:**

- [National Tax Agency: income tax rates](https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/2260.htm)
- [NTA English site](https://www.nta.go.jp/english/)
- [NTA: 2026 basic deduction changes (Japanese)](https://www.nta.go.jp/users/gensen/2026kiso/index.htm)
- [2026 Japan tax reform outline (EY)](https://www.ey.com/en_jp/technical/ey-japan-tax-library/tax-alerts/2025/tax-alerts-12-24)

### Income tax in Australia

**Tax year:** Financial year 2026-27 (1 Jul 2026 – 30 Jun 2027)

Progressive tax with a $18,200 tax-free threshold, plus a 2% Medicare levy. Employers pay 12% superannuation on top of salary.

**Resident**

| Taxable income | Rate |
|---|---|
| Up to A$18,200 | 0% |
| A$18,200 – A$45,000 | 15% |
| A$45,000 – A$135,000 | 30% |
| A$135,000 – A$190,000 | 37% |
| Above A$190,000 | 45% |

The 16% rate fell to 15% from 1 July 2026, and is due to fall to 14% from 1 July 2027.

**Employee contributions:**

- Medicare levy 2% (reduced for low incomes)
- Superannuation 12% is paid by the employer, not deducted

**Good to know:**

- Temporary visa holders who are residents for tax pay the same rates.

**Official sources:**

- [ATO: tax rates for Australian residents](https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents)

### Income tax in UAE (Dubai/Abu Dhabi)

**Tax year:** 2026

No personal income tax on salary. Expat employees pay no social security (it applies only to UAE and GCC nationals).

**Salary income**

| Taxable income | Rate |
|---|---|
| Above AED 0 | 0% |

No income tax on employment income. 5% VAT applies to most spending.

**Employee contributions:**

- None for expats

**Good to know:**

- Living in the UAE most of the year can end your tax residency back home — check the 182-day rule and the deemed-resident rule for high earners.

**Official sources:**

- [UAE government: taxation](https://u.ae/en/information-and-services/finance-and-investment/taxation)

## Who Does What in a Project

| Phase | What | Who | Output |
|---|---|---|---|
| 1. Requirement | Understand what the business needs. | Business Analyst, Product Manager/Owner, Client | BRD, user stories, acceptance criteria |
| 2. Design | Plan the architecture and user experience. | Architect, Tech Lead, UI/UX Designer | Architecture diagrams, wireframes, API contracts |
| 3. Development | Write and review the code. | Frontend, Backend, Full Stack, Mobile Developers | Source code, pull requests, unit tests |
| 4. Testing | Verify it works and is secure. | QA / SDET, Performance Tester, Security Engineer | Test cases, bug reports, test reports |
| 5. Deployment | Release to production. | DevOps / Release Engineer, Cloud Engineer | CI/CD pipeline, release notes, deployed build |
| 6. Operations & Support | Keep it running and fix issues. | SRE, Production Support, IT Support | Dashboards, alerts, incident & RCA reports |
| Throughout | Plan, track and remove blockers. | Scrum Master, Project/Delivery Manager, Engineering Manager | Sprint plans, status reports, risk logs |
