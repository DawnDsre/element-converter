import './index.css';
import {
  ELEMENT_MAP,
  LAYOUT,
  LANTHANIDES,
  ACTINIDES,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
  type ElementData,
} from './elements';
import { getProp, fmtTemp, fmtDensity, type ElementProperty } from './elementProperties';
import {
  getExtra,
  computeShells,
  fmtShells,
  fmtCp,
  fmtK,
  fmtRadius,
  getBlock,
  getValenceElectrons,
  type ElementExtra,
} from './elementExtraProps';

// ===== STATE =====
type Theme = 'dark' | 'light' | 'ocean' | 'forest' | 'sunset';

let currentTheme: Theme = 'dark';
let detailSymbol: string | null = null;
let compareSymbols: string[] = [];
let searchQuery = '';
let categoryFilter = 'all';

const CELL_W = 52;
const CELL_H = 66;
const MAX_COMPARE = 6;

const THEMES: { id: Theme; name: string; color: string }[] = [
  { id: 'dark', name: '深灰', color: '#0f172a' },
  { id: 'light', name: '浅亮', color: '#f8fafc' },
  { id: 'ocean', name: '海洋', color: '#0c1929' },
  { id: 'forest', name: '森林', color: '#0f1f0f' },
  { id: 'sunset', name: '日落', color: '#1c1917' },
];

function applyTheme(theme: Theme): void {
  currentTheme = theme;
  const body = document.body;
  body.classList.remove('theme-light', 'theme-ocean', 'theme-forest', 'theme-sunset');
  if (theme !== 'dark') {
    body.classList.add(`theme-${theme}`);
  }
}

function el(symbol: string): ElementData {
  return ELEMENT_MAP[symbol] as ElementData;
}

// ===== FILTER =====
function matchesFilter(e: ElementData): boolean {
  if (categoryFilter !== 'all' && e.category !== categoryFilter) return false;
  const q = searchQuery.trim().toLowerCase();
  if (!q) return true;
  const p = getProp(e.atomicNumber);
  return (
    e.symbol.toLowerCase() === q ||
    e.symbol.toLowerCase().startsWith(q) ||
    e.name.includes(searchQuery.trim()) ||
    p.nameEn.toLowerCase().startsWith(q) ||
    String(e.atomicNumber) === q
  );
}

function hasActiveFilter(): boolean {
  return searchQuery.trim() !== '' || categoryFilter !== 'all';
}

