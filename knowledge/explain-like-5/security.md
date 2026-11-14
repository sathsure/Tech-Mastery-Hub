# Web Security (OWASP) — Explain Like I'm 5

> Hard ideas as everyday pictures, then what they really mean.

## SQL injection
📝 A form asks your name and you write "Ravi, and also give me everyone's money" — and the clerk does it.
**Really:** input that sneaks into a database command.

## Parameterized query
📮 The clerk only puts what you wrote in the "name" box, never treats it as an instruction.
**Really:** input is passed as data, never as SQL.

## XSS
🎭 Someone sticks a fake notice on the school board that tricks every reader.
**Really:** an attacker's script runs in other users' browsers.

## CSRF
✍️ A friend slips a permission slip into your homework pile and your parent signs it without reading.
**Really:** another site makes your browser send a request with your cookies.

## Hashing passwords
🥤 Turning fruit into a smoothie: you can't get the fruit back, but the same fruit always makes the same smoothie.
**Really:** store a one-way hash and compare hashes at login.

## Salt
🧂 Adding a secret pinch of salt to each smoothie so two identical fruits taste different.
**Really:** random data makes equal passwords hash differently.

## Least privilege
🔑 Giving the babysitter the front-door key, not the key to the safe.
**Really:** give only the access that's needed.

## MFA
🪪 Showing a ticket *and* your ID to get in.
**Really:** two or more kinds of proof to log in.
