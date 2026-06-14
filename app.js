const HISTORY_KEY = "decisn-history";
const LANGUAGE_KEY = "decisn-language";
const ANIMATION_KEY = "decisn-animation";
const ACCENT_KEY = "decisn-accent";
const THEME_KEY = "decisn-theme";
const SUPPORTED_LANGUAGES = new Set(["en", "zh"]);
const SUPPORTED_ANIMATIONS = new Set(["slot", "wheel"]);
const SUPPORTED_ACCENTS = new Set([
  "blue",
  "cyan",
  "teal",
  "green",
  "lime",
  "yellow",
  "orange",
  "red",
  "pink",
  "purple",
]);
const SUPPORTED_THEMES = new Set(["system", "light", "dark"]);
const WHEEL_SHADE_STRENGTHS = [46, 30, 58, 22, 40, 64, 34, 52];
const MAX_WHEEL_LABELS = 18;
const MIN_WHEEL_LABEL_DEGREES = 12;
const ACCENT_COLORS = {
  blue: "#2563eb",
  cyan: "#0891b2",
  teal: "#0f766e",
  green: "#16a34a",
  lime: "#65a30d",
  yellow: "#ca8a04",
  orange: "#ea580c",
  red: "#dc2626",
  pink: "#db2777",
  purple: "#7c3aed",
};

const translations = {
  en: {
    appName: "Decisn",
    decisionPanelLabel: "Decision picker",
    choicesPanelLabel: "Choices",
    choiceLabel: "Choice list",
    choicePlaceholder: "salad, sushi, soup\n\nor\n\nsalad:3\nsushi:1\nsoup:4",
    decide: "Decide",
    copyLink: "Copy Link",
    downloadImage: "Download Image",
    shareImage: "Share Image",
    options: "Options",
    animationStyle: "Animation",
    slotMachine: "Slot machine",
    wheel: "Wheel",
    theme: "Theme",
    themeSystem: "System",
    themeLight: "Light",
    themeDark: "Dark",
    accentColor: "Accent color",
    accentBlue: "Blue accent",
    accentCyan: "Cyan accent",
    accentTeal: "Teal accent",
    accentGreen: "Green accent",
    accentLime: "Lime accent",
    accentYellow: "Yellow accent",
    accentOrange: "Orange accent",
    accentRed: "Red accent",
    accentPink: "Pink accent",
    accentPurple: "Purple accent",
    inputReference: "Input reference",
    referenceCommas: "Use commas, Chinese commas, or line breaks. Escape literal comma separators with a backslash, and backslashes as \\\\.",
    referenceWeights: "Use option:3, option:0.5, option:1/365, or option:25% for weights. Spaces and parentheses are okay.",
    referenceDefaultWeight: "Choices without weights count as 1.",
    resultEmpty: "Ready",
    choosing: "Choosing...",
    history: "History",
    clearHistory: "Clear History",
    emptyHistory: "No history yet.",
    choicesCount: "{count} choices",
    oneChoiceCount: "1 choice",
    noChoices: "Enter at least one choice.",
    linkCopied: "Link copied.",
    copyFailed: "Link ready. Copy it from the address bar.",
    imageDownloaded: "Image downloaded.",
    imageShared: "Image shared.",
    imageShareUnavailable: "Sharing is not available here. Use Download Image instead.",
    chooseFirst: "Decide first, then share the image.",
    historyCleared: "History cleared.",
    languageLabel: "Language",
    headerLabel: "Application header",
    primaryActionLabel: "Primary action",
    invalidWeight: "Choices with missing weights use 1.",
  },
  zh: {
    appName: "帮我选",
    decisionPanelLabel: "选择器",
    choicesPanelLabel: "选项",
    choiceLabel: "选项列表",
    choicePlaceholder: "沙拉, 寿司, 汤\n\n或\n\n沙拉:3\n寿司:1\n汤:4",
    decide: "帮我选",
    copyLink: "复制链接",
    downloadImage: "下载图片",
    shareImage: "分享图片",
    options: "选项",
    animationStyle: "动画",
    slotMachine: "老虎机",
    wheel: "转盘",
    theme: "主题",
    themeSystem: "跟随系统",
    themeLight: "浅色",
    themeDark: "深色",
    accentColor: "强调色",
    accentBlue: "蓝色强调色",
    accentCyan: "青色强调色",
    accentTeal: "青色强调色",
    accentGreen: "绿色强调色",
    accentLime: "黄绿色强调色",
    accentYellow: "黄色强调色",
    accentOrange: "橙色强调色",
    accentRed: "红色强调色",
    accentPink: "粉色强调色",
    accentPurple: "紫色强调色",
    inputReference: "输入参考",
    referenceCommas: "支持英文逗号、中文逗号和换行。选项里的逗号分隔符前加反斜杠，反斜杠写作 \\\\。",
    referenceWeights: "可用 选项:3、选项:0.5、选项:1/365 或 选项:25% 设置权重。空格和括号都可以。",
    referenceDefaultWeight: "未设置权重的选项按 1 计算。",
    resultEmpty: "待选择",
    choosing: "正在选择...",
    history: "历史记录",
    clearHistory: "清除历史记录",
    emptyHistory: "暂无历史记录。",
    choicesCount: "{count} 个选项",
    oneChoiceCount: "1 个选项",
    noChoices: "请至少输入一个选项。",
    linkCopied: "链接已复制。",
    copyFailed: "链接已生成，请从地址栏复制。",
    imageDownloaded: "图片已下载。",
    imageShared: "图片已分享。",
    imageShareUnavailable: "此处无法直接分享，请改用下载图片。",
    chooseFirst: "请先选择，再分享图片。",
    historyCleared: "历史记录已清除。",
    languageLabel: "语言",
    headerLabel: "应用页眉",
    primaryActionLabel: "主要操作",
    invalidWeight: "未填写权重的选项会按 1 处理。",
  },
};

