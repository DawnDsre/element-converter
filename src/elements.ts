// [symbol, name, atomicNumber, atomicMass, category, period, group]
const RAW: (string | number | null)[][] = [
  ["H","氢",1,1.008,"nonmetal",1,1],["He","氦",2,4.002602,"noble-gas",1,18],
  ["Li","锂",3,6.94,"alkali-metal",2,1],["Be","铍",4,9.0121831,"alkaline-earth-metal",2,2],
  ["B","硼",5,10.81,"metalloid",2,13],["C","碳",6,12.011,"nonmetal",2,14],
  ["N","氮",7,14.007,"nonmetal",2,15],["O","氧",8,15.999,"nonmetal",2,16],
  ["F","氟",9,18.998403163,"halogen",2,17],["Ne","氖",10,20.1797,"noble-gas",2,18],
  ["Na","钠",11,22.98976928,"alkali-metal",3,1],["Mg","镁",12,24.305,"alkaline-earth-metal",3,2],
  ["Al","铝",13,26.9815385,"post-transition-metal",3,13],["Si","硅",14,28.085,"metalloid",3,14],
  ["P","磷",15,30.973761998,"nonmetal",3,15],["S","硫",16,32.06,"nonmetal",3,16],
  ["Cl","氯",17,35.45,"halogen",3,17],["Ar","氩",18,39.95,"noble-gas",3,18],
  ["K","钾",19,39.0983,"alkali-metal",4,1],["Ca","钙",20,40.078,"alkaline-earth-metal",4,2],
  ["Sc","钪",21,44.955908,"transition-metal",4,3],["Ti","钛",22,47.867,"transition-metal",4,4],
  ["V","钒",23,50.9415,"transition-metal",4,5],["Cr","铬",24,51.9961,"transition-metal",4,6],
  ["Mn","锰",25,54.938044,"transition-metal",4,7],["Fe","铁",26,55.845,"transition-metal",4,8],
  ["Co","钴",27,58.933194,"transition-metal",4,9],["Ni","镍",28,58.6934,"transition-metal",4,10],
  ["Cu","铜",29,63.546,"transition-metal",4,11],["Zn","锌",30,65.38,"transition-metal",4,12],
  ["Ga","镓",31,69.723,"post-transition-metal",4,13],["Ge","锗",32,72.63,"metalloid",4,14],
  ["As","砷",33,74.921595,"metalloid",4,15],["Se","硒",34,78.971,"nonmetal",4,16],
  ["Br","溴",35,79.904,"halogen",4,17],["Kr","氪",36,83.798,"noble-gas",4,18],
  ["Rb","铷",37,85.4678,"alkali-metal",5,1],["Sr","锶",38,87.62,"alkaline-earth-metal",5,2],
  ["Y","钇",39,88.90584,"transition-metal",5,3],["Zr","锆",40,91.224,"transition-metal",5,4],
  ["Nb","铌",41,92.90637,"transition-metal",5,5],["Mo","钼",42,95.95,"transition-metal",5,6],
  ["Tc","锝",43,98.9072,"transition-metal",5,7],["Ru","钌",44,101.07,"transition-metal",5,8],
  ["Rh","铑",45,102.9055,"transition-metal",5,9],["Pd","钯",46,106.42,"transition-metal",5,10],
  ["Ag","银",47,107.8682,"transition-metal",5,11],["Cd","镉",48,112.414,"transition-metal",5,12],
  ["In","铟",49,114.818,"post-transition-metal",5,13],["Sn","锡",50,118.71,"post-transition-metal",5,14],
  ["Sb","锑",51,121.76,"metalloid",5,15],["Te","碲",52,127.6,"metalloid",5,16],
  ["I","碘",53,126.90447,"halogen",5,17],["Xe","氙",54,131.293,"noble-gas",5,18],
  ["Cs","铯",55,132.90545196,"alkali-metal",6,1],["Ba","钡",56,137.327,"alkaline-earth-metal",6,2],
  ["La","镧",57,138.90547,"lanthanide",6,null],["Ce","铈",58,140.116,"lanthanide",6,null],
  ["Pr","镨",59,140.90766,"lanthanide",6,null],["Nd","钕",60,144.242,"lanthanide",6,null],
  ["Pm","钷",61,146.9151385,"lanthanide",6,null],["Sm","钐",62,150.36,"lanthanide",6,null],
  ["Eu","铕",63,151.964,"lanthanide",6,null],["Gd","钆",64,157.25,"lanthanide",6,null],
  ["Tb","铽",65,158.92535,"lanthanide",6,null],["Dy","镝",66,162.5,"lanthanide",6,null],
  ["Ho","钬",67,164.93033,"lanthanide",6,null],["Er","铒",68,167.259,"lanthanide",6,null],
  ["Tm","铥",69,168.93422,"lanthanide",6,null],["Yb","镱",70,173.045,"lanthanide",6,null],
  ["Lu","镥",71,174.9668,"lanthanide",6,null],["Hf","铪",72,178.49,"transition-metal",6,4],
  ["Ta","钽",73,180.94788,"transition-metal",6,5],["W","钨",74,183.84,"transition-metal",6,6],
  ["Re","铼",75,186.207,"transition-metal",6,7],["Os","锇",76,190.23,"transition-metal",6,8],
  ["Ir","铱",77,192.217,"transition-metal",6,9],["Pt","铂",78,195.084,"transition-metal",6,10],
  ["Au","金",79,196.966569,"transition-metal",6,11],["Hg","汞",80,200.592,"transition-metal",6,12],
  ["Tl","铊",81,204.38,"post-transition-metal",6,13],["Pb","铅",82,207.2,"post-transition-metal",6,14],
  ["Bi","铋",83,208.9804,"post-transition-metal",6,15],["Po","钋",84,208.98243,"metalloid",6,16],
  ["At","砹",85,209.98715,"halogen",6,17],["Rn","氡",86,222.01758,"noble-gas",6,18],
  ["Fr","钫",87,223.01973,"alkali-metal",7,1],["Ra","镭",88,226.02541,"alkaline-earth-metal",7,2],
  ["Ac","锕",89,227.02775,"actinide",7,null],["Th","钍",90,232.0377,"actinide",7,null],
  ["Pa","镤",91,231.03588,"actinide",7,null],["U","铀",92,238.02891,"actinide",7,null],
  ["Np","镎",93,237.04817,"actinide",7,null],["Pu","钚",94,244.06421,"actinide",7,null],
  ["Am","镅",95,243.06138,"actinide",7,null],["Cm","锔",96,247.07035,"actinide",7,null],
  ["Bk","锫",97,247.07031,"actinide",7,null],["Cf","锎",98,251.07959,"actinide",7,null],
  ["Es","锿",99,252.083,"actinide",7,null],["Fm","镄",100,257.09511,"actinide",7,null],
  ["Md","钔",101,258.09843,"actinide",7,null],["No","锘",102,259.101,"actinide",7,null],
  ["Lr","铹",103,262.11,"actinide",7,null],["Rf","钅卢",104,267.122,"transition-metal",7,4],
  ["Db","钅杜",105,270.127,"transition-metal",7,5],["Sg","钅喜",106,271.134,"transition-metal",7,6],
  ["Bh","钅波",107,270.138,"transition-metal",7,7],["Hs","钅黑",108,277.152,"transition-metal",7,8],
  ["Mt","鿏",109,278.156,"transition-metal",7,9],["Ds","钅达",110,281.165,"transition-metal",7,10],
  ["Rg","钅仑",111,282.169,"transition-metal",7,11],["Cn","鿔",112,285.177,"transition-metal",7,12],
  ["Nh","鿭",113,286.182,"post-transition-metal",7,13],["Fl","钅夫",114,289.19,"post-transition-metal",7,14],
  ["Mc","镆",115,290.196,"post-transition-metal",7,15],["Lv","钅立",116,293.204,"post-transition-metal",7,16],
  ["Ts","钅田",117,294.21,"halogen",7,17],["Og","奥",118,295.216,"noble-gas",7,18],
];

