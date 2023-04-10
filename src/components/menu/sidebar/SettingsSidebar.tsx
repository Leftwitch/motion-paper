import { IIconStyles, IPersonaSharedProps, IPersonaStyles, IStackStyles, Stack } from "@fluentui/react";
import SettingsSidebarButton from "./SettingsSidebarButton";

const personaStyles: Partial<IPersonaStyles> = { root: { margin: '0 0 10px 0' } };
const iconStyles: Partial<IIconStyles> = { root: { marginRight: 5 } };

const SettingsSidebar = () => {
    const stackStyles: IStackStyles = {
        root: {
            padding: '10px 20px',
            minWidth: '250px'
        },
    };

    const computerInfo: IPersonaSharedProps = {
        imageUrl: 'https://res-1.cdn.office.net/files/fabric-cdn-prod_20221209.001/office-ui-fabric-react-assets/persona-female.png',
        imageInitials: 'W11',
        text: 'Windows 11',
        secondaryText: 'Build XYZ',

    };

    return (
        <Stack tokens={{ childrenGap: 24 }} styles={stackStyles}>

            <Stack tokens={{ childrenGap: 4 }} >
                <SettingsSidebarButton
                    icon={<img src="https://upload.wikimedia.org/wikipedia/commons/d/da/Bluetooth.svg" className="w-6 h-6" />}
                    active={true}
                    title="ABC"
                />
                <SettingsSidebarButton
                    icon={<img src="https://upload.wikimedia.org/wikipedia/commons/d/da/Bluetooth.svg" className="w-6 h-6" />}
                    active={false}
                    title="ABC"
                />
            </Stack>

        </Stack>
    );
};





export default SettingsSidebar;