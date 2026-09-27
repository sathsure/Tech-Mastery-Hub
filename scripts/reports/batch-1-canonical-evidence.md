# Batch 1 Canonical Evidence

Generated from existing repository source material. No learning files modified.

## HTML

### interview\architecture\01-web-vitals.md
```html
```html
<!-- Avoid inserting DOM above existing content dynamically -->
```html
```html
- **SSR:** HTML is rendered on the server â†’ **faster first paint/TTFB**, better SEO, but more server load and possible slower navigation if not hydrated well.
import { renderToString } from "react-dom/server";
const html = renderToString(<App />);
<!DOCTYPE html>
<html>
<div id="root">${html}</div>
</html>
```html

### interview\architecture\02-aws-cloud.md
| **Amazon Route 53**              | Highly available DNS (Domain Name System) service. Routes users to applications using domain names and routing policies                             |

### interview\backend\java\01-Java-1.md
| Random access (`get(i)`) | âœ… Very fast because index is directly calculated    | âŒ Slow because it must traverse from start/end    |
Supplier<Double> random =
() -> Math.random();
System.out.println(random.get());

### interview\backend\java\01-Java-2.md
This made code hard to read, error-prone, and noisy, especially for JSON, SQL, HTML, or XML.
| `RandomAccess`                     | Optimizes list access       |

### interview\backend\java\02-REST-Api.md
Wrap technical exceptions into meaningful domain exceptions.
- Semantically incorrect

### interview\backend\java\03-Spring-1.md
- Not HTML-friendly
- **Server-side HTML rendering**
```html
> Thymeleaf is a server-side template engine used to render dynamic HTML in Spring Boot.

### interview\backend\java\06-Spring-Cloud.md
> We chose microservices to align system boundaries with business domains, enable independent deployments, and allow teams to scale autonomously.
> **If logic belongs to a domain, it does NOT belong in Gateway.**
âœ” One service â†’ One domain
- Use **Domain-Driven Design (DDD)**
- Random

### interview\backend\java\08-Architecture.md
First, Iâ€™d check if the table is rendering too many DOM elements. Iâ€™d use `cdk-virtual-scroll-viewport` and make sure `trackBy` is used in `*ngFor` to reduce DOM updates.
Iâ€™d rely on Angularâ€™s built-in `XSS protection` and avoid using `innerHTML`. If needed, Iâ€™d carefully use `DomSanitizer`.

### interview\backend\node\01-Node.js.md
- You need random access to bytes

### interview\backend\node\06-Node-security.md
element.innerHTML = userInput;
Salting adds a unique random value per password to prevent rainbow table attacks.

