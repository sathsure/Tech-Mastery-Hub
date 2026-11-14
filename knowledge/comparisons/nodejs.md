# Node.js — Comparisons

> The classic "X vs Y" questions, side by side.

## `process.nextTick` vs `setImmediate` vs `setTimeout(0)`
| | Runs |
|---|---|
| `process.nextTick` | right after the current code, before promises |
| Promise `.then` | after `nextTick` callbacks |
| `setTimeout(fn, 0)` | in the timers phase |
| `setImmediate` | in the check phase (after I/O) |

## CommonJS vs ES Modules
| | CommonJS | ES Modules |
|---|---|---|
| Syntax | `require` / `module.exports` | `import` / `export` |
| Loading | synchronous | static, async |
| Top-level `await` | ❌ | ✅ |

## `cluster` vs `worker_threads` vs `child_process`
| | Creates | Use for |
|---|---|---|
| `cluster` | processes sharing a port | using all cores for a server |
| `worker_threads` | threads | CPU-heavy JS |
| `child_process` | other programs | running scripts/commands |

## `spawn` vs `exec` vs `fork`
| | Output | Use for |
|---|---|---|
| `spawn` | streamed | big output, long processes |
| `exec` | buffered | short commands |
| `fork` | IPC channel | another Node script |

## Express vs Fastify vs NestJS
| | Express | Fastify | NestJS |
|---|---|---|---|
| Style | minimal | minimal, schema-based | structured, DI, decorators |
| Speed | good | faster | depends on adapter |

## Node.js vs Java (for backends)
| | Node.js | Java (Spring) |
|---|---|---|
| Model | single event loop | thread per request / virtual threads |
| Best for | I/O, real-time | complex enterprise systems |
| CPU-heavy work | weak | strong |

## `readFile` vs `createReadStream`
| | `readFile` | `createReadStream` |
|---|---|---|
| Memory | whole file | chunks |
| Big files | ❌ | ✅ |

## `npm install` vs `npm ci`
| | `npm install` | `npm ci` |
|---|---|---|
| Uses the lock file strictly | ❌ (may update it) | ✅ |
| Best for | development | CI builds |
