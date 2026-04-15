import { useRef } from 'react'
import Cat from './components/Cat'
import './App.css'

declare global {
  interface Window {
    desktopApi?: {
      platform: string
      versions: {
        electron: string
        chrome: string
        node: string
      }
    }
  }
}

function App() {
  const api = window.desktopApi
  const containerRef = useRef<HTMLElement | null>(null)

  return (
    <main className="app" ref={containerRef}>
      <Cat containerRef={containerRef} />

      <h1>Desktop App Starter</h1>
      <p>Electron + Vite + React are now wired together.</p>

      <div className="card">
        <h2>Runtime</h2>
        <ul>
          <li>Platform: {api?.platform ?? 'web-browser mode'}</li>
          <li>Electron: {api?.versions.electron ?? 'not detected'}</li>
          <li>Chrome: {api?.versions.chrome ?? 'n/a'}</li>
          <li>Node: {api?.versions.node ?? 'n/a'}</li>
        </ul>
      </div>
    </main>
  )
}

export default App
