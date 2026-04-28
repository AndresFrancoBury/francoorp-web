'use client'
import { useState } from 'react'

interface Props {
  value: string
  onChange: (date: string) => void
}

const DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

function getAvailableDates(): Set<string> {
  const set = new Set<string>()
  const today = new Date()
  let count = 0
  let added = 0
  while (added < 60) {
    const d = new Date(today)
    d.setDate(today.getDate() + count + 2)
    count++
    const day = d.getDay()
    if (day === 0 || day === 6) continue
    set.add(d.toISOString().split('T')[0])
    added++
  }
  return set
}

export default function DeliveryCalendar({ value, onChange }: Props) {
  const available = getAvailableDates()

  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())

  const firstDay = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  const cells: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let i = 1; i <= daysInMonth; i++) cells.push(i)

  const toISO = (day: number) => {
    const m = String(viewMonth + 1).padStart(2, '0')
    const d = String(day).padStart(2, '0')
    return `${viewYear}-${m}-${d}`
  }

  const selectedLabel = value
    ? (() => {
        const d = new Date(value + 'T12:00:00')
        return d.toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' })
      })()
    : null

  return (
    <div style={{ userSelect: 'none' }}>
      {/* Cabecera mes / año */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 16,
      }}>
        <button onClick={prevMonth} style={navBtnStyle}>‹</button>
        <span style={{
          fontFamily: 'var(--font-display)', fontWeight: 700,
          fontSize: 14, color: '#f5f5f7', letterSpacing: '0.04em',
        }}>
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <button onClick={nextMonth} style={navBtnStyle}>›</button>
      </div>

      {/* Nombres de días */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 6 }}>
        {DAYS.map(d => (
          <div key={d} style={{
            textAlign: 'center', fontSize: 10, letterSpacing: '0.08em',
            textTransform: 'uppercase', color: 'rgba(245,245,247,0.25)',
            fontFamily: 'var(--font-body)', padding: '4px 0',
          }}>
            {d}
          </div>
        ))}
      </div>

      {/* Grilla de días */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
        {cells.map((day, i) => {
          if (!day) return <div key={i} />
          const iso = toISO(day)
          const isAvailable = available.has(iso)
          const isSelected = iso === value
          const isToday = iso === today.toISOString().split('T')[0]

          return (
            <button
              key={i}
              onClick={() => isAvailable && onChange(iso)}
              disabled={!isAvailable}
              style={{
                aspectRatio: '1',
                borderRadius: 8,
                border: isSelected
                  ? '1.5px solid #c9b99a'
                  : isToday
                  ? '1px solid rgba(201,185,154,0.3)'
                  : '1px solid transparent',
                background: isSelected
                  ? 'rgba(201,185,154,0.18)'
                  : isAvailable
                  ? 'rgba(255,255,255,0.04)'
                  : 'transparent',
                color: isSelected
                  ? '#c9b99a'
                  : isAvailable
                  ? '#f5f5f7'
                  : 'rgba(245,245,247,0.18)',
                fontSize: 13,
                fontFamily: 'var(--font-body)',
                fontWeight: isSelected ? 700 : 400,
                cursor: isAvailable ? 'pointer' : 'default',
                transition: 'all 0.15s',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
              onMouseEnter={e => {
                if (isAvailable && !isSelected)
                  e.currentTarget.style.background = 'rgba(201,185,154,0.1)'
              }}
              onMouseLeave={e => {
                if (isAvailable && !isSelected)
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
              }}
            >
              {day}
            </button>
          )
        })}
      </div>

      {/* Fecha seleccionada */}
      {selectedLabel && (
        <div style={{
          marginTop: 14, padding: '10px 16px',
          background: 'rgba(201,185,154,0.07)',
          border: '1px solid rgba(201,185,154,0.25)',
          borderRadius: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: 12, color: '#c9b99a', fontFamily: 'var(--font-body)' }}>
            ✓ {selectedLabel.charAt(0).toUpperCase() + selectedLabel.slice(1)}
          </span>
          <button
            onClick={() => onChange('')}
            style={{ background: 'transparent', border: 'none', color: 'rgba(245,245,247,0.3)', fontSize: 16, cursor: 'pointer', lineHeight: 1 }}
          >
            ×
          </button>
        </div>
      )}

      <p style={{ fontSize: 11, color: 'rgba(245,245,247,0.25)', marginTop: 10, fontFamily: 'var(--font-body)' }}>
        Fechas disponibles a partir de 2 días hábiles. No se trabajan fines de semana.
      </p>
    </div>
  )
}

const navBtnStyle: React.CSSProperties = {
  background: 'transparent', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 8, color: 'rgba(245,245,247,0.5)',
  width: 32, height: 32, fontSize: 18, cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  transition: 'border-color 0.2s, color 0.2s',
  fontFamily: 'var(--font-body)',
}
