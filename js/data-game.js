function roundNice(num) {
  if (num < 10) return Math.round(num * 10) / 10;
  if (num < 100) return Math.round(num);
  const f = Math.pow(10, Math.max(0, Math.floor(Math.log10(num)) - 1));
  return Math.round(num / f) * f;
}

// 13 ежедневных заданий
const DAILY_QUESTS_POOL = [
  { id: 1, title: "Сделать 1 000 кликов", type: "clicks", target: 1000, reward: 25, icon: "👆" },
  { id: 2, title: "Сделать 5 000 кликов", type: "clicks", target: 5000, reward: 50, icon: "👆" },
  { id: 3, title: "Сделать 10 000 кликов", type: "clicks", target: 10000, reward: 120, icon: "⚡" },
  { id: 4, title: "Купить любых бананов 50 шт", type: "buyBananas", target: 50, reward: 25, icon: "🍌" },
  { id: 5, title: "Купить любых бананов 125 шт", type: "buyBananas", target: 125, reward: 50, icon: "🍌" },
  { id: 6, title: "Купить любых бананов 250 шт", type: "buyBananas", target: 250, reward: 125, icon: "🛒" },
  { id: 7, title: "Быть в игре 10 минут", type: "playTime", target: 600, reward: 25, icon: "⏱️" },
  { id: 8, title: "Быть в игре 30 минут", type: "playTime", target: 1800, reward: 50, icon: "⏱️" },
  { id: 9, title: "Быть в игре 1 час", type: "playTime", target: 3600, reward: 100, icon: "🏆" },
  { id: 10, title: "Потратить 10 000 бананов", type: "spendBananas", target: 10000, reward: 10, icon: "💸" },
  { id: 11, title: "Потратить 100 000 бананов", type: "spendBananas", target: 100000, reward: 25, icon: "💸" },
  { id: 12, title: "Потратить 1 000 000 бананов", type: "spendBananas", target: 1000000, reward: 75, icon: "💰" },
  { id: 13, title: "Потратить 10 000 000 бананов", type: "spendBananas", target: 10000000, reward: 150, icon: "👑" }
];

// 10 еженедельных заданий
const WEEKLY_QUESTS_POOL = [
  { id: 101, title: "Потратить 100 000 000 бананов", type: "spendBananas", target: 100000000, reward: 250, icon: "💰" },
  { id: 102, title: "Купить 50 000 бананов", type: "buyBananas", target: 50000, reward: 250, icon: "🍌" },
  { id: 103, title: "Получить 500 кристаллов", type: "earnDiamonds", target: 500, reward: 250, icon: "💎" },
  { id: 104, title: "Получить 1 000 кристаллов", type: "earnDiamonds", target: 1000, reward: 250, icon: "💠" },
  { id: 105, title: "Выполнить 15 ежедневных заданий", type: "dailyCompleted", target: 15, reward: 250, icon: "🏆" },
  { id: 106, title: "Выполнить 10 ежедневных заданий", type: "dailyCompleted", target: 10, reward: 250, icon: "📋" },
  { id: 107, title: "Пробыть в игре 10 часов", type: "playTime", target: 36000, reward: 250, icon: "⏱️" },
  { id: 108, title: "Пробыть в игре 24 часа", type: "playTime", target: 86400, reward: 250, icon: "⏳" },
  { id: 109, title: "Потратить 50 000 000 бананов", type: "spendBananas", target: 50000000, reward: 250, icon: "💸" },
  { id: 110, title: "Тебе повезло! Получи 150 кристаллов", type: "instant", target: 1, reward: 150, icon: "🍀" }
];

