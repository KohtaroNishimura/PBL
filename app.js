const CIRCLE_ORDER = ["C", "G", "D", "A", "E", "B", "F#", "D♭", "A♭", "E♭", "B♭", "F"];

const MAJOR_SCALES = {
  C: ["C", "D", "E", "F", "G", "A", "B"],
  G: ["G", "A", "B", "C", "D", "E", "F#"],
  D: ["D", "E", "F#", "G", "A", "B", "C#"],
  A: ["A", "B", "C#", "D", "E", "F#", "G#"],
  E: ["E", "F#", "G#", "A", "B", "C#", "D#"],
  B: ["B", "C#", "D#", "E", "F#", "G#", "A#"],
  "F#": ["F#", "G#", "A#", "B", "C#", "D#", "E#"],
  "D♭": ["D♭", "E♭", "F", "G♭", "A♭", "B♭", "C"],
  "A♭": ["A♭", "B♭", "C", "D♭", "E♭", "F", "G"],
  "E♭": ["E♭", "F", "G", "A♭", "B♭", "C", "D"],
  "B♭": ["B♭", "C", "D", "E♭", "F", "G", "A"],
  F: ["F", "G", "A", "B♭", "C", "D", "E"],
};

const MAJOR_DEGREES = [
  { degree: "I", quality: "", role: "トニック", description: "いちばん落ち着く、曲のおうちみたいなコード。" },
  { degree: "IIm", quality: "m", role: "準備", description: "少し動き出す感じ。次の流れを作るコード。" },
  { degree: "IIIm", quality: "m", role: "つなぎ", description: "やわらかく流れる感じ。橋わたしの役割。" },
  { degree: "IV", quality: "", role: "サブドミナント", description: "景色がひらく感じ。ここから変化が始まる。" },
  { degree: "V", quality: "", role: "ドミナント", description: "おうちに帰りたくなる力が強いコード。" },
  { degree: "VIm", quality: "m", role: "せつない仲間", description: "明るい流れの中に、少しさみしさを足せる。" },
];

const MINOR_DEGREES = [
  { degree: "Im", quality: "m", scaleIndex: 0, role: "トニック", description: "マイナーキーのおうち。落ち着く場所。" },
  { degree: "♭III", quality: "", scaleIndex: 2, role: "ひろがり", description: "明るさが少し見える、やわらかい響き。" },
  { degree: "IVm", quality: "m", scaleIndex: 3, role: "サブドミナント", description: "流れを作って次へ進めるコード。" },
  { degree: "Vm", quality: "m", scaleIndex: 4, role: "ドミナント", description: "帰りたくなる気持ちを作るコード。" },
  { degree: "♭VI", quality: "", scaleIndex: 5, role: "色づけ", description: "ちょっと印象を変える色のコード。" },
  { degree: "♭VII", quality: "", scaleIndex: 6, role: "つなぎ", description: "次に向かう橋わたしのようなコード。" },
];

const MAJOR_KEY_DATA = Object.fromEntries(
  Object.entries(MAJOR_SCALES).map(([key, scale]) => [
    key,
    {
      mode: "major",
      tonic: key,
      label: `${key}キー`,
      counterpartLabel: `${scale[5]}m`,
      counterpartText: `対応するマイナーキー（平行調）: ${scale[5]}m`,
      diatonicChords: MAJOR_DEGREES.map((meta, index) => ({
        degree: meta.degree,
        chord: `${scale[index]}${meta.quality}`,
        role: meta.role,
        description: meta.description,
      })),
    },
  ])
);

const MINOR_KEY_DATA = Object.fromEntries(
  CIRCLE_ORDER.map((majorKey) => {
    const scale = MAJOR_SCALES[majorKey];
    const minorTonic = `${scale[5]}m`;
    const minorScale = [scale[5], scale[6], scale[0], scale[1], scale[2], scale[3], scale[4]];

    return [
      minorTonic,
      {
        mode: "minor",
        tonic: minorTonic,
        label: `${minorTonic}キー`,
        counterpartLabel: majorKey,
        counterpartText: `対応するメジャーキー（平行調）: ${majorKey}`,
        diatonicChords: MINOR_DEGREES.map((meta) => ({
          degree: meta.degree,
          chord: `${minorScale[meta.scaleIndex]}${meta.quality}`,
          role: meta.role,
          description: meta.description,
        })),
      },
    ];
  })
);

