const form=document.getElementById('quiz'),statusEl=document.getElementById('status'),submit=document.getElementById('submit');
let busy=false,done=false;
let started=Date.now(),submissionId=crypto.randomUUID();
window.ClassicalQuiz={
 isBusy:()=>busy,
 hasAnswers:()=>!done&&!!form.querySelector('input[type=radio]:checked'),
 reset(){
  form.reset();done=false;busy=false;started=Date.now();submissionId=crypto.randomUUID();
  for(const el of form.querySelectorAll('input'))el.disabled=false;
  document.getElementById('result').hidden=true;
  statusEl.textContent='';submit.disabled=false;submit.textContent='提交作答，查看解析 ↗';
 }
};
window.addEventListener('classical-identity',()=>{started=Date.now();submissionId=crypto.randomUUID();});
form.addEventListener('submit',async event=>{
 event.preventDefault();if(busy||done)return;
 const identity=window.ClassicalRoster?.getIdentity();
 if(!identity){statusEl.textContent='请先用名册中的序号选择身份。';return;}
 const data=new FormData(form),name=identity.name;
 const answers={},wrongQuestions=[];
 let score=0;
 for(const q of window.CLASSICAL_QUESTIONS){
  const selected=String(data.get(q.id)||'');answers[q.id]=selected;
  if(selected===q.answer)score+=20;
  else wrongQuestions.push({question:q.title+'\n'+q.options.join('\n'),yourAnswer:selected||'未作答',correctAnswer:q.answer});
 }
 const payload={case_id:'classical',...identity,name,answers,score,wrongQuestions,submission_id:submissionId,elapsed_seconds:Math.round((Date.now()-started)/1000),demo:true};
 busy=true;submit.disabled=true;document.getElementById('switchIdentity').disabled=true;statusEl.textContent='正在提交到QuickForm…';
 try{
  await QF.post('classical',payload);
  done=true;
  for(const el of form.querySelectorAll('input'))el.disabled=true;
  document.getElementById('score').textContent=score;
  document.getElementById('answerList').innerHTML=CLASSICAL_QUESTIONS.map(q=>`<div class="answer"><strong>${QF.esc(q.title)}</strong><p>你的答案 ${QF.esc(answers[q.id])} · 正确答案 ${q.answer} · ${answers[q.id]===q.answer?'正确':'需要再辨析'}</p><p>${QF.esc(q.explanation)}</p></div>`).join('');
  document.getElementById('result').hidden=false;
  statusEl.textContent='QuickForm已确认接收。\n记录标记：'+submissionId;
  submit.textContent='已提交到 QuickForm';
  document.getElementById('result').scrollIntoView({behavior:'smooth',block:'start'});
 }catch(error){statusEl.textContent='尚未确认成功：'+error.message+'。答案已保留；超时后请先查看QuickForm记录，避免重复提交。';}
 finally{busy=false;submit.disabled=done;document.getElementById('switchIdentity').disabled=false;}
});
