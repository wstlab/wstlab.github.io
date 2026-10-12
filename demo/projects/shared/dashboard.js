const key=document.body.dataset.case,$=id=>document.getElementById(id),esc=QF.esc;
const specs={
 audio:{title:'声音，在这里被听见',sub:'音频作品、星级评价与真实回收记录。',label:'SOUND GALLERY / LIVE DATA'},
 area:{title:'看见面积理解的起点',sub:'从三道选择题与开放回答，观察图形转化与面积概念。',label:'GEOMETRY / LEARNING OBSERVATORY'},
 classical:{title:'从一字之辨，看见学情',sub:'五道题的作答分布与错误诊断，回到每一种用法。',label:'CLASSICAL CHINESE / LEARNING RECORDS'}
};
const s=specs[key];$('title').textContent=s.title;$('subtitle').textContent=s.sub;$('eyebrow').textContent=s.label;
let records=[],filtered=[],page=0,busy=false,timer,failures=0;
const pageSize=12;
const questions=key==='area'?[
 ['q1','长方形面积计算','C'],['q2','图形转化与等积','C'],['q3','等底等高的面积','C']
]:[['q1','动词：到、往','B'],['q2','代词：学过的知识','A'],['q3','取消句子独立性','C'],['q4','宾语前置标志','B'],['q5','助词：的','C']];
const empty=text=>`<div class="empty"><strong>等待第一条记录</strong>${text}</div>`;
function metric(name,value,note){return `<div class="metric"><span>${name}</span><b>${esc(value)}</b><small>${note}</small></div>`;}
function bar(label,count,total,suffix=''){
 const pct=total?Math.round(count/total*100):0;
 return `<div class="bar-row"><div class="bar-label"><span>${esc(label)}</span><span>${count}${suffix} · ${pct}%</span></div><div class="track" role="meter" aria-label="${esc(label)}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}"><div class="fill" style="width:${pct}%"></div></div></div>`;
}
function scoredRows(){
 if(key==='classical'&&window.ClassicalParticipation)return ClassicalParticipation.selected();
 return records.filter(r=>key==='area'?r.totalScore===30&&typeof r.q1==='string':r.case_id==='classical'&&r.answers&&typeof r.answers==='object');
}
function renderAudio(){
 const works=records.filter(r=>r._type!=='evaluation'&&QF.attachment(key,r.attachment));
 const ratings=records.filter(r=>r._type==='evaluation'&&[1,2,3,4,5].includes(Number(r.star))&&works.some(w=>w.attachment===r.work_attachment));
 $('metrics').innerHTML=metric('声音作品',works.length,'已保存的音频附件')+metric('有效评价',ratings.length,'关联到当前作品的星级')+metric('平均星级',ratings.length?(ratings.reduce((n,r)=>n+Number(r.star),0)/ratings.length).toFixed(1):'—','每条有效评价等权')+metric('原始记录',records.length,'作品与评价分别记录');
 $('chartTitle').textContent='评价的声音';$('chartHint').textContent='只统计能关联到现有音频作品的有效星级。';
 $('chart').innerHTML=ratings.length?[5,4,3,2,1].map(v=>bar(v+' 星',ratings.filter(r=>Number(r.star)===v).length,ratings.length,' 次')).join(''):empty('试听作品并留下星级评价后，这里会出现分布。');
 $('secondaryTitle').textContent='这次回收了什么';$('secondaryHint').textContent='同一个QuickForm任务承载作品与评价，两类数据通过附件地址关联。';
 $('secondary').innerHTML=`<div class="text-record"><strong>音频作品</strong><p>演示昵称、原始文件名、音频附件路径。</p></div><div class="text-record"><strong>星级评价</strong><p>作品关联、1—5星评价。</p></div><a class="button" href="${QF.records(key)}" target="_blank" rel="noopener">查看 QuickForm 原始记录 ↗</a>`;
 $('extras').innerHTML=`<div class="panel"><h2>声音展厅</h2><p class="hint">此处作品来自QuickForm，没有在浏览器里伪造音频或评分。</p><div class="works">${works.length?works.slice().reverse().map(w=>{
 const rs=ratings.filter(r=>r.work_attachment===w.attachment);
 return `<article class="work"><h3>${esc(w.original_filename||'音频作品')}</h3><p>${esc(w.student_name||'演示访客')}</p><audio controls preload="metadata" src="${esc(QF.attachment(key,w.attachment))}"></audio><div class="rating">${rs.length?(rs.reduce((n,r)=>n+Number(r.star),0)/rs.length).toFixed(1)+' / 5 · '+rs.length+' 次评价':'还没有评价'}</div></article>`;
 }).join(''):empty('到应用页上传自有音频，或使用合成示例音。')}</div></div>`;
}
function renderQuiz(){
 const rows=scoredRows(),max=key==='area'?30:100;
 const sum=rows.reduce((n,r)=>n+Number(r.score||0),0),pass=rows.filter(r=>Number(r.score)>=max*.6).length;
 $('metrics').innerHTML=metric('统计样本',rows.length,key==='classical'&&window.ClassicalParticipation?ClassicalParticipation.description():'按提交次数统计，非独立人数')+metric('平均分',rows.length?(sum/rows.length).toFixed(1):'—','客观题满分 '+max+' 分')+metric('达标率',rows.length?Math.round(pass/rows.length*100)+'%':'—','达到总分的 60%')+metric(key==='area'?'开放回答':'全部答对',key==='area'?rows.filter(r=>r.q4_open?.trim()).length:rows.filter(r=>Number(r.score)===100).length,key==='area'?'开放题不计分':'五道题全部正确的记录');
 $('chartTitle').textContent=key==='area'?'三个概念，理解到哪一步？':'逐题用法辨析';
 $('chartHint').textContent=key==='classical'&&window.ClassicalParticipation?ClassicalParticipation.description()+'；各题以当前统计样本为分母。':'以每条作答记录为分母，漏答计为未正确作答。';
 $('chart').innerHTML=rows.length?questions.map(([id,label,answer])=>bar(label,rows.filter(r=>(key==='area'?r[id]:r.answers[id])===answer).length,rows.length,' 条正确')).join(''):empty('提交后将展示真实逐题正确率。');
 $('secondaryTitle').textContent='得分分布';$('secondaryHint').textContent='按客观题总分统计，不使用历史班级排名。';
 const bins=key==='area'?[0,10,20,30]:[0,20,40,60,80,100];
 $('secondary').innerHTML=rows.length?bins.map(v=>bar(v+' 分',rows.filter(r=>Number(r.score)===v).length,rows.length,' 条')).join(''):empty('暂无作答，分布图保持空白。');
 if(key==='area'){
  const open=rows.filter(r=>r.q4_open?.trim()).slice(-12).reverse();
  $('extras').innerHTML=`<div class="panel"><h2>开放回答 · 思考的痕迹</h2><p class="hint">展示最近12条开放回答，全部内容可在QuickForm记录中查看。</p>${open.length?open.map(r=>`<div class="text-record"><strong>${esc(r.studentId)}</strong><p>${esc(r.q4_open)}</p><small>${esc(r.submitted_at||r.submitTime)}</small></div>`).join(''):empty('等待关于面积的第一条想法。')}</div>`;
 }else{
  $('extras').innerHTML='<div class="panel"><h2>从错误回到原句</h2><p class="hint">错项数量来自实际提交；音节助词保留在应用讲解中，原五道题未独立测评它，不虚构第六项掌握率。</p>'+questions.map(([id,label,correct],i)=>{
   const wrong=rows.filter(r=>r.answers[id]!==correct);
   const counts=['A','B','C','D'].filter(v=>v!==correct).map(v=>`${v}：${wrong.filter(r=>r.answers[id]===v).length}条`).join('　');
   return `<div class="text-record"><strong>第${i+1}题 · ${esc(label)}</strong><p>正确项 ${correct}　｜　${wrong.length} 条错误或漏答</p><small>${counts}</small></div>`;
  }).join('')+'</div>';
 }
}
function renderTable(){
 const query=$('recordSearch').value.trim().toLowerCase();
 filtered=(key==='classical'&&window.ClassicalParticipation?ClassicalParticipation.selected():records).filter(r=>JSON.stringify(r).toLowerCase().includes(query)).slice().reverse();
 const pages=Math.max(1,Math.ceil(filtered.length/pageSize));page=Math.min(page,pages-1);
 $('rows').innerHTML=filtered.slice(page*pageSize,(page+1)*pageSize).map(r=>`<tr><td>${r.serial?esc(r.serial)+'号 · ':''}${esc(r.student_name||r.studentId||r.name||'演示访客')}</td><td>${esc(key==='audio'?(r._type==='evaluation'?'星级评价':'声音作品'):(r.score??'—')+' 分')}</td><td>${esc(r.submission_id||'—')}</td><td>${esc(r.submitted_at||r.submitTime||'—')}</td></tr>`).join('')||'<tr><td colspan="4">暂无匹配记录</td></tr>';
 $('pageText').textContent=`${page+1} / ${pages} · ${filtered.length} 条`;$('previous').disabled=page===0;$('next').disabled=page>=pages-1;
}
async function refresh(){
 if(busy||document.hidden)return;
 busy=true;$('refresh').disabled=true;
 try{
  if(key==='classical'&&window.ClassicalParticipation){
   const [rows]=await Promise.all([QF.all(key),ClassicalParticipation.load()]);
   records=rows;ClassicalParticipation.update(records);
  }else records=await QF.all(key);
  failures=0;
  if(key==='audio')renderAudio();else renderQuiz();
  renderTable();
  $('status').classList.remove('error');$('status').textContent='已连接 QuickForm · '+new Date().toLocaleTimeString()+' 更新 · 全部 '+records.length+' 条记录 · 每15秒刷新';
 }catch(e){failures++;$('status').classList.add('error');$('status').textContent='连接未成功：'+e.message+'。已有画面保留；请检查教师端连接后重试。';}
 finally{busy=false;$('refresh').disabled=false;clearTimeout(timer);timer=setTimeout(refresh,Math.min(60000,15000*(failures+1)));}
}
$('refresh').onclick=refresh;$('recordSearch').oninput=()=>{page=0;renderTable();};
$('previous').onclick=()=>{page--;renderTable();};$('next').onclick=()=>{page++;renderTable();};
document.addEventListener('visibilitychange',()=>{clearTimeout(timer);if(!document.hidden)refresh();});
window.addEventListener('classical-stats-mode',()=>{renderQuiz();page=0;renderTable();});
if(key==='audio')renderAudio();else renderQuiz();renderTable();refresh();
