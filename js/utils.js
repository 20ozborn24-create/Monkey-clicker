const els = new Proxy({}, { get: (c, id) => c[id] || (c[id] = document.getElementById(id)) });

let audioCtx = null;
let toastTimer = null;

function nonNegNum(v, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

function mkEl(tag, cls, html = "") {
  const el = document.createElement(tag);
  if (cls) el.className = cls;
  if (html) el.innerHTML = html;
  return el;
}

function setText(el, val) {
  const s = String(val);
  if (el && el.textContent !== s) el.textContent = s;
}

function syncBtn(ref, text, cls, disabled) {
  if (ref.lastText !== text) { ref.lastText = text; ref.btn.textContent = text; }
  if (ref.lastClass !== cls) { ref.lastClass = cls; ref.btn.className = cls; }
  if (ref.lastDisabled !== disabled) { ref.lastDisabled = disabled; ref.btn.disabled = disabled; }
}

function syncBtnHtml(ref, html, cls, disabled) {
  if (ref.lastHtml !== html) { ref.lastHtml = html; ref.btn.innerHTML = html; }
  if (ref.lastClass !== cls) { ref.lastClass = cls; ref.btn.className = cls; }
  if (ref.lastDisabled !== disabled) { ref.lastDisabled = disabled; ref.btn.disabled = disabled; }
}

function showToast(text) {
  els.toast.textContent = text;
  els.toast.classList.remove("hidden");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => els.toast.classList.add("hidden"), 2400);
}

function bindModal(openBtn, modal, closeBtn, onOpen) {
  if (!openBtn || !modal || !closeBtn) return;
  openBtn.onclick = () => {
    modal.classList.remove("hidden");
    if (onOpen) onOpen();
  };
  closeBtn.onclick = () => modal.classList.add("hidden");
  modal.onclick = (e) => {
    if (e.target === modal) modal.classList.add("hidden");
  };
}

function bindTabs(items, onChange) {
  const activate = (activeKey) => {
    let activeBtnEl = null;
    items.forEach(({ key, btn, panes = [] }) => {
      const isActive = key === activeKey;
      if (els[btn]) {
        els[btn].classList.toggle("active", isActive);
        if (isActive) activeBtnEl = els[btn];
      }
      panes.forEach((p) => {
        if (els[p]) els[p].classList.toggle("hidden", !isActive);
      });
    });
    const modalBody = activeBtnEl?.closest(".modal-card")?.querySelector(".modal-body");
    if (modalBody) modalBody.scrollTop = 0;
    if (onChange) onChange(activeKey);
  };
  items.forEach(({ key, btn }) => {
    if (els[btn]) els[btn].onclick = () => activate(key);
  });
  return activate;
}

function triggerHaptic(pattern = 10) {
  if (!state.hapticEnabled) return;
  try {
    if (navigator.vibrate) navigator.vibrate(pattern);
  } catch (_) {}
}

const SFX_MAP = {
  error: [[220, 0.1, "sawtooth", 0.04, 0]],
  fail: [[190, 0.16, "sawtooth", 0.07, 0], [135, 0.24, "sawtooth", 0.07, 120]],
  select: [[660, 0.08, "triangle", 0.06, 0]],
  spin: [[440, 0.08, "triangle", 0.06, 0]],
  unlock: [[880, 0.14, "triangle", 0.08, 0]],
  start: [[587, 0.08, "triangle", 0.07, 0], [880, 0.16, "triangle", 0.07, 85]],
  claim: [[880, 0.12, "triangle", 0.08, 0], [1175, 0.18, "triangle", 0.07, 90]],
  win: [[659, 0.08, "triangle", 0.07, 0], [880, 0.1, "triangle", 0.08, 80], [1175, 0.18, "triangle", 0.08, 160]],
  fever: [[523, 0.08, "triangle", 0.08, 0], [659, 0.08, "triangle", 0.08, 80], [784, 0.12, "triangle", 0.09, 160], [1046, 0.2, "triangle", 0.09, 240]],
  fanfare: [[587, 0.08, "triangle", 0.08, 0], [784, 0.09, "triangle", 0.08, 80], [1046, 0.14, "triangle", 0.09, 160], [1318, 0.22, "triangle", 0.09, 240]]
};

function playTone(freq, duration, type = "sine", volume = 0.06) {
  if (!state.soundEnabled) return;
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!audioCtx && Ctx) audioCtx = new Ctx();
    if (!audioCtx) return;
    if (audioCtx.state === "suspended") audioCtx.resume().catch(() => {});
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(volume, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (_) {}
}

function playSfx(name) {
  const seq = SFX_MAP[name];
  if (!seq) return;
  seq.forEach(([freq, dur, type, vol, delay]) => {
    if (delay > 0) setTimeout(() => playTone(freq, dur, type, vol), delay);
    else playTone(freq, dur, type, vol);
  });
}

function formatNum(num) {
  if (!Number.isFinite(num)) return "∞";
  if (num < 0) return "-" + formatNum(-num);
  if (num === 0) return "0";
  if (num < 1000) {
    if (num % 1 === 0) return String(num);
    if (num < 0.05) return String(Number(num.toPrecision(2)));
    const fixed = num.toFixed(1).replace(/\.0$/, "");
    if (fixed !== "1000") return fixed;
    num = 1000;
  }
  const s = ["", " тыс.", " млн", " млрд", " трлн", " квдр", " квнт", " скст", " спт", " окт", " нон", " дец", " унд", " дод"];
  let tier = Math.floor(Math.log10(num) / 3);
  let scaled = num / Math.pow(10, tier * 3);
  if (scaled >= 1000) {
    tier += 1;
    scaled = num / Math.pow(10, tier * 3);
  }
  if (tier >= s.length) return num.toExponential(2).replace("+", "");
  return (scaled >= 100 ? Math.floor(scaled) : scaled.toFixed(1).replace(/\.0$/, "")) + s[tier];
}

function formatTime(sec) {
  const t = Math.max(0, Math.floor(sec));
  return [Math.floor(t / 3600), Math.floor((t % 3600) / 60), t % 60]
    .map((v) => String(v).padStart(2, "0"))
    .join(":");
}

function formatDurationLong(sec) {
  const t = Math.max(0, Math.floor(sec));
  const days = Math.floor(t / 86400);
  const rem = formatTime(t % 86400);
  return days > 0 ? `${days}д ${rem}` : rem;
}

function isValidEnglishNick(str) {
  return typeof str === "string" && /^[A-Za-z0-9 _-]+$/.test(str) && /[A-Za-z]/.test(str);
}