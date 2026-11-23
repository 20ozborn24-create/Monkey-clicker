const FRAME_FX = ["fx-pulse", "fx-double", "fx-neon", "fx-prism"];
const PSTYLE_FX = ["pstyle-fx-shimmer", "pstyle-fx-pulse", "pstyle-fx-rainbow", "pstyle-fx-stars"];
const BG_FX = ["bg-fx-aurora", "bg-fx-wave", "bg-fx-pulse", "bg-fx-neon", "bg-fx-shimmer", "bg-fx-twinkle", "bg-fx-prism"];

const frameCardRefs = [];
const styleCardRefs = [];
const bgCardRefs = [];
const skinMonkeyCardRefs = [];

let framesBuilt = false;
let stylesBuilt = false;
let bgsBuilt = false;
let skinsBuilt = false;

let currentAppliedBgId = -1;
let selectedSkinMonkeyId = null;
let skinsListEl = null;
let skinsDetailEl = null;
let skinsDetailState = null;
let skinsDetailKey = "";
let pendingSkinPurchase = null;

const bgImgCache = {};
const bgImgPending = {};

function resolveBgImgUrl(fileId, cb) {
  if (typeof bgImgCache[fileId] === "string") return cb(bgImgCache[fileId]);
  if (bgImgCache[fileId] === false) return cb(null);
  if (bgImgPending[fileId]) {
    bgImgPending[fileId].push(cb);
    return;
  }

  bgImgPending[fileId] = [cb];
  const exts = ["png", "webp", "jpg"];
  let idx = 0;

  const finish = (url) => {
    bgImgCache[fileId] = url || false;
    const list = bgImgPending[fileId] || [];
    delete bgImgPending[fileId];
    list.forEach((fn) => fn(url));
  };

  const tryNext = () => {
    if (idx >= exts.length) return finish(null);
    const src = `img/backgrounds/${fileId}.${exts[idx++]}`;
    const probe = new Image();
    probe.onload = () => finish(src);
    probe.onerror = tryNext;
    probe.src = src;
  };
  tryNext();
}

function getBgArtLayer() {
  let layer = document.getElementById("bgArtLayer");
  if (!layer && els.appShell) {
    layer = mkEl("div", "bg-art-layer");
    layer.id = "bgArtLayer";
    layer.innerHTML = `<img class="bg-art-img" alt="" aria-hidden="true" />`;
    els.appShell.insertBefore(layer, els.bgAmbientLayer || els.appShell.firstChild);
  }
  return layer;
}

function applyAvatarFrame(wrap, f, uid = "") {
  if (!wrap || !f || Number(wrap.dataset.frameId) === f.id) return;
  wrap.dataset.frameId = String(f.id);
  FRAME_FX.forEach((c) => wrap.classList.remove(c));
  if (f.fx) wrap.classList.add(f.fx);
  [["--f-bg", f.bg], ["--f-c1", f.c1], ["--f-c2", f.c2], ["--f-glow", f.c2 || f.c1]].forEach(([k, v]) => wrap.style.setProperty(k, v));
  const deco = wrap.querySelector(".avatar-frame-deco");
  if (deco) deco.innerHTML = createFrameDecoSvg(f, uid || wrap.id || "av");
}

function applyProfileStyle(el, st, isModal = false) {
  if (!el || !st || Number(el.dataset.styleId) === st.id) return;
  el.dataset.styleId = String(st.id);
  PSTYLE_FX.forEach((c) => el.classList.remove(c));
  if (st.fx && st.fx !== "none") el.classList.add(st.fx);
  el.style.setProperty(isModal ? "--p-modal-bg" : "--p-bg", st.bg);
  [["--p-border", st.border], ["--p-accent", st.accent], ["--p-glow", st.glow]].forEach(([k, v]) => el.style.setProperty(k, v));
}

