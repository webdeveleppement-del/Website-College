import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ArrowRight, BookOpen, CheckCircle2, Mail, MapPin, Phone, Send, Users } from 'lucide-react'
import { api } from '../../api/client'
import Footer from './Footer'
import './DestinationPage.css'

type NewsItem = {
  id: number
  title: string
  category: string
  excerpt: string
  content: string
  published_at: string | null
  image?: string | null
}

type FormState = {
  first_name: string
  last_name: string
  email: string
  phone: string
  parent_name: string
  parent_phone: string
  message: string
}

const initialForm: FormState = {
  first_name: '', last_name: '', email: '', phone: '',
  parent_name: '', parent_phone: '', message: '',
}

const pageTitles: Record<string, string> = {
  '/ecole': 'Notre école',
  '/formations': 'Formations',
  '/vie-scolaire': 'Vie scolaire',
  '/actualites': 'Actualités',
  '/admissions': 'Admissions',
  '/contact': 'Contact',
  '/mentions-legales': 'Mentions légales',
  '/confidentialite': 'Politique de confidentialité',
  '/cookies': 'Politique relative aux cookies',
}

const links = [
  ['L’école', '/ecole'], ['Formations', '/formations'],
  ['Vie scolaire', '/vie-scolaire'], ['Actualités', '/actualites'],
  ['Admissions', '/admissions'], ['Contact', '/contact'],
]

function PublicHeader() {
  return (
    <header className="destination-header">
      <Link to="/" className="destination-logo">
        <img src="/Img.png" alt="" aria-hidden="true" />
        <span><strong>ÉCOLE</strong><small>EXCELLENCE</small></span>
      </Link>
      <nav aria-label="Navigation publique">
        {links.map(([label, href]) => <Link key={href} to={href}>{label}</Link>)}
      </nav>
      <Link className="destination-login" to="/connexion">Espace personnel</Link>
    </header>
  )
}

function PageIntro({ title, eyebrow, text }: { title: string; eyebrow: string; text: string }) {
  return (
    <section className="destination-hero">
      <span>{eyebrow}</span>
      <h1>{title}</h1>
      <p>{text}</p>
    </section>
  )
}

function SchoolPage() {
  return <><PageIntro eyebrow="NOTRE ÉTABLISSEMENT" title="Une école qui prépare l’avenir." text="Un cadre exigeant et bienveillant où chaque élève développe ses compétences, sa confiance et son ambition." />
    <section className="destination-section destination-two-columns">
      <div><span className="destination-eyebrow">NOTRE MISSION</span><h2>Grandir, apprendre et réussir ensemble.</h2><p>Notre établissement accompagne les élèves de la 6e à la Terminale avec un enseignement solide, une équipe attentive et des projets qui donnent du sens aux apprentissages.</p><p>Nous plaçons l’excellence académique, le respect et l’ouverture au monde au cœur de chaque parcours.</p></div>
      <div className="destination-highlight"><Users size={30} /><strong>Une communauté engagée</strong><p>Des enseignants, des familles et des élèves réunis autour d’un même objectif : la réussite de chacun.</p></div>
    </section>
  </>
}

function FormationsPage() {
  const formations = [
    ['Collège', 'De la 6e à la 3e', 'Consolider les fondamentaux et développer l’autonomie.'],
    ['Lycée général', 'De la 2nde à la Terminale', 'Construire un projet d’études ambitieux et cohérent.'],
    ['Accompagnement', 'Tout au long de l’année', 'Étude dirigée, soutien et suivi personnalisé.'],
  ]
  return <><PageIntro eyebrow="NOS PARCOURS" title="Des formations pour chaque ambition." text="Des parcours progressifs et un accompagnement adapté aux besoins de chaque élève." />
    <section className="destination-section"><div className="destination-cards">{formations.map(([title, level, text]) => <article className="destination-card" key={title}><BookOpen size={27} /><h2>{title}</h2><strong>{level}</strong><p>{text}</p></article>)}</div></section>
  </>
}

