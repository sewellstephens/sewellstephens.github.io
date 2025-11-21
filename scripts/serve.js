import { exec } from "child_process";
import express from "express";
import { WebSocketServer } from "ws";
import chokidar from "chokidar";
import path from "path";
import fs from "fs";

process.env.NODE_ENV = "development";
const DIST = ".";
const PORT = 8080;
const RELOAD_PORT = 35729;

// -----------------------
// 1. WebSocket live-reload server
// -----------------------
const wss = new WebSocketServer({ port: RELOAD_PORT });

wss.on("connection", () => {
  console.log("🔌 LiveReload: client connected");
});

function reloadClients() {
  console.log("🔁 Sending reload to clients...");
  wss.clients.forEach((client) => client.send("reload"));
}

// -----------------------
// 2. Express HTTP server
// -----------------------
const app = express();

// Clean URL middleware
app.use((req, res, next) => {
    const reqPath = req.path;
  
    // ex: "./blog/post/index.html"
    const folderIndex = path.join(DIST, reqPath, "index.html");
    if (fs.existsSync(folderIndex)) {
      return res.sendFile(folderIndex, { root: process.cwd() });
    }
  
    // ex: "./blog/post.html"
    const htmlFallback = path.join(DIST, reqPath + ".html");
    if (fs.existsSync(htmlFallback)) {
      return res.sendFile(htmlFallback, { root: process.cwd() });
    }
  
    next();
});  

// Static files after clean URL resolving
app.use(express.static(DIST));

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

// -----------------------
// 3. Watcher: rebuild + reload
// -----------------------
const watcher = chokidar.watch(["./src", "./site-assets"], {
  ignoreInitial: true,
});

watcher.on("all", async (event, filePath) => {
  console.log(`📝 Change detected: ${filePath}`);
  console.log("Rebuilding...");

  exec("node ./scripts/build.js", (err) => {
    if (err) console.error("❌ Build error:", err);
    else reloadClients();
  });
});