function applyBackground(bg) {
  if (!bg || currentAppliedBgId === bg.id) return;
  currentAppliedBgId = bg.id;
  BG_FX.forEach((c) => els.appShell.classList.remove(c));
  if (bg.fx) els.appShell.classList.add(bg.fx);
  els.appShell.style.setProperty("--app-bg", bg.bg);
  els.appShell.style.setProperty("--app-bg-glow", bg.glow);

  const artLayer = getBgArtLayer();
  if (artLayer) {
    const artImg = artLayer.firstElementChild;
    const fileId = bg.imgId ?? bg.id;
    artLayer.classList.remove("is-loaded");
    els.appShell.classList.remove("has-art-bg");
    els.bgAmbientLayer?.classList.remove("has-art");
    resolveBgImgUrl(fileId, (url) => {
      if (currentAppliedBgId !== bg.id) return;
      if (url && artImg) {
        artImg.src = url;
        artLayer.classList.add("is-loaded");
        els.appShell.classList.add("has-art-bg");
        els.bgAmbientLayer?.classList.add("has-art");
      } else if (artImg) {
        artImg.removeAttribute("src");
      }
    });
  }

  els.bgAmbientLayer.innerHTML = "";
  const frag = document.createDocumentFragment();
  const orb1 = bg.orb1 || "#fde047";
  const orb2 = bg.orb2 || "#38bdf8";

  [
    ["-10%", "6%", 190, orb1, 9.5, 0],
    ["62%", "14%", 170, orb2, 11.5, -3.5],
    ["22%", "38%", 150, orb1, 13, -6.2]
  ].forEach(([left, top, size, color, dur, delay]) => {
    const orb = mkEl("span", "bg-orb");
    orb.style.cssText = `left:${left};top:${top};width:${size}px;height:${size}px;--orb-c:${color};--orb-dur:${dur}s;animation-delay:${delay}s`;
    frag.appendChild(orb);
  });

  for (let i = 0; i < 10; i++) {
    const star = mkEl("span", "bg-star");
    star.style.cssText = `left:${((9 + i * 9.1) % 94).toFixed(1)}%;top:${6 + ((i * 17) % 48)}%;--star-dur:${(2.2 + (i % 4) * 0.7).toFixed(1)}s;animation-delay:-${(i * 0.6).toFixed(1)}s`;
    frag.appendChild(star);

    const item = mkEl("span", "bg-ambient-item");
    item.textContent = bg.drops[i % bg.drops.length];
    item.style.cssText = `left:${6 + i * 9.5}%;font-size:${16 + (i % 3) * 5}px;animation-duration:${7 + (i % 4) * 2.4}s;animation-delay:-${(i * 1.3).toFixed(1)}s`;
    frag.appendChild(item);
  }

  els.bgAmbientLayer.appendChild(frag);
}

function spawnBgDropParticles() {
  if (state.lowPerfMode || !els.bgDropsLayer) return;
  const drops = (BACKGROUNDS_DATA[state.profile.bgId] || BACKGROUNDS_DATA[0]).drops || ["🍌"];
  for (let i = 0; i < 2; i++) {
    if (els.bgDropsLayer.childElementCount > 28) els.bgDropsLayer.firstElementChild.remove();
    const el = mkEl("span", "bg-drop-item");
    const dur = 1.15 + Math.random() * 0.65;
    el.textContent = drops[Math.floor(Math.random() * drops.length)];
    el.style.left = `${5 + Math.random() * 88}%`;
    el.style.fontSize = `${20 + Math.floor(Math.random() * 14)}px`;
    el.style.setProperty("--drop-dur", `${dur.toFixed(2)}s`);
    el.style.setProperty("--drop-dx", `${Math.round((Math.random() - 0.5) * 70)}px`);
    el.style.setProperty("--drop-rot", `${Math.round((Math.random() - 0.5) * 320)}deg`);
    els.bgDropsLayer.appendChild(el);
    setTimeout(() => el.remove(), dur * 1000 + 80);
  }
}

