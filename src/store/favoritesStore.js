import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useFavorites = create(persist(
  (set, get) => ({
    ids: [],
    toggle: (id) => set({
      ids: get().ids.includes(id) ? get().ids.filter(x => x !== id) : [...get().ids, id]
    }),
    has: (id) => get().ids.includes(id),
    count: () => get().ids.length,
    clear: () => set({ ids: [] })
  }),
  { name: 'viqor-favorites' }
))
