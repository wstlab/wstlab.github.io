(() => {
 const $=id=>document.getElementById(id);
 let inputRows=[],version=null,baseVersion=null,loading=false,attempted=false;
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 async function refresh(){
  const response=await fetch((location.pathname.startsWith('/qf/')?'/qf':'')+'/api/'+CONFIG.task+'/all',{cache:'no-store'});
  if(!response.ok)throw Error('无法读取当前名册');
  const result=await response.json();
  const data={roster:result.submissions.filter(r=>r.kind==='roster'&&Array.isArray(r.members)).at(-1)||null};
  baseVersion=data.roster?.version||null;
  $('current').textContent=data.roster?data.roster.members.length+' 人 · 版本 '+data.roster.version.slice(0,8)+' · '+data.roster.published_at:'尚未发布名册';
 }
 function reset(){
  version=crypto.randomUUID();attempted=false;
  $('ack').checked=false;$('publish').disabled=true;
  inputRows=inputRows.map(r=>({...r,member_id:crypto.randomUUID()}));
 }
 function displayed(){
  const mode=document.querySelector('input[name=displayMode]:checked').value;
  return inputRows.map((r,i)=>({serial:r.serial,member_id:r.member_id,name:mode==='masked'?'读书人'+String(i+1).padStart(2,'0'):r.name}));
 }
 function preview(){
  reset();$('previewCard').hidden=!inputRows.length;
  $('previewTitle').textContent='待发布 '+inputRows.length+' 人';
  $('previewRows').innerHTML=displayed().map(r=>`<tr><td>${esc(r.serial)}</td><td>${esc(r.name)}</td></tr>`).join('');
  $('message').textContent='仅在本机预览，尚未上传。';
 }
 function controls(disabled){
  $('csvFile').disabled=disabled;$('sample').disabled=disabled;$('refreshCurrent').disabled=disabled;
  document.querySelectorAll('input[name=displayMode]').forEach(e=>e.disabled=disabled);
  $('ack').disabled=disabled;$('publish').disabled=disabled||!$('ack').checked||!inputRows.length;
 }
 $('csvFile').onchange=async()=>{
  const file=$('csvFile').files[0];if(!file)return;
  inputRows=[];preview();
  try{
   if(file.size>1024*1024)throw Error('CSV不能大于1MB');
   const bytes=await file.arrayBuffer();let text;
   try{text=new TextDecoder('utf-8',{fatal:true}).decode(bytes);}
   catch{text=new TextDecoder('gb18030',{fatal:true}).decode(bytes);}
   const parsed=RosterCSV.parseCSV(text);inputRows=parsed.members;
   $('ignored').textContent=parsed.ignored.length?'以下列不上传：'+parsed.ignored.join('、'):'仅上传序号、显示姓名和关联标识。';
   preview();
  }catch(e){$('message').textContent=e.message;}
 };
 $('sample').onclick=()=>{
  inputRows=Array.from({length:50},(_,i)=>({serial:String(i+1),name:'读书人'+String(i+1).padStart(2,'0')}));
  $('ignored').textContent='全部为新生成的模拟身份，不包含用户提供的真实名单。';
  $('csvFile').value='';preview();
 };
 $('template').onclick=()=>{
  const text='\uFEFF序号,姓名\r\n1,读书人01\r\n2,读书人02\r\n3,读书人03\r\n';
  const url=URL.createObjectURL(new Blob([text],{type:'text/csv;charset=utf-8'})),a=document.createElement('a');
  a.href=url;a.download='文言研读-模拟名册模板.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
 };
 document.querySelectorAll('input[name=displayMode]').forEach(e=>e.onchange=()=>{if(inputRows.length)preview();});
 $('ack').onchange=()=>{$('publish').disabled=!$('ack').checked||loading||!inputRows.length;};
 $('refreshCurrent').onclick=async()=>{try{await refresh();if(inputRows.length)preview();}catch(e){$('message').textContent=e.message;}};
 $('publish').onclick=async()=>{
  if(loading||!$('ack').checked||!inputRows.length)return;
  loading=true;controls(true);$('message').textContent='正在发布，请等待QuickForm回执…';
  try{
   attempted=true;
   const response=await fetch((location.pathname.startsWith('/qf/')?'/qf':'')+'/api/'+CONFIG.task,{
    method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json','X-Roster-CSRF':CONFIG.csrf},
    body:JSON.stringify({kind:'roster',version,base_version:baseVersion,members:displayed(),mode:document.querySelector('input[name=displayMode]:checked').value,public_ack:true}),
    signal:AbortSignal.timeout(15000)
   });
   const result=await response.json();
   if(!response.ok||result.error)throw Error(result.error||'发布失败');
   await refresh();
   $('message').textContent='名册已发布到QuickForm。返回应用点“刷新名册”，输入序号即可进入；大屏会自动更新。';
   inputRows=[];$('previewCard').hidden=true;
  }catch(e){$('message').textContent='尚未确认发布成功：'+e.message+'。请先刷新当前版本核对，再决定是否重试。';}
  finally{loading=false;controls(false);}
 };
 refresh().catch(e=>{$('message').textContent=e.message;});
})();
