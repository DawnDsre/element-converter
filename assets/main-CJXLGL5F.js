import{C as S,a as b,L as z,E as $,b as _,A as N,g as A,f as V,c as k}from"./elementProperties-D5hjSUzo.js";let u="mass-to-mole",d=[],c=null,M="dark",w=null,y=!1,g=!1;const f=52,h=62,j=[{id:"dark",name:"深灰",color:"#0f172a"},{id:"light",name:"浅亮",color:"#f8fafc"},{id:"ocean",name:"海洋",color:"#0c1929"},{id:"forest",name:"森林",color:"#0f1f0f"},{id:"sunset",name:"日落",color:"#1c1917"}];function T(o){M=o;const l=document.body;l.classList.remove("theme-light","theme-ocean","theme-forest","theme-sunset"),o!=="dark"&&l.classList.add(`theme-${o}`)}function m(o){return o.toFixed(4)}function x(o){return $[o]}function O(){const o=new Set(d.map(s=>s.symbol));let l="";l+='<div class="flex flex-wrap gap-2 mb-3">';for(const[s,e]of Object.entries(S)){const a=b[s];l+=`<div class="flex items-center gap-1.5 text-xs" style="color:${a.text}">
      <span class="w-3 h-3 rounded-sm inline-block" style="background:${a.bg};border:1px solid ${a.border}"></span>
      ${e}
    </div>`}l+="</div>",l+=`<div class="overflow-x-auto pb-2"><div style="display:flex;flex-direction:column;gap:4px;min-width:${f*18+68}px">`;for(const s of z){l+='<div style="display:flex;gap:4px">';for(const e of s)if(e===null)l+=`<div style="width:${f}px;height:${h}px"></div>`;else{const a=$[e],r=b[a.category],n=o.has(a.symbol);l+=`<div class="element-cell ${n?"selected":""}" 
          style="width:${f}px;height:${h}px;display:flex;flex-direction:column;align-items:center;justify-content:center;border-radius:6px;cursor:pointer;background:${r.bg};border:1.5px solid ${n?"var(--accent)":r.border};position:relative"
          data-symbol="${a.symbol}"
          title="${a.name} (${a.symbol})&#10;原子序数: ${a.atomicNumber}&#10;原子量: ${a.atomicMass}">
          <span style="font-weight:700;font-size:14px;line-height:1;color:${r.text}">${a.symbol}</span>
          <span style="font-size:10px;color:var(--text-muted);line-height:1;margin-top:3px">${a.atomicNumber}</span>
        </div>`}l+="</div>"}l+='<div style="height:10px"></div>';const t=(f+4)*2+3;l+=`<div style="display:flex;gap:4px;margin-left:${t}px">`;for(const s of _){const e=$[s],a=b[e.category],r=o.has(e.symbol);l+=`<div class="element-cell ${r?"selected":""}"
      style="width:${f}px;height:${h}px;display:flex;flex-direction:column;align-items:center;justify-content:center;border-radius:6px;cursor:pointer;background:${a.bg};border:1.5px solid ${r?"var(--accent)":a.border}"
      data-symbol="${e.symbol}"
      title="${e.name} (${e.symbol})&#10;原子序数: ${e.atomicNumber}&#10;原子量: ${e.atomicMass}">
      <span style="font-weight:700;font-size:14px;line-height:1;color:${a.text}">${e.symbol}</span>
      <span style="font-size:10px;color:var(--text-muted);line-height:1;margin-top:3px">${e.atomicNumber}</span>
    </div>`}l+="</div>",l+=`<div style="display:flex;gap:4px;margin-left:${t}px">`;for(const s of N){const e=$[s],a=b[e.category],r=o.has(e.symbol);l+=`<div class="element-cell ${r?"selected":""}"
      style="width:${f}px;height:${h}px;display:flex;flex-direction:column;align-items:center;justify-content:center;border-radius:6px;cursor:pointer;background:${a.bg};border:1.5px solid ${r?"var(--accent)":a.border}"
      data-symbol="${e.symbol}"
      title="${e.name} (${e.symbol})&#10;原子序数: ${e.atomicNumber}&#10;原子量: ${e.atomicMass}">
      <span style="font-weight:700;font-size:14px;line-height:1;color:${a.text}">${e.symbol}</span>
      <span style="font-size:10px;color:var(--text-muted);line-height:1;margin-top:3px">${e.atomicNumber}</span>
    </div>`}return l+="</div>",l+="</div></div>",l+='<p class="text-xs mt-3" style="color:var(--text-muted)">单击元素添加到配方列表，再次点击移除；<span style="color:var(--accent)">双击元素</span>查看详细性质</p>',l}function R(){if(d.length===0)return'<div class="text-center py-10" style="color:var(--text-muted);background:var(--input-bg);border-radius:8px">请从元素周期表中选择元素</div>';const o=u==="mass-to-mole"?"质量分数(%)":"摩尔分数(%)";let l="";return l+=`<div class="flex items-center px-4 py-3 rounded-t-lg" style="background:var(--input-bg)">
    <span class="flex-1 text-sm font-semibold" style="color:var(--text-muted)">元素</span>
    <span class="flex-1 text-sm font-semibold" style="color:var(--text-muted)">原子量</span>
    <span class="flex-1 text-sm font-semibold" style="color:var(--text-muted)">${o}</span>
    <span class="w-10"></span>
  </div>`,l+='<div class="rounded-b-lg" style="border:1px solid var(--border);border-top:none">',d.forEach((t,s)=>{const e=x(t.symbol),a=b[e.category];l+=`<div class="flex items-center px-4 py-3.5" style="${s<d.length-1?"border-bottom:1px solid var(--border)":""}">
      <div class="flex-1 flex items-center gap-2.5">
        <span class="inline-flex items-center justify-center w-9 h-9 rounded text-sm font-bold" style="background:${a.bg};color:${a.text};border:1px solid ${a.border}">${e.symbol}</span>
        <span class="text-base font-medium">${e.symbol}</span>
        <span class="text-sm" style="color:var(--text-muted)">${e.name}</span>
      </div>
      <div class="flex-1 font-mono text-base" style="color:var(--text-secondary)">${e.atomicMass.toFixed(4)}</div>
      <div class="flex-1">
        <input type="text" inputmode="decimal" placeholder="0.00" value="${t.value||""}"
          class="comp-input w-full px-3 py-2.5 rounded-lg text-base text-right font-mono outline-none focus:ring-2 focus:ring-sky-400/40"
          style="background:var(--input-bg);border:1px solid var(--border);color:var(--text-primary)"
          data-input-idx="${s}" />
      </div>
      <div class="w-10 text-center">
        <button class="remove-btn w-7 h-7 rounded-full flex items-center justify-center text-sm transition-colors"
          style="background:var(--border);color:var(--text-muted)"
          data-remove-idx="${s}" title="移除">✕</button>
      </div>
    </div>`}),l+="</div>",l+='<div id="comp-total">',l+=B(),l+="</div>",l}function B(){const o=d.reduce((s,e)=>s+e.value,0);let t=`<div class="flex items-center px-4 py-3" style="background:var(--input-bg);border-top:1px solid var(--border);border-radius:0 0 8px 8px;margin-top:-1px">
    <span class="flex-1 text-sm font-semibold" style="color:var(--text-muted)">总计</span>
    <span class="flex-1 text-center text-sm" style="color:var(--text-muted)">—</span>
    <span class="flex-1 font-mono text-lg font-bold" style="color:${Math.abs(o-100)<.01?"var(--success)":o>100?"var(--error)":o>0?"var(--warning)":"var(--text-muted)"}">${o.toFixed(2)}</span>
    <span class="w-10"></span>
  </div>`;if(Math.abs(o-100)>.01&&o>0)if(g)t+=`<div class="text-sm mt-2" style="color:var(--accent)">已勾选归一化计算：执行时将按比例缩放至 100.00%（缩放系数 ${(100/o).toFixed(4)}）</div>`;else{const s=o>100?"var(--error)":"var(--warning)",e=o<100?`提示: 总和不足100%，还差${(100-o).toFixed(2)}%（可勾选"归一化计算"自动缩放）`:`警告: 总和超过100%，超出${(o-100).toFixed(2)}%（可勾选"归一化计算"自动缩放）`;t+=`<div class="text-sm mt-2" style="color:${s}">${e}</div>`}return t}function q(){if(!c)return"";const o=c;let l='<div class="fade-in">';if(o.normalized){const s=o.totalBefore===null?"100.00":o.totalBefore.toFixed(2);l+=`<div class="flex items-center gap-2 px-3 py-2.5 rounded-lg mb-3 text-sm" style="background:rgba(56,189,248,0.08);border:1px solid rgba(56,189,248,0.25);color:var(--accent)">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="shrink-0"><path d="M8 3H3m0 0v5m0-5 5 5M16 21h5m0 0v-5m0 5-5-5"/></svg>
      <span>已启用归一化计算：输入总和 ${s}% → 100.00%（各成分等比缩放，缩放系数 ${o.scale.toFixed(4)}）</span>
    </div>`}l+='<div class="overflow-x-auto"><table class="w-full text-sm">',l+="<thead><tr>",l+='<th class="px-4 py-3 text-left text-sm font-semibold" style="color:var(--text-muted);background:var(--input-bg)">元素</th>',l+='<th class="px-4 py-3 text-left text-sm font-semibold" style="color:var(--text-muted);background:var(--input-bg)">原子量</th>',o.normalized?(l+=`<th class="px-4 py-3 text-right text-sm font-semibold" style="color:var(--text-muted);background:var(--input-bg)">归一化前(${u==="mass-to-mole"?"wt%":"mol%"})</th>`,l+='<th class="px-4 py-3 text-right text-sm font-semibold" style="color:var(--warning);background:var(--input-bg)">归一化后输入</th>'):l+=`<th class="px-4 py-3 text-right text-sm font-semibold" style="color:var(--text-muted);background:var(--input-bg)">${o.inputLabel}</th>`,l+=`<th class="px-4 py-3 text-right text-sm font-semibold" style="color:var(--accent);background:var(--input-bg)">${o.outputLabel}</th>`,l+="</tr></thead><tbody>",o.results.forEach(s=>{const e=b[x(s.symbol).category],a=s.inputValue/o.scale;l+=`<tr style="border-bottom:1px solid var(--border)">
      <td class="px-4 py-3">
        <span class="inline-flex items-center justify-center w-6 h-6 rounded text-xs font-bold mr-2" style="background:${e.bg};color:${e.text}">${s.symbol}</span>
        <span class="font-medium">${s.symbol}</span>
        <span class="text-sm ml-1" style="color:var(--text-muted)">${s.name}</span>
      </td>
      <td class="px-4 py-3 font-mono" style="color:var(--text-secondary)">${m(s.atomicMass)}</td>
      ${o.normalized?`<td class="px-4 py-3 text-right font-mono" style="color:var(--text-muted)">${m(a)}</td>
           <td class="px-4 py-3 text-right font-mono" style="color:var(--warning)">${m(s.inputValue)}</td>`:`<td class="px-4 py-3 text-right font-mono" style="color:var(--text-secondary)">${m(s.inputValue)}</td>`}
      <td class="px-4 py-3 text-right font-mono font-bold" style="color:var(--accent)">${m(s.outputValue)}</td>
    </tr>`});const t=Math.abs(o.totalOutput-100)<.01;return l+=`<tr style="background:rgba(56,189,248,0.05)">
    <td class="px-4 py-3 font-semibold text-sm" style="color:var(--text-muted)">总计</td>
    <td class="px-4 py-3 text-sm" style="color:var(--text-muted)">—</td>
    <td class="px-4 py-3 text-right font-mono font-semibold" style="color:var(--text-secondary)">${m(o.totalInput)}</td>
    <td class="px-4 py-3 text-right font-mono font-bold" style="color:var(--accent)">${m(o.totalOutput)} ${t?"✓":""}</td>
  </tr>`,l+="</tbody></table></div>",l+='<div class="flex items-center justify-between mt-3">',l+=`<div class="flex items-center gap-1.5 text-sm" style="color:var(--success)">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
    转换完成，总和 ${m(o.totalOutput)}%
  </div>`,l+='<button class="export-btn flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors" style="background:var(--bg-card-hover);color:var(--text-secondary)" data-action="export">导出结果</button>',l+="</div>",l+="</div>",l}function P(){if(!c)return"";const o=c,l=u==="mass-to-mole";let t='<div class="fade-in mt-4 pt-4" style="border-top:1px dashed var(--border)">';if(t+=`<div class="flex items-center gap-2 mb-2">
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><path d="M9 7h2v10M9 7H7m9 3v6m0-3h3m-7 3h.01M17 7h.01"/></svg>
    <h3 class="text-xs font-bold" style="color:var(--text-primary)">计算公式与过程</h3>
  </div>`,t+='<div class="rounded-lg p-3 mb-3 font-mono text-xs leading-relaxed" style="background:var(--input-bg);border:1px solid var(--border);color:var(--text-secondary)">',o.normalized){const s=o.totalBefore===null?"100":o.totalBefore.toFixed(2);t+=`<div class="font-bold mb-1" style="color:var(--warning)">⓪ 归一化（${o.inputLabel} 总和 ${s}% ≠ 100%）</div>`,t+=`<div>缩放系数 k = 100 / ${s} = ${o.scale.toFixed(4)}；w'<sub>i</sub> = w<sub>i</sub> × k → Σw' = 100%</div>`,t+='<div class="mt-2"></div>'}return l?(t+='<div class="font-bold mb-1" style="color:var(--accent)">质量分数 wt% → 摩尔分数 mol%</div>',t+="<div>① 取 100 g 样品：m<sub>i</sub> = w<sub>i</sub> (g)</div>",t+="<div>② 物质的量：n<sub>i</sub> = m<sub>i</sub> / M<sub>i</sub></div>",t+="<div>③ 摩尔分数：x<sub>i</sub> = n<sub>i</sub> / Σn × 100%</div>"):(t+='<div class="font-bold mb-1" style="color:var(--accent)">摩尔分数 mol% → 质量分数 wt%</div>',t+="<div>① 取 1 mol 样品：n<sub>i</sub> = x<sub>i</sub> (mol)</div>",t+="<div>② 质量：m<sub>i</sub> = n<sub>i</sub> × M<sub>i</sub></div>",t+="<div>③ 质量分数：w<sub>i</sub> = m<sub>i</sub> / Σm × 100%</div>"),t+='<div class="mt-1" style="color:var(--text-muted)">（M<sub>i</sub> 为摩尔质量 g/mol）</div>',t+="</div>",t+='<div class="space-y-1.5 font-mono text-xs">',o.results.forEach(s=>{const e=x(s.symbol),a=b[e.category];let r="";if(l){const n=s.inputValue,i=n/s.atomicMass,v=o.results.reduce((C,E)=>C+E.inputValue/E.atomicMass,0);r=`n<sub>${s.symbol}</sub> = ${m(n)} g / ${m(s.atomicMass)} = ${i.toFixed(4)} mol ; x = ${i.toFixed(4)} / ${v.toFixed(4)} × 100%`}else{const i=s.inputValue/100*s.atomicMass;r=`m<sub>${s.symbol}</sub> = ${(s.inputValue/100).toFixed(4)} mol × ${m(s.atomicMass)} g/mol = ${i.toFixed(4)} g`}t+=`<div class="flex items-start gap-2 px-3 py-2 rounded" style="background:var(--input-bg)">
      <span class="inline-flex items-center justify-center min-w-6 h-6 px-1 rounded text-xs font-bold shrink-0" style="background:${a.bg};color:${a.text}">${s.symbol}</span>
      <span style="color:var(--text-secondary)">${r}</span>
      <span class="ml-auto font-bold shrink-0" style="color:var(--accent)">→ ${m(s.outputValue)}%</span>
    </div>`}),t+="</div>",t+="</div>",t}function H(){const o=d.map(e=>e.symbol);if(o.length===0)return"";const l=o.map(e=>({e:x(e),p:A(x(e).atomicNumber)}));let t=`<div id="prop-card" class="rounded-xl mt-4 overflow-hidden" style="background:var(--bg-card);border:1px solid var(--border)">
    <button class="prop-toggle w-full flex items-center gap-2 px-4 py-3 text-left" data-toggle="prop">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><path d="M12 2v20M2 12h20"/><circle cx="12" cy="12" r="10"/></svg>
      <h2 class="text-sm font-bold flex-1" style="color:var(--text-primary)">元素性质对比（${o.length}个）</h2>
      <svg class="prop-arrow transition-transform" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2" style="transform:rotate(${y?"0":"-90"}deg)"><polyline points="6 9 12 15 18 9"/></svg>
    </button>
    <div id="prop-body" style="display:${y?"block":"none"}">`;const s=[{label:"英文名",get:e=>e.nameEn},{label:"原子量",get:(e,a)=>a.atomicMass.toFixed(4)},{label:"常温状态",get:e=>e.state},{label:"密度",get:e=>V(e.density,e.state)},{label:"熔点",get:e=>k(e.melting)},{label:"沸点",get:e=>k(e.boiling)},{label:"电负性",get:e=>e.electronegativity===null?"未知":`${e.electronegativity} (鲍林)`},{label:"第一电离能",get:e=>e.ionization===null?"未知":`${e.ionization} kJ/mol`},{label:"原子半径",get:e=>e.radius===null?"未知":`${e.radius} pm`},{label:"电子排布",get:e=>e.electronConfig},{label:"常见化合价",get:e=>e.valence},{label:"发现年份",get:e=>e.year}];return s.forEach((e,a)=>{t+=`<div class="flex items-stretch ${a<s.length-1,""}" style="${a<s.length-1?"border-bottom:1px solid var(--border)":""}">`,t+=`<div class="w-24 shrink-0 px-3 py-2.5 text-xs font-semibold flex items-center" style="color:var(--text-muted);background:var(--input-bg)">${e.label}</div>`,t+='<div class="flex-1 flex flex-wrap">',l.forEach(({e:r,p:n})=>{const i=b[r.category];t+=`<div class="flex-1 min-w-[120px] px-3 py-2.5 text-xs" style="border-left:1px solid var(--border)">
        <button class="font-bold mb-0.5 hover:underline cursor-pointer" style="color:${i.text}" data-detail="${r.symbol}" title="查看${r.name}详细性质">${r.symbol} ⓘ</button>
        <div style="color:var(--text-secondary)">${e.get(n,r)}</div>
      </div>`}),t+="</div></div>"}),t+='<div class="px-3 py-2 text-xs" style="color:var(--text-muted);background:var(--input-bg);border-top:1px solid var(--border)">数据来源：IUPAC 标准原子量 / 常规化学手册，气体密度单位为 g/L，合成元素部分性质为预测值(预)</div>',t+="</div></div>",t}function D(o){const l=x(o),t=A(l.atomicNumber),s=b[l.category],e=[["元素名称",`${l.name} / ${t.nameEn}`],["原子序数",String(l.atomicNumber)],["相对原子量",l.atomicMass.toFixed(4)],["常温状态",t.state],["密度",V(t.density,t.state)],["熔点",k(t.melting)],["沸点",k(t.boiling)],["电负性",t.electronegativity===null?"未知":`${t.electronegativity} (鲍林标度)`],["第一电离能",t.ionization===null?"未知":`${t.ionization} kJ/mol`],["原子半径",t.radius===null?"未知":`${t.radius} pm`],["电子排布",t.electronConfig],["常见化合价",t.valence],["所在周期/族",`第${l.period}周期 / ${l.group?`第${l.group}族`:"镧系/锕系"}`],["发现年份",t.year]];let a=`<div id="detail-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4" style="background:rgba(0,0,0,0.6)" data-modal>
    <div class="rounded-2xl w-full max-w-md max-h-[85vh] overflow-y-auto fade-in" style="background:var(--bg-card);border:1px solid var(--border)">
      <div class="sticky top-0 flex items-center gap-3 px-5 py-4" style="background:var(--bg-card);border-bottom:1px solid var(--border)">
        <span class="inline-flex items-center justify-center w-12 h-12 rounded-xl text-lg font-bold" style="background:${s.bg};color:${s.text};border:1.5px solid ${s.border}">${l.symbol}</span>
        <div class="flex-1">
          <h3 class="text-base font-bold" style="color:var(--text-primary)">${l.name} · ${t.nameEn}</h3>
          <p class="text-xs" style="color:var(--text-muted)">#${l.atomicNumber} · ${S[l.category]||l.category}</p>
        </div>
        <button class="detail-close w-8 h-8 rounded-full flex items-center justify-center text-base" style="background:var(--border);color:var(--text-muted)" data-close-modal>✕</button>
      </div>
      <div class="px-5 py-3">`;return e.forEach(([r,n],i)=>{a+=`<div class="flex justify-between gap-4 py-2.5 ${i<e.length-1,""}" style="${i<e.length-1?"border-bottom:1px solid var(--border)":""}">
      <span class="text-sm shrink-0" style="color:var(--text-muted)">${r}</span>
      <span class="text-sm text-right font-medium" style="color:var(--text-primary)">${n}</span>
    </div>`}),a+="</div></div></div>",a}function U(){let o='<div class="flex items-center gap-1.5">';return o+='<span class="text-xs mr-1" style="color:var(--text-muted)">主题</span>',j.forEach(l=>{const t=M===l.id;o+=`<button class="theme-btn w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${t?"active":""}" 
      data-theme="${l.id}" 
      title="${l.name}"
      style="background:${l.color};border:2px solid ${t?"var(--accent)":"var(--border)"};color:${l.id==="light"?"#1e293b":"#f1f5f9"}">
      ${t?"✓":""}
    </button>`}),o+="</div>",o}function Y(o){const l=[];let t=0;for(const e of o){const a=x(e.symbol),r=e.value/a.atomicMass;l.push(r),t+=r}const s=o.map((e,a)=>{const r=x(e.symbol);return{symbol:r.symbol,name:r.name,atomicMass:r.atomicMass,inputValue:e.value,outputValue:t>0?l[a]/t*100:0}});return{results:s,totalInput:o.reduce((e,a)=>e+a.value,0),totalOutput:s.reduce((e,a)=>e+a.outputValue,0)}}function G(o){const l=[];let t=0;for(const e of o){const a=x(e.symbol),r=e.value*a.atomicMass;l.push(r),t+=r}const s=o.map((e,a)=>{const r=x(e.symbol);return{symbol:r.symbol,name:r.name,atomicMass:r.atomicMass,inputValue:e.value,outputValue:t>0?l[a]/t*100:0}});return{results:s,totalInput:o.reduce((e,a)=>e+a.value,0),totalOutput:s.reduce((e,a)=>e+a.outputValue,0)}}function L(){const o=d.filter(a=>a.value>0);if(o.length===0){c=null,p();return}let l=o,t=null,s=1;if(g){const a=o.reduce((r,n)=>r+n.value,0);Math.abs(a-100)>.01&&(t=a,s=100/a,l=o.map(r=>({symbol:r.symbol,value:r.value*s})))}c={...u==="mass-to-mole"?Y(l):G(l),inputLabel:u==="mass-to-mole"?"质量分数(wt%)":"摩尔分数(mol%)",outputLabel:u==="mass-to-mole"?"摩尔分数(mol%)":"质量分数(wt%)",normalized:g&&t!==null,totalBefore:t,scale:s},p()}function J(o){const l=d.findIndex(t=>t.symbol===o);l>=0?d.splice(l,1):d.push({symbol:o,value:0}),c=null,p()}function F(o){w=o,p()}function I(){w=null,p()}function W(o,l){const t=parseFloat(l);d[o].value=isNaN(t)?0:t,c=null;const s=document.getElementById("comp-total");s&&(s.innerHTML=B());const e=document.getElementById("result-card");e&&(e.style.display="none")}function X(o){d.splice(o,1),c=null,p()}function K(){d=[],c=null,p()}function Q(o){u=o,c=null,p()}function Z(o){T(o),p()}function tt(){if(!c)return;const o=c,l=u==="mass-to-mole";let t=`元素分数转换结果
`;if(t+=`================================

`,t+=`转换模式: ${o.inputLabel} → ${o.outputLabel}

`,t+=`【计算公式】
`,o.normalized){const n=o.totalBefore===null?"100":o.totalBefore.toFixed(4);t+=`归一化: 输入总和 ${n}% ≠ 100%, 缩放系数 k = 100/${n} = ${o.scale.toFixed(4)}, w'_i = w_i × k

`}if(l?(t+=`取 100g 样品: m_i = w_i (g)
`,t+=`物质的量: n_i = m_i / M_i
`,t+=`摩尔分数: x_i = n_i / Σn × 100%
`):(t+=`取 1mol 样品: n_i = x_i (mol)
`,t+=`质量: m_i = n_i × M_i
`,t+=`质量分数: w_i = m_i / Σm × 100%
`),t+=`
【计算过程】
`,l){const n=o.results.reduce((i,v)=>i+v.inputValue/v.atomicMass,0);for(const i of o.results){const v=i.inputValue/i.atomicMass;t+=`${i.symbol}: n = ${i.inputValue.toFixed(4)} / ${i.atomicMass.toFixed(4)} = ${v.toFixed(4)} mol → x = ${v.toFixed(4)}/${n.toFixed(4)} × 100% = ${i.outputValue.toFixed(4)}%
`}}else for(const n of o.results){const i=n.inputValue/100*n.atomicMass;t+=`${n.symbol}: m = ${(n.inputValue/100).toFixed(4)} × ${n.atomicMass.toFixed(4)} = ${i.toFixed(4)} g → w = ${n.outputValue.toFixed(4)}%
`}t+=`
【结果明细】
`,t+=`元素	原子量		${o.inputLabel}		${o.outputLabel}
`,t+=`----	--------	--------	--------
`;for(const n of o.results)t+=`${n.symbol}	${n.atomicMass.toFixed(4)}		${n.inputValue.toFixed(4)}		${n.outputValue.toFixed(4)}
`;t+=`
总和验证:
`,t+=`输入总和: ${o.totalInput.toFixed(4)}
`,t+=`输出总和: ${o.totalOutput.toFixed(4)}
`,t+=`
数据来源: IUPAC 2024 Standard Atomic Weights
`;const s=`元素分数转换结果_${new Date().toISOString().slice(0,10)}.txt`,e=new Blob([t],{type:"text/plain;charset=utf-8"}),a=URL.createObjectURL(e),r=document.createElement("a");r.href=a,r.download=s,r.click(),URL.revokeObjectURL(a)}function p(){const o=document.getElementById("app");if(!o)return;const l=document.activeElement;let t=null,s=0;l&&l instanceof HTMLInputElement&&l.dataset.inputIdx&&(t=parseInt(l.dataset.inputIdx,10),s=l.selectionStart||0);const e=u==="mass-to-mole"?"质量分数输入 (wt%)":"摩尔分数输入 (mol%)";if(o.innerHTML=`
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
      ${U()}
    </header>

    <div class="max-w-[1600px] mx-auto px-4 py-4">
      <!-- Mode Switcher + Property Comparison Entry -->
      <div class="flex mb-4 p-1 rounded-xl gap-1 items-center" style="background:var(--bg-card)">
        <button class="mode-btn flex-1 py-2.5 px-4 text-sm font-semibold rounded-lg transition-all ${u==="mass-to-mole"?"active":""}"
          data-mode="mass-to-mole"
          style="${u==="mass-to-mole"?"background:var(--accent);color:#0f172a":"color:var(--text-muted);background:transparent"}">
          质量分数 → 摩尔分数
        </button>
        <button class="mode-btn flex-1 py-2.5 px-4 text-sm font-semibold rounded-lg transition-all ${u==="mole-to-mass"?"active":""}"
          data-mode="mole-to-mass"
          style="${u==="mole-to-mass"?"background:var(--accent);color:#0f172a":"color:var(--text-muted);background:transparent"}">
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
          ${O()}
        </div>

        <!-- Right: Input & Result -->
        <div>
          <div class="rounded-xl p-4 mb-4" style="background:var(--bg-card);border:1px solid var(--border)">
            <div class="flex items-center gap-2 mb-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              <h2 class="text-sm font-bold" style="color:var(--text-primary)">${e}</h2>
            </div>
            <div id="composition-area">
            ${R()}
            </div>

            <!-- Normalization option -->
            <label class="flex items-center gap-2.5 mt-3 px-3 py-2.5 rounded-lg cursor-pointer select-none transition-colors" style="background:var(--input-bg);border:1px solid var(--border)" title="各成分含量按比例缩放，使总和归一为100%">
              <input type="checkbox" id="norm-toggle" ${g?"checked":""} class="w-4 h-4 shrink-0 cursor-pointer" style="accent-color:#38bdf8" />
              <span class="text-sm font-semibold" style="color:var(--text-primary)">归一化计算</span>
              <span class="text-xs" style="color:var(--text-muted)">勾选后，各成分含量按比例缩放，使总和归一为 100%，并在结果中显示归一化前后对比</span>
            </label>
          </div>

          ${H()}

          <div class="flex gap-3 mb-4">
            <button class="convert-btn flex-1 py-3.5 px-6 rounded-xl text-base font-bold transition-all ${d.length===0?"opacity-50 cursor-not-allowed":"hover:-translate-y-0.5"}"
              style="background:linear-gradient(135deg,#0ea5e9,#38bdf8);color:#0f172a;${d.length>0?"box-shadow:0 4px 12px rgba(56,189,248,0.3)":""}"
              data-action="convert" ${d.length===0?"disabled":""}>
              确认开始
            </button>
            <button class="py-3.5 px-5 rounded-xl text-base font-semibold transition-colors"
              style="background:var(--bg-card);color:var(--text-muted);border:1px solid var(--border)"
              data-action="clear">
              清空
            </button>
          </div>

          ${c?`
          <div id="result-card" class="rounded-xl p-4 fade-in" style="background:var(--bg-card);border:1px solid var(--border)">
            <div class="flex items-center gap-2 mb-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
              <h2 class="text-sm font-bold" style="color:var(--text-primary)">转换结果</h2>
            </div>
            ${q()}
            ${P()}
          </div>`:'<div id="result-card" style="display:none"></div>'}
        </div>
      </div>
    </div>
    ${w?D(w):""}
  `,et(),t!==null){const a=document.querySelector(`input[data-input-idx="${t}"]`);if(a){a.focus();try{a.setSelectionRange(s,s)}catch{}}}}function et(){const o=document.getElementById("app");if(!o)return;o.querySelectorAll(".element-cell").forEach(t=>{t.addEventListener("click",()=>{const s=t.dataset.symbol;s&&J(s)}),t.addEventListener("dblclick",s=>{s.preventDefault();const e=t.dataset.symbol;e&&F(e)})}),o.querySelectorAll("[data-detail]").forEach(t=>{t.addEventListener("click",()=>{const s=t.dataset.detail;s&&F(s)})}),o.querySelectorAll('[data-toggle="prop"]').forEach(t=>{t.addEventListener("click",()=>{y=!y;const s=document.getElementById("prop-body"),e=t.querySelector(".prop-arrow");s&&(s.style.display=y?"block":"none"),e&&(e.style.transform=`rotate(${y?"0":"-90"}deg)`)})}),o.querySelectorAll("[data-close-modal]").forEach(t=>{t.addEventListener("click",I)}),o.querySelectorAll("[data-modal]").forEach(t=>{t.addEventListener("click",s=>{s.target===t&&I()})});const l=document.getElementById("norm-toggle");l&&l.addEventListener("change",()=>{g=l.checked,c=null,p()}),o.querySelectorAll(".mode-btn").forEach(t=>{t.addEventListener("click",()=>{const s=t.dataset.mode;s&&Q(s)})}),o.querySelectorAll(".theme-btn").forEach(t=>{t.addEventListener("click",()=>{const s=t.dataset.theme;s&&Z(s)})}),o.querySelectorAll("input[data-input-idx]").forEach(t=>{t.addEventListener("input",s=>{const e=parseInt(s.target.dataset.inputIdx||"0",10);W(e,s.target.value)}),t.addEventListener("keydown",(s=>{const e=parseInt(s.target.dataset.inputIdx||"0",10);if(s.key==="Enter"||s.key==="Tab"){s.preventDefault();const a=document.querySelector(`input[data-input-idx="${e+1}"]`);a?(a.focus(),a.click()):L()}}))}),o.querySelectorAll(".remove-btn[data-remove-idx]").forEach(t=>{t.addEventListener("click",s=>{s.stopPropagation();const e=parseInt(t.dataset.removeIdx||"0",10);X(e)})}),o.querySelectorAll("[data-action]").forEach(t=>{t.addEventListener("click",()=>{const s=t.dataset.action;s==="convert"?L():s==="clear"?K():s==="export"&&tt()})})}function ot(){T(M),p()}ot();
