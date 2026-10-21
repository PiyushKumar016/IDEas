# IDEas Online IDE — Technical Documentation Suite

Welcome to the comprehensive technical documentation for **IDEas Online IDE**, an online integrated development environment and code execution platform.

This documentation is reverse-engineered directly from the production source code and verified against the running architecture.

---

## Documentation Index

### Architectural Core
| Document | Description |
|:---|:---|
| [**00-project-overview.md**](./00-project-overview.md) | High-level system vision, operational modes, tech stack, and functional boundaries. |
| [**01-repository-map.md**](./01-repository-map.md) | Exhaustive directory and file map, component census, and legacy asset notes. |
| [**02-system-architecture.md**](./02-system-architecture.md) | System-wide topology, container communication, port mappings, and process models. |
| [**03-frontend-architecture.md**](./03-frontend-architecture.md) | React 19 structure, provider hierarchies, client routing, guards, and styling setup. |
| [**04-backend-architecture.md**](./04-backend-architecture.md) | Express server lifecycle, middleware pipelines, routing tree, and Dockerode bridge. |
| [**05-api-reference.md**](./05-api-reference.md) | Complete REST API contract, request/response schemas, cookie authentication, and status codes. |
| [**06-database-schema.md**](./06-database-schema.md) | MongoDB collections, Mongoose schemas, recursive tree models, and entity relationships. |
| [**07-component-interactions.md**](./07-component-interactions.md) | React component hierarchy, prop contracts, recursive tree logic, and context consumers. |
| [**08-state-and-data-flow.md**](./08-state-and-data-flow.md) | State ownership directory, context lifecycles, and synchronization boundaries. |
| [**09-debugging-playbook.md**](./09-debugging-playbook.md) | Failure-point register (FP-01 to FP-14), debugging playbooks, and diagnostic checklist. |

### Feature Execution Traces
| Feature Guide | Description |
|:---|:---|
| [**features/auth-and-session.md**](./features/auth-and-session.md) | Registration, login, JWT cookie generation, session hydration, and route guards. |
| [**features/project-workspace.md**](./features/project-workspace.md) | File explorer tree mutations, tab switching, Monaco Editor integration, and save flow. |
| [**features/code-execution-engine.md**](./features/code-execution-engine.md) | Standalone compiler, Docker sandboxing, stream demuxing, timeouts, and error handling. |
| [**features/project-library.md**](./features/project-library.md) | Dashboard metrics, project creation modal, theme picker, search filtering, and listing. |

### Architecture Diagrams
* [System Topology Diagram](./diagrams/system-topology.mmd)
* [Authentication Flow Sequence](./diagrams/auth-flow.mmd)
* [Workspace & Editor Sequence](./diagrams/workspace-flow.mmd)
* [Execution Pipeline Sequence](./diagrams/execution-pipeline.mmd)
* [State & Data Ownership Graph](./diagrams/data-ownership.mmd)

---

## Recommended Reading Paths

### 1. For Developers Onboarding or Adding Features
1. Read [00-project-overview.md](./00-project-overview.md) to understand the system's dual modes.
2. Review [02-system-architecture.md](./02-system-architecture.md) and [01-repository-map.md](./01-repository-map.md) to locate modules.
3. Review [03-frontend-architecture.md](./03-frontend-architecture.md) and [04-backend-architecture.md](./04-backend-architecture.md).
4. Review the relevant feature trace in `docs/features/`.

### 2. For Engineers Debugging Known Issues
1. Start directly at [09-debugging-playbook.md](./09-debugging-playbook.md) to check the Master Failure-Point Register.
2. Review the detailed flow in [08-state-and-data-flow.md](./08-state-and-data-flow.md) for state synchronization breakdowns.
3. Check the respective feature trace:
   - Save/persistence loss: [features/project-workspace.md](./features/project-workspace.md)
   - Registration crash: [features/auth-and-session.md](./features/auth-and-session.md)
   - Code execution freezes/missing output: [features/code-execution-engine.md](./features/code-execution-engine.md)

---

## Critical Implementation Alerts

> [!CAUTION]
> **FP-01: Silent Data Loss in IDE Workspace**
> In [`client/src/components/EditorPanel.jsx`](../client/src/components/EditorPanel.jsx), user code edits update only the local `code` state and are **never synchronized** back to `fileExplorer` in [`Project.jsx`](../client/src/pages/Project.jsx). Triggering `Ctrl+S` transmits the initial stale snapshot to the database. All user edits are lost upon page reload. See [09-debugging-playbook.md](./09-debugging-playbook.md#fp-01-silent-data-loss-on-workspace-save).

> [!WARNING]
> **FP-02: Broken Registration Flow**
> In [`client/src/pages/SignUp.jsx`](../client/src/pages/SignUp.jsx), `useNavigate` is not imported, causing an unhandled `ReferenceError: navigate is not defined` immediately upon successful registration.

> [!WARNING]
> **FP-04: Swallowed Compiler Errors**
> In [`client/src/pages/Compiler.jsx`](../client/src/pages/Compiler.jsx), the frontend inspects `opt.error` instead of `opt.data.error`, causing all compiler/runtime errors to be ignored and an empty stdout string rendered in the terminal.
