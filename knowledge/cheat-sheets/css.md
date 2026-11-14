# CSS — Cheat Sheet

> **In one line:** CSS decides how things look (colours, fonts) and where they sit (layout).

## Box model
Every element is a box: **content → padding → border → margin**.
- `box-sizing: border-box` — `width` includes padding and border. Use it everywhere.

```css
*, *::before, *::after { box-sizing: border-box; }
```

## Which rule wins? (specificity)
From strongest to weakest:
1. `!important`
2. Inline `style=""`
3. `#id`
4. `.class`, `[attr]`, `:hover`
5. `div`, `p`, `::before`
- Same strength → the rule written later wins.
- Some properties are inherited by children (`color`, `font`); others aren't (`margin`, `border`).

## Selectors
- `A B` — B anywhere inside A. `A > B` — direct child. `A + B` — the next sibling.
- `:hover`, `:focus`, `:nth-child(2)`, `:not(.x)`, `:has(img)` (parent selector).
- `::before` / `::after` — add content before/after an element.

## Position
- **static** — normal flow (default).
- **relative** — moved from its normal spot; its space is kept.
- **absolute** — placed relative to the nearest positioned parent; leaves the flow.
- **fixed** — stuck to the screen.
- **sticky** — normal until you scroll past it, then sticks.
- **z-index** — what's on top (only works on positioned elements).

## Flexbox — one direction (row or column)
```css
.row { display: flex; justify-content: space-between; align-items: center; gap: 1rem; }
```
- `justify-content` — along the row. `align-items` — across it.
- `flex: 1` — share the free space equally.
- Centre anything: `display: flex; justify-content: center; align-items: center;`

## Grid — two directions (rows and columns)
```css
.cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; }
```
- `fr` — a share of the free space.
- Grid for page layout; Flexbox for things in a line.

## Units
- `px` — fixed. `%` — of the parent.
- `rem` — of the root font size (predictable). `em` — of the element's own font size.
- `vw` / `vh` — of the screen size.
- `clamp(1rem, 2vw, 2rem)` — grows with the screen, between a min and a max.

## Responsive design
- **Mobile first** — write phone styles, then add `@media (min-width: 768px) { … }` for bigger screens.
- **Container queries** — style by the parent's size: `@container (min-width: 400px)`.

## Hide things
- `display: none` — gone, takes no space.
- `visibility: hidden` — invisible, keeps its space.
- `opacity: 0` — invisible, still clickable.

## Modern & performance
- **CSS variables** — `--brand: blue; color: var(--brand);`
- **Animations** — `transition` (A → B) or `@keyframes` (many steps).
- Animate only `transform` and `opacity` — they're smooth because they don't re-calculate layout.
- **Reflow** — layout re-calculated (slow). **Repaint** — only pixels redrawn.
- Naming: **BEM** `.card__title--active`; or CSS Modules, Tailwind.
