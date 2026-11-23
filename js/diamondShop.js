const TIME_WARP_ITEMS = [
  { id: "warp_1h",  hours: 1,  title: "Прыгнуть во времени на 1 ч",  cost: 50,  iconId: "ico-warp-1h" },
  { id: "warp_2h",  hours: 2,  title: "Прыгнуть во времени на 2 ч",  cost: 90,  iconId: "ico-warp-2h" },
  { id: "warp_5h",  hours: 5,  title: "Прыгнуть во времени на 5 ч",  cost: 200, iconId: "ico-warp-5h" },
  { id: "warp_12h", hours: 12, title: "Прыгнуть во времени на 12 ч", cost: 450, iconId: "ico-warp-12h" },
  { id: "warp_24h", hours: 24, title: "Прыгнуть во времени на 24 ч", cost: 700, iconId: "ico-warp-24h" }
];

const OFFLINE_UPGRADE_ITEMS = [
  { id: "off_4h",  hours: 4,  reqHours: 2, cost: 250, title: "Офлайн-доход до 4 ч",  iconId: "ico-offline-4h" },
  { id: "off_8h",  hours: 8,  reqHours: 4, cost: 500, title: "Офлайн-доход до 8 ч",  iconId: "ico-offline-8h" },
  { id: "off_12h", hours: 12, reqHours: 8, cost: 750, title: "Офлайн-доход до 12 ч", iconId: "ico-offline-12h" }
];

let diamondShopBuilt = false;
let lastDshopKey = "";
const dshopDomRefs = [];
const offlineDomRefs = [];

function getTimeWarpReward(hours) {
  return Math.floor(clampFinite(getBps() * hours * 3600));
}

function buildDiamondShop() {
  if (!els.diamondShopList) return;
  els.diamondShopList.innerHTML = "";
  dshopDomRefs.length = 0;
  lastDshopKey = "";

  const warpFrag = document.createDocumentFragment();
  TIME_WARP_ITEMS.forEach((item) => {
    const card = mkEl(
      "div",
      "shop-item dshop-card",
      `<div class="item-icon dshop-icon">${useSvg(item.iconId)}</div>` +
      `<div class="item-info">` +
        `<div class="item-name">${item.title}</div>` +
        `<div class="item-sub">Мгновенный доход: <span class="dshop-reward">0 🍌</span></div>` +
      `</div>` +
      `<button type="button" class="dshop-buy-btn"></button>`
    );
    const btn = card.querySelector(".dshop-buy-btn");
    btn.onclick = () => buyTimeWarp(item);
    warpFrag.appendChild(card);
    dshopDomRefs.push({
      item,
      rewardEl: card.querySelector(".dshop-reward"),
      btn,
      lastReward: ""
    });
  });
  els.diamondShopList.appendChild(warpFrag);

  if (els.offlineUpgradesList) {
    els.offlineUpgradesList.innerHTML = "";
    offlineDomRefs.length = 0;

    const offFrag = document.createDocumentFragment();
    OFFLINE_UPGRADE_ITEMS.forEach((item) => {
      const card = mkEl(
        "div",
        "shop-item dshop-card",
        `<div class="item-icon dshop-icon">${useSvg(item.iconId)}</div>` +
        `<div class="item-info">` +
          `<div class="item-name">${item.title}</div>` +
          `<div class="item-sub offline-sub"></div>` +
        `</div>` +
        `<button type="button" class="dshop-buy-btn"></button>`
      );
      const btn = card.querySelector(".dshop-buy-btn");
      btn.onclick = () => buyOfflineUpgrade(item);
      offFrag.appendChild(card);
      offlineDomRefs.push({
        item,
        card,
        subEl: card.querySelector(".offline-sub"),
        btn,
        lastSub: "",
        lastLocked: null,
        lastBought: null
      });
    });
    els.offlineUpgradesList.appendChild(offFrag);
  }

  diamondShopBuilt = true;
  if (state.lowPerfMode && typeof syncSvgAnimationsPause === "function") {
    syncSvgAnimationsPause();
  }
}

function ensureDiamondShopBuilt() {
  if (!diamondShopBuilt) buildDiamondShop();
}

