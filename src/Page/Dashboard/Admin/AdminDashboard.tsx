import { useEffect, useMemo, useState } from 'react'
import {
  Bell,
  ChevronDown,
  ChevronRight,
  GraduationCap,
  Menu,
  Newspaper,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  UserRound,
  Users,
  X,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getDashboardOverview, type DashboardOverview } from '../../../api/dashboard'
import AdminSidebar from './AdminSidebar'
import './AdminDashboard.css'
import './AdminDashboardLive.css'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [overview, setOverview] = useState<DashboardOverview | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const user = useMemo(() => {
    try {
      const stored = localStorage.getItem('user')
      return stored ? (JSON.parse(stored) as { first_name?: string; last_name?: string }) : null
    } catch {
      return null
    }
  }, [])

  const firstName = user?.first_name || 'Administrateur'
  const lastName = user?.last_name || ''
  const initials = `${firstName[0] || 'A'}${lastName[0] || 'D'}`.toUpperCase()

  async function loadOverview() {
    setLoading(true)
    setError('')

    try {
      setOverview(await getDashboardOverview())
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Impossible de charger les données administratives.',
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadOverview()
  }, [])

  function logout() {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
    navigate('/connexion', { replace: true })
  }

  function selectMenu(path: string) {
    navigate(path)
    setSidebarOpen(false)
  }

  return (
    <div className="admin-layout">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="admin-main">
        <header className="admin-header">
          <button
            type="button"
            className="admin-menu-toggle"
            aria-label="Ouvrir le menu"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={22} />
          </button>
          <div className="admin-search">
            <Search size={18} />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Rechercher un élève, enseignant..."
              aria-label="Rechercher"
            />
            {search && (
              <button type="button" aria-label="Effacer la recherche" onClick={() => setSearch('')}>
                <X size={16} />
              </button>
            )}
          </div>
          <div className="admin-header-actions">
            <div className="admin-dropdown-wrapper">
              <button
                type="button"
                className="admin-icon-button"
                aria-label="Notifications"
                onClick={() => setNotificationsOpen((open) => !open)}
              >
                <Bell size={19} />
                <span>4</span>
              </button>
              {notificationsOpen && (
                <div className="admin-dropdown notification-dropdown">
                  <strong>Notifications</strong>
                  <p>{formatNumber(overview?.admissions.pending)} admission(s) en attente</p>
                  <p>{formatNumber(overview?.messages.new)} message(s) non traité(s)</p>
                  <p>{formatNumber(overview?.news.published)} actualité(s) publiée(s)</p>
                </div>
              )}
            </div>
            <div className="admin-dropdown-wrapper">
              <button
                type="button"
                className="admin-profile"
                onClick={() => setProfileOpen((open) => !open)}
              >
                <span>{initials}</span>
                <strong>{firstName} {lastName}</strong>
                <ChevronDown size={15} />
              </button>
              {profileOpen && (
                <div className="admin-dropdown profile-dropdown">
                  <button type="button" onClick={() => selectMenu('/dashboard/admin')}>Mon profil</button>
                  <button type="button" onClick={logout}>Déconnexion</button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="admin-content">
          {error && (
            <div className="admin-api-error" role="alert">
              <span>{error}</span>
              <button type="button" onClick={() => void loadOverview()}>
                Réessayer
              </button>
            </div>
          )}
          <section className="admin-welcome">
            <div>
              <span>TABLEAU DE BORD</span>
              <h1>Bonjour, {firstName} <Sparkles size={24} /></h1>
              <p>Voici un aperçu en direct de votre établissement.</p>
            </div>
            <div className="admin-date">
              <span>AUJOURD'HUI</span>
              <strong>{new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}</strong>
              <button
                type="button"
                className="admin-refresh"
                onClick={() => void loadOverview()}
                disabled={loading}
              >
                <RefreshCw size={14} className={loading ? 'is-spinning' : ''} />
                Actualiser
              </button>
            </div>
          </section>

          <section className="admin-stats-grid">
            <StatCard icon={<GraduationCap />} label="Élèves inscrits" value={formatNumber(overview?.students)} change="API" detail="Total enregistré" tone="blue" loading={loading} />
            <StatCard icon={<UserRound />} label="Enseignants" value={formatNumber(overview?.teachers)} change="API" detail="Total enregistré" tone="gold" loading={loading} />
            <StatCard icon={<Users />} label="Classes" value={formatNumber(overview?.classes)} change="API" detail="Classes actives enregistrées" tone="purple" loading={loading} />
            <StatCard icon={<ShieldCheck />} label="Moyenne des notes" value={overview ? `${overview.grades.average.toFixed(2)} / 20` : '—'} change="API" detail="Moyenne calculée" tone="green" loading={loading} />
          </section>

          <section className="admin-dashboard-grid">
            <article className="admin-panel performance-panel">
              <PanelHeader title="Performance scolaire" description="Évolution du taux de réussite">
                <select defaultValue="year" aria-label="Période">
                  <option value="year">Cette année</option>
                  <option value="semester">Ce semestre</option>
                  <option value="month">Ce mois</option>
                </select>
              </PanelHeader>
              <div className="live-metrics">
                <div><strong>{formatNumber(overview?.grades.average, 2)}</strong><span>Moyenne générale</span></div>
                <div><strong>{formatNumber(overview?.news.published)}</strong><span>Actualités publiées</span></div>
                <div><strong>{formatNumber(overview?.admissions.pending)}</strong><span>Admissions en attente</span></div>
              </div>
              <div className="chart-summary"><span><i /> Données en direct</span><strong>Source : API</strong></div>
            </article>

            <article className="admin-panel attendance-panel">
              <PanelHeader title="Présence aujourd'hui" description="État des élèves">
                <button type="button" className="panel-link" onClick={() => selectMenu('/dashboard/admin/presences')}>Voir tout <ChevronRight size={15} /></button>
              </PanelHeader>
              <div className="attendance-content">
                <div className="attendance-circle"><strong>{attendanceRate(overview)}%</strong><span>Présents</span></div>
                <div className="attendance-legend">
                  <p><i className="present" /> Présents <strong>{formatNumber(overview?.attendance.present)}</strong></p>
                  <p><i className="absent" /> Absents <strong>{formatNumber(overview?.attendance.absent)}</strong></p>
                  <p><i className="late" /> En retard <strong>{formatNumber(overview?.attendance.late)}</strong></p>
                </div>
              </div>
            </article>
          </section>

          <section className="admin-bottom-grid">
            <article className="admin-panel">
              <PanelHeader title="Activité récente" description="Les dernières actions sur la plateforme">
                <button type="button" className="panel-link">Voir tout <ChevronRight size={15} /></button>
              </PanelHeader>
              <div className="live-summary-list">
                <p><strong>{formatNumber(overview?.users)}</strong><span>utilisateurs enregistrés</span></p>
                <p><strong>{formatNumber(overview?.news.total)}</strong><span>actualités dans la base</span></p>
                <p><strong>{formatNumber(overview?.messages.new)}</strong><span>messages non traités</span></p>
                <p><strong>{formatNumber(overview?.attendance.total)}</strong><span>présences enregistrées</span></p>
              </div>
            </article>
            <article className="admin-panel">
              <PanelHeader title="Actions rapides" description="Accédez rapidement aux fonctions principales" />
              <div className="quick-actions">
                {[
                  { label: 'Ajouter un élève', path: '/dashboard/admin/eleves?action=create', icon: GraduationCap },
                  { label: 'Ajouter un enseignant', path: '/dashboard/admin/enseignants?action=create', icon: UserRound },
                  { label: 'Créer une classe', path: '/dashboard/admin/classes?action=create', icon: Users },
                  { label: 'Publier une actualité', path: '/dashboard/admin/actualites?action=create', icon: Newspaper },
                ].map(({ label, path, icon: Icon }) => (
                  <button type="button" key={label} onClick={() => selectMenu(path)}>
                    <Icon size={19} /><span>{label}</span><ChevronRight size={17} />
                  </button>
                ))}
              </div>
            </article>
          </section>
        </div>
      </main>
    </div>
  )
}

function StatCard({ icon, label, value, change, detail, tone, loading }: {
  icon: React.ReactNode
  label: string
  value: string
  change: string
  detail: string
  tone: string
  loading: boolean
}) {
  return (
    <article className="admin-stat-card">
      <div className="admin-stat-top"><span className={`admin-stat-icon ${tone}`}>{icon}</span><small>{change}</small></div>
      <span className="admin-stat-label">{label}</span><strong>{loading ? '...' : value}</strong><p>{detail}</p>
    </article>
  )
}

function formatNumber(value: number | undefined, digits = 0) {
  if (value === undefined) return '—'
  return value.toLocaleString('fr-FR', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })
}

function attendanceRate(overview: DashboardOverview | null) {
  const total = overview?.attendance.total ?? 0
  if (!total) return '0'
  return (((overview?.attendance.present ?? 0) / total) * 100).toFixed(0)
}

function PanelHeader({ title, description, children }: { title: string; description: string; children?: React.ReactNode }) {
  return <div className="admin-panel-header"><div><h2>{title}</h2><p>{description}</p></div>{children}</div>
}
