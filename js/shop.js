const bananaDomRefs = [];
const monkeyDomRefs = [];
let monkeysListBuilt = false;
let buyMultiplier = 1;
let lastShopKey = "";
let lastShopModeKey = "";
let shopSafeMin = 0;
let shopSafeMax = 0;
let cachedSpeciesCount = -1;
let shopJumpTargetIdx = 0;
let jumpPrevAffCost1 = 0;
let jumpNextAffCost1 = Infinity;
let lastShopJumpKey = "";
let jumpHighlightTimer = null;
let skinPopTimer = null;
let shopScrollBound = false;
let shopBuildToken = 0;
let shopBuildRaf = null;
let deferredShopPending = false;
let jumpScrollRaf = null;

const BANANA_RANKS = [
  ["", ""],
  ["rank-bronze", "Бронзовая рамка (100+)"],
  ["rank-silver", "Серебряная рамка (200+)"],
  ["rank-gold", "Золотая рамка (300+)"],
  ["rank-platinum", "Платиновая рамка (400+)"],
  ["rank-diamond", "Алмазная рамка (500+)"]
];

function getBananaRank(owned) {
  return Math.min(5, Math.floor((owned || 0) / 100));
}

function formatBananaMult(mult) {
  if (mult === 1) return "×1";
  return mult < 10 ? `×${Number(mult.toFixed(2))}` : `×${formatNum(mult)}`;
}

function updateActiveMonkeyUI(animatePop = false) {
  const m = MONKEYS_DATA[state.activeMonkeyId] || MONKEYS_DATA[0];
  const eqSkin = typeof getMonkeyEquippedSkin === "function" ? getMonkeyEquippedSkin(m.id) : 0;

  if (els.monkeyEmoji) els.monkeyEmoji.innerHTML = createMonkeySvg(m, "main", eqSkin);
  setText(els.activeMonkeyName, m.name);
  setText(els.activeMonkeyDesc, m.desc);
  document.documentElement.style.setProperty("--monkey-color", m.color);

  if (els.monkeyTapBtn) {
    els.monkeyTapBtn.classList.remove("skin-tier-1", "skin-tier-2", "skin-tier-3");
    if (eqSkin >= 1 && eqSkin <= 3) {
      els.monkeyTapBtn.classList.add(`skin-tier-${eqSkin}`);
    }
    if (animatePop && !state.lowPerfMode) {
      els.monkeyTapBtn.classList.remove("skin-equip-pop");
      void els.monkeyTapBtn.offsetWidth;
      els.monkeyTapBtn.classList.add("skin-equip-pop");
      clearTimeout(skinPopTimer);
      skinPopTimer = setTimeout(() => {
        if (els.monkeyTapBtn) els.monkeyTapBtn.classList.remove("skin-equip-pop");
      }, 540);
    }
  }
}

function openMonkeySkinsShortcut(monkeyIdx) {
  if (els.customMenuBtn) els.customMenuBtn.click();
  if (els.customTabSkins) els.customTabSkins.click();
  const cards = els.skinsPane ? els.skinsPane.querySelectorAll(".skin-monkey-card") : null;
  if (cards && cards[monkeyIdx]) cards[monkeyIdx].click();
}

function createBananaCard(b, idx) {
  const card = mkEl(
    "div",
    "shop-item banana-item",
    `<div class="shop-item-main">` +
      `<div class="item-icon"><span class="item-icon-shine"></span><span class="item-tier">#${b.tier}</span>${createBananaSvg(b, "shop")}</div>` +
      `<div class="item-info"><div class="item-name">${b.name}</div><div class="item-sub"><span class="item-bps-unit"></span> • Куплено: <span class="item-owned"></span></div></div>` +
      `<button type="button" class="buy-btn cannot-afford"></button>` +
    `</div>` +
    `<div class="banana-prog-row hidden">` +
      `<span class="banana-mult-pill">×1</span>` +
      `<div class="banana-prog-track"><div class="banana-prog-fill"></div></div>` +
      `<span class="banana-prog-text">0/25 → ×1.5</span>` +
    `</div>`
  );
  card.querySelector(".buy-btn").onclick = () => buyBanana(idx);

  bananaDomRefs[idx] = {
    card,
    btn: card.querySelector(".buy-btn"),
    iconBox: card.querySelector(".item-icon"),
    unitBpsSpan: card.querySelector(".item-bps-unit"),
    countSpan: card.querySelector(".item-owned"),
    progRow: card.querySelector(".banana-prog-row"),
    multPill: card.querySelector(".banana-mult-pill"),
    progFill: card.querySelector(".banana-prog-fill"),
    progText: card.querySelector(".banana-prog-text"),
    lastOwned: -1,
    lastRank: -1,
    lastMult: null,
    cachedCostKey: "",
    cachedCost: 0,
    maxCacheKey: "",
    maxMinBananas: 0,
    maxNextBananas: 0
  };
  return card;
}

