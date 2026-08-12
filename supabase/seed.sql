-- Namuna mahsulotlar. Ixtiyoriy — dev/demo uchun.
-- schema.sql dan keyin ishga tushiring.

insert into public.products
  (id, category, brand, name_uz, name_ru, price, old_price, sizes, available_sizes, colors, composition_uz, composition_ru, description_uz, description_ru, images)
values
  ('p01','shirts','Viqor','Klassik oq ko''ylak','Классическая белая рубашка',349000,429000,
   array['S','M','L','XL'], array['S','M','L'], array['white','navy'],
   '100% paxta','100% хлопок',
   'Ish va kundalik uslub uchun mos, yumshoq paxtadan tikilgan klassik ko''ylak.',
   'Классическая рубашка из мягкого хлопка для работы и повседневной носки.',
   array['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80']),
  ('p03','tshirts','Uniqlo','Basic qora futbolka','Базовая чёрная футболка',129000,169000,
   array['S','M','L','XL'], array['S','M','L','XL'], array['black','white','gray'],
   '100% paxta','100% хлопок',
   'Har kuni kiyish uchun mukammal.','Идеально для повседневной носки.',
   array['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80']),
  ('p05','pants','Zara','Chino shim, bej','Чиносы, бежевые',389000,null,
   array['46','48','50','52','54'], array['48','50','52'], array['beige','navy','olive'],
   '98% paxta, 2% elastan','98% хлопок, 2% эластан',
   'Straight-fit chino shim.','Прямой крой chino.',
   array['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80'])
on conflict (id) do nothing;
