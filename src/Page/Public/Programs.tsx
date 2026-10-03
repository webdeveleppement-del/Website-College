import type { CSSProperties } from 'react'
import { ArrowRight, ArrowUpRight, Sparkles } from 'lucide-react'
import '../Css/Programs.css'

type Program = {
  level: string
  title: string
  description: string
  subjects: string[]
  icon: string
  accent: 'gold' | 'blue' | 'dark'
}

const programs: Program[] = [
  {
    level: 'CYCLE PRIMAIRE',
    title: 'École primaire',
    description:
      'Un environnement stimulant pour construire les bases académiques, développer la curiosité et apprendre à devenir autonome.',
    subjects: ['Français', 'Mathématiques', 'Sciences', 'Anglais'],
    icon: '01',
    accent: 'gold',
  },
  {
    level: 'COLLÈGE',
    title: 'Enseignement secondaire',
    description:
      'Un accompagnement pédagogique rigoureux permettant aux élèves de consolider leurs connaissances et préparer leur avenir.',
    subjects: ['Sciences', 'Littérature', 'Anglais', 'Informatique'],
    icon: '02',
    accent: 'blue',
  },
  {
    level: 'LYCÉE',
    title: 'Lycée & préparation',
    description:
      'Une formation exigeante et moderne orientée vers la réussite aux examens et la préparation aux études supérieures.',
    subjects: ['Mathématiques', 'Sciences', 'Économie', 'Langues'],
    icon: '03',
    accent: 'dark',
  },
]

const Programs = () => {
  return (
    <section className="programs" id="formations">
      <div className="programs__container">
        <div className="programs__header">
          <div>
            <span className="programs__eyebrow">NOTRE PÉDAGOGIE</span>

            <h2>
              Des parcours pensés pour
              <span> chaque étape.</span>
            </h2>
          </div>

          <p className="programs__intro">
            De l&apos;école primaire au lycée, nous accompagnons chaque élève
            avec une pédagogie exigeante, bienveillante et tournée vers
            l&apos;avenir.
          </p>
        </div>

        <div className="programs__grid">
          {programs.map((program, index) => (
            <article
              className={`programCard programCard--${program.accent}`}
              key={program.title}
              style={
                {
                  '--delay': `${index * 120}ms`,
                } as CSSProperties
              }
            >
              <div className="programCard__top">
                <span className="programCard__number">{program.icon}</span>
                <span className="programCard__level">{program.level}</span>
              </div>

              <div className="programCard__content">
                <h3>{program.title}</h3>
                <p>{program.description}</p>

                <div className="programCard__subjects">
                  {program.subjects.map((subject) => (
                    <span key={subject}>{subject}</span>
                  ))}
                </div>
              </div>

              <a href="/formations" className="programCard__link">
                Découvrir le programme
                <span aria-hidden="true"><ArrowUpRight size={16} /></span>
              </a>

              <div className="programCard__shine" />
            </article>
          ))}
        </div>

        <div className="programs__bottom">
          <div className="programs__bottom-icon" aria-hidden="true">
            <Sparkles size={22} />
          </div>

          <div>
            <strong>Une pédagogie adaptée à chaque élève</strong>
            <p>
              Classes à effectifs maîtrisés, accompagnement personnalisé et
              suivi régulier des progrès.
            </p>
          </div>

          <a href="/formations">
            Voir toutes les formations
            <span aria-hidden="true"><ArrowRight size={18} /></span>
          </a>
        </div>
      </div>
    </section>
  )
}

export default Programs
