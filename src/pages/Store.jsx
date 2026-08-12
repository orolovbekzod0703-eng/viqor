import { useEffect, useMemo, useState } from 'react'
import { PRODUCTS as SAMPLE_PRODUCTS } from '../data/products'
import { fetchProducts, fetchAllRatings } from '../supabase'
import { useRatings } from '../store/ratingsStore'
import { Header } from '../components/Header'
import { PromoBanner } from '../components/PromoBanner'
import { HeroSlider } from '../components/HeroSlider'
import { CategoryChips } from '../components/CategoryChips'
import { FilterPanel } from '../components/FilterPanel'
import { ProductGrid } from '../components/ProductGrid'
import { CartDrawer } from '../components/CartDrawer'
import { FavoritesDrawer } from '../components/FavoritesDrawer'
import { ProductModal } from '../components/ProductModal'
import { CheckoutModal } from '../components/CheckoutModal'
import { OrderSuccess } from '../components/OrderSuccess'
import { Footer } from '../components/Footer'
import { Toast } from '../components/Toast'
import { useI18n } from '../hooks/useI18n'
import { setProducts, useProducts } from '../store/productsStore'

export default function Store() {
  const { lang } = useI18n()
  const products = useProducts(s => s.items)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [filters, setFilters] = useState({ sizes: [], colors: [], brands: [], min: '', max: '' })

  useEffect(() => {
    let alive = true
    setProducts(SAMPLE_PRODUCTS)
    fetchProducts().then(list => { if (alive && list?.length) setProducts(list) })
    fetchAllRatings().then(map => { if (alive) useRatings.getState().setMap(map) })
    return () => { alive = false }
  }, [])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return products.filter(p => {
      if (category !== 'all' && p.category !== category) return false
      if (q) {
        const hay = [p.name.uz, p.name.ru, p.brand].join(' ').toLowerCase()
        if (!hay.includes(q)) return false
      }
      if (filters.sizes.length && !filters.sizes.some(s => p.availableSizes.includes(s))) return false
      if (filters.colors.length && !filters.colors.some(c => p.colors.includes(c))) return false
      if (filters.brands.length && !filters.brands.includes(p.brand)) return false
      const min = Number(filters.min) || 0
      const max = Number(filters.max) || Infinity
      if (p.price < min || p.price > max) return false
      return true
    })
  }, [products, search, category, filters])

  return (
    <div className="min-h-screen flex flex-col">
      <PromoBanner />
      <Header search={search} setSearch={setSearch} />
      <main className="flex-1">
        <HeroSlider />
        <CategoryChips active={category} onChange={setCategory} />

        <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-6 flex gap-6">
          <FilterPanel filters={filters} setFilters={setFilters} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-brand-400">
                <b className="text-brand-700">{filtered.length}</b> {lang === 'uz' ? 'ta mahsulot' : 'товаров'}
              </div>
            </div>
            <ProductGrid products={filtered} />
          </div>
        </section>
      </main>
      <Footer />

      <CartDrawer />
      <FavoritesDrawer />
      <ProductModal />
      <CheckoutModal />
      <OrderSuccess />
      <Toast />
    </div>
  )
}
