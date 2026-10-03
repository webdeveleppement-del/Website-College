import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  CalendarDays,
  Eye,
  Filter,
  Mail,
  Phone,
  Search,
  Trash2,
  UserCheck,
  UserX,
  Users,
  X,
  Plus,
} from 'lucide-react'
import { api } from '../../../../api/client'
import './Eleves.css'
import '../AdminFormSizing.css'

type Student = {
  id: number
  matricule: string
  first_name: string
  last_name: string
  email: string
  telephone: string
  date_naissance: string | null
  sexe: string
  classe_name: string | null
  statut: string
}

export default function Eleves() {
  const [students, setStudents] = useState<Student[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('Tous')
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const [showForm, setShowForm] = useState(searchParams.get('action') === 'create')
  const [form, setForm] = useState({ matricule: '', first_name: '', last_name: '', email: '', telephone: '', username: '', password: '', date_naissance: '', sexe: '' })
  const [saving, setSaving] = useState(false)

  async function loadStudents() {
    setLoading(true)
    setError('')
    try {
      const response = await api.get<Student[]>('/students/')
      setStudents(response.data)
    } catch {
      setError('Impossible de charger les élèves depuis Django.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadStudents()
  }, [])

  async function deleteStudent(student: Student) {
    if (!window.confirm(`Supprimer le dossier de ${fullName(student)} ?`)) return
    setDeletingId(student.id)
    try {
      await api.delete(`/students/${student.id}/`)
      setStudents((current) => current.filter((item) => item.id !== student.id))
      setSelectedStudent(null)
    } catch {
      setError('La suppression a échoué. Vérifiez les droits administrateur.')
    } finally {
      setDeletingId(null)
    }
  }

  async function createStudent(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true); setError('')
    try {
      const response = await api.post<Student>('/students/', { matricule: form.matricule, account_first_name: form.first_name, account_last_name: form.last_name, account_email: form.email, account_telephone: form.telephone, username: form.username, password: form.password, date_naissance: form.date_naissance || null, sexe: form.sexe })
      setStudents((current) => [...current, response.data]); setShowForm(false); setSearchParams({})
    } catch { setError('La création de l’élève a échoué. Vérifiez les informations saisies.') } finally { setSaving(false) }
  }

  const classes = useMemo(
    () => Array.from(new Set(students.map((student) => student.classe_name).filter(Boolean))).sort(),
    [students],
  )

  const filteredStudents = useMemo(() => {
    const value = search.trim().toLowerCase()
    return students.filter((student) => {
      const searchable = `${fullName(student)} ${student.matricule} ${student.classe_name || ''}`.toLowerCase()
      return (
        (!value || searchable.includes(value)) &&
        (statusFilter === 'Tous' || student.statut === statusFilter)
      )
    })
  }, [students, search, statusFilter])

  const activeStudents = students.filter((student) => student.statut === 'ACTIF').length
  const girls = students.filter((student) => student.sexe === 'F').length
  const boys = students.filter((student) => student.sexe === 'M').length

  return (
    <div className="students-page">
      <header className="students-header">
        <div>
          <span className="students-eyebrow">ADMINISTRATION</span>
          <h1>Gestion des élèves</h1>
          <p>Gérez les informations réelles des élèves enregistrés dans Django.</p>
        </div>
        <div className="students-header-actions"><button type="button" className="students-refresh" onClick={() => void loadStudents()} disabled={loading}>Actualiser</button><button type="button" className="students-refresh" onClick={() => setShowForm(true)}><Plus size={16} /> Ajouter</button></div>
      </header>

      {error && <div className="students-error" role="alert">{error}</div>}

      <section className="students-stats">
        <Stat icon={<Users size={22} />} label="Total élèves" value={students.length} detail="Dossiers enregistrés" />
        <Stat icon={<UserCheck size={22} />} label="Élèves actifs" value={activeStudents} detail="Statut ACTIF" />
        <Stat icon={<UserX size={22} />} label="Filles" value={girls} detail="Selon le profil élève" />
        <Stat icon={<Users size={22} />} label="Garçons" value={boys} detail="Selon le profil élève" />
      </section>

      <section className="students-panel">
        <div className="students-toolbar">
          <div className="students-search">
            <Search size={18} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Rechercher un élève ou un matricule..."
              aria-label="Rechercher un élève"
            />
            {search && <button type="button" onClick={() => setSearch('')} aria-label="Effacer"><X size={16} /></button>}
          </div>
          <div className="students-filters">
            <Filter size={16} />
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="Filtrer par statut">
              <option value="Tous">Tous les statuts</option>
              <option value="ACTIF">Actifs</option>
              <option value="INACTIF">Inactifs</option>
              <option value="DIPLOME">Diplômés</option>
            </select>
            <span>{classes.length} classe(s)</span>
          </div>
        </div>

        <div className="students-table-wrapper">
          <table className="students-table">
            <thead>
              <tr><th>ÉLÈVE</th><th>MATRICULE</th><th>CLASSE</th><th>DATE DE NAISSANCE</th><th>CONTACT</th><th>STATUT</th><th /></tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td><div className="student-identity"><div className="student-avatar">{initials(student)}</div><div><strong>{fullName(student)}</strong><span>{student.sexe === 'F' ? 'Fille' : student.sexe === 'M' ? 'Garçon' : 'Non renseigné'}</span></div></div></td>
                  <td><span className="matricule">{student.matricule}</span></td>
                  <td><span className="class-badge">{student.classe_name || 'Sans classe'}</span></td>
                  <td><span className="date-cell"><CalendarDays size={14} />{formatDate(student.date_naissance)}</span></td>
                  <td><div className="parent-cell"><span>{student.telephone || 'Téléphone non renseigné'}</span><span>{student.email || 'Email non renseigné'}</span></div></td>
                  <td><span className={`status-badge ${student.statut === 'ACTIF' ? 'active' : 'inactive'}`}><i />{student.statut}</span></td>
                  <td><div className="student-actions"><button type="button" title="Voir le profil" onClick={() => setSelectedStudent(student)}><Eye size={17} /></button><button type="button" title="Supprimer" onClick={() => void deleteStudent(student)} disabled={deletingId === student.id}><Trash2 size={17} /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
          {loading && <div className="empty-students">Chargement des élèves...</div>}
          {!loading && filteredStudents.length === 0 && <div className="empty-students"><Users size={38} /><h3>Aucun élève trouvé</h3><p>Aucun dossier ne correspond aux critères.</p></div>}
        </div>
        <div className="students-footer">Affichage de <strong>{filteredStudents.length}</strong> élève(s) sur <strong>{students.length}</strong></div>
      </section>

      {showForm && <div className="student-modal-overlay" onClick={() => setShowForm(false)}><div className="student-modal admin-create-modal" onClick={(event) => event.stopPropagation()}><button type="button" className="modal-close" onClick={() => setShowForm(false)} aria-label="Fermer"><X size={20} /></button><h2>Ajouter un élève</h2><form onSubmit={(event) => void createStudent(event)}><input required placeholder="Matricule" value={form.matricule} onChange={(e) => setForm({ ...form, matricule: e.target.value })} /><input required placeholder="Prénom" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} /><input required placeholder="Nom" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} /><input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /><input placeholder="Téléphone" value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })} /><input required placeholder="Nom d'utilisateur" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} /><input required minLength={8} type="password" placeholder="Mot de passe (8 caractères minimum)" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /><input type="date" value={form.date_naissance} onChange={(e) => setForm({ ...form, date_naissance: e.target.value })} /><select value={form.sexe} onChange={(e) => setForm({ ...form, sexe: e.target.value })}><option value="">Sexe</option><option value="M">Masculin</option><option value="F">Féminin</option></select><button type="submit" disabled={saving}>{saving ? 'Création...' : 'Créer l’élève'}</button></form></div></div>}

      {selectedStudent && (
        <div className="student-modal-overlay" onClick={() => setSelectedStudent(null)}>
          <div className="student-modal" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="modal-close" onClick={() => setSelectedStudent(null)} aria-label="Fermer"><X size={20} /></button>
            <div className="modal-profile"><div className="modal-avatar">{initials(selectedStudent)}</div><div><span>{selectedStudent.matricule}</span><h2>{fullName(selectedStudent)}</h2><p>{selectedStudent.classe_name || 'Sans classe'}</p></div></div>
            <span className={`status-badge ${selectedStudent.statut === 'ACTIF' ? 'active' : 'inactive'}`}><i />{selectedStudent.statut}</span>
            <div className="student-details">
              <div><span>Date de naissance</span><strong>{formatDate(selectedStudent.date_naissance)}</strong></div>
              <div><span>Sexe</span><strong>{selectedStudent.sexe || 'Non renseigné'}</strong></div>
              <div><span>Téléphone</span><strong className="detail-contact"><Phone size={15} />{selectedStudent.telephone || 'Non renseigné'}</strong></div>
              <div className="full-detail"><span>Email</span><strong className="detail-contact"><Mail size={15} />{selectedStudent.email || 'Non renseigné'}</strong></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function fullName(student: Student) {
  return `${student.first_name} ${student.last_name}`.trim() || student.matricule
}

function initials(student: Student) {
  return `${student.first_name[0] || ''}${student.last_name[0] || ''}`.toUpperCase()
}

function formatDate(value: string | null) {
  return value ? new Date(`${value}T00:00:00`).toLocaleDateString('fr-FR') : 'Non renseignée'
}

function Stat({ icon, label, value, detail }: { icon: React.ReactNode; label: string; value: number; detail: string }) {
  return <article className="student-stat-card"><div className="student-stat-icon blue">{icon}</div><div><span>{label}</span><strong>{value}</strong><small>{detail}</small></div></article>
}
