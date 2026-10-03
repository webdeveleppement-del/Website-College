import { useState } from 'react'
import type { FormEvent } from 'react'
import axios from 'axios'
import {
  ArrowLeft,
  ArrowRight,
  AtSign,
  CalendarDays,
  Check,
  Eye,
  EyeOff,
  GraduationCap,
  LockKeyhole,
  IdCard,
  TriangleAlert,
  UsersRound,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Login.css'

type UserRole = 'ADMIN' | 'ENSEIGNANT' | 'ELEVE' | 'PARENT'

interface LoginResponse {
  success: boolean
  user: {
    id: number
    username: string
    email: string
    first_name: string
    last_name: string
    role: UserRole
  }
  tokens: {
    access: string
    refresh: string
  }
}

export default function Login({
  fixedRole,
}: {
  fixedRole?: 'ENSEIGNANT' | 'ELEVE'
}) {
  const navigate = useNavigate()
  const { refreshUser } = useAuth()
  const [role, setRole] = useState<'ENSEIGNANT' | 'ELEVE'>(fixedRole || 'ELEVE')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [matricule, setMatricule] = useState('')
  const [dateNaissance, setDateNaissance] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await axios.post<LoginResponse>(
        'http://127.0.0.1:8000/api/auth/login/',
        role === 'ELEVE'
          ? {
              role,
              matricule: matricule.trim(),
              date_naissance: dateNaissance,
            }
          : {
              role,
              username: username.trim(),
              password,
            },
      )
      const data = response.data

      if (data.user.role !== role) {
        setError(
          `Ce compte n'est pas un compte ${
            role === 'ELEVE' ? 'élève' : 'enseignant'
          }.`,
        )
        return
      }

      localStorage.setItem('access_token', data.tokens.access)
      localStorage.setItem('refresh_token', data.tokens.refresh)
      localStorage.setItem('user', JSON.stringify(data.user))
      refreshUser()

      const destinations: Record<UserRole, string> = {
        ADMIN: '/dashboard/admin',
        ENSEIGNANT: '/dashboard/enseignant',
        ELEVE: '/dashboard/eleve',
        PARENT: '/dashboard/parent',
      }
      const destination = destinations[data.user.role]
      navigate(destination ?? '/', { replace: true })
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const responseData = err.response?.data as
          | {
              detail?: string
              message?: string
              non_field_errors?: string[]
            }
          | undefined
        const message =
          responseData?.detail ||
          responseData?.non_field_errors?.[0] ||
          responseData?.message ||
          "Identifiants incorrects. Vérifiez votre nom d'utilisateur et votre mot de passe."
        setError(message)
      } else {
        setError('Une erreur inattendue est survenue. Réessayez.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="login-page">
      <div className="login-background">
        <img
          src="/Hero.png"
          alt="Élèves dans un environnement scolaire"
        />
        <div className="login-overlay" />
      </div>

      <div className="login-container">
        <section className="login-presentation">
          <div className="presentation-content">
            <div className="school-logo" aria-hidden="true">
              <img src="/Img.png" alt="" />
            </div>
            <p className="presentation-label">GESTION ÉCOLE</p>
            <h1>
              Votre espace
              <br />
              <span>scolaire intelligent.</span>
            </h1>
            <p className="presentation-description">
              Accédez simplement à votre espace personnel, consultez vos
              informations scolaires et suivez votre parcours depuis une seule
              plateforme.
            </p>

            <div className="presentation-features">
              <div className="feature-item">
                <Check size={18} aria-hidden="true" />
                <div>
                  <strong>Accès sécurisé</strong>
                  <small>Vos données scolaires restent protégées.</small>
                </div>
              </div>
              <div className="feature-item">
                <Check size={18} aria-hidden="true" />
                <div>
                  <strong>Suivi personnalisé</strong>
                  <small>Retrouvez toutes vos informations au même endroit.</small>
                </div>
              </div>
            </div>
          </div>
          <div className="presentation-footer">© 2026 Gestion École</div>
        </section>

        <section className="login-panel">
          <div className="login-panel-inner">
            <button
              type="button"
              className="login-back-button"
              onClick={() => navigate('/')}
            >
              <ArrowLeft size={16} aria-hidden="true" />
              Retour au site
            </button>

            <div className="login-heading">
              <span className="login-mini-label">ESPACE PERSONNEL</span>
              <h2>Connexion</h2>
              <p>Connectez-vous pour accéder à votre espace.</p>
            </div>

            {!fixedRole && <div className="role-switch">
              <button
                type="button"
                className={role === 'ELEVE' ? 'role-button active' : 'role-button'}
                onClick={() => {
                  setRole('ELEVE')
                  setError('')
                  setUsername('')
                  setPassword('')
                }}
              >
                <GraduationCap className="role-icon" size={24} aria-hidden="true" />
                <span>
                  <strong>Élève</strong>
                  <small>Mon espace étudiant</small>
                </span>
              </button>
              <button
                type="button"
                className={
                  role === 'ENSEIGNANT' ? 'role-button active' : 'role-button'
                }
                onClick={() => {
                  setRole('ENSEIGNANT')
                  setError('')
                  setMatricule('')
                  setDateNaissance('')
                }}
              >
                <UsersRound className="role-icon" size={24} aria-hidden="true" />
                <span>
                  <strong>Enseignant</strong>
                  <small>Mon espace professeur</small>
                </span>
              </button>
            </div>}

            {error && (
              <div className="login-error" role="alert">
                <TriangleAlert size={18} aria-hidden="true" />
                <p>{error}</p>
              </div>
            )}

            <form className="login-form" onSubmit={handleSubmit}>
              {role === 'ELEVE' ? (
                <>
                  <div className="input-group">
                    <label htmlFor="matricule">Matricule</label>
                    <div className="input-wrapper">
                      <IdCard className="input-icon" size={18} aria-hidden="true" />
                      <input
                        id="matricule"
                        type="text"
                        value={matricule}
                        onChange={(event) => setMatricule(event.target.value)}
                        placeholder="Votre matricule scolaire"
                        autoComplete="off"
                        required
                      />
                    </div>
                  </div>

                  <div className="input-group">
                    <label htmlFor="date-naissance">Date de naissance</label>
                    <div className="input-wrapper">
                      <CalendarDays
                        className="input-icon"
                        size={18}
                        aria-hidden="true"
                      />
                      <input
                        id="date-naissance"
                        type="date"
                        value={dateNaissance}
                        onChange={(event) => setDateNaissance(event.target.value)}
                        autoComplete="bday"
                        required
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="input-group">
                    <label htmlFor="username">Nom d&apos;utilisateur</label>
                    <div className="input-wrapper">
                      <AtSign className="input-icon" size={18} aria-hidden="true" />
                      <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                        placeholder="Votre nom d'utilisateur"
                        autoComplete="username"
                        required
                      />
                    </div>
                  </div>

                  <div className="input-group">
                    <div className="password-label">
                      <label htmlFor="password">Mot de passe</label>
                      <button
                        type="button"
                        className="forgot-password"
                        onClick={() =>
                          setError(
                            'La récupération du mot de passe sera disponible prochainement.',
                          )
                        }
                      >
                        Mot de passe oublié ?
                      </button>
                    </div>
                    <div className="input-wrapper">
                      <LockKeyhole
                        className="input-icon"
                        size={18}
                        aria-hidden="true"
                      />
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Votre mot de passe"
                        autoComplete="current-password"
                        required
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword((visible) => !visible)}
                        aria-label={
                          showPassword
                            ? 'Masquer le mot de passe'
                            : 'Afficher le mot de passe'
                        }
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                </>
              )}

              <button type="submit" className="login-submit" disabled={loading}>
                {loading ? (
                  <>
                    <span className="login-spinner" />
                    Connexion...
                  </>
                ) : (
                  <>
                    Se connecter
                    <ArrowRight size={18} aria-hidden="true" />
                  </>
                )}
              </button>
            </form>

            <div className="login-help">
              <span>Besoin d&apos;aide ?</span>
              <button type="button" onClick={() => navigate('/contact')}>
                Contactez l&apos;administration
              </button>
              <button
                type="button"
                onClick={() =>
                  navigate(
                    fixedRole === 'ENSEIGNANT'
                      ? '/connexion/eleve'
                      : '/connexion/enseignant',
                  )
                }
              >
                {fixedRole === 'ENSEIGNANT'
                  ? 'Connexion élève'
                  : 'Connexion enseignant'}
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
