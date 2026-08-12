import { useI18n } from '../hooks/useI18n'
import { useUI } from '../store/uiStore'
import { IconCheck } from './Icons'

export function OrderSuccess() {
  const { t } = useI18n()
  const orderId = useUI(s => s.orderId)
  const setOrderId = useUI(s => s.setOrderId)

  if (!orderId) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50 animate-fade" onClick={() => setOrderId(null)} />
      <div className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-8 text-center animate-pop">
        <div className="w-16 h-16 mx-auto rounded-full bg-brand-700 text-white flex items-center justify-center">
          <IconCheck />
        </div>
        <h2 className="mt-4 text-xl font-extrabold">{t.orderSuccess}</h2>
        <p className="mt-1 text-sm text-brand-400">{t.successHint}</p>
        <div className="mt-6 card border border-brand-100 p-4 text-left">
          <div className="text-xs uppercase tracking-wider text-brand-400 font-semibold">{t.orderNumber}</div>
          <div className="mt-1 font-mono font-bold text-brand-700 break-all">{orderId}</div>
          <div className="mt-3 flex items-center gap-2 text-sm">
            <span className="text-brand-400">{t.orderStatus}:</span>
            <span className="inline-flex items-center gap-1.5 bg-brand-50 text-brand-700 font-semibold px-2.5 py-1 rounded-full text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-700" /> {t.statusNew}
            </span>
          </div>
        </div>
        <button onClick={() => setOrderId(null)} className="btn-primary w-full mt-6">{t.close}</button>
      </div>
    </div>
  )
}
