import {store} from './../redux/store'
import {callApi} from './../system/apiHelper'
import {Toast} from 'antd-mobile'
import {setSessionData,getSessionData,setLocalData,getLocalData,removeLocalData} from '../system/system';
export const setSystemAnimating=(animating)=>{
    return {
        type: 'set_system_animating',
        animating
    }
};
export const setNavBarTitle=(title)=>{
    return {
        type: 'set_navBar_title',
        title
    }
};
export const setNavBarPoints=(points)=>{
    return {
        type: 'set_navBar_points',
        points
    }
};
export const resetNavBarPoints=()=>{
    return dispatch=>{
        dispatch(setNavBarPoints({
                left:true,
                leftClick:()=>{},
                right:false,
                color:'',
                iconName:'bars'
        }))
    }
};
export const setMenuOpenState=(open)=>{
    return {
        type: 'set_menu_openState',
        open
    }
};
export const menuOpenChange=()=>{
    return dispatch=>{
        let state=store.getState();
        let {menu}=state;
        dispatch(setMenuOpenState(!menu.open))
    }
};
export const setTopics=(list,page)=>{
    return{
        type: 'set_topics_list',
        list,
        page
    }
};
export const setTopicDetail=(detail)=>{
    return{
        type: 'set_topics_detail',
        detail
    }
};
export const setTopicsRefreshing=(isRefreshing)=>{
    return {
        type: 'set_topics_refresh',
        isRefreshing
    }
};
export const setTopicsPage=(page)=>{
    return {
        type: 'set_topics_page',
        page
    }
};
export const setTopicsLoadingMore=(isLoadingMore)=>{
    return {
        type: 'set_topics_loadingMore',
        isLoadingMore
    }
};
export const loadTopics=(tab,page,limit=20)=>{
    return dispatch=>{
        //显示等待加载动画
        dispatch(setSystemAnimating(true));
        if (page === 1) {
            dispatch(setTopicsRefreshing(true));
        }else {
            dispatch(setTopicsLoadingMore(true));
        }
        callApi("获取主题类型列表",{tab,page,limit}).then(function (res) {
            dispatch(setSystemAnimating(false));
            dispatch(setTopics(res.data,page));
            //设置页码
            dispatch(setTopicsPage(page));
            if (page === 1) {
                dispatch(setTopicsRefreshing(false));
            }else{
                dispatch(setTopicsLoadingMore(false));
            }

        }).catch((error) => {
            dispatch(setTopicsRefreshing(false));
            dispatch(setTopicsLoadingMore(false));
            dispatch(setSystemAnimating(false));
        });
    }
};
export const loadTopicDetail=(id)=>{
    return dispatch=>{
        //显示等待加载动画
        dispatch(setSystemAnimating(true));
        let state=store.getState();
        const {loginModal:{accessToken}}=state;
        callApi("获取主题详情",{id},false,{accesstoken:accessToken}).then(function (res) {
            dispatch(setSystemAnimating(false));
            dispatch(setTopicDetail(res));
        }).catch((error) => {
            dispatch(setSystemAnimating(false));
        });
    }
};
export const collectTopic=(id)=>{
    return dispatch=>{
        let state=store.getState();
        const {loginModal:{accessToken},topics:{detail}}=state;
        callApi("收藏主题",{topic_id:id,accesstoken:accessToken}).then(function (res) {
            let obj=Object.assign({},detail.data,{is_collect:true});
            dispatch(setTopicDetail({data:obj,success:true}));
        }).catch((error) => {
            let obj=Object.assign({},detail.data,{is_collect:false});
            dispatch(setTopicDetail({data:obj,success:true}));
        });
    }
};
export const deleteTopic=(id)=>{
    return dispatch=>{
        let state=store.getState();
        const {loginModal:{accessToken},topics:{detail}}=state;
        callApi("取消主题",{topic_id:id,accesstoken:accessToken}).then(function (res) {
            let obj=Object.assign({},detail.data,{is_collect:false});
            dispatch(setTopicDetail({data:obj,success:true}));
        }).catch((error) => {
            let obj=Object.assign({},detail.data,{is_collect:false});
            dispatch(setTopicDetail({data:obj,success:true}));
        });
    }
};
export const getCollectList=(loginname)=>{
    return dispatch=>{
        callApi("用户所收藏的主题",{loginname},false).then(function (res) {
            dispatch(setAccountCollect(res));
        }).catch((error) => {
            dispatch(setAccountCollect({data:[], success: false}));
        });
    }
};
export const setMesCount=(mesCount)=>{
    return{
        type:'set_account_mesCount',
        mesCount
    }
};
export const setMesList=(messages)=>{
    return{
        type:'set_account_messages',
        messages
    }
};
export const loginTips=()=>{
    return dispatch=>{
        let state=store.getState();
        const {loginModal:{visible}}=state;
        Toast.info('请先登录！！！',1,function () {
            dispatch(setLoginModalVisible(!visible));
        });
    };
};
export const getMesCount=(accesstoken)=>{
    return dispatch=>{
        callApi("获取未读消息数",{accesstoken}).then(function (res) {
            dispatch(setMesCount(res.data));
        }).catch((error) => {
            dispatch(setMesCount(0));
        });
    }
};
export const getMesList=()=>{
    return dispatch=>{
        let state=store.getState();
        const {loginModal:{accessToken}}=state;
        callApi("获取已读和未读消息",{accesstoken:accessToken}).then(function (res) {
            dispatch(setMesList(res.data));
            dispatch(setMesCount(res.data.hasnot_read_messages.length));
        }).catch((error) => {
            dispatch(setMesList({hasnot_read_messages:[],has_read_messages:[]}));
        });
    }
};
export const setAllMesIsRead=()=>{
    return dispatch=>{
        let state=store.getState();
        const {loginModal:{accessToken}}=state;
        callApi("标记全部已读",{accesstoken:accessToken}).then(function (res) {
            dispatch(getMesList());
        })
    }
};
export const setUserInfo=(detail)=>{
    return{
        type:'set_account_detail',
        detail
    }
};
export const getUserInfo=(loginname)=>{
    return dispatch=>{
        callApi("用户详情",{loginname},false).then(function (res) {
            dispatch(setUserInfo(res));
        }).catch(function (req) {
            dispatch(setUserInfo(req));
        })
    }
};

export const setAccountInfo=(info)=>{
    return{
        type: 'set_account_info',
        info
    }
};
export const setAccountCollect=(collect)=>{
    return{
        type: 'set_account_collect',
        collect
    }
};

export const setIsLogin=(isLogin)=>{
    return{
        type: 'set_loginModal_isLogin',
        isLogin
    }
};
export const setLoginModalVisible=(visible)=>{
    return{
        type: 'set_loginModal_visible',
        visible
    }
};
export const setLoginAccessToken=(accessToken)=>{
    return{
        type: 'set_loginModal_accessToken',
        accessToken
    }
};
export const handleLogin=(accesstoken)=>{
    return dispatch=>{
        callApi("验证accessToken的正确性",{accesstoken}).then(function (res) {
            setLocalData('accessToken',accesstoken);
            dispatch(setAccountInfo(res));
            dispatch(getMesCount(accesstoken));
            dispatch(setLoginAccessToken(accesstoken));
            dispatch(setIsLogin(true));
        }).catch((error) => {
            removeLocalData('accessToken');
            //重置账号信息
            dispatch(setAccountInfo({
                avatar_url: "",
                id: "",
                loginname: "",
                success: false
            }));
            dispatch(setIsLogin(false));
            dispatch(setLoginAccessToken(''));
        });
    }
};
