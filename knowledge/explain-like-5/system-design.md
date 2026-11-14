# System Design — Explain Like I'm 5

> Hard ideas as everyday pictures, then what they really mean.

## Load balancer
🎟️ A ticket queue manager who sends each person to the shortest counter.
**Really:** spreads requests across servers.

## Horizontal vs vertical scaling
🐘 Vertical: buy a bigger elephant. Horizontal: get more elephants.
**Really:** bigger machine vs more machines.

## Cache
📝 Keeping your best friend's number on a sticky note instead of searching contacts every time.
**Really:** fast copies of frequently used data.

## Sharding
📚 Splitting a huge library: A–M books in one building, N–Z in another.
**Really:** dividing data across databases by a key.

## CAP theorem
☎️ Two shop branches lose their phone line. Either stop selling until the line is back (consistency) or keep selling and maybe oversell (availability).
**Really:** during a network split you choose consistency or availability.

## Message queue
🍕 A pizza order slip on a hook: the cashier takes orders fast; cooks pick slips when free.
**Really:** decouple fast intake from slower processing.

## Rate limiting
🎢 A ride lets in 20 people every 5 minutes, however long the queue.
**Really:** cap how many requests a client can make.

## Consistent hashing
🕐 Seats around a round table: when one person leaves, only their neighbour takes over their plates.
**Really:** adding or removing a server moves only a small share of keys.