function selectCustom(key, unlockedKey, progKey, item, prefix, freq, drop = false) {
  if (!state[unlockedKey].includes(item.id)) {
    if (!spendDiamonds(item.cost)) return;
    const count = (state[progKey][item.id] || 0) + 1;

    if (count >= CUSTOM_STEPS) {
      delete state[progKey][item.id];
      state[unlockedKey].push(item.id);
      state.profile[key] = item.id;
      if (drop) spawnBgDropParticles();
      playSfx("unlock");
      showToast(`🎉 Открыто: ${item.name} (${CUSTOM_STEPS}/${CUSTOM_STEPS})!`);
    } else {
      state[progKey][item.id] = count;
      playTone(500 + count * 35, 0.08, "triangle", 0.06);
      showToast(`${item.name}: куплено ${count}/${CUSTOM_STEPS} (-${item.cost} 💎)`);
    }
    saveState();
    updateUI();
    return;
  }

  state.profile[key] = item.id;
  saveState();
  updateCustomizationUI();
  if (drop) spawnBgDropParticles();
  playTone(freq, 0.08, "triangle", 0.06);
  showToast(`${prefix}: ${item.name}`);
}

function closeSkinConfirmModal() {
  pendingSkinPurchase = null;
  if (els.skinConfirmModal) els.skinConfirmModal.classList.add("hidden");
}

function openSkinConfirmModal(monkeyId, skin) {
  const m = MONKEYS_DATA[monkeyId];
  if (!m || !skin || !els.skinConfirmModal) return;
  if (state.diamonds < skin.cost) return spendDiamonds(skin.cost);

  pendingSkinPurchase = { monkeyId, skin };
  if (els.skinConfirmPreview) {
    els.skinConfirmPreview.className = `skin-confirm-preview skin-tier-${skin.id}`;
    els.skinConfirmPreview.innerHTML = createMonkeySvg(m, "skin_conf", skin.id);
  }
  setText(els.skinConfirmName, `${m.name} — ${skin.name}`);
  setText(
    els.skinConfirmText,
    `Вы уверены, что хотите приобрести «${skin.name}» для «${m.name}» за ${skin.cost.toLocaleString("ru-RU")} 💎?`
  );
  if (els.confirmSkinBuyBtn) {
    els.confirmSkinBuyBtn.innerHTML = `Купить (${skin.cost.toLocaleString("ru-RU")} ${gemHtml()})`;
  }

  playSfx("select");
  els.skinConfirmModal.classList.remove("hidden");
}

function executeMonkeySkinAction(monkeyId, skin) {
  const m = MONKEYS_DATA[monkeyId];
  if (!m || !skin) return;
  if (!state.unlockedMonkeySkins || typeof state.unlockedMonkeySkins !== "object") state.unlockedMonkeySkins = {};
  if (!state.equippedMonkeySkins || typeof state.equippedMonkeySkins !== "object") state.equippedMonkeySkins = {};

  const unlocked = isMonkeySkinUnlocked(monkeyId, skin.id);
  const isMonkeyOwned = state.unlockedMonkeys.includes(monkeyId);

  if (!unlocked) {
    if (!spendDiamonds(skin.cost)) return;
    if (!Array.isArray(state.unlockedMonkeySkins[monkeyId])) state.unlockedMonkeySkins[monkeyId] = [];
    if (!state.unlockedMonkeySkins[monkeyId].includes(skin.id)) state.unlockedMonkeySkins[monkeyId].push(skin.id);
    state.equippedMonkeySkins[monkeyId] = skin.id;
    if (isMonkeyOwned) state.activeMonkeyId = monkeyId;

    playSfx("unlock");
    triggerHaptic([14, 24, 18]);
    spawnBgDropParticles();
    showToast(
      isMonkeyOwned
        ? `🎭 Куплено и надето на экран: ${m.name} (${skin.name})!`
        : `🎭 Куплен «${skin.name}» для ${m.name}! Открой её в магазине.`
    );
  } else {
    if (skin.id === 0) delete state.equippedMonkeySkins[monkeyId];
    else state.equippedMonkeySkins[monkeyId] = skin.id;
    if (isMonkeyOwned) state.activeMonkeyId = monkeyId;

    playSfx("select");
    triggerHaptic(10);
    showToast(
      isMonkeyOwned
        ? `🎭 На экране: ${m.name} (${skin.name})`
        : `🎭 Для ${m.name} выбран «${skin.name}»`
    );
  }

  skinsDetailKey = "";
  markUiDirty("shop");

  if (isMonkeyOwned && typeof updateActiveMonkeyUI === "function") updateActiveMonkeyUI(true);
  if (state.profile.avatarType === "monkey" && Number(state.profile.avatarValue) === monkeyId && typeof updateProfileUI === "function") {
    updateProfileUI();
  }

  saveState();
  updateUI();
}

