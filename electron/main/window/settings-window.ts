import { app, screen } from "electron";
import { BrowserWindow } from "electron-acrylic-window";
import { join } from "node:path";
import { promisified as regedit, RegistryItemValue } from "regedit";

const browserUrl = process.env.VITE_DEV_SERVER_URL;
const preload = join(__dirname, "../preload/index.js");

export class SettingsWindow {
  private _initialized = false;
  private _window: BrowserWindow | null = null;
  private windowsRegistryCache?: { [key: string]: RegistryItemValue };

  initialize() {
    if (this._initialized) {
      throw new Error("Window already initialized");
    }
    this.createBrowserWindow();
    this.registerIPCHandlers();
    this._window?.focus();
    this._initialized = true;
    const emitUpdateEvent = () =>
      this._window?.webContents.send("screens-change", {});

    //TODO UNREGISTER
    screen.on("display-added", () => emitUpdateEvent());
    screen.on("display-removed", () => emitUpdateEvent());
    setInterval(() => this.updateRegistryCache(), 100);
  }

  registerIPCHandlers() {
    this._window?.webContents.ipc.handle("window-mode", (event) => {
      return "settings";
    });

    this._window?.webContents.ipc.handle("get-registry", (event) => {
      return this.windowsRegistryCache;
    });

    this._window?.webContents.ipc.handle("update-registry", (event, data) => {
      regedit.putValue({
        "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize":
          {
            ...data,
          },
      });
    });
    this._window?.webContents.ipc.handle("get-screens", (event) => {
      const screens = screen.getAllDisplays();
      return screens.map((screen) => ({
        screen,
        wallpaper: {
          type: "VIDEO",
          source: { path: "C:\\Users\\justi\\Downloads\\tunnel-27438.mp4" },
        },
      }));
    });
  }

  updateRegistryCache() {
    regedit.list([
      "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize",
    ]).then((rs) => {
      const values = Object.values(rs)[0].values;
      if (JSON.stringify(this.windowsRegistryCache) != JSON.stringify(values)) {
        console.log("CHANGE EVNT");
        this.windowsRegistryCache = values;
        this._window?.webContents.send(
          "registry-change",
          values,
        );
      }
    });
  }

  createBrowserWindow() {
    this._window = new BrowserWindow({
      title: app.getName() + "- Window",
      icon: join(process.env.PUBLIC, "favicon.ico"),
      webPreferences: {
        preload,
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
