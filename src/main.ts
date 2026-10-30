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

// ===== STATE =====
type Mode = 'mass-to-mole' | 'mole-to-mass';
type Theme = 'dark' | 'light' | 'ocean' | 'forest' | 'sunset';

interface SelectedItem {
  symbol: string;
  value: number;
}

interface ConversionResult {
  symbol: string;
  name: string;
  atomicMass: number;
  inputValue: number;
  outputValue: number;
}

let mode: Mode = 'mass-to-mole';
let selectedItems: SelectedItem[] = [];
let lastResult: {
  results: ConversionResult[];
  totalInput: number;
  totalOutput: number;
  inputLabel: string;
  outputLabel: string;
  normalized: boolean;
  totalBefore: number | null;
  scale: number;
} | null = null;
let currentTheme: Theme = 'dark';
let detailSymbol: string | null = null;
let propPanelOpen = false;
let normalizeOn = false;

// Cell dimensions (enlarged for easier clicking)
const CELL_W = 52;
const CELL_H = 62;

// ===== THEMES =====
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

// ===== HELPERS =====
function fmt(v: number): string {
  return v.toFixed(4);
}

function el(symbol: string): ElementData {
  return ELEMENT_MAP[symbol] as ElementData;
}

// ===== RENDER PERIODIC TABLE =====
function renderPeriodicTable(): string {
  const selectedSet = new Set(selectedItems.map(i => i.symbol));

  let html = '';

  // Legend
  html += '<div class="flex flex-wrap gap-2 mb-3">';
  for (const [cat, label] of Object.entries(CATEGORY_LABELS)) {
    const colors = CATEGORY_COLORS[cat];
    html += `<div class="flex items-center gap-1.5 text-xs" style="color:${colors.text}">
      <span class="w-3 h-3 rounded-sm inline-block" style="background:${colors.bg};border:1px solid ${colors.border}"></span>
      ${label}
    </div>`;
  }
  html += '</div>';

  // Table
  html += `<div class="overflow-x-auto pb-2"><div style="display:flex;flex-direction:column;gap:4px;min-width:${CELL_W * 18 + 4 * 17}px">`;

  // Main rows
  for (const row of LAYOUT) {
    html += `<div style="display:flex;gap:4px">`;
    for (const z of row) {
      if (z === null) {
        html += `<div style="width:${CELL_W}px;height:${CELL_H}px"></div>`;
      } else {
        const e = ELEMENT_MAP[z] as ElementData;
        const colors = CATEGORY_COLORS[e.category];
        const sel = selectedSet.has(e.symbol);
        html += `<div class="element-cell ${sel ? 'selected' : ''}" 
          style="width:${CELL_W}px;height:${CELL_H}px;display:flex;flex-direction:column;align-items:center;justify-content:center;border-radius:6px;cursor:pointer;background:${colors.bg};border:1.5px solid ${sel ? 'var(--accent)' : colors.border};position:relative"
          data-symbol="${e.symbol}"
          title="${e.name} (${e.symbol})&#10;原子序数: ${e.atomicNumber}&#10;原子量: ${e.atomicMass}">
          <span style="font-weight:700;font-size:14px;line-height:1;color:${colors.text}">${e.symbol}</span>
          <span style="font-size:10px;color:var(--text-muted);line-height:1;margin-top:3px">${e.atomicNumber}</span>
        </div>`;
      }
    }
    html += '</div>';
  }

  // Separator
  html += '<div style="height:10px"></div>';

  // Lanthanides & Actinides offset
  const lanLeft = (CELL_W + 4) * 2 + 3; // align after group 2
  html += `<div style="display:flex;gap:4px;margin-left:${lanLeft}px">`;
  for (const z of LANTHANIDES) {
    const e = ELEMENT_MAP[z] as ElementData;
    const colors = CATEGORY_COLORS[e.category];
    const sel = selectedSet.has(e.symbol);
    html += `<div class="element-cell ${sel ? 'selected' : ''}"
      style="width:${CELL_W}px;height:${CELL_H}px;display:flex;flex-direction:column;align-items:center;justify-content:center;border-radius:6px;cursor:pointer;background:${colors.bg};border:1.5px solid ${sel ? 'var(--accent)' : colors.border}"
      data-symbol="${e.symbol}"
      title="${e.name} (${e.symbol})&#10;原子序数: ${e.atomicNumber}&#10;原子量: ${e.atomicMass}">
      <span style="font-weight:700;font-size:14px;line-height:1;color:${colors.text}">${e.symbol}</span>
      <span style="font-size:10px;color:var(--text-muted);line-height:1;margin-top:3px">${e.atomicNumber}</span>
    </div>`;
  }
  html += '</div>';

  html += `<div style="display:flex;gap:4px;margin-left:${lanLeft}px">`;
  for (const z of ACTINIDES) {
    const e = ELEMENT_MAP[z] as ElementData;
    const colors = CATEGORY_COLORS[e.category];
    const sel = selectedSet.has(e.symbol);
    html += `<div class="element-cell ${sel ? 'selected' : ''}"
      style="width:${CELL_W}px;height:${CELL_H}px;display:flex;flex-direction:column;align-items:center;justify-content:center;border-radius:6px;cursor:pointer;background:${colors.bg};border:1.5px solid ${sel ? 'var(--accent)' : colors.border}"
      data-symbol="${e.symbol}"
      title="${e.name} (${e.symbol})&#10;原子序数: ${e.atomicNumber}&#10;原子量: ${e.atomicMass}">
      <span style="font-weight:700;font-size:14px;line-height:1;color:${colors.text}">${e.symbol}</span>
      <span style="font-size:10px;color:var(--text-muted);line-height:1;margin-top:3px">${e.atomicNumber}</span>
    </div>`;
  }
  html += '</div>';

  html += '</div></div>';

  // Hint
  html += '<p class="text-xs mt-3" style="color:var(--text-muted)">单击元素添加到配方列表，再次点击移除；<span style="color:var(--accent)">双击元素</span>查看详细性质</p>';

  return html;
}

