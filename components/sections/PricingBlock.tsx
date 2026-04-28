import RevealSection from './RevealSection'

interface Plan { name: string; price: string; items: string[]; featured?: boolean }
interface Props {
  title?: string
  subtitle?: string
  note?: string
  plans: Plan[]
  accent: string
  accentBorder: string
}

export default function PricingBlock({ title, subtitle, note, plans, accent, accentBorder }: Props) {
  return (
    <section style={{
      padding: '120px 24px',
      borderTop: '1px solid rgba(255,255,255,0.06)',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <RevealSection>
          <p style={{
            fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase',
            color: accent, marginBottom: 14, textAlign: 'center',
            fontFamily: 'var(--font-body)',
          }}>
            {title ?? 'Precios'}
          </p>
          {subtitle && (
            <h2 style={{
              fontFamily: 'var(--font-display)', fontWeight: 800,
              fontSize: 'clamp(28px, 4vw, 52px)',
              color: '#f5f5f7', textAlign: 'center',
              letterSpacing: '-0.025em', lineHeight: 1.1,
              marginBottom: 64,
            }}>
              {subtitle}
            </h2>
          )}
          {!subtitle && <div style={{ marginBottom: 48 }} />}
        </RevealSection>

        <div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 280px))',
  justifyContent: 'center',
  gap: 16,
}}>
          {plans.map((plan, i) => (
            <RevealSection key={i} delay={i * 90}>
              <div style={{
                padding: '36px 28px',
                border: `1px solid ${plan.featured ? accentBorder : 'rgba(255,255,255,0.08)'}`,
                background: plan.featured ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.025)',
                borderRadius: 20,
                position: 'relative', height: '100%',
                display: 'flex', flexDirection: 'column',
              }}>
                {plan.featured && (
                  <span style={{
                    position: 'absolute', top: -1, left: '50%',
                    transform: 'translateX(-50%)',
                    background: accent, color: '#000',
                    fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase',
                    padding: '5px 14px', fontWeight: 600,
                    borderRadius: '0 0 8px 8px',
                    fontFamily: 'var(--font-body)',
                    whiteSpace: 'nowrap',
                  }}>
                    Más popular
                  </span>
                )}
                <p style={{
                  fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: 'rgba(245,245,247,0.4)', marginBottom: 12,
                  fontFamily: 'var(--font-body)', marginTop: plan.featured ? 16 : 0,
                }}>
                  {plan.name}
                </p>
                <p style={{
                  fontFamily: 'var(--font-display)', fontWeight: 800,
                  fontSize: 28, letterSpacing: '-0.02em',
                  color: plan.featured ? accent : '#f5f5f7',
                  marginBottom: 28, lineHeight: 1,
                }}>
                  {plan.price}
                </p>
                <ul style={{
                  listStyle: 'none',
                  display: 'flex', flexDirection: 'column', gap: 11,
                  flex: 1,
                }}>
                  {plan.items.map((item, j) => (
                    <li key={j} style={{
                      fontSize: 13, color: 'rgba(245,245,247,0.5)',
                      display: 'flex', alignItems: 'flex-start', gap: 10,
                      fontFamily: 'var(--font-body)', lineHeight: 1.5,
                    }}>
                      <span style={{ color: accent, flexShrink: 0, marginTop: 1 }}>✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </RevealSection>
          ))}
        </div>

        {note && (
          <RevealSection>
            <p style={{
              marginTop: 32, fontSize: 12, color: 'rgba(245,245,247,0.3)',
              lineHeight: 1.8, maxWidth: 700, margin: '32px auto 0',
              paddingLeft: 20, borderLeft: `2px solid ${accent}40`,
              fontFamily: 'var(--font-body)',
            }}>
              {note}
            </p>
          </RevealSection>
        )}
      </div>
    </section>
  )
}
