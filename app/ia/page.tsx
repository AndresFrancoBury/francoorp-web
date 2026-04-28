'use client'
import { useEffect, useRef, useState } from 'react'
import SectionNav from '@/components/sections/SectionNav'

const TOOLS = [
  {
    id: 'genpro',
    name: 'GENPRO IA',
    status: 'live',
    tag: 'Disponible',
    description: 'Plataforma de generación de contenido con inteligencia artificial. Crea copies, guiones, captions, estrategias y más en segundos.',
    features: ['Generación de copies publicitarios', 'Guiones para video y reels', 'Estrategias de contenido', 'Captions para redes sociales', 'Optimizado para marcas latinas'],
    url: 'https://genproia.netlify.app',
    color: '#c9b99a',
  },
  {
    id: 'tool2',
    name: 'Próximamente',
    status: 'soon',
    tag: 'En desarrollo',
    description: 'Nueva herramienta de inteligencia artificial en camino. Diseñada para potenciar tu flujo de trabajo creativo y digital.',
    features: ['Funcionalidad en desarrollo', 'Próximamente disponible', 'Notifícate cuando esté lista'],
    url: null,
    color: 'rgba(255,255,255,0.2)',
  },
  {
    id: 'tool3',
    name: 'Próximamente',
    status: 'soon',
    tag: 'En desarrollo',
    description: 'Más herramientas de IA en camino para complementar tu ecosistema digital con Francoorp.',
    features: ['Funcionalidad en desarrollo', 'Próximamente disponible', 'Notifícate cuando esté lista'],
    url: null,
    color: 'rgba(255,255,255,0.2)',
  },
]

