# 04 — Backend Architecture

This document describes the Express.js application architecture, request middleware chain, controller structure, Dockerode container execution interface, and error-handling mechanisms.

---

## 1. Server Lifecycle & Bootstrapping

The backend service is launched from `server/src/server.js`:

```javascript
import express, { json, urlencoded } from "express";
import chalk from "chalk";
import cors from "cors";
import dotenv from "dotenv";
import UserRouter from "./routes/UserRouter/UserRoutes.js";
import router from "./routes/routes.js";
import dbConnection from "./db/mongoConnect.js";
import dns from "dns";
import cookieParser from "cookie-parser";

dns.setServers(['8.8.8.8', '8.8.4.4']);
dotenv.config();
dbConnection();
const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(urlencoded({ extended: true }));
app.use(json());
app.use(cookieParser());
app.use("/", router);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(chalk.bgGreen(`server is running at port : ${PORT}`));
});
```

### Key Boot Characteristics:
1. **DNS Override**: `dns.setServers(['8.8.8.8', '8.8.4.4'])` forces the process to resolve external domains using Google DNS.
2. **MongoDB Connection**: `dbConnection()` connects asynchronously to `process.env.MONGO_URL`. Failures log to console but do not kill the server.
3. **Dead Import**: `UserRouter` is imported directly in `server.js` (line 5), but never used. Routing delegates to `router` (`./routes/routes.js`).

---

## 2. Request Processing Middleware Pipeline

Every HTTP request traverses four global middleware steps before route resolution:

```
[Incoming HTTP Request]
         │
         ▼
 1. cors({ origin: "http://localhost:5173", credentials: true })
         │ (Permits frontend origin and allows cookie exchanges)
         ▼
 2. express.urlencoded({ extended: true })
         │ (Parses URL-encoded form submissions)
         ▼
 3. express.json()
         │ (Parses JSON request bodies into req.body)
         ▼
 4. cookieParser()
         │ (Parses Cookie headers into req.cookies)
         ▼
 5. router ("/")
         │ (Delegates /user subpaths to UserRouter)
         ▼
 [Route-Specific Middleware & Controllers]
```

---

## 3. Routing Tree & Dispatch Architecture

Route dispatching is layered across two files:

```
server/src/server.js
  └── app.use("/", router)  [src/routes/routes.js]
        └── router.use("/user", UserRouter)  [src/routes/UserRouter/UserRoutes.js]
```

### Route Registration Table (`server/src/routes/UserRouter/UserRoutes.js`)

| HTTP Method | Route Subpath | Full Resolved Path | Middleware Chain | Handler Function | Purpose |
|:---|:---|:---|:---|:---|:---|
| `POST` | `/runCode` | `/user/runCode` | None | `codeExecution` | Compiles and executes code in Docker |
| `POST` | `/signup` | `/user/signup` | `validate(registerSchema)` $\rightarrow$ `register` | `postUserData` | Registers user & issues cookie |
| `POST` | `/login` | `/user/login` | `validate(LoginSchema)` | `login` | Validates credentials & issues cookie |
| `GET` | `/me` | `/user/me` | None | `authenticate` | Validates cookie & returns user profile |
| `GET` | `/project/:id` | `/user/project/:id`| None | `getProject` | Fetches project tree by ID |
| `POST` | `/project` | `/user/project` | None | `postProject` | Saves/updates project tree |
| `GET` | `/myProjects` | `/user/myProjects` | None | `getAllProjects` | Fetches user's project list |

---

## 4. Validation Engine (Zod Middleware)

Request body validation uses a higher-order middleware function defined in `server/src/middlewares/validate.js`:

```javascript
export const validate = (schema) => async (req, res, next) => {
  const result = await schema.safeParseAsync(req.body);
  if (!result.success) {
    const issueErrors = result.error.issues.map(e => ({
      field: e.path.join("."),
      message: e.message
    }));
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      errors: issueErrors
    });
  }
  req.body = result.data; // Replaces body with parsed and sanitized data
  next();
};
```

* On failure: Halts the request and emits HTTP 400 with structured field-level errors.
* On success: Overwrites `req.body` with sanitized, typed data from Zod.

---

## 5. Dockerode Code Execution Service (`codeRunner.js`)

The service layer in `server/src/services/codeRunner.js` manages Docker daemon communication:

### Socket Binding
```javascript
const docker = new Docker(
  process.platform === "win32"
    ? { socketPath: "//./pipe/docker_engine" } // Windows Named Pipe
    : { socketPath: "/var/run/docker.sock" }   // Linux / macOS Socket
);
```

### Container Lifecycle
```
1. Language Lookup:
   Find image ("ideas-cpp") and filename ("main.cpp") in imageMap and fileMap.
   
2. Temp File Setup:
   Create directory server/temp/<uuid>/
   Write sanitized code to server/temp/<uuid>/<filename>

3. Container Instantiation:
   docker.createContainer({
     Image: image,
     Tty: false,
     HostConfig: {
       Binds: [`${tempDir}:/code`],
       Memory: 256 * 1024 * 1024,
       CpuQuota: 50000,
       NetworkMode: "none",
       AutoRemove: false
     }
   })

4. Execution & Stream Demuxing:
   container.start()
   container.logs({ stdout: true, stderr: true, follow: true })
   container.modem.demuxStream(stream, stdoutBucket, stderrBucket)

5. Teardown:
   container.wait()
   container.remove()
   fs.rmSync(tempDir, { recursive: true, force: true })
   return { output: stdout, error: stderr }
```

---

## 6. Error Handling Strategy & Missing Global Catch Boundary

1. **Local Try/Catch Blocks**:
   All controller functions encapsulate logic in local `try/catch` statements, logging to console via `chalk.redBright(err)`.
2. **Missing Global Error Handler**:
   Express lacks a global four-parameter error middleware (`(err, req, res, next)`). Unhandled synchronous errors or uncaught promise rejections can crash the Node process.
3. **Dead Middleware (`addProject.js`)**:
   `server/src/middlewares/addProject.js` is 0 bytes. `postProject` performs JWT verification inline instead of delegating to dedicated middleware.

---

## Next Steps & References
* For the full API contract, see [05-api-reference.md](./05-api-reference.md).
* For database schema definitions, see [06-database-schema.md](./06-database-schema.md).
* For execution engine feature trace, see [features/code-execution-engine.md](./features/code-execution-engine.md).
