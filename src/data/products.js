// Namuna mahsulotlar. Firebase/Supabase konfiguratsiya qilinsa,
// DB'dagi `products` kolleksiyasi shu tuzilishga mos bo'lishi kerak.
//
// Rasmlar — brendli SVG placeholder (kategoriya ikonasi + nom + brend + logo).
// Admin panel orqali haqiqiy fotolar yuklansa, ular placeholder o'rniga chiqadi.

import { placeholderFor } from '../utils/placeholder'

const withImages = (p) => ({
  ...p,
  images: [placeholderFor(p, 0), placeholderFor(p, 1), placeholderFor(p, 2)]
})

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
      uz: 'Slim-fit qirqim, nozik va yengil mato.',
      ru: 'Slim-fit крой, лёгкая и приятная ткань.'
    } },
  { id: 'p03', category: 'tshirts', brand: 'Uniqlo',
    name: { uz: 'Basic qora futbolka', ru: 'Базовая чёрная футболка' },
    price: 129000, oldPrice: 169000,
    sizes: ['S', 'M', 'L', 'XL'], availableSizes: ['S', 'M', 'L', 'XL'],
    colors: ['black', 'white', 'gray'],
    composition: { uz: '100% paxta', ru: '100% хлопок' },
    description: {
      uz: 'Har kuni kiyish uchun mukammal.',
      ru: 'Идеально для повседневной носки.'
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
      uz: 'Straight-fit chino shim.',
      ru: 'Прямой крой chino.'
    } },
  { id: 'p06', category: 'pants', brand: 'Boss',
    name: { uz: 'Klassik ish shim', ru: 'Классические брюки' },
    price: 549000, oldPrice: 649000,
    sizes: ['46', '48', '50', '52', '54', '56'], availableSizes: ['48', '50', '52', '54'],
    colors: ['black', 'navy'],
    composition: { uz: '70% jun, 30% polyester', ru: '70% шерсть, 30% полиэстер' },
    description: {
      uz: 'Ofis va biznes uchun sifatli material.',
      ru: 'Для офиса и деловых встреч.'
    } },
  { id: 'p07', category: 'suits', brand: 'Boss',
    name: { uz: 'Ikki qismli kostyum', ru: 'Костюм-двойка' },
    price: 1990000, oldPrice: 2450000,
    sizes: ['46', '48', '50', '52', '54'], availableSizes: ['48', '50', '52'],
    colors: ['navy', 'black', 'gray'],
    composition: { uz: '80% jun, 20% polyester', ru: '80% шерсть, 20% полиэстер' },
    description: {
      uz: 'To\'y va rasmiy tadbirlar uchun elegant kostyum.',
      ru: 'Элегантный костюм для свадеб и мероприятий.'
    } },
  { id: 'p08', category: 'jackets', brand: 'Zara',
    name: { uz: 'Bomber kurtka', ru: 'Куртка-бомбер' },
    price: 749000,
    sizes: ['S', 'M', 'L', 'XL'], availableSizes: ['M', 'L', 'XL'],
    colors: ['black', 'olive'],
    composition: { uz: '100% neylon', ru: '100% нейлон' },
    description: {
      uz: 'Yengil sport uslubidagi bomber.',
      ru: 'Лёгкий бомбер в спортивном стиле.'
    } },
  { id: 'p09', category: 'jackets', brand: 'Massimo Dutti',
    name: { uz: 'Uzun jun palto', ru: 'Длинное шерстяное пальто' },
    price: 1590000,
    sizes: ['S', 'M', 'L', 'XL'], availableSizes: ['M', 'L'],
    colors: ['beige', 'black', 'navy'],
    composition: { uz: '90% jun, 10% kashemir', ru: '90% шерсть, 10% кашемир' },
    description: {
      uz: 'Sifatli va issiq palto.',
      ru: 'Качественное и тёплое пальто.'
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
    composition: { uz: 'Tabiiy charm', ru: 'Натуральная кожа' },
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
      uz: 'Klassika bilan sport uslub o\'rtasidagi tanlov.',
      ru: 'Между классикой и спортивным стилем.'
    } }
].map(withImages)
