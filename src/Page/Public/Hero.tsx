import '../Css/Home.css'
import { useNavigate } from 'react-router-dom'
import Statistics from './Statitics'
import SchoolBanner from './SchoolBanner'
import Programs from './Programs'
import WhyChooseUs from './WhyChooseUs'
import NewsSection from './NewsSection'
import Testimonials from './Testimonials'

const Hero = () => {
  const navigate = useNavigate()

  return (
    <>
      <div className="relative flex flex-col-reverse py-16 lg:pt-0 lg:flex-col lg:pb-0">
        <div className="inset-y-0 top-0 right-0 z-0 w-full max-w-xl px-4 mx-auto md:px-0 lg:pr-0 lg:mb-0 lg:mx-0 lg:w-7/12 lg:max-w-full lg:absolute xl:px-0">
          <svg
            className="absolute left-0 hidden h-full text-white transform -translate-x-1/2 lg:block"
            viewBox="0 0 100 100"
            fill="currentColor"
            preserveAspectRatio="none slice"
          >
            <path d="M50 0H100L50 100H0L50 0Z" />
          </svg>
          <img
            className="object-cover w-full h-56 rounded shadow-lg lg:rounded-none lg:shadow-none md:h-96 lg:h-full"
            src="/Hero.png"
            alt="Présentation de l'école"
          />
        </div>
        <div className="relative flex flex-col items-start w-full max-w-xl px-4 mx-auto md:px-0 lg:px-8 lg:max-w-screen-xl">
          <div className="mb-16 lg:my-40 lg:max-w-lg lg:pr-5">
            <p className="inline-block px-3 py-px mb-4 text-xs font-semibold tracking-wider text-teal-900 uppercase rounded-full bg-teal-accent-400">
              Actualité
            </p>
            <h2 className="mb-5 font-sans text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl sm:leading-none">
              Bienvenu
              <br className="hidden md:block" />
              au sein de notre{' '}
              <span className="inline-block text-deep-purple-accent-400">
                college
              </span>
            </h2>
            <p className="pr-5 mb-5 text-base text-gray-700 md:text-lg">
              L&apos;excellence républicaine, l&apos;innovation pédagogique et
              l&apos;épanouissement individuel sont la devise de notre collège.
            </p>
            <div className="flex items-center">
              <button
                type="button"
                className="btn1 mr-6 cursor-pointer"
                onClick={() => navigate('/connexion')}
              >
                Accedez aux espaces
              </button>
              <button
                type="button"
                className="btn cursor-pointer"
                onClick={() => navigate('/admissions')}
              >
                Portes ouvertes 2026-2027
              </button>
            </div>
          </div>
        </div>
      </div>
      <Statistics />
      <SchoolBanner />
      <Programs />
      <WhyChooseUs />
      <NewsSection />
      <Testimonials />
    </>
  );
};

export default Hero