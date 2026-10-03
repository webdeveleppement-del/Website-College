import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { BookOpen, Building2, Plus, Search, Trash2, Users, X } from 'lucide-react'
import { api } from '../../../../api/client'
import './Classes.css'
import '../AdminFormSizing.css'

type SchoolClass = {
  id: number
  name: string
  level: string
  academic_year: string
  room: string
  capacity: number
  student_count: number
  is_active: boolean
}

type ClassForm = {
  name: string
  level: string
  academic_year: string
  room: string
  capacity: string
}

const emptyForm: ClassForm = {
  name: '',
  level: '',
  academic_year: '',
  room: '',
  capacity: '40',
}

export default function Classes() {
  const [classes, setClasses] = useState<SchoolClass[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<ClassForm>(emptyForm)
  const [error, setError] = useState('')
  const [searchParams, setSearchParams] = useSearchParams()
  const [showForm, setShowForm] = useState(searchParams.get('action') === 'create')

  async function loadClasses() {
    setLoading(true)
    setError('')
    try {
      const response = await api.get<SchoolClass[] | { results: SchoolClass[] }>('/classes/')
      const data = response.data
      setClasses(Array.isArray(data) ? data : data.results)
    } catch {
      setError('Impossible de charger les classes depuis Django.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadClasses()
  }, [])

  async function createClass(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      const response = await api.post<SchoolClass>('/classes/', {
        ...form,
        capacity: Number(form.capacity),
      })
      setClasses((current) => [...current, response.data])
      setForm(emptyForm)
      setShowForm(false)
      setSearchParams({})
    } catch {
      setError("La création de la classe a échoué. Vérifiez les champs envoyés à Django.")
    } finally {
      setSaving(false)
    }
  }

  async function deleteClass(schoolClass: SchoolClass) {
    if (!window.confirm(`Supprimer la classe ${schoolClass.name} ?`)) return
    try {
      await api.delete(`/classes/${schoolClass.id}/`)
      setClasses((current) => current.filter((item) => item.id !== schoolClass.id))
    } catch {
      setError('La suppression a échoué. Vérifiez les droits administrateur.')
    }
  }

  const filteredClasses = useMemo(() => {
    const value = search.trim().toLowerCase()
    if (!value) return classes
    return classes.filter((schoolClass) =>
      `${schoolClass.name} ${schoolClass.level} ${schoolClass.academic_year} ${schoolClass.room}`
        .toLowerCase()
        .includes(value),
    )
  }, [classes, search])

  const studentCount = classes.reduce((total, schoolClass) => total + schoolClass.student_count, 0)
  const activeClasses = classes.filter((schoolClass) => schoolClass.is_active).length

  return (
    <section className="classes-page">
      <header className="classes-header">
        <div>
          <span className="page-eyebrow">SCOLARITÉ</span>
          <h1>Classes</h1>
          <p>Gérez les classes enregistrées dans Django.</p>
        </div>
        <div className="classes-header-actions">
          <button type="button" className="class-secondary" onClick={() => void loadClasses()} disabled={loading}>
            Actualiser
          </button>
          <button type="button" className="class-primary" onClick={() => setShowForm(true)}>
            <Plus size={17} /> Nouvelle classe
          </button>
        </div>
      </header>

      {error && <div className="classes-error" role="alert">{error}</div>}

      <div className="classes-summary">
        <Summary icon={<BookOpen />} value={classes.length} label="Classes" />
        <Summary icon={<Users />} value={studentCount} label="Élèves inscrits" />
        <Summary icon={<Building2 />} value={activeClasses} label="Classes actives" />
      </div>

      <div className="classes-panel">
        <div className="classes-toolbar">
          <div>
            <h2>Toutes les classes</h2>
            <p>{filteredClasses.length} classe(s)</p>
          </div>
          <div className="classes-search">
            <Search size={17} />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Rechercher une classe..." aria-label="Rechercher une classe" />
            {search && <button type="button" onClick={() => setSearch('')} aria-label="Effacer"><X size={16} /></button>}
          </div>
        </div>

        <div className="classes-grid">
          {filteredClasses.map((schoolClass) => (
            <article className="class-card" key={schoolClass.id}>
              <div className="class-card-top">
                <div className="class-icon"><BookOpen size={19} /></div>
                <button type="button" className="class-menu" title="Supprimer" onClick={() => void deleteClass(schoolClass)}>
                  <Trash2 size={16} />
                </button>
              </div>
              <span className="class-level">{schoolClass.level}</span>
              <h3>{schoolClass.name}</h3>
              <p className="class-year">{schoolClass.academic_year}{schoolClass.room ? ` · Salle ${schoolClass.room}` : ''}</p>
              <div className="class-card-info">
                <div><small>ÉLÈVES</small><strong>{schoolClass.student_count}</strong></div>
                <div><small>CAPACITÉ</small><strong>{schoolClass.capacity}</strong></div>
              </div>
              <span className={`class-status ${schoolClass.is_active ? 'active' : 'inactive'}`}>
                {schoolClass.is_active ? 'Active' : 'Inactive'}
              </span>
            </article>
          ))}
        </div>
        {loading && <div className="classes-empty">Chargement des classes...</div>}
        {!loading && filteredClasses.length === 0 && <div className="classes-empty">Aucune classe trouvée.</div>}
      </div>

      {showForm && (
        <div className="classes-modal-overlay" onClick={() => setShowForm(false)}>
          <div className="classes-modal" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="classes-modal-close" onClick={() => setShowForm(false)} aria-label="Fermer"><X size={20} /></button>
            <span className="page-eyebrow">NOUVELLE CLASSE</span>
            <h2>Créer une classe</h2>
            <form onSubmit={(event) => void createClass(event)}>
              <label>Nom de la classe<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Ex. 6e A" /></label>
              <label>Niveau<input required value={form.level} onChange={(event) => setForm({ ...form, level: event.target.value })} placeholder="Ex. Collège" /></label>
              <label>Année scolaire<input required value={form.academic_year} onChange={(event) => setForm({ ...form, academic_year: event.target.value })} placeholder="Ex. 2025-2026" /></label>
              <div className="classes-form-row">
                <label>Salle<input value={form.room} onChange={(event) => setForm({ ...form, room: event.target.value })} placeholder="Ex. B12" /></label>
                <label>Capacité<input required min="1" type="number" value={form.capacity} onChange={(event) => setForm({ ...form, capacity: event.target.value })} /></label>
              </div>
              <div className="classes-modal-actions">
                <button type="button" className="class-secondary" onClick={() => setShowForm(false)}>Annuler</button>
                <button type="submit" className="class-primary" disabled={saving}>{saving ? 'Création...' : 'Créer la classe'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}

function Summary({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) {
  return <div><span className="summary-icon">{icon}</span><strong>{value}</strong><span>{label}</span></div>
}
