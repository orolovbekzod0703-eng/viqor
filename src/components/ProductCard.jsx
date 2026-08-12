import { useFavorites } from '../store/favoritesStore'
import { useCart } from '../store/cartStore'
import { useUI } from '../store/uiStore'
import { useI18n, fmtSom } from '../hooks/useI18n'
import { IconHeart, IconBag } from './Icons'

export function ProductCard({ product }) {
  const { t, lang } = useI18n()
  const has = useFavorites(s => s.ids.includes(product.id))
  const toggleFav = useFavorites(s => s.toggle)
  const add = useCart(s => s.add)
  const openProduct = useUI(s => s.openProduct)
  const showToast = useUI(s => s.showToast)

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

  return (
    <div
      onClick={() => openProduct(product.id)}
      className="group cursor-pointer flex flex-col"
    >
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-brand-50">
        <img
          src={product.images[0]}
          alt={product.name[lang]}
          className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {discount > 0 && (
          <div className="absolute top-3 left-3 bg-brand-700 text-white text-xs font-bold px-2.5 py-1 rounded-full">−{discount}%</div>
        )}
        <button
          aria-label={t.favorites}
          onClick={(e) => { e.stopPropagation(); toggleFav(product.id) }}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center transition hover:scale-110 ${has ? 'text-brand-700' : 'text-brand-400'}`}
        >
          <IconHeart filled={has} />
        </button>
      </div>

      <div className="mt-3 flex-1 flex flex-col">
        <div className="text-[11px] uppercase tracking-wider text-brand-400 font-semibold">{product.brand}</div>
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
