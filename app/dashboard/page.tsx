'use client'
import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { generateCuentaCobro } from '@/lib/generatePDF'
import { sendWhatsApp, WA_MESSAGES } from '@/lib/whatsapp'
import DeliveryCalendar from '@/components/ui/DeliveryCalendar'
import YouTubeCard from '@/components/dashboard/YouTubeCard'

type Screen = 'home' | 'select-package' | 'my-projects' | 'profile' | 'payments'
type Project = { id: string; name: string; service_type: string; package_type: string | null; videos_quantity: number; price_per_unit: number; total_price: number; status: 'pending' | 'in_progress' | 'review' | 'delivered'; estimated_days: number; payment_screenshot_url: string | null; created_at: string }
type Material = { id: string; url: string; note: string | null; created_at: string }
type Delivery = { id: string; project_id: string; link: string; note: string | null; created_at: string }
type Profile = { name: string | null; email: string; full_name: string | null; document_id: string | null; phone: string | null; address: string | null; whatsapp: string | null; role: string; youtube_channel_id?: string | null; youtube_channel_name?: string | null; youtube_channel_description?: string | null; youtube_channel_thumbnail?: string | null; youtube_subscribers?: number | null; youtube_video_count?: number | null; youtube_view_count?: number | null; youtube_connected_at?: string | null }
type Invoice = { id: string; invoice_number: string; project_name: string; service_type: string; videos_quantity: number; price_per_unit: number; total_price: number; date: string; created_at: string; project_id: string }
type Form = { videoName: string; links: string[]; note: string; screenshot: File | null; deliveryDate: string }

const STATUS_LABEL: Record<string, string> = { pending: 'Pendiente', in_progress: 'En edición', review: 'En revisión', delivered: 'Entregado' }
const STATUS_COLOR: Record<string, string> = { pending: '#c9b99a', in_progress: '#7ab4e8', review: '#f0c040', delivered: '#97c459' }

const PACKAGES = [
  { id: 'basic', name: 'Básico', duration: '5 – 10 minutos', price: 300000, includes: ['Edición básica: cortes y estructura', 'Música de fondo', 'Subtítulos simples', 'Formato vertical y horizontal', '3 correcciones incluidas'] },
  { id: 'standard', name: 'Estándar', duration: '10 – 30 minutos', price: 450000, featured: true, includes: ['Edición más elaborada', 'Gráficos y textos en pantalla', 'Transiciones cuidadas', 'Música y efectos de sonido', 'Formato vertical y horizontal'] },
  { id: 'pro', name: 'Pro', duration: '30 – 45 minutos', price: 600000, includes: ['Edición profesional completa', 'Animaciones y motion graphics', 'Corrección de color', 'Diseño sonoro', 'Formato vertical y horizontal'] },
  { id: 'premium', name: 'Premium', duration: '45 – 60 minutos', price: 800000, includes: ['Full edición cinematográfica', 'Colorimetría avanzada', 'Diseño sonoro profesional', 'Animaciones con IA integrada', 'Formato vertical y horizontal'] },
]

const emptyForm = (): Form => ({ videoName: '', links: [''], note: '', screenshot: null, deliveryDate: '' })

