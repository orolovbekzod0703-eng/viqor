// Namuna mahsulotlar. Firebase/Supabase konfiguratsiya qilinsa,
// DB'dagi `products` kolleksiyasi shu tuzilishga mos bo'lishi kerak.
//
// Rasmlar — SVG placeholder (kiyim ikonasi + nom + brend). Admin panelda
// yangi mahsulot qo'shishda haqiqiy rasmlar Supabase Storage'ga yuklanadi
// va bu placeholderlar o'rniga chiroyli photolar chiqadi.

const CATEGORY_ICON = {
  shirts: 'M60 40h60l-8 20-10 100h-24l-10-100-8-20zM70 40l-15-8 20-12h50l20 12-15 8',
  tshirts: 'M55 55h70v90h-70zM55 55l-15 15 10 15 15-10zM125 55l15 15-10 15-15-10',
  pants: 'M65 40h50l5 130h-25l-8-70-8 70h-24z',
  suits: 'M55 40h70v20l-15 90h-40l-15-90zM90 40v70',
  jackets: 'M50 45h80v100h-80zM90 45v100M50 45l-10 15v70l10 5M130 45l10 15v70l-10 5',
  knitwear: 'M50 55h80l-5 90h-70zM60 55v-8a10 10 0 0 1 20 0M100 55v-8a10 10 0 0 1 20 0',
  shoes: 'M40 100c0-15 25-30 60-30s60 15 60 30v10H40zM40 110h120M50 90l10-10M70 85l10-10',
  accessories: 'M60 60c0-15 15-25 30-25s30 10 30 25v20h-60zM50 80h80l5 60h-90z'
}

function catIcon(cat) {
  return CATEGORY_ICON[cat] || CATEGORY_ICON.shirts
}