// ===== RENDER PERIODIC TABLE =====
function renderTableGrid(): string {
  const compareSet = new Set(compareSymbols);
  const dim = hasActiveFilter();

  const cellHtml = (z: number): string => {
    const e = ELEMENT_MAP[z] as ElementData;
    const colors = CATEGORY_COLORS[e.category];
    const inCompare = compareSet.has(e.symbol);
    const ok = matchesFilter(e);
    const opacity = dim && !ok ? 'opacity:0.15;filter:grayscale(0.8);' : '';
    return `<div class="element-cell ${inCompare ? 'selected' : ''}"
      style="width:${CELL_W}px;height:${CELL_H}px;display:flex;flex-direction:column;align-items:center;justify-content:center;border-radius:6px;cursor:pointer;background:${colors.bg};border:1.5px solid ${inCompare ? 'var(--accent)' : colors.border};position:relative;${opacity}"
      data-symbol="${e.symbol}"
      title="${e.name} (${e.symbol}) · #${e.atomicNumber}&#10;原子量: ${e.atomicMass}&#10;单击查看详情，可加入对比">
      <span style="font-weight:700;font-size:14px;line-height:1;color:${colors.text}">${e.symbol}</span>
      <span style="font-size:10px;color:var(--text-muted);line-height:1;margin-top:3px">${e.atomicNumber}</span>
      <span style="font-size:8.5px;color:var(--text-muted);line-height:1;margin-top:2px">${e.atomicMass.toFixed(e.atomicMass < 100 ? 2 : 1)}</span>
      ${inCompare ? `<span style="position:absolute;top:2px;right:3px;font-size:9px;color:var(--accent);font-weight:700">✓</span>` : ''}
    </div>`;
  };

  let html = '';

  // Legend + category filter
  html += '<div class="flex flex-wrap gap-1.5 mb-3">';
  html += `<button class="cat-chip px-2.5 py-1 rounded-full text-xs transition-colors" data-cat="all"
    style="background:${categoryFilter === 'all' ? 'var(--accent)' : 'var(--input-bg)'};color:${categoryFilter === 'all' ? '#0f172a' : 'var(--text-secondary)'};border:1px solid ${categoryFilter === 'all' ? 'var(--accent)' : 'var(--border)'}">全部</button>`;
  for (const [cat, label] of Object.entries(CATEGORY_LABELS)) {
    const active = categoryFilter === cat;
    html += `<button class="cat-chip px-2.5 py-1 rounded-full text-xs transition-colors" data-cat="${cat}"
      style="background:${active ? 'var(--accent)' : 'var(--input-bg)'};color:${active ? '#0f172a' : 'var(--text-secondary)'};border:1px solid ${active ? 'var(--accent)' : 'var(--border)'}">${label}</button>`;
  }
  html += '</div>';

  html += `<div class="overflow-x-auto pb-2"><div style="display:flex;flex-direction:column;gap:4px;min-width:${CELL_W * 18 + 4 * 17}px">`;

  for (const row of LAYOUT) {
    html += `<div style="display:flex;gap:4px">`;
    for (const z of row) {
      html += z === null
        ? `<div style="width:${CELL_W}px;height:${CELL_H}px"></div>`
        : cellHtml(z);
    }
    html += '</div>';
  }

  html += '<div style="height:10px"></div>';

  const lanLeft = (CELL_W + 4) * 2 + 3;
  for (const series of [LANTHANIDES, ACTINIDES]) {
    html += `<div style="display:flex;gap:4px;margin-left:${lanLeft}px">`;
    for (const z of series) html += cellHtml(z);
    html += '</div>';
  }

  html += '</div></div>';
  html += '<p class="text-xs mt-3" style="color:var(--text-muted)">单击元素打开性质详情；在详情中选择"加入对比"，最多可同时对比 6 个元素</p>';
  return html;
}

// ===== RENDER COMPARE TRAY =====
function renderCompareTray(): string {
  if (compareSymbols.length === 0) return '';
  let html = `<div class="rounded-xl mt-4 px-4 py-3 flex items-center gap-2 flex-wrap" style="background:var(--bg-card);border:1px solid var(--accent)">
    <span class="text-xs font-bold" style="color:var(--accent)">对比列表（${compareSymbols.length}/${MAX_COMPARE}）</span>`;
  compareSymbols.forEach(s => {
    const e = el(s);
    const colors = CATEGORY_COLORS[e.category];
    html += `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold" style="background:${colors.bg};color:${colors.text};border:1px solid ${colors.border}">
      ${e.symbol} ${e.name}
      <button class="tray-remove font-bold" data-tray-remove="${s}" title="移除" style="color:var(--text-muted)">✕</button>
    </span>`;
  });
  html += `<button class="ml-auto px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors" data-action="clear-compare" style="background:var(--input-bg);color:var(--text-muted);border:1px solid var(--border)">清空对比</button>
    <button class="px-3 py-1.5 rounded-lg text-xs font-bold transition-colors" data-action="scroll-compare" style="background:var(--accent);color:#0f172a">查看对比 ↓</button>`;
  html += '</div>';
  return html;
}

// ===== PROPERTY ROW DEFINITIONS =====
interface PropRow {
  label: string;
  get: (e: ElementData, p: ElementProperty, x: ElementExtra) => string;
}

