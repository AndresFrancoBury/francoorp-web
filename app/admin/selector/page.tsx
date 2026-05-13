'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { isAdminAllowed } from '@/lib/admin-whitelist'

export default function AdminSelectorPage() {
  const router = useRouter()
  const supabase = createClient()
  const [checking, setChecking] = useState(true)
  const [name, setName] = useState('')

  useEffect(() => {
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      // El email viene de auth.users (user.email), no de profiles
      const userEmail = user.email ?? ''

      const { data: profile } = await supabase
        .from('profiles').select('role, name, full_name').eq('id', user.id).single()

      if (profile?.role !== 'admin' || !isAdminAllowed(userEmail)) {
        router.push('/dashboard')
        return
      }
      setName(profile?.full_name || profile?.name || userEmail || 'Admin')
      setChecking(false)
    }
    check()
  }, [])

  if (checking) return (
    <div style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(245,245,247,0.4)', fontFamily: 'var(--font-body)' }}>
      Cargando...
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#000', fontFamily: 'var(--font-body)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, padding: '18px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 50 }}>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16, color: '#f5f5f7' }}>
          FRANCO<span style={{ color: '#c9b99a' }}>O</span>RP
          <span style={{ marginLeft: 10, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(245,245,247,0.3)', fontFamily: 'var(--font-body)', fontWeight: 400 }}>Admin</span>
        </span>
        <button
          onClick={async () => { await supabase.auth.signOut(); router.push('/login') }}
          style={{ padding: '8px 16px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, background: 'transparent', color: 'rgba(245,245,247,0.4)', fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font-body)' }}
        >
          Cerrar sesión
        </button>
      </nav>

      <div style={{ width: '100%', maxWidth: 560, textAlign: 'center' }}>
        <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(245,245,247,0.3)', marginBottom: 12 }}>
          Bienvenido, {name}
        </p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(26px, 6vw, 44px)', color: '#f5f5f7', letterSpacing: '-0.025em', marginBottom: 8 }}>
          ¿Qué panel quieres gestionar?
        </h1>
        <p style={{ fontSize: 14, color: 'rgba(245,245,247,0.35)', marginBottom: 40, lineHeight: 1.6 }}>
          Selecciona la división con la que quieres trabajar hoy.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
          <button
            onClick={() => router.push('/admin?tab=studio')}
            style={{ padding: '36px 24px', background: 'rgba(232,213,176,0.05)', border: '1px solid rgba(232,213,176,0.25)', borderRadius: 20, cursor: 'pointer', textAlign: 'center', transition: 'border-color 0.2s, background 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(232,213,176,0.5)'; e.currentTarget.style.background = 'rgba(232,213,176,0.08)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(232,213,176,0.25)'; e.currentTarget.style.background = 'rgba(232,213,176,0.05)' }}
          >
            <div style={{ fontSize: 32, marginBottom: 14 }}>🎬</div>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, color: '#e8d5b0', marginBottom: 8 }}>Studio</p>
            <p style={{ fontSize: 13, color: 'rgba(245,245,247,0.4)', lineHeight: 1.6 }}>Producción audiovisual, edición de video y diseño gráfico</p>
          </button>

          <button
            onClick={() => router.push('/admin?tab=tech')}
            style={{ padding: '36px 24px', background: 'rgba(122,180,232,0.05)', border: '1px solid rgba(122,180,232,0.25)', borderRadius: 20, cursor: 'pointer', textAlign: 'center', transition: 'border-color 0.2s, background 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(122,180,232,0.5)'; e.currentTarget.style.background = 'rgba(122,180,232,0.08)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(122,180,232,0.25)'; e.currentTarget.style.background = 'rgba(122,180,232,0.05)' }}
          >
            <div style={{ fontSize: 32, marginBottom: 14 }}>⚙️</div>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, color: '#7ab4e8', marginBottom: 8 }}>Tech</p>
            <p style={{ fontSize: 13, color: 'rgba(245,245,247,0.4)', lineHeight: 1.6 }}>Desarrollo web, apps, automatizaciones y seguimiento de proyectos</p>
          </button>
        </div>

        <button
          onClick={() => router.push('/admin')}
          style={{ marginTop: 16, padding: '10px 24px', background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, color: 'rgba(245,245,247,0.3)', fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font-body)' }}
        >
          Ver todos los proyectos →
        </button>
      </div>
    </div>
  )
}
