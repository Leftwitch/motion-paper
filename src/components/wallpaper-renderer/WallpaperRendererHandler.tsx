import { Wallpaper } from "@/types/wallpaper";
import { ipcRenderer } from "electron";
import { useEffect, useState } from "react";
import './WallpaperRendererHandler.scss';
import WallpaperImageRenderer from "./image/WallpaperImageRenderer";
import WallpaperSplineRenderer from "./spline/WallpaperSplineHandler";
import WallpaperVideoRenderer from "./video/WallpaperVideoRenderer";

function WallpaperRendererHandler({ wallpaper }: { wallpaper: Wallpaper }) {

    const [currentWallpaper, setCurrentWallpaper] = useState<Wallpaper | null>(wallpaper);

    useEffect(() => {
        ipcRenderer.send("wallpaper-ready", {});
        ipcRenderer.on("wallpaper-changed", function (event, store) {
            console.log("Wallpaper changed");
            console.log(store);
            setCurrentWallpaper(store);
        });


        // Cleanup the event listeners when the component unmounts
        return () => {
            ipcRenderer.removeAllListeners("wallpaper-changed");
            ipcRenderer.removeAllListeners("mouse-event");
        };
    }, []);



    return <div id="wallpaper-container">
        {currentWallpaper?.type == 'VIDEO' && <WallpaperVideoRenderer wallpaper={currentWallpaper} />}
        {currentWallpaper?.type == 'IMAGE' && <WallpaperImageRenderer wallpaper={currentWallpaper} />}
        {currentWallpaper?.type == 'URL' && <WallpaperVideoRenderer wallpaper={currentWallpaper} />}
        {currentWallpaper?.type == 'SPLINE' && <WallpaperSplineRenderer wallpaper={currentWallpaper} />}
    </div>

}

export default WallpaperRendererHandler;