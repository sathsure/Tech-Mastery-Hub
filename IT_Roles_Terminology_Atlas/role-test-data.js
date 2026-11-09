/*
 * Role Readiness Test — question bank and role definitions.
 * Questions are written from the repository's interview notes. Each topic has 6 questions:
 * 2 easy (l: 1), 2 medium (l: 2), 2 hard (l: 3). a = index of the correct option in o.
 * Roles not listed in ROLE_TEST.roles will be added in a future update.
 */
(function (root) {
  const topics = {
    html: { label: "HTML", q: [
      { l: 1, q: "Which element is the best choice for the main navigation links of a page?", o: ["<div class=\"nav\">", "<nav>", "<section>", "<header>"], a: 1, e: "<nav> is the semantic element for major navigation blocks; screen readers can jump to it." },
      { l: 1, q: "What is the alt attribute on an <img> used for?", o: ["The image's file name", "A tooltip only", "Text shown or read aloud when the image can't be seen", "SEO keywords"], a: 2, e: "alt describes the image for screen readers and when it fails to load; use alt=\"\" for decorative images." },
      { l: 2, q: "What do the defer and async attributes on <script> do?", o: ["Both run the script before the HTML is parsed", "defer runs after parsing in document order; async runs as soon as it downloads, in any order", "async runs after parsing; defer runs immediately", "They only work for inline scripts"], a: 1, e: "Both download without blocking parsing; defer keeps order and waits for parsing to finish, async runs whenever ready." },
      { l: 2, q: "What are data-* attributes for?", o: ["Styling only", "Storing custom data on an element that JavaScript can read via dataset", "Sending data to the server automatically", "Marking up tables"], a: 1, e: "e.g. <button data-id=\"42\"> → button.dataset.id is \"42\"." },
      { l: 3, q: "A custom clickable <div> works with a mouse but not for keyboard users. What is the best fix?", o: ["Add a CSS :hover style", "Use a real <button>, which is focusable and responds to Enter and Space", "Add title=\"button\"", "Add onclick twice"], a: 1, e: "Native elements bring keyboard support and roles for free; a div needs tabindex, role and key handlers to match." },
      { l: 3, q: "What does aria-live=\"polite\" do?", o: ["Hides an element from screen readers", "Makes screen readers announce changes to that region when the user is idle", "Adds a focus outline", "Lazy-loads the region"], a: 1, e: "Live regions announce dynamic updates, such as form errors or status messages." },
    ]},
    css: { label: "CSS", q: [
      { l: 1, q: "In the CSS box model, what is between the content and the border?", o: ["Margin", "Padding", "Outline", "Gap"], a: 1, e: "Content → padding → border → margin." },
      { l: 1, q: "What does box-sizing: border-box change?", o: ["Width includes padding and border", "Removes the border", "Width includes margin", "Makes the box a flex container"], a: 0, e: "With border-box, width: 200px is the total width including padding and border." },
      { l: 2, q: "Which selector has the highest specificity?", o: [".card .title", "#main", "div p span", "[type=\"text\"]"], a: 1, e: "An ID selector (1,0,0) beats any number of classes and elements." },
      { l: 2, q: "When would you choose CSS Grid over Flexbox?", o: ["For a single row of buttons", "For a two-dimensional layout of rows and columns", "Only for centering", "Grid is deprecated"], a: 1, e: "Flexbox is one-dimensional (a row or a column); Grid controls rows and columns together." },
      { l: 3, q: "An element with position: absolute is positioned relative to what?", o: ["The viewport, always", "Its nearest positioned ancestor (not static), or the initial containing block if none", "Its previous sibling", "The body element, always"], a: 1, e: "That's why parents often get position: relative." },
      { l: 3, q: "Which property change is cheapest to animate for smooth 60 fps?", o: ["width", "top", "transform", "margin-left"], a: 2, e: "transform and opacity can be handled by the compositor without layout or paint." },
    ]},
    javascript: { label: "JavaScript", q: [
      { l: 1, q: "What is the difference between let, const and var?", o: ["No difference", "let/const are block-scoped; var is function-scoped; const can't be reassigned", "var is block-scoped", "const makes objects immutable"], a: 1, e: "const prevents reassignment of the binding, but the object it points to can still change." },
      { l: 1, q: "What does === check that == doesn't?", o: ["Only value", "Value and type, with no type coercion", "Object identity only", "Nothing; they're the same"], a: 1, e: "0 == \"0\" is true; 0 === \"0\" is false." },
      { l: 2, q: "What does this print?", code: "console.log(1);\nsetTimeout(() => console.log(2), 0);\nPromise.resolve().then(() => console.log(3));\nconsole.log(4);", o: ["1 2 3 4", "1 4 2 3", "1 4 3 2", "1 3 4 2"], a: 2, e: "Synchronous code first (1, 4), then microtasks (promise: 3), then macrotasks (setTimeout: 2)." },
      { l: 2, q: "What is a closure?", o: ["A function that is never called", "A function that remembers variables from the scope where it was created", "A way to close a browser tab", "A finished promise"], a: 1, e: "e.g. a counter function keeps access to its count variable after the outer function returns." },
      { l: 3, q: "What does this print?", code: "for (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 0);\n}", o: ["0 1 2", "3 3 3", "undefined x3", "2 2 2"], a: 1, e: "var is shared by all callbacks and is 3 when they run; with let you'd get 0 1 2." },
      { l: 3, q: "What is the value of this inside a regular function called as obj.method()?", o: ["The global object always", "obj", "undefined always", "The function itself"], a: 1, e: "For regular functions, this is set by how they're called; arrow functions instead take this from the surrounding scope." },
    ]},
    typescript: { label: "TypeScript", q: [
      { l: 1, q: "What is TypeScript's main benefit?", o: ["Code runs faster in the browser", "Static types catch many errors at compile time", "It replaces HTML", "It removes the need for tests"], a: 1, e: "TypeScript compiles to JavaScript; types are checked during the build, not at runtime." },
      { l: 1, q: "What is the difference between any and unknown?", o: ["None", "unknown forces you to check the type before using it; any turns checking off", "any is safer", "unknown only works for strings"], a: 1, e: "Prefer unknown for values whose type you don't know yet." },
      { l: 2, q: "What does Partial<User> produce?", o: ["A User with all properties required", "A User type with every property optional", "Only the first property of User", "A read-only User"], a: 1, e: "Utility types: Partial, Required, Readonly, Pick, Omit, Record." },
      { l: 2, q: "When would you use an interface vs a type alias?", o: ["Interfaces can't describe objects", "Both describe object shapes; interfaces can be extended and merged, types can also express unions and mapped types", "Types are only for numbers", "Interfaces exist at runtime"], a: 1, e: "Neither exists at runtime; pick one convention per codebase." },
      { l: 3, q: "What is a discriminated union?", o: ["A union of numbers", "A union of object types that share a literal field (like kind) so TypeScript can narrow by checking it", "An enum", "A class hierarchy"], a: 1, e: "e.g. { kind: \"circle\"; r: number } | { kind: \"square\"; side: number } — switch on kind." },
      { l: 3, q: "What does a generic constraint like <T extends { id: string }> do?", o: ["Makes T optional", "Allows only types that have an id: string property", "Converts T to a string", "Nothing at compile time"], a: 1, e: "Constraints let you use known properties of T safely inside the function." },
    ]},
    angular: { label: "Angular", q: [
      { l: 1, q: "What is the main building block of an Angular UI?", o: ["Directive only", "Component (class + template + styles)", "Module only", "Service"], a: 1, e: "Components render views; services hold shared logic and data." },
      { l: 1, q: "What does dependency injection give an Angular component?", o: ["Faster rendering", "Its services, provided by Angular instead of being created with new", "A database connection", "CSS isolation"], a: 1, e: "e.g. constructor(private http: HttpClient) or inject(HttpClient)." },
      { l: 2, q: "What does ChangeDetectionStrategy.OnPush do?", o: ["Disables change detection", "Checks the component only when an input reference changes, an event fires in it, or an observable/signal it uses emits", "Runs change detection twice", "Only for forms"], a: 1, e: "OnPush cuts unnecessary checks; use immutable updates with it." },
      { l: 2, q: "Which lifecycle hook runs when an @Input value changes?", o: ["ngOnInit", "ngOnChanges", "ngAfterViewInit", "ngOnDestroy"], a: 1, e: "ngOnChanges receives a SimpleChanges object; ngOnInit runs once after the first changes." },
      { l: 3, q: "Why use switchMap for a search box that calls an API on every keystroke?", o: ["It runs all requests in parallel", "It cancels the previous request when a new value arrives, so stale results never show", "It caches results forever", "It retries failures"], a: 1, e: "Combine with debounceTime and distinctUntilChanged." },
      { l: 3, q: "What is the main advantage of Angular signals?", o: ["They replace HTTP calls", "Fine-grained reactivity: Angular knows exactly what depends on a value and updates only that", "They work without TypeScript", "They remove the need for components"], a: 1, e: "signal(), computed() and effect() — and they pave the way for zoneless change detection." },
    ]},
    react: { label: "React", q: [
      { l: 1, q: "What are props in React?", o: ["Internal state of a component", "Read-only inputs passed from parent to child", "CSS classes", "Global variables"], a: 1, e: "State belongs to a component; props come from its parent." },
      { l: 1, q: "Why do list items need a key prop?", o: ["For CSS", "So React can match items between renders and update only what changed", "Keys are optional decoration", "For accessibility"], a: 1, e: "Use stable IDs, not array indexes, when the list can reorder." },
      { l: 2, q: "When does a useEffect with an empty dependency array run?", o: ["On every render", "Once after the first render (and its cleanup on unmount)", "Never", "Before the first render"], a: 1, e: "Dependencies control when the effect re-runs." },
      { l: 2, q: "Why can calling setCount(count + 1) twice in one handler increase the count by only 1?", o: ["It's a React bug", "Both calls read the same count from that render; use setCount(c => c + 1)", "setState is synchronous", "Hooks can only be called once"], a: 1, e: "The updater form uses the latest queued value." },
      { l: 3, q: "What do useMemo and useCallback help with?", o: ["Fetching data", "Keeping the same value/function between renders so expensive work and child re-renders are avoided", "Routing", "Server-side rendering only"], a: 1, e: "Use them where profiling shows a real cost; they aren't free." },
      { l: 3, q: "What does React's reconciliation do?", o: ["Compiles JSX to WebAssembly", "Compares the new element tree with the previous one and applies the minimum DOM changes", "Validates props", "Bundles the app"], a: 1, e: "This is why keys and stable component types matter." },
    ]},
    "web-vitals": { label: "Web Vitals", q: [
      { l: 1, q: "What does LCP measure?", o: ["Time until the largest visible content element renders", "Total page size", "Number of requests", "Time to first click"], a: 0, e: "Good LCP is 2.5 s or less." },
      { l: 1, q: "What does CLS measure?", o: ["CPU load", "Unexpected layout shifts while the page is used", "Cache hit rate", "Click latency"], a: 1, e: "Reserve space for images and ads to keep CLS under 0.1." },
      { l: 2, q: "Which metric replaced FID as a Core Web Vital?", o: ["TTFB", "INP (Interaction to Next Paint)", "FCP", "TBT"], a: 1, e: "INP looks at responsiveness across all interactions; good is 200 ms or less." },
      { l: 2, q: "What is the most effective way to cut CLS from images?", o: ["Compress images more", "Set width and height (or aspect-ratio) so space is reserved", "Use PNG", "Lazy-load everything above the fold"], a: 1, e: "The browser can reserve the right space before the image loads." },
      { l: 3, q: "Lab tests show good scores but field data (CrUX) is poor. Why?", o: ["Lab data is always wrong", "Real users have slower devices and networks, and Google ranks on field data at the 75th percentile", "CrUX only measures desktop", "Field data ignores JavaScript"], a: 1, e: "Measure real users with the web-vitals library or RUM." },
      { l: 3, q: "Which change most directly improves INP?", o: ["Adding more images", "Breaking up long JavaScript tasks and doing less work in event handlers", "Increasing font size", "Using HTTP/1.1"], a: 1, e: "Yield to the main thread (e.g. scheduler.yield or setTimeout) and defer non-urgent work." },
    ]},
    java: { label: "Java", q: [
      { l: 1, q: "What is the difference between == and equals() for objects in Java?", o: ["No difference", "== compares references; equals() compares content (if overridden)", "equals() compares references", "== only works on Strings"], a: 1, e: "Always compare strings with equals()." },
      { l: 1, q: "Which collection keeps keys unique and gives fast lookup by key?", o: ["ArrayList", "HashMap", "LinkedList", "Stack"], a: 1, e: "HashMap gives O(1) average get and put." },
      { l: 2, q: "If you override equals(), what else must you override?", o: ["toString()", "hashCode()", "compareTo()", "finalize()"], a: 1, e: "Equal objects must have equal hash codes, or HashMap/HashSet break." },
      { l: 2, q: "What is the difference between checked and unchecked exceptions?", o: ["None", "Checked must be declared or handled at compile time; unchecked (RuntimeException) need not be", "Unchecked are faster", "Checked can't be caught"], a: 1, e: "e.g. IOException is checked; NullPointerException is unchecked." },
      { l: 3, q: "Why is ConcurrentHashMap preferred over Collections.synchronizedMap for many threads?", o: ["It allows null keys", "It uses fine-grained locking/CAS, so many threads read and write concurrently without one global lock", "It's sorted", "It's immutable"], a: 1, e: "synchronizedMap locks the whole map for every call." },
      { l: 3, q: "What does the volatile keyword guarantee?", o: ["Atomic increments", "Visibility: writes by one thread are seen by others, and reordering around it is limited", "Mutual exclusion", "Faster reads"], a: 1, e: "count++ on a volatile int is still not atomic — use AtomicInteger." },
    ]},
    spring: { label: "Spring Boot", q: [
      { l: 1, q: "What does @RestController combine?", o: ["@Service and @Repository", "@Controller and @ResponseBody", "@Component and @Bean", "@Configuration and @Bean"], a: 1, e: "Return values are written to the response body (usually JSON)." },
      { l: 1, q: "Which is the recommended way to inject dependencies?", o: ["Field injection with @Autowired", "Constructor injection", "Static fields", "new keyword inside the class"], a: 1, e: "Constructor injection makes dependencies explicit, final and easy to test." },
      { l: 2, q: "What does Spring Boot auto-configuration do?", o: ["Writes your business logic", "Creates beans automatically based on the libraries on the classpath and your properties", "Generates the database", "Deploys to the cloud"], a: 1, e: "e.g. adding spring-boot-starter-data-jpa plus a datasource configures JPA for you." },
      { l: 2, q: "A @Transactional method is called from another method in the same class. What happens?", o: ["Works normally", "The transaction does not start, because the call bypasses the Spring proxy", "It throws an exception", "It runs twice"], a: 1, e: "Self-invocation skips the proxy; move the method to another bean." },
      { l: 3, q: "By default, which exceptions cause @Transactional to roll back?", o: ["All exceptions", "Unchecked (RuntimeException) and Error only", "Checked only", "None"], a: 1, e: "Use rollbackFor = Exception.class to include checked exceptions." },
      { l: 3, q: "What is the N+1 query problem in JPA and a common fix?", o: ["Too many indexes; drop some", "Loading a list then one extra query per item for a relation; fix with JOIN FETCH or @EntityGraph", "Two databases; merge them", "Slow inserts; use batch size 1"], a: 1, e: "Turn on SQL logging in development to spot it." },
    ]},
    "rest-api": { label: "REST API", q: [
      { l: 1, q: "Which HTTP method should be used to read data?", o: ["POST", "GET", "PUT", "DELETE"], a: 1, e: "GET is safe and idempotent." },
      { l: 1, q: "Which status code means the request was valid but the user isn't allowed to do it?", o: ["401", "403", "404", "500"], a: 1, e: "401 = not authenticated; 403 = authenticated but forbidden." },
      { l: 2, q: "Which HTTP methods are idempotent?", o: ["POST and PATCH", "GET, PUT and DELETE", "Only GET", "All of them"], a: 1, e: "Repeating them leaves the same result; POST needs an idempotency key to be retry-safe." },
      { l: 2, q: "Which status code fits a successful create with POST?", o: ["200", "201 Created", "204", "302"], a: 1, e: "Return 201 with a Location header pointing to the new resource." },
      { l: 3, q: "Why prefer cursor pagination over offset for a large, changing feed?", o: ["It allows jumping to page 500", "It stays fast at any depth and doesn't skip or repeat items when rows are added", "It needs no index", "It's required by HTTP"], a: 1, e: "Offset pagination scans and discards rows, and shifts when data changes." },
      { l: 3, q: "What does an ETag with If-None-Match enable?", o: ["Authentication", "Conditional requests: the server returns 304 Not Modified if nothing changed", "Rate limiting", "Compression"], a: 1, e: "Saves bandwidth; clients reuse their cached copy." },
    ]},
    sql: { label: "SQL", q: [
      { l: 1, q: "Which JOIN returns all rows from the left table, with NULLs where there's no match?", o: ["INNER JOIN", "LEFT JOIN", "CROSS JOIN", "SELF JOIN"], a: 1, e: "INNER JOIN keeps only matching rows." },
      { l: 1, q: "What is the difference between WHERE and HAVING?", o: ["None", "WHERE filters rows before grouping; HAVING filters groups after GROUP BY", "HAVING is faster", "WHERE only works with numbers"], a: 1, e: "e.g. HAVING COUNT(*) > 5." },
      { l: 2, q: "What does COUNT(column) count, compared with COUNT(*)?", o: ["The same", "COUNT(column) skips NULLs; COUNT(*) counts all rows", "COUNT(*) skips NULLs", "COUNT(column) counts distinct values"], a: 1, e: "COUNT(DISTINCT column) counts unique non-NULL values." },
      { l: 2, q: "Which query finds the second-highest salary most robustly?", o: ["SELECT MAX(salary) FROM emp", "Use DENSE_RANK() OVER (ORDER BY salary DESC) and pick rank 2", "SELECT salary FROM emp LIMIT 2", "ORDER BY salary"], a: 1, e: "DENSE_RANK handles ties; window functions are common interview topics." },
      { l: 3, q: "A query filters with WHERE YEAR(created_at) = 2026 and ignores the index on created_at. Why?", o: ["Indexes don't work on dates", "Wrapping the column in a function prevents index use; use a range: created_at >= '2026-01-01' AND < '2027-01-01'", "YEAR() is not SQL", "The index is too new"], a: 1, e: "Keep indexed columns bare in conditions (sargable queries)." },
      { l: 3, q: "Which transaction isolation level prevents dirty reads but still allows non-repeatable reads?", o: ["Read uncommitted", "Read committed", "Repeatable read", "Serializable"], a: 1, e: "Read committed is the default in PostgreSQL and Oracle; MySQL InnoDB defaults to repeatable read." },
    ]},
  };
  root.ROLE_TEST_TOPICS_A = topics;
  if (typeof module !== "undefined" && module.exports) module.exports = topics;
})(typeof window !== "undefined" ? window : globalThis);
