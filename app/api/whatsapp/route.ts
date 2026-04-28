import { NextRequest, NextResponse } from 'next/server'
import twilio from 'twilio'

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

const FROM = `whatsapp:${process.env.TWILIO_WHATSAPP_FROM}`

export async function POST(req: NextRequest) {
  try {
    const { to, message } = await req.json()
    if (!to || !message) {
      return NextResponse.json({ error: 'Faltan parámetros' }, { status: 400 })
    }

    await client.messages.create({
      from: FROM,
      to: `whatsapp:${to}`,
      body: message,
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Twilio error:', error)
    return NextResponse.json({ error: 'Error al enviar mensaje' }, { status: 500 })
  }
}