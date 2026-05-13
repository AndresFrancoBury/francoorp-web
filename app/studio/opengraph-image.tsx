import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Francoorp Studio — Producción Audiovisual en Bogotá'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div style={{ background: '#0a0805', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif', position: 'relative' }}>
        <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(150,110,60,0.25) 0%, transparent 70%)', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', display: 'flex' }} />
        <div style={{ fontSize: 14, color: '#c9b99a', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 20, display: 'flex' }}>Francoorp · 01</div>
        <div style={{ fontSize: 68, fontWeight: 800, color: '#f5f5f7', letterSpacing: '-0.03em', marginBottom: 16, display: 'flex' }}>Studio</div>
        <div style={{ fontSize: 22, color: '#e8d5b0', marginBottom: 12, display: 'flex' }}>Producción Audiovisual & Diseño</div>
        <div style={{ fontSize: 18, color: 'rgba(245,245,247,0.45)', display: 'flex' }}>Bogotá, Colombia</div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, transparent, #e8d5b0, transparent)', display: 'flex' }} />
      </div>
    ),
    { ...size }
  )
}