// 99 видов бананов
const BANANAS_DATA = [
  ["Зелёный банан", "#d9f99d", "#84cc16", "#3f6212", "none"], ["Жёлтый банан", "#fef08a", "#facc15", "#ca8a04", "none"],
  ["Спелый банан", "#fde047", "#eab308", "#a16207", "spotted"], ["Мини-банан", "#fef9c3", "#fde047", "#eab308", "none"],
  ["Красный банан", "#fca5a5", "#dc2626", "#7f1d1d", "none"], ["Пятнистый банан", "#fef08a", "#f59e0b", "#78350f", "spotted"],
  ["Запечённый банан", "#fdba74", "#d97706", "#78350f", "none"], ["Сушёный банан", "#fed7aa", "#b45309", "#713f12", "none"],
  ["Банановый чипс", "#fde68a", "#f59e0b", "#b45309", "shine"], ["Медовый банан", "#fef08a", "#f59e0b", "#b45309", "shine"],
  ["Кокосовый банан", "#ffffff", "#f1f5f9", "#94a3b8", "none"], ["Ананасовый банан", "#fde047", "#f97316", "#c2410c", "striped"],
  ["Банан в шоколаде", "#fef08a", "#facc15", "#ca8a04", "choco"], ["Карамельный банан", "#fed7aa", "#ea580c", "#7c2d12", "shine"],
  ["Банановый смузи", "#fbcfe8", "#f472b6", "#be185d", "none"], ["Банановый пломбир", "#fffbeb", "#fef08a", "#eab308", "frost"],
  ["Банан-фламбе", "#fdba74", "#ef4444", "#7f1d1d", "fire"], ["Королевский сорт", "#e9d5ff", "#9333ea", "#581c87", "shine"],
  ["Гигантский плантан", "#bef264", "#4d7c0f", "#1a2e05", "none"], ["Сливочный банан", "#fffbeb", "#fde68a", "#d97706", "none"],
  ["Голубой яванский банан", "#e0f2fe", "#7dd3fc", "#0284c7", "frost"], ["Розовый банан", "#fbcfe8", "#f472b6", "#db2777", "none"],
  ["Полосатый банан", "#fef08a", "#facc15", "#a16207", "striped"], ["Радужный банан", "#ff4d6d", "#facc15", "#38bdf8", "rainbow"],
  ["Мятный банан", "#ccfbf1", "#2dd4bf", "#0f766e", "frost"], ["Острый перец-банан", "#fca5a5", "#ef4444", "#991b1b", "fire"],
  ["Неоновый банан", "#d9f99d", "#84cc16", "#06b6d4", "cyber"], ["Светящийся банан", "#fef9c3", "#bef264", "#65a30d", "divine"],
  ["Хрустальный банан", "#f0f9ff", "#bae6fd", "#38bdf8", "crystal"], ["Желейный банан", "#f5d0fe", "#e879f9", "#a21caf", "shine"],
  ["Бронзовый банан", "#fed7aa", "#cd7f32", "#7c2d12", "shine"], ["Серебряный банан", "#ffffff", "#cbd5e1", "#475569", "shine"],
  ["Золотой банан", "#fef9c3", "#fbbf24", "#b45309", "shine"], ["Платиновый банан", "#f8fafc", "#e2e8f0", "#64748b", "shine"],
  ["Изумрудный банан", "#bbf7d0", "#10b981", "#064e3b", "crystal"], ["Рубиновый банан", "#fecdd3", "#e11d48", "#881337", "crystal"],
  ["Сапфировый банан", "#bfdbfe", "#2563eb", "#1e3a8a", "crystal"], ["Алмазный банан", "#ecfeff", "#67e8f9", "#0891b2", "crystal"],
  ["Обсидиановый банан", "#6b7280", "#1f2937", "#030712", "crystal"], ["Титановый банан", "#e2e8f0", "#94a3b8", "#334155", "shine"],
  ["Механический банан", "#fde68a", "#b45309", "#451a03", "cyber"], ["Паровой банан", "#fed7aa", "#c2410c", "#431407", "cyber"],
  ["Электро-банан", "#fef08a", "#38bdf8", "#1d4ed8", "cyber"], ["Лазерный банан", "#fecaca", "#ff0055", "#7f1d1d", "cyber"],
  ["Кибер-банан", "#67e8f9", "#06b6d4", "#db2777", "cyber"], ["Нано-банан", "#99f6e4", "#14b8a6", "#134e4a", "cyber"],
  ["Голографический банан", "#f0abfc", "#38bdf8", "#818cf8", "rainbow"], ["ИИ-банан", "#bfdbfe", "#3b82f6", "#1e1b4b", "cyber"],
  ["Банан-дрон", "#cbd5e1", "#475569", "#0f172a", "cyber"], ["Термоядерный банан", "#ecfccb", "#a3e635", "#15803d", "divine"],
  ["Огненный банан", "#fef08a", "#f97316", "#b91c1c", "fire"], ["Ледяной банан", "#ffffff", "#7dd3fc", "#0369a1", "frost"],
  ["Грозовой банан", "#e0e7ff", "#6366f1", "#1e1b4b", "cyber"], ["Ветряной банан", "#ecfeff", "#a5f3fc", "#0e7490", "frost"],
  ["Каменный банан", "#d6d3d1", "#78716c", "#292524", "spotted"], ["Водяной банан", "#e0f2fe", "#0ea5e9", "#0c4a6e", "shine"],
  ["Магмовый банан", "#fdba74", "#dc2626", "#1c1917", "fire"], ["Песчаный банан", "#fef3c7", "#d97706", "#92400e", "spotted"],
  ["Облачный банан", "#ffffff", "#e2e8f0", "#94a3b8", "frost"], ["Ураганный банан", "#cffafe", "#06b6d4", "#1e293b", "striped"],
  ["Эльфийский банан", "#d9f99d", "#22c55e", "#14532d", "shine"], ["Зачарованный банан", "#f5d0fe", "#a855f7", "#4c1d95", "crystal"],
  ["Рунный банан", "#c7d2fe", "#4f46e5", "#1e1b4b", "cyber"], ["Алхимический банан", "#fef08a", "#10b981", "#7c3aed", "shine"],
  ["Банан маны", "#bae6fd", "#3b82f6", "#1d4ed8", "divine"], ["Драконий банан", "#bbf7d0", "#15803d", "#7f1d1d", "striped"],
  ["Феникс-банан", "#fef08a", "#ef4444", "#991b1b", "fire"], ["Единорожий банан", "#fbcfe8", "#c084fc", "#38bdf8", "rainbow"],
  ["Призрачный банан", "#f3e8ff", "#c4b5fd", "#4c1d95", "cosmic"], ["Теневой банан", "#6b21a8", "#1e1b4b", "#030712", "cosmic"],
  ["Лунный банан", "#f8fafc", "#cbd5e1", "#475569", "spotted"], ["Солнечный банан", "#ffffff", "#facc15", "#ea580c", "fire"],
  ["Марсианский банан", "#fdba74", "#dc2626", "#7c2d12", "spotted"], ["Кометный банан", "#e0f2fe", "#38bdf8", "#1e3a8a", "cosmic"],
  ["Метеоритный банан", "#d6d3d1", "#57534e", "#1c1917", "fire"], ["Астероидный банан", "#e5e7eb", "#6b7280", "#1f2937", "spotted"],
  ["Банан-спутник", "#f1f5f9", "#94a3b8", "#1e293b", "cyber"], ["Планетарный банан", "#fde68a", "#0ea5e9", "#0f172a", "cosmic"],
  ["Звёздный банан", "#fef9c3", "#eab308", "#1e1b4b", "cosmic"], ["Туманный банан", "#f0abfc", "#7c3aed", "#0f172a", "cosmic"],
  ["Квазарный банан", "#fef08a", "#ec4899", "#312e81", "cosmic"], ["Пульсарный банан", "#cffafe", "#06b6d4", "#1e1b4b", "divine"],
  ["Нейтронный банан", "#e0e7ff", "#60a5fa", "#1e3a8a", "crystal"], ["Банан чёрной дыры", "#f97316", "#111827", "#000000", "cosmic"],
  ["Гравитационный банан", "#ddd6fe", "#6d28d9", "#09090b", "cosmic"], ["Квантовый банан", "#a5f3fc", "#8b5cf6", "#0f172a", "cyber"],
  ["Фотонный банан", "#ffffff", "#fef08a", "#f59e0b", "divine"], ["Антиматериальный банан", "#fda4af", "#1e1b4b", "#4c0519", "cosmic"],
  ["Банан тёмной энергии", "#c084fc", "#3b0764", "#000000", "cosmic"], ["Гиперпространственный банан", "#67e8f9", "#ec4899", "#1e1b4b", "rainbow"],
  ["Временной банан", "#fef3c7", "#d97706", "#1e293b", "crystal"], ["Банан измерений", "#f0abfc", "#06b6d4", "#3b0764", "cosmic"],
  ["Галактический банан", "#e879f9", "#4f46e5", "#020617", "cosmic"], ["Вселенский банан", "#93c5fd", "#312e81", "#020617", "cosmic"],
  ["Мультивселенский банан", "#f472b6", "#8b5cf6", "#06b6d4", "rainbow"], ["Астральный банан", "#e0f2fe", "#a78bfa", "#312e81", "divine"],
  ["Бесконечный банан", "#fef08a", "#ec4899", "#6366f1", "rainbow"], ["Божественный банан", "#ffffff", "#fde047", "#f59e0b", "divine"],
  ["Банан Абсолюта", "#ffffff", "#ffd43b", "#ec4899", "divine"]
].map(([name, c1, c2, c3, effect], id) => ({
  id, tier: id + 1, name, c1, c2, c3, effect,
  baseCost: roundNice(15 * 1.25 * Math.pow(1.49, id)),
  baseBps: id === 0 ? 0.5 : roundNice(Math.pow(1.4, id) * 0.5)
}));

