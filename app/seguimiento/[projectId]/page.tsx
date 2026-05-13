'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Project = {
  id: string
  name: string
  service_type: string
  status: string
  estimated_days: number
  created_at: string
  division: string
}

type ChecklistItem = {
  id: string
  item_key: string
  completed: boolean
  completed_at: string | null
}

type Update = {
  id: string
  stage: string
  note: string | null
  created_at: string
}

const formatBogota = (dateStr: string, showTime = false) => {
  const d = new Date(dateStr)
  if (showTime) {
    return d.toLocaleString('es-CO', {
      timeZone: 'America/Bogota',
      day: 'numeric', month: 'short',
      hour: '2-digit', minute: '2-digit', hour12: true,
    })
  }
  return d.toLocaleDateString('es-CO', {
    timeZone: 'America/Bogota',
    day: 'numeric', month: 'short',
  })
}

const STUDIO_PHASES = [
  {
    key: 'received', label: 'Material recibido', icon: '📥',
    items: [
      { key: 'material_links', label: 'Links del material recibidos' },
      { key: 'material_reviewed', label: 'Material revisado y aprobado' },
      { key: 'project_created', label: 'Proyecto creado en sistema' },
    ],
  },
  {
    key: 'in_progress', label: 'En edición', icon: '🎬',
    items: [
      { key: 'editing_started', label: 'Edición iniciada' },
      { key: 'rough_cut', label: 'Corte inicial completado' },
      { key: 'music_sound', label: 'Música y efectos aplicados' },
      { key: 'graphics_text', label: 'Gráficos y textos integrados' },
    ],
  },
  {
    key: 'review', label: 'En revisión', icon: '👀',
    items: [
      { key: 'review_sent', label: 'Versión de revisión enviada' },
      { key: 'feedback_received', label: 'Feedback del cliente recibido' },
    ],
  },
  {
    key: 'adjustments', label: 'Ajustes', icon: '🔧',
    items: [
      { key: 'adjustments_applied', label: 'Ajustes aplicados' },
      { key: 'final_review', label: 'Revisión final completada' },
    ],
  },
  {
    key: 'delivered', label: 'Entregado', icon: '✅',
    items: [
      { key: 'final_export', label: 'Exportación final completada' },
      { key: 'files_delivered', label: 'Archivos entregados al cliente' },
    ],
  },
]

const TECH_PHASES = [
  {
    key: 'discovery', label: 'Descubrimiento', icon: '🔍',
    items: [
      { key: 'kickoff_meeting', label: 'Reunión de inicio realizada' },
      { key: 'requirements_defined', label: 'Requerimientos definidos' },
      { key: 'scope_approved', label: 'Alcance aprobado por el cliente' },
      { key: 'timeline_set', label: 'Cronograma establecido' },
    ],
  },
  {
    key: 'design', label: 'Diseño', icon: '🎨',
    items: [
      { key: 'wireframes_done', label: 'Wireframes completados' },
      { key: 'prototype_done', label: 'Prototipo en Figma listo' },
      { key: 'design_approved', label: 'Diseño aprobado por el cliente' },
      { key: 'assets_ready', label: 'Assets y recursos listos' },
    ],
  },
  {
    key: 'development', label: 'Desarrollo', icon: '⚙️',
    items: [
      { key: 'setup_done', label: 'Entorno de desarrollo configurado' },
      { key: 'frontend_done', label: 'Frontend completado' },
      { key: 'backend_done', label: 'Backend e integraciones listas' },
      { key: 'staging_deployed', label: 'Versión staging desplegada' },
    ],
  },
  {
    key: 'review', label: 'Revisión', icon: '👀',
    items: [
      { key: 'client_testing', label: 'Cliente probando versión staging' },
      { key: 'feedback_received', label: 'Feedback recibido' },
      { key: 'changes_list', label: 'Lista de cambios aprobada' },
    ],
  },
  {
    key: 'adjustments', label: 'Ajustes', icon: '🔧',
    items: [
      { key: 'changes_applied', label: 'Cambios aplicados' },
      { key: 'final_testing', label: 'Pruebas finales completadas' },
      { key: 'client_approved', label: 'Aprobación final del cliente' },
    ],
  },
  {
    key: 'deploy', label: 'Despliegue', icon: '🚀',
    items: [
      { key: 'domain_configured', label: 'Dominio configurado' },
      { key: 'ssl_active', label: 'SSL y seguridad activos' },
      { key: 'production_deployed', label: 'Proyecto desplegado en producción' },
      { key: 'performance_checked', label: 'Rendimiento verificado' },
    ],
  },
  {
    key: 'delivered', label: 'Entregado', icon: '✅',
    items: [
      { key: 'credentials_delivered', label: 'Accesos y credenciales entregados' },
      { key: 'documentation_done', label: 'Documentación completada' },
      { key: 'project_closed', label: 'Proyecto cerrado oficialmente' },
    ],
  },
]

