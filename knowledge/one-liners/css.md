# CSS — One-liners

> The most asked questions, each answered in one sentence.

1. **What is the box model?** — Every element is a box of content, padding, border and margin.
2. **What does `box-sizing: border-box` do?** — It makes `width` include padding and border.
3. **What is specificity?** — The weight that decides which rule wins: inline > ID > class/attribute/pseudo-class > element.
4. **Flexbox vs Grid?** — Flexbox lays out items in one direction; Grid lays them out in rows and columns at once.
5. **How do you center a div?** — `display: flex; justify-content: center; align-items: center;` on the parent.
6. **`relative` vs `absolute` vs `fixed`?** — `relative` moves from its normal spot, `absolute` is placed against the nearest positioned parent, `fixed` sticks to the screen.
7. **What is `position: sticky`?** — The element scrolls normally until a point, then sticks in place.
8. **`display: none` vs `visibility: hidden`?** — `none` removes the element and its space; `hidden` hides it but keeps the space.
9. **`em` vs `rem`?** — `em` is relative to the element's font size; `rem` is relative to the root font size.
10. **What is a media query?** — A rule that applies styles only for certain screen sizes or features.
11. **What is margin collapse?** — Vertical margins of neighbouring blocks merge into the larger one.
12. **What is a stacking context?** — A group that `z-index` values compete within, created by things like `position` + `z-index`, `opacity` or `transform`.
13. **What are pseudo-classes and pseudo-elements?** — Pseudo-classes style a state (`:hover`); pseudo-elements style a part (`::before`).
14. **What are CSS variables?** — Custom properties like `--brand` that you reuse with `var(--brand)`.
15. **Reflow vs repaint?** — Reflow recalculates layout (slow); repaint only redraws pixels.
16. **Why animate `transform` and `opacity`?** — They don't trigger layout, so animations stay smooth.
17. **What does `fr` mean in Grid?** — A share of the remaining free space.
18. **What is mobile-first CSS?** — Write styles for small screens first, then add `min-width` media queries for bigger ones.
19. **What is BEM?** — A naming style: `block__element--modifier`.
20. **What are container queries?** — Rules that style an element based on its parent's size instead of the screen's.
