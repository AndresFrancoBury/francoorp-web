'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const links = [
  { href: '/studio', label: 'Studio' },
  { href: '/tech', label: 'Tech' },
  { href: '/ia', label: 'IA' },
  { href: '/dashboard', label: 'Zona Clientes' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 md:px-7 py-4 border-b border-white/10 backdrop-blur-md bg-[#0a0a0a]/80">
        <Link href="/" className="font-syne font-extrabold text-base tracking-widest text-[var(--fc-text)]">
          FRANC<span className="text-[var(--fc-gold)]">O</span>RP
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map(({ href, label }) => (
            <Link key={href} href={href}
              className={`text-xs uppercase tracking-widest transition-colors ${
                pathname.startsWith(href) ? 'text-[var(--fc-gold)]' : 'text-white/50 hover:text-white'
              }`}>
              {label}
            </Link>
          ))}
        </div>

        <Link href="/#contacto"
          className="hidden md:block text-xs uppercase tracking-widest px-5 py-2.5 border border-white/25 rounded-sm text-white hover:border-[var(--fc-gold)] hover:text-[var(--fc-gold)] transition-colors">
          Agendar llamada
        </Link>

        {/* Hamburger */}
        <button onClick={() => setOpen(!open)}
          className="md:hidden flex flex-col gap-[5px] p-2" aria-label="Menú">
          <span className={`block w-5 h-[1.5px] bg-white transition-all duration-300 ${open ? 'rotate-45 translate-y-[6.5px]' : ''}`} />
          <span className={`block w-5 h-[1.5px] bg-white transition-all duration-300 ${open ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-[1.5px] bg-white transition-all duration-300 ${open ? '-rotate-45 -translate-y-[6.5px]' : ''}`} />
        </button>
      </nav>

      {/* Mobile menu overlay */}
      <div className={`fixed inset-0 z-40 bg-[#0a0a0a] flex flex-col justify-center items-center gap-8 transition-all duration-500 md:hidden ${
        open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}>
        {links.map(({ href, label }) => (
          <Link key={href} href={href} onClick={() => setOpen(false)}
            className="font-syne font-bold text-3xl tracking-widest text-white hover:text-[var(--fc-gold)] transition-colors">
            {label}
          </Link>
        ))}
        <Link href="/#contacto" onClick={() => setOpen(false)}
          className="mt-4 text-xs uppercase tracking-widest px-6 py-3 border border-white/25 rounded-sm text-white">
          Agendar llamada
        </Link>
      </div>
    </>
  )
}