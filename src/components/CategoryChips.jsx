import { CATEGORIES } from '../data/products'
import { useI18n } from '../hooks/useI18n'

export function CategoryChips({ active, onChange }) {
  const { t } = useI18n()
  const label = (id) => id === 'all' ? t.all : t.categoriesList[id]

  return (
    <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 mt-6 scroll-mt-24">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-bold text-brand-700">{t.categories}</h3>
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
