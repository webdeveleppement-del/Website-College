import { useEffect, useId, useRef, useState } from 'react'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import '../Css/Home.css'
import Hero from './Hero'

type NavbarLink = {
  label: string
  href: string
}

type NavbarProps = {
  logo?: string
  logoAccent?: string
  links?: NavbarLink[]
}

const defaultLinks: NavbarLink[] = [
  { label: 'Accueil', href: '/' },
  { label: "L'école", href: '/ecole' },
  { label: 'Formations', href: '/formations' },
  { label: 'Vie scolaire', href: '/vie-scolaire' },
  { label: 'Actualités', href: '/actualites' },
  { label: 'Admissions', href: '/admissions' },
  { label: 'Contact', href: '/contact' },
]

const Navbar = ({
  logo = 'ÉCOLE',
  logoAccent = 'EXCELLENCE',
  links = defaultLinks,
}: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const navRef = useRef<HTMLElement>(null)
  const menuId = useId()

  /* -------------------------------------------------
     Effet au scroll
  ------------------------------------------------- */
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  /* -------------------------------------------------
     Fermeture du menu mobile
  ------------------------------------------------- */
  useEffect(() => {
    if (!isMenuOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      if (
        navRef.current &&
        !navRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isMenuOpen])

  /* -------------------------------------------------
     Bloquer le scroll quand le menu mobile est ouvert
  ------------------------------------------------- */
  useEffect(() => {
    if (isMenuOpen && window.innerWidth < 900) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  /* -------------------------------------------------
     Fermer le menu lors du passage desktop
  ------------------------------------------------- */
  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 900px)')

    const handleChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setIsMenuOpen(false)
      }
    }

    mediaQuery.addEventListener('change', handleChange)

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  const handleLinkClick = () => {
    setIsMenuOpen(false)
  }

  return (
    <>
      <header className={`site-header ${isScrolled ? 'is-scrolled' : ''}`}>
      <nav
        ref={navRef}
        className="navbar"
        aria-label="Navigation principale"
      >
        {/* ---------------------------------------------
            LOGO
        --------------------------------------------- */}
        <a
          href="/"
          className="navbar-logo"
          aria-label={`${logo} ${logoAccent} - Accueil`}
          onClick={handleLinkClick}
        >
          <img
            className="logo-image"
            src="/Img.png"
            alt=""
            aria-hidden="true"
          />

          <span className="logo-text">
            <strong>{logo}</strong>
            <span>{logoAccent}</span>
          </span>
        </a>

        {/* ---------------------------------------------
            MENU DESKTOP / MOBILE
        --------------------------------------------- */}
        <div
          id={menuId}
          className={`navbar-menu ${
            isMenuOpen ? 'is-open' : ''
          }`}
        >
          <div className="mobile-menu-header">
            <span>Navigation</span>

            <button
              type="button"
              className="mobile-close"
              aria-label="Fermer le menu"
              onClick={() => setIsMenuOpen(false)}
            >
              <span />
              <span />
            </button>
          </div>

          <ul className="navbar-links">
            {links.map((link) => (
              <li key={`${link.href}-${link.label}`}>
                <a
                  href={link.href}
                  onClick={handleLinkClick}
                >
                  <span>{link.label}</span>
                </a>
              </li>
            ))}
          </ul>

          {/* Actions uniquement utiles sur mobile */}
          <div className="mobile-actions">
            <a
              href="/connexion"
              className="mobile-login"
              onClick={handleLinkClick}
            >
              <span>Espace personnel</span>
              <ArrowUpRight className="arrow" size={16} aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* ---------------------------------------------
            ACTIONS DESKTOP
        --------------------------------------------- */}
        <div className="navbar-actions">
          <a
            href="/connexion"
            className="navbar-login"
          >
            <span>Espace personnel</span>
            <ArrowUpRight className="login-arrow" size={16} aria-hidden="true" />
          </a>

          <a
            href="/inscription"
            className="navbar-cta"
          >
            Inscription
          </a>
        </div>

        {/* ---------------------------------------------
            BOUTON MOBILE
        --------------------------------------------- */}
        <button
          type="button"
          className={`menu-toggle ${
            isMenuOpen ? 'is-open' : ''
          }`}
          aria-expanded={isMenuOpen}
          aria-controls={menuId}
          aria-label={
            isMenuOpen
              ? 'Fermer le menu'
              : 'Ouvrir le menu'
          }
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          <span className="menu-icon" aria-hidden="true">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </span>
        </button>
      </nav>

      {/* Overlay mobile */}
      <button
        type="button"
        className={`navbar-overlay ${
          isMenuOpen ? 'is-visible' : ''
        }`}
        aria-label="Fermer le menu"
        onClick={() => setIsMenuOpen(false)}
      />
      </header>
      <Hero />
    </>
  )
}

export default Navbar