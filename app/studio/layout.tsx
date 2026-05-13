import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Studio — Producción Audiovisual & Diseño en Bogotá',
  description:
    'Edición de video profesional, Reels, TikToks, VSL, video generado con IA y diseño gráfico. Producción audiovisual de alta calidad en Bogotá, Colombia.',
  keywords: [
    'producción audiovisual Bogotá',
    'edición de video profesional Colombia',
    'reels y tiktoks Bogotá',
    'video marketing Colombia',
    'VSL video ventas',
    'diseño gráfico Bogotá',
    'contenido para redes sociales Colombia',
    'video generado con IA',
    'agencia audiovisual Bogotá',
  ],
  alternates: {
    canonical: 'https://www.francoorp.com/studio',
  },
  openGraph: {
    title: 'Francoorp Studio — Producción Audiovisual en Bogotá',
    description:
      'Edición de video profesional, Reels, TikToks, VSL y contenido generado con IA. Cotiza tu producción audiovisual.',
    url: 'https://www.francoorp.com/studio',
    images: [{ url: '/og-studio.jpg', width: 1200, height: 630, alt: 'Francoorp Studio — Producción Audiovisual' }],
  },
  twitter: {
    title: 'Francoorp Studio — Producción Audiovisual en Bogotá',
    description: 'Edición de video profesional, Reels, TikToks y video con IA.',
    images: ['/og-studio.jpg'],
  },
}

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Producción Audiovisual — Francoorp Studio',
    description:
      'Edición de video profesional, Reels, TikToks, VSL, video generado con IA y diseño gráfico en Bogotá, Colombia.',
    url: 'https://www.francoorp.com/studio',
    provider: {
      '@type': 'Organization',
      name: 'Francoorp',
      url: 'https://www.francoorp.com',
    },
    areaServed: { '@type': 'Country', name: 'Colombia' },
    serviceType: 'Producción audiovisual y diseño gráfico',
    offers: [
      { '@type': 'Offer', name: 'Edición de video Básico', price: '300000', priceCurrency: 'COP' },
      { '@type': 'Offer', name: 'Edición de video Estándar', price: '450000', priceCurrency: 'COP' },
      { '@type': 'Offer', name: 'Edición de video Pro', price: '600000', priceCurrency: 'COP' },
      { '@type': 'Offer', name: 'Edición de video Premium', price: '800000', priceCurrency: 'COP' },
      { '@type': 'Offer', name: 'Reel / TikTok básico', price: '70000', priceCurrency: 'COP' },
      { '@type': 'Offer', name: 'Pieza gráfica', price: '50000', priceCurrency: 'COP' },
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
