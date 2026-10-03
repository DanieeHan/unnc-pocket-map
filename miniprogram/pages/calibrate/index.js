const KEY='unnc.calibration.samples.v1';
Page({
  data:{name:'',role:'control',point:null,fix:null,rows:[],busy:false,message:'在室外参照点采集，再点击底图中同一位置。'},
  onLoad(){try{const rows=wx.getStorageSync(KEY);if(Array.isArray(rows))this.setData({rows});}catch(e){}this.ticket=0;},
  onHide(){++this.ticket;if(this.timer)clearTimeout(this.timer);this.setData({busy:false,fix:null});},
  onUnload(){this.onHide();},
  nameChange(e){this.setData({name:e.detail.value});},
  roleChange(e){this.setData({role:e.detail.value});},
  pickPoint(e){const t=e.changedTouches&&e.changedTouches[0];const x=t?t.clientX:e.detail.x,y=t?t.clientY:e.detail.y;
    wx.createSelectorQuery().in(this).select('.calibration-map').boundingClientRect(r=>{if(r&&r.width&&r.height)this.setData({point:{x:Math.max(0,Math.min(600,(x-r.left)/r.width*600)),y:Math.max(0,Math.min(579,(y-r.top)/r.height*579))}});}).exec();},
  capture(){
    if(this.data.busy)return;
    const ticket=++this.ticket;this.setData({busy:true,fix:null,message:'正在获取本次位置…'});
    const fail=()=>{if(ticket!==this.ticket)return;++this.ticket;clearTimeout(this.timer);this.setData({busy:false,message:'采集失败，请检查微信授权、后台接口权限和手机定位服务。'});};
    this.timer=setTimeout(fail,30000);
    const request=()=>{if(ticket!==this.ticket)return;wx.getLocation({type:'gcj02',isHighAccuracy:true,highAccuracyExpireTime:5000,success:r=>{
      if(ticket!==this.ticket)return;clearTimeout(this.timer);
      if(!Number.isFinite(r.longitude)||!Number.isFinite(r.latitude)||!Number.isFinite(r.accuracy)||r.accuracy<=0||r.accuracy>30){this.setData({busy:false,message:'本次精度不足（需 ≤30 米），请在开阔处重新采集。'});return;}
      this.setData({busy:false,fix:{longitude:r.longitude,latitude:r.latitude,accuracy:r.accuracy,capturedAt:new Date().toISOString()},message:'位置已获取，请确认名称和底图位置后保存。'});
    },fail});};
    if(wx.requirePrivacyAuthorize)wx.requirePrivacyAuthorize({success:request,fail});else request();
  },
  save(){
    const {name,role,point,fix,rows}=this.data;
    if(!name.trim()||!point||!fix){wx.showToast({title:'请填写名称、选点并采集位置',icon:'none'});return;}
    if(Date.now()-Date.parse(fix.capturedAt)>120000){this.setData({fix:null,message:'采样已超过两分钟，请在当前点重新采集。'});return;}
    const next=rows.concat({name:name.trim(),role,...point,...fix});
    try{wx.setStorageSync(KEY,next);this.setData({rows:next,name:'',point:null,fix:null,message:'已保存到本机。前往下一个参照点。'});}catch(e){wx.showToast({title:'保存失败，请重试',icon:'none'});}
  },
  remove(e){const rows=this.data.rows.filter((_,i)=>i!==Number(e.currentTarget.dataset.index));try{wx.setStorageSync(KEY,rows);this.setData({rows});}catch(e){wx.showToast({title:'删除未保存',icon:'none'});}},
  exportSamples(){
    if(!this.data.rows.length){wx.showToast({title:'请先采集参照点',icon:'none'});return;}
    wx.setClipboardData({data:JSON.stringify({coordinateSystem:'gcj02',mapWidth:600,mapHeight:579,points:this.data.rows},null,2)});
  }
});
