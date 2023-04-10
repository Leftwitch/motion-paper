import { app, Display } from "electron";
import events from "events";
import fs from "fs";
import path from "path";
import {
  WallpaperConfig,
  WallpaperConfigEntry,
} from "./types/wallpaper-config";

const configPath = path.join(
  app.getPath("userData"),
  "display-config.json",
);
export class WallpaperConfigHandler extends events.EventEmitter {
  private config: WallpaperConfig = {};

  loadConfig() {
    if (!fs.existsSync(configPath)) {
      fs.writeFileSync(configPath, "{}");
      console.log("Config created in " + configPath);
    }

    this.config = JSON.parse(fs.readFileSync(configPath).toString());
    console.log("Config (re)loaded");
  }

  updateConfig() {
    fs.writeFileSync(configPath, JSON.stringify(this.config));
    this.loadConfig();
    this.emit("update", this.config);
  }

  getConfigForDisplay(display: Display): WallpaperConfigEntry | null {
    if (display.id in this.config) {
      return this.config[display.id];
    }
    return null;
  }

  setConfigForDisplay(display: Display, entry: WallpaperConfigEntry) {
    this.config[display.id] = entry;
    this.updateConfig();
  }
}
