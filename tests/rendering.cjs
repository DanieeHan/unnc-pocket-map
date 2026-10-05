// The map bridge must carry view data only; camera-dependent geometry still
// updates on every frame and cached priorities must survive selection changes.
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'..'),db=require(root+'/miniprogram/data/places');
let page,lastPatch;
vm.runInNewContext(fs.readFileSync(root+'/miniprogram/pages/map/index.js','utf8'),{
  require:id=>require(path.resolve(root,'miniprogram/pages/map',id)),Page:p=>page=p,wx:{}
});
page.setData=patch=>{lastPatch=patch;Object.assign(page.data,patch);};
page.mapRect={left:0,top:180,width:390,height:350};
const library=db.places.find(p=>p.id==='library');
const visible=db.mapPlaces(db.places,'all',null);
function camera(scale,x=195,y=175){return {scale,mapX:x-library.x/100*600*scale,mapY:y-library.y/100*579*scale};}
page.paintCamera({visiblePlaces:visible,selected:library,...camera(1.3)});
assert.equal(lastPatch.renderedPlaces[0].id,library.id,'Selected pin must have first priority');
const allowed=new Set(['id','x','y','category','code','markerText','mapLabel','hasChildren','serviceCount',
  'labelWidth','screenX','screenY','pinSize','labelVisible','labelOffset','labelTop']);
for(const p of lastPatch.renderedPlaces){
  for(const key of Object.keys(p))assert.ok(allowed.has(key),'Unexpected place content on bridge: '+key);
  assert.equal(p.serviceCount,db.places.filter(child=>child.parentId===p.id).length);
}
const compactBytes=Buffer.byteLength(JSON.stringify(lastPatch.renderedPlaces));
const fullBytes=Buffer.byteLength(JSON.stringify(lastPatch.renderedPlaces.map(p=>({...db.places.find(item=>item.id===p.id),...p}))));
assert.ok(compactBytes<fullBytes*.65,'Map markers must substantially reduce bridge payload');

// Reading unrelated content used to happen implicitly via {...place} on every
// render. Static label metrics should also stay cached during camera movement.
let labelReads=0;
const sparse={id:'sparse',x:library.x,y:library.y,category:'study',code:'S',major:true,
  get mapLabel(){labelReads++;return 'Sparse label';},
  get description(){throw Error('Map rendering must not read full place descriptions');}};
const samePoint={id:'other',x:library.x,y:library.y,category:'residence',code:'O',mapLabel:'Other'};
const list=[samePoint,sparse];
page.paintCamera({visiblePlaces:list,selected:null,...camera(1.3)});
assert.equal(page.data.renderedPlaces[0].id,'sparse','Cached priority order must preserve major pin');
const preparedReads=labelReads;
for(const [scale,x,y] of [[1.15,175,160],[1.6,215,150],[.8,195,175]]){
  page.paintCamera(camera(scale,x,y));
  assert.equal(labelReads,preparedReads,'Camera frames must reuse measured label width');
  for(const pin of page.data.renderedPlaces){
    assert.ok(Math.abs(pin.screenX-page.data.mapX-pin.x/100*600*scale)<1e-8);
    assert.ok(Math.abs(pin.screenY-page.data.mapY-pin.y/100*579*scale)<1e-8);
  }
}
page.paintCamera({selected:samePoint,...camera(1.3)});
assert.equal(page.data.renderedPlaces[0].id,'other','Selection must override cached priority order');
assert.equal(page.data.renderedPlaces[0].pinSize,28);
assert.equal(page.data.renderedPlaces[0].labelVisible,true);
const replacement={...samePoint,id:'replacement',mapLabel:'Replacement'};
page.paintCamera({visiblePlaces:[replacement],selected:null,...camera(1.3)});
assert.deepEqual(Array.from(page.data.renderedPlaces,p=>p.id),['replacement'],'New filter results must invalidate layout list');
console.log(`PASS: compact map payload ${compactBytes}/${fullBytes} bytes; static label cache, service badges, selected priority, changed filter list and per-frame alignment`);