const state = {
  language: "en",
  animation: "slot",
  accent: "blue",
  theme: "system",
  choicesText: "",
  history: [],
  selected: "",
  isChoosing: false,
  lastChoices: [],
};

const elements = {};

function t(key, replacements = {}) {
  let value = translations[state.language][key] ?? translations.en[key] ?? key;

  for (const [name, replacement] of Object.entries(replacements)) {
    value = value.replace(`{${name}}`, String(replacement));
  }

  return value;
}

function safeReadStorage(key, fallback) {
  try {
    const stored = window.localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function safeWriteStorage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Local storage can be disabled. The app still works for the current session.
  }
}

function getInitialLanguage() {
  const params = new URLSearchParams(window.location.search);
  const urlLanguage = params.get("lang");
  const storedLanguage = window.localStorage.getItem(LANGUAGE_KEY);

  if (urlLanguage && SUPPORTED_LANGUAGES.has(urlLanguage)) {
    return urlLanguage;
  }

  if (storedLanguage && SUPPORTED_LANGUAGES.has(storedLanguage)) {
    return storedLanguage;
  }

  const browserLanguage = window.navigator.language.toLowerCase();
  return browserLanguage.startsWith("zh") ? "zh" : "en";
}

function getInitialAnimation() {
  const params = new URLSearchParams(window.location.search);
  const urlAnimation = params.get("animation") || params.get("mode");
  const storedAnimation = window.localStorage.getItem(ANIMATION_KEY);

  if (urlAnimation && SUPPORTED_ANIMATIONS.has(urlAnimation)) {
    return urlAnimation;
  }

  return storedAnimation && SUPPORTED_ANIMATIONS.has(storedAnimation) ? storedAnimation : "slot";
}

function getInitialAccent() {
  const storedAccent = window.localStorage.getItem(ACCENT_KEY);
  return storedAccent && SUPPORTED_ACCENTS.has(storedAccent) ? storedAccent : "blue";
}

function getInitialTheme() {
  const storedTheme = window.localStorage.getItem(THEME_KEY);
  return storedTheme && SUPPORTED_THEMES.has(storedTheme) ? storedTheme : "system";
}

function parseChoices(input) {
  const entries = splitChoiceEntries(input)
    .map((item) => item.trim())
    .filter(Boolean);

  let usedFallbackWeight = false;
  const choices = entries.map((entry) => {
    const separatorIndex = entry.lastIndexOf(":");

    if (separatorIndex > 0) {
      const label = entry.slice(0, separatorIndex).trim();
      const weightText = entry.slice(separatorIndex + 1).trim();
      const parsedWeight = parseWeight(weightText);

      if (label && Number.isFinite(parsedWeight) && parsedWeight > 0) {
        return { label, weight: parsedWeight };
      }

      if (label && weightText.length === 0) {
        usedFallbackWeight = true;
        return { label, weight: 1 };
      }

      if (label) {
        usedFallbackWeight = true;
        return { label, weight: 1 };
      }
    }

    return { label: entry, weight: 1 };
  });

  return { choices, usedFallbackWeight };
}

function splitChoiceEntries(input) {
  const entries = [];
  let currentEntry = "";

  for (let index = 0; index < input.length; index += 1) {
    const character = input[index];
    const nextCharacter = input[index + 1];

    if (character === "\\" && (nextCharacter === "\\" || nextCharacter === "," || nextCharacter === "，" || nextCharacter === "、")) {
      currentEntry += nextCharacter;
      index += 1;
      continue;
    }

    if (character === "\n" || character === "," || character === "，" || character === "、") {
      entries.push(currentEntry);
      currentEntry = "";
      continue;
    }

    currentEntry += character;
  }

  entries.push(currentEntry);
  return entries;
}

function parseWeight(weightText) {
  const normalizedWeight = weightText
    .trim()
    .replace(/^\((.*)\)$/, "$1")
    .replace(/\s+/g, "");
  const withoutPercent = normalizedWeight.endsWith("%") ? normalizedWeight.slice(0, -1) : normalizedWeight;

  if (withoutPercent.includes("/")) {
    const fractionParts = withoutPercent.split("/");

    if (fractionParts.length !== 2) {
      return Number.NaN;
    }

    const numerator = Number(fractionParts[0]);
    const denominator = Number(fractionParts[1]);

    return denominator > 0 ? numerator / denominator : Number.NaN;
  }

  return Number(withoutPercent);
}

