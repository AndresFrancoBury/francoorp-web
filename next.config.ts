import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Compresión y optimización de imágenes
  compress: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 días
  },

  // Headers de seguridad y SEO
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Fuerza HTTPS — importante para el SEO
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          // Evita que Google indexe versiones en iframe
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          // Protección XSS
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Permisos para web vitals
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      // Cache agresivo para assets estáticos — mejora Core Web Vitals
      {
        source: '/(.*)\\.(ico|png|jpg|jpeg|gif|svg|webp|avif|woff|woff2|ttf|otf)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ]
  },

  // Redirigir www → canonical (sin www duplicado)
  async redirects() {
    return [
      {
        source: '/',
        has: [{ type: 'host', value: 'francoorp.com' }],
        destination: 'https://www.francoorp.com/',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
