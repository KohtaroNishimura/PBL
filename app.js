const degreeDescriptions = {
  "1": "おうちみたいに、いちばん落ち着くコード",
  "4": "景色がひろがる感じのコード",
  "5": "つぎに進みたくなるコード",
  "6m": "ちょっとさみしい雰囲気のコード",
};

const keyMap = {
  C: { "1": "C", "4": "F", "5": "G", "6m": "Am" },
  G: { "1": "G", "4": "C", "5": "D", "6m": "Em" },
  D: { "1": "D", "4": "G", "5": "A", "6m": "Bm" },
  A: { "1": "A", "4": "D", "5": "E", "6m": "F#m" },
  F: { "1": "F", "4": "Bb", "5": "C", "6m": "Dm" },
};

const chordInfo = {
  C: {
    shape: ["e|-0-", "B|-1-", "G|-0-", "D|-2-", "A|-3-", "E|-x-"],
    fingering: "3弦の2フレット、2弦の1フレット、5弦の3フレットを押さえるよ。",
    tip: "5弦から下をゆっくり鳴らそう。",
  },
  D: {
    shape: ["e|-2-", "B|-3-", "G|-2-", "D|-0-", "A|-x-", "E|-x-"],
    fingering: "1弦2F、2弦3F、3弦2Fを押さえる三角の形。",
    tip: "4弦から下だけ鳴らすときれいに出るよ。",
  },
  Dm: {
    shape: ["e|-1-", "B|-3-", "G|-2-", "D|-0-", "A|-x-", "E|-x-"],
    fingering: "Dと似てるけど1弦が1フレットになるよ。",
    tip: "悲しい感じを作りやすいコード。",
  },
  E: {
    shape: ["e|-0-", "B|-0-", "G|-1-", "D|-2-", "A|-2-", "E|-0-"],
    fingering: "3弦1F、4弦2F、5弦2Fを押さえるよ。",
    tip: "6弦までしっかり鳴らせるパワフルな響き。",
  },
  Em: {
    shape: ["e|-0-", "B|-0-", "G|-0-", "D|-2-", "A|-2-", "E|-0-"],
    fingering: "4弦と5弦の2フレットだけで作れるよ。",
    tip: "とても押さえやすいmコード。",
  },
  F: {
    shape: ["e|-1-", "B|-1-", "G|-2-", "D|-3-", "A|-x-", "E|-x-"],
    fingering: "簡易版F。1弦と2弦を1フレットで押さえるよ。",
    tip: "全部押さえにくいときは、まず簡易版でOK。",
  },
  G: {
    shape: ["e|-3-", "B|-0-", "G|-0-", "D|-0-", "A|-2-", "E|-3-"],
    fingering: "6弦3F、5弦2F、1弦3Fの形。",
    tip: "明るく前に進む感じが出しやすい。",
  },
  A: {
    shape: ["e|-0-", "B|-2-", "G|-2-", "D|-2-", "A|-0-", "E|-x-"],
    fingering: "2,3,4弦を2フレットでそろえて押さえるよ。",
    tip: "5弦から下だけ鳴らそう。",
  },
  Am: {
    shape: ["e|-0-", "B|-1-", "G|-2-", "D|-2-", "A|-0-", "E|-x-"],
    fingering: "2弦1F、3弦2F、4弦2Fを押さえるよ。",
    tip: "Cと近い形なので覚えやすい。",
  },
  Bb: {
    shape: ["e|-1-", "B|-3-", "G|-3-", "D|-3-", "A|-1-", "E|-x-"],
    fingering: "人差し指で1フレットを押さえるバレーに近い形。",
    tip: "むずかしいときは先生と一緒に練習しよう。",
  },
  Bm: {
    shape: ["e|-2-", "B|-3-", "G|-4-", "D|-4-", "A|-2-", "E|-x-"],
    fingering: "2フレットセーハのmコード。",
    tip: "MVP外の少しむずかしい形。まず音が出ればOK。",
  },
  "F#m": {
    shape: ["e|-2-", "B|-2-", "G|-2-", "D|-4-", "A|-4-", "E|-2-"],
    fingering: "2フレットを押さえるバレーmコード。",
    tip: "むずかしい場合はF#m7の簡易形にしてもよい。",
  },
};

const state = {
  currentKey: null,
  currentDegree: null,
};

const homeScreen = document.getElementById("home-screen");
const keyScreen = document.getElementById("key-screen");
const chordScreen = document.getElementById("chord-screen");
const keyButtons = document.getElementById("key-buttons");
const keyTitle = document.getElementById("key-title");
const keySubtitle = document.getElementById("key-subtitle");
const degreeCards = document.getElementById("degree-cards");

const chordTitle = document.getElementById("chord-title");
const chordRole = document.getElementById("chord-role");
const chordKeyContext = document.getElementById("chord-key-context");
const chordForm = document.getElementById("chord-form");
const chordFingering = document.getElementById("chord-fingering");
const chordTip = document.getElementById("chord-tip");

document.getElementById("back-home").addEventListener("click", () => {
  showScreen("home");
});

document.getElementById("back-key").addEventListener("click", () => {
  showScreen("key");
});

