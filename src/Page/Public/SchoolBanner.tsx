import '../Css/SchoolBanner.css'
import { ArrowUpRight } from 'lucide-react'

const SchoolBanner = () => {
  return (
    <section className="school-banner">
      <div className="school-banner-decoration school-banner-decoration-one" />
      <div className="school-banner-decoration school-banner-decoration-two" />

      <div className="school-banner-content">
        <div className="school-banner-label">
          <span className="banner-dot" />
          INSCRIPTIONS OUVERTES
        </div>

        <h2>
          Construisons ensemble
          <span> l&apos;avenir de nos élèves.</span>
        </h2>

        <p>
          Découvrez notre établissement, nos programmes et un environnement
          pensé pour accompagner chaque élève vers la réussite.
        </p>

        <div className="school-banner-actions">
          <a href="/inscription" className="banner-primary-button">
            <span>Demander une inscription</span>
            <span className="banner-arrow" aria-hidden="true">
              <ArrowUpRight size={17} />
            </span>
          </a>

          <a href="/ecole" className="banner-secondary-button">
            Découvrir l&apos;école
          </a>
        </div>
      </div>

      <div className="school-banner-side">
        <div className="banner-orbit">
          <div className="banner-orbit-inner">
            <span>EXCELLENCE</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SchoolBanner
