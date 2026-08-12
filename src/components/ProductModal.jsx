import { useEffect, useState } from 'react'
import { COLORS } from '../data/products'
import { useProducts } from '../store/productsStore'
import { useI18n, fmtSom } from '../hooks/useI18n'
import { useUI } from '../store/uiStore'
import { useCart } from '../store/cartStore'
import { useFavorites } from '../store/favoritesStore'
import { SizeGuideModal } from './SizeGuideModal'
import { Reviews } from './Reviews'
import { SmartImg } from './SmartImg'
import { IconClose, IconHeart, IconBag } from './Icons'

export function ProductModal() {
  const { t, lang } = useI18n()
  const productId = useUI(s => s.productId)
  const close = useUI(s => s.closeProduct)
  const add = useCart(s => s.add)
  const toggleFav = useFavorites(s => s.toggle)
  const isFav = useFavorites(s => productId ? s.ids.includes(productId) : false)
  const showToast = useUI(s => s.showToast)

  const [imgIdx, setImgIdx] = useState(0)
  const [size, setSize] = useState(null)
  const [color, setColor] = useState(null)
  const [sizeGuide, setSizeGuide] = useState(false)

  const product = useProducts(s => productId ? s.items.find(p => p.id === productId) : null)

  useEffect(() => {
    if (product) {
      setImgIdx(0)
      setSize(product.availableSizes[0] || null)
      setColor(product.colors[0] || null)
    }
  }, [productId])

  useEffect(() => {
    if (productId) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [productId])

  if (!product) return null

  const colorMeta = (id) => COLORS.find(c => c.id === id)

  const onAdd = () => {
    if (!size) return
    add(product, { size, color })
    showToast(t.itemAdded)
    close()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50 animate-fade" onClick={close} />
      <div className="relative w-full sm:max-w-3xl bg-white rounded-t-3xl sm:rounded-3xl max-h-[92vh] overflow-y-auto animate-pop">
        <button
          onClick={close}
          className="sticky top-3 float-right mr-3 z-10 w-10 h-10 rounded-full bg-white shadow flex items-center justify-center hover:bg-brand-50"
          aria-label={t.close}
        >
          <IconClose />
        </button>

        <div className="grid sm:grid-cols-2 gap-0 sm:gap-6 p-4 sm:p-6">
          <div>
            <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-brand-50">
              <SmartImg src={product.images[imgIdx]} product={product} alt={product.name[lang]} className="w-full h-full object-cover" />
            </div>
            {product.images.length > 1 && (
              <div className="mt-3 flex gap-2">
                {product.images.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIdx(i)}
                    className={`w-16 h-20 rounded-lg overflow-hidden border-2 transition ${i === imgIdx ? 'border-brand-700' : 'border-transparent opacity-70'}`}
                  >
                    <SmartImg src={src} product={product} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 sm:pt-2">
            <div className="text-[11px] uppercase tracking-wider text-brand-400 font-semibold">{product.brand}</div>
            <h2 className="mt-1 text-xl sm:text-2xl font-bold leading-tight">{product.name[lang]}</h2>
            <div className="mt-3 flex items-baseline gap-3">
              <span className="text-2xl font-extrabold">{fmtSom(product.price)}</span>
              {product.oldPrice && <span className="text-sm text-brand-300 line-through">{fmtSom(product.oldPrice)}</span>}
            </div>

            {product.colors.length > 0 && (
              <div className="mt-5">
                <div className="label">{t.color}</div>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map(cid => {
                    const c = colorMeta(cid)
                    if (!c) return null
                    return (
                      <button
                        key={cid}
                        onClick={() => setColor(cid)}
                        title={c.name[lang]}
                        className={`w-9 h-9 rounded-full border-2 transition ${color === cid ? 'border-brand-700 scale-110' : 'border-brand-100'}`}
                        style={{ backgroundColor: c.hex }}
                      />
                    )
                  })}
                </div>
              </div>
            )}

            <div className="mt-5">
              <div className="flex items-center justify-between">
                <div className="label !mb-0">{t.size}</div>
                <button onClick={() => setSizeGuide(true)} className="text-xs font-semibold text-brand-500 underline">{t.sizeGuide}</button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.sizes.map(s => {
                  const disabled = !product.availableSizes.includes(s)
                  return (
                    <button
                      key={s}
                      disabled={disabled}
                      onClick={() => setSize(s)}
                      className={`min-w-12 h-11 px-3 rounded-lg text-sm font-semibold border transition relative
                        ${disabled ? 'text-brand-200 border-brand-100 line-through cursor-not-allowed' :
                          size === s ? 'bg-brand-700 text-white border-brand-700' : 'border-brand-200 hover:border-brand-700'}`}
                    >{s}</button>
                  )
                })}
              </div>
              {product.availableSizes.length === 0 && (
                <div className="mt-2 text-xs text-red-500 font-medium">{t.outOfStock}</div>
              )}
            </div>

            <div className="mt-6">
              <div className="label">{t.description}</div>
              <p className="text-sm text-brand-500 leading-relaxed">{product.description[lang]}</p>
            </div>

            <div className="mt-4">
              <div className="label">{t.composition}</div>
              <p className="text-sm text-brand-500">{product.composition[lang]}</p>
            </div>

            <Reviews productId={product.id} />

            <div className="mt-6 flex gap-2">
              <button
                onClick={onAdd}
                disabled={!size || product.availableSizes.length === 0}
                className="btn-primary flex-1 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <IconBag /> {t.addToCart}
              </button>
              <button
                onClick={() => toggleFav(product.id)}
                className={`btn-outline !px-4 ${isFav ? '!text-brand-700 !border-brand-700' : ''}`}
                aria-label={t.favorites}
              >
                <IconHeart filled={isFav} />
              </button>
            </div>
          </div>
        </div>

        <SizeGuideModal open={sizeGuide} onClose={() => setSizeGuide(false)} />
      </div>
    </div>
  )
}
