import { useFavorites } from '../store/favoritesStore'
import { useCart } from '../store/cartStore'
import { useUI } from '../store/uiStore'
import { useI18n, fmtSom } from '../hooks/useI18n'
import { IconHeart, IconBag } from './Icons'
import { labelMeta } from '../data/labels'
import { useRatings } from '../store/ratingsStore'
import { SmartImg } from './SmartImg'

export function ProductCard({ product }) {
  const { t, lang } = useI18n()
  const has = useFavorites(s => s.ids.includes(product.id))
  const toggleFav = useFavorites(s => s.toggle)
  const add = useCart(s => s.add)
  const openProduct = useUI(s => s.openProduct)
  const showToast = useUI(s => s.showToast)
  const rating = useRatings(s => s.map[product.id])

  const discount = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : 0

  const canQuickAdd = product.availableSizes.length === 1 && product.colors.length === 1

  const onAdd = (e) => {
    e.stopPropagation()
    if (canQuickAdd) {
      add(product, { size: product.availableSizes[0], color: product.colors[0] })
      showToast(t.itemAdded)
    } else {
      openProduct(product.id)
    }
  }

  const labels = (product.labels || []).map(labelMeta).filter(Boolean)

  return (
    <div
      onClick={() => openProduct(product.id)}
      className="group cursor-pointer flex flex-col"
    >
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-brand-50">
        <SmartImg
          src={product.images[0]}
          product={product}
          alt={product.name[lang]}
          className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
        />

        <div className="absolute top-3 left-3 flex flex-col items-start gap-1.5">
          {discount > 0 && (
            <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">−{discount}%</span>
          )}
          {labels.map(l => (
            <span key={l.id} className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${l.classes}`}>
              {l.name[lang]}
            </span>
          ))}
        </div>

        <button
          aria-label={t.favorites}
          onClick={(e) => { e.stopPropagation(); toggleFav(product.id) }}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center transition hover:scale-110 ${has ? 'text-brand-700' : 'text-brand-400'}`}
        >
          <IconHeart filled={has} />
        </button>
      </div>

      <div className="mt-3 flex-1 flex flex-col">
        <div className="flex items-center justify-between gap-2">
          <div className="text-[11px] uppercase tracking-wider text-brand-400 font-semibold">{product.brand}</div>
          {rating?.count > 0 && (
            <div className="flex items-center gap-0.5 text-xs text-brand-400 font-semibold">
              <Star /> {rating.avg?.toFixed(1)} <span className="text-brand-300">({rating.count})</span>
            </div>
          )}
        </div>
        <div className="mt-0.5 font-semibold text-sm sm:text-[15px] leading-snug line-clamp-2">{product.name[lang]}</div>
        <div className="mt-1.5 flex items-baseline gap-2">
          <span className="font-bold">{fmtSom(product.price)}</span>
          {product.oldPrice && (
            <span className="text-xs text-brand-300 line-through">{fmtSom(product.oldPrice)}</span>
          )}
        </div>
        <button
          onClick={onAdd}
          className="mt-3 w-full flex items-center justify-center gap-2 rounded-full border border-brand-200 hover:border-brand-700 py-2.5 text-sm font-semibold transition"
        >
          <IconBag /> {t.addToCart}
        </button>
      </div>
    </div>
  )
}

function Star() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B" strokeWidth="1">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77 5.82 21l1.18-6.88-5-4.87 6.91-1.01L12 2z" />
    </svg>
  )
}
