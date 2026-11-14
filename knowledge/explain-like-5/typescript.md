# TypeScript — Explain Like I'm 5

> Hard ideas as everyday pictures, then what they really mean.

## TypeScript itself
🧩 A shape-sorter toy: the square block only fits the square hole, so you find mistakes before you play.
**Really:** types catch wrong values while you write code, before it runs.

## `any` vs `unknown`
📦 `any` is a box you open and use without looking — maybe it's a snake. `unknown` is a box you must peek into first.
**Really:** `unknown` forces a type check; `any` skips all checks.

## Generics
🥤 A cup that can hold juice, milk or water — but once you pour milk, everyone knows it holds milk.
**Really:** one piece of code that works with many types while remembering which one it got.

## Union types
🍦 "You can have chocolate **or** vanilla."
**Really:** a value can be one of several listed types.

## Narrowing
🔦 You hear a sound in the dark; you shine a torch and now you know it's the cat.
**Really:** checking a value lets TypeScript know its exact type in that block.

## Structural typing
🦆 If it walks like a duck and quacks like a duck, it's treated as a duck — no name tag needed.
**Really:** types match by their shape, not their name.
