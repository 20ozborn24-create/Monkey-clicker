const AVATAR_PRESET_MONKEYS = [0, 5, 10, 11, 13, 17, 18, 21, 25, 29];

function getCustomStepCost(id) {
  if (id === 0) return 0;
  if (id <= 15) return 15;
  if (id <= 35) return 30;
  return 50;
}

// 25 анимированных фонов (привязаны к img/backgrounds/1.png .. 25.png)
const BACKGROUNDS_DATA = [
  [
    "Банановый дождь",
    "radial-gradient(circle at 22% 18%, rgba(253,224,71,0.30) 0%, transparent 46%), radial-gradient(circle at 82% 72%, rgba(74,222,128,0.22) 0%, transparent 50%), radial-gradient(circle at 50% 0%, #244b33 0%, #112519 56%, #09120c 100%)",
    "rgba(255,212,59,0.32)",
    "bg-fx-pulse",
    ["🍌", "✨", "🌟"],
    "#fde047",
    "#4ade80",
    25
  ],
  [
    "Тропический микс",
    "radial-gradient(circle at 18% 22%, rgba(52,211,153,0.34) 0%, transparent 46%), radial-gradient(circle at 84% 25%, rgba(251,191,36,0.25) 0%, transparent 44%), linear-gradient(155deg, #0b4a3a 0%, #136f52 46%, #08241b 100%)",
    "rgba(52,211,153,0.35)",
    "bg-fx-wave",
    ["🍍", "🥥", "🍌", "🌴"],
    "#34d399",
    "#fbbf24",
    21
  ],
  [
    "Яблочный сад",
    "radial-gradient(circle at 24% 22%, rgba(248,113,113,0.34) 0%, transparent 45%), radial-gradient(circle at 78% 68%, rgba(132,204,22,0.28) 0%, transparent 48%), linear-gradient(155deg, #1d4a1e 0%, #4d1b1f 54%, #101d12 100%)",
    "rgba(248,113,113,0.32)",
    "bg-fx-pulse",
    ["🍎", "🍏", "🍃", "✨"],
    "#f87171",
    "#a3e635",
    19
  ],
  [
    "Арбузное лето",
    "radial-gradient(circle at 22% 18%, rgba(74,222,128,0.36) 0%, transparent 44%), radial-gradient(circle at 78% 35%, rgba(251,113,133,0.42) 0%, transparent 48%), linear-gradient(155deg, #15803d 0%, #e11d48 54%, #122618 100%)",
    "rgba(251,113,133,0.36)",
    "bg-fx-prism",
    ["🍉", "🍈", "☀️", "✨"],
    "#fb7185",
    "#4ade80",
    18
  ],
  [
    "Цитрусовый фреш",
    "radial-gradient(circle at 22% 20%, rgba(253,224,71,0.38) 0%, transparent 45%), radial-gradient(circle at 82% 72%, rgba(249,115,22,0.36) 0%, transparent 48%), linear-gradient(155deg, #9a3412 0%, #d97706 48%, #261406 100%)",
    "rgba(251,146,60,0.38)",
    "bg-fx-pulse",
    ["🍊", "🍋", "✨", "☀️"],
    "#fb923c",
    "#fde047",
    17
  ],
  [
    "Осенний листопад",
    "radial-gradient(circle at 24% 20%, rgba(253,186,116,0.36) 0%, transparent 44%), radial-gradient(circle at 80% 72%, rgba(239,68,68,0.26) 0%, transparent 48%), linear-gradient(155deg, #9a3412 0%, #b45309 50%, #241409 100%)",
    "rgba(251,146,60,0.35)",
    "bg-fx-pulse",
    ["🍂", "🍁", "🌰", "✨"],
    "#fdba74",
    "#ef4444",
    13
  ],
  [
    "Подводный мир",
    "radial-gradient(circle at 50% 8%, rgba(165,243,252,0.38) 0%, transparent 46%), radial-gradient(circle at 78% 72%, rgba(6,182,212,0.32) 0%, transparent 48%), linear-gradient(160deg, #0e7490 0%, #0369a1 50%, #051829 100%)",
    "rgba(34,211,238,0.36)",
    "bg-fx-wave",
    ["💧", "🐠", "🐚", "🐙"],
    "#67e8f9",
    "#38bdf8",
    9
  ],
  [
    "Джунгли Амазонки",
    "radial-gradient(circle at 22% 18%, rgba(134,239,172,0.34) 0%, transparent 44%), radial-gradient(circle at 80% 70%, rgba(250,204,21,0.22) 0%, transparent 46%), linear-gradient(155deg, #047857 0%, #15803d 52%, #07190d 100%)",
    "rgba(74,222,128,0.35)",
    "bg-fx-wave",
    ["🌴", "🌿", "🌺", "🍌"],
    "#4ade80",
    "#fde047",
    3
  ],
  [
    "Конфетный рай",
    "radial-gradient(circle at 22% 22%, rgba(251,207,232,0.36) 0%, transparent 44%), radial-gradient(circle at 80% 72%, rgba(125,211,252,0.34) 0%, transparent 46%), linear-gradient(135deg, #be185d 0%, #7c3aed 50%, #0284c7 100%)",
    "rgba(244,114,182,0.36)",
    "bg-fx-prism",
    ["🍬", "🍭", "🍩", "✨"],
    "#f9a8d4",
    "#7dd3fc",
    11
  ],
  [
    "Шоколадная фабрика",
    "radial-gradient(circle at 24% 20%, rgba(253,224,71,0.28) 0%, transparent 44%), radial-gradient(circle at 80% 72%, rgba(245,158,11,0.30) 0%, transparent 48%), linear-gradient(155deg, #5c2608 0%, #92400e 50%, #1e0f06 100%)",
    "rgba(245,158,11,0.35)",
    "bg-fx-shimmer",
    ["🍫", "🍪", "🍩", "🍌"],
    "#fbbf24",
    "#fdba74",
    7
  ],
  [
    "Золотая лихорадка",
    "radial-gradient(circle at 28% 18%, rgba(254,240,138,0.42) 0%, transparent 42%), radial-gradient(circle at 78% 72%, rgba(245,158,11,0.35) 0%, transparent 48%), linear-gradient(155deg, #92400e 0%, #ca8a04 44%, #241604 100%)",
    "rgba(250,204,21,0.42)",
    "bg-fx-shimmer",
    ["👑", "💰", "🍌", "✨"],
    "#fef08a",
    "#f59e0b",
    22
  ],
  [
    "Алмазный дождь",
    "radial-gradient(circle at 24% 20%, rgba(186,230,253,0.40) 0%, transparent 42%), radial-gradient(circle at 80% 72%, rgba(56,189,248,0.36) 0%, transparent 48%), linear-gradient(155deg, #075985 0%, #0284c7 48%, #07192b 100%)",
    "rgba(56,189,248,0.42)",
    "bg-fx-shimmer",
    ["💎", "💠", "❄️", "✨"],
    "#7dd3fc",
    "#38bdf8",
    23
  ],
  [
    "Радужная дискотека",
    "radial-gradient(circle at 22% 20%, rgba(255,255,255,0.28) 0%, transparent 38%), linear-gradient(135deg, #db2777, #ea580c, #eab308, #22c55e, #0ea5e9, #7c3aed)",
    "rgba(255,255,255,0.34)",
    "bg-fx-aurora",
    ["🌈", "🎵", "🎶", "✨"],
    "#f472b6",
    "#38bdf8",
    5
  ],
  [
    "Грозовая буря",
    "radial-gradient(circle at 26% 18%, rgba(147,197,253,0.36) 0%, transparent 42%), radial-gradient(circle at 80% 72%, rgba(129,140,248,0.30) 0%, transparent 48%), linear-gradient(155deg, #1e293b 0%, #312e81 52%, #090d1a 100%)",
    "rgba(96,165,250,0.38)",
    "bg-fx-neon",
    ["⚡", "🌩️", "💧", "✨"],
    "#93c5fd",
    "#fde047",
    14
  ],
  [
    "Огненное инферно",
    "radial-gradient(circle at 50% 82%, rgba(250,204,21,0.35) 0%, transparent 48%), radial-gradient(circle at 24% 20%, rgba(249,115,22,0.42) 0%, transparent 45%), linear-gradient(160deg, #991b1b 0%, #ea580c 48%, #1c0705 100%)",
    "rgba(249,115,22,0.44)",
    "bg-fx-pulse",
    ["🔥", "💥", "🌋", "⚡"],
    "#fb923c",
    "#facc15",
    24
  ],
  [
    "Киберпанк неон",
    "radial-gradient(circle at 20% 22%, rgba(34,211,238,0.40) 0%, transparent 44%), radial-gradient(circle at 82% 72%, rgba(236,72,153,0.42) 0%, transparent 46%), linear-gradient(155deg, #3b0764 0%, #9d174d 50%, #090912 100%)",
    "rgba(34,211,238,0.40)",
    "bg-fx-neon",
    ["⚡", "💾", "🤖", "💠"],
    "#22d3ee",
    "#f472b6",
    20
  ],
  [
    "Гламур и звёзды",
    "radial-gradient(circle at 24% 20%, rgba(251,207,232,0.40) 0%, transparent 44%), radial-gradient(circle at 80% 72%, rgba(244,63,94,0.34) 0%, transparent 48%), linear-gradient(155deg, #701a45 0%, #db2777 50%, #240514 100%)",
    "rgba(244,114,182,0.40)",
    "bg-fx-shimmer",
    ["💖", "💎", "👑", "✨"],
    "#f472b6",
    "#fef08a",
    16
  ],
  [
    "Древний Египет",
    "radial-gradient(circle at 50% 14%, rgba(254,240,138,0.38) 0%, transparent 44%), radial-gradient(circle at 80% 74%, rgba(245,158,11,0.32) 0%, transparent 48%), linear-gradient(155deg, #854d0e 0%, #d97706 46%, #241708 100%)",
    "rgba(251,191,36,0.36)",
    "bg-fx-shimmer",
    ["🏺", "☀️", "💰", "✨"],
    "#fde047",
    "#fb923c",
    1
  ],
  [
    "Хэллоуин",
    "radial-gradient(circle at 25% 20%, rgba(249,115,22,0.40) 0%, transparent 44%), radial-gradient(circle at 80% 72%, rgba(168,85,247,0.34) 0%, transparent 48%), linear-gradient(155deg, #4c1d95 0%, #c2410c 52%, #09090b 100%)",
    "rgba(249,115,22,0.40)",
    "bg-fx-twinkle",
    ["🎃", "👻", "🦇", "🕯️"],
    "#fb923c",
    "#c084fc",
    12
  ],
  [
    "Небесный стимпанк",
    "radial-gradient(circle at 24% 20%, rgba(251,191,36,0.38) 0%, transparent 45%), radial-gradient(circle at 80% 72%, rgba(234,88,12,0.34) 0%, transparent 48%), linear-gradient(155deg, #7c2d12 0%, #b45309 48%, #1c1917 100%)",
    "rgba(245,158,11,0.42)",
    "bg-fx-pulse",
    ["⚙️", "🕰️", "✨", "🔥"],
    "#fbbf24",
    "#fb923c",
    15
  ],
  [
    "Матрица кода",
    "radial-gradient(circle at 24% 20%, rgba(74,222,128,0.34) 0%, transparent 44%), radial-gradient(circle at 78% 74%, rgba(16,185,129,0.28) 0%, transparent 48%), linear-gradient(160deg, #064e3b 0%, #14532d 46%, #030712 100%)",
    "rgba(74,222,128,0.38)",
    "bg-fx-neon",
    ["💚", "⚡", "🔋", "💻"],
    "#4ade80",
    "#22d3ee",
    6
  ],
  [
    "Грибной биолес",
    "radial-gradient(circle at 22% 20%, rgba(45,212,191,0.38) 0%, transparent 44%), radial-gradient(circle at 80% 72%, rgba(232,121,249,0.36) 0%, transparent 48%), linear-gradient(155deg, #0f172a 0%, #115e59 48%, #4c1d95 100%)",
    "rgba(45,212,191,0.44)",
    "bg-fx-twinkle",
    ["🍄", "✨", "🌿", "💠"],
    "#2dd4bf",
    "#e879f9",
    10
  ],
  [
    "Облачное королевство",
    "radial-gradient(circle at 26% 18%, rgba(255,255,255,0.42) 0%, transparent 45%), radial-gradient(circle at 78% 72%, rgba(253,224,71,0.32) 0%, transparent 48%), linear-gradient(155deg, #0ea5e9 0%, #38bdf8 46%, #1e3a8a 100%)",
    "rgba(125,211,252,0.42)",
    "bg-fx-shimmer",
    ["☁️", "🌤️", "✨", "🌟"],
    "#fef08a",
    "#bae6fd",
    4
  ],
  [
    "Квантовый разлом",
    "radial-gradient(circle at 22% 22%, rgba(34,211,238,0.40) 0%, transparent 44%), radial-gradient(circle at 80% 72%, rgba(236,72,153,0.36) 0%, transparent 46%), linear-gradient(135deg, #09090b 0%, #4f46e5 38%, #06b6d4 72%, #ec4899 100%)",
    "rgba(34,211,238,0.42)",
    "bg-fx-aurora",
    ["⚛️", "🌀", "💠", "⚡"],
    "#22d3ee",
    "#e879f9",
    8
  ],
  [
    "Абсолют Вселенной",
    "radial-gradient(circle at 50% 18%, rgba(254,240,138,0.42) 0%, transparent 44%), radial-gradient(circle at 20% 72%, rgba(168,85,247,0.38) 0%, transparent 48%), linear-gradient(135deg, #09090b 0%, #6b21a8 35%, #d97706 68%, #0284c7 100%)",
    "rgba(255,212,59,0.48)",
    "bg-fx-aurora",
    ["🏆", "👑", "🍌", "💎", "⭐"],
    "#fde047",
    "#38bdf8",
    2
  ]
].map(([name, bg, glow, fx, drops, orb1, orb2, imgId], id) => ({
  id, name, bg, glow, fx, drops, orb1, orb2, imgId,
  cost: getCustomStepCost(id)
}));

