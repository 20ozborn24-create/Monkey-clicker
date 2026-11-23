const CRAB_DISCOUNT_COOLDOWN_MS = 12 * 60 * 60 * 1000;
const COCONUT_COST = 75;
const COCONUT_MAX_WIN = 250;
const COCONUT_PRIZES = [20, 25, 30, 35, 35, 40, 45, 50];

let coconutsBuilt = false;
const coconutCellRefs = [];
let coconutsActionRef = null;
let coconutsStatusHtml = "";
let lastCrabBadgeKey = "";

function buildCoconutsGrid() {
  if (!els.coconutsGrid) return;
  els.coconutsGrid.innerHTML = "";
  coconutCellRefs.length = 0;

  const frag = document.createDocumentFragment();
  const closedSvg = useSvg("ico-coco-closed");

  for (let i = 0; i < 9; i++) {
    const btn = mkEl("button", "coconut-cell", closedSvg);
    btn.type = "button";
    btn.onclick = () => onCoconutTap(i);
    frag.appendChild(btn);
    coconutCellRefs.push({ btn, stateKey: "" });
  }

  els.coconutsGrid.appendChild(frag);
  coconutsBuilt = true;
  renderCoconutsGrid();
}

function ensureCoconutsBuilt() {
  if (!coconutsBuilt) buildCoconutsGrid();
}

function getCrabMaxDiscounts() {
  if (isPlatinumActive()) return 2;
  if (isPremiumActive()) return 1;
  return 0;
}

function getCrabRemainingDiscounts() {
  const max = getCrabMaxDiscounts();
  if (max <= 0) return 0;
  if (Date.now() >= (state.crabDiscountNextAt || 0)) return max;
  return Math.max(0, max - (state.crabDiscountUsed || 0));
}

function isCrabDiscountReady() {
  return getCrabRemainingDiscounts() > 0;
}

function getCurrentCoconutCost() {
  return isCrabDiscountReady() ? Math.floor(COCONUT_COST * 0.5) : COCONUT_COST;
}

function startCoconutsGame() {
  const g = state.coconutsGame;
  if (g && g.active && g.status === "playing") return;

  const now = Date.now();
  const discountUsed = isCrabDiscountReady();
  const cost = discountUsed ? Math.floor(COCONUT_COST * 0.5) : COCONUT_COST;
  if (!spendDiamonds(cost)) return;

  if (discountUsed) {
    if (now >= (state.crabDiscountNextAt || 0)) {
      state.crabDiscountNextAt = now + CRAB_DISCOUNT_COOLDOWN_MS;
      state.crabDiscountUsed = 1;
    } else {
      state.crabDiscountUsed = (state.crabDiscountUsed || 0) + 1;
    }
  }

  const board = [...COCONUT_PRIZES, "crab"];
  for (let i = board.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [board[i], board[j]] = [board[j], board[i]];
  }

  state.coconutsGame = {
    active: true,
    status: "playing",
    bank: 0,
    costPaid: cost,
    board,
    opened: new Array(9).fill(false)
  };

  playSfx("select");
  triggerHaptic(10);
  saveState();
  renderCoconutsGrid();
  updateUI();
}

function onCoconutTap(idx) {
  const g = state.coconutsGame;
  if (!g || !g.active || g.status !== "playing" || g.opened[idx]) return;

  g.opened[idx] = true;
  const cell = g.board[idx];

  if (cell === "crab") {
    g.status = "lost";
    g.active = false;
    g.bank = 0;
    playSfx("fail");
    triggerHaptic([20, 30, 25]);
    showToast("🦀 Ой! Попался злой краб — банк сгорел!");
  } else {
    g.bank = Math.min(COCONUT_MAX_WIN, g.bank + cell);
    const totalSafe = g.board.filter((v) => v !== "crab").length;
    const openedSafe = g.opened.filter((o, i) => o && g.board[i] !== "crab").length;

    if (openedSafe >= totalSafe) {
      g.status = "won";
      g.active = false;
      state.diamonds += g.bank;
      const profit = Math.max(0, g.bank - (g.costPaid || COCONUT_COST));
      if (profit > 0 && state.weeklyQuests?.progress) {
        state.weeklyQuests.progress.earnDiamonds += profit;
      }
      playSfx("win");
      triggerHaptic([14, 24, 18]);
      showToast(`👑 ДЖЕКПОТ! Выиграно +${g.bank} 💎!`);
    } else {
      triggerHaptic(8);
      playTone(520 + openedSafe * 55, 0.09, "triangle", 0.07);
    }
  }

  saveState();
  renderCoconutsGrid();
  updateUI();
}

