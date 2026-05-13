import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tech — Desarrollo Web, Apps y Automatizaciones en Bogotá',
  description:
    'Desarrollo de landing pages, webs corporativas, e-commerce, apps móviles y automatizaciones con IA en Bogotá, Colombia. Stack moderno: Next.js, Supabase y Vercel.',
  keywords: [
    'desarrollo web Bogotá',
    'agencia desarrollo web Colombia',
    'landing page Bogotá',
    'tienda online Colombia',
    'apps móviles Bogotá',
    'desarrollo Next.js Colombia',
    'automatizaciones empresas Colombia',
    'software a medida Bogotá',
    'e-commerce Colombia',
    'plataforma digital a medida',
  ],
  alternates: {
    canonical: 'https://www.francoorp.com/tech',
  },
  openGraph: {
    title: 'Francoorp Tech — Desarrollo Web y Apps en Bogotá',
    description:
      'Landing pages, webs corporativas, e-commerce, apps móviles y automatizaciones. Tecnología que trabaja por ti.',
    url: 'https://www.francoorp.com/tech',
    images: [{ url: '/og-tech.jpg', width: 1200, height: 630, alt: 'Francoorp Tech — Desarrollo Web en Bogotá' }],
  },
  twitter: {
    title: 'Francoorp Tech — Desarrollo Web y Apps en Bogotá',
    description: 'Landing pages, e-commerce, apps móviles y automatizaciones en Colombia.',
    images: ['/og-tech.jpg'],
  },
}

export default function TechLayout({ children }: { children: React.ReactNode }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Desarrollo Web y Apps — Francoorp Tech',
    description:
      'Landing pages, webs corporativas, e-commerce, apps móviles y automatizaciones en Bogotá, Colombia.',
    url: 'https://www.francoorp.com/tech',
    provider: {
      '@type': 'Organization',
      name: 'Francoorp',
      url: 'https://www.francoorp.com',
    },
    areaServed: { '@type': 'Country', name: 'Colombia' },
    serviceType: 'Desarrollo de software y aplicaciones web',
    offers: [
      { '@type': 'Offer', name: 'Landing Page', price: '1200000', priceCurrency: 'COP' },
      { '@type': 'Offer', name: 'Web Corporativa', price: '3500000', priceCurrency: 'COP' },
      { '@type': 'Offer', name: 'E-commerce Básico', price: '4500000', priceCurrency: 'COP' },
      { '@type': 'Offer', name: 'App Móvil', price: '6000000', priceCurrency: 'COP' },
      { '@type': 'Offer', name: 'Flujo de Automatización Básico', price: '800000', priceCurrency: 'COP' },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      {children}
    </>
  )
}