function serializeChoicesForQuery(input) {
  return parseChoices(input).choices
    .map((choice) => {
      const label = escapeChoiceLabel(choice.label);
      return choice.weight === 1 ? label : `${label}:${choice.weight}`;
    })
    .join(",");
}

function escapeChoiceLabel(label) {
  return label.replace(/\\/g, "\\\\").replace(/[,，、]/g, "\\$&");
}

function cryptoRandomUnit() {
  const values = new Uint32Array(1);
  window.crypto.getRandomValues(values);
  return values[0] / 2 ** 32;
}

function cryptoRandomIndex(length) {
  const values = new Uint32Array(1);
  const max = 2 ** 32;
  const limit = max - (max % length);

  do {
    window.crypto.getRandomValues(values);
  } while (values[0] >= limit);

  return values[0] % length;
}

function selectWeightedChoice(choices) {
  const totalWeight = choices.reduce((total, choice) => total + choice.weight, 0);
  let cursor = cryptoRandomUnit() * totalWeight;

  for (const choice of choices) {
    cursor -= choice.weight;
    if (cursor < 0) {
      return choice.label;
    }
  }

  return choices[choices.length - 1].label;
}

function formatChoiceCount(count) {
  return count === 1 ? t("oneChoiceCount") : t("choicesCount", { count });
}

function formatTimestamp(timestamp) {
  try {
    return new Intl.DateTimeFormat(state.language === "zh" ? "zh-CN" : "en", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(timestamp));
  } catch {
    return timestamp;
  }
}

function updateDocumentLanguage() {
  document.documentElement.lang = state.language === "zh" ? "zh-Hans" : "en";
  document.title = t("appName");
  document.querySelector(".topbar")?.setAttribute("aria-label", t("headerLabel"));
  document.querySelector(".language-switch")?.setAttribute("aria-label", t("languageLabel"));
}

function updatePreferences() {
  document.documentElement.dataset.accent = state.accent;

  if (state.theme === "system") {
    document.documentElement.removeAttribute("data-theme");
  } else {
    document.documentElement.dataset.theme = state.theme;
  }
}

function renderTranslations() {
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const key = node.getAttribute("data-i18n");
    node.textContent = t(key);
  });

  document.querySelectorAll("[data-i18n-attr]").forEach((node) => {
    const instructions = node.getAttribute("data-i18n-attr").split(",");
    instructions.forEach((instruction) => {
      const [attribute, key] = instruction.split(":").map((part) => part.trim());
      node.setAttribute(attribute, t(key));
    });
  });

  document.querySelectorAll("[data-language]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.language === state.language));
  });

  document.querySelectorAll("[data-animation]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.animation === state.animation));
  });

  document.querySelectorAll("button[data-accent]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.accent === state.accent));
  });

  document.querySelectorAll("[data-theme-option]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.themeOption === state.theme));
  });
}

function renderResult() {
  const resultText = state.selected || t("resultEmpty");
  elements.resultValue.classList.toggle("is-long", resultText.length > 18);
  elements.resultValue.classList.toggle("is-very-long", resultText.length > 36);
  elements.resultValue.classList.toggle("is-extreme", resultText.length > 72);
  elements.resultValue.title = state.selected ? resultText : "";

  if (!state.selected) {
    elements.resultValue.textContent = resultText;
    return;
  }

  elements.resultValue.textContent = resultText;
}

function renderChoiceAnimations(choices = parseChoices(elements.choicesInput?.value ?? "").choices) {
  const visibleChoices = choices.slice(0, 16);
  elements.slotReel.textContent = "";
  elements.wheelLabels.textContent = "";

  if (visibleChoices.length === 0) {
    elements.slotReel.append(createChoiceTile(t("resultEmpty")));
    return;
  }

  getSlotReelChoices(visibleChoices).forEach((choice, index) => {
    elements.slotReel.append(createChoiceTile(choice.label, index));
  });

  const wheelSegments = renderWheelRegions(choices);
  const wheelLabels = getWheelLabelSegments(wheelSegments);
  setWheelLabelRotation(0);

  wheelLabels.forEach((segment) => {
    const label = document.createElement("span");
    label.textContent = segment.choice.label;
    label.title = segment.choice.label;
    label.dataset.angle = String(segment.midDegrees);
    setWheelLabelTransform(label, segment.midDegrees, 0);
    elements.wheelLabels.append(label);
  });
}

function getSlotReelChoices(choices) {
  if (choices.length === 0) {
    return [];
  }

  const loops = Math.max(4, Math.ceil(24 / choices.length));
  return Array.from({ length: loops }, () => choices).flat();
}

function setWheelLabelTransform(label, angle, rotation) {
  const totalAngle = angle + rotation;
  label.style.transform = `rotate(${totalAngle}deg) translateY(calc(var(--wheel-size) * -0.34)) rotate(${-totalAngle}deg)`;
}

function setWheelLabelRotation(rotation) {
  elements.wheelLabels.querySelectorAll("span").forEach((label) => {
    setWheelLabelTransform(label, Number(label.dataset.angle || 0), rotation);
  });
}

