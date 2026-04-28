'use client'
import { useRouter } from 'next/navigation'

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  return (
    <div style={{ minHeight: '100vh', background: '#080808', display: 'flex', flexDirection: 'column' }}>
      {/* Topbar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 40px', borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <button onClick={() => router.push('/')} style={{
          background: 'transparent', border: 'none',
          fontFamily: "'Syne', sans-serif", fontWeight: 800,
          fontSize: 14, letterSpacing: '0.12em', color: '#fff', cursor: 'pointer',
        }}>
          FRANCO<span style={{ color: '#c9b99a' }}>O</span>RP
        </button>
        <span style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)' }}>
          Panel de cliente
        </span>
        <button style={{
          padding: '8px 18px', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 3,
          background: 'transparent', color: 'rgba(255,255,255,0.45)',
          fontFamily: "'DM Sans', sans-serif", fontSize: 11,
          letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer',
        }}>
          Cerrar sesión
        </button>
      </div>

      {/* Main */}
      <main style={{ flex: 1, maxWidth: 900, width: '100%', margin: '0 auto', padding: '60px 40px' }}>
        {children}
      </main>
    </div>
  )
}