export default function DashboardPage() {
  const supabase = createClient()
  const [screen, setScreen] = useState<Screen>('home')
  const [selectedPackage, setSelectedPackage] = useState<typeof PACKAGES[0] | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [materials, setMaterials] = useState<Record<string, Material[]>>({})
  const [deliveries, setDeliveries] = useState<Record<string, Delivery[]>>({})
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [profile, setProfile] = useState<Profile | null>(null)
  const [profileForm, setProfileForm] = useState({ full_name: '', document_id: '', phone: '', address: '', whatsapp: '' })
  const [savingProfile, setSavingProfile] = useState(false)
  const [userName, setUserName] = useState('')
  const [userId, setUserId] = useState('')
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'active' | 'completed'>('active')
  const [forms, setForms] = useState<Record<string, Form>>({})
  const [addingMaterial, setAddingMaterial] = useState<string | null>(null)
  const [extraLinks, setExtraLinks] = useState<Record<string, string[]>>({})
  const [sending, setSending] = useState<string | null>(null)
  const [newForm, setNewForm] = useState(emptyForm())
  const [creatingNew, setCreatingNew] = useState(false)
  const [toast, setToast] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3500) }

  const loadData = useCallback(async (uid: string) => {
    const { data: projs } = await supabase.from('projects').select('*').eq('client_id', uid).order('created_at', { ascending: false })
    setProjects(projs || [])
    const { data: mats } = await supabase.from('materials').select('*').eq('client_id', uid).order('created_at', { ascending: true })
    const grouped: Record<string, Material[]> = {}
    for (const m of mats || []) { if (!grouped[m.project_id]) grouped[m.project_id] = []; grouped[m.project_id].push(m) }
    setMaterials(grouped)
    const { data: delivs } = await supabase.from('deliveries').select('*').eq('client_id', uid).order('created_at', { ascending: false })
    const groupedDelivs: Record<string, Delivery[]> = {}
    for (const d of delivs || []) { if (!groupedDelivs[d.project_id]) groupedDelivs[d.project_id] = []; groupedDelivs[d.project_id].push(d) }
    setDeliveries(groupedDelivs)
    const { data: invs } = await supabase.from('invoices').select('*').eq('client_id', uid).order('created_at', { ascending: false })
    setInvoices(invs || [])
  }, [supabase])

  const getNextInvoiceNumber = async (): Promise<string> => {
    const { data } = await supabase.from('invoice_counter').select('last_number').eq('id', 1).single()
    const next = (data?.last_number || 0) + 1
    await supabase.from('invoice_counter').update({ last_number: next }).eq('id', 1)
    return `FC-${new Date().getFullYear()}-${String(next).padStart(3, '0')}`
  }

  const saveAndGeneratePDF = async (p: Project) => {
    const invoiceNumber = await getNextInvoiceNumber()
    const date = new Date().toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' })
    await supabase.from('invoices').insert({ client_id: userId, project_id: p.id, invoice_number: invoiceNumber, project_name: p.name, service_type: p.service_type || 'Edición de video', videos_quantity: p.videos_quantity, price_per_unit: p.price_per_unit, total_price: p.total_price, date })
    generateCuentaCobro({ clientName: profile?.full_name || profile?.name || userName, clientEmail: profile?.email || '', clientDocument: profile?.document_id || undefined, clientPhone: profile?.phone || undefined, clientAddress: profile?.address || undefined, projectName: p.name, serviceType: p.service_type || 'Edición de video', videosQuantity: p.videos_quantity, pricePerUnit: p.price_per_unit, totalPrice: p.total_price, invoiceNumber, date })
    await loadData(userId)
    return invoiceNumber
  }

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { window.location.href = '/login'; return }
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/login'; return }
      const { data: prof } = await supabase.from('profiles').select('name, email, full_name, document_id, phone, address, whatsapp, role, youtube_channel_id, youtube_channel_name, youtube_channel_description, youtube_channel_thumbnail, youtube_subscribers, youtube_video_count, youtube_view_count, youtube_connected_at').eq('id', user.id).single()
      if (prof?.role === 'admin') { window.location.href = '/admin'; return }
      setProfile(prof)
      setProfileForm({ full_name: prof?.full_name || '', document_id: prof?.document_id || '', phone: prof?.phone || '', address: prof?.address || '', whatsapp: prof?.whatsapp || '' })
      setUserName(prof?.full_name || prof?.name || prof?.email || 'Cliente')
      setUserId(user.id)
      await loadData(user.id)
      setLoading(false)
      const params = new URLSearchParams(window.location.search)
      if (params.get('youtube') === 'connected') { showToast('✅ Canal de YouTube conectado correctamente'); window.history.replaceState({}, '', '/dashboard'); setScreen('profile') }
      if (params.get('youtube') === 'error') { showToast('❌ Error al conectar YouTube. Intenta de nuevo.'); window.history.replaceState({}, '', '/dashboard') }
      if (params.get('youtube') === 'no_channel') { showToast('❌ No se encontró un canal de YouTube en esta cuenta.'); window.history.replaceState({}, '', '/dashboard') }
    }
    load()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => { if (event === 'SIGNED_OUT' || !session) window.location.href = '/login' })
    return () => subscription.unsubscribe()
  }, [supabase, loadData])

  const handleSaveProfile = async () => {
    setSavingProfile(true)
    await supabase.from('profiles').update({ full_name: profileForm.full_name, document_id: profileForm.document_id, phone: profileForm.phone, address: profileForm.address, whatsapp: profileForm.whatsapp }).eq('id', userId)
    setProfile(prev => prev ? { ...prev, ...profileForm } : prev)
    setUserName(profileForm.full_name || profile?.name || profile?.email || 'Cliente')
    setSavingProfile(false)
    showToast('✅ Perfil actualizado correctamente')
  }

  const handleDisconnectYouTube = async () => {
    await supabase.from('profiles').update({ youtube_channel_id: null, youtube_channel_name: null, youtube_channel_description: null, youtube_channel_thumbnail: null, youtube_subscribers: null, youtube_video_count: null, youtube_view_count: null, youtube_access_token: null, youtube_refresh_token: null, youtube_connected_at: null }).eq('id', userId)
    setProfile(prev => prev ? { ...prev, youtube_channel_id: null, youtube_channel_name: null, youtube_channel_thumbnail: null, youtube_subscribers: null, youtube_video_count: null, youtube_view_count: null, youtube_connected_at: null } : prev)
    showToast('Canal de YouTube desconectado')
  }

  const handleSignOut = async () => { await supabase.auth.signOut(); window.location.href = '/login' }
  const getForm = (pid: string): Form => forms[pid] || emptyForm()
  const updateLink = (pid: string, idx: number, val: string) => { const f = getForm(pid); const links = [...f.links]; links[idx] = val; setForms(prev => ({ ...prev, [pid]: { ...f, links } })) }
  const addLink = (pid: string) => { const f = getForm(pid); setForms(prev => ({ ...prev, [pid]: { ...f, links: [...f.links, ''] } })) }
  const removeLink = (pid: string, idx: number) => { const f = getForm(pid); const links = f.links.filter((_, i) => i !== idx); setForms(prev => ({ ...prev, [pid]: { ...f, links: links.length > 0 ? links : [''] } })) }

  const handleCreateProject = async () => {
    if (!selectedPackage) return
    const validLinks = newForm.links.filter(l => l.trim() !== '')
    if (validLinks.length === 0) { showToast('❌ Agrega al menos un link'); return }
    if (!newForm.screenshot) { showToast('❌ Adjunta el comprobante de pago'); return }
    setCreatingNew(true)
    const { data: proj, error } = await supabase.from('projects').insert({ client_id: userId, name: `Edición ${selectedPackage.name}`, service_type: `Edición de video ${selectedPackage.name}`, package_type: selectedPackage.id, videos_quantity: 1, price_per_unit: selectedPackage.price, total_price: selectedPackage.price, estimated_days: 7 }).select().single()
    if (error || !proj) { showToast('❌ Error al crear el proyecto'); setCreatingNew(false); return }
    const path = `${userId}/${proj.id}-${Date.now()}`
    const { error: storageError } = await supabase.storage.from('payment-screenshots').upload(path, newForm.screenshot)
    if (storageError) { showToast('❌ Error al subir el comprobante'); setCreatingNew(false); return }
    await supabase.from('projects').update({ payment_screenshot_url: path }).eq('id', proj.id)
    await supabase.from('materials').insert({ project_id: proj.id, client_id: userId, url: validLinks.join('\n'), note: `${newForm.videoName ? `Video: ${newForm.videoName}\n` : ''}${newForm.deliveryDate ? `Fecha deseada: ${newForm.deliveryDate}\n` : ''}${newForm.note || ''}` })
    await saveAndGeneratePDF(proj)
    if (profile?.whatsapp) await sendWhatsApp(profile.whatsapp, WA_MESSAGES.materialReceived(`Edición ${selectedPackage.name}`))
    setNewForm(emptyForm()); setSelectedPackage(null)
    showToast('✅ Proyecto enviado a producción')
    await loadData(userId); setCreatingNew(false); setScreen('my-projects')
  }

  const handleSubmit = async (p: Project) => {
    const form = getForm(p.id)
    const validLinks = form.links.filter(l => l.trim() !== '')
    if (validLinks.length === 0) { showToast('❌ Agrega al menos un link'); return }
    if (!p.payment_screenshot_url && !form.screenshot) { showToast('❌ Adjunta el comprobante de pago para continuar'); return }
    setSending(p.id)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    if (!p.payment_screenshot_url && form.screenshot) {
      const path = `${user.id}/${p.id}-${Date.now()}`
      const { error } = await supabase.storage.from('payment-screenshots').upload(path, form.screenshot)
      if (error) { showToast('❌ Error al subir el comprobante'); setSending(null); return }
      await supabase.from('projects').update({ payment_screenshot_url: path }).eq('id', p.id)
    }
    await supabase.from('materials').insert({ project_id: p.id, client_id: user.id, url: validLinks.join('\n'), note: `${form.videoName ? `Video: ${form.videoName}\n` : ''}${form.note || ''}` })
    await saveAndGeneratePDF(p)
    if (profile?.whatsapp) await sendWhatsApp(profile.whatsapp, WA_MESSAGES.materialReceived(p.name))
    setForms(prev => ({ ...prev, [p.id]: emptyForm() }))
    showToast('✅ Enviado a producción correctamente')
    await loadData(user.id); setSending(null)
  }

  const handleAddExtraMaterial = async (p: Project) => {
    const links = (extraLinks[p.id] || ['']).filter(l => l.trim() !== '')
    if (links.length === 0) { showToast('❌ Agrega al menos un link'); return }
    setSending(`extra-${p.id}`)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('materials').insert({ project_id: p.id, client_id: user.id, url: links.join('\n'), note: 'Material adicional' })
    if (profile?.whatsapp) await sendWhatsApp(profile.whatsapp, WA_MESSAGES.materialReceived(p.name))
    setExtraLinks(prev => ({ ...prev, [p.id]: [''] })); setAddingMaterial(null)
    showToast('✅ Material adicional enviado')
    await loadData(user.id); setSending(null)
  }

  const handleRedownloadPDF = (inv: Invoice) => {
    generateCuentaCobro({ clientName: profile?.full_name || profile?.name || userName, clientEmail: profile?.email || '', clientDocument: profile?.document_id || undefined, clientPhone: profile?.phone || undefined, clientAddress: profile?.address || undefined, projectName: inv.project_name, serviceType: inv.service_type, videosQuantity: inv.videos_quantity, pricePerUnit: inv.price_per_unit, totalPrice: inv.total_price, invoiceNumber: inv.invoice_number, date: inv.date })
  }

  const inputStyle: React.CSSProperties = { width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#f5f5f7', fontSize: 13, outline: 'none', fontFamily: 'var(--font-body)' }
  const stepLabelStyle: React.CSSProperties = { fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#c9b99a', fontFamily: 'var(--font-body)', fontWeight: 600, marginBottom: 8, display: 'block' }
  const fieldLabelStyle: React.CSSProperties = { fontSize: 11, color: 'rgba(245,245,247,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: 6, fontFamily: 'var(--font-body)' }
  const sectionLabelStyle: React.CSSProperties = { fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c9b99a', marginBottom: 16, fontFamily: 'var(--font-body)', display: 'block' }
  const fileButtonStyle = (hasFile: boolean): React.CSSProperties => ({ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', border: `1px solid ${hasFile ? 'rgba(151,196,89,0.5)' : 'rgba(201,185,154,0.4)'}`, borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: hasFile ? '#97c459' : '#c9b99a', fontFamily: 'var(--font-body)', background: hasFile ? 'rgba(151,196,89,0.08)' : 'rgba(201,185,154,0.06)' })

  const activeProjects = projects.filter(p => p.status !== 'delivered')
  const completedProjects = projects.filter(p => p.status === 'delivered')

  if (loading) return <div style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(245,245,247,0.4)', fontFamily: 'var(--font-body)' }}>Cargando...</div>

  return (
    <div style={{ minHeight: '100vh', background: '#000', fontFamily: 'var(--font-body)' }}>
      <style>{`
        select option { background: #111; color: #f5f5f7; }
        .db-nav-actions { display: flex; align-items: center; gap: 16px; }
        .db-nav-hamburger { display: none !important; }
        @media (max-width: 640px) { .db-nav-actions { display: none !important; } .db-nav-hamburger { display: flex !important; } }
        .packages-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; }
        @media (max-width: 480px) { .packages-grid { grid-template-columns: 1fr; } }
        .home-cards { display: flex; gap: 16px; flex-wrap: wrap; justify-content: center; width: 100%; max-width: 600px; }
        @media (max-width: 480px) { .home-cards { flex-direction: column; } }
        .project-header { padding: 20px 24px; display: flex; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
        .project-actions { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
        @media (max-width: 480px) { .project-actions { width: 100%; } .project-actions span, .project-actions button { flex: 1; text-align: center; } }
        .invoice-header { display: grid; grid-template-columns: 1fr 2fr 1fr 1fr auto; gap: 16px; padding: 10px 16px; }
        .invoice-row { display: grid; grid-template-columns: 1fr 2fr 1fr 1fr auto; gap: 16px; padding: 14px 16px; border-radius: 10px; align-items: center; }
        @media (max-width: 600px) { .invoice-header { display: none; } .invoice-row { grid-template-columns: 1fr 1fr; row-gap: 6px; } .invoice-num { grid-column: 1; } .invoice-name { grid-column: 1 / -1; } .invoice-date { grid-column: 1; } .invoice-total { grid-column: 2; text-align: right; } .invoice-btn { grid-column: 1 / -1; } .invoice-btn button { width: 100%; } }
      `}</style>

      {toast && (
        <div style={{ position: 'fixed', bottom: 32, left: '50%', transform: 'translateX(-50%)', zIndex: 100, padding: '14px 28px', background: 'rgba(15,15,15,0.96)', border: `1px solid ${toast.startsWith('❌') ? 'rgba(226,75,74,0.4)' : 'rgba(151,196,89,0.35)'}`, borderRadius: 100, backdropFilter: 'blur(20px)', maxWidth: 'calc(100vw - 48px)' }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: toast.startsWith('❌') ? '#e24b4a' : '#97c459' }}>{toast}</span>
        </div>
      )}

      {/* NAVBAR */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(20px)' }}>
        <button onClick={() => setScreen('home')} style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15, color: '#f5f5f7', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
          FRANCO<span style={{ color: '#c9b99a' }}>O</span>RP
          <span style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(245,245,247,0.3)', fontFamily: 'var(--font-body)', fontWeight: 400 }}>Cliente</span>
        </button>
        <div className="db-nav-actions">
          <button onClick={() => setScreen('payments')} style={{ fontSize: 12, color: 'rgba(245,245,247,0.4)', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>💳 Pagos</button>
          <button onClick={() => setScreen('profile')} style={{ fontSize: 13, color: 'rgba(245,245,247,0.4)', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>👤 {userName}</button>
          <button onClick={handleSignOut} style={{ padding: '8px 18px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, background: 'transparent', color: 'rgba(245,245,247,0.45)', fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Cerrar sesión</button>
        </div>
        <button className="db-nav-hamburger" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', flexDirection: 'column', gap: 5, padding: 4 }}>
          <span style={{ display: 'block', width: 20, height: 1.5, background: '#fff', transition: 'all 0.3s', transform: mobileMenuOpen ? 'rotate(45deg) translateY(6.5px)' : 'none' }} />
          <span style={{ display: 'block', width: 20, height: 1.5, background: '#fff', opacity: mobileMenuOpen ? 0 : 1 }} />
          <span style={{ display: 'block', width: 20, height: 1.5, background: '#fff', transition: 'all 0.3s', transform: mobileMenuOpen ? 'rotate(-45deg) translateY(-6.5px)' : 'none' }} />
        </button>
      </nav>

      {mobileMenuOpen && (
        <div style={{ position: 'fixed', top: 57, left: 0, right: 0, zIndex: 49, background: 'rgba(8,8,8,0.98)', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column' }}>
          {([['💳 Pagos', 'payments'], [`👤 ${userName}`, 'profile']] as [string, Screen][]).map(([label, s]) => (
            <button key={s} onClick={() => { setScreen(s); setMobileMenuOpen(false) }} style={{ padding: '14px 20px', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'rgba(245,245,247,0.6)', fontSize: 14, textAlign: 'left', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>{label}</button>
          ))}
          <button onClick={handleSignOut} style={{ padding: '14px 20px', background: 'transparent', border: 'none', color: 'rgba(245,245,247,0.4)', fontSize: 14, textAlign: 'left', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Cerrar sesión</button>
        </div>
      )}

      {/* PAGOS */}
      {screen === 'payments' && (
        <div style={{ minHeight: '100vh', padding: '90px 20px 60px' }}>
          <div style={{ maxWidth: 860, margin: '0 auto' }}>
            <button onClick={() => setScreen('home')} style={{ background: 'transparent', border: 'none', color: 'rgba(245,245,247,0.4)', fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font-body)', marginBottom: 40 }}>← Volver</button>
            <p style={sectionLabelStyle}>Mis finanzas</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(24px, 5vw, 32px)', color: '#f5f5f7', marginBottom: 8 }}>Historial de pagos</h2>
            <p style={{ fontSize: 14, color: 'rgba(245,245,247,0.35)', marginBottom: 40 }}>Todas tus cuentas de cobro generadas.</p>
            {invoices.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12, marginBottom: 40 }}>
                <div style={{ padding: '20px 24px', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, background: 'rgba(255,255,255,0.02)' }}>
                  <p style={{ fontSize: 11, textTransform: 'uppercase', color: 'rgba(245,245,247,0.35)', marginBottom: 8, fontFamily: 'var(--font-body)' }}>Total facturado</p>
                  <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, color: '#c9b99a' }}>${invoices.reduce((s, i) => s + i.total_price, 0).toLocaleString()} COP</p>
                </div>
                <div style={{ padding: '20px 24px', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, background: 'rgba(255,255,255,0.02)' }}>
                  <p style={{ fontSize: 11, textTransform: 'uppercase', color: 'rgba(245,245,247,0.35)', marginBottom: 8, fontFamily: 'var(--font-body)' }}>Cuentas de cobro</p>
                  <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, color: '#f5f5f7' }}>{invoices.length}</p>
                </div>
              </div>
            )}
            {invoices.length === 0 ? (
              <div style={{ padding: '48px 24px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, color: 'rgba(245,245,247,0.3)', fontSize: 14 }}>Aún no tienes cuentas de cobro generadas.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <div className="invoice-header" style={{ fontSize: 10, textTransform: 'uppercase', color: 'rgba(245,245,247,0.25)', fontFamily: 'var(--font-body)' }}>
                  <span>No.</span><span>Proyecto</span><span>Fecha</span><span style={{ textAlign: 'right' }}>Total</span><span />
                </div>
                {invoices.map((inv, i) => (
                  <div key={inv.id} className="invoice-row" style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
                    <span className="invoice-num" style={{ fontSize: 12, color: 'rgba(245,245,247,0.4)', fontWeight: 600 }}>{inv.invoice_number}</span>
                    <span className="invoice-name" style={{ fontSize: 13, color: '#f5f5f7' }}>{inv.project_name}</span>
                    <span className="invoice-date" style={{ fontSize: 12, color: 'rgba(245,245,247,0.4)' }}>{inv.date}</span>
                    <span className="invoice-total" style={{ fontSize: 13, color: '#c9b99a', fontFamily: 'var(--font-display)', fontWeight: 700, textAlign: 'right' }}>${inv.total_price.toLocaleString()}</span>
                    <div className="invoice-btn"><button onClick={() => handleRedownloadPDF(inv)} style={{ padding: '6px 14px', borderRadius: 8, fontSize: 11, background: 'rgba(201,185,154,0.08)', border: '1px solid rgba(201,185,154,0.2)', color: '#c9b99a', cursor: 'pointer', fontFamily: 'var(--font-body)', whiteSpace: 'nowrap' }}>↓ PDF</button></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* PERFIL */}
      {screen === 'profile' && (
        <div style={{ minHeight: '100vh', padding: '90px 20px 60px' }}>
          <div style={{ maxWidth: 560, margin: '0 auto' }}>
            <button onClick={() => setScreen('home')} style={{ background: 'transparent', border: 'none', color: 'rgba(245,245,247,0.4)', fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font-body)', marginBottom: 40 }}>← Volver</button>
            <p style={sectionLabelStyle}>Mi cuenta</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(24px, 5vw, 32px)', color: '#f5f5f7', marginBottom: 8 }}>Mi perfil</h2>
            <p style={{ fontSize: 14, color: 'rgba(245,245,247,0.35)', marginBottom: 40 }}>Esta información aparecerá en tus cuentas de cobro.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
              <div><label style={fieldLabelStyle}>Correo electrónico</label><input value={profile?.email || ''} readOnly style={{ ...inputStyle, opacity: 0.5, cursor: 'default' }} /></div>
              <div><label style={fieldLabelStyle}>Nombre completo *</label><input placeholder="Como aparece en tu cédula" value={profileForm.full_name} onChange={e => setProfileForm(f => ({ ...f, full_name: e.target.value }))} style={inputStyle} /></div>
              <div><label style={fieldLabelStyle}>Cédula o NIT</label><input placeholder="Ej: 1.234.567.890" value={profileForm.document_id} onChange={e => setProfileForm(f => ({ ...f, document_id: e.target.value }))} style={inputStyle} /></div>
              <div><label style={fieldLabelStyle}>Teléfono</label><input placeholder="Ej: 300 123 4567" value={profileForm.phone} onChange={e => setProfileForm(f => ({ ...f, phone: e.target.value }))} style={inputStyle} /></div>
              <div>
                <label style={fieldLabelStyle}>WhatsApp</label>
                <p style={{ fontSize: 11, color: 'rgba(245,245,247,0.3)', marginBottom: 6 }}>Con código de país. Ej: +573001234567</p>
                <input placeholder="+573001234567" value={profileForm.whatsapp} onChange={e => setProfileForm(f => ({ ...f, whatsapp: e.target.value }))} style={inputStyle} />
              </div>
              <div><label style={fieldLabelStyle}>Dirección</label><input placeholder="Ciudad, dirección" value={profileForm.address} onChange={e => setProfileForm(f => ({ ...f, address: e.target.value }))} style={inputStyle} /></div>
              <button onClick={handleSaveProfile} disabled={savingProfile} style={{ marginTop: 8, padding: '14px', background: '#c9b99a', color: '#000', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: savingProfile ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-display)', opacity: savingProfile ? 0.6 : 1 }}>
                {savingProfile ? 'Guardando...' : 'Guardar perfil'}
              </button>
            </div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 32 }}>
              <p style={sectionLabelStyle}>Canal de YouTube</p>
              <YouTubeCard profile={profile || {}} onDisconnect={handleDisconnectYouTube} />
            </div>
          </div>
        </div>
      )}

      {/* HOME */}
      {screen === 'home' && (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, padding: '80px 20px 40px' }}>
          <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(245,245,247,0.3)', textAlign: 'center' }}>Bienvenido, {userName}</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(28px, 7vw, 56px)', color: '#f5f5f7', letterSpacing: '-0.025em', textAlign: 'center', marginBottom: 8 }}>¿Qué deseas hacer?</h1>
          <div className="home-cards">
            <button onClick={() => setScreen('select-package')} style={{ flex: 1, minWidth: 200, padding: '36px 24px', background: 'rgba(201,185,154,0.06)', border: '1px solid rgba(201,185,154,0.3)', borderRadius: 20, cursor: 'pointer', textAlign: 'center' }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>＋</div>
              <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: '#c9b99a', marginBottom: 6 }}>Nuevo proyecto</p>
              <p style={{ fontSize: 13, color: 'rgba(245,245,247,0.4)', lineHeight: 1.6 }}>Selecciona un paquete y envía tu material</p>
            </button>
            <button onClick={() => setScreen('my-projects')} style={{ flex: 1, minWidth: 200, padding: '36px 24px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, cursor: 'pointer', textAlign: 'center' }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>📁</div>
              <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: '#f5f5f7', marginBottom: 6 }}>Mis proyectos</p>
              <p style={{ fontSize: 13, color: 'rgba(245,245,247,0.4)', lineHeight: 1.6 }}>
                Revisa el estado de tus trabajos
                {activeProjects.length > 0 && <span style={{ display: 'block', marginTop: 6, color: '#c9b99a', fontWeight: 600 }}>{activeProjects.length} activo{activeProjects.length !== 1 ? 's' : ''}</span>}
              </p>
            </button>
          </div>
        </div>
      )}

      {/* SELECTOR PAQUETE */}
      {screen === 'select-package' && !selectedPackage && (
        <div style={{ minHeight: '100vh', padding: '90px 20px 60px' }}>
          <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <button onClick={() => setScreen('home')} style={{ background: 'transparent', border: 'none', color: 'rgba(245,245,247,0.4)', fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font-body)', marginBottom: 40 }}>← Volver</button>
            <p style={sectionLabelStyle}>Nuevo proyecto</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(24px, 5vw, 48px)', color: '#f5f5f7', marginBottom: 48 }}>Selecciona tu paquete</h2>
            <div className="packages-grid">
              {PACKAGES.map(pkg => (
                <button key={pkg.id} onClick={() => setSelectedPackage(pkg)} style={{ padding: '32px 24px', textAlign: 'left', background: pkg.featured ? 'rgba(201,185,154,0.06)' : 'rgba(255,255,255,0.02)', border: `1px solid ${pkg.featured ? 'rgba(201,185,154,0.4)' : 'rgba(255,255,255,0.08)'}`, borderRadius: 20, cursor: 'pointer', position: 'relative' }}>
                  {pkg.featured && <span style={{ position: 'absolute', top: -1, left: '50%', transform: 'translateX(-50%)', background: '#c9b99a', color: '#000', fontSize: 9, textTransform: 'uppercase', padding: '4px 14px', borderRadius: '0 0 8px 8px', fontWeight: 600, fontFamily: 'var(--font-body)', whiteSpace: 'nowrap' }}>Más popular</span>}
                  <p style={{ fontSize: 11, color: 'rgba(245,245,247,0.35)', marginBottom: 10, fontFamily: 'var(--font-body)' }}>{pkg.duration}</p>
                  <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, color: pkg.featured ? '#c9b99a' : '#f5f5f7', marginBottom: 4 }}>{pkg.name}</p>
                  <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, color: '#c9b99a', marginBottom: 20 }}>${pkg.price.toLocaleString()} COP</p>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {pkg.includes.map((item, i) => (
                      <li key={i} style={{ fontSize: 12, color: 'rgba(245,245,247,0.5)', display: 'flex', gap: 8, fontFamily: 'var(--font-body)', lineHeight: 1.5 }}>
                        <span style={{ color: '#c9b99a', flexShrink: 0 }}>✓</span>{item}
                      </li>
                    ))}
                  </ul>
                  <div style={{ marginTop: 24, padding: '10px', background: 'rgba(201,185,154,0.08)', borderRadius: 8, textAlign: 'center' }}>
                    <span style={{ fontSize: 12, color: '#c9b99a', fontFamily: 'var(--font-body)', fontWeight: 600 }}>Seleccionar →</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FORMULARIO NUEVO PROYECTO */}
      {screen === 'select-package' && selectedPackage && (
        <div style={{ minHeight: '100vh', padding: '90px 20px 60px' }}>
          <div style={{ maxWidth: 680, margin: '0 auto' }}>
            <button onClick={() => setSelectedPackage(null)} style={{ background: 'transparent', border: 'none', color: 'rgba(245,245,247,0.4)', fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font-body)', marginBottom: 40 }}>← Cambiar paquete</button>
            <div style={{ padding: '20px 24px', border: '1px solid rgba(201,185,154,0.25)', borderRadius: 16, background: 'rgba(201,185,154,0.04)', marginBottom: 40 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <p style={{ fontSize: 11, color: 'rgba(245,245,247,0.35)', marginBottom: 4, fontFamily: 'var(--font-body)' }}>Paquete seleccionado</p>
                  <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, color: '#f5f5f7' }}>Edición {selectedPackage.name}</p>
                  <p style={{ fontSize: 12, color: 'rgba(245,245,247,0.4)', marginTop: 4 }}>{selectedPackage.duration}</p>
                </div>
                <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 24, color: '#c9b99a' }}>${selectedPackage.price.toLocaleString()} COP</p>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              <div>
                <span style={stepLabelStyle}>Paso 1 — Información del video</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div><label style={fieldLabelStyle}>Nombre del video</label><input placeholder="Ej: Reel semana 3, Tutorial producto X..." value={newForm.videoName} onChange={e => setNewForm(f => ({ ...f, videoName: e.target.value }))} style={inputStyle} /></div>
                  <div>
                    <label style={fieldLabelStyle}>Fecha de entrega deseada</label>
                    <div style={{ padding: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14 }}>
                      <DeliveryCalendar value={newForm.deliveryDate} onChange={date => setNewForm(f => ({ ...f, deliveryDate: date }))} />
                    </div>
                  </div>
                  <div>
                    <label style={fieldLabelStyle}>Links del material</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {newForm.links.map((link, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: 8 }}>
                          <input type="url" placeholder="WeTransfer, Drive, Dropbox..." value={link} onChange={e => { const links = [...newForm.links]; links[idx] = e.target.value; setNewForm(f => ({ ...f, links })) }} style={{ ...inputStyle, flex: 1 }} />
                          {newForm.links.length > 1 && <button onClick={() => setNewForm(f => ({ ...f, links: f.links.filter((_, i) => i !== idx) }))} style={{ padding: '0 14px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: 'rgba(245,245,247,0.35)', fontSize: 16, cursor: 'pointer' }}>×</button>}
                        </div>
                      ))}
                      <button onClick={() => setNewForm(f => ({ ...f, links: [...f.links, ''] }))} style={{ alignSelf: 'flex-start', padding: '8px 16px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'rgba(245,245,247,0.4)', fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>+ Agregar otro link</button>
                    </div>
                  </div>
                  <div><label style={fieldLabelStyle}>Notas extra</label><textarea placeholder="Instrucciones especiales, referencias, estilo..." value={newForm.note} onChange={e => setNewForm(f => ({ ...f, note: e.target.value }))} rows={3} style={{ ...inputStyle, resize: 'vertical' }} /></div>
                </div>
              </div>
              <div>
                <span style={stepLabelStyle}>Paso 2 — Comprobante de pago</span>
                <p style={{ fontSize: 12, color: 'rgba(245,245,247,0.35)', marginBottom: 12 }}>Paga <strong style={{ color: '#c9b99a' }}>${selectedPackage.price.toLocaleString()} COP</strong> a Nu · <strong style={{ color: 'rgba(245,245,247,0.6)' }}>Llave @AFB258</strong></p>
                <label style={fileButtonStyle(!!newForm.screenshot)}>
                  {newForm.screenshot ? `✓ ${newForm.screenshot.name}` : '📎 Adjuntar comprobante'}
                  <input type="file" accept="image/*" onChange={e => setNewForm(f => ({ ...f, screenshot: e.target.files?.[0] || null }))} style={{ display: 'none' }} />
                </label>
              </div>
              <div>
                <span style={stepLabelStyle}>Paso 3 — Enviar</span>
                <button onClick={handleCreateProject} disabled={creatingNew} style={{ width: '100%', padding: '15px', background: '#c9b99a', color: '#000', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: creatingNew ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-display)', opacity: creatingNew ? 0.6 : 1 }}>
                  {creatingNew ? 'Enviando...' : 'Enviar a producción'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MIS PROYECTOS */}
      {screen === 'my-projects' && (
        <div style={{ minHeight: '100vh', padding: '90px 20px 60px' }}>
          <div style={{ maxWidth: 860, margin: '0 auto' }}>
            <button onClick={() => setScreen('home')} style={{ background: 'transparent', border: 'none', color: 'rgba(245,245,247,0.4)', fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font-body)', marginBottom: 40 }}>← Volver</button>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(24px, 5vw, 32px)', color: '#f5f5f7', marginBottom: 32 }}>Mis proyectos</h2>
            <div style={{ display: 'flex', gap: 4, marginBottom: 32, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              {[{ key: 'active', label: `Activos (${activeProjects.length})` }, { key: 'completed', label: `Completados (${completedProjects.length})` }].map(t => (
                <button key={t.key} onClick={() => setTab(t.key as 'active' | 'completed')} style={{ padding: '12px 16px', background: 'transparent', border: 'none', borderBottom: `2px solid ${tab === t.key ? '#c9b99a' : 'transparent'}`, color: tab === t.key ? '#c9b99a' : 'rgba(245,245,247,0.35)', fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: tab === t.key ? 600 : 400, marginBottom: -1 }}>{t.label}</button>
              ))}
            </div>

            {tab === 'active' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {activeProjects.length === 0 ? (
                  <div style={{ padding: '48px 24px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, color: 'rgba(245,245,247,0.3)', fontSize: 14 }}>No tienes proyectos activos aún.</div>
                ) : activeProjects.map(p => {
                  const form = getForm(p.id); const hasSent = !!p.payment_screenshot_url; const projectMaterials = materials[p.id] || []; const isAddingExtra = addingMaterial === p.id; const extras = extraLinks[p.id] || ['']
                  return (
                    <div key={p.id} style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, overflow: 'hidden', background: 'rgba(255,255,255,0.02)' }}>
                      <div className="project-header">
                        <div>
                          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: '#f5f5f7', marginBottom: 4 }}>{p.name}</h3>
                          <p style={{ fontSize: 12, color: 'rgba(245,245,247,0.35)' }}>Entrega estimada: {p.estimated_days} días</p>
                        </div>
                        <div className="project-actions">
                          <span style={{ padding: '6px 14px', borderRadius: 100, fontSize: 11, textTransform: 'uppercase', background: `${STATUS_COLOR[p.status]}18`, color: STATUS_COLOR[p.status] }}>{STATUS_LABEL[p.status]}</span>
                          <button onClick={() => saveAndGeneratePDF(p)} style={{ padding: '6px 14px', borderRadius: 100, fontSize: 11, textTransform: 'uppercase', background: 'rgba(201,185,154,0.08)', border: '1px solid rgba(201,185,154,0.25)', color: '#c9b99a', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>↓ Cuenta de cobro</button>
                        </div>
                      </div>
                      {p.total_price > 0 && (
                        <div style={{ padding: '12px 20px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: 13, color: 'rgba(245,245,247,0.35)' }}>Total</span>
                          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, color: '#c9b99a' }}>${p.total_price.toLocaleString()} COP</span>
                        </div>
                      )}
                      {projectMaterials.length > 0 && (
                        <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                          <p style={{ fontSize: 11, textTransform: 'uppercase', color: 'rgba(245,245,247,0.25)', marginBottom: 10, fontFamily: 'var(--font-body)' }}>Material enviado</p>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {projectMaterials.map((m, idx) => (
                              <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: 8 }}>
                                <span style={{ fontSize: 11, color: '#97c459', fontWeight: 600, minWidth: 18 }}>{idx + 1}</span>
                                <div style={{ flex: 1 }}>{m.note && <p style={{ fontSize: 12, color: 'rgba(245,245,247,0.5)', marginBottom: 2 }}>{m.note.split('\n')[0]}</p>}<p style={{ fontSize: 11, color: 'rgba(245,245,247,0.25)' }}>{new Date(m.created_at).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })}</p></div>
                                <span style={{ fontSize: 11, color: '#97c459' }}>✓</span>
                              </div>
                            ))}
                          </div>
                          {hasSent && !isAddingExtra && <button onClick={() => setAddingMaterial(p.id)} style={{ marginTop: 12, padding: '8px 18px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'rgba(245,245,247,0.45)', fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>+ Agregar material adicional</button>}
                          {isAddingExtra && (
                            <div style={{ marginTop: 16, padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.07)' }}>
                              <p style={{ fontSize: 11, textTransform: 'uppercase', color: '#c9b99a', marginBottom: 12, fontFamily: 'var(--font-body)' }}>Material adicional</p>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
                                {extras.map((link, idx) => (
                                  <div key={idx} style={{ display: 'flex', gap: 8 }}>
                                    <input type="url" placeholder="WeTransfer, Drive, Dropbox..." value={link} onChange={e => { const l = [...extras]; l[idx] = e.target.value; setExtraLinks(prev => ({ ...prev, [p.id]: l })) }} style={{ ...inputStyle, flex: 1 }} />
                                    {extras.length > 1 && <button onClick={() => setExtraLinks(prev => ({ ...prev, [p.id]: extras.filter((_, i) => i !== idx) }))} style={{ padding: '0 14px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: 'rgba(245,245,247,0.35)', fontSize: 16, cursor: 'pointer' }}>×</button>}
                                  </div>
                                ))}
                                <button onClick={() => setExtraLinks(prev => ({ ...prev, [p.id]: [...extras, ''] }))} style={{ alignSelf: 'flex-start', padding: '7px 14px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'rgba(245,245,247,0.4)', fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>+ Otro link</button>
                              </div>
                              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                <button onClick={() => handleAddExtraMaterial(p)} disabled={sending === `extra-${p.id}`} style={{ flex: 1, minWidth: 160, padding: '11px', background: '#c9b99a', color: '#000', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)', opacity: sending === `extra-${p.id}` ? 0.6 : 1 }}>{sending === `extra-${p.id}` ? 'Enviando...' : 'Enviar material adicional'}</button>
                                <button onClick={() => { setAddingMaterial(null); setExtraLinks(prev => ({ ...prev, [p.id]: [''] })) }} style={{ padding: '11px 16px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'rgba(245,245,247,0.4)', fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Cancelar</button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      {projectMaterials.length === 0 && (
                        <div style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: 20 }}>
                          <div>
                            <span style={stepLabelStyle}>Paso 1 — Info del video</span>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                              <div><label style={fieldLabelStyle}>Nombre del video</label><input placeholder="Ej: Reel semana 3..." value={form.videoName} onChange={e => setForms(prev => ({ ...prev, [p.id]: { ...getForm(p.id), videoName: e.target.value } }))} style={inputStyle} /></div>
                              <div>
                                <label style={fieldLabelStyle}>Links del material</label>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                  {form.links.map((link, idx) => (
                                    <div key={idx} style={{ display: 'flex', gap: 8 }}>
                                      <input type="url" placeholder="WeTransfer, Drive, Dropbox..." value={link} onChange={e => updateLink(p.id, idx, e.target.value)} style={{ ...inputStyle, flex: 1 }} />
                                      {form.links.length > 1 && <button onClick={() => removeLink(p.id, idx)} style={{ padding: '0 14px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: 'rgba(245,245,247,0.35)', fontSize: 16, cursor: 'pointer' }}>×</button>}
                                    </div>
                                  ))}
                                  <button onClick={() => addLink(p.id)} style={{ alignSelf: 'flex-start', padding: '8px 16px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'rgba(245,245,247,0.4)', fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>+ Agregar otro link</button>
                                </div>
                              </div>
                              <div><label style={fieldLabelStyle}>Notas extra</label><textarea placeholder="Instrucciones especiales..." value={form.note} onChange={e => setForms(prev => ({ ...prev, [p.id]: { ...getForm(p.id), note: e.target.value } }))} rows={2} style={{ ...inputStyle, resize: 'vertical' }} /></div>
                            </div>
                          </div>
                          {!hasSent && (
                            <div>
                              <span style={stepLabelStyle}>Paso 2 — Comprobante</span>
                              <p style={{ fontSize: 12, color: 'rgba(245,245,247,0.35)', marginBottom: 12 }}>Paga a Nu · <strong style={{ color: 'rgba(245,245,247,0.6)' }}>Llave @AFB258</strong></p>
                              <label style={fileButtonStyle(!!form.screenshot)}>
                                {form.screenshot ? `✓ ${(form.screenshot as File).name}` : '📎 Adjuntar comprobante'}
                                <input type="file" accept="image/*" onChange={e => setForms(prev => ({ ...prev, [p.id]: { ...getForm(p.id), screenshot: e.target.files?.[0] || null } }))} style={{ display: 'none' }} />
                              </label>
                            </div>
                          )}
                          {hasSent && <p style={{ fontSize: 13, color: '#97c459' }}>✓ Comprobante ya enviado</p>}
                          <div>
                            <span style={stepLabelStyle}>{hasSent ? 'Paso 2' : 'Paso 3'} — Enviar</span>
                            <button onClick={() => handleSubmit(p)} disabled={sending === p.id} style={{ width: '100%', padding: '14px', background: '#c9b99a', color: '#000', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: sending === p.id ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-display)', opacity: sending === p.id ? 0.6 : 1 }}>
                              {sending === p.id ? 'Enviando...' : 'Enviar a producción'}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {tab === 'completed' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {completedProjects.length === 0 ? (
                  <div style={{ padding: '48px 24px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, color: 'rgba(245,245,247,0.3)', fontSize: 14 }}>Aún no tienes proyectos completados.</div>
                ) : completedProjects.map(p => (
                  <div key={p.id} style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, overflow: 'hidden', background: 'rgba(255,255,255,0.02)', opacity: 0.85 }}>
                    <div className="project-header">
                      <div>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: '#f5f5f7', marginBottom: 4 }}>{p.name}</h3>
                        <p style={{ fontSize: 12, color: 'rgba(245,245,247,0.35)' }}>{new Date(p.created_at).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      </div>
                      <div className="project-actions">
                        <span style={{ padding: '6px 14px', borderRadius: 100, fontSize: 11, textTransform: 'uppercase', background: 'rgba(151,196,89,0.12)', color: '#97c459' }}>Entregado</span>
                        <button onClick={() => saveAndGeneratePDF(p)} style={{ padding: '6px 14px', borderRadius: 100, fontSize: 11, textTransform: 'uppercase', background: 'rgba(201,185,154,0.08)', border: '1px solid rgba(201,185,154,0.25)', color: '#c9b99a', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>↓ Cuenta de cobro</button>
                      </div>
                    </div>
                    {(deliveries[p.id] || []).map((d, idx) => (
                      <div key={d.id} style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(151,196,89,0.03)' }}>
                        <p style={{ fontSize: 11, textTransform: 'uppercase', color: '#97c459', marginBottom: 10, fontFamily: 'var(--font-body)', fontWeight: 600 }}>📥 Entrega {idx + 1}</p>
                        <a href={d.link} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: '#7ab4e8', textDecoration: 'none', display: 'flex', alignItems: 'flex-start', gap: 6, wordBreak: 'break-all', marginBottom: d.note ? 10 : 0 }}>
                          <span style={{ flexShrink: 0 }}>🔗</span>
                          <span style={{ borderBottom: '1px solid rgba(122,180,232,0.3)' }}>{d.link}</span>
                        </a>
                        {d.note && <div style={{ marginTop: 8, padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, borderLeft: '2px solid rgba(151,196,89,0.3)' }}><p style={{ fontSize: 12, color: 'rgba(245,245,247,0.5)', lineHeight: 1.5 }}>📝 {d.note}</p></div>}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
