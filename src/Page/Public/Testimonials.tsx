import { useState } from 'react'
import { ArrowLeft, ArrowRight, Quote, Star } from 'lucide-react'
import '../Css/Testimonials.css'

type Testimonial = {
  name: string
  role: string
  text: string
  initials: string
}

const testimonials: Testimonial[] = [
  {
    name: 'Mme Aminata Kouassi',
    role: "Parent d'élève",
    text: "Nous avons particulièrement apprécié l'écoute de l'équipe pédagogique. Notre enfant a énormément progressé depuis son arrivée et s'épanouit pleinement dans son environnement scolaire.",
    initials: 'AK',
  },
  {
    name: "Lucas N'Guessan",
    role: 'Élève — Classe de Terminale',
    text: "L'accompagnement des enseignants m'a permis de prendre confiance en moi et de mieux préparer mon projet d'études. L'ambiance de l'école est vraiment motivante.",
    initials: 'LN',
  },
  {
    name: 'M. Jean-Marc Yao',
    role: "Parent d'élève",
    text: 'Une équipe disponible, des enseignants engagés et un excellent suivi. Nous sommes rassurés de savoir notre enfant dans un cadre aussi sérieux et bienveillant.',
    initials: 'JY',
  },
]

const Testimonials = () => {
  const [active, setActive] = useState(0)

  const previous = () => {
    setActive((current) =>
      current === 0 ? testimonials.length - 1 : current - 1,
    )
  }

  const next = () => {
    setActive((current) =>
      current === testimonials.length - 1 ? 0 : current + 1,
    )
  }

  return (
    <section className="testimonials" id="temoignages">
      <div className="testimonials__container">
        <div className="testimonials__header">
          <div>
            <span className="testimonials__eyebrow">ILS NOUS FONT CONFIANCE</span>
            <h2>
              Des expériences qui
              <span> parlent d&apos;elles-mêmes.</span>
            </h2>
          </div>

          <div className="testimonials__controls">
            <button type="button" onClick={previous} aria-label="Témoignage précédent">
              <ArrowLeft size={18} />
            </button>
            <span>
              {String(active + 1).padStart(2, '0')}
              <i>/</i>
              {String(testimonials.length).padStart(2, '0')}
            </span>
            <button type="button" onClick={next} aria-label="Témoignage suivant">
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        <div className="testimonials__main">
          <div className="testimonials__mark" aria-hidden="true"><Quote size={88} /></div>

          <div className="testimonials__slider">
            {testimonials.map((testimonial, index) => (
              <article
                key={testimonial.name}
                className={`testimonial ${active === index ? 'testimonial--active' : ''}`}
                aria-hidden={active !== index}
              >
                <div className="testimonial__rating" aria-label="5 étoiles">
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                </div>
                <p className="testimonial__text">{testimonial.text}</p>
                <div className="testimonial__author">
                  <div className="testimonial__avatar">{testimonial.initials}</div>
                  <div>
                    <strong>{testimonial.name}</strong>
                    <span>{testimonial.role}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="testimonials__side">
            <div className="testimonials__side-number">
              98<span>%</span>
            </div>
            <p>de nos familles recommandent notre établissement.</p>
            <div className="testimonials__line"><span /></div>
          </div>
        </div>

        <div className="testimonials__dots">
          {testimonials.map((testimonial, index) => (
            <button
              type="button"
              key={testimonial.name}
              onClick={() => setActive(index)}
              className={active === index ? 'active' : ''}
              aria-label={`Afficher le témoignage ${index + 1}`}
              aria-current={active === index ? 'true' : undefined}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
