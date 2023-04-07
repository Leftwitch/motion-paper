export type Wallpaper = {
  type: "VIDEO" | "IMAGE" | "URL" | "SPLINE";
  source:
    | WallpaperVideoSource
    | WallpaperImageSource
    | WallpaperUrlSource
    | WallpaperSplineSource;
};

export type WallpaperVideoSource = {
  path: string;
};

export type WallpaperSplineSource = {
  splineCodeUrl: string;
};

export type WallpaperImageSource = WallpaperVideoSource;

export type WallpaperUrlSource = {
  url: string;
};
