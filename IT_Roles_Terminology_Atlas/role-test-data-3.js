/*
 * Role Readiness Test — extra questions (part 1 of 2): HTML to SQL.
 * Each topic gets 2 more easy, 2 more medium and 2 more hard questions (12 per topic in total),
 * so retakes see different questions. Appended to window.ROLE_TEST.topics.
 */
(function (root) {
  const extra = {
    html: [
      { l: 1, q: "Which element should wrap the main, unique content of a page?", o: ["<div id=\"main\">", "<main>", "<body>", "<article>"], a: 1, e: "Use one <main> per page; screen readers can jump straight to it." },
      { l: 1, q: "What is the correct way to link a form label to its input?", o: ["Put them in the same <div>", "<label for=\"email\"> with <input id=\"email\">", "Use placeholder text only", "Use a title attribute"], a: 1, e: "Clicking the label then focuses the input, and screen readers announce it." },
      { l: 2, q: "Which input type shows a numeric keypad on phones and validates email-like text natively?", o: ["type=\"text\" for both", "type=\"email\" for email; inputmode=\"numeric\" or type=\"tel\" for digits", "type=\"number\" for everything", "type=\"search\""], a: 1, e: "The right type gives the right keyboard and built-in validation." },
      { l: 2, q: "What does loading=\"lazy\" on an <img> do?", o: ["Compresses the image", "Delays loading until the image is near the viewport", "Loads it in a web worker", "Blocks rendering until it loads"], a: 1, e: "Don't lazy-load the main above-the-fold image — it hurts LCP." },
      { l: 3, q: "Why should headings follow a logical order (h1 → h2 → h3)?", o: ["For larger font sizes", "Screen readers and search engines use them as the page outline", "Browsers require it to render", "It speeds up loading"], a: 1, e: "Pick heading levels by structure; style the size with CSS." },
      { l: 3, q: "What is the main purpose of <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">?", o: ["SEO ranking", "Tells mobile browsers to use the device width instead of a zoomed-out desktop width", "Disables zoom", "Loads fonts faster"], a: 1, e: "Without it, responsive CSS media queries don't work as expected on phones." },
    ],
    css: [
      { l: 1, q: "Which CSS unit is relative to the root element's font size?", o: ["em", "rem", "px", "vh"], a: 1, e: "rem uses the <html> font size; em uses the parent's font size." },
      { l: 1, q: "How do you centre a child both horizontally and vertically with Flexbox?", o: ["text-align: center", "display: flex; justify-content: center; align-items: center", "margin: auto on the parent", "float: center"], a: 1, e: "Grid works too: display: grid; place-items: center." },
      { l: 2, q: "What does a media query like @media (max-width: 600px) do?", o: ["Loads a stylesheet over the network", "Applies the styles inside only when the viewport is 600px wide or less", "Sets the page width", "Hides the page on desktops"], a: 1, e: "Mobile-first design writes base styles for phones and uses min-width queries for larger screens." },
      { l: 2, q: "What is the difference between display: none and visibility: hidden?", o: ["No difference", "none removes the element from layout; hidden keeps its space but makes it invisible", "hidden removes it from the DOM", "none only works on images"], a: 1, e: "Both hide content from screen readers too." },
      { l: 3, q: "What creates a new stacking context and can make a high z-index appear 'not work'?", o: ["A parent with position plus z-index, opacity < 1 or transform", "Using rem units", "Flexbox gap", "A <section> element"], a: 0, e: "z-index only competes within the same stacking context." },
      { l: 3, q: "What are CSS custom properties (--brand: #4f46e5) mainly useful for?", o: ["Only for animations", "Reusable values that cascade and can change at runtime, e.g. light/dark themes", "Replacing JavaScript", "Compressing CSS"], a: 1, e: "Use them with var(--brand); change them per theme or component." },
    ],
    javascript: [
      { l: 1, q: "What does Array.prototype.map return?", o: ["The same array, modified", "A new array with the callback's result for each element", "A single value", "undefined"], a: 1, e: "map doesn't mutate the original; use filter to select and reduce to combine." },
      { l: 1, q: "What is the result of typeof null?", o: ["\"null\"", "\"object\"", "\"undefined\"", "\"number\""], a: 1, e: "A long-standing quirk of JavaScript; check null with === null." },
      { l: 2, q: "What does async/await do?", o: ["Runs code on multiple threads", "Lets you write promise-based code that reads like synchronous code", "Blocks the main thread until done", "Replaces callbacks with events"], a: 1, e: "await pauses only that async function; the main thread keeps running other work." },
      { l: 2, q: "What is the difference between spread copy {...obj} and a deep copy?", o: ["None", "Spread copies only the top level; nested objects are still shared", "Spread copies everything deeply", "Spread only works on arrays"], a: 1, e: "Use structuredClone(obj) for a deep copy." },
      { l: 3, q: "What does Promise.all do if one promise rejects?", o: ["Waits for all and returns results plus errors", "Rejects immediately with that error", "Ignores the rejected one", "Retries it"], a: 1, e: "Use Promise.allSettled to get every result, success or failure." },
      { l: 3, q: "What is event delegation?", o: ["Passing events between iframes", "Attaching one listener to a parent and using event.target to handle many children", "Cancelling events", "Running events in a worker"], a: 1, e: "Fewer listeners, and it works for elements added later." },
    ],
    typescript: [
      { l: 1, q: "How do you mark a property as optional in a TypeScript interface?", o: ["name: optional string", "name?: string", "name: string | null only", "@Optional name"], a: 1, e: "Optional means it can be missing (undefined)." },
      { l: 1, q: "What does the readonly modifier do?", o: ["Hides the property", "Prevents reassigning the property after creation (at compile time)", "Freezes the object at runtime", "Makes it private"], a: 1, e: "For runtime immutability use Object.freeze." },
      { l: 2, q: "What does keyof User produce?", o: ["The values of User", "A union of User's property names as string literal types", "An array of keys", "The type any"], a: 1, e: "e.g. \"id\" | \"name\" | \"email\" — useful with generics." },
      { l: 2, q: "What is type narrowing?", o: ["Shortening type names", "TypeScript refining a union to a specific type after a check like typeof or 'in'", "Converting types at runtime", "Removing unused types"], a: 1, e: "if (typeof x === \"string\") { x.toUpperCase() } — x is a string inside." },
      { l: 3, q: "What does the satisfies operator do?", o: ["Casts a value to a type", "Checks a value matches a type while keeping its more specific inferred type", "Creates a runtime check", "Makes a type optional"], a: 1, e: "const config = {...} satisfies Config keeps literal types and still validates." },
      { l: 3, q: "Which utility type removes properties from a type?", o: ["Pick", "Omit", "Partial", "Record"], a: 1, e: "Omit<User, \"password\"> — a safe User type for API responses." },
    ],
    angular: [
      { l: 1, q: "What does *ngFor / @for do in a template?", o: ["Handles forms", "Repeats a template block for each item in a list", "Defines routes", "Injects services"], a: 1, e: "Angular 17+ uses the built-in @for block with a required track expression." },
      { l: 1, q: "What is a service in Angular typically used for?", o: ["Styling components", "Sharing data and logic (e.g. HTTP calls) across components", "Defining templates", "Routing only"], a: 1, e: "Mark it @Injectable({ providedIn: 'root' }) for an app-wide singleton." },
      { l: 2, q: "What does the async pipe do?", o: ["Runs code in a worker", "Subscribes to an Observable or Promise in the template and unsubscribes automatically", "Delays rendering", "Converts dates"], a: 1, e: "It prevents memory leaks from forgotten subscriptions." },
      { l: 2, q: "What is the difference between template-driven and reactive forms?", o: ["No difference", "Reactive forms define the model in TypeScript and are easier to test and scale; template-driven forms live in the template", "Template-driven forms are newer", "Reactive forms can't validate"], a: 1, e: "Reactive forms suit complex, dynamic forms." },
      { l: 3, q: "What do route guards like canActivate do?", o: ["Style active links", "Decide whether navigation to a route may happen, e.g. only for logged-in users", "Preload all modules", "Cache HTTP responses"], a: 1, e: "Remember: guards are UX — always enforce security on the server too." },
      { l: 3, q: "What is the purpose of an HTTP interceptor?", o: ["To render HTML", "To run code on every HTTP request/response — add auth headers, handle errors, show spinners", "To replace HttpClient", "To cache components"], a: 1, e: "Functional interceptors (withInterceptors) are the modern style." },
    ],
    react: [
      { l: 1, q: "What does useState return?", o: ["Only the value", "The current value and a function to update it", "A promise", "A ref"], a: 1, e: "const [count, setCount] = useState(0)." },
      { l: 1, q: "What is JSX?", o: ["A database", "A syntax that looks like HTML and compiles to React.createElement calls", "A CSS framework", "A test library"], a: 1, e: "Use className instead of class, and {} for JavaScript expressions." },
      { l: 2, q: "What does lifting state up mean?", o: ["Moving state to a global store always", "Moving shared state to the nearest common parent and passing it down via props", "Using useRef instead of useState", "Making state immutable"], a: 1, e: "Use context or a store only when prop passing becomes painful." },
      { l: 2, q: "What is useRef commonly used for?", o: ["Triggering re-renders", "Holding a mutable value or DOM reference that doesn't cause re-renders", "Fetching data", "Routing"], a: 1, e: "e.g. inputRef.current.focus()." },
      { l: 3, q: "Why should you never call hooks inside conditions or loops?", o: ["It's slower", "React relies on hooks being called in the same order every render", "Hooks only work in classes", "It breaks JSX"], a: 1, e: "The Rules of Hooks; the ESLint plugin catches mistakes." },
      { l: 3, q: "What problem does React.memo solve?", o: ["Memory leaks", "Skips re-rendering a component when its props haven't changed", "Caches API calls", "Lazy loads code"], a: 1, e: "Pair with stable props (useCallback/useMemo) or it won't help." },
    ],
    "web-vitals": [
      { l: 1, q: "What is a good LCP time?", o: ["Under 10 s", "2.5 s or less", "Under 100 ms", "Exactly 1 s"], a: 1, e: "Measured at the 75th percentile of page loads." },
      { l: 1, q: "Which tool gives a quick lab report for Core Web Vitals?", o: ["Postman", "Lighthouse / PageSpeed Insights", "Git", "Jenkins"], a: 1, e: "PageSpeed Insights also shows real-user (CrUX) field data when available." },
      { l: 2, q: "How can a web font cause layout shift (CLS)?", o: ["It can't", "Swapping from a fallback font of a different size moves text", "Fonts block JavaScript", "Fonts disable caching"], a: 1, e: "Preload key fonts and match fallback metrics (size-adjust)." },
      { l: 2, q: "Which change usually improves LCP the most for an image-heavy hero?", o: ["Lazy-loading the hero image", "Preloading or prioritising the hero image (fetchpriority=\"high\") and serving it in a modern format", "Adding more JavaScript", "Removing alt text"], a: 1, e: "Also make sure the server responds fast (TTFB)." },
      { l: 3, q: "Why can a heavy third-party tag manager hurt INP?", o: ["It changes fonts", "Its scripts run long tasks on the main thread, delaying responses to clicks", "It blocks DNS", "It lowers image quality"], a: 1, e: "Load third parties late and audit what they run." },
      { l: 3, q: "What is a performance budget?", o: ["The cost of hosting", "A limit (e.g. bundle size or LCP) enforced in CI so performance doesn't regress", "A server CPU quota", "A Lighthouse score of 100"], a: 1, e: "Failing the build when the budget is exceeded keeps the team honest." },
    ],
    java: [
      { l: 1, q: "What is the difference between an interface and an abstract class in Java?", o: ["No difference", "A class can implement many interfaces but extend only one class; abstract classes can hold state", "Interfaces can have constructors", "Abstract classes can't have methods"], a: 1, e: "Interfaces can have default methods since Java 8." },
      { l: 1, q: "Why is String immutable in Java?", o: ["For speed of concatenation", "For safety (sharing, hashing, security) and string pool reuse", "Because of the garbage collector", "It isn't"], a: 1, e: "Use StringBuilder when building strings in a loop." },
      { l: 2, q: "What does Optional help with?", o: ["Making fields optional in JSON", "Representing a value that may be absent, avoiding null checks and NullPointerExceptions", "Lazy loading", "Thread safety"], a: 1, e: "Use it for return types, not for fields or parameters." },
      { l: 2, q: "What is the difference between a stream's map and flatMap?", o: ["None", "map transforms each element; flatMap transforms each into a stream and flattens the results", "flatMap filters elements", "map is terminal"], a: 1, e: "e.g. orders.stream().flatMap(o -> o.getItems().stream())." },
      { l: 3, q: "What is a memory leak in a Java application, given the garbage collector?", o: ["Impossible in Java", "Objects that are still referenced but no longer needed, e.g. an ever-growing static cache", "Unclosed comments", "Too many threads"], a: 1, e: "Find it with a heap dump and a tool like Eclipse MAT." },
      { l: 3, q: "What are Java 21 virtual threads good for?", o: ["CPU-heavy number crunching", "Many concurrent blocking I/O tasks with simple thread-per-request code", "Replacing the garbage collector", "GPU work"], a: 1, e: "They are cheap, so you can have millions; CPU-bound work still needs real cores." },
    ],
    spring: [
      { l: 1, q: "What does @SpringBootApplication include?", o: ["Only @Configuration", "@Configuration, @EnableAutoConfiguration and @ComponentScan", "@RestController and @Service", "@Transactional"], a: 1, e: "Put it on the main class in the root package so scanning finds your components." },
      { l: 1, q: "Where do you usually put configuration like the database URL?", o: ["Hard-coded in a class", "application.properties / application.yml or environment variables", "In pom.xml", "In the controller"], a: 1, e: "Use profiles (application-prod.yml) and keep secrets in environment variables or a vault." },
      { l: 2, q: "What does @Valid do on a @RequestBody parameter?", o: ["Encrypts the body", "Runs Bean Validation (@NotNull, @Size…) and returns 400 if it fails", "Checks authentication", "Logs the request"], a: 1, e: "Handle MethodArgumentNotValidException for friendly error messages." },
      { l: 2, q: "What is a Spring profile used for?", o: ["User profiles", "Switching beans and configuration per environment (dev, test, prod)", "Performance profiling", "Logging levels only"], a: 1, e: "Activate with spring.profiles.active=prod." },
      { l: 3, q: "How do you handle exceptions for all controllers in one place?", o: ["try/catch in every method", "@RestControllerAdvice with @ExceptionHandler methods", "A servlet filter only", "Return null"], a: 1, e: "Spring Boot 3 can return RFC 9457 ProblemDetail responses." },
      { l: 3, q: "What is the default scope of a Spring bean, and what does it imply?", o: ["Prototype — new per use", "Singleton — one shared instance, so it must not hold per-request state", "Request — one per HTTP request", "Session"], a: 1, e: "Keep singleton beans stateless; use method parameters for request data." },
    ],
    "rest-api": [
      { l: 1, q: "Which status code means a resource was not found?", o: ["400", "404", "409", "503"], a: 1, e: "404 Not Found; 410 Gone if it was deliberately removed." },
      { l: 1, q: "What format do most REST APIs use for request and response bodies?", o: ["XML only", "JSON", "CSV", "HTML"], a: 1, e: "Set Content-Type: application/json." },
      { l: 2, q: "What is the difference between PUT and PATCH?", o: ["None", "PUT replaces the whole resource; PATCH changes only some fields", "PATCH creates resources", "PUT is not idempotent"], a: 1, e: "Missing fields in a PUT body may be cleared." },
      { l: 2, q: "Which status code should a rate-limited client receive?", o: ["403", "429 Too Many Requests", "500", "503"], a: 1, e: "Include a Retry-After header." },
      { l: 3, q: "Why version an API (e.g. /v1/)?", o: ["For SEO", "So breaking changes don't break existing clients; old and new versions can run side by side", "To speed up requests", "Versioning is required by HTTP"], a: 1, e: "Adding optional fields isn't breaking; renaming or removing them is." },
      { l: 3, q: "What is HATEOAS?", o: ["A caching method", "Responses include links to related actions, so clients discover what they can do next", "An auth protocol", "A JSON schema"], a: 1, e: "It's part of REST's original constraints but rarely used fully in practice." },
    ],
    sql: [
      { l: 1, q: "Which keyword removes duplicate rows from a result?", o: ["UNIQUE", "DISTINCT", "GROUP", "FILTER"], a: 1, e: "SELECT DISTINCT city FROM customers." },
      { l: 1, q: "What does a PRIMARY KEY guarantee?", o: ["Fast inserts", "Each row has a unique, non-null identifier", "Rows are sorted", "Data is encrypted"], a: 1, e: "Foreign keys in other tables reference it." },
      { l: 2, q: "What is the difference between UNION and UNION ALL?", o: ["None", "UNION removes duplicates; UNION ALL keeps them and is faster", "UNION ALL removes duplicates", "UNION only works on two tables"], a: 1, e: "Use UNION ALL when duplicates are impossible or wanted." },
      { l: 2, q: "What does a window function like ROW_NUMBER() OVER (PARTITION BY dept ORDER BY salary DESC) do?", o: ["Deletes rows", "Numbers rows within each department by salary without collapsing them", "Groups and sums salaries", "Creates an index"], a: 1, e: "Unlike GROUP BY, window functions keep every row." },
      { l: 3, q: "What does EXPLAIN show?", o: ["The table's data", "The execution plan: which indexes are used, join order and estimated rows", "Who ran the query", "The query's result"], a: 1, e: "Look for full table scans (type: ALL in MySQL) on big tables." },
      { l: 3, q: "What is a deadlock in a database?", o: ["A slow query", "Two transactions each waiting for a lock the other holds; the database kills one", "A full disk", "A corrupted index"], a: 1, e: "Prevent by accessing rows in a consistent order and keeping transactions short." },
    ],
  };
  const bank = root.ROLE_TEST || (typeof require !== "undefined" ? require("./role-test-data-2.js") : null);
  for (const [id, qs] of Object.entries(extra)) bank.topics[id].q.push(...qs);
  if (typeof module !== "undefined" && module.exports) module.exports = bank;
})(typeof window !== "undefined" ? window : globalThis);
