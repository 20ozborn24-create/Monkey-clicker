let gameStarted = false;
let isTabHidden = Boolean(document.hidden);
let lastTickTime = performance.now();
let tapAnimTimer = null;
let lastTapAt = 0;
let idleAnimTimer = null;
let secondAccum = 0;
let autosaveAccum = 0;
let tapUiSyncTimer = null;

let cachedTapBtnRect = null;
let floatersLayerEl = null;
const floaterPool = [];
const ripplePool = [];
let floaterPoolIdx = 0;
let ripplePoolIdx = 0;

let pendingOfflineDisplayEarned = 0;
let pendingOfflineDisplaySeconds = 0;
let dailyBonusAutoShownDate = "";

let lastHeaderBal = "";
let lastHeaderDiam = "";
let lastHeaderBpc = "";
let lastHeaderBps = "";

function invalidateTapBtnRect() {
  cachedTapBtnRect = null;
}

function getTapBtnRect() {
  if (!cachedTapBtnRect && els.monkeyTapBtn) {
    cachedTapBtnRect = els.monkeyTapBtn.getBoundingClientRect();
  }
  return cachedTapBtnRect;
}

function isModalOpen(el) {
  return Boolean(el && !el.classList.contains("hidden"));
}

function syncSvgAnimationsPause() {
  const shouldPause = isTabHidden || Boolean(state.lowPerfMode);
  const sprite = document.getElementById("svgSprite");
  if (!sprite) return;
  try {
    if (shouldPause) sprite.pauseAnimations?.();
    else sprite.unpauseAnimations?.();
  } catch (_) {}
}

function syncVipFlags() {
  lastVipVisualKey = "";
  lastGoldModalKey = "";
  lastPlatModalKey = "";
  updatePremiumVisuals();
  updatePremiumShopUI();
  updatePlatinumShopUI();
}

function tryAutoShowDailyBonus() {
  const st = getDailyLoginStatus();
  if (!st.canClaim || !els.dailyBonusModal || dailyBonusAutoShownDate === st.today) return false;
  dailyBonusAutoShownDate = st.today;
  updateDailyBonusUI();
  els.dailyBonusModal.classList.remove("hidden");
  return true;
}

function updateHeaderStatsUI() {
  const balStr = formatNum(Math.floor(state.bananas));
  const diamStr = formatNum(state.diamonds);
  const bpcStr = formatNum(getBpc() * getFeverMultiplier() * getGoldenClickMult());
  const bpsStr = formatNum(getBps() * getFeverBpsMultiplier() * getGoldenBpsMult());

  if (lastHeaderBal !== balStr) { lastHeaderBal = balStr; setText(els.bananaCount, balStr); }
  if (lastHeaderDiam !== diamStr) { lastHeaderDiam = diamStr; setText(els.diamondCount, diamStr); }
  if (lastHeaderBpc !== bpcStr) { lastHeaderBpc = bpcStr; setText(els.bpcDisplay, bpcStr); }
  if (lastHeaderBps !== bpsStr) { lastHeaderBps = bpsStr; setText(els.bpsDisplay, bpsStr); }
}

function flushTapUiSync() {
  tapUiSyncTimer = null;
  updateShopUI();
  updateQuestsUI();
  if (uiDirty.ach) checkAchievements();
}

function scheduleTapUiSync() {
  if (tapUiSyncTimer) return;
  tapUiSyncTimer = setTimeout(flushTapUiSync, 120);
}

function updateUI(full = true) {
  updateHeaderStatsUI();
  updateShopUI();
  if (uiDirty.ach || isModalOpen(els.achievementsModal)) checkAchievements();
  if (isModalOpen(els.achievementsModal)) updateAchievementsUI();
  if (uiDirty.col || isModalOpen(els.collectionsModal)) updateCollectionsUI();

  if (!full) return;

  updatePremiumVisuals();
  updateLevelUI();
  updateQuestsUI();
  updateWheelUI();
  updateCoconutsUI();
  updateDailyBonusUI();
  updateGoldenBoostsUI();

  if (isModalOpen(els.customModal)) updateCustomizationUI();
  if (isModalOpen(els.diamondShopModal)) updateDiamondShopUI();
  if (isModalOpen(els.premiumModal)) updatePremiumShopUI();
  if (isModalOpen(els.platinumModal)) updatePlatinumShopUI();
}

