# CSS — Quick Traps

> Tricky spots interviewers love: what goes wrong, a tiny example, and the right answer.

### 1. Width plus padding overflows
- ❌ `width: 100%; padding: 20px;` → wider than the parent.
- ✅ `box-sizing: border-box` puts padding inside the width.

### 2. Margins collapse
- ❌ `margin-bottom: 20px` + next element `margin-top: 30px` → expecting 50px gap.
- ✅ Vertical margins merge into the larger one (30px). Not inside flex or grid.

### 3. `z-index: 9999` still underneath
- ❌ A child with a huge `z-index` stays behind a sibling of its parent.
- ✅ `z-index` only competes inside its **stacking context** (created by `position` + `z-index`, `transform`, `opacity < 1`).

### 4. `z-index` doing nothing
- ❌ `z-index: 10` on a `position: static` element.
- ✅ Give it `position: relative` (or use it on flex/grid items).

### 5. `absolute` jumps to the page corner
- ❌ An `absolute` child sits at the page's top-left.
- ✅ It uses the nearest *positioned* ancestor. Add `position: relative` to the parent.

### 6. `margin: auto` not centring
- ❌ `margin: 0 auto` on an element with no width, or an inline element.
- ✅ It needs a block element with a width (or use flexbox).

### 7. `em` grows when nested
- ❌ `font-size: 1.2em` inside another `1.2em` → 1.44× bigger.
- ✅ Use `rem` for predictable sizes.

### 8. Percentage padding uses width
- ❌ Expecting `padding-top: 50%` to be half the parent's height.
- ✅ Vertical padding percentages are based on the parent's **width**.

### 9. Animating `width` or `top`
- ❌ `transition: left 0.3s` → janky.
- ✅ Animate `transform: translateX()` and `opacity`; they skip layout.

### 10. `!important` everywhere
- ❌ Fixing every conflict with `!important`.
- ✅ Lower specificity instead (classes, not IDs); `!important` wars are hard to undo.

### 11. `100vh` on phones
- ❌ `height: 100vh` gets hidden behind the mobile address bar.
- ✅ Use `100dvh` (dynamic viewport height).
