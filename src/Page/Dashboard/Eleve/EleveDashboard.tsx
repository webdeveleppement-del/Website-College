import { useEffect, useMemo, useState } from 'react'
import { api } from '../../../api/client'
import { logout } from '../../../api/auth'
import { useAuth } from '../../../context/AuthContext'
import '../Enseignant/RoleDashboard.css'

type Student = { first_name: string; last_name: string; email: string; matricule: string; classe_name: string | null; date_naissance: string | null; statut: string }
type Grade = { id: number; subject_name: string; value: number; coefficient: number; assessment: string; date: string }
type Attendance = { id: number; date: string; status: string; arrival_time: string | null; reason: string }
type Entry = { id: number; day: string; start_time: string; end_time: string; subject_name: string; teacher_name: string | null; room: string }
const days: Record<string, string> = { MONDAY: 'Lundi', TUESDAY: 'Mardi', WEDNESDAY: 'Mercredi', THURSDAY: 'Jeudi', FRIDAY: 'Vendredi', SATURDAY: 'Samedi' }
const statuses: Record<string, string> = { PRESENT: 'Présent', ABSENT: 'Absent', RETARD: 'Retard', JUSTIFIE: 'Justifié' }

export default function EleveDashboard() {
  const { user } = useAuth()
  const [student, setStudent] = useState<Student | null>(null)
  const [grades, setGrades] = useState<Grade[]>([])
  const [attendance, setAttendance] = useState<Attendance[]>([])
  const [entries, setEntries] = useState<Entry[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    async function load() {
      try {
        const [profile, gradeList, attendanceList, timetable] = await Promise.all([api.get<Student[] | { results: Student[] }>('/students/'), api.get<Grade[] | { results: Grade[] }>('/grades/'), api.get<Attendance[] | { results: Attendance[] }>('/attendance/'), api.get<Entry[] | { results: Entry[] }>('/timetable/entries/')])
        const list = <T,>(data: T[] | { results: T[] }) => Array.isArray(data) ? data : data.results
        setStudent(list(profile.data)[0] || null); setGrades(list(gradeList.data)); setAttendance(list(attendanceList.data)); setEntries(list(timetable.data))
      } catch { setError('Impossible de charger vos données depuis Django.') } finally { setLoading(false) }
    }
    void load()
  }, [])
  const average = useMemo(() => { const total = grades.reduce((sum, item) => sum + Number(item.value) * Number(item.coefficient), 0); const coefficients = grades.reduce((sum, item) => sum + Number(item.coefficient), 0); return coefficients ? (total / coefficients).toFixed(2) : '0.00' }, [grades])
  const firstName = user?.first_name || 'Élève'
  return <div className="role-layout"><header className="role-header"><div><span>ESPACE ÉLÈVE</span><h1>Bonjour, {firstName}</h1><p>Retrouvez vos résultats et votre scolarité.</p></div><button type="button" onClick={() => { logout(); window.location.href = '/connexion' }}>Déconnexion</button></header><main className="role-content">{error && <div className="role-error" role="alert">{error}</div>}{loading ? <div className="role-state">Chargement...</div> : <><div className="role-cards"><Card label="Moyenne générale" value={`${average} / 20`} /><Card label="Notes reçues" value={grades.length} /><Card label="Présences" value={attendance.length} /></div><div className="role-grid"><section className="role-panel"><h2>Mon profil</h2><p><strong>{student ? `${student.first_name} ${student.last_name}` : user?.username}</strong></p><p>Matricule : {student?.matricule || '—'}</p><p>Classe : {student?.classe_name || 'Non affectée'}</p><p>Statut : {student?.statut || '—'}</p></section><section className="role-panel"><h2>Mes notes</h2>{grades.length === 0 ? <RoleState text="Aucune note enregistrée." /> : <div className="role-list">{grades.map((item) => <div className="role-row" key={item.id}><strong>{item.subject_name} · {item.value}/20</strong><span>{item.assessment || 'Évaluation'} · {item.date}</span></div>)}</div>}</section><section className="role-panel"><h2>Mes présences</h2>{attendance.length === 0 ? <RoleState text="Aucune présence enregistrée." /> : <div className="role-list">{attendance.map((item) => <div className="role-row" key={item.id}><strong>{item.date} · {statuses[item.status] || item.status}</strong><span>{item.arrival_time || ''} {item.reason || ''}</span></div>)}</div>}</section><section className="role-panel"><h2>Mon emploi du temps</h2>{entries.length === 0 ? <RoleState text="Aucun cours enregistré." /> : <div className="role-list">{entries.map((item) => <div className="role-row" key={item.id}><strong>{days[item.day] || item.day} · {item.start_time.slice(0, 5)} - {item.end_time.slice(0, 5)}</strong><span>{item.subject_name} · {item.teacher_name || 'Enseignant non renseigné'}{item.room ? ` · ${item.room}` : ''}</span></div>)}</div>}</section></div></>}</main></div>
}
function Card({ label, value }: { label: string; value: string | number }) { return <article className="role-card"><span>{label}</span><strong>{value}</strong></article> }
function RoleState({ text }: { text: string }) { return <div className="role-state">{text}</div> }
