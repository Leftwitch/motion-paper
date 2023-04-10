import { app } from "electron";
import { BrowserWindow } from "electron-acrylic-window";
import { join } from "node:path";

const browserUrl = process.env.VITE_DEV_SERVER_URL;
const preload = join(__dirname, "../preload/index.js");

export class ApplicationWindow {
  private _initialized = false;
  private _window: BrowserWindow | null = null;

  initialize() {
    if (this._initialized) {
      throw new Error("Window already initialized");
    }
    this.createBrowserWindow();
    this.registerWindowModeHandler();
    this._window?.focus();
    this._initialized = true;
  }

  registerWindowModeHandler() {
    this._window?.webContents.ipc.handle("window-mode", (event) => {
      return "settings";
    });
  }
  createBrowserWindow() {
    this._window = new BrowserWindow({
      title: app.getName() + "- Window",
      icon: join(process.env.PUBLIC, "favicon.ico"),
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        webSecurity: false,
      },
      width: 1280,
      height: 720,
      vibrancy: {
        theme: "#21001E63",
        effect: "acrylic",
        useCustomWindowRefreshMethod: true,
        maximumRefreshRate: 60,
      },
    });
    this._window.removeMenu();

    if (browserUrl) {
      console.log(browserUrl);
      this._window.loadURL(browserUrl);
    } else {
      //TODO index.html loading
    }
    this._window.webContents.openDevTools();
  }
}
