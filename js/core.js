const STORAGE_KEY = "banana_monkey_clicker_v1";
const DAY_MS = 24 * 60 * 60 * 1000;
const WEEK_MS = 168 * 60 * 60 * 1000;
const CUSTOM_STEPS = 10;
const MAX_ACCOUNT_LEVEL = 999;
const MAX_FINITE_NUM = 1e305;
const ABSOLUTE_BANANA_INDEX = BANANAS_DATA.length - 1;
const MULTI_BTNS = [
  [1, "buyX1Btn"],
  [10, "buyX10Btn"],
  [25, "buyX25Btn"],
  [50, "buyX50Btn"],
  ["max", "buyMaxBtn"]
];

const uiDirty = { ach: true, col: true, shop: true };
function markUiDirty(...keys) {
  if (!keys.length) {
    uiDirty.ach = uiDirty.col = uiDirty.shop = true;
    return;
  }
  keys.forEach((k) => {
    if (k in uiDirty) uiDirty[k] = true;
  });
}

const getDefaultState = () => ({
  saveVersion: 1,
  accountLevel: 0,
  bananas: 0,
  diamonds: 0,
  totalEarned: 0,
  totalClicks: 0,
  playTimeSeconds: 0,
  completedQuestsTotal: 0,
  completedDailyQuests: 0,
  completedWeeklyQuests: 0,
  activeMonkeyId: 0,
  unlockedMonkeys: [0],
  unlockedFrames: [0],
  unlockedStyles: [0],
  unlockedBgs: [0],
  unlockedNickStyles: [0],
  unlockedMonkeySkins: {},
  equippedMonkeySkins: {},
  frameProgress: {},
  styleProgress: {},
  bgProgress: {},
  achievementStages: {},
  collections: { counts: {}, turnIns: {} },
  bananaCounts: new Array(BANANAS_DATA.length).fill(0),
  soundEnabled: true,
  hapticEnabled: true,
  lowPerfMode: false,
  lastSaveTime: Date.now(),
  offlineLimitHours: 2,
  dailyLogin: { streak: 0, lastClaimDate: "" },
  dailyQuests: { nextResetAt: 0, items: [], progress: { clicks: 0, buyBananas: 0, playTime: 0, spendBananas: 0 } },
  weeklyQuests: { nextResetAt: 0, items: [], progress: { spendBananas: 0, buyBananas: 0, earnDiamonds: 0, dailyCompleted: 0, playTime: 0 } },
  wheelNextSpinAt: 0,
  wheelSpinsUsed: 0,
  pendingWheelRewardId: null,
  premiumUntil: 0,
  platinumUntil: 0,
  goldVipPurchases: 0,
  platinumVipPurchases: 0,
  crabDiscountNextAt: 0,
  crabDiscountUsed: 0,
  coconutsGame: null,
  profile: { nickname: "BananaPro", avatarType: "monkey", avatarValue: 0, frameId: 0, styleId: 0, bgId: 0, nickStyleId: 0 }
});

let state = loadState();

function clampFinite(v) {
  const n = Number(v);
  if (Number.isNaN(n) || n <= 0) return 0;
  return !Number.isFinite(n) || n > MAX_FINITE_NUM ? MAX_FINITE_NUM : n;
}

function addBananas(amount) {
  const gain = Number(amount);
  if (!Number.isFinite(gain) || gain <= 0) return;
  state.bananas = clampFinite(state.bananas + gain);
  state.totalEarned = clampFinite(state.totalEarned + gain);
}

function spendDiamonds(cost) {
  const amount = Math.floor(nonNegNum(cost));
  if (amount <= 0) return true;
  if (state.diamonds < amount) {
    playSfx("error");
    triggerHaptic(30);
    showToast(`Нужно ${amount} 💎 (не хватает ${amount - state.diamonds} 💎)!`);
    return false;
  }
  state.diamonds -= amount;
  return true;
}

function sanitizeProgressObj(src, keys) {
  const out = {};
  keys.forEach((k) => {
    out[k] = nonNegNum(src?.[k], 0);
  });
  return out;
}

