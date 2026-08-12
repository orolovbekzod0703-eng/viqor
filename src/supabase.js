import { createClient } from '@supabase/supabase-js'
import { PRODUCTS as SAMPLE_PRODUCTS } from './data/products'

const url = import.meta.env.VITE_SUPABASE_URL
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY

export const hasSupabase = Boolean(url && anon)

export const supabase = hasSupabase
  ? createClient(url, anon, { auth: { persistSession: true, autoRefreshToken: true } })
  : null

// ---- Products ----------------------------------------------------------

export function rowToProduct(r) {
  return {
    id: r.id,
    category: r.category,
    brand: r.brand,
    name: { uz: r.name_uz, ru: r.name_ru },
    price: r.price,
    oldPrice: r.old_price || undefined,
    sizes: r.sizes || [],
    availableSizes: r.available_sizes || [],
    colors: r.colors || [],
    labels: r.labels || [],
    composition: { uz: r.composition_uz || '', ru: r.composition_ru || '' },
    description: { uz: r.description_uz || '', ru: r.description_ru || '' },
    images: r.images || []
  }
}

export function productToRow(p) {
  return {
    id: p.id,
    category: p.category,
    brand: p.brand,
    name_uz: p.name?.uz || '',
    name_ru: p.name?.ru || '',
    price: Number(p.price) || 0,
    old_price: p.oldPrice ? Number(p.oldPrice) : null,
    sizes: p.sizes || [],
    available_sizes: p.availableSizes || [],
    colors: p.colors || [],
    labels: p.labels || [],
    composition_uz: p.composition?.uz || '',
    composition_ru: p.composition?.ru || '',
    description_uz: p.description?.uz || '',
    description_ru: p.description?.ru || '',
    images: p.images || []
  }
}

export async function fetchProducts() {
  if (!hasSupabase) return SAMPLE_PRODUCTS
  const { data, error } = await supabase
    .from('products').select('*').order('created_at', { ascending: false })
  if (error) { console.error('[products]', error); return SAMPLE_PRODUCTS }
  if (!data || data.length === 0) return SAMPLE_PRODUCTS
  return data.map(rowToProduct)
}

export async function upsertProduct(product) {
  if (!hasSupabase) throw new Error('Supabase not configured')
  const row = productToRow(product)
  const { data, error } = await supabase.from('products').upsert(row).select().single()
  if (error) throw error
  return rowToProduct(data)
}

export async function deleteProduct(id) {
  if (!hasSupabase) throw new Error('Supabase not configured')
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) throw error
}

// ---- Orders ------------------------------------------------------------

export async function submitOrder(order) {
  if (!hasSupabase) {
    console.warn('[Viqor] Supabase not configured. Order saved to localStorage only.')
    const local = JSON.parse(localStorage.getItem('viqor_orders') || '[]')
    const rec = { ...order, id: `LOCAL-${Date.now()}`, status: 'new', created_at: new Date().toISOString() }
    local.push(rec)
    localStorage.setItem('viqor_orders', JSON.stringify(local))
    return rec.id
  }
  const { data: { user } } = await supabase.auth.getUser()
  const { data, error } = await supabase
    .from('orders')
    .insert({
      status: 'new',
      items: order.items,
      total: order.total,
      currency: order.currency || 'UZS',
      customer: order.customer,
      delivery: order.delivery,
      payment: order.payment,
      note: order.note || null,
      lang: order.lang || 'uz',
      user_id: user?.id || null
    })
    .select('id')
    .single()
  if (error) throw error
  return data.id
}

export async function fetchOrders({ status } = {}) {
  if (!hasSupabase) throw new Error('Supabase not configured')
  let q = supabase.from('orders').select('*').order('created_at', { ascending: false })
  if (status && status !== 'all') q = q.eq('status', status)
  const { data, error } = await q
  if (error) throw error
  return data
}

export async function fetchUserOrders() {
  if (!hasSupabase) return []
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []
  const { data, error } = await supabase
    .from('orders').select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function updateOrderStatus(id, status) {
  if (!hasSupabase) throw new Error('Supabase not configured')
  const { error } = await supabase.from('orders').update({ status }).eq('id', id)
  if (error) throw error
}

// ---- Storage -----------------------------------------------------------

export async function uploadProductImage(file) {
  if (!hasSupabase) throw new Error('Supabase not configured')
  const ext = file.name.split('.').pop()
  const path = `products/${crypto.randomUUID()}.${ext}`
  const { error } = await supabase.storage.from('viqor').upload(path, file, { cacheControl: '3600', upsert: false })
  if (error) throw error
  const { data } = supabase.storage.from('viqor').getPublicUrl(path)
  return data.publicUrl
}

// ---- Auth --------------------------------------------------------------

export async function signUp(email, password, meta = {}) {
  if (!hasSupabase) throw new Error('Supabase not configured')
  const { data, error } = await supabase.auth.signUp({ email, password, options: { data: meta } })
  if (error) throw error
  return data
}

export async function isCurrentUserAdmin() {
  if (!hasSupabase) return false
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false
  const { data, error } = await supabase.from('admins').select('user_id').eq('user_id', user.id).maybeSingle()
  if (error) { console.error('[isAdmin]', error); return false }
  return Boolean(data)
}

// ---- Profile -----------------------------------------------------------

export async function fetchProfile() {
  if (!hasSupabase) return null
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data, error } = await supabase.from('profiles').select('*').eq('user_id', user.id).maybeSingle()
  if (error) { console.error('[profile]', error); return null }
  return data
}

export async function upsertProfile({ name, phone }) {
  if (!hasSupabase) throw new Error('Supabase not configured')
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not signed in')
  const { error } = await supabase.from('profiles').upsert({
    user_id: user.id, name, phone, updated_at: new Date().toISOString()
  })
  if (error) throw error
}

// ---- Reviews -----------------------------------------------------------

export async function fetchReviews(productId) {
  if (!hasSupabase) return []
  const { data, error } = await supabase
    .from('reviews').select('*').eq('product_id', productId)
    .order('created_at', { ascending: false })
  if (error) { console.error('[reviews]', error); return [] }
  return data || []
}

export async function fetchAllRatings() {
  if (!hasSupabase) return {}
  const { data, error } = await supabase.from('product_ratings').select('*')
  if (error) { console.error('[ratings]', error); return {} }
  const map = {}
  for (const r of data || []) map[r.product_id] = { avg: Number(r.avg_rating), count: r.reviews_count }
  return map
}

export async function submitReview({ productId, rating, text }) {
  if (!hasSupabase) throw new Error('Supabase not configured')
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not signed in')
  const { error } = await supabase.from('reviews').upsert({
    product_id: productId, user_id: user.id, rating, text: text || null
  }, { onConflict: 'product_id,user_id' })
  if (error) throw error
}

export async function deleteMyReview(productId) {
  if (!hasSupabase) throw new Error('Supabase not configured')
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  const { error } = await supabase.from('reviews')
    .delete().eq('product_id', productId).eq('user_id', user.id)
  if (error) throw error
}
