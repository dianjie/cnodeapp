import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link,hashHistory} from 'react-router'
import {Tabs, List,Icon,Modal} from 'antd-mobile'
const TabPane = Tabs.TabPane;
const alert = Modal.alert;
import {dateDiff} from 'SYSTEM/tool'
import {getUserInfo,setNavBarTitle,setNavBarPoints,menuOpenChange,setLoginAccessToken,setIsLogin,setUserInfo,setAccountInfo} from 'REDUX/action'
import {removeLocalData} from 'SYSTEM/system';
class UserHome extends Component {
    constructor(props) {
        super(props);
    }
    showLogOutTips(){
        let self=this;
        alert('退出登录', '确定退出???', [
            { text: '取消', onPress: () => {}},
            { text: '确定', onPress: () => self.logout() },
        ]);
    }
    logout(){
        let {dispatch}=this.props;
        removeLocalData('accessToken');
        dispatch(setIsLogin(false));
        dispatch(setLoginAccessToken(''));
        dispatch(setLoginAccessToken(''));
        dispatch(setAccountInfo({
            avatar_url: "",
            id: "",
            loginname: "",
            success: false
        }));
        hashHistory.replace('tab=all')
    }
    setNavBar(myLoginName,loginName){
        let {dispatch}=this.props;
        //修改头部标题
        dispatch(setNavBarTitle(`@${loginName}的个人中心`));
        //设置头部要素
        dispatch(setNavBarPoints({
            left:true,
            right:myLoginName==loginName,
            rightContent:()=>{return (<Icon onClick={this.showLogOutTips.bind(this)} type="logout" />)},
            color:'',
            iconName:'left'
        }));
    }
    getUserData(loginName) {
        let {dispatch,menu}=this.props;
        dispatch(getUserInfo(loginName));
        if(menu.open){
            dispatch(menuOpenChange())
        }
    }
    componentDidMount() {
        let {params:{loginName}}=this.props;
        this.getUserData(loginName)
    }
    componentWillReceiveProps(nextProps){
        this.setNavBar(nextProps.account.info.loginname,nextProps.params.loginName)
    }
    componentWillUnmount(){
        let {dispatch}=this.props;
        dispatch(setUserInfo({success:false}))
    }
    renderContent() {
        let {account:{detail}}=this.props;
        if (detail.success) {
            return (
                <div>
                    <div className="home-card">
                        <img className="user-img" src={detail.data.avatar_url} alt=""/>
                        <p>{detail.data.loginname}</p>
                        <p>{detail.data.score}积分</p>
                        <a href={`#/user/collections/${detail.data.loginname}`}>收藏话题</a>
                        <p>注册于{dateDiff(detail.data.create_at)}</p>
                    </div>
                    <Tabs defaultActiveKey="1">
                        <TabPane tab="最近创建" key="1">
                            <List>
                                {
                                    detail.data.recent_topics.map(function (item, key) {
                                        return (
                                            <List.Item
                                                arrow="horizontal"
                                                key={key}
                                            >
                                                <Link to={'topic/'+item.id}>{item.title}</Link>
                                            </List.Item>

                                        )
                                    })
                                }
                            </List>
                        </TabPane>
                        <TabPane tab="最近参与" key="2">
                            {
                                detail.data.recent_replies.map(function (item, key) {
                                    return (
                                        <List.Item
                                            arrow="horizontal"
                                            key={key}
                                        >
                                            <Link to={'topic/'+item.id}>{item.title}</Link>
                                        </List.Item>

                                    )
                                })
                            }
                        </TabPane>
                    </Tabs>
                </div>
            )
        } else {
            return ""
        }

    }

    render() {
        return (
            <div className="pt_09">
                {this.renderContent()}
            </div>
        )
    }
}
export default connect(state=>({
    account: state.account,
    menu:state.menu
}))(UserHome)
