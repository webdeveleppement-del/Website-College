import { useEffect, useMemo, useState } from 'react'
import { api } from '../../../../api/client'
import './EmploiDuTemps.css'

type Entry = {
  id: number
  day: string
  start_time: string
  end_time: string
  school_class: number
  subject: number
  teacher: number | null
  class_name: string
  subject_name: string
  teacher_name: string | null
  room: string
  notes: string
}

const days: Record<string, string> = {
  MONDAY: 'Lundi',
  TUESDAY: 'Mardi',
  WEDNESDAY: 'Mercredi',
  THURSDAY: 'Jeudi',
  FRIDAY: 'Vendredi',
  SATURDAY: 'Samedi',
}

function listData<T>(data: T[] | { results: T[] }) {
  return Array.isArray(data) ? data : data.results
}

export default function EmploiDuTemps() {
  const [entries, setEntries] = useState<Entry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [day, setDay] = useState('')
  const [className, setClassName] = useState('')
  const [search, setSearch] = useState('')

  async function loadEntries() {
    setLoading(true)
    setError('')
    try {
      const response = await api.get<Entry[] | { results: Entry[] }>('/timetable/entries/')
      setEntries(listData(response.data))
    } catch {
      setError("Impossible de récupérer l'emploi du temps depuis Django.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadEntries()
  }, [])

  const classOptions = useMemo(() => [...new Set(entries.map((entry) => entry.class_name))].filter(Boolean).sort(), [entries])
  const filteredEntries = useMemo(() => entries.filter((entry) => {
    const query = search.toLowerCase()
    const matchesSearch = !query || `${entry.subject_name} ${entry.teacher_name || ''} ${entry.room}`.toLowerCase().includes(query)
    return matchesSearch && (!day || entry.day === day) && (!className || entry.class_name === className)
  }), [entries, day, className, search])

  return (
    <section className="timetable-page">
      <header className="timetable-header"><div><span className="timetable-kicker">ADMINISTRATION</span><h1>Emploi du temps</h1><p>Consultez les cours enregistrés dans Django.</p></div><button type="button" onClick={() => void loadEntries()} disabled={loading}>↻ Actualiser</button></header>
      <div className="timetable-toolbar"><input type="search" placeholder="Rechercher une matière, un enseignant..." value={search} onChange={(event) => setSearch(event.target.value)} /><select value={day} onChange={(event) => setDay(event.target.value)}><option value="">Tous les jours</option>{Object.entries(days).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select><select value={className} onChange={(event) => setClassName(event.target.value)}><option value="">Toutes les classes</option>{classOptions.map((value) => <option key={value} value={value}>{value}</option>)}</select></div>
      {error && <div className="timetable-error" role="alert">{error}</div>}
      <div className="timetable-card">
        <div className="timetable-card-heading"><h2>Cours programmés</h2><p>{filteredEntries.length} résultat(s)</p></div>
        {loading ? <div className="timetable-state">Chargement de l'emploi du temps...</div> : filteredEntries.length === 0 ? <div className="timetable-state"><h3>Aucun cours trouvé</h3><p>Les cours affichés ici proviennent exclusivement de Django.</p></div> : <div className="timetable-table-wrapper"><table className="timetable-table"><thead><tr><th>Jour</th><th>Horaire</th><th>Matière</th><th>Classe</th><th>Enseignant</th><th>Salle</th></tr></thead><tbody>{filteredEntries.map((entry) => <tr key={entry.id}><td><strong>{days[entry.day] || entry.day}</strong></td><td>{entry.start_time.slice(0, 5)} - {entry.end_time.slice(0, 5)}</td><td>{entry.subject_name}</td><td>{entry.class_name}</td><td>{entry.teacher_name || 'Non renseigné'}</td><td>{entry.room || '—'}</td></tr>)}</tbody></table></div>}
      </div>
    </section>
  )
}
