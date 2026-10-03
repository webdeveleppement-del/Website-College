import '../Css/WhyChooseUs.css'
import { ArrowRight, ArrowUpRight, Quote } from 'lucide-react'

const advantages = [
  {
    number: '01',
    title: 'Excellence académique',
    text: 'Une exigence pédagogique constante pour accompagner chaque élève vers le meilleur de ses capacités.',
  },
  {
    number: '02',
    title: 'Accompagnement personnalisé',
    text: "Chaque élève bénéficie d'une attention particulière et d'un suivi adapté à son rythme.",
  },
  {
    number: '03',
    title: 'Ouverture sur le monde',
    text: 'Langues, numérique, culture et projets permettent aux élèves de développer une vision ouverte sur leur avenir.',
  },
  {
    number: '04',
    title: 'Épanouissement personnel',
    text: "Nous plaçons la confiance, l'autonomie, la créativité et le respect au cœur de la vie scolaire.",
  },
]

const WhyChooseUs = () => {
  return (
    <section className="whyChoose" id="ecole">
      <div className="whyChoose__container">
        <div className="whyChoose__visual">
          <div className="whyChoose__image">
            <div className="whyChoose__image-overlay" />

            <div className="whyChoose__quote">
              <span className="whyChoose__quote-mark" aria-hidden="true"><Quote size={52} /></span>
              <p>
                Former aujourd&apos;hui les esprits qui construiront le monde
                de demain.
              </p>
              <span className="whyChoose__quote-line" />
              <small>NOTRE VISION</small>
            </div>
          </div>

          <div className="whyChoose__experience">
            <strong>25+</strong>
            <span>
              années
              <br />
              d&apos;expérience
            </span>
          </div>

          <div className="whyChoose__circle">
            <span>EXCELLENCE</span>
            <span aria-hidden="true">•</span>
            <span>ÉDUCATION</span>
            <span aria-hidden="true">•</span>
          </div>
        </div>

        <div className="whyChoose__content">
          <span className="whyChoose__eyebrow">POURQUOI NOUS CHOISIR</span>

          <h2>
            Plus qu&apos;une école,
            <span> un environnement pour grandir.</span>
          </h2>

          <p className="whyChoose__description">
            Notre établissement accompagne les élèves dans leur réussite
            académique, mais aussi dans leur construction personnelle. Nous
            créons un cadre dans lequel chaque enfant peut apprendre,
            progresser et révéler son potentiel.
          </p>

          <div className="whyChoose__advantages">
            {advantages.map((advantage) => (
              <div className="advantage" key={advantage.number}>
                <span className="advantage__number">{advantage.number}</span>

                <div className="advantage__body">
                  <h3>{advantage.title}</h3>
                  <p>{advantage.text}</p>
                </div>

                <span className="advantage__arrow" aria-hidden="true">
                  <ArrowUpRight size={16} />
                </span>
              </div>
            ))}
          </div>

          <a href="/ecole" className="whyChoose__button">
            Découvrir notre école
            <span aria-hidden="true"><ArrowRight size={18} /></span>
          </a>
        </div>
      </div>
    </section>
  )
}

export default WhyChooseUs
