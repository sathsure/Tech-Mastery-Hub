# React — Predict the Output

> Read the code, guess what happens, then tap to check.

### 1. Two updates from the same value
```jsx
function Counter() {
  const [count, setCount] = useState(0);
  const click = () => { setCount(count + 1); setCount(count + 1); };
  return <button onClick={click}>{count}</button>;
}
```
After one click the button shows…
<details class="reveal"><summary>Show answer</summary>

**Answer:** `1`

Both calls use the same `count` (0) from this render. Use `setCount(c => c + 1)` twice to get 2.

</details>

### 2. Reading state right after setting it
```jsx
const click = () => {
  setName("Ravi");
  console.log(name);   // name was "Asha"
};
```
<details class="reveal"><summary>Show answer</summary>

**Logs:** `Asha`

State updates apply in the next render; this render still has the old value.

</details>

### 3. Effect order: parent vs child
```jsx
function Child()  { console.log("render Child");  useEffect(() => console.log("effect Child")); return null; }
function Parent() { console.log("render Parent"); useEffect(() => console.log("effect Parent")); return <Child />; }
```
<details class="reveal"><summary>Show answer</summary>

**Logs:** `render Parent → render Child → effect Child → effect Parent`

Rendering goes top-down; effects run bottom-up (children first).

</details>

### 4. `0` on the screen
```jsx
const items = [];
return <div>{items.length && <List items={items} />}</div>;
```
<details class="reveal"><summary>Show answer</summary>

**Renders:** `0`

`0 && …` evaluates to `0`, and React renders numbers. Use `items.length > 0 &&`.

</details>

### 5. Strict Mode in development
```jsx
useEffect(() => {
  console.log("mount");
  return () => console.log("cleanup");
}, []);
```
<details class="reveal"><summary>Show answer</summary>

**Logs (dev, Strict Mode):** `mount → cleanup → mount`

React mounts twice in development to reveal missing cleanups. Production logs `mount` once.

</details>

### 6. Stale closure in an interval
```jsx
const [count, setCount] = useState(0);
useEffect(() => {
  const id = setInterval(() => setCount(count + 1), 1000);
  return () => clearInterval(id);
}, []);
```
After 5 seconds the count is…
<details class="reveal"><summary>Show answer</summary>

**Answer:** `1`

The interval always sees `count = 0` from the first render. Use `setCount(c => c + 1)`.

</details>

### 7. Changing the `key`
```jsx
<Form key={userId} />
```
`userId` changes from 1 to 2. What happens to the form's typed text?
<details class="reveal"><summary>Show answer</summary>

**Answer:** it's cleared.

A new `key` makes React unmount the old component and mount a fresh one with fresh state.

</details>

### 8. Object in the dependency list
```jsx
const options = { page: 1 };
useEffect(() => { console.log("fetch"); }, [options]);
```
How often does it log?
<details class="reveal"><summary>Show answer</summary>

**Answer:** after **every** render.

`options` is a new object each render, so the dependency always looks changed.

</details>
