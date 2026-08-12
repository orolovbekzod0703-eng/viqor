import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { fetchProfile, fetchUserOrders, upsertProfile } from '../supabase'
import { signOut, useAuth } from '../hooks/useAuth'
import { fmtSom, useI18n } from '../hooks/useI18n'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { PhoneInput } from '../components/PhoneInput'
import { Loader } from './Login'
import { useFavorites } from '../store/favoritesStore'
import { useProducts, setProducts } from '../store/productsStore'
import { fetchProducts } from '../supabase'
import { PRODUCTS as SAMPLE } from '../data/products'
import { useUI } from '../store/uiStore'
import { ProductModal } from '../components/ProductModal'
import { CartDrawer } from '../components/CartDrawer'
import { FavoritesDrawer } from '../components/FavoritesDrawer'
import { CheckoutModal } from '../components/CheckoutModal'
import { OrderSuccess } from '../components/OrderSuccess'
import { Toast } from '../components/Toast'

const STATUS_LABEL = {
  new: { uz: 'Yangi', ru: 'Новый', color: 'bg-blue-50 text-blue-700' },
  processing: { uz: 'Tayyorlanmoqda', ru: 'Готовится', color: 'bg-amber-50 text-amber-700' },
  shipped: { uz: 'Yuborildi', ru: 'Отправлен', color: 'bg-indigo-50 text-indigo-700' },
  delivered: { uz: 'Yetkazildi', ru: 'Доставлен', color: 'bg-emerald-50 text-emerald-700' },
  cancelled: { uz: 'Bekor qilindi', ru: 'Отменён', color: 'bg-red-50 text-red-700' }
}

export default function Account() {
  const { user, loading } = useAuth()
  const { lang } = useI18n()
  const nav = useNavigate()
  const [profile, setProfile] = useState({ name: '', phone: '' })
  const [orders, setOrders] = useState([])
  const [tab, setTab] = useState('orders')
  const [saved, setSaved] = useState(false)
  const [busy, setBusy] = useState(false)
  const favIds = useFavorites(s => s.ids)
  const allProducts = useProducts(s => s.items)
  const openProduct = useUI(s => s.openProduct)

  useEffect(() => {
    if (!user) return
    fetchProfile().then(p => p && setProfile({ name: p.name || '', phone: p.phone || '' }))
    fetchUserOrders().then(setOrders).catch(console.error)
  }, [user])

  useEffect(() => {
    if (allProducts.length === 0) {
      setProducts(SAMPLE)
      fetchProducts().then(list => list?.length && setProducts(list))
    }
  }, [])

  if (loading) return <Loader />
  if (!user) return <Navigate to="/login" state={{ from: '/account' }} replace />

  const saveProfile = async (e) => {
    e.preventDefault()
    setBusy(true)
    try { await upsertProfile(profile); setSaved(true); setTimeout(() => setSaved(false), 1500) }
    catch (e) { alert(e.message) }
    finally { setBusy(false) }
  }

  const favProducts = favIds.map(id => allProducts.find(p => p.id === id)).filter(Boolean)

  return (
    <div className="min-h-screen flex flex-col">
      <Header search="" setSearch={() => {}} />
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="flex items-start justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-extrabold">{lang === 'uz' ? 'Mening akkauntim' : 'Мой аккаунт'}</h1>
            <div className="text-sm text-brand-400">{user.email}</div>
          </div>
          <button onClick={async () => { await signOut(); nav('/') }} className="btn-outline !py-2 !text-sm">
            {lang === 'uz' ? 'Chiqish' : 'Выйти'}
          </button>
        </div>

        <div className="flex gap-2 mb-6 border-b border-brand-100">
          {['orders', 'favorites', 'profile'].map(id => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition ${
                tab === id ? 'text-brand-700 border-brand-700' : 'text-brand-400 border-transparent hover:text-brand-700'
              }`}
            >
              {id === 'orders' && (lang === 'uz' ? 'Buyurtmalarim' : 'Заказы')}
              {id === 'favorites' && (lang === 'uz' ? 'Sevimlilar' : 'Избранное')}
              {id === 'profile' && (lang === 'uz' ? 'Profil' : 'Профиль')}
            </button>
          ))}
        </div>

        {tab === 'orders' && (
          orders.length === 0 ? (
            <div className="py-16 text-center text-brand-400 text-sm">
              {lang === 'uz' ? 'Hali buyurtmalar yo\'q' : 'Пока нет заказов'}
              <div className="mt-4"><Link to="/" className="btn-primary">{lang === 'uz' ? "Xarid qilish" : 'Начать покупки'}</Link></div>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map(o => {
                const s = STATUS_LABEL[o.status] || {}
                return (
                  <div key={o.id} className="bg-white rounded-2xl border border-brand-100 p-4">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="font-mono text-xs text-brand-400">#{String(o.id).slice(0, 8)}</div>
                      <div className={`px-2.5 py-1 rounded-full text-xs font-semibold ${s.color}`}>{s[lang] || o.status}</div>
                    </div>
                    <div className="text-sm text-brand-400 mb-2">{new Date(o.created_at).toLocaleString('ru-RU')}</div>
                    <div className="space-y-1 text-sm">
                      {(o.items || []).map((i, idx) => (
                        <div key={idx} className="flex justify-between gap-2">
                          <span className="truncate">{i.name?.[lang] || i.name?.uz} {i.size && `· ${i.size}`} × {i.qty}</span>
                          <span className="font-semibold shrink-0">{fmtSom(i.price * i.qty)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 pt-3 border-t border-brand-100 flex justify-between font-bold">
                      <span>{lang === 'uz' ? 'Jami' : 'Итого'}</span>
                      <span>{fmtSom(o.total)}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )
        )}

        {tab === 'favorites' && (
          favProducts.length === 0 ? (
            <div className="py-16 text-center text-brand-400 text-sm">{lang === 'uz' ? 'Sevimlilar bo\'sh' : 'Нет избранных'}</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {favProducts.map(p => (
                <button key={p.id} onClick={() => openProduct(p.id)} className="text-left">
                  <div className="aspect-[3/4] rounded-xl overflow-hidden bg-brand-50">
                    <img src={p.images?.[0]} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="mt-2 text-sm font-semibold line-clamp-1">{p.name[lang]}</div>
                  <div className="text-sm font-bold">{fmtSom(p.price)}</div>
                </button>
              ))}
            </div>
          )
        )}

        {tab === 'profile' && (
          <form onSubmit={saveProfile} className="max-w-md space-y-3">
            <div>
              <div className="label">{lang === 'uz' ? 'Ism' : 'Имя'}</div>
              <input className="input" value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} />
            </div>
            <div>
              <div className="label">{lang === 'uz' ? 'Telefon' : 'Телефон'}</div>
              <PhoneInput value={profile.phone} onChange={v => setProfile({ ...profile, phone: v })} />
            </div>
            <div>
              <div className="label">Email</div>
              <input className="input opacity-60" value={user.email} disabled />
            </div>
            <button className="btn-primary" disabled={busy}>
              {busy ? '...' : (saved ? '✓ Saqlandi' : (lang === 'uz' ? 'Saqlash' : 'Сохранить'))}
            </button>
          </form>
        )}
      </main>
      <Footer />
      <ProductModal />
      <CartDrawer />
      <FavoritesDrawer />
      <CheckoutModal />
      <OrderSuccess />
      <Toast />
    </div>
  )
}
