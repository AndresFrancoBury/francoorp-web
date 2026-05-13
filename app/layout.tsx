import type { Metadata, Viewport } from 'next'
import './globals.css'

const BASE_URL = 'https://www.francoorp.com'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Francoorp | Agencia Digital en Bogotá — Studio, Tech & IA',
    template: '%s | Francoorp — Agencia Digital Bogotá',
  },
  description:
    'Agencia digital en Bogotá especializada en producción audiovisual, desarrollo web y soluciones de inteligencia artificial. Transforma tu marca con Francoorp.',
  keywords: [
    'agencia digital Bogotá',
    'desarrollo web Bogotá',
    'producción audiovisual Colombia',
    'inteligencia artificial empresas Colombia',
    'agencia IA Bogotá',
    'diseño web Colombia',
    'edición de video profesional',
    'apps móviles Colombia',
    'automatización con IA',
    'agencia tech Bogotá',
    'Francoorp',
  ],
  authors: [{ name: 'Francoorp', url: BASE_URL }],
  creator: 'Francoorp',
  publisher: 'Francoorp',
  category: 'technology',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
    languages: { 'es-CO': BASE_URL },
  },
  openGraph: {
    type: 'website',
    locale: 'es_CO',
    url: BASE_URL,
    siteName: 'Francoorp',
    title: 'Francoorp | Agencia Digital en Bogotá — Studio, Tech & IA',
    description:
      'Agencia digital en Bogotá especializada en producción audiovisual, desarrollo web y soluciones de inteligencia artificial.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Francoorp — Agencia Digital en Bogotá',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Francoorp | Agencia Digital en Bogotá',
    description:
      'Producción audiovisual, desarrollo web e inteligencia artificial. Bogotá, Colombia.',
    images: ['/og-image.jpg'],
    creator: '@francoorp',
    site: '@francoorp',
  },
  verification: {
    google: 'REEMPLAZAR_CON_TU_GOOGLE_VERIFICATION_CODE',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

const schemaOrg = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['Organization', 'LocalBusiness'],
      '@id': `${BASE_URL}/#organization`,
      name: 'Francoorp',
      url: BASE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/logo.png`,
        width: 200,
        height: 60,
      },
      image: `${BASE_URL}/og-image.jpg`,
      description:
        'Agencia digital en Bogotá especializada en producción audiovisual, desarrollo web e inteligencia artificial.',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Bogotá',
        addressRegion: 'Cundinamarca',
        addressCountry: 'CO',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 4.711,
        longitude: -74.0721,
      },
      email: 'gerencia@francoorp.com',
      telephone: '+573165053518',
      priceRange: '$$',
      openingHours: 'Mo-Fr 09:00-18:00',
      sameAs: [
        'https://www.instagram.com/francoorp',
        'https://x.com/francoorp',
      ],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Servicios Francoorp',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Producción Audiovisual',
              description:
                'Edición de video profesional, Reels, TikToks, VSL y contenido generado con IA.',
              url: `${BASE_URL}/studio`,
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Desarrollo Web y Apps',
              description:
                'Landing pages, webs corporativas, e-commerce, apps móviles y automatizaciones.',
              url: `${BASE_URL}/tech`,
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Inteligencia Artificial',
              description:
                'Herramientas de IA y soluciones personalizadas de inteligencia artificial para empresas.',
              url: `${BASE_URL}/ia`,
            },
          },
        ],
      },
    },
    {
      '@type': 'WebSite',
      '@id': `${BASE_URL}/#website`,
      url: BASE_URL,
      name: 'Francoorp',
      description: 'Agencia digital en Bogotá — Studio, Tech & IA',
      publisher: { '@id': `${BASE_URL}/#organization` },
      inLanguage: 'es-CO',
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${BASE_URL}/search?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-CO">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
