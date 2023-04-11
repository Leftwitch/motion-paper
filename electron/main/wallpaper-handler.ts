import { Display, screen } from "electron";
import { WallpaperWindow } from ".\\window\\wallpaper-window";

export class WallpaperHandler {
  private windows: WallpaperWindow[] = [];

  initialize() {
    screen.addListener("display-added", this.displayAdded.bind(this));
    screen.addListener("display-removed", this.displayRemoved.bind(this));
    screen.addListener(
      "display-metrics-changed",
      this.metricsChanged.bind(this),
    );

    this.reloadWallpapers();
  }

  reloadWallpapers() {
    this.windows.forEach((window) => window.destroy());
    this.windows = [];

    screen.getAllDisplays().forEach((display) =>
      this.createWallpaperWindowForDisplay(display)
    );
  }

  destroy() {
    screen.removeListener("display-added", this.displayAdded);
    screen.removeListener("display-removed", this.displayRemoved);
    screen.removeListener("display-metrics-changed", this.metricsChanged);
    this.windows.forEach((window) => window.destroy());
    this.windows = [];
  }

  metricsChanged(event: Event, display: Display) {
    this.reloadWallpapers();
  }

  displayRemoved(event: Event | null, display: Display) {
    this.reloadWallpapers();
  }

  displayAdded(event: Event | null, display: Display) {
    this.reloadWallpapers();
  }

  createWallpaperWindowForDisplay(display: Display) {
    const wallpaperWindow = new WallpaperWindow(display);
    wallpaperWindow.initialize();

    this.windows.push(wallpaperWindow);
  }
}