function selectMonkeySkin(monkeyId, skin) {
  if (!isMonkeySkinUnlocked(monkeyId, skin.id)) return openSkinConfirmModal(monkeyId, skin);
  executeMonkeySkinAction(monkeyId, skin);
}

function buildSkinsSection() {
  if (!els.skinsPane || skinsBuilt) return;
  els.skinsPane.innerHTML = "";
  skinMonkeyCardRefs.length = 0;

  const listWrap = mkEl("div", "skins-list-view");
  const hint = mkEl("div", "skins-hint", "Нажми на любую обезьянку, чтобы посмотреть или купить для неё скины:");
  const grid = mkEl("div", "custom-grid");

  const frag = document.createDocumentFragment();
  MONKEYS_DATA.forEach((m) => {
    const card = mkEl(
      "button",
      "custom-card skin-monkey-card",
      `<span class="skin-monkey-num">#${m.tier}</span>` +
      `<span class="skin-monkey-count">0/3</span>` +
      `<div class="skin-monkey-thumb" style="--skin-color:${m.color}"></div>` +
      `<div class="custom-card-name">${m.name}</div>` +
      `<span class="custom-card-badge">Скины</span>`
    );
    card.type = "button";
    card.onclick = () => {
      selectedSkinMonkeyId = m.id;
      skinsDetailKey = "";
      playSfx("select");
      updateSkinsUI();
      if (els.skinsPane?.parentElement) els.skinsPane.parentElement.scrollTop = 0;
    };
    frag.appendChild(card);

    skinMonkeyCardRefs.push({
      monkey: m,
      card,
      countEl: card.querySelector(".skin-monkey-count"),
      thumbEl: card.querySelector(".skin-monkey-thumb"),
      badgeEl: card.querySelector(".custom-card-badge"),
      lastKey: "",
      lastThumbSkin: -1
    });
  });

  grid.appendChild(frag);
  listWrap.append(hint, grid);

  skinsDetailEl = mkEl("div", "skins-detail-view hidden");
  skinsDetailState = null;
  skinsListEl = listWrap;
  els.skinsPane.append(listWrap, skinsDetailEl);
  skinsBuilt = true;
}

function buildSelectedMonkeySkinsDetail(m) {
  skinsDetailEl.innerHTML = "";
  const head = mkEl(
    "div",
    "skins-detail-head",
    `<button type="button" class="skins-back-btn">← Назад</button>` +
    `<div class="skins-detail-title-col">` +
      `<div class="skins-detail-name">#${m.tier} ${m.name}</div>` +
      `<div class="skins-detail-sub">Скинов открыто: 0/3</div>` +
    `</div>` +
    `<button type="button" class="skins-equip-monkey-btn"></button>`
  );

  head.querySelector(".skins-back-btn").onclick = () => {
    selectedSkinMonkeyId = null;
    skinsDetailKey = "";
    playSfx("select");
    updateSkinsUI();
  };

  const eqBtn = head.querySelector(".skins-equip-monkey-btn");
  eqBtn.onclick = () => {
    if (!state.unlockedMonkeys.includes(m.id) || state.activeMonkeyId === m.id) return;
    state.activeMonkeyId = m.id;
    skinsDetailKey = "";
    markUiDirty("shop");
    if (typeof updateActiveMonkeyUI === "function") updateActiveMonkeyUI(true);
    saveState();
    updateUI();
    playSfx("select");
    showToast(`На экране: ${m.name}`);
  };

  const grid = mkEl("div", "custom-grid");
  const cardRefs = MONKEY_SKINS_DATA.map((skin, idx) => {
    const card = mkEl(
      "button",
      `custom-card skin-card skin-tier-${skin.id}`,
      `<div class="skin-preview-box">${createMonkeySvg(m, `skin_${skin.id}`, skin.id)}</div>` +
      `<div class="custom-card-name">${skin.name}</div>` +
      `<span class="custom-card-badge"></span>`
    );
    card.type = "button";
    card.style.animationDelay = `${idx * 0.045}s`;
    card.onclick = () => selectMonkeySkin(m.id, skin);
    grid.appendChild(card);
    return { skin, card, badgeEl: card.lastElementChild, lastKey: "" };
  });

  skinsDetailEl.append(head, grid);
  skinsDetailState = {
    monkeyId: m.id,
    subEl: head.querySelector(".skins-detail-sub"),
    eqBtn,
    cardRefs
  };
  if (state.lowPerfMode && typeof syncSvgAnimationsPause === "function") syncSvgAnimationsPause();
}