function createChoiceTile(label, index = 0) {
  const tile = document.createElement("span");
  tile.className = "choice-tile";
  tile.textContent = label;
  tile.dataset.choice = label;
  tile.style.setProperty("--tile-index", String(index));
  return tile;
}

function setSlotHighlight(label, mode = "active") {
  elements.slotReel.querySelectorAll(".choice-tile").forEach((tile) => {
    const isMatch = tile.dataset.choice === label;
    tile.classList.toggle("is-current", isMatch && mode === "active");
    tile.classList.toggle("is-winner", isMatch && mode === "winner");
  });
}

function setSlotWinnerAtIndex(targetIndex) {
  elements.slotReel.querySelectorAll(".choice-tile").forEach((tile, index) => {
    tile.classList.toggle("is-current", false);
    tile.classList.toggle("is-winner", index === targetIndex);
  });
}

function clearSlotHighlight() {
  elements.slotReel.querySelectorAll(".choice-tile").forEach((tile) => {
    tile.classList.remove("is-current", "is-winner");
  });
}

function resetSlotReel() {
  elements.slotReel.style.transition = "none";
  elements.slotReel.style.transform = "translateY(0)";
  elements.slotReel.getBoundingClientRect();
  elements.slotReel.style.transition = "";
}

function spinSlotReel(choices, result) {
  const visibleChoices = choices.slice(0, 16);
  const reelChoices = getSlotReelChoices(visibleChoices);
  let targetIndex = 0;

  for (let index = reelChoices.length - 1; index >= 0; index -= 1) {
    if (reelChoices[index].label === result) {
      targetIndex = index;
      break;
    }
  }
  const targetTile = elements.slotReel.querySelectorAll(".choice-tile")[targetIndex];
  const slotWindow = elements.slotWindow;
  const tileHeight = targetTile?.getBoundingClientRect().height || 52;
  const travel = Math.max(0, (targetTile?.offsetTop || 0) + tileHeight / 2 - slotWindow.clientHeight / 2);

  elements.slotReel.style.transform = `translateY(-${travel}px)`;
  return targetIndex;
}

function renderAnimationMode() {
  elements.resultPanel.classList.toggle("animation-slot", state.animation === "slot");
  elements.resultPanel.classList.toggle("animation-wheel", state.animation === "wheel");
}

function renderHistory() {
  elements.historyList.textContent = "";

  if (state.history.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.className = "history-empty";
    emptyItem.textContent = t("emptyHistory");
    elements.historyList.append(emptyItem);
    return;
  }

  state.history.forEach((item) => {
    const row = document.createElement("li");
    const result = document.createElement("span");
    const meta = document.createElement("span");

    result.className = "history-result";
    meta.className = "history-meta";
    result.textContent = item.result;
    meta.textContent = `${formatChoiceCount(item.choicesCount)} · ${formatTimestamp(item.timestamp)}`;

    row.append(result, meta);
    elements.historyList.append(row);
  });
}

function render() {
  updateDocumentLanguage();
  updatePreferences();
  renderTranslations();
  renderAnimationMode();
  renderChoiceAnimations();
  renderResult();
  renderHistory();
}

function setStatus(messageKey, replacements = {}) {
  elements.statusLine.textContent = messageKey ? t(messageKey, replacements) : "";
}

function persistLanguage() {
  try {
    window.localStorage.setItem(LANGUAGE_KEY, state.language);
  } catch {
    // Language still applies for this session.
  }
}

function persistAnimation() {
  try {
    window.localStorage.setItem(ANIMATION_KEY, state.animation);
  } catch {
    // Animation preference still applies for this session.
  }
}

function persistAccent() {
  try {
    window.localStorage.setItem(ACCENT_KEY, state.accent);
  } catch {
    // Accent preference still applies for this session.
  }
}

function persistTheme() {
  try {
    window.localStorage.setItem(THEME_KEY, state.theme);
  } catch {
    // Theme preference still applies for this session.
  }
}

function updateUrlFromChoices() {
  const params = new URLSearchParams();
  const trimmedChoices = serializeChoicesForQuery(elements.choicesInput.value);

  if (trimmedChoices) {
    params.set("q", trimmedChoices);
  }

  params.set("lang", state.language);
  params.set("animation", state.animation);

  const nextUrl = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState(null, "", nextUrl);
  return new URL(nextUrl, window.location.href).href;
}

function setChoosing(isChoosing) {
  state.isChoosing = isChoosing;
  elements.decideButton.disabled = isChoosing;
  elements.copyLink.disabled = isChoosing;
  elements.downloadImage.disabled = isChoosing || !state.selected;
  elements.shareImage.disabled = isChoosing || !state.selected;
  document.querySelectorAll("[data-animation]").forEach((button) => {
    button.disabled = isChoosing;
  });
}