// 50 игровых векторных рамок аватара [name, c1 (свет), c2 (основа), c3 (тень/контур), gem, fx, shape]
const AVATAR_FRAMES_DATA = [
  ["Золотая классика",     "#fff3bf", "#f59e0b", "#78350f", "#fde047", "fx-double", "gold_wings"],
  ["Неоновый кибер",       "#67e8f9", "#0891b2", "#1e1b4b", "#f472b6", "fx-neon",   "mecha_dark"],
  ["Огненное кольцо",      "#fef08a", "#f97316", "#7f1d1d", "#fde047", "fx-pulse",  "flame_wreath"],
  ["Ледяной кристалл",     "#e0f2fe", "#38bdf8", "#0c4a6e", "#ffffff", "fx-pulse",  "frost_star"],
  ["Радужная призма",      "#f472b6", "#8b5cf6", "#1e3a8a", "#38bdf8", "fx-prism",  "sun_emperor"],
  ["Изумрудная лоза",      "#86efac", "#16a34a", "#052e16", "#4ade80", "fx-pulse",  "emerald_laurel"],
  ["Рубиновая страсть",    "#fda4af", "#e11d48", "#881337", "#fb7185", "fx-double", "heart_wings"],
  ["Сапфировое сияние",    "#93c5fd", "#2563eb", "#172554", "#60a5fa", "fx-pulse",  "lotus"],
  ["Алмазная корона",      "#e0f2fe", "#06b6d4", "#164e63", "#ffffff", "fx-prism",  "jade_crown"],
  ["Космическая туманность","#c084fc","#4338ca", "#1e1b4b", "#38bdf8", "fx-pulse",  "moon_armor"],
  ["Молния Зевса",         "#fef08a", "#38bdf8", "#1e3a8a", "#fde047", "fx-neon",   "gold_wings"],
  ["Розовая сакура",       "#fbcfe8", "#f472b6", "#831843", "#fff1f2", "fx-pulse",  "crystal_cat"],
  ["Токсичный неон",       "#d9f99d", "#22c55e", "#052e16", "#bef264", "fx-neon",   "bat_wings"],
  ["Лавовая трещина",      "#fdba74", "#dc2626", "#450a0a", "#fb923c", "fx-pulse",  "flame_wreath"],
  ["Солнечная корона",     "#fffbeb", "#f59e0b", "#92400e", "#fef08a", "fx-prism",  "sun_emperor"],
  ["Лунный серп",          "#e2e8f0", "#475569", "#1e1b4b", "#bae6fd", "fx-double", "moon_armor"],
  ["Чёрная дыра",          "#fb923c", "#3f3f46", "#09090b", "#f97316", "fx-neon",   "mecha_dark"],
  ["Божественный нимб",    "#fffbeb", "#facc15", "#a16207", "#ffffff", "fx-prism",  "pearl_plume"],
  ["Крылья ангела",        "#ffffff", "#cbd5e1", "#475569", "#e0f2fe", "fx-pulse",  "angel_white"],
  ["Демонические рога",    "#f87171", "#991b1b", "#09090b", "#ef4444", "fx-neon",   "bat_wings"],
  ["Голограмма",           "#f0abfc", "#38bdf8", "#4c1d95", "#67e8f9", "fx-prism",  "crystal_cat"],
  ["Северное сияние",      "#6ee7b7", "#0d9488", "#312e81", "#5eead4", "fx-pulse",  "jade_crown"],
  ["Пиксельный ретро",     "#93c5fd", "#2563eb", "#1e1b4b", "#facc15", "fx-double", "castle"],
  ["Аметистовый кристалл", "#f3e8ff", "#a855f7", "#3b0764", "#e879f9", "fx-pulse",  "frost_star"],
  ["Медовый нектар",       "#fef08a", "#d97706", "#78350f", "#fde047", "fx-double", "gear_sun"],
  ["Океанская волна",      "#a5f3fc", "#0284c7", "#0c4a6e", "#67e8f9", "fx-pulse",  "lotus"],
  ["Закатное небо",        "#fdba74", "#db2777", "#701a45", "#fde047", "fx-pulse",  "valkyrie_wings"],
  ["Матрица",              "#86efac", "#15803d", "#052e16", "#4ade80", "fx-neon",   "mecha_dark"],
  ["Хромированный металл", "#ffffff", "#94a3b8", "#334155", "#e2e8f0", "fx-double", "paladin_swords"],
  ["Бронзовый щит",        "#fed7aa", "#b45309", "#451a03", "#fbbf24", "fx-double", "castle"],
  ["Платиновый люкс",      "#ffffff", "#bae6fd", "#475569", "#ffffff", "fx-pulse",  "angel_white"],
  ["Розовый кварц",        "#fce7f3", "#c084fc", "#701a45", "#f9a8d4", "fx-double", "valkyrie_wings"],
  ["Тропический кокос",    "#d9f99d", "#65a30d", "#14532d", "#fde047", "fx-pulse",  "mint_laurel"],
  ["Призрачный туман",     "#e9d5ff", "#6d28d9", "#2e1065", "#c4b5fd", "fx-neon",   "moon_armor"],
  ["Драконья чешуя",       "#6ee7b7", "#059669", "#064e3b", "#fbbf24", "fx-pulse",  "bat_wings"],
  ["Грозовой шторм",       "#bfdbfe", "#3b82f6", "#1e1b4b", "#fde047", "fx-neon",   "frost_star"],
  ["Конфетный вихрь",      "#fbcfe8", "#ec4899", "#0284c7", "#fef08a", "fx-prism",  "crystal_cat"],
  ["Звёздная пыль",        "#fef08a", "#ca8a04", "#1e293b", "#fffbeb", "fx-pulse",  "star_laurel"],
  ["Мятный лёд",           "#ccfbf1", "#14b8a6", "#0f766e", "#99f6e4", "fx-double", "mint_laurel"],
  ["Королевский бархат",   "#facc15", "#7e22ce", "#3b0764", "#fde047", "fx-double", "sun_emperor"],
  ["Инферно",              "#fef08a", "#ef4444", "#450a0a", "#ffffff", "fx-prism",  "flame_wreath"],
  ["Зеркальная призма",    "#ffffff", "#f0abfc", "#0284c7", "#67e8f9", "fx-prism",  "angel_white"],
  ["Бирюзовая лагуна",     "#99f6e4", "#06b6d4", "#0f766e", "#fde047", "fx-pulse",  "jade_crown"],
  ["Квантовый портал",     "#67e8f9", "#6366f1", "#1e1b4b", "#22d3ee", "fx-neon",   "gear_sun"],
  ["Золотой бамбук",       "#d9f99d", "#84cc16", "#365314", "#facc15", "fx-double", "star_laurel"],
  ["Сердечный импульс",    "#fecdd3", "#f43f5e", "#881337", "#fff1f2", "fx-pulse",  "heart_wings"],
  ["Имперский лавр",       "#fef08a", "#65a30d", "#1a2e05", "#fde047", "fx-double", "emerald_laurel"],
  ["Галактический вихрь",  "#e879f9", "#4f46e5", "#09090b", "#38bdf8", "fx-prism",  "valkyrie_wings"],
  ["Мифический Укун",      "#fef08a", "#e11d48", "#7f1d1d", "#fde047", "fx-prism",  "pearl_plume"],
  ["Рамка Абсолюта",       "#ffffff", "#facc15", "#7c2d12", "#38bdf8", "fx-prism",  "sun_emperor"]
].map(([name, c1, c2, c3, gem, fx, shape], id) => ({
  id, name, c1, c2, c3, gem, fx, shape,
  bg: fx === "fx-prism"
    ? `conic-gradient(from 0deg, ${c1}, ${c2}, ${gem}, ${c1})`
    : `linear-gradient(135deg, ${c1}, ${c2})`,
  cost: getCustomStepCost(id)
}));

