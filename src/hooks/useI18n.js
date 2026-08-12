import { translations } from '../i18n/translations'
import { useUI } from '../store/uiStore'

export function useI18n() {
  const lang = useUI(s => s.lang)
  const setLang = useUI(s => s.setLang)
  const t = translations[lang] || translations.uz
  return { lang, setLang, t }
}

export const fmtSom = (n) =>
  new Intl.NumberFormat('ru-RU').format(Math.round(n)) + " so'm"
