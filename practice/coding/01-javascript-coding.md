# 🟨 JavaScript Coding Interview Questions


---

# 🔢 Part 1 — Array Manipulation

### ❓ Move all `0`s to the end without changing the order of other elements

> **Input:** `[0, 1, 0, 3, 12]`
> **Output:** `[1, 3, 12, 0, 0]`

### 📝 Answer

**Two-pointer in-place approach (O(n) time, O(1) space):**

```js
function moveZeros(arr) {
  let j = 0;                       // position to place next non-zero

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] !== 0) {
      [arr[j], arr[i]] = [arr[i], arr[j]];
      j++;
    }
  }
  return arr;
}

console.log(moveZeros([0, 1, 0, 3, 12]));   // [1, 3, 12, 0, 0]
```

> 💡 **Key insight**: We swap non-zero elements forward; everything left untouched at the back becomes zero naturally.

---

### ❓ Write a function that checks whether two arrays are equal — same elements in the same order. How would you handle edge cases like different lengths or nested arrays?

### 📝 Answer

```js
function arraysEqual(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

console.log(arraysEqual([1, 2, 3], [1, 2, 3]));   // true
console.log(arraysEqual([1, 2, 3], [1, 2, 4]));   // false
```

> 💡 **For nested/deep equality**, use `JSON.stringify(a) === JSON.stringify(b)` (works only for JSON-safe data) OR write a recursive helper.

---

### ❓ Split an array into chunks

### 📝 Answer

```js
function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) {
    out.push(arr.slice(i, i + size));
  }
  return out;
}

console.log(chunk([1, 2, 3, 4, 5, 6], 2));   // [[1,2], [3,4], [5,6]]
console.log(chunk([1, 2, 3, 4, 5], 3));      // [[1,2,3], [4,5]]
```

---

### ❓ Flatten a nested array

### 📝 Answer

**Modern way — built-in `.flat()`:**

```js
const arr = [[1, 2], [3, 4, 5], [6, 7]];
console.log(arr.flat());                    // [1, 2, 3, 4, 5, 6, 7]

// Deep nesting
const deep = [1, [2, [3, [4, [5]]]]];
console.log(deep.flat(Infinity));           // [1, 2, 3, 4, 5]
```

**Manual recursive approach:**

```js
function flatten(arr) {
  const result = [];
  for (const item of arr) {
    if (Array.isArray(item)) {
      result.push(...flatten(item));
    } else {
      result.push(item);
    }
  }
  return result;
}

console.log(flatten([[1, 2], [3, [4, 5]], [6, 7]]));   // [1, 2, 3, 4, 5, 6, 7]
```

---

### ❓ Find max and min values in an array

### 📝 Answer

**With spread (cleanest):**

```js
const arr = [10, 5, 88, 32, 1, 7];
console.log("Max:", Math.max(...arr));   // 88
console.log("Min:", Math.min(...arr));   // 1
```

> ⚠️ **Trap**: Spread fails for very large arrays (~100k+ elements) due to call stack limits.

**Manual approach (works for any size):**

```js
function minMax(arr) {
  let min = arr[0], max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) max = arr[i];
    if (arr[i] < min) min = arr[i];
  }
  return { min, max };
}
```

---

### ❓ Remove duplicates from an array

### 📝 Answer

**Method 1: Using `Set` (cleanest):**

```js
const arr = [1, 2, 3, 2, 4, 3, 5, 1];
const unique = [...new Set(arr)];        // [1, 2, 3, 4, 5]
```

**Method 2: Using `filter` + `indexOf`:**

```js
const unique = arr.filter((val, idx) => arr.indexOf(val) === idx);
```

**Method 3: Manual with hash map (best for large arrays):**

```js
function unique(arr) {
  const seen = {};
  const result = [];
  for (const val of arr) {
    if (!seen[val]) {
      seen[val] = true;
      result.push(val);
    }
  }
  return result;
}
```

---

### ❓ Find the second largest number in an array

### 📝 Answer

**Sort approach (simple but O(n log n)):**

```js
const arr = [1, 3, 5, 7, 9, 10];
const sorted = [...arr].sort((a, b) => b - a);   // descending
console.log(sorted[1]);                          // 9
```

> ⚠️ Original sort approach in your file mutated the array — using a copy with `[...arr]` is safer.

**Single-pass approach (O(n), preferred):**

```js
function secondLargest(arr) {
  let largest = -Infinity, second = -Infinity;
  for (const n of arr) {
    if (n > largest) {
      second = largest;
      largest = n;
    } else if (n > second && n !== largest) {
      second = n;
    }
  }
  return second;
}

console.log(secondLargest([1, 3, 5, 7, 9, 10]));   // 9
```

> 💡 The single-pass version handles duplicates and is faster on large inputs.

---

# 🔤 Part 2 — String Problems

### ❓ Check if two strings are anagrams

> **Input:** `"listen"`, `"silent"` → **Output:** `true`

### 📝 Answer

**Method 1: Sort and compare (simple, O(n log n)):**

