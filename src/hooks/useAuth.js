import { useEffect, useState } from 'react'
import { supabase, hasSupabase, isCurrentUserAdmin } from '../supabase'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!hasSupabase) { setLoading(false); return }
    let alive = true

    const check = async (u) => {
      if (!alive) return
      setUser(u || null)
      if (u) setIsAdmin(await isCurrentUserAdmin())
      else setIsAdmin(false)
      setLoading(false)
    }

    supabase.auth.getSession().then(({ data }) => check(data.session?.user))
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => check(session?.user))
    return () => { alive = false; sub.subscription.unsubscribe() }
  }, [])

  return { user, isAdmin, loading }
}

export async function signIn(email, password) {
  if (!hasSupabase) throw new Error('Supabase not configured')
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
}

export async function signOut() {
  if (!hasSupabase) return
  await supabase.auth.signOut()
}
