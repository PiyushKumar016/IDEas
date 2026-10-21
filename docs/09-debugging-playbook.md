# 09 — Debugging Playbook & Failure-Point Register

This document serves as the master diagnostic manual for IDEas Online IDE, cataloging confirmed bugs, potential risks, and step-by-step troubleshooting playbooks.

---

## 1. Master Failure-Point Register

| ID | Feature Area | Layer | File & Line Reference | Severity | Defect Description | Expected Symptom |
|:---|:---|:---|:---|:---|:---|:---|
| **FP-01** | Workspace Save | Frontend State | `EditorPanel.jsx:14-23`<br/>`Project.jsx:94-106` | **High** | Live Monaco edits remain in `EditorPanel` local state; `Ctrl+S` submits stale `fileExplorer` tree. | Typed code vanishes upon browser refresh or tab switch. |
| **FP-02** | Registration | Navigation | `SignUp.jsx:34` | **High** | `navigate('/dashboard')` called without importing or defining `useNavigate`. | Unhandled `ReferenceError: navigate is not defined` crashes signup completion. |
| **FP-03** | Registration | Error Handling | `SignUp.jsx:31` | **Medium** | `await postUser(mainData)` lacks `try...catch`; Axios throws on 400/409 responses. | Unhandled promise rejection; duplicate email or validation error banners never show. |
| **FP-04** | Compiler Execution | Response Parsing | `Compiler.jsx:76-80` | **High** | Checks `opt.error` instead of `opt.data.error`; `opt.error` is always undefined. | Compilation errors, syntax errors, and timeouts are silenced; terminal displays empty string. |
| **FP-05** | Compiler Execution | Async State | `Compiler.jsx:64-83` | **Medium** | `sendCodeToExecution` lacks `try...catch`; `setLoading(false)` never executes on failure. | "Run Code" button freezes permanently in "Running..." state with spinner on network failure. |
| **FP-06** | Compiler Execution | Service Config | `Compiler.jsx:57`<br/>`codeRunner.js:16-28` | **Medium** | "c" is listed in frontend languages array, but missing from backend `imageMap` and `fileMap`. | Running C code returns `"Language 'c' supported nahi hai"` (which is then swallowed by FP-04). |
| **FP-07** | Project Security | Authorization | `userController.js:183` | **High** | `Project.updateOne({"owner": req.body.id})` does not verify if requesting user owns the project. | Any authenticated user can overwrite any project document by supplying its UUID in payload. |
| **FP-08** | Project Security | Authentication | `UserRoutes.js:11`<br/>`userController.js:146`| **Medium** | `GET /user/project/:id` has no authentication middleware or token verification. | Unauthenticated visitors can read private project source code knowing the UUID. |
| **FP-09** | Route Redirection| Routing | `AuthRoute.jsx:12`<br/>`Outlets.jsx:14` | **Low** | `PublicOnlyRoute` redirects to lowercase `/dashboard`, but route is registered as `/Dashboard`. | Potential 404 navigation error depending on environment casing rules. |
| **FP-10** | Project Creation | Event Handling | `Projects.jsx:43-50` | **Low** | `postProject()` is called before `if (!newProjectName.trim()) return` check. | Whitespace-only project submissions create phantom `"IDEas Project"` documents in DB. |
| **FP-11** | Backend Logic | Model Query | `userController.js:229` | **Low** | Checks `projects.matchedCount === 0` on a JavaScript Array (property is undefined). | Dead logic branch; empty projects return 200 `projects: []` instead of intended 400. |
| **FP-12** | Workspace Explorer| UI Component | `Project.jsx:221-256` | **Low** | Top "New File" and "New Folder" icon buttons in Explorer sidebar have no `onClick` handlers. | Clicking top-level explorer toolbar buttons does nothing. |
| **FP-13** | Sandboxing | Container Engine | `codeRunner.js:73-87` | **Medium** | Node server waits indefinitely on `container.wait()` without host-level timeout guard. | Potential worker thread lockup if container fails to exit cleanly. |
| **FP-14** | Temp File Storage| File System | `server/temp/` | **Low** | Failed container runs leave behind submission directories containing `main.js`. | Host storage disk space accumulation over time. |

---

## 2. Playbook 1: Project Edits Not Persisting (FP-01)

### Symptoms
User edits a file in the workspace, presses `Ctrl+S`, sees the success log `"project saved successfully"`, but reloading the page reverts the file to its empty or initial boilerplate state.

### Diagnostic Steps
1. Open Chrome DevTools $\rightarrow$ **Network** tab.
2. In the workspace, type distinctive text into an active file (e.g., `// VERIFICATION_TEST_STRING`).
3. Press `Ctrl+S`.
4. Inspect the outgoing `POST /user/project` request payload:
   - Expand `rootNode` $\rightarrow$ `children`.
   - Find the modified file node and inspect its `content` field.
   - **Observed Bug**: The `content` string remains empty or matches initial boilerplate; `// VERIFICATION_TEST_STRING` is completely missing.
5. Inspect the React component state using React DevTools:
   - Check `EditorPanel` local state: `code` contains `// VERIFICATION_TEST_STRING`.
   - Check `Project` state: `fileExplorer.children[...].content` is empty.

