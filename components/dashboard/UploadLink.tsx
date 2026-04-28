'use client'
import { useState } from 'react'

interface Props {
  links: string[]
  onAdd: (url: string) => void
}

export default function UploadLink({ links, onAdd }: Props) {
  const [val, setVal] = useState('')

  const handleAdd = () => {
    if (!val.trim()) return
    onAdd(val.trim())
    setVal('')
  }

  return (
    <div style={{
      padding: '32px 28px', border: '1px solid rgba(255,255,255,0.06)',
      background: 'rgba(255,255,255,0.02)',
    }}>
      <h3 style={{
        fontFamily: "'Syne', sans-serif", fontWeight: 700,
        fontSize: 16, color: '#fff', marginBottom: 20, letterSpacing: '-0.01em',
      }}>
        Subir recursos
      </h3>
      <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginBottom: 20 }}>
        Pega links de Google Drive, Dropbox o cualquier servicio de archivos.
      </p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <input
          type="url"
          value={val}
          onChange={e => setVal(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          placeholder="https://drive.google.com/..."
          style={{
            flex: 1, padding: '10px 16px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)', borderRadius: 3,
            color: '#fff', fontFamily: "'DM Sans', sans-serif", fontSize: 13,
            outline: 'none',
          }}
        />
        <button
          onClick={handleAdd}
          style={{
            padding: '10px 24px', background: '#c9b99a', color: '#000',
            border: 'none', borderRadius: 3, fontFamily: "'DM Sans', sans-serif",
            fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase',
            fontWeight: 500, cursor: 'pointer',
          }}
        >
          Agregar
        </button>
      </div>

      {links.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {links.map((link, i) => (
            <a key={i} href={link} target="_blank" rel="noopener noreferrer" style={{
              fontSize: 12, color: 'rgba(255,255,255,0.4)', padding: '8px 12px',
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 2, textDecoration: 'none', overflow: 'hidden',
              textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {link}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
