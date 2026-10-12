/* RFC-style quoted CSV parsing with no third-party dependency; raw CSV never leaves the browser. */
(function(scope){
 function parseCSV(text){
  text=text.replace(/^\uFEFF/,'');
  const rows=[];let row=[],field='',quoted=false,after=false;
  for(let i=0;i<text.length;i++){
   const ch=text[i];
   if(quoted){
    if(ch==='"'){if(text[i+1]==='"'){field+='"';i++;}else{quoted=false;after=true;}}else field+=ch;
   }else if(ch==='"'){
    if(field||after)throw Error('CSV引号格式不正确，请重新导出CSV');
    quoted=true;
   }else if(ch===','||ch==='\n'||ch==='\r'){
    row.push(field);field='';after=false;
    if(ch!==','){if(ch==='\r'&&text[i+1]==='\n')i++;if(row.some(s=>s.trim()))rows.push(row);row=[];}
   }else if(after){
    if(ch!==' '&&ch!=='\t')throw Error('CSV引号后存在多余字符');
   }else field+=ch;
  }
  if(quoted)throw Error('CSV中有未闭合的引号');
  row.push(field);if(row.some(s=>s.trim()))rows.push(row);
  if(rows.length<2)throw Error('CSV需要表头和至少一条名单');
  const headers=rows[0].map(s=>s.trim());
  const seq=headers.indexOf('序号'),name=headers.indexOf('姓名');
  if(seq<0||name<0||headers.filter(h=>h==='序号').length!==1||headers.filter(h=>h==='姓名').length!==1)throw Error('CSV须包含唯一的“序号”和“姓名”列');
  const seen=new Set(),members=rows.slice(1).map((cells,index)=>{
   if(cells.length!==headers.length)throw Error('第'+(index+2)+'行列数与表头不一致');
   const serial=cells[seq].trim(),value=cells[name].trim();
   if(!/^[0-9A-Za-z_-]{1,20}$/.test(serial))throw Error('第'+(index+2)+'行序号无效');
   if(seen.has(serial))throw Error('重复序号：'+serial);
   if(!value||value.length>40||/[\u0000-\u001f]/.test(value))throw Error('第'+(index+2)+'行姓名为空、过长或有非法字符');
   seen.add(serial);return {serial,name:value};
  });
  if(members.length>500)throw Error('单次最多导入500人');
  return {members,ignored:headers.filter((h,i)=>i!==seq&&i!==name)};
 }
 const api={parseCSV};
 if(typeof module!=='undefined'&&module.exports)module.exports=api;else scope.RosterCSV=api;
})(typeof window!=='undefined'?window:globalThis);