function showScreen(name) {
  homeScreen.classList.remove("active");
  keyScreen.classList.remove("active");
  chordScreen.classList.remove("active");

  if (name === "home") {
    homeScreen.classList.add("active");
    return;
  }

  if (name === "key") {
    keyScreen.classList.add("active");
    return;
  }

  chordScreen.classList.add("active");
}

function renderHome() {
  keyButtons.innerHTML = "";
  Object.keys(keyMap).forEach((keyName) => {
    const button = document.createElement("button");
    button.textContent = `${keyName}キー`;
    button.addEventListener("click", () => openKey(keyName));
    keyButtons.appendChild(button);
  });
}

function openKey(keyName) {
  state.currentKey = keyName;
  keyTitle.textContent = `${keyName}キーのなかま`;
  keySubtitle.textContent = "数字は同じでも、コード名はキーごとに変わるよ。";

  const degrees = keyMap[keyName];
  degreeCards.innerHTML = "";

  Object.entries(degrees).forEach(([degree, chord]) => {
    const card = document.createElement("button");
    card.className = "degree-button";
    card.innerHTML = `
      <span class="degree-content">
        <span class="degree-title">${degree}</span>
        <span class="degree-chord">${chord}</span>
        <span class="degree-desc">${degreeDescriptions[degree]}</span>
      </span>
    `;
    card.addEventListener("click", () => openChord(degree, chord));
    degreeCards.appendChild(card);
  });

  showScreen("key");
}

function openChord(degree, chord) {
  state.currentDegree = degree;

  const info = chordInfo[chord] || {
    shape: ["e|-?-", "B|-?-", "G|-?-", "D|-?-", "A|-?-", "E|-?-"],
    fingering: "このコードの詳細はこれから追加予定です。",
    tip: "先生と一緒に形を確認しよう。",
  };

  chordTitle.textContent = `${chord} コード`;
  chordRole.textContent = `${degree} は「${degreeDescriptions[degree]}」だよ。`;
  chordKeyContext.textContent = `${state.currentKey}キーでは ${degree} = ${chord}`;
  chordForm.src = buildChordDiagramDataUrl(chord, info.shape);
  chordForm.alt = `${chord} のコードフォーム図`;
  chordFingering.textContent = info.fingering;
  chordTip.textContent = info.tip;

  showScreen("chord");
}

function buildChordDiagramDataUrl(chord, shapeLines) {
  const tokenHighToLow = shapeLines.map((line) => {
    const found = line.match(/\|-([^-\s]+)-/);
    return found ? found[1] : "?";
  });
  const tokenLowToHigh = [...tokenHighToLow].reverse();
  const stringLabels = ["E", "A", "D", "G", "B", "e"];

  const fretted = tokenLowToHigh
    .filter((token) => /^[0-9]+$/.test(token))
    .map((token) => Number(token))
    .filter((fret) => fret > 0);

  const startFret = 1;
  const visibleFrets = 5;

  const width = 260;
  const height = 330;
  const left = 36;
  const top = 56;
  const stringGap = 36;
  const fretGap = 42;
  const right = left + stringGap * 5;
  const bottom = top + fretGap * visibleFrets;

  const lines = [];
  lines.push(
    `<rect x="0" y="0" width="${width}" height="${height}" rx="14" fill="#fffdf7" stroke="#d8ccab" />`
  );
  lines.push(
    `<text x="${width / 2}" y="30" text-anchor="middle" font-size="22" font-weight="700" fill="#1f2530">${chord}</text>`
  );

  for (let i = 0; i < 6; i += 1) {
    const x = left + i * stringGap;
    lines.push(`<line x1="${x}" y1="${top}" x2="${x}" y2="${bottom}" stroke="#5c6370" stroke-width="1.5" />`);
  }

  for (let i = 0; i <= visibleFrets; i += 1) {
    const y = top + i * fretGap;
    const strokeWidth = i === 0 && startFret === 1 ? 6 : 1.5;
    lines.push(`<line x1="${left}" y1="${y}" x2="${right}" y2="${y}" stroke="#5c6370" stroke-width="${strokeWidth}" />`);
  }

  tokenLowToHigh.forEach((token, i) => {
    const x = left + i * stringGap;

    if (token.toLowerCase() === "x") {
      lines.push(`<text x="${x}" y="${top - 16}" text-anchor="middle" font-size="16" fill="#5c6370">X</text>`);
      return;
    }

    if (token === "0") {
      lines.push(`<text x="${x}" y="${top - 16}" text-anchor="middle" font-size="16" fill="#5c6370">O</text>`);
      return;
    }

    if (/^[0-9]+$/.test(token)) {
      const fret = Number(token);
      if (fret >= startFret && fret <= startFret + visibleFrets - 1) {
        const y = top + (fret - startFret + 0.5) * fretGap;
        lines.push(`<circle cx="${x}" cy="${y}" r="10" fill="#007f5f" />`);
      }
      return;
    }

    lines.push(`<text x="${x}" y="${top - 16}" text-anchor="middle" font-size="14" fill="#5c6370">?</text>`);
  });

  stringLabels.forEach((label, i) => {
    const x = left + i * stringGap;
    lines.push(`<text x="${x}" y="${bottom + 22}" text-anchor="middle" font-size="12" fill="#5c6370">${label}</text>`);
  });

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${lines.join(
    ""
  )}</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

renderHome();
