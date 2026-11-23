const GOLDEN_BOOST_DURATION_MS = 30000;

let goldenClickBoostUntil = 0;
let goldenBpsBoostUntil = 0;
let goldenFlyActive = false;
let goldenFlyRaf = null;
let goldenNextSpawnIn = 28 + Math.random() * 20;
let lastBoostKey = "";
let lastClickBoostOn = false;
let lastBpsBoostOn = false;

function getGoldenClickMult() {
  return goldenClickBoostUntil > 0 && Date.now() < goldenClickBoostUntil ? 3 : 1;
}

function getGoldenBpsMult() {
  return goldenBpsBoostUntil > 0 && Date.now() < goldenBpsBoostUntil ? 3 : 1;
}

function hideGoldenBanana() {
  goldenFlyActive = false;
  if (goldenFlyRaf) {
    cancelAnimationFrame(goldenFlyRaf);
    goldenFlyRaf = null;
  }
  if (els.goldenBananaBtn) {
    els.goldenBananaBtn.classList.add("hidden");
  }
}

function spawnGoldenBanana() {
  if (goldenFlyActive || !els.goldenBananaBtn || !els.appShell) return;

  const rect = els.appShell.getBoundingClientRect();
  const w = rect.width || 380;
  const h = rect.height || 700;
  const fromLeft = Math.random() < 0.5;
  const startX = fromLeft ? -68 : w + 16;
  const endX = fromLeft ? w + 16 : -68;
  const baseY = h * (0.18 + Math.random() * 0.36);
  const amp = 24 + Math.random() * 24;
  const phase = Math.random() * Math.PI * 2;
  const dur = 7600;
  const startAt = performance.now();

  if (!els.goldenBananaBtn.dataset.built) {
    els.goldenBananaBtn.dataset.built = "1";
    els.goldenBananaBtn.innerHTML = createBananaSvg(
      { id: "gold_evt", c1: "#fffef2", c2: "#fde047", c3: "#d97706", effect: "divine" },
      "fly"
    );
  }

  const initY = baseY + Math.sin(phase) * amp;
  const initRot = fromLeft ? 10 : -10;
  els.goldenBananaBtn.style.transform = `translate3d(${startX.toFixed(1)}px, ${initY.toFixed(1)}px, 0) rotate(${initRot.toFixed(1)}deg)`;

  goldenFlyActive = true;
  els.goldenBananaBtn.classList.remove("hidden");

  const step = (now) => {
    if (!goldenFlyActive) return;
    if (isTabHidden) {
      hideGoldenBanana();
      return;
    }

    const t = (now - startAt) / dur;
    if (t >= 1) {
      hideGoldenBanana();
      return;
    }

    const x = startX + (endX - startX) * t;
    const y = baseY + Math.sin(t * Math.PI * 3 + phase) * amp;
    const rot = Math.sin(t * Math.PI * 4) * 18 + (fromLeft ? 10 : -10);
    els.goldenBananaBtn.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${rot.toFixed(1)}deg)`;
    goldenFlyRaf = requestAnimationFrame(step);
  };

  goldenFlyRaf = requestAnimationFrame(step);
}

function spawnGoldenPopText(x, y, text) {
  const el = mkEl("span", "floating-plus golden-pop-plus");
  el.textContent = text;
  el.style.left = `${x}px`;
  el.style.top = `${y - 12}px`;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 900);
}

function catchGoldenBanana(e) {
  if (!goldenFlyActive) return;

  const btnRect = els.goldenBananaBtn.getBoundingClientRect();
  const px = e && Number.isFinite(e.clientX) && e.clientX > 0 ? e.clientX : btnRect.left + btnRect.width / 2;
  const py = e && Number.isFinite(e.clientY) && e.clientY > 0 ? e.clientY : btnRect.top + btnRect.height / 2;

  hideGoldenBanana();
  goldenNextSpawnIn = 50 + Math.random() * 45;

  playSfx("fanfare");
  triggerHaptic([15, 25, 20]);
  spawnBgDropParticles();

  const roll = Math.floor(Math.random() * 4);
  if (roll === 0) {
    const diamonds = 1 + Math.floor(Math.random() * 25);
    state.diamonds += diamonds;
    if (state.weeklyQuests?.progress) {
      state.weeklyQuests.progress.earnDiamonds += diamonds;
    }
    spawnGoldenPopText(px, py, `+${diamonds} 💎`);
    showToast(`🍌 Золотой банан! Награда: +${diamonds} 💎!`);
  } else if (roll === 1) {
    const now = Date.now();
    goldenBpsBoostUntil = Math.max(now, goldenBpsBoostUntil) + GOLDEN_BOOST_DURATION_MS;
    spawnGoldenPopText(px, py, "×3 ДОХОД/СЕК!");
    showToast("🌟 Золотой банан! Буст дохода ×3 в секунду на 30 сек!");
  } else if (roll === 2) {
    const now = Date.now();
    goldenClickBoostUntil = Math.max(now, goldenClickBoostUntil) + GOLDEN_BOOST_DURATION_MS;
    spawnGoldenPopText(px, py, "×3 КЛИК!");
    showToast("⚡ Золотой банан! Буст к клику ×3 на 30 сек!");
  } else {
    ensureCollectionsState();
    const col = COLLECTIONS_DATA[Math.floor(Math.random() * COLLECTIONS_DATA.length)];
    const item = col.items[Math.floor(Math.random() * col.items.length)];
    const qty = (state.collections.counts[item.id] || 0) + 1;
    state.collections.counts[item.id] = qty;
    markUiDirty("col");
    updateCollectionsUI();
    spawnGoldenPopText(px, py, `🎒 ${item.name}!`);
    showToast(`🎒 Золотой банан принёс предмет: ${item.name} (×${qty})!`);
  }

  saveState();
  updateUI();
}

function updateGoldenBoostsUI() {
  if (goldenClickBoostUntil === 0 && goldenBpsBoostUntil === 0 && lastBoostKey === "0_0") return;

  const now = Date.now();
  const clickSec = goldenClickBoostUntil > now ? Math.ceil((goldenClickBoostUntil - now) / 1000) : 0;
  const bpsSec = goldenBpsBoostUntil > now ? Math.ceil((goldenBpsBoostUntil - now) / 1000) : 0;

  if (clickSec === 0) goldenClickBoostUntil = 0;
  if (bpsSec === 0) goldenBpsBoostUntil = 0;

  const key = `${clickSec}_${bpsSec}`;
  if (lastBoostKey === key) return;
  lastBoostKey = key;

  const clickOn = clickSec > 0;
  const bpsOn = bpsSec > 0;
  const layoutChanged = clickOn !== lastClickBoostOn || bpsOn !== lastBpsBoostOn;
  lastClickBoostOn = clickOn;
  lastBpsBoostOn = bpsOn;

  if (els.goldenClickBadge) {
    els.goldenClickBadge.classList.toggle("hidden", !clickOn);
    if (clickOn && els.goldenClickSec) setText(els.goldenClickSec, `${clickSec}с`);
  }
  if (els.goldenBpsBadge) {
    els.goldenBpsBadge.classList.toggle("hidden", !bpsOn);
    if (bpsOn && els.goldenBpsSec) setText(els.goldenBpsSec, `${bpsSec}с`);
  }
  if (layoutChanged && typeof invalidateTapBtnRect === "function") {
    invalidateTapBtnRect();
  }
}

function tickGoldenBanana(dt) {
  updateGoldenBoostsUI();

  if (!gameStarted || isTabHidden || goldenFlyActive) return;
  goldenNextSpawnIn -= dt;
  if (goldenNextSpawnIn <= 0) {
    if (document.querySelector(".modal-overlay:not(.hidden)")) {
      goldenNextSpawnIn = 3;
      return;
    }
    goldenNextSpawnIn = 55 + Math.random() * 45;
    spawnGoldenBanana();
  }
}

function resetGoldenBananaTransient() {
  hideGoldenBanana();
  goldenClickBoostUntil = 0;
  goldenBpsBoostUntil = 0;
  lastBoostKey = "";
  lastClickBoostOn = false;
  lastBpsBoostOn = false;
  updateGoldenBoostsUI();
}

function initGoldenBanana() {
  if (els.goldenBananaBtn) {
    els.goldenBananaBtn.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      e.stopPropagation();
      catchGoldenBanana(e);
    });
    els.goldenBananaBtn.addEventListener("click", (e) => {
      if (e.detail === 0) catchGoldenBanana(e);
    });
  }

  window.spawnGoldenBananaNow = spawnGoldenBanana;
  updateGoldenBoostsUI();
}