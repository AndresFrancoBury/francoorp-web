'use client'
import RevealSection from './RevealSection'

export default function PortfolioGrid({ accent }: { accent: string }) {
  const items = Array.from({ length: 6 }, (_, i) => i + 1)
  return (
    <section style={{
      padding: '120px 24px',
      borderTop: '1px solid rgba(255,255,255,0.06)',
    }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <RevealSection>
          <p style={{
            fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase',
            color: accent, marginBottom: 14, textAlign: 'center',
            fontFamily: 'var(--font-body)',
          }}>
            Portafolio
          </p>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: 'clamp(28px, 4vw, 52px)',
            color: '#f5f5f7', textAlign: 'center',
            letterSpacing: '-0.025em', lineHeight: 1.1,
            marginBottom: 64,
          }}>
            Proyectos que hablan<br />por sí solos.
          </h2>
        </RevealSection>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 16,
        }}>
          {items.map(i => (
            <RevealSection key={i} delay={i * 60}>
              <div
                style={{
                  aspectRatio: '16/10',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 16,
                  display: 'flex', alignItems: 'flex-end',
                  padding: '20px 24px', cursor: 'pointer',
                  transition: 'background 0.3s, border-color 0.3s, transform 0.3s',
                  position: 'relative', overflow: 'hidden',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLDivElement
                  el.style.background = 'rgba(255,255,255,0.06)'
                  el.style.borderColor = 'rgba(255,255,255,0.15)'
                  el.style.transform = 'scale(1.02)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLDivElement
                  el.style.background = 'rgba(255,255,255,0.03)'
                  el.style.borderColor = 'rgba(255,255,255,0.08)'
                  el.style.transform = 'scale(1)'
                }}
              >
                <span style={{
                  fontFamily: 'var(--font-body)', fontWeight: 500,
                  fontSize: 13, color: 'rgba(255,255,255,0.2)',
                  letterSpacing: '0.04em',
                }}>
                  Proyecto {String(i).padStart(2, '0')}
                </span>
              </div>
            </RevealSection>
          ))}
        </div>
      </div>
    </section>
  )
}
