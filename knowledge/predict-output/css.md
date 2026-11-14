# CSS — Predict the Result

> Read the CSS, guess how it looks, then tap to check.

### 1. ID vs classes
```html
<p id="title" class="red big">Hello</p>
```
```css
#title { color: blue; }
.red.big { color: red; }
```
<details class="reveal"><summary>Show answer</summary>

**Colour:** blue

One ID (1,0,0) beats two classes (0,2,0), whatever the order.

</details>

### 2. Same specificity
```css
.note { color: green; }
.note { color: orange; }
```
<details class="reveal"><summary>Show answer</summary>

**Colour:** orange

Same specificity → the later rule wins.

</details>

### 3. `!important`
```css
#box { color: blue; }
div { color: red !important; }
```
<details class="reveal"><summary>Show answer</summary>

**Colour:** red

`!important` beats normal rules even with lower specificity.

</details>

### 4. Box width
```css
.box { width: 200px; padding: 20px; border: 5px solid; }   /* default box-sizing */
```
How wide is the box on screen?
<details class="reveal"><summary>Show answer</summary>

**Width:** `250px` (200 + 20×2 + 5×2)

With `box-sizing: border-box` it would be exactly 200px.

</details>

### 5. Margin collapse
```css
.a { margin-bottom: 20px; }
.b { margin-top: 30px; }    /* .b comes right after .a */
```
<details class="reveal"><summary>Show answer</summary>

**Gap:** `30px`

Vertical margins collapse into the larger one (not inside flex or grid).

</details>

### 6. `em` compounding
```css
html { font-size: 16px; }
.a { font-size: 2em; }
.a .b { font-size: 2em; }
```
Font size of `.b` inside `.a`?
<details class="reveal"><summary>Show answer</summary>

**Size:** `64px` (16 × 2 × 2)

`em` multiplies by the parent's size. With `rem` it would be 32px.

</details>

### 7. Inheritance
```css
.card { color: purple; border: 1px solid; }
```
Does a `<p>` inside `.card` get purple text? A border?
<details class="reveal"><summary>Show answer</summary>

**Purple text:** yes. **Border:** no.

`color` is inherited; `border` is not.

</details>

### 8. z-index trap
```css
.parent { position: relative; z-index: 1; }
.parent .child { position: relative; z-index: 999; }
.sibling { position: relative; z-index: 2; }
```
Is `.child` above `.sibling`?
<details class="reveal"><summary>Show answer</summary>

**No.** `.child` is stuck inside `.parent`'s stacking context (1), which is below `.sibling` (2).

</details>
