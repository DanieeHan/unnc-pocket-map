// Usage: node scripts/calibrate-location.cjs samples.json candidate.json
// Output remains disabled until independent outdoor field acceptance.
const fs=require('node:fs');
const {localMeters}=require('../miniprogram/utils/location');
function solve(a,b){
  const m=a.map((r,i)=>r.concat(b[i]));
  for(let k=0;k<3;k++){
    let pivot=k;for(let i=k+1;i<3;i++)if(Math.abs(m[i][k])>Math.abs(m[pivot][k]))pivot=i;
    if(Math.abs(m[pivot][k])<1e-9)throw Error('参照点共线或过于集中，请沿校园四周和中部重新选点。');
    [m[k],m[pivot]]=[m[pivot],m[k]];const divisor=m[k][k];for(let j=k;j<4;j++)m[k][j]/=divisor;
    for(let i=0;i<3;i++)if(i!==k){const f=m[i][k];for(let j=k;j<4;j++)m[i][j]-=f*m[k][j];}
  }return m.map(r=>r[3]);
}
function hull(points){
  const p=points.map(r=>[r.longitude,r.latitude]).sort((a,b)=>a[0]-b[0]||a[1]-b[1]);
  const cross=(o,a,b)=>(a[0]-o[0])*(b[1]-o[1])-(a[1]-o[1])*(b[0]-o[0]);
  const part=arr=>{const out=[];for(const q of arr){while(out.length>=2&&cross(out[out.length-2],out[out.length-1],q)<=0)out.pop();out.push(q);}return out;};
  return part(p).slice(0,-1).concat(part(p.slice().reverse()).slice(0,-1));
}
function calibrate(input){
  if(input.coordinateSystem!=='gcj02'||input.mapWidth!==600||input.mapHeight!==579)throw Error('必须使用 GCJ-02 与 600×579 底图坐标。');
  const points=input.points;
  if(!Array.isArray(points))throw Error('缺少 points 数组。');
  for(const p of points)if(!['control','check'].includes(p.role)||![p.longitude,p.latitude,p.x,p.y,p.accuracy].every(Number.isFinite)||Math.abs(p.longitude)>180||Math.abs(p.latitude)>90||p.x<0||p.x>600||p.y<0||p.y>579||p.accuracy<=0||p.accuracy>30)throw Error('存在无效坐标、角色或精度超过 30 米的参照点。');
  const controls=points.filter(p=>p.role==='control'),checks=points.filter(p=>p.role==='check');
  if(controls.length<6||checks.length<3)throw Error('至少需要 6 个校准点和 3 个独立验证点。');
  const origin={longitude:controls.reduce((s,p)=>s+p.longitude,0)/controls.length,latitude:controls.reduce((s,p)=>s+p.latitude,0)/controls.length};
  const m=Array.from({length:3},()=>[0,0,0]),bx=[0,0,0],by=[0,0,0];
  for(const p of controls){const q=localMeters(p.longitude,p.latitude,origin),v=[q.x,q.y,1];for(let i=0;i<3;i++){bx[i]+=v[i]*p.x;by[i]+=v[i]*p.y;for(let j=0;j<3;j++)m[i][j]+=v[i]*v[j];}}
  const matrix=solve(m,bx).concat(solve(m,by)),[a,b,c,d,e,f]=matrix,det=a*e-b*d;
  if(Math.abs(det)<1e-10)throw Error('拟合矩阵不可逆，请检查图片选点。');
  const errors=checks.map(p=>{const q=localMeters(p.longitude,p.latitude,origin),dx=a*q.x+b*q.y+c-p.x,dy=d*q.x+e*q.y+f-p.y;return {name:p.name,errorMeters:Math.hypot((e*dx-b*dy)/det,(-d*dx+a*dy)/det)};});
  const maxErrorMeters=Math.max(...errors.map(p=>p.errorMeters));
  if(maxErrorMeters>20)throw Error('独立验证最大误差 '+maxErrorMeters.toFixed(1)+' 米，超过 20 米门槛。请检查坐标系、选点与图面形变。');
  // Conservative coverage hull: do not extrapolate beyond measured control points.
  return {enabled:false,coordinateSystem:'gcj02',mapWidth:600,mapHeight:579,origin,matrix,campusBoundary:hull(controls),validation:{checkCount:checks.length,maxErrorMeters,rmsErrorMeters:Math.sqrt(errors.reduce((s,p)=>s+p.errorMeters**2,0)/checks.length),checks:errors},note:'候选配置，尚未启用。范围为校准点凸包，可能小于实际校园；校内真机验收后再启用。'};
}
if(require.main===module){try{const [input,output]=process.argv.slice(2);if(!input||!output)throw Error('用法：node scripts/calibrate-location.cjs samples.json candidate.json');const c=calibrate(JSON.parse(fs.readFileSync(input,'utf8')));fs.writeFileSync(output,JSON.stringify(c,null,2)+'\n',{flag:'wx'});console.log('已输出禁用状态的候选配置。验证最大误差：'+c.validation.maxErrorMeters.toFixed(1)+' 米。');}catch(e){console.error(e.message);process.exitCode=1;}}
module.exports={calibrate};
