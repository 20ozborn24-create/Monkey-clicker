const achDomRefs = [];
let achEmptyEl = null;
let playTimeAchRef = null;
let achFilter = "all";
let lastAchFilter = "all";
let achListBuilt = false;
let achHeaderSynced = false;
let achListDirty = true;
let lastAchBadgeHidden = null;
let lastNotifiedClickAchStage = -1;
let lastNotifiedPlayTimeAchStage = -1;

const CLICK_ACH_DEF = ACHIEVEMENTS_DATA.find((a) => a.kind === "clicks") || null;
const PLAYTIME_ACH_DEF = ACHIEVEMENTS_DATA.find((a) => a.kind === "playTime") || null;

function onClickAchProgress() {
  if (!CLICK_ACH_DEF) return;
  const st = (state.achievementStages && state.achievementStages[CLICK_ACH_DEF.id]) || 0;
  if (st >= CLICK_ACH_DEF.stages.length) return;
  if (lastNotifiedClickAchStage !== st && (state.totalClicks || 0) >= CLICK_ACH_DEF.stages[st].target) {
    lastNotifiedClickAchStage = st;
    markUiDirty("ach");
  }
}

function updatePlayTimeAchRowIfOpen() {
  if (!playTimeAchRef || !els.achievementsModal || els.achievementsModal.classList.contains("hidden") || !achListBuilt) return;
  if (playTimeAchRef.lastShow === false) return;

  const stageIdx = (state.achievementStages && state.achievementStages[playTimeAchRef.ach.id]) || 0;
  if (stageIdx >= playTimeAchRef.ach.stages.length) return;

  const stage = playTimeAchRef.ach.stages[stageIdx];
  const val = Math.floor(state.playTimeSeconds || 0);
  const done = val >= stage.target;
  const pct = `${Math.min(100, (val / stage.target) * 100).toFixed(1)}%`;
  const shownVal = Math.min(val, stage.target);
  const progStr = `${formatDurationLong(shownVal)} / ${formatDurationLong(stage.target)}`;

  if (playTimeAchRef.lastPct !== pct) {
    playTimeAchRef.lastPct = pct;
    playTimeAchRef.fill.style.width = pct;
  }
  if (playTimeAchRef.lastProg !== progStr) {
    playTimeAchRef.lastProg = progStr;
    playTimeAchRef.progText.textContent = progStr;
  }
  if (playTimeAchRef.lastDone !== done) {
    playTimeAchRef.lastDone = done;
    playTimeAchRef.card.classList.toggle("ach-ready", done);
  }
  if (done) syncBtnHtml(playTimeAchRef, `Забрать +${stage.reward} ${gemHtml()}`, "ach-claim-btn ready", false);
  else syncBtnHtml(playTimeAchRef, `+${stage.reward} ${gemHtml()}`, "ach-claim-btn pending", true);
}

function onPlayTimeAchProgress() {
  if (!PLAYTIME_ACH_DEF) return;
  const st = (state.achievementStages && state.achievementStages[PLAYTIME_ACH_DEF.id]) || 0;
  if (st < PLAYTIME_ACH_DEF.stages.length && lastNotifiedPlayTimeAchStage !== st && (state.playTimeSeconds || 0) >= PLAYTIME_ACH_DEF.stages[st].target) {
    lastNotifiedPlayTimeAchStage = st;
    markUiDirty("ach");
    return;
  }
  updatePlayTimeAchRowIfOpen();
}

function getAchProgress(ach) {
  if (ach.kind === "clicks") return state.totalClicks || 0;
  if (ach.kind === "monkeys") return state.unlockedMonkeys.length;
  if (ach.kind === "accountLevel") return typeof getAccountLevel === "function" ? getAccountLevel() : (state.accountLevel || 0);
  if (ach.kind === "collections") {
    const turnIns = state.collections?.turnIns;
    if (!turnIns) return 0;
    let total = 0;
    for (const k in turnIns) total += Number(turnIns[k]) || 0;
    return total;
  }
  if (ach.kind === "goldVip") return state.goldVipPurchases || 0;
  if (ach.kind === "platinumVip") return state.platinumVipPurchases || 0;
  if (ach.kind === "playTime") return Math.floor(state.playTimeSeconds || 0);
  if (ach.kind === "bananaCount") return state.bananaCounts[ach.bananaId] || 0;
  return 0;
}

