import type { Metadata } from 'next'
import HomeClient from '@/components/home/HomeClient'

export const metadata: Metadata = {
  title: 'Francoorp | Agencia Digital en Bogotá — Studio, Tech & IA',
  description:
    'Agencia digital en Bogotá especializada en producción audiovisual, desarrollo web y soluciones de inteligencia artificial. Transforma tu marca con Francoorp.',
  alternates: { canonical: 'https://www.francoorp.com' },
}

export default function HomePage() {
  return (
    <>
      {/* Contenido semántico para rastreadores — visible solo para SEO */}
      <div className="sr-only" aria-hidden="false">
        <h1>Francoorp — Agencia Digital en Bogotá</h1>
        <p>
          Somos una agencia digital con sede en Bogotá, Colombia, especializada en tres divisiones:
          producción audiovisual (Studio), desarrollo web y apps (Tech) e inteligencia artificial (IA).
        </p>
        <nav aria-label="Divisiones de Francoorp">
          <ul>
            <li><a href="/studio">Studio — Producción Audiovisual y Diseño Gráfico en Bogotá</a></li>
            <li><a href="/tech">Tech — Desarrollo Web, Apps y Automatizaciones en Colombia</a></li>
            <li><a href="/ia">IA — Inteligencia Artificial para Empresas en Colombia</a></li>
          </ul>
        </nav>
        <section>
          <h2>Producción Audiovisual en Bogotá</h2>
          <p>
            Nuestro equipo de Studio ofrece edición de video profesional, Reels y TikToks,
            Video Sales Letters (VSL), contenido generado con inteligencia artificial,
            colorimetría cinematográfica y diseño gráfico para marcas y emprendedores en Colombia.
          </p>
        </section>
        <section>
          <h2>Desarrollo Web y Apps en Bogotá</h2>
          <p>
            En Francoorp Tech construimos landing pages, sitios web corporativos, tiendas e-commerce,
            aplicaciones móviles para Android e iOS y automatizaciones empresariales.
            Usamos Next.js, Supabase, TypeScript y Vercel para garantizar velocidad y escalabilidad.
          </p>
        </section>
        <section>
          <h2>Inteligencia Artificial para Empresas en Colombia</h2>
          <p>
            Francoorp IA desarrolla herramientas de inteligencia artificial y soluciones personalizadas
            para acelerar la producción de contenido y automatizar procesos de negocio.
            Nuestra herramienta GENPRO IA permite crear copies, guiones y estrategias en segundos.
          </p>
        </section>
        <address>
          <p>Francoorp — Bogotá, Colombia</p>
          <a href="mailto:gerencia@francoorp.com">gerencia@francoorp.com</a>
          <a href="tel:+573165053518">+57 316 505 3518</a>
        </address>
      </div>

      {/* UI interactiva (client component) */}
      <HomeClient />
    </>
  )
}
