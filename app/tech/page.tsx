'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import SectionNav from '@/components/sections/SectionNav'

const PROJECTS = [
  {
    id: 'nua-spa',
    title: 'Nüa Spa & Wellness',
    category: 'Landing Page · Demo',
    description: 'Sitio web a medida para spa de lujo. Diseño premium, animaciones suaves y experiencia de usuario de primer nivel — construido en Next.js y desplegado en Vercel.',
    url: 'https://nua-spa.vercel.app/',
    stack: ['Next.js', 'Tailwind CSS', 'Vercel'],
    featured: true,
  },
]

const SERVICES = [
  {
    id: 'landing',
    category: 'Desarrollo Web',
    name: 'Landing Page',
    price: '1.200.000',
    duration: '1 – 2 semanas',
    description: 'Página de alto impacto diseñada para convertir visitantes en clientes. Ideal para lanzar un producto, servicio o campaña publicitaria.',
    includes: ['Diseño a medida en Figma', 'Desarrollo con Next.js', 'SEO básico integrado', 'Formulario de contacto', 'Optimizada para móvil', '3 rondas de revisión'],
  },
  {
    id: 'corporate',
    category: 'Desarrollo Web',
    name: 'Web Corporativa',
    price: '3.500.000',
    duration: '3 – 4 semanas',
    description: 'Sitio profesional completo para tu empresa o emprendimiento. Diseño exclusivo, contenido optimizado y presencia digital sólida.',
    includes: ['Hasta 6 secciones', 'Diseño responsive', 'SEO técnico completo', 'Blog integrado', 'Integración Google Analytics', 'Formularios y WhatsApp'],
    featured: true,
  },
  {
    id: 'platform',
    category: 'Desarrollo Web',
    name: 'Plataforma a Medida',
    price: 'Desde 10.000.000',
    duration: '6 – 12 semanas',
    description: 'Sistema web completo con usuarios, roles, bases de datos y paneles de gestión. Para negocios que necesitan más que una página.',
    includes: ['Arquitectura escalable', 'Autenticación y roles', 'Panel de administración', 'Base de datos en tiempo real', 'Integraciones API', 'Despliegue en producción'],
  },
  {
    id: 'ecommerce-basic',
    category: 'Tiendas Online',
    name: 'E-commerce Básico',
    price: '4.500.000',
    duration: '3 – 5 semanas',
    description: 'Tienda online lista para vender. Con pasarela de pago, carrito de compras y gestión de productos desde un panel intuitivo.',
    includes: ['Hasta 50 productos', 'Carrito de compras', 'Pasarela de pago (PSE / tarjeta)', 'Panel de pedidos', 'Catálogo con filtros', 'Checkout optimizado'],
  },
  {
    id: 'ecommerce-advanced',
    category: 'Tiendas Online',
    name: 'E-commerce Avanzado',
    price: 'Desde 9.000.000',
    duration: '6 – 10 semanas',
    description: 'Plataforma de ventas completa con inventario, logística, cupones y análisis de ventas. Para negocios con alto volumen.',
    includes: ['Catálogo ilimitado', 'Gestión de inventario', 'Múltiples pasarelas de pago', 'Integración logística', 'Cupones y descuentos', 'Dashboard de ventas'],
  },
  {
    id: 'app',
    category: 'Apps',
    name: 'App Móvil',
    price: 'Desde 6.000.000',
    duration: '8 – 16 semanas',
    description: 'Aplicación móvil para Android e iOS. Diseño nativo, rendimiento optimizado y publicación en tiendas oficiales.',
    includes: ['Android + iOS', 'Diseño UI/UX a medida', 'Autenticación de usuarios', 'Notificaciones push', 'Integración con APIs', 'Publicación en stores'],
  },
  {
    id: 'automation-basic',
    category: 'Automatizaciones',
    name: 'Flujo Básico',
    price: '800.000',
    duration: '3 – 5 días',
    description: 'Automatiza tareas repetitivas de tu negocio. Notificaciones, formularios automáticos, respuestas y más.',
    includes: ['Hasta 3 flujos automatizados', 'Integración WhatsApp', 'Notificaciones por correo', 'Formularios inteligentes', 'Reportes automáticos', 'Documentación incluida'],
  },
  {
    id: 'automation-advanced',
    category: 'Automatizaciones',
    name: 'Automatización Avanzada',
    price: 'Desde 2.000.000',
    duration: '1 – 3 semanas',
    description: 'Integra múltiples sistemas y automatiza flujos complejos de negocio. CRM, facturación, inventario y más conectados.',
    includes: ['Integración entre sistemas', 'Workflows personalizados', 'CRM automatizado', 'Facturación electrónica', 'Dashboards en tiempo real', 'Soporte post-entrega'],
  },
]

