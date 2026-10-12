const DATA=window.__PROJECTS__,list=document.getElementById('cases'),q=document.getElementById('search');
let category='all';
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const themes={audio:['#eaf2f1','#26796e'],area:['#edf3e8','#42664a'],classical:['#f8efe4','#996044']};
function illustration(p){
 if(window.CASE_COVERS?.[p.caseKey])return window.CASE_COVERS[p.caseKey].svg;
 if(p.caseKey==='audio')return '<svg viewBox="0 0 320 110" aria-hidden="true">'+Array.from({length:33},(_,i)=>{let h=12+Math.abs(Math.sin(i*.77))*50*Math.sin((i+1)/35*Math.PI);return `<rect x="${20+i*9}" y="${55-h/2}" width="4" height="${h}" rx="2" fill="currentColor" opacity="${.35+(i%5)*.12}"/>`;}).join('')+'</svg>';
 if(p.caseKey==='area')return '<svg viewBox="0 0 320 110" aria-hidden="true"><path d="M80 90H235L265 20H110Z" fill="#c6d8bb" stroke="currentColor" stroke-width="2"/><path d="M110 20V90" stroke="currentColor" stroke-dasharray="4 4"/><path d="M110 77H123V90" fill="none" stroke="currentColor"/><text x="160" y="63" fill="currentColor" font-size="20" font-family="serif">S = a × h</text></svg>';
 if(p.caseKey==='classical')return '<svg viewBox="0 0 320 110" aria-hidden="true"><path d="M60 85H270M60 20V85M260 20V85" stroke="#d5bba4" fill="none"/><text x="152" y="82" fill="currentColor" font-size="76" font-family="serif">之</text><text x="85" y="46" fill="currentColor" font-size="11" font-family="serif">一字</text><text x="85" y="66" fill="currentColor" font-size="11" font-family="serif">六义</text></svg>';
 const k=DATA.categories.findIndex(c=>c.id===p.c);
 return '<svg viewBox="0 0 320 110" aria-hidden="true">'+[0,1,2,3].map(i=>`<rect x="${65+i*42}" y="${22+(i%2)*13}" width="54" height="54" rx="${k%2?27:12}" fill="none" stroke="currentColor" opacity="${.3+i*.17}" transform="rotate(${k*5} ${92+i*42} 55)"/>`).join('')+'</svg>';
}
function render(){
 const query=q.value.trim().toLowerCase();
 const rows=DATA.projects.filter(p=>(category==='all'||p.c===category)&&[p.n,p.d,...p.subjects||[],p.selection?.domain].join(' ').toLowerCase().includes(query));
 $('resultCount').textContent=rows.length+' 个案例';
 list.innerHTML=rows.length?rows.map(p=>{
 const [tint,accent]=themes[p.caseKey]||window.CASE_COVERS?.[p.caseKey]?.theme||['#f0f4fa','#6384a5'];
 const title=p.n.replace(/（学生 \+ 教师）|（案例\d+.*?）/g,'').trim();
 return `<article class="card"><div class="cover" style="--tint:${tint};--accent:${accent}"><span class="cover-label">${esc((DATA.categories.find(c=>c.id===p.c)||{}).name)}</span>${illustration(p)}<span class="cover-code">QUICKFORM / ${String(p.order).padStart(2,'0')}</span></div><div class="content"><div class="tags">${(p.subjects||[]).map(s=>'<span>'+esc(s)+'</span>').join('')}</div><h2>${esc(title)}</h2><p class="description">${esc(p.cardDescription||p.selection?.reason||p.d)}</p><div class="actions">${p.ready?`<a class="action primary" href="projects/${p.caseKey}/${esc(p.appEntry||"index.html")}">应用展示 <span>↗</span></a><a class="action" href="projects/${p.caseKey}/${esc(p.dashboardEntry||"dashboard.html")}">数据大屏 ↗</a>`:`<button class="action" data-detail="${p.order}">了解案例 ↗</button><span class="pending">双端完善中</span>`}</div></div></article>`;
 }).join(''):'<div class="empty">没有找到匹配的案例，请试试其他关键词或教学用途。</div>';
}
$('filters').innerHTML=[{id:'all',name:'全部'},...DATA.categories].map(c=>`<button class="filter" data-category="${c.id}" aria-pressed="${c.id==='all'}">${esc(c.name)}</button>`).join('');
$('filters').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;category=b.dataset.category;for(const el of $('filters').children)el.setAttribute('aria-pressed',el===b);render();});
q.addEventListener('input',render);
list.addEventListener('click',e=>{const b=e.target.closest('[data-detail]');if(!b)return;const p=DATA.projects.find(p=>p.order===Number(b.dataset.detail));$('detailTitle').textContent=p.n;$('detailDescription').textContent=p.selection?.reason||p.d;$('detailData').textContent=p.selection?.screen||'应用与数据大屏正在完善。';$('detail').showModal();});
$('closeDetail').onclick=()=>$('detail').close();
document.addEventListener('keydown',e=>{if(e.key==='/'&&!['INPUT','TEXTAREA'].includes(document.activeElement.tagName)){e.preventDefault();q.focus();}});
render();
