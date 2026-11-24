const LOADING_TIPS = [
  "За каждые 25 штук одного сорта банана его доход растёт в ×1.5!",
  "Кликай быстро, чтобы заполнить шкалу 🔥 и включить Лихорадку ×2!",
  "Каждая открытая обезьяна навсегда усиливает твой клик + 2% от дохода/сек.",
  "Во время кликов с шансом выпадают предметы для 30 коллекций с наградой в 💎!",
  "Колесо фортуны доступно каждые 12 часов — не забывай забирать бесплатный спин!",
  "Купи #99 Банан Абсолюта, чтобы повысить уровень и навсегда умножить доход на ×1.5!",
  "Лови летающий Золотой банан на экране ради 💎, бустов ×3 и предметов коллекций!",
  "Если игра подтормаживает, включи «Отключить анимации» в Настройках ⚙️."
];

function runLoadingScreen() {
  if (els.loadingSettingsBtn && els.settingsModal) {
    els.loadingSettingsBtn.onclick = () => {
      applySettingsToUI();
      els.settingsModal.classList.remove("hidden");
    };
  }

  if (els.loadingMonkeyVisual) {
    const godMonkey = MONKEYS_DATA[MONKEYS_DATA.length - 1];
    els.loadingMonkeyVisual.innerHTML = createMonkeySvg(godMonkey, "load");
    if (state.lowPerfMode && typeof syncSvgAnimationsPause === "function") {
      syncSvgAnimationsPause();
    }
  }

  if (els.loadingWelcomePill) {
    const lvl = getAccountLevel();
    const hasProgress = state.totalClicks > 0 || state.totalEarned > 0 || lvl > 0;
    if (hasProgress) {
      const nick = isValidEnglishNick(state.profile.nickname) ? state.profile.nickname : "BananaPro";
      els.loadingWelcomePill.innerHTML =
        `С возвращением, <strong>${nick}</strong> • ⭐ Ур. ${lvl} • 🍌 ${formatNum(Math.floor(state.bananas))}`;
    } else {
      setText(els.loadingWelcomePill, "✨ Добро пожаловать в тропические джунгли!");
    }
  }

  let tipIdx = Math.floor(Math.random() * LOADING_TIPS.length);
  if (els.loadingTipText) {
    setText(els.loadingTipText, LOADING_TIPS[tipIdx]);
  }
  if (els.loadingTipCard) {
    els.loadingTipCard.onclick = () => {
      tipIdx = (tipIdx + 1) % LOADING_TIPS.length;
      setText(els.loadingTipText, LOADING_TIPS[tipIdx]);
      playTone(620, 0.04, "triangle", 0.03);
    };
  }

  if (els.loadingGodBtn) {
    let godTaps = 0;
    let godBounceTimer = null;
    els.loadingGodBtn.onclick = () => {
      godTaps++;
      els.loadingGodBtn.classList.add("is-bounced");
      clearTimeout(godBounceTimer);
      godBounceTimer = setTimeout(() => els.loadingGodBtn.classList.remove("is-bounced"), 260);
      triggerHaptic(10);
      playTone(540 + (godTaps % 5) * 55, 0.06, "triangle", 0.05);
    };
  }

  const steps = [
    [25, "Выращиваем бананы..."],
    [55, "Будим обезьянок..."],
    [85, "Полируем алмазы..."],
    [100, "Готово к сбору!"]
  ];

  const durationMs = state.lowPerfMode ? 180 : 620;
  let startAt = null;
  let lastShownPct = -1;
  let lastStepText = "";

  const frame = (now) => {
    if (startAt === null) startAt = now;
    const t = Math.min(1, (now - startAt) / durationMs);
    const eased = 1 - Math.pow(1 - t, 2.2);
    const pct = Math.min(100, Math.round(eased * 100));

    if (els.loadingBarFill) {
      els.loadingBarFill.style.transform = `scaleX(${eased.toFixed(4)})`;
    }
    if (pct !== lastShownPct) {
      lastShownPct = pct;
      if (els.loadingPercentText) setText(els.loadingPercentText, `${pct}%`);
      const step = steps.find(([limit]) => pct <= limit) || steps[steps.length - 1];
      if (lastStepText !== step[1]) {
        lastStepText = step[1];
        if (els.loadingStatusText) setText(els.loadingStatusText, step[1]);
      }
    }

    if (t < 1) {
      requestAnimationFrame(frame);
      return;
    }

    if (els.loadingScreen) els.loadingScreen.classList.add("is-ready");
    if (els.loadingReadyBadge) els.loadingReadyBadge.classList.remove("hidden");
    if (els.startGameBtn) {
      els.startGameBtn.querySelectorAll("img[data-src]").forEach((img) => {
        img.src = img.dataset.src;
        img.removeAttribute("data-src");
      });
      els.startGameBtn.classList.remove("hidden");
    }
    if (typeof window.onLoadingBarReady === "function") {
      window.onLoadingBarReady();
    }
  };

  requestAnimationFrame(frame);

  if (els.startGameBtn) {
    els.startGameBtn.onclick = () => {
      if (gameStarted) return;
      if (typeof window.ensureGameReadySync === "function") {
        window.ensureGameReadySync();
      }
      gameStarted = true;
      els.startGameBtn.classList.add("is-pressed");
      els.startGameBtn.disabled = true;
      lastTickTime = performance.now();
      playSfx("start");
      triggerHaptic(15);

      if (els.appShell) els.appShell.classList.remove("is-loading");
      invalidateTapBtnRect();
      syncSvgAnimationsPause();
      if (typeof renderShopJumpBtnVisibility === "function") renderShopJumpBtnVisibility();

      if (els.loadingScreen) {
        els.loadingScreen.classList.add("fade-out");
        setTimeout(() => els.loadingScreen.classList.add("hidden"), 260);
      }
      if (pendingOfflineDisplayEarned > 0) {
        setTimeout(showOfflineModal, 280);
      } else if (getDailyLoginStatus().canClaim && els.dailyBonusModal) {
        setTimeout(() => {
          if (!tryAutoShowDailyBonus() && state.pendingWheelRewardId && typeof claimPendingWheelReward === "function") {
            claimPendingWheelReward();
          }
        }, 300);
      } else if (state.pendingWheelRewardId && typeof claimPendingWheelReward === "function") {
        setTimeout(claimPendingWheelReward, 320);
      }
    };
  }
}
