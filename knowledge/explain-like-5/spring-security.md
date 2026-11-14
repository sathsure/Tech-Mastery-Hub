# Spring Security — Explain Like I'm 5

> Hard ideas as everyday pictures, then what they really mean.

## Filter chain
🛂 Airport checks one after another: ticket, ID, bag scan — then you reach the gate (controller).
**Really:** each request passes through a chain of security filters.

## Authentication vs authorization
🎟️ Showing your ID at the door (authentication), then the wristband decides which rooms you may enter (authorization).
**Really:** who you are vs what you may do.

## JWT
🎫 A stamped concert wristband: guards check the stamp, not a list. Anyone can read what's printed on it, but no one can fake the stamp.
**Really:** a signed token with claims; readable but tamper-proof.

## Refresh token
🎟️ A season pass you show at the ticket office to get today's ticket.
**Really:** a long-lived token used only to get new short-lived access tokens.

## OAuth2
🔑 Giving a valet a car key that starts the car but can't open the boot.
**Really:** letting an app act for you with limited permissions, without your password.

## CSRF
✉️ Someone slips a signed cheque into a pile you're signing, and you sign it without noticing.
**Really:** another site makes your browser send a request with your cookies.

## Password hashing
🥤 Blending fruit into a smoothie — you can't turn it back into fruit, but you can blend the same fruit again and compare.
**Really:** store a one-way hash; check by hashing the login attempt.
