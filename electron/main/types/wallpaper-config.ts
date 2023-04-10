import { Wallpaper } from "./wallpaper";

export type WallpaperConfigEntry = {
  wallpaperSettings: Wallpaper;
};

export type WallpaperConfig = {
  [key: string]: WallpaperConfigEntry;
};
