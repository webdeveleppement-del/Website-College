import { useEffect, useState, type FormEvent } from 'react'
import { api } from '../../../../api/client'
import '../Communication/AdminCommunication.css'
import '../AdminFormSizing.css'

type User = {
  username: string
  email: string
  first_name: string
  last_name: string
  telephone: string
  role: string
  is_staff: boolean
}

type ProfileForm = {
  username: string
  email: string
  first_name: string
  last_name: string
  telephone: string
  current_password: string
  new_password: string
  new_password_confirmation: string
}

const emptyForm: ProfileForm = {
  username: '',
  email: '',
  first_name: '',
  last_name: '',
  telephone: '',
  current_password: '',
  new_password: '',
  new_password_confirmation: '',
}

export default function AdminParametres() {
  const [user, setUser] = useState<User | null>(null)
  const [form, setForm] = useState<ProfileForm>(emptyForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await api.get<{ success: boolean; user: User }>('/auth/me/')
        setUser(response.data.user)
        setForm({
          username: response.data.user.username,
          email: response.data.user.email,
          first_name: response.data.user.first_name,
          last_name: response.data.user.last_name,
          telephone: response.data.user.telephone,
          current_password: '',
          new_password: '',
          new_password_confirmation: '',
        })
      } catch {
        setError('Impossible de charger votre profil depuis Django.')
      } finally {
        setLoading(false)
      }
    }
    void loadProfile()
  }, [])

  function updateField(field: keyof ProfileForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const response = await api.patch<{ success: boolean; user: User }>(
        '/auth/me/',
        form,
      )
      setUser(response.data.user)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      setForm((current) => ({
        ...current,
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
      }))
      setSuccess('Vos informations ont été mises à jour.')
    } catch {
      setError(
        'La mise à jour a échoué. Vérifiez vos informations et votre mot de passe actuel.',
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="admin-resource-page">
      <header className="admin-resource-header">
        <span>ADMINISTRATION</span>
        <h1>Paramètres</h1>
        <p>Modifiez les informations de votre compte administrateur.</p>
      </header>

      {loading ? (
        <div className="admin-state">Chargement du profil...</div>
      ) : (
        <div className="admin-settings-grid">
          <form className="admin-panel admin-form admin-profile-form" onSubmit={saveProfile}>
            <h2>Modifier mon profil</h2>
            <div className="admin-form-fields">
              <label>Nom d'utilisateur<input required value={form.username} onChange={(event) => updateField('username', event.target.value)} /></label>
              <label>Email<input required type="email" value={form.email} onChange={(event) => updateField('email', event.target.value)} /></label>
              <label>Prénom<input required value={form.first_name} onChange={(event) => updateField('first_name', event.target.value)} /></label>
              <label>Nom<input required value={form.last_name} onChange={(event) => updateField('last_name', event.target.value)} /></label>
              <label>Téléphone<input value={form.telephone} onChange={(event) => updateField('telephone', event.target.value)} /></label>
            </div>
            <h3>Modifier le mot de passe</h3>
            <p className="admin-form-hint">Laissez ces champs vides si vous ne souhaitez pas modifier votre mot de passe.</p>
            <div className="admin-form-fields">
              <label>Mot de passe actuel<input type="password" value={form.current_password} onChange={(event) => updateField('current_password', event.target.value)} /></label>
              <label>Nouveau mot de passe<input minLength={8} type="password" value={form.new_password} onChange={(event) => updateField('new_password', event.target.value)} /></label>
              <label>Confirmation<input minLength={8} type="password" value={form.new_password_confirmation} onChange={(event) => updateField('new_password_confirmation', event.target.value)} /></label>
            </div>
            <button className="admin-primary" type="submit" disabled={saving}>{saving ? 'Enregistrement...' : 'Enregistrer les modifications'}</button>
          </form>

          <aside className="admin-panel admin-account-summary">
            <h2>Résumé du compte</h2>
            {error && <div className="admin-error" role="alert">{error}</div>}
            {success && <div className="admin-success" role="status">{success}</div>}
            {user && <dl className="admin-details">
              <div><dt>Rôle</dt><dd>{user.role}</dd></div>
              <div><dt>Accès staff</dt><dd>{user.is_staff ? 'Activé' : 'Désactivé'}</dd></div>
              <div><dt>Email actuel</dt><dd>{user.email}</dd></div>
              <div><dt>Téléphone</dt><dd>{user.telephone || 'Non renseigné'}</dd></div>
            </dl>}
          </aside>
        </div>
      )}
    </section>
  )
}
