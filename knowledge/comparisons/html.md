# HTML — Comparisons

> The classic "X vs Y" questions, side by side.

## Block vs inline vs inline-block
| | Block | Inline | Inline-block |
|---|---|---|---|
| New line | ✅ | ❌ | ❌ |
| Width/height work | ✅ | ❌ | ✅ |
| Examples | `div`, `p` | `span`, `a` | buttons, badges |

## `section` vs `article` vs `div`
| | `article` | `section` | `div` |
|---|---|---|---|
| Meaning | stands alone (post, card) | themed group with heading | none |
| Screen readers notice it | ✅ | ✅ | ❌ |

## `defer` vs `async` vs plain script
| | Plain | `async` | `defer` |
|---|---|---|---|
| Blocks parsing | ✅ | while running | ❌ |
| Order kept | ✅ | ❌ | ✅ |
| Best for | rarely | analytics | app scripts |

## GET vs POST (forms)
| | GET | POST |
|---|---|---|
| Data in | URL | body |
| Bookmarkable | ✅ | ❌ |
| Use for | search, filters | login, create |

## `id` vs `class`
| | `id` | `class` |
|---|---|---|
| Unique on page | ✅ | ❌ |
| Many per element | ❌ | ✅ |

## Canvas vs SVG
| | Canvas | SVG |
|---|---|---|
| Draws | pixels | shapes (DOM) |
| Sharp when zoomed | ❌ | ✅ |
| Best for | games, many objects | icons, charts, logos |

## `<b>`/`<i>` vs `<strong>`/`<em>`
| | `<b>`, `<i>` | `<strong>`, `<em>` |
|---|---|---|
| Meaning | visual only | importance / emphasis |

## `localStorage` vs cookies
| | `localStorage` | Cookie |
|---|---|---|
| Sent to server | ❌ | ✅ |
| Readable by JS | ✅ | ✅ unless `HttpOnly` |
| Size | ~5 MB | ~4 KB |
