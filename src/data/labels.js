export const LABELS = [
  { id: 'new',        name: { uz: 'Yangi', ru: 'Новое' },        classes: 'bg-emerald-600 text-white' },
  { id: 'bestseller', name: { uz: 'Bestseller', ru: 'Хит' },     classes: 'bg-amber-500 text-white' },
  { id: 'limited',    name: { uz: 'Cheklangan', ru: 'Лимит' },   classes: 'bg-purple-600 text-white' },
  { id: 'sale',       name: { uz: 'Aksiya', ru: 'Акция' },       classes: 'bg-brand-700 text-white' }
]

export const labelMeta = (id) => LABELS.find(l => l.id === id)
