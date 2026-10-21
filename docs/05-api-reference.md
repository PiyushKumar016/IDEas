# 05 — REST API Reference

All backend API routes are prefixed by the base URL:
```
http://localhost:8181/user
```

Requests from the frontend Axios client (`client/src/API/userAPI.js`) include `withCredentials: true`, transmitting HTTP-only cookies across origins.

---

## 1. Authentication & Session Endpoints

### `POST /user/signup`
Registers a new user account, creates a MongoDB user record, signs a JWT, and returns an `accessToken` cookie.

* **Middleware Chain**: `validate(registerSchema)` $\rightarrow$ `register`
* **Headers**: `Content-Type: application/json`
* **Request Body**:
  ```json
  {
    "username": "coder123",
    "email": "coder@example.com",
    "password": "Password123!"
  }
  ```
* **Success Response (200 OK)**:
  * **Headers**: `Set-Cookie: accessToken=<jwt>; HttpOnly; Secure; SameSite=Lax`
  * **Body**:
    ```json
    {
      "success": true,
      "message": "Login successful"
    }
    ```
* **Failure Responses**:
  * `400 Bad Request`: Validation failure on username, email, or password complexity.
  * `409 Conflict`: User already exists with submitted email:
    ```json
    {
      "success": false,
      "message": "User already exists with this email."
    }
    ```
  * `500 Internal Server Error`: Server failure during hashing or database save.

---

### `POST /user/login`
Validates user credentials, generates a new JWT token, and issues the `accessToken` cookie.

* **Middleware Chain**: `validate(LoginSchema)`
* **Headers**: `Content-Type: application/json`
* **Request Body**:
  ```json
  {
    "email": "coder@example.com",
    "password": "Password123!"
  }
  ```
* **Success Response (200 OK)**:
  * **Headers**: `Set-Cookie: accessToken=<jwt>; HttpOnly; Secure; SameSite=Lax`
  * **Body**:
    ```json
    {
      "success": true
    }
    ```
* **Failure Responses**:
  * `400 Bad Request`: Invalid email format or empty password.
  * `401 Unauthorized`: User not found or incorrect password:
    ```json
    {
      "success": false,
      "message": "invalid credentials"
    }
    ```

---

### `GET /user/me`
Resolves the currently authenticated user's profile from the session cookie.

* **Middleware Chain**: None (Token verification handled directly inside `authenticate` controller)
* **Cookies Required**: `accessToken=<jwt>`
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "user": {
      "email": "coder@example.com",
      "username": "coder123"
    }
  }
  ```
* **Failure Responses**:
  * `401 Unauthorized`: Token missing or signature invalid:
    ```json
    {
      "success": false,
      "message": "unauthorized"
    }
    ```
  * `404 Not Found`: Token valid, but user ID no longer exists in MongoDB.

---

## 2. Project Workspace Endpoints

### `GET /user/project/:id`
Retrieves a project document and its complete recursive file tree by project UUID.

* **Middleware Chain**: None
* **Authentication**: **Unprotected / No Auth Check** (FP-08)
* **Path Parameters**:
  - `id`: The unique string identifier of the project (e.g., UUID).
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "project": {
      "_id": "60d5ec49f1b2c8b1f8e4e1a1",
      "owner": "c2b64ef9-73ef-4e3a-96e0-82a939fbc88b",
      "rootNode": {
        "id": "c2b64ef9-73ef-4e3a-96e0-82a939fbc88b",
        "name": "My Project",
        "type": "folder",
        "theme": "#7c3aed",
        "children": [
          {
            "id": "file-1",
            "name": "main.js",
            "type": "file",
            "language": "javascript",
            "content": "console.log('hello');",
            "children": []
          }
        ]
      },
      "createdAt": "2026-06-30T15:20:00.000Z",
      "updatedAt": "2026-06-30T15:20:00.000Z"
    }
  }
  ```
* **Failure Response (200 OK with success: false)**:
  ```json
  {
    "success": false,
    "message": "project not found"
  }
  ```

---

### `POST /user/project`
Creates or updates a project's `rootNode` file tree in MongoDB and associates the project ID with the authenticated user.

* **Middleware Chain**: None (JWT verified inline)
* **Cookies Required**: `accessToken=<jwt>`
* **Request Body**: The root `FileTreeNode` object representing the project:
  ```json
  {
    "id": "c2b64ef9-73ef-4e3a-96e0-82a939fbc88b",
    "name": "My Project",
    "type": "folder",
    "theme": "#7c3aed",
    "children": []
  }
  ```
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "project saved successfully"
  }
  ```
* **Failure Responses**:
  * `401 Unauthorized`: Missing or invalid `accessToken` cookie.
  * `200 OK with success: false`:
    ```json
    {
      "success": false,
      "message": "something went wrong"
    }
    ```

> [!CAUTION]
> **FP-07: Missing Authorization on Project Update**
> The server runs `Project.updateOne({"owner": req.body.id}, {$set: {rootNode: req.body}})`. It does not check whether the requesting user actually created that project. Any authenticated user can overwrite any project document by supplying its UUID in `id`.

---

### `GET /user/myProjects`
Retrieves all projects owned by the currently authenticated user.

* **Middleware Chain**: None (JWT verified inline)
* **Cookies Required**: `accessToken=<jwt>`
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "projects": [
      {
        "_id": "60d5ec49f1b2c8b1f8e4e1a1",
        "owner": "c2b64ef9-73ef-4e3a-96e0-82a939fbc88b",
        "rootNode": {
          "id": "c2b64ef9-73ef-4e3a-96e0-82a939fbc88b",
          "name": "Algorithm Workspace",
          "type": "folder",
          "theme": "#7c3aed"
        }
      }
    ]
  }
  ```
* **Failure Responses**:
  * `401 Unauthorized`: Missing or invalid `accessToken` cookie.
  * `400 Bad Request`: Database read failure or exception.

---

## 3. Code Execution Endpoints

### `POST /user/runCode`
Dispatches code to an isolated Docker container for compilation and execution.

* **Middleware Chain**: None
* **Authentication**: **Public / No Auth Required**
* **Request Body**:
  ```json
  {
    "code": "print('Hello, IDEas!')",
    "language": "python"
  }
  ```
* **Validation Rules**:
  - `code` and `language` must both be present.
  - `code.length` must be $\le 50000$ characters.
* **Success Response (200 OK)**:
  ```json
  {
    "output": "Hello, IDEas!\n",
    "error": ""
  }
  ```
  *(If compilation/runtime fails, compiler stderr is placed in `error` and exit stdout in `output`)*.
* **Failure Responses**:
  * `400 Bad Request`: Missing parameters (`"code aur language dono chahiye"`) or payload exceeded 50KB (`"Code bahut bada hai (max 50KB)"`).
  * `500 Internal Server Error`: Host Docker socket failure, timeout, or container spawn exception:
    ```json
    {
      "error": "Server error: <details>"
    }
    ```

---

## Next Steps & References
* For database schema representations of these bodies, see [06-database-schema.md](./06-database-schema.md).
* For complete feature traces, see [features/auth-and-session.md](./features/auth-and-session.md) and [features/code-execution-engine.md](./features/code-execution-engine.md).