// 50 стилей профиля (многослойные объёмные градиенты со световыми бликами)
const PROFILE_STYLES_DATA = [
  ["Тропические джунгли", "radial-gradient(circle at 14% 18%, rgba(74,222,128,0.28) 0%, transparent 50%), radial-gradient(circle at 88% 82%, rgba(255,212,59,0.16) 0%, transparent 45%), linear-gradient(135deg, #21442d 0%, #162c1e 55%, #0c1710 100%)", "rgba(255,212,59,0.42)", "#ffd43b", "rgba(74,222,128,0.22)", "none"],
  ["Золотой король", "radial-gradient(circle at 18% 15%, rgba(254,240,138,0.34) 0%, transparent 48%), radial-gradient(circle at 86% 85%, rgba(245,158,11,0.28) 0%, transparent 48%), linear-gradient(135deg, #854d0e 0%, #ca8a04 48%, #451a03 100%)", "#fbbf24", "#fef08a", "rgba(251,191,36,0.45)", "pstyle-fx-shimmer"],
  ["Ночной неон", "radial-gradient(circle at 16% 20%, rgba(34,211,238,0.34) 0%, transparent 48%), radial-gradient(circle at 86% 82%, rgba(168,85,247,0.34) 0%, transparent 50%), linear-gradient(135deg, #1e1b4b 0%, #5b21b6 55%, #170f38 100%)", "#22d3ee", "#67e8f9", "rgba(34,211,238,0.48)", "pstyle-fx-pulse"],
  ["Киберпанк 2077", "radial-gradient(circle at 15% 20%, rgba(34,211,238,0.32) 0%, transparent 46%), radial-gradient(circle at 86% 78%, rgba(236,72,153,0.36) 0%, transparent 48%), linear-gradient(135deg, #11111b 0%, #4c1d95 48%, #9d174d 100%)", "#facc15", "#22d3ee", "rgba(236,72,153,0.48)", "pstyle-fx-shimmer"],
  ["Кровавая луна", "radial-gradient(circle at 18% 18%, rgba(248,113,113,0.34) 0%, transparent 48%), radial-gradient(circle at 85% 82%, rgba(185,28,28,0.3) 0%, transparent 48%), linear-gradient(135deg, #5c0c0c 0%, #b91c1c 48%, #18181b 100%)", "#ef4444", "#fca5a5", "rgba(239,68,68,0.45)", "pstyle-fx-pulse"],
  ["Ледяной дворец", "radial-gradient(circle at 18% 16%, rgba(224,242,254,0.36) 0%, transparent 46%), radial-gradient(circle at 85% 82%, rgba(56,189,248,0.32) 0%, transparent 48%), linear-gradient(135deg, #075985 0%, #0284c7 50%, #082f49 100%)", "#7dd3fc", "#e0f2fe", "rgba(125,211,252,0.44)", "pstyle-fx-shimmer"],
  ["Изумрудный лес", "radial-gradient(circle at 16% 18%, rgba(110,231,183,0.32) 0%, transparent 48%), radial-gradient(circle at 86% 80%, rgba(16,185,129,0.28) 0%, transparent 48%), linear-gradient(135deg, #065f46 0%, #059669 50%, #022c22 100%)", "#34d399", "#a7f3d0", "rgba(52,211,153,0.38)", "none"],
  ["Нежная сакура", "radial-gradient(circle at 18% 18%, rgba(251,207,232,0.36) 0%, transparent 48%), radial-gradient(circle at 84% 80%, rgba(244,114,182,0.34) 0%, transparent 48%), linear-gradient(135deg, #831843 0%, #db2777 50%, #4c0519 100%)", "#f9a8d4", "#fbcfe8", "rgba(244,114,182,0.44)", "pstyle-fx-stars"],
  ["Лавовый поток", "radial-gradient(circle at 16% 20%, rgba(253,224,71,0.32) 0%, transparent 44%), radial-gradient(circle at 82% 80%, rgba(249,115,22,0.36) 0%, transparent 48%), linear-gradient(135deg, #292524 0%, #c2410c 48%, #dc2626 100%)", "#fb923c", "#fde047", "rgba(249,115,22,0.48)", "pstyle-fx-pulse"],
  ["Космическая бездна", "radial-gradient(circle at 18% 20%, rgba(165,180,252,0.32) 0%, transparent 48%), radial-gradient(circle at 86% 80%, rgba(99,102,241,0.3) 0%, transparent 48%), linear-gradient(135deg, #060b28 0%, #1e1b4b 48%, #4338ca 100%)", "#818cf8", "#c7d2fe", "rgba(129,140,248,0.44)", "pstyle-fx-stars"],
  ["Северное сияние", "radial-gradient(circle at 20% 20%, rgba(94,234,212,0.3) 0%, transparent 46%), linear-gradient(135deg, #065f46 0%, #0891b2 45%, #6d28d9 100%)", "#2dd4bf", "#99f6e4", "rgba(45,212,191,0.48)", "pstyle-fx-rainbow"],
  ["Радужный закат", "radial-gradient(circle at 18% 20%, rgba(255,255,255,0.24) 0%, transparent 42%), linear-gradient(135deg, #db2777, #ea580c, #eab308, #16a34a, #2563eb)", "#ffffff", "#fef08a", "rgba(255,255,255,0.38)", "pstyle-fx-rainbow"],
  ["Алмазный блеск", "radial-gradient(circle at 18% 16%, rgba(207,250,254,0.38) 0%, transparent 46%), radial-gradient(circle at 86% 84%, rgba(34,211,238,0.32) 0%, transparent 48%), linear-gradient(135deg, #155e75 0%, #0891b2 48%, #0f172a 100%)", "#67e8f9", "#ecfeff", "rgba(103,232,249,0.52)", "pstyle-fx-shimmer"],
  ["Королевский бархат", "radial-gradient(circle at 18% 18%, rgba(250,204,21,0.28) 0%, transparent 45%), radial-gradient(circle at 84% 80%, rgba(168,85,247,0.34) 0%, transparent 48%), linear-gradient(135deg, #3b0764 0%, #7e22ce 50%, #1e1b4b 100%)", "#facc15", "#fde047", "rgba(168,85,247,0.48)", "pstyle-fx-shimmer"],
  ["Токсичный лайм", "radial-gradient(circle at 16% 18%, rgba(190,242,100,0.34) 0%, transparent 46%), radial-gradient(circle at 84% 82%, rgba(74,222,128,0.28) 0%, transparent 48%), linear-gradient(135deg, #14532d 0%, #4d7c0f 48%, #09090b 100%)", "#a3e635", "#d9f99d", "rgba(163,230,53,0.45)", "pstyle-fx-pulse"],
  ["Золотой песок", "radial-gradient(circle at 18% 18%, rgba(254,240,138,0.32) 0%, transparent 48%), radial-gradient(circle at 84% 82%, rgba(234,179,8,0.28) 0%, transparent 48%), linear-gradient(135deg, #854d0e 0%, #ca8a04 48%, #422006 100%)", "#fde047", "#fef9c3", "rgba(234,179,8,0.38)", "none"],
  ["Магический аметист", "radial-gradient(circle at 16% 18%, rgba(233,213,255,0.34) 0%, transparent 46%), radial-gradient(circle at 86% 80%, rgba(168,85,247,0.34) 0%, transparent 48%), linear-gradient(135deg, #581c87 0%, #7c3aed 50%, #2e1065 100%)", "#c084fc", "#f3e8ff", "rgba(192,132,252,0.48)", "pstyle-fx-stars"],
  ["Океанская глубина", "radial-gradient(circle at 18% 18%, rgba(125,211,252,0.34) 0%, transparent 46%), radial-gradient(circle at 84% 82%, rgba(56,189,248,0.28) 0%, transparent 48%), linear-gradient(135deg, #0f172a 0%, #1d4ed8 48%, #0284c7 100%)", "#38bdf8", "#bae6fd", "rgba(56,189,248,0.4)", "none"],
  ["Пылающий феникс", "radial-gradient(circle at 18% 18%, rgba(254,240,138,0.34) 0%, transparent 46%), radial-gradient(circle at 84% 80%, rgba(249,115,22,0.34) 0%, transparent 48%), linear-gradient(135deg, #7f1d1d 0%, #dc2626 48%, #f59e0b 100%)", "#fde047", "#fef08a", "rgba(239,68,68,0.48)", "pstyle-fx-shimmer"],
  ["Звёздная ночь", "radial-gradient(circle at 18% 18%, rgba(251,191,36,0.28) 0%, transparent 45%), radial-gradient(circle at 86% 80%, rgba(96,165,250,0.3) 0%, transparent 48%), linear-gradient(135deg, #0f172a 0%, #1d4ed8 50%, #172554 100%)", "#fbbf24", "#fde68a", "rgba(59,130,246,0.42)", "pstyle-fx-stars"],
  ["Медовый улей", "radial-gradient(circle at 18% 18%, rgba(253,224,71,0.34) 0%, transparent 46%), radial-gradient(circle at 84% 82%, rgba(245,158,11,0.3) 0%, transparent 48%), linear-gradient(135deg, #5c2405 0%, #d97706 50%, #92400e 100%)", "#fcd34d", "#fef3c7", "rgba(245,158,11,0.44)", "none"],
  ["Голограмма", "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.25) 0%, transparent 44%), linear-gradient(135deg, #86198f, #0284c7, #4338ca, #ec4899)", "#f0abfc", "#e0f2fe", "rgba(240,171,252,0.48)", "pstyle-fx-rainbow"],
  ["Обсидиан и золото", "radial-gradient(circle at 16% 18%, rgba(255,212,59,0.26) 0%, transparent 46%), radial-gradient(circle at 86% 82%, rgba(255,255,255,0.12) 0%, transparent 44%), linear-gradient(135deg, #111116 0%, #27272a 52%, #09090b 100%)", "#ffd43b", "#ffd43b", "rgba(255,212,59,0.36)", "pstyle-fx-shimmer"],
  ["Мятная свежесть", "radial-gradient(circle at 18% 18%, rgba(153,246,228,0.34) 0%, transparent 46%), radial-gradient(circle at 84% 82%, rgba(45,212,191,0.28) 0%, transparent 48%), linear-gradient(135deg, #115e59 0%, #0d9488 50%, #042f2e 100%)", "#5eead4", "#ccfbf1", "rgba(94,234,212,0.4)", "none"],
  ["Рубиновый шик", "radial-gradient(circle at 18% 18%, rgba(253,164,175,0.34) 0%, transparent 46%), radial-gradient(circle at 84% 82%, rgba(244,63,94,0.32) 0%, transparent 48%), linear-gradient(135deg, #58061c 0%, #e11d48 50%, #881337 100%)", "#fb7185", "#ffe4e6", "rgba(244,63,94,0.46)", "pstyle-fx-shimmer"],
  ["Сапфировая ночь", "radial-gradient(circle at 18% 18%, rgba(147,197,253,0.34) 0%, transparent 46%), radial-gradient(circle at 86% 82%, rgba(59,130,246,0.32) 0%, transparent 48%), linear-gradient(135deg, #172554 0%, #2563eb 50%, #1e3a8a 100%)", "#60a5fa", "#dbeafe", "rgba(96,165,250,0.44)", "pstyle-fx-stars"],
  ["Квантовый импульс", "radial-gradient(circle at 16% 18%, rgba(34,211,238,0.36) 0%, transparent 46%), radial-gradient(circle at 86% 80%, rgba(99,102,241,0.34) 0%, transparent 48%), linear-gradient(135deg, #0f172a 0%, #4f46e5 48%, #0891b2 100%)", "#22d3ee", "#a5f3fc", "rgba(34,211,238,0.5)", "pstyle-fx-pulse"],
  ["Ретро-вейв", "radial-gradient(circle at 20% 20%, rgba(253,224,71,0.26) 0%, transparent 45%), linear-gradient(135deg, #3b0764, #db2777, #f97316, #7c3aed)", "#f472b6", "#fde047", "rgba(236,72,153,0.48)", "pstyle-fx-rainbow"],
  ["Хром и сталь", "radial-gradient(circle at 18% 16%, rgba(255,255,255,0.32) 0%, transparent 44%), radial-gradient(circle at 84% 84%, rgba(148,163,184,0.28) 0%, transparent 48%), linear-gradient(135deg, #1e293b 0%, #64748b 50%, #334155 100%)", "#e2e8f0", "#f8fafc", "rgba(226,232,240,0.36)", "pstyle-fx-shimmer"],
  ["Небесный рай", "radial-gradient(circle at 18% 18%, rgba(254,240,138,0.3) 0%, transparent 44%), radial-gradient(circle at 84% 80%, rgba(186,230,253,0.32) 0%, transparent 48%), linear-gradient(135deg, #0369a1 0%, #38bdf8 50%, #0284c7 100%)", "#fef08a", "#ffffff", "rgba(56,189,248,0.45)", "pstyle-fx-stars"],
  ["Тёмный самурай", "radial-gradient(circle at 18% 18%, rgba(244,63,94,0.32) 0%, transparent 46%), radial-gradient(circle at 84% 82%, rgba(153,27,27,0.3) 0%, transparent 48%), linear-gradient(135deg, #18181b 0%, #7f1d1d 48%, #09090b 100%)", "#f43f5e", "#fecdd3", "rgba(244,63,94,0.4)", "none"],
  ["Призрачный туман", "radial-gradient(circle at 18% 18%, rgba(221,214,254,0.34) 0%, transparent 46%), radial-gradient(circle at 86% 80%, rgba(139,92,246,0.34) 0%, transparent 48%), linear-gradient(135deg, #2e1065 0%, #6d28d9 50%, #1e1b4b 100%)", "#ddd6fe", "#f5f3ff", "rgba(167,139,250,0.46)", "pstyle-fx-pulse"],
  ["Эльфийский сад", "radial-gradient(circle at 18% 18%, rgba(190,242,100,0.32) 0%, transparent 46%), radial-gradient(circle at 84% 82%, rgba(74,222,128,0.28) 0%, transparent 48%), linear-gradient(135deg, #065f46 0%, #16a34a 50%, #14532d 100%)", "#bef264", "#ecfccb", "rgba(132,204,22,0.42)", "pstyle-fx-stars"],
  ["Солнечная вспышка", "radial-gradient(circle at 22% 18%, rgba(255,255,255,0.35) 0%, transparent 44%), radial-gradient(circle at 84% 82%, rgba(254,240,138,0.34) 0%, transparent 48%), linear-gradient(135deg, #9a3412 0%, #f59e0b 50%, #eab308 100%)", "#ffffff", "#fef9c3", "rgba(250,204,21,0.52)", "pstyle-fx-pulse"],
  ["Лесной мох", "radial-gradient(circle at 18% 18%, rgba(163,230,53,0.28) 0%, transparent 46%), radial-gradient(circle at 84% 82%, rgba(101,163,13,0.26) 0%, transparent 48%), linear-gradient(135deg, #274408 0%, #3f6212 50%, #0f1a12 100%)", "#84cc16", "#d9f99d", "rgba(132,204,22,0.34)", "none"],
  ["Вишнёвый шторм", "radial-gradient(circle at 18% 18%, rgba(244,114,182,0.34) 0%, transparent 46%), radial-gradient(circle at 84% 82%, rgba(190,24,93,0.34) 0%, transparent 48%), linear-gradient(135deg, #58055e 0%, #be185d 50%, #500724 100%)", "#f472b6", "#fce7f3", "rgba(236,72,153,0.44)", "pstyle-fx-shimmer"],
  ["Бирюзовая лагуна", "radial-gradient(circle at 18% 18%, rgba(165,243,252,0.34) 0%, transparent 46%), radial-gradient(circle at 84% 82%, rgba(45,212,191,0.3) 0%, transparent 48%), linear-gradient(135deg, #115e59 0%, #06b6d4 50%, #0f766e 100%)", "#a5f3fc", "#fef08a", "rgba(6,182,212,0.44)", "none"],
  ["Платиновый люкс", "radial-gradient(circle at 18% 16%, rgba(255,255,255,0.36) 0%, transparent 45%), radial-gradient(circle at 86% 84%, rgba(186,230,253,0.24) 0%, transparent 48%), linear-gradient(135deg, #334155 0%, #64748b 50%, #1e293b 100%)", "#f8fafc", "#ffffff", "rgba(248,250,252,0.42)", "pstyle-fx-shimmer"],
  ["Грозовое небо", "radial-gradient(circle at 18% 18%, rgba(253,224,71,0.24) 0%, transparent 44%), radial-gradient(circle at 86% 82%, rgba(96,165,250,0.32) 0%, transparent 48%), linear-gradient(135deg, #0f172a 0%, #1e293b 48%, #3730a3 100%)", "#60a5fa", "#fde047", "rgba(96,165,250,0.44)", "pstyle-fx-pulse"],
  ["Конфетная мечта", "radial-gradient(circle at 20% 20%, rgba(251,207,232,0.28) 0%, transparent 45%), linear-gradient(135deg, #db2777, #7c3aed, #0284c7, #ec4899)", "#fbcfe8", "#fef08a", "rgba(244,114,182,0.46)", "pstyle-fx-rainbow"],
  ["Банановый рай", "radial-gradient(circle at 18% 18%, rgba(254,240,138,0.38) 0%, transparent 46%), radial-gradient(circle at 84% 82%, rgba(250,204,21,0.3) 0%, transparent 48%), linear-gradient(135deg, #854d0e 0%, #eab308 50%, #713f12 100%)", "#fef08a", "#ffffff", "rgba(250,204,21,0.48)", "pstyle-fx-shimmer"],
  ["Древний свиток", "radial-gradient(circle at 18% 18%, rgba(253,186,116,0.3) 0%, transparent 46%), radial-gradient(circle at 84% 82%, rgba(217,119,6,0.26) 0%, transparent 48%), linear-gradient(135deg, #522005 0%, #92400e 50%, #292524 100%)", "#fdba74", "#ffedd5", "rgba(251,146,60,0.36)", "none"],
  ["Вулканический пепел", "radial-gradient(circle at 18% 18%, rgba(249,115,22,0.36) 0%, transparent 46%), radial-gradient(circle at 84% 82%, rgba(239,68,68,0.28) 0%, transparent 48%), linear-gradient(135deg, #1c1917 0%, #44403c 48%, #9a3412 100%)", "#f97316", "#fdba74", "rgba(234,88,12,0.44)", "pstyle-fx-pulse"],
  ["Хрустальный грот", "radial-gradient(circle at 18% 18%, rgba(165,243,252,0.36) 0%, transparent 46%), radial-gradient(circle at 84% 82%, rgba(168,85,247,0.32) 0%, transparent 48%), linear-gradient(135deg, #1e1b4b 0%, #0284c7 48%, #581c87 100%)", "#a5f3fc", "#e0f2fe", "rgba(165,243,252,0.48)", "pstyle-fx-stars"],
  ["Неоновая малина", "radial-gradient(circle at 18% 18%, rgba(244,114,182,0.36) 0%, transparent 46%), radial-gradient(circle at 84% 82%, rgba(236,72,153,0.36) 0%, transparent 48%), linear-gradient(135deg, #18181b 0%, #9d174d 48%, #ec4899 100%)", "#f472b6", "#fbcfe8", "rgba(236,72,153,0.52)", "pstyle-fx-pulse"],
  ["Глубокий индиго", "radial-gradient(circle at 18% 18%, rgba(165,180,252,0.32) 0%, transparent 46%), radial-gradient(circle at 84% 82%, rgba(99,102,241,0.3) 0%, transparent 48%), linear-gradient(135deg, #09090b 0%, #312e81 48%, #4f46e5 100%)", "#a5b4fc", "#e0e7ff", "rgba(99,102,241,0.44)", "none"],
  ["Божественный свет", "radial-gradient(circle at 20% 16%, rgba(255,255,255,0.4) 0%, transparent 44%), radial-gradient(circle at 84% 82%, rgba(254,240,138,0.38) 0%, transparent 48%), linear-gradient(135deg, #a16207 0%, #facc15 50%, #b45309 100%)", "#ffffff", "#fef9c3", "rgba(254,240,138,0.62)", "pstyle-fx-shimmer"],
  ["Туманность Андромеды", "radial-gradient(circle at 18% 18%, rgba(232,121,249,0.36) 0%, transparent 46%), radial-gradient(circle at 84% 82%, rgba(56,189,248,0.3) 0%, transparent 48%), linear-gradient(135deg, #3b0764 0%, #a21caf 48%, #1d4ed8 100%)", "#e879f9", "#fae8ff", "rgba(232,121,249,0.48)", "pstyle-fx-stars"],
  ["Хамелеон", "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.24) 0%, transparent 44%), linear-gradient(135deg, #0d9488, #6366f1, #ec4899, #14b8a6)", "#5eead4", "#ffffff", "rgba(99,102,241,0.48)", "pstyle-fx-rainbow"],
  ["Стиль Абсолюта", "radial-gradient(circle at 20% 18%, rgba(255,212,59,0.34) 0%, transparent 44%), linear-gradient(135deg, #09090b, #581c87, #d97706, #0284c7, #09090b)", "#ffd43b", "#fef08a", "rgba(255,212,59,0.58)", "pstyle-fx-rainbow"]
].map(([name, bg, border, accent, glow, fx], id) => ({
  id, name, bg, border, accent, glow, fx,
  cost: getCustomStepCost(id)
}));

