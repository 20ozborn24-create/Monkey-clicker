const WHEEL_COOLDOWN_MS = 12 * 60 * 60 * 1000;

const WHEEL_REWARDS = [
  { id: "d10",   label: "10 Алмазов",                 short: "+10",  icon: "💎", color: "#0369a1", weight: 20, type: "diamonds", amount: 10 },
  { id: "d25",   label: "25 Алмазов",                 short: "+25",  icon: "💎", color: "#0f766e", weight: 18, type: "diamonds", amount: 25 },
  { id: "d50",   label: "50 Алмазов",                 short: "+50",  icon: "💎", color: "#6d28d9", weight: 14, type: "diamonds", amount: 50 },
  { id: "d100",  label: "100 Алмазов",                short: "+100", icon: "💠", color: "#be185d", weight: 9,  type: "diamonds", amount: 100 },
  { id: "d250",  label: "250 Алмазов",                short: "+250", icon: "👑", color: "#d97706", weight: 5,  type: "diamonds", amount: 250 },
  { id: "tw10m", label: "Прыжок во времени 10 мин",   short: "10м",  icon: "⏩", color: "#15803d", weight: 14, type: "warp",     seconds: 600 },
  { id: "tw30m", label: "Прыжок во времени 30 мин",   short: "30м",  icon: "⏳", color: "#1d4ed8", weight: 10, type: "warp",     seconds: 1800 },
  { id: "fev60", label: "Банановая лихорадка 60 сек", short: "60с",  icon: "🔥", color: "#c2410c", weight: 10, type: "fever",    seconds: 60 }
];

let wheelBuilt = false;
let wheelCurrentDeg = 0;
let isWheelSpinning = false;
let wheelSpinTimer = null;
let wheelSpinBtnRef = null;
let lastWheelReadyBadge = null;

function buildWheelSvg() {
  if (!els.wheelSpinner) return;
  const cx = 130;
  const cy = 130;
  const r = 114;
  const sliceDeg = 360 / WHEEL_REWARDS.length;

  let slicesHtml = "";
  WHEEL_REWARDS.forEach((item, i) => {
    const a1 = ((i * sliceDeg - sliceDeg / 2 - 90) * Math.PI) / 180;
    const a2 = ((i * sliceDeg + sliceDeg / 2 - 90) * Math.PI) / 180;
    const x1 = (cx + r * Math.cos(a1)).toFixed(2);
    const y1 = (cy + r * Math.sin(a1)).toFixed(2);
    const x2 = (cx + r * Math.cos(a2)).toFixed(2);
    const y2 = (cy + r * Math.sin(a2)).toFixed(2);
    const rot = i * sliceDeg;
    const iconEl = item.icon === "💎"
      ? `<use href="#ico-diamond" x="${cx - 10}" y="26" width="20" height="20"/>`
      : `<text x="${cx}" y="44" text-anchor="middle" font-size="18">${item.icon}</text>`;

    slicesHtml += `
      <path d="M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z"
            fill="${item.color}" stroke="#fef08a" stroke-width="1.6"/>
      <g transform="rotate(${rot} ${cx} ${cy})">
        ${iconEl}
        <text x="${cx}" y="65" text-anchor="middle" fill="#ffffff" font-size="13" font-weight="900"
              style="text-shadow:0 1px 3px rgba(0,0,0,0.85)">${item.short}</text>
      </g>`;
  });

  let dotsHtml = "";
  for (let i = 0; i < 16; i++) {
    const ang = (i * 22.5 * Math.PI) / 180;
    const dx = (cx + 122 * Math.cos(ang)).toFixed(2);
    const dy = (cy + 122 * Math.sin(ang)).toFixed(2);
    dotsHtml += `<circle cx="${dx}" cy="${dy}" r="3.2" fill="${i % 2 === 0 ? "#fef08a" : "#ffffff"}"/>`;
  }

  els.wheelSpinner.innerHTML = `
    <svg viewBox="0 0 260 260" xmlns="http://www.w3.org/2000/svg">
      <circle cx="${cx}" cy="${cy}" r="127" fill="#78350f" stroke="#fde047" stroke-width="3"/>
      ${dotsHtml}
      ${slicesHtml}
      <circle cx="${cx}" cy="${cy}" r="22" fill="#142219" stroke="#fde047" stroke-width="3.5"/>
      <text x="${cx}" y="${cy + 6}" text-anchor="middle" font-size="18">🍌</text>
    </svg>`;
  wheelBuilt = true;
  if (state.lowPerfMode && typeof syncSvgAnimationsPause === "function") {
    syncSvgAnimationsPause();
  }
}

