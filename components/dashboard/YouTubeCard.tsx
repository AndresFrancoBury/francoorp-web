'use client'

interface YouTubeProfile {
  youtube_channel_id?: string | null
  youtube_channel_name?: string | null
  youtube_channel_description?: string | null
  youtube_channel_thumbnail?: string | null
  youtube_subscribers?: number | null
  youtube_video_count?: number | null
  youtube_view_count?: number | null
  youtube_connected_at?: string | null
}

interface Props {
  profile: YouTubeProfile
  onDisconnect?: () => void
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toLocaleString()
}

export default function YouTubeCard({ profile, onDisconnect }: Props) {
  const isConnected = !!profile.youtube_channel_id

  if (!isConnected) {
    return (
      <div style={{
        padding: '28px', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 20, background: 'rgba(255,255,255,0.02)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: 'rgba(255,0,0,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20,
          }}>
            ▶
          </div>
          <div>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: '#f5f5f7' }}>
              Canal de YouTube
            </p>
            <p style={{ fontSize: 12, color: 'rgba(245,245,247,0.35)', fontFamily: 'var(--font-body)' }}>
              No conectado
            </p>
          </div>
        </div>

        <p style={{ fontSize: 13, color: 'rgba(245,245,247,0.4)', lineHeight: 1.6, marginBottom: 20, fontFamily: 'var(--font-body)' }}>
          Conecta tu canal para que Francoorp pueda ver tus estadísticas y brindarte un mejor servicio.
        </p>

        <a
          href="/api/youtube/connect"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '11px 24px',
            background: 'rgba(255,0,0,0.1)',
            border: '1px solid rgba(255,0,0,0.3)',
            borderRadius: 10, textDecoration: 'none',
            color: '#ff6b6b', fontSize: 13, fontWeight: 600,
            fontFamily: 'var(--font-body)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(255,0,0,0.18)'
            e.currentTarget.style.borderColor = 'rgba(255,0,0,0.5)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(255,0,0,0.1)'
            e.currentTarget.style.borderColor = 'rgba(255,0,0,0.3)'
          }}
        >
          <span>▶</span>
          Conectar canal de YouTube
        </a>
      </div>
    )
  }

  return (
    <div style={{
      border: '1px solid rgba(255,0,0,0.15)',
      borderRadius: 20, overflow: 'hidden',
      background: 'rgba(255,0,0,0.04)',
    }}>
      {/* Header del canal */}
      <div style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: 16 }}>
        {profile.youtube_channel_thumbnail ? (
          <img
            src={profile.youtube_channel_thumbnail}
            alt={profile.youtube_channel_name || ''}
            style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
          />
        ) : (
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,0,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>
            ▶
          </div>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, color: '#f5f5f7', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {profile.youtube_channel_name}
            </p>
            <span style={{ padding: '2px 8px', background: 'rgba(255,0,0,0.15)', borderRadius: 100, fontSize: 10, color: '#ff6b6b', letterSpacing: '0.08em', fontFamily: 'var(--font-body)', whiteSpace: 'nowrap' }}>
              ✓ Conectado
            </span>
          </div>
          {profile.youtube_channel_id && (
            <a
              href={`https://youtube.com/channel/${profile.youtube_channel_id}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: 12, color: 'rgba(245,245,247,0.35)', fontFamily: 'var(--font-body)', textDecoration: 'none' }}
            >
              youtube.com/channel/{profile.youtube_channel_id.slice(0, 12)}...
            </a>
          )}
        </div>
      </div>

      {/* Estadísticas */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}>
        {[
          { label: 'Suscriptores', value: formatNumber(profile.youtube_subscribers || 0), icon: '👥' },
          { label: 'Videos', value: formatNumber(profile.youtube_video_count || 0), icon: '🎬' },
          { label: 'Vistas totales', value: formatNumber(profile.youtube_view_count || 0), icon: '👁' },
        ].map((stat, i) => (
          <div key={i} style={{
            padding: '16px', textAlign: 'center',
            borderRight: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none',
          }}>
            <p style={{ fontSize: 16, marginBottom: 4 }}>{stat.icon}</p>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, color: '#f5f5f7', marginBottom: 2 }}>
              {stat.value}
            </p>
            <p style={{ fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(245,245,247,0.3)', fontFamily: 'var(--font-body)' }}>
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Descripción */}
      {profile.youtube_channel_description && (
        <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <p style={{ fontSize: 12, color: 'rgba(245,245,247,0.35)', lineHeight: 1.6, fontFamily: 'var(--font-body)', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {profile.youtube_channel_description}
          </p>
        </div>
      )}

      {/* Footer */}
      <div style={{ padding: '12px 24px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <p style={{ fontSize: 11, color: 'rgba(245,245,247,0.2)', fontFamily: 'var(--font-body)' }}>
          {profile.youtube_connected_at
            ? `Conectado el ${new Date(profile.youtube_connected_at).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })}`
            : 'Canal conectado'}
        </p>
        <div style={{ display: 'flex', gap: 8 }}>
          <a href="/api/youtube/connect" style={{ fontSize: 11, color: 'rgba(245,245,247,0.3)', fontFamily: 'var(--font-body)', textDecoration: 'none' }}>
            Reconectar
          </a>
          {onDisconnect && (
            <button onClick={onDisconnect} style={{ fontSize: 11, color: 'rgba(245,245,247,0.3)', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
              · Desconectar
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