function sanitizeCustomProgress(rawMap, maxLen, unlockedArr) {
  const out = {};
  if (!rawMap || typeof rawMap !== "object") return out;
  Object.keys(rawMap).forEach((k) => {
    const id = Number(k);
    const count = Math.floor(nonNegNum(rawMap[k]));
    if (
      Number.isInteger(id) &&
      id > 0 &&
      id < maxLen &&
      !unlockedArr.includes(id) &&
      count > 0 &&
      count < CUSTOM_STEPS
    ) {
      out[id] = count;
    }
  });
  return out;
}

function filterValidIds(arr, maxLen, minVal = 0, withDefaultZero = true) {
  const list = (Array.isArray(arr) ? arr : [])
    .map(Number)
    .filter((id) => Number.isInteger(id) && id >= minVal && id < maxLen);
  return Array.from(new Set(withDefaultZero ? [0, ...list] : list));
}

function loadState() {
  const def = getDefaultState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return def;
    const p = JSON.parse(raw);
    const now = Date.now();
    const m = {
      ...def,
      ...p,
      profile: { ...def.profile, ...(p.profile || {}) },
      dailyQuests: {
        ...def.dailyQuests,
        ...(p.dailyQuests || {}),
        progress: sanitizeProgressObj(p.dailyQuests?.progress, ["clicks", "buyBananas", "playTime", "spendBananas"])
      },
      weeklyQuests: {
        ...def.weeklyQuests,
        ...(p.weeklyQuests || {}),
        progress: sanitizeProgressObj(p.weeklyQuests?.progress, ["spendBananas", "buyBananas", "earnDiamonds", "dailyCompleted", "playTime"])
      }
    };

    m.accountLevel = Math.min(MAX_ACCOUNT_LEVEL, Math.floor(nonNegNum(p.accountLevel)));
    m.bananas = clampFinite(nonNegNum(m.bananas));
    m.diamonds = Math.floor(nonNegNum(m.diamonds));
    m.totalEarned = clampFinite(nonNegNum(m.totalEarned));
    m.totalClicks = Math.floor(nonNegNum(m.totalClicks));
    m.playTimeSeconds = nonNegNum(m.playTimeSeconds);
    m.completedQuestsTotal = Math.floor(nonNegNum(m.completedQuestsTotal));
    m.completedDailyQuests = Math.floor(nonNegNum(p.completedDailyQuests, m.completedQuestsTotal));
    m.completedWeeklyQuests = Math.floor(nonNegNum(p.completedWeeklyQuests));
    m.bananaCounts = Array.from({ length: BANANAS_DATA.length }, (_, i) => Math.floor(nonNegNum(m.bananaCounts?.[i])));

    m.unlockedMonkeys = filterValidIds(p.unlockedMonkeys, MONKEYS_DATA.length);
    const activeId = Number(m.activeMonkeyId);
    m.activeMonkeyId = Number.isInteger(activeId) && m.unlockedMonkeys.includes(activeId) ? activeId : 0;

    m.unlockedFrames = filterValidIds(p.unlockedFrames, AVATAR_FRAMES_DATA.length);
    m.unlockedStyles = filterValidIds(p.unlockedStyles, PROFILE_STYLES_DATA.length);
    m.unlockedBgs = filterValidIds(p.unlockedBgs, BACKGROUNDS_DATA.length);
    m.unlockedNickStyles = filterValidIds(p.unlockedNickStyles, NICK_STYLES_DATA.length);

    const frameId = Number(m.profile.frameId);
    const styleId = Number(m.profile.styleId);
    const bgId = Number(m.profile.bgId);
    const nickStyleId = Number(m.profile.nickStyleId);
    m.profile.frameId = Number.isInteger(frameId) && m.unlockedFrames.includes(frameId) ? frameId : 0;
    m.profile.styleId = Number.isInteger(styleId) && m.unlockedStyles.includes(styleId) ? styleId : 0;
    m.profile.bgId = Number.isInteger(bgId) && m.unlockedBgs.includes(bgId) ? bgId : 0;
    m.profile.nickStyleId = Number.isInteger(nickStyleId) && m.unlockedNickStyles.includes(nickStyleId) ? nickStyleId : 0;

    const cleanSkins = {};
    if (p.unlockedMonkeySkins && typeof p.unlockedMonkeySkins === "object") {
      Object.keys(p.unlockedMonkeySkins).forEach((k) => {
        const mid = Number(k);
        if (!Number.isInteger(mid) || mid < 0 || mid >= MONKEYS_DATA.length) return;
        const valid = filterValidIds(p.unlockedMonkeySkins[k], MONKEY_SKINS_DATA.length, 1, false);
        if (valid.length) cleanSkins[mid] = valid;
      });
    }
    m.unlockedMonkeySkins = cleanSkins;

    const cleanEqSkins = {};
    if (p.equippedMonkeySkins && typeof p.equippedMonkeySkins === "object") {
      Object.keys(p.equippedMonkeySkins).forEach((k) => {
        const mid = Number(k);
        const sid = Number(p.equippedMonkeySkins[k]);
        if (Number.isInteger(mid) && cleanSkins[mid]?.includes(sid)) cleanEqSkins[mid] = sid;
      });
    }
    m.equippedMonkeySkins = cleanEqSkins;

    const validImg =
      m.profile.avatarType === "image" &&
      typeof m.profile.avatarValue === "string" &&
      /^data:image\/(png|jpeg|jpg|webp|gif);base64,[A-Za-z0-9+/=]+$/i.test(m.profile.avatarValue);

    if (!validImg) {
      const avId = Number(m.profile.avatarValue);
      m.profile.avatarType = "monkey";
      m.profile.avatarValue = Number.isInteger(avId) && MONKEYS_DATA[avId] ? avId : 0;
    }

    m.frameProgress = sanitizeCustomProgress(p.frameProgress, AVATAR_FRAMES_DATA.length, m.unlockedFrames);
    m.styleProgress = sanitizeCustomProgress(p.styleProgress, PROFILE_STYLES_DATA.length, m.unlockedStyles);
    m.bgProgress = sanitizeCustomProgress(p.bgProgress, BACKGROUNDS_DATA.length, m.unlockedBgs);

    m.achievementStages = {};
    if (p.achievementStages && typeof p.achievementStages === "object") {
      ACHIEVEMENTS_DATA.forEach((a) => {
        const st = Math.floor(nonNegNum(p.achievementStages[a.id]));
        if (st > 0) m.achievementStages[a.id] = Math.min(st, a.stages.length);
      });
    }

    const rawCol = p.collections && typeof p.collections === "object" ? p.collections : {};
    const cleanCounts = {};
    if (rawCol.counts && typeof rawCol.counts === "object") {
      Object.keys(rawCol.counts).forEach((k) => {
        const q = Math.floor(nonNegNum(rawCol.counts[k]));
        if (q > 0 && /^c([1-9]|[12]\d|30)_[0-7]$/.test(k)) cleanCounts[k] = q;
      });
    } else if (rawCol.items && typeof rawCol.items === "object") {
      Object.keys(rawCol.items).forEach((k) => {
        const match = k.match(/^c([1-9]|[12]\d|30)_([0-7])$/);
        if (match && rawCol.items[k] && !(rawCol.claimed && rawCol.claimed[match[1]])) cleanCounts[k] = 1;
      });
    }
    const cleanTurnIns = {};
    const srcTurns = rawCol.turnIns || rawCol.claimed || {};
    if (typeof srcTurns === "object") {
      Object.keys(srcTurns).forEach((k) => {
        const n = Number(k);
        const val = srcTurns[k] === true ? 1 : Math.floor(nonNegNum(srcTurns[k]));
        if (val > 0 && Number.isInteger(n) && n >= 1 && n <= 30) cleanTurnIns[n] = val;
      });
    }
    m.collections = { counts: cleanCounts, turnIns: cleanTurnIns };

    m.soundEnabled = m.soundEnabled !== false;
    m.hapticEnabled = m.hapticEnabled !== false;
    m.lowPerfMode = Boolean(p.lowPerfMode);

    m.dailyLogin = p.dailyLogin && typeof p.dailyLogin === "object"
      ? {
          streak: Math.max(0, Math.min(7, Math.floor(nonNegNum(p.dailyLogin.streak)))),
          lastClaimDate: typeof p.dailyLogin.lastClaimDate === "string" ? p.dailyLogin.lastClaimDate : ""
        }
      : { streak: 0, lastClaimDate: "" };

    const savedAt = Number(p.lastSaveTime);
    m.lastSaveTime = Number.isFinite(savedAt) && savedAt > 0 && savedAt <= now ? savedAt : now;
    m.offlineLimitHours = [2, 4, 8, 12].includes(Number(p.offlineLimitHours)) ? Number(p.offlineLimitHours) : 2;

    m.premiumUntil = nonNegNum(p.premiumUntil);
    m.platinumUntil = nonNegNum(p.platinumUntil);
    m.goldVipPurchases = Math.floor(nonNegNum(p.goldVipPurchases, m.premiumUntil > now ? 1 : 0));
    m.platinumVipPurchases = Math.floor(nonNegNum(p.platinumVipPurchases, m.platinumUntil > now ? 1 : 0));
    m.wheelNextSpinAt = Math.min(nonNegNum(p.wheelNextSpinAt), now + 12 * 3600 * 1000);
    m.wheelSpinsUsed = p.wheelSpinsUsed === undefined ? (m.wheelNextSpinAt > now ? 1 : 0) : Math.floor(nonNegNum(p.wheelSpinsUsed));
    m.crabDiscountNextAt = Math.min(nonNegNum(p.crabDiscountNextAt), now + 12 * 3600 * 1000);
    m.crabDiscountUsed = p.crabDiscountUsed === undefined ? (m.crabDiscountNextAt > now ? 1 : 0) : Math.floor(nonNegNum(p.crabDiscountUsed));
    m.pendingWheelRewardId = typeof p.pendingWheelRewardId === "string" ? p.pendingWheelRewardId : null;

    if (
      !p.coconutsGame ||
      !Array.isArray(p.coconutsGame.board) ||
      p.coconutsGame.board.length !== 9 ||
      !Array.isArray(p.coconutsGame.opened) ||
      p.coconutsGame.opened.length !== 9
    ) {
      m.coconutsGame = null;
    } else {
      const status = ["playing", "won", "lost"].includes(p.coconutsGame.status) ? p.coconutsGame.status : "playing";
      m.coconutsGame = {
        active: status === "playing" && Boolean(p.coconutsGame.active),
        status,
        bank: Math.min(250, Math.floor(nonNegNum(p.coconutsGame.bank))),
        costPaid: Math.floor(nonNegNum(p.coconutsGame.costPaid, 75)),
        board: p.coconutsGame.board.map((v) => (v === "crab" ? "crab" : Math.floor(nonNegNum(v)))),
        opened: p.coconutsGame.opened.map(Boolean)
      };
    }

    if (!isValidEnglishNick(m.profile.nickname)) m.profile.nickname = "BananaPro";
    return m;
  } catch (_) {
    return def;
  }
}

