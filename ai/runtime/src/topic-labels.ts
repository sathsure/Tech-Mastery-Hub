/** Display names for topic ids, shared by the web app, chat suggestions and the roadmap generator. */
export const TOPIC_LABELS: Record<string, string> = {
  javascript: "JavaScript", typescript: "TypeScript", html: "HTML", css: "CSS", angular: "Angular", react: "React",
  rxjs: "RxJS", nodejs: "Node.js", java: "Java", spring: "Spring Boot", "spring-security": "Spring Security",
  "spring-cloud": "Spring Cloud", microservices: "Microservices", "rest-api": "REST API", "database/sql": "SQL",
  devops: "DevOps", aws: "AWS", "web-architecture": "Web Architecture", "web-vitals": "Web Vitals",
  "it-roles": "IT Roles", "it-terminology": "Glossary", "tech-stack": "Tech Stack", "it-careers": "Careers & Salary",
  roadmaps: "Roadmaps",
};

export const topicLabel = (topic: string): string => TOPIC_LABELS[topic] ?? topic;
