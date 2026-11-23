function createFrameDecoSvg(f, uid = "fr") {
  const c1 = f.c1 || "#fff3bf";
  const c2 = f.c2 || "#f59e0b";
  const c3 = f.c3 || "#78350f";
  const gem = f.gem || c1;
  const gMain = `fm_${uid}_${f.id}`;
  const gDark = `fd_${uid}_${f.id}`;
  const gGem = `fg_${uid}_${f.id}`;
  const gRing = `frg_${uid}_${f.id}`;

  const ringHtml = `
    <circle cx="60" cy="60" r="36.2" fill="none" stroke="${c3}" stroke-width="8.6"/>
    <circle cx="60" cy="60" r="35.8" fill="none" stroke="url(#${gRing})" stroke-width="6.4"/>
    <circle cx="60" cy="60" r="32.4" fill="none" stroke="rgba(255,255,255,0.42)" stroke-width="1"/>
    <circle cx="60" cy="60" r="38.8" fill="none" stroke="rgba(0,0,0,0.45)" stroke-width="1"/>`;

  const gemDiamond = (y = 95, s = 1) => `
    <g transform="translate(60,${y}) scale(${s})">
      <polygon points="0,-10 11,0 0,10 -11,0" fill="${c3}" stroke="rgba(0,0,0,0.55)" stroke-width="1.2"/>
      <polygon points="0,-8 8.5,0 0,8 -8.5,0" fill="url(#${gGem})"/>
      <polygon points="0,-8 8.5,0 0,0" fill="#fff" opacity="0.48"/>
      <polygon points="0,0 8.5,0 0,8" fill="#000" opacity="0.22"/>
    </g>`;

  const gemHex = (y = 95, s = 1) => `
    <g transform="translate(60,${y}) scale(${s})">
      <polygon points="0,-10 9,-5 9,5 0,10 -9,5 -9,-5" fill="${c3}" stroke="rgba(0,0,0,0.55)" stroke-width="1.2"/>
      <polygon points="0,-7.6 6.8,-3.8 6.8,3.8 0,7.6 -6.8,3.8 -6.8,-3.8" fill="url(#${gGem})"/>
      <polygon points="0,-7.6 6.8,-3.8 0,0 -6.8,-3.8" fill="#fff" opacity="0.4"/>
    </g>`;

  const gemStar = (y = 95, s = 1) => `
    <g transform="translate(60,${y}) scale(${s})">
      <polygon points="0,-11 3.3,-3.6 11,-3 5,2.2 6.8,10 0,5.8 -6.8,10 -5,2.2 -11,-3 -3.3,-3.6" fill="url(#${gGem})" stroke="${c3}" stroke-width="1.3" stroke-linejoin="round"/>
      <polygon points="0,-11 3.3,-3.6 0,0 -3.3,-3.6" fill="#fff" opacity="0.45"/>
    </g>`;

  const gemHeart = (y = 95) => `
    <g transform="translate(60,${y})">
      <path d="M 0 -4 C -4 -10, -13 -6, -10 2 C -8 7, 0 11, 0 11 C 0 11, 8 7, 10 2 C 13 -6, 4 -10, 0 -4 Z" fill="url(#${gGem})" stroke="${c3}" stroke-width="1.4"/>
      <ellipse cx="-4" cy="-3" rx="2.5" ry="1.4" transform="rotate(-25 -4 -3)" fill="#fff" opacity="0.65"/>
    </g>`;

  const gemShield = (y = 95) => `
    <g transform="translate(60,${y})">
      <path d="M -9 -8 L 9 -8 L 8 2 Q 0 11 0 11 Q 0 11 -8 2 Z" fill="url(#${gMain})" stroke="${c3}" stroke-width="1.5"/>
      <path d="M -6 -5.5 L 6 -5.5 L 5.5 1 Q 0 7.5 0 7.5 Q 0 7.5 -5.5 1 Z" fill="url(#${gGem})" opacity="0.85"/>
    </g>`;

  const gemPearl = (y = 95) => `
    <g transform="translate(60,${y})">
      <circle cx="0" cy="0" r="10.5" fill="url(#${gMain})" stroke="${c3}" stroke-width="1.4"/>
      <circle cx="0" cy="0" r="7.4" fill="#ffffff"/>
      <circle cx="0" cy="0" r="7.4" fill="url(#${gGem})" opacity="0.22"/>
      <ellipse cx="-2.4" cy="-2.6" rx="2.8" ry="1.6" transform="rotate(-30 -2.4 -2.6)" fill="#ffffff"/>
    </g>`;

  const gemMoon = (y = 95) => `
    <g transform="translate(60,${y})">
      <circle cx="0" cy="0" r="10" fill="${c3}" stroke="${c1}" stroke-width="1.2"/>
      <circle cx="0" cy="0" r="7.8" fill="rgba(0,0,0,0.55)"/>
      <path d="M 2.5 -5.5 A 6 6 0 1 0 5.5 3.5 A 4.8 4.8 0 1 1 2.5 -5.5 Z" fill="${gem}"/>
    </g>`;

  let back = "";
  let front = "";

  switch (f.shape) {
    case "lotus":
      back = `
        <path d="M 27 68 Q 8 60, 12 36 Q 22 44, 29 52 Z" fill="url(#${gDark})" stroke="${c3}" stroke-width="1.2"/>
        <path d="M 93 68 Q 112 60, 108 36 Q 98 44, 91 52 Z" fill="url(#${gDark})" stroke="${c3}" stroke-width="1.2"/>
        <path d="M 29 79 Q 9 76, 8 56 Q 20 62, 31 66 Z" fill="url(#${gMain})" stroke="${c3}" stroke-width="1.2"/>
        <path d="M 91 79 Q 111 76, 112 56 Q 100 62, 89 66 Z" fill="url(#${gMain})" stroke="${c3}" stroke-width="1.2"/>`;
      front = gemDiamond(95, 1.05);
      break;

    case "jade_crown":
      back = `
        <path d="M 38 29 L 36 16 L 47 22 L 54 11 L 60 19 L 66 11 L 73 22 L 84 16 L 82 29 Z" fill="url(#${gMain})" stroke="${c3}" stroke-width="1.3" stroke-linejoin="round"/>
        <path d="M 27 42 Q 11 42, 14 58 Q 22 57, 29 53 Z" fill="url(#${gMain})" stroke="${c3}" stroke-width="1.2"/>
        <path d="M 93 42 Q 109 42, 106 58 Q 98 57, 91 53 Z" fill="url(#${gMain})" stroke="${c3}" stroke-width="1.2"/>
        <path d="M 25 56 Q 7 60, 14 76 Q 24 72, 30 67 Z" fill="url(#${gDark})" stroke="${c3}" stroke-width="1.2"/>
        <path d="M 95 56 Q 113 60, 106 76 Q 96 72, 90 67 Z" fill="url(#${gDark})" stroke="${c3}" stroke-width="1.2"/>
        <path d="M 30 74 Q 16 84, 28 93 Q 38 89, 44 84 Z" fill="url(#${gMain})" stroke="${c3}" stroke-width="1.2"/>
        <path d="M 90 74 Q 104 84, 92 93 Q 82 89, 76 84 Z" fill="url(#${gMain})" stroke="${c3}" stroke-width="1.2"/>`;
      front = gemHex(95, 0.95);
      break;

    case "sun_emperor":
      back = `
        <path d="M 42 25 L 44 12 L 53 19 L 60 7 L 67 19 L 76 12 L 78 25 Z" fill="url(#${gMain})" stroke="${c3}" stroke-width="1.3" stroke-linejoin="round"/>
        <circle cx="44" cy="11" r="2.2" fill="#fff"/><circle cx="60" cy="6" r="2.6" fill="#fff"/><circle cx="76" cy="11" r="2.2" fill="#fff"/>
        <polygon points="32,39 14,22 20,45 6,41 18,61 11,72 34,79" fill="url(#${gMain})" stroke="${c3}" stroke-width="1.3" stroke-linejoin="round"/>
        <polygon points="88,39 106,22 100,45 114,41 102,61 109,72 86,79" fill="url(#${gMain})" stroke="${c3}" stroke-width="1.3" stroke-linejoin="round"/>
        <polygon points="34,46 18,36 24,57 17,67 36,74" fill="url(#${gDark})" opacity="0.65"/>
        <polygon points="86,46 102,36 96,57 103,67 84,74" fill="url(#${gDark})" opacity="0.65"/>`;
      front = `
        <polygon points="44,88 76,88 70,104 60,111 50,104" fill="url(#${gDark})" stroke="${c3}" stroke-width="1.3"/>
        ${gemDiamond(94, 0.95)}`;
      break;

    case "crystal_cat":
      back = `
        <polygon points="27,48 21,21 44,32" fill="url(#${gMain})" stroke="${c3}" stroke-width="1.3" stroke-linejoin="round"/>
        <polygon points="93,48 99,21 76,32" fill="url(#${gMain})" stroke="${c3}" stroke-width="1.3" stroke-linejoin="round"/>
        <polygon points="29,43 25,27 39,34" fill="#fff" opacity="0.45"/>
        <polygon points="91,43 95,27 81,34" fill="#fff" opacity="0.45"/>
        <path d="M 24 54 Q 11 56, 15 74 Q 24 73, 30 68 Z" fill="url(#${gMain})" stroke="${c3}" stroke-width="1.2"/>
        <path d="M 96 54 Q 109 56, 105 74 Q 96 73, 90 68 Z" fill="url(#${gMain})" stroke="${c3}" stroke-width="1.2"/>`;
      front = `
        <polygon points="54,23 60,17 66,23 60,28" fill="url(#${gGem})" stroke="${c3}" stroke-width="1.1"/>
        ${gemDiamond(95, 1.1)}`;
      break;

    case "mint_laurel":
    case "emerald_laurel":
    case "star_laurel": {
      const leavesL = [
        "M 32 34 Q 18 28, 22 44 Q 29 44, 34 39 Z",
        "M 27 44 Q 11 42, 16 58 Q 25 56, 29 49 Z",
        "M 25 56 Q 9 59, 16 74 Q 26 70, 29 63 Z",
        "M 28 69 Q 15 78, 25 89 Q 34 83, 34 75 Z",
        "M 37 80 Q 28 93, 42 98 Q 47 90, 44 83 Z"
      ];
      const leavesR = [
        "M 88 34 Q 102 28, 98 44 Q 91 44, 86 39 Z",
        "M 93 44 Q 109 42, 104 58 Q 95 56, 91 49 Z",
        "M 95 56 Q 111 59, 104 74 Q 94 70, 91 63 Z",
        "M 92 69 Q 105 78, 95 89 Q 86 83, 86 75 Z",
        "M 83 80 Q 92 93, 78 98 Q 73 90, 76 83 Z"
      ];
      back = `
        <g fill="url(#${gMain})" stroke="${c3}" stroke-width="1.2" stroke-linejoin="round">
          ${leavesL.map((d) => `<path d="${d}"/>`).join("")}
          ${leavesR.map((d) => `<path d="${d}"/>`).join("")}
        </g>
        <polygon points="60,16 65,24 60,29 55,24" fill="url(#${gGem})" stroke="${c3}" stroke-width="1.1"/>`;
      front = f.shape === "star_laurel" ? gemStar(95, 1.05) : gemDiamond(95, 1.05);
      break;
    }

    case "flame_wreath":
      back = `
        <path d="M 32 38 Q 16 26, 22 44 Q 9 43, 18 60 Q 10 66, 23 79 Q 20 90, 40 92 L 38 78 L 28 58 Z" fill="url(#${gDark})" stroke="${c3}" stroke-width="1.3" stroke-linejoin="round"/>
        <path d="M 88 38 Q 104 26, 98 44 Q 111 43, 102 60 Q 110 66, 97 79 Q 100 90, 80 92 L 82 78 L 92 58 Z" fill="url(#${gDark})" stroke="${c3}" stroke-width="1.3" stroke-linejoin="round"/>
        <path d="M 28 48 Q 19 42, 23 55 Q 17 61, 27 72 Q 25 81, 37 83" fill="none" stroke="${c1}" stroke-width="2" stroke-linecap="round" opacity="0.75"/>
        <path d="M 92 48 Q 101 42, 97 55 Q 103 61, 93 72 Q 95 81, 83 83" fill="none" stroke="${c1}" stroke-width="2" stroke-linecap="round" opacity="0.75"/>
        <path d="M 52 25 Q 60 11, 68 25 Z" fill="url(#${gMain})" stroke="${c3}" stroke-width="1.2"/>`;
      front = gemDiamond(95, 1.08);
      break;

    case "heart_wings":
      back = `
        <path d="M 31 53 Q 8 40, 10 53 Q 16 58, 28 60 Z" fill="url(#${gMain})" stroke="${c3}" stroke-width="1.2"/>
        <path d="M 89 53 Q 112 40, 110 53 Q 104 58, 92 60 Z" fill="url(#${gMain})" stroke="${c3}" stroke-width="1.2"/>
        <path d="M 29 61 Q 7 55, 12 68 Q 20 71, 30 69 Z" fill="url(#${gDark})" stroke="${c3}" stroke-width="1.2"/>
        <path d="M 91 61 Q 113 55, 108 68 Q 100 71, 90 69 Z" fill="url(#${gDark})" stroke="${c3}" stroke-width="1.2"/>
        <path d="M 31 70 Q 14 72, 21 83 Q 31 83, 38 78 Z" fill="url(#${gMain})" stroke="${c3}" stroke-width="1.2"/>
        <path d="M 89 70 Q 106 72, 99 83 Q 89 83, 82 78 Z" fill="url(#${gMain})" stroke="${c3}" stroke-width="1.2"/>
        <polygon points="53,24 60,16 67,24 60,28" fill="url(#${gMain})" stroke="${c3}" stroke-width="1.1"/>`;
      front = gemHeart(95);
      break;

    case "castle":
      back = `
        <path d="M 38 30 L 38 17 L 46 17 L 46 22 L 54 22 L 54 15 L 66 15 L 66 22 L 74 22 L 74 17 L 82 17 L 82 30 Z" fill="url(#${gMain})" stroke="${c3}" stroke-width="1.4" stroke-linejoin="round"/>
        <path d="M 27 46 L 13 43 L 17 75 L 33 78 Z" fill="url(#${gDark})" stroke="${c3}" stroke-width="1.3" stroke-linejoin="round"/>
        <path d="M 93 46 L 107 43 L 103 75 L 87 78 Z" fill="url(#${gDark})" stroke="${c3}" stroke-width="1.3" stroke-linejoin="round"/>`;
      front = gemDiamond(95, 1.05);
      break;

    case "frost_star":
      back = `
        <g fill="url(#${gMain})" stroke="${c3}" stroke-width="1.2" stroke-linejoin="round">
          <polygon points="60,4 65,24 55,24"/>
          <polygon points="60,116 65,96 55,96"/>
          <polygon points="4,60 24,55 24,65"/>
          <polygon points="116,60 96,55 96,65"/>
          <polygon points="18,18 35,28 28,35"/>
          <polygon points="102,18 92,35 85,28"/>
          <polygon points="18,102 28,85 35,92"/>
          <polygon points="102,102 85,92 92,85"/>
        </g>
        <g fill="url(#${gDark})" stroke="${c3}" stroke-width="1">
          <polygon points="40,14 48,25 41,28"/>
          <polygon points="80,14 79,28 72,25"/>
          <polygon points="14,40 28,41 25,48"/>
          <polygon points="106,40 95,48 92,41"/>
          <polygon points="14,80 25,72 28,79"/>
          <polygon points="106,80 92,79 95,72"/>
        </g>`;
      front = gemDiamond(95, 1);
      break;

    case "paladin_swords":
      back = `
        <g stroke="${c3}" stroke-width="1.3" stroke-linejoin="round">
          <polygon points="22,22 27,17 94,84 89,89" fill="url(#${gMain})"/>
          <polygon points="98,22 93,17 26,84 31,89" fill="url(#${gMain})"/>
          <rect x="13" y="21" width="16" height="4.5" rx="2" transform="rotate(-45 21 23)" fill="${c1}"/>
          <rect x="91" y="21" width="16" height="4.5" rx="2" transform="rotate(45 99 23)" fill="${c1}"/>
          <path d="M 27 45 L 14 54 L 18 72 L 32 76 Z" fill="url(#${gDark})"/>
          <path d="M 93 45 L 106 54 L 102 72 L 88 76 Z" fill="url(#${gDark})"/>
          <polygon points="51,26 60,16 69,26" fill="url(#${gMain})"/>
        </g>`;
      front = gemShield(95);
      break;

    case "pearl_plume":
      back = `
        <path d="M 45 26 L 48 14 L 55 20 L 60 11 L 65 20 L 72 14 L 75 26 Z" fill="url(#${gMain})" stroke="${c3}" stroke-width="1.3" stroke-linejoin="round"/>
        <path d="M 29 34 Q 12 36, 17 51 Q 24 50, 29 46 Z" fill="url(#${gMain})" stroke="${c3}" stroke-width="1.2"/>
        <path d="M 91 34 Q 108 36, 103 51 Q 96 50, 91 46 Z" fill="url(#${gMain})" stroke="${c3}" stroke-width="1.2"/>
        <path d="M 26 48 Q 8 53, 15 68 Q 24 66, 29 60 Z" fill="url(#${gDark})" stroke="${c3}" stroke-width="1.2"/>
        <path d="M 94 48 Q 112 53, 105 68 Q 96 66, 91 60 Z" fill="url(#${gDark})" stroke="${c3}" stroke-width="1.2"/>
        <path d="M 28 64 Q 12 73, 22 85 Q 32 82, 36 76 Z" fill="url(#${gMain})" stroke="${c3}" stroke-width="1.2"/>
        <path d="M 92 64 Q 108 73, 98 85 Q 88 82, 84 76 Z" fill="url(#${gMain})" stroke="${c3}" stroke-width="1.2"/>`;
      front = gemPearl(95);
      break;

    case "gold_wings":
      back = `
        <path d="M 30 48 L 6 41 L 14 55 L 9 63 L 20 70 L 16 78 L 35 80 Z" fill="url(#${gMain})" stroke="${c3}" stroke-width="1.3" stroke-linejoin="round"/>
        <path d="M 90 48 L 114 41 L 106 55 L 111 63 L 100 70 L 104 78 L 85 80 Z" fill="url(#${gMain})" stroke="${c3}" stroke-width="1.3" stroke-linejoin="round"/>
        <path d="M 14 55 L 28 57 M 20 70 L 31 69" stroke="${c3}" stroke-width="1.4" stroke-linecap="round"/>
        <path d="M 106 55 L 92 57 M 100 70 L 89 69" stroke="${c3}" stroke-width="1.4" stroke-linecap="round"/>`;
      front = gemHex(95, 1.05);
      break;

    case "bat_wings":
      back = `
        <path d="M 31 48 Q 18 26, 7 37 Q 10 56, 11 72 Q 18 65, 23 73 Q 29 66, 36 78 Z" fill="url(#${gMain})" stroke="${c3}" stroke-width="1.3" stroke-linejoin="round"/>
        <path d="M 89 48 Q 102 26, 113 37 Q 110 56, 109 72 Q 102 65, 97 73 Q 91 66, 84 78 Z" fill="url(#${gMain})" stroke="${c3}" stroke-width="1.3" stroke-linejoin="round"/>
        <polygon points="52,25 60,15 68,25" fill="url(#${gMain})" stroke="${c3}" stroke-width="1.2"/>`;
      front = gemHex(95, 1.05);
      break;

    case "valkyrie_wings":
      back = `
        <path d="M 43 26 L 46 13 L 55 20 L 60 11 L 65 20 L 74 13 L 77 26 Z" fill="url(#${gMain})" stroke="${c3}" stroke-width="1.3" stroke-linejoin="round"/>
        <path d="M 30 47 L 5 35 L 12 52 L 8 62 L 19 71 L 18 81 L 37 82 Z" fill="url(#${gMain})" stroke="${c3}" stroke-width="1.3" stroke-linejoin="round"/>
        <path d="M 90 47 L 115 35 L 108 52 L 112 62 L 101 71 L 102 81 L 83 82 Z" fill="url(#${gMain})" stroke="${c3}" stroke-width="1.3" stroke-linejoin="round"/>
        <path d="M 30 56 L 16 54 L 22 68 L 34 73 Z" fill="url(#${gDark})" opacity="0.65"/>
        <path d="M 90 56 L 104 54 L 98 68 L 86 73 Z" fill="url(#${gDark})" opacity="0.65"/>`;
      front = gemStar(95, 1.1);
      break;

    case "gear_sun":
      back = `
        <g fill="url(#${gMain})" stroke="${c3}" stroke-width="1.3" stroke-linejoin="round">
          <polygon points="52,22 55,11 65,11 68,22"/>
          <polygon points="52,98 55,109 65,109 68,98"/>
          <polygon points="22,52 11,55 11,65 22,68"/>
          <polygon points="98,52 109,55 109,65 98,68"/>
          <polygon points="26,35 19,25 27,18 36,27"/>
          <polygon points="94,35 101,25 93,18 84,27"/>
          <polygon points="26,85 19,95 27,102 36,93"/>
          <polygon points="94,85 101,95 93,102 84,93"/>
        </g>`;
      front = gemDiamond(95, 1.05);
      break;

    case "moon_armor":
      back = `
        <path d="M 33 34 C 12 28, 4 37, 13 55 C 12 72, 23 86, 40 90 L 38 72 L 29 52 Z" fill="url(#${gDark})" stroke="${c3}" stroke-width="1.4" stroke-linejoin="round"/>
        <path d="M 87 34 C 108 28, 116 37, 107 55 C 108 72, 97 86, 80 90 L 82 72 L 91 52 Z" fill="url(#${gDark})" stroke="${c3}" stroke-width="1.4" stroke-linejoin="round"/>
        <path d="M 14 48 Q 22 44, 29 48 M 16 64 Q 24 61, 30 65" fill="none" stroke="${c1}" stroke-width="1.8" opacity="0.55" stroke-linecap="round"/>
        <path d="M 106 48 Q 98 44, 91 48 M 104 64 Q 96 61, 90 65" fill="none" stroke="${c1}" stroke-width="1.8" opacity="0.55" stroke-linecap="round"/>`;
      front = gemMoon(95);
      break;

    case "angel_white":
      back = `
        <path d="M 32 45 Q 11 40, 12 58 Q 10 77, 29 88 L 41 85 L 34 65 Z" fill="url(#${gMain})" stroke="${c3}" stroke-width="1.3" stroke-linejoin="round"/>
        <path d="M 88 45 Q 109 40, 108 58 Q 110 77, 91 88 L 79 85 L 86 65 Z" fill="url(#${gMain})" stroke="${c3}" stroke-width="1.3" stroke-linejoin="round"/>
        <path d="M 28 53 Q 15 53, 18 68 Q 22 77, 32 79" fill="none" stroke="#fff" stroke-width="2" opacity="0.7" stroke-linecap="round"/>
        <path d="M 92 53 Q 105 53, 102 68 Q 98 77, 88 79" fill="none" stroke="#fff" stroke-width="2" opacity="0.7" stroke-linecap="round"/>
        <polygon points="54,24 60,15 66,24 60,28" fill="url(#${gGem})" stroke="${c3}" stroke-width="1.2"/>`;
      front = gemDiamond(95, 1.08);
      break;

    case "mecha_dark":
    default:
      back = `
        <path d="M 32 42 L 12 24 L 18 47 L 8 49 L 21 66 L 14 75 L 36 86 Z" fill="url(#${gDark})" stroke="${c3}" stroke-width="1.3" stroke-linejoin="round"/>
        <path d="M 88 42 L 108 24 L 102 47 L 112 49 L 99 66 L 106 75 L 84 86 Z" fill="url(#${gDark})" stroke="${c3}" stroke-width="1.3" stroke-linejoin="round"/>
        <polygon points="24,42 15,34 19,45" fill="${gem}"/><polygon points="96,42 105,34 101,45" fill="${gem}"/>
        <polygon points="24,57 12,55 19,65" fill="${gem}"/><polygon points="96,57 108,55 101,65" fill="${gem}"/>
        <polygon points="29,73 18,75 26,83" fill="${gem}"/><polygon points="91,73 102,75 94,83" fill="${gem}"/>
        <polygon points="49,25 60,14 71,25" fill="url(#${gMain})" stroke="${c3}" stroke-width="1.2"/>
        <polygon points="56,22 60,17 64,22 60,25" fill="${gem}"/>`;
      front = gemHex(95, 1);
      break;
  }

  const sparkle = `
    <path class="svg-sparkle" d="M 32 29 L 33.8 34.2 L 39 36 L 33.8 37.8 L 32 43 L 30.2 37.8 L 25 36 L 30.2 34.2 Z" fill="#ffffff"/>`;

  return `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="${gMain}" x1="15%" y1="5%" x2="85%" y2="95%">
        <stop offset="0%" stop-color="${c1}"/>
        <stop offset="48%" stop-color="${c2}"/>
        <stop offset="100%" stop-color="${c3}"/>
      </linearGradient>
      <linearGradient id="${gDark}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${c2}"/>
        <stop offset="100%" stop-color="${c3}"/>
      </linearGradient>
      <linearGradient id="${gRing}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${c1}"/>
        <stop offset="50%" stop-color="${c2}"/>
        <stop offset="100%" stop-color="${c3}"/>
      </linearGradient>
      <linearGradient id="${gGem}" x1="10%" y1="0%" x2="90%" y2="100%">
        <stop offset="0%" stop-color="#ffffff"/>
        <stop offset="40%" stop-color="${gem}"/>
        <stop offset="100%" stop-color="${c3}"/>
      </linearGradient>
    </defs>
    ${back}
    ${ringHtml}
    ${front}
    ${sparkle}
  </svg>`;
}