function syncBananaCard(i, bounds = null) {
  const ref = bananaDomRefs[i];
  if (!ref) return;
  const owned = state.bananaCounts[i] || 0;
  if (ref.lastOwned !== owned) {
    ref.lastOwned = owned;
    ref.cachedCostKey = "";
    ref.maxCacheKey = "";
    ref.countSpan.textContent = owned;
    ref.progRow.classList.toggle("hidden", owned <= 0);

    const tiers = Math.floor(owned / 25);
    const mult = getBananaMilestoneMult(owned);
    const nextMult = Math.pow(1.5, tiers + 1);
    ref.unitBpsSpan.textContent = `+${formatNum(BANANAS_DATA[i].baseBps * mult)}/сек`;
    ref.multPill.textContent = formatBananaMult(mult);
    ref.multPill.classList.toggle("has-bonus", tiers > 0);
    ref.progFill.style.width = `${((owned % 25) / 25) * 100}%`;
    ref.progText.textContent = `${owned}/${(tiers + 1) * 25} → ${formatBananaMult(nextMult)}`;

    const rank = getBananaRank(owned);
    if (ref.lastRank !== rank) {
      ref.lastRank = rank;
      ref.iconBox.classList.remove("rank-bronze", "rank-silver", "rank-gold", "rank-platinum", "rank-diamond");
      if (BANANA_RANKS[rank][0]) ref.iconBox.classList.add(BANANA_RANKS[rank][0]);
    }
  }

  if (ref.lastMult !== buyMultiplier) {
    ref.lastMult = buyMultiplier;
    ref.maxCacheKey = "";
  }

  if (buyMultiplier === "max") {
    const mKey = `${owned}_max`;
    if (ref.maxCacheKey !== mKey || state.bananas < ref.maxMinBananas || state.bananas >= ref.maxNextBananas) {
      const qty = getMaxAffordableBananas(i);
      const cost = getBananaBulkCost(i, qty > 0 ? qty : 1);
      const nextCost = qty > 0 ? getBananaBulkCost(i, qty + 1) : cost;
      ref.maxCacheKey = mKey;
      ref.maxMinBananas = qty > 0 ? cost : 0;
      ref.maxNextBananas = Number.isFinite(nextCost) ? nextCost : Infinity;
      syncBtn(ref, qty > 0 ? `${formatNum(cost)} 🍌 (+${qty})` : `${formatNum(cost)} 🍌`, `buy-btn ${qty > 0 ? "can-afford" : "cannot-afford"}`, qty <= 0);
    }
    if (bounds) {
      if (ref.maxMinBananas > bounds.min) bounds.min = ref.maxMinBananas;
      if (ref.maxNextBananas < bounds.max) bounds.max = ref.maxNextBananas;
    }
  } else {
    const cKey = `${owned}_${buyMultiplier}`;
    if (ref.cachedCostKey !== cKey) {
      ref.cachedCostKey = cKey;
      ref.cachedCost = getBananaBulkCost(i, buyMultiplier);
    }
    const cost = ref.cachedCost;
    const ok = Number.isFinite(cost) && state.bananas >= cost;
    syncBtn(ref, `${formatNum(cost)} 🍌`, `buy-btn ${ok ? "can-afford" : "cannot-afford"}`, !ok);
    if (bounds) {
      if (ok && cost > bounds.min) bounds.min = cost;
      if (!ok && Number.isFinite(cost) && cost < bounds.max) bounds.max = cost;
    }
  }
}