const PROP_ROWS: PropRow[] = [
  { label: '英文名', get: (_e, p) => p.nameEn },
  { label: '原子序数', get: (e) => String(e.atomicNumber) },
  { label: '相对原子质量', get: (e) => e.atomicMass.toFixed(4) },
  { label: '常温状态', get: (_e, p) => p.state },
  { label: '密度', get: (_e, p) => fmtDensity(p.density, p.state) },
  { label: '熔点', get: (_e, p) => fmtTemp(p.melting) },
  { label: '沸点', get: (_e, p) => fmtTemp(p.boiling) },
  { label: '比热容', get: (_e, _p, x) => fmtCp(x.specificHeat) },
  { label: '热导率', get: (_e, _p, x) => fmtK(x.thermalConductivity) },
  { label: '电负性', get: (_e, p) => p.electronegativity === null ? '未知' : `${p.electronegativity} (鲍林)` },
  { label: '第一电离能', get: (_e, p) => p.ionization === null ? '未知' : `${p.ionization} kJ/mol ≈ ${(p.ionization / 96.485).toFixed(2)} eV` },
  { label: '原子半径', get: (_e, p) => fmtRadius(p.radius) },
  { label: '共价半径', get: (_e, _p, x) => fmtRadius(x.covalentRadius) },
  { label: '范德华半径', get: (_e, _p, x) => fmtRadius(x.vdwRadius) },
  { label: '电子排布', get: (_e, p) => p.electronConfig },
  { label: '电子壳层分布', get: (_e, p) => fmtShells(computeShells(p.electronConfig)) },
  { label: '价电子数', get: (_e, p) => String(getValenceElectrons(p.electronConfig)) },
  { label: '所在区块', get: (e, p) => getBlock(p.electronConfig, e.atomicNumber) },
  { label: '常见化合价', get: (_e, p) => p.valence },
  { label: '氧化态', get: (_e, _p, x) => x.oxidationStates },
  { label: '晶体结构', get: (_e, _p, x) => x.crystalStructure },
  { label: '所在周期/族', get: (e) => `第${e.period}周期 / ${e.group ? `第${e.group}族` : '镧系/锕系'}` },
  { label: '发现年份', get: (_e, p) => p.year },
];

// Numeric props for bar charts: [label, extractor, unit]
const BAR_PROPS: { label: string; unit: string; val: (e: ElementData, p: ElementProperty, x: ElementExtra) => number | null }[] = [
  { label: '熔点', unit: '℃', val: (_e, p) => p.melting },
  { label: '沸点', unit: '℃', val: (_e, p) => p.boiling },
  { label: '密度', unit: '', val: (_e, p) => p.density },
  { label: '比热容', unit: 'J/(g·K)', val: (_e, _p, x) => x.specificHeat },
  { label: '热导率', unit: 'W/(m·K)', val: (_e, _p, x) => x.thermalConductivity },
  { label: '电负性', unit: '', val: (_e, p) => p.electronegativity },
  { label: '第一电离能', unit: 'kJ/mol', val: (_e, p) => p.ionization },
  { label: '原子半径', unit: 'pm', val: (_e, p) => p.radius },
  { label: '共价半径', unit: 'pm', val: (_e, _p, x) => x.covalentRadius },
];

