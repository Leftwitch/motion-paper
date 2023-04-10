import { PartialTheme, ThemeProvider } from "@fluentui/react";
import SettingsWallpaper from "./pages/SettingsWallpaper";
import SettingsSidebar from "./sidebar/SettingsSidebar";


const darkTheme: PartialTheme = {
    palette: {
        neutralLighterAlt: '#282828',
        neutralLighter: '#313131',
        neutralLight: '#3f3f3f',
        neutralQuaternaryAlt: '#484848',
        neutralQuaternary: '#4f4f4f',
        neutralTertiaryAlt: '#6d6d6d',
        neutralTertiary: '#c8c8c8',
        neutralSecondary: '#d0d0d0',
        neutralPrimaryAlt: '#dadada',
        neutralPrimary: '#ffffff',
        neutralDark: '#f4f4f4',
        black: '#f8f8f8',
        white: '#1f1f1f',
    }
}
function SettingsPage() {
    return <ThemeProvider theme={darkTheme} style={{ height: '100%', background: 'rgba(0,0,0,0)' }}>
        <div className="pt-6 w-full h-full box-border">
            <div className="flex w-full h-full box-border">
                <SettingsSidebar />
                <div className="flex-1 px-10 box-border h-full w-full overflow-auto">
                    <SettingsWallpaper />
                </div>
            </div>
        </div>
    </ThemeProvider>
}


export default SettingsPage;