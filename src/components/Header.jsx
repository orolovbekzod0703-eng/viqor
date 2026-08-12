import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useI18n } from '../hooks/useI18n'
import { useCart } from '../store/cartStore'
import { useFavorites } from '../store/favoritesStore'
import { useUI } from '../store/uiStore'
import { LanguageSwitch } from './LanguageSwitch'
import { Logo } from './Logo'
import { IconBag, IconHeart } from './Icons'
import { SearchAutocomplete } from './SearchAutocomplete'
import { useAuth, signOut } from '../hooks/useAuth'

export function Header({ search, setSearch }) {
  const { t, lang } = useI18n()
  const cartCount = useCart(s => s.items.reduce((a, i) => a + i.qty, 0))
  const favCount = useFavorites(s => s.ids.length)
  const setCartOpen = useUI(s => s.setCartOpen)
  const setFavoritesOpen = useUI(s => s.setFavoritesOpen)

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-brand-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-3 sm:gap-5 h-16">
          <Link to="/" className="text-brand-700 shrink-0"><Logo /></Link>

          <div className="hidden md:flex flex-1 max-w-lg">
            <SearchAutocomplete value={search} onChange={setSearch} placeholder={t.search} />
          </div>

          <div className="ml-auto flex items-center gap-1.5 sm:gap-3">
            <LanguageSwitch />
            <UserMenu />
            <IconBtn onClick={() => setFavoritesOpen(true)} count={favCount} label={t.favorites}>
              <IconHeart />
            </IconBtn>
            <IconBtn onClick={() => setCartOpen(true)} count={cartCount} label={t.cart}>
              <IconBag />
            </IconBtn>
          </div>
        </div>

        <div className="md:hidden pb-3">
          <SearchAutocomplete value={search} onChange={setSearch} placeholder={t.search} />
        </div>
      </div>
    </header>
  )
}

function IconBtn({ children, count, label, onClick }) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      className="relative w-11 h-11 rounded-full text-brand-700 hover:bg-brand-50 flex items-center justify-center transition"
    >
      {children}
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 bg-brand-700 text-white text-[10px] font-bold min-w-5 h-5 px-1 rounded-full flex items-center justify-center">
          {count}
        </span>
      )}
    </button>
  )
}

function UserMenu() {
  const { user } = useAuth()
  const { lang } = useI18n()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        aria-label="account"
        onClick={() => setOpen(v => !v)}
        className="w-11 h-11 rounded-full text-brand-700 hover:bg-brand-50 flex items-center justify-center transition"
      >
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21a8 8 0 0 1 16 0" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-lg border border-brand-100 overflow-hidden animate-pop">
          {user ? (
            <>
              <div className="px-4 py-3 border-b border-brand-100">
                <div className="text-xs text-brand-400">{lang === 'uz' ? 'Kirgan' : 'Вошли как'}</div>
                <div className="text-sm font-semibold truncate">{user.email}</div>
              </div>
              <MenuLink to="/" onClick={() => setOpen(false)}>{lang === 'uz' ? "Do'kon" : 'Магазин'}</MenuLink>
              <MenuLink to="/account" onClick={() => setOpen(false)}>{lang === 'uz' ? 'Akkauntim' : 'Мой аккаунт'}</MenuLink>
              <button
                onClick={async () => { setOpen(false); await signOut() }}
                className="w-full text-left px-4 py-2.5 text-sm font-medium hover:bg-brand-50 text-brand-500"
              >{lang === 'uz' ? 'Chiqish' : 'Выйти'}</button>
            </>
          ) : (
            <>
              <MenuLink to="/login" onClick={() => setOpen(false)}>{lang === 'uz' ? 'Kirish' : 'Войти'}</MenuLink>
              <MenuLink to="/register" onClick={() => setOpen(false)}>{lang === 'uz' ? "Ro'yxatdan o'tish" : 'Регистрация'}</MenuLink>
            </>
          )}
        </div>
      )}
    </div>
  )
}

function MenuLink({ to, onClick, children }) {
  return (
    <Link to={to} onClick={onClick} className="block px-4 py-2.5 text-sm font-medium hover:bg-brand-50 text-brand-700">
      {children}
    </Link>
  )
}