function flushRemainingBananasUpTo(targetIdx) {
  if (!els.bananasList) return;
  const limit = Math.min(BANANAS_DATA.length - 1, targetIdx);
  const start = bananaDomRefs.length;
  if (start > limit) return;

  const frag = document.createDocumentFragment();
  for (let i = start; i <= limit; i++) {
    frag.appendChild(createBananaCard(BANANAS_DATA[i], i));
  }
  els.bananasList.appendChild(frag);
  const bounds = { min: shopSafeMin, max: shopSafeMax };
  for (let i = start; i <= limit; i++) {
    syncBananaCard(i, bounds);
  }
  shopSafeMin = bounds.min;
  shopSafeMax = bounds.max;
}

function jumpToFrontierBanana() {
  flushRemainingBananasUpTo(shopJumpTargetIdx);
  const ref = bananaDomRefs[shopJumpTargetIdx];
  const list = els.bananasList;
  if (!ref || !ref.card || !list) return;

  const baseTop = ref.card.offsetParent === list ? ref.card.offsetTop : ref.card.offsetTop - list.offsetTop;
  const cardH = ref.card.offsetHeight || 74;
  const targetTop = Math.max(0, baseTop - (list.clientHeight - cardH) / 2);

  list.scrollTo({
    top: targetTop,
    behavior: state.lowPerfMode ? "auto" : "smooth"
  });

  for (let i = 0; i < bananaDomRefs.length; i++) {
    if (bananaDomRefs[i]) bananaDomRefs[i].card.classList.remove("jump-highlight");
  }
  void ref.card.offsetWidth;
  ref.card.classList.add("jump-highlight");
  clearTimeout(jumpHighlightTimer);
  jumpHighlightTimer = setTimeout(() => ref.card.classList.remove("jump-highlight"), 1300);
  playSfx("select");
  triggerHaptic(10);
}

function scheduleJumpBtnRender() {
  if (jumpScrollRaf) return;
  jumpScrollRaf = requestAnimationFrame(() => {
    jumpScrollRaf = null;
    renderShopJumpBtnVisibility();
  });
}

function renderShopJumpBtnVisibility() {
  if (!els.shopJumpBtn || !els.bananasList) return;
  const list = els.bananasList;
  const showBananas = !list.classList.contains("hidden");
  if (!showBananas || shopJumpTargetIdx < 3) {
    if (lastShopJumpKey !== "hide") {
      lastShopJumpKey = "hide";
      els.shopJumpBtn.classList.add("hidden");
    }
    return;
  }

  let dir = "down";
  const ref = bananaDomRefs[shopJumpTargetIdx];
  if (ref?.card && list.clientHeight > 0) {
    const baseTop = ref.card.offsetParent === list ? ref.card.offsetTop : ref.card.offsetTop - list.offsetTop;
    const relTop = baseTop - list.scrollTop;
    const cardH = ref.card.offsetHeight || 74;
    const relBottom = relTop + cardH;

    if (relBottom >= 12 && relTop <= list.clientHeight - 12) {
      if (lastShopJumpKey !== "hide") {
        lastShopJumpKey = "hide";
        els.shopJumpBtn.classList.add("hidden");
      }
      return;
    }
    if (relBottom < 12) dir = "up";
  }

  const key = `${shopJumpTargetIdx}_${dir}`;
  if (lastShopJumpKey === key) return;
  lastShopJumpKey = key;

  els.shopJumpBtn.classList.remove("hidden");
  const path = dir === "up"
    ? `<path d="M4 11.5L8 7.5L12 11.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 7L8 3L12 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`
    : `<path d="M4 4.5L8 8.5L12 4.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 9L8 13L12 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;

  els.shopJumpBtn.innerHTML =
    `<span class="shop-jump-ico" aria-hidden="true"><svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">${path}</svg></span>` +
    `<span>К <strong>#${shopJumpTargetIdx + 1}</strong></span>`;
}

