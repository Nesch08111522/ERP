const base = 'http://127.0.0.1:9222';
const fs = require('node:fs');
const output = [];
const originalLog = console.log;
console.log = (...args) => { output.push(args.join(' ')); originalLog(...args); };
(async () => {
 const tab = await fetch(base + '/json/new?about:blank', {method:'PUT'}).then(r=>r.json());
 const ws = new WebSocket(tab.webSocketDebuggerUrl);
 await new Promise(r=>ws.addEventListener('open',r));
 let id=0; const waiting=new Map(); const errors=[]; const writes=[];
 ws.addEventListener('message', e=>{
  const m=JSON.parse(e.data);
  if(m.id){waiting.get(m.id)?.(m);waiting.delete(m.id);return;}
  if(m.method==='Runtime.exceptionThrown'||m.method==='Log.entryAdded'&&m.params.entry.level==='error'||m.method==='Runtime.consoleAPICalled'&&m.params.type==='error') errors.push(m.params);
  if(m.method==='Fetch.requestPaused') {
   const p=m.params; const write=!['GET','HEAD','OPTIONS'].includes(p.request.method);
   if(write) writes.push({method:p.request.method,url:p.request.url});
   void call(write?'Fetch.failRequest':'Fetch.continueRequest',write?{requestId:p.requestId,errorReason:'BlockedByClient'}:{requestId:p.requestId});
  }
 });
 const call=(method,params={})=>new Promise((resolve,reject)=>{const n=++id;const timer=setTimeout(()=>{waiting.delete(n);reject(new Error('CDP timeout '+method))},15000);waiting.set(n,m=>{clearTimeout(timer);m.error?reject(new Error(JSON.stringify(m.error))):resolve(m.result)});ws.send(JSON.stringify({id:n,method,params}))});
 const evaluate=async expression=>{const r=await call('Runtime.evaluate',{expression,returnByValue:true});if(r.exceptionDetails)throw new Error(r.exceptionDetails.text);return r.result?.value};
 const sleep=ms=>new Promise(r=>setTimeout(r,ms));
 await call('Runtime.enable'); await call('Log.enable'); await call('Page.enable');await call('Fetch.enable',{patterns:[{urlPattern:'*'}]});
 await call('Page.addScriptToEvaluateOnNewDocument',{source:`window.__gpu={draws:0,sample:null};
 for(const name of ['drawElements','drawArrays']){const original=WebGL2RenderingContext.prototype[name];WebGL2RenderingContext.prototype[name]=function(...args){const result=original.apply(this,args);window.__gpu.draws++;if(window.__sample && this.getParameter(this.FRAMEBUFFER_BINDING) === null){window.__sample=false;const p=new Uint8Array(this.drawingBufferWidth*this.drawingBufferHeight*4);this.readPixels(0,0,this.drawingBufferWidth,this.drawingBufferHeight,this.RGBA,this.UNSIGNED_BYTE,p);let alpha=0;for(let i=3;i<p.length;i+=4)if(p[i])alpha++;window.__gpu.sample={alpha,width:this.drawingBufferWidth,height:this.drawingBufferHeight,lost:this.isContextLost()};}return result;};}`});
 const browserWindow = await call('Browser.getWindowForTarget');
 await call('Browser.setWindowBounds', {windowId:browserWindow.windowId,bounds:{windowState:'normal'}});
 await call('Page.bringToFront');
 await call('Emulation.setFocusEmulationEnabled',{enabled:true});
 const snapshot=`({path:location.pathname,h1:document.querySelectorAll('h1').length,canvas:document.querySelectorAll('canvas').length,overflow:document.documentElement.scrollWidth>innerWidth,accent:getComputedStyle(document.documentElement).getPropertyValue('--accent').trim(),theme:document.documentElement.dataset.tema,hidden:document.hidden,gpu:window.__gpu,apiHosts:[...new Set(performance.getEntriesByType('resource').filter(x=>x.name.includes('/api/v1/public/')).map(x=>new URL(x.name).host))]})`;
 for(const origin of ['http://localhost:4201','http://192.168.100.11:4201']){
  await call('Page.navigate',{url:origin+'/'});await sleep(6500);
  await evaluate('window.__sample=true');await sleep(500);
  console.log('ORIGIN',origin,JSON.stringify(await evaluate(snapshot)));
 }
 for(const [width,height] of [[1440,900],[768,1024],[390,844]]){
  await call('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<700});
  for(const section of ['producto','marca','ensamblaje','catalogo','aplicaciones','servicios','confianza','sedes','contacto','footer']){
   await evaluate(`document.getElementById('${section}')?.scrollIntoView({behavior:'instant'});window.__sample=true`);await sleep(350);
   console.log('STAGE',width,section,JSON.stringify(await evaluate(`({y:scrollY,top:document.getElementById('${section}')?.getBoundingClientRect().top,canvas:document.querySelectorAll('canvas').length,overflow:document.documentElement.scrollWidth>innerWidth,gpu:window.__gpu})`)));
  }
 }
 await evaluate(`document.querySelector('button[aria-label="Cambiar a modo día"]')?.click();window.__sample=true`);await sleep(300);console.log('DAY',JSON.stringify(await evaluate(snapshot)));
 await evaluate(`document.querySelector('button[aria-label="Cambiar a modo noche"]')?.click();window.__sample=true`);await sleep(300);console.log('NIGHT',JSON.stringify(await evaluate(snapshot)));
 await evaluate(`document.querySelector('canvas')?.getContext('webgl2')?.getExtension('WEBGL_lose_context')?.loseContext()`);await sleep(500);console.log('LOSS',JSON.stringify(await evaluate(`({canvas:document.querySelectorAll('canvas').length,fallback:!!document.querySelector('.cinema-fallback')})`)));
 for(const path of ['catalogo','carrito','cotizar','servicios','portafolio','reclamaciones','privacidad','terminos','envios','nosotros','blog','garantia','faq']){
  await call('Page.navigate',{url:'http://localhost:4201/'+path});await sleep(1600);console.log('ROUTE',path,JSON.stringify(await evaluate(`({path:location.pathname,title:document.title,overflow:document.documentElement.scrollWidth>innerWidth,h1:document.querySelectorAll('h1').length,canvas:document.querySelectorAll('canvas').length,forms:[...document.forms].map(f=>({valid:f.checkValidity(),inputs:f.elements.length}))})`)));
 }
 await call('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});await call('Page.navigate',{url:'http://localhost:4201/'});await sleep(2500);console.log('REDUCED',JSON.stringify(await evaluate(snapshot)));
 console.log('ERRORS',JSON.stringify(errors));console.log('BLOCKED_WRITES',JSON.stringify(writes));
 fs.writeFileSync('.work/cinema-browser.log', output.join('\n'), 'utf8');
 await call('Fetch.disable'); ws.close(); process.exit(0);
})().catch(e=>{console.error(e);process.exitCode=1});
