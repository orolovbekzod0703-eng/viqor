const S = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.75, strokeLinecap: 'round', strokeLinejoin: 'round' }

export const IconSearch = (p) => (
  <svg viewBox="0 0 24 24" width="20" height="20" {...S} {...p}>
    <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
  </svg>
)
export const IconHeart = ({ filled, ...p }) => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6C19 16.5 12 21 12 21z" />
  </svg>
)
export const IconBag = (p) => (
  <svg viewBox="0 0 24 24" width="22" height="22" {...S} {...p}>
    <path d="M6 8h12l-1 12H7L6 8z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" />
  </svg>
)
export const IconClose = (p) => (
  <svg viewBox="0 0 24 24" width="20" height="20" {...S} {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
)
export const IconMinus = (p) => (
  <svg viewBox="0 0 24 24" width="16" height="16" {...S} {...p}><path d="M5 12h14" /></svg>
)
export const IconPlus = (p) => (
  <svg viewBox="0 0 24 24" width="16" height="16" {...S} {...p}><path d="M12 5v14M5 12h14" /></svg>
)
export const IconChevron = (p) => (
  <svg viewBox="0 0 24 24" width="18" height="18" {...S} {...p}><path d="m9 6 6 6-6 6" /></svg>
)
export const IconFilter = (p) => (
  <svg viewBox="0 0 24 24" width="18" height="18" {...S} {...p}>
    <path d="M4 6h16M7 12h10M10 18h4" />
  </svg>
)
export const IconCheck = (p) => (
  <svg viewBox="0 0 24 24" width="18" height="18" {...S} {...p}><path d="m5 13 4 4L19 7" /></svg>
)
export const IconTrash = (p) => (
  <svg viewBox="0 0 24 24" width="18" height="18" {...S} {...p}>
    <path d="M4 7h16M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13" />
  </svg>
)
export const IconTruck = (p) => (
  <svg viewBox="0 0 24 24" width="20" height="20" {...S} {...p}>
    <path d="M3 7h11v10H3zM14 10h4l3 3v4h-7z" /><circle cx="7" cy="18" r="2" /><circle cx="17" cy="18" r="2" />
  </svg>
)
export const IconStore = (p) => (
  <svg viewBox="0 0 24 24" width="20" height="20" {...S} {...p}>
    <path d="M4 9h16l-1-4H5L4 9zM5 9v11h14V9M9 20v-5h6v5" />
  </svg>
)
