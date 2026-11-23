let svgSpriteReady = false;

function injectSvgSprite() {
  if (svgSpriteReady) return;
  svgSpriteReady = true;

  const sprite = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  sprite.id = "svgSprite";
  sprite.setAttribute("aria-hidden", "true");
  sprite.style.cssText = "position:absolute;width:0;height:0;overflow:hidden;pointer-events:none";
  sprite.innerHTML = `
    <defs>
      <linearGradient id="sprGemTop" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ffffff"/><stop offset="55%" stop-color="#bae6fd"/><stop offset="100%" stop-color="#38bdf8"/>
      </linearGradient>
      <linearGradient id="sprGemMid" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#7dd3fc"/><stop offset="100%" stop-color="#0284c7"/>
      </linearGradient>
      <linearGradient id="sprGemDark" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0ea5e9"/><stop offset="100%" stop-color="#0c4a6e"/>
      </linearGradient>

      <linearGradient id="sprTapSkin" x1="20%" y1="5%" x2="85%" y2="95%">
        <stop offset="0%" stop-color="#ffebd2"/><stop offset="48%" stop-color="#f7b97e"/><stop offset="100%" stop-color="#c97236"/>
      </linearGradient>
      <linearGradient id="sprTapCuff" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#4ade80"/><stop offset="100%" stop-color="#15803d"/>
      </linearGradient>
      <radialGradient id="sprTapRing" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#fef08a" stop-opacity="0.55"/><stop offset="70%" stop-color="#f59e0b" stop-opacity="0.15"/><stop offset="100%" stop-color="#f59e0b" stop-opacity="0"/>
      </radialGradient>

      <linearGradient id="sprSndOnBody" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ffffff"/><stop offset="55%" stop-color="#cbd5e1"/><stop offset="100%" stop-color="#475569"/>
      </linearGradient>

      <linearGradient id="sprPlayTri" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ffffff"/><stop offset="55%" stop-color="#fef08a"/><stop offset="100%" stop-color="#f59e0b"/>
      </linearGradient>
      <linearGradient id="sprPalWood" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#fde68a"/><stop offset="55%" stop-color="#d97706"/><stop offset="100%" stop-color="#78350f"/>
      </linearGradient>
      <linearGradient id="sprBrushTip" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#38bdf8"/><stop offset="50%" stop-color="#c084fc"/><stop offset="100%" stop-color="#f43f5e"/>
      </linearGradient>
      <linearGradient id="sprScrollPaper" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#fffbeb"/><stop offset="65%" stop-color="#fde68a"/><stop offset="100%" stop-color="#f59e0b"/>
      </linearGradient>
      <linearGradient id="sprScrollRoll" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#fef08a"/><stop offset="100%" stop-color="#b45309"/>
      </linearGradient>
      <linearGradient id="sprScrollSeal" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#fb7185"/><stop offset="100%" stop-color="#be123c"/>
      </linearGradient>
      <linearGradient id="sprTrophyGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#fff9db"/><stop offset="45%" stop-color="#ffd43b"/><stop offset="100%" stop-color="#d97706"/>
      </linearGradient>
      <linearGradient id="sprTrophyBase" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#92400e"/><stop offset="100%" stop-color="#451a03"/>
      </linearGradient>
      <linearGradient id="sprDsRoof" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#fff3bf"/><stop offset="100%" stop-color="#f59f00"/>
      </linearGradient>
      <linearGradient id="sprDsGem" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#e0f2fe"/><stop offset="50%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#0284c7"/>
      </linearGradient>
      <linearGradient id="sprTabBanMain" x1="10%" y1="10%" x2="90%" y2="90%">
        <stop offset="0%" stop-color="#fffbeb"/><stop offset="35%" stop-color="#fde047"/><stop offset="80%" stop-color="#f59e0b"/><stop offset="100%" stop-color="#b45309"/>
      </linearGradient>
      <linearGradient id="sprTabBanBack" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#fef08a"/><stop offset="100%" stop-color="#ca8a04"/>
      </linearGradient>
      <linearGradient id="sprTabBanLeaf" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#86efac"/><stop offset="100%" stop-color="#15803d"/>
      </linearGradient>
      <radialGradient id="sprTabMonFur" cx="35%" cy="28%" r="72%">
        <stop offset="0%" stop-color="#b4692e"/><stop offset="55%" stop-color="#7c4218"/><stop offset="100%" stop-color="#3f1e09"/>
      </radialGradient>
      <radialGradient id="sprTabMonSkin" cx="45%" cy="35%" r="70%">
        <stop offset="0%" stop-color="#ffedd5"/><stop offset="100%" stop-color="#f1b67a"/>
      </radialGradient>
      <linearGradient id="sprCrownGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#fffbeb"/><stop offset="45%" stop-color="#fde047"/><stop offset="100%" stop-color="#d97706"/>
      </linearGradient>
      <linearGradient id="sprCrownBand" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#b45309"/><stop offset="50%" stop-color="#fbbf24"/><stop offset="100%" stop-color="#92400e"/>
      </linearGradient>
      <linearGradient id="sprPlatCrown" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ffffff"/><stop offset="42%" stop-color="#bae6fd"/><stop offset="80%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#0284c7"/>
      </linearGradient>
      <linearGradient id="sprPlatBand" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#0369a1"/><stop offset="50%" stop-color="#7dd3fc"/><stop offset="100%" stop-color="#0c4a6e"/>
      </linearGradient>

      <linearGradient id="sprTwGold1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#fef08a"/><stop offset="100%" stop-color="#d97706"/>
      </linearGradient>
      <linearGradient id="sprTwGlass2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#e0f2fe" stop-opacity="0.35"/><stop offset="100%" stop-color="#38bdf8" stop-opacity="0.2"/>
      </linearGradient>
      <linearGradient id="sprTwBlue5" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#1d4ed8"/>
      </linearGradient>
      <linearGradient id="sprTwPurple12" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#f472b6"/><stop offset="100%" stop-color="#7c3aed"/>
      </linearGradient>
      <linearGradient id="sprTwPortal" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#c084fc"/><stop offset="50%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#fde047"/>
      </linearGradient>
      <linearGradient id="sprOffNight" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1e1b4b"/><stop offset="100%" stop-color="#0f172a"/>
      </linearGradient>
      <radialGradient id="sprCocoShell" cx="35%" cy="30%" r="72%">
        <stop offset="0%" stop-color="#b4692e"/><stop offset="52%" stop-color="#78350f"/><stop offset="100%" stop-color="#381605"/>
      </radialGradient>
      <radialGradient id="sprCocoGemGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#7dd3fc" stop-opacity="0.65"/><stop offset="100%" stop-color="#38bdf8" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="sprBookCover" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#4ade80"/><stop offset="50%" stop-color="#15803d"/><stop offset="100%" stop-color="#064e3b"/>
      </linearGradient>
      <linearGradient id="sprBookPageL" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#fffbeb"/><stop offset="80%" stop-color="#fef3c7"/><stop offset="100%" stop-color="#d97706"/>
      </linearGradient>
      <linearGradient id="sprBookPageR" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#f59e0b"/><stop offset="20%" stop-color="#fef3c7"/><stop offset="100%" stop-color="#fffbeb"/>
      </linearGradient>
      <linearGradient id="sprColCase" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#fef3c7"/><stop offset="45%" stop-color="#d97706"/><stop offset="100%" stop-color="#78350f"/>
      </linearGradient>
      <linearGradient id="sprColCard" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ffffff"/><stop offset="55%" stop-color="#e2e8f0"/><stop offset="100%" stop-color="#94a3b8"/>
      </linearGradient>
      <linearGradient id="sprLevelCore" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#86efac"/><stop offset="55%" stop-color="#16a34a"/><stop offset="100%" stop-color="#052e16"/>
      </linearGradient>
    </defs>

    <symbol id="ico-diamond" viewBox="0 0 32 32">
      <polygon points="8.5,5 23.5,5 29.5,12.5 16,28.5 2.5,12.5" fill="#0369a1"/>
      <polygon points="8.5,5 12,12.5 2.5,12.5" fill="#e0f2fe"/>
      <polygon points="8.5,5 23.5,5 20,12.5 12,12.5" fill="url(#sprGemTop)"/>
      <polygon points="23.5,5 29.5,12.5 20,12.5" fill="#38bdf8"/>
      <polygon points="2.5,12.5 12,12.5 16,28.5" fill="url(#sprGemMid)"/>
      <polygon points="12,12.5 20,12.5 16,28.5" fill="#38bdf8"/>
      <polygon points="20,12.5 29.5,12.5 16,28.5" fill="url(#sprGemDark)"/>
      <polygon points="10.2,6.4 21.8,6.4 19.2,11.2 12.8,11.2" fill="#ffffff" opacity="0.48"/>
      <path d="M 2.5 12.5 L 29.5 12.5 M 8.5 5 L 12 12.5 L 16 28.5 M 23.5 5 L 20 12.5 L 16 28.5" fill="none" stroke="rgba(255,255,255,0.72)" stroke-width="0.9" stroke-linejoin="round"/>
      <polygon points="8.5,5 23.5,5 29.5,12.5 16,28.5 2.5,12.5" fill="none" stroke="#082f49" stroke-width="1.35" stroke-linejoin="round"/>
      <path d="M 6.5 2.5 L 7.2 4.3 L 9 5 L 7.2 5.7 L 6.5 7.5 L 5.8 5.7 L 4 5 L 5.8 4.3 Z" fill="#ffffff"/>
    </symbol>

    <symbol id="ico-daily" viewBox="0 0 32 32">
      <rect x="4.5" y="7" width="23" height="20.5" rx="4" fill="#13261b" stroke="url(#sprCrownGold)" stroke-width="1.6"/>
      <path d="M 4.5 11 C 4.5 8.8, 6.3 7, 8.5 7 L 23.5 7 C 25.7 7, 27.5 8.8, 27.5 11 L 27.5 13 L 4.5 13 Z" fill="#16a34a" stroke="#052e16" stroke-width="1"/>
      <rect x="9.5" y="4.2" width="2.6" height="5" rx="1.2" fill="#fde047" stroke="#78350f" stroke-width="0.9"/>
      <rect x="19.9" y="4.2" width="2.6" height="5" rx="1.2" fill="#fde047" stroke="#78350f" stroke-width="0.9"/>
      <polygon points="16,15.2 20.8,18.6 16,25 11.2,18.6" fill="#0284c7" stroke="#e0f2fe" stroke-width="0.9" stroke-linejoin="round"/>
      <polygon points="13.6,15.2 18.4,15.2 20.8,18.6 11.2,18.6" fill="#bae6fd"/>
      <polygon points="11.2,18.6 20.8,18.6 16,25" fill="#38bdf8"/>
      <path d="M 24.5 4 L 25.2 5.6 L 26.8 6.3 L 25.2 7 L 24.5 8.6 L 23.8 7 L 22.2 6.3 L 23.8 5.6 Z" fill="#fef08a"/>
    </symbol>

    <symbol id="ico-level" viewBox="0 0 36 36">
      <polygon points="18,3 29.5,9.5 29.5,24.5 18,33 6.5,24.5 6.5,9.5" fill="url(#sprLevelCore)" stroke="url(#sprCrownGold)" stroke-width="2" stroke-linejoin="round"/>
      <polygon points="18,6 26.8,11 26.8,23 18,29.5 9.2,23 9.2,11" fill="none" stroke="#bbf7d0" stroke-width="0.9" opacity="0.45"/>
      <polygon points="18,8.5 20.6,14 26.6,14.8 22.2,19 23.3,25 18,22.1 12.7,25 13.8,19 9.4,14.8 15.4,14" fill="url(#sprCrownGold)" stroke="#78350f" stroke-width="1" stroke-linejoin="round"/>
      <polygon points="18,10.5 19.6,14.5 23.8,15.1 20.8,18 21.5,22.2 18,20.2 14.5,22.2 15.2,18 12.2,15.1 16.4,14.5" fill="#fffbeb" opacity="0.55"/>
      <path d="M 18 4.5 L 18.6 6 L 20.1 6.6 L 18.6 7.2 L 18 8.7 L 17.4 7.2 L 15.9 6.6 L 17.4 6 Z" fill="#ffffff">
        <animate attributeName="opacity" values="0.4;1;0.4" dur="1.8s" repeatCount="indefinite"/>
      </path>
    </symbol>

    <symbol id="ico-star-off" viewBox="0 0 24 24">
      <polygon fill="#34463b" points="12,12.5 9.4,8.9 12,2"/>
      <polygon fill="#27372d" points="12,12.5 12,2 14.6,8.9"/>
      <polygon fill="#34463b" points="12,12.5 14.6,8.9 22,9.3"/>
      <polygon fill="#1c2921" points="12,12.5 22,9.3 16.2,13.9"/>
      <polygon fill="#27372d" points="12,12.5 16.2,13.9 18.2,21"/>
      <polygon fill="#1c2921" points="12,12.5 18.2,21 12,16.9"/>
      <polygon fill="#141e18" points="12,12.5 12,16.9 5.8,21"/>
      <polygon fill="#27372d" points="12,12.5 5.8,21 7.8,13.9"/>
      <polygon fill="#1c2921" points="12,12.5 7.8,13.9 2,9.3"/>
      <polygon fill="#3f5246" points="12,12.5 2,9.3 9.4,8.9"/>
      <path d="M 12 2 L 12 12.5 M 22 9.3 L 12 12.5 M 18.2 21 L 12 12.5 M 5.8 21 L 12 12.5 M 2 9.3 L 12 12.5" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.6" stroke-linecap="round"/>
      <polygon points="12,2 14.6,8.9 22,9.3 16.2,13.9 18.2,21 12,16.9 5.8,21 7.8,13.9 2,9.3 9.4,8.9" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="1.15" stroke-linejoin="round"/>
      <path d="M 4.4 9.7 L 9.8 9.4 L 11.7 4.2" fill="none" stroke="rgba(255,255,255,0.14)" stroke-width="0.9" stroke-linecap="round" stroke-linejoin="round"/>
    </symbol>

    <symbol id="ico-star-lit" viewBox="0 0 24 24">
      <polygon fill="#fef08a" points="12,12.5 9.4,8.9 12,2"/>
      <polygon fill="#facc15" points="12,12.5 12,2 14.6,8.9"/>
      <polygon fill="#fef08a" points="12,12.5 14.6,8.9 22,9.3"/>
      <polygon fill="#eab308" points="12,12.5 22,9.3 16.2,13.9"/>
      <polygon fill="#facc15" points="12,12.5 16.2,13.9 18.2,21"/>
      <polygon fill="#eab308" points="12,12.5 18.2,21 12,16.9"/>
      <polygon fill="#b45309" points="12,12.5 12,16.9 5.8,21"/>
      <polygon fill="#facc15" points="12,12.5 5.8,21 7.8,13.9"/>
      <polygon fill="#eab308" points="12,12.5 7.8,13.9 2,9.3"/>
      <polygon fill="#fffbeb" points="12,12.5 2,9.3 9.4,8.9"/>
      <path d="M 12 2 L 12 12.5 M 22 9.3 L 12 12.5 M 18.2 21 L 12 12.5 M 5.8 21 L 12 12.5 M 2 9.3 L 12 12.5" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="0.6" stroke-linecap="round"/>
      <polygon points="12,2 14.6,8.9 22,9.3 16.2,13.9 18.2,21 12,16.9 5.8,21 7.8,13.9 2,9.3 9.4,8.9" fill="none" stroke="#92400e" stroke-width="1.15" stroke-linejoin="round"/>
      <path d="M 4.4 9.7 L 9.8 9.4 L 11.7 4.2" fill="none" stroke="#ffffff" stroke-width="0.9" stroke-linecap="round" stroke-linejoin="round"/>
      <path fill="#ffffff" d="M 12 4.2 L 12.6 5.8 L 14.2 6.4 L 12.6 7 L 12 8.6 L 11.4 7 L 9.8 6.4 L 11.4 5.8 Z"/>
    </symbol>

    <symbol id="ico-tap" viewBox="0 0 48 48">
      <circle cx="22" cy="11" r="10.5" fill="url(#sprTapRing)"/>
      <path d="M 13.5 15.5 A 9.5 9.5 0 0 1 30.5 15.5" fill="none" stroke="#fde047" stroke-width="1.8" stroke-linecap="round" opacity="0.85"/>
      <path d="M 10 13.5 A 13.5 13.5 0 0 1 34 13.5" fill="none" stroke="#facc15" stroke-width="1.3" stroke-linecap="round" stroke-dasharray="3 3" opacity="0.7"/>
      <path d="M 35 6 L 35.8 8 L 37.8 8.8 L 35.8 9.6 L 35 11.6 L 34.2 9.6 L 32.2 8.8 L 34.2 8 Z" fill="#fef08a"/>
      <path d="M 9 7.5 L 9.6 9.1 L 11.2 9.7 L 9.6 10.3 L 9 11.9 L 8.4 10.3 L 6.8 9.7 L 8.4 9.1 Z" fill="#fff"/>
      <path d="M 19 25 L 19 12.2 C 19 9.5, 25 9.5, 25 12.2 L 25 22 C 26.2 21.2, 28.5 21.4, 29.4 23 C 30.8 22.3, 33 22.6, 33.8 24.4 C 35.2 23.8, 37.2 24.6, 37.4 26.8 L 37.2 33.8 C 37.1 37.2, 34.5 39.8, 31 40.4 L 20.8 40.4 C 17.5 39.8, 15.2 37.6, 13.6 34.6 L 10.8 29.6 C 9.8 27.8, 11.5 25.6, 13.5 26.3 C 15 26.8, 16.5 28.4, 17.6 30.2 L 19 25 Z" fill="url(#sprTapSkin)" stroke="#451a03" stroke-width="1.4" stroke-linejoin="round"/>
      <path d="M 20.5 12.4 C 20.5 11, 23.5 11, 23.5 12.4 L 23.5 14.5 C 22.5 15.1, 21.5 15.1, 20.5 14.5 Z" fill="#fff5eb" opacity="0.85"/>
      <path d="M 20.4 18.2 Q 22 18.7 23.6 18.2" fill="none" stroke="#a15320" stroke-width="1" stroke-linecap="round" opacity="0.7"/>
      <path d="M 25 22 L 25 28.5 M 29.4 23 L 29.3 29.2 M 33.8 24.4 L 33.5 30" fill="none" stroke="#6b2f0b" stroke-width="1.2" stroke-linecap="round"/>
      <path d="M 26.2 24.2 Q 27.4 23.8 28.2 25.2 M 30.5 25.2 Q 31.7 24.8 32.5 26.2" fill="none" stroke="#fff5eb" stroke-width="1.1" stroke-linecap="round" opacity="0.65"/>
      <path d="M 19.6 32.8 Q 25 31 30.2 33.5" fill="none" stroke="#a15320" stroke-width="1.1" stroke-linecap="round" opacity="0.55"/>
      <rect x="17.5" y="39.5" width="16.8" height="5.5" rx="2.2" fill="url(#sprTapCuff)" stroke="#052e16" stroke-width="1.3"/>
      <circle cx="31" cy="42.2" r="1.2" fill="#fde047"/>
    </symbol>

    <symbol id="ico-settings" viewBox="0 0 32 32">
      <path d="M 13.7 3.2 L 18.3 3.2 L 19 6.6 C 20 6.9, 20.9 7.3, 21.7 7.8 L 24.6 5.9 L 27.8 9.1 L 25.9 12 C 26.4 12.8, 26.8 13.7, 27.1 14.7 L 30.5 15.4 L 30.5 20 L 27.1 20.7 C 26.8 21.7, 26.4 22.6, 25.9 23.4 L 27.8 26.3 L 24.6 29.5 L 21.7 27.6 C 20.9 28.1, 20 28.5, 19 28.8 L 18.3 32.2 L 13.7 32.2 L 13 28.8 C 12 28.5, 11.1 28.1, 10.3 27.6 L 7.4 29.5 L 4.2 26.3 L 6.1 23.4 C 5.6 22.6, 5.2 21.7, 4.9 20.7 L 1.5 20 L 1.5 15.4 L 4.9 14.7 C 5.2 13.7, 5.6 12.8, 6.1 12 L 4.2 9.1 L 7.4 5.9 L 10.3 7.8 C 11.1 7.3, 12 6.9, 13 6.6 Z" transform="translate(0,-1.7)" fill="url(#sprSndOnBody)" stroke="#0f172a" stroke-width="1.5" stroke-linejoin="round"/>
      <circle cx="16" cy="16" r="6.4" fill="#132018" stroke="#0f172a" stroke-width="1.3"/>
      <circle cx="16" cy="16" r="3.4" fill="url(#sprCrownGold)" stroke="#451a03" stroke-width="1"/>
    </symbol>

    <symbol id="ico-rate-bps" viewBox="0 0 32 32">
      <rect x="13" y="2.5" width="6" height="3" rx="1.2" fill="#facc15" stroke="#451a03" stroke-width="1"/>
      <line x1="16" y1="5.5" x2="16" y2="7.5" stroke="#78350f" stroke-width="2"/>
      <path d="M 23.5 6.5 L 26 9" stroke="#fde047" stroke-width="2.4" stroke-linecap="round"/>
      <circle cx="16" cy="18" r="11" fill="url(#sprCrownGold)" stroke="#451a03" stroke-width="1.4"/>
      <circle cx="16" cy="18" r="8.2" fill="#0f2419" stroke="#4ade80" stroke-width="1.1"/>
      <circle cx="16" cy="11.5" r="0.9" fill="#fef08a"/>
      <circle cx="22.5" cy="18" r="0.9" fill="#fef08a"/>
      <circle cx="16" cy="24.5" r="0.9" fill="#fef08a"/>
      <circle cx="9.5" cy="18" r="0.9" fill="#fef08a"/>
      <line x1="16" y1="18" x2="16" y2="12.8" stroke="#4ade80" stroke-width="2" stroke-linecap="round"/>
      <line x1="16" y1="18" x2="20.4" y2="18" stroke="#fde047" stroke-width="1.8" stroke-linecap="round"/>
      <circle cx="16" cy="18" r="1.6" fill="#ffffff"/>
    </symbol>

    <symbol id="ico-play" viewBox="0 0 28 28">
      <circle cx="14" cy="14" r="12.5" fill="#14532d" stroke="#fde047" stroke-width="1.8"/>
      <circle cx="14" cy="14" r="9.5" fill="#166534"/>
      <polygon points="11.2,8.8 20.8,14 11.2,19.2" fill="url(#sprPlayTri)" stroke="#451a03" stroke-width="1" stroke-linejoin="round"/>
    </symbol>

    <symbol id="ico-custom" viewBox="0 0 36 36">
      <path d="M 16 7 C 8 7, 4 13, 5 20 C 6 27, 13 30, 18 28 C 21 27, 21 24, 24 23 C 28 22, 31 18, 30 13 C 29 9, 23 7, 16 7 Z" fill="url(#sprPalWood)" stroke="#451a03" stroke-width="1.3"/>
      <path d="M 8 13 C 10 9.5, 16 8.5, 22 9.5" fill="none" stroke="#fffbeb" stroke-width="1.2" stroke-linecap="round" opacity="0.5"/>
      <circle cx="11" cy="23" r="2.3" fill="#2e1065" stroke="#451a03" stroke-width="1"/>
      <circle cx="10.2" cy="15" r="2.5" fill="#fb7185" stroke="#881337" stroke-width="0.7"/>
      <circle cx="15.2" cy="10.8" r="2.4" fill="#fde047" stroke="#854d0e" stroke-width="0.7"/>
      <circle cx="21.5" cy="11.2" r="2.4" fill="#4ade80" stroke="#14532d" stroke-width="0.7"/>
      <circle cx="25.5" cy="15.8" r="2.4" fill="#38bdf8" stroke="#0c4a6e" stroke-width="0.7"/>
      <g transform="translate(24, 15) rotate(36)">
        <path d="M -1.5 -12.5 L 1.5 -12.5 L 1.2 -1 L -1.2 -1 Z" fill="#f59e0b" stroke="#451a03" stroke-width="1"/>
        <rect x="-1.5" y="-1" width="3" height="3" rx="0.6" fill="#e2e8f0" stroke="#475569" stroke-width="0.8"/>
        <path d="M -1.5 2 C -2.2 4.8, -1.2 8, 0 9.6 C 1.2 8, 2.2 4.8, 1.5 2 Z" fill="url(#sprBrushTip)" stroke="#4c1d95" stroke-width="0.8"/>
      </g>
      <path d="M 6.5 4.5 L 7.3 6.7 L 9.5 7.5 L 7.3 8.3 L 6.5 10.5 L 5.7 8.3 L 3.5 7.5 L 5.7 6.7 Z" fill="#f0abfc"/>
    </symbol>

    <symbol id="ico-quests" viewBox="0 0 36 36">
      <rect x="4.5" y="5.5" width="27" height="3" rx="1.5" fill="#78350f"/>
      <rect x="4.5" y="27.5" width="27" height="3" rx="1.5" fill="#78350f"/>
      <rect x="8" y="7" width="20" height="22" rx="1.5" fill="url(#sprScrollPaper)" stroke="#78350f" stroke-width="1.2"/>
      <rect x="7" y="4.8" width="22" height="4.2" rx="2" fill="url(#sprScrollRoll)" stroke="#78350f" stroke-width="1.1"/>
      <rect x="7" y="27" width="22" height="4.2" rx="2" fill="url(#sprScrollRoll)" stroke="#78350f" stroke-width="1.1"/>
      <path d="M 10.5 13.8 L 12.2 15.5 L 15.2 12" fill="none" stroke="#16a34a" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>
      <line x1="17.5" y1="13.8" x2="25" y2="13.8" stroke="#78350f" stroke-width="1.9" stroke-linecap="round"/>
      <path d="M 10.5 18.8 L 12.2 20.5 L 15.2 17" fill="none" stroke="#16a34a" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>
      <line x1="17.5" y1="18.8" x2="24" y2="18.8" stroke="#78350f" stroke-width="1.9" stroke-linecap="round"/>
      <circle cx="12.5" cy="23.6" r="1.4" fill="#d97706"/>
      <line x1="16.2" y1="23.6" x2="21" y2="23.6" stroke="#92400e" stroke-width="1.8" stroke-linecap="round"/>
      <polygon points="24.5,26 23.5,33.5 26,31.5 28.5,33.5 27.5,26" fill="#e11d48" stroke="#881337" stroke-width="0.8"/>
      <circle cx="26" cy="24.5" r="4.3" fill="url(#sprScrollSeal)" stroke="#ffe4e6" stroke-width="1"/>
      <polygon points="26,22.2 26.7,23.6 28.2,23.8 27.1,24.8 27.4,26.3 26,25.6 24.6,26.3 24.9,24.8 23.8,23.8 25.3,23.6" fill="#fef08a"/>
      <path d="M 5 11 L 5.7 13 L 7.7 13.7 L 5.7 14.4 L 5 16.4 L 4.3 14.4 L 2.3 13.7 L 4.3 13 Z" fill="#fef08a"/>
    </symbol>

    <symbol id="ico-ach" viewBox="0 0 36 36">
      <path d="M 10.5 9.5 C 5 9.5, 5 18, 11.5 18.5" fill="none" stroke="url(#sprTrophyGold)" stroke-width="2.4" stroke-linecap="round"/>
      <path d="M 25.5 9.5 C 31 9.5, 31 18, 24.5 18.5" fill="none" stroke="url(#sprTrophyGold)" stroke-width="2.4" stroke-linecap="round"/>
      <path d="M 16 20 L 20 20 L 21 25.5 L 15 25.5 Z" fill="url(#sprTrophyGold)" stroke="#92400e" stroke-width="1"/>
      <rect x="12.5" y="25" width="11" height="3.5" rx="1" fill="#f59f00" stroke="#78350f" stroke-width="1"/>
      <rect x="10" y="28.2" width="16" height="4.2" rx="1.4" fill="url(#sprTrophyBase)" stroke="#ffd43b" stroke-width="1"/>
      <rect x="14.5" y="29.6" width="7" height="1.5" rx="0.6" fill="#ffd43b"/>
      <path d="M 9.5 7 L 26.5 7 C 26.5 17.5, 22.5 21.5, 18 22 C 13.5 21.5, 9.5 17.5, 9.5 7 Z" fill="url(#sprTrophyGold)" stroke="#92400e" stroke-width="1.2" stroke-linejoin="round"/>
      <rect x="8.5" y="5.5" width="19" height="3" rx="1.5" fill="#fff3bf" stroke="#b45309" stroke-width="1.1"/>
      <path d="M 12.2 10.2 C 12.4 14.8, 13.8 17.6, 15.6 19.2" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity="0.68"/>
      <polygon points="18,10.5 19.1,12.8 21.6,13.1 19.8,14.9 20.2,17.4 18,16.2 15.8,17.4 16.2,14.9 14.4,13.1 16.9,12.8" fill="#4ade80" stroke="#14532d" stroke-width="0.9" stroke-linejoin="round"/>
      <path d="M 6 4.5 L 6.8 6.5 L 8.8 7.3 L 6.8 8.1 L 6 10.1 L 5.2 8.1 L 3.2 7.3 L 5.2 6.5 Z" fill="#fef08a"/>
      <path d="M 30 20.5 L 30.7 22.3 L 32.5 23 L 30.7 23.7 L 30 25.5 L 29.3 23.7 L 27.5 23 L 29.3 22.3 Z" fill="#86efac"/>
    </symbol>

    <symbol id="ico-guide" viewBox="0 0 36 36">
      <rect x="3.5" y="9" width="29" height="20.5" rx="2.8" fill="url(#sprBookCover)" stroke="#451a03" stroke-width="1.4"/>
      <rect x="4.5" y="27.2" width="27" height="2" rx="1" fill="#facc15" opacity="0.8"/>
      <path d="M 5.5 7.5 Q 12 6 18 9.2 L 18 26.5 Q 12 24 5.5 26 Z" fill="url(#sprBookPageL)" stroke="#78350f" stroke-width="1.2" stroke-linejoin="round"/>
      <path d="M 30.5 7.5 Q 24 6 18 9.2 L 18 26.5 Q 24 24 30.5 26 Z" fill="url(#sprBookPageR)" stroke="#78350f" stroke-width="1.2" stroke-linejoin="round"/>
      <polygon points="15.5,24.8 15.5,32.5 17.5,30.5 19.5,32.5 19.5,24.8" fill="#ef4444" stroke="#7f1d1d" stroke-width="0.9" stroke-linejoin="round"/>
      <line x1="8" y1="12.2" x2="15" y2="13.2" stroke="#92400e" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="8" y1="15.8" x2="15" y2="16.8" stroke="#92400e" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="8" y1="19.4" x2="13.5" y2="20.1" stroke="#b45309" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M 27.5 11.8 C 26 15, 23.5 17.5, 20.2 18.2 C 21.5 19.5, 26 19, 28 13 Z" fill="#facc15" stroke="#78350f" stroke-width="1" stroke-linejoin="round"/>
      <line x1="20.5" y1="21.5" x2="27.5" y2="20.5" stroke="#92400e" stroke-width="1.4" stroke-linecap="round"/>
      <path d="M 18 3.2 L 18.8 5.2 L 20.8 6 L 18.8 6.8 L 18 8.8 L 17.2 6.8 L 15.2 6 L 17.2 5.2 Z" fill="#fef08a">
        <animate attributeName="opacity" values="0.4;1;0.4" dur="1.9s" repeatCount="indefinite"/>
      </path>
    </symbol>

    <symbol id="ico-collections" viewBox="0 0 36 36">
      <rect x="4" y="13" width="28" height="17" rx="3.2" fill="url(#sprColCase)" stroke="#451a03" stroke-width="1.4"/>
      <rect x="6.5" y="8" width="11" height="14" rx="2" transform="rotate(-9 12 15)" fill="url(#sprColCard)" stroke="#475569" stroke-width="1.1"/>
      <rect x="18.5" y="7" width="11" height="14" rx="2" transform="rotate(9 24 14)" fill="url(#sprCrownGold)" stroke="#78350f" stroke-width="1.1"/>
      <rect x="12.5" y="5" width="11" height="15" rx="2" fill="#f8fafc" stroke="#1e293b" stroke-width="1.2"/>
      <polygon points="18,8.5 19.2,11 21.8,11.3 19.9,13.1 20.4,15.7 18,14.4 15.6,15.7 16.1,13.1 14.2,11.3 16.8,11" fill="#f59e0b" stroke="#78350f" stroke-width="0.7"/>
      <rect x="4" y="17.5" width="28" height="12.5" rx="2.5" fill="url(#sprColCase)" stroke="#451a03" stroke-width="1.3"/>
      <line x1="4" y1="21.5" x2="32" y2="21.5" stroke="#fef08a" stroke-width="1.4" opacity="0.75"/>
      <rect x="15.2" y="19.5" width="5.6" height="5" rx="1.2" fill="url(#sprCrownGold)" stroke="#451a03" stroke-width="1"/>
      <circle cx="18" cy="22" r="1.1" fill="#451a03"/>
      <path d="M 6 5.5 L 6.7 7.2 L 8.4 7.9 L 6.7 8.6 L 6 10.3 L 5.3 8.6 L 3.6 7.9 L 5.3 7.2 Z" fill="#fef08a">
        <animate attributeName="opacity" values="0.35;1;0.35" dur="1.7s" repeatCount="indefinite"/>
      </path>
    </symbol>

    <symbol id="ico-wheel" viewBox="0 0 36 36">
      <circle cx="18" cy="19" r="14.5" fill="#451a03"/>
      <circle cx="18" cy="19" r="13.5" fill="url(#sprCrownGold)" stroke="#451a03" stroke-width="1.2"/>
      <g>
        <animateTransform attributeName="transform" type="rotate" from="0 18 19" to="360 18 19" dur="9s" repeatCount="indefinite"/>
        <path d="M 18 19 L 18 7.5 A 11.5 11.5 0 0 1 26.1 10.9 Z" fill="#0ea5e9"/>
        <path d="M 18 19 L 26.1 10.9 A 11.5 11.5 0 0 1 29.5 19 Z" fill="#ec4899"/>
        <path d="M 18 19 L 29.5 19 A 11.5 11.5 0 0 1 26.1 27.1 Z" fill="#f59e0b"/>
        <path d="M 18 19 L 26.1 27.1 A 11.5 11.5 0 0 1 18 30.5 Z" fill="#22c55e"/>
        <path d="M 18 19 L 18 30.5 A 11.5 11.5 0 0 1 9.9 27.1 Z" fill="#8b5cf6"/>
        <path d="M 18 19 L 9.9 27.1 A 11.5 11.5 0 0 1 6.5 19 Z" fill="#ef4444"/>
        <path d="M 18 19 L 6.5 19 A 11.5 11.5 0 0 1 9.9 10.9 Z" fill="#14b8a6"/>
        <path d="M 18 19 L 9.9 10.9 A 11.5 11.5 0 0 1 18 7.5 Z" fill="#fde047"/>
        <g stroke="#fef08a" stroke-width="0.9" opacity="0.85">
          <line x1="18" y1="7.5" x2="18" y2="30.5"/>
          <line x1="6.5" y1="19" x2="29.5" y2="19"/>
          <line x1="9.9" y1="10.9" x2="26.1" y2="27.1"/>
          <line x1="26.1" y1="10.9" x2="9.9" y2="27.1"/>
        </g>
        <g fill="#fffbeb">
          <circle cx="18" cy="6.4" r="1.1"/><circle cx="26.9" cy="10.1" r="1.1"/>
          <circle cx="30.6" cy="19" r="1.1"/><circle cx="26.9" cy="27.9" r="1.1"/>
          <circle cx="18" cy="31.6" r="1.1"/><circle cx="9.1" cy="27.9" r="1.1"/>
          <circle cx="5.4" cy="19" r="1.1"/><circle cx="9.1" cy="10.1" r="1.1"/>
        </g>
      </g>
      <circle cx="18" cy="19" r="11.5" fill="none" stroke="#78350f" stroke-width="1"/>
      <path d="M 9.5 13 A 10 10 0 0 1 26.5 13" fill="none" stroke="#ffffff" stroke-width="1.6" stroke-linecap="round" opacity="0.38"/>
      <circle cx="18" cy="19" r="4.3" fill="#142219" stroke="#fef08a" stroke-width="1.6"/>
      <polygon points="18,16.4 19.6,19 18,21.6 16.4,19" fill="#fde047"/>
      <polygon points="18,1.5 14.5,8.2 21.5,8.2" fill="#ef4444" stroke="#fef08a" stroke-width="1.2" stroke-linejoin="round"/>
      <circle cx="18" cy="3.6" r="1" fill="#fff"/>
    </symbol>

    <symbol id="ico-coconuts" viewBox="0 0 36 36">
      <ellipse cx="18" cy="32.2" rx="10" ry="2" fill="rgba(0,0,0,0.4)"/>
      <g>
        <animateTransform attributeName="transform" type="rotate" values="-4 18 11;4 18 11;-4 18 11" dur="3.4s" repeatCount="indefinite"/>
        <path d="M 18 10.5 Q 25 2.5 31.5 8 Q 25 13 18 12 Z" fill="#4ade80" stroke="#052e16" stroke-width="1.1" stroke-linejoin="round"/>
        <path d="M 18 10.5 Q 11 2.5 4.5 8 Q 11 13 18 12 Z" fill="#22c55e" stroke="#052e16" stroke-width="1.1" stroke-linejoin="round"/>
        <path d="M 18 10.5 Q 20.5 3.5 24 3 Q 21.5 8.5 18 11 Z" fill="#86efac" stroke="#14532d" stroke-width="0.9" stroke-linejoin="round"/>
      </g>
      <circle cx="18" cy="21" r="11" fill="url(#sprCocoShell)" stroke="#291003" stroke-width="1.4"/>
      <path d="M 10.5 15.5 A 9 9 0 0 1 24 13" fill="none" stroke="#fde68a" stroke-width="1.4" stroke-linecap="round" opacity="0.35"/>
      <circle cx="14.5" cy="15.2" r="1.2" fill="#291003"/>
      <circle cx="21.5" cy="15.2" r="1.2" fill="#291003"/>
      <path d="M 9 20.5 L 12.5 23 L 15 20.5 L 18 23.2 L 21 20.5 L 23.5 23 L 27 20.5" fill="none" stroke="#fef08a" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round" opacity="0.55"/>
      <circle cx="18" cy="24.2" r="7.2" fill="url(#sprCocoGemGlow)"/>
      <g transform="translate(18, 24)">
        <g>
          <animateTransform attributeName="transform" type="scale" values="1;1.12;1" dur="2.2s" repeatCount="indefinite"/>
          <polygon points="0,-5 4.8,-1.6 0,5 -4.8,-1.6" fill="#0284c7" stroke="#e0f2fe" stroke-width="1" stroke-linejoin="round"/>
          <polygon points="-2.6,-5 2.6,-5 4.8,-1.6 -4.8,-1.6" fill="#bae6fd"/>
          <polygon points="-2.6,-5 2.6,-5 1.4,-1.6 -1.4,-1.6" fill="#ffffff" opacity="0.75"/>
          <polygon points="-4.8,-1.6 4.8,-1.6 0,5" fill="#38bdf8"/>
        </g>
      </g>
      <path d="M 27.5 13 L 28.2 14.8 L 30 15.5 L 28.2 16.2 L 27.5 18 L 26.8 16.2 L 25 15.5 L 26.8 14.8 Z" fill="#fef08a">
        <animate attributeName="opacity" values="0.35;1;0.35" dur="1.8s" repeatCount="indefinite"/>
      </path>
    </symbol>

    <symbol id="ico-dshop" viewBox="0 0 36 36">
      <rect x="5.5" y="16" width="25" height="16" rx="3.2" fill="#13251b" stroke="#ffd43b" stroke-width="1.5"/>
      <rect x="8.2" y="19.5" width="12.5" height="9.2" rx="2.2" fill="#082f49" stroke="#38bdf8" stroke-width="1.15"/>
      <circle cx="14.4" cy="24.1" r="5.6" fill="url(#sprCocoGemGlow)">
        <animate attributeName="opacity" values="0.45;1;0.45" dur="2s" repeatCount="indefinite"/>
      </circle>
      <g>
        <polygon points="14.4,20.4 18.6,23.2 14.4,27.8 10.2,23.2" fill="url(#sprDsGem)" stroke="#e0f2fe" stroke-width="0.7" stroke-linejoin="round"/>
        <polygon points="12.2,20.4 16.6,20.4 18.6,23.2 10.2,23.2" fill="#bae6fd" opacity="0.75"/>
      </g>
      <rect x="22.4" y="19.5" width="5.4" height="12.3" rx="1.4" fill="#78350f" stroke="#facc15" stroke-width="1"/>
      <circle cx="26.3" cy="25.8" r="0.85" fill="#fef08a"/>
      <path d="M 3.5 16.5 L 6.8 8.2 L 29.2 8.2 L 32.5 16.5 Z" fill="url(#sprDsRoof)" stroke="#78350f" stroke-width="1.4" stroke-linejoin="round"/>
      <path d="M 10.8 8.4 L 9.5 16.4 M 18 8.4 L 18 16.4 M 25.2 8.4 L 26.5 16.4" stroke="#dc2626" stroke-width="2.5"/>
      <path d="M 3.5 16.5 Q 7.1 19.3 10.7 16.5 Q 14.3 19.3 18 16.5 Q 21.7 19.3 25.3 16.5 Q 28.9 19.3 32.5 16.5" fill="none" stroke="#fff3bf" stroke-width="1.8" stroke-linecap="round"/>
      <g>
        <circle cx="27.5" cy="7.5" r="5.8" fill="#0c1e2e" stroke="#fde047" stroke-width="1.6"/>
        <circle cx="27.5" cy="7.5" r="4" fill="#0f172a"/>
        <line x1="27.5" y1="7.5" x2="27.5" y2="4.4" stroke="#38bdf8" stroke-width="1.35" stroke-linecap="round">
          <animateTransform attributeName="transform" type="rotate" from="0 27.5 7.5" to="360 27.5 7.5" dur="4s" repeatCount="indefinite"/>
        </line>
        <line x1="27.5" y1="7.5" x2="29.8" y2="7.5" stroke="#fde047" stroke-width="1.35" stroke-linecap="round"/>
        <circle cx="27.5" cy="7.5" r="1" fill="#fff"/>
      </g>
      <path d="M 6 3.5 L 6.8 5.5 L 8.8 6.3 L 6.8 7.1 L 6 9.1 L 5.2 7.1 L 3.2 6.3 L 5.2 5.5 Z" fill="#fef08a">
        <animate attributeName="opacity" values="0.3;1;0.3" dur="1.7s" repeatCount="indefinite"/>
      </path>
    </symbol>

    <symbol id="ico-tab-bananas" viewBox="0 0 36 36">
      <path d="M 18 7 C 13 4, 7 6, 5 12 C 11 14, 16 12, 18 7 Z" fill="url(#sprTabBanLeaf)" stroke="#052e16" stroke-width="1.1"/>
      <path d="M 22 7 C 20 15, 14 23, 5 26 C 4 27, 4.5 29, 7 29.5 C 21 31, 29 20, 25 8 Z" fill="url(#sprTabBanBack)" stroke="#78350f" stroke-width="1.1"/>
      <path d="M 27 9 C 24 18, 17 26, 7 29 C 5.5 29.5, 6 31.8, 8.5 32.2 C 25 33.5, 33 21, 29.5 10 Z" fill="url(#sprTabBanMain)" stroke="#78350f" stroke-width="1.2" stroke-linejoin="round"/>
      <path d="M 26 9 L 28.5 4.8 L 30.8 6 L 29.5 10 Z" fill="#78350f" stroke="#451a03" stroke-width="1"/>
      <path d="M 25.5 13 C 22.5 20, 17.5 25.5, 11 28.5" fill="none" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" opacity="0.65"/>
      <path d="M 6.5 29.8 Q 7.5 28.5 8.8 29.6 Q 8.4 31.5 7 31.8 Z" fill="#451a03"/>
      <path d="M 9 11 L 9.8 13.2 L 12 14 L 9.8 14.8 L 9 17 L 8.2 14.8 L 6 14 L 8.2 13.2 Z" fill="#fef08a"/>
    </symbol>

    <symbol id="ico-tab-monkeys" viewBox="0 0 36 36">
      <circle cx="6.5" cy="17.5" r="4.8" fill="url(#sprTabMonFur)" stroke="#291204" stroke-width="1.2"/>
      <circle cx="6.5" cy="17.5" r="2.6" fill="url(#sprTabMonSkin)"/>
      <circle cx="29.5" cy="17.5" r="4.8" fill="url(#sprTabMonFur)" stroke="#291204" stroke-width="1.2"/>
      <circle cx="29.5" cy="17.5" r="2.6" fill="url(#sprTabMonSkin)"/>
      <path d="M 15 8 Q 18 3.5 21 7.5 Q 23.5 5 23 9.5 Z" fill="#7c4218" stroke="#291204" stroke-width="1"/>
      <ellipse cx="18" cy="18.5" rx="11.5" ry="10.8" fill="url(#sprTabMonFur)" stroke="#291204" stroke-width="1.2"/>
      <circle cx="14" cy="16.5" r="4.6" fill="url(#sprTabMonSkin)"/>
      <circle cx="22" cy="16.5" r="4.6" fill="url(#sprTabMonSkin)"/>
      <ellipse cx="18" cy="22.8" rx="8.6" ry="5.8" fill="url(#sprTabMonSkin)"/>
      <circle cx="14.2" cy="16.5" r="2" fill="#1c0d04"/><circle cx="21.8" cy="16.5" r="2" fill="#1c0d04"/>
      <circle cx="14.8" cy="15.8" r="0.7" fill="#ffffff"/><circle cx="22.4" cy="15.8" r="0.7" fill="#ffffff"/>
      <ellipse cx="11.2" cy="21.8" rx="1.8" ry="1" fill="#fb7185" opacity="0.45"/>
      <ellipse cx="24.8" cy="21.8" rx="1.8" ry="1" fill="#fb7185" opacity="0.45"/>
      <circle cx="16.5" cy="20.8" r="0.8" fill="#451a03"/><circle cx="19.5" cy="20.8" r="0.8" fill="#451a03"/>
      <path d="M 14 23.8 Q 18 27 22 23.8" fill="none" stroke="#451a03" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M 29 5.5 L 29.7 7.3 L 31.5 8 L 29.7 8.7 L 29 10.5 L 28.3 8.7 L 26.5 8 L 28.3 7.3 Z" fill="#fde047"/>
    </symbol>

    <symbol id="ico-tab-premium" viewBox="0 0 36 36">
      <path d="M 5 25 L 4 11 L 11.5 18 L 18 7.5 L 24.5 18 L 32 11 L 31 25 Z" fill="url(#sprCrownGold)" stroke="#78350f" stroke-width="1.4" stroke-linejoin="round"/>
      <rect x="5" y="24.5" width="26" height="4.8" rx="2" fill="url(#sprCrownBand)" stroke="#451a03" stroke-width="1.2"/>
      <circle cx="4" cy="10" r="2.2" fill="#fef08a" stroke="#78350f" stroke-width="1"/>
      <circle cx="18" cy="6.8" r="2.6" fill="#fffbeb" stroke="#78350f" stroke-width="1"/>
      <circle cx="32" cy="10" r="2.2" fill="#fef08a" stroke="#78350f" stroke-width="1"/>
      <polygon points="18,14.5 21,18.5 18,22.5 15,18.5" fill="#38bdf8" stroke="#e0f2fe" stroke-width="0.8"/>
      <circle cx="11" cy="20.5" r="1.6" fill="#f43f5e"/>
      <circle cx="25" cy="20.5" r="1.6" fill="#f43f5e"/>
      <path d="M 8 5.5 L 8.7 7.3 L 10.5 8 L 8.7 8.7 L 8 10.5 L 7.3 8.7 L 5.5 8 L 7.3 7.3 Z" fill="#ffffff"/>
    </symbol>

    <symbol id="ico-tab-platinum" viewBox="0 0 36 36">
      <path d="M 5 25 L 4 11 L 11.5 18 L 18 7 L 24.5 18 L 32 11 L 31 25 Z" fill="url(#sprPlatCrown)" stroke="#082f49" stroke-width="1.4" stroke-linejoin="round"/>
      <rect x="5" y="24.5" width="26" height="4.8" rx="2" fill="url(#sprPlatBand)" stroke="#082f49" stroke-width="1.2"/>
      <circle cx="4" cy="10" r="2.2" fill="#e0f2fe" stroke="#0369a1" stroke-width="1"/>
      <circle cx="18" cy="6.4" r="2.7" fill="#ffffff" stroke="#0284c7" stroke-width="1"/>
      <circle cx="32" cy="10" r="2.2" fill="#e0f2fe" stroke="#0369a1" stroke-width="1"/>
      <polygon points="18,14.2 21.4,18.6 18,23 14.6,18.6" fill="#f0abfc" stroke="#ffffff" stroke-width="0.9"/>
      <circle cx="11" cy="20.5" r="1.7" fill="#38bdf8" stroke="#e0f2fe" stroke-width="0.6"/>
      <circle cx="25" cy="20.5" r="1.7" fill="#38bdf8" stroke="#e0f2fe" stroke-width="0.6"/>
      <path d="M 8 5.2 L 8.7 7 L 10.5 7.7 L 8.7 8.4 L 8 10.2 L 7.3 8.4 L 5.5 7.7 L 7.3 7 Z" fill="#ffffff"/>
      <path d="M 28.5 5.2 L 29.1 6.7 L 30.6 7.3 L 29.1 7.9 L 28.5 9.4 L 27.9 7.9 L 26.4 7.3 L 27.9 6.7 Z" fill="#bae6fd"/>
    </symbol>

    <symbol id="ico-warp-1h" viewBox="0 0 48 48">
      <rect x="21" y="5" width="6" height="5" rx="1.5" fill="#d97706"/>
      <circle cx="24" cy="5.5" r="3" fill="none" stroke="#fef08a" stroke-width="2"/>
      <circle cx="24" cy="26" r="16" fill="url(#sprTwGold1)" stroke="#78350f" stroke-width="1.5"/>
      <circle cx="24" cy="26" r="12.5" fill="#0c1e26" stroke="#38bdf8" stroke-width="1.2"/>
      <circle cx="24" cy="16" r="1" fill="#94a3b8"/><circle cx="24" cy="36" r="1" fill="#94a3b8"/>
      <circle cx="14" cy="26" r="1" fill="#94a3b8"/><circle cx="34" cy="26" r="1" fill="#94a3b8"/>
      <line x1="24" y1="26" x2="24" y2="18.5" stroke="#38bdf8" stroke-width="2.2" stroke-linecap="round"/>
      <line x1="24" y1="26" x2="29.5" y2="23" stroke="#fef08a" stroke-width="2.2" stroke-linecap="round"/>
      <circle cx="24" cy="26" r="2" fill="#facc15"/>
    </symbol>

    <symbol id="ico-warp-2h" viewBox="0 0 48 48">
      <rect x="12" y="6" width="24" height="4.5" rx="2" fill="#facc15" stroke="#92400e" stroke-width="1.3"/>
      <rect x="12" y="37.5" width="24" height="4.5" rx="2" fill="#facc15" stroke="#92400e" stroke-width="1.3"/>
      <path d="M 15 10.5 C 15 20, 21 22, 22 24 C 21 26, 15 28, 15 37.5 L 33 37.5 C 33 28, 27 26, 26 24 C 27 22, 33 20, 33 10.5 Z" fill="url(#sprTwGlass2)" stroke="#7dd3fc" stroke-width="1.5"/>
      <path d="M 17.5 15.5 L 30.5 15.5 C 29 20, 25.5 22, 24 23 C 22.5 22, 19 20, 17.5 15.5 Z" fill="#fde047"/>
      <path d="M 24 24 L 24 34" stroke="#fde047" stroke-width="1.6" stroke-dasharray="2 2"/>
      <path d="M 17 37.5 C 19 32, 29 32, 31 37.5 Z" fill="#f59e0b"/>
      <circle cx="35" cy="14" r="1.4" fill="#fef08a"/>
    </symbol>

    <symbol id="ico-warp-5h" viewBox="0 0 48 48">
      <circle cx="24" cy="24" r="18" fill="#0c1e2e" stroke="url(#sprTwBlue5)" stroke-width="3"/>
      <path d="M 24 8 A 16 16 0 1 1 9.5 31" fill="none" stroke="#67e8f9" stroke-width="2" stroke-linecap="round" stroke-dasharray="4 3"/>
      <polygon points="14,17 24,24 14,31" fill="#38bdf8"/>
      <polygon points="24,17 35,24 24,31" fill="#fef08a" stroke="#f59e0b" stroke-width="1" stroke-linejoin="round"/>
      <circle cx="36" cy="11" r="1.6" fill="#fef08a"/>
    </symbol>

    <symbol id="ico-warp-12h" viewBox="0 0 48 48">
      <circle cx="24" cy="24" r="18" fill="#1b0e2e" stroke="url(#sprTwPurple12)" stroke-width="3"/>
      <circle cx="24" cy="24" r="13" fill="none" stroke="#f472b6" stroke-width="1.5" stroke-dasharray="5 3"/>
      <polygon points="17,18 24,24 17,30" fill="#f472b6"/>
      <polygon points="24,18 31,24 24,30" fill="#fde047"/>
      <polygon points="31,18 37,24 31,30" fill="#67e8f9"/>
      <path d="M 12 10 L 12.8 12.2 L 15 13 L 12.8 13.8 L 12 16 L 11.2 13.8 L 9 13 L 11.2 12.2 Z" fill="#fef08a"/>
    </symbol>

    <symbol id="ico-warp-24h" viewBox="0 0 48 48">
      <circle cx="24" cy="24" r="18.5" fill="#130d26" stroke="url(#sprTwPortal)" stroke-width="2.8"/>
      <circle cx="24" cy="24" r="13.5" fill="none" stroke="#c084fc" stroke-width="1.8" stroke-dasharray="6 3"/>
      <circle cx="24" cy="24" r="8.5" fill="#1e1b4b" stroke="#67e8f9" stroke-width="1.5"/>
      <line x1="24" y1="24" x2="24" y2="18" stroke="#fef08a" stroke-width="2.2" stroke-linecap="round"/>
      <line x1="24" y1="24" x2="28.5" y2="26.5" stroke="#67e8f9" stroke-width="2" stroke-linecap="round"/>
      <circle cx="24" cy="24" r="2" fill="#fff"/>
      <path d="M 38 7 L 39 10 L 42 11 L 39 12 L 38 15 L 37 12 L 34 11 L 37 10 Z" fill="#fef08a"/>
      <path d="M 10 34 L 10.8 36.2 L 13 37 L 10.8 37.8 L 10 40 L 9.2 37.8 L 7 37 L 9.2 36.2 Z" fill="#67e8f9"/>
    </symbol>

    <symbol id="ico-offline-4h" viewBox="0 0 48 48">
      <circle cx="24" cy="24" r="18" fill="url(#sprOffNight)" stroke="#4ade80" stroke-width="2.5"/>
      <path d="M 27 13 A 10 10 0 1 0 36 27 A 8 8 0 1 1 27 13 Z" fill="#fef08a"/>
      <text x="24" y="34" text-anchor="middle" fill="#86efac" font-size="11" font-weight="900">4ч</text>
    </symbol>

    <symbol id="ico-offline-8h" viewBox="0 0 48 48">
      <circle cx="24" cy="24" r="18" fill="url(#sprOffNight)" stroke="#38bdf8" stroke-width="2.5"/>
      <path d="M 27 12 A 10 10 0 1 0 36 26 A 8 8 0 1 1 27 12 Z" fill="#bae6fd"/>
      <circle cx="34" cy="14" r="1.4" fill="#fef08a"/>
      <text x="24" y="34" text-anchor="middle" fill="#7dd3fc" font-size="11" font-weight="900">8ч</text>
    </symbol>

    <symbol id="ico-offline-12h" viewBox="0 0 48 48">
      <circle cx="24" cy="24" r="18" fill="url(#sprOffNight)" stroke="#facc15" stroke-width="2.5"/>
      <path d="M 27 12 A 10 10 0 1 0 36 26 A 8 8 0 1 1 27 12 Z" fill="#fde047"/>
      <path d="M 35 11 L 35.8 13 L 37.8 13.8 L 35.8 14.6 L 35 16.6 L 34.2 14.6 L 32.2 13.8 L 34.2 13 Z" fill="#fff"/>
      <text x="24" y="34" text-anchor="middle" fill="#fef08a" font-size="11" font-weight="900">12ч</text>
    </symbol>

    <symbol id="ico-coco-closed" viewBox="0 0 64 64">
      <ellipse cx="32" cy="54" rx="16" ry="3.5" fill="rgba(0,0,0,0.35)"/>
      <path d="M 32 10 Q 43 4 49 11 Q 40 16 32 14 Z" fill="#22c55e" stroke="#14532d" stroke-width="1.2"/>
      <path d="M 32 10 Q 22 4 16 11 Q 24 16 32 14 Z" fill="#16a34a" stroke="#14532d" stroke-width="1.2"/>
      <circle cx="32" cy="34" r="19" fill="url(#sprCocoShell)" stroke="#291003" stroke-width="1.6"/>
      <ellipse cx="26" cy="26" rx="4.5" ry="2.2" transform="rotate(-25 26 26)" fill="#fff" opacity="0.16"/>
      <circle cx="28" cy="22" r="2" fill="#291003"/>
      <circle cx="36" cy="22" r="2" fill="#291003"/>
      <circle cx="32" cy="27" r="2" fill="#291003"/>
      <text x="32" y="43" text-anchor="middle" fill="#fef08a" font-size="13" font-weight="900">?</text>
    </symbol>
  `;
  document.body.prepend(sprite);
}

function useSvg(id, cls = "") {
  return `<svg${cls ? ` class="${cls}"` : ""}><use href="#${id}"/></svg>`;
}

function gemHtml(cls = "inline-diamond") {
  return `<span class="${cls}">${useSvg("ico-diamond", "diamond-svg")}</span>`;
}

function injectUiIcons() {
  injectSvgSprite();
  document.querySelectorAll("[data-svg]").forEach((el) => {
    const id = el.dataset.svg;
    const cls = el.dataset.svgClass || "";
    el.innerHTML = useSvg(id, cls);
  });
}