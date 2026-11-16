'use strict';
document.querySelectorAll('[data-tour-video]').forEach(video=>{
  const id=video.dataset.tourVideo;
  const buttons=[...document.querySelectorAll('[data-tour="'+id+'"]')];
  const update=()=>buttons.forEach((button,i)=>button.setAttribute('aria-pressed',String(i===Math.min(3,Math.floor(video.currentTime/8)))));
  let preparation;
  // Small, complete local media blobs allow reliable seeking on hosts without HTTP Range support.
  const prepare=()=>{
    if(preparation)return preparation;
    video.setAttribute('aria-busy','true');
    preparation=(async()=>{
      const response=await fetch(video.querySelector('source').src);
      if(!response.ok)throw new Error('Video download failed');
      const blob=await response.blob();
      const metadata=new Promise((resolve,reject)=>{
        video.addEventListener('loadedmetadata',resolve,{once:true});
        video.addEventListener('error',reject,{once:true});
      });
      video.src=URL.createObjectURL(blob);
      video.load();
      await metadata;
    })().finally(()=>video.setAttribute('aria-busy','false'));
    return preparation;
  };
  const unavailable=()=>{
    let notice=video.parentElement.querySelector('.tour-media-notice');
    if(!notice){notice=document.createElement('p');notice.className='tour-media-notice';notice.setAttribute('role','status');video.after(notice);}
    notice.textContent='Video could not load. Read the walkthrough below or open its captured states.';
  };
  video.addEventListener('timeupdate',update);
  buttons.forEach(button=>button.addEventListener('click',async()=>{
    try{await prepare();video.currentTime=Number(button.dataset.step)*8;update();}
    catch{unavailable();}
  }));
  if('IntersectionObserver' in window){
    const observer=new IntersectionObserver(entries=>{
      if(entries.some(entry=>entry.isIntersecting)){observer.disconnect();prepare().catch(unavailable);}
    },{rootMargin:'300px'});
    observer.observe(video);
  }else prepare().catch(unavailable);
});
