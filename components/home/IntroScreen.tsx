'use client'

interface Props {
  visible: boolean
  onStart: () => void
}

export default function IntroScreen({ visible, onStart }: Props) {
  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: '#000',
        zIndex: 10,
        padding: '24px',
        opacity: visible ? 1 : 0,
        transform: visible ? 'scale(1)' : 'scale(1.03)',
        transition: 'opacity 0.8s cubic-bezier(0.4,0,0.2,1), transform 0.8s cubic-bezier(0.4,0,0.2,1)',
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      <h1 style={{
        fontFamily: "'Syne', sans-serif", fontWeight: 800,
        fontSize: 'clamp(42px, 12vw, 108px)', letterSpacing: '-0.03em',
        lineHeight: 1, color: '#fff', textAlign: 'center',
        animation: 'fadeUp 1s 0.18s both',
      }}>
        FRANCO<span style={{ color: '#c9b99a' }}>O</span>RP
      </h1>

      <p style={{
        fontSize: 'clamp(10px, 2.5vw, 12px)',
        color: 'rgba(255,255,255,0.35)', textAlign: 'center',
        marginTop: 14,
        animation: 'fadeUp 1s 0.26s both',
        letterSpacing: '0.28em', textTransform: 'uppercase',
        fontFamily: "'DM Sans', sans-serif",
      }}>
        Agencia Digital
      </p>

      <button
        onClick={onStart}
        style={{
          marginTop: 48,
          padding: '14px 56px',
          border: '1.5px solid rgba(255,255,255,0.35)',
          borderRadius: 100,
          background: 'transparent',
          color: '#fff',
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 12, letterSpacing: '0.18em',
          textTransform: 'uppercase', cursor: 'pointer',
          transition: 'background 0.25s, color 0.25s, border-color 0.25s',
          animation: 'fadeUp 1s 0.36s both',
          WebkitTapHighlightColor: 'transparent',
        }}
        onMouseEnter={e => {
          const b = e.currentTarget
          b.style.background = '#fff'
          b.style.color = '#000'
          b.style.borderColor = '#fff'
        }}
        onMouseLeave={e => {
          const b = e.currentTarget
          b.style.background = 'transparent'
          b.style.color = '#fff'
          b.style.borderColor = 'rgba(255,255,255,0.35)'
        }}
      >
        Empezar
      </button>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
