import { useEffect, useState } from 'react'
import { deleteProduct, fetchProducts } from '../../supabase'
import { fmtSom } from '../../hooks/useI18n'
import { CATEGORIES } from '../../data/products'
import ProductForm from './ProductForm'

export default function AdminProducts() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [q, setQ] = useState('')

  const load = async () => {
    setLoading(true)
    try { setItems(await fetchProducts()) }
    finally { setLoading(false) }
  }
  useEffect(() => { load() }, [])

  const onDelete = async (p) => {
    if (!confirm(`"${p.name.uz}" — o'chirilsinmi?`)) return
    try {
      await deleteProduct(p.id)
      setItems(items.filter(x => x.id !== p.id))
    } catch (e) { alert(e.message) }
  }

  const filtered = q.trim()
    ? items.filter(p => (p.name.uz + ' ' + p.name.ru + ' ' + p.brand).toLowerCase().includes(q.toLowerCase()))
    : items

  const catLabel = (id) => CATEGORIES.find(c => c.id === id)?.key || id

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <h1 className="text-2xl font-extrabold">Mahsulotlar</h1>
        <div className="flex items-center gap-2">
          <input
            value={q} onChange={e => setQ(e.target.value)}
            placeholder="Qidirish..."
            className="input !py-2 !text-sm w-48"
          />
          <button onClick={() => setEditing({})} className="btn-primary !py-2 !text-sm">+ Yangi</button>
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-brand-400 text-sm">Yuklanmoqda...</div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center text-brand-400 text-sm">Mahsulotlar yo'q</div>
      ) : (
        <div className="bg-white rounded-2xl border border-brand-100 overflow-hidden">
          <div className="hidden md:grid grid-cols-[60px_1fr_120px_100px_120px_100px] gap-3 px-4 py-3 text-xs uppercase tracking-wide text-brand-400 font-semibold border-b border-brand-100">
            <div></div><div>Nomi</div><div>Kategoriya</div><div>Brend</div><div>Narx</div><div></div>
          </div>
          {filtered.map(p => (
            <div key={p.id} className="grid grid-cols-[60px_1fr_auto] md:grid-cols-[60px_1fr_120px_100px_120px_100px] gap-3 items-center px-4 py-3 border-b border-brand-100 last:border-b-0">
              <div className="w-12 h-14 rounded-lg overflow-hidden bg-brand-50 shrink-0">
                {p.images?.[0] && <img src={p.images[0]} alt="" className="w-full h-full object-cover" />}
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-sm truncate">{p.name.uz}</div>
                <div className="text-xs text-brand-400 truncate">{p.name.ru}</div>
                <div className="text-xs text-brand-400 md:hidden">{p.brand} · {fmtSom(p.price)}</div>
              </div>
              <div className="hidden md:block text-sm">{catLabel(p.category)}</div>
              <div className="hidden md:block text-sm">{p.brand}</div>
              <div className="hidden md:block text-sm font-semibold">{fmtSom(p.price)}</div>
              <div className="flex gap-1 justify-end">
                <button onClick={() => setEditing(p)} className="w-9 h-9 rounded-lg hover:bg-brand-50 text-brand-500 hover:text-brand-700 flex items-center justify-center" aria-label="edit">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                </button>
                <button onClick={() => onDelete(p)} className="w-9 h-9 rounded-lg hover:bg-red-50 text-brand-300 hover:text-red-600 flex items-center justify-center" aria-label="delete">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7h16M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13"/></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing !== null && (
        <ProductForm
          initial={editing}
          onClose={() => setEditing(null)}
          onSaved={(p) => {
            setItems(prev => {
              const idx = prev.findIndex(x => x.id === p.id)
              if (idx === -1) return [p, ...prev]
              const next = [...prev]; next[idx] = p; return next
            })
            setEditing(null)
          }}
        />
      )}
    </div>
  )
}
