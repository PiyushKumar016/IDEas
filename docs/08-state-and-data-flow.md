# 08 — State Ownership & Data Flow

This document details state ownership, context lifecycles, and data synchronization pathways across the IDEas platform.

---

## 1. Master State Ownership Directory

| State Variable | Owner File & Scope | Initial Value | Reader Components | Writer Functions / Triggers | Persistence / Server Mirror |
|:---|:---|:---|:---|:---|:---|
| **`user`** | `authcontext.jsx` (Global Context) | `null` | `Navbar`, `Dashboard`, `ProtectedRoute`, `PublicOnlyRoute` | `checkAuth()` $\rightarrow$ `setUser()` | Mirrored from MongoDB `User` model via `GET /user/me`. |
| **`loading`** | `authcontext.jsx` (Global Context) | `true` | `ProtectedRoute`, `PublicOnlyRoute`, `Navbar` | `checkAuth()` $\rightarrow$ `setLoading(false)` | Ephemeral client flag. |
| **`editorInfo`** | `editorPanelContext.jsx` (Global Context) | `{ id: "", fileName: "", content: "", language: "", used: false }` | `Project.jsx` (mount trigger), `EditorPanel.jsx` (props), `Tabs.jsx` (active highlight) | `FolderStructure.handleClick()`, `Tabs.jsx` tab click / tab close | Ephemeral; initialized from clicked tree node. |
| **`tabs`** | `tabsContext.jsx` (Global Context) | `[]` | `Tabs.jsx` (tab bar), `FolderStructure.jsx` (dup check) | `FolderStructure.handleClick()`, `Tabs.jsx` tab close (`X`) | Ephemeral client array. |
| **`contextMenu`** | `leftClickMenuContext.jsx` (Scoped Context) | `{ visible: false, x: 0, y: 0, nodeId: undefined }` | `FolderStructure.jsx` | `handleRightClick()`, `document.addEventListener("click")` | Ephemeral DOM coordinate state. |
| **`fileExplorer`** | `Project.jsx` (Page Local State) | `{}` | `Project.jsx`, `FolderStructure.jsx` (as prop) | `fetchProject()` (`getProjectById`), `handleInsertNode()`, `handleRenameNode()`, `handleDeleteNode()` | Mirrored from MongoDB `Project.rootNode` via `postProject()`. |
| **`code`** (Editor) | `EditorPanel.jsx` (Component Local) | `content` (from prop) | Monaco `<Editor value={code} />` | `useEffect([content])`, `handleCodeChange(value)` | **ISOLATED / NOT PERSISTED** (FP-01). |
| **`code`** (Compiler)| `Compiler.jsx` (Page Local State) | `languageBoilerplates.cpp` | Monaco `<Editor value={code} />` | `handleCodeChange()`, language selector buttons | Ephemeral scratchpad state. |
| **`output`** | `Compiler.jsx` (Page Local State) | `"//output here"` | Terminal `<div />` panel | `sendCodeToExecution()` | Returned from `POST /user/runCode`. |
| **`loading`** (Comp) | `Compiler.jsx` (Page Local State) | `false` | "Run Code" button disabled state | `sendCodeToExecution()` (`true` on start, `false` on completion) | Ephemeral request flag. |
| **`projects`** | `Projects.jsx` (Page Local State) | `[]` | `Projects.jsx` (grid rendering) | `initProjects()` (`getAllProjects`), `handleCreateProject()` | Mirrored from MongoDB `Project` documents. |

---

## 2. State & Data Flow Graph

