import { create } from 'zustand'

export const useRatings = create((set) => ({
  map: {},
  setMap: (map) => set({ map }),
  setOne: (id, avg, count) => set(s => ({ map: { ...s.map, [id]: { avg, count } } }))
}))
