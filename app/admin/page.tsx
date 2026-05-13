'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { sendWhatsApp, WA_MESSAGES } from '@/lib/whatsapp'
import ContextualLogo from '@/components/ContextualLogo'

type Division = 'studio' | 'tech'

type Project = {
  id: string
  name: string
  service_type: string
  videos_quantity: number
  price_per_unit: number
  total_price: number
  status: 'pending' | 'in_progress' | 'review' | 'delivered'
  payment_status: 'pending' | 'paid'
  payment_screenshot_url: string
  estimated_days: number
  client_id: string
  division: Division
  profiles: { name: string; email: string }
}

type Material = {
  id: string
  url: string
  note: string | null
  created_at: string
}

type Delivery = {
  id: string
  project_id: string
  link: string
  note: string | null
  created_at: string
}

type ClientProfile = {
  id: string
  whatsapp: string | null
}

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pendiente' },
  { value: 'in_progress', label: 'En edición' },
  { value: 'review', label: 'En revisión' },
  { value: 'delivered', label: 'Entregado' },
]

const STATUS_COLOR: Record<string, string> = {
  pending: '#c9b99a',
  in_progress: '#7ab4e8',
  review: '#f0c040',
  delivered: '#97c459',
}

const PHASES_MAP: Record<string, { key: string; label: string }[]> = {
  received: [{ key: 'material_links', label: 'Links del material recibidos' }, { key: 'material_reviewed', label: 'Material revisado y aprobado' }, { key: 'project_created', label: 'Proyecto creado en sistema' }],
  in_progress: [{ key: 'editing_started', label: 'Edición iniciada' }, { key: 'rough_cut', label: 'Corte inicial completado' }, { key: 'music_sound', label: 'Música y efectos aplicados' }, { key: 'graphics_text', label: 'Gráficos y textos integrados' }],
  adjustments: [{ key: 'adjustments_applied', label: 'Ajustes aplicados' }, { key: 'final_review', label: 'Revisión final completada' }],
  discovery: [{ key: 'kickoff_meeting', label: 'Reunión de inicio realizada' }, { key: 'requirements_defined', label: 'Requerimientos definidos' }, { key: 'scope_approved', label: 'Alcance aprobado' }, { key: 'timeline_set', label: 'Cronograma establecido' }],
  design: [{ key: 'wireframes_done', label: 'Wireframes completados' }, { key: 'prototype_done', label: 'Prototipo en Figma listo' }, { key: 'design_approved', label: 'Diseño aprobado' }, { key: 'assets_ready', label: 'Assets listos' }],
  development: [{ key: 'setup_done', label: 'Entorno configurado' }, { key: 'frontend_done', label: 'Frontend completado' }, { key: 'backend_done', label: 'Backend listo' }, { key: 'staging_deployed', label: 'Staging desplegado' }],
  review: [{ key: 'client_testing', label: 'Cliente probando' }, { key: 'feedback_received', label: 'Feedback recibido' }, { key: 'changes_list', label: 'Lista de cambios aprobada' }],
  deploy: [{ key: 'domain_configured', label: 'Dominio configurado' }, { key: 'ssl_active', label: 'SSL activo' }, { key: 'production_deployed', label: 'En producción' }, { key: 'performance_checked', label: 'Rendimiento verificado' }],
  delivered: [{ key: 'credentials_delivered', label: 'Accesos entregados' }, { key: 'documentation_done', label: 'Documentación lista' }, { key: 'project_closed', label: 'Proyecto cerrado' }],
}

const TECH_STAGES = [
  { value: 'discovery', label: '🔍 Descubrimiento' },
  { value: 'design', label: '🎨 Diseño' },
  { value: 'development', label: '⚙️ Desarrollo' },
  { value: 'review', label: '👀 Revisión' },
  { value: 'adjustments', label: '🔧 Ajustes' },
  { value: 'deploy', label: '🚀 Despliegue' },
  { value: 'delivered', label: '✅ Entregado' },
]

const STUDIO_STAGES = [
  { value: 'received', label: '📥 Material recibido' },
  { value: 'in_progress', label: '🎬 En edición' },
  { value: 'review', label: '👀 En revisión' },
  { value: 'adjustments', label: '🔧 Ajustes' },
  { value: 'delivered', label: '✅ Entregado' },
]

