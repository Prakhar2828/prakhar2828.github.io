import {BrowserMission} from './vendor/asteria/runtime-core.mjs';
const root=document.querySelector('[data-mission-lab]');
if(root){
 const $=s=>root.querySelector(s);let modulePromise,mission=null,counter=0,timer=null,busy=false,history=[],clockTicks=0;
 const controls={start:$('#lab-start'),fault:$('#lab-fault'),clear:$('#lab-clear'),recover:$('#lab-recover'),pause:$('#lab-pause'),export:$('#lab-export')};
 const stories={ready:['Spacecraft model ready to initialize.','Start the model, introduce a power fault, then decide when recovery is safe.'],nominal:['The spacecraft is working.','The C++ model accepted the startup commands. Try introducing a power fault.'],fault:['The model entered SAFE.','The model shed payload load. Try recovery now, or clear the fault and let the battery recharge.'],coasted:['The battery has recharged.','Forty simulated minutes of sunlit coast restored charge. Recovery still needs an explicit command.'],complete:['You recovered the spacecraft.','The model is back in NOMINAL mode. You can download what happened or restart and try again.']};
 let stage='ready';
 const note=(text,kind='info')=>{const li=document.createElement('li');const time=document.createElement('span');time.textContent=mission?`${Math.round(mission.truth.telemetry.time)}s`:'—';const copy=document.createElement('span');copy.textContent=text;li.dataset.kind=kind;li.append(time,copy);$('#lab-log').prepend(li);while($('#lab-log').children.length>4)$('#lab-log').lastElementChild.remove();};
 const tell=text=>{$('#lab-status').textContent=text;};
 function stop(){clearInterval(timer);timer=null;}
 function tick(){if(!mission)return;try{mission.step(1);sample();clockTicks++;if(clockTicks>=45){stop();tell('Clock paused after 45 seconds. Inspect the evidence or use Run clock to continue.');}render();}catch(error){stop();tell('Model paused. Restart the mission or open the full lab.');}}
 function run(){stop();clockTicks=0;timer=setInterval(tick,1000);render();}
 function sample(){history.push(mission.truth.telemetry.battery_soc);history=history.slice(-48);}
 function command(name,value=0){const result=mission.command({id:'portfolio-'+(++counter),command:name,value});note(`${name} · ${result.status==='acknowledged'?'ACK':result.reason}`,result.status==='acknowledged'?'ack':'rejected');return result;}
 async function module(){
  if(!modulePromise)modulePromise=(async()=>{
   const catalogResponse=await fetch('./vendor/asteria/catalog.json');if(!catalogResponse.ok)throw Error('Catalog unavailable');const catalog=await catalogResponse.json();
   await new Promise((resolve,reject)=>{const script=document.createElement('script');script.src='./vendor/asteria/flight-wasm.js';script.onload=resolve;script.onerror=reject;document.head.append(script);});
   const base=new URL('./vendor/asteria/',location.href);const wasm=await window.createAsteria({locateFile:name=>new URL(name,base).href});
   return {catalog,engine:{reset:wasm.cwrap('reset_flight',null,['number']),exchange:(cmd,value)=>JSON.parse(wasm.ccall('exchange_flight','string',['string','number'],[cmd,value]))}};
  })().catch(error=>{modulePromise=null;throw error;});return modulePromise;
 }
 function render(){
  root.dataset.stage=stage;$('#lab-story-title').textContent=stories[stage][0];$('#lab-story-copy').textContent=stories[stage][1];
  const t=mission?.truth.telemetry;const mode=mission?.truth.mode||'READY';$('#lab-mode').textContent=mode;$('#lab-mode').dataset.mode=mode;
  $('#lab-source').textContent=mission?'C++ MODEL CONNECTED':'C++ MODEL / ON DEMAND';
  for(const [id,value] of [['soc',t?`${t.battery_soc.toFixed(1)}%`:'—'],['voltage',t?`${t.bus_voltage.toFixed(2)} V`:'—'],['load',t?`${t.load_power.toFixed(1)} W`:'—'],['elapsed',t?`${Math.round(t.time)} s`:'—']])$('#lab-'+id).textContent=value;
  const other=t&&t.temperature<45&&t.sensor_age<2&&Math.abs(t.wheel_rpm)<5500&&Boolean(t.link_connected);
  const checks=[Boolean(t&&t.battery_soc>=35),Boolean(mission&&!mission.truth.faults.some(Boolean)),Boolean(other),Boolean(t&&t.healthy_dwell>=10)];
  root.querySelectorAll('[data-gate]').forEach((el,i)=>{el.dataset.pass=String(checks[i]);el.querySelector('strong').textContent=t?(checks[i]?'PASS':'WAIT'):'—';});
  if(history.length){const values=history.length===1?[history[0],history[0]]:history;$('#lab-trace').setAttribute('points',values.map((v,i)=>`${i/(values.length-1)*480},${65-v*.6}`).join(' '));$('#lab-trace').parentElement.setAttribute('aria-label',`Recorded model battery charge, latest ${t.battery_soc.toFixed(1)} percent`);}
  controls.start.disabled=busy;controls.start.textContent=busy?'Loading flight model…':mission?'Restart mission ↺':'Start mission →';
  controls.fault.disabled=busy||!mission||mode!=='NOMINAL'||stage!=='nominal';controls.clear.disabled=busy||!mission||stage!=='fault';controls.recover.disabled=busy||!mission||mode!=='SAFE';controls.pause.disabled=!mission||busy||!['nominal','complete'].includes(stage);controls.pause.textContent=timer?'Pause clock Ⅱ':'Run clock ▷';controls.export.disabled=!mission||busy;
 }
 async function action(fn){if(busy)return;busy=true;render();try{await fn();}catch(error){stop();tell('The model could not complete this action. Use Restart or open the full Asteria lab.');note('Model unavailable · use the full lab link','rejected');console.warn('Asteria portfolio model:',error.message);}finally{busy=false;render();}}
 controls.start.addEventListener('click',()=>action(async()=>{stop();const {catalog,engine}=await module();mission=new BrowserMission(engine,catalog,42,'administrator');counter=0;history=[];$('#lab-log').replaceChildren();command('BOOT');command('POINT');command('PAYLOAD_ON');stage='nominal';sample();tell('Commissioned. NOMINAL mode; the model is advancing one simulated second per second.');run();}));
 controls.fault.addEventListener('click',()=>action(()=>{stop();command('INJECT_FAULT',0);stage='fault';sample();tell('Power fault injected. Autonomous SAFE mode; clock paused so you can inspect recovery gates.');}));
 controls.clear.addEventListener('click',()=>action(()=>{command('CLEAR_FAULTS');mission.step(2400);note('COAST · +2,400 simulated seconds');stage='coasted';sample();tell('Fault source cleared. Forty simulated minutes of sunlit coast completed; inspect the four recovery gates.');}));
 controls.recover.addEventListener('click',()=>action(()=>{const result=command('RECOVER');if(result.status!=='acknowledged'){tell('Recovery rejected: health and dwell gates must pass. Clear the source and coast first.');return;}command('RESUME');stage='complete';sample();tell('RECOVER and RESUME acknowledged. NOMINAL mode restored; payload remains under separate command control.');run();}));
 controls.pause.addEventListener('click',()=>{if(timer){stop();tell('Clock paused. The model state is preserved.');}else{run();tell('Clock running at one simulated second per second.');}render();});
 controls.export.addEventListener('click',()=>{const payload=mission.export();payload.portfolio_demo={source_commit:'0fe963ba7850d84c0976cc5614f0484f99bc6071',scope:'C++ WebAssembly + browser adapter; synthetic software demonstration'};const url=URL.createObjectURL(new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='asteria-portfolio-journal.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&timer){stop();render();tell('Clock paused while the page is hidden.');}});
 render();
}
