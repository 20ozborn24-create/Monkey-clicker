let lastQuestsBadgeHidden = null;

const QUEST_KINDS = ["daily", "weekly"];

const QUEST_CFG = {
  daily: {
    stateKey: "dailyQuests",
    pool: DAILY_QUESTS_POOL,
    ms: DAY_MS,
    listId: "questsList",
    timerId: "questTimerDisplay",
    tabBadgeId: "dailyTabBadge",
    refs: [],
    lastSec: -1,
    notice: "📋 Обновились ежедневные задания!",
    emptyProgress: () => ({ clicks: 0, buyBananas: 0, playTime: 0, spendBananas: 0 })
  },
  weekly: {
    stateKey: "weeklyQuests",
    pool: WEEKLY_QUESTS_POOL,
    ms: WEEK_MS,
    listId: "weeklyQuestsList",
    timerId: "weeklyTimerDisplay",
    tabBadgeId: "weeklyTabBadge",
    refs: [],
    lastSec: -1,
    notice: "🗓️ Обновились еженедельные задания!",
    emptyProgress: () => ({ spendBananas: 0, buyBananas: 0, earnDiamonds: 0, dailyCompleted: 0, playTime: 0 })
  }
};

function formatQuestProgressValue(quest, val) {
  if (quest.type === "instant") return "1 / 1";
  const c = Math.min(val, quest.target);
  if (quest.type === "playTime") {
    if (quest.target >= 3600) return `${formatTime(c)} / ${formatTime(quest.target)}`;
    const mmss = (v) => `${String(Math.floor(v / 60)).padStart(2, "0")}:${String(Math.floor(v % 60)).padStart(2, "0")}`;
    return `${mmss(c)} / ${mmss(quest.target)}`;
  }
  return `${Math.floor(c).toLocaleString("ru-RU")} / ${quest.target.toLocaleString("ru-RU")}`;
}

function checkAndRefreshQuests(kind, showNotice = false) {
  const cfg = QUEST_CFG[kind];
  if (!cfg) return;

  const now = Date.now();
  const qState = state[cfg.stateKey];

  const hasValidItems =
    qState &&
    Array.isArray(qState.items) &&
    qState.items.length === 3 &&
    qState.items.every((entry) => cfg.pool.some((q) => q.id === entry.id));

  if (
    !hasValidItems ||
    !Number.isFinite(qState.nextResetAt) ||
    qState.nextResetAt <= 0 ||
    now >= qState.nextResetAt ||
    qState.nextResetAt > now + cfg.ms
  ) {
    const pool = [...cfg.pool];
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    state[cfg.stateKey] = {
      nextResetAt: now + cfg.ms,
      items: pool.slice(0, 3).map((q) => ({ id: q.id, claimed: false })),
      progress: cfg.emptyProgress()
    };
    cfg.lastSec = -1;
    buildQuestsList(kind);
    saveState();
    if (showNotice) showToast(cfg.notice);
  }
}

function buildQuestsList(kind) {
  const cfg = QUEST_CFG[kind];
  const listEl = cfg && els[cfg.listId];
  if (!listEl) return;

  listEl.innerHTML = "";
  cfg.refs.length = 0;
  cfg.lastSec = -1;

  const frag = document.createDocumentFragment();
  const items = state[cfg.stateKey]?.items || [];

  items.forEach((entry, idx) => {
    const q = cfg.pool.find((x) => x.id === entry.id);
    if (!q) return;

    const card = mkEl(
      "div",
      "quest-card",
      `<div class="quest-top"><div class="quest-title-wrap"><span class="quest-emoji">${q.icon}</span><span class="quest-title">${q.title}</span></div><span class="quest-reward-badge">+${q.reward} ${gemHtml()}</span></div>` +
      `<div class="quest-bottom"><div class="quest-progress-col"><div class="quest-progress-bar"><div class="quest-progress-fill"></div></div><div class="quest-progress-text"></div></div>` +
      `<button type="button" class="quest-claim-btn pending"></button></div>`
    );

    const btn = card.querySelector(".quest-claim-btn");
    btn.onclick = () => claimQuestReward(kind, idx);
    frag.appendChild(card);

    cfg.refs.push({
      card,
      fill: card.querySelector(".quest-progress-fill"),
      progText: card.querySelector(".quest-progress-text"),
      btn,
      quest: q,
      lastPct: "",
      lastProg: "",
      lastKey: ""
    });
  });

  listEl.appendChild(frag);
}

