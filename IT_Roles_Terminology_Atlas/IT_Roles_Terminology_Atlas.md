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
| **SDLC** (Software Development Life Cycle) | Phases to build software: plan → design → build → test → deploy → maintain. |
| **STLC** (Software Testing Life Cycle) | Phases of testing: requirement analysis → test plan → test cases → execution → closure. |
| **Environment** | A copy of the system for a purpose: DEV, QA/TEST, UAT, STAGING, PROD. |
| **Production (Prod)** | The live system real users use. |
| **UAT** (User Acceptance Testing) | Business users confirm the software meets their needs before release. |
| **POC** (Proof of Concept) | Small experiment to prove an idea works technically. |
| **MVP** (Minimum Viable Product) | Smallest usable version of a product released to learn from users. |
| **Hotfix / Patch** | Urgent fix released directly to production. |
| **Semantic Versioning** (SemVer) | MAJOR.MINOR.PATCH — breaking.feature.fix (e.g. 2.4.1). |

### Git & Version Control

| Term | Meaning |
|---|---|
| **Version Control / Git** | Tracks code changes over time. Git is the standard tool. |
| **Branch / Merge / PR** | Branch = separate line of work; PR (Pull Request) = request to merge it after review. |
| **Commit** | A saved snapshot of changes with a message, author and unique ID (hash). |
| **Clone / Fork** | Clone = local copy of a repository. Fork = your own server-side copy of someone else's repository, used to propose changes. |
| **Rebase** | Replays your commits on top of another branch for a linear history. Avoid rebasing commits others already use. |
| **Merge Conflict** | Two branches changed the same lines; Git can't combine them automatically, so you resolve them by hand. |
| **Tag** | A named pointer to a specific commit, typically used to mark releases (e.g. v1.4.0). |

### Programming Basics

| Term | Meaning |
|---|---|
| **Legacy System** | Old system still in use, usually hard to change. |
| **Technical Debt** | Future cost of shortcuts taken today in code or design. |
| **Refactoring** | Improving code structure without changing behaviour. |
| **IDE** (Integrated Development Environment) | Code editor with build/debug tools. E.g. IntelliJ, VS Code, Eclipse. |
| **SDK** (Software Development Kit) | Package of libraries and tools to build for a platform. |
| **Library vs Framework** | You call a library; a framework calls your code (inversion of control). |
| **Open Source** | Software with public source code anyone can use under a licence. |
| **Compiled vs Interpreted** | Compiled turns code into machine code before running (C, Go); interpreted runs line by line (Python, JS). Java compiles to bytecode for the JVM. |
| **Runtime** | Environment that executes code: JVM, Node.js, .NET CLR, browser. |

### Frontend

| Term | Meaning |
|---|---|
| **DOM** (Document Object Model) | Tree representation of a web page that JavaScript can change. |
| **SPA** (Single Page Application) | Web app that loads once and updates content without full page reloads (Angular, React). |
| **SSR / CSR / SSG** | Server-Side Rendering, Client-Side Rendering, Static Site Generation — where/when HTML is built. |
| **Responsive Design** | Layouts that adapt to phone, tablet and desktop screens. |
| **Component** | Reusable UI building block with its own template, style and logic. |
| **State Management** | Keeping shared UI data consistent. Tools: NgRx, Redux, Signals, Zustand. |
| **Accessibility (a11y)** | Making apps usable by everyone, including disabled users. Standard: WCAG. |
| **Core Web Vitals** | Google page-quality metrics: LCP (load), INP (interactivity), CLS (layout shift). |
| **Bundler** | Combines and optimises JS/CSS files. E.g. Vite, Webpack, esbuild. |
| **PWA** (Progressive Web App) | Website that works offline and installs like an app. |
| **Design System** | Shared set of UI components, colours and rules. E.g. Material Design. |
| **Lazy Loading** | Load code or images only when needed. |

### Backend & APIs

