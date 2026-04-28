'use client'
import { usePathname } from 'next/navigation'

const SECTION_LABELS: Record<string, string> = {
  '/studio': 'Studio',
  '/tech': 'Tech',
  '/ia': 'IA',
  '/dashboard': 'Cliente',
  '/admin': 'Admin',
  '/login': '',
  '/seguimiento': 'Seguimiento',
}

export default function ContextualLogo() {
  const pathname = usePathname()
  const section = Object.keys(SECTION_LABELS).find(key => pathname.startsWith(key))
  const label = section ? SECTION_LABELS[section] : ''

  return (
    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, color: '#f5f5f7' }}>
      FRANCO<span style={{ color: '#c9b99a' }}>O</span>RP
      {label && (
        <span style={{ marginLeft: 10, fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(245,245,247,0.3)', fontFamily: 'var(--font-body)', fontWeight: 400 }}>
          {label}
        </span>
      )}
    </span>
  )
}