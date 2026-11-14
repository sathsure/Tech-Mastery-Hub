# RxJS — Explain Like I'm 5

> Hard ideas as everyday pictures, then what they really mean.

## Observable
📺 A TV channel: shows come over time, but only if you switch it on (subscribe).
**Really:** a lazy stream of values you subscribe to.

## Subscribe / unsubscribe
📰 Subscribing to a newspaper; if you move house and forget to cancel, papers pile up (memory leak).
**Really:** start and stop listening to a stream.

## BehaviorSubject
🌡️ A thermometer on the wall: whoever walks in sees the current temperature right away.
**Really:** new subscribers immediately get the latest value.

## switchMap
📞 You call a friend, then call another before the first picks up — you hang up the first call.
**Really:** cancel the previous inner request and keep only the newest.

## exhaustMap
🛎️ A shop bell that ignores extra rings while the shopkeeper is already coming.
**Really:** ignore new values while the current one is still running.

## debounceTime
🗣️ Waiting until your friend stops talking before you answer.
**Really:** emit only after a pause.
