(() => {
 let roster=null,identity=null,timer,busy=false,requestNo=0;
 const $=id=>document.getElementById(id);
 function message(text){$('rosterMessage').textContent=text;}
 function setIdentity(member){
  identity={name:member.name,serial:member.serial,member_id:member.member_id,roster_version:roster.version};
  $('name').value=member.name;
  $('identityText').textContent=member.serial+'号 · '+member.name;
  $('identityVersion').textContent='名册 '+roster.version.slice(0,8)+' · 这是模拟身份选择';
  $('entryGate').hidden=true;$('identityBar').hidden=false;
  $('lesson').hidden=false;$('identityRefreshNote').textContent='';
  window.dispatchEvent(new CustomEvent('classical-identity',{detail:identity}));
  $('identityBar').scrollIntoView({behavior:'smooth',block:'start'});
 }
 function previewMember(){
  const serial=$('serial').value.trim();
  const found=roster?.members.find(m=>m.serial===serial);
  $('enter').disabled=!found||busy;
  $('memberPreview').textContent=found?'即将以 '+found.name+'（'+found.serial+'号）进入':serial?'这个序号不在当前名册中，请检查后重试。':'输入序号后，会显示对应的模拟姓名。';
  return found;
 }
 async function refresh(){
  if(busy)return;
  busy=true;const no=++requestNo;$('refreshRoster').disabled=true;$('enter').disabled=true;
  try{
   const data={roster:await QF.roster()};
   if(no!==requestNo)return;
   if(data.roster&&!Array.isArray(data.roster.members))throw Error('名单格式异常');
   const previous=roster?.version;roster=data.roster;
   $('rosterCount').textContent=roster?roster.members.length+' 位 · 名册 '+roster.version.slice(0,8):'尚未发布名册';
   message(roster?'名册已从QuickForm更新。例如输入序号 '+(roster.members[0]?.serial||'')+' 体验。':'请教师从大屏进入名册管理，先发布模拟名单。');
   if(identity&&identity.roster_version!==roster?.version){
    $('identityRefreshNote').textContent='教师已更新名册。本次作答仍关联进入时的旧名册，不会归到新名单；需要参加新一轮请切换身份。';
   }else if(!identity&&previous&&previous!==roster?.version)message('名册已更新，请重新确认当前序号对应的姓名。');
  }catch(e){
   if(!identity)roster=null;
   message('未能更新名册：'+e.message+'。请检查教师端连接后重试。');
  }finally{
   busy=false;$('refreshRoster').disabled=false;previewMember();
   clearTimeout(timer);timer=setTimeout(()=>{if(!document.hidden)refresh();},15000);
  }
 }
 $('serial').oninput=previewMember;
 $('entryForm').onsubmit=e=>{
  e.preventDefault();if(busy)return;
  const member=previewMember();if(member)setIdentity(member);
 };
 $('refreshRoster').onclick=refresh;
 $('switchIdentity').onclick=()=>{
  if(window.ClassicalQuiz?.isBusy())return;
  if(window.ClassicalQuiz?.hasAnswers()&&!window.confirm('切换身份会清空本页未提交的答案，已提交记录不受影响。继续吗？'))return;
  window.ClassicalQuiz?.reset();
  identity=null;$('lesson').hidden=true;$('identityBar').hidden=true;$('entryGate').hidden=false;$('serial').value='';refresh();
 };
 document.addEventListener('visibilitychange',()=>{clearTimeout(timer);if(!document.hidden)refresh();});
 window.ClassicalRoster={getIdentity:()=>identity,getRoster:()=>roster,refresh};
 refresh();
})();
