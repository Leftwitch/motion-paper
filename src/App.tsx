import WallpaperRendererHandler from './components/wallpaper-renderer/WallpaperRendererHandler'

console.log('[App.tsx]', `Hello world from Electron ${process.versions.electron}!`)

function App() {
  return (
    <div className='App'>
      <WallpaperRendererHandler />


    </div>
  )
}

export default App
