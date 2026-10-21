# 03 — Frontend Architecture

This document describes the structure, component lifecycle, provider hierarchy, and client-side routing of the React 19 single-page application.

---

## 1. Entry Point & Mount Flow

The application boot sequence originates at `client/src/main.jsx`:

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
)
```

### Notable Observations:
1. **`StrictMode` Unused**: `StrictMode` is imported but not rendered around `<App />`. React 19's double-mount effect checks in development are inactive.
2. **`BrowserRouter` Root**: React Router v7 `BrowserRouter` wraps `<App />` directly, giving all nested components access to history, location, and navigation primitives.

---

## 2. Provider Hierarchy & Global Context Order

In `client/src/App.jsx`, global contexts are nested in a strict dependency sequence:

```
<BrowserRouter> (main.jsx)
  └── <App> (App.jsx)
        └── <AuthProvider> (contexts/authcontext.jsx)
              └── <EditorContextProvider> (contexts/editorPanelContext.jsx)
                    └── <TabsContextProvider> (contexts/tabsContext.jsx)
                          ├── <Navbar /> (shared/Navbar.jsx)
                          └── <Outlets /> (routes/Outlets.jsx)
```

### Purpose of Each Provider Layer

| Provider Layer | File Path | Provided State Values | Scope & Purpose |
|:---|:---|:---|:---|
| **`AuthProvider`** | `client/src/contexts/authcontext.jsx` | `{ user, setUser, checkAuth, loading, setLoading }` | Tracks logged-in user profile (`email`, `username`) and manages route blocking during auth checks. |
| **`EditorContextProvider`** | `client/src/contexts/editorPanelContext.jsx` | `{ editorInfo, setEditorInfo }` | Tracks the currently active open file (`id`, `fileName`, `content`, `language`, `used`). |
| **`TabsContextProvider`** | `client/src/contexts/tabsContext.jsx` | `{ tabs, setTabs }` | Manages the list of open file tabs displayed in the editor header. |
| **`LeftClickMenuProvider`** | `client/src/contexts/leftClickMenuContext.jsx` | `{ contextMenu, setContextMenu }` | **Locally Scoped**: Rendered inside `Project.jsx` (not `App.jsx`) to manage right-click context menus in the tree explorer. |

---

## 3. Client Routing & Route Guards

Route definitions are centralized in `client/src/routes/Outlets.jsx`. Navigation access is enforced using layout route guards defined in `client/src/components/AuthRoute.jsx`.

### Route Matrix & Protection Levels

| Path | Component | Guard Type | Access Condition | Fallback / Redirection |
|:---|:---|:---|:---|:---|
| `/` | `Home` | Public | None | Always renders landing page. |
| `/signup` | `SignUp` | `PublicOnlyRoute` | `!user` | If authenticated, redirects to `/dashboard`. |
| `/login` | `Login` | `PublicOnlyRoute` | `!user` | If authenticated, redirects to `/dashboard`. |
| `/Dashboard` | `Dashboard` | `ProtectedRoute` | `user !== null` | If unauthenticated, redirects to `/login`. |
| `/Projects` | `Projects` | `ProtectedRoute` | `user !== null` | If unauthenticated, redirects to `/login`. |
| `/project/:id` | `Project` | `ProtectedRoute` | `user !== null` | If unauthenticated, redirects to `/login`. |
| `/Compiler` | `Compiler` | Public | None | Always renders standalone code runner. |

### Guard Implementations (`client/src/components/AuthRoute.jsx`)
```jsx
export const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export const PublicOnlyRoute = () => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return !user ? <Outlet /> : <Navigate to="/dashboard" replace />;
};
```

> [!WARNING]
> **FP-09: Route Path Casing Discrepancy**
> In `PublicOnlyRoute`, the redirect path is hardcoded as `/dashboard` (lowercase). However, in `Outlets.jsx`, the route is registered as `/Dashboard` (capital 'D'). In strict routing environments, this casing mismatch can result in 404 navigation failures.

---

## 4. UI Layout & Styling System

* **Tailwind CSS v4**: Integrated directly via `@tailwindcss/vite` in `vite.config.js`. Global directives reside in `client/src/index.css`.
* **Monaco Futuristic Theme**:
  Both `EditorPanel.jsx` and `Compiler.jsx` mount custom Monaco themes (`my-futuristic-theme`) with dark purple visual palettes:
  - Background: `#1a1333` (workspace) / `#0D0914` (compiler)
  - Keywords: `#C586C0`
  - Identifiers: `#9CDCFE`
  - Strings: `#CE9178`
  - Font: `'Fira Code', 'JetBrains Mono', monospace`
* **Decorative Elements**: `client/src/shared/BgDecor.jsx` is rendered across all pages, overlaying low-opacity (0.05) branding graphics.

---

## Next Steps & References
* For detailed component nesting and props, see [07-component-interactions.md](./07-component-interactions.md).
* For context lifecycle details, see [08-state-and-data-flow.md](./08-state-and-data-flow.md).
* For the workspace execution trace, see [features/project-workspace.md](./features/project-workspace.md).
