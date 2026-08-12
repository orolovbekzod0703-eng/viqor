import { useEffect, useMemo, useRef, useState } from 'react'
import { useProducts } from '../store/productsStore'
import { useUI } from '../store/uiStore'
import { fmtSom, useI18n } from '../hooks/useI18n'
import { IconSearch } from './Icons'

export function SearchAutocomplete({ value, onChange, placeholder }) {
  const { lang } = useI18n()
  const items = useProducts(s => s.items)
  const openProduct = useUI(s => s.openProduct)
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const suggestions = useMemo(() => {
    const q = value.trim().toLowerCase()
    if (!q) return []
    return items.filter(p => {
      const hay = [p.name.uz, p.name.ru, p.brand].join(' ').toLowerCase()
      return hay.includes(q)
    }).slice(0, 6)
  }, [items, value])

  const pick = (p) => {
    setOpen(false); onChange('')
    openProduct(p.id)
  }

  return (
    <div ref={ref} className="relative w-full">
      <IconSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-400 pointer-events-none" />
      <input
        value={value}
        onChange={e => { onChange(e.target.value); setOpen(true) }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        className="w-full h-11 pl-11 pr-4 rounded-full bg-brand-50 border border-transparent text-sm outline-none focus:bg-white focus:border-brand-200 transition"
      />

      {open && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-lg border border-brand-100 overflow-hidden z-50 animate-pop">
          {suggestions.map(p => (
            <button
              key={p.id}
              onClick={() => pick(p)}
              className="flex items-center gap-3 w-full px-3 py-2.5 hover:bg-brand-50 text-left transition"
            >
              <div className="w-10 h-12 rounded-lg overflow-hidden bg-brand-50 shrink-0">
                {p.images?.[0] && <img src={p.images[0]} alt="" className="w-full h-full object-cover" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs text-brand-400 uppercase tracking-wide font-semibold">{p.brand}</div>
                <div className="text-sm font-semibold truncate">{p.name[lang]}</div>
              </div>
              <div className="text-sm font-bold whitespace-nowrap">{fmtSom(p.price)}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