// ===== RENDER COMPOSITION INPUT =====
function renderComposition(): string {
  if (selectedItems.length === 0) {
    return '<div class="text-center py-10" style="color:var(--text-muted);background:var(--input-bg);border-radius:8px">请从元素周期表中选择元素</div>';
  }

  const valueLabel = mode === 'mass-to-mole' ? '质量分数(%)' : '摩尔分数(%)';

  let html = '';

  // Header
  html += `<div class="flex items-center px-4 py-3 rounded-t-lg" style="background:var(--input-bg)">
    <span class="flex-1 text-sm font-semibold" style="color:var(--text-muted)">元素</span>
    <span class="flex-1 text-sm font-semibold" style="color:var(--text-muted)">原子量</span>
    <span class="flex-1 text-sm font-semibold" style="color:var(--text-muted)">${valueLabel}</span>
    <span class="w-10"></span>
  </div>`;

  // Body
  html += '<div class="rounded-b-lg" style="border:1px solid var(--border);border-top:none">';

  selectedItems.forEach((item, idx) => {
    const e = el(item.symbol);
    const colors = CATEGORY_COLORS[e.category];
    html += `<div class="flex items-center px-4 py-3.5" style="${idx < selectedItems.length - 1 ? 'border-bottom:1px solid var(--border)' : ''}">
      <div class="flex-1 flex items-center gap-2.5">
        <span class="inline-flex items-center justify-center w-9 h-9 rounded text-sm font-bold" style="background:${colors.bg};color:${colors.text};border:1px solid ${colors.border}">${e.symbol}</span>
        <span class="text-base font-medium">${e.symbol}</span>
        <span class="text-sm" style="color:var(--text-muted)">${e.name}</span>
      </div>
      <div class="flex-1 font-mono text-base" style="color:var(--text-secondary)">${e.atomicMass.toFixed(4)}</div>
      <div class="flex-1">
        <input type="text" inputmode="decimal" placeholder="0.00" value="${item.value || ''}"
          class="comp-input w-full px-3 py-2.5 rounded-lg text-base text-right font-mono outline-none focus:ring-2 focus:ring-sky-400/40"
          style="background:var(--input-bg);border:1px solid var(--border);color:var(--text-primary)"
          data-input-idx="${idx}" />
      </div>
      <div class="w-10 text-center">
        <button class="remove-btn w-7 h-7 rounded-full flex items-center justify-center text-sm transition-colors"
          style="background:var(--border);color:var(--text-muted)"
          data-remove-idx="${idx}" title="移除">✕</button>
      </div>
    </div>`;
  });

  html += '</div>';

  // Total area (will be updated in-place)
  html += '<div id="comp-total">';
  html += renderTotal();
  html += '</div>';

  return html;
}

function renderTotal(): string {
  const total = selectedItems.reduce((s, i) => s + i.value, 0);
  const totalColor = Math.abs(total - 100) < 0.01 ? 'var(--success)' : total > 100 ? 'var(--error)' : total > 0 ? 'var(--warning)' : 'var(--text-muted)';

  let html = `<div class="flex items-center px-4 py-3" style="background:var(--input-bg);border-top:1px solid var(--border);border-radius:0 0 8px 8px;margin-top:-1px">
    <span class="flex-1 text-sm font-semibold" style="color:var(--text-muted)">总计</span>
    <span class="flex-1 text-center text-sm" style="color:var(--text-muted)">—</span>
    <span class="flex-1 font-mono text-lg font-bold" style="color:${totalColor}">${total.toFixed(2)}</span>
    <span class="w-10"></span>
  </div>`;

  // Hint
  if (Math.abs(total - 100) > 0.01 && total > 0) {
    if (normalizeOn) {
      html += `<div class="text-sm mt-2" style="color:var(--accent)">已勾选归一化计算：执行时将按比例缩放至 100.00%（缩放系数 ${(100 / total).toFixed(4)}）</div>`;
    } else {
      const cls = total > 100 ? 'var(--error)' : 'var(--warning)';
      const msg = total < 100
        ? `提示: 总和不足100%，还差${(100 - total).toFixed(2)}%（可勾选"归一化计算"自动缩放）`
        : `警告: 总和超过100%，超出${(total - 100).toFixed(2)}%（可勾选"归一化计算"自动缩放）`;
      html += `<div class="text-sm mt-2" style="color:${cls}">${msg}</div>`;
    }
  }

  return html;
}