```js
function isAnagram(str1, str2) {
  if (str1.length !== str2.length) return false;
  return str1.split("").sort().join("") === str2.split("").sort().join("");
}

console.log(isAnagram("listen", "silent"));   // true
console.log(isAnagram("hello", "world"));     // false
```

**Method 2: Frequency count (O(n), preferred):**

```js
function isAnagram(str1, str2) {
  if (str1.length !== str2.length) return false;

  const freq = {};
  for (const ch of str1) freq[ch] = (freq[ch] || 0) + 1;

  for (const ch of str2) {
    if (!freq[ch]) return false;
    freq[ch]--;
  }
  return true;
}

console.log(isAnagram("triangle", "integral"));   // true
```

> 💡 **Edge case**: For Unicode (emoji, accents), use `[...str]` instead of `str.split("")` to handle surrogate pairs.

---

### ❓ Find the first non-repeating character in a string

> **Input:** `"recurring"` → **Output:** `"e"`

### 📝 Answer

```js
function firstNonRepeating(str) {
  const count = {};
  for (const ch of str) count[ch] = (count[ch] || 0) + 1;

  for (const ch of str) {
    if (count[ch] === 1) return ch;
  }
  return null;
}

console.log(firstNonRepeating("recurring"));   // "e"
console.log(firstNonRepeating("aabbcc"));      // null
```

> 💡 **Two-pass approach** because the first character with count 1 must come from the **original order**, not from the map's iteration order.

---

### ❓ Find the frequency of each character in a string

> **Input:** `"hello world"`
> **Output:** `{ h: 1, e: 1, l: 3, o: 2, ' ': 1, w: 1, r: 1, d: 1 }`

### 📝 Answer

```js
function charFrequency(str) {
  const freq = {};
  for (const ch of str) {
    freq[ch] = (freq[ch] || 0) + 1;
  }
  return freq;
}

console.log(charFrequency("hello world"));
```

---

### ❓ Find the length of a string without using built-in methods

### 📝 Answer

```js
function getLength(str) {
  let count = 0;
  for (const _ of str) count++;
  return count;
}

console.log(getLength("hello"));   // 5
```

> 💡 **`for...of` vs `for...in`**
>
> | Loop       | Iterates                                              |
> | ---------- | ----------------------------------------------------- |
> | `for...of` | **Values** of iterables (strings → chars, arrays → elements, Maps/Sets → entries) |
> | `for...in` | **Keys** of objects (rarely use for arrays) |

---

### ❓ Reverse a string

> **Input:** `"hello world"` → **Output:** `"dlrow olleh"`

### 📝 Answer

**Method 1: Built-in (one-liner):**

```js
const reversed = "hello world".split("").reverse().join("");
console.log(reversed);   // "dlrow olleh"
```

**Method 2: Manual loop:**

```js
function reverse(str) {
  let result = "";
  for (let i = str.length - 1; i >= 0; i--) {
    result += str[i];
  }
  return result;
}
```

> 💡 **Unicode safety**: Use `[...str].reverse().join("")` to handle emoji and multi-byte chars correctly.

---

### ❓ Reverse a string while preserving word order

> **Input:** `"hello world"` → **Output:** `"olleh dlrow"`

### 📝 Answer

```js
function reverseWords(str) {
  return str
    .split(" ")
    .map(word => word.split("").reverse().join(""))
    .join(" ");
}

console.log(reverseWords("hello world"));   // "olleh dlrow"
```

**Manual approach (in-place per word):**

```js
function reverseWords(str) {
  const words = str.split(" ");

  for (let w = 0; w < words.length; w++) {
    const chars = words[w].split("");
    for (let i = 0, j = chars.length - 1; i < j; i++, j--) {
      [chars[i], chars[j]] = [chars[j], chars[i]];
    }
    words[w] = chars.join("");
  }
  return words.join(" ");
}
```

---

### ❓ Difference between `substring()` and `slice()`?

### 📝 Answer

Both extract a portion of a string, but they handle **negative numbers and reversed ranges differently**.

```js
// substring() treats negative numbers as 0
"world".substring(-2, 4);     // "worl"  (treated as substring(0, 4))

// slice() counts negative numbers from the end
"world".slice(-2, 4);         // "l"    (start = 5-2 = 3, end = 4)

// substring() swaps args if start > end
"hello".substring(4, 1);      // "ell"  (swapped to substring(1, 4))

// slice() returns empty string if start > end
"hello".slice(4, 1);          // ""     (no swap)
```

| Method        | Negative args     | Reversed args   |
| ------------- | ----------------- | --------------- |
| `substring()` | Treated as 0      | Swapped         |
| `slice()`     | Count from end    | Returns ""      |

> 💡 **Recommendation**: prefer `slice()` — it's more predictable and works on arrays too.

---

# 🧮 Part 3 — Algorithms

### ❓ Generate the Fibonacci series

### 📝 Answer

```js
function fibonacci(n) {
  if (n <= 0) return [];
  if (n === 1) return [0];

  const result = [0, 1];
  for (let i = 2; i < n; i++) {
    result.push(result[i - 1] + result[i - 2]);
  }
  return result;
}

console.log(fibonacci(10));   // [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
```