| Term | Meaning |
|---|---|
| **API** (Application Programming Interface) | Contract that lets one program talk to another. |
| **REST** (Representational State Transfer) | API style using HTTP methods (GET, POST, PUT, DELETE) on resources/URLs. |
| **GraphQL** | API query language where clients ask for exactly the fields they need. |
| **gRPC** | Fast binary API protocol using Protocol Buffers; common between microservices. |
| **Webhook** | A server calls your URL when an event happens (push instead of polling). |
| **WebSocket** | Two-way live connection for chat, notifications, live data. |
| **JSON / XML / YAML** | Text data formats. JSON for APIs, XML for older systems, YAML for config. |
| **HTTP Status Codes** | 2xx success, 3xx redirect, 4xx client error (404, 401), 5xx server error (500). |
| **Endpoint** | A specific API URL, e.g. GET /api/orders/42. |
| **Middleware** | Code that runs between request and response (logging, auth) — or software linking systems. |
| **ORM** (Object-Relational Mapping) | Maps database tables to code objects. E.g. Hibernate/JPA, Entity Framework, Prisma. |
| **Dependency Injection (DI)** | Framework supplies an object's dependencies instead of the object creating them (Spring, Angular). |
| **OOP** (Object-Oriented Programming) | Code organised as objects. Pillars: encapsulation, abstraction, inheritance, polymorphism. |
| **SOLID** | Five design principles for maintainable OOP code. |
| **Design Patterns** | Reusable solutions: Singleton, Factory, Builder, Strategy, Observer, Adapter. |
| **Concurrency / Multithreading** | Doing multiple tasks at the same time safely. |
| **Idempotency** | Repeating the same request gives the same result — e.g. no double payment on retry. |
| **Rate Limiting** | Capping how many requests a client can make in a time window. |
| **Swagger / OpenAPI** | Standard to describe and document REST APIs. |
| **Big-O Notation** | How work grows with input size: O(1), O(log n), O(n), O(n log n), O(n²). |
| **DSA** (Data Structures & Algorithms) | Arrays, lists, maps, trees, graphs + sorting/searching techniques. |

### Architecture

| Term | Meaning |
|---|---|
| **Monolith** | Whole application built and deployed as one unit. |
| **Microservices** | System split into small, independently deployable services. |
| **Modular Monolith** | One deployable app with strict internal module boundaries. |
| **Serverless** | Run code without managing servers; pay per use. E.g. AWS Lambda, Azure Functions. |
| **Event-Driven Architecture** | Services react to events via a broker (Kafka, RabbitMQ, SQS). |
| **Message Queue / Broker** | Holds messages between services for async processing. E.g. Kafka, RabbitMQ, SQS. |
| **API Gateway** | Single entry point that routes, authenticates and rate-limits API calls. |
| **Load Balancer** | Spreads traffic across multiple servers. |
| **Caching** | Storing frequent data in fast memory. E.g. Redis, CDN. |
| **CDN** (Content Delivery Network) | Servers worldwide that deliver static content close to users. E.g. CloudFront, Cloudflare. |
| **Scalability (Horizontal / Vertical)** | Handle more load by adding machines (horizontal) or bigger machines (vertical). |
| **High Availability (HA)** | System stays up despite failures, often measured as 99.9% uptime. |
| **Fault Tolerance / Resilience** | Keep working when parts fail: retries, timeouts, circuit breakers. |
| **Circuit Breaker** | Stops calling a failing service for a while to prevent cascade failures. |
| **CAP Theorem** | A distributed system can guarantee only two of: Consistency, Availability, Partition tolerance. |
| **Saga Pattern** | Manages a multi-service transaction as steps with compensating actions. |
| **CQRS** (Command Query Responsibility Segregation) | Separate models for writing and reading data. |
| **DDD** (Domain-Driven Design) | Design software around business domains and their language. |
| **Hexagonal / Clean Architecture** | Keep business logic independent of frameworks, UI and databases. |
| **Service Mesh** | Infrastructure layer handling service-to-service traffic, security and metrics. E.g. Istio. |
| **Non-Functional Requirements (NFRs)** | Qualities like performance, security, scalability, availability — not features. |
| **ADR** (Architecture Decision Record) | Short document recording a design decision and why. |

### Data & Databases