function updateShopJumpButton(showBananas) {
  if (!els.shopJumpBtn) return;

  let targetIdx = 0;
  let prevCost1 = 0;
  let nextCost1 = Infinity;

  if (showBananas) {
    let lastOwnedIdx = -1;
    let lastAffIdx = -1;
    for (let i = 0; i < BANANAS_DATA.length; i++) {
      if ((state.bananaCounts[i] || 0) > 0) lastOwnedIdx = i;
      const cost1 = getBananaBulkCost(i, 1);
      if (Number.isFinite(cost1)) {
        if (state.bananas >= cost1) {
          lastAffIdx = i;
          if (cost1 > prevCost1) prevCost1 = cost1;
        } else if (cost1 < nextCost1) {
          nextCost1 = cost1;
        }
      }
    }
    targetIdx = Math.max(lastAffIdx, Math.min(BANANAS_DATA.length - 1, lastOwnedIdx + 1));
  }

  jumpPrevAffCost1 = prevCost1;
  jumpNextAffCost1 = nextCost1;
  shopJumpTargetIdx = targetIdx;
  renderShopJumpBtnVisibility();
}

function pumpBananaChunks(token) {
  if (token !== shopBuildToken || !els.bananasList) return;
  const start = bananaDomRefs.length;
  if (start >= BANANAS_DATA.length) {
    shopBuildRaf = null;
    renderShopJumpBtnVisibility();
    return;
  }

  const end = Math.min(BANANAS_DATA.length, start + 22);
  const frag = document.createDocumentFragment();
  for (let i = start; i < end; i++) {
    frag.appendChild(createBananaCard(BANANAS_DATA[i], i));
  }
  els.bananasList.appendChild(frag);

  const bounds = { min: shopSafeMin, max: shopSafeMax };
  for (let i = start; i < end; i++) {
    syncBananaCard(i, bounds);
  }
  shopSafeMin = bounds.min;
  shopSafeMax = bounds.max;

  if (end < BANANAS_DATA.length) {
    shopBuildRaf = requestAnimationFrame(() => pumpBananaChunks(token));
  } else {
    shopBuildRaf = null;
    renderShopJumpBtnVisibility();
  }
}

function startDeferredShopBuild() {
  if (!deferredShopPending) return;
  deferredShopPending = false;
  if (bananaDomRefs.length < BANANAS_DATA.length && !shopBuildRaf) {
    const token = shopBuildToken;
    shopBuildRaf = requestAnimationFrame(() => pumpBananaChunks(token));
  }
}

function buildBananasList(waitForLoad = false) {
  if (!els.bananasList) return;
  if (shopBuildRaf) {
    cancelAnimationFrame(shopBuildRaf);
    shopBuildRaf = null;
  }
  const token = ++shopBuildToken;
  els.bananasList.innerHTML = "";
  bananaDomRefs.length = 0;

  const firstBatch = Math.min(12, BANANAS_DATA.length);
  const firstFrag = document.createDocumentFragment();
  for (let i = 0; i < firstBatch; i++) {
    firstFrag.appendChild(createBananaCard(BANANAS_DATA[i], i));
  }
  els.bananasList.appendChild(firstFrag);

  if (firstBatch < BANANAS_DATA.length) {
    if (waitForLoad) {
      deferredShopPending = true;
    } else {
      deferredShopPending = false;
      shopBuildRaf = requestAnimationFrame(() => pumpBananaChunks(token));
    }
  }
}