function sleep(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function nextAnimationFrame() {
  return new Promise((resolve) => {
    window.requestAnimationFrame(() => resolve());
  });
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getDisplayLabel(value) {
  return value || t("choosing");
}

function getWheelSegments(choices) {
  const totalWeight = choices.reduce((total, choice) => total + choice.weight, 0) || 1;
  let cursor = 0;

  return choices.map((choice, index) => {
    const start = cursor;
    const share = choice.weight / totalWeight;
    const end = start + share;
    const accentStrength = WHEEL_SHADE_STRENGTHS[index % WHEEL_SHADE_STRENGTHS.length];
    const baseSurface = index % 2 === 0 ? "var(--surface)" : "var(--surface-muted)";
    const color = `color-mix(in srgb, var(--accent) ${accentStrength}%, ${baseSurface})`;

    cursor = end;

    return {
      choice,
      color,
      endPercent: end * 100,
      midDegrees: (start + share / 2) * 360,
      startPercent: start * 100,
    };
  });
}

function renderWheelRegions(choices) {
  const segments = getWheelSegments(choices);
  const stops = segments.map((segment) => {
    return `${segment.color} ${segment.startPercent}% ${segment.endPercent}%`;
  });

  elements.wheelDisc.style.background = `conic-gradient(${stops.join(", ")})`;

  return segments;
}

function getWheelLabelSegments(segments) {
  const readableSegments = segments.filter((segment) => {
    const degrees = (segment.endPercent - segment.startPercent) * 3.6;
    return degrees >= MIN_WHEEL_LABEL_DEGREES;
  });

  if (readableSegments.length <= MAX_WHEEL_LABELS) {
    return readableSegments;
  }

  return readableSegments
    .slice()
    .sort((segmentA, segmentB) => {
      const sizeA = segmentA.endPercent - segmentA.startPercent;
      const sizeB = segmentB.endPercent - segmentB.startPercent;
      return sizeB - sizeA;
    })
    .slice(0, MAX_WHEEL_LABELS)
    .sort((segmentA, segmentB) => segmentA.startPercent - segmentB.startPercent);
}

function updateWheel(choices, result) {
  const segments = renderWheelRegions(choices);
  const winningSegment = segments.find((segment) => segment.choice.label === result) ?? segments[0];
  const segmentDegrees = Math.max(1, (winningSegment.endPercent - winningSegment.startPercent) * 3.6);
  const offsetWindow = Math.max(1, Math.floor(segmentDegrees * 0.32));
  const randomOffset = cryptoRandomIndex(offsetWindow * 2 + 1) - offsetWindow;
  const rotation = 1440 - winningSegment.midDegrees + randomOffset;

  elements.wheelSpinner.style.transform = `rotate(${rotation}deg)`;
  setWheelLabelRotation(rotation);
}

async function runSelectionAnimation(result, choices) {
  const reducedMotion = prefersReducedMotion();

  elements.resultPanel.classList.remove("is-spinning");
  elements.wheelSpinner.style.transform = "rotate(0deg)";
  setWheelLabelRotation(0);
  renderChoiceAnimations(choices);
  elements.resultValue.textContent = t("choosing");

  if (reducedMotion) {
    elements.resultValue.textContent = getDisplayLabel(result);
    return;
  }

  if (state.animation === "wheel") {
    elements.wheelSpinner.style.transition = "none";
    elements.wheelSpinner.style.transform = "rotate(0deg)";
    elements.wheelLabels.querySelectorAll("span").forEach((label) => {
      label.style.transition = "none";
    });
    setWheelLabelRotation(0);
    elements.wheelSpinner.getBoundingClientRect();
    await nextAnimationFrame();
    elements.wheelSpinner.style.transition = "";
    elements.wheelLabels.querySelectorAll("span").forEach((label) => {
      label.style.transition = "";
    });
    elements.resultPanel.classList.add("is-spinning");
    updateWheel(choices, result);
    await sleep(1450);
    elements.resultPanel.classList.remove("is-spinning");
    elements.resultValue.textContent = getDisplayLabel(result);
    return;
  }

  elements.resultPanel.classList.add("is-spinning");
  clearSlotHighlight();
  resetSlotReel();
  await nextAnimationFrame();

  const targetIndex = spinSlotReel(choices, result);
  await sleep(900);
  setSlotWinnerAtIndex(targetIndex);
  elements.resultPanel.classList.remove("is-spinning");
  elements.resultValue.textContent = getDisplayLabel(result);
}

function fitCanvasLine(context, line, maxWidth) {
  let fittedLine = line;

  while (fittedLine && context.measureText(`${fittedLine}...`).width > maxWidth) {
    fittedLine = fittedLine.slice(0, -1);
  }

  return `${fittedLine || line.slice(0, 1)}...`;
}

function splitCanvasToken(context, token, maxWidth) {
  if (context.measureText(token).width <= maxWidth) {
    return [token];
  }

  const chunks = [];
  let currentChunk = "";

  Array.from(token).forEach((character) => {
    const testChunk = `${currentChunk}${character}`;

    if (context.measureText(testChunk).width <= maxWidth || !currentChunk) {
      currentChunk = testChunk;
      return;
    }

    chunks.push(currentChunk);
    currentChunk = character;
  });

  if (currentChunk) {
    chunks.push(currentChunk);
  }

  return chunks;
}

function getCanvasTextLines(context, text, maxWidth, maxLines) {
  const words = String(text).trim().split(/\s+/).filter(Boolean);
  const lines = [];
  let currentLine = "";

  words.forEach((word) => {
    splitCanvasToken(context, word, maxWidth).forEach((token) => {
      const testLine = currentLine ? `${currentLine} ${token}` : token;

      if (context.measureText(testLine).width <= maxWidth || !currentLine) {
        currentLine = testLine;
        return;
      }

      lines.push(currentLine);
      currentLine = token;
    });
  });

  if (currentLine) {
    lines.push(currentLine);
  }

  if (lines.length > maxLines) {
    return [...lines.slice(0, maxLines - 1), fitCanvasLine(context, lines[maxLines - 1], maxWidth)];
  }

  return lines;
}

function wrapCanvasText(context, text, x, y, maxWidth, lineHeight, maxLines = 3) {
  const lines = getCanvasTextLines(context, text, maxWidth, maxLines);

  lines.forEach((line, index) => {
    context.fillText(line, x, y + index * lineHeight);
  });

  return lines.length * lineHeight;
}

function canvasToBlob(canvas) {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/png", 0.94);
  });
}

