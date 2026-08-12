import { useEffect, useState } from 'react'
import { useI18n, fmtSom } from '../hooks/useI18n'
import { useUI } from '../store/uiStore'
import { useCart } from '../store/cartStore'
import { submitOrder, fetchProfile } from '../supabase'
import { useAuth } from '../hooks/useAuth'
import { AddressMap } from './AddressMap'
import { PhoneInput } from './PhoneInput'
import { IconCheck, IconClose, IconStore, IconTruck } from './Icons'

const STEPS = 5

export function CheckoutModal() {
  const { t, lang } = useI18n()
  const open = useUI(s => s.checkoutOpen)
  const setOpen = useUI(s => s.setCheckoutOpen)
  const setOrderId = useUI(s => s.setOrderId)
  const items = useCart(s => s.items)
  const total = useCart(s => s.total())
  const clear = useCart(s => s.clear)

  const [step, setStep] = useState(1)
  const [busy, setBusy] = useState(false)
  const { user } = useAuth()
  const [form, setForm] = useState({
    method: 'delivery',
    city: '',
    street: '',
    location: null,
    name: '',
    phone: '',
    payment: 'payme',
    note: ''
  })

  useEffect(() => {
    if (open && user) {
      fetchProfile().then(p => {
        if (p) setForm(f => ({ ...f, name: f.name || p.name || '', phone: f.phone || p.phone || '' }))
      })
    }
  }, [open, user])

  useEffect(() => {
    if (open) { setStep(1); setBusy(false) }
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null
  if (items.length === 0) { setOpen(false); return null }

  const set = (patch) => setForm({ ...form, ...patch })

  const canNext = () => {
    if (step === 1) return true
    if (step === 2) return form.method === 'pickup' || (form.city.trim() && form.street.trim())
    if (step === 3) return form.name.trim() && form.phone.trim().length >= 7
    if (step === 4) return true
    return true
  }

  const next = () => setStep(Math.min(STEPS, step + 1))
  const back = () => setStep(Math.max(1, step - 1))

  const submit = async () => {
    setBusy(true)
    try {
      const payload = {
        items: items.map(i => ({
          productId: i.productId, name: i.name, brand: i.brand,
          price: i.price, qty: i.qty, size: i.size, color: i.color
        })),
        total,
        currency: 'UZS',
        customer: { name: form.name, phone: form.phone },
        delivery: form.method === 'delivery'
          ? { city: form.city, street: form.street, location: form.location || null }
          : { pickup: true },
        payment: form.payment,
        note: form.note,
        lang
      }
      const id = await submitOrder(payload)
      setOrderId(id)
      clear()
      setOpen(false)
    } catch (e) {
      console.error(e)
      alert('Xatolik / Ошибка: ' + e.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50 animate-fade" onClick={() => setOpen(false)} />
      <div className="relative w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col animate-pop">
        <div className="flex items-center justify-between px-5 py-4 border-b border-brand-100">
          <div>
            <h3 className="font-bold">{t.checkout}</h3>
            <div className="text-xs text-brand-400">{t.step} {step} {t.of} {STEPS}</div>
          </div>
          <button onClick={() => setOpen(false)} className="w-9 h-9 rounded-full hover:bg-brand-50 flex items-center justify-center"><IconClose /></button>
        </div>

        <div className="px-5 pt-3">
          <div className="h-1 bg-brand-100 rounded-full overflow-hidden">
            <div className="h-full bg-brand-700 transition-all" style={{ width: `${(step / STEPS) * 100}%` }} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {step === 1 && (
            <div className="space-y-3">
              <div className="label">{t.deliveryOrPickup}</div>
              <div className="grid grid-cols-2 gap-3">
                <MethodCard active={form.method === 'delivery'} onClick={() => set({ method: 'delivery' })} icon={<IconTruck />} label={t.delivery} />
                <MethodCard active={form.method === 'pickup'} onClick={() => set({ method: 'pickup' })} icon={<IconStore />} label={t.pickup} />
              </div>
            </div>
          )}

          {step === 2 && (
            form.method === 'delivery' ? (
              <div className="space-y-3">
                <div>
                  <div className="label">{t.city}</div>
                  <input className="input" value={form.city} onChange={e => set({ city: e.target.value })} placeholder="Olmaliq" />
                </div>
                <div>
                  <div className="label">{t.street}</div>
                  <input className="input" value={form.street} onChange={e => set({ street: e.target.value })} />
                </div>
                <div>
                  <div className="label">{lang === 'uz' ? 'Xaritada nuqta tanlang' : 'Отметьте точку на карте'}</div>
                  <AddressMap value={form.location} onChange={(loc) => set({ location: loc })} />
                  {form.location && (
                    <div className="mt-1.5 text-xs text-brand-400">
                      {form.location.lat.toFixed(5)}, {form.location.lng.toFixed(5)}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-sm text-brand-500">
                {lang === 'uz'
                  ? "Buyurtmangizni do'kondan olib ketishingiz mumkin. Manzil operator tomonidan yuboriladi."
                  : 'Вы можете забрать заказ из магазина. Адрес будет отправлен оператором.'}
              </div>
            )
          )}

          {step === 3 && (
            <div className="space-y-3">
              <div>
                <div className="label">{t.name}</div>
                <input className="input" value={form.name} onChange={e => set({ name: e.target.value })} />
              </div>
              <div>
                <div className="label">{t.phone}</div>
                <PhoneInput value={form.phone} onChange={(v) => set({ phone: v })} />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-2">
              <div className="label">{t.payment}</div>
              {['payme', 'click', 'uzum', 'cash'].map(p => (
                <label key={p} className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition ${form.payment === p ? 'border-brand-700 bg-brand-50' : 'border-brand-100 hover:border-brand-300'}`}>
                  <div className="flex items-center gap-3">
                    <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${form.payment === p ? 'border-brand-700' : 'border-brand-200'}`}>
                      {form.payment === p && <span className="w-2 h-2 bg-brand-700 rounded-full" />}
                    </span>
                    <span className="font-semibold text-sm">{t[p]}</span>
                  </div>
                  <input type="radio" name="pay" checked={form.payment === p} onChange={() => set({ payment: p })} className="hidden" />
                </label>
              ))}
              <div className="pt-3">
                <div className="label">{t.note}</div>
                <textarea rows="3" className="input resize-none" value={form.note} onChange={e => set({ note: e.target.value })} />
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <div className="text-sm text-brand-500">
                {lang === 'uz' ? "Buyurtma tafsilotlari" : 'Детали заказа'}
              </div>
              <div className="card p-4 border border-brand-100 text-sm space-y-1.5">
                <Row k={t.deliveryOrPickup} v={form.method === 'delivery' ? t.delivery : t.pickup} />
                {form.method === 'delivery' && <Row k={t.address} v={`${form.city}, ${form.street}`} />}
                <Row k={t.name} v={form.name} />
                <Row k={t.phone} v={form.phone} />
                <Row k={t.payment} v={t[form.payment]} />
                {form.note && <Row k={t.note} v={form.note} />}
              </div>
              <div className="card p-4 border border-brand-100 text-sm">
                <div className="space-y-1.5">
                  {items.map(i => (
                    <div key={i.key} className="flex justify-between gap-2">
                      <span className="truncate">{i.name[lang]} {i.size && `· ${i.size}`} × {i.qty}</span>
                      <span className="font-semibold shrink-0">{fmtSom(i.price * i.qty)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-brand-100 flex justify-between font-bold">
                  <span>{t.total}</span>
                  <span>{fmtSom(total)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-brand-100 px-5 py-4 flex gap-2">
          {step > 1 && <button onClick={back} className="btn-outline flex-1">{t.back}</button>}
          {step < STEPS && (
            <button onClick={next} disabled={!canNext()} className="btn-primary flex-1 disabled:opacity-40">{t.next}</button>
          )}
          {step === STEPS && (
            <button onClick={submit} disabled={busy} className="btn-primary flex-1 disabled:opacity-60">
              <IconCheck /> {busy ? '...' : t.confirmOrder}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function MethodCard({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition ${active ? 'border-brand-700 bg-brand-50 text-brand-700' : 'border-brand-100 hover:border-brand-300 text-brand-500'}`}
    >
      {icon}
      <span className="text-sm font-semibold">{label}</span>
    </button>
  )
}
function Row({ k, v }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-brand-400">{k}</span>
      <span className="font-semibold text-right">{v}</span>
    </div>
  )
}
