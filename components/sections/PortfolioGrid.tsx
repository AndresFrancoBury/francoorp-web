'use client'
import RevealSection from './RevealSection'

const youtubeProjects = [
  {
    id: 'qeekML0q8yE',
    title: 'Proyecto 01',
    label: 'Vídeo · YouTube',
  },
  {
    id: 'S7JSXbrz1bY',
    title: 'Proyecto 02',
    label: 'Vídeo · YouTube',
  },
  {
    id: 'iLDkYtuGovE',
    title: 'Proyecto 03',
    label: 'Vídeo · YouTube',
  },
]

export default function PortfolioGrid({ accent }: { accent: string }) {
  const emptySlots = [4, 5, 6]

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
          {/* YouTube cards */}
          {youtubeProjects.map((project, i) => (
            <RevealSection key={project.id} delay={i * 60}>
              <a
                href={`https://www.youtube.com/watch?v=${project.id}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none', display: 'block' }}
              >
                <div
                  style={{
                    aspectRatio: '16/10',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 16,
                    cursor: 'pointer',
                    transition: 'border-color 0.3s, transform 0.3s',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLDivElement
                    el.style.borderColor = 'rgba(255,255,255,0.25)'
                    el.style.transform = 'scale(1.02)'
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLDivElement
                    el.style.borderColor = 'rgba(255,255,255,0.08)'
                    el.style.transform = 'scale(1)'
                  }}
                >
                  {/* Thumbnail */}
                  <img
                    src={`https://img.youtube.com/vi/${project.id}/hqdefault.jpg`}
                    alt={project.title}
                    style={{
                      position: 'absolute', inset: 0,
                      width: '100%', height: '100%',
                      objectFit: 'cover',
                      borderRadius: 16,
                    }}
                  />

                  {/* Overlay oscuro */}
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)',
                    borderRadius: 16,
                  }} />

                  {/* Botón play */}
                  <div style={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 48, height: 48,
                    background: 'rgba(255,0,0,0.85)',
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <div style={{
                      width: 0, height: 0,
                      borderTop: '9px solid transparent',
                      borderBottom: '9px solid transparent',
                      borderLeft: '16px solid #fff',
                      marginLeft: 4,
                    }} />
                  </div>

                  {/* Info en la parte inferior */}
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    padding: '16px 20px',
                  }}>
                    <p style={{
                      fontFamily: 'var(--font-body)', fontSize: 10,
                      letterSpacing: '0.14em', textTransform: 'uppercase',
                      color: accent, marginBottom: 4,
                    }}>
                      {project.label}
                    </p>
                    <p style={{
                      fontFamily: 'var(--font-body)', fontWeight: 500,
                      fontSize: 13, color: 'rgba(255,255,255,0.9)',
                      letterSpacing: '0.04em',
                    }}>
                      {project.title}
                    </p>
                  </div>
                </div>
              </a>
            </RevealSection>
          ))}

          {/* Slots vacíos */}
          {emptySlots.map((i, idx) => (
            <RevealSection key={i} delay={(idx + 3) * 60}>
              <div
                style={{
                  aspectRatio: '16/10',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 16,
                  display: 'flex', alignItems: 'flex-end',
                  padding: '20px 24px', cursor: 'default',
                  position: 'relative', overflow: 'hidden',
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
