import WallpaperRendererHandler from "@/components/wallpaper-renderer/WallpaperRendererHandler";
import WallpaperVideoRenderer from "@/components/wallpaper-renderer/video/WallpaperVideoRenderer";
import { Wallpaper } from "@/types/wallpaper";
import { Breadcrumb, IBreadcrumbItem, IDividerAsProps, Text } from "@fluentui/react";
import { Display, ipcRenderer } from "electron";
import { useEffect, useState } from "react";
import SettingsEntry from "../ui/SettingsEntry";
import SettingsMonitorFrame from "../ui/SettingsMonitorFrame";
function SettingsWallpaper() {

    const [screens, setScreens] = useState<{ screen: Display, wallpaper: Wallpaper }[]>([])
    const [activeScreen, setActiveScreen] = useState<Display>();

    const updateScreens = () => {
        ipcRenderer.invoke('get-screens').then(screenList => {
            setScreens(screenList)

            if (!activeScreen) {
                setActiveScreen(screenList[0].screen)
            }
        })
    }

    useEffect(() => {
        updateScreens()
        ipcRenderer.on('screens-change', (e, data) => {
            updateScreens();
        });

        return () => {
            ipcRenderer.removeAllListeners('screens-change');
        }
    }, []);

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
            {
                screens.map(element =>
                    <div key={element.screen.id} className="w-96 cursor-pointer" onClick={() => setActiveScreen(element.screen)}>
                        <SettingsMonitorFrame selected={activeScreen?.id == element.screen.id} >
                            <WallpaperRendererHandler wallpaper={element.wallpaper}></WallpaperRendererHandler>
                            <WallpaperVideoRenderer wallpaper={test} ></WallpaperVideoRenderer>
                        </SettingsMonitorFrame>
                    </div>
                )
            }
        </div>

        <div className="flex flex-col ">
            <SettingsEntry>
                <h1>LEL</h1>
                <Text>
                    This settings allows you to switch between dark & light mode on your machine
                </Text>
            </SettingsEntry>
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