function cashoutCoconutsGame() {
  const g = state.coconutsGame;
  if (!g || !g.active || g.status !== "playing" || g.bank <= 0) return;

  const won = g.bank;
  g.status = "won";
  g.active = false;
  state.diamonds += won;
  const profit = Math.max(0, won - (g.costPaid || COCONUT_COST));
  if (profit > 0 && state.weeklyQuests?.progress) {
    state.weeklyQuests.progress.earnDiamonds += profit;
  }

  playSfx("claim");
  triggerHaptic(14);
  showToast(`🥥 Забрано +${won} 💎!`);

  saveState();
  renderCoconutsGrid();
  updateUI();
}

function renderCoconutsGrid() {
  if (!coconutsBuilt || !coconutCellRefs.length) return;
  const g = state.coconutsGame;
  const revealed = g && g.status !== "playing";
  const closedSvg = useSvg("ico-coco-closed");

  for (let i = 0; i < coconutCellRefs.length; i++) {
    const ref = coconutCellRefs[i];
    let key = "idle";
    let html = closedSvg;
    let cls = "coconut-cell";
    let disabled = true;

    if (g) {
      const isOpened = g.opened[i];
      const val = g.board[i];
      if (isOpened || revealed) {
        const dim = !isOpened && revealed ? " is-revealed-dim" : "";
        if (val === "crab") {
          key = `crab_${isOpened}_${revealed}`;
          cls = `coconut-cell is-crab${dim}`;
          html = `<span class="coco-res-icon">🦀</span><span class="coco-res-val">Краб!</span>`;
        } else {
          key = `gem_${val}_${isOpened}_${revealed}`;
          cls = `coconut-cell is-gem${dim}`;
          html = `<span class="coco-res-icon coco-gem-icon">${gemHtml("coco-diamond")}</span><span class="coco-res-val">+${val}</span>`;
        }
      } else {
        key = "playing_closed";
        cls = "coconut-cell can-open";
        disabled = false;
      }
    }

    if (ref.stateKey !== key) {
      ref.stateKey = key;
      ref.btn.className = cls;
      ref.btn.innerHTML = html;
      ref.btn.disabled = disabled;
    }
  }
}

function setCoconutsStatus(html) {
  if (els.coconutsStatusText && coconutsStatusHtml !== html) {
    coconutsStatusHtml = html;
    els.coconutsStatusText.innerHTML = html;
  }
}