// ===== BOHR MODEL (animated SVG, webqc-style) =====
function renderBohrModel(e: ElementData, p: ElementProperty, size: number): string {
  const shells = computeShells(p.electronConfig);
  const colors = CATEGORY_COLORS[e.category];
  const CX = 100, CY = 100;
  const nucleusR = 12;

  const nucleus = `<circle cx="${CX}" cy="${CY}" r="${nucleusR}" fill="${colors.bg}" stroke="${colors.border}" stroke-width="1.6"/>
    <text x="${CX}" y="${CY}" text-anchor="middle" dominant-baseline="central" font-size="10.5" font-weight="700" fill="${colors.text}">${e.symbol}</text>`;

  if (shells.length === 0) {
    return `<svg viewBox="0 0 200 200" width="${size}" height="${size}" style="max-width:100%" role="img" aria-label="${e.name}的玻尔原子模型">${nucleus}</svg>`;
  }

  const innerR = 26;
  const outerR = 96;
  const ringR = (i: number): number =>
    shells.length === 1 ? outerR : innerR + (outerR - innerR) * (i / (shells.length - 1));

  let body = '';
  shells.forEach((count, i) => {
    const r = ringR(i);
    body += `<circle cx="${CX}" cy="${CY}" r="${r.toFixed(1)}" fill="none" stroke="${colors.border}" stroke-opacity="0.5" stroke-width="1.1"/>`;
    const dotR = Math.max(1.6, Math.min(3.4, ((2 * Math.PI * r) / count) * 0.17));
    const dur = 6 + i * 4;
    const from = i % 2 === 0 ? 0 : 360;
    const to = i % 2 === 0 ? 360 : 0;
    let dots = '';
    for (let k = 0; k < count; k++) {
      const a = (2 * Math.PI * k) / count - Math.PI / 2;
      dots += `<circle cx="${(CX + r * Math.cos(a)).toFixed(1)}" cy="${(CY + r * Math.sin(a)).toFixed(1)}" r="${dotR.toFixed(2)}" fill="${colors.text}" fill-opacity="0.92"/>`;
    }
    body += `<g><animateTransform attributeName="transform" type="rotate" from="${from} ${CX} ${CY}" to="${to} ${CX} ${CY}" dur="${dur}s" repeatCount="indefinite"/>${dots}</g>`;
  });

  return `<svg viewBox="0 0 200 200" width="${size}" height="${size}" style="max-width:100%" role="img" aria-label="${e.name}的玻尔原子模型（动效）">
    ${body}
    ${nucleus}
  </svg>`;
}

