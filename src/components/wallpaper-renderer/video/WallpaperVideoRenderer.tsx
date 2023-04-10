import { Wallpaper, WallpaperVideoSource } from "@/types/wallpaper";
import { createRef, useEffect } from "react";
import './WallpaperVideoRenderer.scss';

function WallpaperVideoRenderer({ wallpaper }: { wallpaper: Wallpaper }) {
    const videoSrc: WallpaperVideoSource = wallpaper.source as WallpaperVideoSource;
    const videoRef = createRef<HTMLVideoElement>();

    useEffect(() => {
        //Loop and autoplay don't always work so we do this manually
        const video = videoRef.current;
        if (!video) return;
        video.muted = true;
        video.play()

        video.addEventListener('ended', () => {
            video.currentTime = 0;
            video.play();
        })


    }, [videoRef])
    return (<video ref={videoRef} src={videoSrc.path} id="video"></video>)

}
export default WallpaperVideoRenderer;