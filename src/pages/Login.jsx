import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { signIn, useAuth } from '../hooks/useAuth'
import { hasSupabase } from '../supabase'
import { Logo } from '../components/Logo'
import { useI18n } from '../hooks/useI18n'

export default function Login() {
  const { user, loading } = useAuth()
  const { t, lang } = useI18n()
  const nav = useNavigate()
  const loc = useLocation()
  const from = loc.state?.from || '/account'
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  if (loading) return <Loader />
  if (user) return <Navigate to={from} replace />

  const submit = async (e) => {
    e.preventDefault()
    setErr(''); setBusy(true)
    try { await signIn(email.trim(), pw); nav(from, { replace: true }) }
    catch (e) { setErr(e.message) }
    finally { setBusy(false) }
  }

  return (
    <AuthShell title={lang === 'uz' ? 'Kirish' : 'Вход'} sub={lang === 'uz' ? 'Akkauntga kiring' : 'Войдите в аккаунт'}>
      {!hasSupabase && <Warn text="Supabase sozlanmagan" />}
      <form onSubmit={submit} className="mt-5 space-y-3">
        <Field label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" required />
        <Field label={lang === 'uz' ? 'Parol' : 'Пароль'} type="password" value={pw} onChange={setPw} autoComplete="current-password" required />
        {err && <div className="text-xs text-red-600">{err}</div>}
        <button className="btn-primary w-full" disabled={busy || !hasSupabase}>{busy ? '...' : (lang === 'uz' ? 'Kirish' : 'Войти')}</button>
      </form>
      <div className="mt-5 text-center text-sm text-brand-400">
        {lang === 'uz' ? 'Hisobingiz yo\'qmi? ' : 'Нет аккаунта? '}
        <Link to="/register" className="font-semibold text-brand-700 hover:underline">
          {lang === 'uz' ? 'Ro\'yxatdan o\'ting' : 'Зарегистрируйтесь'}
        </Link>
      </div>
    </AuthShell>
  )
}

export function AuthShell({ title, sub, children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-50 px-4 py-10">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-soft p-8">
        <Link to="/" className="flex justify-center text-brand-700 mb-6"><Logo /></Link>
        <h1 className="text-xl font-bold text-center">{title}</h1>
        <p className="text-sm text-brand-400 text-center mt-1">{sub}</p>
        {children}
        <Link to="/" className="mt-6 block text-center text-xs text-brand-400 hover:text-brand-700">← Do'konga qaytish</Link>
      </div>
    </div>
  )
}

export function Field({ label, value, onChange, type = 'text', ...p }) {
  return (
    <div>
      <div className="label">{label}</div>
      <input className="input" type={type} value={value} onChange={e => onChange(e.target.value)} {...p} />
    </div>
  )
}

export function Warn({ text }) {
  return <div className="mt-4 text-xs bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg p-3">{text}</div>
}

export function Loader() {
  return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 rounded-full border-2 border-brand-100 border-t-brand-700 animate-spin" /></div>
}
