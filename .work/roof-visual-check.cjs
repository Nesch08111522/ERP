const fs = require('node:fs');
(async () => {
 const tab = await fetch('http://127.0.0.1:9222/json/new?about:blank', {method:'PUT'}).then(r=>r.json());
 const ws = new WebSocket(tab.webSocketDebuggerUrl); await new Promise(r=>ws.addEventListener('open',r));
 let id=0; const pending=new Map(); const evidence=[]; const errors=[]; const writes=[];
 const call=(method,params={})=>new Promise((resolve,reject)=>{const n=++id;console.log('CDP',method);const timer=setTimeout(()=>reject(Error(method+' timeout')),10000);pending.set(n,m=>{clearTimeout(timer);m.error?reject(Error(JSON.stringify(m.error))):resolve(m.result)});ws.send(JSON.stringify({id:n,method,params}));});
 ws.addEventListener('message',e=>{const m=JSON.parse(e.data);if(m.id){pending.get(m.id)?.(m);pending.delete(m.id);}else if(m.method==='Fetch.requestPaused'){const p=m.params;const write=!['GET','HEAD','OPTIONS'].includes(p.request.method);if(write)writes.push(p.request.url);call(write?'Fetch.failRequest':'Fetch.continueRequest',write?{requestId:p.requestId,errorReason:'BlockedByClient'}:{requestId:p.requestId}).catch(console.error);}else if(m.method==='Runtime.exceptionThrown')errors.push(m.params);});
 const sleep=ms=>new Promise(r=>setTimeout(r,ms));
 const ev=async expression=>{const r=await call('Runtime.evaluate',{expression:`(()=>{${expression}})()`,returnByValue:true,timeout:4000});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value;};
 try {
  await call('Page.enable');await call('Runtime.enable');await call('Network.enable');await call('Network.setBlockedURLs',{urls:['*://*/api/v1/*cotizaciones*','*://*/api/v1/*reclamaciones*']});await call('Page.bringToFront');await call('Emulation.setFocusEmulationEnabled',{enabled:true});
  for(const [width,height] of [[1440,900],[390,844]]) {
   await call('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<700});await call('Page.navigate',{url:'http://localhost:4201/'});await sleep(6000);
   const samples=[];
   for(const section of ['producto','ensamblaje','aplicaciones','contacto','footer']) {
    await ev(`document.getElementById('${section}').scrollIntoView({behavior:'instant'});`);await sleep(700);
    const data=await ev(`const s=document.querySelector('.cinema-surface');return {section:'${section}',scroll:scrollY,pose:s.dataset.pose,visibility:getComputedStyle(s).visibility,opacity:getComputedStyle(s).opacity,footer:document.getElementById('footer').getBoundingClientRect().top,overflow:document.documentElement.scrollWidth>innerWidth};`);samples.push(data);evidence.push({width,...data});
    const shot=await call('Page.captureScreenshot',{format:'png'});fs.writeFileSync('.work/roof-'+width+'-'+section+'.png',Buffer.from(shot.data,'base64'));
   }
       const bottom=await ev('return document.documentElement.scrollHeight-innerHeight;');
    const normalized=[0,.05,.15,.25,.5,.75,.9,1];const settled=[];
    for(const progress of normalized){await ev(`scrollTo({top:${bottom}*${progress},behavior:'instant'});`);await sleep(400);settled.push(await ev('const s=document.querySelector(".cinema-surface");return {scroll:scrollY,progress:s.dataset.progress,pose:s.dataset.pose,style:s.getAttribute("style")};'));}
    for(let i=normalized.length-1;i>=0;i--){await ev(`scrollTo({top:${bottom}*${normalized[i]},behavior:'instant'});`);await sleep(400);const back=await ev('const s=document.querySelector(".cinema-surface");return {scroll:scrollY,progress:s.dataset.progress,pose:s.dataset.pose,style:s.getAttribute("style")};');evidence.push({width,normalized:normalized[i],forward:settled[i],reverse:back,matching:JSON.stringify(back)===JSON.stringify(settled[i])});}
    for(const sample of samples.slice().reverse()) {await ev(`scrollTo({top:${sample.scroll},behavior:'instant'});`);await sleep(300);const pose=await ev('return document.querySelector(".cinema-surface").dataset.pose;');evidence.push({width,reverse:sample.section,matching:pose===sample.pose});}
   for(const sample of samples.slice(0,3)) {for(const offset of [-12,12]) {await ev(`scrollTo({top:${sample.scroll+offset},behavior:'instant'});`);await sleep(200);evidence.push({width,near:sample.section,offset,pose:await ev('return document.querySelector(".cinema-surface").dataset.pose;')});}}
  }
  await call('Page.navigate',{url:'http://192.168.100.11:4201/'});await sleep(5000);evidence.push({lan:await ev('return {title:document.title,canvas:document.querySelectorAll("canvas").length,h1:document.querySelectorAll("h1").length};')});
  await call('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});await call('Page.navigate',{url:'http://localhost:4201/'});await sleep(3000);
  evidence.push({fallback:await ev('return {canvas:document.querySelectorAll("canvas").length,roof:document.querySelectorAll(".roof-fallback span").length};')});
  const fallback=await call('Page.captureScreenshot',{format:'png'});fs.writeFileSync('.work/roof-fallback-final.png',Buffer.from(fallback.data,'base64'));
  console.log(JSON.stringify({evidence,errors,writes},null,2));
 } finally {fs.writeFileSync('.work/roof-evidence.json',JSON.stringify({evidence,errors,writes},null,2));await call('Page.close').catch(console.error);ws.close();}
})().then(()=>process.exit(0)).catch(e=>{console.error(e);process.exit(1)});