function renderSelectedMonkeySkinsDetail(monkeyId) {
  if (!skinsDetailEl) return;
  const m = MONKEYS_DATA[monkeyId];
  if (!m) return;

  if (!skinsDetailState || skinsDetailState.monkeyId !== monkeyId) {
    buildSelectedMonkeySkinsDetail(m);
    skinsDetailKey = "";
  }

  const isUnlockedMonkey = state.unlockedMonkeys.includes(m.id);
  const isActiveMonkey = state.activeMonkeyId === m.id;
  const equippedSkinId = getMonkeyEquippedSkin(m.id);
  const ownedSkinsArr = Array.isArray(state.unlockedMonkeySkins?.[m.id]) ? state.unlockedMonkeySkins[m.id] : [];
  const dKey = `${m.id}_${isUnlockedMonkey ? 1 : 0}_${isActiveMonkey ? 1 : 0}_${equippedSkinId}_${ownedSkinsArr.join(",")}_${state.diamonds}`;
  if (skinsDetailKey === dKey) return;
  skinsDetailKey = dKey;

  setText(skinsDetailState.subEl, `Скинов открыто: ${ownedSkinsArr.length}/3`);

  const eqBtn = skinsDetailState.eqBtn;
  eqBtn.className = "skins-equip-monkey-btn" + (isActiveMonkey ? " is-active" : !isUnlockedMonkey ? " is-locked" : "");
  eqBtn.disabled = isActiveMonkey || !isUnlockedMonkey;
  setText(eqBtn, isActiveMonkey ? "На экране ✓" : isUnlockedMonkey ? "На экран" : "🔒 Не открыта");

  skinsDetailState.cardRefs.forEach((r) => {
    const unlocked = isMonkeySkinUnlocked(m.id, r.skin.id);
    const sel = equippedSkinId === r.skin.id;
    const canBuy = !unlocked && state.diamonds >= r.skin.cost;
    const cKey = `${sel ? 1 : 0}_${unlocked ? 1 : 0}_${canBuy ? 1 : 0}`;
    if (r.lastKey === cKey) return;
    r.lastKey = cKey;

    r.card.classList.toggle("selected", sel);
    r.card.classList.toggle("locked", !unlocked);
    r.badgeEl.classList.toggle("can-buy-diamond", canBuy);
    r.badgeEl.innerHTML = sel
      ? "Надет ✓"
      : unlocked
        ? "Надеть"
        : canBuy
          ? `${gemHtml()} ${r.skin.cost.toLocaleString("ru-RU")}`
          : `🔒 ${r.skin.cost.toLocaleString("ru-RU")} ${gemHtml()}`;
  });
}

