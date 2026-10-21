# 00 — Project Overview

## 1. System Purpose & Vision

**IDEas Online IDE** is a cloud-accessible, multi-language software development workspace and code execution platform. Designed as a modern browser-based programming environment, it eliminates local toolchain installation requirements by offloading code compilation and execution to containerized sandbox environments.

---

## 2. Dual Modes of Operation

The platform bifurcates into two distinct operating modes:

```
                                  ┌──────────────────────────────┐
                                  │      IDEas Platform          │
                                  └──────────────┬───────────────┘
                                                 │
                   ┌─────────────────────────────┴─────────────────────────────┐
                   ▼                                                           ▼
    ┌─────────────────────────────┐                             ┌─────────────────────────────┐
    │    1. Project Workspace     │                             │    2. Standalone Compiler   │
    │      Route: /project/:id    │                             │      Route: /Compiler       │
    ├─────────────────────────────┤                             ├─────────────────────────────┤
    │ • Multi-file tree explorer  │                             │ • Single-file scratchpad    │
    │ • Tabbed file navigation    │                             │ • Instant language switch   │
    │ • User-authenticated        │                             │ • Publicly accessible       │
    │ • MongoDB persistence       │                             │ • Stateless (no DB save)    │
    │ • Recursive folder creation │                             │ • Isolated Docker sandbox   │
    └─────────────────────────────┘                             └─────────────────────────────┘
```

1. **Project Workspace (`/project/:id`)**:
   - Designed for structured project development.
   - Features a recursive file-explorer sidebar, tabbed file management, and Monaco Editor.
   - Persists the entire file and directory hierarchy to MongoDB as a tree document.
   - Access is restricted to authenticated users via route guards.

2. **Standalone Compiler (`/Compiler`)**:
   - Designed for fast algorithm testing and code execution.
   - Unauthenticated visitors can write, compile, and execute code in isolated Docker containers.
   - Completely stateless: outputs are streamed directly to a simulated terminal window without persistence.

---

## 3. Technology Stack & Runtime Matrix

### Frontend Stack
* **Framework**: React 19 (`react` 19.2.6, `react-dom` 19.2.6)
* **Build Tooling & Bundler**: Vite 8.0.12 (`@vitejs/plugin-react` 6.0.1)
* **Routing**: React Router DOM v7 (`react-router-dom` 7.18.0)
* **Styling**: Tailwind CSS v4 (`tailwindcss` 4.3.1, `@tailwindcss/vite` 4.3.1)
* **Code Editor**: Monaco Editor wrapper (`@monaco-editor/react` 4.7.0)
* **Forms & Validation**: React Hook Form 7.84.0 (`@hookform/resolvers` 5.7.1, `zod` 4.4.3)
* **HTTP Client**: Axios 1.18.1 (`withCredentials: true`)
* **Icons & Animation**: Lucide React 1.23.0, Motion 12.42.1

### Backend Stack
* **Runtime**: Node.js 20 (ES Modules via `"type": "module"`)
* **Framework**: Express.js 4.21.2
* **Database Driver / ODM**: Mongoose 8.16.1 (MongoDB 6.0 engine)
* **Container Orchestration**: Dockerode 4.0.2
* **Authentication**: JSON Web Token (`jsonwebtoken` 9.0.2), Password Hashing (`bcrypt` 6.0.0)
* **Validation**: Zod 3.25.76 (`zod`)
* **Utilities**: `cookie-parser` 1.4.7, `chalk` 5.4.1, `dotenv` 16.5.0, `uuid` 11.1.0

### Infrastructure
* **Container Daemon**: Local Docker Host (via `/var/run/docker.sock` on Linux or `//./pipe/docker_engine` on Windows)
* **Runner Base Images**:
  - C++: `ideas-cpp` (`gcc:12`)
  - Python: `ideas-python` (`python:3.11-slim`)
  - Java: `ideas-java` (`eclipse-temurin:17-jdk-alpine`)
  - Node.js: `ideas-node` (`node:20-slim`)

---

## 4. Core Design Decisions & Constraints

1. **Stateless Sandboxed Execution**:
   - Code execution does not run directly on the host operating system. The Express backend writes code to a temporary directory (`server/temp/<uuid>/`), mounts it into an ephemeral container, runs it under a restricted user (`coderunner`), captures output, and immediately tears down both the container and files.
2. **Cookie-Based JWT Authentication**:
   - Client applications never store JWTs in `localStorage` or `sessionStorage`. All auth tokens are issued as HTTP-only cookies (`accessToken`) to defend against XSS token harvesting.
3. **Single-Document Tree Storage**:
   - The entire virtual filesystem for a project is stored as a nested Mongoose subdocument (`FileTreeNodeSchema`) inside a single `Project` document rather than relational parent-child file records.
4. **No Real-Time Server (No WebSockets / SSE)**:
   - All client-server interactions are pure request-response REST calls.

---

## 5. Implemented Features vs Unimplemented Copy

A critical audit of the codebase reveals discrepancies between landing page claims and actual technical implementations:

| Feature / Claim | Status | Reality in Source Code |
|:---|:---|:---|
| **Standalone Code Runner** | Verified Implemented | Full execution pipeline operational for C++, Python, Java, JavaScript via `/Compiler`. |
| **Workspace File Tree** | Verified Implemented | Recursive tree structure, file/folder creation, renaming, and deletion active. |
| **Monaco Code Editing** | Verified Implemented | Functional editor rendering with custom futuristic theme and syntax highlighting. |
| **Workspace Persistence** | Partially Broken (FP-01) | Save infrastructure exists (`Ctrl+S` $\rightarrow$ `POST /user/project`), but live editor edits are not synced to the save payload. |
| **"Live Collaboration"** | **NOT IMPLEMENTED** | Landing page (`client/src/pages/Home.jsx`) references real-time collaboration. No WebSocket server, socket.io, WebRTC, or operational CRDT libraries exist. |
| **C Language Support** | **PARTIALLY MISSING (FP-06)** | Listed in frontend language bar (`Compiler.jsx`), but no backend Docker runner or mapping exists in `codeRunner.js`. |
| **Admin Controls** | **STUB ONLY** | User model schema supports `role: "admin"`, but `server/src/controller/adminController/` is an empty folder with zero routes. |

---

## Next Steps & References
* See [01-repository-map.md](./01-repository-map.md) for the complete directory layout and file census.
* See [02-system-architecture.md](./02-system-architecture.md) for network routing and container interaction topologies.
* See [09-debugging-playbook.md](./09-debugging-playbook.md) for specific reproduction steps for broken flows.
