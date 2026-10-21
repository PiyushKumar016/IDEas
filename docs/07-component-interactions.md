# 07 — Component Interactions & UI Hierarchy

This document maps the complete React component hierarchy, parent-child relationships, prop contracts, recursive tree mechanics, and context interactions.

---

## 1. Complete Component Tree

```
BrowserRouter (client/src/main.jsx)
└── App (client/src/App.jsx)
    └── AuthProvider (client/src/contexts/authcontext.jsx)
        └── EditorContextProvider (client/src/contexts/editorPanelContext.jsx)
            └── TabsContextProvider (client/src/contexts/tabsContext.jsx)
                ├── Navbar (client/src/shared/Navbar.jsx)
                └── Outlets (client/src/routes/Outlets.jsx)
                    │
                    ├── Route: "/" ──> Home (client/src/pages/Home.jsx)
                    │                    └── BgDecor (client/src/shared/BgDecor.jsx)
                    │
                    ├── Layout: <PublicOnlyRoute /> (client/src/components/AuthRoute.jsx)
                    │   ├── Route: "/signup" ──> SignUp (client/src/pages/SignUp.jsx)
                    │   │                          └── BgDecor
                    │   └── Route: "/login"  ──> Login (client/src/pages/Login.jsx)
                    │                              └── BgDecor
                    │
                    ├── Layout: <ProtectedRoute /> (client/src/components/AuthRoute.jsx)
                    │   ├── Route: "/Dashboard" ──> Dashboard (client/src/pages/Dashboard.jsx)
                    │   │                             └── BgDecor
                    │   ├── Route: "/Projects"  ──> Projects (client/src/pages/Projects.jsx)
                    │   │                             └── BgDecor
                    │   └── Route: "/project/:id" ──> Project (client/src/pages/Project.jsx)
                    │                                   ├── BgDecor
                    │                                   ├── LeftClickMenuProvider (client/src/contexts/leftClickMenuContext.jsx)
                    │                                   │   └── FolderStructure (Recursive) (client/src/components/FolderStructure.jsx)
                    │                                   │         └── FolderStructure (Child Sub-trees)
                    │                                   └── EditorPanel (Conditional: editorInfo.used) (client/src/components/EditorPanel.jsx)
                    │                                         ├── Tabs (client/src/components/Tabs.jsx)
                    │                                         └── Monaco Editor (@monaco-editor/react)
                    │
                    └── Route: "/Compiler" ──> Compiler (client/src/pages/Compiler.jsx)
                                                 ├── BgDecor
                                                 └── Monaco Editor (@monaco-editor/react)
```

---

## 2. Component Relationship & Prop Contract Matrix

| Component | Parent Component | Direct Children Rendered | Props Received | Contexts Consumed |
|:---|:---|:---|:---|:---|
| **`App`** | `BrowserRouter` | `AuthProvider`, `Navbar`, `Outlets` | None | None |
| **`Navbar`** | `App` | None | None | `authContext` (`useAuth`), `useLocation` |
| **`Outlets`** | `App` | `Route` definitions, `AuthRoute` guards | None | None |
| **`ProtectedRoute`** | `Outlets` | `<Outlet />` (Nested route pages) | None | `authContext` (`useAuth`) |
| **`PublicOnlyRoute`** | `Outlets` | `<Outlet />` (Nested route pages) | None | `authContext` (`useAuth`) |
| **`Home`** | `Outlets` | `BgDecor` | None | None |
| **`Login`** | `PublicOnlyRoute` | `BgDecor` | None | `authContext` (`useAuth`) |
| **`SignUp`** | `PublicOnlyRoute` | `BgDecor` | None | `authContext` (`useAuth`) |
| **`Dashboard`** | `ProtectedRoute` | `BgDecor` | None | `authContext` (`useAuth`) |
| **`Projects`** | `ProtectedRoute` | `BgDecor` | None | None |
| **`Project`** | `ProtectedRoute` | `BgDecor`, `LeftClickMenuProvider`, `FolderStructure`, `EditorPanel` | None | `EditorContext`, `tabsContext` (`useTabs`) |
| **`FolderStructure`** | `Project` or `FolderStructure` | `FolderStructure` (recursive), Context Menu | See Contract Below | `EditorContext`, `LeftClickMenuContext`, `tabsContext` (`useTabs`) |
| **`EditorPanel`** | `Project` | `Tabs`, Monaco `<Editor />` | `fileName`, `content`, `language` | None (Directly) |
| **`Tabs`** | `EditorPanel` | None | None | `tabsContext` (`useTabs`), `EditorContext` |
| **`Compiler`** | `Outlets` | `BgDecor`, Monaco `<Editor />` | None | None |

