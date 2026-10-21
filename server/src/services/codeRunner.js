import Docker from "dockerode";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { PassThrough } from "stream";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const docker = new Docker(
  process.platform === "win32"
    ? { socketPath: "//./pipe/docker_engine" } // Windows
    : { socketPath: "/var/run/docker.sock" }, // Linux/Mac
);

const imageMap = {
  cpp: "ideas-cpp",
  python: "ideas-python",
  java: "ideas-java",
  javascript: "ideas-node",
};

const fileMap = {
  cpp: "main.cpp",
  python: "main.py",
  java: "Main.java",
  javascript: "main.js",
};

function collectOutput(container) {
  return new Promise((resolve, reject) => {
    container.logs(
      { stdout: true, stderr: true, follow: true },
      (err, stream) => {
        if (err) return reject(err);

        let stdout = "";
        let stderr = "";

        const stdoutBucket = new PassThrough();
        const stderrBucket = new PassThrough();
        container.modem.demuxStream(stream, stdoutBucket, stderrBucket);

        stdoutBucket.on("data", (chunk) => (stdout += chunk.toString()));
        stderrBucket.on("data", (chunk) => (stderr += chunk.toString()));

        stream.on("end", () =>
          resolve({ stdout: stdout.trim(), stderr: stderr.trim() }),
        );
        stream.on("error", reject);
      },
    );
  });
}

const codeRunner = async (rawCode, language) => {
  const code =  rawCode.replace(/\r\n/g, '\n');
  const image = imageMap[language];
  const filename = fileMap[language];

  if (!image) {
    return { output: "", error: `Language '${language}' supported nahi hai` };
  }

  const submissionId = uuidv4();
  const tempDir = path.join(__dirname, "../../temp", submissionId);
  fs.mkdirSync(tempDir, { recursive: true });
  fs.writeFileSync(path.join(tempDir, filename), code);

  let container;

  try {
    container = await docker.createContainer({
      Image: image,
      Tty: false,
      HostConfig: {
        Binds: [`${tempDir}:/code`],
        Memory: 256 * 1024 * 1024,
        CpuQuota: 50000,
        NetworkMode: "none",
        AutoRemove: false,
      },
    });

    await container.start();
    const result = await collectOutput(container);
    const exitData = await container.wait();

    await container.remove();
    fs.rmSync(tempDir, { recursive: true, force: true });

    return {
      output: result.stdout,
      error: result.stderr,
    };
  } catch (err) {
    fs.rmSync(tempDir, { recursive: true, force: true });
    if (container) await container.remove().catch(() => {});

    return { output: "", error: err.message };
  }
};

export default codeRunner;