function hexToRgb(hexColor) {
  const value = hexColor.replace("#", "");
  const numericValue = Number.parseInt(value, 16);

  return {
    r: (numericValue >> 16) & 255,
    g: (numericValue >> 8) & 255,
    b: numericValue & 255,
  };
}

function rgbToCss({ r, g, b }) {
  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
}

function mixColor(colorA, colorB, amount) {
  const a = hexToRgb(colorA);
  const b = hexToRgb(colorB);

  return rgbToCss({
    r: a.r * amount + b.r * (1 - amount),
    g: a.g * amount + b.g * (1 - amount),
    b: a.b * amount + b.b * (1 - amount),
  });
}

function getImageTheme() {
  const isDark = state.theme === "dark" || (state.theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  const accent = ACCENT_COLORS[state.accent] ?? ACCENT_COLORS.blue;

  return {
    accent,
    accentSoft: mixColor(accent, isDark ? "#202124" : "#ffffff", 0.28),
    accentSofter: mixColor(accent, isDark ? "#202124" : "#ffffff", 0.12),
    background: isDark ? "#151517" : "#f7f7f8",
    line: isDark ? "#44464d" : "#d9d9de",
    muted: isDark ? "#b4b6bd" : "#60616a",
    surface: isDark ? "#202124" : "#ffffff",
    surfaceMuted: isDark ? "#2a2b2f" : "#f0f0f2",
    text: isDark ? "#f3f3f4" : "#171717",
  };
}

function drawRoundRect(context, x, y, width, height, radius, fill, stroke, lineWidth = 3) {
  context.fillStyle = fill;
  context.strokeStyle = stroke;
  context.lineWidth = lineWidth;
  context.beginPath();
  context.roundRect(x, y, width, height, radius);
  context.fill();
  context.stroke();
}

function drawImageHeader(context, theme) {
  context.fillStyle = theme.text;
  context.font = "800 54px Helvetica, Arial, sans-serif";
  context.fillText(t("appName"), 92, 132);

  context.fillStyle = theme.muted;
  context.font = "700 28px Helvetica, Arial, sans-serif";
  context.fillText(new Intl.DateTimeFormat(state.language === "zh" ? "zh-CN" : "en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date()), 92, 178);

}

function drawSlotImage(context, theme, choices) {
  const labels = choices.map((choice) => choice.label);
  const selectedIndex = Math.max(0, labels.indexOf(state.selected));
  const tileLabels = [
    labels.length ? labels[(selectedIndex - 1 + labels.length) % labels.length] : "",
    state.selected,
    labels.length ? labels[(selectedIndex + 1) % labels.length] : "",
  ];
  const slotX = 790;
  const slotY = 222;
  const slotWidth = 270;
  const tileHeight = 54;
  const tileGap = 12;
  const slotHeight = tileHeight * 3 + tileGap * 2 + 28;

  drawRoundRect(context, slotX, slotY, slotWidth, slotHeight, 8, theme.accentSofter, mixColor(theme.accent, theme.line, 0.35), 3);

  tileLabels.forEach((label, index) => {
    const isWinner = index === 1;
    const y = slotY + 14 + index * (tileHeight + tileGap);
    drawRoundRect(
      context,
      slotX + 16,
      y,
      slotWidth - 32,
      tileHeight,
      8,
      isWinner ? theme.accentSoft : theme.surface,
      isWinner ? theme.accent : theme.line,
      isWinner ? 4 : 2,
    );
    context.fillStyle = isWinner ? theme.text : theme.muted;
    context.font = isWinner ? "800 22px Helvetica, Arial, sans-serif" : "800 18px Helvetica, Arial, sans-serif";
    context.textAlign = "center";
    context.textBaseline = "middle";
    wrapCanvasText(context, label, slotX + slotWidth / 2, y + tileHeight / 2 - 7, slotWidth - 54, 22, 1);
  });
}

function drawWheelImage(context, theme, choices) {
  const segments = getWheelSegments(choices);
  const centerX = 930;
  const centerY = 330;
  const radius = 142;

  segments.forEach((segment, index) => {
    const start = (segment.startPercent / 100) * Math.PI * 2 - Math.PI / 2;
    const end = (segment.endPercent / 100) * Math.PI * 2 - Math.PI / 2;
    const strength = WHEEL_SHADE_STRENGTHS[index % WHEEL_SHADE_STRENGTHS.length] / 100;

    context.fillStyle = mixColor(theme.accent, segment.choice.label === state.selected ? theme.surface : theme.surfaceMuted, strength);
    context.beginPath();
    context.moveTo(centerX, centerY);
    context.arc(centerX, centerY, radius, start, end);
    context.closePath();
    context.fill();
  });

  context.strokeStyle = mixColor(theme.accent, theme.line, 0.55);
  context.lineWidth = 5;
  context.beginPath();
  context.arc(centerX, centerY, radius, 0, Math.PI * 2);
  context.stroke();

  getWheelLabelSegments(segments).slice(0, 10).forEach((segment) => {
    const angle = (segment.midDegrees - 90) * (Math.PI / 180);
    const x = centerX + Math.cos(angle) * radius * 0.58;
    const y = centerY + Math.sin(angle) * radius * 0.58;

    context.fillStyle = theme.text;
    context.font = "800 13px Helvetica, Arial, sans-serif";
    context.textAlign = "center";
    context.textBaseline = "middle";
    wrapCanvasText(context, segment.choice.label, x, y - 6, 62, 15, 1);
  });

  context.fillStyle = theme.surface;
  context.strokeStyle = theme.accent;
  context.lineWidth = 4;
  context.beginPath();
  context.arc(centerX, centerY, 22, 0, Math.PI * 2);
  context.fill();
  context.stroke();

  context.fillStyle = theme.accent;
  context.beginPath();
  context.moveTo(centerX - 16, centerY - radius - 14);
  context.lineTo(centerX + 16, centerY - radius - 14);
  context.lineTo(centerX, centerY - radius + 18);
  context.closePath();
  context.fill();
}

function getCanvasResultFont(result) {
  const length = Array.from(result).length;

  if (length > 100) {
    return { font: "800 42px Helvetica, Arial, sans-serif", lineHeight: 50, maxLines: 4 };
  }

  if (length > 64) {
    return { font: "800 52px Helvetica, Arial, sans-serif", lineHeight: 62, maxLines: 4 };
  }

  if (length > 34) {
    return { font: "800 68px Helvetica, Arial, sans-serif", lineHeight: 78, maxLines: 3 };
  }

  return { font: "800 96px Helvetica, Arial, sans-serif", lineHeight: 106, maxLines: 2 };
}

function drawResultImageHero(context, theme) {
  const resultStyle = getCanvasResultFont(state.selected);

  context.textAlign = "left";
  context.textBaseline = "alphabetic";
  context.fillStyle = theme.text;
  context.font = resultStyle.font;
  wrapCanvasText(context, state.selected, 92, 302, 650, resultStyle.lineHeight, resultStyle.maxLines);
}

function drawResultImageFooter(context, theme, choices) {
  const modeLabel = state.animation === "wheel" ? t("wheel") : t("slotMachine");
  context.fillStyle = theme.muted;
  context.font = "700 24px Helvetica, Arial, sans-serif";
  context.fillText(`${formatChoiceCount(choices.length)} · ${modeLabel}`, 92, 518);
}

async function createResultImageBlob() {
  if (!state.selected) {
    setStatus("chooseFirst");
    return null;
  }

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  const width = 1200;
  const height = 630;
  const theme = getImageTheme();
  const choices = state.lastChoices.length ? state.lastChoices : parseChoices(elements.choicesInput.value).choices;

  canvas.width = width;
  canvas.height = height;

  context.fillStyle = theme.background;
  context.fillRect(0, 0, width, height);
  drawRoundRect(context, 42, 42, width - 84, height - 84, 8, theme.surface, theme.line, 3);
  drawImageHeader(context, theme);
  drawResultImageHero(context, theme);

  if (state.animation === "wheel") {
    drawWheelImage(context, theme, choices);
  } else {
    drawSlotImage(context, theme, choices);
  }

  drawResultImageFooter(context, theme, choices);

  return canvasToBlob(canvas);
}

async function downloadResultImage() {
  const blob = await createResultImageBlob();

  if (!blob) {
    return;
  }

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const safeResult = state.selected.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fff]+/gi, "-").replace(/^-|-$/g, "");
  link.href = url;
  link.download = `decisn-${safeResult || "result"}.png`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  setStatus("imageDownloaded");
}

async function shareResultImage() {
  if (!navigator.share) {
    setStatus("imageShareUnavailable");
    return;
  }

  const blob = await createResultImageBlob();

  if (!blob) {
    return;
  }

  const file = new File([blob], "decisn-result.png", { type: "image/png" });

  if (!navigator.canShare?.({ files: [file] })) {
    setStatus("imageShareUnavailable");
    return;
  }

  await navigator.share({ files: [file] });
  setStatus("imageShared");
}

async function copyShareLink() {
  const shareUrl = updateUrlFromChoices();

  try {
    if (!window.navigator.clipboard) {
      throw new Error("Clipboard API unavailable.");
    }

    await window.navigator.clipboard.writeText(shareUrl);
    setStatus("linkCopied");
  } catch {
    setStatus("copyFailed");
  }
}

async function decide(event) {
  event.preventDefault();

  if (state.isChoosing) {
    return;
  }

  const parsed = parseChoices(elements.choicesInput.value);

  if (parsed.choices.length === 0) {
    setStatus("noChoices");
    state.selected = "";
    renderResult();
    return;
  }

  const result = selectWeightedChoice(parsed.choices);
  const historyItem = {
    timestamp: new Date().toISOString(),
    result,
    choicesCount: parsed.choices.length,
  };

  setChoosing(true);
  updateUrlFromChoices();
  setStatus(parsed.usedFallbackWeight ? "invalidWeight" : "");

  try {
    await runSelectionAnimation(result, parsed.choices);
  } finally {
    state.selected = result;
    state.lastChoices = parsed.choices;
    state.history = [historyItem, ...state.history].slice(0, 50);
    safeWriteStorage(HISTORY_KEY, state.history);
    renderResult();
    renderHistory();
    setChoosing(false);
  }
}

function clearHistory() {
  state.history = [];
  safeWriteStorage(HISTORY_KEY, state.history);
  setStatus("historyCleared");
  renderHistory();
}

function switchLanguage(language) {
  if (!SUPPORTED_LANGUAGES.has(language)) {
    return;
  }

  state.language = language;
  persistLanguage();
  updateUrlFromChoices();
  render();
}

function switchAnimation(animation) {
  if (!SUPPORTED_ANIMATIONS.has(animation) || state.isChoosing) {
    return;
  }

  state.animation = animation;
  persistAnimation();
  updateUrlFromChoices();
  renderTranslations();
  renderAnimationMode();
}

function switchAccent(accent) {
  if (!SUPPORTED_ACCENTS.has(accent)) {
    return;
  }

  state.accent = accent;
  persistAccent();
  updatePreferences();
  renderTranslations();
}

function switchTheme(theme) {
  if (!SUPPORTED_THEMES.has(theme)) {
    return;
  }

  state.theme = theme;
  persistTheme();
  updatePreferences();
  renderTranslations();
}

function initFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const queryChoices = params.get("q");

  if (queryChoices) {
    state.choicesText = queryChoices;
    elements.choicesInput.value = queryChoices;
  }
}