function buildAchievementsList() {
  if (!els.achievementsList) return;
  els.achievementsList.innerHTML = "";
  achDomRefs.length = 0;
  playTimeAchRef = null;

  achEmptyEl = mkEl("div", "ach-empty-state hidden");
  els.achievementsList.appendChild(achEmptyEl);

  const starSvg = useSvg("ico-star-off");
  const frag = document.createDocumentFragment();

  ACHIEVEMENTS_DATA.forEach((ach) => {
    const totalStars = ach.stages.length;
    const starsHtml = `<span class="ach-star">${starSvg}</span>`.repeat(totalStars);

    const achIconHtml = ach.kind === "clicks"
      ? useSvg("ico-tap")
      : ach.iconId
        ? useSvg(ach.iconId)
        : ach.kind === "monkeys"
          ? useSvg("ico-tab-monkeys")
          : ach.kind === "bananaCount" && BANANAS_DATA[ach.bananaId]
            ? createBananaSvg(BANANAS_DATA[ach.bananaId], "ach")
            : ach.icon;

    const card = mkEl(
      "div",
      "ach-card",
      `<div class="ach-top-row">` +
        `<div class="ach-icon">${achIconHtml}</div>` +
        `<div class="ach-info">` +
          `<div class="ach-title-row"><span class="ach-title">${ach.title}</span><span class="ach-stars-count">★ 0/${totalStars}</span></div>` +
          `<div class="ach-desc"></div>` +
          `<div class="ach-progress-bar"><div class="ach-progress-fill"></div></div>` +
          `<div class="ach-progress-text"></div>` +
        `</div>` +
        `<button type="button" class="ach-claim-btn pending"></button>` +
      `</div>` +
      `<div class="ach-stars-row" aria-label="Прогресс звёзд">${starsHtml}</div>`
    );

    const btn = card.querySelector(".ach-claim-btn");
    btn.onclick = () => claimAchievement(ach.id);
    frag.appendChild(card);

    const ref = {
      ach,
      card,
      starsCount: card.querySelector(".ach-stars-count"),
      descEl: card.querySelector(".ach-desc"),
      fill: card.querySelector(".ach-progress-fill"),
      progText: card.querySelector(".ach-progress-text"),
      btn,
      stars: Array.from(card.querySelectorAll(".ach-star")),
      starUses: Array.from(card.querySelectorAll(".ach-star use")),
      lastShow: null,
      lastStageIdx: -1,
      lastDesc: "",
      lastPct: "",
      lastProg: "",
      lastDone: null
    };
    achDomRefs.push(ref);
    if (ach.kind === "playTime") playTimeAchRef = ref;
  });

  els.achievementsList.appendChild(frag);
  achListBuilt = true;
  achListDirty = true;

  if (state.lowPerfMode && typeof syncSvgAnimationsPause === "function") {
    syncSvgAnimationsPause();
  }
}

function ensureAchievementsBuilt() {
  if (!achListBuilt) buildAchievementsList();
}

function claimAchievement(achId) {
  const ach = ACHIEVEMENTS_DATA.find((a) => a.id === achId);
  if (!ach) return;
  if (!state.achievementStages) state.achievementStages = {};

  const stageIdx = state.achievementStages[ach.id] || 0;
  if (stageIdx >= ach.stages.length) return;

  const stage = ach.stages[stageIdx];
  if (getAchProgress(ach) < stage.target) return;

  const totalStars = ach.stages.length;
  state.achievementStages[ach.id] = stageIdx + 1;
  if (ach.kind === "clicks") lastNotifiedClickAchStage = -1;
  if (ach.kind === "playTime") lastNotifiedPlayTimeAchStage = -1;

  state.diamonds += stage.reward;
  if (state.weeklyQuests?.progress) {
    state.weeklyQuests.progress.earnDiamonds += stage.reward;
  }

  markUiDirty("ach");
  achListDirty = true;
  playSfx("claim");
  triggerHaptic(14);
  showToast(`🏆 +${stage.reward} 💎! Звезда ${stageIdx + 1}/${totalStars}`);
  saveState();
  updateUI();
}

