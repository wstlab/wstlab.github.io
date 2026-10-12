/* Shared transport only. Lesson questions, rules and state remain in each lesson. */
(() => {
 'use strict';
 const c=window.CASE, nativeFetch=window.fetch.bind(window);
 if(!c)return;
 const base='https://qf.kjxs.site', started=Date.now();
 const escape=s=>String(s??'').replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
 let status,latest,pending=false;
 const privateKey=/password|passwd|secret|token|api.?key|phone|mobile|email|身份证|电话|手机|单位|职务/i;
 function clean(v,depth=0){
  if(depth>9)return null;
  if(Array.isArray(v))return v.slice(0,1000).map(x=>clean(x,depth+1));
  if(v&&typeof v==='object')return Object.fromEntries(Object.entries(v).filter(([k])=>!privateKey.test(k)&&!k.startsWith('_')).map(([k,x])=>[k,clean(x,depth+1)]));
  return typeof v==='string'?v.slice(0,16000):v;
 }
 function notice(text,error=false){if(status){status.textContent=text;status.classList.toggle('error',error);}}
 async function send(payload,task=c.tasks.records){
  if(pending)throw Error('正在提交，请稍候');
  pending=true;notice('正在发送到 QuickForm…');
  try{
   const id=crypto.randomUUID();
   let body,headers={};
   if(payload instanceof FormData){
    body=new FormData();
    for(const [k,v] of payload.entries())if(!privateKey.test(k))body.append(k,v);
    body.set('case_id',c.key);body.set('submission_id',id);body.set('demo','true');
    body.set('lesson',c.lesson||'应用展示');
   }else{
    const data=clean(payload||{});
    body=JSON.stringify({...data,case_id:c.key,lesson:c.lesson||'应用展示',submission_id:id,demo:true,elapsed_seconds:Math.round((Date.now()-started)/1000)});
    headers={'Content-Type':'application/json'};
   }
   const r=await nativeFetch(base+'/api/'+task,{method:'POST',headers,body,credentials:'omit',signal:AbortSignal.timeout(60000)});
   const result=await r.clone().json().catch(()=>({}));
   if(!r.ok||result.error||result.status==='error')throw Error(result.error||'提交失败（'+r.status+'）');
   if(result.warning)throw Error('记录已保存，但附件未完整保存：'+result.warning);
   if(payload instanceof FormData && [...payload.values()].some(v=>v instanceof File&&v.size) && !result.attachment)throw Error('记录已保存，但未收到附件回执');
   latest=id;notice('QuickForm 已收到 · '+id.slice(0,8));
   return new Response(JSON.stringify({...result,success:true,status:'success',code:200}),{status:r.status,headers:{'Content-Type':'application/json'}});
  }catch(e){notice(e.message+'；尚未确认保存，请重试。',true);throw e;}
  finally{pending=false;}
 }
 async function all(task=c.tasks.records){
  const r=await nativeFetch(base+'/api/'+task+'/all',{cache:'no-store',signal:AbortSignal.timeout(15000)});
  if(!r.ok)throw Error('读取失败（'+r.status+'）');
  const data=await r.json();
  if(!Array.isArray(data.submissions))throw Error('QuickForm 数据格式不匹配');
  return data.submissions;
 }
 // Legacy lessons use several original API spellings. All route to explicit new task IDs.
 window.fetch=async(input,options={})=>{
  const raw=typeof input==='string'?input:input instanceof URL?input.href:input.url;
  let u;try{u=new URL(raw,location.href);}catch{return nativeFetch(input,options);}
  if(/\/api\//.test(u.pathname)&&(/quickform|qf\.zmrobo|wzkjgz|192\.168|127\.0/.test(u.host)||u.pathname.startsWith('/qf/api/')||u.origin===base)){
   const match=u.pathname.match(/\/api\/(?:submit\/)?([^/]+)/);
   const task=c.mapping?.[match?.[1]]||Object.values(c.tasks).find(x=>x===match?.[1]);
   if(!task)throw Error('此旧任务未配置，已阻止连接旧服务');
   const method=(options.method||input.method||'GET').toUpperCase();
   if(method==='POST'){
    let data=options.body;
    if(typeof data==='string')data=JSON.parse(data);
    if(data instanceof URLSearchParams)data=Object.fromEntries(data);
    return send(data,task);
   }
   const suffix=u.pathname.endsWith('/count')?'/count':'/all';
   const r=await nativeFetch(base+'/api/'+task+suffix,{...options,method:'GET',cache:'no-store',credentials:'omit'});
   if(!r.ok)throw Error('QuickForm 读取失败（'+r.status+'）');
   return r;
  }
  return nativeFetch(input,options);
 };
 window.CaseFlow={send,all,escape,clean,notice,config:c,get receipt(){return latest;}};
 // Namespace old draft caches so previous personal names/results cannot enter the demo.
 const get=Storage.prototype.getItem,set=Storage.prototype.setItem,remove=Storage.prototype.removeItem;
 Storage.prototype.getItem=function(k){return get.call(this,'qf2026:'+c.key+':'+k);};
 Storage.prototype.setItem=function(k,v){return set.call(this,'qf2026:'+c.key+':'+k,v);};
 Storage.prototype.removeItem=function(k){return remove.call(this,'qf2026:'+c.key+':'+k);};
 document.addEventListener('DOMContentLoaded',()=>{
  if(getComputedStyle(document.body).display==='flex'){
   document.body.style.flexDirection='column';
   document.body.style.alignItems='stretch';
  }
  document.documentElement.style.setProperty('--case-accent',c.accent||'#236d84');
  const bar=document.createElement('header');bar.id='case-nav';
  bar.innerHTML=`<a href="/index.html">Q / QuickForm作品集</a><nav><a href="index.html">应用展示</a><a href="dashboard.html">数据大屏 ↗</a><a href="https://qf.kjxs.site/showcase/${c.tasks.records}" target="_blank" rel="noopener">QuickForm记录 ↗</a></nav>`;
  document.body.prepend(bar);
  const footer=document.createElement('aside');footer.id='case-connection';
  footer.innerHTML='<span>公开教学演示 · 请使用化名，不填写个人联系方式。</span><strong role="status">数据连接：QuickForm</strong>';
  document.body.append(footer);status=footer.querySelector('strong');
  if(c.pages?.length>1){
   const nav=document.createElement('nav');nav.id='case-lessons';
   nav.innerHTML=c.pages.map(p=>`<a href="${escape(p.file)}">${escape(p.title)}</a>`).join('');bar.after(nav);
  }
  // Classic HTML form POST must not navigate away into raw API JSON.
  for(const form of document.querySelectorAll('form[action*="/api/"]')){
   form.addEventListener('submit',async e=>{e.preventDefault();if(!form.reportValidity())return;
    const b=form.querySelector('[type=submit]');if(b)b.disabled=true;
    try{await send(Object.fromEntries(new FormData(form)));}catch{}finally{if(b)b.disabled=false;}
   });
  }
 });
})();