export interface ElementData {
  symbol: string;
  name: string;
  atomicNumber: number;
  atomicMass: number;
  category: string;
  period: number;
  group: number | null;
}

export const ELEMENTS: ElementData[] = RAW.map(r => ({
  symbol: r[0] as string,
  name: r[1] as string,
  atomicNumber: r[2] as number,
  atomicMass: r[3] as number,
  category: r[4] as string,
  period: r[5] as number,
  group: r[6] as number | null,
}));

export const ELEMENT_MAP: Record<string | number, ElementData> = {};
ELEMENTS.forEach(e => {
  ELEMENT_MAP[e.atomicNumber] = e;
  ELEMENT_MAP[e.symbol] = e;
});

// Periodic table layout (atomic numbers, null = empty)
export const LAYOUT: (number | null)[][] = [
  [1,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,2],
  [3,4,null,null,null,null,null,null,null,null,null,null,5,6,7,8,9,10],
  [11,12,null,null,null,null,null,null,null,null,null,null,13,14,15,16,17,18],
  [19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36],
  [37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54],
  [55,56,null,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86],
  [87,88,null,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118],
];

export const LANTHANIDES: number[] = [57,58,59,60,61,62,63,64,65,66,67,68,69,70,71];
export const ACTINIDES: number[] = [89,90,91,92,93,94,95,96,97,98,99,100,101,102,103];

export const CATEGORY_LABELS: Record<string, string> = {
  'alkali-metal': '碱金属',
  'alkaline-earth-metal': '碱土金属',
  'transition-metal': '过渡金属',
  'post-transition-metal': '后过渡金属',
  'metalloid': '类金属',
  'nonmetal': '非金属',
  'halogen': '卤素',
  'noble-gas': '稀有气体',
  'lanthanide': '镧系',
  'actinide': '锕系',
};

// Category color mapping (dark theme optimized)
export const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'alkali-metal':           { bg: '#3b1212', text: '#fca5a5', border: '#991b1b' },
  'alkaline-earth-metal':   { bg: '#3b2e10', text: '#fcd34d', border: '#92400e' },
  'transition-metal':       { bg: '#0c2d48', text: '#93c5fd', border: '#1e40af' },
  'post-transition-metal':  { bg: '#1e1b4b', text: '#a5b4fc', border: '#3730a3' },
  'metalloid':              { bg: '#052e16', text: '#86efac', border: '#166534' },
  'nonmetal':               { bg: '#042f2e', text: '#5eead4', border: '#115e59' },
  'halogen':                { bg: '#083344', text: '#67e8f9', border: '#0e7490' },
  'noble-gas':              { bg: '#2e1065', text: '#c4b5fd', border: '#6d28d9' },
  'lanthanide':             { bg: '#3b0734', text: '#f9a8d4', border: '#9d174d' },
  'actinide':               { bg: '#3c0613', text: '#fda4af', border: '#9f1239' },
};
