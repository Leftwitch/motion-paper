import WallpaperRendererHandler from "@/components/wallpaper-renderer/WallpaperRendererHandler";
import { Wallpaper } from "@/types/wallpaper";
import { Breadcrumb, IBreadcrumbItem, IDividerAsProps, Slider, Text } from "@fluentui/react";
import { WallpaperFilled } from "@fluentui/react-icons";
import { Display, ipcRenderer } from "electron";
import { useEffect, useState } from "react";
import SettingsEntry from "../ui/SettingsEntry";
import SettingsMonitorFrame from "../ui/SettingsMonitorFrame";

function SettingsWallpaper() {
    const sliderValueFormat = (value: number) => `${value > 0 ? '+' : ''}${value}%`;

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
    const changeWallpaper = () => {
        ipcRenderer.invoke('set-wallpaper', activeScreen).then(() => {
            console.log('CHANGED')
        })
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
                        </SettingsMonitorFrame>
                    </div>
                )
            }
        </div>

        <div className="flex flex-col gap-y-1">

            <SettingsEntry>
                <div className="flex items-center gap-x-4">
                    <WallpaperFilled fontSize={30} />
                    <div className="flex flex-col">

                        <Text variant="large">
                            Select new Wallpaper
                        </Text>

                    </div>

                    <div className="ml-auto flex items-center gap-x-3 ">
                        <button onClick={changeWallpaper} className="bg-white/10 hover:bg-white/20 text-white font-bold py-2 px-4 rounded inline-flex items-center">
                            <Text variant="medium">
                                Browse Wallpapers
                            </Text>
                        </button>
                    </div>
                </div>
            </SettingsEntry>



            <SettingsEntry>
                <div className="flex items-center">
                    <div className="flex flex-col">
                        <Text variant="large">
                            Wallpaper Playback-Speed
                        </Text>
                        <Text>
                            This determines how fast your video is playing
                        </Text>
                    </div>

                    <div className="ml-auto flex items-center gap-x-3 w-80 h-16 ">
                        <Slider className="w-full" valueFormat={sliderValueFormat}
                            min={-100} max={200} step={5} defaultValue={0} showValue originFromZero />
                    </div>
                </div>
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