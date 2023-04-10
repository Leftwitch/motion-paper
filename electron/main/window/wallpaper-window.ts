import { app, BrowserWindow, Display, screen } from "electron";
import {
  attach as attachBackground,
  refresh as refreshBackground,
} from "electron-as-wallpaper";
import mouseEvents from "global-mouse-events";
import { join } from "node:path";
import { config } from "..";
import { Wallpaper } from "../types/wallpaper";

const browserUrl = process.env.VITE_DEV_SERVER_URL;
const preload = join(__dirname, "../preload/index.js");

export class WallpaperWindow {
  private _initialized = false;
  private _window: BrowserWindow | null = null;
  private _wallpaper: Wallpaper | null = null;

  constructor(
    public readonly display: Display,
  ) {}

  initialize() {
    if (this._initialized) {
      throw new Error("Window already initialized");
    }

    this.reloadFromConfig();
    this.hookConfigEvents();
    this.createBrowserWindow();
    this.registerIPCHandlers();
    this.hookMouseEvents();

    this._initialized = true;
  }

  hookMouseEvents() {
    mouseEvents.on("mousemove", (data) => {
      const currentScreen = screen.getDisplayNearestPoint(data);
      if (currentScreen.id != this.display.id) return;

      const { bounds } = currentScreen;

      // Calculate the relative coordinates by subtracting the screen's top-left corner
      const relativeX = data.x - bounds.x;
      const relativeY = data.y - bounds.y;

      this._window?.webContents.sendInputEvent({
        type: "mouseMove",
        x: relativeX,
        y: relativeY,
      });
    });
  }

  destroy() {
    this._window?.destroy();
    config.removeListener("update", this.reloadFromConfig);
    refreshBackground();
  }

  hookConfigEvents() {
    config.on("update", this.reloadFromConfig.bind(this));
  }

  createBrowserWindow() {
    this._window = new BrowserWindow({
      title: app.getName() + "- Window",
      icon: join(process.env.PUBLIC, "favicon.ico"),
      enableLargerThanScreen: true,
      autoHideMenuBar: true,
      frame: false,
      show: false,
      webPreferences: {
        preload,
        backgroundThrottling: false,
        nodeIntegration: true,
        webSecurity: false,
        contextIsolation: false,
      },
    });

    attachBackground(this._window);
    this.updateBounds(false);

    if (browserUrl) {
      console.log(browserUrl);
      this._window.loadURL(browserUrl).then(() => this._window?.show());
      this._window.webContents.openDevTools();
    } else {
      this._window.loadFile(join(process.env.DIST, "index.html"));
    }
  }

  registerIPCHandlers() {
    this._window?.webContents.ipc.handle("window-mode", (data) => {
      return "wallpaper";
    });

    this._window?.webContents.ipc.handle(
      "get-wallpaper",
      () => this.getWallpaper(),
    );
  }

  reloadFromConfig() {
    const wallpaper =
      config.getConfigForDisplay(this.display)?.wallpaperSettings ?? null;

    if (JSON.stringify(wallpaper) != JSON.stringify(this._wallpaper)) {
      console.log("Set wallpaper to");
      console.log(wallpaper);
      this._wallpaper = wallpaper;
      this._window?.webContents.send("wallpaper-changed", wallpaper);
    }
  }

  getWallpaper() {
    return this._wallpaper;
  }

  updateBounds(checkDestroy = true) {
    if (this._window?.isDestroyed && checkDestroy) return;
    this._window?.setBounds(this.display.bounds);
  }
}
