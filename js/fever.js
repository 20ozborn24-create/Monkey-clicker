const FEVER_DURATION = 10;           // длительность лихорадки (сек)
const FEVER_GAIN_PER_TAP = 2.0 / 1.15; // +заряд за 1 клик (на 15% дольше)
const FEVER_ACTIVE_DECAY = 2.5;      // спад в сек во время кликов
const FEVER_IDLE_DECAY = 16;         // быстрый спад, если перестал кликать
const FEVER_IDLE_DELAY = 550;        // пауза без кликов (мс) до быстрого спада

let feverCharge = 0;
let feverActive = false;
let feverTimeLeft = 0;
let feverMaxDuration = FEVER_DURATION;
let lastFeverTapAt = 0;

let feverWrapEl = null;
let feverFillEl = null;
let feverValEl = null;
let lastFeverIsFever = null;
let lastFeverIsHot = null;
let lastFeverWidth = "";
let lastFeverVal = "";

function getFeverMultiplier() {
  return feverActive ? 2 : 1;
}

function getFeverBpsMultiplier() {
  return feverActive ? 1.5 : 1;
}

function onFeverTap() {
  lastFeverTapAt = performance.now();
  if (feverActive) return;

  feverCharge = Math.min(100, feverCharge + FEVER_GAIN_PER_TAP);
  if (feverCharge >= 100) {
    activateBananaFever(FEVER_DURATION);
  } else {
    updateFeverUI();
  }
}

function activateBananaFever(duration = FEVER_DURATION, silentToast = false) {
  const dur = Math.max(1, Number(duration) || FEVER_DURATION);
  if (feverActive) {
    feverTimeLeft += dur;
    feverMaxDuration = Math.max(feverMaxDuration, feverTimeLeft);
  } else {
    feverActive = true;
    feverCharge = 100;
    feverTimeLeft = dur;
    feverMaxDuration = dur;
    if (els.appShell) els.appShell.classList.add("fever-active");
  }

  playSfx("fever");

  if (!silentToast) {
    showToast(`🔥 БАНАНОВАЯ ЛИХОРАДКА! x2 клик и x1.5 пассив на ${dur} сек!`);
  }
  updateFeverUI();
}

function updateFever(dt) {
  if (feverActive) {
    feverTimeLeft = Math.max(0, feverTimeLeft - dt);
    if (feverTimeLeft <= 0) {
      feverActive = false;
      feverCharge = 0;
      feverMaxDuration = FEVER_DURATION;
      if (els.appShell) els.appShell.classList.remove("fever-active");
      showToast("Лихорадка закончилась — кликай быстрее!");
    }
    updateFeverUI();
    return;
  }

  if (feverCharge > 0) {
    const idle = performance.now() - lastFeverTapAt > FEVER_IDLE_DELAY;
    const decay = idle ? FEVER_IDLE_DECAY : FEVER_ACTIVE_DECAY;
    feverCharge = Math.max(0, feverCharge - decay * dt);
    updateFeverUI();
  }
}

function resetFever() {
  feverCharge = 0;
  feverActive = false;
  feverTimeLeft = 0;
  feverMaxDuration = FEVER_DURATION;
  lastFeverTapAt = 0;
  if (els.appShell) els.appShell.classList.remove("fever-active");
  updateFeverUI();
}

function updateFeverUI() {
  if (!feverWrapEl) {
    feverWrapEl = els.feverBarWrap;
    feverFillEl = els.feverBarFill;
    feverValEl = els.feverValue;
  }
  if (!feverWrapEl) return;

  const isHot = !feverActive && feverCharge >= 60;
  if (lastFeverIsFever !== feverActive) {
    lastFeverIsFever = feverActive;
    feverWrapEl.classList.toggle("is-fever", feverActive);
  }
  if (lastFeverIsHot !== isHot) {
    lastFeverIsHot = isHot;
    feverWrapEl.classList.toggle("is-hot", isHot);
  }

  const val = feverActive ? `x2 • ${feverTimeLeft.toFixed(1)}с` : `${Math.floor(feverCharge)}%`;
  if (lastFeverVal !== val) {
    lastFeverVal = val;
    setText(feverValEl, val);
  }

  if (feverFillEl) {
    const pct = feverActive ? (feverTimeLeft / Math.max(1, feverMaxDuration)) * 100 : feverCharge;
    const widthStr = `${Math.max(0, Math.min(100, pct)).toFixed(1)}%`;
    if (lastFeverWidth !== widthStr) {
      lastFeverWidth = widthStr;
      feverFillEl.style.width = widthStr;
    }
  }
}