function bindElements() {
  elements.form = document.querySelector("#decision-form");
  elements.choicesInput = document.querySelector("#choices-input");
  elements.optionsDrawer = document.querySelector(".options-drawer");
  elements.decideButton = document.querySelector("#decide-button");
  elements.copyLink = document.querySelector("#copy-link");
  elements.downloadImage = document.querySelector("#download-image");
  elements.shareImage = document.querySelector("#share-image");
  elements.clearHistory = document.querySelector("#clear-history");
  elements.historyList = document.querySelector("#history-list");
  elements.resultPanel = document.querySelector("#result-panel");
  elements.resultValue = document.querySelector("#result-value");
  elements.slotReel = document.querySelector("#slot-reel");
  elements.slotWindow = document.querySelector(".slot-window");
  elements.statusLine = document.querySelector("#status-line");
  elements.wheelDisc = document.querySelector("#wheel-disc");
  elements.wheelSpinner = document.querySelector("#wheel-spinner");
  elements.wheelLabels = document.querySelector("#wheel-labels");
}

function init() {
  bindElements();
  state.language = getInitialLanguage();
  state.animation = getInitialAnimation();
  state.accent = getInitialAccent();
  state.theme = getInitialTheme();
  state.history = safeReadStorage(HISTORY_KEY, []);
  initFromUrl();
  elements.optionsDrawer.open = false;
  render();

  elements.form.addEventListener("submit", decide);
  elements.choicesInput.addEventListener("input", () => renderChoiceAnimations());
  elements.copyLink.addEventListener("click", copyShareLink);
  elements.downloadImage.addEventListener("click", downloadResultImage);
  elements.shareImage.addEventListener("click", () => {
    void shareResultImage().catch(() => setStatus("imageShareUnavailable"));
  });
  elements.clearHistory.addEventListener("click", clearHistory);

  document.querySelectorAll("[data-language]").forEach((button) => {
    button.addEventListener("click", () => switchLanguage(button.dataset.language));
  });

  document.querySelectorAll("[data-animation]").forEach((button) => {
    button.addEventListener("click", () => switchAnimation(button.dataset.animation));
  });

  document.querySelectorAll("button[data-accent]").forEach((button) => {
    button.addEventListener("click", () => switchAccent(button.dataset.accent));
  });

  document.querySelectorAll("[data-theme-option]").forEach((button) => {
    button.addEventListener("click", () => switchTheme(button.dataset.themeOption));
  });
}

window.addEventListener("DOMContentLoaded", init);