function isMonkeySkinUnlocked(monkeyId, skinId) {
  if (skinId === 0) return true;
  const arr = state.unlockedMonkeySkins?.[monkeyId];
  return Array.isArray(arr) && arr.includes(skinId);
}

function getMonkeyEquippedSkin(monkeyId) {
  const sid = Number(state.equippedMonkeySkins?.[monkeyId] || 0);
  return sid >= 1 && sid < MONKEY_SKINS_DATA.length && isMonkeySkinUnlocked(monkeyId, sid) ? sid : 0;
}

function getTotalUnlockedSkinsCount() {
  const map = state.unlockedMonkeySkins || {};
  let total = 0;
  for (const k in map) {
    if (Array.isArray(map[k])) total += map[k].length;
  }
  return total;
}

function saveState() {
  state.lastSaveTime = Date.now();
  state.bananas = clampFinite(state.bananas);
  state.totalEarned = clampFinite(state.totalEarned);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (_) {}
}

function exportSaveCode() {
  saveState();
  const bytes = new TextEncoder().encode(JSON.stringify(state));
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return "BM1:" + btoa(bin);
}

function importSaveCode(code) {
  const clean = (code || "").trim();
  if (!clean.startsWith("BM1:")) return false;
  try {
    const bin = atob(clean.slice(4));
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    const parsed = JSON.parse(new TextDecoder().decode(bytes));
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed) || !Array.isArray(parsed.bananaCounts)) return false;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    state = loadState();
    saveState();
    return true;
  } catch (_) {
    return false;
  }
}

