let lastVipVisualKey = "";
let lastGoldModalKey = "";
let lastPlatModalKey = "";
let lastAnyVipState = null;

const VIP_TIERS = {
  gold: {
    listId: "premiumList",
    modalId: "premiumModal",
    balId: "premiumShopBalance",
    untilKey: "premiumUntil",
    purchasesKey: "goldVipPurchases",
    isActive: () => isPremiumActive(),
    packages: PREMIUM_PACKAGES,
    title: "GOLD ПРЕМИУМ",
    badge: "VIP",
    iconId: "ico-tab-premium",
    heroCls: "",
    pkgCls: "",
    iconCls: "premium-pkg-icon",
    perks: [
      ["👆", "<strong>×2</strong> к клику"],
      ["⏱", "<strong>×2</strong> к добыче/сек"],
      ["🌙", "<strong>+8 ч</strong> офлайн-доход"],
      ["🎡", "<strong>2 спина</strong> рулетки / 12ч"],
      ["🦀", "Краб <strong>-50%</strong> (1 раз / 12ч)"],
      ["👑", "Золотой <strong>VIP-статус</strong>"]
    ],
    note: "",
    toastLabel: "👑 Gold VIP",
    built: false,
    refs: [],
    statusEl: null,
    badgeEl: null
  },
  plat: {
    listId: "platinumList",
    modalId: "platinumModal",
    balId: "platinumShopBalance",
    untilKey: "platinumUntil",
    purchasesKey: "platinumVipPurchases",
    isActive: () => isPlatinumActive(),
    packages: PLATINUM_PACKAGES,
    title: "PLATINUM ПРЕМИУМ",
    badge: "PLAT",
    iconId: "ico-tab-platinum",
    heroCls: " plat-hero-card",
    pkgCls: " platinum-pkg-card",
    iconCls: "platinum-pkg-icon",
    perks: [
      ["👆", "<strong>×4</strong> к клику"],
      ["⏱", "<strong>×4</strong> к добыче/сек"],
      ["🌙", "<strong>+12 ч</strong> офлайн-доход"],
      ["🎡", "<strong>3 спина</strong> рулетки / 12ч"],
      ["🦀", "Краб <strong>-50%</strong> (2 раза / 12ч)"],
      ["💠", "Платиновый <strong>VIP-статус</strong>"]
    ],
    note: `<div class="plat-note-line">Заменяет бонусы Gold VIP на время действия</div>`,
    toastLabel: "💠 Platinum VIP",
    built: false,
    refs: [],
    statusEl: null,
    badgeEl: null
  }
};

function buildVipShop(tierKey) {
  const t = VIP_TIERS[tierKey];
  const listEl = t && els[t.listId];
  if (!listEl) return;

  listEl.innerHTML = "";
  t.refs.length = 0;
  if (tierKey === "gold") lastGoldModalKey = "";
  else lastPlatModalKey = "";

  const frag = document.createDocumentFragment();
  const perksHtml = t.perks.map(([ico, txt]) => `<div class="vip-perk-item">${ico} <span>${txt}</span></div>`).join("");
  const hero = mkEl(
    "div",
    `vip-hero-card${t.heroCls}`,
    `<div class="vip-hero-top">` +
      `<div class="vip-hero-title-wrap"><span class="vip-hero-crown">${useSvg(t.iconId)}</span><div><div class="vip-hero-title">${t.title}</div><div class="vip-hero-sub">Статус: <strong class="vip-status-text">Не активен</strong></div></div></div>` +
      `<span class="vip-hero-badge">${t.badge}</span>` +
    `</div>` +
    `<div class="vip-perks-grid">${perksHtml}</div>` +
    t.note
  );
  t.statusEl = hero.querySelector(".vip-status-text");
  t.badgeEl = hero.querySelector(".vip-hero-badge");
  frag.appendChild(hero);

  t.packages.forEach((pkg) => {
    const ribbonHtml = pkg.badge ? `<span class="pkg-ribbon">${pkg.badge}</span>` : "";
    const card = mkEl(
      "div",
      `shop-item premium-pkg-card${t.pkgCls}`,
      `${ribbonHtml}` +
      `<div class="item-icon ${t.iconCls}">${useSvg(t.iconId)}<span class="pkg-days-tag">${pkg.days}д</span></div>` +
      `<div class="item-info"><div class="item-name">${pkg.title}</div><div class="item-sub">${pkg.sub}</div></div>` +
      `<button type="button" class="premium-buy-btn"></button>`
    );
    const btn = card.querySelector(".premium-buy-btn");
    btn.onclick = () => buyVipPackage(tierKey, pkg);
    frag.appendChild(card);
    t.refs.push({ pkg, card, btn });
  });

  listEl.appendChild(frag);
  t.built = true;
  if (state.lowPerfMode && typeof syncSvgAnimationsPause === "function") {
    syncSvgAnimationsPause();
  }
}