function buyTimeWarp(item) {
  const reward = getTimeWarpReward(item.hours);
  if (reward <= 0) {
    playSfx("error");
    return showToast("Сначала купи бананы для дохода в секунду!");
  }
  if (!spendDiamonds(item.cost)) return;

  addBananas(reward);
  markUiDirty("shop");

  playSfx("win");
  triggerHaptic(12);
  showToast(`⏩ +${item.hours} ч! Получено +${formatNum(reward)} 🍌!`);
  saveState();
  updateUI();
}

function buyOfflineUpgrade(item) {
  const curHours = getBaseOfflineMaxHours();
  if (curHours >= item.hours) return;
  if (curHours !== item.reqHours) {
    playSfx("error");
    return showToast(`Сначала открой лимит ${item.reqHours} ч!`);
  }
  if (!spendDiamonds(item.cost)) return;

  state.offlineLimitHours = item.hours;

  playSfx("win");
  triggerHaptic(12);
  showToast(`⏱ Офлайн-лимит увеличен до ${item.hours} ч!`);
  saveState();
  updateUI();
}

function updateDiamondShopUI() {
  if (!els.diamondShopModal || els.diamondShopModal.classList.contains("hidden")) return;
  ensureDiamondShopBuilt();

  const bps = getBps();
  const curHours = getBaseOfflineMaxHours();
  const bonusH = getOfflineBonusHours();
  const plat = isPlatinumActive() ? 1 : 0;
  const dKey = `${state.diamonds}_${bps}_${curHours}_${bonusH}_${plat}`;
  if (lastDshopKey === dKey) return;
  lastDshopKey = dKey;

  setText(els.diamondShopBalance, formatNum(state.diamonds));

  for (let i = 0; i < dshopDomRefs.length; i++) {
    const r = dshopDomRefs[i];
    const reward = Math.floor(clampFinite(bps * r.item.hours * 3600));
    const rewardText = reward > 0 ? `+${formatNum(reward)} 🍌` : "нужен доход/сек";
    if (r.lastReward !== rewardText) {
      r.lastReward = rewardText;
      r.rewardEl.textContent = rewardText;
    }

    const canBuy = reward > 0 && state.diamonds >= r.item.cost;
    const html = `${r.item.cost.toLocaleString("ru-RU")} ${gemHtml()}`;
    const cls = `dshop-buy-btn ${canBuy ? "can-buy" : "cannot-buy"}`;
    syncBtnHtml(r, html, cls, false);
  }

  const totalHours = curHours + bonusH;
  if (els.offlineLimitBadge) {
    const vipIcon = plat ? "💠" : "👑";
    setText(
      els.offlineLimitBadge,
      bonusH > 0 ? `Сейчас: ${curHours} ч (+${bonusH} ч ${vipIcon} = ${totalHours} ч)` : `Сейчас: ${curHours} ч`
    );
  }

  for (let i = 0; i < offlineDomRefs.length; i++) {
    const r = offlineDomRefs[i];
    const bought = curHours >= r.item.hours;
    const unlockedNext = curHours === r.item.reqHours;
    const locked = curHours < r.item.reqHours;

    if (r.lastLocked !== locked) {
      r.lastLocked = locked;
      r.card.classList.toggle("is-locked", locked);
    }
    if (r.lastBought !== bought) {
      r.lastBought = bought;
      r.card.classList.toggle("is-bought", bought);
    }

    const subText = bought
      ? `Активно • макс. офлайн ${r.item.hours} ч`
      : unlockedNext
        ? `Увеличит лимит с ${r.item.reqHours} ч до ${r.item.hours} ч`
        : `🔒 Откроется после покупки ${r.item.reqHours} ч`;

    if (r.lastSub !== subText) {
      r.lastSub = subText;
      r.subEl.textContent = subText;
    }

    if (bought) {
      syncBtnHtml(r, "Куплено ✓", "dshop-buy-btn bought", true);
    } else if (unlockedNext) {
      const canBuy = state.diamonds >= r.item.cost;
      syncBtnHtml(r, `${r.item.cost} ${gemHtml()}`, `dshop-buy-btn ${canBuy ? "can-buy" : "cannot-buy"}`, false);
    } else {
      syncBtnHtml(r, `🔒 ${r.item.reqHours} ч`, "dshop-buy-btn locked-btn", true);
    }
  }
}