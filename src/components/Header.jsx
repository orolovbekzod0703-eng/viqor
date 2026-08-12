import { useI18n } from '../hooks/useI18n'
import { useCart } from '../store/cartStore'
import { useFavorites } from '../store/favoritesStore'
import { useUI } from '../store/uiStore'
import { LanguageSwitch } from './LanguageSwitch'
import { Logo } from './Logo'
import { IconBag, IconHeart, IconSearch } from './Icons'

export function Header({ search, setSearch }) {
  const { t } = useI18n()
  const cartCount = useCart(s => s.items.reduce((a, i) => a + i.qty, 0))
  const favCount = useFavorites(s => s.ids.length)
  const setCartOpen = useUI(s => s.setCartOpen)
  const setFavoritesOpen = useUI(s => s.setFavoritesOpen)

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-brand-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-3 sm:gap-5 h-16">
          <a href="#" className="text-brand-700 shrink-0"><Logo /></a>

          <div className="hidden md:flex flex-1 max-w-lg">
            <SearchInput value={search} onChange={setSearch} placeholder={t.search} />
          </div>

          <div className="ml-auto flex items-center gap-1.5 sm:gap-3">
            <LanguageSwitch />
            <IconBtn onClick={() => setFavoritesOpen(true)} count={favCount} label={t.favorites}>
              <IconHeart />
            </IconBtn>
            <IconBtn onClick={() => setCartOpen(true)} count={cartCount} label={t.cart}>
              <IconBag />
            </IconBtn>
          </div>
        </div>

        <div className="md:hidden pb-3">
          <SearchInput value={search} onChange={setSearch} placeholder={t.search} />
        </div>
      </div>
    </header>
  )
}

function SearchInput({ value, onChange, placeholder }) {
  return (
    <div className="relative w-full">
      <IconSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-400" />
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-11 pl-11 pr-4 rounded-full bg-brand-50 border border-transparent text-sm outline-none focus:bg-white focus:border-brand-200 transition"
      />
    </div>
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
