import { useEffect, useMemo, useState } from 'react'
import { fetchOrders } from '../../supabase'
import { fmtSom } from '../../hooks/useI18n'

const DAY = 24 * 60 * 60 * 1000

export default function AdminDashboard() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')

  useEffect(() => {
    fetchOrders().then(setOrders).catch(e => setErr(e.message)).finally(() => setLoading(false))
  }, [])

  const stats = useMemo(() => compute(orders), [orders])

  if (loading) return <div className="py-16 text-center text-brand-400 text-sm">Yuklanmoqda...</div>
  if (err) return <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm">{err}</div>

  return (
    <div>
      <h1 className="text-2xl font-extrabold mb-4">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <Kpi label="Bugungi buyurtmalar" value={stats.today.count} />
        <Kpi label="Bugungi tushum" value={fmtSom(stats.today.revenue)} />
        <Kpi label="7 kunlik buyurtmalar" value={stats.week.count} />
        <Kpi label="7 kunlik tushum" value={fmtSom(stats.week.revenue)} />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card title="Oxirgi 30 kun tushumi">
          <BarChart data={stats.dailySeries} />
        </Card>
        <Card title="Statuslar bo'yicha">
          <StatusBreakdown counts={stats.byStatus} />
        </Card>
        <Card title="Top 5 mahsulot (miqdor)" wide>
          <TopList items={stats.topProducts} />
        </Card>
      </div>
    </div>
  )
}

function compute(orders) {
  const now = Date.now()
  const today0 = new Date(); today0.setHours(0, 0, 0, 0)
  const week0 = now - 7 * DAY
  const days30 = 30

  const today = { count: 0, revenue: 0 }
  const week = { count: 0, revenue: 0 }
  const byStatus = {}
  const dailyMap = new Map()
  for (let i = days30 - 1; i >= 0; i--) {
    const d = new Date(now - i * DAY); d.setHours(0, 0, 0, 0)
    dailyMap.set(d.toISOString().slice(0, 10), 0)
  }

  const productCount = new Map()

  for (const o of orders) {
    const ts = new Date(o.created_at).getTime()
    if (o.status !== 'cancelled') {
      if (ts >= today0.getTime()) { today.count++; today.revenue += o.total }
      if (ts >= week0) { week.count++; week.revenue += o.total }
      const key = new Date(o.created_at).toISOString().slice(0, 10)
      if (dailyMap.has(key)) dailyMap.set(key, dailyMap.get(key) + o.total)
    }
    byStatus[o.status] = (byStatus[o.status] || 0) + 1

    for (const it of (o.items || [])) {
      const k = it.productId || (it.name?.uz || it.name)
      const cur = productCount.get(k) || { name: it.name?.uz || it.name || k, qty: 0, revenue: 0 }
      cur.qty += it.qty
      cur.revenue += it.price * it.qty
      productCount.set(k, cur)
    }
  }

  const topProducts = [...productCount.values()].sort((a, b) => b.qty - a.qty).slice(0, 5)
  const dailySeries = [...dailyMap.entries()].map(([date, revenue]) => ({ date, revenue }))
  return { today, week, byStatus, topProducts, dailySeries }
}

function Kpi({ label, value }) {
  return (
    <div className="bg-white rounded-2xl border border-brand-100 p-4">
      <div className="text-xs text-brand-400 uppercase tracking-wide font-semibold">{label}</div>
      <div className="mt-1 text-xl font-extrabold">{value}</div>
    </div>
  )
}

function Card({ title, wide, children }) {
  return (
    <div className={`bg-white rounded-2xl border border-brand-100 p-4 ${wide ? 'lg:col-span-2' : ''}`}>
      <div className="text-sm font-bold mb-3">{title}</div>
      {children}
    </div>
  )
}

function BarChart({ data }) {
  const max = Math.max(1, ...data.map(d => d.revenue))
  return (
    <div className="flex items-end gap-1 h-32">
      {data.map((d, i) => (
        <div key={d.date} className="flex-1 flex flex-col items-center group relative">
          <div
            className="w-full rounded-t bg-brand-700 hover:bg-brand-800 transition-all"
            style={{ height: `${(d.revenue / max) * 100}%`, minHeight: d.revenue > 0 ? 2 : 0 }}
          />
          {d.revenue > 0 && (
            <div className="absolute bottom-full mb-1 bg-brand-800 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap">
              {new Date(d.date).toLocaleDateString('ru-RU')} · {fmtSom(d.revenue)}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function StatusBreakdown({ counts }) {
  const items = [
    ['new', 'Yangi', 'bg-blue-500'],
    ['processing', 'Tayyorlanmoqda', 'bg-amber-500'],
    ['shipped', 'Yuborildi', 'bg-indigo-500'],
    ['delivered', 'Yetkazildi', 'bg-emerald-500'],
    ['cancelled', 'Bekor', 'bg-red-500']
  ]
  const total = Object.values(counts).reduce((s, v) => s + v, 0) || 1
  return (
    <div className="space-y-2">
      {items.map(([id, label, color]) => {
        const n = counts[id] || 0
        const pct = (n / total) * 100
        return (
          <div key={id}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-brand-500">{label}</span>
              <span className="font-semibold">{n}</span>
            </div>
            <div className="h-2 bg-brand-100 rounded-full overflow-hidden">
              <div className={`h-full ${color}`} style={{ width: `${pct}%` }} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

function TopList({ items }) {
  if (items.length === 0) return <div className="text-sm text-brand-400">Ma'lumot yo'q</div>
  return (
    <div className="space-y-2">
      {items.map((p, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-brand-700 text-white text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</div>
          <div className="flex-1 min-w-0 text-sm font-semibold truncate">{p.name}</div>
          <div className="text-sm text-brand-400">×{p.qty}</div>
          <div className="text-sm font-bold w-28 text-right">{fmtSom(p.revenue)}</div>
        </div>
      ))}
    </div>
  )
}
