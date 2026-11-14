# JavaScript — Explain Like I'm 5

> Hard ideas as everyday pictures, then what they really mean.

## Closure
🎒 A child leaves home for school with a backpack packed by mum. Even far away, they can still open the backpack and use what's inside.
**Really:** a function keeps access to the variables from where it was created.

## Event loop
🍳 One cook in a kitchen. They put rice on the stove (a timer) and don't stand and wait — they chop vegetables. When the rice beeps, they handle it as soon as their hands are free.
**Really:** JavaScript runs one thing at a time and handles finished async work when the current code is done.

## Promise
🧾 A token at a restaurant counter: "Your food isn't ready, but this token promises it." Later you get food (fulfilled) or "sorry, sold out" (rejected).
**Really:** an object for a value that will arrive later, or an error.

## `this`
🙋 "My house" means a different house depending on who says it.
**Really:** `this` is whatever object called the function.

## Hoisting
📋 A teacher reads the class register before the lesson starts, so they know everyone's name — but students only *arrive* when their turn comes.
**Really:** declarations are known before code runs; values are assigned when their line runs.

## Prototype
👨‍👦 If a child doesn't know a word, they ask their parent; if the parent doesn't know, they ask grandparent.
**Really:** missing properties are looked up the prototype chain.

## Debounce
🛗 A lift waits until people stop getting in before closing the doors.
**Really:** run the function only after activity has stopped for a while.
