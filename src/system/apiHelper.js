/**
 * Created by yzsoft on 16/3/16.
 */
import {apiHostUrl,getSessionData} from './system'
import {api} from './api'
import {Toast} from 'antd-mobile'
import ajax from '@fdaciuk/ajax'
//根据 key 获取 api 对应的 url
export const getApi = (key)=> {
    let obj=null;
    for(let i=0,len=api.length;i<len;i++){
        if(api[i].key==key){
            obj=api[i];
            return obj ;
        }
    }
};
const serializeData=(obj,isQuery,secObj)=>{
    let result='',secRes='';
    //cnode的接口有两种形式，获取主题详情和其他有区别，所以加了两层判断
    if(typeof(obj) === 'object'){
        for (let key in obj){
            let value=obj[key];
            if(isQuery){
                result+=`${encodeURIComponent(key)}=${encodeURIComponent(value)}&`
            }else {
                result+=`${encodeURIComponent(value)}/`
            }
        }
        //去除最后一个&字符或/
        result=result.slice(0,-1);
    }
    //获取主题详情特别点，通过传入第二个对象拼接url
    if(!isQuery && typeof(secObj) === 'object'){
        for (let key in secObj){
            let value=secObj[key];
            secRes+=`${encodeURIComponent(key)}=${encodeURIComponent(value)}&`
        }
        secRes=secRes.slice(0,-1);
        result+='?'+secRes;
    }
    return result;
};
export const callApi = (key, data={},isQuery=true,secObj={})=> {
    let apiObj = getApi(key);
    if (!apiObj) {
        return false;
    }
    let url=apiHostUrl+apiObj.url,
        firstText='',
        method = apiObj.method;
    //去除url后面的/字符
    if(url.endsWith('/')) url=url.slice(0,-1);
    if(method.toLowerCase()=='get'&& typeof (data) === 'object'){
        if(isQuery){
            firstText='?';
        }else {
            firstText='/';
        }
        url+=firstText+serializeData(data,isQuery,secObj);
    }
    return operateData(url, method, data)
};
//操作数据的方法
export const operateData = (url, method, data)=> {
    return ajax({url: url, method: method, data: data})
};