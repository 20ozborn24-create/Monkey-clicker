const NICK_FX = ["nick-fx-flow", "nick-fx-fire", "nick-fx-pulse"];

const avatarPresetRefs = [];
const nickChipRefs = [];
let profilePickersBuilt = false;
let lastProfileStatsAt = 0;
let lastResetBtnKey = "";

function renderAvatarElement(el, uid) {
  if (!el) return;
  const type = state.profile.avatarType;
  const val = state.profile.avatarValue;
  const skinId = type === "monkey" && typeof getMonkeyEquippedSkin === "function"
    ? getMonkeyEquippedSkin(Number(val) || 0)
    : 0;
  if (el._lastAvatarType === type && el._lastAvatarVal === val && el._lastAvatarSkin === skinId) return;
  el._lastAvatarType = type;
  el._lastAvatarVal = val;
  el._lastAvatarSkin = skinId;

  if (type === "image" && val) {
    el.innerHTML = "";
    const img = mkEl("img");
    img.src = val;
    img.alt = "Аватар";
    el.appendChild(img);
  } else {
    el.innerHTML = createMonkeySvg(MONKEYS_DATA[Number(val) || 0] || MONKEYS_DATA[0], uid, skinId);
    if (state.lowPerfMode && typeof syncSvgAnimationsPause === "function") syncSvgAnimationsPause();
  }
}

function applyNickStyle(el, ns) {
  if (!el || !ns || Number(el.dataset.nickStyleId) === ns.id) return;
  el.dataset.nickStyleId = String(ns.id);
  NICK_FX.forEach((c) => el.classList.remove(c));
  if (ns.fx && ns.fx !== "none") el.classList.add(ns.fx);
  el.style.setProperty("--nick-bg", ns.bg);
  el.style.setProperty("--nick-glow", ns.glow);
}

function selectNickStyle(ns) {
  if (!state.unlockedNickStyles.includes(ns.id)) {
    if (!spendDiamonds(ns.cost)) return;
    state.unlockedNickStyles.push(ns.id);
    state.profile.nickStyleId = ns.id;
    playSfx("unlock");
    showToast(`🎉 Куплен стиль ника: ${ns.name} (-${ns.cost} 💎)!`);
    saveState();
    updateProfileUI();
    updateUI();
    return;
  }
  state.profile.nickStyleId = ns.id;
  saveState();
  updateProfileUI();
  playSfx("select");
  showToast(`Стиль ника: ${ns.name}`);
}

function renderNickStylesPicker() {
  if (!els.nickStylesGrid) return;
  els.nickStylesGrid.innerHTML = "";
  nickChipRefs.length = 0;

  const frag = document.createDocumentFragment();
  NICK_STYLES_DATA.forEach((ns) => {
    const btn = mkEl(
      "button",
      "nick-style-chip",
      `<span class="nick-chip-sample nick-styled">Banana</span><span class="nick-chip-name">${ns.name}</span><span class="nick-chip-badge"></span>`
    );
    btn.type = "button";
    applyNickStyle(btn.querySelector(".nick-chip-sample"), ns);
    btn.onclick = () => selectNickStyle(ns);
    frag.appendChild(btn);
    nickChipRefs.push({
      id: ns.id,
      ns,
      btn,
      badge: btn.querySelector(".nick-chip-badge"),
      lastKey: "",
      lastBadge: ""
    });
  });

  els.nickStylesGrid.appendChild(frag);
  updateNickStylesUI();
}