function SchoolLifePage() {
  return <><PageIntro eyebrow="AU QUOTIDIEN" title="Une vie scolaire riche et équilibrée." text="L’école est aussi un lieu de rencontres, de projets, de sport et de créativité." />
    <section className="destination-section"><div className="destination-cards"><article className="destination-card"><CheckCircle2 size={27} /><h2>Accompagnement</h2><p>Une équipe éducative disponible pour suivre la progression, le bien-être et l’orientation de chaque élève.</p></article><article className="destination-card"><Users size={27} /><h2>Activités</h2><p>Des projets culturels, sportifs et citoyens pour apprendre autrement et révéler les talents.</p></article><article className="destination-card"><BookOpen size={27} /><h2>Organisation</h2><p>Un emploi du temps structuré, des espaces adaptés et un dialogue régulier avec les familles.</p></article></div></section>
  </>
}

function NewsPage() {
  const [items, setItems] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  useEffect(() => {
    api.get<NewsItem[] | { results: NewsItem[] }>('/news/news/')
      .then(({ data }) => setItems(Array.isArray(data) ? data : data.results))
      .catch(() => setError('Les actualités sont momentanément indisponibles.'))
      .finally(() => setLoading(false))
  }, [])
  return <><PageIntro eyebrow="LA VIE DE L’ÉCOLE" title="Nos actualités." text="Retrouvez les dernières informations, événements et réussites de notre communauté." />
    <section className="destination-section">{loading ? <div className="destination-state">Chargement des actualités...</div> : error ? <div className="destination-state error">{error}</div> : items.length === 0 ? <div className="destination-state">Aucune actualité publiée pour le moment.</div> : <div className="news-list">{items.map(item => <article className="news-list-card" key={item.id}>{item.image && <img src={item.image} alt="" /> }<div><span>{item.category}</span><small>{item.published_at ? new Date(item.published_at).toLocaleDateString('fr-FR') : ''}</small><h2>{item.title}</h2><p>{item.excerpt || item.content}</p></div></article>)}</div>}</section>
  </>
}

function AdmissionPage() {
  const [form, setForm] = useState(initialForm)
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)
  const submit = async (event: FormEvent) => {
    event.preventDefault(); setSaving(true); setMessage('')
    try { await api.post('/admissions/admissions/', form); setForm(initialForm); setMessage('Votre demande a bien été envoyée. Notre équipe vous répondra rapidement.') }
    catch { setMessage('Impossible d’envoyer la demande. Vérifiez les informations saisies.') }
    finally { setSaving(false) }
  }
  return <><PageIntro eyebrow="REJOINDRE L’ÉCOLE" title="Préparons ensemble la prochaine rentrée." text="Remplissez ce formulaire, notre équipe admissions vous contactera pour vous présenter les prochaines étapes." />
    <section className="destination-section form-section"><form className="public-form" onSubmit={submit}><div className="form-grid"><label>Prénom<input required value={form.first_name} onChange={e => setForm({ ...form, first_name: e.target.value })} /></label><label>Nom<input required value={form.last_name} onChange={e => setForm({ ...form, last_name: e.target.value })} /></label><label>Email<input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></label><label>Téléphone<input required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></label><label>Nom du parent<input value={form.parent_name} onChange={e => setForm({ ...form, parent_name: e.target.value })} /></label><label>Téléphone du parent<input value={form.parent_phone} onChange={e => setForm({ ...form, parent_phone: e.target.value })} /></label></div><label>Votre message<textarea rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} /></label><button disabled={saving} type="submit">{saving ? 'Envoi...' : 'Envoyer ma demande'}<Send size={17} /></button>{message && <p className="form-message">{message}</p>}</form></section>
  </>
}

