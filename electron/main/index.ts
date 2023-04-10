import { app } from "electron";
import { join } from "node:path";
import { WallpaperHandler } from "./wallpaper-handler";
import { SettingsWindow } from "./window/settings-window";

const handler = new WallpaperHandler();

process.env.DIST_ELECTRON = join(__dirname, "../");
process.env.DIST = join(process.env.DIST_ELECTRON, "../dist");
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, "../public")
  : process.env.DIST;

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

app.on("window-all-closed", () => {
  app.quit();
});

app.on("second-instance", () => {
});

app.on("activate", () => {
});

app.on("quit", () => handler.destroy());

app.whenReady().then(() => {
  console.log(process.env.DIST_ELECTRON);
  const window = new SettingsWindow();
  window.initialize();
  // handler.initialize();
});
