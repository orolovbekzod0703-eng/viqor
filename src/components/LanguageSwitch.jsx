import { useI18n } from '../hooks/useI18n'

export function LanguageSwitch() {
  const { lang, setLang } = useI18n()
  return (
    <div className="inline-flex items-center rounded-full border border-brand-100 p-1 text-xs font-semibold">
      {['uz', 'ru'].map(code => (
        <button
          key={code}
          onClick={() => setLang(code)}
          className={`px-2.5 py-1 rounded-full transition ${lang === code ? 'bg-brand-700 text-white' : 'text-brand-500 hover:text-brand-700'}`}
        >
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
