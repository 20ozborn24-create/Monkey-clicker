let levelResetBtnRef = null;
let lastLevelHeaderKey = "";
let lastLevelModalKey = "";

function performLevelReset() {
  if (isMaxAccountLevel()) {
    playSfx("error");
    showToast(`👑 Достигнут максимальный уровень (${MAX_ACCOUNT_LEVEL})!`);
    return false;
  }

  if (!canPerformLevelReset()) {
    const owned = getAbsoluteBananaOwned();
    const req = getResetRequirement();
    playSfx("error");
    showToast(`Нужен Банан Абсолюта: ${owned}/${req}!`);
    return false;
  }

  const newLevel = Math.min(MAX_ACCOUNT_LEVEL, getAccountLevel() + 1);
  const newMult = getAccountLevelMult(newLevel);

  state.accountLevel = newLevel;
  state.bananas = 0;
  state.bananaCounts = new Array(BANANAS_DATA.length).fill(0);
  state.unlockedMonkeys = [0];
  state.activeMonkeyId = 0;
  lastLevelHeaderKey = "";
  lastLevelModalKey = "";

  resetFever();
  markUiDirty();
  updateActiveMonkeyUI();
  saveState();
  updateUI();
  updateLevelUI();

  if (els.bananasList) els.bananasList.scrollTop = 0;
  if (els.monkeysList) els.monkeysList.scrollTop = 0;

  playSfx("fanfare");
  spawnBgDropParticles();
  showToast(`⭐ Уровень ${newLevel}! Доход навсегда увеличен до ×${formatNum(newMult)}!`);
  return true;
}

function openLevelResetConfirm() {
  if (isMaxAccountLevel()) {
    playSfx("error");
    showToast(`👑 Достигнут максимальный уровень (${MAX_ACCOUNT_LEVEL})!`);
    return;
  }

  if (!canPerformLevelReset()) {
    const owned = getAbsoluteBananaOwned();
    const req = getResetRequirement();
    playSfx("error");
    showToast(`Нужен #99 Банан Абсолюта: ${owned}/${req}!`);
    return;
  }

  const nextLevel = Math.min(MAX_ACCOUNT_LEVEL, getAccountLevel() + 1);
  const nextMult = getAccountLevelMult(nextLevel);
  if (els.resetConfirmText) {
    setText(
      els.resetConfirmText,
      `Бананы, сорта бананов и обезьяны будут сброшены. Вы получите Уровень ${nextLevel} и постоянный бонус ×${formatNum(nextMult)} к клику и в секунду!`
    );
  }
  if (els.resetConfirmModal) {
    els.resetConfirmModal.classList.remove("hidden");
  }
}

function updateLevelUI() {
  const level = getAccountLevel();
  const isMax = isMaxAccountLevel(level);
  const owned = getAbsoluteBananaOwned();
  const req = getResetRequirement(level);
  const ready = !isMax && owned >= req;

  const headerKey = `${level}_${ready ? 1 : 0}`;
  if (lastLevelHeaderKey !== headerKey) {
    lastLevelHeaderKey = headerKey;
    if (els.headerLevelBadge) {
      setText(els.headerLevelBadge, `Ур. ${level}`);
      els.headerLevelBadge.classList.toggle("has-level", level > 0);
      els.headerLevelBadge.classList.toggle("is-ready", ready);
    }
    if (els.levelBtnValue) setText(els.levelBtnValue, `Ур.${level}`);
    if (els.levelBtn) els.levelBtn.classList.toggle("is-ready", ready);
    if (els.levelBtnBadge) els.levelBtnBadge.classList.toggle("hidden", !ready);
  }

  if (!els.levelModal || els.levelModal.classList.contains("hidden")) return;

  const modalKey = `${level}_${owned}`;
  if (lastLevelModalKey === modalKey) return;
  lastLevelModalKey = modalKey;

  if (!levelResetBtnRef && els.levelResetBtn) levelResetBtnRef = { btn: els.levelResetBtn };

  const mult = getAccountLevelMult(level);
  const nextLevel = Math.min(MAX_ACCOUNT_LEVEL, level + 1);
  const nextMult = getAccountLevelMult(nextLevel);
  const nextReq = getResetRequirement(nextLevel);

  setText(els.levelCurrentNum, String(level));
  setText(els.levelCurrentMult, `×${formatNum(mult)}`);
  setText(els.levelNowBox, `Ур. ${level} (×${formatNum(mult)})`);
  setText(els.levelNextBox, isMax ? `МАКС (${MAX_ACCOUNT_LEVEL})` : `Ур. ${nextLevel} (×${formatNum(nextMult)})`);
  setText(els.levelReqCount, isMax ? "МАКС" : `${formatNum(owned)} / ${formatNum(req)}`);

  if (els.levelProgFill) {
    const pct = isMax ? 100 : Math.min(100, (owned / Math.max(1, req)) * 100);
    els.levelProgFill.style.width = `${pct.toFixed(1)}%`;
  }

  if (els.levelReqHint) {
    const stepNote = nextLevel >= MAX_ACCOUNT_LEVEL
      ? ""
      : ` (следующий уровень: +${nextReq - req} шт.)`;
    setText(
      els.levelReqHint,
      isMax
        ? `Достигнут максимальный уровень аккаунта (${MAX_ACCOUNT_LEVEL})!`
        : ready
          ? `Готово! Нажми кнопку ниже, чтобы получить Уровень ${nextLevel} (×${formatNum(nextMult)})!`
          : `Осталось купить Бананов Абсолюта: ${formatNum(req - owned)} шт.${stepNote}`
    );
  }

  if (levelResetBtnRef) {
    if (isMax) {
      syncBtn(
        levelResetBtnRef,
        `👑 Максимальный уровень (${MAX_ACCOUNT_LEVEL}/${MAX_ACCOUNT_LEVEL})`,
        "minigame-action-btn disabled",
        true
      );
    } else if (ready) {
      syncBtn(
        levelResetBtnRef,
        `⭐ Сбросить прогресс → Ур. ${nextLevel} (×${formatNum(nextMult)})`,
        "minigame-action-btn cashout",
        false
      );
    } else {
      syncBtn(
        levelResetBtnRef,
        `🔒 Купи Банан Абсолюта (${owned}/${req})`,
        "minigame-action-btn disabled",
        false
      );
    }
  }
}

function initLevelModal() {
  if (els.levelBtn && els.levelModal && els.closeLevelBtn) {
    bindModal(els.levelBtn, els.levelModal, els.closeLevelBtn, () => {
      lastLevelModalKey = "";
      updateLevelUI();
    });
  }
  if (els.levelResetBtn) {
    els.levelResetBtn.onclick = openLevelResetConfirm;
  }
  updateLevelUI();
}