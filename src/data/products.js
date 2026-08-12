// Namuna mahsulotlar. Firebase konfiguratsiya qilinsa, Firestore'dagi `products`
// kolleksiyasi shu tuzilishga mos bo'lishi kerak.

const img = (id, w = 800) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`

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
  {
    id: 'p01', category: 'shirts', brand: 'Viqor',
    name: { uz: 'Klassik oq ko\'ylak', ru: 'Классическая белая рубашка' },
    price: 349000, oldPrice: 429000,
    sizes: ['S', 'M', 'L', 'XL'], availableSizes: ['S', 'M', 'L'],
    colors: ['white', 'navy'],
    composition: { uz: '100% paxta', ru: '100% хлопок' },
    description: {
      uz: 'Ish va kundalik uslub uchun mos, yumshoq paxtadan tikilgan klassik ko\'ylak.',
      ru: 'Классическая рубашка из мягкого хлопка для работы и повседневной носки.'
    },
    images: [img('1602810318383-e386cc2a3ccf'), img('1596755094514-f87e34085b2c'), img('1620012253295-c15cc3e65df4')]
  },
  {
    id: 'p02', category: 'shirts', brand: 'Massimo Dutti',
    name: { uz: 'Slim-fit ko\'k ko\'ylak', ru: 'Slim-fit синяя рубашка' },
    price: 429000,
    sizes: ['S', 'M', 'L', 'XL'], availableSizes: ['M', 'L', 'XL'],
    colors: ['navy', 'gray'],
    composition: { uz: '95% paxta, 5% elastan', ru: '95% хлопок, 5% эластан' },
    description: {
      uz: 'Slim-fit qirqim, nozik va yengil mato. Kunlik va ofis uchun.',
      ru: 'Slim-fit крой, лёгкая и приятная ткань. Для офиса и на каждый день.'
    },
    images: [img('1603252109303-2751441dd157'), img('1520975916090-3105956dac38')]
  },
  {
    id: 'p03', category: 'tshirts', brand: 'Uniqlo',
    name: { uz: 'Basic qora futbolka', ru: 'Базовая чёрная футболка' },
    price: 129000, oldPrice: 169000,
    sizes: ['S', 'M', 'L', 'XL'], availableSizes: ['S', 'M', 'L', 'XL'],
    colors: ['black', 'white', 'gray'],
    composition: { uz: '100% paxta', ru: '100% хлопок' },
    description: {
      uz: 'Har kuni kiyish uchun mukammal — yumshoq va shakli buzilmaydigan.',
      ru: 'Идеально для повседневной носки — мягкая и держит форму.'
    },
    images: [img('1521572163474-6864f9cf17ab'), img('1583743814966-8936f5b7be1a')]
  },
  {
    id: 'p04', category: 'tshirts', brand: 'H&M',
    name: { uz: 'Oversized futbolka', ru: 'Oversized футболка' },
    price: 179000,
    sizes: ['S', 'M', 'L', 'XL'], availableSizes: ['M', 'L'],
    colors: ['white', 'olive', 'black'],
    composition: { uz: '100% organik paxta', ru: '100% органический хлопок' },
    description: {
      uz: 'Zamonaviy street-style uchun oversized qirqim.',
      ru: 'Oversized крой в стиле современного street-style.'
    },
    images: [img('1622445275463-afa2ab738c34'), img('1618354691373-d851c5c3a990')]
  },
  {
    id: 'p05', category: 'pants', brand: 'Zara',
    name: { uz: 'Chino shim, bej', ru: 'Чиносы, бежевые' },
    price: 389000,
    sizes: ['46', '48', '50', '52', '54'], availableSizes: ['48', '50', '52'],
    colors: ['beige', 'navy', 'olive'],
    composition: { uz: '98% paxta, 2% elastan', ru: '98% хлопок, 2% эластан' },
    description: {
      uz: 'Straight-fit chino shim. Klassika bilan zamonaviylik uyg\'unligi.',
      ru: 'Прямой крой chino. Классика с современным характером.'
    },
    images: [img('1624378439575-d8705ad7ae80'), img('1473966968600-fa801b869a1a')]
  },
  {
    id: 'p06', category: 'pants', brand: 'Boss',
    name: { uz: 'Klassik ish shim', ru: 'Классические брюки' },
    price: 549000, oldPrice: 649000,
    sizes: ['46', '48', '50', '52', '54', '56'], availableSizes: ['48', '50', '52', '54'],
    colors: ['black', 'navy'],
    composition: { uz: '70% jun, 30% polyester', ru: '70% шерсть, 30% полиэстер' },
    description: {
      uz: 'Ofis va biznes uchun mos, sifatli materialdan.',
      ru: 'Для офиса и деловых встреч, из качественного материала.'
    },
    images: [img('1594938291221-94f18cbb5660'), img('1541099649105-f69ad21f3246')]
  },
  {
    id: 'p07', category: 'suits', brand: 'Boss',
    name: { uz: 'Ikki qismli kostyum', ru: 'Костюм-двойка' },
    price: 1990000, oldPrice: 2450000,
    sizes: ['46', '48', '50', '52', '54'], availableSizes: ['48', '50', '52'],
    colors: ['navy', 'black', 'gray'],
    composition: { uz: '80% jun, 20% polyester', ru: '80% шерсть, 20% полиэстер' },
    description: {
      uz: 'To\'y va rasmiy tadbirlar uchun elegant kostyum.',
      ru: 'Элегантный костюм для свадеб и официальных мероприятий.'
    },
    images: [img('1594938298603-c8148c4dae35'), img('1507679799987-c73779587ccf')]
  },
  {
    id: 'p08', category: 'jackets', brand: 'Zara',
    name: { uz: 'Bomber kurtka', ru: 'Куртка-бомбер' },
    price: 749000,
    sizes: ['S', 'M', 'L', 'XL'], availableSizes: ['M', 'L', 'XL'],
    colors: ['black', 'olive'],
    composition: { uz: 'Tashqi: 100% neylon; Astar: 100% polyester', ru: 'Верх: 100% нейлон; Подкладка: 100% полиэстер' },
    description: {
      uz: 'Yengil va sport uslubidagi bomber. Kuz-bahor uchun.',
      ru: 'Лёгкий бомбер в спортивном стиле. Для весны и осени.'
    },
    images: [img('1591047139829-d91aecb6caea'), img('1551028719-00167b16eac5')]
  },
  {
    id: 'p09', category: 'jackets', brand: 'Massimo Dutti',
    name: { uz: 'Uzun jun palto', ru: 'Длинное шерстяное пальто' },
    price: 1590000,
    sizes: ['S', 'M', 'L', 'XL'], availableSizes: ['M', 'L'],
    colors: ['beige', 'black', 'navy'],
    composition: { uz: '90% jun, 10% kashemir', ru: '90% шерсть, 10% кашемир' },
    description: {
      uz: 'Sifatli va issiq palto. Ish va rasmiy uslub uchun.',
      ru: 'Качественное и тёплое пальто. Для делового и официального стиля.'
    },
    images: [img('1520975954732-35dd22299614'), img('1544022613-e87ca75a784a')]
  },
  {
    id: 'p10', category: 'knitwear', brand: 'Uniqlo',
    name: { uz: 'Merinos svitari', ru: 'Свитер из мериноса' },
    price: 459000,
    sizes: ['S', 'M', 'L', 'XL'], availableSizes: ['S', 'M', 'L', 'XL'],
    colors: ['gray', 'brown', 'navy'],
    composition: { uz: '100% merinos juni', ru: '100% шерсть мериноса' },
    description: {
      uz: 'Yumshoq va issiq merinos svitari.',
      ru: 'Мягкий и тёплый свитер из мериноса.'
    },
    images: [img('1620799140408-edc6dcb6d633'), img('1608744882201-52a7f7f3dfa2')]
  },
  {
    id: 'p11', category: 'knitwear', brand: 'H&M',
    name: { uz: 'Kardigan', ru: 'Кардиган' },
    price: 379000, oldPrice: 449000,
    sizes: ['S', 'M', 'L', 'XL'], availableSizes: ['S', 'M'],
    colors: ['beige', 'gray'],
    composition: { uz: '70% paxta, 30% akril', ru: '70% хлопок, 30% акрил' },
    description: {
      uz: 'Yengil va zamonaviy kardigan.',
      ru: 'Лёгкий и современный кардиган.'
    },
    images: [img('1516762689617-e1cffcef479d'), img('1606813907291-d86efa9b94db')]
  },
  {
    id: 'p12', category: 'shoes', brand: 'Zara',
    name: { uz: 'Charm klassik tuflilar', ru: 'Классические кожаные туфли' },
    price: 890000,
    sizes: ['40', '41', '42', '43', '44'], availableSizes: ['41', '42', '43'],
    colors: ['black', 'brown'],
    composition: { uz: 'Tabiiy charm', ru: 'Натуральная кожа' },
    description: {
      uz: 'Rasmiy tadbirlar uchun klassik dizayn.',
      ru: 'Классический дизайн для официальных случаев.'
    },
    images: [img('1614252369475-531eba835eb1'), img('1449505278894-297fdb3edbc1')]
  },
  {
    id: 'p13', category: 'shoes', brand: 'Uniqlo',
    name: { uz: 'Oq krossovkalar', ru: 'Белые кроссовки' },
    price: 690000, oldPrice: 790000,
    sizes: ['40', '41', '42', '43', '44'], availableSizes: ['40', '41', '42', '43', '44'],
    colors: ['white'],
    composition: { uz: 'Sun\'iy charm', ru: 'Искусственная кожа' },
    description: {
      uz: 'Har kuni kiyish uchun qulay oq krossovkalar.',
      ru: 'Удобные белые кроссовки на каждый день.'
    },
    images: [img('1542291026-7eec264c27ff'), img('1595950653106-6c9ebd614d3a')]
  },
  {
    id: 'p14', category: 'accessories', brand: 'Boss',
    name: { uz: 'Charm kamar', ru: 'Кожаный ремень' },
    price: 259000,
    sizes: ['S', 'M', 'L'], availableSizes: ['M', 'L'],
    colors: ['black', 'brown'],
    composition: { uz: 'Tabiiy charm, metall qadash', ru: 'Натуральная кожа, металлическая пряжка' },
    description: {
      uz: 'Zamonaviy va bardoshli charm kamar.',
      ru: 'Современный и прочный кожаный ремень.'
    },
    images: [img('1624222247344-550fb60583dc'), img('1614252235316-8c857d38b5f4')]
  },
  {
    id: 'p15', category: 'accessories', brand: 'Zara',
    name: { uz: 'Ipak galstuk', ru: 'Шёлковый галстук' },
    price: 189000,
    sizes: ['One'], availableSizes: ['One'],
    colors: ['navy', 'black', 'gray'],
    composition: { uz: '100% ipak', ru: '100% шёлк' },
    description: {
      uz: 'Rasmiy uslub uchun mukammal galstuk.',
      ru: 'Идеальный галстук для формального стиля.'
    },
    images: [img('1607541572562-9d94c76c9218'), img('1621786030484-4c855eed6974')]
  },
  {
    id: 'p16', category: 'tshirts', brand: 'Viqor',
    name: { uz: 'Polo futbolka', ru: 'Поло-футболка' },
    price: 249000,
    sizes: ['S', 'M', 'L', 'XL'], availableSizes: ['S', 'M', 'L'],
    colors: ['navy', 'white', 'black'],
    composition: { uz: '100% pique paxta', ru: '100% хлопок пике' },
    description: {
      uz: 'Klassika bilan sport uslub o\'rtasidagi mukammal tanlov.',
      ru: 'Идеальный выбор между классикой и спортивным стилем.'
    },
    images: [img('1586790170083-2f9ceadc732d'), img('1618354691229-e11c9d43e2b3')]
  }
]