function ensureWheelBuilt() {
  if (!wheelBuilt) buildWheelSvg();
}

function pickWeightedWheelIndex() {
  const total = WHEEL_REWARDS.reduce((s, x) => s + x.weight, 0);
  let roll = Math.random() * total;
  for (let i = 0; i < WHEEL_REWARDS.length; i++) {
    roll -= WHEEL_REWARDS[i].weight;
    if (roll <= 0) return i;
  }
  return 0;
}

function getWheelMaxSpins() {
  if (isPlatinumActive()) return 3;
  if (isPremiumActive()) return 2;
  return 1;
}

function getWheelRemainingSpins() {
  const now = Date.now();
  if (now >= (state.wheelNextSpinAt || 0)) return getWheelMaxSpins();
  return Math.max(0, getWheelMaxSpins() - (state.wheelSpinsUsed || 0));
}

function spinFortuneWheel() {
  if (isWheelSpinning) return;
  ensureWheelBuilt();

  const now = Date.now();
  const rem = getWheelRemainingSpins();
  if (rem <= 0) {
    const left = Math.ceil(((state.wheelNextSpinAt || 0) - now) / 1000);
    playSfx("error");
    return showToast("Следующий спин через " + formatTime(left) + "!");
  }

  const winIdx = pickWeightedWheelIndex();
  const reward = WHEEL_REWARDS[winIdx];

  isWheelSpinning = true;
  if (now >= (state.wheelNextSpinAt || 0)) {
    state.wheelNextSpinAt = now + WHEEL_COOLDOWN_MS;
    state.wheelSpinsUsed = 1;
  } else {
    state.wheelSpinsUsed = (state.wheelSpinsUsed || 0) + 1;
  }
  state.pendingWheelRewardId = reward.id;
  saveState();

  const sliceDeg = 360 / WHEEL_REWARDS.length;
  const targetMod = (360 - winIdx * sliceDeg) % 360;
  const curMod = ((wheelCurrentDeg % 360) + 360) % 360;
  const delta = (targetMod - curMod + 360) % 360;
  const jitter = (Math.random() - 0.5) * 24;

  wheelCurrentDeg += 5 * 360 + delta + jitter;

  if (els.wheelResultBox) els.wheelResultBox.classList.add("hidden");
  if (els.wheelSpinner) {
    void els.wheelSpinner.offsetWidth;
    els.wheelSpinner.style.transition = "transform 4.2s cubic-bezier(0.12, 0.85, 0.18, 1)";
    els.wheelSpinner.style.transform = `rotate(${wheelCurrentDeg}deg)`;
  }

  playSfx("spin");
  triggerHaptic(12);
  updateWheelUI();

  const spinDelay = state.lowPerfMode ? 350 : 4300;
  clearTimeout(wheelSpinTimer);
  wheelSpinTimer = setTimeout(() => {
    isWheelSpinning = false;
    if (state.pendingWheelRewardId === reward.id) {
      state.pendingWheelRewardId = null;
      grantWheelReward(reward);
    }
  }, spinDelay);
}

function grantWheelReward(reward, fromRecovery = false) {
  let msg = "";
  let resultHtml = "";
  if (reward.type === "diamonds") {
    state.diamonds += reward.amount;
    if (state.weeklyQuests?.progress) {
      state.weeklyQuests.progress.earnDiamonds += reward.amount;
    }
    msg = `${reward.icon} Выпало: +${reward.amount} 💎!`;
    const leadIcon = reward.id === "d250" ? "👑" : gemHtml();
    resultHtml = `${leadIcon} Выпало: +${reward.amount} ${gemHtml()}!`;
  } else if (reward.type === "warp") {
    const fromBps = Math.floor(clampFinite(getBps() * reward.seconds));
    const fromBpc = Math.floor(clampFinite(getBpc() * (reward.seconds / 5)));
    const earned = Math.max(reward.seconds >= 1800 ? 300 : 100, fromBps, fromBpc);
    addBananas(earned);
    markUiDirty("shop");
    msg = `${reward.icon} ${reward.label}: +${formatNum(earned)} 🍌!`;
    resultHtml = msg;
  } else if (reward.type === "fever") {
    activateBananaFever(reward.seconds, true);
    msg = `🔥 ${reward.label}! x2 клик и x1.5 пассив!`;
    resultHtml = msg;
  }

  playSfx("win");
  triggerHaptic([14, 24, 18]);

  if (els.wheelResultBox && els.wheelResultText) {
    els.wheelResultText.innerHTML = resultHtml;
    els.wheelResultBox.classList.remove("hidden");
  }
  showToast(fromRecovery ? `🎡 Награда за прошлый спин! ${msg}` : msg);
  saveState();
  updateUI();
}