function showOfflineModal() {
  if (!els.offlineModal || pendingOfflineDisplayEarned <= 0) return;
  setText(els.offlineTimeText, `Обезьянки трудились ${formatDurationLong(pendingOfflineDisplaySeconds)} (макс. ${getOfflineMaxHours()} ч):`);
  setText(els.offlineEarnedValue, formatNum(pendingOfflineDisplayEarned));
  els.offlineModal.classList.remove("hidden");
}

function applyOfflineIncome(allowShortSilent = false) {
  const now = Date.now();
  const savedAt = Number(state.lastSaveTime);
  if (!Number.isFinite(savedAt) || savedAt <= 0 || savedAt > now) {
    state.lastSaveTime = now;
    return;
  }

  const elapsedSec = (now - savedAt) / 1000;
  if (elapsedSec < 1) return;
  if (elapsedSec < 15 && !allowShortSilent) return;

  const maxSec = getOfflineMaxHours() * 3600;
  const usedSec = Math.min(elapsedSec, maxSec);
  const bps = getBps();

  state.lastSaveTime = now;
  if (bps <= 0 || usedSec <= 0) return;

  const earned = Math.floor(clampFinite(bps * usedSec));
  if (earned <= 0) return;

  addBananas(earned);
  markUiDirty("shop");

  if (elapsedSec >= 15) {
    pendingOfflineDisplayEarned = earned;
    pendingOfflineDisplaySeconds = usedSec;
    saveState();
    if (gameStarted) showOfflineModal();
  } else {
    saveState();
  }
}

function initTapEffectPool() {
  if (!floatersLayerEl) {
    floatersLayerEl = mkEl("div", "floaters-layer");
    document.body.appendChild(floatersLayerEl);
    for (let i = 0; i < 8; i++) {
      const el = mkEl("span", "floating-plus");
      floatersLayerEl.appendChild(el);
      floaterPool.push({ el, toggle: false });
    }
  }
  if (els.monkeyTapBtn && !ripplePool.length) {
    for (let i = 0; i < 3; i++) {
      const r = mkEl("span", "tap-ripple");
      els.monkeyTapBtn.appendChild(r);
      ripplePool.push({ el: r, toggle: false });
    }
  }
}

function spawnTapEffects(clientX, clientY, gain) {
  if (!els.monkeyTapBtn) return;

  els.monkeyTapBtn.classList.add("tapped", "is-hyped");
  clearTimeout(tapAnimTimer);
  tapAnimTimer = setTimeout(() => {
    els.monkeyTapBtn.classList.remove("tapped");
    if (performance.now() - lastTapAt > 350) els.monkeyTapBtn.classList.remove("is-hyped");
  }, 105);

  if (state.lowPerfMode) return;

  let px = clientX;
  let py = clientY;
  if (!Number.isFinite(px) || !Number.isFinite(py) || (px === 0 && py === 0)) {
    const rect = getTapBtnRect();
    px = rect ? rect.left + rect.width / 2 : 180;
    py = rect ? rect.top + rect.height / 2 : 240;
  }

  if (floaterPool.length) {
    const slot = floaterPool[floaterPoolIdx];
    floaterPoolIdx = (floaterPoolIdx + 1) % floaterPool.length;
    slot.toggle = !slot.toggle;
    const fEl = slot.el;
    fEl.textContent = `+${formatNum(gain)}`;
    fEl.style.left = `${(px + (Math.random() - 0.5) * 24).toFixed(0)}px`;
    fEl.style.top = `${(py - 14).toFixed(0)}px`;
    fEl.className = `floating-plus${feverActive ? " fever-plus" : ""} ${slot.toggle ? "anim-a" : "anim-b"}`;
  }

  if (ripplePool.length) {
    const rSlot = ripplePool[ripplePoolIdx];
    ripplePoolIdx = (ripplePoolIdx + 1) % ripplePool.length;
    rSlot.toggle = !rSlot.toggle;
    rSlot.el.className = `tap-ripple ${rSlot.toggle ? "anim-a" : "anim-b"}`;
  }
}