const STACK = [
  { name: 'Next.js', desc: 'Framework React para webs ultrarrápidas', icon: '⚡' },
  { name: 'Supabase', desc: 'Base de datos y auth en tiempo real', icon: '🗄️' },
  { name: 'TypeScript', desc: 'Código robusto y escalable', icon: '🔷' },
  { name: 'Tailwind CSS', desc: 'Diseño moderno y responsivo', icon: '🎨' },
  { name: 'Twilio', desc: 'Automatizaciones y notificaciones WhatsApp', icon: '💬' },
  { name: 'Vercel', desc: 'Deploy y hosting profesional', icon: '🚀' },
]

const CATEGORIES = ['Todos', 'Desarrollo Web', 'Tiendas Online', 'Apps', 'Automatizaciones']

export default function TechPage() {
  const [activeCategory, setActiveCategory] = useState('Todos')
  const [visible, setVisible] = useState<Set<string>>(new Set())
  const refs = useRef<Record<string, HTMLDivElement | null>>({})
  const router = useRouter()
  const [projectId, setProjectId] = useState('')
  const [trackingError, setTrackingError] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => { entries.forEach(e => { if (e.isIntersecting) setVisible(prev => new Set([...prev, e.target.id])) }) },
      { threshold: 0.1 }
    )
    Object.values(refs.current).forEach(el => el && observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const filtered = activeCategory === 'Todos' ? SERVICES : SERVICES.filter(s => s.category === activeCategory)

  return (
    <main style={{ minHeight: '100vh', background: '#000', fontFamily: 'var(--font-body)' }}>

      {/* HERO */}
      <section style={{ padding: '140px 24px 80px', textAlign: 'center', maxWidth: 800, margin: '0 auto' }}>
        <p style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c9b99a', marginBottom: 20 }}>Francoorp · Tech</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(36px, 6vw, 72px)', color: '#f5f5f7', letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: 24 }}>
          Tecnología que<br /><span style={{ color: '#c9b99a' }}>trabaja por ti</span>
        </h1>
        <p style={{ fontSize: 17, color: 'rgba(245,245,247,0.5)', lineHeight: 1.7, maxWidth: 560, margin: '0 auto 40px' }}>
          Desarrollamos webs, apps, tiendas online y automatizaciones con el stack más moderno del mercado. Código limpio, entregas a tiempo.
        </p>
        <a href="#proyectos" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 32px', background: '#c9b99a', color: '#000', borderRadius: 100, fontSize: 14, fontWeight: 700, textDecoration: 'none', fontFamily: 'var(--font-display)' }}>
          Ver proyectos
        </a>
      </section>

      {/* PROYECTOS */}
      <section id="proyectos" style={{ padding: '0 24px 80px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', paddingTop: 80 }}>
          <p style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c9b99a', marginBottom: 12, textAlign: 'center' }}>Portafolio</p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(28px, 4vw, 44px)', color: '#f5f5f7', letterSpacing: '-0.025em', marginBottom: 16, textAlign: 'center' }}>
            Proyectos reales
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(245,245,247,0.4)', maxWidth: 500, margin: '0 auto 56px', textAlign: 'center', lineHeight: 1.7 }}>
            Esto es lo que puedes lograr con un sitio web a medida. Cada proyecto es único, construido desde cero para el cliente.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr',
