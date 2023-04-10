import {
  app,
  BrowserWindow,
  Display,
  ipcMain,
  IpcMainEvent,
  screen,
} from "electron";
import {
  attach as attachBackground,
  refresh as refreshBackground,
} from "electron-as-wallpaper";
import mouseEvents from "global-mouse-events";
import { join } from "node:path";
import { Wallpaper } from "../types/wallpaper";

const browserUrl = process.env.VITE_DEV_SERVER_URL;
const preload = join(__dirname, "../preload/index.js");

export class WallpaperWindow {
  private _initialized = false;
  private _displayedWallpaper: Wallpaper | null = null;
  private _window: BrowserWindow | null = null;

  constructor(
    private readonly _display: Display,
  ) {}

  initialize() {
    if (this._initialized) {
      throw new Error("Window already initialized");
    }

    screen.addListener(
      "display-metrics-changed",
      this.metricChanged.bind(this),
    );
    screen.addListener("display-removed", this.displayRemoved.bind(this));
    this.createBrowserWindow();
    this.registerWindowModeHandler();

    mouseEvents.on("mousemove", (data) => {
      const { x, y } = data;

      const currentScreen = screen.getDisplayNearestPoint({
        x,
        y,
      });

      if (currentScreen.id != this._display.id) return;
      const { bounds } = currentScreen;

      // Calculate the relative coordinates by subtracting the screen's top-left corner
      const relativeX = x - bounds.x;
      const relativeY = y - bounds.y;

      this._window?.webContents.sendInputEvent({
        type: "mouseMove",
        x: relativeX,
        y: relativeY,
      });
    });

    this._initialized = true;
  }

  destroy() {
    screen.removeListener("display-metrics-changed", this.metricChanged);
    screen.removeListener("display-removed", this.displayRemoved);
    refreshBackground();
  }

  createBrowserWindow() {
    refreshBackground();
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

    this._window.addListener("closed", this.destroy.bind(this));
    attachBackground(this._window);
    this.updateBounds(false);

    if (browserUrl) {
      console.log(browserUrl);
      this._window.loadURL(browserUrl);
    } else {
      //TODO index.html loading
    }
    this._window.webContents.openDevTools();
  }

  registerWindowModeHandler() {
    this._window?.webContents.ipc.handle("window-mode", (data) => {
      return "wallpaper";
    });
  }

  displayRemoved(_: Event, display: Display) {
    if (display.id == this._display.id) {
      this._window?.destroy();
    }
  }

  metricChanged() {
    this.updateBounds();
  }

  updateBounds(checkDestroy = true) {
    if (this._window?.isDestroyed && checkDestroy) return;
    this._window?.setBounds(this._display.bounds);
  }

  setWallpaper(wallpaper?: Wallpaper | null) {
    if (!wallpaper) {
      this._window?.hide();
      return;
    }

    const eventCallback = (event: IpcMainEvent) => {
      if (event.sender.id != this._window?.webContents.id) return;
      this._window?.webContents.send(
        "wallpaper-changed",
        this._displayedWallpaper,
      );

      ipcMain.removeListener("wallpaper-ready", eventCallback);
    };

    ipcMain.on("wallpaper-ready", eventCallback);

    this._displayedWallpaper = wallpaper;
    this._window?.show();

    //Set wallpaper manually in case this isnt the first load, we dont need to wait for an event to happen
    this._window?.webContents.send(
      "wallpaper-changed",
      this._displayedWallpaper,
    );
  }
}