function buildMonkeysList() {
  if (!els.monkeysList) return;
  els.monkeysList.innerHTML = "";
  monkeyDomRefs.length = 0;

  const frag = document.createDocumentFragment();
  MONKEYS_DATA.forEach((m, idx) => {
    const eqSkin = typeof getMonkeyEquippedSkin === "function" ? getMonkeyEquippedSkin(m.id) : 0;
    const card = mkEl(
      "div",
      "shop-item",
      `<div class="item-icon monkey-shop-icon" style="border-color:${m.color};cursor:pointer" title="Выбрать скин для ${m.name}"><span class="item-tier">#${m.tier}</span>${createMonkeySvg(m, "shop", eqSkin)}</div>` +
      `<div class="item-info"><div class="item-name">${m.name}</div><div class="item-sub">+${formatNum(m.clickPower)} за клик • ${m.desc}</div></div>` +
      `<button type="button" class="buy-btn cannot-afford"></button>`
    );
    const iconBox = card.querySelector(".monkey-shop-icon");
    iconBox.onclick = () => openMonkeySkinsShortcut(idx);

    const btn = card.querySelector(".buy-btn");
    btn.onclick = () => handleMonkeyAction(idx);
    frag.appendChild(card);
    monkeyDomRefs.push({ card, btn, iconBox, lastActive: null, lastSkin: eqSkin });
  });
  els.monkeysList.appendChild(frag);
  monkeysListBuilt = true;
}

function ensureMonkeysListBuilt() {
  if (!monkeysListBuilt) buildMonkeysList();
}

function buildShops(waitForLoad = false) {
  lastShopKey = "";
  lastShopModeKey = "";
  lastShopJumpKey = "";
  jumpPrevAffCost1 = 0;
  jumpNextAffCost1 = Infinity;
  shopSafeMin = 0;
  shopSafeMax = 0;
  cachedSpeciesCount = -1;
  monkeysListBuilt = false;

  if (els.monkeysList) els.monkeysList.innerHTML = "";
  monkeyDomRefs.length = 0;

  if (els.shopJumpBtn) els.shopJumpBtn.onclick = jumpToFrontierBanana;
  if (!shopScrollBound) {
    shopScrollBound = true;
    els.bananasList?.addEventListener("scroll", scheduleJumpBtnRender, { passive: true });
    window.addEventListener("resize", scheduleJumpBtnRender, { passive: true });
    window.addEventListener("orientationchange", scheduleJumpBtnRender, { passive: true });
  }

  buildBananasList(waitForLoad);
}

function buyBanana(idx) {
  const amt = buyMultiplier === "max" ? getMaxAffordableBananas(idx) : buyMultiplier;
  const cost = amt > 0 ? getBananaBulkCost(idx, amt) : 0;
  if (!Number.isFinite(cost) || amt <= 0 || state.bananas < cost) return;

  const prevOwned = state.bananaCounts[idx] || 0;
  const newOwned = prevOwned + amt;

  state.bananas = Math.max(0, state.bananas - cost);
  state.bananaCounts[idx] = newOwned;
  if (state.dailyQuests?.progress) {
    state.dailyQuests.progress.buyBananas += amt;
    state.dailyQuests.progress.spendBananas += cost;
  }
  if (state.weeklyQuests?.progress) {
    state.weeklyQuests.progress.buyBananas += amt;
    state.weeklyQuests.progress.spendBananas += cost;
  }

  markUiDirty("ach", "shop");
  triggerHaptic(12);

  const prevRank = getBananaRank(prevOwned);
  const newRank = getBananaRank(newOwned);
  if (newRank > prevRank) {
    playSfx("unlock");
    showToast(`✨ ${BANANAS_DATA[idx].name}: ${BANANA_RANKS[newRank][1]}!`);
  } else {
    playTone(520 + (idx % 12) * 35, 0.08, "triangle", 0.06);
  }

  updateUI();
  saveState();
}

function handleMonkeyAction(idx) {
  if (state.unlockedMonkeys.includes(idx)) {
    state.activeMonkeyId = idx;
    markUiDirty("shop");
    updateActiveMonkeyUI(true);
    updateShopUI();
    saveState();
    playSfx("select");
    triggerHaptic(10);
    return showToast(`Выбрана: ${MONKEYS_DATA[idx].name}`);
  }

  const m = MONKEYS_DATA[idx];
  if (state.bananas < m.cost) return;

  state.bananas = Math.max(0, state.bananas - m.cost);
  state.unlockedMonkeys.push(idx);
  state.activeMonkeyId = idx;
  if (state.dailyQuests?.progress) state.dailyQuests.progress.spendBananas += m.cost;
  if (state.weeklyQuests?.progress) state.weeklyQuests.progress.spendBananas += m.cost;

  markUiDirty("ach", "shop");
  playSfx("unlock");
  triggerHaptic([14, 24, 16]);
  updateActiveMonkeyUI(true);
  updateUI();
  saveState();
  showToast(`Открыта: ${m.name}!`);
}

