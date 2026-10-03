import { useState, type FormEvent } from 'react'
import { ArrowLeft, Send } from 'lucide-react'
import { Link } from 'react-router-dom'
import './Inscription.css'

const Inscription = () => {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)
    event.currentTarget.reset()
  }

  return (
    <main className="registration-page">
      <section className="registration-card">
        <Link to="/" className="registration-back">
          <ArrowLeft size={16} aria-hidden="true" />
          Retour à l&apos;accueil
        </Link>

        <div className="registration-heading">
          <span>GESTION ÉCOLE</span>
          <h1>Demander une inscription</h1>
          <p>
            Remplissez ce formulaire et notre équipe vous recontactera pour
            vous accompagner dans les prochaines étapes.
          </p>
        </div>

        {submitted && (
          <div className="registration-success" role="status">
            Votre demande a bien été envoyée. Nous vous contacterons
            prochainement.
          </div>
        )}

        <form className="registration-form" onSubmit={handleSubmit}>
          <div className="registration-fields">
            <label>
              Nom et prénom du parent
              <input type="text" name="parentName" required />
            </label>

            <label>
              Nom et prénom de l&apos;élève
              <input type="text" name="studentName" required />
            </label>

            <label>
              Adresse e-mail
              <input type="email" name="email" required />
            </label>

            <label>
              Téléphone
              <input type="tel" name="phone" required />
            </label>

            <label>
              Niveau souhaité
              <select name="level" defaultValue="" required>
                <option value="" disabled>
                  Sélectionnez un niveau
                </option>
                <option value="primaire">Cycle primaire</option>
                <option value="college">Collège</option>
                <option value="lycee">Lycée</option>
              </select>
            </label>

            <label>
              Année scolaire
              <select name="schoolYear" defaultValue="2026-2027" required>
                <option value="2026-2027">2026-2027</option>
                <option value="2027-2028">2027-2028</option>
              </select>
            </label>
          </div>

          <label>
            Message complémentaire
            <textarea name="message" rows={5} placeholder="Votre message" />
          </label>

          <button type="submit">
            Envoyer la demande
            <Send size={17} aria-hidden="true" />
          </button>
        </form>
      </section>
    </main>
  )
}

export default Inscription
