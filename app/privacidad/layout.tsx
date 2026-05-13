import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Privacidad',
  description: 'Política de privacidad de Francoorp. Conoce cómo recopilamos, usamos y protegemos tus datos personales conforme a la Ley 1581 de 2012 de Colombia.',
  alternates: { canonical: 'https://www.francoorp.com/privacidad' },
  robots: { index: true, follow: false },
}

export default function PrivacidadLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
