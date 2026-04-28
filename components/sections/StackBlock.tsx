import RevealSection from './RevealSection'

interface StackItem { name: string; cat: string }
interface Props { stack: StackItem[]; accent: string }

export default function StackBlock({ stack, accent }: Props) {
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
            Stack
          </p>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: 'clamp(28px, 4vw, 52px)',
            color: '#f5f5f7', textAlign: 'center',
            letterSpacing: '-0.025em', lineHeight: 1.1,
            marginBottom: 64,
          }}>
            Las herramientas correctas<br />para cada trabajo.
          </h2>
        </RevealSection>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
          {stack.map((s, i) => (
            <RevealSection key={i} delay={i * 55}>
              <div style={{
                padding: '22px 32px',
                border: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.025)',
                borderRadius: 14, minWidth: 140, textAlign: 'center',
              }}>
                <p style={{
                  fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase',
                  color: accent, opacity: 0.75, marginBottom: 7,
                  fontFamily: 'var(--font-body)',
                }}>
                  {s.cat}
                </p>
                <p style={{
                  fontFamily: 'var(--font-body)', fontWeight: 600,
                  fontSize: 15, color: '#f5f5f7',
                }}>
                  {s.name}
                </p>
              </div>
            </RevealSection>
          ))}
        </div>
      </div>
    </section>
  )
}