export default function IAPage() {
  const [visible, setVisible] = useState<Set<string>>(new Set())
  const refs = useRef<Record<string, HTMLDivElement | null>>({})

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => { entries.forEach(e => { if (e.isIntersecting) setVisible(prev => new Set([...prev, e.target.id])) }) },
      { threshold: 0.1 }
    )
    Object.values(refs.current).forEach(el => el && observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <main style={{ minHeight: '100vh', background: '#000', fontFamily: 'var(--font-body)' }}>

      <section style={{ padding: '140px 24px 80px', textAlign: 'center', maxWidth: 800, margin: '0 auto' }}>
        <p style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c9b99a', marginBottom: 20 }}>Francoorp · IA</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(36px, 6vw, 72px)', color: '#f5f5f7', letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: 24 }}>
          Inteligencia artificial<br /><span style={{ color: '#c9b99a' }}>al servicio de tu marca</span>
        </h1>
        <p style={{ fontSize: 17, color: 'rgba(245,245,247,0.5)', lineHeight: 1.7, maxWidth: 520, margin: '0 auto' }}>
          Accede a nuestras herramientas de IA diseñadas para acelerar tu producción de contenido y automatizar tu negocio.
        </p>
      </section>

      <section style={{ padding: '40px 24px 100px', maxWidth: 1100, margin: '0 auto' }}>
        <div id="genpro" ref={el => { refs.current['genpro'] = el }} style={{ marginBottom: 24, padding: '48px', background: 'rgba(201,185,154,0.05)', border: '1px solid rgba(201,185,154,0.3)', borderRadius: 24, display: 'grid', gridTemplateColumns: '1fr auto', gap: 40, alignItems: 'center', opacity: visible.has('genpro') ? 1 : 0, transform: visible.has('genpro') ? 'translateY(0)' : 'translateY(24px)', transition: 'opacity 0.6s ease, transform 0.6s ease' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <span style={{ fontSize: 11, padding: '4px 12px', borderRadius: 100, background: 'rgba(151,196,89,0.15)', color: '#97c459', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>● Disponible</span>
              <span style={{ fontSize: 11, color: 'rgba(245,245,247,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Herramienta #01</span>
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(28px, 4vw, 44px)', color: '#f5f5f7', letterSpacing: '-0.025em', marginBottom: 12 }}>
              GENPRO <span style={{ color: '#c9b99a' }}>IA</span>
            </h2>
            <p style={{ fontSize: 16, color: 'rgba(245,245,247,0.5)', lineHeight: 1.7, maxWidth: 520, marginBottom: 28 }}>
              Plataforma de generación de contenido con inteligencia artificial. Crea copies, guiones, captions y estrategias en segundos. Optimizado para marcas latinas.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 32 }}>
              {TOOLS[0].features.map((f, i) => (
                <span key={i} style={{ fontSize: 12, padding: '6px 14px', borderRadius: 100, background: 'rgba(255,255,255,0.05)', color: 'rgba(245,245,247,0.5)', border: '1px solid rgba(255,255,255,0.07)' }}>{f}</span>
              ))}
            </div>
            <a href="https://genproia.netlify.app" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '14px 32px', background: '#c9b99a', color: '#000', borderRadius: 100, fontSize: 14, fontWeight: 700, textDecoration: 'none', fontFamily: 'var(--font-display)' }}>
              Abrir GENPRO IA →
            </a>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 160 }}>
            <div style={{ width: 140, height: 140, borderRadius: 28, background: 'rgba(201,185,154,0.08)', border: '1px solid rgba(201,185,154,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: 48 }}>🤖</span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 11, color: '#c9b99a', letterSpacing: '0.1em' }}>GENPRO</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {TOOLS.slice(1).map((tool, i) => (
            <div key={tool.id} id={tool.id} ref={el => { refs.current[tool.id] = el }} style={{ padding: '32px 28px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, opacity: visible.has(tool.id) ? 0.5 : 0, transform: visible.has(tool.id) ? 'translateY(0)' : 'translateY(20px)', transition: `opacity 0.6s ease ${i * 0.1}s, transform 0.6s ease ${i * 0.1}s`, filter: 'grayscale(1)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: 0, backdropFilter: 'blur(1px)', zIndex: 1 }} />
              <div style={{ position: 'relative', zIndex: 2 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <span style={{ fontSize: 11, padding: '4px 12px', borderRadius: 100, background: 'rgba(255,255,255,0.08)', color: 'rgba(245,245,247,0.4)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>○ En desarrollo</span>
                  <span style={{ fontSize: 11, color: 'rgba(245,245,247,0.2)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Herramienta #{String(i + 2).padStart(2, '0')}</span>
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 24, color: 'rgba(245,245,247,0.3)', marginBottom: 12 }}>Próximamente</h3>
                <p style={{ fontSize: 13, color: 'rgba(245,245,247,0.25)', lineHeight: 1.6, marginBottom: 24 }}>Nueva herramienta de inteligencia artificial en camino.</p>
                <div style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
                  <span style={{ fontSize: 12, color: 'rgba(245,245,247,0.25)', fontFamily: 'var(--font-body)' }}>🔒 Disponible pronto</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: '60px 24px 120px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 580, margin: '0 auto' }}>
          <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c9b99a', marginBottom: 16 }}>¿Tienes una idea?</p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(26px, 4vw, 44px)', color: '#f5f5f7', letterSpacing: '-0.025em', marginBottom: 16 }}>
            Desarrollamos tu herramienta<br />de IA a medida
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(245,245,247,0.4)', marginBottom: 36, lineHeight: 1.6 }}>Creamos soluciones de inteligencia artificial personalizadas para tu negocio.</p>
          <a href="https://wa.me/573165053518?text=Hola%2C%20me%20interesa%20desarrollar%20una%20herramienta%20de%20IA%20personalizada" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '16px 36px', background: '#c9b99a', color: '#000', borderRadius: 100, fontSize: 15, fontWeight: 700, textDecoration: 'none', fontFamily: 'var(--font-display)' }}>
            💬 Hablemos por WhatsApp
          </a>
        </div>
      </section>

      <SectionNav />
    </main>
  )
}