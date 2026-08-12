import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const keyOf = (productId, size, color) => `${productId}::${size || '-'}::${color || '-'}`

export const useCart = create(persist(
  (set, get) => ({
    items: [],
    add: (product, { size, color, qty = 1 } = {}) => {
      const k = keyOf(product.id, size, color)
      const existing = get().items.find(i => i.key === k)
      if (existing) {
        set({ items: get().items.map(i => i.key === k ? { ...i, qty: i.qty + qty } : i) })
      } else {
        set({
          items: [...get().items, {
            key: k,
            productId: product.id,
            name: product.name,
            brand: product.brand,
            image: product.images[0],
            price: product.price,
            oldPrice: product.oldPrice,
            size, color, qty
          }]
        })
      }
    },
    remove: (key) => set({ items: get().items.filter(i => i.key !== key) }),
    setQty: (key, qty) => set({
      items: qty <= 0
        ? get().items.filter(i => i.key !== key)
        : get().items.map(i => i.key === key ? { ...i, qty } : i)
    }),
    clear: () => set({ items: [] }),
    count: () => get().items.reduce((s, i) => s + i.qty, 0),
    total: () => get().items.reduce((s, i) => s + i.price * i.qty, 0)
  }),
  { name: 'viqor-cart' }
))
