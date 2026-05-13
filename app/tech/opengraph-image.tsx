import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Francoorp Tech — Desarrollo Web y Apps en Bogotá'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div style={{ background: '#000510', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif', position: 'relative' }}>
        <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(60,100,180,0.2) 0%, transparent 70%)', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', display: 'flex' }} />
        <div style={{ fontSize: 14, color: '#a8cdf0', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 20, display: 'flex' }}>Francoorp · 02</div>
        <div style={{ fontSize: 68, fontWeight: 800, color: '#f5f5f7', letterSpacing: '-0.03em', marginBottom: 16, display: 'flex' }}>Tech</div>
        <div style={{ fontSize: 22, color: '#a8cdf0', marginBottom: 12, display: 'flex' }}>Desarrollo Web, Apps & Automatizaciones</div>
        <div style={{ fontSize: 18, color: 'rgba(245,245,247,0.45)', display: 'flex' }}>Bogotá, Colombia</div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, transparent, #a8cdf0, transparent)', display: 'flex' }} />
      </div>
    ),
    { ...size }
  )
}