function getAccountLevel() {
  return Math.min(MAX_ACCOUNT_LEVEL, Math.floor(nonNegNum(state.accountLevel)));
}

function isMaxAccountLevel(level = getAccountLevel()) {
  return level >= MAX_ACCOUNT_LEVEL;
}

function getResetRequirement(level = getAccountLevel()) {
  if (level >= MAX_ACCOUNT_LEVEL) return 0;
  return level <= 0 ? 1 : Math.floor(1 + level * 3.3);
}

function getAbsoluteBananaOwned() {
  return Math.floor(nonNegNum(state.bananaCounts?.[ABSOLUTE_BANANA_INDEX]));
}

function canPerformLevelReset() {
  return !isMaxAccountLevel() && getAbsoluteBananaOwned() >= getResetRequirement();
}

function getAccountLevelMult(level = getAccountLevel()) {
  const clamped = Math.min(MAX_ACCOUNT_LEVEL, Math.max(0, Math.floor(nonNegNum(level))));
  return Math.pow(1.5, clamped);
}

function isPremiumActive() {
  return (state.premiumUntil || 0) > Date.now();
}

function isPlatinumActive() {
  return (state.platinumUntil || 0) > Date.now();
}

function getPremiumMult() {
  return isPlatinumActive() ? 4 : isPremiumActive() ? 2 : 1;
}

