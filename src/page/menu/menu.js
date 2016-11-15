import React, {Component} from 'react';
import {connect} from 'react-redux';
import {hashHistory} from 'react-router';
import {menuOpenChange,loadTopics,setNavBarTitle,setLoginModalVisible,setSystemLoadImg} from 'REDUX/action';
import {Drawer, List,WhiteSpace,Badge,Switch} from 'antd-mobile';
import {getTopicAndBg,replaceImgUrl} from 'SYSTEM/tool'
class Menu extends Component {
    constructor(props) {
        super(props);
    }
    handleLoginModal() {
        const {dispatch,loginModal}=this.props;
        dispatch(setLoginModalVisible(!loginModal.visible))
    }
    onOpenChange() {
        let {dispatch}=this.props;
        dispatch(menuOpenChange());
    }
    _loadMoreData(tabName) {
        const {dispatch} = this.props;
        // document.body.scrollTop=document.documentElement.scrollTop=0;
        this.onOpenChange();
        hashHistory.push('tab='+tabName);
        let topics=getTopicAndBg(tabName).type;
        dispatch(setNavBarTitle(topics));
        dispatch(loadTopics(tabName,1));
    }
    render() {
        let {menu,loginModal,account,system,dispatch}=this.props;
        let {avatar_url,loginname}=account.info;
        const bgStyle={
            backgroundColor:'rgb(247, 247, 247)'
        };
        const sidebar = (<List >
            <div className="logo">
                <img src="./lib/cnodejs_light.svg"/>
            </div>
            {loginModal.isLogin?<List.Item
                style={bgStyle}
                arrow="horizontal"
            >
                <div onClick={()=>{hashHistory.push(`user/${loginname}`)}}>
                    <span>
                        <img src={replaceImgUrl(avatar_url)} className="border_img"/>
                    </span>
                    <span className="vertical-md"><span className="dark">{loginname} </span></span>
                </div>
            </List.Item>:<List.Item onClick={()=>{this.handleLoginModal();this.onOpenChange();}} style={bgStyle}
            >登录</List.Item>}
            <List.Item onClick={()=>{this._loadMoreData('all')}} style={bgStyle}
            >全部</List.Item>
            <List.Item onClick={()=>{this._loadMoreData('good')}} style={bgStyle}
            >精华</List.Item>
            <List.Item onClick={()=>{this._loadMoreData('share')}} style={bgStyle}
            >分享</List.Item>
            <List.Item onClick={()=>{this._loadMoreData('ask')}} style={bgStyle}
            >问答</List.Item>
            <List.Item onClick={()=>{this._loadMoreData('job')}} style={bgStyle}
            >招聘</List.Item>
            <WhiteSpace style={{backgroundColor:'#ececed'}} />
            {loginModal.isLogin?<div>
                <List.Item onClick={()=>{this.onOpenChange();hashHistory.push(`user/collections/${loginname}`)}} style={bgStyle}
                >收藏</List.Item>
                <List.Item onClick={()=>{this.onOpenChange();hashHistory.push(`my/messages`)}} style={bgStyle}
                >
                    消息
                    <Badge text={account.mesCount} style={{ marginLeft: 12 }} />
                </List.Item>
            </div>:''}
            <List.Item onClick={()=>{this.onOpenChange();hashHistory.push('about')}} style={bgStyle}
            >关于</List.Item>
        </List>);
        const drawerProps = {
            open: menu.open,
            position: 'left',
            onOpenChange: this.onOpenChange.bind(this)
        };
        return (
            <Drawer sidebar={sidebar}
                    overlayStyle={{position:'fixed'}}
                    sidebarStyle={Object.assign({},bgStyle,{position:'fixed',paddingTop:'0.87rem',width:'4.5rem'})}
                {...drawerProps}
            >{''}
            </Drawer>
        )

    }
}
export default connect(state=>({
    menu: state.menu,
    account:state.account,
    loginModal:state.loginModal,
    system:state.system
}))(Menu)