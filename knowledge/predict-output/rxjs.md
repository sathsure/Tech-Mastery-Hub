# RxJS — Predict the Output

> Read the code, guess what it emits, then tap to check.

### 1. map + filter
```ts
of(1, 2, 3).pipe(map(x => x * 10), filter(x => x > 10)).subscribe(console.log);
```
<details class="reveal"><summary>Show answer</summary>

**Output:** `20 30`

</details>

### 2. Subject: late subscriber
```ts
const s = new Subject<number>();
s.next(1);
s.subscribe(v => console.log("A", v));
s.next(2);
```
<details class="reveal"><summary>Show answer</summary>

**Output:** `A 2`

A plain Subject doesn't remember past values.

</details>

### 3. BehaviorSubject: late subscriber
```ts
const s = new BehaviorSubject(0);
s.next(1);
s.subscribe(v => console.log("A", v));
s.next(2);
```
<details class="reveal"><summary>Show answer</summary>

**Output:** `A 1`, `A 2`

New subscribers immediately get the current value.

</details>

### 4. switchMap cancels
```ts
from([1, 2, 3]).pipe(switchMap(x => of(x).pipe(delay(10)))).subscribe(console.log);
```
<details class="reveal"><summary>Show answer</summary>

**Output:** `3`

1, 2 and 3 arrive at once; each new value cancels the previous delayed inner stream.

</details>

### 5. mergeMap keeps all
```ts
from([1, 2, 3]).pipe(mergeMap(x => of(x).pipe(delay(10)))).subscribe(console.log);
```
<details class="reveal"><summary>Show answer</summary>

**Output:** `1 2 3`

mergeMap runs every inner stream.

</details>

### 6. forkJoin takes last values
```ts
forkJoin([of(1, 2), of("a", "b")]).subscribe(console.log);
```
<details class="reveal"><summary>Show answer</summary>

**Output:** `[2, "b"]`

forkJoin waits for every source to complete, then emits each one's **last** value once.

</details>

### 7. combineLatest with synchronous sources
```ts
combineLatest([of(1, 2), of("a")]).subscribe(console.log);
```
<details class="reveal"><summary>Show answer</summary>

**Output:** `[2, "a"]`

`of(1, 2)` emits both values before `of("a")` is subscribed, so only the latest (2) pairs with "a".

</details>

### 8. Cold observable, two subscribers
```ts
const req$ = defer(() => { console.log("request sent"); return of("data"); });
req$.subscribe();
req$.subscribe();
```
<details class="reveal"><summary>Show answer</summary>

**Output:** `request sent` **twice**

Cold observables run once per subscriber. Add `shareReplay(1)` to share one run.

</details>

### 9. Error ends the stream
```ts
of(1, 2, 3).pipe(
  map(x => { if (x === 2) throw new Error("bad"); return x; }),
  catchError(() => of(-1)),
).subscribe(console.log);
```
<details class="reveal"><summary>Show answer</summary>

**Output:** `1 -1`

After the error, the source is finished; 3 is never emitted. `catchError` replaces the rest with `of(-1)`.

</details>
