import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Francoorp — Agencia Digital en Bogotá'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#000',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Gradient glow */}
        <div
          style={{
            position: 'absolute',
            width: 600,
            height: 600,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(201,185,154,0.18) 0%, transparent 70%)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
          }}
        />

        {/* Logo text */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: '#f5f5f7',
            letterSpacing: '-0.03em',
            marginBottom: 16,
            display: 'flex',
          }}
        >
          FRANCOORP
        </div>

        {/* Divisions */}
        <div
          style={{
            display: 'flex',
            gap: 24,
            marginBottom: 32,
          }}
        >
          {['Studio', 'Tech', 'IA'].map((div) => (
            <div
              key={div}
              style={{
                fontSize: 18,
                color: '#c9b99a',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                display: 'flex',
              }}
            >
              {div}
            </div>
          ))}
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 20,
            color: 'rgba(245,245,247,0.5)',
            letterSpacing: '0.04em',
            display: 'flex',
          }}
        >
          Agencia Digital · Bogotá, Colombia
        </div>

        {/* Border bottom accent */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 3,
            background: 'linear-gradient(90deg, transparent, #c9b99a, transparent)',
            display: 'flex',
          }}
        />
      </div>
    ),
    { ...size }
  )
}