function createBananaSvg(b, uid = "shop") {
  const id = `${uid}_${b.id}`;
  const gId = `bGrad_${id}`;
  const cId = `bClip_${id}`;
  const shId = `bShade_${id}`;
  const stId = `bStem_${id}`;
  const auId = `bAura_${id}`;

  const body = "M 44 13 C 39 27, 29 41, 12 47 C 9 48.5, 9.5 51.5, 13 52 C 44 54, 56 32, 48 16 Z";
  const clipDef = `<clipPath id="${cId}"><path d="${body}"/></clipPath>`;

  const grad = b.effect === "rainbow"
    ? `<linearGradient id="${gId}" x1="10%" y1="10%" x2="90%" y2="90%">
         <stop offset="0%" stop-color="#ff4d6d"/>
         <stop offset="25%" stop-color="#ffb703"/>
         <stop offset="50%" stop-color="#4ade80"/>
         <stop offset="75%" stop-color="#38bdf8"/>
         <stop offset="100%" stop-color="#c084fc"/>
       </linearGradient>`
    : `<linearGradient id="${gId}" x1="12%" y1="8%" x2="88%" y2="92%">
         <stop offset="0%" stop-color="${b.c1}"/>
         <stop offset="48%" stop-color="${b.c2}"/>
         <stop offset="100%" stop-color="${b.c3}"/>
       </linearGradient>`;

  const extraDefs = `
    <linearGradient id="${shId}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#000" stop-opacity="0"/>
      <stop offset="55%" stop-color="#000" stop-opacity="0.16"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0.42"/>
    </linearGradient>
    <linearGradient id="${stId}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#9a6b2f"/>
      <stop offset="100%" stop-color="#3f2308"/>
    </linearGradient>
    <radialGradient id="${auId}" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${b.c1}" stop-opacity="0.45"/>
      <stop offset="65%" stop-color="${b.c2}" stop-opacity="0.14"/>
      <stop offset="100%" stop-color="${b.c2}" stop-opacity="0"/>
    </radialGradient>`;

  let backFx = "";
  let innerFx = "";
  let frontFx = "";

  switch (b.effect) {
    case "none":
      innerFx = `
        <g clip-path="url(#${cId})" fill="#4a2c0f" opacity="0.24">
          <circle cx="44" cy="21" r="0.9"/><circle cx="46" cy="25" r="0.7"/>
          <circle cx="19" cy="48" r="0.8"/><circle cx="24" cy="46" r="0.6"/>
        </g>`;
      break;

    case "spotted":
      innerFx = `
        <g clip-path="url(#${cId})">
          <g fill="#5c3310" opacity="0.35">
            <circle cx="39" cy="24" r="3.2"/><circle cx="45" cy="31" r="3.6"/>
            <circle cx="34" cy="37" r="2.8"/><circle cx="40" cy="43" r="3.3"/>
            <circle cx="26" cy="46" r="3"/><circle cx="18" cy="49" r="2.4"/>
          </g>
          <g fill="#3a1d06" opacity="0.65">
            <circle cx="39" cy="24" r="1.9"/><circle cx="45" cy="31" r="2.2"/>
            <circle cx="34" cy="37" r="1.7"/><circle cx="40" cy="43" r="2"/>
            <circle cx="26" cy="46" r="1.8"/><circle cx="18" cy="49" r="1.4"/>
          </g>
        </g>`;
      break;

    case "striped":
      innerFx = `
        <g clip-path="url(#${cId})">
          <g stroke="${b.c3}" stroke-width="3.6" opacity="0.65">
            <line x1="32" y1="10" x2="54" y2="26"/>
            <line x1="24" y1="18" x2="52" y2="38"/>
            <line x1="16" y1="28" x2="46" y2="48"/>
            <line x1="8" y1="38" x2="36" y2="56"/>
          </g>
          <g stroke="${b.c1}" stroke-width="1" opacity="0.4">
            <line x1="31" y1="12" x2="53" y2="28"/>
            <line x1="23" y1="20" x2="51" y2="40"/>
            <line x1="15" y1="30" x2="45" y2="50"/>
          </g>
        </g>`;
      break;

    case "choco":
      innerFx = `
        <g clip-path="url(#${cId})">
          <path d="M 6 35 Q 18 32, 27 36 Q 31 38, 33 43 Q 36 47, 42 42 L 50 56 L 6 58 Z" fill="#4a220d"/>
          <path d="M 10 47 Q 23 48, 35 45 L 43 55 L 10 56 Z" fill="#2b1105" opacity="0.55"/>
          <path d="M 14 43 Q 22 41, 29 44" fill="none" stroke="#8c4f2b" stroke-width="1.8" stroke-linecap="round" opacity="0.8"/>
          <line x1="16" y1="47" x2="19" y2="45" stroke="#f472b6" stroke-width="1.6" stroke-linecap="round"/>
          <line x1="24" y1="49" x2="27" y2="47" stroke="#38bdf8" stroke-width="1.6" stroke-linecap="round"/>
          <line x1="31" y1="47" x2="33" y2="50" stroke="#fde047" stroke-width="1.6" stroke-linecap="round"/>
          <line x1="21" y1="44" x2="23" y2="42" stroke="#4ade80" stroke-width="1.6" stroke-linecap="round"/>
        </g>`;
      break;

    case "shine":
      backFx = `<circle cx="33" cy="34" r="24" fill="url(#${auId})"/>`;
      innerFx = `<path clip-path="url(#${cId})" d="M 24 14 L 54 32 L 50 38 L 20 20 Z" fill="#fff" opacity="0.28"/>`;
      frontFx = `
        <path class="svg-sparkle" d="M 18 19 L 19.8 23.2 L 24 25 L 19.8 26.8 L 18 31 L 16.2 26.8 L 12 25 L 16.2 23.2 Z" fill="#fff"/>
        <path class="svg-sparkle" d="M 51 42 L 52.3 45 L 55.3 46.3 L 52.3 47.6 L 51 50.6 L 49.7 47.6 L 46.7 46.3 L 49.7 45 Z" fill="#fef08a"/>`;
      break;

    case "crystal":
      backFx = `<circle cx="33" cy="34" r="24" fill="url(#${auId})"/>`;
      innerFx = `
        <g clip-path="url(#${cId})">
          <polygon points="44,13 48,22 39,26" fill="#fff" opacity="0.34"/>
          <polygon points="39,26 48,22 47,36 33,36" fill="#fff" opacity="0.16"/>
          <polygon points="33,36 47,36 37,48 23,44" fill="#000" opacity="0.14"/>
          <polygon points="23,44 37,48 13,52 12,47" fill="#fff" opacity="0.24"/>
          <polyline points="44,14 39,26 47,36 37,48 13,51" fill="none" stroke="#fff" stroke-width="1.1" opacity="0.75"/>
          <line x1="39" y1="26" x2="48" y2="22" stroke="#fff" stroke-width="0.9" opacity="0.65"/>
          <line x1="33" y1="36" x2="47" y2="36" stroke="#fff" stroke-width="0.9" opacity="0.65"/>
        </g>`;
      frontFx = `
        <path class="svg-sparkle" d="M 16 20 L 18 24.5 L 22.5 26.5 L 18 28.5 L 16 33 L 14 28.5 L 9.5 26.5 L 14 24.5 Z" fill="#fff"/>
        <path class="svg-sparkle" d="M 51 42 L 52.5 45.2 L 55.7 46.7 L 52.5 48.2 L 51 51.4 L 49.5 48.2 L 46.3 46.7 L 49.5 45.2 Z" fill="#e0f2fe"/>`;
      break;

    case "cyber":
      backFx = `<circle cx="33" cy="34" r="24" fill="url(#${auId})"/>`;
      innerFx = `
        <g clip-path="url(#${cId})" fill="none">
          <path d="M 45 18 L 39 27 L 43 33 L 34 42 L 24 46" stroke="#67e8f9" stroke-width="1.5" opacity="0.95"/>
          <path d="M 39 27 L 33 27 M 34 42 L 38 47" stroke="#f472b6" stroke-width="1.3" opacity="0.9"/>
          <circle cx="39" cy="27" r="1.8" fill="#67e8f9"/>
          <circle cx="34" cy="42" r="1.8" fill="#f472b6"/>
          <circle cx="24" cy="46" r="1.6" fill="#67e8f9"/>
        </g>`;
      frontFx = `<polygon class="svg-sparkle" points="20,18 16,26 20,26 17,33 25,24 20.5,24" fill="#67e8f9"/>`;
      break;

    case "fire":
      backFx = `
        <circle cx="33" cy="34" r="25" fill="url(#${auId})"/>
        <path d="M 19 31 C 14 23, 21 19, 20 12 C 25 16, 27 23, 24 29 Z" fill="#f97316"/>
        <path d="M 20 28 C 18 23, 21 21, 21 16 C 24 19, 24 24, 22 27 Z" fill="#fef08a"/>`;
      frontFx = `
        <path d="M 48 41 C 54 36, 56 42, 51 47 C 48 48, 46 44, 48 41 Z" fill="#f97316"/>
        <path d="M 49 42 C 52 39, 53 42, 50 45 Z" fill="#fef08a"/>
        <circle class="svg-sparkle" cx="15" cy="19" r="1.3" fill="#fef08a"/>
        <circle class="svg-sparkle" cx="53" cy="33" r="1.4" fill="#fb923c"/>`;
      break;

    case "frost":
      backFx = `<circle cx="33" cy="34" r="24" fill="url(#${auId})"/>`;
      innerFx = `<path clip-path="url(#${cId})" d="M 12 46 Q 28 42, 42 20 L 49 22 Q 36 46, 14 52 Z" fill="#fff" opacity="0.26"/>`;
      frontFx = `
        <g stroke="#fff" stroke-width="1.35" stroke-linecap="round" opacity="0.92">
          <line x1="18" y1="20" x2="18" y2="29"/><line x1="13.5" y1="24.5" x2="22.5" y2="24.5"/>
          <line x1="15" y1="21.5" x2="21" y2="27.5"/><line x1="21" y1="21.5" x2="15" y2="27.5"/>
        </g>
        <circle class="svg-sparkle" cx="51" cy="43" r="1.5" fill="#e0f2fe"/>
        <circle class="svg-sparkle" cx="25" cy="17" r="1.2" fill="#fff"/>`;
      break;

    case "cosmic":
      backFx = `
        <circle cx="33" cy="34" r="25" fill="url(#${auId})"/>
        <g transform="rotate(-32 33 34)">
          <path d="M 8 34 A 25 8 0 0 1 58 34" fill="none" stroke="${b.c1}" stroke-width="1.8" opacity="0.55"/>
        </g>`;
      innerFx = `
        <g clip-path="url(#${cId})">
          <circle cx="42" cy="24" r="1.2" fill="#fff"/>
          <circle cx="37" cy="36" r="1.6" fill="#fef08a"/>
          <circle cx="24" cy="46" r="1.2" fill="#67e8f9"/>
          <circle cx="45" cy="32" r="0.9" fill="#fff" opacity="0.8"/>
        </g>`;
      frontFx = `
        <g transform="rotate(-32 33 34)">
          <path d="M 58 34 A 25 8 0 0 1 8 34" fill="none" stroke="${b.c1}" stroke-width="1.8" opacity="0.88"/>
        </g>
        <path class="svg-sparkle" d="M 16 19 L 17.4 22.4 L 20.8 23.8 L 17.4 25.2 L 16 28.6 L 14.6 25.2 L 11.2 23.8 L 14.6 22.4 Z" fill="#fef08a"/>
        <circle class="svg-sparkle" cx="52" cy="44" r="1.5" fill="#67e8f9"/>`;
      break;

    case "rainbow":
      backFx = `<circle cx="33" cy="34" r="24" fill="url(#${auId})"/>`;
      frontFx = `
        <path class="svg-sparkle" d="M 17 20 L 18.6 23.6 L 22.2 25.2 L 18.6 26.8 L 17 30.4 L 15.4 26.8 L 11.8 25.2 L 15.4 23.6 Z" fill="#fff"/>
        <path class="svg-sparkle" d="M 51 41 L 52.4 44.2 L 55.6 45.6 L 52.4 47 L 51 50.2 L 49.6 47 L 46.4 45.6 L 49.6 44.2 Z" fill="#fef08a"/>`;
      break;

    case "divine":
      backFx = `
        <circle cx="33" cy="34" r="26" fill="url(#${auId})"/>
        <circle cx="33" cy="34" r="24" fill="none" stroke="${b.c1}" stroke-width="1.5" stroke-dasharray="5 3" opacity="0.8"/>`;
      frontFx = `
        <path class="svg-sparkle" d="M 16 17 L 18 22 L 23 24 L 18 26 L 16 31 L 14 26 L 9 24 L 14 22 Z" fill="#fff"/>
        <path class="svg-sparkle" d="M 51 40 L 52.6 44 L 56.6 45.6 L 52.6 47.2 L 51 51.2 L 49.4 47.2 L 45.4 45.6 L 49.4 44 Z" fill="#fef08a"/>`;
      break;
  }

  return `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <defs>${grad}${clipDef}${extraDefs}</defs>
    ${backFx}
    <ellipse cx="33" cy="56.5" rx="18" ry="2.6" fill="rgba(0,0,0,0.3)"/>
    <path d="M 44 13.5 C 45 10, 47 7.5, 49.5 6.5 L 52.5 8.5 C 50.5 10, 49 12.5, 48 16.5 Z" fill="url(#${stId})" stroke="#2a1604" stroke-width="1.1" stroke-linejoin="round"/>
    <ellipse cx="51" cy="7.5" rx="2.1" ry="1.1" transform="rotate(34 51 7.5)" fill="#e9d29c"/>
    <path d="${body}" fill="url(#${gId})"/>
    <path clip-path="url(#${cId})" d="M 48 16 C 56 32, 44 54, 13 52 C 33 49, 46 34, 46 15 Z" fill="url(#${shId})"/>
    ${innerFx}
    <path clip-path="url(#${cId})" d="M 45.5 14.5 C 46 31, 35 45, 12 49.5" fill="none" stroke="rgba(0,0,0,0.16)" stroke-width="2.2" stroke-linecap="round"/>
    <path clip-path="url(#${cId})" d="M 45 14 C 45.5 30.5, 34.5 44.5, 12 49" fill="none" stroke="${b.c1}" stroke-width="1.5" opacity="0.65" stroke-linecap="round"/>
    <path d="M 41 20 C 37 30, 29 39, 18 44.5" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity="0.5"/>
    <path d="M 10 49.2 Q 11.4 47.2, 13.4 48.6 Q 13 51.4, 11 51.8 Z" fill="#3b2209"/>
    <path d="${body}" fill="none" stroke="rgba(0,0,0,0.42)" stroke-width="1.35" stroke-linejoin="round"/>
    ${frontFx}
  </svg>`;
}

