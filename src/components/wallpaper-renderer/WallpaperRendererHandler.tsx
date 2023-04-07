import { Wallpaper } from "@/types/wallpaper";
import { ipcRenderer } from "electron";
import { useEffect, useState } from "react";
import './WallpaperRendererHandler.scss';
import WallpaperImageRenderer from "./image/WallpaperImageRenderer";
import WallpaperSplineRenderer from "./spline/WallpaperSplineHandler";
import WallpaperVideoRenderer from "./video/WallpaperVideoRenderer";

function WallpaperRendererHandler() {

    const [wallpaper, setWallpaper] = useState<Wallpaper | null>(null);

    useEffect(() => {
        ipcRenderer.send("wallpaper-ready", {});
        ipcRenderer.on("wallpaper-changed", function (event, store) {
            console.log("Wallpaper changed");
            console.log(store);
            setWallpaper(store);
        });


        // Cleanup the event listeners when the component unmounts
        return () => {
            ipcRenderer.removeAllListeners("wallpaper-changed");
            ipcRenderer.removeAllListeners("mouse-event");
        };
    }, []);



    return <div id="wallpaper-container">
        {wallpaper?.type == 'VIDEO' && <WallpaperVideoRenderer wallpaper={wallpaper} />}
        {wallpaper?.type == 'IMAGE' && <WallpaperImageRenderer wallpaper={wallpaper} />}
        {wallpaper?.type == 'URL' && <WallpaperVideoRenderer wallpaper={wallpaper} />}
        {wallpaper?.type == 'SPLINE' && <WallpaperSplineRenderer wallpaper={wallpaper} />}
    </div>

}

export default WallpaperRendererHandler;