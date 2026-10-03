const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'..'),db=require(root+'/miniprogram/data/places');
let page;
vm.runInNewContext(fs.readFileSync(root+'/miniprogram/pages/map/index.js','utf8'),{
  require:id=>require(path.resolve(root,'miniprogram/pages/map',id)),Page:p=>page=p,wx:{}
});
page.setData=patch=>Object.assign(page.data,patch);
const library=db.places.find(p=>p.id==='library');
function draw(list,scale,x,y,width=390,height=460,selected=null){
  page.mapRect={left:0,top:180,width,height};
  page.paintCamera({visiblePlaces:list,selected,expandedBuildingId:null,locationMessage:'',userLocation:null,
    scale,mapX:x-library.x/100*600*scale,mapY:y-library.y/100*579*scale});
  return page.data.renderedPlaces.find(p=>p.id===library.id);
}
const overlaps=(a,b)=>a.x<b.x+b.w+4&&a.x+a.w+4>b.x&&a.y<b.y+b.h+4&&a.y+a.h+4>b.y;
const textBox=p=>({x:p.screenX+p.labelOffset,y:p.screenY-p.pinSize/2+p.labelTop,w:p.labelWidth,h:20});
const pinBox=p=>({x:p.screenX-p.pinSize/2,y:p.screenY-p.pinSize/2-(p.hasChildren?6:0),w:p.pinSize+(p.hasChildren?6:0),h:p.pinSize+(p.hasChildren?6:0)});
// A dense-center pin immediately below used to suppress the name entirely.
for(const scale of [1.15,1.3,1.6]){
  const obstacle={...library,id:'obstacle',category:'residence',mapLabel:'obstacle',y:library.y+40/(579*scale)*100};
  const pin=draw([library,obstacle],scale,195,230);
  assert.equal(pin.labelVisible,true,'Center name should use free space above');
  assert.ok(textBox(pin).y+20<pin.screenY-pin.pinSize/2);
  assert.ok(!overlaps(textBox(pin),pinBox(page.data.renderedPlaces.find(p=>p.id==='obstacle'))));
}
for(const [width,height] of [[320,300],[390,460],[430,540]]){
  for(const [x,y] of [[width/2,height/2],[85,height-90],[width/2,height-45]]){
    const pin=draw([library],1.3,x,y,width,height);
    assert.equal(pin.labelVisible,true,'Name visible at center, lower-left and bottom edge');
    const box=textBox(pin);
    assert.ok(box.x>=4&&box.x+box.w<=width-4&&box.y>=4&&box.y+box.h<=height-26);
  }
  // Actual campus records: render coordinates must agree with collision geometry.
  draw(db.mapPlaces(db.places,'all',null),1.3,width/2,height/2,width,height);
  const pins=page.data.renderedPlaces,labels=pins.filter(p=>p.labelVisible);
  assert.ok(labels.some(p=>p.id==='library'),'Central library name must remain visible');
  for(let i=0;i<labels.length;i++){
    const box=textBox(labels[i]);
    for(const pin of pins)assert.ok(!overlaps(box,pinBox(pin)),`Label ${labels[i].id} overlaps ${pin.id}`);
    for(const other of labels.slice(i+1))assert.ok(!overlaps(box,textBox(other)),'Labels overlap');
  }
}
assert.equal(draw([library],1,195,230).labelVisible,false,'Overview stays uncluttered');
assert.equal(draw([library],1,195,230,390,460,library).labelVisible,true,'Selected name visible at low zoom');
assert.equal(db.searchPlaces('3G','all')[0].id,'field-west');
assert.equal(db.searchPlaces('pitch','all')[0].id,'field');
assert.equal(db.places.find(p=>p.id==='field-west').mapLabel,'3G');
assert.equal(db.places.find(p=>p.id==='field').mapLabel,'Pitch');
assert.equal(db.searchPlaces('室外运动场地','all').length,2);
// The diagonal 3/4/5 cluster must keep every name below its own numbered pin.
for(const scale of [1.3,1.6]){
  const center=db.places.find(p=>p.id==='auditorium');
  page.mapRect={left:0,top:180,width:390,height:460};
  page.paintCamera({visiblePlaces:db.mapPlaces(db.places,'all',null),selected:null,expandedBuildingId:null,
    scale,mapX:195-center.x/100*600*scale,mapY:230-center.y/100*579*scale});
  for(const id of ['tb','auditorium','pb']){
    const pin=page.data.renderedPlaces.find(p=>p.id===id);
    assert.ok(pin&&pin.labelVisible,`Building ${id} name missing`);
    assert.ok(textBox(pin).y>pin.screenY+pin.pinSize/2,`Building ${id} name must be below`);
    assert.ok(pin.mapLabel.startsWith(pin.code+' '),'Name must identify its building number');
  }
}
const turf=db.places.find(p=>p.id==='field-west');
assert.equal(turf.code,'37','Keep official lookup number');
assert.equal(turf.markerText,'3G','Show 3G directly on the map pin');
page.paintCamera({visiblePlaces:[turf],scale:.5,mapX:195-turf.x/100*600*.5,mapY:230-turf.y/100*579*.5});
assert.ok(page.data.renderedPlaces[0].pinSize>=24,'Two-character 3G marker must remain legible');
assert.match(fs.readFileSync(root+'/miniprogram/pages/map/index.wxml','utf8'),/\{\{item\.markerText \|\| item\.code\}\}/);
console.log('PASS: center/edge labels, alternate placement, viewport bounds, real campus collision geometry, zoom threshold and 3G/Pitch names');
