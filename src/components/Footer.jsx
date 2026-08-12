import { useLocation, useNavigate } from 'react-router-dom'
import { useI18n } from '../hooks/useI18n'
import { useUI } from '../store/uiStore'
import { Logo } from './Logo'

const TELEGRAM = 'https://t.me/Viqorwear_info'
const INSTAGRAM = 'https://www.instagram.com/viqorwear/'
const PHONE = '+998900004111'
const PHONE_FMT = '+998 90 000 41 11'

export function Footer() {
  const { t, lang } = useI18n()
  const nav = useNavigate()
  const loc = useLocation()
  const setCartOpen = useUI(s => s.setCartOpen)
  const setFavoritesOpen = useUI(s => s.setFavoritesOpen)

  const goCategories = () => {
    const scroll = () => document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    if (loc.pathname === '/') scroll()
    else { nav('/'); setTimeout(scroll, 120) }
  }

  return (
    <footer className="mt-16 border-t border-brand-100 bg-brand-50/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid gap-8 sm:grid-cols-3">
        <div>
          <div className="text-brand-700"><Logo /></div>
          <p className="mt-3 text-sm text-brand-500 max-w-xs">{t.tagline}</p>

          <div className="mt-4 flex items-center gap-2">
            <SocialLink href={INSTAGRAM} label="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
            </SocialLink>
            <SocialLink href={TELEGRAM} label="Telegram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9.78 15.27l-.4 4.05c.57 0 .82-.24 1.12-.53l2.69-2.53 5.58 4.06c1.02.56 1.75.27 2.02-.94l3.66-17.14h.01c.32-1.51-.55-2.1-1.55-1.73L1.14 9.36C-.33 9.93-.31 10.75.9 11.12l5.36 1.67L18.7 4.98c.58-.38 1.11-.17.67.21L9.78 15.27z" />
              </svg>
            </SocialLink>
          </div>
        </div>

        <div>
          <div className="font-bold mb-3 text-sm">{lang === 'uz' ? "Do'kon" : 'Магазин'}</div>
          <ul className="space-y-2 text-sm">
            <li>
              <FooterLink onClick={goCategories}>{t.categories}</FooterLink>
            </li>
            <li>
              <FooterLink onClick={() => setFavoritesOpen(true)}>{t.favorites}</FooterLink>
            </li>
            <li>
              <FooterLink onClick={() => setCartOpen(true)}>{t.cart}</FooterLink>
            </li>
          </ul>
        </div>

        <div>
          <div className="font-bold mb-3 text-sm">{lang === 'uz' ? 'Bog\'lanish' : 'Контакты'}</div>
          <ul className="space-y-2 text-sm text-brand-500">
            <li>
              <a href={`tel:${PHONE}`} className="hover:text-brand-700 transition">{PHONE_FMT}</a>
            </li>
            <li>
              <a href={TELEGRAM} target="_blank" rel="noreferrer" className="hover:text-brand-700 transition">Telegram: @Viqorwear_info</a>
            </li>
            <li>
              <a href={INSTAGRAM} target="_blank" rel="noreferrer" className="hover:text-brand-700 transition">Instagram: @viqorwear</a>
            </li>
            <li>{lang === 'uz' ? "Olmaliq sh., O'zbekiston" : 'г. Алмалык, Узбекистан'}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-brand-100 py-4 text-center text-xs text-brand-400">{t.footer}</div>
    </footer>
  )
}

function FooterLink({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="text-brand-500 hover:text-brand-700 transition text-left"
    >
      {children}
    </button>
  )
}

function SocialLink({ href, label, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="w-9 h-9 rounded-full bg-white border border-brand-100 text-brand-500 hover:text-brand-700 hover:border-brand-700 flex items-center justify-center transition"
    >
      {children}
    </a>
  )
}
