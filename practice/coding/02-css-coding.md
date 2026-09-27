# 🎨 CSS Coding Interview Questions


---

### ❓ How would you center a div both vertically and horizontally? Walk me through the different approaches.

### 📝 Answer

**Method 1: Flexbox (most common)**

```css
.parent {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
```

**Method 2: Grid (shortest)**

```css
.parent {
  display: grid;
  place-items: center;
  min-height: 100vh;
}
```

**Method 3: Absolute positioning (legacy support)**

```css
.parent { position: relative; }
.child {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
}
```

> 💡 **Pick Flexbox/Grid in modern apps. Absolute positioning works when you can't change parent's display.**

---

### ❓ How would you convert a row layout to a column layout on mobile using CSS?

### 📝 Answer

```css
.container {
  display: flex;
  gap: 16px;
}

@media (max-width: 768px) {
  .container {
    flex-direction: column;
  }
}
```

> 💡 **Pro tip**: Use `flex-wrap: wrap` instead if you want fluid wrapping without media queries.

---

### ❓ How would you make a div perfectly circular using only CSS?

### 📝 Answer

```html
<div class="circle"></div>
```

```css
.circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: tomato;
}
```

> 💡 **Rule**: width and height MUST be equal. Otherwise you'll get an oval (which is sometimes what you want).

---

### ❓ How do you make an element stick to the top of the viewport while the user scrolls?

### 📝 Answer

```html
<div class="container">
  <div class="header">Sticky Header</div>
  <div class="content">Scroll content</div>
</div>
```

```css
.container {
  height: 250px;
  overflow-y: auto;        /* scrolling ancestor */
}

.header {
  position: sticky;
  top: 0;
  background: black;
  color: white;
}

.content {
  height: 1000px;          /* forces scroll */
}
```

> ⚠️ **`position: sticky` sticks ONLY inside its scrolling ancestor.** It does NOT stick to the viewport if a parent has `overflow: hidden/auto`.

---

### ❓ A developer used `margin: auto` expecting vertical centering, but it didn't work. What's the issue and how would you fix it?

### 📝 Answer

In normal block flow, `margin: auto` centers **horizontally only** because the block direction has no spare space to distribute.

**Fix using Flexbox:**

```css
.parent {
  display: flex;
  min-height: 100vh;
}

.box {
  margin: auto;          /* now works in BOTH directions */
}
```

> 💡 **Why?** Flexbox computes available space along both axes, so `margin: auto` can absorb space vertically.

---

### ❓ How would you build a responsive 3-column grid that collapses to a single column on mobile?

### 📝 Answer

**The modern way — no media queries:**

```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}
```

This creates as many columns as fit, each at least 250px wide. On mobile, it naturally becomes 1 column.

**With explicit breakpoints (Flexbox):**

```css
.grid { display: flex; flex-wrap: wrap; gap: 1rem; }
.grid > * { flex: 1 1 calc(33.333% - 1rem); }

@media (max-width: 768px) {
  .grid > * { flex: 1 1 100%; }
}
```

---

### ❓ How do you truncate overflowing text with an ellipsis after exactly 2 lines?

### 📝 Answer

```css
.text {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

For **single-line truncation**:

```css
.text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 200px;            /* must have constrained width */
}
```

> 💡 **Trap**: Single-line ellipsis needs `width`, `overflow: hidden`, AND `white-space: nowrap` — all three.

---

### ❓ How would you build a full-page modal overlay using CSS?

### 📝 Answer

```html
<div class="overlay">
  <div class="modal">
    <h2>Modal Title</h2>
    <p>Content...</p>
  </div>
</div>
```

```css
.overlay {
  position: fixed;
  inset: 0;                              /* shorthand for top/right/bottom/left: 0 */
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}
```

> 💡 Use `inset: 0` — much cleaner than four separate properties.

---

### ❓ Can you create a loading spinner using only CSS — no JavaScript, no images?

### 📝 Answer

```css
.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #eee;
  border-top-color: #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

