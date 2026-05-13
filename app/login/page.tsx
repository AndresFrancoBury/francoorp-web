'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { isAdminAllowed } from '@/lib/admin-whitelist'

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
    const email = profile?.email || user.email
    if (profile?.role === 'admin' && isAdminAllowed(email)) {
      window.location.href = '/admin/selector'
    } else {
      window.location.href = '/dashboard'
    }
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

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '14px 16px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 10, color: '#f5f5f7', fontSize: 14,
    outline: 'none', fontFamily: 'var(--font-body)',
    boxSizing: 'border-box',
  }

  return (
    <div style={{ minHeight: '100vh', background: '#000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: 'var(--font-body)' }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, color: '#f5f5f7', letterSpacing: '0.04em' }}>
            FRANCO<span style={{ color: '#c9b99a' }}>O</span>RP
          </p>
          <p style={{ fontSize: 12, color: 'rgba(245,245,247,0.3)', marginTop: 6, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            {mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
          </p>
        </div>

        {/* Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            type="email" placeholder="Correo electrónico"
            value={email} onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            style={inputStyle}
          />
          <input
            type="password" placeholder="Contraseña"
            value={password} onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            style={inputStyle}
          />

          {error && (
            <p style={{ fontSize: 13, color: '#e24b4a', padding: '10px 14px', background: 'rgba(226,75,74,0.08)', borderRadius: 8, border: '1px solid rgba(226,75,74,0.2)' }}>
              {error}
            </p>
          )}

          <button
            onClick={handleSubmit} disabled={loading}
            style={{ padding: '14px', background: '#c9b99a', color: '#000', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-display)', opacity: loading ? 0.7 : 1, marginTop: 4 }}
          >
            {loading ? 'Cargando...' : mode === 'login' ? 'Entrar' : 'Crear cuenta'}
          </button>

          <button
            onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}
            style={{ padding: '12px', background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, fontSize: 13, color: 'rgba(245,245,247,0.4)', cursor: 'pointer', fontFamily: 'var(--font-body)' }}
          >
            {mode === 'login' ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
          </button>
        </div>
      </div>
    </div>
  )
}
