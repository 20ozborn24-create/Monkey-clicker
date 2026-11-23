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
    const sparkPool = ["✨", "🍌", "⭐", "💎", "💛"];
    els.loadingGodBtn.onclick = () => {
      godTaps++;
      els.loadingGodBtn.classList.remove("is-bounced");
      void els.loadingGodBtn.offsetWidth;
      els.loadingGodBtn.classList.add("is-bounced");
      clearTimeout(godBounceTimer);
      godBounceTimer = setTimeout(() => els.loadingGodBtn.classList.remove("is-bounced"), 430);

      triggerHaptic(10);
      playTone(540 + (godTaps % 5) * 55, 0.06, "triangle", 0.05);

      if (!state.lowPerfMode && els.loadingGodBtn.querySelectorAll(".loading-god-spark").length < 18) {
        for (let i = 0; i < 6; i++) {
          const sp = mkEl("span", "loading-god-spark");
          const ang = (Math.PI * 2 * i) / 6 + (Math.random() - 0.5) * 0.5;
          const dist = 54 + Math.random() * 34;
          sp.textContent = sparkPool[Math.floor(Math.random() * sparkPool.length)];
          sp.style.setProperty("--gx", `${Math.round(Math.cos(ang) * dist)}px`);
          sp.style.setProperty("--gy", `${Math.round(Math.sin(ang) * dist - 10)}px`);
          sp.style.setProperty("--gr", `${Math.round((Math.random() - 0.5) * 80)}deg`);
          els.loadingGodBtn.appendChild(sp);
          setTimeout(() => sp.remove(), 730);
        }
      }
    };
  }

  const steps = [
    [25, "Выращиваем бананы..."],
    [55, "Будим обезьянок..."],
    [82, "Полируем алмазы..."],
    [100, "Готово к сбору!"]
  ];

  let pct = 0;
  const timer = setInterval(() => {
    pct = Math.min(100, pct + 8 + Math.floor(Math.random() * 10));
    if (els.loadingBarFill) els.loadingBarFill.style.width = `${pct}%`;
    if (els.loadingPercentText) setText(els.loadingPercentText, `${pct}%`);

    const step = steps.find(([limit]) => pct <= limit) || steps[steps.length - 1];
    if (els.loadingStatusText) setText(els.loadingStatusText, step[1]);

    if (pct >= 100) {
      clearInterval(timer);
      if (els.loadingScreen) els.loadingScreen.classList.add("is-ready");
      if (els.loadingReadyBadge) els.loadingReadyBadge.classList.remove("hidden");
      if (els.startGameBtn) els.startGameBtn.classList.remove("hidden");
    }
  }, 55);

  if (els.startGameBtn) {
    els.startGameBtn.onclick = () => {
      if (gameStarted) return;
      gameStarted = true;
      els.startGameBtn.classList.add("is-pressed");
      els.startGameBtn.disabled = true;
      lastTickTime = performance.now();
      playSfx("start");
      triggerHaptic(15);
      if (els.loadingScreen) {
        els.loadingScreen.classList.add("fade-out");
        setTimeout(() => els.loadingScreen.classList.add("hidden"), 460);
      }
      if (pendingOfflineDisplayEarned > 0) {
        setTimeout(showOfflineModal, 320);
      } else if (getDailyLoginStatus().canClaim && els.dailyBonusModal) {
        setTimeout(() => {
          if (!tryAutoShowDailyBonus() && state.pendingWheelRewardId && typeof claimPendingWheelReward === "function") {
            claimPendingWheelReward();
          }
        }, 360);
      } else if (state.pendingWheelRewardId && typeof claimPendingWheelReward === "function") {
        setTimeout(claimPendingWheelReward, 380);
      }
    };
  }
}