export async function sendWhatsApp(to: string, message: string) {
  if (!to) return
  try {
    await fetch('/api/whatsapp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, message }),
    })
  } catch (error) {
    console.error('WhatsApp error:', error)
  }
}

export const WA_MESSAGES = {
  materialReceived: (projectName: string) =>
    `✅ *Francoorp Studio*\n\nHemos recibido tu material para el proyecto *${projectName}*.\n\nEmpezaremos a trabajar en él pronto. Te notificaremos cuando haya novedades. 🎬`,

  statusChanged: (projectName: string, status: string) => {
    const statusMap: Record<string, string> = {
      in_progress: '🎬 *En edición*',
      review: '👀 *En revisión*',
      delivered: '✅ *Entregado*',
    }
    return `📢 *Francoorp Studio*\n\nHay una actualización en tu proyecto *${projectName}*.\n\nEstado actual: ${statusMap[status] || status}\n\nSi tienes alguna duda, responde este mensaje.`
  },

  delivered: (projectName: string, link: string) =>
    `🎉 *Francoorp Studio*\n\n¡Tu proyecto *${projectName}* está listo!\n\n📥 Descarga tu video aquí:\n${link}\n\nGracias por confiar en nosotros. 🙌`,

  techStageUpdated: (projectName: string, stage: string, note?: string, trackingUrl?: string) => {
    const stageLabels: Record<string, string> = {
      discovery: '🔍 Descubrimiento',
      design: '🎨 Diseño',
      development: '⚙️ Desarrollo',
      review: '👀 Revisión',
      adjustments: '🔧 Ajustes',
      deploy: '🚀 Despliegue',
      delivered: '✅ Entregado',
      received: '📥 Material recibido',
      in_progress: '🎬 En edición',
    }
    const label = stageLabels[stage] || stage
    let msg = `📊 *Francoorp*\n\nActualización de tu proyecto *${projectName}*\n\n${label}`
    if (note) msg += `\n\n📝 ${note}`
    if (trackingUrl) msg += `\n\n🔗 Seguimiento en tiempo real:\n${trackingUrl}`
    return msg
  },
}