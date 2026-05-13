import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/dashboard/', '/api/', '/auth/', '/login/', '/seguimiento/'],
      },
    ],
    sitemap: 'https://www.francoorp.com/sitemap.xml',
    host: 'https://www.francoorp.com',
  }
}
