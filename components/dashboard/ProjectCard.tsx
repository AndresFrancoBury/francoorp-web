type Status = 'pending' | 'in_progress' | 'delivered'
type PaymentStatus = 'paid' | 'pending'

interface Project {
  id: string; name: string
  status: Status; payment: PaymentStatus; updated: string
}

const STATUS_LABELS: Record<Status, string> = {
  pending: 'Pendiente',
  in_progress: 'En proceso',
  delivered: 'Entregado',
}
const STATUS_COLORS: Record<Status, string> = {
  pending: 'rgba(201,185,154,0.15)',
  in_progress: 'rgba(122,180,232,0.15)',
  delivered: 'rgba(151,196,89,0.15)',
}
const STATUS_TEXT: Record<Status, string> = {
  pending: '#c9b99a',
  in_progress: '#7ab4e8',
  delivered: '#97c459',
}

export default function ProjectCard({ project }: { project: Project }) {
  const locked = project.payment === 'pending'

  return (
    <div style={{
      padding: '24px 28px', border: '1px solid rgba(255,255,255,0.06)',
      background: 'rgba(255,255,255,0.02)', position: 'relative',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      gap: 16, flexWrap: 'wrap',
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <h3 style={{
          fontFamily: "'Syne', sans-serif", fontWeight: 700,
          fontSize: 16, color: locked ? 'rgba(255,255,255,0.3)' : '#fff',
          letterSpacing: '-0.01em',
        }}>
          {project.name}
        </h3>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.06em' }}>
          Actualizado {project.updated}
        </span>
      </div>

      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        {/* Payment */}
        <span style={{
          padding: '5px 12px', borderRadius: 2, fontSize: 10,
          letterSpacing: '0.12em', textTransform: 'uppercase',
          background: locked ? 'rgba(226,75,74,0.12)' : 'rgba(151,196,89,0.12)',
          color: locked ? '#e24b4a' : '#97c459',
        }}>
          {locked ? 'Pago pendiente' : 'Pagado'}
        </span>

        {/* Status */}
        <span style={{
          padding: '5px 12px', borderRadius: 2, fontSize: 10,
          letterSpacing: '0.12em', textTransform: 'uppercase',
          background: STATUS_COLORS[project.status],
          color: STATUS_TEXT[project.status],
        }}>
          {STATUS_LABELS[project.status]}
        </span>

        {/* Lock icon if unpaid */}
        {locked && (
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)' }} title="Acceso restringido">
            🔒
          </span>
        )}
      </div>
    </div>
  )
}