// Достижения (106 шт)
const BANANA_ACH_STAGES = [
  [100, 2, "100"],
  [200, 5, "200"],
  [500, 10, "500"],
  [1000, 25, "1 000"],
  [2500, 50, "2 500"],
  [4000, 100, "4 000"]
];

const ACHIEVEMENTS_DATA = [
  {
    id: "clicks",
    title: "Мастер кликов",
    icon: "👆",
    kind: "clicks",
    stages: [
      { target: 100, reward: 5, desc: "Сделать 100 кликов" },
      { target: 1000, reward: 15, desc: "Сделать 1 000 кликов" },
      { target: 10000, reward: 25, desc: "Сделать 10 000 кликов" },
      { target: 100000, reward: 50, desc: "Сделать 100 000 кликов" },
      { target: 1000000, reward: 100, desc: "Сделать 1 000 000 кликов" },
      { target: 10000000, reward: 250, desc: "Сделать 10 000 000 кликов" }
    ]
  },
  {
    id: "monkeys",
    title: "Стая обезьян",
    icon: "🐒",
    kind: "monkeys",
    stages: [
      { target: 5, reward: 10, desc: "Купить 5 обезьян" },
      { target: 10, reward: 20, desc: "Купить 10 обезьян" },
      { target: 15, reward: 30, desc: "Купить 15 обезьян" },
      { target: 20, reward: 40, desc: "Купить 20 обезьян" },
      { target: 25, reward: 50, desc: "Купить 25 обезьян" },
      { target: 30, reward: 100, desc: "Купить 30 обезьян" }
    ]
  },
  {
    id: "account_level",
    title: "Легенда джунглей",
    icon: "⭐",
    iconId: "ico-level",
    kind: "accountLevel",
    stages: [
      { target: 5, reward: 25, desc: "Достичь 5 уровня аккаунта" },
      { target: 25, reward: 100, desc: "Достичь 25 уровня аккаунта" },
      { target: 50, reward: 250, desc: "Достичь 50 уровня аккаунта" },
      { target: 75, reward: 500, desc: "Достичь 75 уровня аккаунта" },
      { target: 100, reward: 1250, desc: "Достичь 100 уровня аккаунта" },
      { target: 999, reward: 2500, desc: "Достичь 999 уровня аккаунта" }
    ]
  },
  {
    id: "collections_total",
    title: "Великий коллекционер",
    icon: "🎒",
    iconId: "ico-collections",
    kind: "collections",
    stages: [
      { target: 10, reward: 10, desc: "Сдать 10 коллекций" },
      { target: 25, reward: 20, desc: "Сдать 25 коллекций" },
      { target: 50, reward: 30, desc: "Сдать 50 коллекций" },
      { target: 100, reward: 40, desc: "Сдать 100 коллекций" },
      { target: 250, reward: 50, desc: "Сдать 250 коллекций" },
      { target: 500, reward: 100, desc: "Сдать 500 коллекций" }
    ]
  },
  {
    id: "gold_vip",
    title: "Gold",
    icon: "👑",
    iconId: "ico-tab-premium",
    kind: "goldVip",
    stages: [
      { target: 1, reward: 25, desc: "Купить Gold VIP 1 раз" },
      { target: 2, reward: 25, desc: "Купить Gold VIP 2 раза" },
      { target: 3, reward: 25, desc: "Купить Gold VIP 3 раза" },
      { target: 4, reward: 25, desc: "Купить Gold VIP 4 раза" },
      { target: 5, reward: 25, desc: "Купить Gold VIP 5 раз" },
      { target: 6, reward: 25, desc: "Купить Gold VIP 6 раз" }
    ]
  },
  {
    id: "platinum_vip",
    title: "Platinum",
    icon: "💠",
    iconId: "ico-tab-platinum",
    kind: "platinumVip",
    stages: [
      { target: 1, reward: 50, desc: "Купить Platinum VIP 1 раз" },
      { target: 2, reward: 50, desc: "Купить Platinum VIP 2 раза" },
      { target: 3, reward: 50, desc: "Купить Platinum VIP 3 раза" },
      { target: 4, reward: 50, desc: "Купить Platinum VIP 4 раза" },
      { target: 5, reward: 50, desc: "Купить Platinum VIP 5 раз" },
      { target: 6, reward: 50, desc: "Купить Platinum VIP 6 раз" }
    ]
  },
  {
    id: "play_time",
    title: "Верный джунглям",
    icon: "⏱️",
    iconId: "ico-rate-bps",
    kind: "playTime",
    stages: [
      { target: 1800, reward: 20, desc: "Провести в игре 30 минут" },
      { target: 3600, reward: 60, desc: "Провести в игре 1 час" },
      { target: 7200, reward: 120, desc: "Провести в игре 2 часа" },
      { target: 14400, reward: 150, desc: "Провести в игре 4 часа" },
      { target: 21600, reward: 200, desc: "Провести в игре 6 часов" },
      { target: 43200, reward: 250, desc: "Провести в игре 12 часов" },
      { target: 86400, reward: 300, desc: "Провести в игре 24 часа" },
      { target: 172800, reward: 500, desc: "Провести в игре 48 часов" }
    ]
  },
  ...BANANAS_DATA.map((b) => ({
    id: `banana_${b.id}`,
    title: b.name,
    kind: "bananaCount",
    bananaId: b.id,
    stages: BANANA_ACH_STAGES.map(([target, reward, label]) => ({
      target,
      reward,
      desc: `Купить ${b.name} ${label} раз`
    }))
  }))
];

