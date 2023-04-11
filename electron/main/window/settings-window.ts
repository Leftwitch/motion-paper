import { app, dialog, screen } from "electron";
import { BrowserWindow } from "electron-acrylic-window";
import { join } from "node:path";
import path from "path";
import { config } from "..";
//@ts-ignore
import { registry } from "windows";

const browserUrl = process.env.VITE_DEV_SERVER_URL;
const preload = join(__dirname, "../preload/index.js");

export class SettingsWindow {
  private _initialized = false;
  public window: BrowserWindow | null = null;
  private _windowsRegistryCache: any = null;

  initialize() {
    if (this._initialized) {
      throw new Error("Window already initialized");
    }
    this.createBrowserWindow();
    this.registerIPCHandlers();
    this.window?.focus();
    this._initialized = true;
    const emitUpdateEvent = () =>
      this.window?.webContents.send("screens-change", {});

    //TODO UNREGISTER
    screen.on("display-added", () => emitUpdateEvent());
    screen.on("display-removed", () => emitUpdateEvent());
    config.on("update", () => emitUpdateEvent());

    setInterval(() => this.updateRegistryCache(), 100);
  }

  registerIPCHandlers() {
    this.window?.webContents.ipc.handle("window-mode", (event) => {
      return "settings";
    });

    this.window?.webContents.ipc.handle("get-registry", (event) => {
      return this._windowsRegistryCache;
    });

    this.window?.webContents.ipc.handle(
      "update-registry",
      (event, key, value) => {
        const reg = registry(
          "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize",
        );
        reg.remove(key);
        reg.add(key, value);
      },
    );
    this.window?.webContents.ipc.handle("get-screens", (event) => {
      const screens = screen.getAllDisplays();
      return screens.map((screen) => ({
        screen,
        wallpaper: config.getConfigForDisplay(screen)?.wallpaperSettings,
      }));
    });

    this.window?.webContents.ipc.handle("set-wallpaper", (event, displayId) => {
      this.selectNewWallpaper(displayId);
    });
  }

  updateRegistryCache() {
    if (!this.window?.isVisible()) return;
    const reg = registry(
      "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize",
    );

    if (JSON.stringify(this._windowsRegistryCache) != JSON.stringify(reg)) {
      console.log("CHANGE EVNT");
      this._windowsRegistryCache = reg;
      console.log(reg);
      this.window?.webContents.send(
        "registry-change",
        reg,
      );
    }
  }

  createBrowserWindow() {
    this.window = new BrowserWindow({
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
      show: false,
      vibrancy: {
        theme: "#21001E63",
        effect: "acrylic",
        useCustomWindowRefreshMethod: true,
        maximumRefreshRate: 60,
      },
    });
    this.window.on("close", (evt) => {
      evt.preventDefault();
      this.window?.hide();
    });

    if (browserUrl) {
      console.log(browserUrl);
      this.window.loadURL(browserUrl);
      this.window.webContents.openDevTools();
    } else {
      this.window.loadFile("dist/index.html");
    }
  }

  async selectNewWallpaper(displayId: number) {
    if (!this.window) return;
    const imageExtensions = ["jpg", "png", "gif", "svg"];
    const videoExtensions = ["mkv", "avi", "mp4", "webm"];
    const splineExtensions = ["splinecode"];
    const filePickerResult = await dialog.showOpenDialog({
      title: "Select Wallpaper",
      filters: [
        {
          name: "Wallpapers",
          extensions: [
            ...imageExtensions,
            ...videoExtensions,
            ...splineExtensions,
          ],
        },
      ],
    });

    if (filePickerResult.canceled) return;
    const display = screen.getAllDisplays().find((e) => e.id == displayId);
    if (!display) return;

    const file = filePickerResult.filePaths[0];
    const ext = path.extname(file).toLowerCase().slice(1);

    if (imageExtensions.includes(ext)) {
      config.setConfigForDisplay(display, {
        wallpaperSettings: {
          type: "IMAGE",
          source: {
            path: file,
          },
        },
      });
    } else if (videoExtensions.includes(ext)) {
      config.setConfigForDisplay(display, {
        wallpaperSettings: {
          type: "VIDEO",
          source: {
            path: file,
            speed: 1,
          },
        },
      });
    } else if (splineExtensions.includes(ext)) {
      config.setConfigForDisplay(display, {
        wallpaperSettings: {
          type: "SPLINE",
          source: {
            splineCodeUrl: file,
          },
        },
      });
    } else {
      throw Error("Unknown Wallpaper type: " + ext);
    }
  }
}
