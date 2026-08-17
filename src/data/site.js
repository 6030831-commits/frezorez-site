// Единый источник правды по сайту: контакты, навигация, клиенты, материалы.
// Меняешь здесь — меняется везде (Header, Footer, Base).

// Канонический вид внутреннего пути. build.format:'directory' + trailingSlash:'always'
// => 200 отдаётся ТОЛЬКО по адресу со слэшем, бесслэшевый вариант nginx 301-редиректит.
// Поэтому все внутренние ссылки в разметке гоняем через slashed(), иначе каждый клик
// и каждый обход робота стоят лишнего редиректа.
// В site.nav href хранится БЕЗ слэша — он же ключ для матчинга родителя в [slug].astro.
export const slashed = (p) => (!p || p === '/' ? '/' : p.replace(/\/+$/, '') + '/');

// Мессенджер MAX. Привязки к номеру телефона (как wa.me у WhatsApp) в MAX нет —
// ссылка персональная, вида max.ru/u/<токен>, профиль «FREZOREZ чпу».
// Где взять заново: приложение MAX → Настройки → иконка QR профиля слева вверху → «Скопировать ссылку».
// ВНИМАНИЕ: это токен, а не публичный ник. Если владелец пересоздаст ссылку в приложении,
// старая умрёт молча — сайт продолжит вести в никуда. При смене обновить здесь.
// Пусто — кнопок и ссылок на MAX на сайте нет нигде.
export const MAX_PROFILE_URL = 'https://max.ru/u/f9LHodD0cOKEs5S2Qneg7tKmq9kj32g28WSfEO8Ol1Ovx3KvkHXycDzooxs';
export const maxHref = MAX_PROFILE_URL;

// Telegram-кнопки ведут в бота мастерской @frezorez_bot, а не в личный аккаунт:
// он отвечает сразу и ночью, а переписка попадает в ту же рабочую группу, где
// заказчики с Авито (отдельной Темой на человека). Личный аккаунт бот читать
// не может — поэтому все точки входа на сайте должны вести именно сюда.
// Слаг страницы уезжает боту в /start: он с первого сообщения знает, что человек
// читал, и берёт нужную линию (фрезеровка / лазер / столярка).
// Telegram разрешает в payload только A-Za-z0-9_- и 64 символа — слаги подходят.
export const TG_BOT = 'frezorez_bot';
export const tgHref = (slug = '') => `https://t.me/${TG_BOT}${slug ? `?start=${slug}` : ''}`;

export const site = {
  name: 'FREZOREZ',
  domain: 'frezorez.ru',
  url: 'https://www.frezorez.ru', // главное зеркало = www (историческая индексация Яндекса)
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
    // maxHref пуст, пока не задан MAX_USERNAME — тогда MAX не попадёт ни в футер,
    // ни на страницу контактов, ни в sameAs Organization-схемы.
    maxHref,
    socials: [
      { label: 'Telegram', handle: '@frezorez_bot', href: tgHref() },
      ...(maxHref ? [{ label: 'MAX', handle: 'FREZOREZ чпу', href: maxHref }] : []),
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
    { label: 'Ящики и кашпо', href: '/yaschiki-podiumy-kashpo' },
    { label: 'Портфолио', href: '/portfolio' },
    { label: 'О нас', href: '/o-nas' },
    { label: 'Контакты', href: '/kontakty' },
  ],

  // B2B-proof. Логотипы кладутся в /public/content/partners/ (монохром по DESIGN.md).
  clients: [
    'Норникель', 'АндерСон', 'Азбука Вкуса', 'ВКонтакте', 'ВкусВилл',
    'Swarovski', 'Росгвардия', 'ОНФ', 'Max Mara',
  ],

  // Файлы логотипов. ЕДИНЫЙ список для главной и /o-nas/ — раньше он был продублирован
  // в обеих страницах, при нормализации логотипов расширения сменились на .png только
  // на главной, и на /o-nas/ шесть картинок из девяти отдавали 404.
  // Расширения соответствуют реальным файлам в public/content/partners/ — не менять вслепую.
  clientLogos: [
    { name: 'Норникель',    src: '/content/partners/logo-ss-ru.png' },
    { name: 'АндерСон',     src: '/content/partners/anderson.png' },
    { name: 'Азбука Вкуса', src: '/content/partners/azbyka.png' },
    { name: 'ВКонтакте',    src: '/content/partners/vk.png' },
    { name: 'ВкусВилл',     src: '/content/partners/vkus.png' },
    { name: 'Swarovski',    src: '/content/partners/Swarovski-Logo.png' },
    { name: 'Росгвардия',   src: '/content/partners/rosgvard-logo-1.png' },
    { name: 'ОНФ',          src: '/content/partners/Onf-logo.svg.png' },
    { name: 'Max Mara',     src: '/content/partners/Max-Mara-logo.png' },
  ],

  // Материалы (блок на главной). «Фрезеруем любые материалы, кроме железа.»
  materials: [
    'Фанера', 'Дерево', 'МДФ', 'ЛДСП', 'Акрил', 'ПВХ',
    'АКП (композит)', 'Поролон', 'Резина', 'Картон',
  ],
};
