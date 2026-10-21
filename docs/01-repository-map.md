# 01 — Repository Map

This document catalogs every directory, source file, configuration asset, and legacy artifact across the repository.

---

## 1. Root Repository Layout

```
c:\Users\Piyush\Documents\projects\IDEas_online_IDE\
├── docker-compose.yml          # Root multi-container orchestration (mongo, backend, frontend)
├── README.md                   # Legacy root README (encoded in UTF-16LE, unreadable by standard tools)
├── docs/                       # Comprehensive technical documentation suite
├── client/                     # Frontend SPA workspace (Vite + React 19)
├── server/                     # Backend API server (Express + Dockerode)
└── ideas-backend/              # Legacy backend staging folder (contains only an empty temp/ directory)
```

---

## 2. Frontend Source Tree (`client/`)

```
client/
├── Dockerfile                  # Container definition for frontend (Node 20, runs npm start)
├── vite.config.js              # Vite configuration (plugins: react, tailwindcss)
├── eslint.config.js            # Flat ESLint configuration
├── index.html                  # HTML entry point (contains <div id="root"> and module script tag)
├── package.json                # Dependencies, devDependencies, and scripts
├── .env                        # Local environment file (sets VITE_USER_API=http://localhost:8181/user)
├── .gitignore                  # Git ignore rules
└── src/
    ├── main.jsx                # Application root mount (ReactDOM.createRoot + BrowserRouter)
    ├── App.jsx                 # Provider shell (<AuthProvider>, <EditorContextProvider>, <TabsContextProvider>)
    ├── index.css               # Global CSS styles including Tailwind imports
    ├── API/
    │   └── userAPI.js          # Axios singleton client and 7 HTTP request functions
    ├── components/
    │   ├── AuthRoute.jsx       # Route guards (<ProtectedRoute>, <PublicOnlyRoute>)
    │   ├── EditorPanel.jsx     # Monaco Editor wrapper, tabs container, and theme definition
    │   ├── FolderStructure.jsx # Recursive filesystem tree view, inline inputs, and context menu
    │   └── Tabs.jsx            # Tab strip for open editor files
    ├── contexts/
    │   ├── authcontext.jsx     # Global authentication provider (<AuthProvider>, authContext)
    │   ├── editorPanelContext.jsx # Global active file descriptor (<EditorContextProvider>)
    │   ├── leftClickMenuContext.jsx # Scoped context for tree right-click menu (<LeftClickMenuProvider>)
    │   └── tabsContext.jsx     # Global open tabs array provider (<TabsContextProvider>)
    ├── hooks/
    │   ├── useAuth.js          # Custom hook: consumes authContext
    │   └── useTabs.js          # Custom hook: consumes tabsContext
    ├── pages/
    │   ├── Compiler.jsx        # Standalone code execution playground
    │   ├── Dashboard.jsx       # User dashboard displaying recent projects & stats
    │   ├── Home.jsx            # Landing / marketing page
    │   ├── Login.jsx           # User login form
    │   ├── Project.jsx         # Full IDE workspace page (tree + editor split)
    │   ├── Projects.jsx        # Project library, search, and new project modal
    │   └── SignUp.jsx          # User registration form
    ├── routes/
    │   └── Outlets.jsx         # React Router v7 route registry and guard associations
    ├── shared/
    │   ├── BgDecor.jsx         # Decorative background SVG/logo elements
    │   └── Navbar.jsx          # Global navigation header with user profile badge
    ├── utils/
    │   └── languageConfig.js   # Extension-to-language and boilerplate dictionary
    └── validation/
        ├── loginSchema.js      # Zod validation schema for login
        └── signupSchema.js     # Zod validation schema for registration
```

---

## 3. Backend Source Tree (`server/`)

```
server/
├── Dockerfile                  # Container definition for backend (Node 20, port 8181)
├── docker-compose.yml          # Secondary Compose file used to build runner images
├── package.json                # Server dependencies and scripts ("type": "module")
├── .env                        # Private environment variables (PORT, MONGO_URL, JWT secrets, SALT)
├── .gitignore                  # Git ignore rules
├── temp/                       # Host-mounted scratch directory for ephemeral code execution
├── docker/                     # Dockerfiles for each containerized language runner
│   ├── cpp/Dockerfile          # gcc:12 runner
│   ├── java/Dockerfile         # eclipse-temurin:17-jdk-alpine runner
│   ├── node/Dockerfile         # node:20-slim runner
│   └── python/Dockerfile       # python:3.11-slim runner
└── src/
    ├── server.js               # Express entry point, DNS configuration, and middleware mounting
    ├── controller/
    │   ├── adminController/    # EMPTY DIRECTORY (No administrative functions implemented)
    │   └── userController/
    │       └── userController.js # 7 Controller handlers for user, project, and execution logic
    ├── db/
    │   └── mongoConnect.js     # Mongoose connection initializer
    ├── middlewares/
    │   ├── addProject.js       # EMPTY FILE (0 bytes, stub)
    │   ├── userSignup.js       # Signup duplicate email check and JWT pre-signing middleware
    │   └── validate.js         # Higher-order middleware running Zod schema validation
    ├── model/
    │   └── UserModel.js        # Mongoose User model definition
    ├── routes/
    │   ├── routes.js           # Root router delegating /user to UserRouter
    │   └── UserRouter/
    │       └── UserRoutes.js   # Route registration for all 7 API endpoints
    ├── schemas/
    │   ├── loginSchema.js      # Server-side Zod login schema
    │   ├── projectSchema.js    # Mongoose schemas for FileTreeNode and Project
    │   └── userSchema.js       # Server-side Zod registration schema
    └── services/
        └── codeRunner.js       # Core execution service wrapping Dockerode
```