function onTap(clientX, clientY) {
  if (!gameStarted) return;
  if (document.querySelector(".modal-overlay:not(.hidden)")) return;

  lastTapAt = performance.now();
  const gain = getBpc() * getFeverMultiplier() * getGoldenClickMult();
  addBananas(gain);
  state.totalClicks += 1;
  if (state.dailyQuests?.progress) state.dailyQuests.progress.clicks += 1;

  onFeverTap();
  if (typeof onClickAchProgress === "function") onClickAchProgress();
  onCollectionTap();

  triggerHaptic(8);
  playTone(feverActive ? 420 + (state.totalClicks % 5) * 35 : 310 + (state.totalClicks % 4) * 28, 0.045, "triangle", 0.04);
  spawnTapEffects(clientX, clientY, gain);
  updateHeaderStatsUI();
  scheduleTapUiSync();
}

function triggerIdleMonkeyAnim() {
  if (state.lowPerfMode || !gameStarted || isTabHidden || !els.monkeyEmoji) return;
  if (performance.now() - lastTapAt < 2500) return;

  const classes = ["idle-look", "idle-hop", "idle-wiggle", "idle-breath"];
  const cls = classes[Math.floor(Math.random() * classes.length)];
  els.monkeyEmoji.classList.remove(...classes);
  void els.monkeyEmoji.offsetWidth;
  els.monkeyEmoji.classList.add(cls);
  clearTimeout(idleAnimTimer);
  idleAnimTimer = setTimeout(() => els.monkeyEmoji?.classList.remove(cls), 1300);
}

function applySettingsToUI() {
  const isLowPerf = Boolean(state.lowPerfMode);
  document.body.classList.toggle("low-perf", isLowPerf);
  els.appShell?.classList.toggle("low-perf", isLowPerf);
  syncSvgAnimationsPause();

  [
    [els.settingSoundToggle, state.soundEnabled !== false],
    [els.settingHapticToggle, state.hapticEnabled !== false],
    [els.settingLowPerfToggle, isLowPerf]
  ].forEach(([btn, on]) => {
    if (!btn) return;
    setText(btn, on ? "ВКЛ" : "ВЫКЛ");
    btn.classList.toggle("is-on", on);
  });
}

function syncAllAfterStateReplace() {
  lastHeaderBal = lastHeaderDiam = lastHeaderBpc = lastHeaderBps = "";
  dailyBonusAutoShownDate = "";
  invalidateTapBtnRect();

  currentAppliedBgId = -1;
  selectedSkinMonkeyId = null;
  skinsDetailKey = "";
  lastVipVisualKey = lastGoldModalKey = lastPlatModalKey = "";
  lastDshopKey = "";
  lastResetBtnKey = lastLevelHeaderKey = lastLevelModalKey = "";
  lastShopKey = lastShopModeKey = lastShopJumpKey = "";
  jumpPrevAffCost1 = 0;
  jumpNextAffCost1 = Infinity;
  cachedSpeciesCount = -1;
  lastQuestsBadgeHidden = null;
  lastAchBadgeHidden = null;
  lastNotifiedClickAchStage = lastNotifiedPlayTimeAchStage = -1;
  lastColBadgeHidden = null;
  colListSynced = false;

  markUiDirty();
  ensureCollectionsState();
  checkAndRefreshQuests("daily", false);
  checkAndRefreshQuests("weekly", false);
  buildQuestsList("daily");
  buildQuestsList("weekly");

  resetFever();
  resetWheelTransient();
  resetCoconutsTransient();
  resetDailyLoginTransient();
  resetGoldenBananaTransient();
  applySettingsToUI();
  updateActiveMonkeyUI();
  updateProfileUI(true);
  updateCustomizationUI();
  updateLevelUI();
  updateUI(true);
}

