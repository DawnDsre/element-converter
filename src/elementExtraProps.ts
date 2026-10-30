// Extended element properties (aligned with webqc-style element info sheet fields)
// Sources: CRC Handbook / IUPAC / Pyykkö & Atsumi 2009 single-bond covalent radii
// (same dataset as zh.webqc.org: O 63 / Cr 122 / Rb 210 / Bi 151 pm verified) / Bondi vdw radii
// Fields per element (index = atomicNumber - 1):
// [oxidationStates, crystalStructure, specificHeat J/(g·K), thermalConductivity W/(m·K),
//  covalentRadius pm, vdwRadius pm]
// null 表示暂无可靠实测数据（多见于气体与合成元素）
const RAW_EXTRA: (string | number | null)[][] = [
  // 1-10
  ["-1, +1", "六方(固态H₂)", 14.30, 0.1805, 32, 120],
  ["0", "六方(密堆积)", 5.19, 0.1513, 46, 140],
  ["+1", "体心立方", 3.58, 84.8, 133, 182],
  ["+2", "六方(密堆积)", 1.83, 216, 102, 153],
  ["+3", "三方(菱方)", 1.03, 27.4, 85, 192],
  ["-4, +2, +4", "六方(石墨)/立方(金刚石)", 0.71, 129, 75, 170],
  ["-3, +2, +3, +4, +5", "六方(固态N₂)", 1.04, 0.0258, 71, 155],
  ["-2, -1", "单斜(固态O₂)", 0.92, 0.0266, 63, 152],
  ["-1", "单斜(固态F₂)", 0.82, 0.0277, 64, 147],
  ["0", "面心立方", null, 0.0491, 67, 154],
  // 11-20
  ["+1", "体心立方", 1.23, 142, 155, 227],
  ["+2", "六方(密堆积)", 1.02, 156, 139, 173],
  ["+3", "面心立方", 0.90, 237, 126, 184],
  ["-4, +2, +4", "立方(金刚石型)", 0.71, 149, 116, 210],
  ["-3, +3, +5", "立方(白磷)", 0.77, 0.236, 111, 180],
  ["-2, +2, +4, +6", "正交(斜方)", 0.71, 0.205, 103, 180],
  ["-1, +1, +3, +5, +7", "正交(斜方)", 0.48, 0.0089, 99, 175],
  ["0", "面心立方", 0.52, 0.0177, 96, 188],
  ["+1", "体心立方", 0.75, 102.5, 196, 275],
  ["+2", "面心立方", 0.65, 201, 171, 231],
  // 21-30
  ["+3", "六方(密堆积)", 0.57, 15.8, 148, 211],
  ["+2, +3, +4", "六方(密堆积)", 0.52, 21.9, 136, 187],
  ["+2, +3, +4, +5", "体心立方", 0.49, 30.7, 134, null],
  ["+2, +3, +6", "体心立方", 0.45, 93.9, 122, null],
  ["+2, +3, +4, +6, +7", "立方(复杂α-Mn型)", 0.48, 7.81, 119, 197],
  ["+2, +3", "体心立方", 0.45, 80.4, 116, 204],
  ["+2, +3", "六方(密堆积)", 0.42, 100, 111, null],
  ["+2, +3", "面心立方", 0.44, 90.9, 110, 163],
  ["+1, +2", "面心立方", 0.39, 401, 112, 140],
  ["+2", "六方(密堆积)", 0.39, 116, 118, 139],
  // 31-40
  ["+3", "正交", 0.37, 40.6, 124, null],
  ["+2, +4", "立方(金刚石型)", 0.32, 59.9, 124, null],
  ["-3, +3, +5", "三方(菱方)", 0.33, 50, 121, null],
  ["-2, +4, +6", "三方(三角)", 0.34, 0.52, 116, null],
  ["-1, +1, +5", "正交(斜方)", 0.47, 0.122, 114, null],
  ["0, +2", "面心立方", 0.25, 0.0094, 117, null],
  ["+1", "体心立方", 0.36, 58.2, 210, null],
  ["+2", "面心立方", 0.30, 35.4, 185, null],
  ["+3", "六方(密堆积)", 0.30, 17.2, 163, null],
  ["+2, +4", "六方(密堆积)", 0.28, 22.6, 154, null],
  // 41-50
  ["+3, +5", "体心立方", 0.26, 53.7, 147, null],
  ["+2, +3, +4, +5, +6", "体心立方", 0.25, 138, 138, null],
  ["+4, +7", "六方(密堆积)", null, 50.6, 128, null],
  ["+3, +4", "六方(密堆积)", 0.24, 117, 125, null],
  ["+3", "面心立方", 0.24, 150, 125, null],
  ["+2, +4", "面心立方", 0.24, 121.9, 120, 163],
  ["+1", "面心立方", 0.24, 429, 128, 172],
  ["+2", "六方(密堆积)", 0.23, 96.8, 136, null],
  ["+1, +3", "体心四方", 0.23, 81.8, 142, null],
  ["+2, +4", "四方(β-Sn)/立方(α-Sn)", 0.23, 66.8, 140, null],
  // 51-60
  ["-3, +3, +5", "三方(菱方)", 0.21, 24.4, 140, null],
  ["-2, +4, +6", "三方(三角)", 0.20, 2.35, 136, null],
  ["-1, +1, +5, +7", "正交(斜方)", 0.21, 0.449, 133, null],
  ["0, +2, +4, +6, +8", "面心立方", 0.16, 0.0057, 131, null],
  ["+1", "体心立方", 0.24, 35.9, 232, null],
  ["+2", "体心立方", 0.20, 18.4, 196, null],
  ["+3", "六方(双六方)", 0.20, 13.5, 180, null],
  ["+3, +4", "面心立方", 0.19, 11.4, 163, null],
  ["+3", "六方(双六方)", 0.19, 12.5, 176, null],
  ["+3", "六方(双六方)", 0.19, 16.5, 174, null],
  // 61-70
  ["+3", "六方(双六方)", null, null, 173, null],
  ["+3", "三方(菱方)", 0.20, null, 172, null],
  ["+2, +3", "体心立方", 0.18, null, 168, null],
  ["+3", "六方(密堆积)", 0.24, 10.6, 169, null],
  ["+3", "六方(密堆积)", 0.18, 11.1, 168, null],
  ["+3", "六方(密堆积)", 0.17, 10.7, 167, null],
  ["+3", "六方(密堆积)", 0.17, 16.2, 166, null],
  ["+3", "六方(密堆积)", 0.17, 14.3, 165, null],
  ["+3", "六方(密堆积)", 0.16, 16.9, 164, null],
  ["+2, +3", "面心立方", 0.16, null, 170, null],
  // 71-80
  ["+3", "六方(密堆积)", 0.15, 16.4, 162, null],
  ["+4", "六方(密堆积)", 0.14, 23, 152, null],
  ["+5", "体心立方", 0.14, 57.5, 146, null],
  ["+4, +5, +6", "体心立方", 0.13, 173, 137, null],
  ["+4, +6, +7", "六方(密堆积)", 0.14, 48, 131, null],
  ["+3, +4, +8", "六方(密堆积)", 0.13, 87.6, 129, null],
  ["+3, +4", "面心立方", 0.13, 147, 122, null],
  ["+2, +4", "面心立方", 0.13, 71.6, 123, 175],
  ["+1, +3", "面心立方", 0.13, 318, 124, 166],
  ["+1, +2", "三方(菱方)", 0.14, 8.3, 133, 155],
  // 81-90
  ["+1, +3", "六方(密堆积)", 0.13, 46.1, 144, 196],
  ["+2, +4", "面心立方", 0.13, 35.3, 144, 202],
  ["+3, +5", "三方(菱方)", 0.12, 7.87, 151, 207],
  ["+2, +4", "立方(简单立方)", 0.12, null, 145, 197],
  ["-1, +1", null, null, null, 147, 202],
  ["0", "面心立方(固态)", null, 0.00364, 142, 220],
  ["+1", null, null, null, 223, null],
  ["+2", "体心立方", null, null, 201, null],
  ["+3", "面心立方", 0.12, 12, 186, null],
  ["+4", "面心立方", 0.11, 54, 175, null],
  // 91-100
  ["+5", "体心四方", 0.12, null, 169, null],
  ["+4, +6", "正交", 0.12, 27.5, 170, 186],
  ["+5", "正交", 0.13, null, 171, 175],
  ["+4, +6", "单斜", 0.13, 6.74, 172, null],
  ["+3", "六方(双六方)", null, null, 166, null],
  ["+3", "六方(双六方)", null, null, 166, null],
  ["+3, +4", null, null, null, 166, null],
  ["+3", null, null, null, 168, null],
  ["+3", null, null, null, 165, null],
  ["+3", null, null, null, 167, null],
  // 101-110
  ["+3", null, null, null, 173, null],
  ["+2, +3", null, null, null, 176, null],
  ["+3", null, null, null, 161, null],
  ["+4", null, null, null, 157, null],
  ["+5", null, null, null, 149, null],
  ["+6", null, null, null, 143, null],
  ["+7", null, null, null, 141, null],
  ["+8", null, null, null, 134, null],
  [null, null, null, null, 129, null],
  [null, null, null, null, 128, null],
  // 111-118
  [null, null, null, null, 121, null],
  ["+2", null, null, null, 122, null],
  [null, null, null, null, 136, null],
  ["+2", null, null, null, 143, null],
  [null, null, null, null, 162, null],
  [null, null, null, null, 175, null],
  [null, null, null, null, 165, null],
  [null, null, null, null, 157, null],
];