function ContactPage() {
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setSent(false); setError('')
    const data = Object.fromEntries(new FormData(event.currentTarget).entries())
    try { await api.post('/contact/messages/', data); event.currentTarget.reset(); setSent(true) }
    catch { setError('Impossible d’envoyer votre message pour le moment.') }
  }
  return <><PageIntro eyebrow="NOUS RENCONTRER" title="Parlons de votre projet." text="Une question sur l’école, nos formations ou une admission ? Notre équipe est à votre écoute." />
    <section className="destination-section contact-layout"><div className="contact-details"><div><MapPin /><strong>Notre établissement</strong><p>Cocody, Abidjan<br />Côte d’Ivoire</p></div><div><Phone /><strong>Téléphone</strong><p>+225 00 00 00 00 00<br />Du lundi au vendredi</p></div><div><Mail /><strong>Email</strong><p>contact@notre-ecole.com</p></div></div><form className="public-form" onSubmit={submit}><div className="form-grid"><label>Nom<input name="name" required /></label><label>Email<input name="email" required type="email" /></label><label>Téléphone<input name="phone" /></label><label>Sujet<input name="subject" required /></label></div><label>Message<textarea name="message" rows={6} required /></label><button type="submit">Envoyer le message<ArrowRight size={17} /></button>{sent && <p className="form-message success">Votre message a bien été envoyé.</p>}{error && <p className="form-message error">{error}</p>}</form></section>
  </>
}

type PolicySection = {
  title: string
  paragraphs: string[]
}

const policyContent: Record<string, { eyebrow: string; title: string; intro: string; sections: PolicySection[] }> = {
  '/mentions-legales': {
    eyebrow: 'INFORMATIONS JURIDIQUES',
    title: 'Mentions légales',
    intro: 'Les informations relatives à l’éditeur, à l’hébergement et à l’utilisation de ce site sont présentées ci-dessous.',
    sections: [
      { title: 'Éditeur du site', paragraphs: ['Le présent site est édité par Notre École, établissement scolaire situé à Cocody, Abidjan, Côte d’Ivoire.', 'Pour toute question concernant le site, vous pouvez nous écrire à contact@notre-ecole.com ou nous contacter au +225 00 00 00 00 00.'] },
      { title: 'Directeur de la publication', paragraphs: ['La direction de l’établissement assure la publication et la mise à jour des contenus diffusés sur ce site.'] },
      { title: 'Hébergement', paragraphs: ['Le site est hébergé par le prestataire technique choisi par l’établissement. Les informations d’hébergement et les coordonnées du prestataire peuvent être obtenues auprès de l’administration sur demande.'] },
      { title: 'Propriété intellectuelle', paragraphs: ['Les textes, visuels, logos, éléments graphiques et logiciels présents sur ce site sont protégés par les règles applicables en matière de propriété intellectuelle.', 'Toute reproduction, adaptation ou réutilisation substantielle sans autorisation préalable de l’établissement est interdite.'] },
      { title: 'Responsabilité', paragraphs: ['Notre École s’efforce de maintenir des informations exactes et à jour. Elle ne peut toutefois garantir l’absence d’erreur, d’interruption ou de contenu temporairement indisponible.', 'Les liens vers des sites externes sont proposés à titre informatif. Notre École ne contrôle pas leur contenu ni leurs pratiques.'] },
    ],
  },
  '/confidentialite': {
    eyebrow: 'PROTECTION DES DONNÉES',
    title: 'Politique de confidentialité',
    intro: 'Cette politique explique quelles données sont collectées, pourquoi elles le sont et quels droits vous pouvez exercer.',
    sections: [
      { title: 'Données collectées', paragraphs: ['Lorsque vous utilisez le formulaire d’admission ou de contact, nous pouvons recueillir votre nom, vos coordonnées, les informations relatives à l’élève et le contenu de votre demande.', 'Lors de la connexion à un espace personnel, les données de compte et les informations scolaires nécessaires au fonctionnement du service sont également traitées.'] },
      { title: 'Finalités du traitement', paragraphs: ['Ces données servent à répondre aux demandes, traiter les candidatures, organiser la scolarité, sécuriser les espaces personnels et communiquer les informations liées à l’établissement.', 'Nous n’utilisons pas les données collectées pour une finalité incompatible avec celle annoncée au moment de leur collecte.'] },
      { title: 'Accès et conservation', paragraphs: ['Les données sont accessibles uniquement aux membres habilités de l’établissement et à ses prestataires techniques lorsqu’ils en ont besoin pour fournir le service.', 'Elles sont conservées pendant la durée nécessaire à la gestion de la demande, de la scolarité ou des obligations administratives applicables, puis supprimées ou archivées selon les règles en vigueur.'] },
      { title: 'Vos droits', paragraphs: ['Vous pouvez demander l’accès, la rectification, la limitation ou la suppression de vos données lorsque la réglementation le permet. Vous pouvez également vous opposer à certains traitements.', 'Pour exercer vos droits, écrivez à contact@notre-ecole.com en précisant votre demande et un moyen de vous recontacter. Une vérification d’identité pourra être demandée.'] },
      { title: 'Sécurité', paragraphs: ['Nous mettons en œuvre des mesures techniques et organisationnelles destinées à protéger les données contre l’accès non autorisé, la perte, la modification ou la divulgation.'] },
    ],
  },
  '/cookies': {
    eyebrow: 'TRANSPARENCE NUMÉRIQUE',
    title: 'Politique relative aux cookies',
    intro: 'Cette page décrit les traceurs susceptibles d’être utilisés lorsque vous consultez notre site.',
    sections: [
      { title: 'Qu’est-ce qu’un cookie ?', paragraphs: ['Un cookie est un petit fichier enregistré par votre navigateur lors de la consultation d’un site. Il permet notamment de conserver une préférence ou de mesurer le fonctionnement d’une page.'] },
      { title: 'Cookies nécessaires', paragraphs: ['Certains éléments techniques peuvent être nécessaires au fonctionnement du site, à la navigation, à la sécurité et à l’accès aux espaces personnels. Ils ne servent pas à établir un profil publicitaire.'] },
      { title: 'Mesure d’audience', paragraphs: ['Si un outil de mesure d’audience est activé, son utilisation doit rester limitée à l’analyse du fonctionnement et de la fréquentation du site. Les données collectées sont utilisées pour améliorer le service.'] },
      { title: 'Gérer vos préférences', paragraphs: ['Vous pouvez à tout moment supprimer les cookies déjà enregistrés ou modifier les paramètres de votre navigateur pour les bloquer ou demander une confirmation avant leur dépôt.', 'Le blocage de certains cookies nécessaires peut toutefois affecter l’affichage ou le fonctionnement de fonctionnalités du site.'] },
      { title: 'Contact', paragraphs: ['Pour toute question concernant les cookies ou les données associées, contactez-nous à contact@notre-ecole.com.'] },
    ],
  },
}

