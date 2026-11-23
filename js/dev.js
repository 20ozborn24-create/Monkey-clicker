(function () {
  const DEV_CODE = "20ozborn24";
  let devModal = null;
  let devStatusEl = null;
  let devAmountInput = null;

  function injectDevStyles() {
    if (document.getElementById("devConsoleStyles")) return;
    const style = document.createElement("style");
    style.id = "devConsoleStyles";
    style.textContent = `
      #devConsoleModal {
        z-index: 200;
      }
      .dev-card {
        border-top: 2px solid #38bdf8 !important;
        background: linear-gradient(180deg, #101d24 0%, #0b1216 100%) !important;
      }
      .dev-badge {
        font-size: 10px;
        font-weight: 900;
        letter-spacing: 0.8px;
        padding: 2px 8px;
        border-radius: 999px;
        background: rgba(56, 189, 248, 0.2);
        border: 1px solid rgba(56, 189, 248, 0.5);
        color: #7dd3fc;
      }
      .dev-status {
        background: rgba(0, 0, 0, 0.4);
        border: 1px solid rgba(56, 189, 248, 0.28);
        border-radius: 12px;
        padding: 10px 12px;
        font-size: 12px;
        line-height: 1.55;
        color: #cbd5e1;
      }
      .dev-status strong { color: #fef08a; }
      .dev-section-title {
        font-size: 12px;
        font-weight: 800;
        color: #7dd3fc;
        text-transform: uppercase;
        letter-spacing: 0.6px;
        margin-bottom: 6px;
      }
      .dev-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 7px;
      }
      .dev-grid.three {
        grid-template-columns: repeat(3, 1fr);
      }
      .dev-btn {
        border: 1px solid rgba(255, 255, 255, 0.14);
        background: rgba(255, 255, 255, 0.07);
        color: #f8fafc;
        font-size: 12px;
        font-weight: 700;
        padding: 9px 8px;
        border-radius: 10px;
        cursor: pointer;
        text-align: center;
        transition: transform 0.08s ease, background 0.15s ease;
      }
      .dev-btn:active { transform: scale(0.96); }
      .dev-btn.gold {
        background: rgba(250, 204, 21, 0.16);
        border-color: rgba(250, 204, 21, 0.45);
        color: #fef08a;
      }
      .dev-btn.blue {
        background: rgba(56, 189, 248, 0.16);
        border-color: rgba(56, 189, 248, 0.45);
        color: #bae6fd;
      }
      .dev-btn.green {
        background: rgba(74, 222, 128, 0.16);
        border-color: rgba(74, 222, 128, 0.45);
        color: #bbf7d0;
      }
      .dev-btn.red {
        background: rgba(239, 68, 68, 0.16);
        border-color: rgba(239, 68, 68, 0.45);
        color: #fecaca;
      }
      .dev-input-row {
        display: flex;
        gap: 6px;
        align-items: center;
      }
      .dev-input-row input {
        flex: 1;
        min-width: 0;
        background: rgba(0, 0, 0, 0.45);
        border: 1px solid rgba(56, 189, 248, 0.35);
        color: #f8fafc;
        padding: 9px 10px;
        border-radius: 10px;
        font-size: 13px;
        outline: none;
        user-select: text;
        -webkit-user-select: text;
      }
    `;
    document.head.appendChild(style);
  }

  function refreshDevStatus() {
    if (!devStatusEl) return;
    const goldStr = isPremiumActive() ? formatDurationLong((state.premiumUntil - Date.now()) / 1000) : "Нет";
    const platStr = isPlatinumActive() ? formatDurationLong((state.platinumUntil - Date.now()) / 1000) : "Нет";
    const lvl = getAccountLevel();
    const lvlMult = getAccountLevelMult(lvl);
    const absOwned = getAbsoluteBananaOwned();
    const absReq = getResetRequirement(lvl);
    const clickRate = getBpc() * getFeverMultiplier() * getGoldenClickMult();
    const bpsRate = getBps() * getFeverBpsMultiplier() * getGoldenBpsMult();

    devStatusEl.innerHTML =
      `⭐ Уровень: <strong>${lvl}/${MAX_ACCOUNT_LEVEL} (×${formatNum(lvlMult)})</strong> &nbsp;|&nbsp; ` +
      `🍌 Абсолюта: <strong>${absOwned}/${absReq}</strong><br>` +
      `🍌 Бананы: <strong>${formatNum(Math.floor(state.bananas))}</strong> &nbsp;|&nbsp; ` +
      `💎 Алмазы: <strong>${formatNum(state.diamonds)}</strong><br>` +
      `👆 За клик: <strong>${formatNum(clickRate)}</strong> &nbsp;|&nbsp; ` +
      `⏱ В сек: <strong>${formatNum(bpsRate)}</strong><br>` +
      `🐒 Обезьян: <strong>${state.unlockedMonkeys.length}/${MONKEYS_DATA.length}</strong> &nbsp;|&nbsp; ` +
      `⏳ Офлайн-лимит: <strong>${getOfflineMaxHours()} ч</strong><br>` +
      `👑 Gold: <strong>${goldStr}</strong> &nbsp;|&nbsp; 💠 Plat: <strong>${platStr}</strong>`;
  }

  function runDevAction(fn, msg) {
    fn();
    markUiDirty();
    saveState();
    updateUI();
    refreshDevStatus();
    playSfx("select");
    if (msg) showToast(`🛠 ${msg}`);
  }

  function parseDevAmount() {
    const raw = (devAmountInput?.value || "").trim().replace(/\s+/g, "");
    const n = Number(raw);
    return Number.isFinite(n) && n >= 0 ? n : null;
  }

  function ensureDevModal() {
    if (devModal) return;
    injectDevStyles();

    devModal = mkEl("div", "modal-overlay hidden");
    devModal.id = "devConsoleModal";
    devModal.setAttribute("role", "dialog");
    devModal.setAttribute("aria-modal", "true");
    devModal.innerHTML = `
      <div class="modal-card dev-card">
        <div class="modal-header">
          <h2>🛠 Dev Console <span class="dev-badge">SECRET</span></h2>
          <button id="closeDevConsoleBtn" class="close-btn" type="button" aria-label="Закрыть">✕</button>
        </div>
        <div class="modal-body">
          <div id="devStatusBox" class="dev-status"></div>

          <div>
            <div class="dev-section-title">🍌 Бананы</div>
            <div class="dev-grid three">
              <button type="button" class="dev-btn gold" data-dev="b_1k">+1 тыс.</button>
              <button type="button" class="dev-btn gold" data-dev="b_1m">+1 млн</button>
              <button type="button" class="dev-btn gold" data-dev="b_1b">+1 млрд</button>
              <button type="button" class="dev-btn gold" data-dev="b_1t">+1 трлн</button>
              <button type="button" class="dev-btn gold" data-dev="b_1q">+1 квдр</button>
              <button type="button" class="dev-btn red" data-dev="b_zero">Обнулить 🍌</button>
            </div>
          </div>

          <div>
            <div class="dev-section-title">💎 Алмазы и Уровень</div>
            <div class="dev-grid three">
              <button type="button" class="dev-btn blue" data-dev="d_100">+100 💎</button>
              <button type="button" class="dev-btn blue" data-dev="d_1k">+1 000 💎</button>
              <button type="button" class="dev-btn blue" data-dev="d_10k">+10 000 💎</button>
              <button type="button" class="dev-btn red" data-dev="d_zero">Обнулить 💎</button>
              <button type="button" class="dev-btn green" data-dev="all_b25">+25 ко всем 🍌</button>
              <button type="button" class="dev-btn green" data-dev="fever_60">🔥 Лихорадка 60с</button>
              <button type="button" class="dev-btn gold" data-dev="abs_1">+1 Банан Абсолюта</button>
              <button type="button" class="dev-btn gold" data-dev="abs_5">+5 Банан Абсолюта</button>
              <button type="button" class="dev-btn green" data-dev="lvl_up">+1 Уровень</button>
              <button type="button" class="dev-btn red" data-dev="lvl_zero">Уровень = 0</button>
              <button type="button" class="dev-btn red" data-dev="hard_reset">Полный сброс</button>
            </div>
          </div>

          <div>
            <div class="dev-section-title">Точное значение</div>
            <div class="dev-input-row">
              <input id="devExactInput" type="text" inputmode="numeric" placeholder="Число (напр. 50000 или 1e12)" />
              <button type="button" class="dev-btn gold" data-dev="set_b">Задать 🍌</button>
              <button type="button" class="dev-btn blue" data-dev="set_d">Задать 💎</button>
            </div>
          </div>

          <div>
            <div class="dev-section-title">⏱ Таймеры, коллекции и VIP</div>
            <div class="dev-grid">
              <button type="button" class="dev-btn blue" data-dev="wheel_ready">🎡 Сбросить КД Колеса/Краба</button>
              <button type="button" class="dev-btn green" data-dev="quests_done">📋 Выполнить тек. квесты</button>
              <button type="button" class="dev-btn" data-dev="quests_new">🔄 Новые квесты</button>
              <button type="button" class="dev-btn" data-dev="off_sim_4">⏳ Офлайн-тест (4ч)</button>
              <button type="button" class="dev-btn gold" data-dev="unlock_monkeys">🐒 Открыть всех обезьян</button>
              <button type="button" class="dev-btn blue" data-dev="unlock_custom">🎨 Вся кастомизация</button>
              <button type="button" class="dev-btn green" data-dev="col_add_all">🎒 +1 ко всем предметам</button>
              <button type="button" class="dev-btn red" data-dev="col_reset">🗑 Сбросить коллекции</button>
              <button type="button" class="dev-btn gold" data-dev="prem_7d">👑 +7д Gold VIP</button>
              <button type="button" class="dev-btn blue" data-dev="plat_7d">💠 +7д Platinum VIP</button>
              <button type="button" class="dev-btn red" data-dev="prem_off">Снять Gold VIP</button>
              <button type="button" class="dev-btn red" data-dev="plat_off">Снять Platinum VIP</button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(devModal);
    devStatusEl = document.getElementById("devStatusBox");
    devAmountInput = document.getElementById("devExactInput");

    document.getElementById("closeDevConsoleBtn").onclick = () => devModal.classList.add("hidden");
    devModal.onclick = (e) => {
      if (e.target === devModal) devModal.classList.add("hidden");
    };

    const actions = {
      b_1k: () => runDevAction(() => addBananas(1e3), "+1 000 🍌"),
      b_1m: () => runDevAction(() => addBananas(1e6), "+1 млн 🍌"),
      b_1b: () => runDevAction(() => addBananas(1e9), "+1 млрд 🍌"),
      b_1t: () => runDevAction(() => addBananas(1e12), "+1 трлн 🍌"),
      b_1q: () => runDevAction(() => addBananas(1e15), "+1 квдр 🍌"),
      b_zero: () => runDevAction(() => { state.bananas = 0; }, "Бананы обнулены"),
      d_100: () => runDevAction(() => { state.diamonds += 100; }, "+100 💎"),
      d_1k: () => runDevAction(() => { state.diamonds += 1000; }, "+1 000 💎"),
      d_10k: () => runDevAction(() => { state.diamonds += 10000; }, "+10 000 💎"),
      d_zero: () => runDevAction(() => { state.diamonds = 0; }, "Алмазы обнулены"),
      abs_1: () => runDevAction(() => {
        state.bananaCounts[ABSOLUTE_BANANA_INDEX] = (state.bananaCounts[ABSOLUTE_BANANA_INDEX] || 0) + 1;
      }, "+1 Банан Абсолюта"),
      abs_5: () => runDevAction(() => {
        state.bananaCounts[ABSOLUTE_BANANA_INDEX] = (state.bananaCounts[ABSOLUTE_BANANA_INDEX] || 0) + 5;
      }, "+5 Бананов Абсолюта"),
      lvl_up: () => {
        if (isMaxAccountLevel()) {
          playSfx("error");
          return showToast(`👑 Уже максимальный уровень (${MAX_ACCOUNT_LEVEL})!`);
        }
        const next = Math.min(MAX_ACCOUNT_LEVEL, getAccountLevel() + 1);
        runDevAction(() => {
          state.accountLevel = next;
        }, `Уровень = ${next} (×${formatNum(getAccountLevelMult(next))})`);
      },
      lvl_zero: () => runDevAction(() => { state.accountLevel = 0; }, "Уровень сброшен на 0"),
      hard_reset: () => {
        state = getDefaultState();
        saveState();
        syncAllAfterStateReplace();
        refreshDevStatus();
        playSfx("fail");
        showToast("🗑 Выполнен полный сброс аккаунта!");
      },
      set_b: () => {
        const val = parseDevAmount();
        if (val === null) return showToast("Введи корректное число!");
        const clamped = clampFinite(val);
        runDevAction(() => {
          state.bananas = clamped;
          state.totalEarned = Math.max(state.totalEarned, clamped);
        }, `Бананы = ${formatNum(clamped)}`);
      },
      set_d: () => {
        const val = parseDevAmount();
        if (val === null) return showToast("Введи корректное число!");
        runDevAction(() => { state.diamonds = Math.floor(val); }, `Алмазы = ${formatNum(Math.floor(val))}`);
      },
      all_b25: () => runDevAction(() => {
        for (let i = 0; i < state.bananaCounts.length; i++) state.bananaCounts[i] += 25;
      }, "+25 ко всем видам бананов!"),
      fever_60: () => {
        activateBananaFever(60, true);
        refreshDevStatus();
        showToast("🔥 Лихорадка включена на 60 сек!");
      },
      wheel_ready: () => runDevAction(() => {
        state.wheelNextSpinAt = 0;
        state.wheelSpinsUsed = 0;
        state.crabDiscountNextAt = 0;
        state.crabDiscountUsed = 0;
        state.pendingWheelRewardId = null;
      }, "Колесо и скидка краба готовы!"),
      quests_done: () => runDevAction(() => {
        [
          ["dailyQuests", DAILY_QUESTS_POOL],
          ["weeklyQuests", WEEKLY_QUESTS_POOL]
        ].forEach(([key, pool]) => {
          const qs = state[key];
          qs.items.forEach((entry) => {
            const q = pool.find((x) => x.id === entry.id);
            if (q && q.type !== "instant") {
              qs.progress[q.type] = Math.max(qs.progress[q.type] || 0, q.target);
            }
          });
        });
      }, "Текущие задания выполнены — можно забирать!"),
      quests_new: () => runDevAction(() => {
        state.dailyQuests.nextResetAt = 0;
        state.weeklyQuests.nextResetAt = 0;
        checkAndRefreshQuests("daily", false);
        checkAndRefreshQuests("weekly", false);
        buildQuestsList("daily");
        buildQuestsList("weekly");
      }, "Выданы новые задания!"),
      off_sim_4: () => {
        if (getBps() <= 0) {
          playSfx("error");
          return showToast("Сначала купи хотя бы 1 банан (нужен BPS > 0)!");
        }
        state.lastSaveTime = Date.now() - 4 * 3600 * 1000;
        devModal.classList.add("hidden");
        applyOfflineIncome();
        updateUI();
      },
      unlock_monkeys: () => runDevAction(() => {
        state.unlockedMonkeys = MONKEYS_DATA.map((m) => m.id);
        updateActiveMonkeyUI();
      }, "Все 30 обезьян открыты!"),
      unlock_custom: () => runDevAction(() => {
        state.unlockedFrames = AVATAR_FRAMES_DATA.map((x) => x.id);
        state.unlockedStyles = PROFILE_STYLES_DATA.map((x) => x.id);
        state.unlockedBgs = BACKGROUNDS_DATA.map((x) => x.id);
        state.unlockedNickStyles = NICK_STYLES_DATA.map((x) => x.id);
        updateProfileUI();
      }, "Вся кастомизация и стили ника открыты!"),
      col_add_all: () => runDevAction(() => {
        if (typeof ensureCollectionsState === "function" && typeof COLLECTIONS_DATA !== "undefined") {
          ensureCollectionsState();
          COLLECTIONS_DATA.forEach((col) => {
            col.items.forEach((it) => {
              state.collections.counts[it.id] = (state.collections.counts[it.id] || 0) + 1;
            });
          });
        }
      }, "+1 ко всем 240 предметам коллекций!"),
      col_reset: () => runDevAction(() => {
        state.collections = { counts: {}, turnIns: {} };
      }, "Коллекции сброшены"),
      prem_7d: () => runDevAction(() => {
        const base = isPremiumActive() ? state.premiumUntil : Date.now();
        state.premiumUntil = base + 7 * DAY_MS;
        state.goldVipPurchases = (state.goldVipPurchases || 0) + 1;
        if (typeof syncVipFlags === "function") syncVipFlags();
      }, "Выдано +7 дней Gold VIP!"),
      plat_7d: () => runDevAction(() => {
        const base = isPlatinumActive() ? state.platinumUntil : Date.now();
        state.platinumUntil = base + 7 * DAY_MS;
        state.platinumVipPurchases = (state.platinumVipPurchases || 0) + 1;
        if (typeof syncVipFlags === "function") syncVipFlags();
      }, "Выдано +7 дней Platinum VIP!"),
      prem_off: () => runDevAction(() => {
        state.premiumUntil = 0;
        if (typeof syncVipFlags === "function") syncVipFlags();
      }, "Gold VIP отключён"),
      plat_off: () => runDevAction(() => {
        state.platinumUntil = 0;
        if (typeof syncVipFlags === "function") syncVipFlags();
      }, "Platinum VIP отключён")
    };

    devModal.querySelectorAll("[data-dev]").forEach((btn) => {
      btn.onclick = () => {
        const act = actions[btn.dataset.dev];
        if (act) act();
      };
    });
  }

  function openDevConsole() {
    ensureDevModal();
    refreshDevStatus();
    devModal.classList.remove("hidden");
    playSfx("unlock");
  }

  window.openDevConsole = openDevConsole;
  window.openDevConsoleByCode = function (rawCode) {
    if (String(rawCode || "").trim().toLowerCase() !== DEV_CODE) return false;
    openDevConsole();
    return true;
  };
})();