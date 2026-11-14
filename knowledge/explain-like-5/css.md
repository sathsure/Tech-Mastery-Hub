# CSS — Explain Like I'm 5

> Hard ideas as everyday pictures, then what they really mean.

## Box model
🎁 A gift: the toy (content), bubble wrap (padding), the box (border), and space between gifts on the shelf (margin).
**Really:** every element is content + padding + border + margin.

## Specificity
👮 When a parent, a teacher and the principal give different rules, the more important person wins; if equal, the last one who spoke wins.
**Really:** more specific selectors beat less specific ones; ties go to the later rule.

## Flexbox
🚂 Train carriages in one line — you decide spacing and how they line up.
**Really:** laying items out in one direction.

## Grid
♟️ A chessboard: rows and columns, and you place pieces in squares.
**Really:** laying items out in rows and columns at once.

## `position: absolute`
📌 A sticker placed relative to the nearest picture frame — if there's no frame, it goes on the wall.
**Really:** placed against the nearest positioned ancestor (or the page).

## z-index and stacking context
📚 Papers inside separate folders. Even the top paper of a lower folder can't jump above a higher folder.
**Really:** `z-index` only competes inside its own stacking context.

## Reflow
🪑 Moving one chair in a cinema row makes everyone shift seats — slow. Changing a shirt colour (repaint) bothers no one.
**Really:** layout changes are expensive; colour changes are cheap.
