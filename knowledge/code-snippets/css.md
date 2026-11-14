# CSS — Code Snippets

> Code interviewers ask you to write from memory. Short, commented, ready to explain.

### 1. Center anything
```css
.parent { display: grid; place-items: center; }          /* shortest */
.parent { display: flex; justify-content: center; align-items: center; }
```

### 2. Responsive card grid (no media queries)
```css
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}
```

### 3. Holy-grail page layout
```css
body {
  display: grid;
  grid-template: "header header" auto
                 "nav    main"   1fr
                 "footer footer" auto / 220px 1fr;
  min-height: 100dvh;
}
header { grid-area: header; } nav { grid-area: nav; } main { grid-area: main; } footer { grid-area: footer; }
@media (max-width: 700px) {
  body { grid-template: "header" auto "main" 1fr "nav" auto "footer" auto / 1fr; }
}
```

### 4. Truncate text with "…"
```css
.one-line { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.three-lines { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
```

### 5. Sticky header
```css
header { position: sticky; top: 0; z-index: 10; background: white; }
```

### 6. Theme with CSS variables (light/dark)
```css
:root { --bg: #fff; --text: #111; }
@media (prefers-color-scheme: dark) { :root { --bg: #111; --text: #eee; } }
body { background: var(--bg); color: var(--text); }
```

### 7. Smooth, cheap animation
```css
.toast { transform: translateY(100%); opacity: 0; transition: transform .25s ease, opacity .25s ease; }
.toast.show { transform: translateY(0); opacity: 1; }
@media (prefers-reduced-motion: reduce) { .toast { transition: none; } }
```

### 8. Keep an aspect ratio
```css
.video { width: 100%; aspect-ratio: 16 / 9; }
.thumb { width: 120px; aspect-ratio: 1; object-fit: cover; }
```
