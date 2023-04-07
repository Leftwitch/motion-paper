import { Display, screen } from "electron";
import { WallpaperWindow } from ".\\window\\wallpaper-window";

export class WallpaperHandler {
  private readonly windows: WallpaperWindow[] = [];

  initialize() {
    screen.addListener("display-added", this.displayAdded.bind(this));

    screen.getAllDisplays().forEach((display) =>
      this.displayAdded(null, display)
    );
  }

  destroy() {
    console.log("Destroy");
    screen.removeListener("display-added", this.displayAdded);
    this.windows.forEach((window) => window.destroy());
  }

  displayAdded(event: Event | null, display: Display) {
    this.createWallpaperWindowForDisplay(display);
  }

  createWallpaperWindowForDisplay(display: Display) {
    const wallpaperWindow = new WallpaperWindow(display);
    wallpaperWindow.initialize();

    wallpaperWindow.setWallpaper({
      type: "VIDEO",
      source: { path: "C:\\Users\\justi\\Downloads\\tunnel-27438.mp4" },
    });

    setTimeout(() => {
      wallpaperWindow.setWallpaper({
        type: "SPLINE",
        source: {
          splineCodeUrl:
            "https://prod.spline.design/EmP-eiUvQAqEqWMq/scene.splinecode",
        },
      });
    }, 5000);
    this.windows.push(wallpaperWindow);
  }
}