const monkeyImgCache = {};

window.onMonkeyImgLoad = function (img, cacheKey) {
  monkeyImgCache[cacheKey] = img.src;
  const fallback = img.nextElementSibling;
  if (fallback && fallback.tagName && fallback.tagName.toLowerCase() === "svg") {
    fallback.remove();
  }
};

window.onMonkeyImgError = function (img, cacheKey, basePath) {
  if (monkeyImgCache[cacheKey] === false) {
    img.style.display = "none";
    if (img.nextElementSibling) img.nextElementSibling.style.display = "block";
    return;
  }
  const exts = ["jpg", "webp"];
  const step = Number(img.dataset.t || 0);
  if (step < exts.length) {
    img.dataset.t = String(step + 1);
    img.src = `${basePath}.${exts[step]}`;
  } else {
    monkeyImgCache[cacheKey] = false;
    img.style.display = "none";
    if (img.nextElementSibling) img.nextElementSibling.style.display = "block";
  }
};

function createMonkeySvg(m, uid = "main", skinOverride = null) {
  let skinId = 0;
  if (skinOverride !== null && skinOverride !== undefined) {
    skinId = Number(skinOverride) || 0;
  } else if (uid !== "load" && typeof getMonkeyEquippedSkin === "function") {
    skinId = getMonkeyEquippedSkin(m.id);
  }

  const cacheKey = skinId > 0 ? `${m.id}_s${skinId}` : String(m.id);
  const basePath = skinId > 0 ? `img/skins/${m.id}/${skinId}` : `img/monkeys/${m.id}`;
  const cached = monkeyImgCache[cacheKey];
  if (cached === false) return buildFallbackMonkeySvg(m, uid, skinId);

  const lazy = uid === "shop" || String(uid).startsWith("skin") ? ` loading="lazy"` : "";
  if (typeof cached === "string") {
    return `<img class="monkey-img" src="${cached}" alt="${m.name}"${lazy}>`;
  }

  const svg = buildFallbackMonkeySvg(m, uid, skinId);
  return `<img class="monkey-img" src="${basePath}.png" alt="${m.name}"${lazy} onload="onMonkeyImgLoad(this,'${cacheKey}')" onerror="onMonkeyImgError(this,'${cacheKey}','${basePath}')">` +
         svg.replace("<svg ", `<svg style="display:none" `);
}