// ===== RENDER COMPARISON =====
function renderComparison(): string {
  if (compareSymbols.length === 0) {
    return `<div class="rounded-xl mt-4 p-6 text-center" style="background:var(--bg-card);border:1px dashed var(--border)">
      <p class="text-sm" style="color:var(--text-muted)">在上方周期表中单击元素打开详情，选择"加入对比"即可进行横向对比（2–6 个元素）</p>
    </div>`;
  }

  if (compareSymbols.length === 1) {
    const e = el(compareSymbols[0]);
    return `<div class="rounded-xl mt-4 p-6 text-center" style="background:var(--bg-card);border:1px dashed var(--border)">
      <p class="text-sm" style="color:var(--text-muted)">已加入 <span style="color:var(--accent);font-weight:700">${e.symbol} ${e.name}</span>，再选择至少 1 个元素即可开始横向对比</p>
    </div>`;
  }

  const items = compareSymbols.map(s => ({
    e: el(s),
    p: getProp(el(s).atomicNumber),
    x: getExtra(el(s).atomicNumber),
  }));

  // ---- Horizontal comparison table ----
  let html = `<div id="compare-section" class="rounded-xl mt-4 overflow-hidden fade-in" style="background:var(--bg-card);border:1px solid var(--border)">
    <div class="flex items-center gap-2 px-4 py-3" style="border-bottom:1px solid var(--border)">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><path d="M12 2v20M2 12h20"/><circle cx="12" cy="12" r="10"/></svg>
      <h2 class="text-sm font-bold flex-1" style="color:var(--text-primary)">元素性质横向对比（${compareSymbols.length} 个）</h2>
    </div>
    <div class="overflow-x-auto"><table class="w-full text-sm" style="border-collapse:collapse">`;

  // Header row: element names
  html += '<thead><tr style="border-bottom:1px solid var(--border)">';
  html += '<th class="px-3 py-3 text-left text-xs font-bold sticky left-0 z-10" style="color:var(--text-muted);background:var(--input-bg);min-width:110px">性质条目</th>';
  items.forEach(({ e }) => {
    const colors = CATEGORY_COLORS[e.category];
    html += `<th class="px-3 py-3 text-left" style="background:var(--input-bg);min-width:150px">
      <button class="comp-detail flex items-center gap-2" data-detail="${e.symbol}" title="查看${e.name}详情">
        <span class="inline-flex items-center justify-center w-8 h-8 rounded text-sm font-bold" style="background:${colors.bg};color:${colors.text};border:1px solid ${colors.border}">${e.symbol}</span>
        <span class="text-left">
          <span class="block text-sm font-bold" style="color:var(--text-primary)">${e.name}</span>
          <span class="block text-xs" style="color:var(--text-muted)">#${e.atomicNumber}</span>
        </span>
      </button>
    </th>`;
  });
  html += '</tr></thead><tbody>';

  PROP_ROWS.forEach((row, ri) => {
    html += `<tr style="${ri < PROP_ROWS.length - 1 ? 'border-bottom:1px solid var(--border)' : ''}">`;
    html += `<td class="px-3 py-2.5 text-xs font-semibold sticky left-0 z-10" style="color:var(--text-muted);background:var(--input-bg)">${row.label}</td>`;
    items.forEach(({ e, p, x }) => {
      html += `<td class="px-3 py-2.5 text-xs" style="color:var(--text-secondary)">${row.get(e, p, x)}</td>`;
    });
    html += '</tr>';
  });

  html += '</tbody></table></div>';

  // ---- Bohr model animated visualization ----
  html += '<div class="px-4 py-4" style="border-top:1px solid var(--border)">';
  html += `<div class="flex items-center gap-2 mb-1">
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><circle cx="12" cy="12" r="2"/><ellipse cx="12" cy="12" rx="10" ry="4"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(-60 12 12)"/></svg>
    <h3 class="text-xs font-bold" style="color:var(--text-primary)">原子结构可视化（玻尔模型动效）</h3>
  </div>
  <p class="text-xs mb-3" style="color:var(--text-muted)">各电子层由内至外以不同转速旋转（相邻层反向），直观对比电子层数量与各层电子分布</p>`;
  html += '<div class="flex flex-wrap gap-3">';
  items.forEach(({ e, p }) => {
    const shells = computeShells(p.electronConfig);
    html += `<div class="flex flex-col items-center rounded-xl px-3 py-3" style="background:var(--input-bg);border:1px solid var(--border);flex:1;min-width:150px;max-width:200px">
      ${renderBohrModel(e, p, 150)}
      <span class="text-sm font-bold mt-1" style="color:var(--text-primary)">${e.symbol} ${e.name}</span>
      <span class="text-xs mt-0.5" style="color:var(--text-muted)">${shells.length} 层 · ${shells.join('·')}</span>
    </div>`;
  });
  html += '</div></div>';

  // ---- Bar charts for numeric props ----
  html += '<div class="px-4 py-4" style="border-top:1px solid var(--border)">';
  html += `<div class="flex items-center gap-2 mb-3">
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><path d="M3 3v18h18"/><path d="M7 16v-5M12 16V8M17 16v-9"/></svg>
    <h3 class="text-xs font-bold" style="color:var(--text-primary)">数值性质对比图</h3>
  </div>`;

  BAR_PROPS.forEach(({ label, unit, val }) => {
    const values = items.map(({ e, p, x }) => ({ e, v: val(e, p, x) }));
    const valid = values.filter(it => it.v !== null && isFinite(it.v)) as { e: ElementData; v: number }[];
    if (valid.length < 2) return;
    const maxAbs = Math.max(...valid.map(it => Math.abs(it.v)));
    if (maxAbs === 0) return;

    html += `<div class="mb-3">
      <div class="text-xs font-semibold mb-1.5" style="color:var(--text-secondary)">${label}${unit ? ` (${unit})` : ''}</div>
      <div class="space-y-1">`;
    values.forEach(({ e, v }) => {
      const colors = CATEGORY_COLORS[e.category];
      const w = v === null || !isFinite(v) ? 0 : Math.max(Math.abs(v) / maxAbs * 100, 1.5);
      html += `<div class="flex items-center gap-2">
        <span class="text-xs font-bold w-8 shrink-0" style="color:${colors.text}">${e.symbol}</span>
        <div class="flex-1 h-4 rounded" style="background:var(--input-bg);position:relative">
          <div class="h-4 rounded" style="width:${w}%;background:linear-gradient(90deg,${colors.border},${colors.text});opacity:0.85"></div>
        </div>
        <span class="text-xs font-mono w-28 text-right shrink-0" style="color:var(--text-secondary)">${v === null ? '—' : `${v}${unit ? ' ' + unit : ''}`}</span>
      </div>`;
    });
    html += '</div></div>';
  });

  html += `<div class="px-1 py-2 text-xs" style="color:var(--text-muted)">注：密度单位随常温状态而异（气体 g/L、固/液体 g/cm³），对比时请留意量纲；合成元素部分数据为预测值</div>`;
  html += '</div>';

  // Footnote
  html += `<div class="px-4 py-2.5 text-xs" style="color:var(--text-muted);background:var(--input-bg);border-top:1px solid var(--border)">数据来源：IUPAC 标准原子量 / CRC 化学手册 / Pyykkö 单键共价半径（共价半径、第一电离能、电负性、电子排布、价电子等与 zh.webqc.org 元素页一致）；熔沸点等热力学数据以 CRC/IUPAC 现行值为准；"未知" 表示暂无可靠实测数据</div>`;
  html += '</div>';
  return html;
}

