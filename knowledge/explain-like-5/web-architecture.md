# Web Architecture — Explain Like I'm 5

> Hard ideas as everyday pictures, then what they really mean.

## Client and server
🍽️ You (client) order at a restaurant; the kitchen (server) cooks and sends food back.
**Really:** the browser asks; the server answers.

## CSR vs SSR vs SSG
🍕 CSR: you get the ingredients and assemble the pizza at your table. SSR: the kitchen makes it fresh for each order. SSG: pizzas made in the morning, ready on the shelf.
**Really:** HTML built in the browser, per request on the server, or at build time.

## Hydration
💧 Adding water to instant noodles: they look like noodles already, but only become eatable after water.
**Really:** JavaScript makes server-made HTML interactive.

## CDN
🏪 Copies of the shop's best-sellers in every neighbourhood kiosk.
**Really:** static files served from servers close to users.

## WebSocket
📞 A phone call that stays open — both sides talk whenever they want.
**Really:** a two-way, always-open connection.

## Reverse proxy
🛎️ A hotel receptionist who receives every guest and directs them to the right room.
**Really:** a server in front of your servers that routes, caches and handles HTTPS.

## Service Worker
📦 A helper at your door who keeps copies of your deliveries, so you still have them when roads are closed (offline).
**Really:** a background script that caches and serves files offline.
