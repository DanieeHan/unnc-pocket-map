/* Local browser harness. Renders the actual WXML/WXSS and runs the native Page controller. */
(async function(){
  const base='../miniprogram/';
  const revision=Date.now().toString(36);
  const fresh=p=>fetch(base+p+'?revision='+revision,{cache:'no-store'});
  const [wxml,appCss,pageCss,dbCode,pageCode]=await Promise.all(['pages/map/index.wxml','app.wxss','pages/map/index.wxss','data/places.js','pages/map/index.js'].map(p=>fresh(p).then(r=>{if(!r.ok)throw Error(p);return r.text()})));
  document.querySelector('#native-css').textContent=(appCss+'\n'+pageCss).replace(/(-?\d+(?:\.\d+)?)rpx/g,(_,n)=>Number(n)/2+'px').replace(/\bpage\{/g,'#root{').replace(/\.tags text/g,'.tags span').replace(/\.related-place text/g,'.related-place span').replace(/\.map-caption text/g,'.map-caption span');
  const doc=new DOMParser().parseFromString('<root xmlns:wx="wx">'+wxml.replace(/"[^"]*"|'[^']*'|\s(wx:else|scroll-x|scroll-y|enhanced|inertia|out-of-bounds|scale-area|scale)(?=[\s>])/g,(match,attr)=>attr?' '+attr+'="true"':match)+'</root>','application/xml');
  if(doc.querySelector('parsererror'))throw Error(doc.querySelector('parsererror').textContent);
  const services={exports:{}};new Function('module',await fresh('data/photo-services.js').then(r=>r.text()))(services);
  const mod={exports:{}};new Function('module','require',dbCode)(mod,()=>services.exports);
  const locationModule={exports:{}};new Function('module',await fresh('utils/location.js').then(r=>r.text()))(locationModule);
  const calibrationModule={exports:{}};new Function('module',await fresh('data/location-calibration.js').then(r=>r.text()))(calibrationModule);
  const calibration=calibrationModule.exports;
  const root=document.querySelector('#root');let page,renderQueued=false;let callbacks=[];
  function toast(title){document.querySelector('.toast')?.remove();const el=document.createElement('div');el.className='toast';el.textContent=title;document.body.append(el);setTimeout(()=>el.remove(),2200)}
  const wx={createSelectorQuery(){let selector,callback;return {in(){return this},select(s){selector=s;return this},boundingClientRect(cb){callback=cb;return this},exec(){const el=root.querySelector(selector);callback(el?el.getBoundingClientRect():null)}}},getWindowInfo:()=>({windowWidth:Math.min(innerWidth,430),windowHeight:innerWidth>=600?Math.min(innerHeight-85,900):innerHeight,statusBarHeight:32}),getStorageSync:k=>JSON.parse(localStorage.getItem(k)||'[]'),setStorageSync:(k,v)=>localStorage.setItem(k,JSON.stringify(v)),showShareMenu(){},showToast:({title})=>toast(title),setClipboardData:async({data})=>{try{await navigator.clipboard.writeText(data);toast('已复制')}catch(e){toast('复制失败，请允许剪贴板权限')}}};
  // WXML expressions repeat for every pin on every frame. Compile each one
  // once; the current scope still supplies all live camera and selection data.
  const expressionCache=new Map();
  const evaluate=(expr,scope)=>{try{if(!expressionCache.has(expr))expressionCache.set(expr,new Function('s','with(s){return ('+expr+')}'));return expressionCache.get(expr)(scope)}catch(e){return undefined}};
  const interpolate=(value,scope)=>value.replace(/\{\{([\s\S]*?)\}\}/g,(_,expr)=>{const v=evaluate(expr,scope);return v==null?'':String(v)});
  const truth=(value,scope)=>!!evaluate(value.replace(/^\{\{|\}\}$/g,''),scope);
  function children(source,target,scope){let previous=false;for(const child of source.childNodes){if(child.nodeType===1){const iff=child.getAttribute('wx:if'),otherwise=child.hasAttribute('wx:else');if(iff!==null){previous=truth(iff,scope);if(!previous)continue}else if(otherwise){if(previous)continue}else previous=false;}const el=build(child,scope);if(el)target.append(el)}}
  function build(n,scope,skipFor=false){
    if(n.nodeType===3)return document.createTextNode(interpolate(n.textContent,scope));if(n.nodeType!==1)return null;
    if(!skipFor&&n.hasAttribute('wx:for')){const frag=document.createDocumentFragment();const items=evaluate(n.getAttribute('wx:for').replace(/^\{\{|\}\}$/g,''),scope)||[];items.forEach((item,index)=>{const s={...scope,item,index};frag.append(build(n,s,true))});return frag}
    const tags={view:'div',text:'span',image:'img','scroll-view':'div','movable-area':'div','movable-view':'div'};
    const el=document.createElement(tags[n.tagName]||n.tagName);
    for(const a of n.attributes){if(a.name.startsWith('wx:'))continue;const v=interpolate(a.value,scope);
      if(a.name==='disabled'){el.disabled=v==='true';continue;}
      if(/^(bind|catch)/.test(a.name)){const type=a.name.replace(/^(bind|catch)/,'');if(!['tap','input','confirm'].includes(type))continue;el.addEventListener(type==='tap'?'click':type==='confirm'?'keydown':'input',event=>{if(type==='confirm'&&event.key!=='Enter')return;if(a.name.startsWith('catch'))event.stopPropagation();page[v]?.({currentTarget:{dataset:{...el.dataset}},detail:{value:el.value}})});continue}
      if(a.name==='src')el.setAttribute('src',v.startsWith('/')?base+v.slice(1):v);else if(a.name==='value')el.value=v;else el.setAttribute(a.name,v);
    }
    if(n.tagName==='scroll-view')el.classList.add(n.hasAttribute('scroll-x')?'scroll-x':'scroll-y');
    if(n.tagName==='movable-view'){el.style.transform=`translate(${scope.mapX}px,${scope.mapY}px) scale(${scope.scale})`;}
    children(n,el,scope);return el;
  }
  function render(){
    const inputFocused=document.activeElement?.tagName==='INPUT';const selection=inputFocused?document.activeElement.selectionStart:0;
    const oldSheet=root.querySelector('.map-sheet');const oldTransform=oldSheet?getComputedStyle(oldSheet).transform:null;
    const oldMarkers=new Map([...root.querySelectorAll('.place-marker')].map(el=>{const s=getComputedStyle(el);return [el.dataset.id,{left:s.left,top:s.top}]}));
    root.replaceChildren();children(doc.documentElement,root,page.data);
    const status=document.createElement('div');status.className='preview-status';status.innerHTML='<span>9:41</span><span>▮▮▮ &nbsp; ▰</span>';root.append(status);
    const capsule=document.createElement('div');capsule.className='preview-capsule';capsule.textContent='•••　│　◉';root.append(capsule);
    const newSheet=root.querySelector('.map-sheet');if(newSheet&&oldTransform&&page.data.mapAnimate){const target=newSheet.style.transform;newSheet.style.transition='none';newSheet.style.transform=oldTransform;void newSheet.offsetWidth;newSheet.style.transition='transform 240ms ease-out';newSheet.style.transform=target;}
    if(page.data.mapAnimate)root.querySelectorAll('.place-marker').forEach(el=>{const old=oldMarkers.get(el.dataset.id);if(!old)return;const left=el.style.left,top=el.style.top;el.style.transition='none';el.style.left=old.left;el.style.top=old.top;void el.offsetWidth;el.style.transition='left 240ms ease-out, top 240ms ease-out';el.style.left=left;el.style.top=top;});
    if(inputFocused){const input=root.querySelector('input');input?.focus();input?.setSelectionRange(selection,selection)}attachMap();
  }
  function attachMap(){
    const area=root.querySelector('.map-area');if(!area)return;
    const pointers=new Map();
    const event=()=>({touches:[...pointers.values()]});
    area.addEventListener('pointerdown',e=>{pointers.set(e.pointerId,{clientX:e.clientX,clientY:e.clientY});page.onMapTouchStart(event());});
    area.addEventListener('pointermove',e=>{if(!pointers.has(e.pointerId))return;pointers.set(e.pointerId,{clientX:e.clientX,clientY:e.clientY});page.onMapTouchMove(event());if(page.gesture?.moved&&!area.hasPointerCapture(e.pointerId))area.setPointerCapture(e.pointerId);});
    const end=e=>{if(!pointers.has(e.pointerId))return;pointers.delete(e.pointerId);page.onMapTouchEnd(event());};
    area.addEventListener('pointerup',end);area.addEventListener('pointercancel',end);
    area.addEventListener('wheel',e=>{e.preventDefault();page.zoomBy(e.deltaY>0?-.06:.06)},{passive:false});
  }
  function syncMapLayer(className){
    const layer=root.querySelector('.'+className);if(!layer)return;
    const incoming=document.createDocumentFragment();children(doc.querySelector('[class="'+className+'"]'),incoming,page.data);
    const existing=new Map([...layer.children].map(el=>[el.dataset.id,el]));
    for(const next of [...incoming.children]){
      const old=existing.get(next.dataset.id);
      if(!old){layer.append(next);continue;}
      existing.delete(next.dataset.id);
      for(const a of [...old.attributes])if(!next.hasAttribute(a.name))old.removeAttribute(a.name);
      for(const a of next.attributes)if(old.getAttribute(a.name)!==a.value)old.setAttribute(a.name,a.value);
      // Keep marker nodes and their click handlers alive across animation frames.
      if(old.innerHTML!==next.innerHTML)old.replaceChildren(...next.childNodes);
    }
    existing.forEach(el=>el.remove());
  }
  new Function('require','Page','wx',pageCode)(id=>id.includes('location-calibration')?calibration:id.includes('utils/location')?locationModule.exports:mod.exports,definition=>{page=definition;page.setData=function(patch,callback){
    const labelsChanged=patch.showMapLabels!==undefined&&patch.showMapLabels!==this.data.showMapLabels;
    Object.assign(this.data,patch);if(callback)callbacks.push(callback);
    const fastKeys=['mapX','mapY','scale','mapAnimate','showMapLabels','serviceCards','renderedPlaces','mapServicePopup','cameraMoving','userLocationScreen'];
    const fast=!labelsChanged&&Object.keys(patch).every(k=>fastKeys.includes(k))&&root.querySelector('.map-sheet');
    if(fast&&!renderQueued){const sheet=root.querySelector('.map-sheet');sheet.style.transition='none';sheet.style.transform=`translate3d(${this.data.mapX}px,${this.data.mapY}px,0) scale(${this.data.scale})`;if(patch.renderedPlaces)syncMapLayer('marker-layer');if('userLocationScreen' in patch)syncMapLayer('user-location-layer');if('mapServicePopup' in patch||'cameraMoving' in patch)syncMapLayer('map-popup-layer');queueMicrotask(()=>{const pending=callbacks;callbacks=[];pending.forEach(cb=>cb());});return;}
    if(!renderQueued){renderQueued=true;queueMicrotask(()=>{renderQueued=false;render();const pending=callbacks;callbacks=[];pending.forEach(cb=>cb());})}
  }},wx);
  window.__page=page;page.onLoad(Object.fromEntries(new URLSearchParams(location.search)));render();page.onReady();
  window.addEventListener('resize',()=>{const info=wx.getWindowInfo();page.onResize({size:{windowWidth:info.windowWidth,windowHeight:info.windowHeight}})});
})().catch(e=>{document.querySelector('#root').textContent='预览载入失败：'+e.message;console.error(e)});
