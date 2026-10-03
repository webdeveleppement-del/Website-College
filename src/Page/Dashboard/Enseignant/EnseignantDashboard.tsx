import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { api } from '../../../api/client'
import { logout } from '../../../api/auth'
import { useAuth } from '../../../context/AuthContext'
import './RoleDashboard.css'

type Teacher = { first_name: string; last_name: string; email: string; employee_number: string; specialization: string; qualification: string }
type Entry = { id: number; day: string; start_time: string; end_time: string; subject_name: string; class_name: string; room: string }
type Grade = { id: number; student_name: string; subject_name: string; value: number; coefficient: number; assessment: string; date: string }
const days: Record<string, string> = { MONDAY: 'Lundi', TUESDAY: 'Mardi', WEDNESDAY: 'Mercredi', THURSDAY: 'Jeudi', FRIDAY: 'Vendredi', SATURDAY: 'Samedi' }

export default function EnseignantDashboard() {
  const { user } = useAuth()
  const [teacher, setTeacher] = useState<Teacher | null>(null)
  const [entries, setEntries] = useState<Entry[]>([])
  const [grades, setGrades] = useState<Grade[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [profile, timetable, gradeList] = await Promise.all([
          api.get<Teacher[] | { results: Teacher[] }>('/teachers/'),
          api.get<Entry[] | { results: Entry[] }>('/timetable/entries/'),
          api.get<Grade[] | { results: Grade[] }>('/grades/'),
        ])
        const list = <T,>(data: T[] | { results: T[] }) => Array.isArray(data) ? data : data.results
        setTeacher(list(profile.data)[0] || null)
        setEntries(list(timetable.data))
        setGrades(list(gradeList.data))
      } catch {
        setError('Impossible de charger les données enseignant depuis Django.')
      } finally { setLoading(false) }
    }
    void load()
  }, [])

  const average = useMemo(() => {
    const total = grades.reduce((sum, grade) => sum + Number(grade.value) * Number(grade.coefficient), 0)
    const coefficients = grades.reduce((sum, grade) => sum + Number(grade.coefficient), 0)
    return coefficients ? (total / coefficients).toFixed(2) : '0.00'
  }, [grades])
  const firstName = user?.first_name || 'Enseignant'

  return <RoleLayout title={`Bonjour, ${firstName}`} subtitle="Votre espace pédagogique connecté à Django." onLogout={() => { logout(); window.location.href = '/connexion' }}>
    {error && <div className="role-error" role="alert">{error}</div>}
    {loading ? <div className="role-state">Chargement...</div> : <>
      <div className="role-cards"><Card label="Cours programmés" value={entries.length} /><Card label="Notes saisies" value={grades.length} /><Card label="Moyenne des notes" value={`${average} / 20`} /></div>
      <div className="role-grid">
        <section className="role-panel"><h2>Mon profil</h2><p><strong>{teacher ? `${teacher.first_name} ${teacher.last_name}` : user?.username}</strong></p><p>{teacher?.specialization || 'Spécialité non renseignée'}</p><p>{teacher?.email || user?.email}</p><p>Matricule : {teacher?.employee_number || '—'}</p></section>
        <section className="role-panel"><h2>Mon emploi du temps</h2>{entries.length === 0 ? <RoleState text="Aucun cours enregistré." /> : <div className="role-list">{entries.map((entry) => <div className="role-row" key={entry.id}><strong>{days[entry.day] || entry.day} · {entry.start_time.slice(0, 5)} - {entry.end_time.slice(0, 5)}</strong><span>{entry.subject_name} — {entry.class_name}{entry.room ? ` · ${entry.room}` : ''}</span></div>)}</div>}</section>
      </div>
    </>}
  </RoleLayout>
}

function Card({ label, value }: { label: string; value: string | number }) { return <article className="role-card"><span>{label}</span><strong>{value}</strong></article> }
function RoleState({ text }: { text: string }) { return <div className="role-state">{text}</div> }
function RoleLayout({ title, subtitle, onLogout, children }: { title: string; subtitle: string; onLogout: () => void; children: ReactNode }) { return <div className="role-layout"><header className="role-header"><div><span>ESPACE ENSEIGNANT</span><h1>{title}</h1><p>{subtitle}</p></div><button type="button" onClick={onLogout}>Déconnexion</button></header><main className="role-content">{children}</main></div> }
