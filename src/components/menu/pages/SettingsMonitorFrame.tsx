import { ReactNode, useState } from 'react';
import monitorFrame from '../../../assets/monitor_frame.svg';

type Props = {
    children: ReactNode,
    selected?: boolean
}

function SettingsMonitorFrame({ children, selected }: Props) {
    const [monitor, setMonitor] = useState([1920, 1080])

    const recalc = (e: any) => {
        setMonitor([e.target.width, e.target.height])
    }

    const selectedClasses = 'border-solid border-purple-600 border-2 rounded-xl'
    return <div className={`transition-all relative overflow-hidden ${selected ? selectedClasses : ''}`}>
        <img
            className="absolute z-20 top-0 left-0"
            src={monitorFrame}
            onLoad={recalc}
            onResize={recalc}
        />

        <div className="p-1 overflow-hidden rounded-2xl" style={{ width: `${monitor[0]}px`, height: `${monitor[1]}px` }} >
            {children}
        </div>

    </div>
}


export default SettingsMonitorFrame;