function updateNickStylesUI() {
  if (!els.profileModal || els.profileModal.classList.contains("hidden") || !nickChipRefs.length) return;

  const activeId = state.profile.nickStyleId || 0;
  for (let i = 0; i < nickChipRefs.length; i++) {
    const r = nickChipRefs[i];
    const unlocked = state.unlockedNickStyles.includes(r.id);
    const sel = r.id === activeId;
    const canBuy = !unlocked && state.diamonds >= r.ns.cost;
    const sKey = `${sel ? 1 : 0}_${unlocked ? 1 : 0}_${canBuy ? 1 : 0}`;
    if (r.lastKey === sKey) continue;
    r.lastKey = sKey;

    r.btn.classList.toggle("selected", sel);
    r.btn.classList.toggle("locked", !unlocked);
    r.btn.classList.toggle("can-buy", canBuy);

    if (r.badge) {
      const html = sel
        ? "Выбран ✓"
        : unlocked
          ? "Выбрать"
          : canBuy
            ? `${gemHtml()} ${r.ns.cost}`
            : `🔒 ${r.ns.cost} ${gemHtml()}`;
      if (r.lastBadge !== html) {
        r.lastBadge = html;
        r.badge.innerHTML = html;
      }
    }
  }
}

function renderAvatarPresets() {
  if (!els.avatarPresets) return;
  els.avatarPresets.innerHTML = "";
  avatarPresetRefs.length = 0;

  const frag = document.createDocumentFragment();
  AVATAR_PRESET_MONKEYS.forEach((id) => {
    const m = MONKEYS_DATA[id];
    if (!m) return;
    const eqSkin = typeof getMonkeyEquippedSkin === "function" ? getMonkeyEquippedSkin(id) : 0;
    const btn = mkEl("button", "preset-avatar-btn", createMonkeySvg(m, "preset", eqSkin));
    btn.type = "button";
    btn.title = m.name;
    btn.onclick = () => {
      state.profile.avatarType = "monkey";
      state.profile.avatarValue = id;
      saveState();
      updateProfileUI();
      updateUI();
      showToast("Аватарка обновлена!");
    };
    frag.appendChild(btn);
    avatarPresetRefs.push({ id, btn, lastSelected: null, lastSkin: eqSkin });
  });
  els.avatarPresets.appendChild(frag);
  if (state.lowPerfMode && typeof syncSvgAnimationsPause === "function") syncSvgAnimationsPause();
}

function ensureProfilePickersBuilt() {
  if (profilePickersBuilt) return;
  profilePickersBuilt = true;
  renderAvatarPresets();
  renderNickStylesPicker();
}

function updateProfileUI(syncInput = false) {
  renderAvatarElement(els.headerAvatar, "hdr_av");
  renderAvatarElement(els.modalAvatarPreview, "mod_av");
  renderAvatarElement(els.customPreviewAvatar, "cus_av");

  const nick = isValidEnglishNick(state.profile.nickname) ? state.profile.nickname : "BananaPro";
  const ns = NICK_STYLES_DATA[state.profile.nickStyleId] || NICK_STYLES_DATA[0];

  setText(els.headerNickname, nick);

  const modalOpen = Boolean(els.profileModal && !els.profileModal.classList.contains("hidden"));
  if (els.nicknameInput && (syncInput || !modalOpen)) els.nicknameInput.value = nick;

  const previewNick = modalOpen && els.nicknameInput ? (els.nicknameInput.value.trim() || nick) : nick;
  setText(els.profileNickPreview, previewNick);

  applyNickStyle(els.headerNickname, ns);
  applyNickStyle(els.customPreviewNick, ns);
  applyNickStyle(els.profileNickPreview, ns);

  if (modalOpen) {
    ensureProfilePickersBuilt();
    const isMonkey = state.profile.avatarType === "monkey";
    const avVal = Number(state.profile.avatarValue);
    for (let i = 0; i < avatarPresetRefs.length; i++) {
      const r = avatarPresetRefs[i];
      const eqSkin = typeof getMonkeyEquippedSkin === "function" ? getMonkeyEquippedSkin(r.id) : 0;
      if (r.lastSkin !== eqSkin) {
        r.lastSkin = eqSkin;
        const m = MONKEYS_DATA[r.id];
        if (m) r.btn.innerHTML = createMonkeySvg(m, "preset", eqSkin);
      }
      const sel = isMonkey && avVal === r.id;
      if (r.lastSelected !== sel) {
        r.lastSelected = sel;
        r.btn.classList.toggle("selected", sel);
      }
    }
    updateNickStylesUI();
  }

  updateCustomizationUI();
}

