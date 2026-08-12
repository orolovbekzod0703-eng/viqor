import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useUI = create(persist(
  (set) => ({
    lang: 'uz',
    setLang: (lang) => set({ lang }),
    cartOpen: false,
    setCartOpen: (v) => set({ cartOpen: v }),
    productId: null,
    openProduct: (id) => set({ productId: id }),
    closeProduct: () => set({ productId: null }),
    checkoutOpen: false,
    setCheckoutOpen: (v) => set({ checkoutOpen: v }),
    orderId: null,
    setOrderId: (id) => set({ orderId: id }),
    favoritesOpen: false,
    setFavoritesOpen: (v) => set({ favoritesOpen: v }),
    toast: null,
    showToast: (msg) => {
      set({ toast: msg })
      setTimeout(() => set({ toast: null }), 1800)
    }
  }),
  { name: 'viqor-ui', partialize: (s) => ({ lang: s.lang }) }
))