maxWidth: 600,
margin: '0 auto', gap: 16 }}>
            {PROJECTS.map(project => (
              <a
                key={project.id}
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none', display: 'block' }}
              >
                <div style={{
                  background: 'rgba(201,185,154,0.04)',
                  border: '1px solid rgba(201,185,154,0.2)',
                  borderRadius: 20,
                  overflow: 'hidden',
                  transition: 'border-color 0.3s, transform 0.3s',
                  cursor: 'pointer',
                }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLDivElement
                    el.style.borderColor = 'rgba(201,185,154,0.5)'
                    el.style.transform = 'translateY(-4px)'
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLDivElement
                    el.style.borderColor = 'rgba(201,185,154,0.2)'
                    el.style.transform = 'translateY(0)'
                  }}
                >
                  {/* Preview iframe */}
                  <div style={{ width: '100%', aspectRatio: '16/9', position: 'relative', overflow: 'hidden', background: '#0a0a0a' }}>
                    <iframe
                      src={project.url}
                      title={project.title}
                      style={{
                        width: '200%',
                        height: '200%',
                        border: 'none',
                        transform: 'scale(0.5)',
                        transformOrigin: 'top left',
                        pointerEvents: 'none',
                      }}
                      loading="lazy"
                    />
                    {/* Overlay con CTA */}
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'rgba(0,0,0,0)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'background 0.3s',
                    }}
                      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(0,0,0,0.4)' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(0,0,0,0)' }}
                    >
                      <span style={{
                        fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase',
                        color: '#fff', background: 'rgba(0,0,0,0.7)',
                        padding: '8px 18px', borderRadius: 100,
                        opacity: 0, transition: 'opacity 0.3s',
                        pointerEvents: 'none',
                      }}
                        className="preview-label"
                      >
                        Ver sitio →
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div style={{ padding: '24px 28px 28px' }}>
                    <p style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#c9b99a', marginBottom: 8 }}>
                      {project.category}
                    </p>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, color: '#f5f5f7', marginBottom: 10 }}>
                      {project.title}
                    </h3>
                    <p style={{ fontSize: 13, color: 'rgba(245,245,247,0.45)', lineHeight: 1.7, marginBottom: 16 }}>
                      {project.description}
                    </p>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {project.stack.map(tech => (
                        <span key={tech} style={{
                          fontSize: 11, padding: '3px 10px',
                          border: '1px solid rgba(201,185,154,0.2)',
                          color: 'rgba(201,185,154,0.6)',
                          borderRadius: 100, letterSpacing: '0.04em',
                        }}>
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICIOS */}
      <section id="servicios" style={{ padding: '0 24px 48px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', paddingTop: 80 }}>
          <p style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c9b99a', marginBottom: 12, textAlign: 'center' }}>Servicios</p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(28px, 4vw, 44px)', color: '#f5f5f7', letterSpacing: '-0.025em', marginBottom: 48, textAlign: 'center' }}>
            ¿Qué necesitas construir?
          </h2>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 56 }}>
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)} style={{ padding: '9px 20px', borderRadius: 100, fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: activeCategory === cat ? 600 : 400, background: activeCategory === cat ? '#c9b99a' : 'rgba(255,255,255,0.05)', color: activeCategory === cat ? '#000' : 'rgba(245,245,247,0.5)', border: activeCategory === cat ? 'none' : '1px solid rgba(255,255,255,0.08)', transition: 'all 0.2s' }}>
                {cat}
              </button>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
            {filtered.map(s => (
              <div key={s.id} id={s.id} ref={el => { refs.current[s.id] = el }} style={{ padding: '32px 28px', background: s.featured ? 'rgba(201,185,154,0.06)' : 'rgba(255,255,255,0.02)', border: `1px solid ${s.featured ? 'rgba(201,185,154,0.35)' : 'rgba(255,255,255,0.07)'}`, borderRadius: 20, position: 'relative', opacity: visible.has(s.id) ? 1 : 0, transform: visible.has(s.id) ? 'translateY(0)' : 'translateY(20px)', transition: 'opacity 0.5s ease, transform 0.5s ease' }}>
                {s.featured && <span style={{ position: 'absolute', top: -1, left: '50%', transform: 'translateX(-50%)', background: '#c9b99a', color: '#000', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '4px 16px', borderRadius: '0 0 8px 8px', fontWeight: 700, fontFamily: 'var(--font-body)', whiteSpace: 'nowrap' }}>Más solicitado</span>}
                <p style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#c9b99a', marginBottom: 10, fontFamily: 'var(--font-body)' }}>{s.category}</p>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, color: '#f5f5f7', marginBottom: 6 }}>{s.name}</h3>
                <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, color: '#c9b99a', marginBottom: 6 }}>${s.price} COP</p>
                <p style={{ fontSize: 11, color: 'rgba(245,245,247,0.3)', marginBottom: 16 }}>⏱ {s.duration}</p>
                <p style={{ fontSize: 13, color: 'rgba(245,245,247,0.5)', lineHeight: 1.6, marginBottom: 20 }}>{s.description}</p>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 28 }}>
                  {s.includes.map((item, i) => (
                    <li key={i} style={{ fontSize: 12, color: 'rgba(245,245,247,0.5)', display: 'flex', gap: 8, alignItems: 'flex-start', lineHeight: 1.5 }}>
                      <span style={{ color: '#c9b99a', flexShrink: 0 }}>✓</span>{item}
                    </li>
                  ))}
                </ul>
                <a href={`https://wa.me/573165053518?text=Hola%2C%20me%20interesa%20el%20servicio%20de%20${encodeURIComponent(s.name)}`} target="_blank" rel="noopener noreferrer" style={{ display: 'block', padding: '11px', background: s.featured ? '#c9b99a' : 'rgba(201,185,154,0.08)', border: s.featured ? 'none' : '1px solid rgba(201,185,154,0.25)', borderRadius: 10, textAlign: 'center', fontSize: 13, fontWeight: 600, color: s.featured ? '#000' : '#c9b99a', textDecoration: 'none', fontFamily: 'var(--font-body)' }}>
                  Solicitar cotización →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STACK */}
      <section style={{ padding: '80px 24px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c9b99a', marginBottom: 12 }}>Stack</p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(28px, 4vw, 44px)', color: '#f5f5f7', letterSpacing: '-0.025em', marginBottom: 16 }}>Tecnología de primer nivel</h2>
          <p style={{ fontSize: 15, color: 'rgba(245,245,247,0.4)', maxWidth: 500, margin: '0 auto 56px' }}>
            Usamos las herramientas más modernas del mercado para garantizar velocidad, seguridad y escalabilidad.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
            {STACK.map(s => (
              <div key={s.name} style={{ padding: '20px 24px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left' }}>
                <span style={{ fontSize: 28 }}>{s.icon}</span>
                <div>
                  <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: '#f5f5f7', marginBottom: 3 }}>{s.name}</p>
                  <p style={{ fontSize: 12, color: 'rgba(245,245,247,0.4)' }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEGUIMIENTO DE PROYECTO */}
      <section id="seguimiento" style={{ padding: '80px 24px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#a8cdf0', marginBottom: 12 }}>Seguimiento</p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(28px, 4vw, 44px)', color: '#f5f5f7', letterSpacing: '-0.025em', marginBottom: 16 }}>
            ¿Tienes un proyecto en curso?
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(245,245,247,0.45)', lineHeight: 1.7, maxWidth: 480, margin: '0 auto 40px' }}>
            Ingresa el ID de tu proyecto para ver en qué fase estamos, las tareas completadas y el progreso en tiempo real.
          </p>

          <div style={{ display: 'flex', gap: 10, maxWidth: 460, margin: '0 auto', flexWrap: 'wrap', justifyContent: 'center' }}>
            <input
              type="text"
              placeholder="ID de tu proyecto"
              value={projectId}
              onChange={e => { setProjectId(e.target.value); setTrackingError(false) }}
              onKeyDown={e => {
                if (e.key === 'Enter' && projectId.trim()) {
                  router.push(`/seguimiento/${projectId.trim()}`)
                }
              }}
              style={{
                flex: 1, minWidth: 240,
                padding: '14px 18px',
                background: 'rgba(168,205,240,0.06)',
                border: `1px solid ${trackingError ? 'rgba(226,75,74,0.5)' : 'rgba(168,205,240,0.25)'}`,
                borderRadius: 12, color: '#f5f5f7', fontSize: 14,
                outline: 'none', fontFamily: 'var(--font-body)',
                letterSpacing: '0.04em',
              }}
            />
            <button
              onClick={() => {
                if (!projectId.trim()) { setTrackingError(true); return }
                router.push(`/seguimiento/${projectId.trim()}`)
              }}
              style={{
                padding: '14px 28px', background: '#a8cdf0', color: '#000',
                border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700,
                cursor: 'pointer', fontFamily: 'var(--font-display)', whiteSpace: 'nowrap',
              }}
            >
              Ver estado →
            </button>
          </div>

          {trackingError && (
            <p style={{ fontSize: 13, color: '#e24b4a', marginTop: 12 }}>
              Por favor ingresa el ID de tu proyecto.
            </p>
          )}

          <p style={{ fontSize: 12, color: 'rgba(245,245,247,0.25)', marginTop: 16 }}>
            Encontrarás el ID en el WhatsApp que te enviamos al iniciar tu proyecto.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 24px 120px', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(28px, 4vw, 48px)', color: '#f5f5f7', letterSpacing: '-0.025em', marginBottom: 16 }}>¿Tienes un proyecto en mente?</h2>
          <p style={{ fontSize: 16, color: 'rgba(245,245,247,0.4)', marginBottom: 36, lineHeight: 1.6 }}>Cuéntanos tu idea y te damos una cotización sin costo en menos de 24 horas.</p>
          <a href="https://wa.me/573165053518?text=Hola%2C%20tengo%20un%20proyecto%20tech%20y%20me%20gustar%C3%ADa%20una%20cotizaci%C3%B3n" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '16px 36px', background: '#c9b99a', color: '#000', borderRadius: 100, fontSize: 15, fontWeight: 700, textDecoration: 'none', fontFamily: 'var(--font-display)' }}>
            💬 Cotizar por WhatsApp
          </a>
        </div>
      </section>

      <SectionNav />
    </main>
  )
}
