import { useRef } from 'react'
import Cat from './components/Cat'
import Timer from './components/Timer'
import './App.css'

function App() {
  const containerRef = useRef<HTMLElement | null>(null)

  return (
    <main className="app" ref={containerRef}>
      <Cat containerRef={containerRef} />
      <Timer />
    </main>
  )
}

export default App
