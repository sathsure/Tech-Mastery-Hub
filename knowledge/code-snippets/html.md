# HTML — Code Snippets

> Code interviewers ask you to write from memory. Short, commented, ready to explain.

### 1. Semantic page layout
```html
<body>
  <header><nav aria-label="Main">…</nav></header>
  <main>
    <article>
      <h1>Post title</h1>
      <p>…</p>
    </article>
    <aside>Related links</aside>
  </main>
  <footer>© 2026</footer>
</body>
```

### 2. Accessible form
```html
<form action="/signup" method="post" novalidate>
  <label for="email">Email</label>
  <input id="email" name="email" type="email" required autocomplete="email"
         aria-describedby="email-help">
  <small id="email-help">We'll never share it.</small>

  <fieldset>
    <legend>Plan</legend>
    <label><input type="radio" name="plan" value="free" checked> Free</label>
    <label><input type="radio" name="plan" value="pro"> Pro</label>
  </fieldset>

  <button type="submit">Sign up</button>
</form>
```

### 3. Responsive image
```html
<img src="hero-800.webp"
     srcset="hero-400.webp 400w, hero-800.webp 800w, hero-1600.webp 1600w"
     sizes="(max-width: 600px) 100vw, 800px"
     width="800" height="450" alt="Team at work" fetchpriority="high">
```

### 4. Accessible modal with `<dialog>`
```html
<button id="open">Open</button>
<dialog id="dlg" aria-labelledby="dlg-title">
  <h2 id="dlg-title">Confirm</h2>
  <form method="dialog"><button>Close</button></form>
</dialog>
<script>
  document.getElementById("open").onclick = () => document.getElementById("dlg").showModal();
</script>
```

### 5. Head essentials
```html
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Product — Shop</title>
  <meta name="description" content="Short summary for search results">
  <meta property="og:image" content="https://example.com/share.png">
  <link rel="preconnect" href="https://api.example.com">
  <script src="app.js" defer></script>
</head>
```