function claimPendingWheelReward() {
  const id = state.pendingWheelRewardId;
  if (!id) return;
  state.pendingWheelRewardId = null;
  const pending = WHEEL_REWARDS.find((r) => r.id === id);
  if (!pending) {
    saveState();
    return;
  }
  grantWheelReward(pending, true);
}

function updateWheelUI() {
  const rem = getWheelRemainingSpins();
  const maxSpins = getWheelMaxSpins();
  const showReady = rem > 0 && !isWheelSpinning;
  if (lastWheelReadyBadge !== showReady) {
    lastWheelReadyBadge = showReady;
    if (els.wheelReadyDot) els.wheelReadyDot.classList.toggle("hidden", !showReady);
    if (els.wheelBtn) els.wheelBtn.classList.toggle("is-ready", showReady);
  }

  if (!els.wheelModal || els.wheelModal.classList.contains("hidden")) return;
  ensureWheelBuilt();
  if (!wheelSpinBtnRef && els.wheelSpinBtn) wheelSpinBtnRef = { btn: els.wheelSpinBtn };

  const crownIco = isPlatinumActive() ? "💠" : "👑";
  const leftSec = Math.max(0, Math.ceil(((state.wheelNextSpinAt || 0) - Date.now()) / 1000));

  if (isWheelSpinning) {
    setText(els.wheelTimerDisplay, "Крутим барабан...");
    if (wheelSpinBtnRef) syncBtn(wheelSpinBtnRef, "⏳ Крутится...", "minigame-action-btn disabled", true);
  } else if (rem > 0) {
    if (maxSpins > 1) {
      setText(
        els.wheelTimerDisplay,
        leftSec > 0
          ? `${crownIco} Вращений: ${rem}/${maxSpins} • Сброс ${formatTime(leftSec)}`
          : `${crownIco} Доступно вращений: ${rem}/${maxSpins} (раз в 12ч)`
      );
      if (wheelSpinBtnRef) syncBtn(wheelSpinBtnRef, `🎡 КРУТИТЬ (${rem}/${maxSpins})!`, "minigame-action-btn ready", false);
    } else {
      setText(els.wheelTimerDisplay, "Готово! Можно крутить");
      if (wheelSpinBtnRef) syncBtn(wheelSpinBtnRef, "🎡 КРУТИТЬ КОЛЕСО!", "minigame-action-btn ready", false);
    }
  } else {
    setText(els.wheelTimerDisplay, `Следующий спин: ${formatTime(leftSec)}`);
    if (wheelSpinBtnRef) syncBtn(wheelSpinBtnRef, `⏳ ${formatTime(leftSec)}`, "minigame-action-btn disabled", false);
  }
}

function resetWheelTransient() {
  clearTimeout(wheelSpinTimer);
  isWheelSpinning = false;
  lastWheelReadyBadge = null;
  if (els.wheelSpinner) {
    wheelCurrentDeg = 0;
    els.wheelSpinner.style.transition = "none";
    els.wheelSpinner.style.transform = "rotate(0deg)";
  }
  if (els.wheelResultBox) els.wheelResultBox.classList.add("hidden");
  if (gameStarted && state.pendingWheelRewardId) {
    claimPendingWheelReward();
  }
  updateWheelUI();
}

function initWheel() {
  if (els.wheelSpinBtn) els.wheelSpinBtn.onclick = spinFortuneWheel;

  bindModal(els.wheelBtn, els.wheelModal, els.closeWheelBtn, () => {
    if (!isWheelSpinning && els.wheelResultBox) els.wheelResultBox.classList.add("hidden");
    updateWheelUI();
  });

  updateWheelUI();
}