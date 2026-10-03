import { NavLink, useNavigate } from 'react-router-dom'
import {
  CalendarCheck,
  CalendarDays,
  ClipboardList,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Newspaper,
  BookOpen,
  School,
  Settings,
  UserPlus,
  Users,
  X,
} from 'lucide-react'
import './AdminSidebar.css'

interface AdminSidebarProps {
  open: boolean
  onClose: () => void
}

const menu = [
  ['Vue d’ensemble', '/dashboard/admin', LayoutDashboard],
  ['Élèves', '/dashboard/admin/eleves', Users],
  ['Enseignants', '/dashboard/admin/enseignants', GraduationCap],
  ['Classes', '/dashboard/admin/classes', School],
  ['Matières', '/dashboard/admin/matieres', BookOpen],
  ['Notes', '/dashboard/admin/notes', ClipboardList],
  ['Présences', '/dashboard/admin/presences', CalendarCheck],
  ['Emploi du temps', '/dashboard/admin/emploi-du-temps', CalendarDays],
] as const

const communication = [
  ['Actualités', '/dashboard/admin/actualites', Newspaper],
  ['Admissions', '/dashboard/admin/admissions', UserPlus],
  ['Messages', '/dashboard/admin/messages', MessageSquare],
] as const

export default function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  const navigate = useNavigate()

  function handleLogout() {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
    navigate('/administration/connexion', { replace: true })
  }

  return (
    <>
      {open && (
        <button
          type="button"
          className="admin-sidebar-overlay"
          onClick={onClose}
          aria-label="Fermer le menu"
        />
      )}
      <aside className={`admin-sidebar${open ? ' admin-sidebar-open' : ''}`}>
        <div className="admin-sidebar-top">
          <div className="admin-logo">
            <span className="admin-logo-mark">G</span>
            <div>
              <strong>Gestion École</strong>
              <small>Administration</small>
            </div>
          </div>
          <button type="button" className="admin-sidebar-close" onClick={onClose} aria-label="Fermer">
            <X size={20} />
          </button>
        </div>

        <div className="admin-sidebar-profile">
          <div className="admin-avatar">A</div>
          <div>
            <strong>Administrateur</strong>
            <span>Super administrateur</span>
          </div>
        </div>

        <nav className="admin-navigation" aria-label="Navigation administration">
          <span className="admin-nav-title">PRINCIPAL</span>
          {menu.map(([label, path, Icon]) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/dashboard/admin'}
              onClick={onClose}
              className={({ isActive }) => `admin-nav-link${isActive ? ' active' : ''}`}
            >
              <Icon size={19} />
              <span>{label}</span>
            </NavLink>
          ))}
          <span className="admin-nav-title communication-title">COMMUNICATION</span>
          {communication.map(([label, path, Icon]) => (
            <NavLink
              key={path}
              to={path}
              onClick={onClose}
              className={({ isActive }) => `admin-nav-link${isActive ? ' active' : ''}`}
            >
              <Icon size={19} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-bottom">
          <NavLink
            to="/dashboard/admin/parametres"
            onClick={onClose}
            className={({ isActive }) => `admin-nav-link${isActive ? ' active' : ''}`}
          >
            <Settings size={19} />
            <span>Paramètres</span>
          </NavLink>
          <button type="button" className="admin-logout" onClick={handleLogout}>
            <LogOut size={19} />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>
    </>
  )
}
