'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const PANELS = [
  {
    id: 'studio',
    num: '01',
    title: 'Studio',
    sub: 'Producción Audiovisual',
    accent: '#e8d5b0',
    btnHover: '#c9b99a',
    bg: `
      radial-gradient(ellipse at 20% 80%, rgba(201,155,80,0.7) 0%, transparent 50%),
      radial-gradient(ellipse at 80% 20%, rgba(160,100,30,0.5) 0%, transparent 50%),
      radial-gradient(ellipse at 50% 50%, rgba(120,75,20,0.3) 0%, transparent 70%),
      linear-gradient(160deg, #1c1408 0%, #0e0a04 50%, #050301 100%)
    `,
  },
  {
    id: 'tech',
    num: '02',
    title: 'Tech',
    sub: 'Desarrollo Web & Apps',
    accent: '#a8cdf0',
    btnHover: '#7ab4e8',
    bg: `
      radial-gradient(ellipse at 25% 75%, rgba(30,90,200,0.65) 0%, transparent 50%),
      radial-gradient(ellipse at 75% 25%, rgba(10,50,150,0.5) 0%, transparent 50%),
      radial-gradient(ellipse at 50% 50%, rgba(5,30,100,0.4) 0%, transparent 70%),
      linear-gradient(160deg, #04091a 0%, #020610 50%, #010308 100%)
    `,
  },
  {
    id: 'ia',
    num: '03',
    title: 'IA',
    sub: 'Inteligencia Artificial',
    accent: '#b8e07a',
    btnHover: '#97c459',
    bg: `
      radial-gradient(ellipse at 30% 70%, rgba(40,160,60,0.65) 0%, transparent 50%),
      radial-gradient(ellipse at 70% 30%, rgba(20,100,30,0.5) 0%, transparent 50%),
      radial-gradient(ellipse at 50% 50%, rgba(10,60,15,0.4) 0%, transparent 70%),
      linear-gradient(160deg, #040e05 0%, #020a03 50%, #010401 100%)
    `,
  },
]

interface Props {
  visible: boolean
  onBack: () => void
}

export default function SelectorScreen({ visible, onBack }: Props) {
  const router = useRouter()
  const [activeMobile, setActiveMobile] = useState<string | null>(null)

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        zIndex: 5,
        opacity: visible ? 1 : 0,
        transform: visible ? 'scale(1)' : 'scale(0.98)',
        transition: 'opacity 0.8s 0.1s cubic-bezier(0.4,0,0.2,1), transform 0.8s 0.1s cubic-bezier(0.4,0,0.2,1)',
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      {/* Back */}
      <button
        onClick={onBack}
        style={{
          position: 'fixed', top: 24, left: 24, zIndex: 20,
          background: 'transparent', border: 'none',
          color: 'rgba(255,255,255,0.35)', fontFamily: "'DM Sans', sans-serif",
          fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase',
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
          transition: 'color 0.2s',
          WebkitTapHighlightColor: 'transparent',
        }}
        onMouseEnter={e => { e.currentTarget.style.color = '#fff' }}
        onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.35)' }}
      >
        ← Volver
      </button>

      {/* Logo center top */}
      <div style={{
        position: 'fixed', top: 24, left: '50%', transform: 'translateX(-50%)',
        zIndex: 20, fontFamily: "'Syne', sans-serif", fontWeight: 800,
        fontSize: 11, letterSpacing: '0.22em', color: 'rgba(255,255,255,0.2)',
        pointerEvents: 'none', whiteSpace: 'nowrap',
      }}>
        FRANCORP
      </div>

      {/* Hint bottom — oculto en móvil */}
      <div style={{
        position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
        zIndex: 20, fontSize: 10, letterSpacing: '0.16em',
        textTransform: 'uppercase', color: 'rgba(255,255,255,0.18)',
        pointerEvents: 'none', whiteSpace: 'nowrap',
      }}
        className="fc-hint-desktop"
      >
        Selecciona una división para continuar
      </div>

      {/* Desktop: paneles en fila */}
      <div
        className="fc-panels"
        style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'row',
        }}
      >
        {PANELS.map((panel, i) => (
          <Panel
            key={panel.id}
            panel={panel}
            isLast={i === PANELS.length - 1}
            onClick={() => router.push(`/${panel.id}`)}
          />
        ))}
      </div>

      {/* Móvil: paneles apilados */}
      <div
        className="fc-panels-mobile"
        style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}
      >
        {PANELS.map((panel) => (
          <MobilePanel
            key={panel.id}
            panel={panel}
            isActive={activeMobile === panel.id}
            onToggle={() => setActiveMobile(activeMobile === panel.id ? null : panel.id)}
            onClick={() => router.push(`/${panel.id}`)}
          />
        ))}
      </div>

      <style>{`
        /* Desktop */
        @media (min-width: 768px) {
          .fc-panels { display: flex !important; }
          .fc-panels-mobile { display: none !important; }
          .fc-hint-desktop { display: block !important; }
        }
        /* Móvil */
        @media (max-width: 767px) {
          .fc-panels { display: none !important; }
          .fc-panels-mobile { display: flex !important; }
          .fc-hint-desktop { display: none !important; }
        }

        /* Desktop panel styles */
        .fc-panel {
          flex: 1;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          cursor: pointer;
          transition: flex 0.55s cubic-bezier(0.4,0,0.2,1);
        }
        .fc-panels:has(.fc-panel:hover) .fc-panel { flex: 0.7; }
        .fc-panels:has(.fc-panel:hover) .fc-panel:hover { flex: 1.6; }

        .fc-panel-bg {
          position: absolute;
          inset: -10%;
          background-size: cover;
          background-position: center;
          transition: transform 0.75s cubic-bezier(0.4,0,0.2,1);
        }
        .fc-panel:hover .fc-panel-bg { transform: scale(1.08); }

        .fc-panel-vignette {
          position: absolute; inset: 0;
          background: radial-gradient(ellipse at center, transparent 25%, rgba(0,0,0,0.6) 100%);
          pointer-events: none; z-index: 1;
        }

        .fc-panel-content {
          position: relative; z-index: 2;
          display: flex; flex-direction: column;
          align-items: center; text-align: center;
          padding: 24px;
          transition: transform 0.4s ease;
        }
        .fc-panel:hover .fc-panel-content { transform: translateY(-8px); }

        .fc-panel-btn {
          opacity: 0;
          transform: translateY(10px);
          pointer-events: none;
          transition: opacity 0.3s ease, transform 0.3s ease, background 0.2s, border-color 0.2s, color 0.2s;
        }
        .fc-panel:hover .fc-panel-btn {
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
        }

        /* Móvil panel styles */
        .fc-mobile-panel {
          flex: 1;
          position: relative;
          min-height: 120px;
          display: flex;
          align-items: center;
          cursor: pointer;
          overflow: hidden;
          transition: flex 0.45s cubic-bezier(0.4,0,0.2,1);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .fc-mobile-panel.active { flex: 2.5; }

        .fc-mobile-panel-bg {
          position: absolute; inset: -10%;
          background-size: cover; background-position: center;
          transition: transform 0.6s ease;
        }
        .fc-mobile-panel.active .fc-mobile-panel-bg { transform: scale(1.06); }

        .fc-mobile-panel-vignette {
          position: absolute; inset: 0;
          background: linear-gradient(to right, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.3) 100%);
          pointer-events: none; z-index: 1;
        }

        .fc-mobile-panel-content {
          position: relative; z-index: 2;
          padding: 0 28px;
          display: flex; flex-direction: column;
          width: 100%;
        }
      `}</style>
    </div>
  )
}

