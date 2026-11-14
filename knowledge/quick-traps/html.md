# HTML — Quick Traps

> Tricky spots interviewers love: what goes wrong, a tiny example, and the right answer.

### 1. Clickable `<div>`s
- ❌ `<div onclick="save()">Save</div>` — no keyboard, no screen reader support.
- ✅ Use `<button>`: focus and Enter/Space work for free.

### 2. Missing vs empty `alt`
- ❌ `<img src="logo.png">` — screen readers read the file name.
- ✅ Describe it (`alt="Company logo"`), or `alt=""` if it's only decoration.

### 3. Buttons inside forms submit
- ❌ `<button onclick="openHelp()">Help</button>` inside a form submits the form.
- ✅ A button in a form is `type="submit"` by default. Write `type="button"`.

### 4. `<b>` vs `<strong>`
- ❌ Thinking they're the same.
- ✅ `<b>` only looks bold; `<strong>` means "important" to screen readers. Same for `<i>` vs `<em>`.

### 5. Placeholder as the label
- ❌ `<input placeholder="Email">` with no label — the hint disappears when you type.
- ✅ Always add a `<label>`.

### 6. Images without size
- ❌ `<img src="hero.jpg">` — the page jumps when it loads.
- ✅ Set `width` and `height` (or CSS `aspect-ratio`) to reserve the space.

### 7. `async` scripts that depend on each other
- ❌ `<script async src="jquery.js">` + `<script async src="app.js">` — order isn't guaranteed.
- ✅ Use `defer`: runs in order after the page is parsed.

### 8. Duplicate `id`s
- ❌ Two elements with `id="price"` — `getElementById` finds only the first.
- ✅ `id` must be unique; use `class` for repeats.

### 9. Client-side validation is enough
- ❌ Trusting `required` and `pattern` for security.
- ✅ Anyone can skip them. Always validate on the server too.

### 10. Links inside buttons
- ❌ `<a href="/x"><button>Go</button></a>`
- ✅ Don't nest clickable elements. Use a link styled as a button.
