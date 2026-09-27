# HTML

## Definition

HTML (HyperText Markup Language) defines the structure and meaning of web content. The repository material emphasizes how HTML is parsed by the browser into the DOM and how semantic structure supports browsers, search engines, screen readers, and developers.

## Core Concepts

### Browser Rendering
The source describes the rendering pipeline:

```text
HTML → DOM
CSS  → CSSOM
DOM + CSSOM → Render Tree → Layout → Paint → Composite
```

- HTML is parsed into the DOM.
- CSS is parsed into the CSSOM.
- DOM and CSSOM form the render tree.
- Layout calculates position and size.
- Paint draws pixels.
- Compositing combines layers for display.

The source also distinguishes reflow, repaint, and compositing, and explains why `transform` can avoid layout work.

### Critical Rendering Path
The Critical Rendering Path is the sequence required to render the first pixel.

- CSS is render-blocking by default.
- JavaScript can block HTML parsing.
- The source recommends critical CSS, `defer`/`async`, lazy loading, and preload for critical assets.

### Semantic HTML
Semantic HTML uses tags that describe meaning rather than appearance.

Important elements in the source include:

| Element | Meaning |
|---|---|
| `header` | Intro/header |
| `nav` | Navigation |
| `main` | Primary content |
| `section` | Grouped topic |
| `article` | Independent content |
| `aside` | Side content |
| `footer` | Footer information |
| `figure` | Self-contained media |
| `time` | Machine-readable date/time |

Semantic structure supports screen-reader landmarks and SEO-oriented document understanding.

### `div` vs `span`
Both are non-semantic elements.

- `div` is block-level and is used for structure/layout.
- `span` is inline and is used for inline text styling.

### `id` vs `class`
The source distinguishes unique `id` identifiers from reusable `class` identifiers and shows their CSS and JavaScript access patterns.

### `section` vs `article` vs `div`
- `section`: thematic grouping, usually with a heading.
- `article`: self-contained content that can stand on its own.
- `div`: generic non-semantic wrapper for styling/layout.

### `data-*` Attributes
Custom `data-*` attributes attach application data to elements without changing layout or semantics. JavaScript can access them through `dataset`.

### Script Loading
The source compares normal scripts, `async`, and `defer`.

| Type | Parsing | Execution | Order |
|---|---|---|---|
| Normal | Blocks | Immediate | Preserved |
| `async` | Continues | When ready | Not preserved |
| `defer` | Continues | After DOM parsing | Preserved |

The source's rule of thumb is `defer` for scripts depending on the DOM and `async` for independent scripts such as analytics.

## Learning Path

1. HTML structure and elements
2. Semantic HTML
3. Attributes and data
4. DOM relationship
5. Browser rendering
6. Critical Rendering Path
7. Script loading and performance
8. Accessibility and SEO-related structure

## Repository Resources

- Interview source: `interview/frontend/01-HTML.md`
- Roadmap: `roadmap/foundations/README.md`
- Roadmap frontend material: `roadmap/frontend/README.md`

## Source Boundary

This page consolidates repository material. It does not attempt to create a complete HTML specification. Topics not represented in the source material should be added only when corresponding repository evidence is collected.

