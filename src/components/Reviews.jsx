import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchReviews, submitReview, deleteMyReview, supabase } from '../supabase'
import { useAuth } from '../hooks/useAuth'
import { useI18n } from '../hooks/useI18n'
import { useRatings } from '../store/ratingsStore'

export function Reviews({ productId }) {
  const { lang } = useI18n()
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [rating, setRating] = useState(5)
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const setOneRating = useRatings(s => s.setOne)

  const load = async () => {
    setLoading(true)
    try {
      const list = await fetchReviews(productId)
      setItems(list)
      if (list.length > 0) {
        const avg = list.reduce((s, r) => s + r.rating, 0) / list.length
        setOneRating(productId, Math.round(avg * 10) / 10, list.length)
      } else {
        setOneRating(productId, 0, 0)
      }
    } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [productId])

  const myReview = user ? items.find(r => r.user_id === user.id) : null

  useEffect(() => {
    if (myReview) { setRating(myReview.rating); setText(myReview.text || '') }
    else { setRating(5); setText('') }
  }, [myReview?.id])

  const submit = async () => {
    setErr(''); setBusy(true)
    try {
      await submitReview({ productId, rating, text })
      await load()
    } catch (e) { setErr(e.message) }
    finally { setBusy(false) }
  }

  const remove = async () => {
    if (!confirm(lang === 'uz' ? 'Sharh o\'chirilsinmi?' : 'Удалить отзыв?')) return
    setBusy(true)
    try { await deleteMyReview(productId); await load() }
    catch (e) { setErr(e.message) }
    finally { setBusy(false) }
  }

  const avg = items.length > 0 ? items.reduce((s, r) => s + r.rating, 0) / items.length : 0

  return (
    <div className="mt-6 pt-6 border-t border-brand-100">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-brand-700">{lang === 'uz' ? 'Sharhlar' : 'Отзывы'}</h3>
        {items.length > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <Stars value={avg} />
            <span className="font-bold">{avg.toFixed(1)}</span>
            <span className="text-brand-400">({items.length})</span>
          </div>
        )}
      </div>

      {!supabase && (
        <div className="text-xs bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg p-3 mb-3">
          {lang === 'uz' ? 'Sharhlar uchun Supabase kerak' : 'Для отзывов требуется Supabase'}
        </div>
      )}

      {user ? (
        <div className="bg-brand-50 rounded-xl p-3 mb-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-brand-400 mb-2">
            {myReview ? (lang === 'uz' ? 'Sharhingizni tahrirlash' : 'Изменить отзыв') : (lang === 'uz' ? 'Sharh qoldirish' : 'Оставить отзыв')}
          </div>
          <StarsInput value={rating} onChange={setRating} />
          <textarea
            rows="2"
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder={lang === 'uz' ? 'Fikringiz (ixtiyoriy)' : 'Ваш отзыв (необязательно)'}
            className="input mt-2 resize-none !text-sm"
          />
          {err && <div className="text-xs text-red-600 mt-2">{err}</div>}
          <div className="mt-2 flex gap-2">
            <button onClick={submit} disabled={busy} className="btn-primary !py-2 !text-sm">
              {busy ? '...' : (myReview ? (lang === 'uz' ? 'Yangilash' : 'Обновить') : (lang === 'uz' ? 'Yuborish' : 'Отправить'))}
            </button>
            {myReview && (
              <button onClick={remove} disabled={busy} className="btn-outline !py-2 !text-sm !text-red-600 !border-red-200">
                {lang === 'uz' ? "O'chirish" : 'Удалить'}
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="text-xs text-brand-500 mb-4">
          <Link to="/login" className="font-semibold underline">{lang === 'uz' ? 'Kiring' : 'Войдите'}</Link>
          {' '}{lang === 'uz' ? 'va sharh qoldiring' : 'чтобы оставить отзыв'}
        </div>
      )}

      {loading ? (
        <div className="text-sm text-brand-400 py-4">...</div>
      ) : items.length === 0 ? (
        <div className="text-sm text-brand-400 py-4">
          {lang === 'uz' ? 'Hali sharhlar yo\'q. Birinchi bo\'ling!' : 'Пока нет отзывов. Будьте первым!'}
        </div>
      ) : (
        <div className="space-y-3">
          {items.map(r => (
            <div key={r.id} className="text-sm">
              <div className="flex items-center gap-2 mb-1">
                <Stars value={r.rating} />
                <span className="text-xs text-brand-400">{new Date(r.created_at).toLocaleDateString('ru-RU')}</span>
              </div>
              {r.text && <div className="text-brand-500">{r.text}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function Stars({ value = 0 }) {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i <= Math.round(value) ? '#F59E0B' : '#E4E8F1'} stroke="none">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77 5.82 21l1.18-6.88-5-4.87 6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  )
}

function StarsInput({ value, onChange }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <button key={i} onClick={() => onChange(i)} type="button" className="p-0.5">
          <svg width="24" height="24" viewBox="0 0 24 24" fill={i <= value ? '#F59E0B' : '#E4E8F1'} stroke="none">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77 5.82 21l1.18-6.88-5-4.87 6.91-1.01L12 2z" />
          </svg>
        </button>
      ))}
    </div>
  )
}
