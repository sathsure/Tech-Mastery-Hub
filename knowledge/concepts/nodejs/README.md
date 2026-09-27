# Node.js

## Definition

Node.js is presented as a JavaScript runtime that allows JavaScript to execute outside the browser, primarily on servers. The source emphasizes V8, event-driven non-blocking I/O, libuv, the event loop, streams, and worker threads.

## Core Concepts

### Runtime and Scalability
The source explains that Node.js uses the V8 JavaScript engine and an event-driven, non-blocking I/O model rather than a blocking request-per-thread model.

The material positions Node.js for APIs, real-time applications, microservices, and streaming systems.

### Express.js
Express.js is described as a minimal web framework on Node.js providing:

- routing
- middleware
- request/response abstractions

The source identifies REST APIs, backend services, and server-side rendered applications as usage areas.

### Non-Blocking I/O
Slow operations such as file reads and database queries are delegated to the operating system or libuv thread pool. Completion callbacks are then processed by the event loop.

### Event Loop
The source describes phases including:

- Timers
- Pending Callbacks
- Poll
- Check
- Close Callbacks

It also distinguishes microtasks such as Promise callbacks from timers and I/O callbacks.

### Single Thread and Worker Threads
JavaScript execution occurs on the main JavaScript thread, while Node.js can use a thread pool internally.

Worker Threads provide parallel JavaScript execution for CPU-intensive work such as encryption, image processing, and heavy computation. The source says they should not be used as the solution for I/O-bound work.

### Streams
Streams process data incrementally rather than loading an entire payload into memory.

Four stream types covered by the source:

- Readable
- Writable
- Duplex
- Transform

The material connects streams with large files, network data, real-time processing, memory efficiency, scalability, file uploads/downloads, video streaming, API gateways, and data pipelines.

## Learning Path

1. Node.js runtime
2. Event-driven architecture
3. Non-blocking I/O
4. Event loop
5. Express.js
6. Worker Threads
7. Streams
8. Backend APIs
9. Node security/backend topics

## Repository Resources

- Interview: `interview/backend/node/01-Node.js.md`
- Interview: `interview/backend/node/06-Node-security.md`
- Roadmap: `roadmap/backend/README.md`

## Source Boundary

This canonical page consolidates the supplied Node.js evidence. It does not attempt to replace the detailed interview material or define a complete Node.js API reference.