| Term | Meaning |
|---|---|
| **RDBMS / SQL** | Table-based databases queried with SQL. E.g. PostgreSQL, MySQL, Oracle, SQL Server. |
| **NoSQL** | Non-table databases: document (MongoDB), key-value (Redis, DynamoDB), column (Cassandra), graph (Neo4j). |
| **ACID** | Transaction guarantees: Atomicity, Consistency, Isolation, Durability. |
| **Transaction** | Group of DB operations that all succeed or all fail. |
| **Index** | Data structure that speeds up lookups, like a book index. |
| **Normalization** | Organising tables to avoid duplicate data. |
| **Primary / Foreign Key** | Primary key uniquely identifies a row; foreign key links to another table. |
| **Join** | Combines rows from tables: INNER, LEFT, RIGHT, FULL. |
| **Stored Procedure** | Saved SQL program that runs inside the database. |
| **Sharding / Partitioning** | Splitting data across machines or segments to scale. |
| **Replication** | Copying data to other servers for availability and read scaling. |
| **ETL / ELT** | Extract, Transform, Load — moving data into a warehouse (ELT transforms after loading). |
| **Data Warehouse** | Structured store for analytics. E.g. Snowflake, BigQuery, Redshift. |
| **Data Lake / Lakehouse** | Store of raw data in any format (lake); lakehouse adds warehouse features. E.g. Databricks. |
| **Data Pipeline** | Automated flow that moves and transforms data. |
| **Batch vs Streaming** | Process data in scheduled chunks vs continuously in real time. |
| **Big Data** | Data too large/fast for one machine. Tools: Spark, Hadoop, Kafka. |
| **OLTP vs OLAP** | OLTP = day-to-day transactions; OLAP = analytics and reporting. |
| **BI** (Business Intelligence) | Dashboards and reports for business decisions. E.g. Power BI, Tableau. |
| **Schema Migration** | Versioned DB structure changes. Tools: Flyway, Liquibase. |

### Cloud & DevOps

| Term | Meaning |
|---|---|
| **Cloud Computing** | Renting computing resources over the internet. Big 3: AWS, Azure, GCP. |
| **IaaS / PaaS / SaaS** | Infrastructure (EC2), Platform (Heroku, App Service), Software (Gmail, Salesforce) as a Service. |
| **Public / Private / Hybrid Cloud** | Shared provider cloud / company-only cloud / mix of both. |
| **Region / Availability Zone** | Region = geographic area; AZ = isolated data centre within it. |
| **VM** (Virtual Machine) | Software-emulated computer running its own OS. |
| **Container / Docker** | Lightweight package of an app and its dependencies that runs anywhere. |
| **Kubernetes (K8s)** | Runs and scales containers across many machines. Terms: pod, deployment, service. |
| **DevOps** | Culture and practices joining development and operations to ship faster and safer. |
| **CI/CD** | Continuous Integration (auto build+test) and Continuous Delivery/Deployment (auto release). |
| **Pipeline** | Automated steps: build → test → scan → deploy. E.g. Jenkins, GitHub Actions. |
| **IaC** (Infrastructure as Code) | Define servers and networks in code files. E.g. Terraform, CloudFormation. |
| **Configuration Management** | Automate server setup. E.g. Ansible, Chef, Puppet. |
| **GitOps** | Git is the source of truth for deployments. E.g. Argo CD, Flux. |
| **Blue-Green / Canary Deployment** | Release strategies: switch between two environments / release to a small % first. |
| **Feature Flag** | Turn features on/off without redeploying. |
| **Observability** | Understand system state via logs, metrics and traces. Tools: Grafana, Datadog, OpenTelemetry. |
| **SLA / SLO / SLI** | Agreement with customer / internal target / actual measurement (e.g. 99.9% uptime). |
| **Auto Scaling** | Automatically add/remove servers based on load. |
| **FinOps** | Managing and reducing cloud costs. |
| **Artifact / Registry** | Built output (JAR, Docker image) stored in a repo like Nexus, Artifactory, ECR. |

### AI & ML

