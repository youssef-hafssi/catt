import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, RefObject } from 'react'
import './Cat.css'

type CatProps = {
  containerRef: RefObject<HTMLElement | null>
}

type Pos = { x: number; y: number }

const CAT_SIZE = 56

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

export default function Cat({ containerRef }: CatProps) {
  const [pos, setPos] = useState<Pos>({ x: 12, y: 12 })
  const [flip, setFlip] = useState(false)

  const targetRef = useRef<Pos>(pos)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const update = () => {
      rafRef.current = null
      const next = targetRef.current
      setPos((prev) => {
        setFlip(next.x < prev.x)
        return next
      })
    }

    const onPointerMove = (ev: PointerEvent) => {
      const rect = el.getBoundingClientRect()
      const maxX = Math.max(0, Math.floor(rect.width - CAT_SIZE))
      const maxY = Math.max(0, Math.floor(rect.height - CAT_SIZE))

      const x = clamp(Math.floor(ev.clientX - rect.left - CAT_SIZE / 2), 0, maxX)
      const y = clamp(Math.floor(ev.clientY - rect.top - CAT_SIZE / 2), 0, maxY)

      targetRef.current = { x, y }

      if (rafRef.current === null) {
        rafRef.current = window.requestAnimationFrame(update)
      }
    }

    el.addEventListener('pointermove', onPointerMove, { passive: true })

    return () => {
      el.removeEventListener('pointermove', onPointerMove)
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current)
      }
    }
  }, [containerRef])

  const style = {
    transform: `translate(${pos.x}px, ${pos.y}px) scaleX(${flip ? -1 : 1})`,
  } as CSSProperties

  return (
    <div className="moving-cat" style={style} aria-label="cat" role="img">
      <svg
        className="cat-svg"
        viewBox="0 0 64 64"
        width="56"
        height="56"
        aria-hidden="true"
      >
        <path d="M16 24 L10 12 L22 18" fill="#1d2433" opacity="0.95" />
        <path d="M48 24 L54 12 L42 18" fill="#1d2433" opacity="0.95" />
        <circle cx="32" cy="34" r="18" fill="#1d2433" opacity="0.95" />
        <circle cx="25" cy="32" r="3" fill="#ffffff" />
        <circle cx="39" cy="32" r="3" fill="#ffffff" />
        <circle cx="25" cy="32" r="1.5" fill="#111827" />
        <circle cx="39" cy="32" r="1.5" fill="#111827" />
        <path d="M32 36 L29.5 39.5 L34.5 39.5 Z" fill="#f59e0b" />
        <path
          d="M20 40 C26 42, 38 42, 44 40"
          stroke="#ffffff"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.9"
          fill="none"
        />
      </svg>
    </div>
  )
}
