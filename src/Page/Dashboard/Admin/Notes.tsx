import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react'
import { BookOpen, ClipboardList, Pencil, Plus, Search, Trash2, X } from 'lucide-react'
import { api } from '../../../api/client'
import './Notes.css'

type Student = { id: number; first_name: string; last_name: string; matricule: string }
type Subject = { id: number; name: string; code: string }
type Grade = {
  id: number
  student: number
  student_name: string
  subject: number
  subject_name: string
  value: number | string
  coefficient: number | string
  assessment: string
  comment: string
  date: string
}
type GradeForm = {
  student: string
  subject: string
  value: string
  coefficient: string
  assessment: string
  comment: string
}

const emptyForm: GradeForm = {
  student: '',
  subject: '',
  value: '',
  coefficient: '1',
  assessment: '',
  comment: '',
}

function listData<T>(data: T[] | { results: T[] }) {
  return Array.isArray(data) ? data : data.results
}

export default function Notes() {
  const [grades, setGrades] = useState<Grade[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [subjectFilter, setSubjectFilter] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<GradeForm>(emptyForm)

  async function loadData() {
    setLoading(true)
    setError('')
    try {
      const [gradesResponse, studentsResponse, subjectsResponse] = await Promise.all([
        api.get<Grade[] | { results: Grade[] }>('/grades/'),
        api.get<Student[] | { results: Student[] }>('/students/'),
        api.get<Subject[] | { results: Subject[] }>('/subjects/'),
      ])
      setGrades(listData(gradesResponse.data))
      setStudents(listData(studentsResponse.data))
      setSubjects(listData(subjectsResponse.data))
    } catch {
      setError('Impossible de charger les notes, les élèves et les matières depuis Django.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadData()
  }, [])

  const filteredGrades = useMemo(() => {
    const query = search.trim().toLowerCase()
    return grades.filter((grade) => {
      const matchesSearch =
        !query ||
        grade.student_name.toLowerCase().includes(query) ||
        grade.subject_name.toLowerCase().includes(query) ||
        grade.assessment.toLowerCase().includes(query)
      return matchesSearch && (!subjectFilter || String(grade.subject) === subjectFilter)
    })
  }, [grades, search, subjectFilter])

  const average = useMemo(() => {
    const coefficientTotal = grades.reduce((sum, grade) => sum + Number(grade.coefficient), 0)
    if (!coefficientTotal) return 0
    return grades.reduce((sum, grade) => sum + Number(grade.value) * Number(grade.coefficient), 0) / coefficientTotal
  }, [grades])

  function openCreate() {
    setEditingId(null)
    setForm(emptyForm)
    setShowModal(true)
  }

  function openEdit(grade: Grade) {
    setEditingId(grade.id)
    setForm({
      student: String(grade.student),
      subject: String(grade.subject),
      value: String(grade.value),
      coefficient: String(grade.coefficient),
      assessment: grade.assessment || '',
      comment: grade.comment || '',
    })
    setShowModal(true)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      const payload = {
        student: Number(form.student),
        subject: Number(form.subject),
        value: Number(form.value),
        coefficient: Number(form.coefficient || 1),
        assessment: form.assessment.trim(),
        comment: form.comment.trim(),
      }
      if (editingId) {
        await api.put(`/grades/${editingId}/`, payload)
      } else {
        await api.post('/grades/', payload)
      }
      setShowModal(false)
      await loadData()
    } catch {
      setError("L'enregistrement de la note a échoué. Vérifiez les champs et vos droits.")
    } finally {
      setSaving(false)
    }
  }

  async function deleteGrade(grade: Grade) {
    if (!window.confirm(`Supprimer la note de ${grade.student_name} ?`)) return
    try {
      await api.delete(`/grades/${grade.id}/`)
      setGrades((current) => current.filter((item) => item.id !== grade.id))
    } catch {
      setError('La suppression de la note a échoué.')
    }
  }

  return (
    <section className="admin-notes">
      <header className="notes-header">
        <div>
          <span className="notes-eyebrow">ADMINISTRATION</span>
          <h1>Gestion des notes</h1>
          <p>Consultez et gérez les résultats scolaires enregistrés dans Django.</p>
        </div>
        <div className="notes-header-actions">
          <button type="button" className="notes-secondary-button" onClick={() => void loadData()} disabled={loading}>Actualiser</button>
          <button type="button" className="notes-primary-button" onClick={openCreate}><Plus size={17} /> Ajouter une note</button>
        </div>
      </header>

      {error && <div className="notes-error" role="alert">{error}</div>}

      <section className="notes-stat-grid">
        <Stat icon={<ClipboardList />} label="Total des notes" value={grades.length} />
        <Stat icon={<BookOpen />} label="Élèves concernés" value={new Set(grades.map((grade) => grade.student)).size} />
        <Stat icon={<BookOpen />} label="Matières évaluées" value={new Set(grades.map((grade) => grade.subject)).size} />
        <Stat icon={<ClipboardList />} label="Moyenne générale" value={`${average.toFixed(2)}/20`} />
      </section>

      <section className="notes-panel">
        <div className="notes-toolbar">
          <div className="notes-search"><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Rechercher un élève, une matière..." aria-label="Rechercher une note" /></div>
          <select value={subjectFilter} onChange={(event) => setSubjectFilter(event.target.value)} aria-label="Filtrer par matière">
            <option value="">Toutes les matières</option>
            {subjects.map((subject) => <option key={subject.id} value={subject.id}>{subject.name}</option>)}
          </select>
        </div>

        {loading ? <div className="notes-state">Chargement des notes...</div> : filteredGrades.length === 0 ? (
          <div className="notes-state"><h3>Aucune note trouvée</h3><p>Ajoutez une note pour un élève enregistré.</p></div>
        ) : (
          <div className="notes-table-wrapper">
            <table className="notes-table">
              <thead><tr><th>Élève</th><th>Matière</th><th>Évaluation</th><th>Note</th><th>Coef.</th><th>Date</th><th>Actions</th></tr></thead>
              <tbody>
                {filteredGrades.map((grade) => (
                  <tr key={grade.id}>
                    <td><strong>{grade.student_name}</strong></td>
                    <td><span className="subject-badge">{grade.subject_name}</span></td>
                    <td>{grade.assessment || '—'}</td>
                    <td><span className={`grade-value ${Number(grade.value) >= 10 ? 'success' : 'danger'}`}>{Number(grade.value).toFixed(2)}/20</span></td>
                    <td>{grade.coefficient}</td>
                    <td>{new Date(`${grade.date}T00:00:00`).toLocaleDateString('fr-FR')}</td>
                    <td><div className="notes-actions"><button type="button" onClick={() => openEdit(grade)} title="Modifier"><Pencil size={16} /></button><button type="button" onClick={() => void deleteGrade(grade)} title="Supprimer"><Trash2 size={16} /></button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {showModal && (
        <div className="notes-modal-overlay" onMouseDown={() => !saving && setShowModal(false)}>
          <div className="notes-modal" onMouseDown={(event) => event.stopPropagation()}>
            <div className="notes-modal-heading"><div><span className="notes-eyebrow">{editingId ? 'MODIFICATION' : 'NOUVELLE SAISIE'}</span><h2>{editingId ? 'Modifier la note' : 'Ajouter une note'}</h2></div><button type="button" onClick={() => !saving && setShowModal(false)} aria-label="Fermer"><X /></button></div>
            <form className="notes-form" onSubmit={(event) => void handleSubmit(event)}>
              <label>Élève *
                <select value={form.student} onChange={(event) => setForm({ ...form, student: event.target.value })} required><option value="">Sélectionner un élève</option>{students.map((student) => <option key={student.id} value={student.id}>{`${student.first_name} ${student.last_name}`.trim() || student.matricule}</option>)}</select>
              </label>
              <label>Matière *
                <select value={form.subject} onChange={(event) => setForm({ ...form, subject: event.target.value })} required><option value="">Sélectionner une matière</option>{subjects.map((subject) => <option key={subject.id} value={subject.id}>{subject.name}</option>)}</select>
              </label>
              <label>Note /20 *<input type="number" min="0" max="20" step="0.01" value={form.value} onChange={(event) => setForm({ ...form, value: event.target.value })} required /></label>
              <label>Coefficient<input type="number" min="0.01" step="0.01" value={form.coefficient} onChange={(event) => setForm({ ...form, coefficient: event.target.value })} required /></label>
              <label className="notes-form-full">Évaluation<input value={form.assessment} onChange={(event) => setForm({ ...form, assessment: event.target.value })} /></label>
              <label className="notes-form-full">Commentaire<textarea rows={4} value={form.comment} onChange={(event) => setForm({ ...form, comment: event.target.value })} /></label>
              <div className="notes-modal-actions"><button type="button" className="notes-secondary-button" onClick={() => setShowModal(false)}>Annuler</button><button type="submit" className="notes-primary-button" disabled={saving}>{saving ? 'Enregistrement...' : editingId ? 'Enregistrer' : 'Ajouter la note'}</button></div>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}

function Stat({ icon, label, value }: { icon: ReactNode; label: string; value: number | string }) {
  return <article className="notes-stat-card"><span className="notes-stat-icon">{icon}</span><div><small>{label}</small><strong>{value}</strong></div></article>
}