function gameTick() {
  if (!gameStarted || document.hidden || isTabHidden) return;

  const nowPerf = performance.now();
  const rawDt = Math.max(0, (nowPerf - lastTickTime) / 1000);
  lastTickTime = nowPerf;
  if (rawDt >= 15) {
    invalidateTapBtnRect();
    updateFever(rawDt);
    updateGoldenBoostsUI();
    applyOfflineIncome(true);
    updateUI(true);
    return;
  }
  const dt = Math.min(5, rawDt);
  if (dt <= 0) return;

  const bps = getBps() * getFeverBpsMultiplier() * getGoldenBpsMult();
  if (bps > 0) addBananas(bps * dt);

  state.playTimeSeconds += dt;
  if (state.dailyQuests?.progress) state.dailyQuests.progress.playTime += dt;
  if (state.weeklyQuests?.progress) state.weeklyQuests.progress.playTime += dt;

  updateFever(dt);
  tickGoldenBanana(dt);

  if (els.monkeyTapBtn?.classList.contains("is-hyped") && nowPerf - lastTapAt > 350) {
    els.monkeyTapBtn.classList.remove("is-hyped");
  }

  let secondPassed = false;
  secondAccum += dt;
  if (secondAccum >= 1) {
    secondAccum -= Math.floor(secondAccum);
    secondPassed = true;
    invalidateTapBtnRect();
    checkAndRefreshQuests("daily", gameStarted);
    checkAndRefreshQuests("weekly", gameStarted);
    if (typeof onPlayTimeAchProgress === "function") onPlayTimeAchProgress();
  }

  autosaveAccum += dt;
  if (autosaveAccum >= 10) {
    autosaveAccum = 0;
    saveState();
  }

  updateUI(secondPassed);
}

function flushPendingWheelAfterModals() {
  if (gameStarted && state.pendingWheelRewardId && typeof claimPendingWheelReward === "function") {
    setTimeout(claimPendingWheelReward, 220);
  }
}

function initModalsAndControls() {
  bindTabs([
    { key: "bananas", btn: "tabBananas", panes: ["bananasList", "bananaControls"] },
    { key: "monkeys", btn: "tabMonkeys", panes: ["monkeysList", "monkeyControls"] }
  ], () => {
    markUiDirty("shop");
    updateShopUI();
  });

  MULTI_BTNS.forEach(([mult, btnId]) => {
    if (els[btnId]) els[btnId].onclick = () => setBuyMultiplier(mult);
  });

  bindModal(els.questsMenuBtn, els.questsModal, els.closeQuestsBtn, updateQuestsUI);
  bindTabs([
    { key: "daily", btn: "questTabDaily", panes: ["dailyQuestsPane"] },
    { key: "weekly", btn: "questTabWeekly", panes: ["weeklyQuestsPane"] }
  ], updateQuestsUI);

  bindModal(els.achievementsMenuBtn, els.achievementsModal, els.closeAchievementsBtn, () => {
    markUiDirty("ach");
    checkAchievements();
    updateAchievementsUI();
  });
  bindTabs([
    { key: "all", btn: "achTabAll" },
    { key: "unlocked", btn: "achTabUnlocked" },
    { key: "locked", btn: "achTabLocked" }
  ], (key) => {
    achFilter = key;
    updateAchievementsUI();
  });

  bindModal(els.guideBtn, els.guideModal, els.closeGuideBtn);
  bindTabs([
    { key: "basics", btn: "guideTabBasics", panes: ["guidePaneBasics"] },
    { key: "games", btn: "guideTabGames", panes: ["guidePaneGames"] },
    { key: "shop", btn: "guideTabShop", panes: ["guidePaneShop"] }
  ]);

  bindModal(els.premiumMenuBtn, els.premiumModal, els.closePremiumBtn, updatePremiumShopUI);
  bindModal(els.platinumMenuBtn, els.platinumModal, els.closePlatinumBtn, updatePlatinumShopUI);
  bindModal(els.diamondShopBtn, els.diamondShopModal, els.closeDiamondShopBtn, updateDiamondShopUI);
  bindModal(els.settingsBtn, els.settingsModal, els.closeSettingsBtn, applySettingsToUI);

  if (els.settingSoundToggle) {
    els.settingSoundToggle.onclick = () => {
      state.soundEnabled = !state.soundEnabled;
      applySettingsToUI();
      saveState();
      if (state.soundEnabled) playSfx("select");
      showToast(state.soundEnabled ? "🔊 Звук включён" : "🔇 Звук выключен");
    };
  }

  if (els.settingHapticToggle) {
    els.settingHapticToggle.onclick = () => {
      state.hapticEnabled = !state.hapticEnabled;
      applySettingsToUI();
      saveState();
      playSfx("select");
      if (state.hapticEnabled) triggerHaptic(18);
      showToast(state.hapticEnabled ? "📳 Виброотклик включён" : "📴 Виброотклик выключен");
    };
  }

  if (els.settingLowPerfToggle) {
    els.settingLowPerfToggle.onclick = () => {
      state.lowPerfMode = !state.lowPerfMode;
      applySettingsToUI();
      saveState();
      playSfx("select");
      showToast(state.lowPerfMode ? "⚡ Анимации отключены" : "✨ Анимации включены");
    };
  }

  const closeOffline = () => {
    els.offlineModal?.classList.add("hidden");
    pendingOfflineDisplayEarned = 0;
    pendingOfflineDisplaySeconds = 0;
    playSfx("claim");
    triggerHaptic(14);
    const dailyStatus = getDailyLoginStatus();
    if (dailyStatus.canClaim && els.dailyBonusModal && dailyBonusAutoShownDate !== dailyStatus.today) {
      setTimeout(() => {
        if (!tryAutoShowDailyBonus()) flushPendingWheelAfterModals();
      }, 220);
    } else {
      flushPendingWheelAfterModals();
    }
  };
  if (els.claimOfflineBtn) els.claimOfflineBtn.onclick = closeOffline;
  if (els.offlineModal) els.offlineModal.onclick = (e) => { if (e.target === els.offlineModal) closeOffline(); };

  els.closeDailyBonusBtn?.addEventListener("click", flushPendingWheelAfterModals);
  els.dailyBonusModal?.addEventListener("click", (e) => {
    if (e.target === els.dailyBonusModal) flushPendingWheelAfterModals();
  });
}