export interface ElementExtra {
  oxidationStates: string;
  crystalStructure: string;
  specificHeat: number | null;      // J/(g·K)
  thermalConductivity: number | null; // W/(m·K)
  covalentRadius: number | null;    // pm
  vdwRadius: number | null;         // pm
}

export const EXTRAS: Record<number, ElementExtra> = {};
RAW_EXTRA.forEach((r, i) => {
  EXTRAS[i + 1] = {
    oxidationStates: (r[0] as string) ?? '未知',
    crystalStructure: (r[1] as string) ?? '未知',
    specificHeat: r[2] as number | null,
    thermalConductivity: r[3] as number | null,
    covalentRadius: r[4] as number | null,
    vdwRadius: r[5] as number | null,
  };
});

export function getExtra(atomicNumber: number): ElementExtra {
  return EXTRAS[atomicNumber];
}

// ===== Electron shell distribution (parsed from electron config) =====
const SUP_MAP: Record<string, string> = {
  '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4',
  '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9',
};

const CORE_SHELLS: Record<string, number[]> = {
  'He': [2],
  'Ne': [2, 8],
  'Ar': [2, 8, 8],
  'Kr': [2, 8, 18, 8],
  'Xe': [2, 8, 18, 18, 8],
  'Rn': [2, 8, 18, 32, 18, 8],
};

