import { Wallpaper, WallpaperSplineSource } from "@/types/wallpaper";
import React, { Suspense, useState } from "react";
const Spline = React.lazy(() => import('@splinetool/react-spline'));


function WallpaperSplineRenderer({ wallpaper }: { wallpaper: Wallpaper }) {
    const [loaded, setLoaded] = useState(false);

    return <div style={{ width: '100%', height: '100%' }}>
        {!loaded && <h1 style={{ color: 'white' }}>Loading...</h1>}
        <Suspense fallback={<h1 style={{ color: 'white' }}>Loading...</h1>}>
            <Spline onLoad={() => setLoaded(true)} scene={(wallpaper.source as WallpaperSplineSource).splineCodeUrl} />
        </Suspense>

    </div>

}
export default WallpaperSplineRenderer;