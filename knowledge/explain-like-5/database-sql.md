# SQL & Databases — Explain Like I'm 5

> Hard ideas as everyday pictures, then what they really mean.

## Table
📊 A spreadsheet: columns are the kinds of info, rows are the people or things.
**Really:** data stored in rows and columns.

## Primary key / foreign key
🪪 Your Aadhaar number is your unique ID (primary key). Your bank form writes that number to point to you (foreign key).
**Really:** a unique row id, and a column that refers to another table's id.

## JOIN
🧦 Matching socks from two piles by colour.
**Really:** combining rows from two tables that share a value.

## Index
📖 The index at the back of a book: find "Java" on page 42 without reading every page.
**Really:** a sorted lookup structure that avoids scanning the whole table.

## Transaction (ACID)
🏧 An ATM withdrawal: either the cash comes out *and* your balance drops, or neither happens.
**Really:** a group of changes that succeed or fail together.

## Normalization
🗂️ Keeping one master contact list instead of copying a friend's phone number into ten notebooks.
**Really:** store each fact once to avoid duplicates and mismatches.

## Deadlock
🍴 Two kids at dinner: one holds the fork, the other holds the knife, and both wait for the other's.
**Really:** two transactions each wait for a lock the other holds.
