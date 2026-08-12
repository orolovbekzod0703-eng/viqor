import { useEffect, useState } from 'react'
import { fetchOrders, updateOrderStatus } from '../../supabase'
import { fmtSom } from '../../hooks/useI18n'

const STATUSES = [
  { id: 'all',        label: 'Hammasi', color: 'bg-brand-50 text-brand-700' },
  { id: 'new',        label: 'Yangi', color: 'bg-blue-50 text-blue-700' },
  { id: 'processing', label: 'Tayyorlanmoqda', color: 'bg-amber-50 text-amber-700' },
  { id: 'shipped',    label: 'Yuborildi', color: 'bg-indigo-50 text-indigo-700' },
  { id: 'delivered',  label: 'Yetkazildi', color: 'bg-emerald-50 text-emerald-700' },
  { id: 'cancelled',  label: 'Bekor qilindi', color: 'bg-red-50 text-red-700' }
]

const statusColor = (id) => STATUSES.find(s => s.id === id)?.color || 'bg-brand-50 text-brand-700'
const statusLabel = (id) => STATUSES.find(s => s.id === id)?.label || id

export default function AdminOrders() {
  const [filter, setFilter] = useState('all')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')
  const [expanded, setExpanded] = useState(null)

  const load = async (status = filter) => {
    setLoading(true); setErr('')
    try {
      const data = await fetchOrders({ status })
      setItems(data)
    } catch (e) { setErr(e.message) }
    finally { setLoading(false) }
  }

  useEffect(() => { load(filter) }, [filter])

  const changeStatus = async (id, status) => {
    try {
      await updateOrderStatus(id, status)
      setItems(items.map(o => o.id === id ? { ...o, status } : o))
    } catch (e) { alert(e.message) }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-extrabold">Buyurtmalar</h1>
        <button onClick={() => load()} className="btn-outline !py-2 !text-xs">Yangilash</button>
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4 pb-1">
        {STATUSES.map(s => (
          <button
            key={s.id}
            onClick={() => setFilter(s.id)}
            className={`chip ${filter === s.id ? 'chip-active' : 'chip-idle'}`}
          >{s.label}</button>
        ))}
      </div>

      {err && <div className="mb-4 text-sm bg-red-50 border border-red-200 text-red-700 rounded-xl p-3">{err}</div>}

      {loading ? (
        <div className="py-16 text-center text-brand-400 text-sm">Yuklanmoqda...</div>
      ) : items.length === 0 ? (
        <div className="py-16 text-center text-brand-400 text-sm">Buyurtmalar yo'q</div>
      ) : (
        <div className="space-y-3">
          {items.map(o => (
            <div key={o.id} className="bg-white rounded-2xl border border-brand-100 overflow-hidden">
              <button
                onClick={() => setExpanded(expanded === o.id ? null : o.id)}
                className="w-full grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_auto_auto_auto] gap-3 items-center p-4 text-left hover:bg-brand-50/50 transition"
              >
                <div className="min-w-0">
                  <div className="font-mono text-xs text-brand-400 truncate">#{String(o.id).slice(0, 8)}</div>
                  <div className="font-semibold">{o.customer?.name} · {o.customer?.phone}</div>
                  <div className="text-xs text-brand-400 mt-0.5">
                    {new Date(o.created_at).toLocaleString('ru-RU')} · {o.items?.length || 0} ta mahsulot
                  </div>
                </div>
                <div className="hidden sm:block font-bold text-right">{fmtSom(o.total)}</div>
                <div className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColor(o.status)}`}>
                  {statusLabel(o.status)}
                </div>
                <div className="text-brand-300">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"
                    style={{ transform: expanded === o.id ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </div>
              </button>

              {expanded === o.id && (
                <div className="border-t border-brand-100 p-4 space-y-4 bg-brand-50/40">
                  <div className="grid sm:grid-cols-2 gap-4 text-sm">
                    <Info label="Mijoz" value={`${o.customer?.name}, ${o.customer?.phone}`} />
                    <Info label="Yetkazib berish" value={
                      o.delivery?.pickup ? "Do'kondan olib ketish" : `${o.delivery?.city || ''}, ${o.delivery?.street || ''}`
                    } />
                    <Info label="To'lov" value={o.payment} />
                    <Info label="Til" value={o.lang?.toUpperCase()} />
                    {o.note && <Info label="Izoh" value={o.note} full />}
                  </div>

                  <div className="bg-white rounded-xl border border-brand-100 divide-y divide-brand-100">
                    {(o.items || []).map((i, idx) => (
                      <div key={idx} className="flex items-center justify-between gap-2 p-3 text-sm">
                        <div className="min-w-0">
                          <div className="font-semibold truncate">{i.name?.uz || i.name}</div>
                          <div className="text-xs text-brand-400">
                            {i.brand} {i.size && `· ${i.size}`} × {i.qty}
                          </div>
                        </div>
                        <div className="font-semibold shrink-0">{fmtSom(i.price * i.qty)}</div>
                      </div>
                    ))}
                    <div className="p-3 flex justify-between font-bold">
                      <span>Jami</span>
                      <span>{fmtSom(o.total)}</span>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-brand-400 mb-2">Statusni o'zgartirish</div>
                    <div className="flex flex-wrap gap-2">
                      {STATUSES.filter(s => s.id !== 'all').map(s => (
                        <button
                          key={s.id}
                          onClick={() => changeStatus(o.id, s.id)}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                            o.status === s.id ? `${s.color} ring-2 ring-brand-700` : `${s.color} opacity-60 hover:opacity-100`
                          }`}
                        >{s.label}</button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Info({ label, value, full }) {
  return (
    <div className={full ? 'sm:col-span-2' : ''}>
      <div className="text-xs uppercase tracking-wide text-brand-400 font-semibold">{label}</div>
      <div className="text-brand-700">{value || '—'}</div>
    </div>
  )
}
