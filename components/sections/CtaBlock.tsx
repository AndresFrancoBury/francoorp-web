import RevealSection from './RevealSection'

interface Props { accent: string; division: string }

export default function CtaBlock({ accent, division }: Props) {
  return (
    <section style={{
      padding: '140px 24px 120px',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      textAlign: 'center',
    }}>
      <RevealSection>
        <p style={{
          fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase',
          color: accent, marginBottom: 20, fontFamily: 'var(--font-body)',
        }}>
          Siguiente paso
        </p>
        <h2 style={{
          fontFamily: 'var(--font-display)', fontWeight: 800,
          fontSize: 'clamp(32px, 5vw, 64px)',
          color: '#f5f5f7', letterSpacing: '-0.03em',
          lineHeight: 1.08, maxWidth: 640, margin: '0 auto 20px',
        }}>
          ¿Listo para empezar con {division}?
        </h2>
        <p style={{
          fontSize: 17, color: 'rgba(245,245,247,0.42)',
          maxWidth: 400, margin: '0 auto 44px',
          lineHeight: 1.65, fontFamily: 'var(--font-body)',
        }}>
          Agenda una llamada gratuita de 30 minutos. Sin compromiso.
        </p>
        <a
          href="mailto:hola@Francoorp.co"
          style={{
            display: 'inline-block',
            padding: '15px 44px',
            background: accent, color: '#000',
            fontFamily: 'var(--font-body)',
            fontSize: 14, letterSpacing: '0.06em',
            fontWeight: 600, borderRadius: 100, textDecoration: 'none',
            transition: 'opacity 0.2s',
          }}
        >
          Agendar llamada →
        </a>
      </RevealSection>
    </section>
  )
}