function updateSkinsUI() {
  if (!els.skinsPane || els.skinsPane.classList.contains("hidden")) return;
  if (!skinsBuilt) buildSkinsSection();
  if (!skinsListEl || !skinsDetailEl) return;

  const isDetail = selectedSkinMonkeyId !== null && Boolean(MONKEYS_DATA[selectedSkinMonkeyId]);
  skinsListEl.classList.toggle("hidden", isDetail);
  skinsDetailEl.classList.toggle("hidden", !isDetail);

  if (isDetail) return renderSelectedMonkeySkinsDetail(selectedSkinMonkeyId);

  for (let i = 0; i < skinMonkeyCardRefs.length; i++) {
    const r = skinMonkeyCardRefs[i];
    const m = r.monkey;
    const isUnlockedMonkey = state.unlockedMonkeys.includes(m.id);
    const isActive = state.activeMonkeyId === m.id;
    const eqSkin = getMonkeyEquippedSkin(m.id);
    const ownedCount = Array.isArray(state.unlockedMonkeySkins?.[m.id]) ? state.unlockedMonkeySkins[m.id].length : 0;

    if (r.lastThumbSkin !== eqSkin) {
      r.lastThumbSkin = eqSkin;
      r.thumbEl.innerHTML = createMonkeySvg(m, "skin_list", eqSkin);
    }

    const sKey = `${isUnlockedMonkey ? 1 : 0}_${isActive ? 1 : 0}_${eqSkin}_${ownedCount}`;
    if (r.lastKey === sKey) continue;
    r.lastKey = sKey;

    r.card.classList.toggle("is-active-monkey", isActive);
    r.card.classList.toggle("is-locked-monkey", !isUnlockedMonkey);
    r.card.classList.toggle("has-skin", eqSkin > 0);
    setText(r.countEl, `${ownedCount}/3`);
    setText(
      r.badgeEl,
      isActive
        ? (eqSkin > 0 ? `На экране • Скин #${eqSkin}` : "На экране ✓")
        : isUnlockedMonkey
          ? (eqSkin > 0 ? `Скин #${eqSkin}` : "Выбрать скин")
          : (ownedCount > 0 ? `Открыто ${ownedCount}/3` : "🔒 Не открыта")
    );
  }
}

function pushCustomRef(refs, card, item) {
  refs.push({
    card,
    badgeEl: card.lastElementChild,
    item,
    progBar: card.querySelector(".custom-prog-bar"),
    progFill: card.querySelector(".custom-prog-fill"),
    lastStateKey: "",
    lastBadgeHtml: ""
  });
}

function buildFramesGrid() {
  if (!els.framesGrid || framesBuilt) return;
  els.framesGrid.innerHTML = "";
  frameCardRefs.length = 0;

  const frag = document.createDocumentFragment();
  AVATAR_FRAMES_DATA.forEach((f) => {
    const card = mkEl(
      "button",
      "custom-card frame-card",
      `<div class="avatar-frame-wrap medium"><div class="avatar-frame-ring"></div><div class="avatar-circle" style="font-size:24px;">🐒</div><div class="avatar-frame-deco"></div></div>` +
      `<div class="custom-card-name">#${f.id + 1} ${f.name}</div>` +
      `<div class="custom-prog-bar"><div class="custom-prog-fill"></div></div>` +
      `<span class="custom-card-badge">Выбрать</span>`
    );
    card.type = "button";
    applyAvatarFrame(card.firstElementChild, f, `g_${f.id}`);
    card.onclick = () => selectCustom("frameId", "unlockedFrames", "frameProgress", f, "Рамка", 620);
    frag.appendChild(card);
    pushCustomRef(frameCardRefs, card, f);
  });
  els.framesGrid.appendChild(frag);
  framesBuilt = true;
}

function buildStylesList() {
  if (!els.stylesGrid || stylesBuilt) return;
  els.stylesGrid.innerHTML = "";
  styleCardRefs.length = 0;

  const frag = document.createDocumentFragment();
  PROFILE_STYLES_DATA.forEach((st) => {
    const card = mkEl(
      "button",
      "style-card",
      `<div class="style-card-info"><span class="style-tier-num">#${st.id + 1}</span>` +
      `<div class="style-name-col"><span class="style-card-name">${st.name}</span><div class="custom-prog-bar"><div class="custom-prog-fill"></div></div></div></div>` +
      `<span class="style-select-pill">Выбрать</span>`
    );
    card.type = "button";
    applyProfileStyle(card, st, false);
    card.onclick = () => selectCustom("styleId", "unlockedStyles", "styleProgress", st, "Стиль", 700);
    frag.appendChild(card);
    pushCustomRef(styleCardRefs, card, st);
  });
  els.stylesGrid.appendChild(frag);
  stylesBuilt = true;
}

