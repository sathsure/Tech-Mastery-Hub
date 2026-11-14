# CSS — Comparisons

> The classic "X vs Y" questions, side by side.

## Flexbox vs Grid
| | Flexbox | Grid |
|---|---|---|
| Direction | one (row or column) | two (rows and columns) |
| Driven by | content size | the layout you define |
| Best for | navbars, button rows | page layouts, card grids |

## `relative` vs `absolute` vs `fixed` vs `sticky`
| | Moves relative to | Keeps its space |
|---|---|---|
| `relative` | its normal spot | ✅ |
| `absolute` | nearest positioned parent | ❌ |
| `fixed` | the screen | ❌ |
| `sticky` | scroll area (after a threshold) | ✅ |

## `display: none` vs `visibility: hidden` vs `opacity: 0`
| | Visible | Takes space | Clickable |
|---|---|---|---|
| `display: none` | ❌ | ❌ | ❌ |
| `visibility: hidden` | ❌ | ✅ | ❌ |
| `opacity: 0` | ❌ | ✅ | ✅ |

## `em` vs `rem` vs `%` vs `px`
| | Relative to |
|---|---|
| `px` | nothing (fixed) |
| `em` | the element's font size (compounds) |
| `rem` | the root font size |
| `%` | the parent |

## `content-box` vs `border-box`
| | `width` includes |
|---|---|
| `content-box` (default) | content only |
| `border-box` | content + padding + border |

## Transition vs animation
| | Transition | Animation (`@keyframes`) |
|---|---|---|
| Steps | A → B | many steps |
| Needs a trigger | ✅ (hover, class) | ❌ (can auto-run, loop) |

## Reflow vs repaint
| | Reflow (layout) | Repaint |
|---|---|---|
| Caused by | size/position changes | colour/visibility changes |
| Cost | high | lower |

## Pseudo-class vs pseudo-element
| | Pseudo-class | Pseudo-element |
|---|---|---|
| Syntax | `:hover` | `::before` |
| Styles | a state | a part of an element |

## Media query vs container query
| | Media query | Container query |
|---|---|---|
| Based on | screen size | parent container size |
