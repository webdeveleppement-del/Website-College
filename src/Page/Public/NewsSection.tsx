import '../Css/NewsSection.css'
import { ArrowRight, ArrowUpRight } from 'lucide-react'

type NewsItem = {
  category: string
  date: string
  title: string
  excerpt: string
  image: string
}

const news: NewsItem[] = [
  {
    category: 'VIE SCOLAIRE',
    date: '12 SEPT. 2026',
    title: "Une nouvelle année scolaire placée sous le signe de l'excellence",
    excerpt:
      'Découvrez les nouveautés, projets et objectifs qui accompagneront nos élèves tout au long de cette nouvelle année.',
    image: '/Img1.png',
  },
  {
    category: 'ÉVÉNEMENT',
    date: '28 SEPT. 2026',
    title: 'Journée portes ouvertes : venez découvrir notre établissement',
    excerpt:
      'Parents et futurs élèves sont invités à découvrir nos espaces, nos formations et notre équipe pédagogique.',
    image: '/Img2.png',
  },
  {
    category: 'ACTIVITÉS',
    date: '05 OCT. 2026',
    title: 'Les activités extrascolaires reprennent cette semaine',
    excerpt:
      'Sport, culture, créativité et numérique : découvrez les activités proposées à nos élèves.',
    image: '/Img5.png',
  },
]

const NewsSection = () => {
  return (
    <section className="newsSection" id="actualites">
      <div className="newsSection__container">
        <div className="newsSection__header">
          <div>
            <span className="newsSection__eyebrow">NOTRE ACTUALITÉ</span>
            <h2>
              La vie de notre
              <span> école.</span>
            </h2>
          </div>

          <a href="/actualites" className="newsSection__all">
            Toutes les actualités
            <span aria-hidden="true"><ArrowUpRight size={16} /></span>
          </a>
        </div>

        <div className="newsSection__grid">
          {news.map((item, index) => (
            <article
              className={`newsCard ${index === 0 ? 'newsCard--featured' : ''}`}
              key={item.title}
            >
              <a
                href="/actualites"
                className="newsCard__image"
                style={{ backgroundImage: `url(${item.image})` }}
                aria-label={item.title}
              >
                <div className="newsCard__image-overlay" />
                <span className="newsCard__category">{item.category}</span>
                <span className="newsCard__open" aria-hidden="true">
                  <ArrowUpRight size={18} />
                </span>
              </a>

              <div className="newsCard__content">
                <div className="newsCard__meta">
                  <span>{item.date}</span>
                  <span className="newsCard__dot" />
                  <span>ACTUALITÉ</span>
                </div>

                <h3>
                  <a href="/actualites">{item.title}</a>
                </h3>
                <p>{item.excerpt}</p>

                <a href="/actualites" className="newsCard__link">
                  Lire l&apos;article
                  <span aria-hidden="true"><ArrowRight size={16} /></span>
                </a>
              </div>
            </article>
          ))}
        </div>

        <div className="newsSection__mobileLink">
          <a href="/actualites">
            Voir toutes les actualités
            <span aria-hidden="true"><ArrowRight size={18} /></span>
          </a>
        </div>
      </div>
    </section>
  )
}

export default NewsSection
