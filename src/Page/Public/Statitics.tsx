import { useEffect, useRef, useState } from 'react'
import { api } from '../../api/client'
import {
  GraduationCap,
  School,
  Trophy,
  UsersRound,
  type LucideIcon,
} from 'lucide-react'
import '../Css/Statitics.css'

type Stat = {
  value: number
  suffix?: string
  label: string
  description: string
  icon: LucideIcon
}

type PublicStatistics = {
  students: number
  teachers: number
  classes: number
  success_rate: number
}

function AnimatedNumber({
  value,
  suffix = '',
}: {
  value: number
  suffix?: string
}) {
  const [displayValue, setDisplayValue] = useState(0)
  const [started, setStarted] = useState(false)

  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!ref.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true)
        }
      },
      {
        threshold: 0.4,
      },
    )

    observer.observe(ref.current)

    return () => observer.disconnect()
  }, [started])

  useEffect(() => {
    if (!started) return

    const duration = 1600
    const startTime = performance.now()

    const animate = (currentTime: number) => {
      const progress = Math.min(
        (currentTime - startTime) / duration,
        1,
      )

      // easing cubic
      const eased =
        1 - Math.pow(1 - progress, 3)

      setDisplayValue(
        Math.floor(value * eased),
      )

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [started, value])

  return (
    <span ref={ref} className="stat-number">
      {displayValue.toLocaleString('fr-FR')}
      {suffix}
    </span>
  )
}

const Statistics = () => {
  const [data, setData] = useState<PublicStatistics | null>(null)

  useEffect(() => {
    api.get<PublicStatistics>('/dashboard/public-statistics/')
      .then((response) => setData(response.data))
      .catch(() => setData(null))
  }, [])

  const stats: Stat[] = [
    { value: data?.students ?? 0, label: 'Élèves inscrits', description: 'Cette année scolaire', icon: UsersRound },
    { value: data?.teachers ?? 0, label: 'Enseignants', description: 'Une équipe expérimentée', icon: GraduationCap },
    { value: data?.classes ?? 0, label: 'Classes', description: 'Classes enregistrées', icon: School },
    { value: data?.success_rate ?? 0, suffix: '%', label: 'Taux de réussite', description: 'Notes supérieures ou égales à 10/20', icon: Trophy },
  ]

  return (
    <section className="statistics-section">
      <div className="statistics-container">

        {/* HEADER */}
        <div className="statistics-header">

          <div className="statistics-heading">
            <span className="statistics-eyebrow">
              NOTRE ÉTABLISSEMENT
            </span>

            <h2>
              L’excellence en
              <span> quelques chiffres.</span>
            </h2>
          </div>

          <p className="statistics-intro">
            Une communauté éducative engagée pour
            accompagner chaque élève vers la réussite
            et construire son avenir.
          </p>

        </div>

        {/* CARDS */}
        <div className="statistics-grid">

          {stats.map((stat, index) => {
            const Icon = stat.icon

            return (
              <article
                className="stat-card"
                key={stat.label}
                style={{
                  '--card-index': index,
                } as React.CSSProperties}
              >
                {/* numéro */}
                <div className="stat-card-top">
                  <div className="stat-icon">
                    <Icon
                      size={24}
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                  </div>

                </div>

                {/* chiffre */}
                <div className="stat-value">
                  <AnimatedNumber
                    value={stat.value}
                    suffix={stat.suffix}
                  />
                </div>

                {/* texte */}
                <h3>
                  {stat.label}
                </h3>

                <p>
                  {stat.description}
                </p>

                {/* ligne décorative */}
                <div className="stat-progress">
                  <span />
                </div>
              </article>
            )
          })}

        </div>

      </div>
    </section>
  )
}

export default Statistics