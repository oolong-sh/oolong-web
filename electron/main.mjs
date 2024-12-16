import { app, BrowserWindow } from "electron";
import path from "path";
import url, { fileURLToPath } from "url";
import process from "process";

// Fix __dirname not defined issue in mjs
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {BrowserWindow?} */
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  const startUrl = app.isPackaged
    ? url.format({
        pathname: path.join(__dirname, "../index.html"),
        protocol: "file:",
        slashes: true,
      })
    : process.env["ELECTRON_RENDERER_URL"];

  mainWindow.loadURL(startUrl);
  mainWindow.on("closed", () => (mainWindow = null));
}

app.whenReady().then(() => {
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow == null) {
    createWindow();
  }
});
