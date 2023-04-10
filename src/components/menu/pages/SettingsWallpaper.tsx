import WallpaperVideoRenderer from "@/components/wallpaper-renderer/video/WallpaperVideoRenderer";
import { Wallpaper } from "@/types/wallpaper";
import { Breadcrumb, IBreadcrumbItem, IDividerAsProps } from "@fluentui/react";
import SettingsEntry from "../SettingsEntry";
import SettingsMonitorFrame from "./SettingsMonitorFrame";
function SettingsWallpaper() {

    const items: IBreadcrumbItem[] = [
        { text: 'Personalisation', key: 'main', as: 'h1', },
        { text: 'Motion-Paper', key: 'mp', as: 'h1' },
        { text: 'Wallpapers', key: 'wp', as: 'h1' },

    ]

    const test: Wallpaper = {
        type: "VIDEO",
        source: { path: "file:///C:/Users/justi/Downloads/tunnel-27438.mp4" },
    }

    return (<div className="flex flex-col overflow-hidden gap-y-6">
        <Breadcrumb
            items={items}
            styles={{
                item: {
                    fontSize: '30px',
                    fontWeight: 600
                }
            }}
            dividerAs={_getCustomDivider}
        />

        <div className="flex overflow-x-auto whitespace-nowrap pb-4 gap-x-5">
            <div className="w-96">
                <SettingsMonitorFrame selected={true}>
                    <WallpaperVideoRenderer wallpaper={test} ></WallpaperVideoRenderer>
                </SettingsMonitorFrame>
            </div>
            <div className="w-96">
                <SettingsMonitorFrame>
                    <WallpaperVideoRenderer wallpaper={test}></WallpaperVideoRenderer>
                </SettingsMonitorFrame>
            </div>
            <div className="w-96">
                <SettingsMonitorFrame>
                    <WallpaperVideoRenderer wallpaper={test}></WallpaperVideoRenderer>
                </SettingsMonitorFrame>
            </div>
        </div>

        <div className="flex flex-col ">
            <SettingsEntry />
        </div>

    </div>
    )

}


function _getCustomDivider(dividerProps: IDividerAsProps): JSX.Element {
    return (
        <div className="text-4xl -mt-1 mx-2">
            &#x203A;
        </div>
    );
}

export default SettingsWallpaper;