function esc(s = '') {
  return String(s).replace(/[<>&"']/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' }[c]))
}

function trunc(s, n) { return s.length > n ? s.slice(0, n - 1) + '…' : s }

// Har rasm — 3:4 nisbatda, brend rangi bilan gradient
function img(product, variant = 0) {
  const grads = [
    ['#08152E', '#1A2D5B'],
    ['#0B1B3B', '#2F467A'],
    ['#050E1F', '#586C9A']
  ]
  const [c1, c2] = grads[variant % 3]
  const name = trunc(product.name.uz, 26)
  const icon = catIcon(product.category)

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
    <text x="300" y="640" text-anchor="middle" fill="#ffffff" font-family="Inter, system-ui, sans-serif" font-weight="800" font-size="34" opacity="0.98">${esc(name)}</text>
    <text x="300" y="680" text-anchor="middle" fill="#ffffff" font-family="Inter, system-ui, sans-serif" font-weight="500" font-size="20" opacity="0.7">${esc(product.brand)}</text>
    <text x="300" y="760" text-anchor="middle" fill="#ffffff" font-family="Inter, system-ui, sans-serif" font-weight="800" font-size="14" letter-spacing="8" opacity="0.85">VIQOR</text>
  </svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

function withImages(p) {
  return { ...p, images: [img(p, 0), img(p, 1), img(p, 2)] }
}

export const CATEGORIES = [
  { id: 'all', key: 'all' },
  { id: 'shirts', key: 'shirts' },
  { id: 'tshirts', key: 'tshirts' },
  { id: 'pants', key: 'pants' },
  { id: 'suits', key: 'suits' },
  { id: 'jackets', key: 'jackets' },
  { id: 'knitwear', key: 'knitwear' },
  { id: 'shoes', key: 'shoes' },
  { id: 'accessories', key: 'accessories' }
]

export const BRANDS = ['Viqor', 'Zara', 'Massimo Dutti', 'Uniqlo', 'H&M', 'Boss']

export const COLORS = [
  { id: 'black', name: { uz: 'Qora', ru: 'Чёрный' }, hex: '#111827' },
  { id: 'white', name: { uz: 'Oq', ru: 'Белый' }, hex: '#F8FAFC' },
  { id: 'navy', name: { uz: 'Ko\'k', ru: 'Синий' }, hex: '#1E3A8A' },
  { id: 'gray', name: { uz: 'Kulrang', ru: 'Серый' }, hex: '#6B7280' },
  { id: 'beige', name: { uz: 'Bej', ru: 'Бежевый' }, hex: '#D6C7A6' },
  { id: 'brown', name: { uz: 'Jigarrang', ru: 'Коричневый' }, hex: '#78350F' },
  { id: 'olive', name: { uz: 'Zaytun', ru: 'Оливковый' }, hex: '#556B2F' }
]

export const PRODUCTS = [
  { id: 'p01', category: 'shirts', brand: 'Viqor',
    name: { uz: 'Klassik oq ko\'ylak', ru: 'Классическая белая рубашка' },
    price: 349000, oldPrice: 429000,
    sizes: ['S', 'M', 'L', 'XL'], availableSizes: ['S', 'M', 'L'],
    colors: ['white', 'navy'],
    composition: { uz: '100% paxta', ru: '100% хлопок' },
    description: {
      uz: 'Ish va kundalik uslub uchun mos, yumshoq paxtadan tikilgan klassik ko\'ylak.',
      ru: 'Классическая рубашка из мягкого хлопка для работы и повседневной носки.'
    } },
  { id: 'p02', category: 'shirts', brand: 'Massimo Dutti',
    name: { uz: 'Slim-fit ko\'k ko\'ylak', ru: 'Slim-fit синяя рубашка' },
    price: 429000,
    sizes: ['S', 'M', 'L', 'XL'], availableSizes: ['M', 'L', 'XL'],
    colors: ['navy', 'gray'],
    composition: { uz: '95% paxta, 5% elastan', ru: '95% хлопок, 5% эластан' },
    description: {
      uz: 'Slim-fit qirqim, nozik va yengil mato. Kunlik va ofis uchun.',
      ru: 'Slim-fit крой, лёгкая и приятная ткань. Для офиса и на каждый день.'
    } },
  { id: 'p03', category: 'tshirts', brand: 'Uniqlo',
    name: { uz: 'Basic qora futbolka', ru: 'Базовая чёрная футболка' },
    price: 129000, oldPrice: 169000,
    sizes: ['S', 'M', 'L', 'XL'], availableSizes: ['S', 'M', 'L', 'XL'],
    colors: ['black', 'white', 'gray'],
    composition: { uz: '100% paxta', ru: '100% хлопок' },
    description: {
      uz: 'Har kuni kiyish uchun mukammal — yumshoq va shakli buzilmaydigan.',
      ru: 'Идеально для повседневной носки — мягкая и держит форму.'
    } },
  { id: 'p04', category: 'tshirts', brand: 'H&M',
    name: { uz: 'Oversized futbolka', ru: 'Oversized футболка' },
    price: 179000,
    sizes: ['S', 'M', 'L', 'XL'], availableSizes: ['M', 'L'],
    colors: ['white', 'olive', 'black'],
    composition: { uz: '100% organik paxta', ru: '100% органический хлопок' },
    description: {
      uz: 'Zamonaviy street-style uchun oversized qirqim.',
      ru: 'Oversized крой в стиле современного street-style.'
    } },
  { id: 'p05', category: 'pants', brand: 'Zara',
    name: { uz: 'Chino shim, bej', ru: 'Чиносы, бежевые' },
    price: 389000,
    sizes: ['46', '48', '50', '52', '54'], availableSizes: ['48', '50', '52'],
    colors: ['beige', 'navy', 'olive'],
    composition: { uz: '98% paxta, 2% elastan', ru: '98% хлопок, 2% эластан' },
    description: {
      uz: 'Straight-fit chino shim. Klassika bilan zamonaviylik uyg\'unligi.',
      ru: 'Прямой крой chino. Классика с современным характером.'
    } },
  { id: 'p06', category: 'pants', brand: 'Boss',
    name: { uz: 'Klassik ish shim', ru: 'Классические брюки' },
    price: 549000, oldPrice: 649000,
    sizes: ['46', '48', '50', '52', '54', '56'], availableSizes: ['48', '50', '52', '54'],
    colors: ['black', 'navy'],
    composition: { uz: '70% jun, 30% polyester', ru: '70% шерсть, 30% полиэстер' },
    description: {
      uz: 'Ofis va biznes uchun mos, sifatli materialdan.',
      ru: 'Для офиса и деловых встреч, из качественного материала.'
    } },
  { id: 'p07', category: 'suits', brand: 'Boss',
    name: { uz: 'Ikki qismli kostyum', ru: 'Костюм-двойка' },
    price: 1990000, oldPrice: 2450000,
    sizes: ['46', '48', '50', '52', '54'], availableSizes: ['48', '50', '52'],
    colors: ['navy', 'black', 'gray'],
    composition: { uz: '80% jun, 20% polyester', ru: '80% шерсть, 20% полиэстер' },
    description: {
      uz: 'To\'y va rasmiy tadbirlar uchun elegant kostyum.',
      ru: 'Элегантный костюм для свадеб и официальных мероприятий.'
    } },
  { id: 'p08', category: 'jackets', brand: 'Zara',
    name: { uz: 'Bomber kurtka', ru: 'Куртка-бомбер' },
    price: 749000,
    sizes: ['S', 'M', 'L', 'XL'], availableSizes: ['M', 'L', 'XL'],
    colors: ['black', 'olive'],
    composition: { uz: 'Tashqi: 100% neylon; Astar: 100% polyester', ru: 'Верх: 100% нейлон; Подкладка: 100% полиэстер' },
    description: {
      uz: 'Yengil va sport uslubidagi bomber. Kuz-bahor uchun.',
      ru: 'Лёгкий бомбер в спортивном стиле. Для весны и осени.'
    } },
  { id: 'p09', category: 'jackets', brand: 'Massimo Dutti',
    name: { uz: 'Uzun jun palto', ru: 'Длинное шерстяное пальто' },
    price: 1590000,
    sizes: ['S', 'M', 'L', 'XL'], availableSizes: ['M', 'L'],
    colors: ['beige', 'black', 'navy'],
    composition: { uz: '90% jun, 10% kashemir', ru: '90% шерсть, 10% кашемир' },
    description: {
      uz: 'Sifatli va issiq palto. Ish va rasmiy uslub uchun.',
      ru: 'Качественное и тёплое пальто. Для делового и официального стиля.'
    } },
  { id: 'p10', category: 'knitwear', brand: 'Uniqlo',
    name: { uz: 'Merinos svitari', ru: 'Свитер из мериноса' },
    price: 459000,
    sizes: ['S', 'M', 'L', 'XL'], availableSizes: ['S', 'M', 'L', 'XL'],
    colors: ['gray', 'brown', 'navy'],
    composition: { uz: '100% merinos juni', ru: '100% шерсть мериноса' },
    description: {
      uz: 'Yumshoq va issiq merinos svitari.',
      ru: 'Мягкий и тёплый свитер из мериноса.'
    } },
  { id: 'p11', category: 'knitwear', brand: 'H&M',
    name: { uz: 'Kardigan', ru: 'Кардиган' },
    price: 379000, oldPrice: 449000,
    sizes: ['S', 'M', 'L', 'XL'], availableSizes: ['S', 'M'],
    colors: ['beige', 'gray'],
    composition: { uz: '70% paxta, 30% akril', ru: '70% хлопок, 30% акрил' },
    description: {
      uz: 'Yengil va zamonaviy kardigan.',
      ru: 'Лёгкий и современный кардиган.'
    } },
  { id: 'p12', category: 'shoes', brand: 'Zara',
    name: { uz: 'Charm klassik tuflilar', ru: 'Классические кожаные туфли' },
    price: 890000,
    sizes: ['40', '41', '42', '43', '44'], availableSizes: ['41', '42', '43'],
    colors: ['black', 'brown'],
    composition: { uz: 'Tabiiy charm', ru: 'Натуральная кожа' },
    description: {
      uz: 'Rasmiy tadbirlar uchun klassik dizayn.',
      ru: 'Классический дизайн для официальных случаев.'
    } },
  { id: 'p13', category: 'shoes', brand: 'Uniqlo',
    name: { uz: 'Oq krossovkalar', ru: 'Белые кроссовки' },
    price: 690000, oldPrice: 790000,
    sizes: ['40', '41', '42', '43', '44'], availableSizes: ['40', '41', '42', '43', '44'],
    colors: ['white'],
    composition: { uz: 'Sun\'iy charm', ru: 'Искусственная кожа' },
    description: {
      uz: 'Har kuni kiyish uchun qulay oq krossovkalar.',
      ru: 'Удобные белые кроссовки на каждый день.'
    } },
  { id: 'p14', category: 'accessories', brand: 'Boss',
    name: { uz: 'Charm kamar', ru: 'Кожаный ремень' },
    price: 259000,
    sizes: ['S', 'M', 'L'], availableSizes: ['M', 'L'],
    colors: ['black', 'brown'],
    composition: { uz: 'Tabiiy charm, metall qadash', ru: 'Натуральная кожа, металлическая пряжка' },
    description: {
      uz: 'Zamonaviy va bardoshli charm kamar.',
      ru: 'Современный и прочный кожаный ремень.'
    } },
  { id: 'p15', category: 'accessories', brand: 'Zara',
    name: { uz: 'Ipak galstuk', ru: 'Шёлковый галстук' },
    price: 189000,
    sizes: ['One'], availableSizes: ['One'],
    colors: ['navy', 'black', 'gray'],
    composition: { uz: '100% ipak', ru: '100% шёлк' },
    description: {
      uz: 'Rasmiy uslub uchun mukammal galstuk.',
      ru: 'Идеальный галстук для формального стиля.'
    } },
  { id: 'p16', category: 'tshirts', brand: 'Viqor',
    name: { uz: 'Polo futbolka', ru: 'Поло-футболка' },
    price: 249000,
    sizes: ['S', 'M', 'L', 'XL'], availableSizes: ['S', 'M', 'L'],
    colors: ['navy', 'white', 'black'],
    composition: { uz: '100% pique paxta', ru: '100% хлопок пике' },
    description: {
      uz: 'Klassika bilan sport uslub o\'rtasidagi mukammal tanlov.',
      ru: 'Идеальный выбор между классикой и спортивным стилем.'
    } }
].map(withImages)