// ===== RENDER RESULT =====
function renderResult(): string {
  if (!lastResult) return '';

  const r = lastResult;

  let html = '<div class="fade-in">';

  // Normalization banner
  if (r.normalized) {
    const beforeTxt = r.totalBefore === null ? '100.00' : r.totalBefore.toFixed(2);
    html += `<div class="flex items-center gap-2 px-3 py-2.5 rounded-lg mb-3 text-sm" style="background:rgba(56,189,248,0.08);border:1px solid rgba(56,189,248,0.25);color:var(--accent)">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="shrink-0"><path d="M8 3H3m0 0v5m0-5 5 5M16 21h5m0 0v-5m0 5-5-5"/></svg>
      <span>已启用归一化计算：输入总和 ${beforeTxt}% → 100.00%（各成分等比缩放，缩放系数 ${r.scale.toFixed(4)}）</span>
    </div>`;
  }

  // Result table
  html += '<div class="overflow-x-auto"><table class="w-full text-sm">';
  html += '<thead><tr>';
  html += '<th class="px-4 py-3 text-left text-sm font-semibold" style="color:var(--text-muted);background:var(--input-bg)">元素</th>';
  html += '<th class="px-4 py-3 text-left text-sm font-semibold" style="color:var(--text-muted);background:var(--input-bg)">原子量</th>';
  if (r.normalized) {
    html += `<th class="px-4 py-3 text-right text-sm font-semibold" style="color:var(--text-muted);background:var(--input-bg)">归一化前(${mode === 'mass-to-mole' ? 'wt%' : 'mol%'})</th>`;
    html += `<th class="px-4 py-3 text-right text-sm font-semibold" style="color:var(--warning);background:var(--input-bg)">归一化后输入</th>`;
  } else {
    html += `<th class="px-4 py-3 text-right text-sm font-semibold" style="color:var(--text-muted);background:var(--input-bg)">${r.inputLabel}</th>`;
  }
  html += `<th class="px-4 py-3 text-right text-sm font-semibold" style="color:var(--accent);background:var(--input-bg)">${r.outputLabel}</th>`;
  html += '</tr></thead><tbody>';

  r.results.forEach(res => {
    const colors = CATEGORY_COLORS[el(res.symbol).category];
    const origVal = res.inputValue / r.scale;
    html += `<tr style="border-bottom:1px solid var(--border)">
      <td class="px-4 py-3">
        <span class="inline-flex items-center justify-center w-6 h-6 rounded text-xs font-bold mr-2" style="background:${colors.bg};color:${colors.text}">${res.symbol}</span>
        <span class="font-medium">${res.symbol}</span>
        <span class="text-sm ml-1" style="color:var(--text-muted)">${res.name}</span>
      </td>
      <td class="px-4 py-3 font-mono" style="color:var(--text-secondary)">${fmt(res.atomicMass)}</td>
      ${r.normalized
        ? `<td class="px-4 py-3 text-right font-mono" style="color:var(--text-muted)">${fmt(origVal)}</td>
           <td class="px-4 py-3 text-right font-mono" style="color:var(--warning)">${fmt(res.inputValue)}</td>`
        : `<td class="px-4 py-3 text-right font-mono" style="color:var(--text-secondary)">${fmt(res.inputValue)}</td>`}
      <td class="px-4 py-3 text-right font-mono font-bold" style="color:var(--accent)">${fmt(res.outputValue)}</td>
    </tr>`;
  });

  // Total row
  const totalCheck = Math.abs(r.totalOutput - 100) < 0.01;
  html += `<tr style="background:rgba(56,189,248,0.05)">
    <td class="px-4 py-3 font-semibold text-sm" style="color:var(--text-muted)">总计</td>
    <td class="px-4 py-3 text-sm" style="color:var(--text-muted)">—</td>
    <td class="px-4 py-3 text-right font-mono font-semibold" style="color:var(--text-secondary)">${fmt(r.totalInput)}</td>
    <td class="px-4 py-3 text-right font-mono font-bold" style="color:var(--accent)">${fmt(r.totalOutput)} ${totalCheck ? '✓' : ''}</td>
  </tr>`;

  html += '</tbody></table></div>';

  // Footer
  html += '<div class="flex items-center justify-between mt-3">';
  html += `<div class="flex items-center gap-1.5 text-sm" style="color:var(--success)">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
    转换完成，总和 ${fmt(r.totalOutput)}%
  </div>`;
  html += '<button class="export-btn flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors" style="background:var(--bg-card-hover);color:var(--text-secondary)" data-action="export">导出结果</button>';
  html += '</div>';

  html += '</div>';

  return html;
}

