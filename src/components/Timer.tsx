import { useEffect, useMemo, useRef, useState } from 'react'
import './Timer.css'

function pad2(n: number) {
  return String(n).padStart(2, '0')
}

function clampInt(n: number, min: number, max: number) {
  const x = Math.floor(n)
  return Math.min(max, Math.max(min, x))
}

type RunState = 'idle' | 'running' | 'paused' | 'done'

export default function Timer() {
  const [hours, setHours] = useState(0)
  const [mins, setMins] = useState(5)
  const [secs, setSecs] = useState(0)

  const [runState, setRunState] = useState<RunState>('idle')
  const [remainingSec, setRemainingSec] = useState(5 * 60)

  const endAtRef = useRef<number | null>(null)
  const tickIdRef = useRef<number | null>(null)

  const baseTotal = useMemo(() => {
    return hours * 3600 + mins * 60 + secs
  }, [hours, mins, secs])

  const display = useMemo(() => {
    const safe = Math.max(0, remainingSec)
    const h = Math.floor(safe / 3600)
    const m = Math.floor((safe % 3600) / 60)
    const s = safe % 60
    return `${pad2(h)}:${pad2(m)}:${pad2(s)}`
  }, [remainingSec])

  const canStart = baseTotal > 0 && runState !== 'running'
  const canPause = runState === 'running'
  const canReset = runState !== 'idle'

  // Keep remaining in sync with picker while not actively running.
  useEffect(() => {
    if (runState === 'running') return
    setRemainingSec(baseTotal)
    if (baseTotal === 0) setRunState('idle')
    else if (runState === 'done') setRunState('paused')
  }, [baseTotal, runState])

  useEffect(() => {
    if (runState !== 'running') return

    const tick = () => {
      const endAt = endAtRef.current
      if (!endAt) return

      const msLeft = endAt - Date.now()
      const secLeft = Math.max(0, Math.ceil(msLeft / 1000))
      setRemainingSec(secLeft)

      if (secLeft <= 0) {
        endAtRef.current = null
        setRunState('done')
      }
    }

    tick()
    tickIdRef.current = window.setInterval(tick, 200)

    return () => {
      if (tickIdRef.current !== null) {
        window.clearInterval(tickIdRef.current)
        tickIdRef.current = null
      }
    }
  }, [runState])

  const start = () => {
    if (baseTotal <= 0) return

    const startingFrom = runState === 'paused' ? remainingSec : baseTotal
    if (startingFrom <= 0) return

    endAtRef.current = Date.now() + startingFrom * 1000
    setRunState('running')
  }

  const pause = () => {
    const endAt = endAtRef.current
    if (!endAt) {
      setRunState('paused')
      return
    }

    const msLeft = endAt - Date.now()
    const secLeft = Math.max(0, Math.ceil(msLeft / 1000))
    endAtRef.current = null
    setRemainingSec(secLeft)
    setRunState(secLeft <= 0 ? 'done' : 'paused')
  }

  const reset = () => {
    endAtRef.current = null
    setRemainingSec(baseTotal)
    setRunState(baseTotal > 0 ? 'paused' : 'idle')
  }

  const isRunning = runState === 'running'

  return (
    <section className="timer" aria-label="Timer">
      <div className="timer__header">
        <div>
          <h2 className="timer__title">Timer</h2>
          <p className="timer__subtitle">Select duration, then start.</p>
        </div>
        <div className="timer__badge" aria-label="status">
          {runState.toUpperCase()}
        </div>
      </div>

      <div className="timer__display" aria-live="polite">
        {display}
      </div>

      <div className="timer__pickers" aria-label="Duration">
        <label className="timer__picker">
          <span className="timer__pickerLabel">Hours</span>
          <select
            className="timer__select"
            value={hours}
            onChange={(e) => setHours(clampInt(Number(e.target.value), 0, 23))}
            disabled={isRunning}
          >
            {Array.from({ length: 24 }, (_, i) => (
              <option key={i} value={i}>
                {pad2(i)}
              </option>
            ))}
          </select>
        </label>

        <label className="timer__picker">
          <span className="timer__pickerLabel">Minutes</span>
          <select
            className="timer__select"
            value={mins}
            onChange={(e) => setMins(clampInt(Number(e.target.value), 0, 59))}
            disabled={isRunning}
          >
            {Array.from({ length: 60 }, (_, i) => (
              <option key={i} value={i}>
                {pad2(i)}
              </option>
            ))}
          </select>
        </label>

        <label className="timer__picker">
          <span className="timer__pickerLabel">Seconds</span>
          <select
            className="timer__select"
            value={secs}
            onChange={(e) => setSecs(clampInt(Number(e.target.value), 0, 59))}
            disabled={isRunning}
          >
            {Array.from({ length: 60 }, (_, i) => (
              <option key={i} value={i}>
                {pad2(i)}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="timer__actions">
        <button
          type="button"
          className="timer__button timer__button--primary"
          onClick={start}
          disabled={!canStart}
        >
          Start
        </button>

        <button
          type="button"
          className="timer__button"
          onClick={pause}
          disabled={!canPause}
        >
          Pause
        </button>

        <button
          type="button"
          className="timer__button timer__button--ghost"
          onClick={reset}
          disabled={!canReset}
        >
          Reset
        </button>
      </div>
    </section>
  )
}
