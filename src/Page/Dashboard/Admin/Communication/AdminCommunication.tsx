import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { FormEvent, ReactNode } from 'react'
import { api } from '../../../../api/client'
import './AdminCommunication.css'
import '../AdminFormSizing.css'

type News = {
  id: number
  title: string
  slug: string
  category: string
  excerpt: string
  content: string
  is_published: boolean
  published_at: string | null
  author_name: string | null
  created_at: string
}

type Admission = {
  id: number
  first_name: string
  last_name: string
  email: string
  phone: string
  requested_class_name: string | null
  status: string
  status_label: string
  message: string
  admin_note: string
  created_at: string
}

type ContactMessage = {
  id: number
  name: string
  email: string
  phone: string
  subject: string
  message: string
  status: string
  status_label: string
  admin_reply: string
  created_at: string
}

function listData<T>(data: T[] | { results: T[] }) {
  return Array.isArray(data) ? data : data.results
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('fr-FR')
}

export function Actualites() {
  const [items, setItems] = useState<News[]>([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ title: '', category: 'Actualité', excerpt: '', content: '', is_published: false })
  const [searchParams, setSearchParams] = useSearchParams()
  const [showForm, setShowForm] = useState(searchParams.get('action') === 'create')

  async function load() {
    setLoading(true)
    setError('')
    try {
      const response = await api.get<News[] | { results: News[] }>('/news/news/')
      setItems(listData(response.data))
    } catch {
      setError('Impossible de charger les actualités depuis Django.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void load() }, [])

  async function create(event: FormEvent) {
    event.preventDefault()
    setError('')
    try {
      await api.post('/news/news/', {
        ...form,
        slug: form.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        published_at: form.is_published ? new Date().toISOString() : null,
      })
      setForm({ title: '', category: 'Actualité', excerpt: '', content: '', is_published: false })
      setShowForm(false)
      setSearchParams({})
      await load()
    } catch {
      setError('Impossible de créer cette actualité.')
    }
  }

  async function toggle(item: News) {
    try {
      await api.patch(`/news/news/${item.id}/`, {
        is_published: !item.is_published,
        published_at: !item.is_published ? new Date().toISOString() : null,
      })
      await load()
    } catch {
      setError('Impossible de modifier la publication.')
    }
  }

  async function remove(id: number) {
    if (!window.confirm('Supprimer définitivement cette actualité ?')) return
    try {
      await api.delete(`/news/news/${id}/`)
      setItems((current) => current.filter((item) => item.id !== id))
    } catch {
      setError('Impossible de supprimer cette actualité.')
    }
  }

  const filtered = items.filter((item) => `${item.title} ${item.category}`.toLowerCase().includes(query.toLowerCase()))
  return (
    <AdminPage title="Actualités" description="Publiez et gérez les informations visibles sur le site.">
      <div className="admin-grid">
        {showForm && <form className="admin-panel admin-form" onSubmit={create}>
          <h2>Nouvelle actualité</h2>
          <input required placeholder="Titre" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <input placeholder="Catégorie" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          <textarea placeholder="Résumé" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
          <textarea required placeholder="Contenu" rows={7} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
          <label className="admin-check"><input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} /> Publier immédiatement</label>
          <button className="admin-primary" type="submit">Créer l'actualité</button>
        </form>}
        <div className="admin-panel">
          <div className="admin-panel-heading"><h2>Articles enregistrés</h2><div className="admin-actions"><button type="button" onClick={() => setShowForm(true)}>Nouvelle actualité</button><button type="button" onClick={() => void load()}>Actualiser</button></div></div>
          <input className="admin-search" placeholder="Rechercher..." value={query} onChange={(e) => setQuery(e.target.value)} />
          {loading ? <State text="Chargement..." /> : filtered.length === 0 ? <State text="Aucune actualité." /> : <div className="admin-list">{filtered.map((item) => <article className="admin-list-row" key={item.id}><div><strong>{item.title}</strong><small>{item.category} · {formatDate(item.created_at)}</small></div><span className={`admin-badge ${item.is_published ? 'success' : 'muted'}`}>{item.is_published ? 'Publié' : 'Brouillon'}</span><button type="button" onClick={() => void toggle(item)}>Modifier</button><button type="button" className="danger-text" onClick={() => void remove(item.id)}>Supprimer</button></article>)}</div>}
        </div>
      </div>
      {error && <div className="admin-error" role="alert">{error}</div>}
    </AdminPage>
  )
}

export function Admissions() {
  const [items, setItems] = useState<Admission[]>([])
  const [filter, setFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function load() {
    setLoading(true); setError('')
    try {
      const response = await api.get<Admission[] | { results: Admission[] }>('/admissions/admissions/')
      setItems(listData(response.data))
    } catch { setError('Impossible de charger les admissions depuis Django.') } finally { setLoading(false) }
  }
  useEffect(() => { void load() }, [])
  async function update(id: number, status: string) {
    try { await api.patch(`/admissions/admissions/${id}/`, { status }); setItems((current) => current.map((item) => item.id === id ? { ...item, status, status_label: statusLabels[status] || status } : item)) }
    catch { setError('Impossible de mettre à jour le statut de cette admission.') }
  }
  const filtered = items.filter((item) => !filter || item.status === filter)
  return <AdminPage title="Admissions" description="Traitez les demandes d'inscription reçues depuis le site."><div className="admin-panel"><div className="admin-panel-heading"><h2>Demandes reçues ({filtered.length})</h2><div className="admin-actions"><select value={filter} onChange={(e) => setFilter(e.target.value)}><option value="">Tous les statuts</option>{Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select><button type="button" onClick={() => void load()}>Actualiser</button></div></div>{loading ? <State text="Chargement..." /> : filtered.length === 0 ? <State text="Aucune demande d'admission." /> : <div className="admin-list">{filtered.map((item) => <article className="admin-list-row admin-list-column" key={item.id}><div><strong>{item.first_name} {item.last_name}</strong><small>{item.email} · {item.phone} · {formatDate(item.created_at)}</small>{item.requested_class_name && <small>Classe demandée : {item.requested_class_name}</small>}{item.message && <p>{item.message}</p>}</div><div className="admin-actions"><span className="admin-badge">{item.status_label}</span><select value={item.status} onChange={(e) => void update(item.id, e.target.value)}>{Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div></article>)}</div>}</div>{error && <div className="admin-error" role="alert">{error}</div>}</AdminPage>
}

export function Messages() {
  const [items, setItems] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  async function load() {
    setLoading(true); setError('')
    try { const response = await api.get<ContactMessage[] | { results: ContactMessage[] }>('/contact/messages/'); setItems(listData(response.data)) }
    catch { setError('Impossible de charger les messages depuis Django.') } finally { setLoading(false) }
  }
  useEffect(() => { void load() }, [])
  async function update(id: number, status: string) {
    try { await api.patch(`/contact/messages/${id}/`, { status }); setItems((current) => current.map((item) => item.id === id ? { ...item, status, status_label: messageStatusLabels[status] || status } : item)) }
    catch { setError('Impossible de modifier le statut du message.') }
  }
  return <AdminPage title="Messages" description="Consultez les messages envoyés par les visiteurs."><div className="admin-panel"><div className="admin-panel-heading"><h2>Boîte de réception ({items.length})</h2><button type="button" onClick={() => void load()}>Actualiser</button></div>{loading ? <State text="Chargement..." /> : items.length === 0 ? <State text="Aucun message reçu." /> : <div className="admin-list">{items.map((item) => <article className="admin-list-row admin-list-column" key={item.id}><div><strong>{item.subject}</strong><small>{item.name} · {item.email} · {formatDate(item.created_at)}</small><p>{item.message}</p>{item.admin_reply && <small>Réponse : {item.admin_reply}</small>}</div><div className="admin-actions"><span className="admin-badge">{item.status_label}</span><select value={item.status} onChange={(e) => void update(item.id, e.target.value)}>{Object.entries(messageStatusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div></article>)}</div>}{error && <div className="admin-error" role="alert">{error}</div>}</div></AdminPage>
}

const statusLabels: Record<string, string> = { PENDING: 'En attente', REVIEWING: 'En étude', ACCEPTED: 'Acceptée', REJECTED: 'Refusée' }
const messageStatusLabels: Record<string, string> = { NEW: 'Nouveau', READ: 'Lu', PROCESSING: 'En traitement', RESOLVED: 'Résolu' }

function AdminPage({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return <section className="admin-resource-page"><header className="admin-resource-header"><div><span>ADMINISTRATION</span><h1>{title}</h1><p>{description}</p></div></header>{children}</section>
}
function State({ text }: { text: string }) { return <div className="admin-state">{text}</div> }
