import { IStackStyles, Stack } from "@fluentui/react";
import { NavLink } from "react-router-dom";
import explorerIcon from '../../../assets/explorer.svg';
import wallpaperIcon from '../../../assets/wallpaper.svg';
import SettingsSidebarButton from "./SettingsSidebarButton";
const SettingsSidebar = () => {
    const stackStyles: IStackStyles = {
        root: {
            padding: '10px 20px',
            minWidth: '250px'
        },
    };

    return (
        <Stack tokens={{ childrenGap: 24 }} styles={stackStyles}>

            <Stack tokens={{ childrenGap: 4 }} >
                <NavLink to="/">
                    {({ isActive, isPending }) => (
                        <SettingsSidebarButton
                            icon={<img src={wallpaperIcon} className="w-6 h-6" />}
                            active={isActive}
                            title="Wallpaper Settings"
                        />)}
                </NavLink>

                <NavLink to="/explorer">
                    {({ isActive, isPending }) => (
                        <SettingsSidebarButton
                            icon={<img src={explorerIcon} className="w-6 h-6" />}
                            active={isActive}
                            title="Explorer Settings"
                        />)}
                </NavLink>
            </Stack>

        </Stack>
    );
};





export default SettingsSidebar;