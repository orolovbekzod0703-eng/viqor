import { CATEGORIES } from '../data/products'
import { useI18n } from '../hooks/useI18n'
import { IconFilter } from './Icons'

export function CategoryChips({ active, onChange, onFilterClick, activeFilterCount = 0 }) {
  const { t } = useI18n()
  const label = (id) => id === 'all' ? t.all : t.categoriesList[id]

  return (
    <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 mt-6 scroll-mt-24">
      <div className="flex items-center justify-between mb-3 gap-3">
        <h3 className="text-base font-bold text-brand-700">{t.categories}</h3>

        <button
          onClick={onFilterClick}
          className="relative inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-brand-200 text-sm font-semibold text-brand-700 hover:border-brand-700 transition"
        >
          <IconFilter /> {t.filters}
          {activeFilterCount > 0 && (
            <span className="ml-0.5 bg-brand-700 text-white text-[10px] font-bold min-w-5 h-5 px-1 rounded-full flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4">
        {CATEGORIES.map(c => (
          <button
            key={c.id}
            onClick={() => onChange(c.id)}
            className={`chip ${active === c.id ? 'chip-active' : 'chip-idle'}`}
          >
            {label(c.id)}
          </button>
        ))}
      </div>
    </section>
  )
}
