import { create } from 'zustand'

export const useProducts = create((set) => ({
  items: [],
  setItems: (items) => set({ items })
}))

export const setProducts = (items) => useProducts.getState().setItems(items)
export const getProduct = (id) => useProducts.getState().items.find(p => p.id === id)