> 💡 **Performance**: Animating `transform` is GPU-accelerated and smooth at 60fps.

---

### ❓ How would you build a custom styled checkbox or toggle switch using only CSS?

### 📝 Answer

```html
<label class="switch">
  <input type="checkbox" />
  <span class="slider"></span>
</label>
```

```css
.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 26px;
}
.switch input { display: none; }

.slider {
  position: absolute;
  inset: 0;
  background: #ccc;
  border-radius: 26px;
  cursor: pointer;
  transition: background 0.2s;
}

.slider::before {
  content: "";
  position: absolute;
  width: 20px; height: 20px;
  left: 3px; top: 3px;
  background: white;
  border-radius: 50%;
  transition: transform 0.2s;
}

.switch input:checked + .slider {
  background: #007bff;
}
.switch input:checked + .slider::before {
  transform: translateX(24px);
}
```

> 💡 Hides native checkbox, uses `:checked + .slider` to react to state.

---

# 🎯 Mock Interview Question

### ❓ Design a User Profile Card UI component using CSS — what would your approach be?

> **Requirements:**
>
> **Layout & Structure**
> - Card centered horizontally on the page
> - Fixed-width card, responsive-friendly
> - Image at the top
> - Content section below image
>
> **Styling & Visuals**
> - Rounded corners
> - Box shadow
> - Hover effect (slight lift)
> - Proper spacing (no hardcoded magic numbers)
>
> **Image**
> - Fill width, maintain aspect ratio, no stretching
>
> **Text**
> - Name (bold, single line)
> - Bio: max 2 lines, ellipsis on overflow
> - Role badge aligned top-right (overlay)
>
> **Actions**
> - Two buttons at bottom: left and right aligned
> - Buttons must stay at bottom even if bio length changes
>
> **Constraints**
> - No JavaScript
> - No absolute positioning for main layout
> - Use modern CSS only

### 📝 Answer

```html
<div class="card">
  <span class="badge">PRO</span>

  <img src="https://via.placeholder.com/400x200" alt="profile" />

  <div class="card-body">
    <h2>John Doe</h2>

    <p class="bio">
      Frontend developer with strong experience in building scalable UI
      components and design systems.
    </p>

    <div class="actions">
      <button>Message</button>
      <button class="primary">Follow</button>
    </div>
  </div>
</div>
```

```css
* { box-sizing: border-box; }

body {
  margin: 0;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f5f5f5;
  font-family: system-ui, sans-serif;
}

.card {
  width: 320px;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  position: relative;          /* needed for absolute badge */
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.card:hover { transform: translateY(-4px); }

.card img {
  width: 100%;
  height: 180px;
  object-fit: cover;           /* fill without distortion */
}

.badge {
  position: absolute;
  top: 12px; right: 12px;
  background: black;
  color: white;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 6px;
  z-index: 1;
}

.card-body {
  padding: 16px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;                /* fills remaining height */
}

.card-body h2 {
  margin: 0 0 8px;
  font-size: 18px;
}

.bio {
  margin: 0;
  color: #555;
  font-size: 14px;
  line-height: 1.4;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.actions {
  margin-top: auto;            /* pushes buttons to bottom */
  display: flex;
  justify-content: space-between;
  padding-top: 16px;
}

button {
  padding: 8px 14px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  color: #333;
  cursor: pointer;
}

button.primary {
  background: #007bff;
  color: white;
  border-color: #007bff;
}
```

> 🧠 **Key design decisions to call out in an interview**
>
> - `flex-direction: column` + `flex-grow: 1` on body + `margin-top: auto` on actions = buttons stick to bottom regardless of bio length.
> - `object-fit: cover` keeps the image filled without distortion.
> - `-webkit-line-clamp` for multi-line ellipsis.
> - `position: absolute` is acceptable for the badge (it's an overlay, not main layout).
> - `transform: translateY` for hover lift = GPU-accelerated, smooth.

---
