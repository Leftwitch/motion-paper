import { ReactNode } from "react";
type Props = {
    children: ReactNode,
}

function SettingsEntry({ children }: Props) {

    return (<div className="bg-white/10 w-full p-4 rounded-md hover:bg-white/5 ">
        {children}
    </div>)
}

export default SettingsEntry;