### interview\frontend\01-HTML.md
# 🌐 HTML Interview Preparation
When a browser receives HTML from a server, it **does not immediately show it on the screen**.
1. **HTML Parsing** — Browser reads HTML top to bottom and converts it into a tree-like structure called the **DOM (Document Object Model)**.
3. **Render Tree Creation** — DOM + CSSOM are merged. Invisible elements (`display: none`) are excluded.
HTML → DOM
DOM + CSSOM → Render Tree → Layout → Paint → Composite
HTML → DOM
> - **JS is parser-blocking** by default. A `<script>` tag pauses HTML parsing until it loads and runs.
## 🏷️ Part 2 — Semantic HTML & Structure
### ❓ What does "semantic HTML" mean?
Semantic HTML means **using HTML tags that describe the meaning of content**, not just how it looks.
The browser, search engines, and screen readers rely on semantics to understand **structure and intent**.
❌ **Non-semantic**
```html
✅ **Semantic**
```html
**Common semantic elements**
<img src="../../assets/semantic.png" alt="Semantic Image" width="500" />
🧠 **Why semantics matter**
Both are **non-semantic** elements, but they differ in **display behavior**.
```html
```html
| `<div>`     | Generic, **non-semantic** wrapper used for styling or layout only |
```html
`data-*` attributes let you attach **custom data** to HTML elements without affecting layout or semantics.
```html
- Clean separation of HTML & JS
```html
| Type   | HTML Parsing | Execution Timing | Order Preserved? |
| defer  | Continues    | After DOM is parsed (`DOMContentLoaded`) | ✅ Yes |
> - `defer` → for scripts that depend on DOM (most cases)
| `preconnect`  | Open early connection (DNS + TCP + TLS) to a domain | Third-party origins (CDN, fonts) |
```html
## ♿ Part 4 — Accessibility (a11y)
### ❓ How do you approach accessibility (a11y) in HTML, and what does it mean to you in practice?
Accessibility ensures websites are usable by everyone, including:
**Key HTML practices**
- Use semantic tags (`<button>`, `<nav>`, `<main>`)
```html
> 📌 Accessibility is **not optional** — it's a legal requirement in many countries (ADA, EAA, AODA).
**ARIA (Accessible Rich Internet Applications)** adds **extra meaning** when HTML alone isn't enough.
```html
| `role`          | Define element semantics                  |
> ⚠️ **Golden Rule**: **Semantic HTML first, ARIA second.** Misusing ARIA can make accessibility _worse_.
## 🧬 Part 5 — DOM, Performance & Modern Features
### ❓ Difference between DOM and Virtual DOM?
| DOM             | Virtual DOM     |
🧠 Virtual DOM minimizes costly DOM operations by computing a minimal diff in memory and applying it in one batch.
> 💡 Modern frameworks like Svelte and Solid skip the Virtual DOM entirely and compile to direct DOM updates — sometimes even faster.
Web Components allow you to create **custom HTML elements** with isolated styles and behavior — built into the browser, **no framework required**.
class MyCard extends HTMLElement {
this.shadowRoot.innerHTML = `<style>p { color: red; }</style><p>Hello</p>`;
```html
1. **Custom Elements** — define new HTML tags
2. **Shadow DOM** — encapsulated styles/markup
3. **HTML Templates** — reusable markup with `<template>`
**`<template>`** holds inert HTML that is **not rendered** until cloned via JavaScript.
```html
### ❓ How does HTML structure impact SEO?
Search engines analyze **HTML structure**, not visuals.
- Semantic tags (`<main>`, `<article>`, `<nav>`)
```html
```html
<meta name="description" content="A page about HTML interview prep" />
### ❓ Is ARIA better than semantic HTML?
- Native HTML is always preferred
- ARIA overrides default semantics
```html
> ⚠️ **Golden rule**: _"Use ARIA only when HTML can't do the job."_
### ❓ Does HTML support multithreading?
- HTML parsing is **single-threaded** (main thread)
### ❓ Why does broken HTML still work?
Because HTML is **fault-tolerant by design**.
```html
- Maintains valid DOM structure
### ❓ Does `display: none` remove an element from the DOM?
- Element stays in the DOM
- Removed from layout and accessibility tree
### ❓ We're getting complaints that the page feels slow, but the HTML is pretty small. Where would you start debugging?
- Excessive DOM nesting (deep trees slow down layout)

### interview\frontend\02-CSS.md
### ❓ In simple terms, what is CSS and how does it relate to HTML?
- HTML defines _structure_
```html
```html
```html
It is **not** random, **not** based on order, and **not** about selector length. It is a **priority system**.
> ⚠️ **Use only for**: utility classes, accessibility overrides, or fighting third-party CSS as a last resort.
| `rem` | Root font-size   | Relative to `<html>`           |
> 📌 **Common trap**: `absolute` looks for the nearest **positioned** ancestor (`relative`, `absolute`, `fixed`, `sticky`). If none exists, it positions relative to the `<html>` element.
- **Inheritable** through the DOM
| `:root`  | `<html>` element | CSS variables, `rem` base |
- Shadow DOM encapsulation
```html
```html
```html

### interview\frontend\03-JavaScript.md
- `setTimeout`, `setInterval`, HTTP, DOM events, file I/O
- DOM events

### interview\frontend\05-Angular-1.md
```html
Set DOM/component properties.
```html
```html
```html
this.valueChange.emit((event.target as HTMLInputElement).value);
```html
```html
```html
#### ↳ **Follow-up:** Which directive manipulates DOM structure?
`ViewEncapsulation` controls **how component styles are scoped and applied to the DOM**.
Angular **simulates** Shadow DOM by adding generated attributes.
❌ Not real Shadow DOM
#### 3️⃣ ShadowDom
Uses **real browser Shadow DOM**.
| ShadowDom     | ❌ No     |
**↳ Can `::ng-deep` override ShadowDom styles?**
↪ ❌ **No, never.** ShadowDom is enforced by the **browser**. Angular cannot bypass browser isolation.
**↳ Does `!important` or global CSS override ShadowDom?**
**↳ What ARE the ways to style a ShadowDom component from outside?**
| Works with ShadowDom        | ❌     |
| `ngAfterViewInit`       | Once after view + child views initialized   | Access DOM via `@ViewChild`         |
templateUrl: "./child.component.html",
// ✅ Safe DOM access for component template + child views
**`child.component.html`**
```html
**`parent.component.html`**
```html
> - Do DOM access only in `ngAfterViewInit` (view is fully initialized)
Both are **structural directives** — they manipulate the DOM by adding/removing elements.
```html
**Without `trackBy`**, Angular tracks items by **object identity**. When the array reference changes (e.g., after API call), Angular destroys ALL DOM nodes and recreates them.
**With `trackBy`**, Angular uses a **stable identifier** to know which items truly changed and reuses unchanged DOM nodes.
```html
| DOM behavior     | Add/remove single view          | Create one view per item |
Attribute directives modify an element's appearance or behavior — they don't change the DOM structure.
```html
> 💡 **Use `Renderer2` over `ElementRef.nativeElement`** for safe, platform-independent DOM access (works in SSR, Web Workers).
```html
# 👁️ Part 6 — View & DOM Interaction
`@ViewChild` lets a component directly access something in its **own template** — a DOM element, child component, or directive.
emailInput!: ElementRef<HTMLInputElement>;
nameInput!: ElementRef<HTMLInputElement>;
### ❓ Why is direct DOM manipulation via `ElementRef` discouraged? Use `Renderer2` instead?
- ❌ Tightly coupled to browser DOM
> 💡 Renderer2 is an **abstraction layer** — Angular decides how/where DOM updates happen, keeping the app secure and platform-independent.
```html
```html
```html
```html
export class LoggerService { id = Math.random(); }
| Source of truth     | Template (HTML)           | Component class (TS)        |
| Testing             | Hard (DOM-dependent)      | Easy (pure TS)              |
```html
this.value = (event.target as HTMLInputElement).value;
```html

### interview\frontend\05-Angular-2.md
Angular's change detection is the process by which the framework figures out **what changed in your data** and **updates the DOM accordingly**. The mechanism has evolved significantly — from AngularJS's "dirty checking with digest cycles" to today's **Zone-based detection** and the newer **Signal-based reactivity**.
| DOM Events | `click`, `input`, `submit` |
DOM reflects the changes
Source (.ts + .html) ──► Ivy Compiler ──► Pure JS ──► esbuild ──► Final bundles
> 📌 **Important:** Ivy understands Angular and templates; esbuild does **not** understand decorators. By the time esbuild runs, the HTML/decorators are gone — replaced by pure JS instructions.

### interview\frontend\06-React.md
- React builds a virtual DOM tree.
- Bad keys: array index, random values (because they change or donâ€™t reflect item identity).
- `useEffect` runs side-effects after render (API calls, subscriptions, DOM, timers).
- `useLayoutEffect` runs synchronously after DOM mutation but before paint (blocks painting).
- Use `useLayoutEffect` only when you must measure DOM or avoid flicker.
const root = ReactDOM.createRoot(document.getElementById("root"));
- Server renders React components to HTML.
- Client hydrates that HTML with event listeners.
- Tools: Next.js, Remix, or `react-dom/server` directly.
import { renderToString } from "react-dom/server";
const html = renderToString(<App />);
res.send(`<!doctype html><div id="root">${html}</div>`);
- Hydration attaches event listeners to existing server-rendered HTML.
- Problems when server-rendered markup doesnâ€™t match client render (different data, random IDs, time-based values).
- Uncontrolled: DOM holds value; use refs to read it.
- `forwardRef` lets a component pass a ref to a child DOM node or another component.
- Avoid heavy DOM for off-screen items.
### â“ How do you ensure accessibility (a11y) in React apps?
- Use semantic HTML (`<button>`, `<nav>`, `<header>`).
### â“ Whatâ€™s the difference between `ReactDOM.render` and `createRoot`?
- `ReactDOM.render` is legacy (React 17).
import { createRoot } from "react-dom/client";
- Feature-based folder structure (by domain, not by type).
import ReactDOM from "react-dom";
return ReactDOM.createPortal(
- Apply class on `html/body`.
- Never inject unsanitized HTML.
- Avoid `dangerouslySetInnerHTML` unless content is sanitized.
// Dangerous: ensure `sanitizedHtml` is sanitized
<div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />;

### interview\frontend\06-RxJS.md
const cold$ = of(Math.random());
Examples: DOM events (`fromEvent`), WebSocket streams, Subjects.
```html
```html

### interview\frontend\09-Web_Architecture.md
| **XSS** | Angular auto-escapes HTML in templates (`{{ }}`); avoid `innerHTML` and `bypassSecurityTrust*` unless absolutely needed |
│  Services      (business logic) │  → Domain rules, workflows

### knowledge\concepts\database\sql\README.md
1. **Parser** — validates syntax and semantics and checks whether referenced tables and columns exist.
- [SQL Masterclass](../../../masterclasses/SQL_MasterClass.html)

### knowledge\concepts\javascript\README.md
The repository material covers synchronous execution, Promise callbacks, `async`/`await`, timers, HTTP and DOM-related asynchronous work, `queueMicrotask`, Node.js `process.nextTick`, and `setImmediate.
The source material covers limitations of JSON based cloning: functions are not preserved,  undefined values can be lost, dates become strings, and circular references are not supported. `structuredClone` can handle values such as dates, maps, sets, and typed arrays but does not clone functions or DOM nodes.

### knowledge\concepts\README.md
knowledge/concepts/<domain>/<concept>/README.md

### knowledge\concepts\_canonical-candidates.md
| **HTML** | `interview\frontend\01-HTML.md; knowledge\masterclasses\SQL_MasterClass.html` | Core web-development concept |
| **SQL** | `interview\backend\java\08-MySQL.md; knowledge\concepts\sql\joins\README.md; knowledge\masterclasses\SQL_MasterClass.html; knowledge\visual-notes\backend\sql-joins.png; knowledge\visual-notes\sql\SQL_Query_1.jpeg; knowledge\visual-notes\sql\SQL_Query_10.jpeg; knowledge\visual-notes\sql\SQL_Query_11.jpeg; knowledge\visual-notes\sql\SQL_Query_2.jpeg; knowledge\visual-notes\sql\SQL_Query_3.jpeg; knowledge\visual-notes\sql\SQL_Query_4.jpeg; knowledge\visual-notes\sql\SQL_Query_5.jpeg; knowledge\visual-notes\sql\SQL_Query_6.jpeg; knowledge\visual-notes\sql\SQL_Query_7.jpeg; knowledge\visual-notes\sql\SQL_Query_8.jpeg; knowledge\visual-notes\sql\SQL_Query_9.jpeg; practice\coding\sql\02-MySQL-coding.md` | Database knowledge concept |
4. HTML

### knowledge\masterclasses\SQL_MasterClass.html
<!DOCTYPE html>
<html lang="en">
/* Custom HTML/CSS Diagrams (To replace broken web images) */
<li><strong>1. The Parser:</strong> Validates syntax (spelling) and semantics (checks the data dictionary to ensure tables/columns actually exist).</li>
</html>

### practice\coding\01-javascript-coding.md
Handles dates, maps, sets, arrays, typed arrays, regex, **but NOT functions or DOM nodes**.

### practice\coding\02-css-coding.md
```html
```html
```html
```html
```html

### practice\coding\03-angular-coding.md
templateUrl: "./user-list.component.html",
**user-list.component.html**
```html
templateUrl: "./user-form.component.html",
**user-form.component.html**
```html
templateUrl: "./user-dialog.component.html",
**user-dialog.component.html**
```html
templateUrl: "./user-details.component.html",
**user-details.component.html**
```html
**app.component.html**
```html
```html
| `trackBy` in `*ngFor` | Performance — avoid DOM re-renders |
const value = (event.target as HTMLInputElement).value;

### roadmap\architecture\README.md
- Accessibility Audits

### roadmap\foundations\README.backup.md
- HTML
- DOM and BOM

### roadmap\frontend\README.backup.md
- Accessibility

### scripts\reports\canonical-topic-map.md
**Important:** This report is a mapping aid, not a claim that every detected relationship is semantically complete.
| HTML | â€” | knowledge\masterclasses\SQL_MasterClass.html | interview\frontend\01-HTML.md; interview\frontend\02-CSS.md | â€” | â€” |
| Java | â€” | knowledge\masterclasses\SQL_MasterClass.html | interview\backend\java\01-Java-1.md; interview\backend\java\01-Java-2.md; interview\backend\java\02-REST-Api.md; interview\backend\java\03-Spring-1.md; interview\backend\java\03-Spring-2.md; interview\backend\java\04-Spring-annotation.md; interview\backend\java\05-Spring-Security.md; interview\backend\java\06-Spring-Cloud.md; interview\backend\java\08-Architecture.md; interview\backend\java\08-MySQL.md; interview\frontend\03-JavaScript.md | practice\coding\01-javascript-coding.md; practice\coding\02-css-coding.md; practice\coding\java\01-core-java-coding.md; practice\coding\java\01-Java-coding.md | knowledge\visual-notes\backend\java-collections.png |
| SQL | â€” | knowledge\concepts\sql\joins\README.md; knowledge\masterclasses\SQL_MasterClass.html | interview\backend\java\08-Architecture.md; interview\backend\java\08-MySQL.md | practice\coding\sql\02-MySQL-coding.md | knowledge\visual-notes\backend\sql-joins.png; knowledge\visual-notes\sql\SQL_Query_1.jpeg; knowledge\visual-notes\sql\SQL_Query_10.jpeg; knowledge\visual-notes\sql\SQL_Query_11.jpeg; knowledge\visual-notes\sql\SQL_Query_2.jpeg; knowledge\visual-notes\sql\SQL_Query_3.jpeg; knowledge\visual-notes\sql\SQL_Query_4.jpeg; knowledge\visual-notes\sql\SQL_Query_5.jpeg; knowledge\visual-notes\sql\SQL_Query_6.jpeg; knowledge\visual-notes\sql\SQL_Query_7.jpeg; knowledge\visual-notes\sql\SQL_Query_8.jpeg; knowledge\visual-notes\sql\SQL_Query_9.jpeg |
- **HTML** â€” missing: Roadmap, Practice

### scripts\reports\content-inventory.md
| HTML files |  |
| interview | `interview\frontend\01-HTML.md` | MD | ðŸŒ HTML Interview Preparation | 2307 | ðŸ§± Part 1 â€” Browser Internals & Rendering; ðŸ·ï¸ Part 2 â€” Semantic HTML & Structure; ðŸ§© Part 3 â€” Attributes & Data; â™¿ Part 4 â€” Accessibility (a11y); ðŸ§¬ Part 5 â€” DOM, Performance & Modern Features; ðŸ” Part 6 â€” SEO | â“ How does a browser render a webpage?; ðŸ“ Answer; ðŸ“ Answer; â“ What does "semantic HTML" mean?; ðŸ“ Answer; â“ Difference between `<div>` and `<span>`?; ðŸ“ Answer; â“ Difference between `id` and `class`?; ðŸ“ Answer; â“ Difference between `<section>`, `<article>`, and `<div>`?; ðŸ“ Answer; â“ What are `data-*` attributes?; ðŸ“ Answer; â“ Difference between `<script>`, `async`, and `defer`?; ðŸ“ Answer; â“ How would you explain the difference between preload, prefetch, and preconnect â€” and when would you reach for each?; ðŸ“ Answer; â“ How do you approach accessibility (a11y) in HTML, and what does it mean to you in practice?; ðŸ“ Answer; ðŸ“ Answer; â“ Difference between DOM and Virtual DOM?; ðŸ“ Answer; â“ What are Web Components?; ðŸ“ Answer; ðŸ“ Answer; â“ How does HTML structure impact SEO?; ðŸ“ Answer; ðŸ“ Answer; â“ Is ARIA better than semantic HTML?; ðŸ“ Answer; â“ Does HTML support multithreading?; ðŸ“ Answer; â“ Why does broken HTML still work?; ðŸ“ Answer; â“ Does `display: none` remove an element from the DOM?; ðŸ“ Answer; â“ We're getting complaints that the page feels slow, but the HTML is pretty small. Where would you start debugging?; ðŸ“ Answer; â“ A QA engineer filed a bug â€” screen reader users are hearing content in the wrong order. How would you investigate that?; ðŸ“ Answer; â“ Our mobile users are seeing a broken layout, but everything looks fine on desktop. What would you look for?; ðŸ“ Answer; â“ A user reported they can't operate our form using only the keyboard â€” the buttons aren't responding. What could be causing that?; ðŸ“ Answer; â“ After a major redesign, our SEO rankings dropped significantly. What HTML-related things would you investigate?; ðŸ“ Answer; â“ After a dynamic DOM update, click handlers on some elements stop working. Why does this happen and how would you fix it?; ðŸ“ Answer; â“ Our page scores poorly on CLS in Lighthouse. Walk me through how you'd reduce it.; ðŸ“ Answer |
| interview | `interview\frontend\02-CSS.md` | MD | ðŸŽ¨ CSS Interview Preparation | 2965 |  | â“ In simple terms, what is CSS and how does it relate to HTML?; ðŸ“ Answer; â“ How does the browser decide which styles to apply?; ðŸ“ Answer; â“ How do inline, internal, and external styles differ?; ðŸ“ Answer; â“ What are CSS selectors and what types are available?; ðŸ“ Answer; â“ Descendant vs child selectors; ðŸ“ Answer; â“ What are pseudo-classes vs pseudo-elements?; ðŸ“ Answer; â“ Can you walk me through CSS specificity and how it affects style resolution?; ðŸ“ Answer; ðŸ“ Answer; â“ How does the CSS box model work?; ðŸ“ Answer; â“ Difference between `content-box` and `border-box`?; ðŸ“ Answer; â“ What are the different CSS display types?; ðŸ“ Answer; ðŸ“ Answer; ðŸ“ Answer; â“ How do CSS units differ?; ðŸ“ Answer; â“ Why is `100vh` tricky on mobile?; ðŸ“ Answer; â“ What CSS position types exist?; ðŸ“ Answer; â“ How does the `inset` shorthand work in CSS and what problem does it solve?; ðŸ“ Answer; â“ What problem does Flexbox solve?; ðŸ“ Answer; ðŸ“ Answer; ðŸ“ Answer; ðŸ“ Answer; â“ How does CSS Grid work, and how is it different from Flexbox?; ðŸ“ Answer; ðŸ“ Answer; â“ What are logical properties and why prefer them over physical ones?; ðŸ“ Answer; â“ What are CSS Custom Properties (Variables)?; ðŸ“ Answer; â“ What are container queries?; ðŸ“ Answer; â“ Can you explain the `:has()` selector and give a real-world example of where you'd use it?; ðŸ“ Answer; â“ What's the difference between `*`, `:root`, and `body`?; ðŸ“ Answer; â“ Why do some animations feel janky?; ðŸ“ Answer; â“ Why styles sometimes don't apply?; ðŸ“ Answer; â“ Why is `z-index` not working?; ðŸ“ Answer; â“ Why doesn't `text-overflow: ellipsis` work?; ðŸ“ Answer; â“ Why does `position: sticky` fail?; ðŸ“ Answer; â“ Why does margin collapse happen?; ðŸ“ Answer; â“ Why do inline elements ignore width and height?; ðŸ“ Answer; â“ Why does `flex: 1` ignore width?; ðŸ“ Answer; â“ Why is `!important` not working here?; ðŸ“ Answer; â“ Why does this child selector not match?; ðŸ“ Answer; â“ Why does `overflow: hidden` break dropdowns?; ðŸ“ Answer; â“ Why does absolute positioning break layout height?; ðŸ“ Answer; â“ Why does Grid overflow unexpectedly?; ðŸ“ Answer; â“ Why does `:hover` not work on mobile?; ðŸ“ Answer; â“ How would you build a sticky header inside a scroll container?; ðŸ“ Answer |
| interview | `interview\frontend\05-Angular-1.md` | MD | ðŸ…°ï¸ Angular Interview Preparation â€” Part 1 | 3621 |  | â“ How would you describe Angular to someone coming from AngularJS â€” what are the fundamental differences?; ðŸ“ Answer; â“ What types of data binding does Angular support?; ðŸ“ Answer; â“ Can you walk me through the difference between Components and Directives in Angular?; ðŸ“ Answer; â“ Can you explain ViewEncapsulation in Angular and the trade-offs between the available modes?; ðŸ“ Answer; â“ When would you use `::ng-deep` in Angular, and what are the risks of relying on it?; ðŸ“ Answer; â“ What are Angular lifecycle hooks?; ðŸ“ Answer; ðŸ“ Answer; â“ How do `*ngIf` and `*ngFor` work conceptually?; ðŸ“ Answer; ðŸ“ Answer; â“ How do attribute directives work internally?; ðŸ“ Answer; â“ What are the new control flow blocks `@if`, `@for`, `@switch`?; ðŸ“ Answer; â“ How do Standalone Components differ from NgModules?; ðŸ“ Answer; â“ How does `@ViewChild` work, and when would you use it over other approaches to access child elements?; ðŸ“ Answer; â“ Why is direct DOM manipulation via `ElementRef` discouraged? Use `Renderer2` instead?; ðŸ“ Answer; â“ What are Angular pipes? Pure vs Impure?; ðŸ“ Answer; ðŸ“ Answer; ðŸ“ Answer; ðŸ“ Answer; ðŸ“ Answer; ðŸ“ Answer; â“ How does Angular's DI system and hierarchy work?; ðŸ“ Answer; ðŸ“ Answer; ðŸ“ Answer; ðŸ“ Answer; ðŸ“ Answer; â“ What are the core concepts of Angular routing?; ðŸ“ Answer; ðŸ“ Answer; ðŸ“ Answer; ðŸ“ Answer; ðŸ“ Answer; â“ Differences between Template-driven and Reactive forms?; ðŸ“ Answer; â“ What happens when you mix `[(ngModel)]` with Reactive Forms?; ðŸ“ Answer; â“ How do you create a custom form control in Angular? (`ControlValueAccessor`); ðŸ“ Answer; â“ How would you globally trim leading and trailing spaces from user input?; ðŸ“ Answer; â“ What are Signals in Angular?; ðŸ“ Answer |
| interview | `interview\frontend\06-React.md` | MD |  | 2267 |  | â“ What are the main differences between React class components and function components?; ðŸ“ Answer; â“ Explain React Hooks rules. What happens if you break them?; ðŸ“ Answer; â“ How does Reactâ€™s reconciliation (diffing) algorithm work?; ðŸ“ Answer; â“ Why are keys important in lists? What are bad keys?; ðŸ“ Answer; â“ What is `useEffect` and common pitfalls?; ðŸ“ Answer; â“ Whatâ€™s the difference between `useEffect` and `useLayoutEffect`?; ðŸ“ Answer; â“ Explain `useMemo` and `useCallback`. When to use them?; ðŸ“ Answer; â“ What is Reactâ€™s Strict Mode and why might effects run twice in dev?; ðŸ“ Answer; â“ Explain React 18 concurrent rendering in simple terms.; ðŸ“ Answer; â“ What is `Suspense` and how is it used?; ðŸ“ Answer; â“ How does server-side rendering (SSR) work with React?; ðŸ“ Answer; â“ What is hydration and what can go wrong?; ðŸ“ Answer; â“ How do you manage global state in a large React app?; ðŸ“ Answer; â“ What are common performance optimization techniques in React?; ðŸ“ Answer; â“ Explain controlled vs uncontrolled components in forms.; ðŸ“ Answer; â“ How do you handle errors in React components?; ðŸ“ Answer; â“ How do you test React components?; ðŸ“ Answer; â“ What are custom hooks and why use them?; ðŸ“ Answer; â“ How do you handle authentication flows in React?; ðŸ“ Answer; â“ How to avoid prop drilling?; ðŸ“ Answer; â“ Explain â€œlifting state upâ€ with an example.; ðŸ“ Answer; â“ What is `React.forwardRef` and when to use it?; ðŸ“ Answer; â“ What is the difference between `useRef` and `useState`?; ðŸ“ Answer; â“ How do you handle large lists efficiently in React?; ðŸ“ Answer; â“ How do you ensure accessibility (a11y) in React apps?; ðŸ“ Answer; â“ How do you prevent unnecessary re-renders in child components?; ðŸ“ Answer; â“ Whatâ€™s the difference between `ReactDOM.render` and `createRoot`?; ðŸ“ Answer; â“ How do you organize a large-scale React project?; ðŸ“ Answer; â“ How do you handle side effects like API calls in React?; ðŸ“ Answer; â“ Explain a â€œtrickâ€ question: Why doesnâ€™t this state update immediately?; ðŸ“ Answer; â“ Trick: Whatâ€™s wrong with this effect?; ðŸ“ Answer; â“ Trick: Why is this component re-rendering even with `React.memo`?; ðŸ“ Answer; â“ How do you type React components and hooks with TypeScript?; ðŸ“ Answer; â“ How do you implement code-splitting in React?; ðŸ“ Answer; â“ How do you debounce or throttle events in React?; ðŸ“ Answer; â“ How do you make a reusable modal component in React?; ðŸ“ Answer; â“ How do you implement dark/light theme toggling?; ðŸ“ Answer; â“ How do you handle file uploads in React?; ðŸ“ Answer; â“ How do you secure a React app against XSS?; ðŸ“ Answer; â“ How do you debug React performance issues?; ðŸ“ Answer |
| knowledge | `knowledge\masterclasses\SQL_MasterClass.html` | HTML | SQL Masterclass | 3868 |  |  |

### scripts\reports\javascript-canonical-evidence.md
- `setTimeout`, `setInterval`, HTTP, DOM events, file I/O
- DOM events
Handles dates, maps, sets, arrays, typed arrays, regex, **but NOT functions or DOM nodes**.

### scripts\reports\sql-canonical-evidence.md
## knowledge\masterclasses\SQL_MasterClass.html
<!DOCTYPE html>
<html lang="en">
/* Custom HTML/CSS Diagrams (To replace broken web images) */
<li><strong>1. The Parser:</strong> Validates syntax (spelling) and semantics (checks the data dictionary to ensure tables/columns actually exist).</li>
</html>
- [SQL Masterclass](../../masterclasses/SQL_MasterClass.html)
- `knowledge/masterclasses/SQL_MasterClass.html`

### scripts\reports\sql-masterclass-structure.md
Source: `knowledge/masterclasses/SQL_MasterClass.html`
## HTML Headings
- HTML size: 37358 characters


## CSS

### interview\architecture\01-web-vitals.md
Serve **properly sized, compressed, next-gen** images (WebP/AVIF), use **responsive `<img srcset>`**, lazy-load below-the-fold images, and use CDNs.
(responsive + modern formats)

### interview\backend\node\01-Node.js.md
- This allows Node.js to remain responsive even under heavy load.
- All CPU-intensive computation happens inside the worker thread, keeping the main thread free and responsive.
- Keeping the application responsive
This prevents unbounded memory growth and keeps the event loop responsive.

### interview\frontend\01-HTML.md
2. **CSS Parsing** — CSS files are parsed into another tree called the **CSSOM**, which determines styles like colors, fonts, and layout.
3. **Render Tree Creation** — DOM + CSSOM are merged. Invisible elements (`display: none`) are excluded.
4. **Layout (Reflow)** — Browser calculates **exact position and size** of each element based on viewport, fonts, and flex/grid rules.
CSS  → CSSOM
DOM + CSSOM → Render Tree → Layout → Paint → Composite
CSS  → CSSOM   (BLOCKS rendering)
> - **CSS is render-blocking** by default. The browser will not paint anything until all CSS is parsed.
- Inline critical CSS (above-the-fold styles)
| CSS Selector | `#id`   | `.class`            |
const btn = document.querySelector('button');
- Test selectors (`data-testid`)
| `preload`     | Download a critical resource early, high priority  | Hero image, fonts, critical CSS |
```css
↪ Both hide the element. `hidden` is overridable by CSS (`display: block` wins). `display: none` is enforced by CSS specificity.
- Render-blocking CSS files in `<head>`
- Flexbox direction issues (no `flex-direction: column` on mobile)
document.querySelectorAll('.btn').forEach(b => b.addEventListener('click', ...));
- Always set `width` and `height` on `<img>` and `<video>` (or use `aspect-ratio` in CSS)
- Avoid animations that change layout properties (use `transform` instead)

### interview\frontend\02-CSS.md
# 🎨 CSS Interview Preparation
### ❓ In simple terms, what is CSS and how does it relate to HTML?
CSS (**Cascading Style Sheets**) describes **how elements should look** — colors, spacing, layout, and positioning.
- CSS defines _presentation_
- CSS is **declarative**: you describe **rules**, and the browser decides **how to apply them**
CSS follows a **cascade** — a priority system that resolves conflicts:
External CSS
Internal CSS (<style>)
2. **Specificity** (stronger selector wins)
<p id="text" class="highlight">Hello CSS</p>
```css
<link rel="stylesheet" href="styles.css" />
- **External** styles live in `.css` files (cacheable, scalable, **preferred**)
### ❓ What are CSS selectors and what types are available?
Selectors define **which elements** a style rule applies to.
```css
> 📌 Classes are reusable, IDs are unique, attribute selectors are powerful but slower if overused.
### ❓ Descendant vs child selectors
```css
| Selector             | Matches                  |
> ⚠️ Overusing descendant selectors makes CSS fragile and hard to refactor.
```css
```css
### ❓ Can you walk me through CSS specificity and how it affects style resolution?
Specificity is the rule the browser uses to decide which CSS rule wins when **multiple rules target the same element**.
It is **not** random, **not** based on order, and **not** about selector length. It is a **priority system**.
| Selector            | Score       |
```css
```css
> ⚠️ **Use only for**: utility classes, accessibility overrides, or fighting third-party CSS as a last resort.
### ❓ How does the CSS box model work?
```css
```css
### ❓ What are the different CSS display types?
| `grid`         | ✅              | ✅               | ✅ (block-level) |
| flex/grid item | ✅    | ✅     |
```css
✅ **Modern alternative**: use `100dvh` (dynamic viewport height) or flex/grid.
### ❓ How do CSS units differ?
| `fr`  | Fraction (Grid)  | Share of remaining space       |
| Responsive widths    | `%` / `vw` |
| Grid columns         | `fr`       |
> 💡 Use `rem` for consistency, `em` for component-scoped sizing, `vh/dvh` for screens, `fr` for grids.
```css
### ❓ What CSS position types exist?
```css
### ❓ How does the `inset` shorthand work in CSS and what problem does it solve?
```css
# 📐 Part 4 — Flexbox
### ❓ What problem does Flexbox solve?
**Flexbox is a layout system designed to distribute space and align items along ONE direction at a time** — either a row or a column.
<img src="../../assets/flexbox.png" alt="Flexbox Image" width="500" />
The browser's job in Flexbox is:
```css
```css
#### ↳ Follow-up: Common Flexbox confusions
| `justify-self`    | Main axis        | Single item (Grid only) | Aligns one item along main axis |
> ⚠️ `justify-self` only works in **Grid**, not Flexbox.
```css
# 🔲 Part 5 — CSS Grid
### ❓ How does CSS Grid work, and how is it different from Flexbox?
**Grid is a 2-dimensional layout system** — it controls rows AND columns at the same time.
Flexbox: 1D (row OR column)
Grid:    2D (row AND column simultaneously)
<img src="../../assets/grid.png" alt="Grid Image" width="500" />
#### ↳ Follow-up: Important Grid properties
```css
display: grid;
grid-template-columns: 200px 1fr 1fr;     /* 3 columns */
grid-template-rows: auto 1fr auto;         /* 3 rows */
grid-template-areas:
grid-column: 1 / 3;       /* span columns 1 to 3 */
grid-row: span 2;          /* span 2 rows */
grid-area: header;         /* assign to named area */
```css
/* Auto-fit responsive grid (no media queries needed!) */
.responsive {
display: grid;
grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
```css

### interview\frontend\04-TypeScript.md
type CSSDirection = "row" | "column";
type FlexDirection = `${CSSDirection}${"" | "-reverse"}`;
> 💡 Useful for typing event names, CSS properties, route paths.

### interview\frontend\05-Angular-1.md
selector: "app-input",
| Always has selector  | ✅ Yes                | ✅ As attribute or `*`      |
selector: "app-user",
@Directive({ selector: "[appHighlight]" })
```css
❌ Styling must be intentional (CSS variables, `::part()`)
**↳ Does `!important` or global CSS override ShadowDom?**
1. **CSS Custom Properties** ✅ (recommended)
```css
```css
> 💡 Modern alternative: use library-provided theming APIs (CSS variables) instead of `::ng-deep`.
selector: "app-child",
<ng-content select="h1"></ng-content>      <!-- element selector -->
<ng-content select=".desc"></ng-content>   <!-- class selector -->
<ng-content select="#footer"></ng-content> <!-- id selector -->
@Directive({ selector: "[appHighlight]" })
selector: "app-user",
@Directive({ selector: "[appHighlight]" })
selector: "app-custom-input",

### interview\frontend\05-Angular-2.md
| Webpack Bundler | Takes JS/TS/CSS/assets → produces optimized bundles |

### interview\frontend\06-React.md
- It makes updates more responsive by splitting work and prioritizing urgent updates (like typing) over non-urgent ones.

### interview\frontend\06-RxJS.md
| `animationFrameScheduler` | Tied to `requestAnimationFrame` |
selector: "app-root",

### interview\frontend\09-Web_Architecture.md
- Web tier stays responsive

### knowledge\concepts\_canonical-candidates.md
| **CSS** | `interview\frontend\02-CSS.md; knowledge\visual-notes\css-descendants.png; practice\coding\02-css-coding.md` | Core web-development concept |
3. CSS

### knowledge\masterclasses\SQL_MasterClass.html
<!-- Reveal.js CSS for Animations and Slide formatting -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.3.1/reset.min.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.3.1/reveal.min.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.3.1/theme/simple.min.css">
/* Custom HTML/CSS Diagrams (To replace broken web images) */
.css-diagram { display: flex; flex-direction: column; align-items: center; width: 100%; font-size: 0.5em; gap: 10px; }
.grid-diagram { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; width: 100%; }
.grid-diagram .box { width: auto; font-size: 0.9em; padding: 10px;}
<div class="css-diagram">
<div class="css-diagram">
<div class="css-diagram" style="flex-direction: row; gap: 20px;">
<div class="css-diagram">
<div class="css-diagram">
<div class="grid-diagram">
<div class="box" style="grid-column: span 2; background: #faf5ff;">Hash Match<br><span style="font-size:0.8em; font-weight:normal;">Memory Hash Buckets (Heavy lifting)</span></div>
<div class="css-diagram" style="align-items: flex-start; text-align: left; padding: 20px;">
<div class="css-diagram">
<div class="css-diagram">
<div class="css-diagram">
<div class="grid-diagram">
<div class="grid-diagram" style="gap: 20px;">
transition: 'slide' // Animations!

### practice\coding\02-css-coding.md
# 🎨 CSS Coding Interview Questions
**Method 1: Flexbox (most common)**
```css
**Method 2: Grid (shortest)**
```css
display: grid;
```css
> 💡 **Pick Flexbox/Grid in modern apps. Absolute positioning works when you can't change parent's display.**
### ❓ How would you convert a row layout to a column layout on mobile using CSS?
```css
### ❓ How would you make a div perfectly circular using only CSS?
```css
```css
**Fix using Flexbox:**
```css
> 💡 **Why?** Flexbox computes available space along both axes, so `margin: auto` can absorb space vertically.
### ❓ How would you build a responsive 3-column grid that collapses to a single column on mobile?
```css
.grid {
display: grid;
grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
**With explicit breakpoints (Flexbox):**
```css
.grid { display: flex; flex-wrap: wrap; gap: 1rem; }
.grid > * { flex: 1 1 calc(33.333% - 1rem); }
.grid > * { flex: 1 1 100%; }
```css
```css
### ❓ How would you build a full-page modal overlay using CSS?
```css
### ❓ Can you create a loading spinner using only CSS — no JavaScript, no images?
```css
animation: spin 1s linear infinite;
### ❓ How would you build a custom styled checkbox or toggle switch using only CSS?
```css
### ❓ Design a User Profile Card UI component using CSS — what would your approach be?
> - Fixed-width card, responsive-friendly
> - Use modern CSS only
```css

### practice\coding\03-angular-coding.md
selector: "app-user-list",
selector: "app-user-form",
selector: "app-user-dialog",
selector: "app-user-details",
selector: "[appInvalidHighlight]",
selector: "app-admin",
selector: "app-root",
selector: "app-root",

### roadmap\foundations\README.backup.md
- CSS

### scripts\reports\canonical-topic-map.md
| HTML | â€” | knowledge\masterclasses\SQL_MasterClass.html | interview\frontend\01-HTML.md; interview\frontend\02-CSS.md | â€” | â€” |
| CSS | â€” | â€” | interview\frontend\02-CSS.md | practice\coding\02-css-coding.md | knowledge\visual-notes\css-descendants.png |
| JavaScript | â€” | â€” | interview\frontend\03-JavaScript.md | practice\coding\01-javascript-coding.md; practice\coding\02-css-coding.md | â€” |
| Java | â€” | knowledge\masterclasses\SQL_MasterClass.html | interview\backend\java\01-Java-1.md; interview\backend\java\01-Java-2.md; interview\backend\java\02-REST-Api.md; interview\backend\java\03-Spring-1.md; interview\backend\java\03-Spring-2.md; interview\backend\java\04-Spring-annotation.md; interview\backend\java\05-Spring-Security.md; interview\backend\java\06-Spring-Cloud.md; interview\backend\java\08-Architecture.md; interview\backend\java\08-MySQL.md; interview\frontend\03-JavaScript.md | practice\coding\01-javascript-coding.md; practice\coding\02-css-coding.md; practice\coding\java\01-core-java-coding.md; practice\coding\java\01-Java-coding.md | knowledge\visual-notes\backend\java-collections.png |
- **CSS** â€” missing: Roadmap, Knowledge

### scripts\reports\content-inventory.md
| interview | `interview\frontend\02-CSS.md` | MD | ðŸŽ¨ CSS Interview Preparation | 2965 |  | â“ In simple terms, what is CSS and how does it relate to HTML?; ðŸ“ Answer; â“ How does the browser decide which styles to apply?; ðŸ“ Answer; â“ How do inline, internal, and external styles differ?; ðŸ“ Answer; â“ What are CSS selectors and what types are available?; ðŸ“ Answer; â“ Descendant vs child selectors; ðŸ“ Answer; â“ What are pseudo-classes vs pseudo-elements?; ðŸ“ Answer; â“ Can you walk me through CSS specificity and how it affects style resolution?; ðŸ“ Answer; ðŸ“ Answer; â“ How does the CSS box model work?; ðŸ“ Answer; â“ Difference between `content-box` and `border-box`?; ðŸ“ Answer; â“ What are the different CSS display types?; ðŸ“ Answer; ðŸ“ Answer; ðŸ“ Answer; â“ How do CSS units differ?; ðŸ“ Answer; â“ Why is `100vh` tricky on mobile?; ðŸ“ Answer; â“ What CSS position types exist?; ðŸ“ Answer; â“ How does the `inset` shorthand work in CSS and what problem does it solve?; ðŸ“ Answer; â“ What problem does Flexbox solve?; ðŸ“ Answer; ðŸ“ Answer; ðŸ“ Answer; ðŸ“ Answer; â“ How does CSS Grid work, and how is it different from Flexbox?; ðŸ“ Answer; ðŸ“ Answer; â“ What are logical properties and why prefer them over physical ones?; ðŸ“ Answer; â“ What are CSS Custom Properties (Variables)?; ðŸ“ Answer; â“ What are container queries?; ðŸ“ Answer; â“ Can you explain the `:has()` selector and give a real-world example of where you'd use it?; ðŸ“ Answer; â“ What's the difference between `*`, `:root`, and `body`?; ðŸ“ Answer; â“ Why do some animations feel janky?; ðŸ“ Answer; â“ Why styles sometimes don't apply?; ðŸ“ Answer; â“ Why is `z-index` not working?; ðŸ“ Answer; â“ Why doesn't `text-overflow: ellipsis` work?; ðŸ“ Answer; â“ Why does `position: sticky` fail?; ðŸ“ Answer; â“ Why does margin collapse happen?; ðŸ“ Answer; â“ Why do inline elements ignore width and height?; ðŸ“ Answer; â“ Why does `flex: 1` ignore width?; ðŸ“ Answer; â“ Why is `!important` not working here?; ðŸ“ Answer; â“ Why does this child selector not match?; ðŸ“ Answer; â“ Why does `overflow: hidden` break dropdowns?; ðŸ“ Answer; â“ Why does absolute positioning break layout height?; ðŸ“ Answer; â“ Why does Grid overflow unexpectedly?; ðŸ“ Answer; â“ Why does `:hover` not work on mobile?; ðŸ“ Answer; â“ How would you build a sticky header inside a scroll container?; ðŸ“ Answer |
| practice | `practice\coding\02-css-coding.md` | MD | ðŸŽ¨ CSS Coding Interview Questions | 1084 |  | â“ How would you center a div both vertically and horizontally? Walk me through the different approaches.; ðŸ“ Answer; â“ How would you convert a row layout to a column layout on mobile using CSS?; ðŸ“ Answer; â“ How would you make a div perfectly circular using only CSS?; ðŸ“ Answer; â“ How do you make an element stick to the top of the viewport while the user scrolls?; ðŸ“ Answer; â“ A developer used `margin: auto` expecting vertical centering, but it didn't work. What's the issue and how would you fix it?; ðŸ“ Answer; â“ How would you build a responsive 3-column grid that collapses to a single column on mobile?; ðŸ“ Answer; â“ How do you truncate overflowing text with an ellipsis after exactly 2 lines?; ðŸ“ Answer; â“ How would you build a full-page modal overlay using CSS?; ðŸ“ Answer; â“ Can you create a loading spinner using only CSS â€” no JavaScript, no images?; ðŸ“ Answer; â“ How would you build a custom styled checkbox or toggle switch using only CSS?; ðŸ“ Answer; â“ Design a User Profile Card UI component using CSS â€” what would your approach be?; ðŸ“ Answer |

### scripts\reports\sql-canonical-evidence.md
<!-- Reveal.js CSS for Animations and Slide formatting -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.3.1/reset.min.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.3.1/reveal.min.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.3.1/theme/simple.min.css">
/* Custom HTML/CSS Diagrams (To replace broken web images) */
.css-diagram { display: flex; flex-direction: column; align-items: center; width: 100%; font-size: 0.5em; gap: 10px; }
.grid-diagram { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; width: 100%; }
.grid-diagram .box { width: auto; font-size: 0.9em; padding: 10px;}
<div class="css-diagram">
<div class="css-diagram">
<div class="css-diagram" style="flex-direction: row; gap: 20px;">
<div class="css-diagram">
<div class="css-diagram">
<div class="grid-diagram">
<div class="box" style="grid-column: span 2; background: #faf5ff;">Hash Match<br><span style="font-size:0.8em; font-weight:normal;">Memory Hash Buckets (Heavy lifting)</span></div>
<div class="css-diagram" style="align-items: flex-start; text-align: left; padding: 20px;">
<div class="css-diagram">
<div class="css-diagram">
<div class="css-diagram">
<div class="grid-diagram">
<div class="grid-diagram" style="gap: 20px;">
transition: 'slide' // Animations!


## TypeScript

### ai\README.md
Provide a natural-language interface to the Tech-Mastery-Hub knowledge base.

### interview\backend\java\01-Java-1.md
interface AccountService {
- Interface represents what the system does
interface Payment {
1. When code depends on the interface, not the implementation.
2. Breaking simple logic into many interfaces and classes when they arenâ€™t needed.
// direct logic, no interfaces or layers
- Program to interfaces, not implementations
- **ISP â€“ Interface Segregation Principle**
interface Payment {
interface Bird {}
interface FlyingBird extends Bird {
4. **ISP â€“ Interface Segregation Principle**
âŒ Violation (fat interface)
interface Machine {
âœ”ï¸ Correct (small interfaces)
interface Printer {
interface Scanner {
interface Database {}
`AutoCloseable` is an interface whose close() method is automatically invoked by the JVM when the resource exits a try-with-resources block.
Factory creates objects by hiding the `new` keyword and returning an interface-based instance, so the caller depends on behavior, not concrete classes.
interface Shape { void draw(); }
- Interface incompatibility
**Adapter** allows two incompatible interfaces to work together by converting one interface into another that the client expects, without changing existing code.
- Old code doesnâ€™t match new interface
interface Charger {
interface Coffee {
interface Payment {
interface Observer {
interface Command {
// Java Interface
public interface CLibrary extends Library {
ðŸŸ¢ Clean Java interface
- Interfaces â†’ List, Set, Queue, Map
| **Interface**                                                    | **Utility class (`final`)**                                            |
In Java, the `LinkedList` class already implements the `Queue` and `Deque` interface
5ï¸âƒ£ Is `Comparator` a **functional interface**?
1ï¸âƒ£ **Functional Interface**
A functional interface is an interface that has **exactly one abstract method**.
- `@FunctionalInterface` is optional but recommended
@FunctionalInterface
interface Calculator {
System.out.println("Calculator Interface");
1. Can a functional interface extend another interface?
interface A {
@FunctionalInterface
interface B extends A {
A lambda expression provides an **inline implementation** of a functional interface and helps reduce boilerplate code.
- Works only with functional interfaces
// Functional Interface:
@FunctionalInterface
interface Calculator {
6ï¸âƒ£ **Default & Static Methods in Interface**
Java 8 allows interfaces to have default and static methods with implementation.
interface Vehicle {
2. What happens if two interfaces have same default method?
interface A {
4. Why static methods in interfaces?
To provide utility/helper methods related to the interface.
âœ… Interface solves this cleanly
interface Vehicle {
### â“ Types of Functional Interfaces
ðŸ”¹ Core Functional Interfaces
| Interface           | Method              | Description             | Example               |
## 2ï¸âƒ£ Extended Functional Interface Table (Important for Interviews)
| Interface           | Method              | Description             | Example               |
Functional Interface = **Exactly one abstract method**
3. **Interface Level**
Interface Declaration is same as [class-level](#L2350)
Interface Members: (â—Implicit rules)
- Introduced in Java 5 to support Collections & Generics.

### interview\backend\java\01-Java-2.md
- A **package** contains multiple classes (and interfaces, enums, etc.).
Sealed classes **restrict which classes or interfaces can extend or implement them**.
- A sealed class/interface must declare permitted subclasses using `permits`
**`Serializable`** is a **marker interface** that is used to **convert Java Object into a byte stream**.
ðŸ”¹ **Marker Interface**
A marker interface is an **interface with no methods** that tells the JVM to treat a class differently.
// Marker Interface
public interface Serializable { }
> **Before annotations existed, marker interfaces were the only way.**
| Marker Interface                   | Purpose                     |

### interview\backend\java\02-REST-Api.md
public ResponseEntity<String> handleGeneric(Exception ex) {

### interview\backend\java\03-Spring-1.md
public interface PaymentService {
3. **Profile-Specific Beans (Same Interface)**
public interface NotificationService {

### interview\backend\java\03-Spring-2.md
public interface OrderRepository extends JpaRepository<Order, Long> {}
| `@Enumerated`     | Defines how an enum is stored in the database (ORDINAL or STRING)                                |
public interface UserRepository extends JpaRepository<User, Long> {
ðŸ‘‰ OFFSET RULES â†’ **OFFSET = pageNumber Ã— pageSize (Spring Data JPA does this automatically)**
public interface UserRepository extends JpaRepository<User, Long> {
public interface UserRepository extends JpaRepository<User, Long> {
public interface RoleRepository extends JpaRepository<Role, Long> {
public interface UserRepo extends CrudRepository<User, Long> {}
public interface UserRepo extends PagingAndSortingRepository<User, Long> {}
public interface UserRepo extends JpaRepository<User, Long> {}
**EntityManager** is the core JPA interface that:
| Interface      | Concrete ORM                |

### interview\backend\java\04-Spring-annotation.md
| `@Component`  | Class level      | Marks a class as a Spring bean (generic stereotype). |
| `InitializingBean`           | Class level (implements interface) | Provides `afterPropertiesSet()` method for initialization (alternative to `@PostConstruct`). |
| `DisposableBean`             | Class level (implements interface) | Provides `destroy()` method for cleanup (alternative to `@PreDestroy`).                      |
| `BeanPostProcessor`          | Class level (implements interface) | Allows custom logic before and after bean initialization.                                    |

### interview\backend\java\06-Spring-Cloud.md
public interface InventoryClient {
public interface InventoryClient {}
public interface InventoryClient {

### interview\frontend\01-HTML.md
| `<div>`     | Generic, **non-semantic** wrapper used for styling or layout only |

### interview\frontend\03-JavaScript.md
> ⚠️ **Avoid `for...in` for arrays** — it includes inherited enumerable props and treats indices as strings.

### interview\frontend\04-TypeScript.md
# 🔷 TypeScript Interview Preparation
> 💡 **Use `as const` for**: enum-like literal unions, default props, Redux actions, route configs.
### ❓ How does TypeScript's type inference work?
TypeScript automatically determines types when you don't specify them.
# 🆚 Part 2 — Types vs Interfaces
### ❓ Difference between `type` and `interface`. When do you use each?
| Feature                  | `interface`                    | `type` alias                            |
**Interface — for object shapes (extendable):**
interface User {
interface Admin extends User {
**Declaration merging (interface only):**
interface Config { apiUrl: string; }
interface Config { timeout: number; }              // ✅ merges
// type aliases would error:
> - Use `interface` for **object shapes**, especially public APIs you might extend later
# 🧬 Part 3 — Generics & Mapped Types
### ❓ Explain Generics with constraints
**Generic** = placeholder type that makes code reusable for many types.
**Constraint** = limit on what types the generic can accept (using `extends`).
interface User { id: number; name: string; email: string; }
interface Product { id: number; name: string; price: number; description: string; }
interface UserDetails { id: number; username: string; email: string; passwordHash: string; }
A **custom type guard** is a function that returns a **type predicate** (`x is Type`), telling TypeScript how to narrow the type at runtime.
interface Cat { meow(): void; }
interface Dog { bark(): void; }
Discriminated unions group related types using a common **literal property** (the **discriminant**), allowing TypeScript to safely narrow the type.
#### ↳ Follow-up: Can you walk me through declaration merging in TypeScript and give a practical example?
**Declaration merging** combines multiple declarations with the same name into a single definition. Works with `interface`, `namespace`, and `enum` — **but NOT `type`**.
interface Config { apiUrl: string; }
interface Config { timeout: number; }       // ✅ Merged
// Type aliases CANNOT merge:
> 💡 **Practical use**: extending third-party library types (e.g., adding properties to Express's `Request` interface).
interface Request {
### ❓ Explain structural typing in TypeScript
interface Point { x: number; y: number; }
> 💡 Contrast with **nominal typing** (Java/C#): `MyPoint` and `Point` would be incompatible even with the same shape. TypeScript is structural by default.
# ✨ Part 8 — Modern TypeScript Features
#### ↳ Follow-up: How do `enum` and `as const` compare, and when would you prefer one over the other?
// Traditional enum (generates JS object)
enum Status { Pending, Active, Done }
| Feature              | `enum`                  | `as const` object        |
| Reverse mapping      | ✅ (numeric enums)      | ❌                       |
| TypeScript-only      | ⚠️ Yes (not ECMAScript) | ✅ Standard JS           |
> 💡 **Modern preference**: use `as const` objects or string literal unions over `enum` — better tree-shaking, no runtime cost.
#### ↳ Follow-up: Can you explain `keyof` and `typeof` in TypeScript and show how they work together?

### interview\frontend\05-Angular-1.md
| Language        | JavaScript                  | TypeScript                                |
`InjectionToken` provides a **DI key for non-class dependencies** (config objects, primitives, interfaces).
You can't inject an interface directly because **interfaces don't exist at runtime** (they're erased after compilation).
export interface AppConfig {
- Better TypeScript inference

### interview\frontend\05-Angular-2.md
- **Strict TypeScript checks** — `null`/`undefined` handling tightens

### interview\frontend\06-React.md
### â“ How do you type React components and hooks with TypeScript?
- Use generics when needed.

### interview\frontend\06-RxJS.md
interface User { id: number; name: string; }
interface Photo { id: number; url: string; }

### interview\frontend\09-Web_Architecture.md
The **Backend-for-Frontend (BFF)** pattern is an architectural style where you build a **dedicated backend service for each type of client** — one for the web app, another for the mobile app, perhaps a third for a smart-TV interface. Instead of every client talking to the same generic API, each gets its own purpose-built layer that aggregates data from downstream microservices and shapes it precisely for that client's screen and use cases.
| **Logic inside** | Generic cross-cutting concerns | Client-specific business logic |

### knowledge\concepts\_canonical-candidates.md
| **TypeScript** | `interview\frontend\04-TypeScript.md` | Core web-development concept |

### knowledge\masterclasses\SQL_MasterClass.html
<li><strong>CallableStatement:</strong> The interface used to execute procedures. It prevents SQL Injection via parameterization.</li>

### practice\coding\01-javascript-coding.md
**Generic memoize utility:**

### practice\coding\03-angular-coding.md
export interface User {
interface User {
interface User { id: number; name: string; }

### roadmap\foundations\README.backup.md
- TypeScript

### roadmap\README.md
A comprehensive, step-by-step roadmap for a Full-Stack Developer. Covers modern frontend, backend, DevOps, and performance practices using TypeScript, React, Next.js, NestJS, PostgreSQL, and Docker.

### scripts\reports\canonical-topic-map.md
| TypeScript | â€” | â€” | interview\frontend\04-TypeScript.md; interview\frontend\06-React.md | â€” | â€” |
- **TypeScript** â€” missing: Roadmap, Knowledge, Practice

### scripts\reports\content-inventory.md
| interview | `interview\backend\java\01-Java-1.md` | MD |  | 10278 | 1ï¸âƒ£ OOP & Design Thinking; 2ï¸âƒ£ Core Java; 3ï¸âƒ£ Collections Framework; JAVA STREAMS â€” COLLECTORS & COMPARATORS CHEAT SHEET; 3ï¸âƒ£ Equals and Hashcode; 4ï¸âƒ£ Java 8+ Features; 1ï¸âƒ£ What about `BiFunction`?; 2ï¸âƒ£ Extended Functional Interface Table (Important for Interviews); Java Access Levels; 6ï¸âƒ£ Immutability & Object Design | â“ Why OOP was introduced?; ðŸ“ Answer; â“ How do you design a system where the same operation behaves differently based on the object type, without changing the calling code?; ðŸ“ Answer; â“ How do you apply OOP principles in real-world systems?; ðŸ“ Answer; â“ Have you ever violated OOP principles intentionally?; ðŸ“ Answer; â“ What design principles do you follow while writing Java code?; ðŸ“ Answer; â“ Difference between == and equals()?; ðŸ“ Answer; â“ String vs StringBuilder vs StringBuffer?; ðŸ“ Answer; â“ final vs finally vs finalize?; ðŸ“ Answer; â“ What are the design patterns that you used in Java?; ðŸ“ Answer; â“ Checked Exception vs Unchecked Exception; ðŸ“ Answer; â“ What is JNA?; ðŸ“ Answer; â“ What is the Collections Framework?; ðŸ“ Answer; â“ Difference between `Collection` and `Collections`; ðŸ“ Answer; â“ Difference between `List`, `Set`, and `Map`; ðŸ“ Answer; â“ Why does `Map` not extend `Collection`?; ðŸ“ Answer; â“ Difference Between `ArrayList` and `LinkedList`; ðŸ“ Answer; â“ How does `HashMap` work internally?; ðŸ“ Answer; â“ How does ConcurrentHashMap work internally?; ðŸ“ Answer; â“ Difference between `HashMap`, `LinkedHashMap`, `TreeMap`; ðŸ“ Answer; â“ What is fail-fast vs fail-safe iterator?; ðŸ“ Answer; â“ Difference between `Iterator` and `ListIterator`; ðŸ“ Answer; â“ Difference between `Comparable` and `Comparator`; ðŸ“ Answer; â“ What is `WeakHashMap`?; ðŸ“ Answer; â“ When would you prefer immutable collections?; ðŸ“ Answer; â“ How do equals() and hashCode() work together?; ðŸ“ Answer; â“ What major changes did Java 8 introduce?; ðŸ“ Answer; â“ `input.toCharArray()` vs `input.chars()`?; ðŸ“ Answer; â“ map vs mapToInt vs mapToObj vs mapToLong vs mapToDouble vs flatMap?; ðŸ“ Answer; â“ Collectors to Remember; ðŸ“ Answer; â“ Optional.isPresent vs Optional.IfPresent; ðŸ“ Answer; â“ `filter()` vs `peek()`; ðŸ“ Answer; â“ `findFirst()` vs `findAny()`; ðŸ“ Answer; â“ `map()` vs `flatMap()`; ðŸ“ Answer; â“ Intermediate vs Terminal Operations; ðŸ“ Answer; â“ Types of Functional Interfaces; ðŸ“ Answer; ðŸ”¹ `BiFunction<T, U, R>`; â“ Features of `Optional`; ðŸ“ Answer; â“ Why `Optional` Should NOT Be Used as Method Parameter?; ðŸ“ Answer; Explain all Java access levels?; ðŸ“ Answer; â“ Why do you prefer immutable objects?; ðŸ“ Answer; â“ How do you design immutable classes?; ðŸ“ Answer; â“ How Do You Design a Singleton Class?; ðŸ“ Answer; â“ AutoBoxing & AutoUnboxing; ðŸ“ Answer; â“ JVM Internal Question; ðŸ“ Answer |
| interview | `interview\frontend\04-TypeScript.md` | MD | ðŸ”· TypeScript Interview Preparation | 1950 |  | â“ Difference between `const` and `as const`?; ðŸ“ Answer; â“ How does TypeScript's type inference work?; ðŸ“ Answer; â“ Difference between `type` and `interface`. When do you use each?; ðŸ“ Answer; â“ Explain Generics with constraints; ðŸ“ Answer; â“ What are mapped types?; ðŸ“ Answer; â“ Explain `Partial`, `Pick`, `Omit`, `ReturnType`; ðŸ“ Answer; â“ Other commonly-used utility types; ðŸ“ Answer; â“ What are `never`, `unknown`, and `void`? When to use each?; ðŸ“ Answer; ðŸ“ Answer; ðŸ“ Answer; ðŸ“ Answer; â“ Explain structural typing in TypeScript; ðŸ“ Answer; â“ What are decorators and how are they applied?; ðŸ“ Answer; ðŸ“ Answer; ðŸ“ Answer; ðŸ“ Answer; ðŸ“ Answer |
| interview | `interview\frontend\06-React.md` | MD |  | 2267 |  | â“ What are the main differences between React class components and function components?; ðŸ“ Answer; â“ Explain React Hooks rules. What happens if you break them?; ðŸ“ Answer; â“ How does Reactâ€™s reconciliation (diffing) algorithm work?; ðŸ“ Answer; â“ Why are keys important in lists? What are bad keys?; ðŸ“ Answer; â“ What is `useEffect` and common pitfalls?; ðŸ“ Answer; â“ Whatâ€™s the difference between `useEffect` and `useLayoutEffect`?; ðŸ“ Answer; â“ Explain `useMemo` and `useCallback`. When to use them?; ðŸ“ Answer; â“ What is Reactâ€™s Strict Mode and why might effects run twice in dev?; ðŸ“ Answer; â“ Explain React 18 concurrent rendering in simple terms.; ðŸ“ Answer; â“ What is `Suspense` and how is it used?; ðŸ“ Answer; â“ How does server-side rendering (SSR) work with React?; ðŸ“ Answer; â“ What is hydration and what can go wrong?; ðŸ“ Answer; â“ How do you manage global state in a large React app?; ðŸ“ Answer; â“ What are common performance optimization techniques in React?; ðŸ“ Answer; â“ Explain controlled vs uncontrolled components in forms.; ðŸ“ Answer; â“ How do you handle errors in React components?; ðŸ“ Answer; â“ How do you test React components?; ðŸ“ Answer; â“ What are custom hooks and why use them?; ðŸ“ Answer; â“ How do you handle authentication flows in React?; ðŸ“ Answer; â“ How to avoid prop drilling?; ðŸ“ Answer; â“ Explain â€œlifting state upâ€ with an example.; ðŸ“ Answer; â“ What is `React.forwardRef` and when to use it?; ðŸ“ Answer; â“ What is the difference between `useRef` and `useState`?; ðŸ“ Answer; â“ How do you handle large lists efficiently in React?; ðŸ“ Answer; â“ How do you ensure accessibility (a11y) in React apps?; ðŸ“ Answer; â“ How do you prevent unnecessary re-renders in child components?; ðŸ“ Answer; â“ Whatâ€™s the difference between `ReactDOM.render` and `createRoot`?; ðŸ“ Answer; â“ How do you organize a large-scale React project?; ðŸ“ Answer; â“ How do you handle side effects like API calls in React?; ðŸ“ Answer; â“ Explain a â€œtrickâ€ question: Why doesnâ€™t this state update immediately?; ðŸ“ Answer; â“ Trick: Whatâ€™s wrong with this effect?; ðŸ“ Answer; â“ Trick: Why is this component re-rendering even with `React.memo`?; ðŸ“ Answer; â“ How do you type React components and hooks with TypeScript?; ðŸ“ Answer; â“ How do you implement code-splitting in React?; ðŸ“ Answer; â“ How do you debounce or throttle events in React?; ðŸ“ Answer; â“ How do you make a reusable modal component in React?; ðŸ“ Answer; â“ How do you implement dark/light theme toggling?; ðŸ“ Answer; â“ How do you handle file uploads in React?; ðŸ“ Answer; â“ How do you secure a React app against XSS?; ðŸ“ Answer; â“ How do you debug React performance issues?; ðŸ“ Answer |

### scripts\reports\javascript-canonical-evidence.md
> ⚠️ **Avoid `for...in` for arrays** — it includes inherited enumerable props and treats indices as strings.
**Generic memoize utility:**

### scripts\reports\sql-canonical-evidence.md
<li><strong>CallableStatement:</strong> The interface used to execute procedures. It prevents SQL Injection via parameterization.</li>


## Angular

### ai\README.md
\## Future Pipeline

### interview\architecture\02-aws-cloud.md
| **AWS CodePipeline**      | Continuous Integration and Continuous Delivery (CI/CD) service to automate build, test, and deploy workflows.        |
2ï¸âƒ£ A developer needs a fully managed CI/CD pipeline with minimal setup â†’ **AWS CodePipeline**
1ï¸âƒ£5ï¸âƒ£ A company wants to orchestrate multi-step deployments automatically â†’ **AWS CodePipeline**
| **Amazon Simple Queue Service (SQS)**        | A fully managed message queue service that decouples application components by allowing them to send, store, and receive messages asynchronously. It helps applications scale reliably without losing messages, even when parts of the system are temporarily unavailable. |

### interview\architecture\03-devops-build-tools.md
### â“ What is a Jenkins pipeline?
- Why are pipelines preferred over manual jobs?
- Why is dynamic typing useful in pipelines?
### â“ What are common stages in a Jenkins pipeline?
### â“ How does Jenkins trigger a pipeline?
- Pipeline scripts
### â“ What are common problems seen in Jenkins pipelines?

### interview\backend\java\01-Java-1.md
1. Reduce tight coupling between components
Main components:
List<String> names = List.of("java", "angular");
System.out.println(upper); // [JAVA, ANGULAR]
List<String> names = List.of("java", "angular");

### interview\backend\java\02-REST-Api.md
# ðŸŸ¢ ANGULAR ROUND

### interview\backend\java\03-Spring-1.md
- Dependency Injection (DI)
_a. **Dependency Injection (DI)** â€“ Core IoC Implementation_
Spring implements IoC mainly using **Dependency Injection**, where dependencies are provided to an object rather than the object creating them itself.
Types of Dependency Injection:
@Component
### â“ Common Spring Dependency Injection Errors â€“ Why Do They Happen?
@Component
@Component
@Component("creditPayment")
@Component
ðŸ¤”â“ @Component vs @Bean
ðŸ”¹ @Component
@Component
ðŸ¤”â“ I cannot add `@Component` to a library class. Third-party classes cannot be annotated.. How to create object?
@Component
@Component
@SpringBootApplication // Combines @Configuration, @EnableAutoConfiguration, @ComponentScan
- Accepting Java-based configuration (`@Configuration`, `@Component`)
- `@ComponentScan`
ðŸ”¹ `@ComponentScan`
**Find components in packages**
- `@Component`
@Component
| **Spring Core Container**            | IoC Container, Bean lifecycle, Dependency Injection, Configuration Mgmt |

### interview\backend\java\04-Spring-annotation.md
| `@Component`  | Class level      | Marks a class as a Spring bean (generic stereotype). |
ðŸ”¹ **Dependency Injection Annotations**
| `@PostConstruct`             | Method level                       | Runs once after bean creation and dependency injection; used for initialization logic.       |
| `@SpringBootApplication`         | Class level                     | Main entry point. Combines `@Configuration`, `@EnableAutoConfiguration`, and `@ComponentScan`. |
| `@ComponentScan`                 | Class level                     | Scans packages for Spring components (beans).                                                  |

### interview\backend\java\06-Spring-Cloud.md
> API Gateway is a critical component and must be deployed in a highly available and scalable manner. Usually, multiple instances are deployed behind a load balancer.
âœ” Infrastructure components must be instrumented

### interview\backend\java\08-Architecture.md
## Angular
Iâ€™d keep filters in `component-level state` or `route query params`, not in shared services. Each user session should manage its own state.
Iâ€™d first profile it using `Angular DevTools`. If issues persist, Iâ€™d wrap it with `OnPush`, disable unused features, or plan a phased replacement.
Iâ€™d rely on Angularâ€™s built-in `XSS protection` and avoid using `innerHTML`. If needed, Iâ€™d carefully use `DomSanitizer`.
Iâ€™d review unnecessary `@ComponentScan`, reduce auto-configurations, and enable `lazy initialization` if needed.
Iâ€™d break it down layer by layer: Angular network timing, REST API response time, and DB query time. Iâ€™d use `browser DevTools`, `Spring logs`, and DB metrics to isolate the bottleneck.
### â“ Angular team requests more data â€œjust in case.â€ How would you respond?
### â“ A backend change breaks the Angular app after deployment. How would you prevent this?
### â“ How do you ensure Angular points to the correct backend per environment?
Iâ€™d use Angular `environment.ts` files and avoid hardcoding URLs.
### â“ Angular needs user-specific data. How do you ensure users see only their own data?
Iâ€™d strengthen `integration tests`, mock fewer things, and test Angular â†” API flows together.
### â“ How do you decide if a problem should be solved in Angular or backend?
UI logic stays in Angular. Data validation, security, and performance-critical logic stay in backend.

### interview\backend\java\08-MySQL.md
SELECT REPLACE('Java Developer', 'Java', 'Angular');
-- Angular Developer

### interview\backend\node\01-Node.js.md
- Data pipelines
readStream.pipe(writeStream);

### interview\backend\node\06-Node-security.md
No. Environment files can leak through logs, container images, or CI pipelines.

### interview\frontend\01-HTML.md
Instead, it follows a strict internal pipeline to understand _what_ to show and _how_ to show it.
- Component configuration
### ❓ What are Web Components?
Web Components allow you to create **custom HTML elements** with isolated styles and behavior — built into the browser, **no framework required**.
✅ **Three pillars of Web Components**
**`<slot>`** is a Web Components feature that defines a **placeholder** for projected content.
> 💡 `<template>` is similar to Angular's `<ng-template>` — both define markup that doesn't render until activated.
- Rendering pipeline depends on ordered execution

### interview\frontend\02-CSS.md
| Component spacing    | `rem`      |
> 💡 Use `rem` for consistency, `em` for component-scoped sizing, `vh/dvh` for screens, `fr` for grids.
> 💡 **Use when**: building multilingual apps, supporting RTL languages (Arabic, Hebrew), creating reusable component libraries.
**Container queries let elements respond to their parent's size**, not the viewport's. This is huge for component-driven design.
> 💡 Same component can render differently in a sidebar (narrow) vs main content (wide) — without media queries!

### interview\frontend\03-JavaScript.md
> 💡 **Use cases**: configuring functions in advance (`const log = curry((level, msg) => ...); const error = log("ERROR");`), functional programming pipelines.
> - Use **arrow functions** for callbacks where you want to keep the outer `this` (e.g., inside class methods, in array methods inside React components)
**Components:**

### interview\frontend\04-TypeScript.md
> 💡 **Common use**: Angular's `@Component`, `@Injectable`, `@Input` are all decorators.

### interview\frontend\05-Angular-1.md
# 🅰️ Angular Interview Preparation — Part 1
# 🏛️ Part 1 — Angular Basics & Architecture
### ❓ How would you describe Angular to someone coming from AngularJS — what are the fundamental differences?
| Feature         | **AngularJS (1.x)**         | **Angular (2+)**                          |
| Architecture    | MVC (Controllers + Scopes)  | Component-based                           |
| Modules         | Angular modules + DI        | NgModules / Standalone Components         |
> 💡 **Key takeaway**: Angular is a complete rewrite — not a version upgrade.
# 🧩 Part 2 — Components, Templates & Data Binding
### ❓ What types of data binding does Angular support?
Angular has **four primary types of binding**, plus a custom two-way pattern.
#### 1️⃣ Interpolation `{{ }}` — Component → View
#### 2️⃣ Property Binding `[prop]` — Component → View
Set DOM/component properties.
#### 3️⃣ Event Binding `(event)` — View → Component
For reusable components.
@Component({
export class InputComponent {
> 💡 Angular recognizes `[(name)]` automatically when there's an `@Input() name` paired with `@Output() nameChange`.
### ❓ Can you walk me through the difference between Components and Directives in Angular?
A **Component** is essentially a **Directive with a template** — it controls a piece of UI.
A **Directive** modifies behavior or appearance of an existing element — **no template**.
| Feature              | Component             | Directive                   |
| Decorator            | `@Component`          | `@Directive`                |
**Component**
@Component({
export class UserComponent {
**Directive (Attribute)**
@Directive({ selector: "[appHighlight]" })
export class HighlightDirective {
**Directive (Structural)**
#### ↳ **Follow-up:** Is every component a directive?
↪ ✅ Yes — a component is a directive with a template.
#### ↳ **Follow-up:** Can directives have lifecycle hooks?
#### ↳ **Follow-up:** Which directive manipulates DOM structure?
↪ Structural directives (`*ngIf`, `*ngFor`, `*ngSwitch`).
### ❓ Can you explain ViewEncapsulation in Angular and the trade-offs between the available modes?
`ViewEncapsulation` controls **how component styles are scoped and applied to the DOM**.
Angular **simulates** Shadow DOM by adding generated attributes.
✅ Scoped to component
**↳ If two components use `h1 { color: red }`, will they conflict?**
↪ ❌ **No, never.** ShadowDom is enforced by the **browser**. Angular cannot bypass browser isolation.
**↳ What ARE the ways to style a ShadowDom component from outside?**
2. **`::part()`** (if component exposes parts)
### ❓ When would you use `::ng-deep` in Angular, and what are the risks of relying on it?
To **override styles of child or third-party components** that use Emulated encapsulation.
| Still works in current Angular | ✅  |
**Common use cases**: Angular Material overrides, third-party UI libraries.
### ❓ What are Angular lifecycle hooks?
Lifecycle hooks let you tap into key moments in a component's life.
| `ngOnDestroy`           | Just before component is destroyed          | Cleanup subscriptions, intervals    |
![Angular_Lifecycle Image](/src/assets/angular-lifecycle.png)
**`child.component.ts`**
@Component({
templateUrl: "./child.component.html",
export class ChildComponent
// ✅ Safe DOM access for component template + child views
**`child.component.html`**
**`parent.component.html`**
# 🎯 Part 4 — Directives
Both are **structural directives** — they manipulate the DOM by adding/removing elements.
**Without `trackBy`**, Angular tracks items by **object identity**. When the array reference changes (e.g., after API call), Angular destroys ALL DOM nodes and recreates them.
**With `trackBy`**, Angular uses a **stable identifier** to know which items truly changed and reuses unchanged DOM nodes.
| Type             | Structural directive            | Structural directive    |
### ❓ How do attribute directives work internally?
Attribute directives modify an element's appearance or behavior — they don't change the DOM structure.
@Directive({ selector: "[appHighlight]" })
export class HighlightDirective {
Angular 17+ introduced **built-in control flow** — replacing `*ngIf`, `*ngFor`, and `*ngSwitch` with cleaner syntax.
### ❓ How do Standalone Components differ from NgModules?
| Feature              | NgModules                         | Standalone Components            |
| Boilerplate          | Module file + declarations array  | Just the component               |
| Imports              | At module level                   | At component level (per file)    |
| Lazy loading         | Module-based (`loadChildren`)     | Component-based (`loadComponent`) |
@Component({
imports: [CommonModule, FormsModule, OtherComponent],
export class UserComponent {
> 💡 **Recommendation (2024+)**: use standalone components by default. Use NgModules only for large legacy apps or when grouping is genuinely useful.
`@ViewChild` lets a component directly access something in its **own template** — a DOM element, child component, or directive.
@Component({
export class MyComponent {

### interview\frontend\05-Angular-2.md
# 🅰️ Angular Interview Prep — Part 2: Change Detection, Build System & Advanced Topics
### ❓ How does Angular's change detection mechanism work, and how did it evolve from AngularJS?
Angular's change detection is the process by which the framework figures out **what changed in your data** and **updates the DOM accordingly**. The mechanism has evolved significantly — from AngularJS's "dirty checking with digest cycles" to today's **Zone-based detection** and the newer **Signal-based reactivity**.
The Angular runtime uses **zone.js** — a library that monkey-patches all asynchronous browser APIs.
Angular starts from the root component
Traverses the entire component tree (top → down)
> 💡 **Mental model:** Zone.js is like a tap on Angular's shoulder saying _"hey, something might have changed."_ Angular then verifies by walking the tree.
#### ⚠️ What Angular Does **NOT** Auto-Track
#### 🚀 Signals (Angular 16+) — The New Reactivity Model
Signals fundamentally change *how* Angular knows what to update.
1. When you create a `signal()`, Angular registers it.
2. When that signal is read in a template (or in `computed`/`effect`), Angular records the dependency — building a **dependency graph**.
3. When the signal mutates, Angular knows **exactly which nodes** to refresh — and skips the rest.
> 💡 **Future direction:** Angular is moving toward "zoneless" apps where Signals replace zone.js entirely (`provideExperimentalZonelessChangeDetection`).
- **Zone.js → tells Angular *when* to check.**
- **Signals → tell Angular *what* to update.**
# Part 2 — The Angular Build System
### ❓ Explain Angular's building tools and how they have evolved.
Modern Angular's build pipeline is a coordinated effort of **5 things** working together:
### Webpack (Pre-v17 Angular default)
| Component | Role |
> 📌 Used by Angular versions before v17.
### Vite (Angular v17+ default)
| Component | Role |
### 📅 Angular Build Tooling Timeline
Angular 8   →  View Engine  +  Webpack
Angular 9   →  Ivy          +  Webpack
Angular 16  →  Ivy          +  esbuild (partial)
Angular 17+ →  Ivy          +  Vite + esbuild
Angular 19  →  Ivy          +  Vite + esbuild + Rollup
| **View Engine** | ❌ Old | Pre-Angular 9 |
| **Ivy** | ✅ Current | Angular 9 → present |
> 💡 **Why Ivy matters:** Ivy's "locality" principle means each component compiles independently — enabling better tree-shaking, faster incremental builds, and standalone components.
### ❓ Can you walk me through how HMR works and how Angular integrates it into the dev server?
**HMR** updates code in the browser **without a full page reload** — preserving app state like form inputs, scroll position, and component state.
- Removes Angular decorators (`@Component`, `@Injectable`, etc.)
- Generates Angular instructions (`ɵɵelementStart`, `ɵɵproperty`, etc.)
> 📌 **Important:** Ivy understands Angular and templates; esbuild does **not** understand decorators. By the time esbuild runs, the HTML/decorators are gone — replaced by pure JS instructions.
| Dirty checking? | Angular checks bindings on every change detection cycle. |
// On component init
Angular ──► /api/users ──► API Gateway ──► User Microservice
### ❓ Can we jump from Angular 5 → Angular 19 directly?
Each major Angular version has breaking changes — especially around RxJS pipeable operators, lazy loading syntax, Ivy migration, and standalone components. Skipping versions means you skip the migration schematics that auto-fix these.
ng update @angular/core@N @angular/cli@N
> 💡 **Use the [Angular Update Guide](https://update.angular.io/)** — it generates an exact step-by-step migration checklist tailored to your `from → to` versions.
### ❓ Name some deprecated/removed concepts from Angular 5 → 19.
| Angular 9 | View Engine → **Ivy** |
| Angular 9+ | `Http` → **`HttpClient`** |
| Angular 4+ | `Renderer` → **`Renderer2`** |
| Angular 9 | `entryComponents` removed (Ivy doesn't need them) |
| Angular 14+ | NgModules → **Standalone components** |
| Angular 17+ | Webpack → **Vite + esbuild** |
| Angular 11+ | TSLint → **ESLint** |
| Angular 12+ | **Strict mode** enabled by default |
| Angular 13 | Differential loading removed |
| Angular 6+ | RxJS chained operators → **pipeable operators** (`.pipe(map(), filter())`) |
| Angular 15+ | Lazy loading syntax: `loadChildren: () => import('./...').then(m => m.X)` |
| Angular 16+ | **Signals** introduced |
| Angular 17+ | New control flow: `*ngIf` → `@if`, `*ngFor` → `@for`, `*ngSwitch` → `@switch` |
| Angular 18+ | **Functional HTTP interceptors** preferred over class-based |
- **RxJS pipeable operators** — old `.map().filter()` chains break
- **Standalone components** — modules become optional
- **Zone optimizations & Signals** (Angular 16+)
> 💡 **Run `ng update` between every major version** — Angular ships *schematics* that automatically rewrite your code to the new patterns. They're free upgrades you should never skip.
| Zone.js | Tells Angular *when* to run CD |
| Signals | Tell Angular *what* to update (granular) |
> 🚀 **You've got this!** Master these internals and you'll handle any Angular architecture or performance question with confidence.

### interview\frontend\06-React.md
### â“ What are the main differences between React class components and function components?
- Function components are simpler, use hooks, and are now the recommended approach.
- Class components use `this`, lifecycle methods (`componentDidMount`, etc.).
// Function component with hook
2. Only inside React function components or custom hooks.
function MyComponent({ show }) {
- In React 18 dev, React intentionally mounts, unmounts, and re-mounts components to detect unsafe effects.
- `Suspense` lets you show a fallback while some child â€œwaitsâ€ (lazy-loaded component, or data with React 18 libs).
- The component throws a promise; React shows fallback until it resolves.
- Server renders React components to HTML.
### â“ Explain controlled vs uncontrolled components in forms.
### â“ How do you handle errors in React components?
- Use error boundaries (class components) to catch render/runtime errors in child components.
class ErrorBoundary extends React.Component {
componentDidCatch(error, info) {
### â“ How do you test React components?
// Component
- They keep components smaller and easier to test.
- Component composition instead of deep nesting.
- When two or more components need to share state, move that state to their closest common parent and pass down via props.
- `forwardRef` lets a component pass a ref to a child DOM node or another component.
- Useful for reusable input components, focusing, imperative APIs.
### â“ How do you prevent unnecessary re-renders in child components?
- Use `React.memo` to memoize child component.
- Separate UI components, hooks, services, and types.
- Keep components small and focused.
components/
### â“ Trick: Why is this component re-rendering even with `React.memo`?
### â“ How do you type React components and hooks with TypeScript?
- Use `React.lazy` and `Suspense` to lazy-load components.
### â“ How do you make a reusable modal component in React?
- Create a `Modal` component with props (`isOpen`, `onClose`).
- Use React DevTools Profiler to see slow components.
- Optimize with memoization, splitting components, virtualization.

### interview\frontend\06-RxJS.md
RxJS (Reactive Extensions for JavaScript) is a library for **reactive programming** using **Observables**. It lets you compose async and event-based programs using a functional, declarative pipeline of operators.
> 💡 **Mental model:** Promises are *one* future value. Observables are *many* future values over time — like a stream you can pipe, filter, and transform.
### ❓ Can you explain what an RxJS operator is and how operators are composed in a pipeline?
### ❓ What's the difference between Pipeable and Creation operators?
| **Pipeable** | Transform an existing Observable inside `.pipe()` | `map`, `filter`, `switchMap`, `catchError` |
// Pipeable
const doubled$ = numbers$.pipe(map(n => n * 2));
> 💡 **Why this matters:** If you build a pipeline but never subscribe, **none** of your operators run. No HTTP request, no timer, nothing.
const src$ = of(0, 1, 2).pipe(share());
const src$ = of(0, 1, 2).pipe(shareReplay(1));
of(1, 2, 3).pipe(map(n => n * 10)).subscribe(console.log);
of(1, 2, 3, 4).pipe(filter(n => n % 2 === 0)).subscribe(console.log);
http.get('/api/users').pipe(
of(1, 2, 3).pipe(scan((acc, n) => acc + n, 0)).subscribe(console.log);
input$.pipe(map(n => n * 2));
input$.pipe(switchMap(query => http.get(`/search?q=${query}`)));
search$.pipe(
loginClicks$.pipe(
formSubmit$.pipe(
http.get('/users').pipe(
source$.pipe(
http.get('/data').pipe(
> ⚠️ **But beware** in `switchMap`/`mergeMap`: if the **inner** Observable errors and you don't catch *inside*, the outer stream dies. Place `catchError` inside the inner pipeline:
input$.pipe(
switchMap(q => http.get(`/search?q=${q}`).pipe(
- Avoiding "Expression has changed after it was checked" errors in Angular
# Part 9 — RxJS in Angular
### ❓ How does RxJS interact with Angular's Zones and Change Detection?
Angular patches async APIs (including many RxJS sources) via **zone.js**. Emissions that run **inside** the Angular zone trigger change detection. You can use `NgZone.runOutsideAngular()` to run heavy streams outside the zone for performance, then re-enter the zone with `NgZone.run()` when you need to update the view.
### ❓ How does Angular's `HttpClient` use RxJS?
### ❓ How do you avoid multiple HTTP calls when many components need the same data?
readonly users$ = this.http.get<User[]>('/api/users').pipe(
Now any component subscribing to `userService.users$` reuses the same HTTP response.
### ❓ What does the `async` pipe do?
Subscribes to an Observable/Promise in a template, exposes the latest value, and **automatically unsubscribes on component destroy**.
> 💡 **Best feature:** Zero memory-leak risk — Angular handles unsubscribe for you.
### ❓ When should you NOT use the `async` pipe?
- When you need **side effects** (e.g., set component state on emission)
### ❓ How would you model component state using RxJS?
Use a `BehaviorSubject` (or `Subject` + `scan`) as a state store, expose it as a read-only Observable, and bind via `async` pipe.
### ❓ Example: How to debounce a search input in Angular?
this.searchControl.valueChanges.pipe(
this.actions$.pipe(
switchMap(() => this.api.getUsers().pipe(
### ❓ How do memory leaks occur with RxJS in Angular?
By **not unsubscribing** from long-lived or infinite Observables (e.g., `interval`, `fromEvent`, `WebSocket`) when the component is destroyed.
> ⚠️ The component goes away, but the subscription is still pushing values into a now-detached handler — leaking memory and potentially causing errors.
| `async` pipe | Best — used in templates |
| **`takeUntilDestroyed()`** | Modern Angular (16+) — auto-cleanup |
interval(1000).pipe(
Available in Angular 16+, this operator hooks into the component's `DestroyRef` automatically:
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
// Inside a component (must be in injection context, e.g., constructor or field initializer)
interval(1000).pipe(
> 💡 **Cleaner, less boilerplate.** No more `destroy$` subjects in every component.
- Streams managed by the **`async` pipe**
### ❓ 🪤 Trick: `interval(1000).pipe(take(0))` — does it emit anything?
### ❓ 🪤 Trick: `from([1,2,3]).pipe(switchMap(x => of(x)))` — can any values be cancelled?
### ❓ Mock: You have an infinite WebSocket stream. Some components need it; others don't. Design?
readonly messages$ = this.socket.pipe(
return this.http.request(req).pipe(
timer(0, 10000).pipe(
combineLatest([this.backendPrefs$, this.uiOverrides$]).pipe(
this.http.get<A>('/a').pipe(
const debounced$ = this.searchControl.valueChanges.pipe(
const enter$ = this.enterKey$.pipe(
merge(debounced$, enter$).pipe(
import { Component, OnInit, inject } from "@angular/core";
import { HttpClient, HttpClientModule } from "@angular/common/http";
@Component({
Angular 16+ introduced two interop helpers to bridge Signals and RxJS:
import { toSignal } from '@angular/core/rxjs-interop';
@Component({ /* ... */ })
export class UsersComponent {
import { toObservable } from '@angular/core/rxjs-interop';
readonly results$ = toObservable(this.query).pipe(
> 💡 **Mental model:** `toSignal` brings RxJS *into* Signal world; `toObservable` lets you escape *back* to RxJS for pipeline magic.
| `takeUntilDestroyed()` | Modern auto-unsubscribe (Angular 16+) |

### interview\frontend\09-Web_Architecture.md
| Client | **Angular** | UI rendering, state management, user interaction |
Angular communicates with the backend over **HTTP/HTTPS** using RESTful APIs. Node.js + Express acts as the application server, handling routing, middleware execution, authentication, validation, and business logic. MongoDB stores data in a document format that aligns naturally with JSON-based APIs.
[Angular Component → Service → HTTP Interceptor adds JWT]
[Angular updates view reactively]
A user action in Angular triggers an HTTP request through a service. Before the request leaves the browser, Angular **HTTP interceptors** attach headers like JWT tokens. The request reaches the Node.js server, where Express middleware processes it sequentially — authentication, authorization, validation, and logging. The controller invokes business services, which interact with MongoDB. The response flows back through middleware, is serialized as JSON, and Angular updates the UI reactively.
> 💡 **Mental model:** Think of middleware as a **pipeline**, not just "functions." Each layer can short-circuit the request — saving CPU cycles and database hits.
2. Angular stores the token (memory or `localStorage`/`sessionStorage`)
3. Angular's HTTP interceptor attaches `Authorization: Bearer <token>` to every request
| **XSS** | Angular auto-escapes HTML in templates (`{{ }}`); avoid `innerHTML` and `bypassSecurityTrust*` unless absolutely needed |
### ❓ How do you optimize Angular performance?
![Image](https://dotnettrickscloud.blob.core.windows.net/article/angular/3720240602200739.com-png-to-webp-converter%20%281%29)
| **Pure pipes** | Memoize transformations |
| **`async` pipe** | Auto-unsubscribe + auto-marks for check |
@Component({
### ❓ Explain Angular route guards
| `Resolve` | Pre-fetch data before component loads |
| **Aggregation pipelines** | Optimize order: `$match` → `$project` → `$group`; use `explain()` |
**Modern CI/CD pipeline:**
| **MEAN Stack** | MongoDB + Express + Angular + Node |
| **OnPush + trackBy** | Angular perf basics |

### knowledge\concepts\database\sql\README.md
A SQL query passes through an execution pipeline rather than going directly to storage. The Masterclass describes three major stages:
- `EXTRACT()` — extracts a component such as year or month.

### knowledge\concepts\_canonical-candidates.md
| **Angular** | `interview\frontend\05-Angular-1.md; interview\frontend\05-Angular-2.md; knowledge\visual-notes\angular-lifecycle.png; practice\coding\03-angular-coding.md` | Frontend framework/library concept |
6. Angular

### knowledge\masterclasses\SQL_MasterClass.html
<h2>2. Inside the Engine Pipeline</h2>
<li>Your query doesn't go straight to the hard drive. It passes through a complex pipeline.</li>
<p><strong>The Expert Answer:</strong> Both filter data, but at completely different pipeline stages.</p>
<li><strong>EXTRACT():</strong> Pulls a specific integer component (like the Year or Month) out of a timestamp for grouping logic.</li>

### practice\coding\java\01-Java-coding.md
> Input: "java spring java angular spring java"

### practice\coding\02-css-coding.md
### ❓ Design a User Profile Card UI component using CSS — what would your approach be?
components and design systems.

### practice\coding\03-angular-coding.md
# 🅰️ Angular Coding Interview Prep — Mock Tasks & Patterns
### ❓ Build a small Angular application that manages users. It should load initial data from an API, allow CRUD operations, use forms, routing, dialogs, caching, and some custom Angular features. Explain your design decisions.
- ✅ Component / service separation
- ✅ Custom pipe + custom directive
| `asObservable()` exposed | Prevents components from calling `.next()` and bypassing the service |
## 3️⃣ User List Component (Table + Routing)
@Component({
templateUrl: "./user-list.component.html",
export class UserListComponent implements OnInit {
this.dialog.open(UserDialogComponent, {
**user-list.component.html**
> 1. **`async` pipe** → auto-subscribe + auto-unsubscribe (no memory leak)
## 4️⃣ Reactive Form Component (Add User)
@Component({
templateUrl: "./user-form.component.html",
export class UserFormComponent {
**user-form.component.html**
## 5️⃣ Dialog Component (Edit User + Unsaved Changes Guard)
@Component({
templateUrl: "./user-dialog.component.html",
export class UserDialogComponent {
private dialogRef: MatDialogRef<UserDialogComponent>,
**user-dialog.component.html**
@Component({
templateUrl: "./user-details.component.html",
export class UserDetailsComponent implements OnInit {
**user-details.component.html**
**app.component.html**
## 7️⃣ Custom Pipe (Phone Formatter)
@Pipe({ name: "phonePostal" })
export class PhonePostalPipe implements PipeTransform {
> 💡 **Pure pipes are memoized** — Angular only re-runs `transform` when the input reference changes.
## 8️⃣ Custom Directive (Invalid Highlight)
@Directive({
export class InvalidHighlightDirective {
{ path: "users", component: UserListComponent },
{ path: "users/:id", component: UserDetailsComponent },
{ path: "add", component: UserFormComponent },
loadComponent: () =>
import("./admin/admin.component").then((c) => c.AdminComponent),
> 💡 **`canMatch` vs `canActivate`:** `canMatch` is checked **before** the route is even matched. If it returns false, Angular pretends the route doesn't exist — **the lazy chunk is never downloaded**. That's a perf + security win over the old `canLoad` and `canActivate`.
## 1️⃣2️⃣ Lazy-loaded Admin Component
// admin.component.ts
@Component({
export class AdminComponent {}
| Custom pipe + directive | Demonstrates extensibility knowledge |
### ❓ You are building a search autocomplete. You must debounce user input, avoid multiple API calls, cache results for 5 minutes, and cancel stale requests. How would you design this in Angular using RxJS?
import { Component, OnInit, inject } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { HttpClient, provideHttpClient } from "@angular/common/http";
@Component({
.pipe(
.pipe(
- **`shareReplay(1)`** the HTTP call so multiple components share one fetch
- **`takeUntilDestroyed()`** — modern auto-unsubscribe (Angular 16+)
### ❓ Rebuild the autocomplete using Angular Signals + RxJS interop. How does it differ from the classic approach?
In Angular 16+, you can mix **Signals** (for state) with **RxJS** (for stream operators) using `toObservable()` and `toSignal()`.
import { Component, signal, inject, computed } from "@angular/core";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import { HttpClient } from "@angular/common/http";
@Component({
// 🔄 Bridge signal → observable for RxJS pipeline
private readonly results$ = toObservable(this.query).pipe(
.pipe(
- ✅ Know about Angular 16+ reactivity primitives
| `async` pipe + `trackBy` | Auto-unsubscribe + perf |

### roadmap\backend\README.md
- Validation Pipes

### roadmap\devops\README.backup.md
- Build Pipelines

### roadmap\frontend\README.backup.md
- Angular

### scripts\reports\canonical-topic-map.md
| Angular | â€” | â€” | interview\backend\java\02-REST-Api.md; interview\backend\java\08-Architecture.md; interview\frontend\05-Angular-1.md; interview\frontend\05-Angular-2.md; interview\frontend\06-RxJS.md; interview\frontend\09-Web_Architecture.md | practice\coding\03-angular-coding.md | knowledge\visual-notes\angular-lifecycle.png |
| React | â€” | â€” | interview\frontend\05-Angular-1.md; interview\frontend\06-React.md; interview\frontend\06-RxJS.md | practice\coding\03-angular-coding.md | â€” |
| RxJS | â€” | â€” | interview\frontend\06-RxJS.md | practice\coding\03-angular-coding.md | knowledge\visual-notes\rxjs-maps.png |
- **Angular** â€” missing: Roadmap, Knowledge

### scripts\reports\content-inventory.md
| interview | `interview\architecture\03-devops-build-tools.md` | MD |  | 547 | 1ï¸âƒ£ Docker â€“ Basic Conceptual Questions; 2ï¸âƒ£ Jenkins + Groovy â€“ CI/CD Basics; 3ï¸âƒ£ Tomcat â€“ Application Server Basics; 4ï¸âƒ£ Maven â€“ Build Tool Fundamentals; 5ï¸âƒ£ How These Tools Work Together (Very Common) | â“ What is Docker and why is it used?; â“ What is the difference between Docker and a Virtual Machine?; â“ What is a Docker image?; â“ What is a Docker container?; â“ What is a Dockerfile?; â“ Why should applications inside Docker be stateless?; â“ How do you pass configuration to a Docker container?; â“ What are common benefits of using Docker in projects?; â“ What is Jenkins?; â“ What is CI/CD?; â“ Why do teams use Jenkins for CI/CD?; â“ What is a Jenkins pipeline?; â“ What is a Jenkinsfile?; â“ Why is Jenkinsfile written in Groovy?; â“ What is Groovy?; â“ Is Groovy statically typed or dynamically typed?; â“ What are common stages in a Jenkins pipeline?; â“ How does Jenkins trigger a pipeline?; â“ What happens when a Jenkins build fails?; â“ What is the difference between Jenkins master and agent?; â“ Where is Groovy mostly used in Jenkins?; â“ What are common problems seen in Jenkins pipelines?; â“ What is Apache Tomcat?; â“ What kind of applications run on Tomcat?; â“ How does Tomcat handle incoming requests?; â“ What is a WAR file?; â“ Difference between embedded Tomcat and external Tomcat?; â“ What are common issues seen in Tomcat?; â“ How do you restart or redeploy applications in Tomcat?; â“ What is Maven and why is it used?; â“ What is a `pom.xml` file?; â“ What is dependency management in Maven?; â“ What are Maven repositories?; â“ What is the Maven build lifecycle?; â“ What is a Maven plugin?; â“ What is a multi-module Maven project?; â“ How does Maven help maintain consistency across environments?; â“ Typical CI/CD flow using these tools?; â“ How do Maven, Jenkins, and Docker work together?; â“ Where does Tomcat fit in this flow?; â“ What problems do these tools solve together? |
| interview | `interview\backend\java\02-REST-Api.md` | MD | ðŸŸ¢ ANGULAR ROUND | 551 | 5ï¸âƒ£ Exception Handling â€“ Senior Strategy | â“ How do you design exception handling in large Java applications?; ðŸ“ Answer; â“ Checked vs unchecked exceptions â€“ what is your strategy?; ðŸ“ Answer; â“ Important HTTP Status Codes to Know; ðŸ“ Answer; â“ If I replace GET with PUT, can I still fetch records?; ðŸ“ Answer; â“ Can we get Request Body in GET?; ðŸ“ Answer; â“ Without @Controller, can we receive API?; ðŸ“ Answer; â“ How do you implement global HTTP status handling in Spring Boot without setting the status code in each controller method?; ðŸ“ Answer |
| interview | `interview\backend\java\03-Spring-1.md` | MD | Multiple Active Profiles | 2991 | Spring Core & Fundamentals; Other Spring Concepts | â“ What is Spring, Why it was introduced?; ðŸ“ Answer; â“ What is Spring IoC and how is it implemented internally?; ðŸ“ Answer; â“ What are the different bean configuration approaches used to implement IoC in Spring?; ðŸ“ Answer; â“ Common Spring Dependency Injection Errors â€“ Why Do They Happen?; ðŸ“ Answer; â“ Can you explain the different bean scopes in Spring?; ðŸ“ Answer; â“ Explain the lifecycle of a Spring bean and how you can intervene at different stages of its initialization and destruction.; ðŸ“ Answer; â“What is Spring Profile?; ðŸ“ Answer; â“What is Spring Boot Actuator?; ðŸ“ Answer; â“ What is Spring AOP, Why it was introduced?; ðŸ“ Answer; â“ What is Spring Modular Design?; ðŸ“ Answer; â“ Spring HATEOAS; ðŸ“ Answer; â“ Thymeleaf; ðŸ“ Answer; â“ application.properties vs application.yml?; ðŸ“ Answer; â“ What Unit Testing technique you used in Java and Spring?; ðŸ“ Answer |
| interview | `interview\backend\java\08-Architecture.md` | MD |  | 2878 | Angular; ðŸŒ REST API & Controller Design; ðŸš€ Performance & Scalability; ðŸ“¦ Spring Boot Configuration & Production Readiness; ðŸ” Security & Validation; ðŸ§  Exception Handling & Reliability; ðŸ‘¥ Concurrent Users & Data Consistency; ðŸ§ª Testing & Monitoring; ðŸ§­ Managerial & Design Decisions; ðŸ—„ï¸ Database Design & Access (Spring Boot + MySQL); âš™ï¸ JPA / Hibernate Performance; ðŸ”„ Transactions & Data Consistency; ðŸ‘¥ Concurrent Users & Scalability; ðŸ“¦ Query Design & DTO Usage; ðŸš€ Production Issues & Debugging; ðŸ” Data Safety & Integrity; ðŸ§ª Testing & Migration; ðŸ§­ Managerial / Architectural Decisions; ðŸ” End-to-End System Thinking; ðŸŒ API Design & Communication; ðŸ“¦ Deployment & Release Management; âš™ï¸ Configuration & Environment Issues; ðŸ§  State, Caching & Data Freshness; ðŸ” Security & Data Exposure; ðŸ§ª Testing & Quality; ðŸ‘¥ Team & Ownership Questions (Very Managerial); ðŸš¨ Production Incident Handling; ðŸ§­ Architectural Judgment | â“ Our data table loads very slowly when there are thousands of rows. How would you improve its performance?; ðŸ“ Answer; â“ Scrolling the data table feels laggy. What would you check first?; ðŸ“ Answer; â“ Sorting and filtering freeze the UI for a moment. How would you fix this?; ðŸ“ Answer; â“ After adding a data-table library, the bundle size increased a lot. What would you do?; ðŸ“ Answer; â“ The data table is not needed on the home page, but it still affects load time. How would you handle this?; ðŸ“ Answer; â“ The table works fine locally but is slow in production. How would you debug this?; ðŸ“ Answer; â“ API responses are very large and slow down table loading. What would you suggest?; ðŸ“ Answer; â“ How would you verify if GZip compression is working?; ðŸ“ Answer; â“ Two users see different data in the table at the same time. How would you handle this?; ðŸ“ Answer; â“ Filters applied by one user should not affect another user. How would you ensure this?; ðŸ“ Answer; â“ The table data reloads again and again when navigating back. How would you optimize this?; ðŸ“ Answer; â“ How would you decide between using a table library or building your own?; ðŸ“ Answer; â“ A table library causes performance issues but is used across the app. What would you do?; ðŸ“ Answer; â“ The table shows user-generated content. How would you keep it secure?; ðŸ“ Answer; â“ How would you measure table performance in real user environments?; ðŸ“ Answer; â“ A fix for table performance needs major refactoring. How would you plan it?; ðŸ“ Answer; â“ Our REST API is getting hard to maintain as features grow. How would you structure controllers better?; ðŸ“ Answer; â“ Multiple controllers are returning different response formats. How would you standardize this?; ðŸ“ Answer; â“ One controller method is doing validation, business logic, and DB calls. How would you fix this?; ðŸ“ Answer; â“ Our API becomes slow when traffic increases. What would you check first?; ðŸ“ Answer; â“ A single API call returns a very large response and affects performance. How would you optimize it?; ðŸ“ Answer; â“ How would you reduce repeated database calls for the same data?; ðŸ“ Answer; â“ Our application behaves differently in local and production environments. How would you manage this?; ðŸ“ Answer; â“ How would you make sure debug logs donâ€™t affect production performance?; ðŸ“ Answer; â“ The app startup time increased after adding new modules. How would you improve it?; ðŸ“ Answer; â“ How do you protect REST APIs from invalid or malicious input?; ðŸ“ Answer; â“ How would you secure APIs so only authorized users can access them?; ðŸ“ Answer; â“ When an exception happens, users see different error messages. How would you fix this?; ðŸ“ Answer; â“ How would you handle checked and unchecked exceptions in services?; ðŸ“ Answer; â“ Two users update the same record at the same time. How would you handle this?; ðŸ“ Answer; â“ How do you ensure thread safety in a Spring Boot application?; ðŸ“ Answer; â“ How would you test REST controllers properly?; ðŸ“ Answer; â“ How would you monitor API performance in production?; ðŸ“ Answer; â“ The team is divided between quick fixes and long-term refactoring. How would you decide?; ðŸ“ Answer; â“ How would you explain a REST API performance issue to a non-technical manager?; ðŸ“ Answer; â“ If a breaking change is required in an API, how would you manage it?; ðŸ“ Answer; â“ Our database tables are growing very fast and queries are getting slow. What would you check first?; ðŸ“ Answer; â“ A single API call is hitting the database multiple times. How would you optimize this?; ðŸ“ Answer; â“ The same data is being read again and again from MySQL. How would you reduce DB load?; ðŸ“ Answer; â“ Our API is slow even though the database is fast. What could be the issue?; ðŸ“ Answer; â“ How do you decide between `Lazy` and `Eager` fetching?; ðŸ“ Answer; â“ Large result sets are causing memory issues. How would you handle this?; ðŸ“ Answer; â“ Multiple DB operations must succeed or fail together. How would you handle this?; ðŸ“ Answer; â“ Two users update the same record at the same time. How do you prevent data conflicts?; ðŸ“ Answer; â“ When would you use pessimistic locking?; ðŸ“ Answer; â“ Under high traffic, DB connections are getting exhausted. How would you fix this?; ðŸ“ Answer; â“ How do you make sure multiple users donâ€™t affect each otherâ€™s data?; ðŸ“ Answer; â“ Entities are large but APIs need only a few fields. What would you do?; ðŸ“ Answer; â“ Why should controllers not return JPA entities directly?; ðŸ“ Answer; â“ Queries work fine locally but are slow in production. How would you debug this?; ðŸ“ Answer; â“ After a release, database CPU usage increased suddenly. What would you check?; ðŸ“ Answer; â“ How do you prevent invalid data from being saved in MySQL?; ðŸ“ Answer; â“ How do you handle soft deletes instead of hard deletes?; ðŸ“ Answer; â“ How do you manage database schema changes safely?; ðŸ“ Answer; â“ How would you test database logic without affecting real data?; ðŸ“ Answer; â“ When would you avoid using JPA and write native SQL instead?; ðŸ“ Answer; â“ How would you explain a database performance issue to management?; ðŸ“ Answer; â“ If database refactoring is risky, how would you plan it?; ðŸ“ Answer; â“ A screen loads slowly, but itâ€™s unclear whether the issue is frontend, API, or DB. How would you approach this?; ðŸ“ Answer; â“ Frontend says backend is slow, backend says frontend is inefficient. How would you resolve this?; ðŸ“ Answer; â“ Frontend needs frequent API changes, but backend releases are slower. How would you manage this?; ðŸ“ Answer; â“ Angular team requests more data â€œjust in case.â€ How would you respond?; ðŸ“ Answer; â“ A backend change breaks the Angular app after deployment. How would you prevent this?; ðŸ“ Answer; â“ How would you roll out a risky backend change safely?; ðŸ“ Answer; â“ Everything works locally but fails in staging or production. What would you check?; ðŸ“ Answer; â“ How do you ensure Angular points to the correct backend per environment?; ðŸ“ Answer; â“ Cached data improves performance but users see outdated data. How would you balance this?; ðŸ“ Answer; â“ When should data be cached on frontend vs backend?; ðŸ“ Answer; â“ Angular needs user-specific data. How do you ensure users see only their own data?; ðŸ“ Answer; â“ How do you prevent sensitive DB fields from reaching the UI?; ðŸ“ Answer; â“ Bugs keep appearing at integration points. How would you improve quality?; ðŸ“ Answer; â“ How do you ensure performance does not degrade over time?; ðŸ“ Answer; â“ A feature works but is poorly designed. Do you ship or refactor?; ðŸ“ Answer; â“ A junior developer wrote a slow query. How would you handle it?; ðŸ“ Answer; â“ How do you make sure frontend and backend teams stay aligned?; ðŸ“ Answer; â“ Production is slow and users are complaining. What are your first 3 actions?; ðŸ“ Answer; â“ A hotfix is needed quickly. How do you balance speed and safety?; ðŸ“ Answer; â“ When would you split a monolithic Spring Boot app?; ðŸ“ Answer; â“ How do you decide if a problem should be solved in Angular or backend?; ðŸ“ Answer; â“ What challenges you encountered while upgrading Spring or Java?; ðŸ“ Answer; â“ What is Idempotency?; ðŸ“ Answer |
| interview | `interview\frontend\01-HTML.md` | MD | ðŸŒ HTML Interview Preparation | 2307 | ðŸ§± Part 1 â€” Browser Internals & Rendering; ðŸ·ï¸ Part 2 â€” Semantic HTML & Structure; ðŸ§© Part 3 â€” Attributes & Data; â™¿ Part 4 â€” Accessibility (a11y); ðŸ§¬ Part 5 â€” DOM, Performance & Modern Features; ðŸ” Part 6 â€” SEO | â“ How does a browser render a webpage?; ðŸ“ Answer; ðŸ“ Answer; â“ What does "semantic HTML" mean?; ðŸ“ Answer; â“ Difference between `<div>` and `<span>`?; ðŸ“ Answer; â“ Difference between `id` and `class`?; ðŸ“ Answer; â“ Difference between `<section>`, `<article>`, and `<div>`?; ðŸ“ Answer; â“ What are `data-*` attributes?; ðŸ“ Answer; â“ Difference between `<script>`, `async`, and `defer`?; ðŸ“ Answer; â“ How would you explain the difference between preload, prefetch, and preconnect â€” and when would you reach for each?; ðŸ“ Answer; â“ How do you approach accessibility (a11y) in HTML, and what does it mean to you in practice?; ðŸ“ Answer; ðŸ“ Answer; â“ Difference between DOM and Virtual DOM?; ðŸ“ Answer; â“ What are Web Components?; ðŸ“ Answer; ðŸ“ Answer; â“ How does HTML structure impact SEO?; ðŸ“ Answer; ðŸ“ Answer; â“ Is ARIA better than semantic HTML?; ðŸ“ Answer; â“ Does HTML support multithreading?; ðŸ“ Answer; â“ Why does broken HTML still work?; ðŸ“ Answer; â“ Does `display: none` remove an element from the DOM?; ðŸ“ Answer; â“ We're getting complaints that the page feels slow, but the HTML is pretty small. Where would you start debugging?; ðŸ“ Answer; â“ A QA engineer filed a bug â€” screen reader users are hearing content in the wrong order. How would you investigate that?; ðŸ“ Answer; â“ Our mobile users are seeing a broken layout, but everything looks fine on desktop. What would you look for?; ðŸ“ Answer; â“ A user reported they can't operate our form using only the keyboard â€” the buttons aren't responding. What could be causing that?; ðŸ“ Answer; â“ After a major redesign, our SEO rankings dropped significantly. What HTML-related things would you investigate?; ðŸ“ Answer; â“ After a dynamic DOM update, click handlers on some elements stop working. Why does this happen and how would you fix it?; ðŸ“ Answer; â“ Our page scores poorly on CLS in Lighthouse. Walk me through how you'd reduce it.; ðŸ“ Answer |
| interview | `interview\frontend\05-Angular-1.md` | MD | ðŸ…°ï¸ Angular Interview Preparation â€” Part 1 | 3621 |  | â“ How would you describe Angular to someone coming from AngularJS â€” what are the fundamental differences?; ðŸ“ Answer; â“ What types of data binding does Angular support?; ðŸ“ Answer; â“ Can you walk me through the difference between Components and Directives in Angular?; ðŸ“ Answer; â“ Can you explain ViewEncapsulation in Angular and the trade-offs between the available modes?; ðŸ“ Answer; â“ When would you use `::ng-deep` in Angular, and what are the risks of relying on it?; ðŸ“ Answer; â“ What are Angular lifecycle hooks?; ðŸ“ Answer; ðŸ“ Answer; â“ How do `*ngIf` and `*ngFor` work conceptually?; ðŸ“ Answer; ðŸ“ Answer; â“ How do attribute directives work internally?; ðŸ“ Answer; â“ What are the new control flow blocks `@if`, `@for`, `@switch`?; ðŸ“ Answer; â“ How do Standalone Components differ from NgModules?; ðŸ“ Answer; â“ How does `@ViewChild` work, and when would you use it over other approaches to access child elements?; ðŸ“ Answer; â“ Why is direct DOM manipulation via `ElementRef` discouraged? Use `Renderer2` instead?; ðŸ“ Answer; â“ What are Angular pipes? Pure vs Impure?; ðŸ“ Answer; ðŸ“ Answer; ðŸ“ Answer; ðŸ“ Answer; ðŸ“ Answer; ðŸ“ Answer; â“ How does Angular's DI system and hierarchy work?; ðŸ“ Answer; ðŸ“ Answer; ðŸ“ Answer; ðŸ“ Answer; ðŸ“ Answer; â“ What are the core concepts of Angular routing?; ðŸ“ Answer; ðŸ“ Answer; ðŸ“ Answer; ðŸ“ Answer; ðŸ“ Answer; â“ Differences between Template-driven and Reactive forms?; ðŸ“ Answer; â“ What happens when you mix `[(ngModel)]` with Reactive Forms?; ðŸ“ Answer; â“ How do you create a custom form control in Angular? (`ControlValueAccessor`); ðŸ“ Answer; â“ How would you globally trim leading and trailing spaces from user input?; ðŸ“ Answer; â“ What are Signals in Angular?; ðŸ“ Answer |
| interview | `interview\frontend\05-Angular-2.md` | MD | ðŸ…°ï¸ Angular Interview Prep â€” Part 2: Change Detection, Build System & Advanced Topics | 1778 | ðŸ”¹ Bundlers & Dev Servers; ðŸŽ“ Final Cheat Sheet | â“ How does Angular's change detection mechanism work, and how did it evolve from AngularJS?; ðŸ“ Answer; â“ Explain Angular's building tools and how they have evolved.; ðŸ“ Answer; Webpack (Pre-v17 Angular default); Vite (Angular v17+ default); ðŸ“… Angular Build Tooling Timeline; Rendering Engines; Compilation Modes; ðŸ†š View Engine vs Ivy; â“ Can you walk me through how HMR works and how Angular integrates it into the dev server?; ðŸ“ Answer; ðŸ”„ What happens when you save a file?; ðŸ“ Answer; ðŸŽ¯ Quick Interview Lightning Round; â“ How do you preserve form data on refresh but clear it on browser close?; ðŸ“ Answer; ðŸ“ Answer; â“ How do you hide backend endpoints from the browser's Network tab?; ðŸ“ Answer; â“ Can we jump from Angular 5 â†’ Angular 19 directly?; ðŸ“ Answer; â“ Name some deprecated/removed concepts from Angular 5 â†’ 19.; ðŸ“ Answer |
| interview | `interview\frontend\06-React.md` | MD |  | 2267 |  | â“ What are the main differences between React class components and function components?; ðŸ“ Answer; â“ Explain React Hooks rules. What happens if you break them?; ðŸ“ Answer; â“ How does Reactâ€™s reconciliation (diffing) algorithm work?; ðŸ“ Answer; â“ Why are keys important in lists? What are bad keys?; ðŸ“ Answer; â“ What is `useEffect` and common pitfalls?; ðŸ“ Answer; â“ Whatâ€™s the difference between `useEffect` and `useLayoutEffect`?; ðŸ“ Answer; â“ Explain `useMemo` and `useCallback`. When to use them?; ðŸ“ Answer; â“ What is Reactâ€™s Strict Mode and why might effects run twice in dev?; ðŸ“ Answer; â“ Explain React 18 concurrent rendering in simple terms.; ðŸ“ Answer; â“ What is `Suspense` and how is it used?; ðŸ“ Answer; â“ How does server-side rendering (SSR) work with React?; ðŸ“ Answer; â“ What is hydration and what can go wrong?; ðŸ“ Answer; â“ How do you manage global state in a large React app?; ðŸ“ Answer; â“ What are common performance optimization techniques in React?; ðŸ“ Answer; â“ Explain controlled vs uncontrolled components in forms.; ðŸ“ Answer; â“ How do you handle errors in React components?; ðŸ“ Answer; â“ How do you test React components?; ðŸ“ Answer; â“ What are custom hooks and why use them?; ðŸ“ Answer; â“ How do you handle authentication flows in React?; ðŸ“ Answer; â“ How to avoid prop drilling?; ðŸ“ Answer; â“ Explain â€œlifting state upâ€ with an example.; ðŸ“ Answer; â“ What is `React.forwardRef` and when to use it?; ðŸ“ Answer; â“ What is the difference between `useRef` and `useState`?; ðŸ“ Answer; â“ How do you handle large lists efficiently in React?; ðŸ“ Answer; â“ How do you ensure accessibility (a11y) in React apps?; ðŸ“ Answer; â“ How do you prevent unnecessary re-renders in child components?; ðŸ“ Answer; â“ Whatâ€™s the difference between `ReactDOM.render` and `createRoot`?; ðŸ“ Answer; â“ How do you organize a large-scale React project?; ðŸ“ Answer; â“ How do you handle side effects like API calls in React?; ðŸ“ Answer; â“ Explain a â€œtrickâ€ question: Why doesnâ€™t this state update immediately?; ðŸ“ Answer; â“ Trick: Whatâ€™s wrong with this effect?; ðŸ“ Answer; â“ Trick: Why is this component re-rendering even with `React.memo`?; ðŸ“ Answer; â“ How do you type React components and hooks with TypeScript?; ðŸ“ Answer; â“ How do you implement code-splitting in React?; ðŸ“ Answer; â“ How do you debounce or throttle events in React?; ðŸ“ Answer; â“ How do you make a reusable modal component in React?; ðŸ“ Answer; â“ How do you implement dark/light theme toggling?; ðŸ“ Answer; â“ How do you handle file uploads in React?; ðŸ“ Answer; â“ How do you secure a React app against XSS?; ðŸ“ Answer; â“ How do you debug React performance issues?; ðŸ“ Answer |
| interview | `interview\frontend\06-RxJS.md` | MD | ðŸŒŠ RxJS Interview Prep â€” Reactive Programming Mastery | 3897 | ðŸŽ“ Final Cheat Sheet | â“ How would you explain RxJS to a developer who's never used reactive programming before?; ðŸ“ Answer; â“ Can you walk me through what an Observable is and how it differs from a Promise?; ðŸ“ Answer; â“ What role does an Observer play in RxJS, and how does it interact with an Observable?; ðŸ“ Answer; â“ What does a Subscription represent in RxJS, and why is managing it important?; ðŸ“ Answer; â“ Can you explain what an RxJS operator is and how operators are composed in a pipeline?; ðŸ“ Answer; â“ What's the difference between Pipeable and Creation operators?; ðŸ“ Answer; â“ Is an Observable lazy or eager?; ðŸ“ Answer; â“ Can Observables be synchronous?; ðŸ“ Answer; â“ What are the three notifications an Observable can emit?; ðŸ“ Answer; â“ Can an Observable emit after `complete`?; ðŸ“ Answer; â“ How would you describe a Cold Observable, and when does it matter whether an Observable is cold or hot?; ðŸ“ Answer; ðŸ“ Answer; ðŸ“ Answer; â“ `share()` vs `shareReplay()` â€” explain with example; ðŸ“ Answer; â“ ðŸª¤ Trick: What's a common memory leak pitfall with `shareReplay`?; ðŸ“ Answer; â“ Can you explain what a Subject is in RxJS and when you'd reach for it over a plain Observable?; ðŸ“ Answer; ðŸ“ Answer; â“ ðŸª¤ Trick: Does `BehaviorSubject` emit its current value immediately on subscription?; ðŸ“ Answer; â“ ðŸª¤ Trick: Can a `Subject` emit values before anyone subscribes?; ðŸ“ Answer; â“ ðŸª¤ Trick: What happens if you call `.next()` on a completed `Subject`?; ðŸ“ Answer; â“ Why is exposing a `BehaviorSubject` directly from a service considered a design smell?; ðŸ“ Answer; â“ What does `map` do?; ðŸ“ Answer; ðŸ“ Answer; ðŸ“ Answer; ðŸ“ Answer; â“ Difference between `map` and `switchMap`?; ðŸ“ Answer; â“ Explain `mergeMap` (a.k.a. `flatMap`); ðŸ“ Answer; ðŸ“ Answer; ðŸ“ Answer; ðŸ§  The Big Four â€” Visual Comparison; â“ ðŸª¤ Trick: For autocomplete search, which operator is best?; ðŸ“ Answer; â“ ðŸª¤ Trick: For a login button that must ignore double-clicks, which operator?; ðŸ“ Answer; â“ ðŸª¤ Trick: For a queue of tasks executed strictly in order, which operator?; ðŸ“ Answer; â“ Difference between `combineLatest` and `forkJoin`?; ðŸ“ Answer; â“ Difference between `merge` and `concat`?; ðŸ“ Answer; â“ What does `withLatestFrom` do?; ðŸ“ Answer; â“ Use case for `race`?; ðŸ“ Answer; â“ ðŸª¤ Trick: Does `combineLatest([a$, b$])` emit if `a$` emits but `b$` has never emitted?; ðŸ“ Answer; â“ How does `catchError` work?; ðŸ“ Answer; ðŸ“ Answer; ðŸ“ Answer; ðŸ“ Answer; ðŸ“ Answer; â“ ðŸª¤ Trick: If you `catchError` and return `EMPTY`, does the stream complete?; ðŸ“ Answer; â“ ðŸª¤ Trick: Can `catchError` swallow an error and keep the outer stream alive?; ðŸ“ Answer; â“ Can you explain what a Scheduler is in RxJS and when you'd need to explicitly specify one?; ðŸ“ Answer; â“ Why might you use `observeOn(asyncScheduler)`?; ðŸ“ Answer; â“ How does RxJS interact with Angular's Zones and Change Detection?; ðŸ“ Answer; â“ How does Angular's `HttpClient` use RxJS?; ðŸ“ Answer; â“ ðŸª¤ Trick: If you subscribe twice to the same `this.http.get(...)`, how many HTTP calls happen?; ðŸ“ Answer; â“ How do you avoid multiple HTTP calls when many components need the same data?; ðŸ“ Answer; â“ What does the `async` pipe do?; ðŸ“ Answer; â“ When should you NOT use the `async` pipe?; ðŸ“ Answer; â“ How would you model component state using RxJS?; ðŸ“ Answer; â“ Example: How to debounce a search input in Angular?; ðŸ“ Answer; â“ How does RxJS fit into NgRx?; ðŸ“ Answer; â“ How do memory leaks occur with RxJS in Angular?; ðŸ“ Answer; ðŸ“ Answer; ðŸ“ Answer; â“ ðŸª¤ Trick: Does a `BehaviorSubject` with no subscribers cause a memory leak by itself?; ðŸ“ Answer; â“ ðŸª¤ Trick: Does `subscribe` return a Promise?; ðŸ“ Answer; â“ ðŸª¤ Trick: If you call `unsubscribe()` on a completed stream, what happens?; ðŸ“ Answer; â“ ðŸª¤ Trick: Will `map` execute if no one subscribes?; ðŸ“ Answer; â“ ðŸª¤ Trick: Does `tap` change the emitted values?; ðŸ“ Answer; â“ ðŸª¤ Trick: `interval(1000).pipe(take(0))` â€” does it emit anything?; ðŸ“ Answer; â“ ðŸª¤ Trick: `from([1,2,3]).pipe(switchMap(x => of(x)))` â€” can any values be cancelled?; ðŸ“ Answer; â“ ðŸª¤ Trick: `share()` vs `shareReplay(1)` for HTTP caching?; ðŸ“ Answer; â“ Mock: You have an infinite WebSocket stream. Some components need it; others don't. Design?; ðŸ“ Answer; â“ Mock: File upload progress with cancel support. RxJS approach?; ðŸ“ Answer; â“ Mock: Poll a backend every 10s, but stop on navigation away or error.; ðŸ“ Answer; â“ Mock: Combine backend prefs + local UI overrides. Model with RxJS?; ðŸ“ Answer; â“ Mock: Three dependent HTTP calls â€” B depends on A, C depends on B. Implementation?; ðŸ“ Answer; â“ Mock: Debounce keystrokes, but execute immediately on Enter key.; ðŸ“ Answer; â“ Mock: Wizard where each step depends on the previous result and can be retried. Operator choices?; ðŸ“ Answer; â“ You have two REST APIs:; ðŸ“ Answer; `toSignal(observable$)` â€” Observable â†’ Signal; `toObservable(signal)` â€” Signal â†’ Observable |
| interview | `interview\frontend\09-Web_Architecture.md` | MD | ðŸ—ï¸ Web Architecture Interview Prep â€” MEAN, Scalability & System Design | 4412 | ðŸŽ“ Final Cheat Sheet | â“ Explain the high-level MEAN stack architecture; ðŸ“ Answer; â“ Explain the complete request lifecycle in a MEAN application; ðŸ“ Answer; â“ How does Express middleware execution order work?; ðŸ“ Answer; â“ How do you implement authentication in MEAN applications?; ðŸ“ Answer; ðŸ“ Answer; â“ How do you secure APIs beyond authentication?; ðŸ“ Answer; â“ How do you prevent XSS and injection attacks?; ðŸ“ Answer; â“ Explain CORS and how you configure it correctly; ðŸ“ Answer; â“ How do you manage environment configurations?; ðŸ“ Answer; â“ How do you structure a large Node.js backend?; ðŸ“ Answer; â“ Can you walk me through the Backend-for-Frontend pattern and describe a situation where you'd recommend it?; ðŸ“ Answer; â“ How do you optimize Angular performance?; ðŸ“ Answer; â“ Explain Angular route guards; ðŸ“ Answer; â“ Why is Node.js suitable for high-concurrency systems?; ðŸ“ Answer; ðŸ“ Answer; ðŸ“ Answer; â“ How do you design scalable APIs?; ðŸ“ Answer; â“ How would you explain API idempotency, and can you give an example of where it could go wrong if ignored?; ðŸ“ Answer; â“ How do you implement caching effectively?; ðŸ“ Answer; â“ How do you optimize MongoDB performance?; ðŸ“ Answer; ðŸ“ Answer; â“ How do you handle secure file uploads?; ðŸ“ Answer; â“ How do you prevent API abuse?; ðŸ“ Answer; â“ How do you prevent accidental data leaks?; ðŸ“ Answer; â“ How do you handle partial failures in distributed systems?; ðŸ“ Answer; â“ What happens if MongoDB goes down?; ðŸ“ Answer; â“ What happens when Node.js crashes in production?; ðŸ“ Answer; â“ How do you design logging for production?; ðŸ“ Answer; ðŸ“ Answer; â“ How do you manage secrets securely?; ðŸ“ Answer; â“ How do you handle deployments?; ðŸ“ Answer; â“ How do you ensure high availability?; ðŸ“ Answer; â“ How do you debug slow APIs in production?; ðŸ“ Answer; â“ How do you protect frontend applications?; ðŸ“ Answer; â“ How do you design for traffic spikes?; ðŸ“ Answer; â“ Final Question: Design a MEAN system for 1 million users; ðŸ“ Answer |
| practice | `practice\coding\02-css-coding.md` | MD | ðŸŽ¨ CSS Coding Interview Questions | 1084 |  | â“ How would you center a div both vertically and horizontally? Walk me through the different approaches.; ðŸ“ Answer; â“ How would you convert a row layout to a column layout on mobile using CSS?; ðŸ“ Answer; â“ How would you make a div perfectly circular using only CSS?; ðŸ“ Answer; â“ How do you make an element stick to the top of the viewport while the user scrolls?; ðŸ“ Answer; â“ A developer used `margin: auto` expecting vertical centering, but it didn't work. What's the issue and how would you fix it?; ðŸ“ Answer; â“ How would you build a responsive 3-column grid that collapses to a single column on mobile?; ðŸ“ Answer; â“ How do you truncate overflowing text with an ellipsis after exactly 2 lines?; ðŸ“ Answer; â“ How would you build a full-page modal overlay using CSS?; ðŸ“ Answer; â“ Can you create a loading spinner using only CSS â€” no JavaScript, no images?; ðŸ“ Answer; â“ How would you build a custom styled checkbox or toggle switch using only CSS?; ðŸ“ Answer; â“ Design a User Profile Card UI component using CSS â€” what would your approach be?; ðŸ“ Answer |
| practice | `practice\coding\03-angular-coding.md` | MD | ðŸ…°ï¸ Angular Coding Interview Prep â€” Mock Tasks & Patterns | 2402 | 1ï¸âƒ£ User Model; 2ï¸âƒ£ Data Service â€” API + Caching + State Retention; 3ï¸âƒ£ User List Component (Table + Routing); 4ï¸âƒ£ Reactive Form Component (Add User); 5ï¸âƒ£ Dialog Component (Edit User + Unsaved Changes Guard); 6ï¸âƒ£ Details Page (No Extra API Call); 7ï¸âƒ£ Custom Pipe (Phone Formatter); 8ï¸âƒ£ Custom Directive (Invalid Highlight); 9ï¸âƒ£ Routing Module; ðŸ”Ÿ Auth Model & Service; 1ï¸âƒ£1ï¸âƒ£ `CanMatch` Guard; 1ï¸âƒ£2ï¸âƒ£ Lazy-loaded Admin Component; âœ… Design Decisions Summary; âœ… Full Implementation; ðŸ§  Operator-by-Operator Explanation; âš ï¸ Common Pitfall â€” `mergeMap` vs `switchMap`; ðŸŽ Bonus Improvements to Mention; ðŸ†š Classic vs Signal-based â€” What Changed?; ðŸŽ Bonus: Why this matters in interviews; ðŸŽ“ Final Cheat Sheet | â“ Build a small Angular application that manages users. It should load initial data from an API, allow CRUD operations, use forms, routing, dialogs, caching, and some custom Angular features. Explain your design decisions.; ðŸ“ Answer; ðŸ§  What to explain to the interviewer; â“ You are building a search autocomplete. You must debounce user input, avoid multiple API calls, cache results for 5 minutes, and cancel stale requests. How would you design this in Angular using RxJS?; ðŸ“ Answer; â“ Rebuild the autocomplete using Angular Signals + RxJS interop. How does it differ from the classic approach?; ðŸ“ Answer |

### scripts\reports\javascript-canonical-evidence.md
> 💡 **Use cases**: configuring functions in advance (`const log = curry((level, msg) => ...); const error = log("ERROR");`), functional programming pipelines.
> - Use **arrow functions** for callbacks where you want to keep the outer `this` (e.g., inside class methods, in array methods inside React components)
**Components:**

### scripts\reports\sql-canonical-evidence.md
<h2>2. Inside the Engine Pipeline</h2>
<li>Your query doesn't go straight to the hard drive. It passes through a complex pipeline.</li>
<p><strong>The Expert Answer:</strong> Both filter data, but at completely different pipeline stages.</p>
<li><strong>EXTRACT():</strong> Pulls a specific integer component (like the Year or Month) out of a timestamp for grouping logic.</li>
SELECT REPLACE('Java Developer', 'Java', 'Angular');
-- Angular Developer

### scripts\reports\sql-masterclass-structure.md
- 2. Inside the Engine Pipeline

### README.md
# \- Angular Masterclass
# > Give me Angular interview questions.


## React

### interview\architecture\01-web-vitals.md
import { renderToString } from "react-dom/server";

### interview\architecture\02-aws-cloud.md
| **Amazon EventBridge**                       | A serverless event bus that enables event-driven architectures by routing events from AWS services, SaaS applications, or custom applications to targets like Lambda. It allows loosely coupled systems to react to events in real time.                                   |

### interview\backend\java\03-Spring-1.md
BeanFactory factory = new ClassPathXmlApplicationContext("beans.xml");
ðŸ”¹ **ApplicationContext (Advanced â€“ Most Used)**
ApplicationContext is the advanced Spring container
ApplicationContext context =
new AnnotationConfigApplicationContext(AppConfig.class);
// âž¡ Spring Boot automatically creates an ApplicationContext. You never see BeanFactory
AnnotationConfigApplicationContext context =
new AnnotationConfigApplicationContext(AppConfig.class);
// âž¡ Still ApplicationContext
> **Spring Boot always uses ApplicationContext**
| `application` | One per ServletContext               |
public static ConfigurableApplicationContext run(
public static ConfigurableApplicationContext run(Class<?> primarySource, String... args) {
ðŸ”¹ Application Type Detection (Servlet vs Reactive)
| `org.springframework.web.reactive.DispatcherHandler` | REACTIVE (WebFlux)           |
2. Create ApplicationContext
4. Refresh context
ðŸ”¹ ApplicationContext Creation
// 1. Create a new ApplicationContext instance
AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext();
context.register(AppConfig.class) // Optional in Spring Boot
It creates an empty Spring ApplicationContext object that is capable of:
context.refresh();
ConditionContext context,
String env = context.getEnvironment()
| **Spring Web Layer**                 | Spring MVC, Spring WebFlux (Reactive)                                   |
void contextLoads() {

### interview\backend\java\03-Spring-2.md
save() â†’ entity stored in persistence context

### interview\backend\java\04-Spring-annotation.md
| `@ApplicationScope`          | Class level                        | One bean per ServletContext (shared across the whole web app).                               |

### interview\backend\java\05-Spring-Security.md
Spring Security solves this using **filters**, **contexts**, and **standard security patterns**.
Spring Security automatically looks for a `CorsConfigurationSource` bean in the application context and wires it into the `CorsFilter`
- Token is stored in client-side memory (E.g `useState`, `NgRx`) or localstorage, sessionStorage

### interview\backend\java\06-Spring-Cloud.md
2. WebClient (reactive, non-blocking)
- Config is injected into the application context
- Config is loaded **before** application context
ðŸ¤”â“ How is trace context propagated between services?
- Trace context travels via **HTTP headers**
> Distributed tracing allows us to track a request end-to-end across multiple microservices using a traceId and spans. In Spring Boot, tracing is mostly automatic using Micrometer Tracing, with optional custom spans. It relies on context propagation via HTTP headers and integrates with backends like Zipkin or Jaeger. Tracing is essential for debugging latency and failures in distributed systems.
- Use **Bounded Context**
- Identify **bounded contexts**

### interview\backend\java\08-Architecture.md
Iâ€™d enforce authorization in the backend using user context, not rely on frontend filtering.
- Mock failures / context load issues

### interview\frontend\01-HTML.md
| Browser-managed | JS-managed (React, Vue) |

### interview\frontend\02-CSS.md
| `relative` | ✅     | Itself                 | Creates positioning context for absolute children |
> **Bonus**: `z-index` also works on flex/grid items even without `position`. And `transform`, `filter`, `opacity < 1` create new **stacking contexts** that can trap `z-index`.
.container { overflow: auto; }     /* changes scroll context */
- Move dropdown to `body` via portal/teleport (React, Vue)

### interview\frontend\03-JavaScript.md
> - Use **arrow functions** for callbacks where you want to keep the outer `this` (e.g., inside class methods, in array methods inside React components)

### interview\frontend\05-Angular-1.md
#### ↳ **Follow-up:** Can directives have lifecycle hooks?
# ♻️ Part 3 — Lifecycle Hooks
### ❓ What are Angular lifecycle hooks?
Lifecycle hooks let you tap into key moments in a component's life.
| `ngOnChanges`           | Whenever an `@Input()` value changes        | React to parent updates             |
| `ngAfterContentChecked` | After every projected content check         | React to content changes            |
**`AsyncPipe` is impure** (`pure: false`) — it must react to Observable/Promise emissions that happen without reference changes.
// Observable (reacts to changes)
### ❓ Differences between Template-driven and Reactive forms?
| Feature             | Template-driven           | Reactive                    |
| Setup               | `FormsModule` + `ngModel` | `ReactiveFormsModule` + `FormGroup` |
**Reactive form example:**
### ❓ What happens when you mix `[(ngModel)]` with Reactive Forms?
> 💡 **Stick to one approach** per form. Use Reactive for complex forms.
**Signals** (Angular 16+) are a new reactivity primitive — values that **notify consumers** when they change.

### interview\frontend\05-Angular-2.md
Angular's change detection is the process by which the framework figures out **what changed in your data** and **updates the DOM accordingly**. The mechanism has evolved significantly — from AngularJS's "dirty checking with digest cycles" to today's **Zone-based detection** and the newer **Signal-based reactivity**.
#### 🚀 Signals (Angular 16+) — The New Reactivity Model

### interview\frontend\06-React.md
### â“ What are the main differences between React class components and function components?
- Function components are simpler, use hooks, and are now the recommended approach.
- Hooks let you share logic more easily than HOCs/render props.
```jsx
const [count, setCount] = React.useState(0);
### â“ Explain React Hooks rules. What happens if you break them?
- Only call hooks:
2. Only inside React function components or custom hooks.
- If you break them, hook order changes between renders and React will read wrong internal state â†’ bugs or runtime errors.
```jsx
const [value, setValue] = React.useState(0); // always first hook
const [text, setText] = React.useState(""); // always second hook
### â“ How does Reactâ€™s reconciliation (diffing) algorithm work?
- React builds a virtual DOM tree.
- For lists, `key` helps React match items and avoid unnecessary re-renders.
```jsx
```jsx
### â“ What is `useEffect` and common pitfalls?
- `useEffect` runs side-effects after render (API calls, subscriptions, DOM, timers).
```jsx
useEffect(() => {
### â“ Whatâ€™s the difference between `useEffect` and `useLayoutEffect`?
- `useEffect` runs after paint (async, non-blocking).
```jsx
```jsx
### â“ What is Reactâ€™s Strict Mode and why might effects run twice in dev?
- `<React.StrictMode>` helps find side-effect issues.
- In React 18 dev, React intentionally mounts, unmounts, and re-mounts components to detect unsafe effects.
- This makes `useEffect` run twice in dev (but not in production).
```jsx
const root = ReactDOM.createRoot(document.getElementById("root"));
<React.StrictMode>
</React.StrictMode>
### â“ Explain React 18 concurrent rendering in simple terms.
- Concurrent rendering lets React pause, resume, and discard renders.
```jsx
import { startTransition, useState } from "react";
const [value, setValue] = useState("");
const [results, setResults] = useState([]);
- `Suspense` lets you show a fallback while some child â€œwaitsâ€ (lazy-loaded component, or data with React 18 libs).
- The component throws a promise; React shows fallback until it resolves.
```jsx
const UserProfile = React.lazy(() => import("./UserProfile"));
### â“ How does server-side rendering (SSR) work with React?
- Server renders React components to HTML.
- Tools: Next.js, Remix, or `react-dom/server` directly.
import { renderToString } from "react-dom/server";
- React logs hydration mismatch warnings.
```jsx
const [now] = useState(() => Date.now()); // initialized once
### â“ How do you manage global state in a large React app?
- React Context for simple global state.
```jsx
const ThemeContext = React.createContext();
const [theme, setTheme] = useState("dark");
<ThemeContext.Provider value={{ theme, setTheme }}>
</ThemeContext.Provider>
const { theme } = React.useContext(ThemeContext);
### â“ What are common performance optimization techniques in React?
- Memoization: `React.memo`, `useMemo`, `useCallback`.
- Split code: `React.lazy`, dynamic imports.
```jsx
const ListItem = React.memo(function ListItem({ item }) {
- Controlled: React state is the single source of truth; input value comes from state.
```jsx
const [name, setName] = useState("");
### â“ How do you handle errors in React components?
```jsx
class ErrorBoundary extends React.Component {
### â“ How do you test React components?
- React Testing Library (preferred).
```jsx
import { render, screen } from "@testing-library/react";
### â“ What are custom hooks and why use them?
- Custom hooks are functions that use hooks and start with `use`.
```jsx
const [width, setWidth] = useState(window.innerWidth);
useEffect(() => {
### â“ How do you handle authentication flows in React?
- Store auth state (token/user) in context or global store.

### interview\frontend\06-RxJS.md
# 🌊 RxJS Interview Prep — Reactive Programming Mastery
### ❓ How would you explain RxJS to a developer who's never used reactive programming before?
RxJS (Reactive Extensions for JavaScript) is a library for **reactive programming** using **Observables**. It lets you compose async and event-based programs using a functional, declarative pipeline of operators.
An object with up to three callbacks that defines **how to react** to Observable emissions:
When you want to **listen to several Observables but only react to the one that emits first** (like `Promise.race`).
A centralized way to control **when** and **in which execution context** Observable notifications are delivered.
Available in Angular 16+, this operator hooks into the component's `DestroyRef` automatically:
// Inside a component (must be in injection context, e.g., constructor or field initializer)

### interview\frontend\09-Web_Architecture.md
[Angular updates view reactively]
A user action in Angular triggers an HTTP request through a service. Before the request leaves the browser, Angular **HTTP interceptors** attach headers like JWT tokens. The request reaches the Node.js server, where Express middleware processes it sequentially — authentication, authorization, validation, and logging. The controller invokes business services, which interact with MongoDB. The response flows back through middleware, is serialized as JSON, and Angular updates the UI reactively.
**CORS (Cross-Origin Resource Sharing)** is a **browser** security mechanism, not a backend security feature. It controls which origins can make cross-origin requests to your API from a browser context.
| **Signals (16+)** | Fine-grained reactivity, no full tree traversal |

### knowledge\concepts\README.md
- Give the AI Tutor a stable source for retrieval and contextual answers.
- Interview and practice files provide contextual examples and assessment material.
- Visual notes provide image-based supporting context.
- Masterclasses provide deeper learning context.

### knowledge\concepts\_canonical-candidates.md
| **React** | `interview\frontend\06-React.md` | Frontend framework/library concept |

### knowledge\concepts\_CONCEPT_TEMPLATE.md
Explain why the concept is relevant in the context of this repository.

### knowledge\masterclasses\SQL_MasterClass.html
<li><strong>OVER():</strong> Defines the context "window". If left empty, the window is the entire result set.</li>

### practice\coding\02-css-coding.md
> 💡 Hides native checkbox, uses `:checked + .slider` to react to state.

### practice\coding\03-angular-coding.md
- ✅ Reactive forms with validation
## 4️⃣ Reactive Form Component (Add User)
> ⚠️ **Why Reactive Forms over Template-driven?**
> Reactive forms give you a typed, programmatic API — perfect for senior code with complex validation, dynamic controls, and unit tests.
| Reactive forms | Programmatic, typed, testable |
| Mental model | "Push values into a stream" | "Reactively derive values" |
- ✅ Know about Angular 16+ reactivity primitives
> 🚀 **You've got the patterns.** Now in your live coding round, narrate as you go: "First I'll set up the model… then a service with caching… now the form with reactive validation…" — interviewers love narration.

### projects\README.md
- Movie Search App (React Query + API)

### roadmap\foundations\README.md
- Movie Search App (React Query + API)

### roadmap\frontend\README.backup.md
- React

### roadmap\frontend\README.md
- Movie Search App (React Query + API)

### roadmap\README.md
A comprehensive, step-by-step roadmap for a Full-Stack Developer. Covers modern frontend, backend, DevOps, and performance practices using TypeScript, React, Next.js, NestJS, PostgreSQL, and Docker.

### scripts\reports\canonical-topic-map.md
| TypeScript | â€” | â€” | interview\frontend\04-TypeScript.md; interview\frontend\06-React.md | â€” | â€” |
| React | â€” | â€” | interview\frontend\05-Angular-1.md; interview\frontend\06-React.md; interview\frontend\06-RxJS.md | practice\coding\03-angular-coding.md | â€” |
- **React** â€” missing: Roadmap, Knowledge

### scripts\reports\content-inventory.md
| interview | `interview\frontend\05-Angular-1.md` | MD | ðŸ…°ï¸ Angular Interview Preparation â€” Part 1 | 3621 |  | â“ How would you describe Angular to someone coming from AngularJS â€” what are the fundamental differences?; ðŸ“ Answer; â“ What types of data binding does Angular support?; ðŸ“ Answer; â“ Can you walk me through the difference between Components and Directives in Angular?; ðŸ“ Answer; â“ Can you explain ViewEncapsulation in Angular and the trade-offs between the available modes?; ðŸ“ Answer; â“ When would you use `::ng-deep` in Angular, and what are the risks of relying on it?; ðŸ“ Answer; â“ What are Angular lifecycle hooks?; ðŸ“ Answer; ðŸ“ Answer; â“ How do `*ngIf` and `*ngFor` work conceptually?; ðŸ“ Answer; ðŸ“ Answer; â“ How do attribute directives work internally?; ðŸ“ Answer; â“ What are the new control flow blocks `@if`, `@for`, `@switch`?; ðŸ“ Answer; â“ How do Standalone Components differ from NgModules?; ðŸ“ Answer; â“ How does `@ViewChild` work, and when would you use it over other approaches to access child elements?; ðŸ“ Answer; â“ Why is direct DOM manipulation via `ElementRef` discouraged? Use `Renderer2` instead?; ðŸ“ Answer; â“ What are Angular pipes? Pure vs Impure?; ðŸ“ Answer; ðŸ“ Answer; ðŸ“ Answer; ðŸ“ Answer; ðŸ“ Answer; ðŸ“ Answer; â“ How does Angular's DI system and hierarchy work?; ðŸ“ Answer; ðŸ“ Answer; ðŸ“ Answer; ðŸ“ Answer; ðŸ“ Answer; â“ What are the core concepts of Angular routing?; ðŸ“ Answer; ðŸ“ Answer; ðŸ“ Answer; ðŸ“ Answer; ðŸ“ Answer; â“ Differences between Template-driven and Reactive forms?; ðŸ“ Answer; â“ What happens when you mix `[(ngModel)]` with Reactive Forms?; ðŸ“ Answer; â“ How do you create a custom form control in Angular? (`ControlValueAccessor`); ðŸ“ Answer; â“ How would you globally trim leading and trailing spaces from user input?; ðŸ“ Answer; â“ What are Signals in Angular?; ðŸ“ Answer |
| interview | `interview\frontend\06-React.md` | MD |  | 2267 |  | â“ What are the main differences between React class components and function components?; ðŸ“ Answer; â“ Explain React Hooks rules. What happens if you break them?; ðŸ“ Answer; â“ How does Reactâ€™s reconciliation (diffing) algorithm work?; ðŸ“ Answer; â“ Why are keys important in lists? What are bad keys?; ðŸ“ Answer; â“ What is `useEffect` and common pitfalls?; ðŸ“ Answer; â“ Whatâ€™s the difference between `useEffect` and `useLayoutEffect`?; ðŸ“ Answer; â“ Explain `useMemo` and `useCallback`. When to use them?; ðŸ“ Answer; â“ What is Reactâ€™s Strict Mode and why might effects run twice in dev?; ðŸ“ Answer; â“ Explain React 18 concurrent rendering in simple terms.; ðŸ“ Answer; â“ What is `Suspense` and how is it used?; ðŸ“ Answer; â“ How does server-side rendering (SSR) work with React?; ðŸ“ Answer; â“ What is hydration and what can go wrong?; ðŸ“ Answer; â“ How do you manage global state in a large React app?; ðŸ“ Answer; â“ What are common performance optimization techniques in React?; ðŸ“ Answer; â“ Explain controlled vs uncontrolled components in forms.; ðŸ“ Answer; â“ How do you handle errors in React components?; ðŸ“ Answer; â“ How do you test React components?; ðŸ“ Answer; â“ What are custom hooks and why use them?; ðŸ“ Answer; â“ How do you handle authentication flows in React?; ðŸ“ Answer; â“ How to avoid prop drilling?; ðŸ“ Answer; â“ Explain â€œlifting state upâ€ with an example.; ðŸ“ Answer; â“ What is `React.forwardRef` and when to use it?; ðŸ“ Answer; â“ What is the difference between `useRef` and `useState`?; ðŸ“ Answer; â“ How do you handle large lists efficiently in React?; ðŸ“ Answer; â“ How do you ensure accessibility (a11y) in React apps?; ðŸ“ Answer; â“ How do you prevent unnecessary re-renders in child components?; ðŸ“ Answer; â“ Whatâ€™s the difference between `ReactDOM.render` and `createRoot`?; ðŸ“ Answer; â“ How do you organize a large-scale React project?; ðŸ“ Answer; â“ How do you handle side effects like API calls in React?; ðŸ“ Answer; â“ Explain a â€œtrickâ€ question: Why doesnâ€™t this state update immediately?; ðŸ“ Answer; â“ Trick: Whatâ€™s wrong with this effect?; ðŸ“ Answer; â“ Trick: Why is this component re-rendering even with `React.memo`?; ðŸ“ Answer; â“ How do you type React components and hooks with TypeScript?; ðŸ“ Answer; â“ How do you implement code-splitting in React?; ðŸ“ Answer; â“ How do you debounce or throttle events in React?; ðŸ“ Answer; â“ How do you make a reusable modal component in React?; ðŸ“ Answer; â“ How do you implement dark/light theme toggling?; ðŸ“ Answer; â“ How do you handle file uploads in React?; ðŸ“ Answer; â“ How do you secure a React app against XSS?; ðŸ“ Answer; â“ How do you debug React performance issues?; ðŸ“ Answer |
| interview | `interview\frontend\06-RxJS.md` | MD | ðŸŒŠ RxJS Interview Prep â€” Reactive Programming Mastery | 3897 | ðŸŽ“ Final Cheat Sheet | â“ How would you explain RxJS to a developer who's never used reactive programming before?; ðŸ“ Answer; â“ Can you walk me through what an Observable is and how it differs from a Promise?; ðŸ“ Answer; â“ What role does an Observer play in RxJS, and how does it interact with an Observable?; ðŸ“ Answer; â“ What does a Subscription represent in RxJS, and why is managing it important?; ðŸ“ Answer; â“ Can you explain what an RxJS operator is and how operators are composed in a pipeline?; ðŸ“ Answer; â“ What's the difference between Pipeable and Creation operators?; ðŸ“ Answer; â“ Is an Observable lazy or eager?; ðŸ“ Answer; â“ Can Observables be synchronous?; ðŸ“ Answer; â“ What are the three notifications an Observable can emit?; ðŸ“ Answer; â“ Can an Observable emit after `complete`?; ðŸ“ Answer; â“ How would you describe a Cold Observable, and when does it matter whether an Observable is cold or hot?; ðŸ“ Answer; ðŸ“ Answer; ðŸ“ Answer; â“ `share()` vs `shareReplay()` â€” explain with example; ðŸ“ Answer; â“ ðŸª¤ Trick: What's a common memory leak pitfall with `shareReplay`?; ðŸ“ Answer; â“ Can you explain what a Subject is in RxJS and when you'd reach for it over a plain Observable?; ðŸ“ Answer; ðŸ“ Answer; â“ ðŸª¤ Trick: Does `BehaviorSubject` emit its current value immediately on subscription?; ðŸ“ Answer; â“ ðŸª¤ Trick: Can a `Subject` emit values before anyone subscribes?; ðŸ“ Answer; â“ ðŸª¤ Trick: What happens if you call `.next()` on a completed `Subject`?; ðŸ“ Answer; â“ Why is exposing a `BehaviorSubject` directly from a service considered a design smell?; ðŸ“ Answer; â“ What does `map` do?; ðŸ“ Answer; ðŸ“ Answer; ðŸ“ Answer; ðŸ“ Answer; â“ Difference between `map` and `switchMap`?; ðŸ“ Answer; â“ Explain `mergeMap` (a.k.a. `flatMap`); ðŸ“ Answer; ðŸ“ Answer; ðŸ“ Answer; ðŸ§  The Big Four â€” Visual Comparison; â“ ðŸª¤ Trick: For autocomplete search, which operator is best?; ðŸ“ Answer; â“ ðŸª¤ Trick: For a login button that must ignore double-clicks, which operator?; ðŸ“ Answer; â“ ðŸª¤ Trick: For a queue of tasks executed strictly in order, which operator?; ðŸ“ Answer; â“ Difference between `combineLatest` and `forkJoin`?; ðŸ“ Answer; â“ Difference between `merge` and `concat`?; ðŸ“ Answer; â“ What does `withLatestFrom` do?; ðŸ“ Answer; â“ Use case for `race`?; ðŸ“ Answer; â“ ðŸª¤ Trick: Does `combineLatest([a$, b$])` emit if `a$` emits but `b$` has never emitted?; ðŸ“ Answer; â“ How does `catchError` work?; ðŸ“ Answer; ðŸ“ Answer; ðŸ“ Answer; ðŸ“ Answer; ðŸ“ Answer; â“ ðŸª¤ Trick: If you `catchError` and return `EMPTY`, does the stream complete?; ðŸ“ Answer; â“ ðŸª¤ Trick: Can `catchError` swallow an error and keep the outer stream alive?; ðŸ“ Answer; â“ Can you explain what a Scheduler is in RxJS and when you'd need to explicitly specify one?; ðŸ“ Answer; â“ Why might you use `observeOn(asyncScheduler)`?; ðŸ“ Answer; â“ How does RxJS interact with Angular's Zones and Change Detection?; ðŸ“ Answer; â“ How does Angular's `HttpClient` use RxJS?; ðŸ“ Answer; â“ ðŸª¤ Trick: If you subscribe twice to the same `this.http.get(...)`, how many HTTP calls happen?; ðŸ“ Answer; â“ How do you avoid multiple HTTP calls when many components need the same data?; ðŸ“ Answer; â“ What does the `async` pipe do?; ðŸ“ Answer; â“ When should you NOT use the `async` pipe?; ðŸ“ Answer; â“ How would you model component state using RxJS?; ðŸ“ Answer; â“ Example: How to debounce a search input in Angular?; ðŸ“ Answer; â“ How does RxJS fit into NgRx?; ðŸ“ Answer; â“ How do memory leaks occur with RxJS in Angular?; ðŸ“ Answer; ðŸ“ Answer; ðŸ“ Answer; â“ ðŸª¤ Trick: Does a `BehaviorSubject` with no subscribers cause a memory leak by itself?; ðŸ“ Answer; â“ ðŸª¤ Trick: Does `subscribe` return a Promise?; ðŸ“ Answer; â“ ðŸª¤ Trick: If you call `unsubscribe()` on a completed stream, what happens?; ðŸ“ Answer; â“ ðŸª¤ Trick: Will `map` execute if no one subscribes?; ðŸ“ Answer; â“ ðŸª¤ Trick: Does `tap` change the emitted values?; ðŸ“ Answer; â“ ðŸª¤ Trick: `interval(1000).pipe(take(0))` â€” does it emit anything?; ðŸ“ Answer; â“ ðŸª¤ Trick: `from([1,2,3]).pipe(switchMap(x => of(x)))` â€” can any values be cancelled?; ðŸ“ Answer; â“ ðŸª¤ Trick: `share()` vs `shareReplay(1)` for HTTP caching?; ðŸ“ Answer; â“ Mock: You have an infinite WebSocket stream. Some components need it; others don't. Design?; ðŸ“ Answer; â“ Mock: File upload progress with cancel support. RxJS approach?; ðŸ“ Answer; â“ Mock: Poll a backend every 10s, but stop on navigation away or error.; ðŸ“ Answer; â“ Mock: Combine backend prefs + local UI overrides. Model with RxJS?; ðŸ“ Answer; â“ Mock: Three dependent HTTP calls â€” B depends on A, C depends on B. Implementation?; ðŸ“ Answer; â“ Mock: Debounce keystrokes, but execute immediately on Enter key.; ðŸ“ Answer; â“ Mock: Wizard where each step depends on the previous result and can be retried. Operator choices?; ðŸ“ Answer; â“ You have two REST APIs:; ðŸ“ Answer; `toSignal(observable$)` â€” Observable â†’ Signal; `toObservable(signal)` â€” Signal â†’ Observable |
| practice | `practice\coding\03-angular-coding.md` | MD | ðŸ…°ï¸ Angular Coding Interview Prep â€” Mock Tasks & Patterns | 2402 | 1ï¸âƒ£ User Model; 2ï¸âƒ£ Data Service â€” API + Caching + State Retention; 3ï¸âƒ£ User List Component (Table + Routing); 4ï¸âƒ£ Reactive Form Component (Add User); 5ï¸âƒ£ Dialog Component (Edit User + Unsaved Changes Guard); 6ï¸âƒ£ Details Page (No Extra API Call); 7ï¸âƒ£ Custom Pipe (Phone Formatter); 8ï¸âƒ£ Custom Directive (Invalid Highlight); 9ï¸âƒ£ Routing Module; ðŸ”Ÿ Auth Model & Service; 1ï¸âƒ£1ï¸âƒ£ `CanMatch` Guard; 1ï¸âƒ£2ï¸âƒ£ Lazy-loaded Admin Component; âœ… Design Decisions Summary; âœ… Full Implementation; ðŸ§  Operator-by-Operator Explanation; âš ï¸ Common Pitfall â€” `mergeMap` vs `switchMap`; ðŸŽ Bonus Improvements to Mention; ðŸ†š Classic vs Signal-based â€” What Changed?; ðŸŽ Bonus: Why this matters in interviews; ðŸŽ“ Final Cheat Sheet | â“ Build a small Angular application that manages users. It should load initial data from an API, allow CRUD operations, use forms, routing, dialogs, caching, and some custom Angular features. Explain your design decisions.; ðŸ“ Answer; ðŸ§  What to explain to the interviewer; â“ You are building a search autocomplete. You must debounce user input, avoid multiple API calls, cache results for 5 minutes, and cancel stale requests. How would you design this in Angular using RxJS?; ðŸ“ Answer; â“ Rebuild the autocomplete using Angular Signals + RxJS interop. How does it differ from the classic approach?; ðŸ“ Answer |

### scripts\reports\javascript-canonical-evidence.md
> - Use **arrow functions** for callbacks where you want to keep the outer `this` (e.g., inside class methods, in array methods inside React components)

### scripts\reports\sql-canonical-evidence.md
<li><strong>OVER():</strong> Defines the context "window". If left empty, the window is the entire result set.</li>


## RxJS

### ai\README.md
\## Future Pipeline

### interview\architecture\02-aws-cloud.md
| **AWS CodePipeline**      | Continuous Integration and Continuous Delivery (CI/CD) service to automate build, test, and deploy workflows.        |
2ï¸âƒ£ A developer needs a fully managed CI/CD pipeline with minimal setup â†’ **AWS CodePipeline**
1ï¸âƒ£5ï¸âƒ£ A company wants to orchestrate multi-step deployments automatically â†’ **AWS CodePipeline**

### interview\architecture\03-devops-build-tools.md
### â“ What is a Jenkins pipeline?
- Why are pipelines preferred over manual jobs?
- Why is dynamic typing useful in pipelines?
### â“ What are common stages in a Jenkins pipeline?
### â“ How does Jenkins trigger a pipeline?
- Pipeline scripts
### â“ What are common problems seen in Jenkins pipelines?

### interview\backend\java\01-Java-1.md
- `Object.equals()` default behavior is **reference comparison (== operator)**
- Uses `::` operator

### interview\backend\java\05-Spring-Security.md
.setSubject(username)
.setSubject(username)

### interview\backend\java\08-Architecture.md
I would move heavy operations like sorting and filtering to the backend or use `Web Workers`. On the UI side, Iâ€™d debounce inputs using `RxJS debounceTime`.
Iâ€™d cache data in a service using `RxJS shareReplay` or a state manager like `NgRx`. This avoids unnecessary API calls.

### interview\backend\node\01-Node.js.md
- Data pipelines
readStream.pipe(writeStream);

### interview\backend\node\06-Node-security.md
No. Environment files can leak through logs, container images, or CI pipelines.

### interview\frontend\01-HTML.md
Instead, it follows a strict internal pipeline to understand _what_ to show and _how_ to show it.
- Rendering pipeline depends on ordered execution

### interview\frontend\03-JavaScript.md
> 💡 **Use cases**: configuring functions in advance (`const log = curry((level, msg) => ...); const error = log("ERROR");`), functional programming pipelines.
#### ↳ Follow-up: How does nullish coalescing differ from the OR operator, and when does that distinction matter?

### interview\frontend\04-TypeScript.md
#### ↳ Follow-up: How does the `satisfies` operator work and when would you use it over a type annotation?

### interview\frontend\05-Angular-1.md
| `ngOnDestroy`           | Just before component is destroyed          | Cleanup subscriptions, intervals    |
private subscription!: Subscription;
this.subscription?.unsubscribe();
// Cleanup: intervals, subscriptions, event listeners
> - **Always clean up** subscriptions/intervals in `ngOnDestroy`
# 🔄 Part 7 — Pipes
### ❓ What are Angular pipes? Pure vs Impure?
**Pipes** transform data in templates without changing the original value.
**Pure pipe example:**
@Pipe({ name: "double", pure: true })
export class DoublePipe implements PipeTransform {
#### ↳ Follow-up: Why are pure pipes preferred?
Pure pipes are **skipped unless Angular detects a reference change** — making them cheap and predictable.
// ❌ Pipe NOT triggered (mutation, not reference change)
// ✅ Pipe IS triggered (new reference)
> 💡 Pure pipes work best with **immutable patterns** (spread, `Object.assign`, `Array.from`).
#### ↳ Follow-up: When would you use an impure pipe?
Use impure pipes when data is **mutated directly** or depends on external values like time, locale, or storage.
@Pipe({ name: "now", pure: false })
export class NowPipe implements PipeTransform {
> ⚠️ **Performance risk**: impure pipes execute on **every** change detection cycle, similar to `ngDoCheck`.
#### ↳ Follow-up: How do you create a custom pipe?
@Pipe({ name: "capitalize", standalone: true })
export class CapitalizePipe implements PipeTransform {
> 💡 By default, all custom pipes are **pure** unless explicitly marked `pure: false`.
#### ↳ Follow-up: Should pipes perform async operations or API calls?
❌ **No.** Pipes must be **synchronous and side-effect free**.
- Handle in **services** with Observables
- Use the **`async` pipe** in templates
#### ↳ Follow-up: Is the `async` pipe pure or impure, and why is it safe?
**`AsyncPipe` is impure** (`pure: false`) — it must react to Observable/Promise emissions that happen without reference changes.
users$ = this.userService.getUsers();   // Observable
- The Observable emits values **over time**
If `AsyncPipe` were pure → it would run only once → UI would never update.
✅ **Safety**: `async` pipe automatically subscribes AND unsubscribes on component destroy → **no memory leaks**.
Guards control navigation by returning `boolean | UrlTree | Promise<...> | Observable<...>`.
// Observable (reacts to changes)
> 💡 **Snapshot vs Observable**: Use snapshot when you don't expect the URL params to change while the component is alive. Use Observable when navigating between `/users/1` → `/users/2` reuses the same component instance.
this.actions$.pipe(
✅ **Benefits over RxJS for state**
> 💡 **Signal vs RxJS**: signals are great for **state**. RxJS still wins for **streams of events** (HTTP, user input over time, WebSocket).

### interview\frontend\05-Angular-2.md
> ⚠️ **Common myth:** Spread operator triggers change detection. **Wrong.** It only helps `OnPush` strategy detect a *new reference*, but it doesn't run CD on its own.
Modern Angular's build pipeline is a coordinated effort of **5 things** working together:
Each major Angular version has breaking changes — especially around RxJS pipeable operators, lazy loading syntax, Ivy migration, and standalone components. Skipping versions means you skip the migration schematics that auto-fix these.
| Angular 6+ | RxJS chained operators → **pipeable operators** (`.pipe(map(), filter())`) |
- **RxJS pipeable operators** — old `.map().filter()` chains break

### interview\frontend\06-React.md
- `useEffect` runs side-effects after render (API calls, subscriptions, DOM, timers).
- They encapsulate reusable stateful logic (fetching, subscriptions).

### interview\frontend\06-RxJS.md
# 🌊 RxJS Interview Prep — Reactive Programming Mastery
### ❓ How would you explain RxJS to a developer who's never used reactive programming before?
RxJS (Reactive Extensions for JavaScript) is a library for **reactive programming** using **Observables**. It lets you compose async and event-based programs using a functional, declarative pipeline of operators.
> 💡 **Mental model:** Promises are *one* future value. Observables are *many* future values over time — like a stream you can pipe, filter, and transform.
### ❓ Can you walk me through what an Observable is and how it differs from a Promise?
### ❓ What role does an Observer play in RxJS, and how does it interact with an Observable?
An object with up to three callbacks that defines **how to react** to Observable emissions:
### ❓ What does a Subscription represent in RxJS, and why is managing it important?
The object returned from `observable.subscribe(...)` that represents the **active execution**. You use it to **unsubscribe** and stop receiving values.
### ❓ Can you explain what an RxJS operator is and how operators are composed in a pipeline?
A **pure function** that takes an Observable as input and returns a new Observable as output. Operators don't modify the source — they create a new stream.
### ❓ What's the difference between Pipeable and Creation operators?
| **Creation** | Create new Observables from scratch | `of`, `from`, `interval`, `timer`, `fromEvent`, `EMPTY` |
| **Pipeable** | Transform an existing Observable inside `.pipe()` | `map`, `filter`, `switchMap`, `catchError` |
// Pipeable
const doubled$ = numbers$.pipe(map(n => n * 2));
### ❓ Is an Observable lazy or eager?
> 💡 **Why this matters:** If you build a pipeline but never subscribe, **none** of your operators run. No HTTP request, no timer, nothing.
### ❓ Can Observables be synchronous?
### ❓ What are the three notifications an Observable can emit?
### ❓ Can an Observable emit after `complete`?
### ❓ How would you describe a Cold Observable, and when does it matter whether an Observable is cold or hot?
Each subscription gets its **own independent execution and source**.
#### ↳ Follow-up: How does a Hot Observable differ from a Cold one, and can you give a real-world example of each?
Examples: DOM events (`fromEvent`), WebSocket streams, Subjects.
#### ↳ Follow-up: How do you convert a cold Observable to a hot one?
| Operator | Behavior |
| Wrap in `Subject` | Manual multicasting |
const src$ = of(0, 1, 2).pipe(share());
const src$ = of(0, 1, 2).pipe(shareReplay(1));
Using `shareReplay({ refCount: false })` (or the legacy signature) over an **infinite stream** keeps the source subscription alive **forever**, even when no consumers exist.
# Part 3 — Subjects
### ❓ Can you explain what a Subject is in RxJS and when you'd reach for it over a plain Observable?
A `Subject` is **both an Observable and an Observer**. It can emit values to multiple subscribers (multicast).
const subject$ = new Subject<number>();
subject$.subscribe(v => console.log('A:', v));
subject$.next(1);                              // A: 1
subject$.subscribe(v => console.log('B:', v));
subject$.next(2);                              // A: 2, B: 2
#### ↳ Follow-up: Difference between `Subject`, `BehaviorSubject`, `ReplaySubject`, and `AsyncSubject`?
| `Subject` | ❌ No | Only future emissions | Event bus, button clicks |
| `BehaviorSubject` | ✅ Yes (current) | Current + future | App state, current user |
| `ReplaySubject(n)` | ✅ Yes (last `n`) | Last `n` + future | Recent activity log |
| `AsyncSubject` | ✅ Last only | Final value on complete | One-shot result on completion |
// Subject
const s$ = new Subject<number>();
// BehaviorSubject
const b$ = new BehaviorSubject<number>(0);
// ReplaySubject(2)
const r$ = new ReplaySubject<number>(2);
### ❓ 🪤 Trick: Does `BehaviorSubject` emit its current value immediately on subscription?
### ❓ 🪤 Trick: Can a `Subject` emit values before anyone subscribes?
### ❓ 🪤 Trick: What happens if you call `.next()` on a completed `Subject`?
**Nothing happens.** Subscribers receive nothing after completion. The Subject is sealed.
### ❓ Why is exposing a `BehaviorSubject` directly from a service considered a design smell?
user$ = new BehaviorSubject<User | null>(null);  // ❌ Exposed, mutable
private readonly _user$ = new BehaviorSubject<User | null>(null);
readonly user$ = this._user$.asObservable();          // ✅ Read-only
> 📌 **Rule:** Keep writable subjects private; expose `asObservable()` or signals.
# Part 4 — Transformation Operators
of(1, 2, 3).pipe(map(n => n * 10)).subscribe(console.log);
of(1, 2, 3, 4).pipe(filter(n => n % 2 === 0)).subscribe(console.log);
#### ↳ Follow-up: What does the `tap` operator do, and when would you use it in a real application?
http.get('/api/users').pipe(
of(1, 2, 3).pipe(scan((acc, n) => acc + n, 0)).subscribe(console.log);
| Operator | Purpose |
| `switchMap` | Transforms a value into another **Observable**, and *switches* to it (cancelling the previous) |
input$.pipe(map(n => n * 2));
input$.pipe(switchMap(query => http.get(`/search?q=${query}`)));
Maps each value to an inner Observable and **subscribes to all inner Observables concurrently**, merging their outputs.
Queues inner Observables and subscribes to them **sequentially**. Each one waits for the previous to complete.
**Ignores new source values while an inner Observable is active**, and resumes listening only after it completes.
<img width="600" height="500" alt="RxJS Maps Image" src="/src/assets/rxjs-maps.png" />
| Operator | Concurrency | Cancels Previous? | When New Value Arrives |
### ❓ 🪤 Trick: For autocomplete search, which operator is best?
search$.pipe(
### ❓ 🪤 Trick: For a login button that must ignore double-clicks, which operator?
loginClicks$.pipe(
### ❓ 🪤 Trick: For a queue of tasks executed strictly in order, which operator?
# Part 6 — Combination Operators

### interview\frontend\09-Web_Architecture.md
> 💡 **Mental model:** Think of middleware as a **pipeline**, not just "functions." Each layer can short-circuit the request — saving CPU cycles and database hits.
| **Pure pipes** | Memoize transformations |
| **`async` pipe** | Auto-unsubscribe + auto-marks for check |
| **Aggregation pipelines** | Optimize order: `$match` → `$project` → `$group`; use `explain()` |
**Modern CI/CD pipeline:**

### knowledge\concepts\database\sql\README.md
A SQL query passes through an execution pipeline rather than going directly to storage. The Masterclass describes three major stages:

### knowledge\concepts\javascript\README.md
- Classes: class declarations are subject to a Temporal Dead Zone.

### knowledge\concepts\_canonical-candidates.md
| **RxJS** | `interview\frontend\06-RxJS.md; knowledge\visual-notes\rxjs-maps.png` | Frontend framework/library concept |

### knowledge\masterclasses\SQL_MasterClass.html
<h2>2. Inside the Engine Pipeline</h2>
<li>Your query doesn't go straight to the hard drive. It passes through a complex pipeline.</li>
<li><strong>LIKE operator dangers:</strong> Using a wildcard at the start (<span class="code-inline">LIKE '%son'</span>) forces a full table scan because the B-Tree index cannot search backwards.</li>
<p><strong>The Expert Answer:</strong> Both filter data, but at completely different pipeline stages.</p>

### practice\coding\03-angular-coding.md
- ✅ State management with `BehaviorSubject` (no double-fetching)
- ✅ Custom pipe + custom directive
private usersSubject = new BehaviorSubject<User[]>([]);
readonly users$ = this.usersSubject.asObservable();   // 🔒 Read-only stream
this.usersSubject.next(users);
this.usersSubject.next([...this.usersSubject.value, user]);
const users = this.usersSubject.value.map((u) =>
this.usersSubject.next(users);
this.usersSubject.next(this.usersSubject.value.filter((u) => u.id !== id));
return this.usersSubject.value.find((u) => u.id === id);
| `BehaviorSubject` | Stores the latest list; new subscribers get the current state immediately |
| `asObservable()` exposed | Prevents components from calling `.next()` and bypassing the service |
> 1. **`async` pipe** → auto-subscribe + auto-unsubscribe (no memory leak)
## 7️⃣ Custom Pipe (Phone Formatter)
@Pipe({ name: "phonePostal" })
export class PhonePostalPipe implements PipeTransform {
> 💡 **Pure pipes are memoized** — Angular only re-runs `transform` when the input reference changes.
| `BehaviorSubject` in service | Single source of truth; instant access on subscribe |
| Custom pipe + directive | Demonstrates extensibility knowledge |
### ❓ You are building a search autocomplete. You must debounce user input, avoid multiple API calls, cache results for 5 minutes, and cancel stale requests. How would you design this in Angular using RxJS?
| Requirement | RxJS Tool |
import { Subject, of } from "rxjs";
} from "rxjs/operators";
search$ = new Subject<string>();
.pipe(
.pipe(
## 🧠 Operator-by-Operator Explanation
| Operator | What it does | Why we need it |
| `switchMap()` | Cancels the previous inner Observable | The user typed more — old API result is stale |
### ❓ Rebuild the autocomplete using Angular Signals + RxJS interop. How does it differ from the classic approach?
In Angular 16+, you can mix **Signals** (for state) with **RxJS** (for stream operators) using `toObservable()` and `toSignal()`.
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import { debounceTime, distinctUntilChanged, switchMap, of, tap, map } from "rxjs";
// 🔄 Bridge signal → observable for RxJS pipeline
private readonly results$ = toObservable(this.query).pipe(
// 🔄 Bridge observable → signal for template binding
.pipe(
| Aspect | Classic (Subject-based) | Signal-based |
| State holder | `Subject<string>` | `signal<string>('')` |
> 💡 **Best of both worlds:** Use Signals for **state**, RxJS for **stream operators** (`debounceTime`, `switchMap`, etc.) that Signals don't yet provide. Bridge with `toObservable` / `toSignal`.
- ✅ Understand interop with existing RxJS code
| `BehaviorSubject` + `asObservable()` | State store with read-only stream |
| `async` pipe + `trackBy` | Auto-unsubscribe + perf |
| `toSignal` / `toObservable` | Modern RxJS ↔ Signals bridge |

### roadmap\backend\README.md
- Validation Pipes

### roadmap\devops\README.backup.md
- Build Pipelines

### scripts\reports\canonical-topic-map.md
| Angular | â€” | â€” | interview\backend\java\02-REST-Api.md; interview\backend\java\08-Architecture.md; interview\frontend\05-Angular-1.md; interview\frontend\05-Angular-2.md; interview\frontend\06-RxJS.md; interview\frontend\09-Web_Architecture.md | practice\coding\03-angular-coding.md | knowledge\visual-notes\angular-lifecycle.png |
| React | â€” | â€” | interview\frontend\05-Angular-1.md; interview\frontend\06-React.md; interview\frontend\06-RxJS.md | practice\coding\03-angular-coding.md | â€” |
| RxJS | â€” | â€” | interview\frontend\06-RxJS.md | practice\coding\03-angular-coding.md | knowledge\visual-notes\rxjs-maps.png |
| REST API | â€” | â€” | interview\backend\java\06-Spring-Cloud.md; interview\backend\java\08-Architecture.md; interview\frontend\06-RxJS.md | â€” | â€” |
- **RxJS** â€” missing: Roadmap, Knowledge

### scripts\reports\content-inventory.md
| interview | `interview\architecture\03-devops-build-tools.md` | MD |  | 547 | 1ï¸âƒ£ Docker â€“ Basic Conceptual Questions; 2ï¸âƒ£ Jenkins + Groovy â€“ CI/CD Basics; 3ï¸âƒ£ Tomcat â€“ Application Server Basics; 4ï¸âƒ£ Maven â€“ Build Tool Fundamentals; 5ï¸âƒ£ How These Tools Work Together (Very Common) | â“ What is Docker and why is it used?; â“ What is the difference between Docker and a Virtual Machine?; â“ What is a Docker image?; â“ What is a Docker container?; â“ What is a Dockerfile?; â“ Why should applications inside Docker be stateless?; â“ How do you pass configuration to a Docker container?; â“ What are common benefits of using Docker in projects?; â“ What is Jenkins?; â“ What is CI/CD?; â“ Why do teams use Jenkins for CI/CD?; â“ What is a Jenkins pipeline?; â“ What is a Jenkinsfile?; â“ Why is Jenkinsfile written in Groovy?; â“ What is Groovy?; â“ Is Groovy statically typed or dynamically typed?; â“ What are common stages in a Jenkins pipeline?; â“ How does Jenkins trigger a pipeline?; â“ What happens when a Jenkins build fails?; â“ What is the difference between Jenkins master and agent?; â“ Where is Groovy mostly used in Jenkins?; â“ What are common problems seen in Jenkins pipelines?; â“ What is Apache Tomcat?; â“ What kind of applications run on Tomcat?; â“ How does Tomcat handle incoming requests?; â“ What is a WAR file?; â“ Difference between embedded Tomcat and external Tomcat?; â“ What are common issues seen in Tomcat?; â“ How do you restart or redeploy applications in Tomcat?; â“ What is Maven and why is it used?; â“ What is a `pom.xml` file?; â“ What is dependency management in Maven?; â“ What are Maven repositories?; â“ What is the Maven build lifecycle?; â“ What is a Maven plugin?; â“ What is a multi-module Maven project?; â“ How does Maven help maintain consistency across environments?; â“ Typical CI/CD flow using these tools?; â“ How do Maven, Jenkins, and Docker work together?; â“ Where does Tomcat fit in this flow?; â“ What problems do these tools solve together? |
| interview | `interview\frontend\05-Angular-1.md` | MD | ðŸ…°ï¸ Angular Interview Preparation â€” Part 1 | 3621 |  | â“ How would you describe Angular to someone coming from AngularJS â€” what are the fundamental differences?; ðŸ“ Answer; â“ What types of data binding does Angular support?; ðŸ“ Answer; â“ Can you walk me through the difference between Components and Directives in Angular?; ðŸ“ Answer; â“ Can you explain ViewEncapsulation in Angular and the trade-offs between the available modes?; ðŸ“ Answer; â“ When would you use `::ng-deep` in Angular, and what are the risks of relying on it?; ðŸ“ Answer; â“ What are Angular lifecycle hooks?; ðŸ“ Answer; ðŸ“ Answer; â“ How do `*ngIf` and `*ngFor` work conceptually?; ðŸ“ Answer; ðŸ“ Answer; â“ How do attribute directives work internally?; ðŸ“ Answer; â“ What are the new control flow blocks `@if`, `@for`, `@switch`?; ðŸ“ Answer; â“ How do Standalone Components differ from NgModules?; ðŸ“ Answer; â“ How does `@ViewChild` work, and when would you use it over other approaches to access child elements?; ðŸ“ Answer; â“ Why is direct DOM manipulation via `ElementRef` discouraged? Use `Renderer2` instead?; ðŸ“ Answer; â“ What are Angular pipes? Pure vs Impure?; ðŸ“ Answer; ðŸ“ Answer; ðŸ“ Answer; ðŸ“ Answer; ðŸ“ Answer; ðŸ“ Answer; â“ How does Angular's DI system and hierarchy work?; ðŸ“ Answer; ðŸ“ Answer; ðŸ“ Answer; ðŸ“ Answer; ðŸ“ Answer; â“ What are the core concepts of Angular routing?; ðŸ“ Answer; ðŸ“ Answer; ðŸ“ Answer; ðŸ“ Answer; ðŸ“ Answer; â“ Differences between Template-driven and Reactive forms?; ðŸ“ Answer; â“ What happens when you mix `[(ngModel)]` with Reactive Forms?; ðŸ“ Answer; â“ How do you create a custom form control in Angular? (`ControlValueAccessor`); ðŸ“ Answer; â“ How would you globally trim leading and trailing spaces from user input?; ðŸ“ Answer; â“ What are Signals in Angular?; ðŸ“ Answer |
| interview | `interview\frontend\06-RxJS.md` | MD | ðŸŒŠ RxJS Interview Prep â€” Reactive Programming Mastery | 3897 | ðŸŽ“ Final Cheat Sheet | â“ How would you explain RxJS to a developer who's never used reactive programming before?; ðŸ“ Answer; â“ Can you walk me through what an Observable is and how it differs from a Promise?; ðŸ“ Answer; â“ What role does an Observer play in RxJS, and how does it interact with an Observable?; ðŸ“ Answer; â“ What does a Subscription represent in RxJS, and why is managing it important?; ðŸ“ Answer; â“ Can you explain what an RxJS operator is and how operators are composed in a pipeline?; ðŸ“ Answer; â“ What's the difference between Pipeable and Creation operators?; ðŸ“ Answer; â“ Is an Observable lazy or eager?; ðŸ“ Answer; â“ Can Observables be synchronous?; ðŸ“ Answer; â“ What are the three notifications an Observable can emit?; ðŸ“ Answer; â“ Can an Observable emit after `complete`?; ðŸ“ Answer; â“ How would you describe a Cold Observable, and when does it matter whether an Observable is cold or hot?; ðŸ“ Answer; ðŸ“ Answer; ðŸ“ Answer; â“ `share()` vs `shareReplay()` â€” explain with example; ðŸ“ Answer; â“ ðŸª¤ Trick: What's a common memory leak pitfall with `shareReplay`?; ðŸ“ Answer; â“ Can you explain what a Subject is in RxJS and when you'd reach for it over a plain Observable?; ðŸ“ Answer; ðŸ“ Answer; â“ ðŸª¤ Trick: Does `BehaviorSubject` emit its current value immediately on subscription?; ðŸ“ Answer; â“ ðŸª¤ Trick: Can a `Subject` emit values before anyone subscribes?; ðŸ“ Answer; â“ ðŸª¤ Trick: What happens if you call `.next()` on a completed `Subject`?; ðŸ“ Answer; â“ Why is exposing a `BehaviorSubject` directly from a service considered a design smell?; ðŸ“ Answer; â“ What does `map` do?; ðŸ“ Answer; ðŸ“ Answer; ðŸ“ Answer; ðŸ“ Answer; â“ Difference between `map` and `switchMap`?; ðŸ“ Answer; â“ Explain `mergeMap` (a.k.a. `flatMap`); ðŸ“ Answer; ðŸ“ Answer; ðŸ“ Answer; ðŸ§  The Big Four â€” Visual Comparison; â“ ðŸª¤ Trick: For autocomplete search, which operator is best?; ðŸ“ Answer; â“ ðŸª¤ Trick: For a login button that must ignore double-clicks, which operator?; ðŸ“ Answer; â“ ðŸª¤ Trick: For a queue of tasks executed strictly in order, which operator?; ðŸ“ Answer; â“ Difference between `combineLatest` and `forkJoin`?; ðŸ“ Answer; â“ Difference between `merge` and `concat`?; ðŸ“ Answer; â“ What does `withLatestFrom` do?; ðŸ“ Answer; â“ Use case for `race`?; ðŸ“ Answer; â“ ðŸª¤ Trick: Does `combineLatest([a$, b$])` emit if `a$` emits but `b$` has never emitted?; ðŸ“ Answer; â“ How does `catchError` work?; ðŸ“ Answer; ðŸ“ Answer; ðŸ“ Answer; ðŸ“ Answer; ðŸ“ Answer; â“ ðŸª¤ Trick: If you `catchError` and return `EMPTY`, does the stream complete?; ðŸ“ Answer; â“ ðŸª¤ Trick: Can `catchError` swallow an error and keep the outer stream alive?; ðŸ“ Answer; â“ Can you explain what a Scheduler is in RxJS and when you'd need to explicitly specify one?; ðŸ“ Answer; â“ Why might you use `observeOn(asyncScheduler)`?; ðŸ“ Answer; â“ How does RxJS interact with Angular's Zones and Change Detection?; ðŸ“ Answer; â“ How does Angular's `HttpClient` use RxJS?; ðŸ“ Answer; â“ ðŸª¤ Trick: If you subscribe twice to the same `this.http.get(...)`, how many HTTP calls happen?; ðŸ“ Answer; â“ How do you avoid multiple HTTP calls when many components need the same data?; ðŸ“ Answer; â“ What does the `async` pipe do?; ðŸ“ Answer; â“ When should you NOT use the `async` pipe?; ðŸ“ Answer; â“ How would you model component state using RxJS?; ðŸ“ Answer; â“ Example: How to debounce a search input in Angular?; ðŸ“ Answer; â“ How does RxJS fit into NgRx?; ðŸ“ Answer; â“ How do memory leaks occur with RxJS in Angular?; ðŸ“ Answer; ðŸ“ Answer; ðŸ“ Answer; â“ ðŸª¤ Trick: Does a `BehaviorSubject` with no subscribers cause a memory leak by itself?; ðŸ“ Answer; â“ ðŸª¤ Trick: Does `subscribe` return a Promise?; ðŸ“ Answer; â“ ðŸª¤ Trick: If you call `unsubscribe()` on a completed stream, what happens?; ðŸ“ Answer; â“ ðŸª¤ Trick: Will `map` execute if no one subscribes?; ðŸ“ Answer; â“ ðŸª¤ Trick: Does `tap` change the emitted values?; ðŸ“ Answer; â“ ðŸª¤ Trick: `interval(1000).pipe(take(0))` â€” does it emit anything?; ðŸ“ Answer; â“ ðŸª¤ Trick: `from([1,2,3]).pipe(switchMap(x => of(x)))` â€” can any values be cancelled?; ðŸ“ Answer; â“ ðŸª¤ Trick: `share()` vs `shareReplay(1)` for HTTP caching?; ðŸ“ Answer; â“ Mock: You have an infinite WebSocket stream. Some components need it; others don't. Design?; ðŸ“ Answer; â“ Mock: File upload progress with cancel support. RxJS approach?; ðŸ“ Answer; â“ Mock: Poll a backend every 10s, but stop on navigation away or error.; ðŸ“ Answer; â“ Mock: Combine backend prefs + local UI overrides. Model with RxJS?; ðŸ“ Answer; â“ Mock: Three dependent HTTP calls â€” B depends on A, C depends on B. Implementation?; ðŸ“ Answer; â“ Mock: Debounce keystrokes, but execute immediately on Enter key.; ðŸ“ Answer; â“ Mock: Wizard where each step depends on the previous result and can be retried. Operator choices?; ðŸ“ Answer; â“ You have two REST APIs:; ðŸ“ Answer; `toSignal(observable$)` â€” Observable â†’ Signal; `toObservable(signal)` â€” Signal â†’ Observable |
| practice | `practice\coding\03-angular-coding.md` | MD | ðŸ…°ï¸ Angular Coding Interview Prep â€” Mock Tasks & Patterns | 2402 | 1ï¸âƒ£ User Model; 2ï¸âƒ£ Data Service â€” API + Caching + State Retention; 3ï¸âƒ£ User List Component (Table + Routing); 4ï¸âƒ£ Reactive Form Component (Add User); 5ï¸âƒ£ Dialog Component (Edit User + Unsaved Changes Guard); 6ï¸âƒ£ Details Page (No Extra API Call); 7ï¸âƒ£ Custom Pipe (Phone Formatter); 8ï¸âƒ£ Custom Directive (Invalid Highlight); 9ï¸âƒ£ Routing Module; ðŸ”Ÿ Auth Model & Service; 1ï¸âƒ£1ï¸âƒ£ `CanMatch` Guard; 1ï¸âƒ£2ï¸âƒ£ Lazy-loaded Admin Component; âœ… Design Decisions Summary; âœ… Full Implementation; ðŸ§  Operator-by-Operator Explanation; âš ï¸ Common Pitfall â€” `mergeMap` vs `switchMap`; ðŸŽ Bonus Improvements to Mention; ðŸ†š Classic vs Signal-based â€” What Changed?; ðŸŽ Bonus: Why this matters in interviews; ðŸŽ“ Final Cheat Sheet | â“ Build a small Angular application that manages users. It should load initial data from an API, allow CRUD operations, use forms, routing, dialogs, caching, and some custom Angular features. Explain your design decisions.; ðŸ“ Answer; ðŸ§  What to explain to the interviewer; â“ You are building a search autocomplete. You must debounce user input, avoid multiple API calls, cache results for 5 minutes, and cancel stale requests. How would you design this in Angular using RxJS?; ðŸ“ Answer; â“ Rebuild the autocomplete using Angular Signals + RxJS interop. How does it differ from the classic approach?; ðŸ“ Answer |

### scripts\reports\javascript-canonical-evidence.md
> 💡 **Use cases**: configuring functions in advance (`const log = curry((level, msg) => ...); const error = log("ERROR");`), functional programming pipelines.
#### ↳ Follow-up: How does nullish coalescing differ from the OR operator, and when does that distinction matter?

### scripts\reports\sql-canonical-evidence.md
<h2>2. Inside the Engine Pipeline</h2>
<li>Your query doesn't go straight to the hard drive. It passes through a complex pipeline.</li>
<li><strong>LIKE operator dangers:</strong> Using a wildcard at the start (<span class="code-inline">LIKE '%son'</span>) forces a full table scan because the B-Tree index cannot search backwards.</li>
<p><strong>The Expert Answer:</strong> Both filter data, but at completely different pipeline stages.</p>

### scripts\reports\sql-masterclass-structure.md
- 2. Inside the Engine Pipeline


## Node.js

### interview\backend\node\01-Node.js.md
### â“ What is Node.js and why was it created?
- **Node.js** is a JavaScript runtime environment that allows JavaScript to run outside the browser, mainly on servers.
- Internally, Node.js uses the **V8 JavaScript engine**, which compiles JavaScript directly into machine code for fast execution.
- Node.js was created to solve the scalability problem of traditional server models where each incoming request required a new thread.
- Instead of using a blocking request-per-thread model, Node.js uses an **event-driven, non-blocking I/O model**.
- This design allows a single Node.js process to handle thousands of concurrent connections efficiently.
- Node.js for APIs, real-time applications, microservices, and streaming systems.
![NodeJS Image](/src/assets/nodejs.png)
- **Express.js** is a minimal web framework built on top of Node.js.
- Express.js simplifies HTTP server creation by providing routing, middleware handling, and request/response abstractions.
### â“ What does non-blocking I/O mean in Node.js?
- Non-blocking I/O means Node.js does not wait for slow operations such as file reads or database queries to finish.
- Instead, Node.js delegates these operations to the operating system or libuv thread pool.
- This allows Node.js to remain responsive even under heavy load.
- âœ… Non-Blocking (Node.js)
The file read happens in the background, and Node.js continues executing other requests.
### â“ Explain the Node.js Event Loop in detail.
![NodeJSEventLoop Image](/src/assets/nodejs-eventloop.png)
- The Event Loop is the mechanism that allows Node.js to handle asynchronous operations using a single main JavaScript thread.
- Node.js relies on **libuv**, which manages the event loop and a background thread pool.
![NodeJSEventLoop Image](/src/assets/nodejs-event-loop-phase.png)
### â“ Is Node.js single-threaded?
- JavaScript execution in Node.js runs on a single main thread.
- Internally, Node.js uses a **thread pool** for CPU-intensive or blocking operations.
![Image](/src/assets/nodejs-streams-buffer.png)
Streams are a **mechanism in Node.js that allow data to be processed incrementally, piece by piece**, instead of loading the entire data into memory at once.
Node.js streams are especially useful for handling:
Node.js provides four main types of streams:
1ï¸âƒ£ Why Are Streams Important in Node.js?
Without streams, Node.js would need to:
Node.js is designed to handle **I/O-heavy workloads**.
2ï¸âƒ£ What Is a Buffer in Node.js?
7ï¸âƒ£ How does backpressure work in Node.js streams?
### â“ How does load balancing work in Node.js?
### â“ How do you profile Node.js applications?
- Node.js uses V8â€™s garbage collector.
### â“ Compare npm, yarn, pnpm, and npx.
- `npm` is the default and widely supported.
- `pnpm` is disk-efficient and recommended for large monorepos.
### â“ What is the Node.js REPL?
### â“ Does `async/await` create threads in Node.js?
- No, `async/await` does **not** create new threads in Node.js.
- The awaited operation is handled asynchronously, often by the operating system or Node.jsâ€™s internal thread pool if it involves I/O.

### interview\backend\node\06-Node-security.md
![Image](/src/assets/nodejs-authorization-flow.png)
![Image](/src/assets/nodejs-csrftoken.png)

### interview\frontend\03-JavaScript.md
- `process.nextTick` (Node.js — even higher priority than promises)
> 💡 **Node.js extras**: `process.nextTick` runs BEFORE other microtasks. `setImmediate` runs AFTER `setTimeout(0)` in the next event loop iteration.

### interview\frontend\09-Web_Architecture.md
| API Server | **Node.js + Express** | Routing, middleware, auth, business logic |
Angular communicates with the backend over **HTTP/HTTPS** using RESTful APIs. Node.js + Express acts as the application server, handling routing, middleware execution, authentication, validation, and business logic. MongoDB stores data in a document format that aligns naturally with JSON-based APIs.
A user action in Angular triggers an HTTP request through a service. Before the request leaves the browser, Angular **HTTP interceptors** attach headers like JWT tokens. The request reaches the Node.js server, where Express middleware processes it sequentially — authentication, authorization, validation, and logging. The controller invokes business services, which interact with MongoDB. The response flows back through middleware, is serialized as JSON, and Angular updates the UI reactively.
### ❓ How do you structure a large Node.js backend?
# Part 6 — Node.js Internals & Concurrency
### ❓ Why is Node.js suitable for high-concurrency systems?
![Image](https://media.geeksforgeeks.org/wp-content/uploads/20200224050909/nodejs2.png)
Node.js uses a **single-threaded event loop with non-blocking I/O**. It efficiently handles thousands of concurrent connections, especially for **I/O-bound workloads** like API gateways, real-time apps, and microservices.
> ⚠️ **The trade-off:** Node.js is **bad** for CPU-bound work — heavy computation blocks the entire event loop.
#### ↳ Follow-up: What blocks the Node.js event loop?
### ❓ What happens when Node.js crashes in production?
| **Dependencies** | `npm audit`, Snyk, Dependabot |
- Modern Node.js can handle ~5K RPS per instance for I/O-bound work

### knowledge\concepts\javascript\README.md
The repository material covers synchronous execution, Promise callbacks, `async`/`await`, timers, HTTP and DOM-related asynchronous work, `queueMicrotask`, Node.js `process.nextTick`, and `setImmediate.

### knowledge\concepts\_canonical-candidates.md
| **Node.js** | `interview\backend\node\01-Node.js.md` | Backend/platform concept |
5. Node.js

### roadmap\backend\README.backup.md
- Node.js

### scripts\reports\canonical-topic-map.md
| Node.js | â€” | â€” | interview\backend\node\01-Node.js.md; interview\frontend\09-Web_Architecture.md | â€” | â€” |
- **Node.js** â€” missing: Roadmap, Knowledge, Practice

### scripts\reports\content-inventory.md
| interview | `interview\backend\node\01-Node.js.md` | MD |  | 2032 |  | â“ What is Node.js and why was it created?; ðŸ“ Answer; â“ What is Express.js and why do we need it?; ðŸ“ Answer; â“ What does non-blocking I/O mean in Node.js?; ðŸ“ Answer; â“ Explain the Node.js Event Loop in detail.; ðŸ“ Answer; â“ Is Node.js single-threaded?; ðŸ“ Answer; â“ What are Worker Threads and when should they be used?; ðŸ“ Answer; â“ What are Streams and why are they important?; ðŸ“ Answer; â“ What is middleware in Express.js?; ðŸ“ Answer; â“ How do you manage environment configuration?; ðŸ“ Answer; â“ How does load balancing work in Node.js?; ðŸ“ Answer; â“ Explain routing, route params, and query params.; ðŸ“ Answer; â“ How do you profile Node.js applications?; ðŸ“ Answer; â“ How does logging work in production?; ðŸ“ Answer; â“ Explain memory management and garbage collection.; ðŸ“ Answer; â“ Compare npm, yarn, pnpm, and npx.; ðŸ“ Answer; â“ What is the Node.js REPL?; ðŸ“ Answer; â“ How does the File System module work?; ðŸ“ Answer; â“ What is caching and why is it important?; ðŸ“ Answer; â“ Does `async/await` create threads in Node.js?; ðŸ“ Answer |
| interview | `interview\frontend\09-Web_Architecture.md` | MD | ðŸ—ï¸ Web Architecture Interview Prep â€” MEAN, Scalability & System Design | 4412 | ðŸŽ“ Final Cheat Sheet | â“ Explain the high-level MEAN stack architecture; ðŸ“ Answer; â“ Explain the complete request lifecycle in a MEAN application; ðŸ“ Answer; â“ How does Express middleware execution order work?; ðŸ“ Answer; â“ How do you implement authentication in MEAN applications?; ðŸ“ Answer; ðŸ“ Answer; â“ How do you secure APIs beyond authentication?; ðŸ“ Answer; â“ How do you prevent XSS and injection attacks?; ðŸ“ Answer; â“ Explain CORS and how you configure it correctly; ðŸ“ Answer; â“ How do you manage environment configurations?; ðŸ“ Answer; â“ How do you structure a large Node.js backend?; ðŸ“ Answer; â“ Can you walk me through the Backend-for-Frontend pattern and describe a situation where you'd recommend it?; ðŸ“ Answer; â“ How do you optimize Angular performance?; ðŸ“ Answer; â“ Explain Angular route guards; ðŸ“ Answer; â“ Why is Node.js suitable for high-concurrency systems?; ðŸ“ Answer; ðŸ“ Answer; ðŸ“ Answer; â“ How do you design scalable APIs?; ðŸ“ Answer; â“ How would you explain API idempotency, and can you give an example of where it could go wrong if ignored?; ðŸ“ Answer; â“ How do you implement caching effectively?; ðŸ“ Answer; â“ How do you optimize MongoDB performance?; ðŸ“ Answer; ðŸ“ Answer; â“ How do you handle secure file uploads?; ðŸ“ Answer; â“ How do you prevent API abuse?; ðŸ“ Answer; â“ How do you prevent accidental data leaks?; ðŸ“ Answer; â“ How do you handle partial failures in distributed systems?; ðŸ“ Answer; â“ What happens if MongoDB goes down?; ðŸ“ Answer; â“ What happens when Node.js crashes in production?; ðŸ“ Answer; â“ How do you design logging for production?; ðŸ“ Answer; ðŸ“ Answer; â“ How do you manage secrets securely?; ðŸ“ Answer; â“ How do you handle deployments?; ðŸ“ Answer; â“ How do you ensure high availability?; ðŸ“ Answer; â“ How do you debug slow APIs in production?; ðŸ“ Answer; â“ How do you protect frontend applications?; ðŸ“ Answer; â“ How do you design for traffic spikes?; ðŸ“ Answer; â“ Final Question: Design a MEAN system for 1 million users; ðŸ“ Answer |

### scripts\reports\javascript-canonical-evidence.md
- `process.nextTick` (Node.js — even higher priority than promises)
> 💡 **Node.js extras**: `process.nextTick` runs BEFORE other microtasks. `setImmediate` runs AFTER `setTimeout(0)` in the next event loop iteration.


## REST API

### interview\architecture\02-aws-cloud.md
| **AWS Global Accelerator**       | Improves availability and performance using AWS global network. Routes traffic to the nearest healthy endpoint using static IPs                     |

### interview\architecture\03-devops-build-tools.md
### â“ How do you restart or redeploy applications in Tomcat?

### interview\architecture\microservice-architecture.md
## DESIGN STRUCTURE (REST Orchestration)

### interview\backend\java\01-Java-1.md
You donâ€™t want the rest of the system to change every time.
**Singleton** restricts object creation to one instance and provides a global access point to it.
**Proxy** acts as a middle layer that controls, restricts, or enhances access to a real object without changing its code.

### interview\backend\java\01-Java-2.md
> In Java 9 named **modules**, access is **restricted** to exported packages only.
HttpClient in Java 11 is a modern API to send HTTP requests and receive responses (REST calls, APIs, microservices communication) in a simple, efficient, and non-blocking way.
Sealed classes **restrict which classes or interfaces can extend or implement them**.
| Used internally (sessions, cache) | Used externally (REST APIs) |

### interview\backend\java\02-REST-Api.md
Use `@RestControllerAdvice` to handle everything in one place.
@RestControllerAdvice
âœ” Map proper HTTP status codes
### â“ Important HTTP Status Codes to Know
- Violates REST standards
1.  Use `@RestController`
### â“ How do you implement global HTTP status handling in Spring Boot without setting the status code in each controller method?
@RestControllerAdvice

### interview\backend\java\03-Spring-1.md
ðŸ¤”â“ Difference between Actuator and Swagger?
- **Swagger** is for API documentation & testing.
- REST APIs returned **only data**
- Plain REST + hardcoded URLs
> HATEOAS adds links to REST responses so clients know what to do next.

### interview\backend\java\03-Spring-2.md
- Runs Servlets & REST APIs
@RestController

### interview\backend\java\04-Spring-annotation.md
ðŸ”¹ **Web & REST Annotations**
| `@RestController`       | Class level              | Combines `@Controller + @ResponseBody` for REST APIs. |
| `@ResponseStatus`       | Method / Exception class | Sets custom HTTP status code.                         |
| `@RestControllerAdvice` | Class level              | Global exception handling for REST APIs.              |

### interview\backend\java\05-Spring-Security.md
- Applies to **state-changing HTTP methods** (POST, PUT, DELETE, PATCH)
| Common Use      | Enterprise SSO   | REST APIs   |

### interview\backend\java\06-Spring-Cloud.md
- Containers restart â†’ IP and port change
1. `RestTemplate` (older, blocking)
RestTemplate restTemplate = new RestTemplate();
restTemplate.getForObject("http://inventory-service/inventory/1", InventoryResponse.class);
- It lets you call a remote REST API as if it were a local Java method.
ðŸ¤”â“ Can configuration be refreshed without restarting the service?
âœ” Service-to-service REST
âœ” No `@RestController` for routing
âœ” Gateway â‰  REST API service
> As long as services use supported HTTP clients (Feign, RestTemplate, WebClient), propagation is automatic.
### â“ How do you design REST APIs for microservices?
@RestController
âœ” Proper status codes matter
- Containers restart
### â“ When would you avoid REST between services?
REST causes:
âœ… RestTemplate with Load Balancer
public RestTemplate restTemplate() {
return new RestTemplate();
String response = restTemplate.getForObject(
### â“ When would you avoid synchronous REST calls between services?

### interview\backend\java\08-Architecture.md
## ðŸŒ REST API & Controller Design
### â“ Our REST API is getting hard to maintain as features grow. How would you structure controllers better?
Iâ€™d keep controllers thin and move logic to `Service` classes. Each controller should handle only request/response mapping using `@RestController`.
### â“ How do you protect REST APIs from invalid or malicious input?
### â“ How would you test REST controllers properly?
### â“ How would you explain a REST API performance issue to a non-technical manager?
Iâ€™d break it down layer by layer: Angular network timing, REST API response time, and DB query time. Iâ€™d use `browser DevTools`, `Spring logs`, and DB metrics to isolate the bottleneck.

### interview\backend\java\08-MySQL.md
- Better security (direct table access can be restricted)

### interview\backend\node\01-Node.js.md
- REST APIs

### interview\backend\node\06-Node-security.md
CORS is a browser-enforced mechanism that restricts cross-origin HTTP requests.

### interview\frontend\02-CSS.md
| `absolute` | ❌     | Nearest positioned ancestor | Removed from flow; parent height ignores it |
> 📌 **Common trap**: `absolute` looks for the nearest **positioned** ancestor (`relative`, `absolute`, `fixed`, `sticky`). If none exists, it positions relative to the `<html>` element.
- Restructure layout to avoid the clipping ancestor

### interview\frontend\05-Angular-2.md
3. When the signal mutates, Angular knows **exactly which nodes** to refresh — and skips the rest.
The pattern is: **decode JWT → check role → restore or clear**.
// Restore form data

### interview\frontend\06-RxJS.md
| `share()` | Multicasts; ref-counted; restarts when subscribers drop to 0 |
### ❓ You have two REST APIs:

### interview\frontend\09-Web_Architecture.md
Angular communicates with the backend over **HTTP/HTTPS** using RESTful APIs. Node.js + Express acts as the application server, handling routing, middleware execution, authentication, validation, and business logic. MongoDB stores data in a document format that aligns naturally with JSON-based APIs.
> ⚠️ **Critical clarification:** CORS does **NOT** secure your API. It only restricts what *browsers* allow. Anyone with `curl` or Postman can call your API regardless of CORS settings. Real security comes from authentication + authorization.
│  Routes        (HTTP concerns)  │  → URL paths, HTTP methods
Imagine a food-delivery app. The mobile home screen needs to show: the user's name and avatar, recent orders, recommended restaurants nearby, and any active promotions. In a microservices architecture, that data lives in four different services.
"recommended": [ /* 5 nearby restaurants, with image URL pre-resized for mobile */ ],
The mobile app gets exactly what it needs in one round-trip. The web BFF, in contrast, might return 20 recommended restaurants with full descriptions because the web home page has more screen real estate. Same downstream services, two different shapes of response — each optimized for its consumer.
| HTTP Method | Idempotent by spec? |
![Image](https://blog.xapihub.io/img/posts/CachingStrategiesforRESTAPIs.png)
- **Process manager** (PM2, systemd, Kubernetes) restarts crashed instances
// Don't try to recover — let process manager restart
> ⚠️ **Don't catch and ignore** unhandled errors. Exit cleanly and let the orchestrator restart you in a known-good state.

### knowledge\concepts\database\sql\README.md
Divides rows into groups for the window calculation. The calculation can restart for each partition.

### knowledge\concepts\_canonical-candidates.md
| **REST API** | `Review mapping report for related material` | Backend/platform concept |
| **Java** | `interview\backend\java\01-Java-1.md; interview\backend\java\01-Java-2.md; interview\backend\java\02-REST-Api.md; interview\backend\java\03-Spring-1.md; interview\backend\java\03-Spring-2.md; interview\backend\java\04-Spring-annotation.md; interview\backend\java\05-Spring-Security.md; interview\backend\java\06-Spring-Cloud.md; interview\backend\java\08-Architecture.md; interview\backend\java\08-MySQL.md; interview\frontend\03-JavaScript.md; knowledge\visual-notes\backend\java-collections.png; practice\coding\01-javascript-coding.md; practice\coding\java\01-core-java-coding.md; practice\coding\java\01-Java-coding.md` | Backend/platform concept |

### knowledge\masterclasses\SQL_MasterClass.html
<li><strong>ORDER BY / LIMIT:</strong> Sorts and restricts output.</li>
<li><strong>PARTITION BY:</strong> Resets the calculation for every unique value (e.g., Restarting a sales rank at 1 for each new Region).</li>
<li><strong>DATE_TRUNC():</strong> Useful for time-series charts. It "rounds down" a timestamp to the nearest month, week, or day.</li>

### projects\README.md
- GraphQL + REST APIs

### roadmap\backend\README.backup.md
- REST APIs
- Swagger

### roadmap\backend\README.md
- RESTful API
- Swagger (OpenAPI Docs)

### roadmap\foundations\README.backup.md
- REST

### roadmap\foundations\README.md
- GraphQL + REST APIs

### roadmap\frontend\README.md
- GraphQL + REST APIs

### scripts\reports\canonical-topic-map.md
| Angular | â€” | â€” | interview\backend\java\02-REST-Api.md; interview\backend\java\08-Architecture.md; interview\frontend\05-Angular-1.md; interview\frontend\05-Angular-2.md; interview\frontend\06-RxJS.md; interview\frontend\09-Web_Architecture.md | practice\coding\03-angular-coding.md | knowledge\visual-notes\angular-lifecycle.png |
| REST API | â€” | â€” | interview\backend\java\06-Spring-Cloud.md; interview\backend\java\08-Architecture.md; interview\frontend\06-RxJS.md | â€” | â€” |
| Spring | â€” | â€” | interview\backend\java\02-REST-Api.md; interview\backend\java\03-Spring-1.md; interview\backend\java\03-Spring-2.md; interview\backend\java\04-Spring-annotation.md; interview\backend\java\05-Spring-Security.md; interview\backend\java\06-Spring-Cloud.md; interview\backend\java\08-Architecture.md; interview\backend\java\08-MySQL.md | â€” | knowledge\visual-notes\backend\spring-actuator.png; knowledge\visual-notes\backend\spring-annotations.png; knowledge\visual-notes\backend\spring-bean-life-cycle.png; knowledge\visual-notes\backend\spring-cloud.png; knowledge\visual-notes\backend\spring-modular-design.png |
| Java | â€” | knowledge\masterclasses\SQL_MasterClass.html | interview\backend\java\01-Java-1.md; interview\backend\java\01-Java-2.md; interview\backend\java\02-REST-Api.md; interview\backend\java\03-Spring-1.md; interview\backend\java\03-Spring-2.md; interview\backend\java\04-Spring-annotation.md; interview\backend\java\05-Spring-Security.md; interview\backend\java\06-Spring-Cloud.md; interview\backend\java\08-Architecture.md; interview\backend\java\08-MySQL.md; interview\frontend\03-JavaScript.md | practice\coding\01-javascript-coding.md; practice\coding\02-css-coding.md; practice\coding\java\01-core-java-coding.md; practice\coding\java\01-Java-coding.md | knowledge\visual-notes\backend\java-collections.png |
- **REST API** â€” missing: Roadmap, Knowledge, Practice

### scripts\reports\content-inventory.md
| interview | `interview\architecture\03-devops-build-tools.md` | MD |  | 547 | 1ï¸âƒ£ Docker â€“ Basic Conceptual Questions; 2ï¸âƒ£ Jenkins + Groovy â€“ CI/CD Basics; 3ï¸âƒ£ Tomcat â€“ Application Server Basics; 4ï¸âƒ£ Maven â€“ Build Tool Fundamentals; 5ï¸âƒ£ How These Tools Work Together (Very Common) | â“ What is Docker and why is it used?; â“ What is the difference between Docker and a Virtual Machine?; â“ What is a Docker image?; â“ What is a Docker container?; â“ What is a Dockerfile?; â“ Why should applications inside Docker be stateless?; â“ How do you pass configuration to a Docker container?; â“ What are common benefits of using Docker in projects?; â“ What is Jenkins?; â“ What is CI/CD?; â“ Why do teams use Jenkins for CI/CD?; â“ What is a Jenkins pipeline?; â“ What is a Jenkinsfile?; â“ Why is Jenkinsfile written in Groovy?; â“ What is Groovy?; â“ Is Groovy statically typed or dynamically typed?; â“ What are common stages in a Jenkins pipeline?; â“ How does Jenkins trigger a pipeline?; â“ What happens when a Jenkins build fails?; â“ What is the difference between Jenkins master and agent?; â“ Where is Groovy mostly used in Jenkins?; â“ What are common problems seen in Jenkins pipelines?; â“ What is Apache Tomcat?; â“ What kind of applications run on Tomcat?; â“ How does Tomcat handle incoming requests?; â“ What is a WAR file?; â“ Difference between embedded Tomcat and external Tomcat?; â“ What are common issues seen in Tomcat?; â“ How do you restart or redeploy applications in Tomcat?; â“ What is Maven and why is it used?; â“ What is a `pom.xml` file?; â“ What is dependency management in Maven?; â“ What are Maven repositories?; â“ What is the Maven build lifecycle?; â“ What is a Maven plugin?; â“ What is a multi-module Maven project?; â“ How does Maven help maintain consistency across environments?; â“ Typical CI/CD flow using these tools?; â“ How do Maven, Jenkins, and Docker work together?; â“ Where does Tomcat fit in this flow?; â“ What problems do these tools solve together? |
| interview | `interview\architecture\microservice-architecture.md` | MD |  | 340 | DESIGN STRUCTURE (REST Orchestration); ðŸ”· DATA FLOW; ðŸ”· DATABASE DESIGN; ðŸ”· HOW DATA IS PASSED; ðŸ”· FUTURE: ADD WalletService | Repo 1 â†’ dashboard-service; Repo 2 â†’ credit-card-service; Repo 3 â†’ upi-service; User closes Credit Subtask; ðŸŸ¢ DATABASE 1 â†’ dashboard_db; ðŸŸ¢ DATABASE 2 â†’ credit_db; ðŸŸ¢ DATABASE 3 â†’ upi_db; ðŸ”· TOTAL TABLE COUNT (Current System); ðŸŸ¢ DATABASE 4 â†’ wallet_db |
| interview | `interview\backend\java\02-REST-Api.md` | MD | ðŸŸ¢ ANGULAR ROUND | 551 | 5ï¸âƒ£ Exception Handling â€“ Senior Strategy | â“ How do you design exception handling in large Java applications?; ðŸ“ Answer; â“ Checked vs unchecked exceptions â€“ what is your strategy?; ðŸ“ Answer; â“ Important HTTP Status Codes to Know; ðŸ“ Answer; â“ If I replace GET with PUT, can I still fetch records?; ðŸ“ Answer; â“ Can we get Request Body in GET?; ðŸ“ Answer; â“ Without @Controller, can we receive API?; ðŸ“ Answer; â“ How do you implement global HTTP status handling in Spring Boot without setting the status code in each controller method?; ðŸ“ Answer |
| interview | `interview\backend\java\06-Spring-Cloud.md` | MD |  | 3678 | Service Boundaries (DDD); Service Discovery; Synchronous vs Asynchronous Communication; Configuration Management (Production Critical); Fault Tolerance; API Gateway (Not Just Routing); Security (Zero Trust Model); Data Consistency; Observability (Production Reality); Fundamentals (Architecture Thinking); Service Communication & Discovery; Configuration Management; Fault Tolerance & Resilience; API Gateway; Security; Data Consistency; Observability & Monitoring; Deployment & Scalability | â“ Why did your team choose microservices over monolith?\_; ðŸ“ Answer; â“ What problems does a microservices architecture introduce, and how does Spring Cloud address those problems?; ðŸ“ Answer; â“ How do you decide where to split services?; ðŸ“ Answer; â“ How do you design REST APIs for microservices?; ðŸ“ Answer; â“ Why canâ€™t we use static URLs?; ðŸ“ Answer; â“ When would you avoid REST between services?; ðŸ“ Answer; â“ How do you change config without redeploying?; ðŸ“ Answer; â“ Inventory service is slow. What happens?; ðŸ“ Answer; â“ Why do we need a gateway?; ðŸ“ Answer; â“ How do services trust each other?; ðŸ“ Answer; â“ How do you handle transactions across services?; ðŸ“ Answer; â“ How do you debug prod issues?; ðŸ“ Answer; â“ You are asked to split a monolith into microservices. What criteria do you use to identify service boundaries?; ðŸ“ Answer; â“ How does Spring Boot help microservices compared to plain Spring?; ðŸ“ Answer; â“ How Load Balancing Works in Spring Boot?; ðŸ“ Answer; â“ How Router Traffic Is Handled (API Gateway); ðŸ“ Answer; â“ How Traffic Routing Works in Kubernetes; ðŸ“ Answer; â“ How do services discover each other in Spring Cloud?; ðŸ“ Answer; â“ When would you avoid synchronous REST calls between services?; ðŸ“ Answer; â“ How do you manage configuration across environments for 20+ microservices?; ðŸ“ Answer; â“ What happens when one microservice goes down? How do you prevent system-wide failure?; ðŸ“ Answer; â“ Difference between Retry and Circuit Breaker?; ðŸ“ Answer; â“ Why do we need an API Gateway in microservices?; ðŸ“ Answer; â“ How do you secure communication between microservices?; ðŸ“ Answer; â“ How do you maintain consistency across multiple microservices?; ðŸ“ Answer; â“ How do you debug issues in production across 15 microservices?; ðŸ“ Answer; â“ How does Kubernetes change microservices design?; ðŸ“ Answer |
| interview | `interview\backend\java\08-Architecture.md` | MD |  | 2878 | Angular; ðŸŒ REST API & Controller Design; ðŸš€ Performance & Scalability; ðŸ“¦ Spring Boot Configuration & Production Readiness; ðŸ” Security & Validation; ðŸ§  Exception Handling & Reliability; ðŸ‘¥ Concurrent Users & Data Consistency; ðŸ§ª Testing & Monitoring; ðŸ§­ Managerial & Design Decisions; ðŸ—„ï¸ Database Design & Access (Spring Boot + MySQL); âš™ï¸ JPA / Hibernate Performance; ðŸ”„ Transactions & Data Consistency; ðŸ‘¥ Concurrent Users & Scalability; ðŸ“¦ Query Design & DTO Usage; ðŸš€ Production Issues & Debugging; ðŸ” Data Safety & Integrity; ðŸ§ª Testing & Migration; ðŸ§­ Managerial / Architectural Decisions; ðŸ” End-to-End System Thinking; ðŸŒ API Design & Communication; ðŸ“¦ Deployment & Release Management; âš™ï¸ Configuration & Environment Issues; ðŸ§  State, Caching & Data Freshness; ðŸ” Security & Data Exposure; ðŸ§ª Testing & Quality; ðŸ‘¥ Team & Ownership Questions (Very Managerial); ðŸš¨ Production Incident Handling; ðŸ§­ Architectural Judgment | â“ Our data table loads very slowly when there are thousands of rows. How would you improve its performance?; ðŸ“ Answer; â“ Scrolling the data table feels laggy. What would you check first?; ðŸ“ Answer; â“ Sorting and filtering freeze the UI for a moment. How would you fix this?; ðŸ“ Answer; â“ After adding a data-table library, the bundle size increased a lot. What would you do?; ðŸ“ Answer; â“ The data table is not needed on the home page, but it still affects load time. How would you handle this?; ðŸ“ Answer; â“ The table works fine locally but is slow in production. How would you debug this?; ðŸ“ Answer; â“ API responses are very large and slow down table loading. What would you suggest?; ðŸ“ Answer; â“ How would you verify if GZip compression is working?; ðŸ“ Answer; â“ Two users see different data in the table at the same time. How would you handle this?; ðŸ“ Answer; â“ Filters applied by one user should not affect another user. How would you ensure this?; ðŸ“ Answer; â“ The table data reloads again and again when navigating back. How would you optimize this?; ðŸ“ Answer; â“ How would you decide between using a table library or building your own?; ðŸ“ Answer; â“ A table library causes performance issues but is used across the app. What would you do?; ðŸ“ Answer; â“ The table shows user-generated content. How would you keep it secure?; ðŸ“ Answer; â“ How would you measure table performance in real user environments?; ðŸ“ Answer; â“ A fix for table performance needs major refactoring. How would you plan it?; ðŸ“ Answer; â“ Our REST API is getting hard to maintain as features grow. How would you structure controllers better?; ðŸ“ Answer; â“ Multiple controllers are returning different response formats. How would you standardize this?; ðŸ“ Answer; â“ One controller method is doing validation, business logic, and DB calls. How would you fix this?; ðŸ“ Answer; â“ Our API becomes slow when traffic increases. What would you check first?; ðŸ“ Answer; â“ A single API call returns a very large response and affects performance. How would you optimize it?; ðŸ“ Answer; â“ How would you reduce repeated database calls for the same data?; ðŸ“ Answer; â“ Our application behaves differently in local and production environments. How would you manage this?; ðŸ“ Answer; â“ How would you make sure debug logs donâ€™t affect production performance?; ðŸ“ Answer; â“ The app startup time increased after adding new modules. How would you improve it?; ðŸ“ Answer; â“ How do you protect REST APIs from invalid or malicious input?; ðŸ“ Answer; â“ How would you secure APIs so only authorized users can access them?; ðŸ“ Answer; â“ When an exception happens, users see different error messages. How would you fix this?; ðŸ“ Answer; â“ How would you handle checked and unchecked exceptions in services?; ðŸ“ Answer; â“ Two users update the same record at the same time. How would you handle this?; ðŸ“ Answer; â“ How do you ensure thread safety in a Spring Boot application?; ðŸ“ Answer; â“ How would you test REST controllers properly?; ðŸ“ Answer; â“ How would you monitor API performance in production?; ðŸ“ Answer; â“ The team is divided between quick fixes and long-term refactoring. How would you decide?; ðŸ“ Answer; â“ How would you explain a REST API performance issue to a non-technical manager?; ðŸ“ Answer; â“ If a breaking change is required in an API, how would you manage it?; ðŸ“ Answer; â“ Our database tables are growing very fast and queries are getting slow. What would you check first?; ðŸ“ Answer; â“ A single API call is hitting the database multiple times. How would you optimize this?; ðŸ“ Answer; â“ The same data is being read again and again from MySQL. How would you reduce DB load?; ðŸ“ Answer; â“ Our API is slow even though the database is fast. What could be the issue?; ðŸ“ Answer; â“ How do you decide between `Lazy` and `Eager` fetching?; ðŸ“ Answer; â“ Large result sets are causing memory issues. How would you handle this?; ðŸ“ Answer; â“ Multiple DB operations must succeed or fail together. How would you handle this?; ðŸ“ Answer; â“ Two users update the same record at the same time. How do you prevent data conflicts?; ðŸ“ Answer; â“ When would you use pessimistic locking?; ðŸ“ Answer; â“ Under high traffic, DB connections are getting exhausted. How would you fix this?; ðŸ“ Answer; â“ How do you make sure multiple users donâ€™t affect each otherâ€™s data?; ðŸ“ Answer; â“ Entities are large but APIs need only a few fields. What would you do?; ðŸ“ Answer; â“ Why should controllers not return JPA entities directly?; ðŸ“ Answer; â“ Queries work fine locally but are slow in production. How would you debug this?; ðŸ“ Answer; â“ After a release, database CPU usage increased suddenly. What would you check?; ðŸ“ Answer; â“ How do you prevent invalid data from being saved in MySQL?; ðŸ“ Answer; â“ How do you handle soft deletes instead of hard deletes?; ðŸ“ Answer; â“ How do you manage database schema changes safely?; ðŸ“ Answer; â“ How would you test database logic without affecting real data?; ðŸ“ Answer; â“ When would you avoid using JPA and write native SQL instead?; ðŸ“ Answer; â“ How would you explain a database performance issue to management?; ðŸ“ Answer; â“ If database refactoring is risky, how would you plan it?; ðŸ“ Answer; â“ A screen loads slowly, but itâ€™s unclear whether the issue is frontend, API, or DB. How would you approach this?; ðŸ“ Answer; â“ Frontend says backend is slow, backend says frontend is inefficient. How would you resolve this?; ðŸ“ Answer; â“ Frontend needs frequent API changes, but backend releases are slower. How would you manage this?; ðŸ“ Answer; â“ Angular team requests more data â€œjust in case.â€ How would you respond?; ðŸ“ Answer; â“ A backend change breaks the Angular app after deployment. How would you prevent this?; ðŸ“ Answer; â“ How would you roll out a risky backend change safely?; ðŸ“ Answer; â“ Everything works locally but fails in staging or production. What would you check?; ðŸ“ Answer; â“ How do you ensure Angular points to the correct backend per environment?; ðŸ“ Answer; â“ Cached data improves performance but users see outdated data. How would you balance this?; ðŸ“ Answer; â“ When should data be cached on frontend vs backend?; ðŸ“ Answer; â“ Angular needs user-specific data. How do you ensure users see only their own data?; ðŸ“ Answer; â“ How do you prevent sensitive DB fields from reaching the UI?; ðŸ“ Answer; â“ Bugs keep appearing at integration points. How would you improve quality?; ðŸ“ Answer; â“ How do you ensure performance does not degrade over time?; ðŸ“ Answer; â“ A feature works but is poorly designed. Do you ship or refactor?; ðŸ“ Answer; â“ A junior developer wrote a slow query. How would you handle it?; ðŸ“ Answer; â“ How do you make sure frontend and backend teams stay aligned?; ðŸ“ Answer; â“ Production is slow and users are complaining. What are your first 3 actions?; ðŸ“ Answer; â“ A hotfix is needed quickly. How do you balance speed and safety?; ðŸ“ Answer; â“ When would you split a monolithic Spring Boot app?; ðŸ“ Answer; â“ How do you decide if a problem should be solved in Angular or backend?; ðŸ“ Answer; â“ What challenges you encountered while upgrading Spring or Java?; ðŸ“ Answer; â“ What is Idempotency?; ðŸ“ Answer |
| interview | `interview\frontend\06-RxJS.md` | MD | ðŸŒŠ RxJS Interview Prep â€” Reactive Programming Mastery | 3897 | ðŸŽ“ Final Cheat Sheet | â“ How would you explain RxJS to a developer who's never used reactive programming before?; ðŸ“ Answer; â“ Can you walk me through what an Observable is and how it differs from a Promise?; ðŸ“ Answer; â“ What role does an Observer play in RxJS, and how does it interact with an Observable?; ðŸ“ Answer; â“ What does a Subscription represent in RxJS, and why is managing it important?; ðŸ“ Answer; â“ Can you explain what an RxJS operator is and how operators are composed in a pipeline?; ðŸ“ Answer; â“ What's the difference between Pipeable and Creation operators?; ðŸ“ Answer; â“ Is an Observable lazy or eager?; ðŸ“ Answer; â“ Can Observables be synchronous?; ðŸ“ Answer; â“ What are the three notifications an Observable can emit?; ðŸ“ Answer; â“ Can an Observable emit after `complete`?; ðŸ“ Answer; â“ How would you describe a Cold Observable, and when does it matter whether an Observable is cold or hot?; ðŸ“ Answer; ðŸ“ Answer; ðŸ“ Answer; â“ `share()` vs `shareReplay()` â€” explain with example; ðŸ“ Answer; â“ ðŸª¤ Trick: What's a common memory leak pitfall with `shareReplay`?; ðŸ“ Answer; â“ Can you explain what a Subject is in RxJS and when you'd reach for it over a plain Observable?; ðŸ“ Answer; ðŸ“ Answer; â“ ðŸª¤ Trick: Does `BehaviorSubject` emit its current value immediately on subscription?; ðŸ“ Answer; â“ ðŸª¤ Trick: Can a `Subject` emit values before anyone subscribes?; ðŸ“ Answer; â“ ðŸª¤ Trick: What happens if you call `.next()` on a completed `Subject`?; ðŸ“ Answer; â“ Why is exposing a `BehaviorSubject` directly from a service considered a design smell?; ðŸ“ Answer; â“ What does `map` do?; ðŸ“ Answer; ðŸ“ Answer; ðŸ“ Answer; ðŸ“ Answer; â“ Difference between `map` and `switchMap`?; ðŸ“ Answer; â“ Explain `mergeMap` (a.k.a. `flatMap`); ðŸ“ Answer; ðŸ“ Answer; ðŸ“ Answer; ðŸ§  The Big Four â€” Visual Comparison; â“ ðŸª¤ Trick: For autocomplete search, which operator is best?; ðŸ“ Answer; â“ ðŸª¤ Trick: For a login button that must ignore double-clicks, which operator?; ðŸ“ Answer; â“ ðŸª¤ Trick: For a queue of tasks executed strictly in order, which operator?; ðŸ“ Answer; â“ Difference between `combineLatest` and `forkJoin`?; ðŸ“ Answer; â“ Difference between `merge` and `concat`?; ðŸ“ Answer; â“ What does `withLatestFrom` do?; ðŸ“ Answer; â“ Use case for `race`?; ðŸ“ Answer; â“ ðŸª¤ Trick: Does `combineLatest([a$, b$])` emit if `a$` emits but `b$` has never emitted?; ðŸ“ Answer; â“ How does `catchError` work?; ðŸ“ Answer; ðŸ“ Answer; ðŸ“ Answer; ðŸ“ Answer; ðŸ“ Answer; â“ ðŸª¤ Trick: If you `catchError` and return `EMPTY`, does the stream complete?; ðŸ“ Answer; â“ ðŸª¤ Trick: Can `catchError` swallow an error and keep the outer stream alive?; ðŸ“ Answer; â“ Can you explain what a Scheduler is in RxJS and when you'd need to explicitly specify one?; ðŸ“ Answer; â“ Why might you use `observeOn(asyncScheduler)`?; ðŸ“ Answer; â“ How does RxJS interact with Angular's Zones and Change Detection?; ðŸ“ Answer; â“ How does Angular's `HttpClient` use RxJS?; ðŸ“ Answer; â“ ðŸª¤ Trick: If you subscribe twice to the same `this.http.get(...)`, how many HTTP calls happen?; ðŸ“ Answer; â“ How do you avoid multiple HTTP calls when many components need the same data?; ðŸ“ Answer; â“ What does the `async` pipe do?; ðŸ“ Answer; â“ When should you NOT use the `async` pipe?; ðŸ“ Answer; â“ How would you model component state using RxJS?; ðŸ“ Answer; â“ Example: How to debounce a search input in Angular?; ðŸ“ Answer; â“ How does RxJS fit into NgRx?; ðŸ“ Answer; â“ How do memory leaks occur with RxJS in Angular?; ðŸ“ Answer; ðŸ“ Answer; ðŸ“ Answer; â“ ðŸª¤ Trick: Does a `BehaviorSubject` with no subscribers cause a memory leak by itself?; ðŸ“ Answer; â“ ðŸª¤ Trick: Does `subscribe` return a Promise?; ðŸ“ Answer; â“ ðŸª¤ Trick: If you call `unsubscribe()` on a completed stream, what happens?; ðŸ“ Answer; â“ ðŸª¤ Trick: Will `map` execute if no one subscribes?; ðŸ“ Answer; â“ ðŸª¤ Trick: Does `tap` change the emitted values?; ðŸ“ Answer; â“ ðŸª¤ Trick: `interval(1000).pipe(take(0))` â€” does it emit anything?; ðŸ“ Answer; â“ ðŸª¤ Trick: `from([1,2,3]).pipe(switchMap(x => of(x)))` â€” can any values be cancelled?; ðŸ“ Answer; â“ ðŸª¤ Trick: `share()` vs `shareReplay(1)` for HTTP caching?; ðŸ“ Answer; â“ Mock: You have an infinite WebSocket stream. Some components need it; others don't. Design?; ðŸ“ Answer; â“ Mock: File upload progress with cancel support. RxJS approach?; ðŸ“ Answer; â“ Mock: Poll a backend every 10s, but stop on navigation away or error.; ðŸ“ Answer; â“ Mock: Combine backend prefs + local UI overrides. Model with RxJS?; ðŸ“ Answer; â“ Mock: Three dependent HTTP calls â€” B depends on A, C depends on B. Implementation?; ðŸ“ Answer; â“ Mock: Debounce keystrokes, but execute immediately on Enter key.; ðŸ“ Answer; â“ Mock: Wizard where each step depends on the previous result and can be retried. Operator choices?; ðŸ“ Answer; â“ You have two REST APIs:; ðŸ“ Answer; `toSignal(observable$)` â€” Observable â†’ Signal; `toObservable(signal)` â€” Signal â†’ Observable |
- Inspect SQL Masterclass structure before converting or restructuring it.

### scripts\reports\sql-canonical-evidence.md
<li><strong>ORDER BY / LIMIT:</strong> Sorts and restricts output.</li>
<li><strong>PARTITION BY:</strong> Resets the calculation for every unique value (e.g., Restarting a sales rank at 1 for each new Region).</li>
<li><strong>DATE_TRUNC():</strong> Useful for time-series charts. It "rounds down" a timestamp to the nearest month, week, or day.</li>
- Better security (direct table access can be restricted)


