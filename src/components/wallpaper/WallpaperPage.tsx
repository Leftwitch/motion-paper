import { Wallpaper } from "@/types/wallpaper";
import { ipcRenderer } from "electron";
import { useEffect, useState } from "react";
import WallpaperRendererHandler from "../wallpaper-renderer/WallpaperRendererHandler";

function WallpaperPage() {

    const [wallpaper, setWallpaper] = useState<Wallpaper | null>(null);
    const getWallpaper = () => ipcRenderer.invoke('get-wallpaper').then((wallpaper: Wallpaper) => {
        setWallpaper(wallpaper)
    })
    useEffect(() => {
        getWallpaper();
        ipcRenderer.on('wallpaper-changed', () => getWallpaper())
    }, [])

    return <WallpaperRendererHandler wallpaper={wallpaper} />
}


export default WallpaperPage;