const state = {
  selectedMode: "major",
  selectedTonic: "C",
};

const selectedKeyChip = document.getElementById("selected-key-chip");
const parallelMinorLabel = document.getElementById("parallel-minor");
const keyDescription = document.getElementById("key-description");
const diatonicGrid = document.getElementById("diatonic-grid");
const circleNotesLayer = document.getElementById("circle-notes-layer");

function render() {
  renderCircleState();
  renderDiatonicCards();
}

function getSelectedData() {
  if (state.selectedMode === "major") {
    return MAJOR_KEY_DATA[state.selectedTonic];
  }
  return MINOR_KEY_DATA[state.selectedTonic];
}

function renderCircleState() {
  const selected = getSelectedData();
  const highlightSet = new Set(getHighlightChords(selected));

  selectedKeyChip.textContent = `${selected.tonic} ${selected.mode === "major" ? "Major" : "Minor"}`;
  parallelMinorLabel.textContent = selected.counterpartText;

  circleNotesLayer.innerHTML = "";

  CIRCLE_ORDER.forEach((majorKey, index) => {
    const angle = (-90 + index * 30) * (Math.PI / 180);
    const x = Math.cos(angle).toFixed(4);
    const y = Math.sin(angle).toFixed(4);
    const minorKey = `${MAJOR_SCALES[majorKey][5]}m`;

    const majorButton = document.createElement("button");
    majorButton.className = "circle-note major";
    majorButton.style.setProperty("--x", x);
    majorButton.style.setProperty("--y", y);
    majorButton.textContent = majorKey;
    majorButton.type = "button";
    majorButton.classList.toggle("is-active", state.selectedMode === "major" && state.selectedTonic === majorKey);
    majorButton.classList.toggle("is-related", highlightSet.has(normalizeChord(majorKey)));
    majorButton.classList.toggle("is-muted", !highlightSet.has(normalizeChord(majorKey)) && !(state.selectedMode === "major" && state.selectedTonic === majorKey));
    majorButton.setAttribute("aria-label", `${majorKey}キーを選択`);
    majorButton.addEventListener("click", () => {
      state.selectedMode = "major";
      state.selectedTonic = majorKey;
      render();
    });

    const minorButton = document.createElement("button");
    minorButton.className = "circle-note minor";
    minorButton.style.setProperty("--x", x);
    minorButton.style.setProperty("--y", y);
    minorButton.textContent = minorKey;
    minorButton.type = "button";
    minorButton.classList.toggle("is-active", state.selectedMode === "minor" && state.selectedTonic === minorKey);
    minorButton.classList.toggle("is-related", highlightSet.has(normalizeChord(minorKey)));
    minorButton.classList.toggle("is-muted", !highlightSet.has(normalizeChord(minorKey)) && !(state.selectedMode === "minor" && state.selectedTonic === minorKey));
    minorButton.setAttribute("aria-label", `${minorKey}キーを選択`);
    minorButton.addEventListener("click", () => {
      state.selectedMode = "minor";
      state.selectedTonic = minorKey;
      render();
    });

    circleNotesLayer.appendChild(majorButton);
    circleNotesLayer.appendChild(minorButton);
  });
}

function getHighlightChords(selectedData) {
  return selectedData.diatonicChords.map((item) => item.chord);
}

function normalizeChord(chord) {
  return chord;
}

function renderDiatonicCards() {
  const selected = getSelectedData();
  const modeLabel = selected.mode === "major" ? "メジャー" : "マイナー（自然的短音階）";
  keyDescription.textContent = `${selected.label}のダイアトニックコード（${modeLabel}）`;

  diatonicGrid.innerHTML = "";

  selected.diatonicChords.forEach((item) => {
    const card = document.createElement("article");
    card.className = "chord-card";
    card.innerHTML = `
      <p class="degree">${item.degree}</p>
      <p class="chord">${item.chord}</p>
      <p class="role">${item.role}</p>
      <p class="desc">${item.description}</p>
    `;

    diatonicGrid.appendChild(card);
  });
}

render();
