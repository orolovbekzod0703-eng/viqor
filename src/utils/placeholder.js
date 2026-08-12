// Har mahsulot uchun brendli SVG placeholder — real rasm yuklanmasa zaxira.

const CATEGORY_ICON = {
  shirts:      'M60 40h60l-8 20-10 100h-24l-10-100-8-20zM70 40l-15-8 20-12h50l20 12-15 8',
  tshirts:     'M55 55h70v90h-70zM55 55l-15 15 10 15 15-10zM125 55l15 15-10 15-15-10',
  pants:       'M65 40h50l5 130h-25l-8-70-8 70h-24z',
  suits:       'M55 40h70v20l-15 90h-40l-15-90zM90 40v70',
  jackets:     'M50 45h80v100h-80zM90 45v100M50 45l-10 15v70l10 5M130 45l10 15v70l-10 5',
  knitwear:    'M50 55h80l-5 90h-70zM60 55v-8a10 10 0 0 1 20 0M100 55v-8a10 10 0 0 1 20 0',
  shoes:       'M40 100c0-15 25-30 60-30s60 15 60 30v10H40zM40 110h120M50 90l10-10M70 85l10-10',
  accessories: 'M60 60c0-15 15-25 30-25s30 10 30 25v20h-60zM50 80h80l5 60h-90z'
}

const GRADS = [
  ['#08152E', '#1A2D5B'],
  ['#0B1B3B', '#2F467A'],
  ['#050E1F', '#586C9A']
]

function esc(s = '') {
  return String(s).replace(/[<>&"']/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' }[c]))
}

function trunc(s, n) { return s.length > n ? s.slice(0, n - 1) + '…' : s }

export function placeholderFor(product, variant = 0) {
  const [c1, c2] = GRADS[variant % 3]
  const nm = trunc(product?.name?.uz || 'Mahsulot', 26)
  const brand = product?.brand || ''
  const icon = CATEGORY_ICON[product?.category] || CATEGORY_ICON.shirts

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${c1}"/>
        <stop offset="100%" stop-color="${c2}"/>
      </linearGradient>
      <radialGradient id="r" cx="0.7" cy="0.3" r="0.8">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.15"/>
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="600" height="800" fill="url(#g)"/>
    <rect width="600" height="800" fill="url(#r)"/>
    <g transform="translate(210 250) scale(2.2)" fill="none" stroke="#ffffff" stroke-opacity="0.55" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
      <path d="${icon}"/>
    </g>
    <text x="300" y="640" text-anchor="middle" fill="#ffffff" font-family="Inter, system-ui, sans-serif" font-weight="800" font-size="34" opacity="0.98">${esc(nm)}</text>
    <text x="300" y="680" text-anchor="middle" fill="#ffffff" font-family="Inter, system-ui, sans-serif" font-weight="500" font-size="20" opacity="0.7">${esc(brand)}</text>
    <text x="300" y="760" text-anchor="middle" fill="#ffffff" font-family="Inter, system-ui, sans-serif" font-weight="800" font-size="14" letter-spacing="8" opacity="0.85">VIQOR</text>
  </svg>`
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg)
}