function updateShopUI() {
  const showBananas = Boolean(els.bananasList && !els.bananasList.classList.contains("hidden"));
  const showMonkeys = Boolean(els.monkeysList && !els.monkeysList.classList.contains("hidden"));
  const modeKey = `${buyMultiplier}_${showBananas ? 1 : 0}_${showMonkeys ? 1 : 0}_${state.activeMonkeyId}`;

  if (uiDirty.shop || cachedSpeciesCount < 0) {
    let sp = 0;
    for (let i = 0; i < BANANAS_DATA.length; i++) {
      if ((state.bananaCounts[i] || 0) > 0) sp++;
    }
    cachedSpeciesCount = sp;
  }

  const needRefresh =
    uiDirty.shop ||
    modeKey !== lastShopModeKey ||
    lastShopKey === "" ||
    state.bananas < shopSafeMin ||
    state.bananas >= shopSafeMax;

  if (needRefresh) {
    lastShopKey = modeKey;
    lastShopModeKey = modeKey;
    uiDirty.shop = false;

    const bounds = { min: 0, max: Infinity };

    if (showBananas) {
      for (let i = 0; i < bananaDomRefs.length; i++) {
        syncBananaCard(i, bounds);
      }
    }

    if (showMonkeys) {
      ensureMonkeysListBuilt();
      for (let i = 0; i < MONKEYS_DATA.length; i++) {
        const ref = monkeyDomRefs[i];
        if (!ref) continue;
        const unlocked = state.unlockedMonkeys.includes(i);
        const active = state.activeMonkeyId === i;
        const cost = MONKEYS_DATA[i].cost;
        const eqSkin = typeof getMonkeyEquippedSkin === "function" ? getMonkeyEquippedSkin(i) : 0;

        if (ref.lastSkin !== eqSkin) {
          ref.lastSkin = eqSkin;
          ref.iconBox.innerHTML = `<span class="item-tier">#${MONKEYS_DATA[i].tier}</span>${createMonkeySvg(MONKEYS_DATA[i], "shop", eqSkin)}`;
        }
        if (ref.lastActive !== active) {
          ref.lastActive = active;
          ref.card.classList.toggle("active-monkey", active);
        }
        if (active) {
          syncBtn(ref, "Выбрана ✓", "buy-btn equipped-btn", true);
        } else if (unlocked) {
          syncBtn(ref, "Выбрать", "buy-btn equip-btn", false);
        } else {
          const ok = state.bananas >= cost;
          syncBtn(ref, `${formatNum(cost)} 🍌`, `buy-btn ${ok ? "can-afford" : "cannot-afford"}`, !ok);
          if (ok && cost > bounds.min) bounds.min = cost;
          if (!ok && cost < bounds.max) bounds.max = cost;
        }
      }
    }

    shopSafeMin = bounds.min;
    shopSafeMax = bounds.max;

    setText(els.bananasProgressBadge, `${cachedSpeciesCount}/${BANANAS_DATA.length}`);
    setText(els.monkeysProgressBadge, `${state.unlockedMonkeys.length}/${MONKEYS_DATA.length}`);
    updateShopJumpButton(showBananas);
  } else if (showBananas && (state.bananas >= jumpNextAffCost1 || state.bananas < jumpPrevAffCost1)) {
    updateShopJumpButton(true);
  }

  if (els.profileModal && !els.profileModal.classList.contains("hidden")) {
    updateProfileStats(cachedSpeciesCount);
  }
}

function setBuyMultiplier(mult) {
  buyMultiplier = mult;
  MULTI_BTNS.forEach(([m, id]) => {
    if (els[id]) els[id].classList.toggle("active", mult === m);
  });
  markUiDirty("shop");
  updateShopUI();
}
