import RevealSection from './RevealSection'

interface Service { title: string; desc: string }
interface Props { services: Service[]; accent: string; accentDim: string }

export default function ServicesBlock({ services, accent, accentDim }: Props) {
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
            Servicios
          </p>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: 'clamp(28px, 4vw, 52px)',
            color: '#f5f5f7', textAlign: 'center',
            letterSpacing: '-0.025em', lineHeight: 1.1,
            marginBottom: 64,
          }}>
            Todo lo que necesitas,<br />en un solo lugar.
          </h2>
        </RevealSection>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 16,
        }}>
          {services.map((s, i) => (
            <RevealSection key={i} delay={i * 70}>
              <div style={{
                padding: '36px 32px',
                border: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.025)',
                borderRadius: 16,
                height: '100%',
              }}>
                <div style={{
                  width: 28, height: 2,
                  background: accent, marginBottom: 22, borderRadius: 2,
                }} />
                <h3 style={{
                  fontFamily: 'var(--font-body)', fontWeight: 600,
                  fontSize: 17, color: '#f5f5f7',
                  marginBottom: 10, letterSpacing: '-0.01em',
                }}>
                  {s.title}
                </h3>
                <p style={{
                  fontSize: 14, color: 'rgba(245,245,247,0.45)',
                  lineHeight: 1.7, fontFamily: 'var(--font-body)',
                }}>
                  {s.desc}
                </p>
              </div>
            </RevealSection>
          ))}
        </div>
      </div>
    </section>
  )
}