function supToNum(s: string): number {
  return parseInt(s.split('').map(ch => SUP_MAP[ch] ?? ch).join(''), 10);
}

export function computeShells(electronConfig: string): number[] {
  const shells: number[] = [];
  const add = (n: number, count: number): void => {
    while (shells.length < n) shells.push(0);
    shells[n - 1] += count;
  };
  const core = electronConfig.match(/\[(He|Ne|Ar|Kr|Xe|Rn)\]/);
  if (core && CORE_SHELLS[core[1]]) {
    CORE_SHELLS[core[1]].forEach((c, i) => add(i + 1, c));
  }
  const re = /(\d)[spdf]([⁰¹²³⁴⁵⁶⁷⁸⁹]+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(electronConfig)) !== null) {
    add(parseInt(m[1], 10), supToNum(m[2]));
  }
  return shells;
}

export function fmtShells(shells: number[]): string {
  if (shells.length === 0) return '未知';
  return shells.join(', ');
}

export function fmtCp(v: number | null): string {
  return v === null ? '未知' : `${v} J/(g·K)`;
}

export function fmtK(v: number | null): string {
  return v === null ? '未知' : `${v} W/(m·K)`;
}

export function fmtRadius(v: number | null): string {
  return v === null ? '未知' : `${v} pm`;
}

// ===== Block & valence electrons (parsed from electron config, webqc-style) =====

// 区块: 按 Aufbau 填充顺序最后填充的亚层判定；镧系/锕系归 f 区
const AUFBAU_ORDER: Record<string, number> = {
  '1s': 1, '2s': 2, '2p': 3, '3s': 4, '3p': 5, '4s': 6, '3d': 7, '4p': 8,
  '5s': 9, '4d': 10, '5p': 11, '6s': 12, '4f': 13, '5d': 14, '6p': 15,
  '7s': 16, '5f': 17, '6d': 18, '7p': 19,
};

export function getBlock(electronConfig: string, atomicNumber: number): string {
  if ((atomicNumber >= 57 && atomicNumber <= 71) || (atomicNumber >= 89 && atomicNumber <= 103)) {
    return 'f 区';
  }
  let best = -1;
  let block = 's';
  const re = /(\d)([spdf])[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(electronConfig)) !== null) {
    const idx = AUFBAU_ORDER[`${m[1]}${m[2]}`] ?? 0;
    if (idx > best) {
      best = idx;
      block = m[2];
    }
  }
  return `${block} 区`;
}

// 价电子数（与 webqc "价电子" 口径一致）：最外层 ns+np + 未满的 (n-1)d / (n-2)f 亚层；
// 若均为 0（如 Pd 仅含满充 d 亚层）则取惰性核心外电子总数
export function getValenceElectrons(electronConfig: string): number {
  const re = /(\d)([spdf])([⁰¹²³⁴⁵⁶⁷⁸⁹]+)/g;
  const terms: { n: number; l: string; e: number }[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(electronConfig)) !== null) {
    terms.push({ n: parseInt(m[1], 10), l: m[2], e: supToNum(m[3]) });
  }
  if (terms.length === 0) return 0;
  const maxN = Math.max(...terms.map(t => t.n));
  const FULL: Record<string, number> = { s: 2, p: 6, d: 10, f: 14 };
  let v = 0;
  terms.forEach(t => {
    const isOuterSP = (t.l === 's' || t.l === 'p') && t.n === maxN;
    const isIncompleteD = t.l === 'd' && t.e < FULL.d;
    const isIncompleteF = t.l === 'f' && t.e < FULL.f;
    if (isOuterSP || isIncompleteD || isIncompleteF) v += t.e;
  });
  if (v === 0) v = terms.reduce((s, t) => s + t.e, 0);
  return v;
}
