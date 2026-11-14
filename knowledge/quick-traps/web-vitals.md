# Web Vitals & Performance — Quick Traps

> Tricky spots interviewers love: what goes wrong, a tiny example, and the right answer.

### 1. Still saying FID
- ❌ "The Core Web Vitals are LCP, FID and CLS."
- ✅ **INP** replaced FID in March 2024.

### 2. Lighthouse 100 = fast for users
- ❌ Trusting one lab score.
- ✅ Real users have slower phones and networks. Google ranks on **field** data.

### 3. Lazy-loading the hero image
- ❌ `<img loading="lazy">` on the main banner → worse LCP.
- ✅ Lazy-load only images below the fold; preload the main one.

### 4. Images without size
- ❌ `<img src="a.jpg">` → content jumps when it loads (CLS).
- ✅ Set `width` and `height`, or `aspect-ratio`.

### 5. Using averages
- ❌ "Our average LCP is 1.8 s, we're fine."
- ✅ Vitals are judged at the **75th percentile**; slow users hide in the average.

### 6. INP is only about the first click
- ❌ Thinking INP measures the first interaction (that was FID).
- ✅ INP looks at nearly the **slowest** interaction during the whole visit.

### 7. Every layout shift counts
- ❌ Thinking an accordion opening on click hurts CLS.
- ✅ Shifts within 500 ms after a user's action don't count.

### 8. Animating layout properties
- ❌ `transition: height` / `top` → janky, can add CLS.
- ✅ Animate `transform` and `opacity`.

### 9. More CDN = solves everything
- ❌ A CDN fixes slow pages.
- ✅ It helps TTFB and file delivery, but heavy JavaScript still hurts INP.
