// Shared by the mini program and offline calibration tools. GCJ-02 throughout.
const R=6378137,rad=Math.PI/180;
function localMeters(longitude,latitude,origin){
  return {x:R*(longitude-origin.longitude)*rad*Math.cos(origin.latitude*rad),y:R*(latitude-origin.latitude)*rad};
}
function ready(c){
  return !!(c&&c.enabled&&c.coordinateSystem==='gcj02'&&c.mapWidth===600&&c.mapHeight===579&&
    c.origin&&Number.isFinite(c.origin.longitude)&&Number.isFinite(c.origin.latitude)&&
    Array.isArray(c.matrix)&&c.matrix.length===6&&c.matrix.every(Number.isFinite)&&
    Math.abs(c.matrix[0]*c.matrix[4]-c.matrix[1]*c.matrix[3])>1e-10&&
    Array.isArray(c.campusBoundary)&&c.campusBoundary.length>=3&&c.campusBoundary.every(p=>Array.isArray(p)&&p.length===2&&p.every(Number.isFinite))&&
    c.validation&&Number.isInteger(c.validation.checkCount)&&c.validation.checkCount>=3&&Number.isFinite(c.validation.maxErrorMeters)&&c.validation.maxErrorMeters>=0&&c.validation.maxErrorMeters<=20);
}
function inside(x,y,polygon){
  let yes=false;
  for(let i=0,j=polygon.length-1;i<polygon.length;j=i++){
    const [xi,yi]=polygon[i],[xj,yj]=polygon[j];
    if(((yi>y)!==(yj>y))&&x<(xj-xi)*(y-yi)/(yj-yi)+xi)yes=!yes;
  }
  return yes;
}
function locate(fix,c){
  if(!ready(c))return {status:'uncalibrated'};
  if(!fix||!Number.isFinite(fix.longitude)||!Number.isFinite(fix.latitude)||Math.abs(fix.longitude)>180||Math.abs(fix.latitude)>90||!Number.isFinite(fix.accuracy)||fix.accuracy<=0||fix.accuracy>80)return {status:'inaccurate'};
  if(!inside(fix.longitude,fix.latitude,c.campusBoundary))return {status:'outside'};
  const p=localMeters(fix.longitude,fix.latitude,c.origin),m=c.matrix;
  const x=m[0]*p.x+m[1]*p.y+m[2],y=m[3]*p.x+m[4]*p.y+m[5];
  if(x<0||x>c.mapWidth||y<0||y>c.mapHeight)return {status:'outside'};
  // Largest singular value bounds the projected uncertainty ellipse.
  const a=m[0]*m[0]+m[3]*m[3],b=m[0]*m[1]+m[3]*m[4],d=m[1]*m[1]+m[4]*m[4];
  const pixelsPerMeter=Math.sqrt((a+d+Math.sqrt((a-d)**2+4*b*b))/2);
  return {status:'located',x:x/c.mapWidth*100,y:y/c.mapHeight*100,accuracy:Math.round(fix.accuracy),radius:(fix.accuracy+c.validation.maxErrorMeters)*pixelsPerMeter};
}
module.exports={localMeters,ready,inside,locate};
