import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './CookieBanner.css'

const COOKIE_CONSENT_KEY = 'school_cookie_consent'

type CookieConsent = 'accepted' | 'refused'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY) as CookieConsent | null
    setVisible(consent !== 'accepted' && consent !== 'refused')
  }, [])

  const saveConsent = (consent: CookieConsent) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, consent)
    setVisible(false)
  }

  if (!visible) return null

  return (
    <aside className="cookie-banner" role="dialog" aria-labelledby="cookie-banner-title">
      <div className="cookie-banner__content">
        <span className="cookie-banner__eyebrow">VOTRE CONFIDENTIALITÉ</span>
        <h2 id="cookie-banner-title">Nous utilisons des cookies</h2>
        <p>
          Les cookies nécessaires permettent au site de fonctionner correctement.
          Vous pouvez accepter ou refuser les cookies optionnels.
          <Link to="/cookies">En savoir plus</Link>
        </p>
      </div>
      <div className="cookie-banner__actions">
        <button type="button" className="cookie-banner__refuse" onClick={() => saveConsent('refused')}>
          Refuser
        </button>
        <button type="button" className="cookie-banner__accept" onClick={() => saveConsent('accepted')}>
          Accepter
        </button>
      </div>
    </aside>
  )
}
