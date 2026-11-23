const DAILY_LOGIN_REWARDS = [25, 50, 75, 100, 125, 150, 200];

let dailyCardsBuilt = false;
const dailyCardRefs = [];
let dailyClaimBtnRef = null;
let lastDailyBadgeHidden = null;
let lastDailyModalKey = "";

let cachedDayToday = "";
let cachedDayYesterday = "";
let cachedNextMidnight = 0;

function formatDayKey(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function refreshDayKeyCache() {
  const now = Date.now();
  if (cachedNextMidnight && now < cachedNextMidnight) return;
  const d = new Date(now);
  d.setHours(0, 0, 0, 0);
  cachedDayToday = formatDayKey(d);

  const yest = new Date(d.getTime());
  yest.setDate(yest.getDate() - 1);
  cachedDayYesterday = formatDayKey(yest);

  const next = new Date(d.getTime());
  next.setDate(next.getDate() + 1);
  cachedNextMidnight = next.getTime();
}

function getLocalDayKey(offsetDays = 0) {
  refreshDayKeyCache();
  if (offsetDays === 0) return cachedDayToday;
  if (offsetDays === -1) return cachedDayYesterday;
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + offsetDays);
  return formatDayKey(d);
}

function ensureDailyLoginState() {
  if (!state.dailyLogin || typeof state.dailyLogin !== "object") {
    state.dailyLogin = { streak: 0, lastClaimDate: "" };
  }
  state.dailyLogin.streak = Math.max(0, Math.min(7, Math.floor(nonNegNum(state.dailyLogin.streak))));
  if (typeof state.dailyLogin.lastClaimDate !== "string") {
    state.dailyLogin.lastClaimDate = "";
  }
}

function getDailyLoginStatus() {
  ensureDailyLoginState();
  const today = getLocalDayKey(0);
  const yesterday = getLocalDayKey(-1);
  const last = state.dailyLogin.lastClaimDate;
  const streak = state.dailyLogin.streak;

  if (last === today) {
    return {
      canClaim: false,
      claimedCount: streak,
      nextIdx: streak % 7,
      today
    };
  }

  if (last === yesterday && streak > 0 && streak < 7) {
    return {
      canClaim: true,
      claimedCount: streak,
      nextIdx: streak,
      today
    };
  }

  return {
    canClaim: true,
    claimedCount: 0,
    nextIdx: 0,
    today
  };
}

function buildDailyBonusGrid() {
  if (!els.dailyDaysGrid || dailyCardsBuilt) return;
  dailyCardsBuilt = true;
  els.dailyDaysGrid.innerHTML = "";
  dailyCardRefs.length = 0;

  const frag = document.createDocumentFragment();
  DAILY_LOGIN_REWARDS.forEach((reward, idx) => {
    const isBig = idx === 6;
    const card = mkEl(
      "div",
      `daily-day-card${isBig ? " is-day7" : ""}`,
      `<span class="daily-day-num">День ${idx + 1}</span>` +
      `<div class="daily-day-reward">${gemHtml()} <strong>+${reward}</strong></div>` +
      `<span class="daily-day-state"></span>`
    );
    frag.appendChild(card);
    dailyCardRefs.push({
      idx,
      card,
      stateEl: card.querySelector(".daily-day-state")
    });
  });
  els.dailyDaysGrid.appendChild(frag);
}

function claimDailyBonus() {
  const st = getDailyLoginStatus();
  if (!st.canClaim) {
    playSfx("error");
    return showToast("Сегодня награда уже получена — приходи завтра!");
  }

  const reward = DAILY_LOGIN_REWARDS[st.nextIdx];
  state.diamonds += reward;
  if (state.weeklyQuests?.progress) {
    state.weeklyQuests.progress.earnDiamonds += reward;
  }
  state.dailyLogin.streak = st.nextIdx + 1;
  state.dailyLogin.lastClaimDate = st.today;

  playSfx("fanfare");
  triggerHaptic([18, 30, 22]);
  spawnBgDropParticles();
  showToast(`📅 День ${st.nextIdx + 1}: получено +${reward} 💎!`);

  saveState();
  updateUI();
  updateDailyBonusUI();
}

function updateDailyBonusUI() {
  const st = getDailyLoginStatus();
  const hideBadge = !st.canClaim;

  if (lastDailyBadgeHidden !== hideBadge) {
    lastDailyBadgeHidden = hideBadge;
    if (els.dailyBonusBadge) els.dailyBonusBadge.classList.toggle("hidden", hideBadge);
    if (els.dailyBonusBtn) els.dailyBonusBtn.classList.toggle("is-ready", st.canClaim);
  }

  if (!els.dailyBonusModal || els.dailyBonusModal.classList.contains("hidden")) return;

  const modalKey = `${st.canClaim ? 1 : 0}_${st.claimedCount}_${st.nextIdx}`;
  if (dailyCardsBuilt && lastDailyModalKey === modalKey) return;
  lastDailyModalKey = modalKey;

  buildDailyBonusGrid();
  if (!dailyClaimBtnRef && els.dailyClaimBtn) dailyClaimBtnRef = { btn: els.dailyClaimBtn };

  if (els.dailyStreakHint) {
    setText(
      els.dailyStreakHint,
      st.canClaim
        ? `Доступна награда за День ${st.nextIdx + 1} (+${DAILY_LOGIN_REWARDS[st.nextIdx]} 💎)!`
        : `Серия: ${st.claimedCount}/7 дн. • Возвращайся завтра за новой наградой!`
    );
  }

  for (let i = 0; i < dailyCardRefs.length; i++) {
    const r = dailyCardRefs[i];
    const isClaimed = r.idx < st.claimedCount;
    const isToday = st.canClaim && r.idx === st.nextIdx;
    r.card.classList.toggle("is-claimed", isClaimed);
    r.card.classList.toggle("is-today", isToday);
    r.card.classList.toggle("is-locked", !isClaimed && !isToday);
    if (r.stateEl) {
      setText(r.stateEl, isClaimed ? "Получено ✓" : isToday ? "Сегодня!" : "Скоро");
    }
  }

  if (dailyClaimBtnRef) {
    if (st.canClaim) {
      const r = DAILY_LOGIN_REWARDS[st.nextIdx];
      syncBtnHtml(
        dailyClaimBtnRef,
        `🎁 Забрать День ${st.nextIdx + 1}: +${r} ${gemHtml()}`,
        "minigame-action-btn ready",
        false
      );
    } else {
      syncBtn(
        dailyClaimBtnRef,
        "✓ Награда на сегодня получена",
        "minigame-action-btn disabled",
        true
      );
    }
  }
}

function resetDailyLoginTransient() {
  lastDailyBadgeHidden = null;
  lastDailyModalKey = "";
  updateDailyBonusUI();
}

function initDailyLogin() {
  ensureDailyLoginState();

  if (els.dailyBonusBtn && els.dailyBonusModal && els.closeDailyBonusBtn) {
    bindModal(els.dailyBonusBtn, els.dailyBonusModal, els.closeDailyBonusBtn, () => {
      lastDailyModalKey = "";
      updateDailyBonusUI();
    });
  }
  if (els.dailyClaimBtn) {
    els.dailyClaimBtn.onclick = claimDailyBonus;
  }

  updateDailyBonusUI();
}