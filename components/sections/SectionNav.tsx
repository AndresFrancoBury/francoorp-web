'use client'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'

const SECTIONS = [
  { href: '/studio', label: 'Studio' },
  { href: '/tech', label: 'Tech' },
  { href: '/ia', label: 'IA' },
]

export default function SectionNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px', height: 64,
        background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        {/* Logo */}
        <Link href="/" style={{
          fontFamily: 'var(--font-display)', fontWeight: 800,
          fontSize: 15, color: '#f5f5f7', textDecoration: 'none', letterSpacing: '0.02em',
          flexShrink: 0,
        }}>
          FRANCO<span style={{ color: '#c9b99a' }}>O</span>RP
        </Link>

        {/* Tabs centrados — solo desktop */}
        <div className="section-tabs" style={{
          position: 'absolute', left: '50%', transform: 'translateX(-50%)',
          display: 'flex', gap: 4,
        }}>
          {SECTIONS.map(s => {
            const isActive = pathname === s.href
            return (
              <Link key={s.href} href={s.href} style={{
                padding: '8px 20px', borderRadius: 100, textDecoration: 'none',
                background: isActive ? 'rgba(201,185,154,0.15)' : 'transparent',
                color: isActive ? '#c9b99a' : 'rgba(245,245,247,0.45)',
                fontSize: 13, fontWeight: isActive ? 600 : 400,
                fontFamily: 'var(--font-body)',
                border: isActive ? '1px solid rgba(201,185,154,0.4)' : '1px solid transparent',
                transition: 'all 0.2s',
              }}>
                {s.label}
              </Link>
            )
          })}
        </div>

        {/* Zona Clientes — solo desktop */}
        <Link href="/login" className="zona-clientes-btn" style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '8px 20px',
          background: 'rgba(201,185,154,0.08)',
          border: '1px solid rgba(201,185,154,0.25)',
          borderRadius: 100, textDecoration: 'none',
          color: '#c9b99a', fontSize: 12, fontWeight: 600,
          fontFamily: 'var(--font-body)', letterSpacing: '0.04em',
          transition: 'all 0.2s', flexShrink: 0,
        }}>
          <span style={{ fontSize: 13 }}>👤</span>
          Zona Clientes
        </Link>

        {/* Hamburguesa — solo móvil */}
        <button
          className="section-hamburger"
          onClick={() => setOpen(!open)}
          style={{
            background: 'transparent', border: 'none',
            cursor: 'pointer', padding: 6,
            display: 'none', flexDirection: 'column', gap: 5,
            WebkitTapHighlightColor: 'transparent',
          }}
          aria-label="Menú"
        >
          <span style={{ display: 'block', width: 20, height: 1.5, background: '#fff', transition: 'all 0.3s', transform: open ? 'rotate(45deg) translateY(6.5px)' : 'none' }} />
          <span style={{ display: 'block', width: 20, height: 1.5, background: '#fff', transition: 'all 0.3s', opacity: open ? 0 : 1 }} />
          <span style={{ display: 'block', width: 20, height: 1.5, background: '#fff', transition: 'all 0.3s', transform: open ? 'rotate(-45deg) translateY(-6.5px)' : 'none' }} />
        </button>
      </nav>

      {/* Menú móvil desplegable */}
      {open && (
        <div style={{
          position: 'fixed', top: 64, left: 0, right: 0, zIndex: 99,
          background: 'rgba(8,8,8,0.98)', backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          display: 'flex', flexDirection: 'column',
        }}>
          {SECTIONS.map(s => {
            const isActive = pathname === s.href
            return (
              <Link key={s.href} href={s.href} onClick={() => setOpen(false)} style={{
                padding: '16px 24px', textDecoration: 'none',
                color: isActive ? '#c9b99a' : 'rgba(245,245,247,0.6)',
                fontSize: 15, fontFamily: 'var(--font-body)',
                fontWeight: isActive ? 600 : 400,
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                background: isActive ? 'rgba(201,185,154,0.05)' : 'transparent',
              }}>
                {s.label}
              </Link>
            )
          })}
          <Link href="/login" onClick={() => setOpen(false)} style={{
            padding: '16px 24px', textDecoration: 'none',
            color: '#c9b99a', fontSize: 15,
            fontFamily: 'var(--font-body)', fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span>👤</span> Zona Clientes
          </Link>
        </div>
      )}

      <style>{`
        @media (max-width: 640px) {
          .section-tabs { display: none !important; }
          .zona-clientes-btn { display: none !important; }
          .section-hamburger { display: flex !important; }
        }
      `}</style>
    </>
  )
}
