import { useEffect, useMemo } from 'react'
import { BRANDS, COLORS, PRODUCTS } from '../data/products'
import { useI18n } from '../hooks/useI18n'
import { IconClose } from './Icons'

const ALL_SIZES = Array.from(new Set(PRODUCTS.flatMap(p => p.sizes)))
  .sort((a, b) => {
    const na = parseInt(a), nb = parseInt(b)
    if (!isNaN(na) && !isNaN(nb)) return na - nb
    const order = ['One', 'S', 'M', 'L', 'XL', 'XXL']
    return order.indexOf(a) - order.indexOf(b)
  })

export function countActiveFilters(f) {
  if (!f) return 0
  return (f.sizes?.length || 0) + (f.colors?.length || 0) + (f.brands?.length || 0) +
    (f.min ? 1 : 0) + (f.max ? 1 : 0)
}

export function FilterPanel({ open, onClose, filters, setFilters }) {
  const { t, lang } = useI18n()

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [open])

  const priceMax = useMemo(() => Math.max(...PRODUCTS.map(p => p.price)), [])

  if (!open) return null

  const update = (patch) => setFilters({ ...filters, ...patch })
  const reset = () => setFilters({ sizes: [], colors: [], brands: [], min: '', max: '' })
  const toggleIn = (arr, val) => arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50 animate-fade" onClick={onClose} />
      <div className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col animate-pop">
        <div className="flex items-center justify-between px-5 py-4 border-b border-brand-100">
          <h3 className="font-bold text-lg">{t.filters}</h3>
          <button onClick={onClose} className="w-9 h-9 rounded-full hover:bg-brand-50 flex items-center justify-center"><IconClose /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          <div>
            <div className="label">{t.size}</div>
            <div className="flex flex-wrap gap-2">
              {ALL_SIZES.map(s => (
                <button
                  key={s}
                  onClick={() => update({ sizes: toggleIn(filters.sizes, s) })}
                  className={`px-3 min-w-11 h-9 rounded-lg border text-sm font-medium transition ${
                    filters.sizes.includes(s) ? 'bg-brand-700 text-white border-brand-700' : 'border-brand-100 hover:border-brand-400'
                  }`}
                >{s}</button>
              ))}
            </div>
          </div>

          <div>
            <div className="label">{t.color}</div>
            <div className="flex flex-wrap gap-2">
              {COLORS.map(c => (
                <button
                  key={c.id}
                  onClick={() => update({ colors: toggleIn(filters.colors, c.id) })}
                  title={c.name[lang]}
                  className={`w-8 h-8 rounded-full border-2 transition ${
                    filters.colors.includes(c.id) ? 'border-brand-700 scale-110' : 'border-brand-100'
                  }`}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
          </div>

          <div>
            <div className="label">{t.brandField}</div>
            <div className="space-y-2">
              {BRANDS.map(b => (
                <label key={b} className="flex items-center gap-2.5 cursor-pointer text-sm">
                  <input
                    type="checkbox"
                    checked={filters.brands.includes(b)}
                    onChange={() => update({ brands: toggleIn(filters.brands, b) })}
                    className="w-4 h-4 accent-brand-700"
                  />
                  <span>{b}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <div className="label">{t.price} (so'm)</div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number" inputMode="numeric" placeholder={t.from}
                value={filters.min} onChange={e => update({ min: e.target.value })}
                className="input"
              />
              <input
                type="number" inputMode="numeric" placeholder={t.to}
                value={filters.max} onChange={e => update({ max: e.target.value })}
                className="input"
              />
            </div>
            <div className="text-xs text-brand-400 mt-1.5">Max: {new Intl.NumberFormat('ru-RU').format(priceMax)}</div>
          </div>
        </div>

        <div className="border-t border-brand-100 px-5 py-4 flex gap-2">
          <button onClick={reset} className="btn-outline flex-1">{t.reset}</button>
          <button onClick={onClose} className="btn-primary flex-1">{t.apply}</button>
        </div>
      </div>
    </div>
  )
}
