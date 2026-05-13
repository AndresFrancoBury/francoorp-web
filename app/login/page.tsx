'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function LoginPage() {
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [mode, setMode] = useState<'login' | 'register'>('login')

  const redirectByRole = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data: profile } = await supabase
      .from('profiles').select('role, email').eq('id', user.id).single()
    const { isAdminAllowed } = await import('@/lib/admin-whitelist')
    const allowed = isAdminAllowed(profile?.email || user.email)
    window.location.href = (profile?.role === 'admin' && allowed) ? '/admin/selector' : '/dashboard'
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) { setError(error.message); setLoading(false); return }
      await redirectByRole()
    } else {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) { setError(error.message); setLoading(false); return }
      window.location.href = '/dashboard'
    }
  }

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` }
    })
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#000',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '24px', fontFamily: 'var(--font-body)',
    }}>

      {/* Nav mínimo */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 40px', height: 64,
        background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)', zIndex: 50,
      }}>
        <Link href="/" style={{
          fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16,
          color: '#f5f5f7', textDecoration: 'none',
        }}>
          FRANCO<span style={{ color: '#c9b99a' }}>O</span>RP
        </Link>
        <Link href="/" style={{
          display: 'flex', alignItems: 'center', gap: 6,
          fontSize: 12, color: 'rgba(245,245,247,0.4)',
          textDecoration: 'none', fontFamily: 'var(--font-body)',
          transition: 'color 0.2s',
        }}>
          ← Volver al inicio
        </Link>
      </div>

      <div style={{
        width: '100%', maxWidth: 420,
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 20, padding: '48px 40px',
        background: 'rgba(255,255,255,0.02)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: 28, letterSpacing: '-0.02em', color: '#f5f5f7',
          }}>
            FRANCO<span style={{ color: '#c9b99a' }}>O</span>RP
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(245,245,247,0.4)', marginTop: 6 }}>
            {mode === 'login' ? 'Accede a tu panel' : 'Crea tu cuenta'}
          </p>
        </div>

        <button onClick={handleGoogle} style={{
          width: '100%', padding: '13px',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 10, background: 'rgba(255,255,255,0.04)',
          color: '#f5f5f7', fontSize: 14, cursor: 'pointer',
          marginBottom: 20, display: 'flex', alignItems: 'center',
          justifyContent: 'center', gap: 10,
          fontFamily: 'var(--font-body)',
        }}>
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
            <path fill="#FBBC05" d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z"/>
            <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z"/>
          </svg>
          Continuar con Google
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
          <span style={{ fontSize: 12, color: 'rgba(245,245,247,0.3)' }}>o</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
        </div>

        <input type="email" placeholder="Correo electrónico" value={email}
          onChange={e => setEmail(e.target.value)}
          style={{
            width: '100%', padding: '13px 16px', marginBottom: 12,
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 10, color: '#f5f5f7', fontSize: 14, outline: 'none',
            fontFamily: 'var(--font-body)', display: 'block',
          }}
        />

        <input type="password" placeholder="Contraseña" value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          style={{
            width: '100%', padding: '13px 16px', marginBottom: 20,
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 10, color: '#f5f5f7', fontSize: 14, outline: 'none',
            fontFamily: 'var(--font-body)', display: 'block',
          }}
        />

        {error && (
          <p style={{ fontSize: 13, color: '#e24b4a', marginBottom: 16, textAlign: 'center' }}>
            {error}
          </p>
        )}

        <button onClick={handleSubmit} disabled={loading} style={{
          width: '100%', padding: '14px',
          background: '#c9b99a', color: '#000',
          border: 'none', borderRadius: 10,
          fontSize: 14, fontWeight: 600, cursor: 'pointer',
          fontFamily: 'var(--font-body)', opacity: loading ? 0.7 : 1,
        }}>
          {loading ? 'Cargando...' : mode === 'login' ? 'Entrar' : 'Crear cuenta'}
        </button>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'rgba(245,245,247,0.35)' }}>
          {mode === 'login' ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
          <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} style={{
            background: 'transparent', border: 'none', color: '#c9b99a',
            cursor: 'pointer', fontSize: 13, fontFamily: 'var(--font-body)',
          }}>
            {mode === 'login' ? 'Regístrate' : 'Inicia sesión'}
          </button>
        </p>
      </div>
    </div>
  )
}