function handleAvatarUpload(file) {
  if (!file) return;
  const r = new FileReader();
  r.onerror = () => { playSfx("error"); showToast("Не удалось прочитать файл!"); };
  r.onload = (e) => {
    const img = new Image();
    img.onerror = () => { playSfx("error"); showToast("Выбранный файл не является изображением!"); };
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = c.height = 160;
      const ctx = c.getContext("2d");
      ctx.fillStyle = "#19261e";
      ctx.fillRect(0, 0, 160, 160);
      const s = Math.min(img.width, img.height);
      ctx.drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, 160, 160);
      state.profile.avatarType = "image";
      state.profile.avatarValue = c.toDataURL("image/jpeg", 0.8);
      saveState();
      updateProfileUI();
      updateUI();
      showToast("Фото установлено!");
    };
    img.src = e.target.result;
  };
  r.readAsDataURL(file);
}

function updateProfileStats(species, force = false) {
  const now = performance.now();
  if (!force && now - lastProfileStatsAt < 800) return;
  lastProfileStatsAt = now;

  let bTypes = species;
  if (bTypes === undefined) {
    bTypes = 0;
    for (let i = 0; i < state.bananaCounts.length; i++) {
      if (state.bananaCounts[i] > 0) bTypes++;
    }
  }

  const lvl = getAccountLevel();
  const isMax = isMaxAccountLevel(lvl);
  const lvlMult = getAccountLevelMult(lvl);

  setText(els.statAccountLevel, isMax ? `👑 ${lvl} (МАКС)` : `⭐ ${lvl}`);
  setText(els.statLevelMult, `×${formatNum(lvlMult)}`);
  setText(els.statClicks, formatNum(state.totalClicks));
  setText(els.statTotalEarned, `${formatNum(Math.floor(state.totalEarned))} 🍌`);

  if (els.statDiamonds) {
    const gemStatHtml = `${formatNum(state.diamonds)} ${gemHtml()}`;
    if (els.statDiamonds.dataset.lastHtml !== gemStatHtml) {
      els.statDiamonds.dataset.lastHtml = gemStatHtml;
      els.statDiamonds.innerHTML = gemStatHtml;
    }
  }

  setText(els.statQuestsCompleted, String(state.completedQuestsTotal || 0));
  setText(els.statBpc, formatNum(getBpc()));
  setText(els.statBps, formatNum(getBps()));
  setText(els.statMonkeys, `${state.unlockedMonkeys.length} / ${MONKEYS_DATA.length}`);
  setText(els.statBananas, `${bTypes} / ${BANANAS_DATA.length}`);
  setText(els.statTime, formatTime(state.playTimeSeconds));

  if (els.resetGameBtn) {
    const ready = canPerformLevelReset();
    const owned = getAbsoluteBananaOwned();
    const req = getResetRequirement(lvl);
    const rKey = `${lvl}_${ready ? 1 : 0}_${owned}_${req}`;
    if (lastResetBtnKey !== rKey) {
      lastResetBtnKey = rKey;
      els.resetGameBtn.classList.toggle("is-ready", ready);
      setText(
        els.resetGameBtn,
        isMax
          ? `👑 Максимальный уровень (${MAX_ACCOUNT_LEVEL}/${MAX_ACCOUNT_LEVEL})`
          : ready
            ? `⭐ Сбросить прогресс (+1 Ур. → Ур. ${lvl + 1})`
            : `🔒 Сброс прогресса (Банан Абсолюта: ${owned}/${req})`
      );
    }
  }

  updateNickStylesUI();
}

