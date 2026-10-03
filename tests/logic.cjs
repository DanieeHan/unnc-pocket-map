const assert=require('node:assert/strict');const fs=require('node:fs');const vm=require('node:vm');const path=require('node:path');
const root=path.resolve(__dirname,'..');const db=require(root+'/miniprogram/data/places');let page;let store=[];let fail=false;
const wx={createSelectorQuery(){let cb;return {in(){return this},select(){return this},boundingClientRect(f){cb=f;return this},exec(){cb({left:0,top:160,width:390,height:page.data.selected?350:500})}}},getWindowInfo:()=>({windowWidth:390,windowHeight:844,statusBarHeight:44}),getStorageSync:()=>store,setStorageSync:(k,v)=>{if(fail)throw Error('full');store=v},showShareMenu(){},setClipboardData(){},showToast(){}};
vm.runInNewContext(fs.readFileSync(root+'/miniprogram/pages/map/index.js','utf8'),{require:id=>require(path.resolve(root,'miniprogram/pages/map',id)),Page:p=>page=p,wx});page.setData=(p,cb)=>{Object.assign(page.data,p);if(cb)cb()};page.onLoad({});
assert.equal(page.data.results.length,66);assert.equal(db.searchPlaces('TB','all')[0].id,'tb');assert.equal(db.searchPlaces('Peter Mansfield','all')[0].id,'pmb');assert.equal(db.searchPlaces('图书馆','all')[0].id,'library');assert.equal(db.searchPlaces('xyz','all').length,0);
page.chooseCategory({currentTarget:{dataset:{id:'sport'}}});assert.equal(page.data.results.length,3);
page.selectId('library');assert.equal(page.data.selected.id,'library');page.toggleSaved();assert.equal(store[0],'library');assert.equal(page.data.isSaved,true);
page.changeTab({currentTarget:{dataset:{id:'saved'}}});assert.equal(page.data.results.length,1);page.selectId('library');page.toggleSaved();assert.equal(page.data.isSaved,false);
fail=true;page.toggleSaved();assert.equal(page.data.saved.length,0);fail=false;
page.selectId('nonexistent');assert.equal(page.data.selected.id,'library');assert.match(page.onShareAppMessage().path,/place=library/);
for(let i=0;i<20;i++)page.zoomIn();assert.equal(page.data.scale,1.6);for(let i=0;i<20;i++)page.zoomOut();assert.equal(page.data.scale,.5);
store=['bad','trent'];page.onLoad({place:'tb'});assert.equal(page.data.saved.length,1);assert.equal(page.data.selected.id,'tb');
for(const f of ['project.config.json','miniprogram/app.json','miniprogram/sitemap.json','miniprogram/pages/map/index.json'])JSON.parse(fs.readFileSync(root+'/'+f,'utf8'));
assert.equal(new Set(db.places.map(p=>p.id)).size,66);assert.ok(db.places.every(p=>p.x>=0&&p.x<=100&&p.y>=0&&p.y<=100));
assert.equal(db.searchPlaces('2','all').length,1);assert.equal(db.searchPlaces('2','all')[0].id,'pmb');assert.equal(db.searchPlaces('24','all')[0].id,'db');
console.log('PASS: search, categories, empty results, favorites, storage failure, share, invalid deep link, zoom bounds, saved-data validation and JSON configs');