---

## 4. Master File Census & Component Registry

| File Path | Type / Layer | Primary Exports / Roles | Status |
|:---|:---|:---|:---|
| `client/src/main.jsx` | Frontend Entry | Root DOM render, `BrowserRouter` | **Active** |
| `client/src/App.jsx` | UI Shell | Context nesting, `Navbar`, `Outlets` | **Active** |
| `client/src/routes/Outlets.jsx` | Routing | Route table definitions | **Active** |
| `client/src/components/AuthRoute.jsx` | Guard | `ProtectedRoute`, `PublicOnlyRoute` | **Active (Case bug FP-09)** |
| `client/src/API/userAPI.js` | HTTP Client | Axios instance, 7 API caller methods | **Active** |
| `client/src/contexts/authcontext.jsx` | State | `AuthProvider`, `authContext` | **Active** |
| `client/src/contexts/editorPanelContext.jsx` | State | `EditorContextProvider`, `EditorContext` | **Active** |
| `client/src/contexts/tabsContext.jsx` | State | `TabsContextProvider`, `tabsContext` | **Active** |
| `client/src/contexts/leftClickMenuContext.jsx` | State | `LeftClickMenuProvider`, `LeftClickMenuContext`| **Active** |
| `client/src/components/EditorPanel.jsx` | UI Component | Monaco Editor, local `code` state | **Active (Sync defect FP-01)** |
| `client/src/components/FolderStructure.jsx` | UI Component | Recursive tree node, context menu | **Active** |
| `client/src/components/Tabs.jsx` | UI Component | Open file tabs strip | **Active** |
| `client/src/pages/Compiler.jsx` | Page | Code execution playground | **Active (Response bug FP-04)** |
| `client/src/pages/Project.jsx` | Page | Full IDE workspace, tree management, `Ctrl+S` | **Active (Stale save FP-01)** |
| `client/src/pages/Projects.jsx` | Page | Project cards grid, search, new project modal | **Active** |
| `client/src/pages/Dashboard.jsx` | Page | Overview cards, recent projects | **Active** |
| `client/src/pages/Login.jsx` | Page | Login form with React Hook Form + Zod | **Active** |
| `client/src/pages/SignUp.jsx` | Page | Signup form with React Hook Form + Zod | **Active (Crash bug FP-02)** |
| `client/src/pages/Home.jsx` | Page | Marketing landing page | **Active (Contains dead copy)** |
| `client/src/utils/languageConfig.js` | Utility | Extension map to Monaco lang and boilerplate | **Active** |
| `server/src/server.js` | Backend Entry | Express app listener, DNS overrides, CORS | **Active** |
| `server/src/routes/routes.js` | Routing | Root router mounting `/user` | **Active** |
| `server/src/routes/UserRouter/UserRoutes.js` | Routing | Endpoints for runCode, auth, project ops | **Active** |
| `server/src/controller/userController/userController.js`| Controller | Handlers: codeExecution, login, etc. | **Active (Auth flaws FP-07, 08)** |
| `server/src/controller/adminController/` | Controller | None | **Empty Directory / Dead** |
| `server/src/middlewares/validate.js` | Middleware | Zod async validation runner | **Active** |
| `server/src/middlewares/userSignup.js` | Middleware | Duplicate email check + JWT generation | **Active** |
| `server/src/middlewares/addProject.js` | Middleware | None | **Empty File (0 bytes) / Stub** |
| `server/src/model/UserModel.js` | Model | Mongoose schema & model for users | **Active** |
| `server/src/schemas/projectSchema.js` | Model / Schema | Mongoose schema & model for projects | **Active** |
| `server/src/services/codeRunner.js` | Service | Dockerode wrapper, temp files, execution | **Active (Missing "C" FP-06)** |
| `server/src/db/mongoConnect.js` | Database | Mongoose connection helper | **Active** |
| `server/temp/` | Storage | Leftover submission execution files | **Residual Artifacts (FP-14)** |
| `ideas-backend/` | Staging | Legacy empty directory | **Dead / Orphaned** |

---

## 5. Legacy & Orphaned Assets

1. **`ideas-backend/` Directory**:
   - Contains only an empty subdirectory `ideas-backend/temp/`.
   - **Root Cause**: Likely the original location of the backend before being renamed/migrated to `server/`. It is referenced in the root `docker-compose.yml` (`./ideas-backend/temp:/app/temp`), which is an out-of-sync volume mount.
2. **`server/src/middlewares/addProject.js`**:
   - 0 bytes in size.
   - Intended to be an authorization or validation middleware for project mutations, but was never written. `postProject` performs JWT verification inline instead.
3. **`server/src/controller/adminController/`**:
   - Completely empty directory. Although `UserModel.js` supports `role: "admin"`, no administrative endpoints exist.
4. **`server/temp/` Leftover Artifacts**:
   - Contains UUID-named folders (e.g., `5402f528-.../main.js`) left behind from previous code execution runs, indicating that container or host errors prevented `fs.rmSync(tempDir)` from executing.

---

## Next Steps & References
* For system communication between these components, see [02-system-architecture.md](./02-system-architecture.md).
* For detailed component nesting and props, see [07-component-interactions.md](./07-component-interactions.md).