function buyVipPackage(tierKey, pkg) {
  const t = VIP_TIERS[tierKey];
  if (!t || !spendDiamonds(pkg.cost)) return;

  const now = Date.now();
  const baseTime = t.isActive() ? state[t.untilKey] : now;
  state[t.untilKey] = baseTime + pkg.days * DAY_MS;
  state[t.purchasesKey] = (state[t.purchasesKey] || 0) + 1;

  markUiDirty("ach");
  playSfx("fanfare");
  triggerHaptic([15, 25, 20]);
  spawnBgDropParticles();
  showToast(`${t.toastLabel} активирован на ${pkg.days} дн.!`);
  saveState();
  updateUI();
  updateProfileUI();
}

function formatVipBadgeText(sec, fallback) {
  if (sec <= 0) return fallback;
  const days = Math.floor(sec / 86400);
  return days >= 1 ? `${days}д+` : formatTime(sec);
}

function updatePremiumVisuals() {
  const vipActive = isPremiumActive();
  const platActive = isPlatinumActive();
  const anyVip = vipActive || platActive;

  const vipSec = vipActive ? Math.max(0, Math.ceil((state.premiumUntil - Date.now()) / 1000)) : 0;
  const platSec = platActive ? Math.max(0, Math.ceil((state.platinumUntil - Date.now()) / 1000)) : 0;
  const vipTxt = formatVipBadgeText(vipSec, "VIP");
  const platTxt = formatVipBadgeText(platSec, "PLAT");
  const vKey = `${vipActive ? 1 : 0}_${platActive ? 1 : 0}_${vipTxt}_${platTxt}`;

  if (lastVipVisualKey === vKey) return;
  lastVipVisualKey = vKey;

  if (els.appShell) {
    els.appShell.classList.toggle("has-premium", vipActive && !platActive);
    els.appShell.classList.toggle("has-platinum", platActive);
  }
  if (els.profileBtn) {
    els.profileBtn.classList.toggle("is-vip", vipActive && !platActive);
    els.profileBtn.classList.toggle("is-plat", platActive);
  }
  if (els.profileModalCard) {
    els.profileModalCard.classList.toggle("is-vip", vipActive && !platActive);
    els.profileModalCard.classList.toggle("is-plat", platActive);
  }

  [els.premiumHeaderBadge, els.profileModalVipBadge].forEach((badge) => {
    if (!badge) return;
    badge.classList.toggle("hidden", !anyVip);
    badge.classList.toggle("is-plat", platActive);
    if (anyVip) setText(badge, platActive ? "💠 PLAT" : "👑 VIP");
  });

  if (els.ratesVipBadge) {
    els.ratesVipBadge.classList.toggle("hidden", !anyVip);
    els.ratesVipBadge.classList.toggle("is-plat", platActive);
    const html = platActive ? "💠 <strong>×4</strong>" : "👑 <strong>×2</strong>";
    if (els.ratesVipBadge.dataset.lastHtml !== html) {
      els.ratesVipBadge.dataset.lastHtml = html;
      els.ratesVipBadge.innerHTML = html;
    }
  }

  if (lastAnyVipState !== anyVip) {
    lastAnyVipState = anyVip;
    if (typeof invalidateTapBtnRect === "function") invalidateTapBtnRect();
  }

  if (els.premiumMenuBtn) els.premiumMenuBtn.classList.toggle("is-vip-active", vipActive);
  if (els.premiumBtnBadge) {
    setText(els.premiumBtnBadge, vipTxt);
    els.premiumBtnBadge.classList.toggle("has-vip", vipActive);
  }

  if (els.platinumMenuBtn) els.platinumMenuBtn.classList.toggle("is-plat-active", platActive);
  if (els.platinumBtnBadge) {
    setText(els.platinumBtnBadge, platTxt);
    els.platinumBtnBadge.classList.toggle("has-plat", platActive);
  }
}

function updateVipModalUI(tierKey) {
  const t = VIP_TIERS[tierKey];
  const modal = t && els[t.modalId];
  if (!modal || modal.classList.contains("hidden")) return;
  if (!t.built) buildVipShop(tierKey);

  const active = t.isActive();
  const leftSec = active ? Math.max(0, Math.ceil((state[t.untilKey] - Date.now()) / 1000)) : 0;
  const key = `${state.diamonds}_${leftSec}`;
  if (tierKey === "gold") {
    if (lastGoldModalKey === key) return;
    lastGoldModalKey = key;
  } else {
    if (lastPlatModalKey === key) return;
    lastPlatModalKey = key;
  }

  setText(els[t.balId], formatNum(state.diamonds));
  setText(t.statusEl, active ? `Активен (${formatDurationLong(leftSec)})` : "Не активен");
  if (t.badgeEl) {
    setText(t.badgeEl, active ? "АКТИВЕН ✓" : t.badge);
    t.badgeEl.classList.toggle("is-active", active);
  }

  const prefix = active ? "Продлить " : "";
  for (let i = 0; i < t.refs.length; i++) {
    const r = t.refs[i];
    const canBuy = state.diamonds >= r.pkg.cost;
    const html = `<span class="pkg-btn-price">${prefix}${r.pkg.cost.toLocaleString("ru-RU")} ${gemHtml()}</span>`;
    syncBtnHtml(r, html, `premium-buy-btn ${canBuy ? "can-buy" : "cannot-buy"}`, false);
  }
}

function updatePremiumShopUI() { updateVipModalUI("gold"); }
function updatePlatinumShopUI() { updateVipModalUI("plat"); }