// Coverage against the numbered building/area index on the official map.
for(const code of [...Array.from({length:26},(_,i)=>String(i+1)),'28','29','30','35','37','38',...'ABCDEFGH'])assert.ok(db.places.some(p=>p.code===code),'Missing official code '+code);
for(const code of [...Array.from({length:10},(_,i)=>String(i+11)),'22','23']){
 const matches=db.searchPlaces(code+'号楼','residence');assert.equal(matches.length,1,'Dorm '+code);assert.ok(db.mapPlaces(db.places,'all',null).some(p=>p.id===matches[0].id),'Dorm missing from overview '+code);
}
assert.equal(db.places.find(p=>p.id==='trent').name,'行政楼');
assert.equal(db.places.find(p=>p.id==='library').name,'李达三叶耀珍伉俪李本俊图书馆');
assert.equal(db.places.filter(p=>p.code==='37').length,2);assert.equal(db.places.filter(p=>p.code==='38').length,2);
page.selectId('residence');assert.deepEqual(Array.from(page.data.related.filter(p=>p.sourceType!=="user-photo"),p=>p.code),['F','G']);
page.selectId('third-canteen');assert.ok(page.data.visiblePlaces.some(p=>p.code==='F'));
console.log('PASS: complete numbered index, all dorms on map, official names, two sports areas/two gardens, building services');
// Camera uses the measured viewport, including the smaller area above a detail card.
for(const id of ['gate','sports','residence','library']){
 page.selectId(id);const p=page.data.selected;
 assert.ok(Math.abs(page.data.mapX+p.x/100*600*page.data.scale-195)<1e-8);
 assert.ok(Math.abs(page.data.mapY+p.y/100*579*page.data.scale-175)<1e-8);
 page.zoomIn();assert.ok(Math.abs(page.data.mapX+p.x/100*600*page.data.scale-195)<1e-8);
}
page.selectId('library');const start={x:page.data.mapX,y:page.data.mapY};
page.onMapTouchStart({touches:[{clientX:100,clientY:250}]});page.onMapTouchMove({touches:[{clientX:180,clientY:290}]});page.onMapTouchEnd({touches:[]});
assert.equal(page.data.mapX,start.x+80);assert.equal(page.data.mapY,start.y+40);
page.selectMapPlace({currentTarget:{dataset:{id:'gate'}}});assert.equal(page.data.selected.id,'library');
page.selectPlace({currentTarget:{dataset:{id:'gate'}}});assert.equal(page.data.selected.id,'gate');
const oldScale=page.data.scale,cx=150,cy=140,worldX=(cx-page.data.mapX)/oldScale,worldY=(cy-page.data.mapY)/oldScale;
page.onMapTouchStart({touches:[{clientX:100,clientY:300},{clientX:200,clientY:300}]});page.onMapTouchMove({touches:[{clientX:75,clientY:300},{clientX:225,clientY:300}]});page.onMapTouchEnd({touches:[]});
assert.ok(Math.abs(page.data.mapX+worldX*page.data.scale-cx)<1e-8);assert.ok(Math.abs(page.data.mapY+worldY*page.data.scale-cy)<1e-8);
console.log('PASS: viewport centering, zoom anchor, drag persistence, drag tap suppression and pinch anchor');
const photoPlaces=db.places.filter(p=>p.sourceType==='user-photo');
assert.equal(photoPlaces.length,18);
for(const p of photoPlaces){
 assert.ok(db.searchPlaces(p.name,'life').some(r=>r.id===p.id));
 page.selectId(p.parentId);assert.ok(page.data.related.some(r=>r.id===p.id));
 page.selectId(p.id);assert.ok(page.data.visiblePlaces.some(r=>r.id===p.id));
 assert.ok(p.approximate);assert.match(p.description,/照片未注明日期/);
}
assert.equal(db.searchPlaces('7-11','life')[0].id,'service-seven-eleven-2');
assert.equal(db.mapPlaces(db.places,'all',null).length,41);
console.log('PASS: 18 photo services searchable and linked to buildings; approximate source labels; overview remains 41 markers');
page.suppressTapUntil=0;
page.selectMapPlace({currentTarget:{dataset:{id:'residence-12'}}});
assert.equal(page.data.expandedBuildingId,'residence-12');
assert.ok(page.data.popupItems.some(p=>p.id==='service-luckin'));
assert.ok(page.data.mapServicePopup.left>=0);
assert.ok(page.data.mapServicePopup.left+page.data.mapServicePopup.width<=390);
page.selectMapPlace({currentTarget:{dataset:{id:'residence-12'}}});assert.equal(page.data.expandedBuildingId,null);
page.selectMapPlace({currentTarget:{dataset:{id:'residence-16'}}});
assert.ok(page.data.popupItems.some(p=>p.id==='service-kfc'));
page.selectId('service-kfc');assert.equal(page.data.expandedBuildingId,null);
assert.equal(page.data.selected.id,'service-kfc');
console.log('PASS: marker opens local service list, repeat click closes, choosing a service closes and selects');
const originalQuery=wx.createSelectorQuery;
let cameraRect={left:0,top:180,width:390,height:460},pending=null;
wx.createSelectorQuery=()=>{let cb;return {in(){return this},select(){return this},boundingClientRect(f){cb=f;return this},exec(){if(pending)pending.push(()=>cb(cameraRect));else cb(cameraRect);}}};
for(const [width,height] of [[320,240],[390,460],[430,540]])for(const scale of [.5,1,1.6])for(const id of ['residence-12','residence']){
 cameraRect={left:0,top:180,width,height};page.closeMapServices();page.setData({scale});page.selectMapPlace({currentTarget:{dataset:{id}}});
 const pin=page.data.renderedPlaces.find(p=>p.id===id),menu=page.data.mapServicePopup;
 assert.ok(Math.abs(pin.screenX-width/2)<1e-8);assert.ok(Math.abs(pin.screenY-height/2)<1e-8);
 assert.ok(menu.left>=0&&menu.top>=0&&menu.left+menu.width<=width&&menu.top+menu.height<=height);
 assert.ok(menu.left+menu.width<=pin.screenX-14||menu.left>=pin.screenX+14||menu.top+menu.height<=pin.screenY-14||menu.top>=pin.screenY+14);
}
pending=[];page.closeMapServices();page.selectMapPlace({currentTarget:{dataset:{id:'residence-12'}}});page.selectMapPlace({currentTarget:{dataset:{id:'residence'}}});
const callbacks=pending;pending=null;callbacks.reverse().forEach(cb=>cb());assert.equal(page.data.expandedBuildingId,'residence');
assert.equal(page.data.renderedPlaces[0].id,'residence');
pending=[];page.closeMapServices();page.selectMapPlace({currentTarget:{dataset:{id:'residence-12'}}});page.closeMapServices();
const cancelled=pending;pending=null;cancelled.forEach(cb=>cb());assert.equal(page.data.expandedBuildingId,null);assert.equal(page.data.mapServicePopup,null);
wx.createSelectorQuery=originalQuery;
console.log('PASS: 12/19 centered at three viewport sizes and scales, menus clear pins, stale open/close callbacks ignored');
