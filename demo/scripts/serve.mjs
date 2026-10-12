import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {build} from './build.mjs';
const {out}=build(),port=Number(process.env.PORT||4173);
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.svg':'image/svg+xml','.jpg':'image/jpeg','.png':'image/png','.wav':'audio/wav'};
http.createServer((req,res)=>{
  let pathname;
  try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.writeHead(400).end();return;}
  // Also serve /QFDemo/ to verify GitHub project Pages without a separate server.
  pathname=pathname.replace(/^\/QFDemo(?=\/)/,'');
  const target=path.resolve(out,'.'+pathname+(pathname.endsWith('/')?'index.html':''));
  if(!target.startsWith(out+path.sep)){res.writeHead(403).end();return;}
  if(!fs.existsSync(target)||!fs.statSync(target).isFile()){res.writeHead(404).end('Not found');return;}
  res.writeHead(200,{'Content-Type':types[path.extname(target)]||'application/octet-stream','Cache-Control':'no-store'});
  fs.createReadStream(target).pipe(res);
}).listen(port,'127.0.0.1',()=>console.log(`QFDemo: http://localhost:${port}/QFDemo/`));