**Memory-efficient version (no array, just last two values):**

```js
function nthFibonacci(n) {
  let prev = 0, curr = 1;
  for (let i = 2; i <= n; i++) {
    [prev, curr] = [curr, prev + curr];
  }
  return n === 0 ? 0 : curr;
}

console.log(nthFibonacci(10));   // 55
```

---

### ❓ Implement FizzBuzz

### 📝 Answer

```js
function fizzBuzz(n) {
  for (let i = 1; i <= n; i++) {
    let out = "";
    if (i % 3 === 0) out += "Fizz";
    if (i % 5 === 0) out += "Buzz";
    console.log(out || i);
  }
}

fizzBuzz(15);
/*
1, 2, Fizz, 4, Buzz, Fizz, 7, 8, Fizz, Buzz, 11, Fizz, 13, 14, FizzBuzz
*/
```

> 💡 **Trick**: Building the string using `+=` automatically handles "FizzBuzz" — no need for separate `if/else if` for the 15 case.

---

# 💾 Part 4 — Functional Programming

### ❓ Implement memoization

### 📝 Answer

**Memoization** = cache function results so repeated calls with the same arguments return cached values instantly.

```js
function add(a, b) { return a + b; }
function multiply(a, b) { return a * b; }

const calculate = (function () {
  const cache = {};                         // private via closure

  return function (a, b, func) {
    const key = `${a}|${b}|${func.name}`;   // unique key per (args, fn)

    if (key in cache) {
      console.log("Read from cache");
      return cache[key];
    }

    console.log("Computing fresh");
    const value = func(a, b);
    cache[key] = value;
    return value;
  };
})();

console.log(calculate(10, 10, add));        // Computing fresh → 20
console.log(calculate(10, 10, add));        // Read from cache → 20
console.log(calculate(10, 10, multiply));   // Computing fresh → 100
console.log(calculate(10, 10, multiply));   // Read from cache → 100
```

**Generic memoize utility:**

```js
function memoize(fn) {
  const cache = new Map();
  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

const slowSquare = (n) => {
  console.log("Computing...");
  return n * n;
};

const fastSquare = memoize(slowSquare);
fastSquare(5);   // "Computing..." → 25
fastSquare(5);   // 25 (cached, no log)
```

> 💡 **Use cases**: expensive computations (Fibonacci, factorial), API calls (with TTL), pure functions.

---

# 🔄 Part 5 — Modern Patterns

### ❓ Implement debounce

### 📝 Answer

**Debounce** = wait until events **stop firing** for X ms, then execute.

```js
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Usage: search input that waits 300ms after typing stops
const handleSearch = debounce((query) => {
  console.log("Search:", query);
}, 300);

input.addEventListener("input", (e) => handleSearch(e.target.value));
```

---

### ❓ Implement throttle

### 📝 Answer

**Throttle** = execute at most **once per X ms**, even if events fire continuously.

```js
function throttle(fn, limit) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Usage: limit scroll handler to once every 200ms
window.addEventListener("scroll", throttle(() => {
  console.log("scroll Y:", window.scrollY);
}, 200));
```

> 💡 **Debounce vs Throttle**
>
> - **Debounce**: "Wait until user finishes" → search, autosave, resize-end
> - **Throttle**: "Sample regularly" → scroll, mousemove, drag

---

### ❓ Implement a deep clone function

### 📝 Answer

**Modern, native (ES2022+):**

```js
const cloned = structuredClone(original);
```

Handles dates, maps, sets, arrays, typed arrays, regex, **but NOT functions or DOM nodes**.

**Manual recursive (works on plain objects/arrays):**

```js
function deepClone(value) {
  if (value === null || typeof value !== "object") return value;
  if (value instanceof Date) return new Date(value);
  if (Array.isArray(value)) return value.map(deepClone);

  const result = {};
  for (const key of Object.keys(value)) {
    result[key] = deepClone(value[key]);
  }
  return result;
}

const original = { a: 1, b: { c: 2 }, d: [3, 4] };
const cloned = deepClone(original);
cloned.b.c = 99;
console.log(original.b.c);   // 2 (unaffected)
```

> ⚠️ **Avoid `JSON.parse(JSON.stringify(obj))`** — it loses functions, `undefined`, dates (becomes string), and breaks on circular references.

---

### ❓ Implement a Promise.all from scratch

### 📝 Answer

```js
function myPromiseAll(promises) {
  return new Promise((resolve, reject) => {
    const results = [];
    let completed = 0;

    if (promises.length === 0) return resolve([]);

    promises.forEach((p, i) => {
      Promise.resolve(p)              // wrap non-promises too
        .then((value) => {
          results[i] = value;          // preserve order
          completed++;
          if (completed === promises.length) resolve(results);
        })
        .catch(reject);                // fail fast
    });
  });
}

myPromiseAll([
  Promise.resolve(1),
  Promise.resolve(2),
  Promise.resolve(3),
]).then(console.log);                  // [1, 2, 3]
```

> 💡 **Key points**: preserve **input order** (use index), **fail fast** on first rejection, handle empty array.

---