function buildBackgroundsGrid() {
  if (!els.backgroundsGrid || bgsBuilt) return;
  els.backgroundsGrid.innerHTML = "";
  bgCardRefs.length = 0;

  const frag = document.createDocumentFragment();
  BACKGROUNDS_DATA.forEach((bg) => {
    const card = mkEl(
      "button",
      "custom-card",
      `<div class="bg-swatch ${bg.fx || ""}" style="background:${bg.bg};--swatch-glow:${bg.glow}">` +
        `<img class="bg-swatch-img hidden" alt="" />` +
      `</div>` +
      `<div class="custom-card-name">#${bg.id + 1} ${bg.name}</div>` +
      `<div class="custom-prog-bar"><div class="custom-prog-fill"></div></div>` +
      `<span class="custom-card-badge">Выбрать</span>`
    );
    const swatchEl = card.firstElementChild;
    const swatchImg = swatchEl.firstElementChild;
    resolveBgImgUrl(bg.imgId ?? bg.id, (url) => {
      if (url) {
        swatchImg.src = url;
        swatchImg.classList.remove("hidden");
        swatchEl.classList.add("has-art");
      } else {
        const dropsHtml = bg.drops.slice(0, 3).map((d) => `<span>${d}</span>`).join("");
        swatchEl.insertAdjacentHTML(
          "beforeend",
          `<span class="bg-swatch-orb o1" style="--orb-c:${bg.orb1 || "#fde047"}"></span>` +
          `<span class="bg-swatch-orb o2" style="--orb-c:${bg.orb2 || "#38bdf8"}"></span>` +
          `<span class="bg-swatch-spark s1">✦</span><span class="bg-swatch-spark s2">✧</span><span class="bg-swatch-spark s3">✦</span>` +
          `<div class="bg-swatch-drops">${dropsHtml}</div>`
        );
      }
    });

    card.type = "button";
    card.onclick = () => selectCustom("bgId", "unlockedBgs", "bgProgress", bg, "Фон", 760, true);
    frag.appendChild(card);
    pushCustomRef(bgCardRefs, card, bg);
  });
  els.backgroundsGrid.appendChild(frag);
  bgsBuilt = true;
}

function syncCustomRefsState(refs, activeId, unlockedArr, progMap, activeLabel) {
  for (let i = 0; i < refs.length; i++) {
    const r = refs[i];
    const unlocked = unlockedArr.includes(i);
    const sel = i === activeId;
    const canBuy = !unlocked && state.diamonds >= r.item.cost;
    const prog = unlocked ? CUSTOM_STEPS : Math.min(CUSTOM_STEPS, progMap[i] || 0);
    const sKey = `${sel ? 1 : 0}_${unlocked ? 1 : 0}_${canBuy ? 1 : 0}_${prog}`;

    if (r.lastStateKey === sKey) continue;
    r.lastStateKey = sKey;

    r.card.classList.toggle("selected", sel);
    r.card.classList.toggle("locked", !unlocked);
    r.progBar.classList.toggle("hidden", unlocked);
    if (!unlocked) r.progFill.style.width = `${(prog / CUSTOM_STEPS) * 100}%`;
    r.badgeEl.classList.toggle("can-buy-diamond", canBuy);

    const badgeHtml = sel
      ? activeLabel
      : unlocked
        ? "Выбрать"
        : canBuy
          ? `${gemHtml()} ${r.item.cost} (${prog}/${CUSTOM_STEPS})`
          : `🔒 ${r.item.cost} ${gemHtml()} (${prog}/${CUSTOM_STEPS})`;

    if (r.lastBadgeHtml !== badgeHtml) {
      r.lastBadgeHtml = badgeHtml;
      r.badgeEl.innerHTML = badgeHtml;
    }
  }
}