function claimQuestReward(kind, idx) {
  const cfg = QUEST_CFG[kind];
  if (!cfg) return;

  const qState = state[cfg.stateKey];
  const entry = qState?.items?.[idx];
  const q = entry && !entry.claimed && cfg.pool.find((x) => x.id === entry.id);
  const val = q ? (q.type === "instant" ? 1 : (qState.progress?.[q.type] || 0)) : 0;
  if (!q || val < q.target) return;

  entry.claimed = true;
  state.diamonds += q.reward;
  state.completedQuestsTotal = (state.completedQuestsTotal || 0) + 1;
  if (state.weeklyQuests?.progress) {
    state.weeklyQuests.progress.earnDiamonds += q.reward;
  }

  if (kind === "daily") {
    state.completedDailyQuests = (state.completedDailyQuests || 0) + 1;
    if (state.weeklyQuests?.progress) {
      state.weeklyQuests.progress.dailyCompleted += 1;
    }
  } else {
    state.completedWeeklyQuests = (state.completedWeeklyQuests || 0) + 1;
  }

  playSfx("claim");
  triggerHaptic(14);
  showToast(`Получено +${q.reward} 💎!`);
  updateUI();
  saveState();
}

function updateQuestsUI() {
  const isOpen = Boolean(els.questsModal && !els.questsModal.classList.contains("hidden"));
  const now = isOpen ? Date.now() : 0;
  let totalReady = 0;

  for (let k = 0; k < QUEST_KINDS.length; k++) {
    const kind = QUEST_KINDS[k];
    const cfg = QUEST_CFG[kind];
    const qState = state[cfg.stateKey];
    if (!qState) continue;

    if (isOpen) {
      if (cfg.refs.length !== qState.items.length) {
        buildQuestsList(kind);
      }
      const secLeft = Math.max(0, Math.floor((qState.nextResetAt - now) / 1000));
      if (cfg.lastSec !== secLeft) {
        cfg.lastSec = secLeft;
        setText(els[cfg.timerId], formatTime(secLeft));
      }
    }

    let ready = 0;
    let claimed = 0;
    const len = cfg.refs.length;

    for (let idx = 0; idx < len; idx++) {
      const r = cfg.refs[idx];
      const entry = qState.items[idx];
      if (!entry) continue;

      const val = r.quest.type === "instant" ? 1 : (qState.progress?.[r.quest.type] || 0);
      const done = val >= r.quest.target;

      if (entry.claimed) claimed++;
      else if (done) ready++;

      if (!isOpen) continue;

      const pct = Math.min(100, (val / r.quest.target) * 100);
      const pctStr = `${pct.toFixed(1)}%`;
      if (r.lastPct !== pctStr) {
        r.lastPct = pctStr;
        r.fill.style.width = pctStr;
      }

      const progStr = formatQuestProgressValue(r.quest, val);
      if (r.lastProg !== progStr) {
        r.lastProg = progStr;
        r.progText.textContent = progStr;
      }

      const key = entry.claimed ? "claimed" : done ? "ready" : "pending";
      if (r.lastKey !== key) {
        r.lastKey = key;
        r.card.classList.toggle("quest-ready", key === "ready");
        r.card.classList.toggle("quest-claimed", key === "claimed");
        if (key === "claimed") syncBtnHtml(r, "Получено ✓", "quest-claim-btn claimed", true);
        else if (key === "ready") syncBtnHtml(r, `Забрать +${r.quest.reward} ${gemHtml()}`, "quest-claim-btn ready", false);
        else syncBtnHtml(r, "В процессе", "quest-claim-btn pending", true);
      }
    }

    totalReady += ready;
    if (isOpen) {
      const badge = els[cfg.tabBadgeId];
      if (badge) {
        setText(badge, ready > 0 ? `Готово: ${ready}!` : `${claimed}/3`);
        badge.classList.toggle("has-ready", ready > 0);
      }
    }
  }

  if (els.questsBtnBadge) {
    const hideBadge = totalReady <= 0;
    if (lastQuestsBadgeHidden !== hideBadge) {
      lastQuestsBadgeHidden = hideBadge;
      els.questsBtnBadge.classList.toggle("hidden", hideBadge);
    }
  }
}