| Term | Meaning |
|---|---|
| **AI** (Artificial Intelligence) | Machines performing tasks that need human-like intelligence. |
| **Machine Learning (ML)** | Systems learn patterns from data instead of hard-coded rules. |
| **Deep Learning** | ML using multi-layer neural networks; powers vision, speech and LLMs. |
| **Supervised / Unsupervised Learning** | Learn from labelled examples / find patterns in unlabelled data. |
| **Model / Training / Inference** | Model = learned function; training = learning it; inference = using it to predict. |
| **Generative AI (GenAI)** | AI that creates text, images, code or audio. |
| **LLM** (Large Language Model) | Model trained on huge text to understand and generate language. E.g. Claude, GPT, Gemini, Llama. |
| **Token / Context Window** | Token = chunk of text a model reads; context window = max tokens it can consider at once. |
| **Prompt Engineering** | Writing clear instructions and examples to get better model output. |
| **Embedding** | Numeric vector representing meaning of text, used for similarity search. |
| **Vector Database** | Stores embeddings for semantic search. E.g. pgvector, Pinecone, Weaviate. |
| **RAG** (Retrieval-Augmented Generation) | Fetch relevant documents first, then let the LLM answer using them. |
| **Fine-tuning** | Further training a model on specific data for a task. |
| **Hallucination** | When a model confidently generates incorrect information. |
| **AI Agent** | LLM that plans and uses tools in steps to complete a task. |
| **Tool / Function Calling** | Model requests a defined function/API call with structured arguments. |
| **MCP** (Model Context Protocol) | Open standard for connecting AI apps to tools and data sources. |
| **Guardrails** | Rules and checks that keep AI output safe and on-topic. |
| **MLOps / LLMOps** | Practices to deploy, monitor and update ML/LLM systems in production. |
| **NLP / Computer Vision** | AI for language / AI for images and video. |
| **Agentic AI** | AI systems that act on their own — plan, use tools and take multi-step actions toward a goal. |
| **Multi-Agent System** | Several specialised agents cooperating (e.g. planner, researcher, coder). |
| **Context Engineering** | Choosing what instructions, data, tools and memory go into a model's context window. |
| **Evals** (Evaluations) | Automated tests that score AI output quality before and after changes. |
| **LLM-as-a-Judge** | Using one model to grade another model's answers. |
| **Grounding** | Tying AI answers to trusted sources to reduce hallucination. |
| **Human-in-the-Loop (HITL)** | A person reviews or approves AI actions at key steps. |
| **Prompt Injection / Jailbreak** | Malicious text that tricks a model into ignoring its rules / bypassing safety. |
| **Foundation Model** | Large general-purpose model adapted to many tasks (Claude, GPT, Gemini, Llama). |
| **Multimodal** | Model that handles text, images, audio and/or video together. |
| **Reasoning Model** | Model that 'thinks' step by step before answering, for harder problems. |
| **SLM** (Small Language Model) | Compact model that runs cheaply or on-device (Phi, Gemma, Llama small). |
| **Open-Weight Model** | Model whose weights are downloadable to self-host (Llama, Mistral, Qwen, DeepSeek). |
| **Temperature** | Setting controlling randomness: low = focused, high = creative. |
| **Structured Output** | Forcing the model to return valid JSON matching a schema. |
| **RLHF** (Reinforcement Learning from Human Feedback) | Training models using human ratings of their answers. |
| **LoRA / PEFT** | Cheap fine-tuning methods that train only small added weights. |
| **Quantization** | Shrinking model precision (e.g. 16-bit → 4-bit) to run faster on less memory. |
| **Distillation** | Training a small model to copy a large model's behaviour. |
| **MoE** (Mixture of Experts) | Model architecture that activates only some sub-networks per token for efficiency. |
| **Inference Serving / GPU** | Running models for users on GPUs; tools: vLLM, TensorRT-LLM, Ollama. |
| **TTFT / Tokens per Second** | Time-to-first-token and generation speed — key LLM latency metrics. |
| **Semantic Caching** | Reusing answers for similar (not identical) questions to save cost. |
| **Model Router / AI Gateway** | Layer that picks a model per request and handles keys, limits and logging (e.g. LiteLLM). |
| **A2A** (Agent-to-Agent Protocol) | Open protocol for agents from different vendors to communicate. |
| **AI Copilot / Assistant** | AI embedded in a tool to help a human (GitHub Copilot, Microsoft 365 Copilot). |
| **Vibe Coding** | Building software mainly by prompting AI and accepting its code with light review. |
| **Spec-Driven Development** | Writing clear specs first so AI coding agents can implement them reliably. |
| **Synthetic Data** | Artificially generated data used for training or testing. |
| **Edge AI / TinyML** | Running AI on devices (phones, sensors) instead of the cloud. |
| **Responsible AI** | Building AI that is fair, transparent, private, safe and accountable. |
| **EU AI Act / ISO 42001** | EU law classifying AI by risk / international AI management-system standard. |
| **AGI** (Artificial General Intelligence) | Hypothetical AI matching humans across most tasks. |

