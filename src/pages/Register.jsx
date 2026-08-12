import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { signUp, upsertProfile, hasSupabase } from '../supabase'
import { signIn, useAuth } from '../hooks/useAuth'
import { AuthShell, Field, Warn, Loader } from './Login'
import { useI18n } from '../hooks/useI18n'

export default function Register() {
  const { user, loading } = useAuth()
  const { lang } = useI18n()
  const nav = useNavigate()
  const [form, setForm] = useState({ name: '', phone: '', email: '', password: '' })
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const [info, setInfo] = useState('')

  if (loading) return <Loader />
  if (user) return <Navigate to="/account" replace />

  const set = (k, v) => setForm({ ...form, [k]: v })

  const submit = async (e) => {
    e.preventDefault()
    setErr(''); setInfo(''); setBusy(true)
    try {
      await signUp(form.email.trim(), form.password, { name: form.name, phone: form.phone })
      try { await signIn(form.email.trim(), form.password) }
      catch {
        setInfo(lang === 'uz'
          ? "Emailingizga tasdiqlash havolasi yubordik. Tasdiqlagach kiring."
          : 'Мы отправили ссылку на подтверждение. Подтвердите и войдите.')
        return
      }
      try { await upsertProfile({ name: form.name, phone: form.phone }) } catch {}
      nav('/account', { replace: true })
    } catch (e) { setErr(e.message) }
    finally { setBusy(false) }
  }

  return (
    <AuthShell title={lang === 'uz' ? "Ro'yxatdan o'tish" : 'Регистрация'} sub={lang === 'uz' ? 'Yangi hisob yarating' : 'Создайте новый аккаунт'}>
      {!hasSupabase && <Warn text="Supabase sozlanmagan" />}
      <form onSubmit={submit} className="mt-5 space-y-3">
        <Field label={lang === 'uz' ? 'Ism' : 'Имя'} value={form.name} onChange={v => set('name', v)} required />
        <Field label={lang === 'uz' ? 'Telefon' : 'Телефон'} type="tel" value={form.phone} onChange={v => set('phone', v)} placeholder="+998" />
        <Field label="Email" type="email" value={form.email} onChange={v => set('email', v)} autoComplete="email" required />
        <Field label={lang === 'uz' ? 'Parol' : 'Пароль'} type="password" value={form.password} onChange={v => set('password', v)} autoComplete="new-password" minLength={6} required />
        {err && <div className="text-xs text-red-600">{err}</div>}
        {info && <div className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg p-2">{info}</div>}
        <button className="btn-primary w-full" disabled={busy || !hasSupabase}>{busy ? '...' : (lang === 'uz' ? "Ro'yxatdan o'tish" : 'Зарегистрироваться')}</button>
      </form>
      <div className="mt-5 text-center text-sm text-brand-400">
        {lang === 'uz' ? 'Hisobingiz bormi? ' : 'Есть аккаунт? '}
        <Link to="/login" className="font-semibold text-brand-700 hover:underline">
          {lang === 'uz' ? 'Kiring' : 'Войти'}
        </Link>
      </div>
    </AuthShell>
  )
}