function updateCoconutsUI() {
  const maxDiscounts = getCrabMaxDiscounts();
  const remDiscounts = getCrabRemainingDiscounts();
  const discountReady = remDiscounts > 0;
  const badgeKey = discountReady ? `1_${remDiscounts}` : "0";

  if (lastCrabBadgeKey !== badgeKey) {
    lastCrabBadgeKey = badgeKey;
    if (els.crabDiscountBadge) {
      els.crabDiscountBadge.classList.toggle("hidden", !discountReady);
      if (discountReady) {
        setText(els.crabDiscountBadge, remDiscounts > 1 ? `-50%×${remDiscounts}` : "-50%");
      }
    }
    if (els.coconutsBtn) {
      els.coconutsBtn.classList.toggle("has-discount", discountReady);
    }
  }

  if (!els.coconutsModal || els.coconutsModal.classList.contains("hidden")) return;
  ensureCoconutsBuilt();
  if (!coconutsActionRef && els.coconutsActionBtn) coconutsActionRef = { btn: els.coconutsActionBtn };

  setText(els.coconutsDiamondBalance, formatNum(state.diamonds));

  const g = state.coconutsGame;
  const playing = Boolean(g && g.active && g.status === "playing");
  const curCost = getCurrentCoconutCost();
  const discountLeftSec = Math.max(0, Math.ceil(((state.crabDiscountNextAt || 0) - Date.now()) / 1000));
  const crownIco = isPlatinumActive() ? "💠" : "👑";
  const countTag = maxDiscounts > 1 ? ` (${remDiscounts}/${maxDiscounts})` : "";
  const vipHint = discountReady
    ? `<br><span class="coco-vip-hint">${crownIco} Скидка -50%${countTag} активна (${curCost} ${gemHtml()} вместо ${COCONUT_COST})!</span>`
    : maxDiscounts > 0 && discountLeftSec > 0
      ? `<br><span class="coco-vip-wait">${crownIco} След. скидка -50% через ${formatTime(discountLeftSec)}</span>`
      : "";
  const playLabel = discountReady ? `${curCost} ${gemHtml()} • -50% ${crownIco}` : `${curCost} ${gemHtml()}`;
  const playBtnCls = `minigame-action-btn ${state.diamonds >= curCost ? "ready" : "disabled"}`;

  if (!g) {
    setText(els.coconutsBankValue, "0");
    setCoconutsStatus(`8 кокосов с ${gemHtml()} и 1 злой краб 🦀. Макс. выигрыш — 250 ${gemHtml()}!${vipHint}`);
    if (coconutsActionRef) syncBtnHtml(coconutsActionRef, `🥥 Играть (${playLabel})`, playBtnCls, false);
  } else if (playing) {
    const totalSafe = g.board.filter((v) => v !== "crab").length;
    const openedSafe = g.opened.filter((o, i) => o && g.board[i] !== "crab").length;
    setText(els.coconutsBankValue, formatNum(g.bank));
    setCoconutsStatus(`Открыто: ${openedSafe}/${totalSafe} • Выбирай кокос или забирай!`);
    if (coconutsActionRef) {
      syncBtnHtml(
        coconutsActionRef,
        g.bank > 0 ? `💰 Забрать ${g.bank} ${gemHtml()}` : "Выбери первый кокос...",
        `minigame-action-btn ${g.bank > 0 ? "cashout" : "disabled"}`,
        g.bank <= 0
      );
    }
  } else if (g.status === "won") {
    setText(els.coconutsBankValue, formatNum(g.bank));
    setCoconutsStatus(`🎉 Победа! Выигрыш +${g.bank} ${gemHtml()}!${vipHint}`);
    if (coconutsActionRef) syncBtnHtml(coconutsActionRef, `🥥 Сыграть снова (${playLabel})`, playBtnCls, false);
  } else {
    setText(els.coconutsBankValue, "0");
    setCoconutsStatus(`🦀 Попался краб! Попробуй ещё раз.${vipHint}`);
    if (coconutsActionRef) syncBtnHtml(coconutsActionRef, `🥥 Сыграть снова (${playLabel})`, playBtnCls, false);
  }
}

function resetCoconutsTransient() {
  lastCrabBadgeKey = "";
  renderCoconutsGrid();
  updateCoconutsUI();
}

function initCoconuts() {
  if (els.coconutsActionBtn) {
    els.coconutsActionBtn.onclick = () => {
      const g = state.coconutsGame;
      if (g && g.active && g.status === "playing") cashoutCoconutsGame();
      else startCoconutsGame();
    };
  }

  bindModal(els.coconutsBtn, els.coconutsModal, els.closeCoconutsBtn, () => {
    ensureCoconutsBuilt();
    renderCoconutsGrid();
    updateCoconutsUI();
  });

  updateCoconutsUI();
}