import { useEffect, useState } from 'react'
import { useI18n } from '../hooks/useI18n'

export function HeroSlider() {
  const { t } = useI18n()
  const slides = [
    { title: t.heroTitle1, sub: t.heroSub1, bg: 'from-brand-700 to-brand-500', img: 'https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=1200&q=80' },
    { title: t.heroTitle2, sub: t.heroSub2, bg: 'from-brand-800 to-brand-600', img: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1200&q=80' },
    { title: t.heroTitle3, sub: t.heroSub3, bg: 'from-brand-600 to-brand-400', img: 'https://images.unsplash.com/photo-1594938291221-94f18cbb5660?auto=format&fit=crop&w=1200&q=80' }
  ]

  const [i, setI] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setI(v => (v + 1) % slides.length), 5000)
    return () => clearInterval(id)
  }, [slides.length])

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6">
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-soft isolate">
        <div
          className="flex transition-transform duration-700 ease-out will-change-transform"
          style={{ transform: `translate3d(-${i * 100}%, 0, 0)` }}
        >
          {slides.map((s, idx) => (
            <div key={idx} className="w-full shrink-0 relative">
              <div className={`h-52 sm:h-72 md:h-96 bg-gradient-to-r ${s.bg} relative overflow-hidden`}>
                <img src={s.img} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay" />
                <div className="relative z-10 h-full flex flex-col justify-center px-6 sm:px-12 text-white max-w-lg">
                  <div className="uppercase text-[11px] tracking-[.25em] opacity-80">Viqor</div>
                  <h2 className="mt-2 text-2xl sm:text-4xl md:text-5xl font-extrabold leading-tight">{s.title}</h2>
                  <p className="mt-2 sm:mt-3 text-sm sm:text-base opacity-90">{s.sub}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setI(idx)}
              className={`h-1.5 rounded-full transition-all ${i === idx ? 'w-6 bg-white' : 'w-1.5 bg-white/50'}`}
              aria-label={`slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
