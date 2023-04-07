import { Wallpaper, WallpaperImageSource, WallpaperVideoSource } from "@/types/wallpaper";
import './WallpaperImageRenderer.scss';

function WallpaperImageRenderer({ wallpaper }: { wallpaper: Wallpaper }) {
    const imageSrc: WallpaperVideoSource = wallpaper.source as WallpaperImageSource;

    return (<img src={imageSrc.path} id="image" alt='bg' />)

}
export default WallpaperImageRenderer;