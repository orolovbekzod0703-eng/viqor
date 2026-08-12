import { useEffect, useState } from 'react'
import { useI18n } from '../hooks/useI18n'
import { IconClose } from './Icons'

// Aksiya tugash sanasini bu yerda o'zgartiring.
// Misol: 2026-yil 31-avgust, 23:59
const PROMO_END = new Date('2026-08-31T23:59:00+05:00').getTime()

const STORAGE_KEY = 'viqor-promo-closed'

export function PromoBanner() {
  const { lang } = useI18n()
  const [now, setNow] = useState(Date.now())
  const [closed, setClosed] = useState(() => localStorage.getItem(STORAGE_KEY) === '1')

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const diff = PROMO_END - now
  if (diff <= 0 || closed) return null

  const d = Math.floor(diff / (1000 * 60 * 60 * 24))
  const h = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const m = Math.floor((diff / (1000 * 60)) % 60)
  const s = Math.floor((diff / 1000) % 60)

  const close = () => { setClosed(true); localStorage.setItem(STORAGE_KEY, '1') }

  return (
    <div className="bg-gradient-to-r from-brand-700 to-brand-500 text-white text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-11 flex items-center gap-3">
        <div className="flex-1 min-w-0 flex items-center gap-2 sm:gap-3 overflow-hidden">
          <span className="hidden sm:inline text-lg leading-none">🔥</span>
          <span className="font-semibold truncate">
            {lang === 'uz' ? '−30% kuz kolleksiyasi. Aksiya tugashiga:' : '−30% на осеннюю коллекцию. До конца акции:'}
          </span>
          <Ticker d={d} h={h} m={m} s={s} />
        </div>
        <button onClick={close} aria-label="close" className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center shrink-0">
          <IconClose />
        </button>
      </div>
    </div>
  )
}

function Ticker({ d, h, m, s }) {
  const cell = (v, l) => (
    <span className="inline-flex items-center gap-1">
      <span className="bg-white/20 rounded-md px-1.5 py-0.5 font-bold tabular-nums min-w-7 text-center">{String(v).padStart(2, '0')}</span>
      <span className="text-[10px] uppercase opacity-80">{l}</span>
    </span>
  )
  return (
    <span className="inline-flex items-center gap-1.5 shrink-0">
      {cell(d, 'k')}{cell(h, 's')}{cell(m, 'd')}<span className="hidden sm:inline">{cell(s, 's')}</span>
    </span>
  )
}
