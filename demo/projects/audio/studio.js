// Official QuickForm API. Original audio + student_name fields and evaluation records retained.
const TASK=QF.tasks.audio,BASE=QF.base;
const API=QF.api('audio'),RECORDS=QF.records('audio');
const $=id=>document.getElementById(id);
document.querySelectorAll('[data-record-link]').forEach(a=>a.href=RECORDS);
$('apiText').textContent=API;
let selected=null,previewURL=null,sending=false,loading=false;
const allowed=['mp3','wav','ogg','m4a','aac','flac','webm'];
function message(id,text,error=false){$(id).textContent=text;$(id).classList.toggle('error',error);}
function selectFile(file){
 if(!file)return;
 if(!allowed.includes(file.name.split('.').pop().toLowerCase()))return message('uploadStatus','请选择支持的音频文件。',true);
 if(file.size>10*1024*1024)return message('uploadStatus','文件超过 10MB，请压缩或裁剪后重试。',true);
 if(previewURL)URL.revokeObjectURL(previewURL);
 selected=file;previewURL=URL.createObjectURL(file);$('localAudio').src=previewURL;
 $('fileName').textContent=file.name+' · '+(file.size/1024).toFixed(1)+' KB';$('preview').hidden=false;
 $('receipt').hidden=true;
 $('phaseLocal').classList.add('done');$('phaseSend').classList.remove('done');$('phaseSaved').classList.remove('done');
 message('uploadStatus','已准备好音频。确认可以公开后，再点击上传。');
}
$('audioFile').addEventListener('change',()=>selectFile($('audioFile').files[0]));
$('clearFile').onclick=()=>{if(sending)return;if(previewURL)URL.revokeObjectURL(previewURL);selected=null;previewURL=null;$('audioFile').value='';$('localAudio').removeAttribute('src');$('preview').hidden=true;message('uploadStatus','已移除本机所选文件，不影响已提交记录。');};
for(const event of ['dragover','drop'])$('dropzone').addEventListener(event,e=>{e.preventDefault();if(event==='drop'){$('dropzone').classList.remove('dragover');if(!sending)selectFile(e.dataTransfer.files[0]);}else $('dropzone').classList.add('dragover');});
$('dropzone').addEventListener('dragleave',()=>$('dropzone').classList.remove('dragover'));
function syntheticAudio(){
 const sampleRate=16000,seconds=3,count=sampleRate*seconds,buffer=new ArrayBuffer(44+count*2),view=new DataView(buffer);
 const str=(o,s)=>{for(let i=0;i<s.length;i++)view.setUint8(o+i,s.charCodeAt(i));};
 str(0,'RIFF');view.setUint32(4,36+count*2,true);str(8,'WAVE');str(12,'fmt ');view.setUint32(16,16,true);view.setUint16(20,1,true);view.setUint16(22,1,true);view.setUint32(24,sampleRate,true);view.setUint32(28,sampleRate*2,true);view.setUint16(32,2,true);view.setUint16(34,16,true);str(36,'data');view.setUint32(40,count*2,true);
 for(let i=0;i<count;i++){const t=i/sampleRate,phase=t%1,f=[261.63,329.63,392][Math.floor(t)],envelope=Math.sin(Math.PI*phase)**2;view.setInt16(44+i*2,Math.sin(t*f*Math.PI*2)*envelope*6500,true);}
 return new File([buffer],'合成示例音-三音.wav',{type:'audio/wav'});
}
$('useSample').onclick=()=>{if(sending)return;selectFile(syntheticAudio());if(!$('nickname').value)$('nickname').value='声音探索者01';};
async function request(url,options={}){
 const response=await fetch(url,{...options,signal:AbortSignal.timeout(options.method==='POST'?60000:15000)});
 const data=await response.json().catch(()=>null);
 if(!response.ok||!data||data.error)throw new Error(data?.error||'请求失败（HTTP '+response.status+'）');
 return data;
}
function audioURL(value){
 const local=window.QFDemo.attachment(value);if(local)return local;
 if(typeof value!=='string'||!value.startsWith('/static/uploads/'+TASK+'/'))return null;
 const url=new URL(value,BASE);return url.origin===new URL(BASE).origin?url.href:null;
}
$('uploadForm').addEventListener('submit',async e=>{
 e.preventDefault();if(sending)return;
 const nickname=$('nickname').value.trim();if(!nickname||!selected)return message('uploadStatus','请填写虚构昵称，并选择一段音频。',true);
 const file=selected;const form=new FormData();const submissionId=crypto.randomUUID();form.append('submission_id',submissionId);
 form.append('student_name',nickname);form.append('audio',file);form.append('original_filename',file.name);form.append('demo','true');
 sending=true;['submitBtn','audioFile','useSample','nickname'].forEach(id=>$(id).disabled=true);
 message('uploadStatus','正在上传音频并等待 QuickForm 回执…');
 try{
  const data=await request(API,{method:'POST',body:form});
  const saved=audioURL(data.attachment);if(!saved)throw new Error(data.warning||'服务器未返回有效的音频附件地址');
  $('phaseSend').classList.add('done');$('phaseSaved').classList.add('done');
  $('receiptText').textContent=nickname+' · '+file.name+' · 记录标记：'+submissionId;
  $('attachmentLink').href=saved;$('receipt').hidden=false;
  message('uploadStatus','提交成功。音频已保存，可以到教师端核对记录。');
  await loadGallery();
 }catch(error){message('uploadStatus','尚未确认成功：'+error.message+'。文件仍保留；若超时，请先查看教师端记录再决定重试。',true);}
 finally{sending=false;['submitBtn','audioFile','useSample','nickname'].forEach(id=>$(id).disabled=false);}
});
const ownRatings={}; // Demo ratings are append-only, matching QuickForm submission semantics.
function el(tag,className,text){const n=document.createElement(tag);if(className)n.className=className;if(text!==undefined)n.textContent=text;return n;}
function render(data){
 const rows=Array.isArray(data.submissions)?data.submissions:[];
 const works=rows.filter(x=>x._type!=='evaluation'&&audioURL(x.attachment));
 const evaluations=rows.filter(x=>x._type==='evaluation'&&Number(x.star)>=1&&Number(x.star)<=5);
 $('workCount').textContent=works.length;$('gallery').replaceChildren();
 if(!works.length){const box=el('div','empty');box.append(el('b','','这里，等待第一段声音。'),el('span','','上传自有音频，或用合成示例音走通一次流程。'));$('gallery').append(box);return;}
 works.slice().reverse().forEach((work,index)=>{
  const ratings=evaluations.filter(r=>(r.work_attachment||r.submission_id)===work.attachment);
  const average=ratings.length?(ratings.reduce((a,r)=>a+Number(r.star),0)/ratings.length).toFixed(1):null;
  const card=el('article','work');card.append(el('div','work-number','SOUND / '+String(works.length-index).padStart(2,'0')),el('h3','',work.student_name||'匿名体验者'),el('div','filename',work.original_filename||'音频作品'));
  const audio=el('audio');audio.controls=true;audio.preload='metadata';audio.src=audioURL(work.attachment);card.append(audio);
  audio.addEventListener('error',()=>{if(!card.querySelector('.media-error'))card.append(el('p','media-error status error','该格式可能不受浏览器支持，可在教师端下载原音频。'));});
  card.append(el('div','timestamp',work.submitted_at||'刚刚提交'));
  const summary=el('p','rating-summary',average?'平均 '+average+' 星 · '+ratings.length+' 次评价':'还没有评价 · 试听后送出第一颗星');card.append(summary);
  const stars=el('div','stars'),status=el('div','rate-status',ownRatings[work.attachment]?'本次已评价 '+ownRatings[work.attachment]+' 星':'选择 1—5 星，评价将写入 QuickForm');
  for(let i=1;i<=5;i++){
   const b=el('button',i<=(ownRatings[work.attachment]||0)?'active':'','★');b.type='button';b.setAttribute('aria-label','为'+(work.student_name||'此作品')+'评'+i+'星');
   b.onclick=async()=>{
    if(ownRatings[work.attachment]){status.textContent='本次已评价。每次评价都是新提交，不会覆盖已有记录。';return;}
    stars.querySelectorAll('button').forEach(x=>x.disabled=true);status.textContent='正在发送评价…';
    const form=new FormData();form.append('_type','evaluation');form.append('star',String(i));form.append('work_attachment',work.attachment);form.append('submission_id',work.attachment);form.append('demo','true');
    try{await request(API,{method:'POST',body:form});ownRatings[work.attachment]=i;await loadGallery();}
    catch(e){status.textContent='未确认成功，请到教师端核对后再试：'+e.message;stars.querySelectorAll('button').forEach(x=>x.disabled=false);}
   };stars.append(b);
  }card.append(stars,status);$('gallery').append(card);
 });
}
async function loadGallery(){
 if(loading)return;loading=true;$('refresh').disabled=true;
 message('galleryStatus','正在从 QuickForm 读取作品与评价…');
 try{const data=await request(API+'/all');render(data);message('galleryStatus','已同步 · '+new Date().toLocaleTimeString()+' · '+(data.total_submissions||0)+' 条原始记录（包含作品与评价）');}
 catch(e){message('galleryStatus','暂时无法读取：'+e.message+'。可以点击刷新重试。',true);}
 finally{loading=false;$('refresh').disabled=false;}
}
$('refresh').onclick=loadGallery;
loadGallery();
