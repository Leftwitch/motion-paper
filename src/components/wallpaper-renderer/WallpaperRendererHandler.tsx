import { Wallpaper } from "@/types/wallpaper";
import './WallpaperRendererHandler.scss';
import WallpaperImageRenderer from "./image/WallpaperImageRenderer";
import WallpaperSplineRenderer from "./spline/WallpaperSplineHandler";
import WallpaperVideoRenderer from "./video/WallpaperVideoRenderer";

function WallpaperRendererHandler({ wallpaper }: { wallpaper: Wallpaper | null }) {
    return <div id="wallpaper-container">
        {wallpaper?.type == 'VIDEO' && <WallpaperVideoRenderer wallpaper={wallpaper} />}
        {wallpaper?.type == 'IMAGE' && <WallpaperImageRenderer wallpaper={wallpaper} />}
        {wallpaper?.type == 'URL' && <WallpaperVideoRenderer wallpaper={wallpaper} />}
        {wallpaper?.type == 'SPLINE' && <WallpaperSplineRenderer wallpaper={wallpaper} />}
    </div>

}

export default WallpaperRendererHandler;