export default function AdminPage() {
  const router = useRouter()
  const supabase = createClient()
  const [tab, setTab] = useState<Division>('studio')
  const [projects, setProjects] = useState<Project[]>([])
  const [materials, setMaterials] = useState<Record<string, Material[]>>({})
  const [deliveries, setDeliveries] = useState<Record<string, Delivery[]>>({})
  const [clientProfiles, setClientProfiles] = useState<Record<string, ClientProfile>>({})
  const [expandedMaterials, setExpandedMaterials] = useState<Record<string, boolean>>({})
  const [showDeliveryForm, setShowDeliveryForm] = useState<Record<string, boolean>>({})
  const [showUpdateForm, setShowUpdateForm] = useState<Record<string, boolean>>({})
  const [updateForms, setUpdateForms] = useState<Record<string, { stage: string; note: string; checkedItems: string[] }>>({})
  const [sendingUpdate, setSendingUpdate] = useState<string | null>(null)
  const [deliveryForms, setDeliveryForms] = useState<Record<string, { link: string; note: string; isFinal: boolean }>>({})
  const [sendingDelivery, setSendingDelivery] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [screenshotUrls, setScreenshotUrls] = useState<Record<string, string>>({})
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // Formulario Studio
  const [studioForm, setStudioForm] = useState({
    client_email: '', name: '', service_type: '',
    videos_quantity: 1, price_per_unit: 0, estimated_days: 7,
  })

  // Formulario Tech
  const [techForm, setTechForm] = useState({
    client_email: '', name: '',
    service_type: 'Desarrollo Web',
    total_price: 0, estimated_days: 30,
  })

  const [creating, setCreating] = useState(false)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data: profile } = await supabase
        .from('profiles').select('role').eq('id', user.id).single()
      if (profile?.role !== 'admin') { router.push('/dashboard'); return }
      // Leer el tab del query param
      const params = new URLSearchParams(window.location.search)
      const tabParam = params.get('tab')
      if (tabParam === 'tech' || tabParam === 'studio') setTab(tabParam)
      await loadData()
      setLoading(false)
    }
    load()
  }, [])

  const loadData = async () => {
    const { data: projs } = await supabase
      .from('projects').select('*, profiles(name, email), division')
      .order('created_at', { ascending: false })
    setProjects(projs || [])

    const { data: mats } = await supabase
      .from('materials').select('*').order('created_at', { ascending: true })
    const groupedMats: Record<string, Material[]> = {}
    for (const m of mats || []) {
      if (!groupedMats[m.project_id]) groupedMats[m.project_id] = []
      groupedMats[m.project_id].push(m)
    }
    setMaterials(groupedMats)

    const { data: delivs } = await supabase
      .from('deliveries').select('*').order('created_at', { ascending: true })
    const groupedDelivs: Record<string, Delivery[]> = {}
    for (const d of delivs || []) {
      if (!groupedDelivs[d.project_id]) groupedDelivs[d.project_id] = []
      groupedDelivs[d.project_id].push(d)
    }
    setDeliveries(groupedDelivs)

    const { data: profs } = await supabase.from('profiles').select('id, whatsapp')
    const profileMap: Record<string, ClientProfile> = {}
    for (const prof of profs || []) profileMap[prof.id] = prof
    setClientProfiles(profileMap)
  }

  const updateStatus = async (projectId: string, field: string, value: string) => {
    await supabase.from('projects').update({ [field]: value }).eq('id', projectId)
    if (field === 'status' && value !== 'pending') {
      const project = projects.find(p => p.id === projectId)
      if (project) {
        const clientWa = clientProfiles[project.client_id]?.whatsapp
        if (clientWa) await sendWhatsApp(clientWa, WA_MESSAGES.statusChanged(project.name, value))
      }
    }
    await loadData()
  }

  const handleSendDelivery = async (p: Project) => {
    const form = deliveryForms[p.id] || { link: '', note: '', isFinal: false }
    if (!form.link.trim()) return
    setSendingDelivery(p.id)
    await supabase.from('deliveries').insert({
      project_id: p.id, client_id: p.client_id,
      link: form.link.trim(), note: form.note.trim() || null,
    })
    const newStatus = form.isFinal ? 'delivered' : 'review'
    await supabase.from('projects').update({ status: newStatus }).eq('id', p.id)
    const clientWa = clientProfiles[p.client_id]?.whatsapp
    if (clientWa) {
      let message = form.isFinal
        ? `🎉 *Francoorp Studio*\n\n¡Tu proyecto *${p.name}* está listo!\n\n📥 Descarga tu video aquí:\n${form.link.trim()}`
        : `👀 *Francoorp Studio*\n\nTu revisión de *${p.name}* está lista.\n\n📥 Revisa aquí:\n${form.link.trim()}`
      if (form.note.trim()) message += `\n\n📝 *Nota del editor:*\n${form.note.trim()}`
      message += form.isFinal ? `\n\n¡Gracias por confiar en nosotros! 🙌` : `\n\nSi tienes cambios, avísanos. 🎬`
      await sendWhatsApp(clientWa, message)
    }
    setDeliveryForms(prev => ({ ...prev, [p.id]: { link: '', note: '', isFinal: false } }))
    setShowDeliveryForm(prev => ({ ...prev, [p.id]: false }))
    setSendingDelivery(null)
    await loadData()
  }

  const handleSendUpdate = async (p: Project) => {
    const form = updateForms[p.id] || { stage: '', note: '', checkedItems: [] }
    if (!form.stage) return
    setSendingUpdate(p.id)
    await supabase.from('project_updates').insert({
      project_id: p.id, stage: form.stage, note: form.note.trim() || null,
    })
    for (const itemKey of form.checkedItems) {
      const { data: existing } = await supabase
        .from('project_checklist').select('id').eq('project_id', p.id).eq('item_key', itemKey).single()
      if (existing) {
        await supabase.from('project_checklist').update({ completed: true, completed_at: new Date().toISOString() }).eq('id', existing.id)
      } else {
        await supabase.from('project_checklist').insert({ project_id: p.id, item_key: itemKey, completed: true, completed_at: new Date().toISOString() })
      }
    }
    const statusMap: Record<string, string> = {
      received: 'pending', in_progress: 'in_progress', review: 'review',
      adjustments: 'review', design: 'in_progress', development: 'in_progress',
      deploy: 'in_progress', delivered: 'delivered', discovery: 'pending',
    }
    await supabase.from('projects').update({ status: statusMap[form.stage] || 'in_progress' }).eq('id', p.id)
    const clientWa = clientProfiles[p.client_id]?.whatsapp
    if (clientWa) {
      const trackingUrl = `${window.location.origin}/seguimiento/${p.id}`
      await sendWhatsApp(clientWa, WA_MESSAGES.techStageUpdated(p.name, form.stage, form.note.trim() || undefined, trackingUrl))
    }
    setUpdateForms(prev => ({ ...prev, [p.id]: { stage: '', note: '', checkedItems: [] } }))
    setShowUpdateForm(prev => ({ ...prev, [p.id]: false }))
    setSendingUpdate(null)
    await loadData()
  }

  const copyLink = (projectId: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/seguimiento/${projectId}`)
    setCopiedId(projectId)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const getScreenshotUrl = async (path: string, projectId: string) => {
    if (screenshotUrls[projectId]) return
    const { data } = await supabase.storage.from('payment-screenshots').createSignedUrl(path, 3600)
    if (data) setScreenshotUrls(prev => ({ ...prev, [projectId]: data.signedUrl }))
  }

  const toggleMaterials = (projectId: string) => {
    setExpandedMaterials(prev => ({ ...prev, [projectId]: !prev[projectId] }))
  }

  const handleCreateStudio = async () => {
    setCreating(true)
    const { data: profile } = await supabase
      .from('profiles').select('id').eq('email', studioForm.client_email).single()
    if (!profile) { alert('No se encontró un cliente con ese correo.'); setCreating(false); return }
    const total = studioForm.videos_quantity * studioForm.price_per_unit
    await supabase.from('projects').insert({
      client_id: profile.id, name: studioForm.name, service_type: studioForm.service_type,
      videos_quantity: studioForm.videos_quantity, price_per_unit: studioForm.price_per_unit,
      total_price: total, estimated_days: studioForm.estimated_days, division: 'studio',
    })
    setStudioForm({ client_email: '', name: '', service_type: '', videos_quantity: 1, price_per_unit: 0, estimated_days: 7 })
    setShowForm(false)
    setCreating(false)
    await loadData()
  }

  const handleCreateTech = async () => {
    setCreating(true)
    const { data: profile } = await supabase
      .from('profiles').select('id').eq('email', techForm.client_email).single()
    if (!profile) { alert('No se encontró un cliente con ese correo.'); setCreating(false); return }
    await supabase.from('projects').insert({
      client_id: profile.id, name: techForm.name, service_type: techForm.service_type,
      videos_quantity: 0, price_per_unit: 0, total_price: techForm.total_price,
      estimated_days: techForm.estimated_days, division: 'tech',
    })
    setTechForm({ client_email: '', name: '', service_type: 'Desarrollo Web', total_price: 0, estimated_days: 30 })
    setShowForm(false)
    setCreating(false)
    await loadData()
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(245,245,247,0.4)', fontFamily: 'var(--font-body)' }}>
      Cargando...
    </div>
  )

  const inputStyle = {
    padding: '11px 14px', background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#f5f5f7',
    fontSize: 13, outline: 'none', fontFamily: 'var(--font-body)', width: '100%',
  }

  const studioProjects = projects.filter(p => p.division === 'studio' || !p.division)
  const techProjects = projects.filter(p => p.division === 'tech')
  const currentProjects = tab === 'studio' ? studioProjects : techProjects

  return (
    <div style={{ minHeight: '100vh', background: '#000', fontFamily: 'var(--font-body)' }}>
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 40px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(20px)', position: 'sticky', top: 0, zIndex: 50 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, color: '#f5f5f7' }}>
          <ContextualLogo />
        </h1>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button onClick={() => router.push('/admin/selector')} style={{ padding: '10px 20px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, background: 'transparent', color: 'rgba(245,245,247,0.45)', fontFamily: 'var(--font-body)', fontSize: 12, cursor: 'pointer' }}>
            ← Cambiar panel
          </button>
          <button onClick={async () => { await supabase.auth.signOut(); window.location.href = '/login' }} style={{ padding: '10px 20px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, background: 'transparent', color: 'rgba(245,245,247,0.45)', fontFamily: 'var(--font-body)', fontSize: 12, cursor: 'pointer' }}>
            Cerrar sesión
          </button>
          <button onClick={() => setShowForm(!showForm)} style={{ padding: '10px 24px', background: tab === 'tech' ? '#7ab4e8' : '#c9b99a', color: '#000', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
            + Nuevo proyecto {tab === 'tech' ? 'Tech' : 'Studio'}
          </button>
        </div>
      </nav>

      <main style={{ maxWidth: 960, margin: '0 auto', padding: '40px 24px' }}>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 32, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          {[
            { key: 'studio', label: 'Studio', count: studioProjects.length, color: '#c9b99a' },
            { key: 'tech', label: 'Tech', count: techProjects.length, color: '#7ab4e8' },
          ].map(t => (
            <button key={t.key} onClick={() => { setTab(t.key as Division); setShowForm(false) }} style={{ padding: '12px 24px', background: 'transparent', border: 'none', borderBottom: `2px solid ${tab === t.key ? t.color : 'transparent'}`, color: tab === t.key ? t.color : 'rgba(245,245,247,0.35)', fontSize: 14, fontWeight: tab === t.key ? 700 : 400, cursor: 'pointer', fontFamily: 'var(--font-body)', marginBottom: -1, display: 'flex', alignItems: 'center', gap: 8 }}>
              {t.label}
              <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 100, background: tab === t.key ? `${t.color}20` : 'rgba(255,255,255,0.05)', color: tab === t.key ? t.color : 'rgba(245,245,247,0.3)', fontWeight: 600 }}>
                {t.count}
              </span>
            </button>
          ))}
        </div>

        {/* Formulario Studio */}
        {showForm && tab === 'studio' && (
          <div style={{ border: '1px solid rgba(201,185,154,0.3)', borderRadius: 16, padding: '32px', background: 'rgba(201,185,154,0.04)', marginBottom: 32 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: '#f5f5f7', marginBottom: 24 }}>Crear proyecto Studio</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <input style={inputStyle} placeholder="Correo del cliente" value={studioForm.client_email} onChange={e => setStudioForm(f => ({ ...f, client_email: e.target.value }))} />
              <input style={inputStyle} placeholder="Nombre del proyecto" value={studioForm.name} onChange={e => setStudioForm(f => ({ ...f, name: e.target.value }))} />
              <input style={inputStyle} placeholder="Tipo de servicio" value={studioForm.service_type} onChange={e => setStudioForm(f => ({ ...f, service_type: e.target.value }))} />
              <input style={inputStyle} placeholder="Días estimados" type="number" value={studioForm.estimated_days} onChange={e => setStudioForm(f => ({ ...f, estimated_days: +e.target.value }))} />
              <input style={inputStyle} placeholder="Cantidad de videos" type="number" value={studioForm.videos_quantity} onChange={e => setStudioForm(f => ({ ...f, videos_quantity: +e.target.value }))} />
              <input style={inputStyle} placeholder="Precio por video COP" type="number" value={studioForm.price_per_unit} onChange={e => setStudioForm(f => ({ ...f, price_per_unit: +e.target.value }))} />
            </div>
            <div style={{ marginTop: 16, padding: '14px 18px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, fontSize: 13, color: 'rgba(245,245,247,0.5)' }}>
              Total: <strong style={{ color: '#c9b99a' }}>${(studioForm.videos_quantity * studioForm.price_per_unit).toLocaleString()} COP</strong>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <button onClick={handleCreateStudio} disabled={creating} style={{ padding: '12px 28px', background: '#c9b99a', color: '#000', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)', opacity: creating ? 0.7 : 1 }}>
                {creating ? 'Creando...' : 'Crear proyecto Studio'}
              </button>
              <button onClick={() => setShowForm(false)} style={{ padding: '12px 20px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, background: 'transparent', color: 'rgba(245,245,247,0.45)', fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Cancelar</button>
            </div>
          </div>
        )}

        {/* Formulario Tech */}
        {showForm && tab === 'tech' && (
          <div style={{ border: '1px solid rgba(122,180,232,0.3)', borderRadius: 16, padding: '32px', background: 'rgba(122,180,232,0.04)', marginBottom: 32 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: '#f5f5f7', marginBottom: 24 }}>Crear proyecto Tech</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <input style={inputStyle} placeholder="Correo del cliente" value={techForm.client_email} onChange={e => setTechForm(f => ({ ...f, client_email: e.target.value }))} />
              <input style={inputStyle} placeholder="Nombre del proyecto. Ej: Web Corporativa TiendaX" value={techForm.name} onChange={e => setTechForm(f => ({ ...f, name: e.target.value }))} />
              <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: 11, color: 'rgba(245,245,247,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: 8, fontFamily: 'var(--font-body)' }}>
                Tipo de servicio
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 8 }}>
                {[
                  { value: 'Landing Page', icon: '🖥️' },
                  { value: 'Web Corporativa', icon: '🏢' },
                  { value: 'Plataforma a Medida', icon: '⚙️' },
                  { value: 'E-commerce Básico', icon: '🛒' },
                  { value: 'E-commerce Avanzado', icon: '🏪' },
                  { value: 'App Móvil', icon: '📱' },
                  { value: 'Automatización Básica', icon: '🤖' },
                  { value: 'Automatización Avanzada', icon: '🔗' },
                ].map(s => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => setTechForm(f => ({ ...f, service_type: s.value }))}
                    style={{
                      padding: '12px 14px', borderRadius: 8, cursor: 'pointer', textAlign: 'left',
                      background: techForm.service_type === s.value ? 'rgba(122,180,232,0.12)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${techForm.service_type === s.value ? 'rgba(122,180,232,0.5)' : 'rgba(255,255,255,0.08)'}`,
                      fontFamily: 'var(--font-body)', transition: 'all 0.15s',
                    }}
                  >
                    <span style={{ fontSize: 18, display: 'block', marginBottom: 6 }}>{s.icon}</span>
                    <span style={{ fontSize: 12, color: techForm.service_type === s.value ? '#7ab4e8' : 'rgba(245,245,247,0.5)', fontWeight: techForm.service_type === s.value ? 600 : 400, lineHeight: 1.3, display: 'block' }}>
                      {s.value}
                    </span>
                  </button>
                ))}
              </div>
            </div>
              <input style={inputStyle} placeholder="Días estimados de entrega" type="number" value={techForm.estimated_days} onChange={e => setTechForm(f => ({ ...f, estimated_days: +e.target.value }))} />
              <input style={{ ...inputStyle, gridColumn: '1 / -1' }} placeholder="Precio total del proyecto en COP" type="number" value={techForm.total_price} onChange={e => setTechForm(f => ({ ...f, total_price: +e.target.value }))} />
            </div>
            <div style={{ marginTop: 16, padding: '14px 18px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, fontSize: 13, color: 'rgba(245,245,247,0.5)' }}>
              Total: <strong style={{ color: '#7ab4e8' }}>${techForm.total_price.toLocaleString()} COP</strong>
              <span style={{ marginLeft: 16 }}>· Entrega estimada: <strong style={{ color: '#7ab4e8' }}>{techForm.estimated_days} días</strong></span>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <button onClick={handleCreateTech} disabled={creating} style={{ padding: '12px 28px', background: '#7ab4e8', color: '#000', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)', opacity: creating ? 0.7 : 1 }}>
                {creating ? 'Creando...' : 'Crear proyecto Tech'}
              </button>
              <button onClick={() => setShowForm(false)} style={{ padding: '12px 20px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, background: 'transparent', color: 'rgba(245,245,247,0.45)', fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Cancelar</button>
            </div>
          </div>
        )}

        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, color: '#f5f5f7', marginBottom: 20, letterSpacing: '-0.02em' }}>
          Proyectos {tab === 'tech' ? 'Tech' : 'Studio'}
          <span style={{ marginLeft: 10, fontSize: 13, color: 'rgba(245,245,247,0.3)', fontFamily: 'var(--font-body)', fontWeight: 400 }}>({currentProjects.length})</span>
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {currentProjects.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, color: 'rgba(245,245,247,0.3)', fontSize: 14 }}>
              No hay proyectos {tab === 'tech' ? 'Tech' : 'Studio'} aún.
            </div>
          ) : currentProjects.map(p => {
            const projectMaterials = materials[p.id] || []
            const projectDeliveries = deliveries[p.id] || []
            const isExpanded = expandedMaterials[p.id]
            const isShowingDelivery = showDeliveryForm[p.id]
            const isShowingUpdate = showUpdateForm[p.id]
            const delivForm = deliveryForms[p.id] || { link: '', note: '', isFinal: false }
            const updForm = updateForms[p.id] || { stage: '', note: '', checkedItems: [] }
            const divColor = p.division === 'tech' ? '#7ab4e8' : '#c9b99a'

            return (
              <div key={p.id} style={{ border: `1px solid rgba(255,255,255,0.08)`, borderRadius: 14, overflow: 'hidden', background: 'rgba(255,255,255,0.02)' }}>

                {/* Header */}
                <div style={{ padding: '24px 28px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <span style={{ fontSize: 10, padding: '2px 10px', borderRadius: 100, background: `${divColor}15`, color: divColor, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                        {p.division === 'tech' ? 'Tech' : 'Studio'}
                      </span>
                      <p style={{ fontSize: 11, color: 'rgba(245,245,247,0.35)' }}>{p.profiles?.email}</p>
                    </div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: '#f5f5f7', marginBottom: 4 }}>{p.name}</h3>
                    <p style={{ fontSize: 12, color: 'rgba(245,245,247,0.35)' }}>
                      {p.service_type} · {p.estimated_days} días
                      {p.division === 'studio' && ` · ${p.videos_quantity} video${p.videos_quantity > 1 ? 's' : ''} · $${p.price_per_unit.toLocaleString()} c/u`}
                    </p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, color: divColor }}>${p.total_price.toLocaleString()} COP</span>
                    <button onClick={() => updateStatus(p.id, 'payment_status', p.payment_status === 'pending' ? 'paid' : 'pending')} style={{ padding: '6px 14px', borderRadius: 100, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', background: p.payment_status === 'paid' ? 'rgba(151,196,89,0.12)' : 'rgba(226,75,74,0.12)', color: p.payment_status === 'paid' ? '#97c459' : '#e24b4a', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                      {p.payment_status === 'paid' ? '✓ Pagado' : '✗ Pendiente — clic para confirmar'}
                    </button>
                    <select value={p.status} onChange={e => updateStatus(p.id, 'status', e.target.value)} style={{ padding: '6px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.06)', border: `1px solid ${STATUS_COLOR[p.status]}40`, color: STATUS_COLOR[p.status], fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font-body)', outline: 'none' }}>
                      {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </div>
                </div>

                {/* Comprobante */}
                {p.payment_screenshot_url && (
                  <div style={{ padding: '12px 28px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 12, color: 'rgba(245,245,247,0.35)' }}>Comprobante:</span>
                    {screenshotUrls[p.id] ? (
                      <a href={screenshotUrls[p.id]} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: '#c9b99a' }}>Ver imagen →</a>
                    ) : (
                      <button onClick={() => getScreenshotUrl(p.payment_screenshot_url, p.id)} style={{ fontSize: 12, color: '#c9b99a', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Ver pantallazo →</button>
                    )}
                  </div>
                )}

                {/* Entregas enviadas */}
                {projectDeliveries.length > 0 && (
                  <div style={{ padding: '16px 28px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <p style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(151,196,89,0.6)', marginBottom: 10, fontFamily: 'var(--font-body)', fontWeight: 600 }}>Entregas enviadas</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {projectDeliveries.map((d, idx) => (
                        <div key={d.id} style={{ padding: '12px 16px', background: 'rgba(151,196,89,0.05)', borderRadius: 8, border: '1px solid rgba(151,196,89,0.15)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                            <span style={{ fontSize: 10, color: '#97c459', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Entrega {idx + 1}</span>
                            <span style={{ fontSize: 11, color: 'rgba(245,245,247,0.25)' }}>{new Date(d.created_at).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          </div>
                          <a href={d.link} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: '#7ab4e8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, wordBreak: 'break-all', marginBottom: d.note ? 8 : 0 }}>
                            <span>🔗</span><span style={{ borderBottom: '1px solid rgba(122,180,232,0.3)' }}>{d.link}</span>
                          </a>
                          {d.note && <p style={{ fontSize: 12, color: 'rgba(245,245,247,0.45)', marginTop: 6, lineHeight: 1.5 }}>📝 {d.note}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Panel de seguimiento */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  {!isShowingUpdate ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px' }}>
                      <button onClick={() => setShowUpdateForm(prev => ({ ...prev, [p.id]: true }))} style={{ flex: 1, padding: '14px 0', display: 'flex', alignItems: 'center', gap: 10, background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', textAlign: 'left' }}>
                        <span style={{ fontSize: 18 }}>📊</span>
                        <span style={{ fontSize: 12, color: 'rgba(245,245,247,0.4)' }}>Publicar actualización de etapa</span>
                      </button>
                      <button onClick={() => copyLink(p.id)} style={{ padding: '6px 12px', background: copiedId === p.id ? 'rgba(151,196,89,0.12)' : 'rgba(122,180,232,0.08)', border: `1px solid ${copiedId === p.id ? 'rgba(151,196,89,0.3)' : 'rgba(122,180,232,0.2)'}`, borderRadius: 8, fontSize: 11, color: copiedId === p.id ? '#97c459' : '#7ab4e8', cursor: 'pointer', fontFamily: 'var(--font-body)', whiteSpace: 'nowrap' }}>
                        {copiedId === p.id ? '✓ Copiado' : '🔗 Copiar link'}
                      </button>
                    </div>
                  ) : (
                    <div style={{ padding: '20px 28px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                      <p style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#7ab4e8', fontFamily: 'var(--font-body)', fontWeight: 600 }}>
                        📊 Actualizar etapa del proyecto
                      </p>
                      <div>
                        <label style={{ fontSize: 11, color: 'rgba(245,245,247,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: 6, fontFamily: 'var(--font-body)' }}>Etapa *</label>
                        <select value={updForm.stage} onChange={e => setUpdateForms(prev => ({ ...prev, [p.id]: { ...updForm, stage: e.target.value, checkedItems: [] } }))} style={{ ...inputStyle, cursor: 'pointer' }}>
                          <option value="">Selecciona una etapa</option>
                          {(p.division === 'tech' ? TECH_STAGES : STUDIO_STAGES).map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                      </div>

                      {/* Checklist */}
                      {updForm.stage && (() => {
                        const items = PHASES_MAP[updForm.stage]
                        if (!items) return null
                        return (
                          <div>
                            <label style={{ fontSize: 11, color: 'rgba(245,245,247,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: 8, fontFamily: 'var(--font-body)' }}>Marcar como completado</label>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                              {items.map(item => {
                                const checked = updForm.checkedItems.includes(item.key)
                                return (
                                  <label key={item.key} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: checked ? 'rgba(151,196,89,0.05)' : 'rgba(255,255,255,0.02)', border: `1px solid ${checked ? 'rgba(151,196,89,0.2)' : 'rgba(255,255,255,0.06)'}`, borderRadius: 8, cursor: 'pointer' }}>
                                    <input type="checkbox" checked={checked} onChange={e => {
                                      const updated = e.target.checked ? [...updForm.checkedItems, item.key] : updForm.checkedItems.filter(k => k !== item.key)
                                      setUpdateForms(prev => ({ ...prev, [p.id]: { ...updForm, checkedItems: updated } }))
                                    }} style={{ cursor: 'pointer', width: 15, height: 15, accentColor: '#97c459' }} />
                                    <span style={{ fontSize: 12, color: checked ? '#97c459' : 'rgba(245,245,247,0.5)' }}>{item.label}</span>
                                  </label>
                                )
                              })}
                            </div>
                          </div>
                        )
                      })()}

                      <div>
                        <label style={{ fontSize: 11, color: 'rgba(245,245,247,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: 6, fontFamily: 'var(--font-body)' }}>Nota para el cliente (opcional)</label>
                        <textarea placeholder="Ej: Ya recibimos tu material, comenzamos mañana..." value={updForm.note} onChange={e => setUpdateForms(prev => ({ ...prev, [p.id]: { ...updForm, note: e.target.value } }))} rows={2} style={{ ...inputStyle, resize: 'vertical' }} />
                      </div>

                      <div style={{ padding: '10px 14px', background: 'rgba(122,180,232,0.05)', border: '1px solid rgba(122,180,232,0.15)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                        <p style={{ fontSize: 11, color: 'rgba(122,180,232,0.7)' }}>📲 Se enviará WhatsApp con link de seguimiento</p>
                        <button onClick={() => copyLink(p.id)} style={{ padding: '4px 10px', background: copiedId === p.id ? 'rgba(151,196,89,0.15)' : 'rgba(122,180,232,0.1)', border: 'none', borderRadius: 6, fontSize: 11, color: copiedId === p.id ? '#97c459' : '#7ab4e8', cursor: 'pointer', fontFamily: 'var(--font-body)', whiteSpace: 'nowrap' }}>
                          {copiedId === p.id ? '✓ Copiado' : 'Copiar link'}
                        </button>
                      </div>

                      <div style={{ display: 'flex', gap: 10 }}>
                        <button onClick={() => handleSendUpdate(p)} disabled={sendingUpdate === p.id || !updForm.stage} style={{ flex: 1, padding: '12px', background: '#7ab4e8', color: '#000', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: sendingUpdate === p.id || !updForm.stage ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-display)', opacity: sendingUpdate === p.id || !updForm.stage ? 0.6 : 1 }}>
                          {sendingUpdate === p.id ? 'Publicando...' : '📊 Publicar + notificar WhatsApp'}
                        </button>
                        <button onClick={() => setShowUpdateForm(prev => ({ ...prev, [p.id]: false }))} style={{ padding: '12px 16px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'rgba(245,245,247,0.4)', fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Panel de entrega */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  {!isShowingDelivery ? (
                    <button onClick={() => setShowDeliveryForm(prev => ({ ...prev, [p.id]: true }))} style={{ width: '100%', padding: '14px 28px', display: 'flex', alignItems: 'center', gap: 10, background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', textAlign: 'left' }}>
                      <span style={{ fontSize: 18 }}>📤</span>
                      <span style={{ fontSize: 12, color: 'rgba(245,245,247,0.4)' }}>
                        {projectDeliveries.length > 0 ? `+ Enviar nueva entrega (${projectDeliveries.length} enviada${projectDeliveries.length !== 1 ? 's' : ''})` : 'Enviar entrega al cliente'}
                      </span>
                    </button>
                  ) : (
                    <div style={{ padding: '20px 28px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                      <p style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: divColor, fontFamily: 'var(--font-body)', fontWeight: 600, marginBottom: 4 }}>
                        📤 Enviar entrega al cliente
                      </p>
                      <div>
                        <label style={{ fontSize: 11, color: 'rgba(245,245,247,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: 6, fontFamily: 'var(--font-body)' }}>
                          {p.division === 'tech' ? 'Link del proyecto / staging *' : 'Link del video *'}
                        </label>
                        <input type="url" placeholder={p.division === 'tech' ? 'https://staging.tuproyecto.com...' : 'WeTransfer, Drive, Dropbox...'} value={delivForm.link} onChange={e => setDeliveryForms(prev => ({ ...prev, [p.id]: { ...delivForm, link: e.target.value } }))} style={{ ...inputStyle }} />
                      </div>
                      <div>
                        <label style={{ fontSize: 11, color: 'rgba(245,245,247,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: 6, fontFamily: 'var(--font-body)' }}>Nota para el cliente (opcional)</label>
                        <textarea placeholder={p.division === 'tech' ? 'Ej: El staging está listo, puedes probarlo aquí...' : 'Ej: Apliqué los cambios que pediste...'} value={delivForm.note} onChange={e => setDeliveryForms(prev => ({ ...prev, [p.id]: { ...delivForm, note: e.target.value } }))} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)' }}>
                        <input type="checkbox" id={`final-${p.id}`} checked={delivForm.isFinal} onChange={e => setDeliveryForms(prev => ({ ...prev, [p.id]: { ...delivForm, isFinal: e.target.checked } }))} style={{ cursor: 'pointer', width: 16, height: 16 }} />
                        <label htmlFor={`final-${p.id}`} style={{ fontSize: 12, color: delivForm.isFinal ? '#97c459' : 'rgba(245,245,247,0.4)', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                          {delivForm.isFinal ? '✓ Entrega final — el proyecto pasará a Entregado' : 'Marcar como entrega final'}
                        </label>
                      </div>
                      <div style={{ display: 'flex', gap: 10 }}>
                        <button onClick={() => handleSendDelivery(p)} disabled={sendingDelivery === p.id || !delivForm.link.trim()} style={{ flex: 1, padding: '12px', background: delivForm.isFinal ? '#97c459' : divColor, color: '#000', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: sendingDelivery === p.id || !delivForm.link.trim() ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-display)', opacity: sendingDelivery === p.id || !delivForm.link.trim() ? 0.6 : 1 }}>
                          {sendingDelivery === p.id ? 'Enviando...' : delivForm.isFinal ? '🎉 Enviar entrega final' : '📤 Enviar revisión'}
                        </button>
                        <button onClick={() => setShowDeliveryForm(prev => ({ ...prev, [p.id]: false }))} style={{ padding: '12px 16px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'rgba(245,245,247,0.4)', fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                          Cancelar
                        </button>
                      </div>
                      {!clientProfiles[p.client_id]?.whatsapp && (
                        <p style={{ fontSize: 11, color: '#f0c040' }}>⚠️ Este cliente no tiene WhatsApp registrado.</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Material del cliente — solo Studio */}
                {p.division !== 'tech' && (
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <button onClick={() => toggleMaterials(p.id)} style={{ width: '100%', padding: '12px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 12, color: 'rgba(245,245,247,0.4)' }}>Material enviado por el cliente</span>
                        {projectMaterials.length > 0 ? (
                          <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 100, background: 'rgba(201,185,154,0.15)', color: '#c9b99a', fontWeight: 600 }}>{projectMaterials.length} envío{projectMaterials.length !== 1 ? 's' : ''}</span>
                        ) : (
                          <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 100, background: 'rgba(255,255,255,0.05)', color: 'rgba(245,245,247,0.25)' }}>Sin material aún</span>
                        )}
                      </div>
                      <span style={{ fontSize: 12, color: 'rgba(245,245,247,0.25)', display: 'inline-block', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▾</span>
                    </button>
                    {isExpanded && (
                      <div style={{ padding: '0 28px 20px' }}>
                        {projectMaterials.length === 0 ? (
                          <p style={{ fontSize: 13, color: 'rgba(245,245,247,0.25)', padding: '12px 0' }}>El cliente aún no ha enviado material.</p>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {projectMaterials.map((m, idx) => {
                              const links = m.url.split('\n').filter(l => l.trim() !== '')
                              const notes = m.note ? m.note.split('\n').filter(n => n.trim() !== '') : []
                              return (
                                <div key={m.id} style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                                    <span style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#c9b99a', fontFamily: 'var(--font-body)', fontWeight: 600 }}>Envío {idx + 1}</span>
                                    <span style={{ fontSize: 11, color: 'rgba(245,245,247,0.25)' }}>{new Date(m.created_at).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                  </div>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: notes.length > 0 ? 12 : 0 }}>
                                    {links.map((link, i) => (
                                      <a key={i} href={link} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: '#7ab4e8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, wordBreak: 'break-all' }}>
                                        <span style={{ flexShrink: 0 }}>🔗</span>
                                        <span style={{ borderBottom: '1px solid rgba(122,180,232,0.3)' }}>{link}</span>
                                      </a>
                                    ))}
                                  </div>
                                  {notes.length > 0 && (
                                    <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, borderLeft: '2px solid rgba(201,185,154,0.3)' }}>
                                      {notes.map((note, i) => (
                                        <p key={i} style={{ fontSize: 12, color: 'rgba(245,245,247,0.5)', lineHeight: 1.6 }}>{note}</p>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}