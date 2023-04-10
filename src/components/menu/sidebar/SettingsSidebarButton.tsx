import { Stack, Text } from "@fluentui/react";
import { ReactNode } from "react";

function SettingsSidebarButton({ active, title, icon }: { active: boolean, title: string, icon: ReactNode }) {

    return (
        <div className={`transition-colors duration-200 rounded cursor-pointer hover:bg-white/10 py-2 pr-2 ${active ? 'bg-white/10' : ''}`}>
            <Stack horizontal verticalAlign="center">
                <div className={`bg-purple-600 h-4 w-[3px] rounded-full mr-1 ${!active ? 'opacity-0' : ''}`}> </div>
                <div className="w-6 h-6">
                    {icon}
                </div>

                <Text variant="medium" className="ml-2">
                    {title}
                </Text>
            </Stack>
        </div>
    )
}

export default SettingsSidebarButton;