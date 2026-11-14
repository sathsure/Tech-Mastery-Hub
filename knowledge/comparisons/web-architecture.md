# Web Architecture — Comparisons

> The classic "X vs Y" questions, side by side.

## CSR vs SSR vs SSG vs ISR
| | HTML built | SEO | First view | Fresh data |
|---|---|---|---|---|
| CSR | in browser | weak | slow | ✅ |
| SSR | per request on server | good | fast | ✅ |
| SSG | at build time | good | fastest | ❌ (rebuild) |
| ISR | static, rebuilt periodically | good | fastest | mostly |

## SPA vs MPA
| | SPA | MPA |
|---|---|---|
| Navigation | JS swaps views | new page load |
| Feels | app-like | classic site |
| SEO | needs SSR | easy |

## WebSocket vs SSE vs long polling
| | Direction | Reconnect | Over plain HTTP |
|---|---|---|---|
| WebSocket | both ways | manual | upgrade |
| SSE | server → client | automatic | ✅ |
| Long polling | server → client | per request | ✅ |

## Monolith frontend vs micro-frontends
| | Monolith | Micro-frontends |
|---|---|---|
| Teams | one codebase | independent teams |
| Bundle size | smaller | often bigger |

## Reverse proxy vs forward proxy vs load balancer
| | Sits in front of | Example |
|---|---|---|
| Reverse proxy | servers | Nginx |
| Forward proxy | clients | corporate proxy |
| Load balancer | server pool | AWS ALB |

## Cookies vs tokens for auth
| | Cookie session | Bearer token |
|---|---|---|
| Sent automatically | ✅ | ❌ (you add the header) |
| CSRF risk | ✅ | ❌ |
| XSS can steal | not if `HttpOnly` | ✅ if in localStorage |

## REST vs GraphQL (for frontends)
| | REST | GraphQL |
|---|---|---|
| Over/under-fetching | common | rare |
| HTTP caching | easy | harder |

## Service Worker vs Web Worker
| | Service Worker | Web Worker |
|---|---|---|
| Purpose | network proxy, offline, push | background computation |
| Lives after tab closes | ✅ | ❌ |
