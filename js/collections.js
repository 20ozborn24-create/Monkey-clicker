const collectionDomRefs = [];
let collectionsBuilt = false;
let collectionFilter = "all";
let colListSynced = false;
let lastColBadgeHidden = null;

function ensureCollectionsState() {
  if (!state.collections || typeof state.collections !== "object") {
    state.collections = { counts: {}, turnIns: {} };
  }
  if (!state.collections.counts || typeof state.collections.counts !== "object") {
    state.collections.counts = {};
  }
  if (!state.collections.turnIns || typeof state.collections.turnIns !== "object") {
    state.collections.turnIns = {};
  }
}

function onCollectionTap() {
  const r = Math.random();
  let rarity = null;
  if (r < 0.006) rarity = "common";          // 0.60%
  else if (r < 0.01) rarity = "rare";        // 0.40%
  else if (r < 0.0125) rarity = "unique";    // 0.25%
  if (!rarity) return;

  ensureCollectionsState();
  const pool = COLLECTIONS_DATA.filter((c) => c.rarity === rarity);
  const col = pool[Math.floor(Math.random() * pool.length)];
  const item = col.items[Math.floor(Math.random() * col.items.length)];

  const qty = (state.collections.counts[item.id] || 0) + 1;
  state.collections.counts[item.id] = qty;

  markUiDirty("col");
  playSfx("unlock");
  showToast(`🎒 Найдено: ${item.name} (×${qty})!`);
  updateCollectionsUI();
  saveState();
}

function claimCollectionReward(colId) {
  ensureCollectionsState();
  const col = COLLECTIONS_DATA.find((c) => c.id === colId);
  if (!col) return;

  const canClaim = col.items.every((it) => (state.collections.counts[it.id] || 0) >= 1);
  if (!canClaim) return;

  col.items.forEach((it) => {
    const left = (state.collections.counts[it.id] || 0) - 1;
    if (left > 0) state.collections.counts[it.id] = left;
    else delete state.collections.counts[it.id];
  });

  const turnIns = (state.collections.turnIns[col.id] || 0) + 1;
  state.collections.turnIns[col.id] = turnIns;
  state.diamonds += col.rewardDiamonds;
  if (state.weeklyQuests?.progress) {
    state.weeklyQuests.progress.earnDiamonds += col.rewardDiamonds;
  }

  markUiDirty("col", "ach");
  playSfx("fanfare");
  spawnBgDropParticles();
  showToast(`🎉 Сдана «${col.title}»! +${col.rewardDiamonds} 💎 (сдач: ${turnIns})`);
  saveState();
  updateUI();
}

function buildCollectionsList() {
  if (!els.collectionsList) return;
  els.collectionsList.innerHTML = "";
  collectionDomRefs.length = 0;

  const frag = document.createDocumentFragment();
  COLLECTIONS_DATA.forEach((col) => {
    const itemsHtml = col.items.map((it) => (
      `<div class="col-item-slot" data-item-id="${it.id}">` +
        `<span class="col-item-qty hidden"></span>` +
        `<div class="col-item-icon">${it.iconSvg}</div>` +
        `<span class="col-item-name">${it.name}</span>` +
      `</div>`
    )).join("");

    const card = mkEl(
      "div",
      `col-card rarity-${col.rarity}`,
      `<div class="col-card-head">` +
        `<div class="col-title-col">` +
          `<div class="col-title-line">` +
            `<span class="col-num">#${col.id}</span>` +
            `<span class="col-title">${col.title}</span>` +
            `<span class="col-rarity-tag rarity-${col.rarity}">${col.rarityLabel}</span>` +
          `</div>` +
          `<div class="col-reward-line">Награда за сдачу: <strong>+${col.rewardDiamonds} ${gemHtml()}</strong> • <span class="col-turnin-text">Сдано: 0</span></div>` +
        `</div>` +
        `<div class="col-action-col">` +
          `<span class="col-count-pill">0/${col.items.length}</span>` +
          `<button type="button" class="col-claim-btn pending"></button>` +
        `</div>` +
      `</div>` +
      `<div class="col-items-grid">${itemsHtml}</div>`
    );

    const claimBtn = card.querySelector(".col-claim-btn");
    claimBtn.onclick = () => claimCollectionReward(col.id);
    frag.appendChild(card);

    collectionDomRefs.push({
      col,
      card,
      countPill: card.querySelector(".col-count-pill"),
      turnInText: card.querySelector(".col-turnin-text"),
      btn: claimBtn,
      slots: Array.from(card.querySelectorAll(".col-item-slot")),
      qtyEls: Array.from(card.querySelectorAll(".col-item-qty")),
      lastQtys: new Array(col.items.length).fill(-1)
    });
  });

  els.collectionsList.appendChild(frag);
  collectionsBuilt = true;
  colListSynced = false;
}

