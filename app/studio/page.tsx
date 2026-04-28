import SectionLayout from '@/components/sections/SectionLayout'
import PortfolioGrid from '@/components/sections/PortfolioGrid'
import ServicesBlock from '@/components/sections/ServicesBlock'
import PricingBlock from '@/components/sections/PricingBlock'
import CtaBlock from '@/components/sections/CtaBlock'
import SectionNav from '@/components/sections/SectionNav'
import Link from 'next/link'

const services = [
  {
    title: 'Edición de video profesional',
    desc: 'Edición básica, estándar, pro y premium para YouTube, Instagram, TikTok y cualquier plataforma. Formatos vertical 9:16 y horizontal 16:9 en Full HD.',
  },
  {
    title: 'Contenido rápido — Reels & TikToks',
    desc: 'Piezas cortas de hasta 60 segundos y hasta 5 minutos, optimizadas para el algoritmo. Retención, ritmo y cortes trabajados al detalle.',
  },
  {
    title: 'VSL & Ads',
    desc: 'Video Sales Letters y piezas publicitarias para Meta Ads y TikTok Ads Manager. Estructura narrativa enfocada en conversión y llamado a la acción.',
  },
  {
    title: 'Video generado con IA',
    desc: 'Producción audiovisual 100% generada con inteligencia artificial. Personajes, escenas, voz y motion — sin necesidad de grabación.',
  },
  {
    title: 'Colorimetría & diseño sonoro',
    desc: 'Corrección de color profesional, gradación cinematográfica y diseño sonoro completo. Disponible en los paquetes Pro y Premium.',
  },
  {
    title: 'Diseño gráfico',
    desc: 'Piezas visuales para redes sociales, presentaciones y campañas digitales. $50.000 COP por pieza, entrega en 24–48 horas.',
  },
]

const pricingEdicion = [
  {
    name: 'Básico',
    price: '$300.000 COP',
    items: [
      'Videos de 5 a 10 minutos',
      'Edición básica: cortes y estructura',
      'Música de fondo',
      'Subtítulos simples',
      'Formato vertical y horizontal',
      '3 correcciones incluidas',
    ],
  },
  {
    name: 'Estándar',
    price: '$450.000 COP',
    items: [
      'Videos de 10 a 30 minutos',
      'Edición más elaborada',
      'Gráficos y textos en pantalla',
      'Transiciones cuidadas',
      'Música y efectos de sonido',
      'Formato vertical y horizontal',
    ],
    featured: true,
  },
  {
    name: 'Pro',
    price: '$600.000 COP',
    items: [
      'Videos de 30 a 45 minutos',
      'Edición profesional completa',
      'Animaciones y motion graphics',
      'Corrección de color',
      'Diseño sonoro',
      'Formato vertical y horizontal',
    ],
  },
  {
    name: 'Premium',
    price: '$800.000 COP',
    items: [
      'Videos de 45 a 60 minutos',
      'Full edición cinematográfica',
      'Colorimetría avanzada',
      'Diseño sonoro profesional',
      'Animaciones con IA integrada',
      'Formato vertical y horizontal',
    ],
  },
]

const pricingRapido = [
  {
    name: 'Reel / TikTok básico',
    price: '$70.000 COP',
    items: [
      'Duración máxima 60 segundos',
      'Full HD (1080x1920 o 1920x1080)',
      'Cortes y música',
      'Formato a elección del cliente',
    ],
  },
  {
    name: 'Reel / TikTok estándar',
    price: '$150.000 COP',
    items: [
      'Duración máxima 2 minutos',
      'Full HD',
      'Gráficos, textos y transiciones',
      'Formato a elección del cliente',
    ],
    featured: true,
  },
  {
    name: 'Short / TikTok largo',
    price: '$250.000 COP',
    items: [
      'Duración máxima 5 minutos',
      'Full HD',
      'Edición completa con efectos',
      'Formato a elección del cliente',
    ],
  },
]

const pricingDiseno = [
  {
    name: 'Pieza gráfica',
    price: '$50.000 COP',
    items: [
      'Diseño a medida para redes o web',
      'Formatos listos para publicar',
      'Entrega en 24–48 horas',
      '1 revisión incluida',
    ],
  },
]

export default function StudioPage() {
  return (
    <>
      

      <SectionLayout
        division="Studio"
        num="01"
        accent="#e8d5b0"
        accentDim="rgba(201,185,154,0.12)"
        tagline="Producción Audiovisual & Diseño"
        headline="Contenido que detiene el scroll y convierte espectadores en clientes."
        bg="radial-gradient(ellipse at 30% 50%, rgba(150,110,60,0.35) 0%, transparent 60%), #0a0805"
      >
        <PortfolioGrid accent="#e8d5b0" />
        <ServicesBlock services={services} accent="#e8d5b0" accentDim="rgba(201,185,154,0.12)" />
        <PricingBlock
          title="Edición de video"
          subtitle="Cuatro niveles de producción. Tú eliges el que necesitas."
          plans={pricingEdicion}
          accent="#e8d5b0"
          accentBorder="rgba(232,213,176,0.45)"
          note="Las producciones están sujetas a 3 correcciones dentro del valor contemplado. A partir de la 4.ª corrección el valor adicional es de $50.000 COP. Videos de más de 60 minutos: $70.000 COP por cada 10 minutos adicionales."
        />
        <PricingBlock
          title="Contenido rápido — Reels & TikToks"
          subtitle="Piezas cortas con impacto máximo."
          plans={pricingRapido}
          accent="#e8d5b0"
          accentBorder="rgba(232,213,176,0.45)"
          note="A partir de la 4.ª corrección el valor adicional es de $10.000 COP. Tiempo adicional de edición: $20.000 COP por minuto extra."
        />
        <PricingBlock
          title="Diseño gráfico"
          subtitle="Una pieza, un precio, sin sorpresas."
          plans={pricingDiseno}
          accent="#e8d5b0"
          accentBorder="rgba(232,213,176,0.45)"
        />
        <CtaBlock accent="#c9b99a" division="Studio" />
      </SectionLayout>

      <SectionNav />
    </>
  )
}