// ===== RENDER CALCULATION PROCESS =====
function renderCalcProcess(): string {
  if (!lastResult) return '';

  const r = lastResult;
  const isM2X = mode === 'mass-to-mole';
  let html = '<div class="fade-in mt-4 pt-4" style="border-top:1px dashed var(--border)">';

  // Section title
  html += `<div class="flex items-center gap-2 mb-2">
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><path d="M9 7h2v10M9 7H7m9 3v6m0-3h3m-7 3h.01M17 7h.01"/></svg>
    <h3 class="text-xs font-bold" style="color:var(--text-primary)">计算公式与过程</h3>
  </div>`;

  // Formula box
  html += `<div class="rounded-lg p-3 mb-3 font-mono text-xs leading-relaxed" style="background:var(--input-bg);border:1px solid var(--border);color:var(--text-secondary)">`;
  if (r.normalized) {
    const beforeTxt = r.totalBefore === null ? '100' : r.totalBefore.toFixed(2);
    html += `<div class="font-bold mb-1" style="color:var(--warning)">⓪ 归一化（${r.inputLabel} 总和 ${beforeTxt}% ≠ 100%）</div>`;
    html += `<div>缩放系数 k = 100 / ${beforeTxt} = ${r.scale.toFixed(4)}；w'<sub>i</sub> = w<sub>i</sub> × k → Σw' = 100%</div>`;
    html += `<div class="mt-2"></div>`;
  }
  if (isM2X) {
    html += `<div class="font-bold mb-1" style="color:var(--accent)">质量分数 wt% → 摩尔分数 mol%</div>`;
    html += `<div>① 取 100 g 样品：m<sub>i</sub> = w<sub>i</sub> (g)</div>`;
    html += `<div>② 物质的量：n<sub>i</sub> = m<sub>i</sub> / M<sub>i</sub></div>`;
    html += `<div>③ 摩尔分数：x<sub>i</sub> = n<sub>i</sub> / Σn × 100%</div>`;
  } else {
    html += `<div class="font-bold mb-1" style="color:var(--accent)">摩尔分数 mol% → 质量分数 wt%</div>`;
    html += `<div>① 取 1 mol 样品：n<sub>i</sub> = x<sub>i</sub> (mol)</div>`;
    html += `<div>② 质量：m<sub>i</sub> = n<sub>i</sub> × M<sub>i</sub></div>`;
    html += `<div>③ 质量分数：w<sub>i</sub> = m<sub>i</sub> / Σm × 100%</div>`;
  }
  html += `<div class="mt-1" style="color:var(--text-muted)">（M<sub>i</sub> 为摩尔质量 g/mol）</div>`;
  html += '</div>';

  // Step-by-step process per element
  html += '<div class="space-y-1.5 font-mono text-xs">';
  r.results.forEach(res => {
    const e = el(res.symbol);
    const colors = CATEGORY_COLORS[e.category];
    let line = '';
    if (isM2X) {
      const m = res.inputValue;               // g per 100g sample
      const n = m / res.atomicMass;           // mol
      const totalN = r.results.reduce((s, rr) => s + rr.inputValue / rr.atomicMass, 0);
      line = `n<sub>${res.symbol}</sub> = ${fmt(m)} g / ${fmt(res.atomicMass)} = ${n.toFixed(4)} mol ; x = ${n.toFixed(4)} / ${totalN.toFixed(4)} × 100%`;
    } else {
      const n = res.inputValue / 100;         // mol per 1mol sample (x% → n)
      const m = n * res.atomicMass;           // g
      line = `m<sub>${res.symbol}</sub> = ${(res.inputValue / 100).toFixed(4)} mol × ${fmt(res.atomicMass)} g/mol = ${m.toFixed(4)} g`;
    }
    html += `<div class="flex items-start gap-2 px-3 py-2 rounded" style="background:var(--input-bg)">
      <span class="inline-flex items-center justify-center min-w-6 h-6 px-1 rounded text-xs font-bold shrink-0" style="background:${colors.bg};color:${colors.text}">${res.symbol}</span>
      <span style="color:var(--text-secondary)">${line}</span>
      <span class="ml-auto font-bold shrink-0" style="color:var(--accent)">→ ${fmt(res.outputValue)}%</span>
    </div>`;
  });
  html += '</div>';

  html += '</div>';
  return html;
}

// ===== RENDER PROPERTY COMPARISON =====
function renderPropertyComparison(): string {
  const symbols = selectedItems.map(i => i.symbol);
  if (symbols.length === 0) return '';

  const props = symbols.map(s => ({ e: el(s), p: getProp((el(s) as ElementData).atomicNumber) as ElementProperty }));

  let html = `<div id="prop-card" class="rounded-xl mt-4 overflow-hidden" style="background:var(--bg-card);border:1px solid var(--border)">
    <button class="prop-toggle w-full flex items-center gap-2 px-4 py-3 text-left" data-toggle="prop">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><path d="M12 2v20M2 12h20"/><circle cx="12" cy="12" r="10"/></svg>
      <h2 class="text-sm font-bold flex-1" style="color:var(--text-primary)">元素性质对比（${symbols.length}个）</h2>
      <svg class="prop-arrow transition-transform" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2" style="transform:rotate(${propPanelOpen ? '0' : '-90'}deg)"><polyline points="6 9 12 15 18 9"/></svg>
    </button>
    <div id="prop-body" style="display:${propPanelOpen ? 'block' : 'none'}">`;

  const rows: { label: string; get: (p: ElementProperty, e: ElementData) => string }[] = [
    { label: '英文名', get: (p) => p.nameEn },
    { label: '原子量', get: (_p, e) => e.atomicMass.toFixed(4) },
    { label: '常温状态', get: (p) => p.state },
    { label: '密度', get: (p) => fmtDensity(p.density, p.state) },
    { label: '熔点', get: (p) => fmtTemp(p.melting) },
    { label: '沸点', get: (p) => fmtTemp(p.boiling) },
    { label: '电负性', get: (p) => p.electronegativity === null ? '未知' : `${p.electronegativity} (鲍林)` },
    { label: '第一电离能', get: (p) => p.ionization === null ? '未知' : `${p.ionization} kJ/mol` },
    { label: '原子半径', get: (p) => p.radius === null ? '未知' : `${p.radius} pm` },
    { label: '电子排布', get: (p) => p.electronConfig },
    { label: '常见化合价', get: (p) => p.valence },
    { label: '发现年份', get: (p) => p.year },
  ];

  rows.forEach((row, ri) => {
    html += `<div class="flex items-stretch ${ri < rows.length - 1 ? '' : ''}" style="${ri < rows.length - 1 ? 'border-bottom:1px solid var(--border)' : ''}">`;
    html += `<div class="w-24 shrink-0 px-3 py-2.5 text-xs font-semibold flex items-center" style="color:var(--text-muted);background:var(--input-bg)">${row.label}</div>`;
    html += `<div class="flex-1 flex flex-wrap">`;
    props.forEach(({ e, p }) => {
      const colors = CATEGORY_COLORS[e.category];
      html += `<div class="flex-1 min-w-[120px] px-3 py-2.5 text-xs" style="border-left:1px solid var(--border)">
        <button class="font-bold mb-0.5 hover:underline cursor-pointer" style="color:${colors.text}" data-detail="${e.symbol}" title="查看${e.name}详细性质">${e.symbol} ⓘ</button>
        <div style="color:var(--text-secondary)">${row.get(p, e)}</div>
      </div>`;
    });
    html += '</div></div>';
  });

  html += `<div class="px-3 py-2 text-xs" style="color:var(--text-muted);background:var(--input-bg);border-top:1px solid var(--border)">数据来源：IUPAC 标准原子量 / 常规化学手册，气体密度单位为 g/L，合成元素部分性质为预测值(预)</div>`;
  html += '</div></div>';
  return html;
}