function getOfflineBonusHours() {
  return isPlatinumActive() ? 12 : isPremiumActive() ? 8 : 0;
}

function getBananaMilestoneMult(count) {
  const tiers = Math.floor(nonNegNum(count) / 25);
  if (tiers <= 0) return 1;
  const mult = Math.pow(1.5, tiers);
  return Number.isFinite(mult) ? Math.min(MAX_FINITE_NUM, mult) : MAX_FINITE_NUM;
}

function getBananaTotalBps(index) {
  const c = state.bananaCounts[index] || 0;
  return c <= 0 ? 0 : clampFinite(c * BANANAS_DATA[index].baseBps * getBananaMilestoneMult(c));
}

function getRawBps() {
  let total = 0;
  let comp = 0;
  for (let i = 0; i < BANANAS_DATA.length; i++) {
    const val = getBananaTotalBps(i);
    if (val <= 0) continue;
    const y = val - comp;
    const t = total + y;
    if (!Number.isFinite(t) || t > MAX_FINITE_NUM) return MAX_FINITE_NUM;
    comp = (t - total) - y;
    total = t;
  }
  return total;
}

function getBps() {
  return clampFinite(getRawBps() * getPremiumMult() * getAccountLevelMult());
}

function getBpc() {
  let base = 0;
  for (const id of state.unlockedMonkeys) {
    if (MONKEYS_DATA[id]) base += MONKEYS_DATA[id].clickPower;
  }
  if (base <= 0) base = 0.5;
  return clampFinite((base + getRawBps() * 0.02) * getPremiumMult() * getAccountLevelMult());
}

function getBaseOfflineMaxHours() {
  return [2, 4, 8, 12].includes(state.offlineLimitHours) ? state.offlineLimitHours : 2;
}

function getOfflineMaxHours() {
  return getBaseOfflineMaxHours() + getOfflineBonusHours();
}

function getBananaBulkCost(index, amount) {
  if (!Number.isFinite(amount) || amount <= 0) return 0;
  const owned = state.bananaCounts[index] || 0;
  const first = BANANAS_DATA[index].baseCost * Math.pow(1.15, owned);
  if (!Number.isFinite(first)) return Infinity;
  if (amount === 1) return Math.floor(first);
  const factor = (Math.pow(1.15, amount) - 1) / 0.15;
  if (!Number.isFinite(factor)) return Infinity;
  const total = first * factor;
  return Number.isFinite(total) ? Math.floor(total) : Infinity;
}

function getMaxAffordableBananas(index) {
  if (!Number.isFinite(state.bananas) || state.bananas <= 0) return 0;
  const owned = state.bananaCounts[index] || 0;
  const first = BANANAS_DATA[index].baseCost * Math.pow(1.15, owned);
  if (!Number.isFinite(first) || first <= 0 || state.bananas < Math.floor(first)) return 0;

  const ratio = (state.bananas / first) * 0.15;
  const logTerm = ratio > 1e15 ? Math.log(ratio) : Math.log1p(ratio);
  let hi = Math.floor(logTerm / Math.log(1.15)) + 2;
  if (!Number.isFinite(hi) || hi > 5070) hi = 5070;
  if (hi < 1) hi = 1;

  let lo = 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    const cost = getBananaBulkCost(index, mid);
    if (Number.isFinite(cost) && cost <= state.bananas) lo = mid;
    else hi = mid - 1;
  }
  return lo;
}