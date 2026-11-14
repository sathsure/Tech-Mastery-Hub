# React — Comparisons

> The classic "X vs Y" questions, side by side.

## Props vs state
| | Props | State |
|---|---|---|
| Owned by | the parent | the component |
| Can change it | ❌ (read-only) | ✅ (`setState`) |
| Change re-renders | ✅ | ✅ |

## `useMemo` vs `useCallback` vs `React.memo`
| | Remembers | Use for |
|---|---|---|
| `useMemo` | a value | slow calculations |
| `useCallback` | a function | stable props for memo children |
| `React.memo` | a component's render | skip re-render if props are equal |

## `useEffect` vs `useLayoutEffect`
| | `useEffect` | `useLayoutEffect` |
|---|---|---|
| Runs | after paint | before paint |
| Use for | data fetching, subscriptions | measuring the DOM |

## Controlled vs uncontrolled inputs
| | Controlled | Uncontrolled |
|---|---|---|
| Value lives in | React state | the DOM (`ref`) |
| Validation on each key | easy | harder |

## Context vs Redux vs React Query
| | Context | Redux / Zustand | React Query |
|---|---|---|---|
| Best for | theme, auth, locale | complex app state | server data (cache, refetch) |
| Re-render control | coarse | fine (selectors) | automatic |

## `useState` vs `useReducer`
| | `useState` | `useReducer` |
|---|---|---|
| Best for | simple values | many related updates |

## Class vs function components
| | Class | Function + hooks |
|---|---|---|
| State | `this.state` | `useState` |
| Lifecycle | `componentDidMount`… | `useEffect` |
| Used today | legacy | ✅ |

## CSR vs SSR vs SSG
| | CSR | SSR | SSG |
|---|---|---|---|
| HTML built | in browser | on server per request | at build time |
| SEO | weaker | good | good |
| Speed of first view | slower | fast | fastest |

## Server vs client components
| | Server component | Client component |
|---|---|---|
| Runs | only on the server | in the browser too |
| Hooks / event handlers | ❌ | ✅ |
| JS sent to browser | ❌ | ✅ |

## Virtual DOM vs real DOM
| | Virtual DOM | Real DOM |
|---|---|---|
| What | JS object copy | the browser's page tree |
| Updating | cheap, then diffed | expensive |
