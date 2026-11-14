# React — Explain Like I'm 5

> Hard ideas as everyday pictures, then what they really mean.

## Components
🧱 LEGO pieces: build small ones, combine them into a big model.
**Really:** functions that return pieces of UI.

## Props vs state
🎂 Props are the birthday gifts you receive (you can't change who gave them). State is your own piggy bank — you add and take coins.
**Really:** props come from the parent; state belongs to the component.

## Virtual DOM
✏️ Drawing a new picture on tracing paper, comparing it with the old one, and only repainting the differences on the wall.
**Really:** React compares a copy of the UI and updates only what changed.

## useEffect
🧹 "After you finish playing, clean up your toys."
**Really:** run code after render, with cleanup when it re-runs or unmounts.

## Keys
🏷️ Name tags on kids in a line — if they swap places, the teacher still knows who's who.
**Really:** stable ids help React track list items.

## Context
📢 A school announcement over the speaker: every class hears it without passing notes room to room.
**Really:** share data deep in the tree without passing props through every level.

## Memoization (`useMemo`)
🧮 Writing the answer of a hard sum on a sticky note so you don't redo it every time.
**Really:** remember a calculated value until its inputs change.
