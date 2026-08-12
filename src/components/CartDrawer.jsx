import { useEffect } from 'react'
import { useCart } from '../store/cartStore'
import { useUI } from '../store/uiStore'
import { useI18n, fmtSom } from '../hooks/useI18n'
import { EmptyState } from './EmptyState'
import { IconBag, IconClose, IconMinus, IconPlus, IconTrash } from './Icons'

export function CartDrawer() {
  const { t } = useI18n()
  const open = useUI(s => s.cartOpen)
  const setOpen = useUI(s => s.setCartOpen)
  const setCheckout = useUI(s => s.setCheckoutOpen)
  const items = useCart(s => s.items)
  const setQty = useCart(s => s.setQty)
  const remove = useCart(s => s.remove)
  const total = useCart(s => s.total())

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-40">
      <div className="absolute inset-0 bg-black/50 animate-fade" onClick={() => setOpen(false)} />
      <div className="absolute right-0 top-0 bottom-0 w-full sm:max-w-md bg-white shadow-2xl flex flex-col animate-drawer">
        <div className="flex items-center justify-between px-5 py-4 border-b border-brand-100">
          <h3 className="font-bold text-lg flex items-center gap-2"><IconBag /> {t.cart}</h3>
          <button onClick={() => setOpen(false)} className="w-9 h-9 rounded-full hover:bg-brand-50 flex items-center justify-center"><IconClose /></button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center px-5">
            <EmptyState
              title={t.emptyCart}
              hint={t.emptyCartHint}
              icon={<IconBag />}
              action={<button onClick={() => setOpen(false)} className="btn-primary">{t.continueShopping}</button>}
            />
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {items.map(i => (
                <div key={i.key} className="flex gap-3">
                  <div className="w-20 h-24 rounded-lg overflow-hidden bg-brand-50 shrink-0">
                    <img src={i.image} alt={i.name.uz} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] uppercase tracking-wider text-brand-400 font-semibold">{i.brand}</div>
                    <div className="font-semibold text-sm leading-snug line-clamp-2">{i.name.uz}</div>
                    <div className="mt-1 text-xs text-brand-400 flex gap-2">
                      {i.size && <span>{t.size}: <b className="text-brand-700">{i.size}</b></span>}
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="inline-flex items-center border border-brand-100 rounded-full">
                        <button onClick={() => setQty(i.key, i.qty - 1)} className="w-8 h-8 flex items-center justify-center hover:bg-brand-50 rounded-l-full"><IconMinus /></button>
                        <span className="min-w-8 text-center text-sm font-semibold">{i.qty}</span>
                        <button onClick={() => setQty(i.key, i.qty + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-brand-50 rounded-r-full"><IconPlus /></button>
                      </div>
                      <div className="font-bold text-sm">{fmtSom(i.price * i.qty)}</div>
                    </div>
                  </div>
                  <button onClick={() => remove(i.key)} aria-label="remove" className="w-8 h-8 text-brand-300 hover:text-brand-700 flex items-center justify-center"><IconTrash /></button>
                </div>
              ))}
            </div>

            <div className="border-t border-brand-100 px-5 py-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-brand-400">{t.subtotal}</span>
                <span className="font-extrabold text-lg">{fmtSom(total)}</span>
              </div>
              <button
                onClick={() => { setOpen(false); setCheckout(true) }}
                className="btn-primary w-full"
              >
                {t.checkout}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
