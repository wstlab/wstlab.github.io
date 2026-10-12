(() => {
 let current=null,answers=[],mode='latest';
 const $=id=>document.getElementById(id),esc=QF.esc;
 const panel=document.createElement('section');panel.className='panel roster-panel';panel.id='rosterPanel';
 panel.innerHTML=`<div class="roster-top"><div><h2>名册与参与情况</h2><p class="hint">教师发布名册 → 序号选择身份 → 作答回收。只统计当前名册，姓名均为演示显示名。</p></div><a class="button" id="manageRoster" target="_blank" rel="noopener">导入 / 管理名册 ↗</a></div>
 <p class="hint" id="rosterVersion">正在读取QuickForm名册…</p>
 <div class="roster-summary" id="rosterStats"></div>
 <div class="roster-controls"><select id="participantFilter" aria-label="筛选参与状态"><option value="all">全部成员</option><option value="pending">尚未提交</option><option value="submitted">已提交</option></select><input id="memberSearch" type="search" placeholder="查找序号或姓名…" aria-label="查找名册成员"></div>
 <div id="membersGrid" class="members-grid"></div>
 <div class="roster-mode"><span>下方学情统计：</span><label><input type="radio" name="statsMode" value="latest" checked> 每人最新一次</label><label><input type="radio" name="statsMode" value="all"> 当前名册全部作答</label></div><p class="hint" id="historyNote" style="margin-top:12px;margin-bottom:0"></p>`;
 document.getElementById('metrics').before(panel);
 $('manageRoster').href=QF.base+'/teaching/classical/roster/manage';
 function relevant(){
  if(!current)return [];
  const members=new Set(current.members.map(m=>m.member_id));
  return answers.filter(r=>r.case_id==='classical'&&r.answers&&r.roster_version===current.version&&members.has(r.member_id));
 }
 function latest(){
  const map=new Map();
  // Official QuickForm returns insertion order; prefer most recent timestamp and retain last on ties.
  for(const r of relevant()){
   const old=map.get(r.member_id);
   if(!old||String(r.submitted_at||'')>=String(old.submitted_at||''))map.set(r.member_id,r);
  }
  return map;
 }
 function render(){
  if(!current){
   $('rosterVersion').textContent='还没有发布名册。教师登录后可导入CSV，也可一键生成50人模拟名单。';
   $('rosterStats').innerHTML='';$('membersGrid').innerHTML='<div class="hint">等待教师发布名册。</div>';$('historyNote').textContent='旧的自由昵称作答仍保留在QuickForm记录，不计入名册参与率。';return;
  }
  const valid=relevant(),last=latest();
  $('rosterVersion').textContent=current.title+' · '+current.members.length+' 人 · 版本 '+current.version.slice(0,8)+' · '+current.published_at;
  $('rosterStats').innerHTML=[['应参与',current.members.length],['已提交',last.size],['未提交',current.members.length-last.size],['完成率',Math.round(last.size/current.members.length*100)+'%']].map(([name,val])=>`<div class="roster-stat"><span>${name}</span><b>${val}</b></div>`).join('');
  const filter=$('participantFilter').value,search=$('memberSearch').value.trim().toLowerCase();
  const shown=current.members.filter(m=>(filter==='all'||(filter==='submitted')===last.has(m.member_id))&&(m.serial+' '+m.name).toLowerCase().includes(search));
  $('membersGrid').innerHTML=shown.map(m=>{
   const r=last.get(m.member_id),attempts=valid.filter(a=>a.member_id===m.member_id).length;
   return `<div class="member-card ${r?'submitted':''}" data-member="${esc(m.serial)}"><strong>${esc(m.serial)} · ${esc(m.name)}</strong><small>${r?'最新 '+Number(r.score)+' 分 · '+attempts+' 次提交':'尚未提交'}</small></div>`;
  }).join('')||'<div class="hint">没有匹配的成员。</div>';
  $('historyNote').textContent='当前名册 '+valid.length+' 次作答；历史名册及未绑定身份的 '+(answers.length-valid.length)+' 条记录保留在QuickForm，不计入本轮。只输入序号是模拟身份选择，不能证明真实身份。';
 }
 window.ClassicalParticipation={
  async load(){
   const data={roster:await QF.roster()};
   if(data.roster&&!Array.isArray(data.roster.members))throw Error('名册格式无效');
   current=data.roster;return current;
  },
  update(rows){answers=rows;render();},
  selected(){return mode==='latest'?Array.from(latest().values()):relevant();},
  description(){return mode==='latest'?'当前名册每人最新一次作答':'当前名册全部作答';}
 };
 $('participantFilter').onchange=render;$('memberSearch').oninput=render;
 panel.querySelectorAll('input[name=statsMode]').forEach(r=>r.onchange=()=>{
  mode=r.value;window.dispatchEvent(new Event('classical-stats-mode'));
 });
})();
