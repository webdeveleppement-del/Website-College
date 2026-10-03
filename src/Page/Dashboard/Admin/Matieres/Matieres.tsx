import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { BookOpen, Plus, Search, Trash2, X } from 'lucide-react'
import { api } from '../../../../api/client'
import './Matieres.css'

type Subject = {
  id: number
  name: string
  code: string
  coefficient: number | string
  description: string
  is_active: boolean
}

type SubjectForm = {
  name: string
  code: string
  coefficient: string
  description: string
}

const emptyForm: SubjectForm = {
  name: '',
  code: '',
  coefficient: '1',
  description: '',
}

export default function Matieres() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<SubjectForm>(emptyForm)
  const [error, setError] = useState('')

  async function loadSubjects() {
    setLoading(true)
    setError('')
    try {
      const response = await api.get<Subject[] | { results: Subject[] }>('/subjects/')
      const data = response.data
      setSubjects(Array.isArray(data) ? data : data.results)
    } catch {
      setError('Impossible de charger les matières depuis Django.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadSubjects()
  }, [])

  async function createSubject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      const response = await api.post<Subject>('/subjects/', {
        ...form,
        code: form.code.trim().toUpperCase(),
        coefficient: Number(form.coefficient),
      })
      setSubjects((current) => [...current, response.data])
      setForm(emptyForm)
      setShowForm(false)
    } catch {
      setError('La création de la matière a échoué. Vérifiez le nom, le code et le coefficient.')
    } finally {
      setSaving(false)
    }
  }

  async function deleteSubject(subject: Subject) {
    if (!window.confirm(`Supprimer la matière ${subject.name} ?`)) return
    try {
      await api.delete(`/subjects/${subject.id}/`)
      setSubjects((current) => current.filter((item) => item.id !== subject.id))
    } catch {
      setError('La suppression a échoué. Vérifiez les droits administrateur.')
    }
  }

  const filteredSubjects = useMemo(() => {
    const value = search.trim().toLowerCase()
    if (!value) return subjects
    return subjects.filter((subject) =>
      `${subject.name} ${subject.code} ${subject.description}`.toLowerCase().includes(value),
    )
  }, [subjects, search])

  const activeSubjects = subjects.filter((subject) => subject.is_active).length

  return (
    <section className="subjects-page">
      <header className="subjects-header">
        <div>
          <span className="page-eyebrow">PÉDAGOGIE</span>
          <h1>Matières</h1>
          <p>Gérez les matières enregistrées dans Django.</p>
        </div>
        <div className="subjects-header-actions">
          <button type="button" className="subject-secondary" onClick={() => void loadSubjects()} disabled={loading}>Actualiser</button>
          <button type="button" className="subject-primary" onClick={() => setShowForm(true)}><Plus size={17} /> Nouvelle matière</button>
        </div>
      </header>

      {error && <div className="subjects-error" role="alert">{error}</div>}

      <div className="subjects-summary">
        <Summary value={subjects.length} label="Matières configurées" />
        <Summary value={activeSubjects} label="Matières actives" />
        <Summary value={new Set(subjects.map((subject) => subject.code)).size} label="Codes uniques" />
      </div>

      <div className="subjects-panel">
        <div className="subjects-toolbar">
          <div><h2>Liste des matières</h2><p>{filteredSubjects.length} matière(s)</p></div>
          <div className="subjects-search">
            <Search size={17} />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Rechercher une matière..." aria-label="Rechercher une matière" />
            {search && <button type="button" onClick={() => setSearch('')} aria-label="Effacer"><X size={16} /></button>}
          </div>
        </div>

        <div className="subjects-grid">
          {filteredSubjects.map((subject) => (
            <article className="subject-card" key={subject.id}>
              <div className="subject-top">
                <div className="subject-symbol"><BookOpen size={19} /></div>
                <button type="button" className="subject-delete" title="Supprimer" onClick={() => void deleteSubject(subject)}><Trash2 size={16} /></button>
              </div>
              <span className="subject-code">{subject.code}</span>
              <h2>{subject.name}</h2>
              <div className="subject-details">
                <div><small>COEFFICIENT</small><strong>{subject.coefficient}</strong></div>
                <div><small>DESCRIPTION</small><strong>{subject.description || 'Non renseignée'}</strong></div>
              </div>
              <div className={`subject-status ${subject.is_active ? 'active' : 'inactive'}`}><i />{subject.is_active ? 'Active' : 'Inactive'}</div>
            </article>
          ))}
        </div>
        {loading && <div className="subjects-empty">Chargement des matières...</div>}
        {!loading && filteredSubjects.length === 0 && <div className="subjects-empty">Aucune matière trouvée.</div>}
      </div>

      {showForm && (
        <div className="subjects-modal-overlay" onClick={() => setShowForm(false)}>
          <div className="subjects-modal" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="subjects-modal-close" onClick={() => setShowForm(false)} aria-label="Fermer"><X size={20} /></button>
            <span className="page-eyebrow">NOUVELLE MATIÈRE</span>
            <h2>Créer une matière</h2>
            <form onSubmit={(event) => void createSubject(event)}>
              <label>Nom<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Ex. Mathématiques" /></label>
              <label>Code<input required value={form.code} onChange={(event) => setForm({ ...form, code: event.target.value })} placeholder="Ex. MATH" /></label>
              <label>Coefficient<input required min="0.01" step="0.01" type="number" value={form.coefficient} onChange={(event) => setForm({ ...form, coefficient: event.target.value })} /></label>
              <label>Description<textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} rows={3} /></label>
              <div className="subjects-modal-actions">
                <button type="button" className="subject-secondary" onClick={() => setShowForm(false)}>Annuler</button>
                <button type="submit" className="subject-primary" disabled={saving}>{saving ? 'Création...' : 'Créer la matière'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}

function Summary({ value, label }: { value: number; label: string }) {
  return <div><span className="summary-symbol"><BookOpen size={19} /></span><strong>{value}</strong><span>{label}</span></div>
}