// ===== RENDER DETAIL MODAL =====
function renderDetail(symbol: string): string {
  const e = el(symbol);
  const p = getProp(e.atomicNumber);
  const x = getExtra(e.atomicNumber);
  const colors = CATEGORY_COLORS[e.category];
  const inCompare = compareSymbols.includes(symbol);

  let html = `<div id="detail-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4" style="background:rgba(0,0,0,0.6)" data-modal>
    <div class="rounded-2xl w-full max-w-md max-h-[85vh] overflow-y-auto fade-in" style="background:var(--bg-card);border:1px solid var(--border)">
      <div class="sticky top-0 flex items-center gap-3 px-5 py-4 z-10" style="background:var(--bg-card);border-bottom:1px solid var(--border)">
        <span class="inline-flex items-center justify-center w-12 h-12 rounded-xl text-lg font-bold" style="background:${colors.bg};color:${colors.text};border:1.5px solid ${colors.border}">${e.symbol}</span>
        <div class="flex-1">
          <h3 class="text-base font-bold" style="color:var(--text-primary)">${e.name} · ${p.nameEn}</h3>
          <p class="text-xs" style="color:var(--text-muted)">#${e.atomicNumber} · ${CATEGORY_LABELS[e.category] || e.category}</p>
        </div>
        <button class="detail-close w-8 h-8 rounded-full flex items-center justify-center text-base" style="background:var(--border);color:var(--text-muted)" data-close-modal>✕</button>
      </div>
      <div class="px-5 py-3 flex items-center gap-4" style="border-bottom:1px solid var(--border)">
        <div class="shrink-0">${renderBohrModel(e, p, 112)}</div>
        <div class="text-xs leading-relaxed" style="color:var(--text-muted)">
          <div class="font-bold mb-1 text-sm" style="color:var(--text-primary)">玻尔原子模型（动效）</div>
          <div>电子壳层: ${fmtShells(computeShells(p.electronConfig))}</div>
          <div>价电子数: ${getValenceElectrons(p.electronConfig)} · 所在区块: ${getBlock(p.electronConfig, e.atomicNumber)}</div>
          <div>各层电子由内至外反向旋转展示</div>
        </div>
      </div>
      <div class="px-5 py-3">`;
  PROP_ROWS.forEach((row, i) => {
    html += `<div class="flex justify-between gap-4 py-2.5" style="${i < PROP_ROWS.length - 1 ? 'border-bottom:1px solid var(--border)' : ''}">
      <span class="text-sm shrink-0" style="color:var(--text-muted)">${row.label}</span>
      <span class="text-sm text-right font-medium" style="color:var(--text-primary)">${row.get(e, p, x)}</span>
    </div>`;
  });
  html += `</div>
      <div class="px-5 pb-5 flex gap-2">
        <button class="flex-1 py-2.5 rounded-xl text-sm font-bold transition-colors" data-toggle-compare="${e.symbol}"
          style="background:${inCompare ? 'var(--input-bg)' : 'var(--accent)'};color:${inCompare ? 'var(--text-muted)' : '#0f172a'};border:1px solid ${inCompare ? 'var(--border)' : 'var(--accent)'}">
          ${inCompare ? '从对比中移除' : '加入对比'}
        </button>
        <button class="px-5 py-2.5 rounded-xl text-sm font-semibold" data-close-modal style="background:var(--bg-card-hover);color:var(--text-secondary)">关闭</button>
      </div>
    </div>
  </div>`;
  return html;
}

