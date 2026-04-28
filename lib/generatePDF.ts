import jsPDF from 'jspdf'

interface CuentaCobroData {
  clientName: string
  clientEmail: string
  clientDocument?: string
  clientPhone?: string
  clientAddress?: string
  projectName: string
  serviceType: string
  videosQuantity: number
  pricePerUnit: number
  totalPrice: number
  invoiceNumber: string
  date: string
}

export function generateCuentaCobro(data: CuentaCobroData) {
  const doc = new jsPDF()
  const gold = [201, 185, 154] as [number, number, number]
  const dark = [10, 10, 10] as [number, number, number]
  const gray = [120, 120, 120] as [number, number, number]

  doc.setFillColor(...dark)
  doc.rect(0, 0, 210, 297, 'F')

  doc.setFillColor(...gold)
  doc.rect(0, 0, 210, 3, 'F')

  doc.setTextColor(...gold)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(22)
  doc.text('Francoorp', 20, 25)

  doc.setTextColor(...gray)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.text('PRODUCCIÓN AUDIOVISUAL', 20, 32)

  doc.setFontSize(8)
  doc.text('producciones.Francoorp@gmail.com  ·  316 505 3518', 190, 25, { align: 'right' })

  doc.setDrawColor(...gold)
  doc.setLineWidth(0.3)
  doc.line(20, 38, 190, 38)

  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(18)
  doc.text('CUENTA DE COBRO', 105, 52, { align: 'center' })

  doc.setFontSize(9)
  doc.setTextColor(...gray)
  doc.text(`NO. ${data.invoiceNumber}`, 20, 64)
  doc.text(`Fecha de emisión: ${data.date}`, 190, 64, { align: 'right' })

  doc.setDrawColor(40, 40, 40)
  doc.line(20, 70, 190, 70)

  // PRESTADOR
  doc.setTextColor(...gold)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.text('PRESTADOR DE SERVICIOS', 20, 82)
  doc.setDrawColor(...gold)
  doc.setLineWidth(0.2)
  doc.line(20, 84, 90, 84)

  const prestadorRows = [
    ['Nombre', 'Andrés Franco'],
    ['CC / NIT', '1.104.711.258-2'],
    ['RUT', '1104711258-2'],
    ['Email', 'producciones.Francoorp@gmail.com'],
    ['Teléfono', '316 505 3518'],
  ]

  let y = 92
  for (const [label, value] of prestadorRows) {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(...gray)
    doc.text(label, 20, y)
    doc.setTextColor(220, 220, 220)
    doc.text(value, 70, y)
    y += 7
  }

  // CLIENTE
  doc.setTextColor(...gold)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.text('CLIENTE / PAGADOR', 110, 82)
  doc.setDrawColor(...gold)
  doc.line(110, 84, 190, 84)

  const clientRows: [string, string][] = [
    ['Nombre', data.clientName || '—'],
    ['Email', data.clientEmail || '—'],
  ]
  if (data.clientDocument) clientRows.push(['CC / NIT', data.clientDocument])
  if (data.clientPhone) clientRows.push(['Teléfono', data.clientPhone])
  if (data.clientAddress) clientRows.push(['Dirección', data.clientAddress])

  y = 92
  for (const [label, value] of clientRows) {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(...gray)
    doc.text(label, 110, y)
    doc.setTextColor(220, 220, 220)
    doc.text(value.substring(0, 30), 145, y)
    y += 7
  }

  doc.setDrawColor(40, 40, 40)
  doc.line(20, 140, 190, 140)

  // SERVICIOS
  doc.setTextColor(...gold)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.text('DESCRIPCIÓN DE SERVICIOS', 20, 152)

  doc.setFillColor(25, 25, 25)
  doc.rect(20, 157, 170, 8, 'F')
  doc.setTextColor(...gold)
  doc.setFontSize(8)
  doc.text('SERVICIO / CONCEPTO', 24, 163)
  doc.text('CANT.', 120, 163, { align: 'center' })
  doc.text('VALOR UNIT.', 152, 163, { align: 'right' })
  doc.text('TOTAL', 186, 163, { align: 'right' })

  doc.setFillColor(15, 15, 15)
  doc.rect(20, 165, 170, 9, 'F')
  doc.setTextColor(220, 220, 220)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.text(data.serviceType || data.projectName, 24, 171)
  doc.text(String(data.videosQuantity), 120, 171, { align: 'center' })
  doc.text(`$${data.pricePerUnit.toLocaleString('es-CO')}`, 152, 171, { align: 'right' })
  doc.text(`$${data.totalPrice.toLocaleString('es-CO')}`, 186, 171, { align: 'right' })

  doc.setDrawColor(...gold)
  doc.setLineWidth(0.3)
  doc.line(20, 182, 190, 182)

  doc.setFillColor(20, 20, 20)
  doc.rect(120, 184, 70, 10, 'F')
  doc.setTextColor(...gold)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.text('TOTAL COP', 124, 191)
  doc.text(`$${data.totalPrice.toLocaleString('es-CO')}`, 186, 191, { align: 'right' })

  // DATOS DE PAGO
  doc.setDrawColor(40, 40, 40)
  doc.line(20, 205, 190, 205)

  doc.setTextColor(...gold)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.text('DATOS DE PAGO', 20, 217)
  doc.setDrawColor(...gold)
  doc.setLineWidth(0.2)
  doc.line(20, 219, 80, 219)

  const pagoRows = [
    ['Banco', 'Nu Bank'],
    ['Tipo', 'Cuenta de Ahorros'],
    ['Llave', '@AFB258'],
    ['Titular', 'Andrés Felipe Franco Buriticá'],
  ]

  y = 227
  for (const [label, value] of pagoRows) {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(...gray)
    doc.text(label, 20, y)
    doc.setTextColor(220, 220, 220)
    doc.text(value, 60, y)
    y += 7
  }

  doc.setTextColor(...gray)
  doc.setFontSize(7.5)
  doc.setFont('helvetica', 'italic')
  doc.text('✦ Los pagos deben realizarse antes de empezar la ejecución del servicio prestado.', 20, 262)

  doc.setDrawColor(50, 50, 50)
  doc.line(20, 275, 80, 275)
  doc.line(120, 275, 180, 275)

  doc.setTextColor(...gray)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.5)
  doc.text('Andrés Franco · Francoorp', 50, 281, { align: 'center' })
  doc.text('Prestador de Servicios', 50, 286, { align: 'center' })
  doc.text('Cliente · Firma y sello', 150, 281, { align: 'center' })

  doc.setTextColor(60, 60, 60)
  doc.setFontSize(7)
  doc.text('Andrés Franco · CC 1.104.711.258-2 · RUT 1104711258-2', 105, 293, { align: 'center' })

  doc.setFillColor(...gold)
  doc.rect(0, 294, 210, 3, 'F')

  doc.save(`CuentaCobro_${data.invoiceNumber}.pdf`)
}
