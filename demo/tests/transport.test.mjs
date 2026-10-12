import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {webcrypto} from 'node:crypto';
const source=fs.readFileSync(new URL('../projects/shared/transport.js',import.meta.url),'utf8');
function harness(config={mode:'local'}){
  class Storage {data=new Map();getItem(k){return this.data.get(k)||null;}setItem(k,v){this.data.set(k,v);}}
  const calls=[],window={QF_CONFIG:config,fetch:async (...args)=>{calls.push(args);return new Response('{"success":true}');}};
  const context={window,Storage,localStorage:new Storage(),URL,Response,Request,FormData,File,URLSearchParams,crypto:webcrypto,
    location:{href:'https://example.test/QFDemo/projects/area/index.html',origin:'https://example.test'},
    document:{currentScript:{src:'https://example.test/QFDemo/projects/shared/transport.js'},addEventListener(){}},
    navigator:{},console};
  vm.runInNewContext(source,context);
  return {...context,calls};
}
test('local submissions persist and remain isolated by task without network writes',async()=>{
  const h=harness(),api='https://qf.kjxs.site/api/test';
  const r=await h.window.fetch(api,{method:'POST',body:JSON.stringify({score:80})});
  assert.equal((await r.json()).local,true);
  const data=await (await h.window.fetch(api+'/all')).json();
  assert.equal(data.submissions[0].score,80);
  assert.equal((await (await h.window.fetch(api+'2/all')).json()).count,0);
  assert.equal(h.calls.length,0);
});
test('legacy Storage overrides do not change data namespace',async()=>{
  const h=harness();
  h.Storage.prototype.getItem=()=>{throw Error('legacy namespace override');};
  await h.window.fetch('https://qf.kjxs.site/api/task',{method:'POST',body:'{"name":"demo"}'});
  assert.equal((await (await h.window.fetch('https://qf.kjxs.site/api/task/all')).json()).count,1);
});
test('remote mode requires explicit own-task mapping and omits cookies',async()=>{
  const h=harness({mode:'remote',apiBase:'https://own.example',taskMap:{old:'new'}});
  await assert.rejects(h.window.fetch('https://qf.kjxs.site/api/unmapped'),/尚未配置/);
  await h.window.fetch('https://qf.kjxs.site/api/old/all');
  assert.equal(h.calls[0][0],'https://own.example/api/new/all');
  assert.equal(h.calls[0][1].credentials,'omit');
});
test('local classical roster is synthetic and allows immediate entry',async()=>{
  const h=harness(),data=await (await h.window.fetch('https://qf.kjxs.site/api/g06toLheaUU/all')).json();
  assert.equal(data.submissions[0].members.length,10);
  assert.equal(data.submissions[0].members[0].name,'体验者01');
});