function ensureCollectionsBuilt() {
  if (!collectionsBuilt) buildCollectionsList();
}

function updateCollectionsUI() {
  const isOpen = Boolean(els.collectionsModal && !els.collectionsModal.classList.contains("hidden"));
  if (!uiDirty.col && (!isOpen || colListSynced)) return;

  if (uiDirty.col) {
    colListSynced = false;
    ensureCollectionsState();

    let readyCount = 0;
    let totalTurnIns = 0;
    let distinctOwned = 0;
    let totalCopies = 0;

    for (let i = 0; i < COLLECTIONS_DATA.length; i++) {
      const col = COLLECTIONS_DATA[i];
      let ownedInCol = 0;
      for (let j = 0; j < col.items.length; j++) {
        const qty = state.collections.counts[col.items[j].id] || 0;
        if (qty > 0) {
          ownedInCol++;
          distinctOwned++;
          totalCopies += qty;
        }
      }
      totalTurnIns += state.collections.turnIns[col.id] || 0;
      if (ownedInCol >= col.items.length) readyCount++;
    }

    if (els.collectionsBtnBadge) {
      const hideBadge = readyCount <= 0;
      if (lastColBadgeHidden !== hideBadge) {
        lastColBadgeHidden = hideBadge;
        els.collectionsBtnBadge.classList.toggle("hidden", hideBadge);
      }
    }

    if (els.collectionsTotalBadge) setText(els.collectionsTotalBadge, `${distinctOwned}/${TOTAL_COLLECTION_ITEMS}`);
    if (els.collectionsItemsStat) setText(els.collectionsItemsStat, formatNum(totalCopies));
    if (els.collectionsTurnInsStat) setText(els.collectionsTurnInsStat, formatNum(totalTurnIns));
    uiDirty.col = false;
  }

  if (!isOpen) return;

  ensureCollectionsBuilt();
  colListSynced = true;

  collectionDomRefs.forEach((r) => {
    const show = collectionFilter === "all" || r.col.rarity === collectionFilter;
    if (r.lastShow !== show) {
      r.lastShow = show;
      r.card.classList.toggle("hidden", !show);
    }
    if (!show) return;

    let owned = 0;
    r.slots.forEach((slot, idx) => {
      const qty = state.collections.counts[r.col.items[idx].id] || 0;
      const has = qty > 0;
      if (has) owned++;
      if (r.lastQtys[idx] !== qty) {
        r.lastQtys[idx] = qty;
        slot.classList.toggle("is-owned", has);
        const qEl = r.qtyEls[idx];
        if (qEl) {
          qEl.classList.toggle("hidden", !has);
          if (has) setText(qEl, `×${qty}`);
        }
      }
    });

    const turnIns = state.collections.turnIns[r.col.id] || 0;
    const isReady = owned >= r.col.items.length;

    if (r.lastOwnedCount !== owned || r.lastTurnIns !== turnIns) {
      r.lastOwnedCount = owned;
      r.lastTurnIns = turnIns;
      r.card.classList.toggle("is-ready", isReady);
      r.card.classList.toggle("is-claimed", turnIns > 0);
      setText(r.countPill, `${owned}/${r.col.items.length}`);
      setText(r.turnInText, `Сдано: ${turnIns}`);
    }

    if (isReady) {
      syncBtnHtml(r, `Сдать +${r.col.rewardDiamonds} ${gemHtml()}`, "col-claim-btn ready", false);
    } else {
      syncBtnHtml(r, `${owned}/${r.col.items.length}`, "col-claim-btn pending", true);
    }
  });
}

function initCollections() {
  ensureCollectionsState();

  bindModal(els.collectionsBtn, els.collectionsModal, els.closeCollectionsBtn, () => {
    colListSynced = false;
    updateCollectionsUI();
  });
  bindTabs([
    { key: "all", btn: "colTabAll" },
    { key: "common", btn: "colTabCommon" },
    { key: "rare", btn: "colTabRare" },
    { key: "unique", btn: "colTabUnique" }
  ], (key) => {
    collectionFilter = key;
    colListSynced = false;
    updateCollectionsUI();
  });

  markUiDirty("col");
  updateCollectionsUI();
}