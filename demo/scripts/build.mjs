import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
export const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
export function build() {
  const out=path.join(root,'dist');
  fs.mkdirSync(out,{recursive:true});
  // dist is the only generated directory; never delete source trees.
  for(const name of fs.readdirSync(out))fs.rmSync(path.join(out,name),{recursive:true,force:true});
  const configFile=path.join(root,'config.local.json');
  const config=JSON.parse(fs.readFileSync(fs.existsSync(configFile)?configFile:path.join(root,'config.example.json')));
  if(!['local','remote'].includes(config.mode))throw Error('mode must be local or remote');
  if(config.mode==='remote'&&!/^https:\/\//.test(config.apiBase))throw Error('remote apiBase must use HTTPS');
  const categories=JSON.parse(fs.readFileSync(path.join(root,'site/categories.json')));
  const projects=fs.readdirSync(path.join(root,'projects'),{withFileTypes:true}).filter(e=>e.isDirectory()&&e.name!=='shared').map(e=>{
    const p=JSON.parse(fs.readFileSync(path.join(root,'projects',e.name,'project.json')));
    if(p.id!==e.name||!categories.some(c=>c.id===p.category))throw Error('Invalid manifest: '+e.name);
    for(const entry of [p.app,p.dashboard]){
      if(!entry||entry.includes('..')||path.isAbsolute(entry)||!fs.existsSync(path.join(root,'projects',e.name,entry)))throw Error('Missing/unsafe entry: '+e.name+'/'+entry);
    }
    return {caseKey:p.id,n:p.title,c:p.category,d:p.description,cardDescription:p.description,subjects:p.subjects,order:p.order,ready:true,appEntry:p.app,dashboardEntry:p.dashboard};
  }).sort((a,b)=>a.order-b.order);
  fs.cpSync(path.join(root,'site'),out,{recursive:true,filter:p=>!p.endsWith('.json')});
  fs.cpSync(path.join(root,'projects'),path.join(out,'projects'),{recursive:true,filter:p=>!p.endsWith('project.json')&&!p.endsWith('README.md')});
  fs.writeFileSync(path.join(out,'projects.js'),'window.__PROJECTS__ = '+JSON.stringify({categories,projects})+';\n');
  fs.writeFileSync(path.join(out,'config.js'),'window.QF_CONFIG = '+JSON.stringify(config)+';\n');
  fs.writeFileSync(path.join(out,'.nojekyll'),'');
  function rewrite(dir){
    for(const e of fs.readdirSync(dir,{withFileTypes:true})){
      const p=path.join(dir,e.name);if(e.isDirectory()){if(e.name!=='vendor')rewrite(p);continue;}
      if(!/\.(html|js|css)$/.test(p))continue;
      // Resolve site-owned absolute paths relative to the containing page.
      // Shared JS runs inside a project page, one level below /projects.
      const baseDir=p.endsWith('.js')&&dir===path.join(out,'projects/shared')?path.join(out,'projects/_page'):dir;
      const rel=target=>path.relative(baseDir,path.join(out,target)).split(path.sep).join('/')||'./';
      let text=fs.readFileSync(p,'utf8');
      text=text.replace(/(["'`(=])\/(projects\/[^"'`\s<>)]*|config\.js|index\.html)/g,(_,quote,target)=>quote+rel(target));
      fs.writeFileSync(p,text);
    }
  }
  rewrite(out);
  console.log(`Built ${projects.length} projects → dist`);
  return {out,projects};
}
if(process.argv[1]===fileURLToPath(import.meta.url))build();
