import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'IA — Inteligencia Artificial para Empresas en Colombia',
  description:
    'Herramientas de inteligencia artificial y soluciones personalizadas de IA para empresas en Colombia. Automatiza tu negocio y acelera tu producción de contenido con Francoorp.',
  keywords: [
    'inteligencia artificial empresas Colombia',
    'automatización con IA Bogotá',
    'herramientas IA Colombia',
    'agencia IA Bogotá',
    'soluciones inteligencia artificial',
    'IA para marketing Colombia',
    'chatbot empresas Colombia',
    'generación de contenido con IA',
    'GENPRO IA',
    'agencia digital IA Bogotá',
  ],
  alternates: {
    canonical: 'https://www.francoorp.com/ia',
  },
  openGraph: {
    title: 'Francoorp IA — Inteligencia Artificial para Empresas en Colombia',
    description:
      'Herramientas de IA y soluciones personalizadas de inteligencia artificial. Automatiza tu negocio con Francoorp.',
    url: 'https://www.francoorp.com/ia',
    images: [{ url: '/og-ia.jpg', width: 1200, height: 630, alt: 'Francoorp IA — Inteligencia Artificial Colombia' }],
  },
  twitter: {
    title: 'Francoorp IA — Inteligencia Artificial para Empresas en Colombia',
    description: 'Herramientas de IA y soluciones personalizadas para tu negocio.',
    images: ['/og-ia.jpg'],
  },
}

export default function IALayout({ children }: { children: React.ReactNode }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Inteligencia Artificial — Francoorp IA',
    description:
      'Herramientas de IA y soluciones personalizadas de inteligencia artificial para empresas en Colombia.',
    url: 'https://www.francoorp.com/ia',
    provider: {
      '@type': 'Organization',
      name: 'Francoorp',
      url: 'https://www.francoorp.com',
    },
    areaServed: { '@type': 'Country', name: 'Colombia' },
    serviceType: 'Inteligencia artificial y automatización',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Herramientas de IA Francoorp',
      itemListElement: [
        {
          '@type': 'SoftwareApplication',
          name: 'GENPRO IA',
          applicationCategory: 'BusinessApplication',
          description:
            'Plataforma de generación de contenido con inteligencia artificial para marcas latinas.',
          url: 'https://genproia.netlify.app',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'COP' },
        },
      ],
    },
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