function initProfile() {
  updateProfileUI(true);

  bindModal(els.profileBtn, els.profileModal, els.closeProfileBtn, () => {
    els.backupCodeWrap?.classList.add("hidden");
    ensureProfilePickersBuilt();
    updateProfileUI(true);
    updateProfileStats(undefined, true);
  });

  if (els.avatarFileInput) {
    els.avatarFileInput.onchange = (e) => {
      handleAvatarUpload(e.target.files?.[0]);
      e.target.value = "";
    };
  }

  if (els.nicknameInput && els.saveNicknameBtn) {
    let lastLangToast = 0;
    els.nicknameInput.oninput = () => {
      const raw = els.nicknameInput.value;
      const cleaned = raw.replace(/[^A-Za-z0-9 _-]/g, "");
      if (cleaned !== raw) {
        els.nicknameInput.value = cleaned;
        if (Date.now() - lastLangToast > 1500) {
          lastLangToast = Date.now();
          showToast("Никнейм только на английском (A-Z, 0-9)!");
        }
      }
      setText(els.profileNickPreview, cleaned.trim() || state.profile.nickname || "BananaPro");
    };
    els.nicknameInput.onkeydown = (e) => { if (e.key === "Enter") els.saveNicknameBtn.click(); };
    els.saveNicknameBtn.onclick = () => {
      const t = els.nicknameInput.value.replace(/[^A-Za-z0-9 _-]/g, "").trim();
      if (!isValidEnglishNick(t)) return showToast("Введи ник на английском (минимум 1 буква A-Z)!");
      state.profile.nickname = t.slice(0, 18);
      saveState();
      updateProfileUI(true);
      showToast("Ник сохранён!");
    };
  }

  if (els.exportSaveBtn && els.importSaveBtn && els.backupCodeWrap && els.backupCodeInput && els.applyImportBtn) {
    els.exportSaveBtn.onclick = async () => {
      const code = exportSaveCode();
      els.backupCodeWrap.classList.remove("hidden");
      els.applyImportBtn.classList.add("hidden");
      els.backupCodeInput.readOnly = true;
      els.backupCodeInput.value = code;
      els.backupCodeInput.focus();
      els.backupCodeInput.select();
      try {
        await navigator.clipboard.writeText(code);
        showToast("Код сохранения скопирован!");
      } catch (_) {
        showToast("Код готов — скопируй его из поля!");
      }
    };

    els.importSaveBtn.onclick = () => {
      els.backupCodeWrap.classList.remove("hidden");
      els.applyImportBtn.classList.remove("hidden");
      els.backupCodeInput.readOnly = false;
      els.backupCodeInput.value = "";
      els.backupCodeInput.focus();
    };

    els.backupCodeInput.onkeydown = (e) => {
      if (e.key === "Enter" && !els.applyImportBtn.classList.contains("hidden")) els.applyImportBtn.click();
    };

    els.applyImportBtn.onclick = () => {
      if (typeof openDevConsoleByCode === "function" && openDevConsoleByCode(els.backupCodeInput.value)) {
        els.backupCodeWrap.classList.add("hidden");
        els.backupCodeInput.value = "";
        els.profileModal.classList.add("hidden");
        return;
      }
      if (!importSaveCode(els.backupCodeInput.value)) {
        playSfx("error");
        return showToast("Неверный код сохранения!");
      }
      els.backupCodeWrap.classList.add("hidden");
      els.backupCodeInput.value = "";
      lastProfileStatsAt = 0;
      syncAllAfterStateReplace();
      playSfx("unlock");
      showToast("Сохранение успешно загружено!");
    };
  }

  const closeResetModal = () => els.resetConfirmModal?.classList.add("hidden");
  if (els.resetGameBtn) els.resetGameBtn.onclick = () => openLevelResetConfirm();
  if (els.closeResetConfirmBtn) els.closeResetConfirmBtn.onclick = closeResetModal;
  if (els.cancelResetBtn) els.cancelResetBtn.onclick = closeResetModal;
  if (els.resetConfirmModal) els.resetConfirmModal.onclick = (e) => { if (e.target === els.resetConfirmModal) closeResetModal(); };
  if (els.confirmResetBtn) {
    els.confirmResetBtn.onclick = () => {
      if (!performLevelReset()) return;
      els.backupCodeWrap?.classList.add("hidden");
      closeResetModal();
      els.levelModal?.classList.add("hidden");
      els.profileModal?.classList.add("hidden");
    };
  }
}