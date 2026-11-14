# Java — Explain Like I'm 5

> Hard ideas as everyday pictures, then what they really mean.

## JVM
🔌 A universal travel adapter: your charger (bytecode) works in any country (operating system) through it.
**Really:** Java bytecode runs on any OS that has a JVM.

## Class vs object
🍪 A cookie cutter (class) and the cookies you make with it (objects).
**Really:** a class is a blueprint; objects are things built from it.

## Inheritance
👨‍👧 A child gets their parent's eye colour but can learn new skills too.
**Really:** a subclass reuses a parent class and can add or change behaviour.

## Polymorphism
🐶🐱 You say "speak!" — the dog barks, the cat meows. Same command, different result.
**Really:** one method call behaves differently depending on the actual object.

## Interface
🔌 A wall socket shape: any appliance with the right plug can use it.
**Really:** a contract of methods any class can promise to implement.

## HashMap
🗄️ A school locker room: your roll number tells you exactly which locker to open — no searching.
**Really:** the key's hash points straight to a bucket, so lookup is fast.

## Garbage collection
🧹 A cleaner who throws away toys nobody is holding anymore.
**Really:** the JVM frees objects that nothing references.

## Threads and `synchronized`
🚻 Many people, one bathroom with a lock — only one inside at a time.
**Really:** `synchronized` lets one thread at a time run a block.

## Deadlock
🚗🚗 Two cars on a narrow bridge, each waiting for the other to reverse. Nobody moves.
**Really:** two threads each hold a lock the other needs.
