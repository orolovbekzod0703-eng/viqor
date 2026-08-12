import { useI18n } from '../hooks/useI18n'
import { Logo } from './Logo'

export function Footer() {
  const { t, lang } = useI18n()
  return (
    <footer className="mt-16 border-t border-brand-100 bg-brand-50/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid gap-8 sm:grid-cols-3">
        <div>
          <div className="text-brand-700"><Logo /></div>
          <p className="mt-3 text-sm text-brand-500 max-w-xs">{t.tagline}</p>
        </div>
        <div>
          <div className="font-bold mb-3 text-sm">{lang === 'uz' ? "Do'kon" : 'Магазин'}</div>
          <ul className="space-y-2 text-sm text-brand-500">
            <li>{t.categories}</li>
            <li>{t.favorites}</li>
            <li>{t.cart}</li>
          </ul>
        </div>
        <div>
          <div className="font-bold mb-3 text-sm">{lang === 'uz' ? 'Bog\'lanish' : 'Контакты'}</div>
          <ul className="space-y-2 text-sm text-brand-500">
            <li>+998 90 000 00 00</li>
            <li>hello@viqor.uz</li>
            <li>Toshkent, O'zbekiston</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-brand-100 py-4 text-center text-xs text-brand-400">{t.footer}</div>
    </footer>
  )
}
