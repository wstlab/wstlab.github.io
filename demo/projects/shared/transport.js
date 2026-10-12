/* Local-first QuickForm compatibility adapter. Loaded before legacy lesson code. */
(() => {
  'use strict';
  const config=window.QF_CONFIG||{mode:'local'}, remote=config.mode==='remote';
  const nativeFetch=window.fetch.bind(window), nativeGet=Storage.prototype.getItem, nativeSet=Storage.prototype.setItem;
  const scriptURL=new URL(document.currentScript.src),siteRoot=new URL('../../',scriptURL);
  const namespace='qfdemo:'+siteRoot.pathname+':', blobURLs=new Map();
  const isApi=u=>/\/api\/(?:submit\/)?[^/]+/.test(u.pathname)&&
    (/qf\.kjxs\.site|quickform|qf\.zmrobo|wzkjgz|192\.168|127\.0/.test(u.hostname)||u.origin===location.origin);
  const taskOf=u=>u.pathname.match(/\/api\/(?:submit\/)?([^/]+)/)?.[1];
  const key=task=>namespace+task;
  const read=task=>JSON.parse(nativeGet.call(localStorage,key(task))||'[]');
  function database(){
    return new Promise((resolve,reject)=>{
      const r=indexedDB.open(namespace+'files',1);
      r.onupgradeneeded=()=>r.result.createObjectStore('files');
      r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);
    });
  }
  async function saveFile(id,file){
    const db=await database();
    await new Promise((resolve,reject)=>{
      const tx=db.transaction('files','readwrite');tx.objectStore('files').put(file,id);
      tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);
    });db.close();blobURLs.set(id,URL.createObjectURL(file));
  }
  async function loadFiles(rows){
    const ids=rows.flatMap(r=>[r.attachment||[]].flat()).filter(id=>typeof id==='string'&&!blobURLs.has(id));
    if(!ids.length)return;
    const db=await database();
    await Promise.all(ids.map(id=>new Promise(resolve=>{
      const r=db.transaction('files').objectStore('files').get(id);
      r.onsuccess=()=>{if(r.result)blobURLs.set(id,URL.createObjectURL(r.result));resolve();};r.onerror=resolve;
    })));db.close();
  }
  const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json'}});
  window.fetch=async(input,options={})=>{
    const u=new URL(typeof input==='string'?input:input instanceof URL?input.href:input.url,location.href);
    if(!isApi(u))return nativeFetch(input,options);
    const task=taskOf(u),method=(options.method||input.method||'GET').toUpperCase();
    if(remote){
      const mapped=config.taskMap?.[task];
      if(!mapped)throw Error('此项目尚未配置自己的 QuickForm 任务：'+task);
      const suffix=u.pathname.endsWith('/all')?'/all':u.pathname.endsWith('/count')?'/count':'';
      return nativeFetch(config.apiBase.replace(/\/$/,'')+'/api/'+encodeURIComponent(mapped)+suffix,{...options,method,credentials:'omit'});
    }
    if(method==='GET'){
      let rows=read(task);
      if(task==='g06toLheaUU'&&!rows.length)rows=[{kind:'roster',version:'demo-001',members:Array.from({length:10},(_,i)=>({serial:String(i+1),name:'体验者'+String(i+1).padStart(2,'0'),member_id:'demo-'+(i+1)}))}];
      await loadFiles(rows);
      return json({status:'success',success:true,submissions:rows,count:rows.length});
    }
    if(method!=='POST')return json({error:'本地演示仅支持读取和提交'},405);
    let data=options.body;
    if(data===undefined&&input instanceof Request)data=await input.clone().text();
    let record={},files=[];
    if(data instanceof FormData){
      for(const [k,v] of data.entries()){if(v instanceof File&&v.size)files.push(v);else record[k]=v;}
    }else if(typeof data==='string')record=JSON.parse(data);
    else if(data instanceof URLSearchParams)record=Object.fromEntries(data);
    else record=data||{};
    const id=crypto.randomUUID(),attachments=[];
    for(const file of files){
      if(file.size>10*1024*1024)throw Error('本地演示附件最大 10MB');
      const attachment='/static/uploads/'+task+'/'+id+'-'+attachments.length+'.'+(file.name.split('.').pop()||'bin');
      await saveFile(attachment,file);attachments.push(attachment);
    }
    record={...record,submitted_at:new Date().toISOString()};
    if(!record.submission_id)record.submission_id=id;
    if(attachments.length)record.attachment=attachments.length===1?attachments[0]:attachments;
    const rows=read(task);rows.push(record);
    nativeSet.call(localStorage,key(task),JSON.stringify(rows));
    return json({status:'success',success:true,submission_id:record.submission_id,attachment:record.attachment,local:true});
  };
  // Some original lessons submit on page exit. Keep those requests within the same adapter.
  const beacon=navigator.sendBeacon?.bind(navigator);
  if(beacon)navigator.sendBeacon=(url,data)=>{
    if(isApi(new URL(url,location.href))){window.fetch(url,{method:'POST',body:data}).catch(console.error);return true;}
    return beacon(url,data);
  };
  window.QFDemo={mode:remote?'remote':'local',attachment:id=>{
    if(remote&&typeof id==='string'&&id.startsWith('/static/uploads/')&&!id.includes('..'))return config.apiBase.replace(/\/$/,'')+id;
    return blobURLs.get(id)||null;
  }};
  document.addEventListener('DOMContentLoaded',()=>{
    const banner=document.createElement('div');
    banner.setAttribute('role','status');
    banner.style.cssText='position:relative;z-index:9999;padding:9px 16px;background:#16334a;color:white;font:13px/1.6 system-ui;text-align:center;flex-shrink:0';
    banner.textContent=remote?'已接入自有 QuickForm 服务':'本地演示模式：记录与附件仅保存在当前浏览器；页面中的“服务器 / QuickForm 回执”在此模式指本地保存。跨设备收集需配置自有服务。';
    document.body.prepend(banner);
    // Legacy teacher links are meaningful only with an explicitly configured server.
    function links(){
      for(const a of document.querySelectorAll('a[href*="qf.kjxs.site"]')){
        const u=new URL(a.href);
        if(remote){
          const task=u.pathname.split('/')[2],mapped=config.taskMap?.[task];
          a.href=config.apiBase.replace(/\/$/,'')+(mapped?'/showcase/'+encodeURIComponent(mapped):'/showcase');
        }else{
          a.href=location.pathname.includes('/projects/')?'dashboard.html':new URL('index.html',siteRoot).href;
          a.title='本地演示：查看当前浏览器的数据大屏';
        }
      }
    }
    links();new MutationObserver(links).observe(document.body,{childList:true,subtree:true});
  });
})();
