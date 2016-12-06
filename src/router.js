import {Router, Route, hashHistory, IndexRedirect} from 'react-router';
import {store} from './redux/store'
import {Toast} from 'antd-mobile'
import {setSystemNoLoadImg, setSystemNetwork} from 'REDUX/action';
import {getConnection} from 'SYSTEM/tool';
import React, {Component} from 'react';
import LayOut from './page/public/layOut';
import TopicList from './page/topic/topic.list';
import TopicDetail from './page/topic/topic.detail';
import TopicCreate from './page/topic/topic.create';
import TopicEdit from './page/topic/topic.edit';
import UserCollect from './page/user/collect';
import UserHome from './page/user/home';
import MyMessages from './page/mine/messages';
import About from './page/about';
class RouterContent extends Component {
    constructor(props){
      super(props);
      this.onBack=this.onBack.bind(this);
      this.exitApp=this.exitApp.bind(this);
    }
    //为了处理抽屉菜单省流量默认选中问题
    checkConnection() {
        let networkState = getConnection();
        store.dispatch(setSystemNoLoadImg(networkState == 'WiFi' ? false : true));
        store.dispatch(setSystemNetwork(networkState))
    }
    onBack(){
        let self=this;
        let hashUrl=window.location.hash;
        hashUrl=hashUrl.slice(0,hashUrl.indexOf("?"));
        if(/^#\/tab=.*$/.test(hashUrl)){
            Toast.info('再点一次退出！！',1);
            document.removeEventListener('backbutton',self.onBack,false);
            document.addEventListener('backbutton',self.exitApp,false);
            let timeOut=window.setTimeout(function () {
                window.clearTimeout(timeOut);
                document.removeEventListener('backbutton',self.exitApp,false);
                document.addEventListener('backbutton',self.onBack,false);
            },2000)
        }else {
            hashHistory.goBack()
        }
    }
    exitApp(){
        navigator.app.exitApp()
    }
    componentWillMount() {
        let self = this;
        document.addEventListener("deviceready", function () {
            window.open = cordova.InAppBrowser.open;
            self.checkConnection();
            document.addEventListener('backbutton',self.onBack.bind(self),false);
        }, false);
    }
    render() {
        return (
            <Router history={hashHistory}>
                <Route path='/' component={LayOut}>
                    <IndexRedirect to="/tab=all"/>
                    <Route path="/tab=:tabName" component={TopicList}/>
                    <Route path="/topic/:topicId" component={TopicDetail}/>
                    <Route path="/topics/create" component={TopicCreate}/>
                    <Route path="/topics/:topicId/edit" component={TopicEdit}/>
                    <Route path="/user/collections/:loginName" component={UserCollect}/>
                    <Route path="/user/:loginName" component={UserHome}/>
                    <Route path="/my/messages" component={MyMessages}/>
                    <Route path="/about" component={About}/>
                </Route>
            </Router>
        )
    }
}
export default RouterContent;
