const {categories,places,officialMap,searchPlaces,mapPlaces} = require('../../data/places');
const STORAGE_KEY = 'unnc.saved.v1';
const calibration = require('../../data/location-calibration');
const location = require('../../utils/location');
// Place content is static. Prepare it once instead of scanning every child and
// sorting every visible building on each animation or touch frame.
const placesById=new Map(places.map(p=>[p.id,p]));
const childrenByParent=new Map();
for(const p of places)if(p.parentId){
  if(!childrenByParent.has(p.parentId))childrenByParent.set(p.parentId,[]);
  childrenByParent.get(p.parentId).push(p);
}
const markerCache=new WeakMap(),layoutCache=new WeakMap();
function markerData(p){
  if(markerCache.has(p))return markerCache.get(p);
  let units=0;for(const ch of p.mapLabel)units+=/[\x00-\x7f]/.test(ch)?5.5:10;
  // Only properties consumed by the map view cross the setData bridge. Full
  // names, descriptions and search aliases stay in the results/detail records.
  const marker={id:p.id,x:p.x,y:p.y,category:p.category,code:p.code,
    markerText:p.markerText||'',mapLabel:p.mapLabel,hasChildren:!!p.hasChildren,
    serviceCount:(childrenByParent.get(p.id)||[]).length,labelWidth:Math.min(140,Math.ceil(units)+10)};
  const rank=p.hasChildren?0:p.major?1:p.category==='study'?2:p.category==='life'?3:p.category==='residence'?5:4;
  const prepared={marker,rank};markerCache.set(p,prepared);return prepared;
}
function mapLayout(list){
  if(layoutCache.has(list))return layoutCache.get(list);
  const prepared=list.map(markerData).sort((a,b)=>a.rank-b.rank||a.marker.id.localeCompare(b.marker.id));
  const layout={ordered:prepared.map(p=>p.marker),byId:new Map(prepared.map(p=>[p.marker.id,p.marker]))};
  layoutCache.set(list,layout);return layout;
}
Page({
  data: {expandedBuildingId:null,mapServicePopup:null,popupItems:[],categories,places,visiblePlaces:mapPlaces(places,'all',null),results:places,category:'all',query:'',tab:'map',selected:null,related:[],saved:[],isSaved:false,guide:false,searching:false,scale:0.65,mapWidth:600,mapHeight:579,mapX:0,mapY:0,mapAnimate:false,showMapLabels:false,statusTop:24,windowHeight:800,featured:places[0]},
  onLoad(options) {
    this.locationTicket=0;
    this.setData({locating:false,userLocation:null,userLocationScreen:null,locationMessage:''});
    const info = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync();
    this.viewportWidth = info.windowWidth;this.cameraTicket=0;
    try { const stored=wx.getStorageSync(STORAGE_KEY); this.data.saved=Array.isArray(stored)?stored.filter(id=>placesById.has(id)):[]; } catch(e) { this.data.saved=[]; }
    this.setData({saved:this.data.saved,statusTop:info.statusBarHeight||24,windowHeight:info.windowHeight});
    this.resetMap();
    if (options && options.place) this.selectId(options.place);
    wx.showShareMenu({menus:['shareAppMessage']});
  },
  updateResults() {
    const {query,category,tab,saved}=this.data;
    const matches=searchPlaces(query,category);
    const results=tab==='saved'?matches.filter(p=>saved.includes(p.id)):matches;
    this.setData({results,visiblePlaces:mapPlaces(matches,category,this.data.selected)});
    this.setCamera({});
  },
  setCamera(patch){
    const animate=patch.mapAnimate&&this.motionReady&&typeof setTimeout==='function';
    this.cancelCameraMotion();
    if(!animate){this.paintCamera({...patch,cameraMoving:false});return;}
    const start={mapX:this.data.mapX,mapY:this.data.mapY,scale:this.data.scale};
    const target={...start,...patch},started=Date.now(),ticket=this.motionTicket;
    const frame=()=>{
      if(ticket!==this.motionTicket)return;
      const progress=Math.min(1,(Date.now()-started)/260),ease=1-Math.pow(1-progress,3);
      this.paintCamera({...patch,mapAnimate:false,cameraMoving:progress<1,
        mapX:start.mapX+(target.mapX-start.mapX)*ease,
        mapY:start.mapY+(target.mapY-start.mapY)*ease,
        scale:start.scale+(target.scale-start.scale)*ease});
      if(progress<1)this.motionTimer=setTimeout(frame,16);
      else this.motionTimer=null;
    };
    frame();
  },
  cancelCameraMotion(){
    this.motionTicket=(this.motionTicket||0)+1;
    if(this.motionTimer&&typeof clearTimeout==='function')clearTimeout(this.motionTimer);
    this.motionTimer=null;
  },
  clearLocation(){
    this.locationTicket=(this.locationTicket||0)+1;
    if(this.locationTimer)clearTimeout(this.locationTimer);
    this.locationTimer=null;
    this.setData({locating:false,userLocation:null,userLocationScreen:null,locationMessage:''});
  },
  onHide(){this.clearLocation();this.cancelCameraMotion();++this.cameraTicket;},
  onUnload(){this.clearLocation();this.cancelCameraMotion();++this.cameraTicket;},
  locateMe(){
    if(this.data.locating)return;
    if(!location.ready(calibration)){
      this.setData({locationMessage:'定位待校准'});
      wx.showToast({title:'校园底图待校准，暂不显示位置',icon:'none'});return;
    }
    if(!wx.getLocation){wx.showToast({title:'请在微信真机中体验定位',icon:'none'});return;}
    this.clearLocation();
    const ticket=this.locationTicket,cameraTicket=this.cameraTicket;
    this.setData({locating:true,locationMessage:'正在定位…'});
    const fail=err=>{
      if(ticket!==this.locationTicket)return;
      clearTimeout(this.locationTimer);this.locationTimer=null;++this.locationTicket;
      this.setData({locating:false,locationMessage:'未获取位置，点击定位重试'});
      const denied=/auth deny|auth denied|authorize.*deny/i.test((err&&err.errMsg)||'');
      if(denied&&wx.showModal)wx.showModal({title:'需要位置权限',content:'你可以在设置中允许定位，也可以继续浏览校园地图。',confirmText:'去设置',success:r=>{if(r.confirm&&wx.openSetting)wx.openSetting({});}});
      else wx.showToast({title:'定位未成功，请检查权限与手机定位服务',icon:'none'});
    };
    this.locationTimer=setTimeout(()=>fail({errMsg:'timeout'}),30000);
    const request=()=>{
      if(ticket!==this.locationTicket)return;
      wx.getLocation({type:'gcj02',isHighAccuracy:true,highAccuracyExpireTime:5000,
        success:fix=>{
          if(ticket!==this.locationTicket)return;
          clearTimeout(this.locationTimer);this.locationTimer=null;
          const result=location.locate(fix,calibration);
          const messages={outside:'当前位置不在校园地图范围内',inaccurate:'定位精度不足，请到室外重试',uncalibrated:'定位待校准'};
          if(result.status!=='located'){this.setData({locating:false,locationMessage:messages[result.status]});return;}
          this.setData({locating:false,userLocation:result,locationMessage:'本次位置 · 再次点击刷新'});
          this.setCamera({});
          // A delayed result must not pull the map away from a newer user action.
          if(cameraTicket===this.cameraTicket){
            this.closeDetail();const centerTicket=this.cameraTicket;
            this.afterMapLayout(rect=>{if(ticket===this.locationTicket&&centerTicket===this.cameraTicket)this.centerPlace(result,rect);});
          }
        },fail});
    };
    if(wx.requirePrivacyAuthorize)wx.requirePrivacyAuthorize({success:request,fail});else request();
  },
  paintCamera(patch){
    const d={...this.data,...patch},rect=this.mapRect;
    const layout=mapLayout(d.visiblePlaces);
    const serviceCards=[];
    const renderedPlaces=[],occupied=[];
    const hit=(a,b)=>a.x<b.x+b.w+5&&a.x+a.w+5>b.x&&a.y<b.y+b.h+5&&a.y+a.h+5>b.y;
    const fits=b=>rect&&b.x>=4&&b.y>=4&&b.x+b.w<=rect.width-4&&b.y+b.h<=rect.height-26;
    const point=p=>({x:d.mapX+p.x/100*d.mapWidth*d.scale,y:d.mapY+p.y/100*d.mapHeight*d.scale});
    const size=Math.max(16,Math.min(22,Math.round(26*d.scale)));
    const bounds=(p,s)=>{const a=point(p);return {x:a.x-s/2,y:a.y-s/2-(p.hasChildren?6:0),w:s+(p.hasChildren?6:0),h:s+(p.hasChildren?6:0)};};
    const labelBoxes=(p,s,belowOnly=false)=>{
      const a=point(p),w=p.labelWidth,h=20,gap=6;
      const x=Math.max(4,Math.min(a.x-w/2,(rect?rect.width:390)-w-4));
      // Keep the name below its pin; small horizontal offsets clear diagonal rows.
      const clamp=left=>Math.max(4,Math.min(left,(rect?rect.width:390)-w-4));
      const below=[];
      for(const offset of [0,6,12])for(const left of [x,clamp(a.x-s/2),clamp(a.x+s/2-w)])
        below.push({x:left,y:a.y+s/2+gap+offset,w,h});
      if(belowOnly)return below;
      return below.concat([
        {x,y:a.y-s/2-gap-h-(p.hasChildren?6:0),w,h},
        {x:a.x+s/2+gap+(p.hasChildren?6:0),y:a.y-h/2,w,h},
        {x:a.x-s/2-gap-w,y:a.y-h/2,w,h}
      ]);
    };
    const placeLabel=(p,belowOnly=false)=>{
      const l=labelBoxes(p,p.pinSize,belowOnly).find(b=>fits(b)&&!occupied.some(o=>hit(b,o)));
      if(!l)return;
      p.labelVisible=true;p.labelWidth=l.w;p.labelOffset=l.x-p.screenX;
      // WXML positions the text relative to the marker's top-left, not its center.
      p.labelTop=l.y-p.screenY+p.pinSize/2;occupied.push(l);
    };
    if(rect){
      // Reserve map controls and the selected point before placing anything else.
      occupied.push({x:0,y:0,w:158,h:44},{x:rect.width-54,y:0,w:54,h:62},{x:rect.width-56,y:rect.height-196,w:56,h:196});
      if(d.locationMessage)occupied.push({x:0,y:rect.height-64,w:rect.width-65,h:42});
      if(d.userLocation){const a=point(d.userLocation);occupied.push({x:a.x-14,y:a.y-14,w:28,h:28});}
      const chosen=layout.byId.get(d.expandedBuildingId||(d.selected&&d.selected.id));
      if(chosen){occupied.push(bounds(chosen,28));const a=point(chosen);const marker={...chosen,screenX:a.x,screenY:a.y,pinSize:28,labelVisible:false};renderedPlaces.push(marker);if(!d.expandedBuildingId)placeLabel(marker);}
      if(d.expandedBuildingId&&chosen){
        const a=point(chosen),gap=28;
        const above=Math.max(0,a.y-gap-42),below=Math.max(0,rect.height-30-a.y-gap);
        let width=Math.min(200,rect.width-16),height,left,top;
        if(Math.max(above,below)>=130){
          const under=below>=above;height=Math.min(230,under?below:above);
          left=Math.max(8,Math.min(a.x-width/2,rect.width-width-8));
          top=under?a.y+gap:a.y-gap-height;
        }else{
          const leftSpace=Math.max(0,a.x-gap-8),rightSpace=Math.max(0,rect.width-8-a.x-gap);
          const onLeft=leftSpace>=rightSpace;
          width=Math.min(200,onLeft?leftSpace:rightSpace);height=Math.max(60,Math.min(230,rect.height-76));
          left=onLeft?a.x-gap-width:a.x+gap;
          top=Math.max(42,Math.min(a.y-height/2,rect.height-height-30));
        }
        patch.mapServicePopup={left,top,width,height,anchorX:a.x,anchorY:a.y};
        occupied.push({x:left,y:top,w:width,h:height});
      }
      for(let i=serviceCards.length-1;i>=0;i--){const c=serviceCards[i],box={x:c.left,y:c.top,w:c.width,h:70};if(!fits(box)||occupied.some(b=>hit(box,b)))serviceCards.splice(i,1);else occupied.push(box);}
      for(const p of layout.ordered){if(chosen&&p.id===chosen.id)continue;const pinSize=p.markerText?Math.max(24,size):size;const b=bounds(p,pinSize);if(!fits(b)||occupied.some(o=>hit(b,o)))continue;occupied.push(b);const a=point(p);renderedPlaces.push({...p,screenX:a.x,screenY:a.y,pinSize,labelVisible:false,labelTop:pinSize+6});}
      // Arrange all names below first, before allowing fallback directions.
      const distance=p=>(p.screenX-rect.width/2)**2+(p.screenY-rect.height/2)**2;
      const labels=renderedPlaces.filter(p=>!p.labelVisible&&p.id!==d.expandedBuildingId&&d.scale>=1.15&&p.category!=='residence')
        .slice().sort((a,b)=>distance(a)-distance(b)||a.id.localeCompare(b.id));
      for(const p of labels)placeLabel(p,true);
      for(const p of labels)if(!p.labelVisible)placeLabel(p);
    }
    // Each animation frame shares one camera for artwork, pins, and collision checks.
    const userLocationScreen=d.userLocation?{...point(d.userLocation),radius:d.userLocation.radius*d.scale}:null;
    this.setData({...patch,mapAnimate:false,serviceCards,renderedPlaces,userLocationScreen});
  },
  onSearch(e) { this.setData({expandedBuildingId:null,mapServicePopup:null,query:e.detail.value,searching:!!e.detail.value,selected:null});this.updateResults(); },
  clearSearch() {this.setData({query:'',searching:false});this.updateResults();},
  showLifeServices() {this.setData({tab:'list',category:'life',query:'',searching:false,selected:null});this.updateResults();},
  chooseCategory(e) { this.setData({category:e.currentTarget.dataset.id,expandedBuildingId:null,mapServicePopup:null,selected:null});this.updateResults(); },
  changeTab(e) {this.setData({tab:e.currentTarget.dataset.id,expandedBuildingId:null,mapServicePopup:null,selected:null,searching:false,query:'',category:'all'});this.updateResults();},
  selectPlace(e) {this.selectId(e.currentTarget.dataset.id);},
  selectMapPlace(e) {
    if(Date.now()<(this.suppressTapUntil||0))return;
    const id=e.currentTarget.dataset.id,items=childrenByParent.get(id)||[];
    if(!items.length){this.selectPlace(e);return;}
    if(this.data.expandedBuildingId===id){this.closeMapServices();return;}
    const p=placesById.get(id),ticket=++this.cameraTicket;
    this.setData({expandedBuildingId:id,mapServicePopup:null,popupItems:items,popupBuilding:p,selected:null,related:[]});
    this.afterMapLayout(rect=>{if(ticket===this.cameraTicket&&this.data.expandedBuildingId===id)this.centerPlace(p,rect);});
  },
  closeMapServices(){++this.cameraTicket;this.setData({expandedBuildingId:null,mapServicePopup:null});this.setCamera({});},
  selectId(id) {
    const p=placesById.get(id);if(!p)return;
    this.setData({selected:p,expandedBuildingId:null,mapServicePopup:null,isSaved:this.data.saved.includes(id),searching:false,tab:'map',query:'',category:'all',visiblePlaces:mapPlaces(places,'all',p),related:childrenByParent.get(p.id)||[]});
    this.updateResults();
    const ticket=++this.cameraTicket;
    this.afterMapLayout(rect=>{if(ticket===this.cameraTicket)this.centerPlace(p,rect);});
  },
  dismissMapPreview() {
    if(Date.now()<(this.suppressTapUntil||0)||this.gesture&&this.gesture.moved)return;
    if(this.data.selected||this.data.expandedBuildingId)this.closeDetail();
  },
  closeDetail() {
    const ticket=++this.cameraTicket;
    this.cancelCameraMotion();
    this.setData({selected:null,related:[],isSaved:false,expandedBuildingId:null,mapServicePopup:null,popupBuilding:null,popupItems:[],cameraMoving:false});
    this.updateResults();
    this.afterMapLayout(()=>{if(ticket===this.cameraTicket)this.setCamera({});});
  },
  toggleSaved() {
    const p=this.data.selected;if(!p)return;
    const saved=this.data.saved.includes(p.id)?this.data.saved.filter(id=>id!==p.id):this.data.saved.concat(p.id);
    try { wx.setStorageSync(STORAGE_KEY,saved);this.setData({saved,isSaved:saved.includes(p.id)});this.updateResults(); }
    catch(e) {wx.showToast({title:'收藏未保存，请重试',icon:'none'});}
  },
  afterMapLayout(callback) {
    // Wait for the detail card / tab to finish layout before measuring.
    this.setData({},()=>{
      if(!wx.createSelectorQuery)return;
      wx.createSelectorQuery().in(this).select('.map-area').boundingClientRect(rect=>{
        if(!rect||!rect.width||!rect.height)return;
        this.mapRect=rect;callback(rect);
      }).exec();
    });
  },
  centerPlace(p,rect) {
    const scale=this.data.scale;
    this.setCamera({mapAnimate:true,mapX:rect.width/2-p.x/100*this.data.mapWidth*scale,mapY:rect.height/2-p.y/100*this.data.mapHeight*scale});
  },
  onReady(){if(!this.data.selected)this.resetMap();this.motionReady=true;},
  resetMap() {
    const ticket=++this.cameraTicket;
    this.afterMapLayout(rect=>{
      if(ticket!==this.cameraTicket)return;
      const {mapWidth,mapHeight}=this.data;
      const scale=Math.max(.5,Math.min(.85,(rect.width-20)/mapWidth,(rect.height-55)/mapHeight));
      this.setCamera({mapAnimate:true,scale,showMapLabels:scale>=1.15,mapX:(rect.width-mapWidth*scale)/2,mapY:(rect.height-mapHeight*scale)/2});
    });
  },
  zoomBy(delta) {
    const ticket=++this.cameraTicket;
    this.afterMapLayout(rect=>{
      if(ticket!==this.cameraTicket)return;
      const old=this.data.scale,scale=Math.max(.5,Math.min(1.6,old+delta));
      const cx=rect.width/2,cy=rect.height/2;
      this.setCamera({mapAnimate:true,scale,showMapLabels:scale>=1.15,mapX:cx-(cx-this.data.mapX)*scale/old,mapY:cy-(cy-this.data.mapY)*scale/old});
    });
  },
  zoomIn(){this.zoomBy(.15);},
  zoomOut(){this.zoomBy(-.15);},
  onMapTouchStart(e) {
    ++this.cameraTicket;
    this.cancelCameraMotion();
    if(!this.mapRect)return;
    const ts=e.touches;
    const pos=t=>({x:t.clientX-this.mapRect.left,y:t.clientY-this.mapRect.top});
    const a=pos(ts[0]),b=ts[1]?pos(ts[1]):null;
    this.gesture={count:ts.length,start:a,x:this.data.mapX,y:this.data.mapY,scale:this.data.scale,moved:false};
    if(b){const cx=(a.x+b.x)/2,cy=(a.y+b.y)/2;Object.assign(this.gesture,{distance:Math.hypot(a.x-b.x,a.y-b.y),worldX:(cx-this.data.mapX)/this.data.scale,worldY:(cy-this.data.mapY)/this.data.scale,moved:true});}
    this.setData({mapAnimate:false,cameraMoving:false});
  },
  onMapTouchMove(e) {
    const g=this.gesture;if(!g||!e.touches.length)return;
    if(e.touches.length!==g.count){this.onMapTouchStart(e);this.gesture.moved=true;return;}
    const a=e.touches[0],ax=a.clientX-this.mapRect.left,ay=a.clientY-this.mapRect.top;
    if(g.count>=2){
      const b=e.touches[1],bx=b.clientX-this.mapRect.left,by=b.clientY-this.mapRect.top;
      const scale=Math.max(.5,Math.min(1.6,g.scale*Math.hypot(ax-bx,ay-by)/Math.max(1,g.distance)));
      this.setCamera({scale,mapX:(ax+bx)/2-g.worldX*scale,mapY:(ay+by)/2-g.worldY*scale});g.moved=true;
    }else{
      const dx=ax-g.start.x,dy=ay-g.start.y;
      if(Math.hypot(dx,dy)>6)g.moved=true;
      if(g.moved)this.setCamera({mapX:g.x+dx,mapY:g.y+dy});
    }
  },
  onMapTouchEnd(e) {
    const moved=this.gesture&&this.gesture.moved;
    if(moved)this.suppressTapUntil=Date.now()+350;
    if(e.touches&&e.touches.length){this.onMapTouchStart(e);this.gesture.moved=!!moved;}
    else this.gesture=null;
    if(moved)this.setCamera({showMapLabels:this.data.scale>=1.15});
  },
  onResize(e){this.viewportWidth=e.size.windowWidth;this.setData({windowHeight:e.size.windowHeight});const p=this.data.expandedBuildingId?placesById.get(this.data.expandedBuildingId):this.data.selected;if(p){const ticket=++this.cameraTicket;this.afterMapLayout(r=>{if(ticket===this.cameraTicket)this.centerPlace(p,r);});}else this.resetMap();},
  openGuide(){this.setData({guide:true});},
  closeGuide(){this.setData({guide:false});},
  stop(){},
  copyAddress(){wx.setClipboardData({data:'宁波市鄞州区泰康东路199号 · 宁波诺丁汉大学'});},
  copyOfficial(){wx.setClipboardData({data:officialMap});},
  copyPlace(){const p=this.data.selected;if(p)wx.setClipboardData({data:`${p.name} · ${p.en}\n${p.locationHint?p.locationHint+'\n':''}${p.parentId?'楼栋/区域参考，入口请现场确认':'图面位置参考，入口请现场确认'}\n宁波诺丁汉大学，泰康东路199号\n请以官方地图及现场标识确认实际位置。`});},
  onShareAppMessage(){const p=this.data.selected;return {title:p?`一起探索宁诺 · ${p.name}`:'宁诺口袋地图 · 发现校园的小美好',path:'/pages/map/index'+(p?'?place='+p.id:'')};}
});
