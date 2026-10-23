
// Source-time captions stay in sync at every playback rate and on every seek.
function attachDialogueCaptions({video,element,button,source,language=()=>document.documentElement.lang}){
 const cache=new Map();let mode='bilingual',lastKey='',lastCue=null;
 try{mode=localStorage.getItem('nine-lives-caption-mode')||mode}catch{}
 if(!['bilingual','en','off'].includes(mode))mode='bilingual';
 function effectiveMode(){return mode==='off'?'off':language()==='en'?'en':mode}
 function label(){const en=language()==='en',m=effectiveMode();button.textContent=en?(m==='off'?'CC Off':'CC On'):(m==='bilingual'?'中英':m==='en'?'EN':'字幕关');button.setAttribute('aria-label',en?'Subtitles: '+(m==='off'?'off':'English'):'切换字幕');}
 button.onclick=()=>{const m=effectiveMode();mode=language()==='en'?(m==='off'?'en':'off'):(m==='bilingual'?'en':m==='en'?'off':'bilingual');try{localStorage.setItem('nine-lives-caption-mode',mode)}catch{}label();lastKey='';render()};label();
 window.addEventListener('playerlanguagechange',()=>{label();lastKey='';render()});
 async function get(url){if(!cache.has(url)){cache.set(url,null);try{const r=await fetch(url,{cache:'no-store'});if(!r.ok)throw new Error(r.status);cache.set(url,await r.json())}catch{cache.delete(url)}}return cache.get(url)}
 function render(){const info=source(),displayMode=effectiveMode();let cue=null;
  if(info&&!info.silent&&displayMode!=='off'){
   const data=cache.get(info.url);if(data){const cues=info.clip?data.clips?.[info.clip]?.cues:data.cues;const t=video.currentTime*1000;cue=cues?.find(c=>t>=c.startMs&&t<c.endMs)||null;}else get(info.url);
  }
  const key=cue?displayMode+'|'+info.url+'|'+(info.clip||'')+'|'+cue.startMs+'|'+cue.en:'';
  if(key!==lastKey||(!element.childNodes.length&&cue)||(!cue&&element.childNodes.length)){element.replaceChildren();if(cue){if(displayMode==='bilingual'){const zh=document.createElement('div');zh.textContent=cue.zh;element.append(zh)}const en=document.createElement('div');en.className='sub-en';en.textContent=cue.en;element.append(en)}lastKey=key;lastCue=cue;}
 }
 video.addEventListener('timeupdate',render);video.addEventListener('seeked',render);video.addEventListener('loadedmetadata',()=>{const speed=document.querySelector('#speed');if(speed)setPlaybackPace(video,speed.value);video.preservesPitch=true;if('webkitPreservesPitch' in video)video.webkitPreservesPitch=true;lastKey='';render()});video.addEventListener('emptied',()=>{element.replaceChildren();lastKey=''});
 function frame(){render();requestAnimationFrame(frame)}requestAnimationFrame(frame);
 video.preservesPitch=true;if('webkitPreservesPitch' in video)video.webkitPreservesPitch=true;
 return {render};
}