function updateCustomizationUI() {
  const f = AVATAR_FRAMES_DATA[state.profile.frameId] || AVATAR_FRAMES_DATA[0];
  const st = PROFILE_STYLES_DATA[state.profile.styleId] || PROFILE_STYLES_DATA[0];
  const bg = BACKGROUNDS_DATA[state.profile.bgId] || BACKGROUNDS_DATA[0];

  [els.headerAvatarFrame, els.modalAvatarFrame, els.customPreviewFrame].forEach((el) => applyAvatarFrame(el, f));
  applyProfileStyle(els.profileBtn, st, false);
  applyProfileStyle(els.customPreviewCard, st, false);
  applyBackground(bg);

  if (!els.customModal || els.customModal.classList.contains("hidden")) return;

  const activeMonkey = MONKEYS_DATA[state.activeMonkeyId] || MONKEYS_DATA[0];
  const activeSkinObj = MONKEY_SKINS_DATA[getMonkeyEquippedSkin(activeMonkey.id)] || MONKEY_SKINS_DATA[0];

  setText(els.customPreviewNick, state.profile.nickname || "BananaPro");
  setText(els.customPreviewFrameName, `Рамка: ${f.name}`);
  setText(els.customPreviewStyleName, `Стиль: ${st.name}`);
  setText(els.customPreviewBgName, `Фон: ${bg.name}`);
  setText(els.customPreviewSkinName, `Скин (${activeMonkey.name}): ${activeSkinObj.name}`);
  setText(els.customFramesCount, `${state.unlockedFrames.length}/${AVATAR_FRAMES_DATA.length}`);
  setText(els.customStylesCount, `${state.unlockedStyles.length}/${PROFILE_STYLES_DATA.length}`);
  setText(els.customBgsCount, `${state.unlockedBgs.length}/${BACKGROUNDS_DATA.length}`);
  setText(els.customSkinsCount, `${getTotalUnlockedSkinsCount()}/${MONKEYS_DATA.length * 3}`);

  if (els.framesGrid && !els.framesGrid.classList.contains("hidden")) {
    buildFramesGrid();
    syncCustomRefsState(frameCardRefs, f.id, state.unlockedFrames, state.frameProgress, "Выбрана ✓");
  } else if (els.stylesGrid && !els.stylesGrid.classList.contains("hidden")) {
    buildStylesList();
    syncCustomRefsState(styleCardRefs, st.id, state.unlockedStyles, state.styleProgress, "Выбран ✓");
  } else if (els.backgroundsGrid && !els.backgroundsGrid.classList.contains("hidden")) {
    buildBackgroundsGrid();
    syncCustomRefsState(bgCardRefs, bg.id, state.unlockedBgs, state.bgProgress, "Выбран ✓");
  } else if (els.skinsPane && !els.skinsPane.classList.contains("hidden")) {
    updateSkinsUI();
  }
}

function initCustomization() {
  bindModal(els.customMenuBtn, els.customModal, els.closeCustomBtn, () => {
    selectedSkinMonkeyId = null;
    skinsDetailKey = "";
    updateCustomizationUI();
  });
  bindTabs([
    { key: "frames", btn: "customTabFrames", panes: ["framesGrid"] },
    { key: "styles", btn: "customTabStyles", panes: ["stylesGrid"] },
    { key: "bgs", btn: "customTabBgs", panes: ["backgroundsGrid"] },
    { key: "skins", btn: "customTabSkins", panes: ["skinsPane"] }
  ], (key) => {
    if (key === "skins") {
      selectedSkinMonkeyId = null;
      skinsDetailKey = "";
    }
    updateCustomizationUI();
  });

  if (els.closeSkinConfirmBtn) els.closeSkinConfirmBtn.onclick = closeSkinConfirmModal;
  if (els.cancelSkinBuyBtn) els.cancelSkinBuyBtn.onclick = closeSkinConfirmModal;
  if (els.skinConfirmModal) {
    els.skinConfirmModal.onclick = (e) => {
      if (e.target === els.skinConfirmModal) closeSkinConfirmModal();
    };
  }
  if (els.confirmSkinBuyBtn) {
    els.confirmSkinBuyBtn.onclick = () => {
      const pending = pendingSkinPurchase;
      closeSkinConfirmModal();
      if (pending) executeMonkeySkinAction(pending.monkeyId, pending.skin);
    };
  }
}