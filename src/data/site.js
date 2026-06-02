// Единый источник правды по сайту: контакты, навигация, клиенты, материалы.
// Меняешь здесь — меняется везде (Header, Footer, Base).

export const site = {
  name: 'FREZOREZ',
  domain: 'frezorez.ru',
  url: 'https://frezorez.ru',
  tagline: 'Столярное производство в Москве с 2016 года',

  // SEO / верификация (вшиты в Base.astro)
  yandexVerification: 'b330e706b1ce79f4',
  metrikaId: 53352265,

  // Контакты — конверсия только через прямые каналы, форм нет (без ПДн)
  contacts: {
    phone: '+7 925 556-01-66',
    phoneHref: 'tel:+79255560166',
    email: 'info@frezorez.ru',
    emailHref: 'mailto:info@frezorez.ru',
    address: 'Москва, ул. Буракова, 6 стр. 2',
    metro: [
      'Семёновская', 'Электрозаводская', 'Соколиная гора',
      'Лефортово', 'Авиамоторная', 'Шоссе Энтузиастов',
    ],
    socials: [
      { label: 'Telegram', handle: '@frezorezwood', href: 'https://t.me/frezorezwood' },
      { label: 'WhatsApp', handle: '+7 925 556-01-66', href: 'https://wa.me/79255560166' },
      { label: 'ВКонтакте', handle: 'vk.com/public157944963', href: 'https://vk.com/public157944963' },
      { label: 'Instagram', handle: '@frezorez', href: 'https://instagram.com/frezorez' },
    ],
  },

  delivery: ['GettDelivery', 'Dostavista', 'Грузовичкоф', 'самовывоз'],

  // Навигация. href = слаг из pagemap.md (ключ = URL).
  // children разворачиваются в выпадающее меню.
  nav: [
    {
      label: 'Фрезеровка ЧПУ',
      href: '/frezerovka-chpy',
      children: [
        { label: 'Фрезеровка фанеры', href: '/frezerovka-fanery' },
        { label: 'Фрезеровка дерева', href: '/frezerovka-dereva' },
        { label: 'Фрезеровка МДФ', href: '/frezerovka-mdf' },
        { label: 'Фрезеровка ПВХ', href: '/frezerovka-pvh' },
        { label: 'Фрезеровка акрила', href: '/frezerovka-acryl' },
        { label: 'Фрезеровка композита', href: '/frezerovka-kompozita' },
        { label: '3D-фрезеровка', href: '/3d-frezerovka' },
      ],
    },
    { label: 'Лазерная резка', href: '/lazernaja-rezka' },
    {
      label: 'HoReCa и сувениры',
      href: '/izgotovlenie-produkcii-iz-horeca',
      children: [
        { label: 'Деревянная посуда', href: '/derevyannaya-posuda-dlya-barov-restoranov' },
        { label: 'Коробочки и пеналы', href: '/korobochki-penaly-iz-dereva' },
        { label: 'Балансиры и нейротренажёры', href: '/balansiry-nejrotrenazhery' },
        { label: 'Мебель из фанеры', href: '/mebel-iz-fanery' },
      ],
    },
    {
      label: 'Мебель',
      href: '/mebel-dlya-meropriyatij',
      children: [
        { label: 'Шезлонги с логотипом', href: '/shezlongi-iz-dereva' },
      ],
    },
    { label: 'Портфолио', href: '/portfolio' },
    { label: 'О нас', href: '/o-nas' },
    { label: 'Контакты', href: '/kontakty' },
  ],

  // B2B-proof. Логотипы кладутся в /public/content/partners/ (монохром по DESIGN.md).
  clients: [
    'Норникель', 'АндерСон', 'Азбука Вкуса', 'ВКонтакте', 'ВкусВилл',
    'Swarovski', 'Росгвардия', 'ОНФ', 'Max Mara',
  ],

  // Материалы (блок на главной). «Фрезеруем любые материалы, кроме железа.»
  materials: [
    'Фанера', 'Дерево', 'МДФ', 'ЛДСП', 'Акрил', 'ПВХ',
    'АКП (композит)', 'Поролон', 'Резина', 'Картон',
  ],
};
