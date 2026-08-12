import { useEffect } from 'react'
import { useFavorites } from '../store/favoritesStore'
import { useUI } from '../store/uiStore'
import { useI18n, fmtSom } from '../hooks/useI18n'
import { useProducts } from '../store/productsStore'
import { EmptyState } from './EmptyState'
import { IconClose, IconHeart, IconTrash } from './Icons'

export function FavoritesDrawer() {
  const { t, lang } = useI18n()
  const open = useUI(s => s.favoritesOpen)
  const setOpen = useUI(s => s.setFavoritesOpen)
  const openProduct = useUI(s => s.openProduct)
  const ids = useFavorites(s => s.ids)
  const toggle = useFavorites(s => s.toggle)
  const allProducts = useProducts(s => s.items)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  const items = ids.map(id => allProducts.find(p => p.id === id)).filter(Boolean)

  return (
    <div className="fixed inset-0 z-40">
      <div className="absolute inset-0 bg-black/50 animate-fade" onClick={() => setOpen(false)} />
      <div className="absolute right-0 top-0 bottom-0 w-full sm:max-w-md bg-white shadow-2xl flex flex-col animate-drawer">
        <div className="flex items-center justify-between px-5 py-4 border-b border-brand-100">
          <h3 className="font-bold text-lg flex items-center gap-2"><IconHeart /> {t.favorites}</h3>
          <button onClick={() => setOpen(false)} className="w-9 h-9 rounded-full hover:bg-brand-50 flex items-center justify-center"><IconClose /></button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center px-5">
            <EmptyState
              title={t.favorites}
              hint={t.emptyCartHint}
              icon={<IconHeart />}
              action={<button onClick={() => setOpen(false)} className="btn-primary">{t.continueShopping}</button>}
            />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
            {items.map(p => (
              <div key={p.id} className="flex gap-3 items-center">
                <button onClick={() => { setOpen(false); openProduct(p.id) }} className="w-20 h-24 rounded-lg overflow-hidden bg-brand-50 shrink-0">
                  <img src={p.images[0]} alt={p.name[lang]} className="w-full h-full object-cover" />
                </button>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] uppercase tracking-wider text-brand-400 font-semibold">{p.brand}</div>
                  <button onClick={() => { setOpen(false); openProduct(p.id) }} className="text-left font-semibold text-sm leading-snug line-clamp-2 hover:underline">{p.name[lang]}</button>
                  <div className="mt-1 font-bold text-sm">{fmtSom(p.price)}</div>
                </div>
                <button onClick={() => toggle(p.id)} aria-label="remove" className="w-8 h-8 text-brand-300 hover:text-brand-700 flex items-center justify-center"><IconTrash /></button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
