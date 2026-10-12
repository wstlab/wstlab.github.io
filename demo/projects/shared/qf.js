(() => {
 const base='https://qf.kjxs.site';
 const tasks={audio:'899xSEVKEHH',area:'6qzzwNKGDOU',classical:'dIOP6U6PcVF',classicalRoster:'g06toLheaUU'};
 async function request(url,options={}){
  const r=await fetch(url,{...options,signal:AbortSignal.timeout(options.method==='POST'?60000:15000),credentials:'omit'});
  const data=await r.json().catch(()=>null);
  if(!r.ok||!data||data.error||data.status==='error')throw Error(data?.error||'服务暂不可用（'+r.status+'）');
  return data;
 }
 window.QF={
  base,tasks,api:key=>base+'/api/'+tasks[key],records:key=>base+'/showcase/'+tasks[key],
  all:async key=>{const data=await request(base+'/api/'+tasks[key]+'/all');if(!Array.isArray(data.submissions))throw Error('任务返回的数据格式不匹配');return data.submissions;},
  roster:async()=>{const data=await request(base+'/api/'+tasks.classicalRoster+'/all',{cache:'no-store'});if(!Array.isArray(data.submissions))throw Error('QuickForm名册数据格式不匹配');return data.submissions.filter(r=>r.kind==='roster'&&Array.isArray(r.members)).at(-1)||null;},
  post:(key,data)=>request(base+'/api/'+tasks[key],{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)}),
  request,esc:s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),
  attachment:(key,p)=>window.QFDemo.attachment(p)||(typeof p==='string'&&p.startsWith('/static/uploads/'+tasks[key]+'/')&&!p.includes('..')?base+p:null)
 };
 document.querySelectorAll('[data-qf-records]').forEach(a=>a.href=QF.records(a.dataset.qfRecords));
})();
