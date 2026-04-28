'use client'
import { useEffect, useRef } from 'react'

interface Props {
  children: React.ReactNode
  delay?: number
  style?: React.CSSProperties
}

export default function RevealSection({ children, delay = 0, style }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => el.classList.add('visible'), delay)
          obs.unobserve(el)
        }
      },
      { threshold: 0.12 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [delay])

  return (
    <div ref={ref} className="reveal" style={style}>
      {children}
    </div>
  )
}