function initLifecycleHandlers() {
  const lockViewportScroll = () => {
    if (window.scrollX !== 0 || window.scrollY !== 0) window.scrollTo(0, 0);
    if (els.appShell && els.appShell.scrollTop !== 0) els.appShell.scrollTop = 0;
  };
  window.addEventListener("scroll", lockViewportScroll, { passive: true });
  window.addEventListener("resize", invalidateTapBtnRect, { passive: true });
  window.addEventListener("orientationchange", invalidateTapBtnRect, { passive: true });
  els.appShell?.addEventListener("scroll", lockViewportScroll, { passive: true });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      isTabHidden = true;
      syncSvgAnimationsPause();
      saveState();
    } else {
      if (!isTabHidden) return;
      isTabHidden = false;
      syncSvgAnimationsPause();
      const awaySec = Math.max(0, (Date.now() - Number(state.lastSaveTime || Date.now())) / 1000);
      lastTickTime = performance.now();
      invalidateTapBtnRect();
      if (gameStarted && awaySec > 0) updateFever(awaySec);
      applyOfflineIncome(gameStarted);
      updateUI(true);
    }
  });

  window.addEventListener("pagehide", () => saveState());
  window.addEventListener("beforeunload", () => saveState());
}

function init() {
  injectUiIcons();
  applySettingsToUI();
  runLoadingScreen();

  setTimeout(() => {
    if (els.headerBananaIcon) els.headerBananaIcon.innerHTML = createBananaSvg(BANANAS_DATA[1], "hdr");
    checkAndRefreshQuests("daily", false);
    checkAndRefreshQuests("weekly", false);
    buildQuestsList("daily");
    buildQuestsList("weekly");

    requestAnimationFrame(() => {
      buildShops(true);
      updateActiveMonkeyUI();
      setBuyMultiplier(1);
      initTapEffectPool();

      requestAnimationFrame(() => {
        initCustomization();
        initProfile();
        initWheel();
        initCoconuts();
        initCollections();
        initLevelModal();
        initDailyLogin();
        initGoldenBanana();
        initModalsAndControls();
        initLifecycleHandlers();

        if (els.monkeyTapBtn) {
          els.monkeyTapBtn.addEventListener("pointerdown", (e) => {
            if (e.button !== undefined && e.button !== 0) return;
            e.preventDefault();
            onTap(e.clientX, e.clientY);
          });
          els.monkeyTapBtn.addEventListener("click", (e) => {
            if (e.detail === 0) onTap(0, 0);
          });
        }

        if (els.activeMonkeyBadge) {
          els.activeMonkeyBadge.style.cursor = "pointer";
          els.activeMonkeyBadge.title = "Выбрать скин для этой обезьянки";
          els.activeMonkeyBadge.onclick = () => openMonkeySkinsShortcut?.(state.activeMonkeyId || 0);
        }

        applyOfflineIncome();
        updateUI(true);

        lastTickTime = performance.now();
        setInterval(gameTick, 250);
        setInterval(triggerIdleMonkeyAnim, 3600);
      });
    });
  }, 120);
}

init();
