(() => {
 const c=window.CASE,esc=s=>String(s??'').replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
 const $=id=>document.getElementById(id);
 const titles={gallery:['作品画廊','创作类型'],wall:['观点与作品','主题分布'],scatter:['变量关系','实验指标'],trend:['观测变化','指标均值'],diagnostic:['学习表现','题目与模块'],flow:['任务过程','课时记录'],groups:['课堂汇总','参与分布'],attendance:['签到记录','小组分布'],seats:['机位状态','操作分布'],map:['城市足迹','城市分布']};
 let rows=[],page=1,loaded=false,refreshing=false;
 document.body.dataset.view=c.view;document.documentElement.style.setProperty('--accent',c.accent||'#236d84');
 $('title').textContent=c.headline;$('intro').textContent=c.description;
 $('recordsLink').href='https://qf.kjxs.site/showcase/'+c.tasks.records;
 $('teacherLink').href='https://qf.kjxs.site/showcase';
 function flat(o,p='',out={}){
  if(!o||typeof o!=='object')return out;
  for(let [k,v] of Object.entries(o)){
   if(['_ip','submission_id','case_id','demo','submitted_at','elapsed_seconds'].includes(k))continue;
   let key=p?p+'.'+k:k;
   if(v&&typeof v==='object'&&!Array.isArray(v))flat(v,key,out);
   else out[key]=v;
  }return out;
 }
 const label=k=>c.fields.find(f=>f.key===k||k.endsWith('.'+f.key))?.label||({'lesson':'课时','alias':'演示称呼','score':'得分','name':'称呼','reflection':'学习发现','elapsed_seconds':'学习秒数'}[k])||k;
 function val(r,key){const f=flat(r);return f[key]??Object.entries(f).find(([k])=>k.endsWith('.'+key))?.[1];}
 function numeric(v){if(typeof v==='number')return Number.isFinite(v)?v:null;if(typeof v==='string'&&/^-?\d+(\.\d+)?%?$/.test(v.trim()))return Number(v.replace('%',''));return null;}
 const alias=r=>r.alias||r.student_name||r.studentName||r.author_name||r.name||r.studentId||r.姓名||'演示参与者';
 const stamp=r=>r.submitted_at||r.timestamp||r.submitTime||'';
 function bars(groups){
  const a=Object.entries(groups).sort((a,b)=>b[1]-a[1]).slice(0,16),max=Math.max(1,...a.map(x=>x[1]));
  return a.length?'<div class="bars">'+a.map(([k,v])=>`<div><div class="barhead"><span>${esc(k)}</span><b>${esc(Number(v.toFixed(2)))}</b></div><div class="track"><div class="fill" style="width:${v/max*100}%"></div></div></div>`).join('')+'</div>':empty();
 }
 const empty=()=>'<div class="empty">暂无对应记录。完成应用中的交互并提交后，这里会显示 QuickForm 收到的数据。</div>';
 function plot(data,xkey,ykey,trend=false){
  const pts=data.map((r,i)=>({x:trend?i:numeric(val(r,xkey)),y:numeric(val(r,ykey))})).filter(p=>p.x!==null&&p.y!==null);
  if(!pts.length)return empty();
  let xmax=Math.max(1,...pts.map(p=>p.x)),xmin=Math.min(0,...pts.map(p=>p.x)),ymax=Math.max(1,...pts.map(p=>p.y)),ymin=Math.min(0,...pts.map(p=>p.y));
  const x=v=>55+(v-xmin)/(xmax-xmin)*490,y=v=>240-(v-ymin)/(ymax-ymin)*195;
  return `<svg class="plot" viewBox="0 0 590 290" role="img" aria-label="${esc(label(xkey)+'与'+label(ykey))}">`+
   [0,.25,.5,.75,1].map(t=>`<line x1="55" y1="${240-t*195}" x2="555" y2="${240-t*195}"/><text x="5" y="${244-t*195}">${Math.round(ymin+t*(ymax-ymin))}</text>`).join('')+
   (trend?`<polyline points="${pts.map(p=>x(p.x)+','+y(p.y)).join(' ')}" fill="none" stroke-width="2"/>`:'')+
   pts.map(p=>`<circle cx="${x(p.x)}" cy="${y(p.y)}" r="4" opacity=".7"><title>${esc(p.x+' / '+p.y)}</title></circle>`).join('')+
   `<text x="65" y="275">${esc(trend?'提交顺序':label(xkey))}</text><text x="350" y="275">${esc(label(ykey))}</text></svg>`;
 }
 function cards(data){
  return '<div class="wall">'+data.slice(-24).reverse().map(r=>{
   const values=flat(r);const texts=Object.entries(values).filter(([k,v])=>typeof v==='string'&&v.length>1&&!/time|date|id|attachment|data:image|image|url|author_name|student_name|studentName|alias/i.test(k)).slice(0,5);
   let attachments=r.attachment||[];if(typeof attachments==='string')attachments=[attachments];
   const image=attachments.find(x=>typeof x==='string'&&x.startsWith('/static/uploads/'+c.tasks.records+'/')&&/\.(png|jpg|jpeg|webp)$/i.test(x));
   return `<article class="work">${image?`<a href="${esc(window.QFDemo.attachment(image)||("https://qf.kjxs.site"+image))}" target="_blank" rel="noopener"><img loading="lazy" src="https://qf.kjxs.site${esc(image)}" alt="公开演示作品"></a>`:''}<h3>${esc(alias(r))}</h3>${texts.map(([k,v])=>`<p><small>${esc(label(k))}</small><br>${esc(v.slice(0,900))}</p>`).join('')}<small>${esc(stamp(r))}</small></article>`;
  }).join('')+'</div>';
 }
 function render(){
  const participants=new Set(rows.map(alias)), lessons=new Set(rows.map(r=>r.lesson||'应用展示'));
  $('metrics').innerHTML=[['QuickForm记录',rows.length],['演示称呼',participants.size],['课时 / 模块',lessons.size],['附件作品',rows.filter(r=>r.attachment?.length).length]].map(([k,v])=>`<div class="metric"><small>${k}</small><strong>${v}</strong></div>`).join('');
  const allkeys=[...new Set(rows.flatMap(r=>Object.keys(flat(r))))];
  const numericKeys=[...new Set([...c.fields.map(f=>f.key),...allkeys])].filter(k=>!/(id|time|date|序号|学号)/i.test(k)&&rows.some(r=>numeric(val(r,k))!==null)).slice(0,12);
  const means={};for(const k of numericKeys){const vals=rows.map(r=>numeric(val(r,k))).filter(v=>v!==null);means[label(k)]=vals.reduce((s,v)=>s+v,0)/vals.length;}
  const groups={};
  const groupKey=c.fields.map(f=>f.key).find(k=>rows.some(r=>typeof val(r,k)==='string'&&val(r,k).length<35&&numeric(val(r,k))===null));
  for(const r of rows){const key=groupKey?val(r,groupKey):r.lesson||'应用展示';if(key)groups[String(key)]=(groups[String(key)]||0)+1;}
  const headings=titles[c.view]||titles.diagnostic;
  $('primaryTitle').textContent=headings[0];$('secondaryTitle').textContent=headings[1];
  if(['wall','gallery','flow','attendance','seats','map'].includes(c.view)){$('primary').innerHTML=rows.length?cards(rows):empty();$('primaryPanel').classList.add('wide');}
  else if(['scatter','trend'].includes(c.view))$('primary').innerHTML=numericKeys.length>=2?plot(rows,numericKeys[0],numericKeys[1],c.view==='trend'):bars(means);
  else $('primary').innerHTML=bars(means);
  $('secondary').innerHTML=bars(groups);
  if(c.view==='trend')$('secondary').innerHTML=bars(means);
  $('fieldGuide').innerHTML=c.fields.map(f=>`<span class="pill">${esc(f.label)}</span>`).join('');
  renderTable();
 }
 function renderTable(){
  const q=$('search').value.trim().toLowerCase(),filtered=rows.filter(r=>JSON.stringify(r).toLowerCase().includes(q)).slice().reverse();
  page=Math.min(page,Math.max(1,Math.ceil(filtered.length/20)));
  $('recordBody').innerHTML=filtered.slice((page-1)*20,page*20).map(r=>`<tr><td>${esc(alias(r))}</td><td>${esc(r.lesson||'应用展示')}</td><td>${esc(stamp(r))}</td><td><details><summary>查看记录 ${esc((r.submission_id||'').slice(0,8))}</summary><pre>${esc(JSON.stringify(r,null,2))}</pre></details></td></tr>`).join('')||'<tr><td colspan="4">暂无记录</td></tr>';
  $('pageLabel').textContent=`${page} / ${Math.max(1,Math.ceil(filtered.length/20))} · ${filtered.length} 条`;
  $('prev').disabled=page<=1;$('next').disabled=page*20>=filtered.length;
 }
 async function load(){
  if(refreshing)return;refreshing=true;$('refresh').disabled=true;
  try{
   const res=await fetch('https://qf.kjxs.site/api/'+c.tasks.records+'/all',{cache:'no-store',signal:AbortSignal.timeout(15000)});
   if(!res.ok)throw Error('HTTP '+res.status);
   const data=await res.json();if(!Array.isArray(data.submissions))throw Error('返回格式错误');
   rows=data.submissions.filter(r=>!r.verification);loaded=true;render();
   $('connection').classList.remove('error');$('connection').textContent='已连接 QuickForm · '+rows.length+' 条体验记录 · '+new Date().toLocaleTimeString()+' 更新 · 每15秒刷新'+(rows.length<data.submissions.length?' · 已排除链路测试记录':'');
  }catch(e){$('connection').classList.add('error');$('connection').textContent='暂时无法读取 QuickForm：'+e.message+(loaded?'；保留上次成功读取的结果。':'；尚未读取到数据。');}
  finally{refreshing=false;$('refresh').disabled=false;}
 }
 $('refresh').onclick=load;$('search').oninput=()=>{page=1;renderTable();};
 $('prev').onclick=()=>{page--;renderTable();};$('next').onclick=()=>{page++;renderTable();};
 setInterval(()=>{if(!document.hidden)load();},15000);load();
})();
