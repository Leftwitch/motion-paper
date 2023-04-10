import { app, Menu, Tray } from "electron";
import { join } from "node:path";
import { WallpaperConfigHandler } from "./wallpaper-config-handler";
import { WallpaperHandler } from "./wallpaper-handler";
import { SettingsWindow } from "./window/settings-window";
process.env.DIST_ELECTRON = join(__dirname, "../");
process.env.DIST = join(process.env.DIST_ELECTRON, "../dist");
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, "../public")
  : process.env.DIST;

const handler = new WallpaperHandler();
export const config = new WallpaperConfigHandler();
const settingsWindow = new SettingsWindow();

config.loadConfig();
Menu.setApplicationMenu(null);

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

app.on("window-all-closed", () => {
  app.quit();
});

app.on("second-instance", () => {});
app.on("activate", () => {});
app.on("quit", () => handler.destroy());

app.whenReady().then(() => {
  handler.initialize();
  settingsWindow.initialize();
  loadTray();
});

function loadTray() {
  const tray = new Tray(
    "C:\\Users\\justi\\Desktop\\WallpaperEngine\\motion-paper\\public\\favicon.ico",
  );
  tray.setToolTip("Motion Paper");
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Quit Motion-Paper",
      type: "normal",
      click: () => {
        app.quit(), process.exit(0);
      },
    },
  ]);
  tray.setContextMenu(contextMenu);
  tray.on("click", () => {
    if (settingsWindow.window?.isVisible()) return;
    settingsWindow.window?.show();
  });
  tray.on("right-click", () => {
    tray.popUpContextMenu();
  });
}
