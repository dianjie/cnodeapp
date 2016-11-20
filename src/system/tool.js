/**
 * Created by yzsoft on 16/5/13.
 */
import {store} from 'REDUX/store'
import {setSystemNetwork,setSystemNoLoadImg} from 'REDUX/action';
export  const  checkMobile=(mobile)=>{
  let phone = mobile;
  let reg = /^1[3|4|5|7|8]\d{9}$/;
  let result = reg.test(phone);
  return result;
};
export  const  getTopicAndBg =(item)=>{
  //抽屉菜单（item为String）和主题列表（item为Object）有使用到
  let isObject=false;
  if (item !== 'null' && typeof item === 'object' && item instanceof Object) {
    isObject=true
  }
  if(!isObject){
    item={tab:item}
  }
  if(item.top){
    return {type:'置顶',bgColor:"#33CC66"};
  }
  if(item.good){
    return {type:'精华',bgColor:"#33CC66"};
  }
  switch (item.tab){
    case 'share':
      return {type:'分享',bgColor:"#33CCFF"};
    case 'ask':
      return {type:'问答',bgColor:"#CCCCCC"};
    case 'job':
      return {type:'招聘',bgColor:"#CC00CC"};
    case 'good':
      return {type:'精华',bgColor:"#33CC66"};
    case 'all':
      return {type:'全部',bgColor:"#108ee9"};
    default:
      return {type:'暂无',bgColor:"#CCCCCC"};
  }
};
export const dateDiff = function(hisTime,nowTime){
  let history=hisTime;
  if(!history) return '';
  else if(typeof(hisTime)=='string') history=new Date(hisTime).getTime();
  let now =nowTime?nowTime:new Date().getTime(),
      diffValue = now - history,
      result='',
      minute = 1000 * 60,
      hour = minute * 60,
      day = hour * 24,
      month = day * 30,
      year = month * 12,

      _year = diffValue/year,
      _month =diffValue/month,
      _week =diffValue/(7*day),
      _day =diffValue/day,
      _hour =diffValue/hour,
      _min =diffValue/minute;

  if(_year>=1) result=Math.ceil(_year) + "年前";
  else if(_month>=1) result=Math.ceil(_month) + "月前";
  else if(_week>=1) result=Math.ceil(_week) + "周前";
  else if(_day>=1) result=Math.ceil(_day) +"天前";
  else if(_hour>=1) result=Math.ceil(_hour) +"小时前";
  else if(_min>=1) result=Math.ceil(_min) +"分钟前";
  else result="刚刚";
  return result;
};
export const replaceContent=(content)=>{
  let state=store.getState();
  let {system:{network,loadImg}}=state;
  //替换链接跳转到https://cnodejs.org的链接
  content=content.replace(/https:\/\/cnodejs.org/ig,'#');
  //替换用户主页
  content=content.replace(/href="\/user/ig,'href="#/user');
  //让所有超链接新开页面打开
  content = content.replace(/<a(.*?)>/ig, function($){
    //域内链接
    if($.indexOf('href="#')!== -1){
        return $;
    }else {
        //域外链接
        let url=null;
        let matchRes=$.match(/href="(.*?)"/);
        //排除插入空链接问题：<a href>
        url=matchRes?matchRes[1]:"";
        let clickFun=`window.open('${url}', '_system');`;
        return `<a href="javascript:void(0)" onclick="${clickFun}">`;
    }
  });
  content=content.replace(/src="\/\//ig,function () {
      let state=store.getState();
      let {system:{noLoadImg}}=state;
      //loadImgState为false是wifi（加载），否则不加载
      let loadImgState=getLoadImgState();
      //裂图处理
      if(noLoadImg){
          return '';
      }else if(loadImgState) {
          store.dispatch(setSystemNoLoadImg(loadImgState));
          return '';
      }else {
          //app下的默认http:
          if(window.location.protocol=='file:'){
              return `src="http://`
          }else {
              return `src="${window.location.protocol}//`
          }
      }
  });
  return content;
};
export const setTail=(content)=>{
  return `${content}
          使用[cnode[antd-moblie]版](https://github.com/dianjie/cnodeapp)`
};
export const getConnection=()=>{
    //开发调试直接返回wifi，打包手机app则利用插件检测
    if(!navigator.app) return 'WiFi';
    let networkState = navigator.connection.type;
    let states = {};
    if(Connection){
        states[Connection.UNKNOWN]  = 'Unknown';
        states[Connection.ETHERNET] = 'Ethernet';
        states[Connection.WIFI]     = 'WiFi';
        states[Connection.CELL_2G]  = '2G';
        states[Connection.CELL_3G]  = '3G';
        states[Connection.CELL_4G]  = '4G';
        states[Connection.CELL]     = 'generic';
        states[Connection.NONE]     = 'No network';
    };
    return states[networkState];
};
export const  getLoadImgState=()=>{
    let networkState=getConnection();
    let noLoadImg=networkState=='WiFi'?false:true;
    return noLoadImg;
};
//某些头像地址还是//情况
export const replaceImgUrl=(url)=>{
    let state=store.getState();
    let {system:{noLoadImg}}=state;
    //loadImgState为false是wifi（加载），否则不加载
    let loadImgState=getLoadImgState();
    //两种情况，一本来不加载图片，二，加载图片，但网络不是wifi环境
    if(noLoadImg){
        return './lib/icon.png'
    }else if(loadImgState) {
        store.dispatch(setSystemNoLoadImg(loadImgState));
        return './lib/icon.png';
    }else {
        if(url.indexOf('//')==0){
            return `http:${url}`
        }else {
            return url
        }
    }
};
export const getParameterByName=(name, url)=>{
    if (!url) {
        url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
};
