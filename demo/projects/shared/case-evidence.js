(() => {
 document.addEventListener('DOMContentLoaded',()=>{
  if(!CASE.capture)return;
  const box=document.createElement('section');box.className='case-evidence';
  box.innerHTML=`<h2>${CaseFlow.escape(CASE.evidenceTitle||'保存本次探究')}</h2><p>${CaseFlow.escape(CASE.evidenceHint||'完成上方交互后，预览本次学习记录，再提交到 QuickForm。')}</p><label>演示称呼 <input id="evidence-alias" maxlength="30" value="探索者01"></label><textarea id="evidence-reflection" placeholder="写下本次发现或下一步改进（可选）" maxlength="2000"></textarea><button id="evidence-preview">预览学习记录</button> <button id="evidence-send">保存到 QuickForm</button><pre id="evidence-data" hidden></pre>`;
  document.querySelector('#case-connection').before(box);
  const capture=()=>{
   const fields={};
   for(const el of (CASE.id===59?[]:document.querySelectorAll('input,textarea,select'))){
    if(el.closest('.case-evidence')||el.type==='password'||el.type==='file'||el.type==='hidden')continue;
    if(['radio','checkbox'].includes(el.type)&&!el.checked)continue;
    const key=el.name||el.id;if(!key||/key|password|secret|token|phone|mobile|email|姓名|name|student|class/i.test(key))continue;
    if(el.value)fields[key]=el.value;
   }
   let state={};try{state=window.captureLesson?.()||{};}catch{}
   return CaseFlow.clean({alias:document.querySelector('#evidence-alias').value.trim()||'探索者',
    ...state,fields,reflection:document.querySelector('#evidence-reflection').value.trim()});
  };
  document.querySelector('#evidence-preview').onclick=()=>{const el=document.querySelector('#evidence-data');el.hidden=false;el.textContent=JSON.stringify(capture(),null,2);};
  document.querySelector('#evidence-send').onclick=async e=>{
   const data=capture();
   if(!Object.keys(data.fields).length&&Object.keys(data).length<=3&&!data.reflection){CaseFlow.notice('请先完成上方交互或填写学习发现。',true);return;}
   e.target.disabled=true;try{await CaseFlow.send(data);}catch{}finally{e.target.disabled=false;}
  };
 });
})();