/* Panel para desktop */
function Panel({ panel, isLast, onClick }: { panel: typeof PANELS[0]; isLast: boolean; onClick: () => void }) {
  return (
    <div
      className="fc-panel"
      style={{ borderRight: isLast ? 'none' : '1px solid rgba(255,255,255,0.06)' }}
      onClick={onClick}
    >
      <div className="fc-panel-bg" style={{ background: panel.bg }} />
      <div className="fc-panel-vignette" />
      <div className="fc-panel-content">
        <span style={{
          fontFamily: "'Syne', sans-serif", fontSize: 11,
          letterSpacing: '0.22em', color: 'rgba(255,255,255,0.22)', marginBottom: 12,
        }}>
          {panel.num}
        </span>
        <h2 style={{
          fontFamily: "'Syne', sans-serif", fontWeight: 800,
          fontSize: 'clamp(40px, 5vw, 72px)', letterSpacing: '-0.02em',
          lineHeight: 1, color: panel.accent, textTransform: 'uppercase',
        }}>
          {panel.title}
        </h2>
        <p style={{
          fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.38)', marginTop: 8,
        }}>
          {panel.sub}
        </p>
        <button
          className="fc-panel-btn"
          style={{
            marginTop: 24, padding: '12px 36px', borderRadius: 100,
            border: '1.5px solid rgba(255,255,255,0.45)',
            background: 'rgba(0,0,0,0.25)',
            color: '#fff', fontFamily: "'DM Sans', sans-serif",
            fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', cursor: 'pointer',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = panel.btnHover
            e.currentTarget.style.borderColor = panel.btnHover
            e.currentTarget.style.color = '#000'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(0,0,0,0.25)'
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.45)'
            e.currentTarget.style.color = '#fff'
          }}
          onClick={e => { e.stopPropagation(); onClick() }}
        >
          Seleccionar
        </button>
      </div>
    </div>
  )
}

/* Panel para móvil — tap expande, segundo tap navega */
function MobilePanel({
  panel, isActive, onToggle, onClick,
}: {
  panel: typeof PANELS[0]
  isActive: boolean
  onToggle: () => void
  onClick: () => void
}) {
  return (
    <div
      className={`fc-mobile-panel${isActive ? ' active' : ''}`}
      onClick={isActive ? onClick : onToggle}
    >
      <div className="fc-mobile-panel-bg" style={{ background: panel.bg }} />
      <div className="fc-mobile-panel-vignette" />
      <div className="fc-mobile-panel-content">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{
              fontFamily: "'Syne', sans-serif", fontSize: 10,
              letterSpacing: '0.22em', color: 'rgba(255,255,255,0.25)',
            }}>
              {panel.num}
            </span>
            <h2 style={{
              fontFamily: "'Syne', sans-serif", fontWeight: 800,
              fontSize: isActive ? 'clamp(36px, 10vw, 56px)' : 'clamp(28px, 8vw, 40px)',
              letterSpacing: '-0.02em', lineHeight: 1,
              color: panel.accent, textTransform: 'uppercase',
              transition: 'font-size 0.4s ease',
              marginTop: 4,
            }}>
              {panel.title}
            </h2>
            {isActive && (
              <p style={{
                fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.4)', marginTop: 8,
                animation: 'fadeUp 0.3s ease both',
              }}>
                {panel.sub}
              </p>
            )}
          </div>
          {isActive ? (
            <div style={{
              padding: '10px 24px', borderRadius: 100,
              border: `1.5px solid ${panel.accent}`,
              background: 'rgba(0,0,0,0.3)',
              color: panel.accent, fontFamily: "'DM Sans', sans-serif",
              fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase',
              whiteSpace: 'nowrap',
            }}>
              Entrar →
            </div>
          ) : (
            <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 20 }}>›</span>
          )}
        </div>
      </div>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