### Recommended Fix Direction
Lift the code buffer state:
- Pass an `onCodeChange(fileId, newContent)` callback from `Project.jsx` through `EditorPanel.jsx`.
- When Monaco emits `onChange`, update the `fileExplorer` tree immutably or maintain a live buffer map in `EditorContext`.

---

## 3. Playbook 2: Signup Failure & Runtime Crash (FP-02, FP-03)

### Symptoms
Clicking "Create your account" on `/signup` causes the button to become unresponsive, nothing happens, and the user is never redirected to the dashboard.

### Diagnostic Steps
1. Open DevTools **Console** and **Network** tabs.
2. Fill out valid signup details and click submit.
3. Check **Network**: Observe `POST /user/signup` succeeds with `200 OK` and returns `Set-Cookie: accessToken`.
4. Check **Console**: Observe unhandled exception:
   ```
   Uncaught ReferenceError: navigate is not defined at onSubmit (SignUp.jsx:34)
   ```
5. Test duplicate registration: Enter an existing email and submit:
   - Observe **Network**: Returns `409 Conflict`.
   - Observe **Console**: `Uncaught (in promise) AxiosError: Request failed with status code 409`.
   - Observe **UI**: `setBackendErrors` is never called, so no error message is displayed.

### Recommended Fix Direction
In `client/src/pages/SignUp.jsx`:
1. Import `useNavigate` from `react-router-dom`: `const navigate = useNavigate();`.
2. Wrap `await postUser(mainData)` in a `try...catch` block, reading `err.response?.data?.message` into `setBackendErrors`.

---

## 4. Playbook 3: Compiler Response Silencing & Infinite Spinner (FP-04, FP-05)

### Symptoms
Running code with deliberate syntax errors produces an empty output panel instead of compiler errors. If the backend fails or is stopped, the "Run Code" button becomes stuck in "Running..." forever.

### Diagnostic Steps
1. Navigate to `/Compiler`.
2. Introduce a syntax error in C++ (e.g., delete a semicolon or write `invalid_command;`).
3. Click "Run Code".
4. Open DevTools **Network** tab $\rightarrow$ inspect `POST /user/runCode`:
   - Response payload:
     ```json
     {
       "output": "",
       "error": "main.cpp: In function 'int main()':\nmain.cpp:5:5: error: 'invalid_command' was not declared..."
     }
     ```
5. Check Terminal UI: Terminal is blank or displays `""`.
6. Inspect `Compiler.jsx:76`:
   ```javascript
   const opt = await codeExecute(data);
   if (opt.error) {       // <-- opt is Axios response; opt.error is undefined!
     setOutput(opt.data.error);
   } else {
     setOutput(opt.data.output); // <-- Always executes!
   }
   ```

### Recommended Fix Direction
In `client/src/pages/Compiler.jsx`:
1. Update parsing:
   ```javascript
   try {
     const res = await codeExecute(data);
     if (res.data.error) {
       setOutput(res.data.error);
     } else {
       setOutput(res.data.output);
     }
   } catch (err) {
     setOutput(err.response?.data?.error || "Execution failed");
   } finally {
     setLoading(false);
   }
   ```

---

## 5. Playbook 4: Security Vulnerabilities (FP-07, FP-08)

### Horizontal Privilege Escalation Test (FP-07)
1. User A creates a project with ID `PROJ_UUID_A`.
2. User B logs in, capturing their own valid `accessToken` cookie.
3. User B sends a manual HTTP request:
   ```http
   POST /user/project HTTP/1.1
   Host: localhost:8181
   Cookie: accessToken=<User_B_Token>
   Content-Type: application/json

   {
     "id": "PROJ_UUID_A",
     "name": "Overwritten Project",
     "type": "folder",
     "children": []
   }
   ```
4. **Observed Bug**: Server returns `200 OK` and updates User A's project document with User B's payload.

### Unauthenticated Project Read Test (FP-08)
1. Open an incognito browser window (no auth cookies).
2. Execute a direct GET request via curl or browser:
   ```bash
   curl http://localhost:8181/user/project/PROJ_UUID_A
   ```
3. **Observed Bug**: Server returns `200 OK` containing User A's complete source code tree without checking authentication.

---

## 6. Non-Destructive Diagnostic Checklist

Run this quick health check when validating a running instance:

* [ ] **Backend Health**: Send `GET http://localhost:8181/user/me` without cookies; confirm it returns `401 {"success": false, "message": "unauthorized"}`.
* [ ] **Frontend Loading**: Verify `/` loads without console errors.
* [ ] **Compiler Execution**: Run boilerplate Python (`print("Welcome...")`); verify terminal displays output.
* [ ] **C Language Check**: Select "c" in Compiler; confirm network call reveals missing backend runner (`Language 'c' supported nahi hai`).
* [ ] **Docker Engine**: Check running containers via `docker ps`; verify no zombie containers remain after execution runs.
* [ ] **Temp Storage**: Check `server/temp/`; verify no leftover directories accumulate after successful executions.

---

## Next Steps & References
* For complete feature traces, see [features/project-workspace.md](./features/project-workspace.md) and [features/code-execution-engine.md](./features/code-execution-engine.md).