### Testing & Quality

| Term | Meaning |
|---|---|
| **Unit Test** | Tests one function/class in isolation. E.g. JUnit, Jest, pytest. |
| **Integration Test** | Tests components working together (API + DB). |
| **E2E Test** (End-to-End) | Tests a full user journey in a real browser. E.g. Playwright, Cypress, Selenium. |
| **Regression Test** | Re-tests old features to ensure new changes didn't break them. |
| **Smoke / Sanity Test** | Quick check that the main features work after a build/deploy. |
| **Performance / Load Test** | Measures speed and stability under traffic. E.g. JMeter, k6. |
| **TDD / BDD** | Test-Driven Dev (write test first) / Behaviour-Driven Dev (Given-When-Then, Cucumber). |
| **Mocking** | Fake dependencies in tests. E.g. Mockito, Jest mocks. |
| **Code Coverage** | % of code executed by tests. Tools: JaCoCo, Istanbul. |
| **Static Code Analysis** | Finds bugs/smells without running code. E.g. SonarQube, ESLint. |
| **Code Review** | Teammates check code before it is merged. |
| **Bug / Defect Severity vs Priority** | Severity = impact on system; priority = how soon to fix. |

### Security

| Term | Meaning |
|---|---|
| **Authentication (AuthN)** | Verifying who you are (login, password, MFA). |
| **Authorization (AuthZ)** | Deciding what you are allowed to do. |
| **OAuth 2.0 / OIDC** | Standards for delegated access (OAuth) and login identity (OpenID Connect). |
| **JWT** (JSON Web Token) | Signed token carrying user identity/claims between systems. |
| **SSO** (Single Sign-On) | Log in once to access many apps. E.g. Okta, Entra ID. |
| **MFA / 2FA** | Multi-factor authentication: password + phone/app/key. |
| **RBAC** (Role-Based Access Control) | Permissions assigned by role (admin, editor, viewer). |
| **Encryption (at rest / in transit)** | Scrambling data on disk / over the network (TLS/HTTPS). |
| **Hashing** | One-way conversion used to store passwords safely (bcrypt, SHA-256). |
| **OWASP Top 10** | Most critical web app risks: injection, broken access control, XSS, etc. |
| **SQL Injection / XSS / CSRF** | Common attacks: malicious SQL input / injected scripts / forged requests. |
| **Firewall / WAF** | Blocks unwanted network traffic / web-specific attacks. |
| **Zero Trust** | Never trust by default; verify every user and device every time. |
| **Vulnerability / CVE** | Security weakness / its public ID (e.g. CVE-2021-44228 Log4Shell). |
| **SAST / DAST** | Static (code) / Dynamic (running app) security testing. |
| **Secrets Management** | Store passwords/keys safely. E.g. HashiCorp Vault, AWS Secrets Manager. |
| **SIEM / SOC** | Security log analysis platform (Splunk) / team that monitors threats. |
| **Penetration Testing** | Authorised simulated attack to find weaknesses. |

### Networking

| Term | Meaning |
|---|---|
| **IP Address** | Unique address of a device on a network (IPv4/IPv6). |
| **DNS** (Domain Name System) | Translates names like google.com into IP addresses. |
| **HTTP / HTTPS** | Web protocol; HTTPS is encrypted with TLS. |
| **TCP / UDP** | Reliable ordered delivery / fast delivery without guarantees (video, gaming). |
| **Port** | Numbered channel on a machine: 80 HTTP, 443 HTTPS, 22 SSH, 5432 PostgreSQL. |
| **VPN** (Virtual Private Network) | Encrypted tunnel into a private network. |
| **VPC / Subnet** | Private cloud network / smaller segment of it (public or private). |
| **Proxy / Reverse Proxy** | Forwards client requests out / receives requests for servers (Nginx). |
| **Latency / Bandwidth / Throughput** | Delay / max capacity / actual data moved per second. |
| **OSI Model** | 7 network layers: Physical, Data Link, Network, Transport, Session, Presentation, Application. |
| **SSH** (Secure Shell) | Encrypted remote login to servers. |

