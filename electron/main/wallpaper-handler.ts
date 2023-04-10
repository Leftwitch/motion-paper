import { Display, screen } from "electron";
import { WallpaperWindow } from ".\\window\\wallpaper-window";

export class WallpaperHandler {
  private windows: WallpaperWindow[] = [];

  initialize() {
    screen.addListener("display-added", this.displayAdded.bind(this));
    screen.addListener("display-removed", this.displayRemoved.bind(this));

    screen.getAllDisplays().forEach((display) =>
      this.displayAdded(null, display)
    );
  }

  destroy() {
    screen.removeListener("display-added", this.displayAdded);
    screen.removeListener("display-removed", this.displayRemoved);
    this.windows.forEach((window) => window.destroy());
  }

  displayRemoved(event: Event | null, display: Display) {
    const win = this.windows.find((window) => window.display.id == display.id);
    win?.destroy();
    this.windows = this.windows.filter((win) => win.display.id != display.id);
  }
  displayAdded(event: Event | null, display: Display) {
    this.createWallpaperWindowForDisplay(display);
  }

  createWallpaperWindowForDisplay(display: Display) {
    const wallpaperWindow = new WallpaperWindow(display);
    wallpaperWindow.initialize();

    this.windows.push(wallpaperWindow);
  }
}
