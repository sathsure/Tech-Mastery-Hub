# Frontend (React / Next.js Ecosystem)

### | Frameworks / Libraries |
- [![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org)
  * #### Development Server:
      * webpack-dev-server – used in older setups (like Create React App).
      * Vite – used in modern setups, faster due to native ES modules and esbuild.
  * #### Production Server:
      * Node.js, Nginx, Apache, or cloud services like Vercel, Firebase, or Netlify.
  * #### Transpiler & Compiler:
      * React uses **Babel** to transpile JSX into plain JavaScript, which the browser can execute directly.
      * No need for a separate compiler — Everything runs in the browser using the JavaScript engine with the help of the Virtual DOM.
  * #### DOM Updation:
      * React updates the UI by using a **Virtual DOM** and a process called **reconciliation** to efficiently compare changes between renders and update only what’s necessary.

- [![Angular](https://img.shields.io/badge/Angular-DD0031?style=flat&logo=angular&logoColor=white)](https://angular.io)
  * #### Development Server:
      * webpack-dev-server under the hood, configured by Angular CLI.
  * #### Production Server:
      * Node.js, Nginx, Apache, or cloud services like Vercel, Firebase, or Netlify.
  * #### Transpiler & Compiler:
      * Angular uses the **Ivy compiler** first to process decorators and compile templates into JavaScript.
      * Then, the **TypeScript compiler (tsc)** transpiles into final JavaScript.
      * During development, Ivy uses a JIT (Just-in-Time) strategy to compile templates in the browser for faster rebuilds.
      * During production, Ivy uses an AOT (Ahead-of-Time) strategy to compile everything at build time for optimized performance.
  * #### DOM Updation:
      * Angular works with the real DOM, using **zone.js** to track asynchronous operations and automatically trigger **change detection**, which then scans the component tree to detect state changes and updates the UI accordingly.

- [![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=nextdotjs&logoColor=white)](https://nextjs.org) (React Framework)
- SSR, CSR, SSG, ISR [▶️](https://youtu.be/p02AIAoImzU?si=htlIQVewi6dQ7Wm4) Example: Next.js

### Styling & UI
- CSS-in-JS (styled-components, emotion)
- TailwindCSS (utility-first CSS)
- MUI (Material UI)
- SCSS / SASS
- Framer Motion (Animations)

### Routing
- React Router v6+
- Nested Routes, Route Guards, Lazy Loading

### State Management
- React Context API
- Redux Toolkit
- Zustand
- React Query / SWR

### Form Handling
- React Hook Form
- Yup, Zod (Validation)

### Accessibility & i18n
- ARIA roles
- Semantic HTML
- Color contrast, keyboard navigation
- React-i18next

### Performance & Optimizations
- Code splitting
- Lazy loading
- Image optimization
- Memoization (React.memo, useMemo, useCallback)
- Virtualization (react-window)
- SSR/SSG (Next.js)
- Prefetching, prerendering

### Browser Features
- Service Workers
- PWA basics
- WebSockets (Socket.IO)
- LocalStorage / SessionStorage
- Web Workers

### Build Tools
- ESLint / Prettier
- Husky + Lint-staged (pre-commit hooks)

---

_Source: [`_migration/Fullstack-Roadmap/README.md`](../../_migration/Fullstack-Roadmap/README.md), lines 35–109._
