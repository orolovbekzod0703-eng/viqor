import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { signIn, useAuth } from '../../hooks/useAuth'
import { hasSupabase } from '../../supabase'
import { Logo } from '../../components/Logo'

export default function AdminLogin() {
  const nav = useNavigate()
  const { user, isAdmin, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  useEffect(() => { document.title = 'Viqor Admin — Login' }, [])

  if (loading) return <FullPageSpinner />
  if (user && isAdmin) return <Navigate to="/admin" replace />

  const onSubmit = async (e) => {
    e.preventDefault()
    setErr(''); setBusy(true)
    try {
      await signIn(email.trim(), password)
      nav('/admin', { replace: true })
    } catch (e) {
      setErr(e.message || 'Login xatoligi')
    } finally { setBusy(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-soft p-8">
        <div className="flex justify-center text-brand-700 mb-6"><Logo /></div>
        <h1 className="text-xl font-bold text-center">Admin panel</h1>
        <p className="text-sm text-brand-400 text-center mt-1">Kirish uchun ma'lumotlarni kiriting</p>

        {!hasSupabase && (
          <div className="mt-4 text-xs bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg p-3">
            Supabase sozlanmagan. <code>.env</code> ga <code>VITE_SUPABASE_URL</code> va <code>VITE_SUPABASE_ANON_KEY</code> qo'shing.
          </div>
        )}

        {user && !isAdmin && (
          <div className="mt-4 text-xs bg-red-50 border border-red-200 text-red-700 rounded-lg p-3">
            Bu foydalanuvchi admin emas. <code>admins</code> jadvaliga qo'shing.
          </div>
        )}

        <form onSubmit={onSubmit} className="mt-5 space-y-3">
          <div>
            <div className="label">Email</div>
            <input className="input" type="email" required value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
          </div>
          <div>
            <div className="label">Parol</div>
            <input className="input" type="password" required value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" />
          </div>
          {err && <div className="text-xs text-red-600">{err}</div>}
          <button className="btn-primary w-full" disabled={busy || !hasSupabase}>
            {busy ? '...' : 'Kirish'}
          </button>
        </form>

        <a href="/" className="mt-5 block text-center text-xs text-brand-400 hover:text-brand-700">← Do'konga qaytish</a>
      </div>
    </div>
  )
}

export function FullPageSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 rounded-full border-2 border-brand-100 border-t-brand-700 animate-spin" />
    </div>
  )
}
