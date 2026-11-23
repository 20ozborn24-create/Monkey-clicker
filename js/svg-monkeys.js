function buildFallbackMonkeySvg(m, uid = "main", skinId = 0) {
  const sid = Number(skinId) || 0;
  const id = `${uid}_${m.id}_s${sid}`;
  const furGrad = `mFur_${id}`;
  const skinGrad = `mSkin_${id}`;
  const goldGrad = `mGold_${id}`;
  const metalGrad = `mMet_${id}`;

  const eyeColor = {
    mage: "#c084fc", ghost: "#c4b5fd", fire: "#fef08a", ice: "#0284c7",
    dragon: "#fbbf24", god: "#f59e0b", wukong: "#f59e0b", galaxy: "#67e8f9"
  }[m.acc] || "#1f1209";

  const raised = new Set([
    "tuft", "leaf", "cheeky", "tribal", "ninja", "pirate", "chef",
    "detective", "knight", "samurai", "prof", "mage", "fire", "king", "wukong", "god"
  ]).has(m.acc);

  let back = "", bodyBack = "", outfit = "", head = "", faceExtra = "", eyes = "", rProp = "", lProp = "", lower = "", tail = "", fxOver = "";
  let rx = 20, ry = 21;
  let customMouth = null;

  switch (m.acc) {
    case "tuft":
      head = `<path d="M 52 20 Q 56 8 62 17 Q 67 9 70 19 Q 74 15 71 22 Z" fill="${m.fur}" stroke="rgba(0,0,0,0.28)" stroke-width="1"/>`;
      outfit = `<path d="M 45 64 Q 60 72 75 64 L 66 75 L 60 71 L 54 75 Z" fill="#facc15" stroke="#a16207" stroke-width="1.2"/>`;
      rProp = `<g class="monkey-prop"><path d="M 92 58 C 102 52, 108 42, 102 33 C 98 37, 94 46, 90 55 Z" fill="url(#${goldGrad})" stroke="#854d0e" stroke-width="1.2"/><path d="M 101 36 C 103 42, 99 49, 94 54" fill="none" stroke="#fff" stroke-width="1.4" stroke-linecap="round" opacity="0.65"/><circle cx="102" cy="33" r="1.6" fill="#5c4018"/></g>`;
      break;
    case "leaf":
      head = `<g><path d="M 59 19 Q 69 6 79 12 Q 72 24 59 19 Z" fill="#4ade80" stroke="#166534" stroke-width="1.2"/><path d="M 59 19 Q 51 9 44 14 Q 51 22 59 19 Z" fill="#22c55e" stroke="#166534" stroke-width="1.1"/><line x1="59" y1="19" x2="73" y2="12" stroke="#14532d" stroke-width="1"/></g>`;
      outfit = `<path d="M 41 83 Q 60 91 79 83 L 76 96 Q 60 102 44 96 Z" fill="#22c55e" stroke="#14532d" stroke-width="1.2"/><path d="M 48 87 L 52 94 M 60 89 L 60 97 M 72 87 L 68 94" stroke="#14532d" stroke-width="1" opacity="0.5"/>`;
      rProp = `<g class="monkey-prop"><circle cx="98" cy="48" r="5" fill="#a3e635" stroke="#365314" stroke-width="1.2"/><circle cx="96.5" cy="46.5" r="1.5" fill="#fff" opacity="0.7"/></g>`;
      break;
    case "cheeky":
      head = `<path d="M 57 18 Q 62 11 66 17" fill="none" stroke="${m.fur}" stroke-width="3" stroke-linecap="round"/>`;
      customMouth = `<path d="M 50 51 Q 60 60 70 51" fill="none" stroke="#3b2214" stroke-width="2.4" stroke-linecap="round"/><path d="M 56 55 Q 60 64 64 55 Z" fill="#fb7185" stroke="#be123c" stroke-width="0.9"/>`;
      outfit = `<polygon points="60,65 49,60 49,70" fill="#ef4444" stroke="#7f1d1d" stroke-width="1"/><polygon points="60,65 71,60 71,70" fill="#ef4444" stroke="#7f1d1d" stroke-width="1"/><circle cx="60" cy="65" r="2.8" fill="#b91c1c"/>`;
      rProp = `<g class="monkey-prop"><path d="M 94 56 Q 103 47 99 37 Q 93 45 90 54 Z" fill="#fef08a" stroke="#ca8a04" stroke-width="1.1"/></g>`;
      break;
    case "mustache":
      faceExtra = `<circle cx="69" cy="38" r="6.2" fill="rgba(186,230,253,0.22)" stroke="url(#${goldGrad})" stroke-width="1.6"/><line x1="75" y1="40" x2="79" y2="52" stroke="#eab308" stroke-width="1" stroke-dasharray="1.5 1.5"/><path d="M 60 49 C 53 45, 46 47, 42 52 C 45 55, 53 54, 60 51 C 67 54, 75 55, 78 52 C 74 47, 67 45, 60 49 Z" fill="#f8fafc" stroke="#94a3b8" stroke-width="1"/>`;
      outfit = `<path d="M 42 66 L 56 66 L 57 96 L 42 93 Z" fill="url(#${goldGrad})" stroke="#854d0e" stroke-width="1"/><path d="M 78 66 L 64 66 L 63 96 L 78 93 Z" fill="url(#${goldGrad})" stroke="#854d0e" stroke-width="1"/><circle cx="53" cy="76" r="1.4" fill="#78350f"/><circle cx="53" cy="84" r="1.4" fill="#78350f"/>`;
      break;
    case "headband":
      back = `<g class="fx-ribbon"><path d="M 80 30 Q 93 24 100 30 Q 92 34 80 33 Z" fill="#ef4444"/><path d="M 80 32 Q 92 34 97 41 Q 87 40 79 34 Z" fill="#dc2626"/></g>`;
      head = `<path d="M 36 29 Q 60 22 84 29 L 85 35 Q 60 28 35 35 Z" fill="#ef4444" stroke="#7f1d1d" stroke-width="1"/><path d="M 45 27 Q 60 24 75 27" fill="none" stroke="#fca5a5" stroke-width="1.2" opacity="0.6"/>`;
      outfit = `<path d="M 43 68 Q 60 73 77 68 L 78 93 Q 60 98 42 93 Z" fill="#dc2626" stroke="#7f1d1d" stroke-width="1.2"/><rect x="42" y="81" width="36" height="4.5" fill="#f8fafc"/><path d="M 55 72 L 65 72" stroke="#fef08a" stroke-width="2" stroke-linecap="round"/>`;
      break;
    case "zen":
      head = `<circle cx="73" cy="22" r="4.8" fill="#f472b6" stroke="#be185d" stroke-width="1"/><circle cx="69" cy="23" r="3" fill="#fbcfe8"/><circle cx="73" cy="22" r="1.8" fill="#fde047"/>`;
      faceExtra = `<path d="M 41 49 Q 60 70 79 49 Q 75 72 60 74 Q 45 72 41 49 Z" fill="#ea580c" stroke="#9a3412" stroke-width="1"/>`;
      outfit = `<path d="M 42 66 L 78 92 L 73 98 L 39 73 Z" fill="url(#${goldGrad})" stroke="#a16207" stroke-width="1"/><g fill="#92400e"><circle cx="48" cy="70" r="2.2"/><circle cx="54" cy="73" r="2.2"/><circle cx="60" cy="74" r="2.2"/><circle cx="66" cy="73" r="2.2"/><circle cx="72" cy="70" r="2.2"/></g>`;
      fxOver = `<circle class="svg-sparkle" cx="25" cy="30" r="2" fill="#fef08a"/><circle class="svg-sparkle" cx="95" cy="30" r="2" fill="#fde047"/>`;
      break;
    case "shades":
      faceExtra = `<g><rect x="40" y="33" width="17" height="10.5" rx="3.5" fill="#0f172a" stroke="url(#${goldGrad})" stroke-width="1.6"/><rect x="63" y="33" width="17" height="10.5" rx="3.5" fill="#0f172a" stroke="url(#${goldGrad})" stroke-width="1.6"/><line x1="57" y1="37" x2="63" y2="37" stroke="#facc15" stroke-width="2"/><line x1="43" y1="35" x2="48" y2="41" stroke="#fff" stroke-width="1.4" opacity="0.5" stroke-linecap="round"/><line x1="66" y1="35" x2="71" y2="41" stroke="#fff" stroke-width="1.4" opacity="0.5" stroke-linecap="round"/></g>`;
      outfit = `<path d="M 41 66 L 56 66 L 56 96 L 41 94 Z" fill="#18181b" stroke="#09090b" stroke-width="1"/><path d="M 79 66 L 64 66 L 64 96 L 79 94 Z" fill="#18181b" stroke="#09090b" stroke-width="1"/><path d="M 52 67 Q 60 76 68 67" fill="none" stroke="url(#${goldGrad})" stroke-width="2.2"/>`;
      break;
    case "tribal":
      back = `<g><ellipse cx="45" cy="14" rx="3.8" ry="11" transform="rotate(-25 45 14)" fill="#ef4444" stroke="#7f1d1d" stroke-width="1"/><ellipse cx="60" cy="10" rx="4.2" ry="12" fill="#facc15" stroke="#854d0e" stroke-width="1"/><ellipse cx="75" cy="14" rx="3.8" ry="11" transform="rotate(25 75 14)" fill="#38bdf8" stroke="#0369a1" stroke-width="1"/></g>`;
      head = `<path d="M 37 28 Q 60 22 83 28 L 83 33 Q 60 27 37 33 Z" fill="#d97706" stroke="#78350f" stroke-width="1"/><polygon points="60,25 63,29 60,33 57,29" fill="#38bdf8"/>`;
      faceExtra = `<line x1="41" y1="45" x2="47" y2="47" stroke="#ef4444" stroke-width="2" stroke-linecap="round"/><line x1="79" y1="45" x2="73" y2="47" stroke="#ef4444" stroke-width="2" stroke-linecap="round"/>`;
      outfit = `<path d="M 45 65 Q 60 75 75 65" fill="none" stroke="#f8fafc" stroke-width="3" stroke-dasharray="3 3"/>`;
      rProp = `<g class="monkey-prop"><line x1="95" y1="30" x2="95" y2="94" stroke="#78350f" stroke-width="3.6" stroke-linecap="round"/><circle cx="95" cy="26" r="5.8" fill="#38bdf8" stroke="#facc15" stroke-width="2"/><circle cx="93.5" cy="24.5" r="1.6" fill="#fff" opacity="0.8"/></g>`;
      break;
    case "gorilla":
      rx = 24; ry = 22;
      head = `<path d="M 41 31 Q 51 26 60 31 Q 69 26 79 31" fill="none" stroke="#0f172a" stroke-width="3.8" stroke-linecap="round"/>`;
      outfit = `<path d="M 45 73 Q 53 79 60 75 Q 67 79 75 73" fill="none" stroke="#1e293b" stroke-width="2.6" stroke-linecap="round"/><path d="M 52 84 L 68 84" stroke="#1e293b" stroke-width="2" opacity="0.55" stroke-linecap="round"/>`;
      break;
    case "winter":
      back = `<g class="fx-ribbon"><path d="M 66 67 L 75 88 L 65 89 L 60 69 Z" fill="#dc2626" stroke="#7f1d1d" stroke-width="1"/><line x1="66" y1="77" x2="73" y2="76" stroke="#fff" stroke-width="2.2"/></g>`;
      head = `<path d="M 37 30 C 39 10, 81 10, 83 30 Z" fill="#0284c7" stroke="#0c4a6e" stroke-width="1.2"/><path d="M 47 26 L 52 14 M 60 25 L 60 12 M 73 26 L 68 14" stroke="#38bdf8" stroke-width="1.5" opacity="0.6"/><rect x="35" y="25" width="50" height="8" rx="4" fill="#f8fafc" stroke="#94a3b8" stroke-width="1"/><circle cx="60" cy="10" r="5.5" fill="#fff" stroke="#cbd5e1" stroke-width="1"/>`;
      outfit = `<path d="M 42 62 Q 60 70 78 62 L 77 70 Q 60 77 43 70 Z" fill="#ef4444" stroke="#7f1d1d" stroke-width="1"/>`;
      fxOver = `<circle class="svg-sparkle" cx="22" cy="25" r="2" fill="#e0f2fe"/><circle class="svg-sparkle" cx="98" cy="34" r="2.2" fill="#fff"/>`;
      break;
    case "ninja":
      back = `<g class="fx-ribbon"><path d="M 80 30 Q 95 25 103 33 Q 93 36 80 33 Z" fill="#ef4444"/><path d="M 78 33 Q 92 38 98 46 Q 87 43 78 35 Z" fill="#b91c1c"/></g>`;
      head = `<path d="M 35 37 C 35 15, 85 15, 85 37 L 82 33 L 38 33 Z" fill="#0f172a" stroke="#020617" stroke-width="1.2"/><path d="M 37 42 L 83 42 C 81 63, 39 63, 37 42 Z" fill="#0f172a" stroke="#020617" stroke-width="1.2"/><path d="M 36 27 Q 60 21 84 27 L 84 32 Q 60 26 36 32 Z" fill="#ef4444"/><rect x="49" y="23" width="22" height="7.5" rx="2" fill="url(#${metalGrad})" stroke="#334155" stroke-width="1"/>`;
      eyes = `<g class="monkey-eyes"><ellipse cx="51" cy="38" rx="4.2" ry="2.6" fill="#38bdf8"/><ellipse cx="69" cy="38" rx="4.2" ry="2.6" fill="#38bdf8"/><circle cx="52" cy="37.5" r="1" fill="#fff"/><circle cx="70" cy="37.5" r="1" fill="#fff"/></g><g class="monkey-eyes-happy"><path d="M 46 38 Q 51 34 56 38" fill="none" stroke="#38bdf8" stroke-width="2.4" stroke-linecap="round"/><path d="M 64 38 Q 69 34 74 38" fill="none" stroke="#38bdf8" stroke-width="2.4" stroke-linecap="round"/></g>`;
      customMouth = "";
      outfit = `<ellipse cx="60" cy="82" rx="19" ry="19" fill="#0f172a"/><path d="M 44 68 L 76 92" stroke="#334155" stroke-width="4" stroke-linecap="round"/><rect x="41" y="83" width="38" height="5" fill="#ef4444"/><circle cx="60" cy="85.5" r="2.2" fill="#facc15"/>`;
      rProp = `<g class="monkey-prop"><path class="fx-spin-prop" d="M 96 44 L 98.5 52.5 L 107 55 L 98.5 57.5 L 96 66 L 93.5 57.5 L 85 55 L 93.5 52.5 Z" fill="url(#${metalGrad})" stroke="#334155" stroke-width="1"/></g>`;
      break;
    case "pirate":
      head = `<path d="M 28 28 Q 60 8 92 28 L 83 33 Q 60 24 37 33 Z" fill="#18181b" stroke="#facc15" stroke-width="1.4"/><circle cx="60" cy="19" r="3.8" fill="#f8fafc"/><circle cx="58.7" cy="18.5" r="0.8" fill="#111"/><circle cx="61.3" cy="18.5" r="0.8" fill="#111"/>`;
      faceExtra = `<ellipse cx="69" cy="38" rx="5.8" ry="5.2" fill="#111827" stroke="#334155" stroke-width="1"/><line x1="53" y1="30" x2="82" y2="41" stroke="#111827" stroke-width="2"/><circle cx="32" cy="48" r="3.5" fill="none" stroke="url(#${goldGrad})" stroke-width="1.8"/>`;
      outfit = `<path d="M 41 66 L 79 66 L 81 95 L 39 95 Z" fill="#991b1b" stroke="#450a0a" stroke-width="1.2"/><rect x="40" y="83" width="40" height="5.5" fill="#18181b"/><rect x="55.5" y="82" width="9" height="7.5" rx="1.5" fill="url(#${goldGrad})"/>`;
      rProp = `<g class="monkey-prop"><path d="M 94 56 Q 110 38 101 20 Q 95 35 91 54 Z" fill="url(#${metalGrad})" stroke="#475569" stroke-width="1.2"/><rect x="88" y="54" width="11" height="4" rx="1.5" fill="url(#${goldGrad})"/></g>`;
      break;
    case "chef":
      head = `<path d="M 38 26 C 32 13, 47 5, 60 10 C 73 5, 88 13, 82 26 Z" fill="#ffffff" stroke="#94a3b8" stroke-width="1.3"/><line x1="50" y1="13" x2="52" y2="23" stroke="#cbd5e1" stroke-width="1.2"/><line x1="60" y1="11" x2="60" y2="23" stroke="#cbd5e1" stroke-width="1.2"/><line x1="70" y1="13" x2="68" y2="23" stroke="#cbd5e1" stroke-width="1.2"/><rect x="41" y="23" width="38" height="6.5" rx="2" fill="#f1f5f9" stroke="#94a3b8" stroke-width="1"/>`;
      faceExtra = `<path d="M 60 49 Q 53 45 48 50 Q 54 54 60 50 Q 66 54 72 50 Q 67 45 60 49 Z" fill="#78350f"/>`;
      outfit = `<rect x="41" y="65" width="38" height="31" rx="12" fill="#ffffff" stroke="#94a3b8" stroke-width="1.2"/><path d="M 52 65 L 60 71 L 68 65" fill="#ef4444"/><circle cx="55" cy="77" r="1.8" fill="#475569"/><circle cx="65" cy="77" r="1.8" fill="#475569"/><circle cx="55" cy="86" r="1.8" fill="#475569"/><circle cx="65" cy="86" r="1.8" fill="#475569"/>`;
      rProp = `<g class="monkey-prop"><line x1="95" y1="61" x2="103" y2="37" stroke="#b45309" stroke-width="3.2" stroke-linecap="round"/><ellipse cx="104" cy="34" rx="5" ry="6.5" transform="rotate(20 104 34)" fill="#d97706" stroke="#78350f" stroke-width="1"/><circle cx="104" cy="34" r="2.2" fill="#fef08a"/></g>`;
      break;
    case "dj":
      back = `<path d="M 32 41 C 32 10, 88 10, 88 41" fill="none" stroke="#ec4899" stroke-width="5" stroke-linecap="round"/><path d="M 35 41 C 35 14, 85 14, 85 41" fill="none" stroke="#22d3ee" stroke-width="2"/>`;
      head = `<rect x="25" y="31" width="10" height="19" rx="4.5" fill="#06b6d4" stroke="#ec4899" stroke-width="1.8"/><rect x="85" y="31" width="10" height="19" rx="4.5" fill="#06b6d4" stroke="#ec4899" stroke-width="1.8"/>`;
      faceExtra = `<rect x="41" y="32.5" width="38" height="10.5" rx="5" fill="rgba(6,182,212,0.82)" stroke="#67e8f9" stroke-width="1.5"/><line x1="45" y1="35.5" x2="54" y2="35.5" stroke="#fff" stroke-width="1.3" opacity="0.6" stroke-linecap="round"/>`;
      outfit = `<rect x="41" y="65" width="38" height="31" rx="12" fill="#312e81" stroke="#ec4899" stroke-width="1.5"/><path class="fx-pulse-glow" d="M 49 85 L 49 79 M 54 85 L 54 74 M 59 85 L 59 77 M 64 85 L 64 72 M 69 85 L 69 78" fill="none" stroke="#22d3ee" stroke-width="2.4" stroke-linecap="round"/>`;
      fxOver = `<text class="svg-sparkle" x="20" y="25" font-size="11">🎵</text><text class="svg-sparkle" x="92" y="24" font-size="11">🎶</text>`;
      break;
    case "detective":
      head = `<path d="M 37 28 C 40 11, 80 11, 83 28 Z" fill="#92400e" stroke="#451a03" stroke-width="1.2"/><path d="M 33 28 Q 60 22 87 28" stroke="#451a03" stroke-width="3.6" fill="none" stroke-linecap="round"/>`;
      faceExtra = `<circle cx="69" cy="38" r="6.2" fill="rgba(186,230,253,0.28)" stroke="url(#${goldGrad})" stroke-width="1.8"/>`;
      outfit = `<path d="M 40 66 L 80 66 L 82 96 L 38 96 Z" fill="#a16207" stroke="#713f12" stroke-width="1.2"/><polygon points="47,66 60,77 73,66" fill="#78350f"/><polygon points="58,69 62,69 61,84 60,86 59,84" fill="#ef4444"/>`;
      rProp = `<g class="monkey-prop"><line x1="95" y1="58" x2="100" y2="45" stroke="#451a03" stroke-width="3.2" stroke-linecap="round"/><circle cx="103" cy="37" r="7.5" fill="rgba(186,230,253,0.45)" stroke="url(#${goldGrad})" stroke-width="2.2"/><path d="M 99 34 Q 102 31 106 33" fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/></g>`;
      break;
    case "knight":
      head = `<path d="M 55 7 Q 62 1 72 11 Q 65 18 57 19 Z" fill="#ef4444" stroke="#7f1d1d" stroke-width="1"/><path d="M 35 37 C 35 14, 85 14, 85 37 L 80 30 L 40 30 Z" fill="url(#${metalGrad})" stroke="#334155" stroke-width="1.5"/>`;
      outfit = `<ellipse cx="60" cy="81" rx="20" ry="18" fill="url(#${metalGrad})" stroke="#334155" stroke-width="1.5"/><path d="M 60 72 L 66 78 L 60 90 L 54 78 Z" fill="#ef4444" stroke="#7f1d1d" stroke-width="1"/>`;
      rProp = `<g class="monkey-prop"><polygon points="95,20 98,25 97.5,52 92.5,52 92,25" fill="url(#${metalGrad})" stroke="#334155" stroke-width="1"/><rect x="88" y="51" width="14" height="3.8" rx="1.5" fill="url(#${goldGrad})"/></g>`;
      lProp = `<path d="M 15 73 L 32 73 L 30 92 L 23.5 99 L 17 92 Z" fill="url(#${metalGrad})" stroke="#ef4444" stroke-width="2"/><polygon points="23.5,79 27,85 23.5,92 20,85" fill="#ef4444"/>`;
      break;
    case "samurai":
      head = `<path d="M 33 32 C 37 14, 83 14, 87 32 L 80 28 L 40 28 Z" fill="#991b1b" stroke="#450a0a" stroke-width="1.4"/><path d="M 60 22 L 46 8 L 57 16 L 60 8 L 63 16 L 74 8 Z" fill="url(#${goldGrad})" stroke="#854d0e" stroke-width="1"/>`;
      outfit = `<rect x="41" y="66" width="38" height="29" rx="8" fill="#7f1d1d" stroke="#facc15" stroke-width="1.5"/><line x1="43" y1="75" x2="77" y2="75" stroke="#facc15" stroke-width="2"/><line x1="43" y1="83" x2="77" y2="83" stroke="#facc15" stroke-width="2"/><circle cx="60" cy="79" r="3" fill="url(#${goldGrad})"/>`;
      rProp = `<g class="monkey-prop"><path d="M 95 54 Q 110 31 107 13" fill="none" stroke="url(#${metalGrad})" stroke-width="3.6" stroke-linecap="round"/><rect x="89" y="53" width="11" height="3.5" rx="1" fill="url(#${goldGrad})"/></g>`;
      break;
    case "cyber":
      head = `<line x1="82" y1="22" x2="91" y2="11" stroke="#22d3ee" stroke-width="2.2"/><circle class="fx-pulse-glow" cx="91" cy="11" r="3.2" fill="#22d3ee"/>`;
      faceExtra = `<path d="M 60 19 C 76 19, 85 29, 85 42 C 85 55, 76 64, 60 64 Z" fill="url(#${metalGrad})" opacity="0.78"/><path d="M 64 25 L 73 25 L 77 31" fill="none" stroke="#22d3ee" stroke-width="1.2"/><circle cx="69" cy="38" r="6" fill="#0f172a" stroke="#22d3ee" stroke-width="1.8"/><circle class="fx-pulse-glow" cx="69" cy="38" r="2.6" fill="#22d3ee"/>`;
      outfit = `<ellipse cx="60" cy="81" rx="19" ry="19" fill="#334155" stroke="#22d3ee" stroke-width="1.6"/><circle cx="60" cy="80" r="6.5" fill="#0f172a" stroke="#22d3ee" stroke-width="2"/><circle class="fx-pulse-glow" cx="60" cy="80" r="3.2" fill="#22d3ee"/>`;
      break;
    case "astro":
      outfit = `<rect x="40" y="65" width="40" height="32" rx="14" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.5"/><rect x="49" y="73" width="22" height="13" rx="3.5" fill="#cbd5e1" stroke="#64748b" stroke-width="1"/><circle cx="54" cy="79.5" r="2.2" fill="#ef4444"/><circle cx="60" cy="79.5" r="2.2" fill="#22c55e"/><circle cx="66" cy="79.5" r="2.2" fill="#38bdf8"/>`;
      fxOver = `<circle cx="60" cy="41" r="31" fill="rgba(186,230,253,0.16)" stroke="#e2e8f0" stroke-width="3.2"/><path d="M 38 26 Q 47 14 60 14" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity="0.72"/><circle class="svg-sparkle" cx="18" cy="22" r="1.8" fill="#fef08a"/><circle class="svg-sparkle" cx="102" cy="28" r="2" fill="#bae6fd"/>`;
      break;
    case "rock":
      back = `<path d="M 52 22 L 49 4 L 58 11 L 63 2 L 67 11 L 73 5 L 67 22 Z" fill="#a855f7" stroke="#581c87" stroke-width="1"/>`;
      faceExtra = `<polygon points="42,34 50,29 57,35 53,43 45,43" fill="#ec4899" stroke="#fef08a" stroke-width="1.4"/><polygon points="63,35 70,29 78,34 75,43 67,43" fill="#ec4899" stroke="#fef08a" stroke-width="1.4"/>`;
      outfit = `<rect x="42" y="66" width="36" height="29" rx="10" fill="#18181b" stroke="#52525b" stroke-width="1.2"/><g class="monkey-prop"><path d="M 37 76 L 85 95 L 89 89 L 41 70 Z" fill="#ec4899" stroke="#fef08a" stroke-width="1.2"/><polygon points="78,94 95,103 99,90 84,84" fill="#a855f7" stroke="#fef08a" stroke-width="1.3"/><line x1="42" y1="73" x2="86" y2="91" stroke="#fff" stroke-width="0.9" opacity="0.65"/></g>`;
      break;
    case "prof":
      head = `<polygon points="35,21 60,11 85,21 60,28" fill="#1e293b" stroke="#94a3b8" stroke-width="1.3"/><line x1="81" y1="22" x2="81" y2="34" stroke="#facc15" stroke-width="2"/><circle cx="81" cy="35" r="2" fill="#facc15"/>`;
      faceExtra = `<circle cx="51" cy="38" r="6.2" fill="rgba(255,255,255,0.12)" stroke="url(#${goldGrad})" stroke-width="1.8"/><circle cx="69" cy="38" r="6.2" fill="rgba(255,255,255,0.12)" stroke="url(#${goldGrad})" stroke-width="1.8"/><line x1="57" y1="38" x2="63" y2="38" stroke="#facc15" stroke-width="1.8"/>`;
      outfit = `<path d="M 40 66 L 80 66 L 82 96 L 38 96 Z" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.2"/><polygon points="57,66 63,66 61,88 60,91 59,88" fill="#0ea5e9"/>`;
      rProp = `<g class="monkey-prop"><path d="M 92 43 L 100 43 L 103 55 Q 103 58 99 58 L 93 58 Q 89 58 89 55 Z" fill="#2dd4bf" stroke="#0f766e" stroke-width="1.3"/><circle cx="95" cy="48" r="1.5" fill="#fff" opacity="0.8"/></g>`;
      break;
    case "mage":
      head = `<path d="M 33 28 Q 60 22 87 28 L 75 24 L 60 2 L 45 24 Z" fill="#6b21a8" stroke="url(#${goldGrad})" stroke-width="1.4"/><circle cx="56" cy="17" r="1.8" fill="#fde047"/><circle cx="65" cy="14" r="1.4" fill="#fde047"/>`;
      outfit = `<path d="M 38 66 L 82 66 L 85 99 L 35 99 Z" fill="#581c87" stroke="#facc15" stroke-width="1.3"/><path class="svg-sparkle" d="M 60 72 L 62 77 L 67 79 L 62 81 L 60 86 L 58 81 L 53 79 L 58 77 Z" fill="#fde047"/>`;
      rProp = `<g class="monkey-prop"><line x1="95" y1="34" x2="95" y2="93" stroke="#78350f" stroke-width="3.2" stroke-linecap="round"/><circle class="fx-pulse-glow" cx="95" cy="29" r="6" fill="#c084fc" stroke="#fde047" stroke-width="2"/><circle cx="93.5" cy="27.5" r="1.8" fill="#fff" opacity="0.85"/></g>`;
      break;
    case "fire":
      back = `<g class="fx-flame-crown"><path d="M 39 26 Q 35 6 50 14 Q 60 -1 70 14 Q 85 6 81 26 Z" fill="#f97316"/><path d="M 48 23 Q 60 4 72 23 Z" fill="#fef08a"/></g>`;
      faceExtra = `<path d="M 41 46 Q 46 44 49 48" stroke="#fef08a" stroke-width="1.5" fill="none"/><path d="M 79 46 Q 74 44 71 48" stroke="#fef08a" stroke-width="1.5" fill="none"/>`;
      outfit = `<path d="M 51 73 L 60 89 L 69 73" fill="none" stroke="#fef08a" stroke-width="2.6" stroke-linecap="round"/>`;
      rProp = `<g class="monkey-prop"><circle class="fx-pulse-glow" cx="97" cy="46" r="6.5" fill="#f97316" stroke="#fef08a" stroke-width="1.8"/><circle cx="97" cy="46" r="3" fill="#fef08a"/></g>`;
      break;
    case "ice":
      back = `<polygon points="43,23 49,7 54,18 60,3 66,18 71,7 77,23" fill="#7dd3fc" stroke="#fff" stroke-width="1.3"/>`;
      outfit = `<path class="svg-sparkle" d="M 60 72 L 62 78 L 68 80 L 62 82 L 60 88 L 58 82 L 52 80 L 58 78 Z" fill="#fff"/>`;
      fxOver = `<circle class="svg-sparkle" cx="23" cy="32" r="2.2" fill="#e0f2fe"/><circle class="svg-sparkle" cx="97" cy="36" r="2.2" fill="#bae6fd"/>`;
      break;
    case "ghost":
      back = `<ellipse class="fx-float-prop" cx="60" cy="10" rx="17" ry="4" fill="none" stroke="#c4b5fd" stroke-width="2.4"/>`;
      lower = `<path d="M 40 72 C 40 58, 80 58, 80 72 L 83 103 Q 75 96 68 106 Q 60 96 52 106 Q 45 96 37 103 Z" fill="${m.fur}" opacity="0.88" stroke="#ddd6fe" stroke-width="1.6"/><ellipse cx="60" cy="79" rx="12.5" ry="13.5" fill="url(#${skinGrad})" opacity="0.85"/>`;
      tail = `<g class="fx-float-prop"><circle class="svg-sparkle" cx="96" cy="52" r="3.4" fill="#ddd6fe"/><circle class="svg-sparkle" cx="22" cy="48" r="2.8" fill="#c4b5fd"/></g>`;
      break;
    case "king":
      back = `<path d="M 38 66 L 26 103 L 94 103 L 82 66 Z" fill="#dc2626" stroke="#facc15" stroke-width="1.6"/>`;
      head = `<path d="M 41 25 L 44 10 L 53 18 L 60 7 L 67 18 L 76 10 L 79 25 Z" fill="url(#${goldGrad})" stroke="#854d0e" stroke-width="1.3"/><circle cx="60" cy="18" r="2.5" fill="#ef4444"/><circle cx="49" cy="19" r="1.6" fill="#38bdf8"/><circle cx="71" cy="19" r="1.6" fill="#38bdf8"/>`;
      outfit = `<path d="M 42 64 Q 60 73 78 64 L 77 71 Q 60 78 43 71 Z" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1"/><circle cx="52" cy="69" r="1.3" fill="#111"/><circle cx="60" cy="71" r="1.3" fill="#111"/><circle cx="68" cy="69" r="1.3" fill="#111"/>`;
      rProp = `<g class="monkey-prop"><line x1="95" y1="36" x2="95" y2="91" stroke="url(#${goldGrad})" stroke-width="3.4" stroke-linecap="round"/><circle class="fx-pulse-glow" cx="95" cy="32" r="5.5" fill="#ef4444" stroke="#facc15" stroke-width="2"/></g>`;
      break;
    case "dragon":
      back = `<g><path class="fx-wing-l" d="M 40 66 Q 11 45 14 75 Q 25 80 39 83 Z" fill="#10b981" stroke="#064e3b" stroke-width="1.4"/><path class="fx-wing-r" d="M 80 66 Q 109 45 106 75 Q 95 80 81 83 Z" fill="#10b981" stroke="#064e3b" stroke-width="1.4"/><path d="M 44 23 Q 34 8 42 5 Q 49 12 51 20 Z" fill="url(#${goldGrad})" stroke="#854d0e" stroke-width="1"/><path d="M 76 23 Q 86 8 78 5 Q 71 12 69 20 Z" fill="url(#${goldGrad})" stroke="#854d0e" stroke-width="1"/></g>`;
      outfit = `<path d="M 52 72 L 68 72 M 50 79 L 70 79 M 52 86 L 68 86" stroke="#facc15" stroke-width="2.2" stroke-linecap="round"/>`;
      break;
    case "galaxy":
      back = `<ellipse class="fx-pulse-glow" cx="60" cy="62" rx="49" ry="15" transform="rotate(-18 60 62)" fill="none" stroke="#c084fc" stroke-width="2.6" opacity="0.88"/>`;
      outfit = `<circle cx="53" cy="76" r="1.6" fill="#fff"/><circle cx="67" cy="84" r="2" fill="#fef08a"/><circle cx="58" cy="89" r="1.4" fill="#38bdf8"/>`;
      fxOver = `<ellipse cx="60" cy="62" rx="49" ry="15" transform="rotate(-18 60 62)" fill="none" stroke="#67e8f9" stroke-width="1.2" stroke-dasharray="6 8" opacity="0.75"/><circle class="svg-sparkle" cx="19" cy="36" r="2.2" fill="#fef08a"/><circle class="svg-sparkle" cx="101" cy="52" r="2.5" fill="#67e8f9"/>`;
      break;
    case "wukong":
      back = `<g class="fx-ribbon"><path d="M 54 19 Q 39 2 24 11" fill="none" stroke="#f472b6" stroke-width="2.8" stroke-linecap="round"/><path d="M 66 19 Q 81 2 96 11" fill="none" stroke="#f472b6" stroke-width="2.8" stroke-linecap="round"/></g>`;
      head = `<path d="M 38 27 Q 60 20 82 27" fill="none" stroke="url(#${goldGrad})" stroke-width="3.8" stroke-linecap="round"/><circle cx="60" cy="24" r="3.2" fill="#ef4444" stroke="#facc15" stroke-width="1.3"/>`;
      outfit = `<path d="M 41 66 L 79 66 L 78 93 L 42 93 Z" fill="#dc2626" stroke="#facc15" stroke-width="1.5"/><rect x="41" y="83" width="38" height="5" fill="url(#${goldGrad})"/>`;
      rProp = `<g class="monkey-prop"><line x1="95" y1="16" x2="95" y2="97" stroke="#ef4444" stroke-width="3.6" stroke-linecap="round"/><line x1="95" y1="16" x2="95" y2="26" stroke="url(#${goldGrad})" stroke-width="4.5"/><line x1="95" y1="87" x2="95" y2="97" stroke="url(#${goldGrad})" stroke-width="4.5"/></g>`;
      break;
    case "god":
      back = `<g><circle class="fx-spin-prop" cx="60" cy="60" r="51" fill="none" stroke="#fde047" stroke-width="2" stroke-dasharray="6 4"/><ellipse class="fx-float-prop" cx="60" cy="7" rx="19" ry="4.2" fill="none" stroke="#fff" stroke-width="2.6"/></g>`;
      head = `<path d="M 44 22 L 49 10 L 55 17 L 60 7 L 65 17 L 71 10 L 76 22 Z" fill="url(#${goldGrad})" stroke="#b45309" stroke-width="1.2"/><ellipse class="fx-pulse-glow" cx="60" cy="29" rx="2.5" ry="3.6" fill="#38bdf8" stroke="#fff" stroke-width="1"/>`;
      outfit = `<path d="M 40 65 L 80 65 L 84 99 L 36 99 Z" fill="url(#${goldGrad})" stroke="#b45309" stroke-width="1.4"/><path class="svg-sparkle" d="M 60 73 L 62 79 L 68 81 L 62 83 L 60 89 L 58 83 L 52 81 L 58 79 Z" fill="#fff"/>`;
      rProp = `<g class="monkey-prop"><circle class="fx-pulse-glow" cx="97" cy="43" r="6" fill="#fef08a" stroke="#f59e0b" stroke-width="1.8"/><path d="M 97 38 L 98.5 41.5 L 102 43 L 98.5 44.5 L 97 48 L 95.5 44.5 L 92 43 L 95.5 41.5 Z" fill="#f59e0b"/></g>`;
      break;
  }

  let skinAura = "";
  let skinOver = "";
  if (sid === 1) {
    skinAura = `<circle cx="60" cy="60" r="54" fill="none" stroke="#38bdf8" stroke-width="2" stroke-dasharray="8 6" opacity="0.65"/>`;
    skinOver = `<path class="svg-sparkle" d="M 20 20 L 21.8 24.2 L 26 26 L 21.8 27.8 L 20 32 L 18.2 27.8 L 14 26 L 18.2 24.2 Z" fill="#7dd3fc"/>`;
  } else if (sid === 2) {
    skinAura = `<circle class="fx-spin-prop" cx="60" cy="60" r="54" fill="none" stroke="#c084fc" stroke-width="2.4" stroke-dasharray="10 5" opacity="0.78"/>`;
    skinOver = `<path class="svg-sparkle" d="M 100 22 L 101.8 26.2 L 106 28 L 101.8 29.8 L 100 34 L 98.2 29.8 L 94 28 L 98.2 26.2 Z" fill="#f0abfc"/>`;
  } else if (sid === 3) {
    skinAura = `<circle class="fx-spin-prop" cx="60" cy="60" r="54" fill="none" stroke="#fde047" stroke-width="2.6" stroke-dasharray="6 4" opacity="0.88"/><ellipse class="fx-float-prop" cx="60" cy="6" rx="16" ry="3.5" fill="none" stroke="#fef08a" stroke-width="2.2"/>`;
    skinOver = `<path class="svg-sparkle" d="M 18 22 L 20 27 L 25 29 L 20 31 L 18 36 L 16 31 L 11 29 L 16 27 Z" fill="#fef08a"/><path class="svg-sparkle" d="M 102 22 L 104 27 L 109 29 L 104 31 L 102 36 L 100 31 L 95 29 L 100 27 Z" fill="#ffffff"/>`;
  }

  eyes = eyes || `
    <g class="monkey-eyes">
      <circle cx="51" cy="38" r="4.1" fill="${eyeColor}"/><circle cx="69" cy="38" r="4.1" fill="${eyeColor}"/>
      <circle cx="52.4" cy="36.4" r="1.5" fill="#fff"/><circle cx="70.4" cy="36.4" r="1.5" fill="#fff"/>
      <circle cx="49.7" cy="39.5" r="0.8" fill="#fff" opacity="0.65"/><circle cx="67.7" cy="39.5" r="0.8" fill="#fff" opacity="0.65"/>
    </g>
    <g class="monkey-eyes-happy">
      <path d="M 46 39 Q 51 33 56 39" fill="none" stroke="#2c1708" stroke-width="2.6" stroke-linecap="round"/>
      <path d="M 64 39 Q 69 33 74 39" fill="none" stroke="#2c1708" stroke-width="2.6" stroke-linecap="round"/>
    </g>`;

  const brows = m.acc === "ninja" ? "" : `
    <g class="monkey-brows" stroke="#2c1708" stroke-width="1.6" stroke-linecap="round" fill="none" opacity="0.65">
      <path d="M 46 31 Q 51 29 55 31"/><path d="M 65 31 Q 69 29 74 31"/>
    </g>`;

  const mouthHtml = customMouth !== null ? customMouth : `
    <g class="monkey-mouth-idle"><path d="M 52 52 Q 60 58 68 52" fill="none" stroke="#3b2214" stroke-width="2.3" stroke-linecap="round"/></g>
    <g class="monkey-mouth-happy"><path d="M 51 51 Q 60 63 69 51 Z" fill="#7f1d1d" stroke="#3b2214" stroke-width="1.5" stroke-linejoin="round"/><ellipse cx="60" cy="56.5" rx="4.2" ry="2.2" fill="#fb7185"/></g>`;

  tail = tail || `
    <g class="monkey-tail">
      <path d="M 74 90 Q 104 92, 104 68 Q 104 52, 92 56 Q 87 58, 90 63" fill="none" stroke="rgba(0,0,0,0.38)" stroke-width="8.8" stroke-linecap="round"/>
      <path d="M 74 90 Q 104 92, 104 68 Q 104 52, 92 56 Q 87 58, 90 63" fill="none" stroke="${m.fur}" stroke-width="5.8" stroke-linecap="round"/>
      <circle cx="90" cy="63" r="3.4" fill="${m.fur}"/>
    </g>`;

  lower = lower || `
    <ellipse cx="60" cy="107" rx="22" ry="4" fill="rgba(0,0,0,0.28)"/>
    <line x1="49" y1="92" x2="46" y2="105" stroke="${m.fur}" stroke-width="8.8" stroke-linecap="round"/>
    <ellipse cx="43" cy="107" rx="9" ry="4.8" fill="url(#${skinGrad})" stroke="rgba(0,0,0,0.3)" stroke-width="1.2"/>
    <line x1="71" y1="92" x2="74" y2="105" stroke="${m.fur}" stroke-width="8.8" stroke-linecap="round"/>
    <ellipse cx="77" cy="107" rx="9" ry="4.8" fill="url(#${skinGrad})" stroke="rgba(0,0,0,0.3)" stroke-width="1.2"/>
    <ellipse cx="60" cy="80" rx="${rx}" ry="${ry}" fill="${m.fur}" stroke="rgba(0,0,0,0.3)" stroke-width="1.4"/>
    <ellipse cx="60" cy="80" rx="${rx}" ry="${ry}" fill="url(#${furGrad})" opacity="0.25"/>
    <ellipse cx="60" cy="81" rx="${rx - 7}" ry="${ry - 6}" fill="url(#${skinGrad})"/>
    <ellipse cx="60" cy="64" rx="14" ry="4.5" fill="rgba(0,0,0,0.2)"/>`;

  const lArm = `
    <g class="monkey-arm-left"><g class="monkey-arm-left-idle">
      <path d="M 42 68 Q 25 74, 25 87" fill="none" stroke="${m.fur}" stroke-width="7.8" stroke-linecap="round"/>
      <circle cx="25" cy="88" r="5.3" fill="url(#${skinGrad})" stroke="rgba(0,0,0,0.28)" stroke-width="1.1"/>${lProp}
    </g></g>`;

  const rArm = raised
    ? `<g class="monkey-arm-right"><g class="monkey-arm-right-idle">
        <path d="M 78 68 Q 92 68, 95 57" fill="none" stroke="${m.fur}" stroke-width="7.8" stroke-linecap="round"/>${rProp}
        <circle cx="95" cy="57" r="5.3" fill="url(#${skinGrad})" stroke="rgba(0,0,0,0.28)" stroke-width="1.1"/>
      </g></g>`
    : `<g class="monkey-arm-right"><g class="monkey-arm-right-idle">
        <path d="M 78 68 Q 95 74, 95 87" fill="none" stroke="${m.fur}" stroke-width="7.8" stroke-linecap="round"/>
        <circle cx="95" cy="88" r="5.3" fill="url(#${skinGrad})" stroke="rgba(0,0,0,0.28)" stroke-width="1.1"/>
      </g></g>`;

  const headGroup = `
    <g class="monkey-head"><g class="monkey-head-bob">
      <g class="monkey-ear-left">
        <circle cx="33" cy="40" r="10.2" fill="${m.fur}" stroke="rgba(0,0,0,0.32)" stroke-width="1.3"/>
        <circle cx="33" cy="40" r="5.8" fill="url(#${skinGrad})"/>
        <path d="M 31 38 Q 33 41 35 39" fill="none" stroke="rgba(0,0,0,0.2)" stroke-width="1.2" stroke-linecap="round"/>
      </g>
      <g class="monkey-ear-right">
        <circle cx="87" cy="40" r="10.2" fill="${m.fur}" stroke="rgba(0,0,0,0.32)" stroke-width="1.3"/>
        <circle cx="87" cy="40" r="5.8" fill="url(#${skinGrad})"/>
        <path d="M 85 39 Q 87 41 89 38" fill="none" stroke="rgba(0,0,0,0.2)" stroke-width="1.2" stroke-linecap="round"/>
      </g>
      <path d="M 35 45 L 31 48 L 36 51 M 85 45 L 89 48 L 84 51" fill="${m.fur}" stroke="rgba(0,0,0,0.22)" stroke-width="1"/>
      <ellipse cx="60" cy="41" rx="24.5" ry="23" fill="${m.fur}" stroke="rgba(0,0,0,0.3)" stroke-width="1.4"/>
      <ellipse cx="60" cy="41" rx="24.5" ry="23" fill="url(#${furGrad})" opacity="0.26"/>
      <path d="M 45 24 Q 60 19 75 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity="0.18"/>
      <circle cx="51" cy="38" r="10.2" fill="url(#${skinGrad})"/><circle cx="69" cy="38" r="10.2" fill="url(#${skinGrad})"/>
      <ellipse cx="60" cy="50" rx="18.2" ry="12.4" fill="url(#${skinGrad})"/>
      <ellipse cx="44.5" cy="48.5" rx="3.8" ry="2" fill="#f43f5e" opacity="0.32"/><ellipse cx="75.5" cy="48.5" rx="3.8" ry="2" fill="#f43f5e" opacity="0.32"/>
      ${brows}${eyes}
      <ellipse cx="60" cy="46" rx="4.2" ry="2.2" fill="rgba(0,0,0,0.08)"/>
      <circle cx="56.5" cy="46" r="1.5" fill="#3b2214"/><circle cx="63.5" cy="46" r="1.5" fill="#3b2214"/>
      ${mouthHtml}${faceExtra}${head}
    </g></g>`;

  return `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="${furGrad}" cx="32%" cy="25%" r="75%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.35"/><stop offset="55%" stop-color="${m.fur}" stop-opacity="0"/><stop offset="100%" stop-color="#0a0603" stop-opacity="0.9"/>
      </radialGradient>
      <radialGradient id="${skinGrad}" cx="40%" cy="32%" r="70%">
        <stop offset="0%" stop-color="${m.skin}"/><stop offset="100%" stop-color="${m.skin}" stop-opacity="0.82"/>
      </radialGradient>
      <linearGradient id="${goldGrad}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#fef9c3"/><stop offset="45%" stop-color="#facc15"/><stop offset="100%" stop-color="#b45309"/>
      </linearGradient>
      <linearGradient id="${metalGrad}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ffffff"/><stop offset="50%" stop-color="#cbd5e1"/><stop offset="100%" stop-color="#475569"/>
      </linearGradient>
    </defs>
    ${skinAura}${back}${tail}<g class="monkey-body-group">${bodyBack}${lower}${outfit}${lArm}${rArm}${headGroup}</g>${fxOver}${skinOver}
  </svg>`;
}