import { ProductCard } from './ProductCard'
import { EmptyState } from './EmptyState'
import { useI18n } from '../hooks/useI18n'

export function ProductGrid({ products }) {
  const { t } = useI18n()
  if (!products.length) return <EmptyState title={t.noResults} hint={t.noResultsHint} />

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-6 sm:gap-x-5 sm:gap-y-8">
      {products.map(p => <ProductCard key={p.id} product={p} />)}
    </div>
  )
}
