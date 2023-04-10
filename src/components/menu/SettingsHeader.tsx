import { CommandBarButton, Stack, Text } from '@fluentui/react';

const SettingsHeader = () => {
    return (
        <Stack
            horizontal
            verticalAlign="center"
            styles={{ root: { height: 50, paddingLeft: 16, borderBottom: '1px solid #eaeaea' } }}
        >
            <CommandBarButton iconProps={{ iconName: 'GlobalNavButton' }} />
            <Text variant="large" styles={{ root: { fontWeight: 'bold' } }}>
                My App
            </Text>
        </Stack>
    );
};

export default SettingsHeader;