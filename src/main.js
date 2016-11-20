import React from 'react'
import {render} from 'react-dom';
import 'babel-polyfill';
import {Provider} from 'react-redux';
import {setSystemNoLoadImg} from 'REDUX/action';
import {getConnection} from 'SYSTEM/tool';
import './css/index.css'
import './css/simplemde.css'
let rootDocument=document.getElementById('app');
import {store} from './redux/store'
import RouterContent from './router'
//为了处理抽屉菜单省流量默认选中问题
function checkConnection() {
    let networkState=getConnection();
    store.dispatch(setSystemNoLoadImg(networkState=='WiFi'?false:true));
}
document.addEventListener("deviceready", function () {
    window.open = cordova.InAppBrowser.open;
    checkConnection();
}, false);
render(
  <Provider store={store}>
    <RouterContent/>
  </Provider>
  ,rootDocument);