function PolicyPage({ path }: { path: string }) {
  const policy = policyContent[path]
  return <><PageIntro eyebrow={policy.eyebrow} title={policy.title} text={policy.intro} />
    <section className="destination-section policy-section">
      <p className="policy-updated">Dernière mise à jour : septembre 2026</p>
      {policy.sections.map(section => <article className="policy-block" key={section.title}><h2>{section.title}</h2>{section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</article>)}
      <Link className="destination-button" to="/contact">Nous contacter<ArrowRight size={17} /></Link>
    </section>
  </>
}

export default function DestinationPage() {
  const { pathname } = useLocation()
  const title = pageTitles[pathname] ?? 'Page'
  const content = useMemo(() => {
    if (pathname === '/ecole') return <SchoolPage />
    if (pathname === '/formations') return <FormationsPage />
    if (pathname === '/vie-scolaire') return <SchoolLifePage />
    if (pathname === '/actualites') return <NewsPage />
    if (pathname === '/admissions') return <AdmissionPage />
    if (pathname === '/contact') return <ContactPage />
    if (policyContent[pathname]) return <PolicyPage path={pathname} />
    return <><PageIntro eyebrow="GESTION ÉCOLE" title={title} text="Cette page sera bientôt disponible." /><section className="destination-section"><Link className="destination-button" to="/">Retour à l’accueil<ArrowRight size={17} /></Link></section></>
  }, [pathname, title])
  return <div className="public-page"><PublicHeader /><main>{content}</main><Footer /></div>
}
