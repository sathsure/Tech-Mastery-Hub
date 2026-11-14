# Python — Explain Like I'm 5

> Hard ideas as everyday pictures, then what they really mean.

## Mutable vs immutable
✏️ A whiteboard (list) you can erase and rewrite vs a printed page (tuple) you can't change.
**Really:** lists, dicts and sets can change; strings and tuples can't.

## Decorator
🎁 Gift-wrapping a present: the present is the same, but now it has a bow and a card.
**Really:** a function that wraps another to add behaviour.

## Generator
🍬 A sweet machine that gives one sweet each time you turn the handle, instead of dumping the whole jar.
**Really:** values produced one at a time with `yield`.

## GIL
🎤 A karaoke night with one microphone: many people want to sing, only one sings at a time.
**Really:** only one thread runs Python code at a time.

## asyncio
👩‍🍳 A cook with many pots: while one simmers, they stir another — one cook, many dishes.
**Really:** one thread runs many waiting tasks by switching while each waits.

## Context manager (`with`)
🚪 A door that closes itself behind you.
**Really:** setup and cleanup happen automatically, like closing a file.

## Duck typing
🦆 If it swims and quacks, call it a duck.
**Really:** what an object can do matters, not its class.