```mermaid
graph TD
    subgraph GlobalProviders [Global Context Providers (App.jsx)]
        AuthProv["authContext (AuthProvider)<br/>State: user, loading"]
        EdProv["EditorContext (EditorContextProvider)<br/>State: editorInfo { id, fileName, content, language, used }"]
        TabsProv["tabsContext (TabsContextProvider)<br/>State: tabs [ { id, fileName, content, language, used } ]"]
    end

    subgraph PageLevelState [Page-Level Local States]
        ProjState["Project.jsx<br/>State: fileExplorer (Root FileTreeNode)"]
        CompState["Compiler.jsx<br/>State: code, language, loading, output"]
        ProjectsState["Projects.jsx<br/>State: projects, search, isModalOpen, newProjectName, selectedColor"]
    end

    subgraph ComponentLevelState [Component Local States]
        EdPanelState["EditorPanel.jsx<br/>State: code (Live Monaco buffer)"]
        TreeState["FolderStructure.jsx (Recursive)<br/>State: showInput, newItemName, editMode, renameText"]
        LeftClickMenu["LeftClickMenuContext<br/>State: contextMenu { visible, x, y, nodeId }"]
    end

    AuthProv -- "Consumes auth" --> Navbar
    AuthProv -- "Gates navigation" --> RouteGuards["ProtectedRoute / PublicOnlyRoute"]

    ProjState -- "Passes root tree prop" --> TreeState
    TreeState -- "Mutates tree via callbacks" --> ProjState
    TreeState -- "Selects file -> sets active tab & info" --> EdProv
    TreeState -- "Appends to open tabs" --> TabsProv
    EdProv -- "Passes initial content prop" --> EdPanelState
    TabsProv -- "Renders open file tabs" --> TabsUI["Tabs.jsx"]
    TabsUI -- "Switch tab -> updates active info" --> EdProv

    EdPanelState -. "MISSING SYNC LINK (FP-01)" .-> ProjState
```

---

## 3. Global Context Lifecycles

### 1. `authContext` (`client/src/contexts/authcontext.jsx`)
* **Mount Effect**: Runs `checkAuth()` on initial application load:
  ```javascript
  useEffect(() => {
    checkAuth();
  }, []);
  ```
* **State Behavior**: While `checkAuth()` is in flight, `loading: true`. Route guards render `<div>Loading...</div>`, blocking screen flicker.
* **Transition**: When `getMe()` resolves, `user` is populated and `loading: false`. Route guards then render `<Outlet />`.

### 2. `EditorContext` (`client/src/contexts/editorPanelContext.jsx`)
* **Purpose**: Holds a pointer to whichever file is currently active in Monaco Editor.
* **Update Trigger**: Fired when a user clicks a file node in `FolderStructure` or switches tabs in `Tabs.jsx`.
* **Shape**:
  ```javascript
  {
    id: "uuid",
    fileName: "main.py",
    content: "print('hello')",
    language: "python",
    used: true
  }
  ```

### 3. `tabsContext` (`client/src/contexts/tabsContext.jsx`)
* **Purpose**: Maintains the array of open file tabs.
* **Tab Close Logic**: When tab `X` is clicked, it is filtered out of `tabs`. If the active tab was closed, `editorInfo` switches to the previous tab; if no tabs remain, `editorInfo.used` is reset to `false`, hiding the editor.

---

## 4. The Critical Synchronization Breakdown (FP-01)

The most severe data-flow breakdown occurs during project editing and saving:

```
[User Types in Monaco]
        │
        ▼
EditorPanel.jsx: handleCodeChange(value)
        │
        ▼
setCode(value)  <── UPDATES LOCAL REACT STATE ONLY
        │
        ❌ (No callback or context update dispatched)
        │
Project.jsx: handleSave() [Ctrl + S]
        │
        ▼
postProject(fileExplorer) <── SENDS ORIGINAL UNMODIFIED TREE SNAPSHOT
        │
        ▼
MongoDB: Project document updated with old, empty content!
```

1. **Snapshot Taken**: `FolderStructure.handleClick` captures `fileExplorer.content` into `editorInfo`.
2. **Prop Drilling**: `Project.jsx` passes `editorInfo.content` to `EditorPanel.jsx` as a prop.
3. **Local Fork**: `EditorPanel.jsx` initializes local `const [code, setCode] = useState(content)`.
4. **Isolated Mutations**: Keystrokes update `code` only. Neither `editorInfo` nor `fileExplorer` receives the updated buffer.
5. **Stale Save**: Pressing `Ctrl+S` invokes `postProject(fileExplorer)`. The saved payload contains the initial boilerplate.

---

## Next Steps & References
* For detailed troubleshooting steps, see [09-debugging-playbook.md](./09-debugging-playbook.md).
* For the full workspace execution trace, see [features/project-workspace.md](./features/project-workspace.md).
