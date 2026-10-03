import { useState } from 'react'
import type { FormEvent } from 'react'
import axios from 'axios'
import {
  ArrowRight,
  AtSign,
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
  TriangleAlert,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Login.css'

type AdminLoginResponse = {
  success: boolean
  user: {
    id: number
    username: string
    email: string
    first_name: string
    last_name: string
    role: 'ADMIN' | 'ENSEIGNANT' | 'ELEVE' | 'PARENT'
  }
  tokens: {
    access: string
    refresh: string
  }
}

export default function AdminLogin() {
  const navigate = useNavigate()
  const { refreshUser } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await axios.post<AdminLoginResponse>(
        'http://127.0.0.1:8000/api/auth/login/',
        {
          role: 'ADMIN',
          username: username.trim(),
          password,
        },
      )
      const data = response.data

      if (data.user.role !== 'ADMIN') {
        setError('Ce compte ne possède pas les droits administrateur.')
        return
      }

      localStorage.setItem('access_token', data.tokens.access)
      localStorage.setItem('refresh_token', data.tokens.refresh)
      localStorage.setItem('user', JSON.stringify(data.user))
      refreshUser()
      navigate('/dashboard/admin', { replace: true })
    } catch (requestError: unknown) {
      if (axios.isAxiosError(requestError)) {
        const responseData = requestError.response?.data as
          | {
              detail?: string
              message?: string
              non_field_errors?: string[]
            }
          | undefined
        setError(
          responseData?.detail ||
            responseData?.non_field_errors?.[0] ||
            responseData?.message ||
            'Identifiants administrateur incorrects.',
        )
      } else {
        setError('Une erreur inattendue est survenue. Réessayez.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="login-page admin-login-page">
      <div className="login-background">
        <img src="/Hero.png" alt="Établissement scolaire" />
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
              Administration
              <br />
              <span>de votre établissement.</span>
            </h1>
            <p className="presentation-description">
              Gérez les élèves, les enseignants, les classes et toutes les
              activités de votre établissement depuis un espace sécurisé.
            </p>
          </div>
          <div className="presentation-footer">Accès réservé à l&apos;administration</div>
        </section>

        <section className="login-panel">
          <div className="login-panel-inner">
            <button
              type="button"
              className="login-back-button"
              onClick={() => navigate('/')}
            >
              Retour au site
            </button>

            <div className="login-heading">
              <span className="login-mini-label">ESPACE ADMINISTRATEUR</span>
              <h2>Connexion</h2>
              <p>Connectez-vous pour administrer la plateforme.</p>
            </div>

            {error && (
              <div className="login-error" role="alert">
                <TriangleAlert size={18} aria-hidden="true" />
                <p>{error}</p>
              </div>
            )}

            <form className="login-form" onSubmit={handleSubmit}>
              <div className="input-group">
                <label htmlFor="admin-username">Nom d&apos;utilisateur</label>
                <div className="input-wrapper">
                  <AtSign className="input-icon" size={18} aria-hidden="true" />
                  <input
                    id="admin-username"
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
                <label htmlFor="admin-password">Mot de passe</label>
                <div className="input-wrapper">
                  <LockKeyhole className="input-icon" size={18} aria-hidden="true" />
                  <input
                    id="admin-password"
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
                    aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="login-submit" disabled={loading}>
                {loading ? (
                  <>
                    <span className="login-spinner" />
                    Connexion...
                  </>
                ) : (
                  <>
                    <ShieldCheck size={18} aria-hidden="true" />
                    Accéder à l&apos;administration
                    <ArrowRight size={18} aria-hidden="true" />
                  </>
                )}
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  )
}
