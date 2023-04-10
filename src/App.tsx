import { ipcRenderer } from 'electron';
import { useEffect, useState } from 'react';
import SettingsPage from './components/menu/SettingsPage';
import WallpaperRendererHandler from './components/wallpaper-renderer/WallpaperRendererHandler';

console.log('[App.tsx]', `Hello world from Electron ${process.versions.electron}!`)

function App() {

  const [windowMode, setWindowMode] = useState<'settings' | 'wallpaper'>()

  useEffect(() => {
    ipcRenderer.invoke('window-mode').then(mode => {
      if (!windowMode)
        postMessage({ payload: 'removeLoading' }, '*')
      setWindowMode(mode);
    })

  }, []);


  return (
    <div className="App">



      {windowMode == 'wallpaper' && <WallpaperRendererHandler />}
      {windowMode == 'settings' && <SettingsPage />}




    </div>
  )
}

export default App