// ===== RENDER ELEMENT DETAIL MODAL =====
function renderElementDetail(symbol: string): string {
  const e = el(symbol);
  const p = getProp(e.atomicNumber) as ElementProperty;
  const colors = CATEGORY_COLORS[e.category];

  const rows: [string, string][] = [
    ['元素名称', `${e.name} / ${p.nameEn}`],
    ['原子序数', String(e.atomicNumber)],
    ['相对原子量', e.atomicMass.toFixed(4)],
    ['常温状态', p.state],
    ['密度', fmtDensity(p.density, p.state)],
    ['熔点', fmtTemp(p.melting)],
    ['沸点', fmtTemp(p.boiling)],
    ['电负性', p.electronegativity === null ? '未知' : `${p.electronegativity} (鲍林标度)`],
    ['第一电离能', p.ionization === null ? '未知' : `${p.ionization} kJ/mol`],
    ['原子半径', p.radius === null ? '未知' : `${p.radius} pm`],
    ['电子排布', p.electronConfig],
    ['常见化合价', p.valence],
    ['所在周期/族', `第${e.period}周期 / ${e.group ? `第${e.group}族` : '镧系/锕系'}`],
    ['发现年份', p.year],
  ];

  let html = `<div id="detail-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4" style="background:rgba(0,0,0,0.6)" data-modal>
    <div class="rounded-2xl w-full max-w-md max-h-[85vh] overflow-y-auto fade-in" style="background:var(--bg-card);border:1px solid var(--border)">
      <div class="sticky top-0 flex items-center gap-3 px-5 py-4" style="background:var(--bg-card);border-bottom:1px solid var(--border)">
        <span class="inline-flex items-center justify-center w-12 h-12 rounded-xl text-lg font-bold" style="background:${colors.bg};color:${colors.text};border:1.5px solid ${colors.border}">${e.symbol}</span>
        <div class="flex-1">
          <h3 class="text-base font-bold" style="color:var(--text-primary)">${e.name} · ${p.nameEn}</h3>
          <p class="text-xs" style="color:var(--text-muted)">#${e.atomicNumber} · ${CATEGORY_LABELS[e.category] || e.category}</p>
        </div>
        <button class="detail-close w-8 h-8 rounded-full flex items-center justify-center text-base" style="background:var(--border);color:var(--text-muted)" data-close-modal>✕</button>
      </div>
      <div class="px-5 py-3">`;
  rows.forEach(([k, v], i) => {
    html += `<div class="flex justify-between gap-4 py-2.5 ${i < rows.length - 1 ? '' : ''}" style="${i < rows.length - 1 ? 'border-bottom:1px solid var(--border)' : ''}">
      <span class="text-sm shrink-0" style="color:var(--text-muted)">${k}</span>
      <span class="text-sm text-right font-medium" style="color:var(--text-primary)">${v}</span>
    </div>`;
  });
  html += '</div></div></div>';
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

// ===== CONVERSION LOGIC =====
function massToMole(items: SelectedItem[]): { results: ConversionResult[]; totalInput: number; totalOutput: number } {
  const molesArr: number[] = [];
  let totalMoles = 0;
  for (const item of items) {
    const e = el(item.symbol);
    const moles = item.value / e.atomicMass;
    molesArr.push(moles);
    totalMoles += moles;
  }
  const results: ConversionResult[] = items.map((item, i) => {
    const e = el(item.symbol);
    return {
      symbol: e.symbol,
      name: e.name,
      atomicMass: e.atomicMass,
      inputValue: item.value,
      outputValue: totalMoles > 0 ? (molesArr[i] / totalMoles) * 100 : 0,
    };
  });
  return {
    results,
    totalInput: items.reduce((s, i) => s + i.value, 0),
    totalOutput: results.reduce((s, r) => s + r.outputValue, 0),
  };
}

function moleToMass(items: SelectedItem[]): { results: ConversionResult[]; totalInput: number; totalOutput: number } {
  const massArr: number[] = [];
  let totalMass = 0;
  for (const item of items) {
    const e = el(item.symbol);
    const mass = item.value * e.atomicMass;
    massArr.push(mass);
    totalMass += mass;
  }
  const results: ConversionResult[] = items.map((item, i) => {
    const e = el(item.symbol);
    return {
      symbol: e.symbol,
      name: e.name,
      atomicMass: e.atomicMass,
      inputValue: item.value,
      outputValue: totalMass > 0 ? (massArr[i] / totalMass) * 100 : 0,
    };
  });
  return {
    results,
    totalInput: items.reduce((s, i) => s + i.value, 0),
    totalOutput: results.reduce((s, r) => s + r.outputValue, 0),
  };
}

function doConvert(): void {
  const validItems = selectedItems.filter(i => i.value > 0);
  if (validItems.length === 0) {
    lastResult = null;
    render();
    return;
  }

  // Normalization: scale inputs proportionally so the sum equals 100%
  let convItems = validItems;
  let totalBefore: number | null = null;
  let scale = 1;
  if (normalizeOn) {
    const total = validItems.reduce((s, i) => s + i.value, 0);
    if (Math.abs(total - 100) > 0.01) {
      totalBefore = total;
      scale = 100 / total;
      convItems = validItems.map(i => ({ symbol: i.symbol, value: i.value * scale }));
    }
  }

  const conversionResult = mode === 'mass-to-mole' ? massToMole(convItems) : moleToMass(convItems);

  lastResult = {
    ...conversionResult,
    inputLabel: mode === 'mass-to-mole' ? '质量分数(wt%)' : '摩尔分数(mol%)',
    outputLabel: mode === 'mass-to-mole' ? '摩尔分数(mol%)' : '质量分数(wt%)',
    normalized: normalizeOn && totalBefore !== null,
    totalBefore,
    scale,
  };

  render();
}

function toggleElement(symbol: string): void {
  const idx = selectedItems.findIndex(i => i.symbol === symbol);
  if (idx >= 0) {
    selectedItems.splice(idx, 1);
  } else {
    selectedItems.push({ symbol, value: 0 });
  }
  lastResult = null;
  render();
}

function openDetail(symbol: string): void {
  detailSymbol = symbol;
  render();
}

function closeDetail(): void {
  detailSymbol = null;
  render();
}

// Update value WITHOUT full re-render - only refresh total area
function updateValue(idx: number, rawVal: string): void {
  const num = parseFloat(rawVal);
  selectedItems[idx].value = isNaN(num) ? 0 : num;
  lastResult = null;

  // Update total in-place (no DOM rebuild)
  const totalEl = document.getElementById('comp-total');
  if (totalEl) {
    totalEl.innerHTML = renderTotal();
  }

  // Hide result card if visible
  const resultCard = document.getElementById('result-card');
  if (resultCard) {
    resultCard.style.display = 'none';
  }
}

function removeItem(idx: number): void {
  selectedItems.splice(idx, 1);
  lastResult = null;
  render();
}

function clearAll(): void {
  selectedItems = [];
  lastResult = null;
  render();
}

function setMode(m: Mode): void {
  mode = m;
  lastResult = null;
  render();
}

function setTheme(t: Theme): void {
  applyTheme(t);
  render();
}

function exportResult(): void {
  if (!lastResult) return;
  const r = lastResult;
  const isM2X = mode === 'mass-to-mole';

  let text = '元素分数转换结果\n';
  text += '================================\n\n';
  text += `转换模式: ${r.inputLabel} → ${r.outputLabel}\n\n`;
  text += '【计算公式】\n';
  if (r.normalized) {
    const beforeTxt = r.totalBefore === null ? '100' : r.totalBefore.toFixed(4);
    text += `归一化: 输入总和 ${beforeTxt}% ≠ 100%, 缩放系数 k = 100/${beforeTxt} = ${r.scale.toFixed(4)}, w'_i = w_i × k\n\n`;
  }
  if (isM2X) {
    text += '取 100g 样品: m_i = w_i (g)\n';
    text += '物质的量: n_i = m_i / M_i\n';
    text += '摩尔分数: x_i = n_i / Σn × 100%\n';
  } else {
    text += '取 1mol 样品: n_i = x_i (mol)\n';
    text += '质量: m_i = n_i × M_i\n';
    text += '质量分数: w_i = m_i / Σm × 100%\n';
  }
  text += '\n【计算过程】\n';
  if (isM2X) {
    const totalN = r.results.reduce((s, rr) => s + rr.inputValue / rr.atomicMass, 0);
    for (const item of r.results) {
      const n = item.inputValue / item.atomicMass;
      text += `${item.symbol}: n = ${item.inputValue.toFixed(4)} / ${item.atomicMass.toFixed(4)} = ${n.toFixed(4)} mol → x = ${n.toFixed(4)}/${totalN.toFixed(4)} × 100% = ${item.outputValue.toFixed(4)}%\n`;
    }
  } else {
    for (const item of r.results) {
      const m = (item.inputValue / 100) * item.atomicMass;
      text += `${item.symbol}: m = ${(item.inputValue / 100).toFixed(4)} × ${item.atomicMass.toFixed(4)} = ${m.toFixed(4)} g → w = ${item.outputValue.toFixed(4)}%\n`;
    }
  }
  text += '\n【结果明细】\n';
  text += `元素\t原子量\t\t${r.inputLabel}\t\t${r.outputLabel}\n`;
  text += '----\t--------\t--------\t--------\n';
  for (const item of r.results) {
    text += `${item.symbol}\t${item.atomicMass.toFixed(4)}\t\t${item.inputValue.toFixed(4)}\t\t${item.outputValue.toFixed(4)}\n`;
  }
  text += '\n总和验证:\n';
  text += `输入总和: ${r.totalInput.toFixed(4)}\n`;
  text += `输出总和: ${r.totalOutput.toFixed(4)}\n`;
  text += '\n数据来源: IUPAC 2024 Standard Atomic Weights\n';

  const filename = `元素分数转换结果_${new Date().toISOString().slice(0, 10)}.txt`;
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ===== MAIN RENDER =====
function render(): void {
  const app = document.getElementById('app');
  if (!app) return;

  // Remember which input was focused before re-render
  const activeInput = document.activeElement;
  let focusIdx: number | null = null;
  let focusCursor = 0;
  if (activeInput && activeInput instanceof HTMLInputElement && activeInput.dataset.inputIdx) {
    focusIdx = parseInt(activeInput.dataset.inputIdx, 10);
    focusCursor = activeInput.selectionStart || 0;
  }

  const inputTitle = mode === 'mass-to-mole' ? '质量分数输入 (wt%)' : '摩尔分数输入 (mol%)';

  app.innerHTML = `
    <!-- Header -->
    <header class="px-6 py-4 flex items-center justify-between gap-3" style="background:var(--header-gradient);border-bottom:1px solid var(--border)">
      <div class="flex items-center gap-2">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 3h6v11l-3 3-3-3V3z"/><path d="M6 21h12"/><path d="M9 21v-4"/><path d="M15 21v-4"/>
        </svg>
        <div>
          <h1 class="text-lg font-bold text-white leading-tight">元素分数转换工具</h1>
          <p class="text-xs" style="color:#7dd3fc;opacity:0.85">质量分数(wt%) ↔ 摩尔分数(mol%) | IUPAC 2024 标准原子量</p>
        </div>
      </div>
      ${renderThemeSwitcher()}
    </header>

    <div class="max-w-[1600px] mx-auto px-4 py-4">
      <!-- Mode Switcher + Property Comparison Entry -->
      <div class="flex mb-4 p-1 rounded-xl gap-1 items-center" style="background:var(--bg-card)">
        <button class="mode-btn flex-1 py-2.5 px-4 text-sm font-semibold rounded-lg transition-all ${mode === 'mass-to-mole' ? 'active' : ''}"
          data-mode="mass-to-mole"
          style="${mode === 'mass-to-mole' ? 'background:var(--accent);color:#0f172a' : 'color:var(--text-muted);background:transparent'}">
          质量分数 → 摩尔分数
        </button>
        <button class="mode-btn flex-1 py-2.5 px-4 text-sm font-semibold rounded-lg transition-all ${mode === 'mole-to-mass' ? 'active' : ''}"
          data-mode="mole-to-mass"
          style="${mode === 'mole-to-mass' ? 'background:var(--accent);color:#0f172a' : 'color:var(--text-muted);background:transparent'}">
          摩尔分数 → 质量分数
        </button>
        <a href="table.html" class="mode-btn shrink-0 flex items-center gap-1.5 py-2.5 px-4 text-sm font-semibold rounded-lg transition-all hover:-translate-y-0.5"
          style="background:var(--input-bg);color:var(--accent);border:1px solid var(--border)"
          title="打开元素性质对比页面：浏览周期表、查看性质详情并进行横向对比">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="2"/><ellipse cx="12" cy="12" rx="10" ry="4"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(-60 12 12)"/></svg>
          元素性质对比 →
        </a>
      </div>

      <div class="main-grid">
        <!-- Left: Periodic Table -->
        <div class="rounded-xl p-5" style="background:var(--bg-card);border:1px solid var(--border)">
          <div class="flex items-center gap-2 mb-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
            <h2 class="text-sm font-bold" style="color:var(--text-primary)">元素周期表</h2>
          </div>
          ${renderPeriodicTable()}
        </div>

        <!-- Right: Input & Result -->
        <div>
          <div class="rounded-xl p-4 mb-4" style="background:var(--bg-card);border:1px solid var(--border)">
            <div class="flex items-center gap-2 mb-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              <h2 class="text-sm font-bold" style="color:var(--text-primary)">${inputTitle}</h2>
            </div>
            <div id="composition-area">
            ${renderComposition()}
            </div>

            <!-- Normalization option -->
            <label class="flex items-center gap-2.5 mt-3 px-3 py-2.5 rounded-lg cursor-pointer select-none transition-colors" style="background:var(--input-bg);border:1px solid var(--border)" title="各成分含量按比例缩放，使总和归一为100%">
              <input type="checkbox" id="norm-toggle" ${normalizeOn ? 'checked' : ''} class="w-4 h-4 shrink-0 cursor-pointer" style="accent-color:#38bdf8" />
              <span class="text-sm font-semibold" style="color:var(--text-primary)">归一化计算</span>
              <span class="text-xs" style="color:var(--text-muted)">勾选后，各成分含量按比例缩放，使总和归一为 100%，并在结果中显示归一化前后对比</span>
            </label>
          </div>

          ${renderPropertyComparison()}

          <div class="flex gap-3 mb-4">
            <button class="convert-btn flex-1 py-3.5 px-6 rounded-xl text-base font-bold transition-all ${selectedItems.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-0.5'}"
              style="background:linear-gradient(135deg,#0ea5e9,#38bdf8);color:#0f172a;${selectedItems.length > 0 ? 'box-shadow:0 4px 12px rgba(56,189,248,0.3)' : ''}"
              data-action="convert" ${selectedItems.length === 0 ? 'disabled' : ''}>
              确认开始
            </button>
            <button class="py-3.5 px-5 rounded-xl text-base font-semibold transition-colors"
              style="background:var(--bg-card);color:var(--text-muted);border:1px solid var(--border)"
              data-action="clear">
              清空
            </button>
          </div>

          ${lastResult ? `
          <div id="result-card" class="rounded-xl p-4 fade-in" style="background:var(--bg-card);border:1px solid var(--border)">
            <div class="flex items-center gap-2 mb-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
              <h2 class="text-sm font-bold" style="color:var(--text-primary)">转换结果</h2>
            </div>
            ${renderResult()}
            ${renderCalcProcess()}
          </div>` : '<div id="result-card" style="display:none"></div>'}
        </div>
      </div>
    </div>
    ${detailSymbol ? renderElementDetail(detailSymbol) : ''}
  `;

  // Attach event listeners
  attachEvents();

  // Restore focus after re-render
  if (focusIdx !== null) {
    const inputToFocus = document.querySelector(`input[data-input-idx="${focusIdx}"]`) as HTMLInputElement | null;
    if (inputToFocus) {
      inputToFocus.focus();
      try { inputToFocus.setSelectionRange(focusCursor, focusCursor); } catch { /* ignore */ }
    }
  }
}

function attachEvents(): void {
  const app = document.getElementById('app');
  if (!app) return;

  // Element cell clicks
  app.querySelectorAll('.element-cell').forEach(cell => {
    cell.addEventListener('click', () => {
      const symbol = (cell as HTMLElement).dataset.symbol;
      if (symbol) toggleElement(symbol);
    });
    // Double-click: open property detail modal
    cell.addEventListener('dblclick', (e) => {
      e.preventDefault();
      const symbol = (cell as HTMLElement).dataset.symbol;
      if (symbol) openDetail(symbol);
    });
  });

  // Detail buttons in comparison table
  app.querySelectorAll('[data-detail]').forEach(btn => {
    btn.addEventListener('click', () => {
      const symbol = (btn as HTMLElement).dataset.detail;
      if (symbol) openDetail(symbol);
    });
  });

  // Property panel toggle
  app.querySelectorAll('[data-toggle="prop"]').forEach(btn => {
    btn.addEventListener('click', () => {
      propPanelOpen = !propPanelOpen;
      const body = document.getElementById('prop-body');
      const arrow = btn.querySelector('.prop-arrow') as HTMLElement | null;
      if (body) body.style.display = propPanelOpen ? 'block' : 'none';
      if (arrow) arrow.style.transform = `rotate(${propPanelOpen ? '0' : '-90'}deg)`;
    });
  });

  // Modal close handlers
  app.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', closeDetail);
  });
  app.querySelectorAll('[data-modal]').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeDetail();
    });
  });

  // Normalization toggle
  const normToggle = document.getElementById('norm-toggle') as HTMLInputElement | null;
  if (normToggle) {
    normToggle.addEventListener('change', () => {
      normalizeOn = normToggle.checked;
      lastResult = null;
      render();
    });
  }

  // Mode buttons
  app.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const m = (btn as HTMLElement).dataset.mode as Mode;
      if (m) setMode(m);
    });
  });

  // Theme buttons
  app.querySelectorAll('.theme-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const t = (btn as HTMLElement).dataset.theme as Theme;
      if (t) setTheme(t);
    });
  });

  // Input fields - use 'input' event, only update total in-place
  app.querySelectorAll('input[data-input-idx]').forEach(input => {
    input.addEventListener('input', (e) => {
      const idx = parseInt((e.target as HTMLElement).dataset.inputIdx || '0', 10);
      updateValue(idx, (e.target as HTMLInputElement).value);
    });

    // Tab/Enter to move to next input
    input.addEventListener('keydown', ((e: KeyboardEvent) => {
      const idx = parseInt((e.target as HTMLElement).dataset.inputIdx || '0', 10);
      if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        const nextInput = document.querySelector(`input[data-input-idx="${idx + 1}"]`) as HTMLElement | null;
        if (nextInput) {
          nextInput.focus();
          nextInput.click();
        } else {
          // Last input - trigger convert
          doConvert();
        }
      }
    }) as EventListener);
  });

  // Remove buttons
  app.querySelectorAll('.remove-btn[data-remove-idx]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt((btn as HTMLElement).dataset.removeIdx || '0', 10);
      removeItem(idx);
    });
  });

  // Action buttons
  app.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = (btn as HTMLElement).dataset.action;
      if (action === 'convert') doConvert();
      else if (action === 'clear') clearAll();
      else if (action === 'export') exportResult();
    });
  });
}

// ===== INIT =====
export function initApp(): void {
  applyTheme(currentTheme);
  render();
}
