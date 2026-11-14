# HTML — Cheat Sheet

> **In one line:** HTML gives a page its structure and meaning: headings, text, links, images, forms.

## Page skeleton
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>My page</title>
</head>
<body> … </body>
</html>
```
- **`<!DOCTYPE html>`** — use modern browser rules.
- **viewport meta** — makes the page fit phone screens.
- **`lang`** — helps screen readers and translation.

## Semantic tags
Tags that say *what* the content is, not just how it looks.
- `header`, `nav`, `main`, `article`, `section`, `aside`, `footer`.
- **Why** — screen readers, search engines and other developers understand the page.
- One `<h1>` per page; don't skip heading levels.

## Block vs inline
- **Block** (`div`, `p`, `h1`, `section`) — starts on a new line, full width.
- **Inline** (`span`, `a`, `strong`) — sits inside text; width/height don't apply.
- **inline-block** — inline, but width/height work.

## Forms
```html
<form action="/login" method="post">
  <label for="email">Email</label>
  <input id="email" name="email" type="email" required>
  <button type="submit">Log in</button>
</form>
```
- Input types: `email`, `number`, `date`, `password`, `checkbox`, `radio`, `file`.
- Built-in checks: `required`, `min`, `max`, `pattern`.
- **GET** puts data in the URL (search). **POST** sends it in the body (login, create).
- Every input needs a `<label>`.

## Accessibility (a11y)
- Use real elements: `<button>`, not a clickable `<div>`.
- Images need `alt` text (`alt=""` for decoration).
- Everything should work with the keyboard (Tab, Enter, Space).
- **ARIA** (`aria-label`, `role`) — only when plain HTML can't say it.

## Loading scripts and images
- `<script>` — stops the page while it loads and runs.
- `<script defer>` — loads in the background, runs after the page, in order.
- `<script async>` — loads in the background, runs as soon as it's ready.
- `<img loading="lazy" width="400" height="300">` — load later; reserve space.
- `srcset` — let the browser pick the right image size.

## Other must-knows
- **`id`** is unique; **`class`** can repeat.
- **`data-*` attributes** — store extra data: `data-user-id="7"` → `el.dataset.userId`.
- **Canvas** draws pixels; **SVG** draws shapes that stay sharp at any size.
- **SEO basics** — `<title>`, meta description, headings, `og:` tags for share previews.
- **DOM** — the tree the browser builds from your HTML; JavaScript reads and changes it.