// ===== RENDER THEME SWITCHER =====
function renderThemeSwitcher(): string {
  let html = '<div class="flex items-center gap-1.5">';
  html += '<span class="text-xs mr-1" style="color:var(--text-muted)">主题</span>';
  THEMES.forEach(theme => {
    const isActive = currentTheme === theme.id;
    html += `<button class="theme-btn w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${isActive ? 'active' : ''}"
      data-theme="${theme.id}"
      title="${theme.name}"
      style="background:${theme.color};border:2px solid ${isActive ? 'var(--accent)' : 'var(--border)'};color:${theme.id === 'light' ? '#1e293b' : '#f1f5f9'}">
      ${isActive ? '✓' : ''}
    </button>`;
  });
  html += '</div>';
  return html;
}

// ===== MAIN RENDER =====
function render(): void {
  const app = document.getElementById('app');
  if (!app) return;

  // Preserve search input focus & caret
  const activeInput = document.activeElement;
  let searchFocused = false;
  let caret = 0;
  if (activeInput && activeInput instanceof HTMLInputElement && activeInput.id === 'table-search') {
    searchFocused = true;
    caret = activeInput.selectionStart || 0;
  }

  app.innerHTML = `
    <header class="px-6 py-4 flex items-center justify-between gap-3 flex-wrap" style="background:var(--header-gradient);border-bottom:1px solid var(--border)">
      <div class="flex items-center gap-2">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="2"/><ellipse cx="12" cy="12" rx="10" ry="4"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(-60 12 12)"/>
        </svg>
        <div>
          <h1 class="text-lg font-bold text-white leading-tight">元素性质百科</h1>
          <p class="text-xs" style="color:#7dd3fc;opacity:0.85">118 种元素物化性质浏览与横向对比 | IUPAC / CRC 标准数据</p>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <a href="index.html" class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors" style="background:rgba(255,255,255,0.12);color:#f1f5f9;border:1px solid rgba(255,255,255,0.25)">← 返回转换工具</a>
        ${renderThemeSwitcher()}
      </div>
    </header>

    <div class="max-w-[1600px] mx-auto px-4 py-4">
      <!-- Toolbar -->
      <div class="rounded-xl p-4 mb-4 flex flex-wrap items-center gap-3" style="background:var(--bg-card);border:1px solid var(--border)">
        <div class="flex items-center gap-2 flex-1 min-w-[240px]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2" class="shrink-0"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input id="table-search" type="text" placeholder="搜索元素：符号 / 中文名 / 英文名 / 原子序数"
            value="${searchQuery}"
            class="w-full px-3 py-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-sky-400/40"
            style="background:var(--input-bg);border:1px solid var(--border);color:var(--text-primary)" />
          ${searchQuery ? '<button id="search-clear" class="text-xs px-2 py-1 rounded" style="color:var(--text-muted)" title="清空搜索">✕</button>' : ''}
        </div>
        <button class="px-3 py-2 rounded-lg text-xs font-semibold transition-colors" data-action="quick-biinsn"
          style="background:var(--input-bg);color:var(--text-secondary);border:1px solid var(--border)"
          title="一键加入 Bi / In / Sn 进行对比">Bi·In·Sn 快捷对比</button>
        <span class="text-xs" style="color:var(--text-muted)">对比 ${compareSymbols.length}/${MAX_COMPARE}</span>
      </div>

      <!-- Periodic table -->
      <div class="rounded-xl p-5" style="background:var(--bg-card);border:1px solid var(--border)">
        <div class="flex items-center gap-2 mb-3">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
          <h2 class="text-sm font-bold" style="color:var(--text-primary)">元素周期表</h2>
        </div>
        ${renderTableGrid()}
      </div>

      ${renderCompareTray()}
      ${renderComparison()}
    </div>

    ${detailSymbol ? renderDetail(detailSymbol) : ''}
  `;

  attachEvents();

  if (searchFocused) {
    const input = document.getElementById('table-search') as HTMLInputElement | null;
    if (input) {
      input.focus();
      try { input.setSelectionRange(caret, caret); } catch { /* ignore */ }
    }
  }
}

