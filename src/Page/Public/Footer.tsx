import type { FormEvent } from 'react'
import {
  ArrowRight,
  ArrowUp,
  Mail,
  MapPin,
  Phone,
  BriefcaseBusiness,
  Camera,
  Play,
  Share2,
} from 'lucide-react'
import './Footer.css'

const Footer = () => {
  const handleNewsletter = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    event.currentTarget.reset()
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="schoolFooter">
      <div className="schoolFooter__newsletter">
        <div className="schoolFooter__newsletter-content">
          <span className="schoolFooter__newsletter-label">RESTEZ INFORMÉ</span>
          <h2>
            Les actualités de
            <span> notre école.</span>
          </h2>
          <p>
            Recevez nos dernières actualités, événements et informations
            directement dans votre boîte mail.
          </p>
        </div>

        <form className="schoolFooter__newsletter-form" onSubmit={handleNewsletter}>
          <input
            type="email"
            name="email"
            placeholder="Votre adresse e-mail"
            aria-label="Votre adresse e-mail"
            required
          />
          <button type="submit">
            S&apos;inscrire
            <ArrowRight size={18} aria-hidden="true" />
          </button>
        </form>
      </div>

      <div className="schoolFooter__main">
        <div className="schoolFooter__grid">
          <div className="schoolFooter__brand">
            <a href="/" className="schoolFooter__logo" aria-label="Accueil">
              <img src="/Img.png" alt="" aria-hidden="true" />
              <span className="schoolFooter__logo-text">
                <strong>NOTRE ÉCOLE</strong>
                <small>EXCELLENCE • ÉDUCATION</small>
              </span>
            </a>

            <p>
              Un établissement tourné vers l&apos;excellence, l&apos;innovation
              pédagogique et l&apos;épanouissement de chaque élève.
            </p>

            <div className="schoolFooter__socials">
              <a href="#" aria-label="Facebook"><Share2 size={16} /></a>
              <a href="#" aria-label="Instagram"><Camera size={16} /></a>
              <a href="#" aria-label="YouTube"><Play size={16} /></a>
              <a href="#" aria-label="LinkedIn"><BriefcaseBusiness size={16} /></a>
            </div>
          </div>

          <div className="schoolFooter__column">
            <h3>Navigation</h3>
            <a href="/">Accueil</a>
            <a href="/ecole">L&apos;école</a>
            <a href="/formations">Formations</a>
            <a href="/actualites">Actualités</a>
            <a href="/admissions">Admissions</a>
          </div>

          <div className="schoolFooter__column">
            <h3>Vie scolaire</h3>
            <a href="/vie-scolaire">Vie scolaire</a>
            <a href="/activites">Activités</a>
            <a href="/calendrier">Calendrier</a>
            <a href="/documents">Documents</a>
            <a href="/faq">FAQ</a>
          </div>

          <div className="schoolFooter__column schoolFooter__contact">
            <h3>Nous contacter</h3>
            <div className="schoolFooter__contact-item">
              <span aria-hidden="true"><MapPin size={18} /></span>
              <span>Cocody, Abidjan<small>Côte d&apos;Ivoire</small></span>
            </div>
            <div className="schoolFooter__contact-item">
              <span aria-hidden="true"><Phone size={18} /></span>
              <a href="tel:+2250000000000">+225 00 00 00 00 00<small>Du lundi au vendredi</small></a>
            </div>
            <div className="schoolFooter__contact-item">
              <span aria-hidden="true"><Mail size={18} /></span>
              <a href="mailto:contact@notre-ecole.com">contact@notre-ecole.com<small>Réponse sous 24h</small></a>
            </div>
          </div>
        </div>
      </div>

      <div className="schoolFooter__bottom">
        <div className="schoolFooter__bottom-inner">
          <p>© {new Date().getFullYear()} Notre École. Tous droits réservés.</p>
          <div className="schoolFooter__legal">
            <a href="/mentions-legales">Mentions légales</a>
            <a href="/confidentialite">Confidentialité</a>
            <a href="/cookies">Cookies</a>
          </div>
          <button type="button" className="schoolFooter__top" onClick={scrollToTop}>
            <span>Haut</span>
            <ArrowUp size={18} aria-hidden="true" />
          </button>
        </div>
      </div>
    </footer>
  )
}

export default Footer
