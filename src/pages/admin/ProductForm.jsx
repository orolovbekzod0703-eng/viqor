import { useEffect, useState } from 'react'
import { upsertProduct, uploadProductImage } from '../../supabase'
import { BRANDS, CATEGORIES, COLORS } from '../../data/products'
import { IconClose, IconPlus, IconTrash } from '../../components/Icons'

const empty = {
  id: '',
  category: 'shirts',
  brand: BRANDS[0],
  name: { uz: '', ru: '' },
  price: '',
  oldPrice: '',
  sizes: [],
  availableSizes: [],
  colors: [],
  composition: { uz: '', ru: '' },
  description: { uz: '', ru: '' },
  images: []
}

const genId = () => 'p_' + Math.random().toString(36).slice(2, 10)

export default function ProductForm({ initial, onClose, onSaved }) {
  const isNew = !initial?.id
  const [form, setForm] = useState({ ...empty, ...initial, id: initial?.id || genId() })
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const [sizeInput, setSizeInput] = useState('')

  useEffect(() => { document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = '' } }, [])

  const set = (patch) => setForm({ ...form, ...patch })
  const setName = (lang, v) => set({ name: { ...form.name, [lang]: v } })
  const setComp = (lang, v) => set({ composition: { ...form.composition, [lang]: v } })
  const setDesc = (lang, v) => set({ description: { ...form.description, [lang]: v } })

  const addSize = () => {
    const s = sizeInput.trim()
    if (!s || form.sizes.includes(s)) return
    set({ sizes: [...form.sizes, s], availableSizes: [...form.availableSizes, s] })
    setSizeInput('')
  }
  const removeSize = (s) => set({
    sizes: form.sizes.filter(x => x !== s),
    availableSizes: form.availableSizes.filter(x => x !== s)
  })
  const toggleAvail = (s) => set({
    availableSizes: form.availableSizes.includes(s)
      ? form.availableSizes.filter(x => x !== s)
      : [...form.availableSizes, s]
  })
  const toggleColor = (c) => set({
    colors: form.colors.includes(c) ? form.colors.filter(x => x !== c) : [...form.colors, c]
  })

  const onFile = async (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return
    setBusy(true); setErr('')
    try {
      const urls = []
      for (const f of files) urls.push(await uploadProductImage(f))
      set({ images: [...form.images, ...urls] })
    } catch (e) { setErr(e.message) }
    finally { setBusy(false); e.target.value = '' }
  }

  const removeImage = (i) => set({ images: form.images.filter((_, idx) => idx !== i) })

  const save = async () => {
    setErr('')
    if (!form.name.uz.trim() || !form.name.ru.trim()) return setErr("Nom (UZ va RU) to'ldirilishi shart")
    if (!form.price) return setErr("Narx to'ldirilishi shart")
    setBusy(true)
    try {
      const saved = await upsertProduct(form)
      onSaved(saved)
    } catch (e) { setErr(e.message) }
    finally { setBusy(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50 animate-fade" onClick={onClose} />
      <div className="relative w-full sm:max-w-2xl bg-white rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col animate-pop">
        <div className="flex items-center justify-between px-5 py-4 border-b border-brand-100">
          <h3 className="font-bold">{isNew ? 'Yangi mahsulot' : 'Tahrirlash'}</h3>
          <button onClick={onClose} className="w-9 h-9 rounded-full hover:bg-brand-50 flex items-center justify-center"><IconClose /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <div className="label">Kategoriya</div>
              <select value={form.category} onChange={e => set({ category: e.target.value })} className="input">
                {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                  <option key={c.id} value={c.id}>{c.key}</option>
                ))}
              </select>
            </div>
            <div>
              <div className="label">Brend</div>
              <input list="brands" value={form.brand} onChange={e => set({ brand: e.target.value })} className="input" />
              <datalist id="brands">
                {BRANDS.map(b => <option key={b} value={b} />)}
              </datalist>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <div className="label">Nom (UZ)</div>
              <input value={form.name.uz} onChange={e => setName('uz', e.target.value)} className="input" />
            </div>
            <div>
              <div className="label">Nom (RU)</div>
              <input value={form.name.ru} onChange={e => setName('ru', e.target.value)} className="input" />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <div className="label">Narx (so'm)</div>
              <input type="number" value={form.price} onChange={e => set({ price: e.target.value })} className="input" />
            </div>
            <div>
              <div className="label">Eski narx (ixtiyoriy)</div>
              <input type="number" value={form.oldPrice || ''} onChange={e => set({ oldPrice: e.target.value })} className="input" />
            </div>
          </div>

          <div>
            <div className="label">Rasmlar</div>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {form.images.map((src, i) => (
                <div key={i} className="relative aspect-[3/4] rounded-lg overflow-hidden bg-brand-50 group">
                  <img src={src} alt="" className="w-full h-full object-cover" />
                  <button onClick={() => removeImage(i)} className="absolute top-1 right-1 w-7 h-7 rounded-full bg-white/95 shadow flex items-center justify-center text-red-600 opacity-0 group-hover:opacity-100 transition">
                    <IconTrash />
                  </button>
                </div>
              ))}
              <label className="aspect-[3/4] rounded-lg border-2 border-dashed border-brand-200 flex flex-col items-center justify-center text-brand-400 hover:text-brand-700 hover:border-brand-700 cursor-pointer transition text-xs gap-1">
                <IconPlus />
                {busy ? '...' : 'Rasm'}
                <input type="file" accept="image/*" multiple hidden onChange={onFile} disabled={busy} />
              </label>
            </div>
          </div>

          <div>
            <div className="label">O'lchamlar</div>
            <div className="flex flex-wrap gap-2 mb-2">
              {form.sizes.map(s => (
                <div key={s} className="inline-flex items-stretch rounded-lg border border-brand-100 overflow-hidden">
                  <button
                    onClick={() => toggleAvail(s)}
                    className={`px-3 py-1.5 text-sm font-semibold transition ${
                      form.availableSizes.includes(s) ? 'bg-brand-700 text-white' : 'bg-white text-brand-400 line-through'
                    }`}
                    title={form.availableSizes.includes(s) ? 'Mavjud' : 'Mavjud emas — bosing yoqing'}
                  >{s}</button>
                  <button onClick={() => removeSize(s)} className="px-2 text-brand-300 hover:text-red-600 border-l border-brand-100">×</button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={sizeInput}
                onChange={e => setSizeInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSize())}
                placeholder="S, M, L, 48..."
                className="input !py-2 !text-sm flex-1"
              />
              <button onClick={addSize} className="btn-outline !py-2 !text-sm">Qo'shish</button>
            </div>
            <div className="text-xs text-brand-400 mt-1">Bosib qora → mavjud, oq (chizilgan) → mavjud emas</div>
          </div>

          <div>
            <div className="label">Ranglar</div>
            <div className="flex flex-wrap gap-2">
              {COLORS.map(c => (
                <button
                  key={c.id}
                  onClick={() => toggleColor(c.id)}
                  title={c.name.uz}
                  className={`w-9 h-9 rounded-full border-2 transition ${form.colors.includes(c.id) ? 'border-brand-700 scale-110' : 'border-brand-100'}`}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <div className="label">Tarkib (UZ)</div>
              <input value={form.composition.uz} onChange={e => setComp('uz', e.target.value)} className="input" placeholder="100% paxta" />
            </div>
            <div>
              <div className="label">Tarkib (RU)</div>
              <input value={form.composition.ru} onChange={e => setComp('ru', e.target.value)} className="input" placeholder="100% хлопок" />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <div className="label">Tavsif (UZ)</div>
              <textarea rows="3" value={form.description.uz} onChange={e => setDesc('uz', e.target.value)} className="input resize-none" />
            </div>
            <div>
              <div className="label">Tavsif (RU)</div>
              <textarea rows="3" value={form.description.ru} onChange={e => setDesc('ru', e.target.value)} className="input resize-none" />
            </div>
          </div>

          {err && <div className="text-sm bg-red-50 border border-red-200 text-red-700 rounded-xl p-3">{err}</div>}
        </div>

        <div className="border-t border-brand-100 px-5 py-4 flex gap-2">
          <button onClick={onClose} className="btn-outline flex-1">Bekor qilish</button>
          <button onClick={save} disabled={busy} className="btn-primary flex-1 disabled:opacity-50">
            {busy ? '...' : 'Saqlash'}
          </button>
        </div>
      </div>
    </div>
  )
}