// ===== EVENTS =====
function attachEvents(): void {
  const app = document.getElementById('app');
  if (!app) return;

  // Element cells → open detail
  app.querySelectorAll('.element-cell').forEach(cell => {
    cell.addEventListener('click', () => {
      const symbol = (cell as HTMLElement).dataset.symbol;
      if (symbol) { detailSymbol = symbol; render(); }
    });
  });

  // Category chips
  app.querySelectorAll('.cat-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const cat = (chip as HTMLElement).dataset.cat;
      if (cat) { categoryFilter = cat; render(); }
    });
  });

  // Search
  const search = document.getElementById('table-search') as HTMLInputElement | null;
  if (search) {
    search.addEventListener('input', () => {
      searchQuery = search.value;
      // Lightweight re-render preserving focus (handled in render)
      render();
    });
  }
  const searchClear = document.getElementById('search-clear');
  if (searchClear) {
    searchClear.addEventListener('click', () => {
      searchQuery = '';
      render();
    });
  }

  // Modal close
  app.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => { detailSymbol = null; render(); });
  });
  app.querySelectorAll('[data-modal]').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) { detailSymbol = null; render(); }
    });
  });

  // Compare toggle (in detail modal)
  app.querySelectorAll('[data-toggle-compare]').forEach(btn => {
    btn.addEventListener('click', () => {
      const symbol = (btn as HTMLElement).dataset.toggleCompare;
      if (!symbol) return;
      const idx = compareSymbols.indexOf(symbol);
      if (idx >= 0) compareSymbols.splice(idx, 1);
      else {
        if (compareSymbols.length >= MAX_COMPARE) return;
        compareSymbols.push(symbol);
      }
      detailSymbol = null;
      render();
    });
  });

  // Tray remove
  app.querySelectorAll('[data-tray-remove]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const symbol = (btn as HTMLElement).dataset.trayRemove;
      if (symbol) {
        compareSymbols = compareSymbols.filter(s => s !== symbol);
        render();
      }
    });
  });

  // Detail buttons in comparison header
  app.querySelectorAll('[data-detail]').forEach(btn => {
    btn.addEventListener('click', () => {
      const symbol = (btn as HTMLElement).dataset.detail;
      if (symbol) { detailSymbol = symbol; render(); }
    });
  });

  // Actions
  app.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = (btn as HTMLElement).dataset.action;
      if (action === 'clear-compare') {
        compareSymbols = [];
        render();
      } else if (action === 'scroll-compare') {
        const sec = document.getElementById('compare-section');
        if (sec) sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (action === 'quick-biinsn') {
        ['Bi', 'In', 'Sn'].forEach(s => {
          if (!compareSymbols.includes(s) && compareSymbols.length < MAX_COMPARE) {
            compareSymbols.push(s);
          }
        });
        render();
        const sec = document.getElementById('compare-section');
        if (sec) sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Theme
  app.querySelectorAll('.theme-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const t = (btn as HTMLElement).dataset.theme as Theme;
      if (t) { applyTheme(t); render(); }
    });
  });
}

// ===== INIT =====
export function initTableApp(): void {
  applyTheme(currentTheme);
  render();
}

initTableApp();