// 12 стилей ника
const NICK_STYLES_DATA = [
  { id: 0, name: "Классика", cost: 0, bg: "linear-gradient(180deg, #ffffff, #cbd5e1)", glow: "rgba(255,255,255,0.2)", fx: "none" },
  { id: 1, name: "Радужный", cost: 125, bg: "linear-gradient(90deg, #ff4d6d, #ffd43b, #4ade80, #38bdf8, #c084fc, #ff4d6d)", glow: "rgba(255,255,255,0.35)", fx: "nick-fx-flow" },
  { id: 2, name: "Огненный", cost: 125, bg: "linear-gradient(90deg, #fef08a, #f97316, #ef4444, #f97316, #fef08a)", glow: "rgba(249,115,22,0.75)", fx: "nick-fx-fire" },
  { id: 3, name: "Золотой", cost: 125, bg: "linear-gradient(90deg, #b45309, #fde047, #ffffff, #f59e0b, #b45309)", glow: "rgba(250,204,21,0.65)", fx: "nick-fx-flow" },
  { id: 4, name: "Кибер-неон", cost: 125, bg: "linear-gradient(90deg, #22d3ee, #f472b6, #a855f7, #22d3ee)", glow: "rgba(34,211,238,0.8)", fx: "nick-fx-pulse" },
  { id: 5, name: "Ледяной", cost: 125, bg: "linear-gradient(90deg, #ffffff, #7dd3fc, #0284c7, #bae6fd, #ffffff)", glow: "rgba(56,189,248,0.75)", fx: "nick-fx-flow" },
  { id: 6, name: "Токсик", cost: 125, bg: "linear-gradient(90deg, #bef264, #22c55e, #06b6d4, #bef264)", glow: "rgba(74,222,128,0.75)", fx: "nick-fx-pulse" },
  { id: 7, name: "Галактика", cost: 125, bg: "linear-gradient(90deg, #e879f9, #818cf8, #38bdf8, #c084fc, #e879f9)", glow: "rgba(168,85,247,0.8)", fx: "nick-fx-flow" },
  { id: 8, name: "Закат", cost: 125, bg: "linear-gradient(90deg, #fde047, #fb7185, #c084fc, #fb7185, #fde047)", glow: "rgba(251,113,133,0.7)", fx: "nick-fx-flow" },
  { id: 9, name: "Кровавый", cost: 125, bg: "linear-gradient(90deg, #fecaca, #ef4444, #991b1b, #ef4444, #fecaca)", glow: "rgba(239,68,68,0.8)", fx: "nick-fx-fire" },
  { id: 10, name: "Электрик", cost: 125, bg: "linear-gradient(90deg, #fef08a, #38bdf8, #ffffff, #2563eb, #fef08a)", glow: "rgba(96,165,250,0.85)", fx: "nick-fx-pulse" },
  { id: 11, name: "Тропики", cost: 125, bg: "linear-gradient(90deg, #fde047, #4ade80, #2dd4bf, #fde047)", glow: "rgba(45,212,191,0.7)", fx: "nick-fx-flow" }
];

// Скины для каждой обезьянки (0 = стандарт, 1..3 = платные скины из img/skins/{monkeyId}/{1..3})
const MONKEY_SKINS_DATA = [
  { id: 0, name: "Стандарт", cost: 0 },
  { id: 1, name: "Скин #1", cost: 250 },
  { id: 2, name: "Скин #2", cost: 500 },
  { id: 3, name: "Скин #3", cost: 1000 }
];