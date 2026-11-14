# Web Vitals & Performance — Comparisons

> The classic "X vs Y" questions, side by side.

## LCP vs INP vs CLS
| | Measures | Good | Main fixes |
|---|---|---|---|
| LCP | main content shown | ≤ 2.5 s | faster server, preload hero image |
| INP | reaction to input | ≤ 200 ms | less JS, split long tasks |
| CLS | layout jumping | ≤ 0.1 | set image sizes, reserve space |

## FID vs INP
| | FID (retired) | INP (since 2024) |
|---|---|---|
| Looks at | first input only | nearly the slowest input of the visit |
| Measures | input delay only | delay + processing + paint |

## Lab vs field data
| | Lab | Field |
|---|---|---|
| Source | one test (Lighthouse) | real users (CrUX) |
| Good for | debugging | judging real experience |
| Used for Google ranking | ❌ | ✅ |

## Preload vs prefetch vs preconnect
| | Does | When |
|---|---|---|
| `preload` | fetch a file now, high priority | needed on this page |
| `prefetch` | fetch at low priority | likely next page |
| `preconnect` | open the connection early | another domain you'll call |

## Lazy vs eager loading (images)
| | Lazy | Eager |
|---|---|---|
| Loads | when near the screen | right away |
| Use for | below-the-fold images | the LCP / hero image |

## Brotli vs gzip
| | Brotli | gzip |
|---|---|---|
| Compression | better | good |
| Support | all modern browsers | everywhere |

## WebP/AVIF vs JPEG/PNG
| | WebP / AVIF | JPEG / PNG |
|---|---|---|
| File size | much smaller | bigger |
| Support | modern browsers | everywhere |
