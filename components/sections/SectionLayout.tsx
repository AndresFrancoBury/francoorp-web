'use client'
import { useRouter } from 'next/navigation'

interface Props {
  division: string
  num: string
  accent: string
  accentDim: string
  tagline: string
  headline: string
  bg: string
  children: React.ReactNode
}

export default function SectionLayout({ division, num, accent, accentDim, tagline, headline, bg, children }: Props) {
  const router = useRouter()

  return (
    <div style={{ background: '#000', overflowX: 'hidden' }}>
      {/* Nav */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '18px 40px',
        background: 'rgba(0,0,0,0.72)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <button onClick={() => router.push('/')} style={{
          background: 'transparent', border: 'none',
          fontFamily: 'var(--font-body)', fontSize: 14,
          color: 'rgba(245,245,247,0.5)', cursor: 'pointer',
          letterSpacing: '-0.01em', display: 'flex', alignItems: 'center', gap: 6,
          transition: 'color 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.color = '#f5f5f7' }}
        onMouseLeave={e => { e.currentTarget.style.color = 'rgba(245,245,247,0.5)' }}
        >
          ← Francoorp
        </button>
        <span style={{
          fontFamily: 'var(--font-body)', fontSize: 12,
          letterSpacing: '0.14em', textTransform: 'uppercase',
          color: accent, opacity: 0.9,
        }}>
          {division}
        </span>
      </nav>

      {/* Hero */}
      <section style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '120px 24px 80px',
        background: bg, position: 'relative',
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '6px 16px',
          border: `1px solid ${accent}40`,
          borderRadius: 100, marginBottom: 28,
          fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase',
          color: accent, fontFamily: 'var(--font-body)',
        }}>
          {tagline}
        </div>

        <h1 style={{
          fontFamily: 'var(--font-display)', fontWeight: 800,
          fontSize: 'clamp(36px, 6vw, 80px)',
          lineHeight: 1.06, letterSpacing: '-0.03em',
          color: '#f5f5f7', maxWidth: 820, margin: '0 auto',
        }}>
          {headline}
        </h1>

        <p style={{
          marginTop: 20, fontSize: 17,
          color: 'rgba(245,245,247,0.45)',
          lineHeight: 1.65, maxWidth: 480,
          fontFamily: 'var(--font-body)', fontWeight: 400,
        }}>
          Andres Franco Bury · Francoorp
        </p>

        <div style={{
          position: 'absolute', bottom: 40, left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: 6,
          color: 'rgba(255,255,255,0.2)',
          fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase',
          fontFamily: 'var(--font-body)',
          animation: 'bounce 2.2s ease-in-out infinite',
        }}>
          <span>Scroll</span>
          <span>↓</span>
        </div>
      </section>

      {children}

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); opacity: 0.5; }
          50% { transform: translateX(-50%) translateY(7px); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