export default function SeguimientoPage({ params }: { params: Promise<{ projectId: string }> }) {
  const supabase = createClient()
  const [project, setProject] = useState<Project | null>(null)
  const [checklist, setChecklist] = useState<ChecklistItem[]>([])
  const [updates, setUpdates] = useState<Update[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const load = async () => {
      const { projectId } = await params
      const { data: proj } = await supabase
        .from('projects').select('*').eq('id', projectId).single()
      if (!proj) { setNotFound(true); setLoading(false); return }
      setProject(proj)

      const { data: checks } = await supabase
        .from('project_checklist').select('*').eq('project_id', projectId)
      setChecklist(checks || [])

      const { data: upds } = await supabase
        .from('project_updates').select('*').eq('project_id', projectId)
        .order('created_at', { ascending: false })
      setUpdates(upds || [])
      setLoading(false)
    }
    load()
  }, [params])

  const isItemCompleted = (key: string) => checklist.find(c => c.item_key === key)?.completed || false
  const getItemDate = (key: string) => checklist.find(c => c.item_key === key)?.completed_at || null

  const isPhaseCompleted = (phase: typeof STUDIO_PHASES[0]) =>
    phase.items.every(item => isItemCompleted(item.key))

  const isPhaseStarted = (phase: typeof STUDIO_PHASES[0]) =>
    phase.items.some(item => isItemCompleted(item.key))

  const phases = project?.division === 'tech' ? TECH_PHASES : STUDIO_PHASES

  const currentPhaseIndex = (() => {
    let last = 0
    phases.forEach((phase, i) => { if (isPhaseStarted(phase)) last = i })
    return last
  })()

  const totalItems = phases.reduce((acc, p) => acc + p.items.length, 0)
  const completedItems = phases.reduce((acc, p) => acc + p.items.filter(item => isItemCompleted(item.key)).length, 0)
  const progressPercent = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(245,245,247,0.4)', fontFamily: 'var(--font-body)' }}>
      Cargando...
    </div>
  )

  if (notFound) return (
    <div style={{ minHeight: '100vh', background: '#000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-body)', gap: 16 }}>
      <p style={{ fontSize: 48 }}>🔍</p>
      <p style={{ color: 'rgba(245,245,247,0.4)', fontSize: 14 }}>Proyecto no encontrado</p>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#000', fontFamily: 'var(--font-body)' }}>

      {/* Nav */}
      <nav style={{ padding: '20px 40px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(20px)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, color: '#f5f5f7' }}>
            FRANCO<span style={{ color: '#c9b99a' }}>O</span>RP
            <span style={{ marginLeft: 12, fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(245,245,247,0.3)', fontFamily: 'var(--font-body)', fontWeight: 400 }}>Seguimiento</span>
          </p>
          <span style={{ fontSize: 11, padding: '4px 12px', borderRadius: 100, background: project?.division === 'tech' ? 'rgba(122,180,232,0.12)' : 'rgba(201,185,154,0.12)', color: project?.division === 'tech' ? '#7ab4e8' : '#c9b99a', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            {project?.division === 'tech' ? 'Tech' : 'Studio'}
          </span>
        </div>
      </nav>

      <main style={{ maxWidth: 800, margin: '0 auto', padding: '48px 24px 80px' }}>

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c9b99a', marginBottom: 12 }}>Estado del proyecto</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(24px, 4vw, 40px)', color: '#f5f5f7', letterSpacing: '-0.025em', marginBottom: 8 }}>
            {project!.name}
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(245,245,247,0.35)', marginBottom: 24 }}>
            {project!.service_type} · Iniciado el {new Date(project!.created_at).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>

          {/* Barra de progreso global */}
          <div style={{ padding: '20px 24px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: 13, color: 'rgba(245,245,247,0.5)' }}>Progreso general</span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, color: '#c9b99a' }}>{progressPercent}%</span>
            </div>
            <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 100, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${progressPercent}%`, background: 'linear-gradient(90deg, #c9b99a, #e8d5b0)', borderRadius: 100, transition: 'width 0.6s ease' }} />
            </div>
            <p style={{ fontSize: 11, color: 'rgba(245,245,247,0.25)', marginTop: 10 }}>
              {completedItems} de {totalItems} tareas completadas · Fase actual: <span style={{ color: '#c9b99a' }}>{phases[currentPhaseIndex]?.label}</span>
            </p>
          </div>
        </div>

        {/* Fases con checklist */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {phases.map((phase, phaseIdx) => {
            const phaseCompleted = isPhaseCompleted(phase)
            const phaseStarted = isPhaseStarted(phase)
            const isCurrent = phaseIdx === currentPhaseIndex
            const isLocked = !phaseStarted && phaseIdx > currentPhaseIndex

            return (
              <div key={phase.key} style={{
                border: `1px solid ${phaseCompleted ? 'rgba(201,185,154,0.3)' : isCurrent ? 'rgba(201,185,154,0.2)' : 'rgba(255,255,255,0.06)'}`,
                borderRadius: 16, overflow: 'hidden',
                background: phaseCompleted ? 'rgba(201,185,154,0.03)' : isCurrent ? 'rgba(201,185,154,0.02)' : 'rgba(255,255,255,0.01)',
                opacity: isLocked ? 0.4 : 1,
                transition: 'all 0.3s',
              }}>
                {/* Header de fase */}
                <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: phaseCompleted ? 'rgba(201,185,154,0.15)' : isCurrent ? 'rgba(201,185,154,0.08)' : 'rgba(255,255,255,0.04)', border: `2px solid ${phaseCompleted ? '#c9b99a' : isCurrent ? 'rgba(201,185,154,0.4)' : 'rgba(255,255,255,0.1)'}`, fontSize: 16, flexShrink: 0 }}>
                    {phaseCompleted ? '✓' : phase.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <p style={{ fontSize: 14, fontWeight: 600, color: phaseCompleted ? '#c9b99a' : isCurrent ? '#f5f5f7' : 'rgba(245,245,247,0.4)', fontFamily: 'var(--font-body)' }}>
                        {phase.label}
                      </p>
                      {isCurrent && !phaseCompleted && (
                        <span style={{ fontSize: 9, padding: '2px 8px', borderRadius: 100, background: 'rgba(201,185,154,0.15)', color: '#c9b99a', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>En curso</span>
                      )}
                      {phaseCompleted && (
                        <span style={{ fontSize: 9, padding: '2px 8px', borderRadius: 100, background: 'rgba(151,196,89,0.12)', color: '#97c459', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Completado</span>
                      )}
                    </div>
                    <p style={{ fontSize: 11, color: 'rgba(245,245,247,0.25)', marginTop: 2 }}>
                      {phase.items.filter(item => isItemCompleted(item.key)).length} / {phase.items.length} tareas
                    </p>
                  </div>
                  {/* Mini progress bar de fase */}
                  <div style={{ width: 60 }}>
                    <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 100, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${(phase.items.filter(item => isItemCompleted(item.key)).length / phase.items.length) * 100}%`, background: phaseCompleted ? '#97c459' : '#c9b99a', borderRadius: 100, transition: 'width 0.4s ease' }} />
                    </div>
                  </div>
                </div>

                {/* Checklist items */}
                {(phaseStarted || isCurrent) && (
                  <div style={{ padding: '0 20px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {phase.items.map(item => {
                      const completed = isItemCompleted(item.key)
                      const completedAt = getItemDate(item.key)
                      return (
                        <div key={item.key} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: completed ? 'rgba(151,196,89,0.05)' : 'rgba(255,255,255,0.02)', borderRadius: 8, border: `1px solid ${completed ? 'rgba(151,196,89,0.15)' : 'rgba(255,255,255,0.05)'}` }}>
                          <div style={{ width: 18, height: 18, borderRadius: 4, border: `2px solid ${completed ? '#97c459' : 'rgba(255,255,255,0.15)'}`, background: completed ? 'rgba(151,196,89,0.2)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 10 }}>
                            {completed && '✓'}
                          </div>
                          <p style={{ flex: 1, fontSize: 13, color: completed ? 'rgba(245,245,247,0.7)' : 'rgba(245,245,247,0.4)', textDecoration: completed ? 'line-through' : 'none', textDecorationColor: 'rgba(245,245,247,0.2)' }}>
                            {item.label}
                          </p>
                          {completedAt && (
                            <p style={{ fontSize: 10, color: 'rgba(245,245,247,0.2)', whiteSpace: 'nowrap' }}>
                              {formatBogota(completedAt)}
                            </p>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Historial de actualizaciones */}
        {updates.length > 0 && (
          <div style={{ marginTop: 48 }}>
            <p style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(245,245,247,0.3)', marginBottom: 20 }}>Últimas actualizaciones</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {updates.map((u, i) => {
                const phase = [...STUDIO_PHASES, ...TECH_PHASES].find(p => p.key === u.stage)
                return (
                  <div key={u.id} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: i === 0 ? 'rgba(201,185,154,0.12)' : 'rgba(255,255,255,0.04)', border: `1px solid ${i === 0 ? 'rgba(201,185,154,0.3)' : 'rgba(255,255,255,0.08)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 13 }}>
                      {phase?.icon || '📌'}
                    </div>
                    <div style={{ flex: 1, padding: '10px 14px', background: i === 0 ? 'rgba(201,185,154,0.04)' : 'rgba(255,255,255,0.02)', border: `1px solid ${i === 0 ? 'rgba(201,185,154,0.15)' : 'rgba(255,255,255,0.06)'}`, borderRadius: 10 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: u.note ? 6 : 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: i === 0 ? '#c9b99a' : 'rgba(245,245,247,0.5)' }}>
                          {phase?.label || u.stage}
                        </p>
                        <p style={{ fontSize: 11, color: 'rgba(245,245,247,0.25)' }}>
                          {formatBogota(u.created_at, true)}
                        </p>
                      </div>
                      {u.note && <p style={{ fontSize: 13, color: 'rgba(245,245,247,0.45)', lineHeight: 1.6 }}>{u.note}</p>}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ marginTop: 48, padding: '18px 24px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ fontSize: 12, color: 'rgba(245,245,247,0.3)' }}>¿Tienes preguntas sobre tu proyecto?</p>
          <a href="https://wa.me/573165053518" target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: '#c9b99a', textDecoration: 'none', fontWeight: 600 }}>
            💬 Escríbenos por WhatsApp →
          </a>
        </div>
      </main>
    </div>
  )
}