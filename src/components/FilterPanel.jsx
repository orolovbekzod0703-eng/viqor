import { useMemo, useState } from 'react'
import { BRANDS, COLORS, PRODUCTS } from '../data/products'
import { useI18n } from '../hooks/useI18n'
import { IconFilter, IconClose } from './Icons'

const ALL_SIZES = Array.from(new Set(PRODUCTS.flatMap(p => p.sizes)))
  .sort((a, b) => {
    const na = parseInt(a), nb = parseInt(b)
    if (!isNaN(na) && !isNaN(nb)) return na - nb
    const order = ['One', 'S', 'M', 'L', 'XL', 'XXL']
    return order.indexOf(a) - order.indexOf(b)
  })

export function FilterPanel({ filters, setFilters }) {
  const { t, lang } = useI18n()
  const [open, setOpen] = useState(false)

  const priceMax = useMemo(() => Math.max(...PRODUCTS.map(p => p.price)), [])

  const update = (patch) => setFilters({ ...filters, ...patch })
  const reset = () => setFilters({ sizes: [], colors: [], brands: [], min: '', max: '' })

  const toggleIn = (arr, val) => arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]

  const activeCount =
    filters.sizes.length + filters.colors.length + filters.brands.length +
    (filters.min ? 1 : 0) + (filters.max ? 1 : 0)

  const body = (
    <div className="space-y-6">
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

      <div className="flex gap-2 pt-1">
        <button onClick={reset} className="btn-outline flex-1">{t.reset}</button>
        <button onClick={() => setOpen(false)} className="btn-primary flex-1 lg:hidden">{t.apply}</button>
      </div>
    </div>
  )

  return (
    <>
      <div className="lg:hidden sticky top-16 z-20 bg-white/95 backdrop-blur border-b border-brand-100">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
          <button onClick={() => setOpen(true)} className="btn-outline !py-2 !px-4">
            <IconFilter /> {t.filters}
            {activeCount > 0 && <span className="ml-1 bg-brand-700 text-white text-xs rounded-full min-w-5 h-5 px-1.5 flex items-center justify-center">{activeCount}</span>}
          </button>
        </div>
      </div>

      <aside className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-24 card p-5 border border-brand-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">{t.filters}</h3>
          </div>
          {body}
        </div>
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40 animate-fade" onClick={() => setOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 bg-white rounded-t-2xl max-h-[85vh] overflow-y-auto animate-drawer">
            <div className="sticky top-0 bg-white border-b border-brand-100 px-5 py-4 flex items-center justify-between">
              <h3 className="font-bold">{t.filters}</h3>
              <button onClick={() => setOpen(false)} className="w-9 h-9 rounded-full hover:bg-brand-50 flex items-center justify-center"><IconClose /></button>
            </div>
            <div className="p-5 pb-8">{body}</div>
          </div>
        </div>
      )}
    </>
  )
}
