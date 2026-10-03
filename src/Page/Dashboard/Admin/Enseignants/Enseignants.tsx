import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Eye,
  GraduationCap,
  Mail,
  Phone,
  Search,
  Trash2,
  UserCheck,
  Users,
  UserX,
  X,
  Plus,
} from 'lucide-react'
import { api } from '../../../../api/client'
import './Enseignants.css'
import '../AdminFormSizing.css'

type Teacher = {
  id: number
  employee_number: string
  first_name: string
  last_name: string
  email: string
  telephone: string
  specialization: string
  qualification: string
  hire_date: string | null
  is_active: boolean
}

export default function Enseignants() {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [search, setSearch] = useState('')
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchParams, setSearchParams] = useSearchParams()
  const [showForm, setShowForm] = useState(searchParams.get('action') === 'create')
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ employee_number: '', first_name: '', last_name: '', email: '', telephone: '', username: '', password: '', specialization: '', qualification: '' })

  async function loadTeachers() {
    setLoading(true)
    setError('')
    try {
      const response = await api.get<Teacher[]>('/teachers/')
      setTeachers(response.data)
    } catch {
      setError('Impossible de charger les enseignants depuis Django.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadTeachers()
  }, [])

  async function deleteTeacher(teacher: Teacher) {
    if (!window.confirm(`Supprimer le dossier de ${teacherName(teacher)} ?`)) return
    try {
      await api.delete(`/teachers/${teacher.id}/`)
      setTeachers((current) => current.filter((item) => item.id !== teacher.id))
      setSelectedTeacher(null)
    } catch {
      setError('La suppression a échoué. Vérifiez les droits administrateur.')
    }
  }

  async function createTeacher(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true); setError('')
    try {
      const response = await api.post<Teacher>('/teachers/', { employee_number: form.employee_number, account_first_name: form.first_name, account_last_name: form.last_name, account_email: form.email, account_telephone: form.telephone, username: form.username, password: form.password, specialization: form.specialization, qualification: form.qualification })
      setTeachers((current) => [...current, response.data]); setShowForm(false); setSearchParams({})
    } catch { setError('La création de l’enseignant a échoué. Vérifiez les informations saisies.') } finally { setSaving(false) }
  }

  const filteredTeachers = useMemo(() => {
    const value = search.trim().toLowerCase()
    if (!value) return teachers
    return teachers.filter((teacher) =>
      `${teacherName(teacher)} ${teacher.employee_number} ${teacher.email} ${teacher.specialization}`
        .toLowerCase()
        .includes(value),
    )
  }, [teachers, search])

  const activeTeachers = teachers.filter((teacher) => teacher.is_active).length
  const inactiveTeachers = teachers.length - activeTeachers
  const subjects = new Set(
    teachers.map((teacher) => teacher.specialization.trim()).filter(Boolean),
  ).size

  return (
    <section className="teachers-page">
      <header className="teachers-header">
        <div>
          <span className="page-eyebrow">ADMINISTRATION</span>
          <h1>Enseignants</h1>
          <p>Gérez les enseignants enregistrés dans Django.</p>
        </div>
        <div className="teachers-header-actions"><button type="button" className="primary-action" onClick={() => void loadTeachers()} disabled={loading}>Actualiser</button><button type="button" className="primary-action" onClick={() => setShowForm(true)}><Plus size={16} /> Ajouter</button></div>
      </header>

      {error && <div className="teachers-error" role="alert">{error}</div>}

      <div className="teacher-stats">
        <Stat icon={<Users />} value={teachers.length} label="Total enseignants" />
        <Stat icon={<UserCheck />} value={activeTeachers} label="Enseignants actifs" />
        <Stat icon={<GraduationCap />} value={subjects} label="Spécialités renseignées" />
        <Stat icon={<UserX />} value={inactiveTeachers} label="Enseignants inactifs" />
      </div>

      <div className="teachers-panel">
        <div className="panel-toolbar">
          <div><h2>Liste des enseignants</h2><span>{filteredTeachers.length} résultat(s)</span></div>
          <div className="search-box">
            <Search size={18} />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Rechercher..." aria-label="Rechercher un enseignant" />
            {search && <button type="button" onClick={() => setSearch('')} aria-label="Effacer"><X size={16} /></button>}
          </div>
        </div>

        <div className="teachers-table-wrapper">
          <table className="teachers-table">
            <thead><tr><th>ENSEIGNANT</th><th>CONTACT</th><th>SPÉCIALITÉ</th><th>QUALIFICATION</th><th>STATUT</th><th>ACTIONS</th></tr></thead>
            <tbody>
              {filteredTeachers.map((teacher) => (
                <tr key={teacher.id}>
                  <td><div className="teacher-profile"><div className="teacher-avatar">{initials(teacher)}</div><div><strong>{teacherName(teacher)}</strong><small>{teacher.employee_number}</small></div></div></td>
                  <td><div className="contact-cell"><span>{teacher.email || 'Email non renseigné'}</span><small>{teacher.telephone || 'Téléphone non renseigné'}</small></div></td>
                  <td><span className="subject-badge">{teacher.specialization || 'Non renseignée'}</span></td>
                  <td>{teacher.qualification || 'Non renseignée'}</td>
                  <td><span className={`status ${teacher.is_active ? 'active' : 'inactive'}`}><i />{teacher.is_active ? 'Actif' : 'Inactif'}</span></td>
                  <td><div className="table-actions"><button type="button" title="Voir le profil" onClick={() => setSelectedTeacher(teacher)}><Eye size={17} /></button><button type="button" title="Supprimer" onClick={() => void deleteTeacher(teacher)}><Trash2 size={17} /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
          {loading && <div className="empty-state">Chargement des enseignants...</div>}
          {!loading && filteredTeachers.length === 0 && <div className="empty-state">Aucun enseignant trouvé.</div>}
        </div>
      </div>

      {selectedTeacher && (
        <div className="modal-overlay" onClick={() => setSelectedTeacher(null)}>
          <div className="teacher-modal" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="modal-close" onClick={() => setSelectedTeacher(null)} aria-label="Fermer"><X size={20} /></button>
            <div className="modal-profile"><div className="modal-avatar">{initials(selectedTeacher)}</div><div><span>{selectedTeacher.employee_number}</span><h2>{teacherName(selectedTeacher)}</h2><p>{selectedTeacher.specialization || 'Spécialité non renseignée'}</p></div></div>
            <span className={`status ${selectedTeacher.is_active ? 'active' : 'inactive'}`}><i />{selectedTeacher.is_active ? 'Actif' : 'Inactif'}</span>
            <div className="teacher-details">
              <div><span>Qualification</span><strong>{selectedTeacher.qualification || 'Non renseignée'}</strong></div>
              <div><span>Date d&apos;embauche</span><strong>{formatDate(selectedTeacher.hire_date)}</strong></div>
              <div><span>Téléphone</span><strong className="detail-contact"><Phone size={15} />{selectedTeacher.telephone || 'Non renseigné'}</strong></div>
              <div><span>Email</span><strong className="detail-contact"><Mail size={15} />{selectedTeacher.email || 'Non renseigné'}</strong></div>
            </div>
          </div>
        </div>
      )}
      {showForm && <div className="modal-overlay" onClick={() => setShowForm(false)}><div className="teacher-modal admin-create-modal" onClick={(event) => event.stopPropagation()}><button type="button" className="modal-close" onClick={() => setShowForm(false)} aria-label="Fermer"><X size={20} /></button><h2>Ajouter un enseignant</h2><form onSubmit={(event) => void createTeacher(event)}><input required placeholder="Matricule employé" value={form.employee_number} onChange={(e) => setForm({ ...form, employee_number: e.target.value })} /><input required placeholder="Prénom" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} /><input required placeholder="Nom" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} /><input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /><input placeholder="Téléphone" value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })} /><input required placeholder="Nom d'utilisateur" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} /><input required minLength={8} type="password" placeholder="Mot de passe (8 caractères minimum)" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /><input placeholder="Spécialité" value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} /><input placeholder="Qualification" value={form.qualification} onChange={(e) => setForm({ ...form, qualification: e.target.value })} /><button type="submit" disabled={saving}>{saving ? 'Création...' : 'Créer l’enseignant'}</button></form></div></div>}
    </section>
  )
}

function teacherName(teacher: Teacher) {
  return `${teacher.first_name} ${teacher.last_name}`.trim() || teacher.employee_number
}

function initials(teacher: Teacher) {
  return `${teacher.first_name[0] || ''}${teacher.last_name[0] || ''}`.toUpperCase()
}

function formatDate(value: string | null) {
  return value ? new Date(`${value}T00:00:00`).toLocaleDateString('fr-FR') : 'Non renseignée'
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) {
  return <div className="teacher-stat-card"><span className="stat-icon">{icon}</span><div><strong>{value}</strong><small>{label}</small></div></div>
}
