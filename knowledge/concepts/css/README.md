# CSS

## Definition

CSS (Cascading Style Sheets) describes how HTML elements should look, including colors, spacing, layout, and positioning. The source characterizes CSS as declarative: developers describe rules and the browser determines how they are applied.

## Core Concepts

### Cascade
CSS uses a priority system to resolve conflicting rules. The source explains origin/importance, specificity, and source order.

### Specificity
The source represents specificity as:

```text
(inline, ID, class, element)
```

The browser compares the values from left to right. `!important` overrides the normal cascade and should be used carefully because it makes later overrides harder.

### Selectors
Source-covered selectors include:

- element
- class
- ID
- attribute
- group
- universal
- descendant
- child
- adjacent sibling
- general sibling

### Descendant vs Child

```css
.parent .child   { }
.parent > .child { }
```

The descendant selector can match at any depth; the child selector matches only direct children.

### Pseudo-classes and Pseudo-elements

Pseudo-class = state:

```css
button:hover
input:focus
li:first-child
```

Pseudo-element = part of an element:

```css
p::first-line
p::before
p::after
```

### Box Model

Every element is described through:

```text
margin
  border
    padding
      content
```

### `box-sizing`

- `content-box`: width/height apply to content only.
- `border-box`: width/height include content, padding, and border.

### Layout
The repository material includes Flexbox and Grid as core CSS layout topics.

## Learning Path

1. CSS fundamentals
2. Cascade and specificity
3. Selectors
4. Pseudo-classes/elements
5. Box model
6. Display and units
7. Flexbox
8. Grid
9. Responsive/layout patterns
10. CSS practice problems

## Repository Resources

- Interview source: `interview/frontend/02-CSS.md`
- Coding practice: `practice/coding/02-css-coding.md`
- Visual note: `knowledge/visual-notes/css-descendants.png`
- Roadmap: `roadmap/foundations/README.md`
- Roadmap frontend material: `roadmap/frontend/README.md`

## Source Boundary

This canonical page consolidates the repository's CSS evidence. It should not be treated as a complete CSS reference. Additional topics require source-backed additions.