---

## 3. The `Project` $\leftrightarrow$ `FolderStructure` Prop Contract

In `client/src/pages/Project.jsx`, the root file explorer tree is rendered:

```jsx
<LeftClickMenuProvider>
  <FolderStructure
    fileExplorer={fileExplorer}
    handleInsertNode={handleInsertNode}
    handleRenameNode={handleRenameNode}
    handleDeleteNode={handleDeleteNode}
  />
</LeftClickMenuProvider>
```

### Prop Definitions:
* **`fileExplorer`** (`Object`): A node conforming to `FileTreeNodeSchema` (`id`, `name`, `type`, `children`, etc.).
* **`handleInsertNode(folderId, newNode)`** (`Function`): Callback updating `fileExplorer` by inserting `newNode` into `folderId`.
* **`handleRenameNode(nodeId, newName)`** (`Function`): Callback updating `fileExplorer` by renaming `nodeId`.
* **`handleDeleteNode(nodeId)`** (`Function`): Callback updating `fileExplorer` by pruning `nodeId`.

---

## 4. Recursive Tree Component Mechanics (`FolderStructure.jsx`)

`client/src/components/FolderStructure.jsx` is self-referential:

```jsx
{isFolder && fileExplorer.children && (
  <div className="border-l border-[#ede8ff] ml-3.5 pl-1 mt-1">
    {fileExplorer.children.map((item) => (
      <FolderStructure
        key={item.id}
        fileExplorer={item}
        handleInsertNode={handleInsertNode}
        handleRenameNode={handleRenameNode}
        handleDeleteNode={handleDeleteNode}
      />
    ))}
  </div>
)}
```

### Event Flow on File Click:
1. User clicks a file row: `onClick={handleClick}` (line 72).
2. `handleClick` constructs a tab descriptor:
   ```javascript
   const newTab = {
     id: fileExplorer.id,
     fileName: fileExplorer.name,
     content: fileExplorer.content,
     language: fileExplorer.language,
     used: true,
   };
   setEditorInfo(newTab);
   ```
3. Checks if tab is already in `tabsContext`:
   ```javascript
   if (!tabs.find((tab) => tab.id === fileExplorer.id)) {
     setTabs([...tabs, newTab]);
   }
   ```
4. `Project.jsx` observes `editorInfo.used === true` and conditionally mounts `EditorPanel`.

---

## 5. Monaco Editor Embedding & State Disconnect

`client/src/components/EditorPanel.jsx` receives the active file's initial snapshot:

```jsx
function EditorPanel({ fileName, content, language }) {
  const [code, setCode] = useState(content);

  useEffect(() => {
    setCode(content);
  }, [content]);

  const handleCodeChange = (value) => {
    setCode(value || "");
  };
  // ...
  return (
    <Editor
      value={code}
      language={language?.toLowerCase()}
      onChange={handleCodeChange}
      // ...
    />
  );
}
```

### The State Isolation Bug (FP-01):
* Keystrokes invoke `handleCodeChange`, which updates only `code` inside `EditorPanel`.
* `EditorPanel` **does not receive or call any callback** to push `value` back up to `EditorContext` or `Project.jsx`.
* When `Ctrl+S` is triggered, `Project.jsx` transmits its own state variable (`fileExplorer`), which still contains the original unedited file contents.

---

## Next Steps & References
* For state mapping and context ownership, see [08-state-and-data-flow.md](./08-state-and-data-flow.md).
* For the full failure register, see [09-debugging-playbook.md](./09-debugging-playbook.md).