### Agile & Process

| Term | Meaning |
|---|---|
| **Agile** | Deliver in small iterations with frequent feedback. |
| **Waterfall** | Sequential phases; each finishes before the next starts. |
| **Scrum** | Agile framework with sprints, roles (PO, SM, Dev team) and ceremonies. |
| **Kanban** | Visual board with work-in-progress limits; continuous flow. |
| **Sprint** | Fixed time box (usually 2 weeks) to deliver work. |
| **Scrum Ceremonies** | Sprint Planning, Daily Stand-up, Sprint Review (demo), Retrospective. |
| **Backlog** | Prioritised list of work items. |
| **Epic / Story / Task / Bug** | Large goal / user-facing requirement / technical step / defect. |
| **User Story** | "As a <user>, I want <goal>, so that <benefit>." |
| **Acceptance Criteria** | Conditions a story must meet to be accepted. |
| **Definition of Done (DoD)** | Team checklist for when work is truly complete. |
| **Story Points / Velocity** | Relative effort estimate / points a team completes per sprint. |
| **SAFe** (Scaled Agile Framework) | Agile for many teams; uses PI (Program Increment) planning. |
| **ITIL** | IT service management framework: incidents, problems, changes. |
| **Incident / Problem / Change** | Outage to fix now / its root cause / controlled update (ITIL). |
| **RCA** (Root Cause Analysis) | Finding the real cause of an issue (e.g. 5 Whys). |
| **Postmortem** | Blameless review after an incident with action items. |
| **On-Call** | Rotation where an engineer responds to production alerts. |
| **Runbook / Playbook** | Step-by-step guide for operational tasks or incidents. |

### Business & Company

| Term | Meaning |
|---|---|
| **Forward Deployed Engineering** | Model where engineers work inside customer teams to deploy the product; see FDE role. |
| **AI-Native Company** | Company whose product and workflows are built around AI from day one. |
| **CAIO** (Chief AI Officer) | Executive responsible for AI strategy and governance. |
| **Product Company vs Service Company** | Builds its own product (Google, Zoho) vs builds for clients (TCS, Infosys, Accenture). |
| **Startup / MNC / GCC** | Early-stage company / multinational / Global Capability Centre (offshore in-house unit). |
| **Onsite / Offshore** | Working at client location / from a remote delivery centre. |
| **Client / Stakeholder** | Who pays / anyone affected by or influencing the project. |
| **BRD / FRD / SRS** | Business / Functional / Software Requirements documents. |
| **SOW** (Statement of Work) | Contract describing scope, deliverables and timelines. |
| **RFP / RFI / RFQ** | Request for Proposal / Information / Quotation from vendors. |
| **T&M vs Fixed Price** | Billing by time spent vs fixed cost for fixed scope. |
| **KPI / OKR** | Key metric / Objectives & Key Results goal framework. |
| **ROI** (Return on Investment) | Benefit gained compared to cost. |
| **Bench** | Service-company term: employee not yet assigned to a project. |
| **Appraisal / Hike / Band** | Performance review / salary increase / salary-grade level. |
| **CTC** (Cost to Company) | Total yearly cost of an employee (salary + benefits). |
| **LPA** (Lakhs Per Annum) | Indian salary unit: 1 LPA = ₹1,00,000 per year. 100 LPA = 1 Crore. |
| **Fixed vs Variable Pay** | Guaranteed salary vs performance bonus that may not be paid in full. |
| **In-Hand Salary** | Monthly amount after tax, PF and deductions — roughly 65–80% of fixed CTC ÷ 12. |
| **ESOP / RSU** | Stock options (startups) / restricted stock units (listed companies) given as part of pay. |
| **Joining Bonus / Notice Buyout** | One-time payment on joining / employer pays to cut your notice period short. |
| **Notice Period** | Time you must serve after resigning — typically 30–90 days in India. |
| **B2B / B2C** | Business sells to businesses / to consumers. |
| **Go-Live** | The moment a system is released to real users. |
| **Hypercare** | Intensive support period right after go-live. |

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
