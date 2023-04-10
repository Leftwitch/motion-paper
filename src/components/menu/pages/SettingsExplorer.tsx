import { Breadcrumb, IBreadcrumbItem, IDividerAsProps, Text, Toggle } from "@fluentui/react";
import { ipcRenderer } from "electron";
import { useEffect, useState } from "react";
import { RegistryItemValue } from "regedit";
import SettingsEntry from "../ui/SettingsEntry";
function SettingsWallpaper() {

    const [registry, setRegistry] = useState<{ [key: string]: RegistryItemValue }>()


    useEffect(() => {
        ipcRenderer.invoke('get-registry').then(reg => setRegistry(reg))
        ipcRenderer.on('registry-change', (e, data) => {
            setRegistry(data)
            console.log('NEW REGISTRY')
            console.log(data)
        })
    }, [])

    const items: IBreadcrumbItem[] = [
        { text: 'Personalisation', key: 'main', as: 'h1', },
        { text: 'Motion-Paper', key: 'mp', as: 'h1' },
        { text: 'Explorer', key: 'ep', as: 'h1' },

    ]

    const lightModeOsEnabled = registry?.['SystemUsesLightTheme']?.value == 1;
    const lightModeAppsEnabled = registry?.['AppsUseLightTheme']?.value == 1;
    const colorPrevalenceEnabled = registry?.['ColorPrevalence']?.value == 1;
    const transparencyEnabled = registry?.['EnableTransparency']?.value == 1;

    const setOsLightMode = (light: boolean) => {
        ipcRenderer.invoke('update-registry', {
            "SystemUsesLightTheme": {
                "type": "REG_DWORD",
                "value": light ? 1 : 0,
            }
        },)
    }

    const setAppLightMode = (light: boolean) => {
        ipcRenderer.invoke('update-registry', {
            "AppsUseLightTheme": {
                "type": "REG_DWORD",
                "value": light ? 1 : 0,
            }
        },)
    }

    const setColorPrevalance = (enabled: boolean) => {
        ipcRenderer.invoke('update-registry', {
            "ColorPrevalence": {
                "type": "REG_DWORD",
                "value": enabled ? 1 : 0,
            }
        },)
    }

    const setTransparency = (enabled: boolean) => {
        ipcRenderer.invoke('update-registry', {
            "EnableTransparency": {
                "type": "REG_DWORD",
                "value": enabled ? 1 : 0,
            }
        },)
    }
    /*
        {
            ColorPrevalence: { type: 'REG_DWORD', value: 0 },
            EnableTransparency: { type: 'REG_DWORD', value: 1 },
            AppsUseLightTheme: { type: 'REG_DWORD', value: 0 },
            SystemUsesLightTheme: { type: 'REG_DWORD', value: 0 },
            AppUsesLightTheme: { type: 'REG_DWORD', value: 1 },
            AppUseLightTheme: { type: 'REG_DWORD', value: 1 }
        }*/

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

        <div className="flex flex-col gap-y-1">
            <SettingsEntry>
                <div className="flex items-center">
                    <div className="flex flex-col">
                        <Text variant="large">
                            Windows Appearance
                        </Text>
                        <Text>
                            This settings allows you to switch between dark & light mode on your machine
                        </Text>
                    </div>

                    <div className="ml-auto flex gap-x-3">
                        <div onClick={() => setOsLightMode(true)} className={`cursor-pointer w-8 h-8 bg-white rounded-lg border-2 border-solid ${lightModeOsEnabled ? 'border-purple-600' : 'border-transparent'}`}></div>
                        <div onClick={() => setOsLightMode(false)} className={`cursor-pointer w-8 h-8 bg-black rounded-lg border-2 border-solid ${!lightModeOsEnabled ? 'border-purple-600' : 'border-transparent'}`}></div>
                    </div>
                </div>
            </SettingsEntry>

            <SettingsEntry>
                <div className="flex items-center">
                    <div className="flex flex-col">
                        <Text variant="large">
                            App Appearance
                        </Text>
                        <Text>
                            This settings allows you to switch between dark & light mode on your apps
                        </Text>
                    </div>

                    <div className="ml-auto flex gap-x-3">
                        <div onClick={() => setAppLightMode(true)} className={`cursor-pointer w-8 h-8 bg-white rounded-lg border-2 border-solid ${lightModeAppsEnabled ? 'border-purple-600' : 'border-transparent'}`}></div>
                        <div onClick={() => setAppLightMode(false)} className={`cursor-pointer w-8 h-8 bg-black rounded-lg border-2 border-solid ${!lightModeAppsEnabled ? 'border-purple-600' : 'border-transparent'}`}></div>
                    </div>
                </div>
            </SettingsEntry>

            <SettingsEntry>
                <div className="flex items-center">
                    <div className="flex flex-col">
                        <Text variant="large">
                            Show accent color on Taskbar
                        </Text>
                    </div>

                    <div className="ml-auto flex items-center">
                        <Toggle onText="On" offText="Off" onChange={(_, val) => setColorPrevalance(val ?? false)} checked={colorPrevalenceEnabled} styles={{ pill: { background: 'rgba(255,255,255,0.2) !important', border: "0px !important" }, thumb: { background: 'purple' } }} />

                    </div>
                </div>
            </SettingsEntry>

            <SettingsEntry>
                <div className="flex items-center">
                    <div className="flex flex-col">
                        <Text variant="large">
                            Enable Acrylic Windows
                        </Text>
                        <Text>
                            This settings allows you enable or disable the acrylic effects
                        </Text>
                    </div>

                    <div className="ml-auto flex gap-x-3">
                        <Toggle onText="On" offText="Off" onChange={(_, val) => setTransparency(val ?? false)} checked={transparencyEnabled} styles={{ pill: { background: 'rgba(255,255,255,0.2) !important', border: "0px !important" }, thumb: { background: 'purple' } }} />

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