// 30 обезьян
const MONKEYS_DATA = [
  ["Мартышка Пушок", "Маленькая, но шустрая!", "#8d5524", "#f1c27d", "#ffd43b", "tuft"],
  ["Лесной Капуцин", "Ловко собирает урожай", "#5c3818", "#ffdbac", "#a3e635", "leaf"],
  ["Весёлый Макак", "Кликать — его главное хобби", "#a66a38", "#ffc8a2", "#fbbf24", "cheeky"],
  ["Игривый Тамарин", "Усы приносят удачу", "#3d2817", "#e0ac69", "#f59e0b", "mustache"],
  ["Шустрый Гиббон", "Мастер быстрых лап", "#6b4423", "#f1c27d", "#34d399", "headband"],
  ["Спокойный Орангутан", "Древняя мудрость джунглей", "#c2410c", "#fdba74", "#fb923c", "zen"],
  ["Ловкий Шимпанзе", "Двойной хват за ветку!", "#292524", "#e0ac69", "#4ade80", "shades"],
  ["Вождь Бабуин", "Руководит всей стаей", "#78350f", "#f59e0b", "#f87171", "tribal"],
  ["Могучий Горилла", "Бьёт в грудь — падают бананы", "#334155", "#64748b", "#94a3b8", "gorilla"],
  ["Снежный Макак", "Закалён в снежных горах", "#e2e8f0", "#fecaca", "#38bdf8", "winter"],
  ["Обезьяна-Ниндзя", "Бесшумный сбор урожая", "#1e293b", "#f1c27d", "#6366f1", "ninja"],
  ["Пират-Капуцин", "Гроза банановых островов", "#6d3d1c", "#ffdbac", "#ef4444", "pirate"],
  ["Шеф-Повар Орангутан", "Готовит золотые смузи", "#c2410c", "#fed7aa", "#facc15", "chef"],
  ["Диджей Шимпанзе", "Раскачивает тропический бит", "#1f2937", "#e0ac69", "#ec4899", "dj"],
  ["Детектив Мартышка", "Найдёт каждый банан", "#7c4a21", "#f1c27d", "#eab308", "detective"],
  ["Рыцарь Бабуин", "Защитник Великой Пальмы", "#57534e", "#e7e5e4", "#cbd5e1", "knight"],
  ["Самурай-Макак", "Путь бананового клинка", "#7f1d1d", "#fecdd3", "#fb7185", "samurai"],
  ["Кибер-Обезьяна", "Титановые пальцы для клика", "#475569", "#cbd5e1", "#22d3ee", "cyber"],
  ["Астронавт Шимпанзе", "Добывает лунные бананы", "#3f3f46", "#ffdbac", "#60a5fa", "astro"],
  ["Рок-Звезда Гиббон", "Соло на электробанане", "#4c1d95", "#f5d0fe", "#c084fc", "rock"],
  ["Профессор Горилла", "Формула идеального клика", "#334155", "#94a3b8", "#2dd4bf", "prof"],
  ["Архимаг Тамарин", "Колдует банановые ливни", "#581c87", "#e9d5ff", "#a855f7", "mage"],
  ["Огненный Мандрил", "Пылающие касания", "#991b1b", "#fdba74", "#f97316", "fire"],
  ["Ледяной Йети-Конг", "Король заснеженных вершин", "#bae6fd", "#e0f2fe", "#7dd3fc", "ice"],
  ["Призрачный Лемур", "Кликает сквозь измерения", "#6d28d9", "#ddd6fe", "#a78bfa", "ghost"],
  ["Золотой Император", "Всё, чего касается — золото", "#d97706", "#fef08a", "#ffd43b", "king"],
  ["Драконья Обезьяна", "Неукротимая мощь древних", "#065f46", "#6ee7b7", "#10b981", "dragon"],
  ["Галактический Примат", "Вращает банановые планеты", "#312e81", "#a5b4fc", "#818cf8", "galaxy"],
  ["Квантовый Сунь Укун", "Легендарный Царь Обезьян", "#b45309", "#fde68a", "#f472b6", "wukong"],
  ["Абсолютный Банан-Бог", "Творец Вселенной Бананов", "#f59e0b", "#fffbeb", "#fde047", "god"]
].map(([name, desc, fur, skin, color, acc], id) => ({
  id, tier: id + 1, name, desc, fur, skin, color, acc,
  cost: id === 0 ? 0 : roundNice(50 * 1.25 * Math.pow(3.55, id - 1)),
  clickPower: id === 0 ? 0.5 : roundNice(3 * Math.pow(3.15, id - 1) * 0.5)
}));

// Пакеты Gold Премиума
const PREMIUM_PACKAGES = [
  { id: "prem_7",  days: 7,  cost: 800,  title: "Gold VIP на 7 дней",  sub: "Неделя Gold-бонусов", badge: "" },
  { id: "prem_14", days: 14, cost: 1300, title: "Gold VIP на 14 дней", sub: "2 недели • Выгоднее на 19%", badge: "ХИТ" },
  { id: "prem_30", days: 30, cost: 2250, title: "Gold VIP на 30 дней", sub: "Месяц • Максимальная выгода", badge: "ВЫГОДНО" }
];

// Пакеты Platinum Премиума
const PLATINUM_PACKAGES = [
  { id: "plat_7",  days: 7,  cost: 1600, title: "Platinum VIP на 7 дней",  sub: "Неделя Platinum-бонусов", badge: "" },
  { id: "plat_14", days: 14, cost: 2500, title: "Platinum VIP на 14 дней", sub: "2 недели • Выгоднее на 22%", badge: "ХИТ" },
  { id: "plat_30", days: 30, cost: 4500, title: "Platinum VIP на 30 дней", sub: "Месяц • Максимальная выгода", badge: "ВЫГОДНО" }
];