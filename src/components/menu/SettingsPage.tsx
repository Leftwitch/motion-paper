import { PartialTheme, Spinner, SpinnerSize, ThemeProvider } from "@fluentui/react";
import { gsap } from "gsap";
import { createRef, useEffect } from "react";
import {
    Outlet,
    RouterProvider,
    createBrowserRouter,
    useLocation,
} from "react-router-dom";
import SettingsExplorer from "./pages/SettingsExplorer";
import SettingsWallpaper from "./pages/SettingsWallpaper";
import SettingsSidebar from "./sidebar/SettingsSidebar";

const router = createBrowserRouter([
    {
        path: '/',
        element: <AppLayout />,
        children: [
            {
                path: "",
                element: <SettingsWallpaper />,
            },
            {
                path: "explorer",
                element: <SettingsExplorer />,
            },
        ]
    }
]);

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

function AppLayout() {

    const location = useLocation();
    const contentRef = createRef<HTMLDivElement>();

    useEffect(() => {
        gsap.fromTo(contentRef.current, { opacity: 0, y: 100 }, { opacity: 1, y: 0, duration: 0.4 })
    }, [location]);

    return <ThemeProvider theme={darkTheme} style={{ height: '100%', background: 'rgba(0,0,0,0)' }}>
        <div className="pt-6 w-full h-full box-border">
            <div className="flex w-full h-full box-border">
                <SettingsSidebar />
                <div ref={contentRef} className="flex-1 px-10 box-border h-full w-full overflow-auto">
                    <Outlet />
                </div>
            </div>
        </div>
    </ThemeProvider>
}

function SettingsPage() {
    return <RouterProvider router={router} fallbackElement={<Spinner size={SpinnerSize.large} />} />
}


export default SettingsPage;