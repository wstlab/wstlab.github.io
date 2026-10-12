import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {build} from './build.mjs';
const {out,projects}=build(),errors=[];
let htmlCount=0,scriptCount=0;
function walk(dir){
  for(const e of fs.readdirSync(dir,{withFileTypes:true})){
    const p=path.join(dir,e.name);
    if(e.isDirectory()){if(e.name!=='vendor')walk(p);continue;}
    if(!/\.(html|js)$/.test(p))continue;
    const text=fs.readFileSync(p,'utf8');
    if(p.endsWith('.html')){
      htmlCount++;
      if(!text.includes('transport.js'))errors.push(`${p}: missing adapter`);
      for(const m of text.matchAll(/(?:src|href)\s*=\s*["']([^"'<>]+)["']/gi)){
        const url=m[1];
        if(/^(?:[a-z]+:|\/\/|#|\$|\{)/i.test(url)||url.includes('${'))continue;
        const clean=decodeURIComponent(url.split(/[?#]/)[0]);
        if(!clean)continue;
        if(clean.startsWith('/')){errors.push(`${p}: absolute local URL ${url}`);continue;}
        const target=path.resolve(path.dirname(p),clean);
        if(!fs.existsSync(target))errors.push(`${path.relative(out,p)}: missing ${url}`);
      }
      for(const m of text.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)){
        if(/\bsrc=|type=["'](?:module|importmap|application\/)/i.test(m[1])||!m[2].trim())continue;
        try{new vm.Script(m[2]);scriptCount++;}catch(e){errors.push(`${path.relative(out,p)} inline: ${e.message}`);}
      }
    }else{
      try{new vm.Script(text);scriptCount++;}catch(e){errors.push(`${path.relative(out,p)}: ${e.message}`);}
    }
    if(/-----BEGIN (?:RSA |OPENSSH )?PRIVATE KEY-----|gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,}|sk-[A-Za-z0-9]{32,}/.test(text))errors.push(`${p}: possible credential`);
  }
}
walk(out);
if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}
else console.log(`OK: ${projects.length} manifests; ${htmlCount} HTML pages; ${scriptCount} scripts; local links and credential patterns`);