function checkAchievements() {
  const isOpen = Boolean(els.achievementsModal && !els.achievementsModal.classList.contains("hidden"));
  if (!uiDirty.ach && (!isOpen || achHeaderSynced)) return;

  if (uiDirty.ach) {
    achListDirty = true;
    achHeaderSynced = false;
  }
  uiDirty.ach = false;
  if (!state.achievementStages) state.achievementStages = {};

  const total = ACHIEVEMENTS_DATA.length;
  let opened = 0;
  let readyCount = 0;

  for (let i = 0; i < total; i++) {
    const a = ACHIEVEMENTS_DATA[i];
    const st = state.achievementStages[a.id] || 0;
    if (st > 0) opened++;
    if (st < a.stages.length && getAchProgress(a) >= a.stages[st].target) {
      readyCount++;
    }
  }

  if (els.achBtnBadge) {
    const hideBadge = readyCount <= 0;
    if (lastAchBadgeHidden !== hideBadge) {
      lastAchBadgeHidden = hideBadge;
      els.achBtnBadge.classList.toggle("hidden", hideBadge);
    }
  }

  if (!isOpen) return;

  achHeaderSynced = true;
  setText(els.achModalCount, `${opened}/${total}`);
  setText(els.achTabAll, `Все (${total})`);
  setText(els.achTabUnlocked, `Открытые (${opened})`);
  setText(els.achTabLocked, `Закрытые (${total - opened})`);
}

function updateAchievementsUI() {
  if (!els.achievementsModal || els.achievementsModal.classList.contains("hidden")) return;
  ensureAchievementsBuilt();
  if (!achListDirty && lastAchFilter === achFilter) return;

  if (lastAchFilter !== achFilter && els.achievementsList?.parentElement) {
    els.achievementsList.parentElement.scrollTop = 0;
  }
  achListDirty = false;
  lastAchFilter = achFilter;
  if (!state.achievementStages) state.achievementStages = {};

  let visibleCount = 0;

  for (let i = 0; i < achDomRefs.length; i++) {
    const r = achDomRefs[i];
    const stageIdx = state.achievementStages[r.ach.id] || 0;
    const totalStars = r.ach.stages.length;
    const hasStars = stageIdx > 0;
    const show =
      achFilter === "all" ||
      (achFilter === "unlocked" && hasStars) ||
      (achFilter === "locked" && !hasStars);

    if (r.lastShow !== show) {
      r.lastShow = show;
      r.card.classList.toggle("hidden", !show);
    }
    if (!show) continue;
    visibleCount++;

    if (r.lastStageIdx !== stageIdx) {
      r.lastStageIdx = stageIdx;
      r.card.classList.toggle("unlocked", hasStars);
      setText(r.starsCount, `★ ${stageIdx}/${totalStars}`);
      for (let s = 0; s < r.stars.length; s++) {
        const lit = s < stageIdx;
        r.stars[s].classList.toggle("lit", lit);
        r.starUses[s]?.setAttribute("href", lit ? "#ico-star-lit" : "#ico-star-off");
      }
    }

    if (stageIdx >= r.ach.stages.length) {
      if (r.lastDone !== false) {
        r.lastDone = false;
        r.card.classList.remove("ach-ready");
      }
      if (r.lastDesc !== "done") {
        r.lastDesc = "done";
        r.descEl.textContent = "Все этапы пройдены!";
        r.fill.style.width = "100%";
        r.progText.textContent = "Максимум!";
      }
      syncBtnHtml(r, "Пройдено ✓", "ach-claim-btn claimed", true);
      continue;
    }

    const stage = r.ach.stages[stageIdx];
    const val = getAchProgress(r.ach);
    const done = val >= stage.target;
    const pct = `${Math.min(100, (val / stage.target) * 100).toFixed(1)}%`;
    const shownVal = Math.min(Math.floor(val), stage.target);
    const progStr = r.ach.kind === "playTime"
      ? `${formatDurationLong(shownVal)} / ${formatDurationLong(stage.target)}`
      : `${shownVal.toLocaleString("ru-RU")} / ${stage.target.toLocaleString("ru-RU")}`;

    if (r.lastDesc !== stage.desc) { r.lastDesc = stage.desc; r.descEl.textContent = stage.desc; }
    if (r.lastPct !== pct) { r.lastPct = pct; r.fill.style.width = pct; }
    if (r.lastProg !== progStr) { r.lastProg = progStr; r.progText.textContent = progStr; }

    if (r.lastDone !== done) {
      r.lastDone = done;
      r.card.classList.toggle("ach-ready", done);
    }
    if (done) syncBtnHtml(r, `Забрать +${stage.reward} ${gemHtml()}`, "ach-claim-btn ready", false);
    else syncBtnHtml(r, `+${stage.reward} ${gemHtml()}`, "ach-claim-btn pending", true);
  }

  if (achEmptyEl) {
    const showEmpty = visibleCount === 0;
    achEmptyEl.classList.toggle("hidden", !showEmpty);
    if (showEmpty) {
      setText(
        achEmptyEl,
        achFilter === "unlocked"
          ? "🏆 Пока нет открытых достижений — кликай по обезьяне, покупай бананы и забирай награды!"
          : "👑 Поздравляем! Все достижения уже открыты!"
      );
    }
  }
}