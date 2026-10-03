import { useEffect, useMemo, useState } from 'react'
import { api } from '../../../../api/client'
import './Presences.css'

type Attendance = {
  id: number
  student: number
  student_name: string
  date: string
  status: 'PRESENT' | 'ABSENT' | 'RETARD' | 'JUSTIFIE'
  arrival_time: string | null
  reason: string
}

const statusLabels: Record<Attendance['status'], string> = {
  PRESENT: 'Présent',
  ABSENT: 'Absent',
  RETARD: 'Retard',
  JUSTIFIE: 'Justifié',
}

function listData<T>(data: T[] | { results: T[] }) {
  return Array.isArray(data) ? data : data.results
}

export default function Presences() {
  const [attendance, setAttendance] = useState<Attendance[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [date, setDate] = useState('')
  const [status, setStatus] = useState('')
  const [search, setSearch] = useState('')

  async function loadAttendance() {
    setLoading(true)
    setError('')
    try {
      const response = await api.get<Attendance[] | { results: Attendance[] }>('/attendance/')
      setAttendance(listData(response.data))
    } catch {
      setError('Impossible de récupérer les présences depuis Django.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadAttendance()
  }, [])

  const filteredAttendance = useMemo(() => attendance.filter((item) => {
    const matchesSearch = item.student_name.toLowerCase().includes(search.toLowerCase())
    return matchesSearch && (!date || item.date === date) && (!status || item.status === status)
  }), [attendance, date, search, status])

  const statistics = useMemo(() => ({
    total: attendance.length,
    present: attendance.filter((item) => item.status === 'PRESENT').length,
    absent: attendance.filter((item) => item.status === 'ABSENT').length,
    late: attendance.filter((item) => item.status === 'RETARD').length,
  }), [attendance])

  return (
    <section className="attendance-page">
      <header className="attendance-header">
        <div><span className="page-kicker">ADMINISTRATION</span><h1>Gestion des présences</h1><p>Suivez quotidiennement la présence des élèves et les retards.</p></div>
        <button type="button" className="refresh-button" onClick={() => void loadAttendance()} disabled={loading}>↻ Actualiser</button>
      </header>
      <div className="attendance-stats">
        <Stat label="Total" value={statistics.total} detail="enregistrements" />
        <Stat label="Présents" value={statistics.present} detail="élèves" tone="success" />
        <Stat label="Absents" value={statistics.absent} detail="élèves" tone="danger" />
        <Stat label="Retards" value={statistics.late} detail="élèves" tone="warning" />
      </div>
      <div className="attendance-toolbar">
        <input type="search" placeholder="Rechercher un élève..." value={search} onChange={(event) => setSearch(event.target.value)} />
        <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
        <select value={status} onChange={(event) => setStatus(event.target.value)}><option value="">Tous les statuts</option>{Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
      </div>
      {error && <div className="attendance-error" role="alert">{error}</div>}
      <div className="attendance-table-card">
        <div className="table-heading"><h2>Historique des présences</h2><p>{filteredAttendance.length} résultat(s)</p></div>
        {loading ? <div className="attendance-loading">Chargement des présences...</div> : filteredAttendance.length === 0 ? <div className="attendance-empty"><h3>Aucune présence trouvée</h3><p>Aucun enregistrement ne correspond aux filtres sélectionnés.</p></div> : (
          <div className="attendance-table-wrapper"><table className="attendance-table"><thead><tr><th>Élève</th><th>Date</th><th>Heure</th><th>Statut</th><th>Motif</th></tr></thead><tbody>
            {filteredAttendance.map((item) => <tr key={item.id}><td><strong>{item.student_name}</strong></td><td>{new Date(`${item.date}T00:00:00`).toLocaleDateString('fr-FR')}</td><td>{item.arrival_time || '—'}</td><td><span className={`status-badge status-${item.status.toLowerCase()}`}>{statusLabels[item.status]}</span></td><td>{item.reason || '—'}</td></tr>)}
          </tbody></table></div>
        )}
      </div>
    </section>
  )
}

function Stat({ label, value, detail, tone = '' }: { label: string; value: number; detail: string; tone?: string }) {
  return <div className={`attendance-stat ${tone}`}><span>{label}</span><strong>{value}</strong><small>{detail}</small></div>
}
