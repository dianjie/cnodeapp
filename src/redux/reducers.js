import {combineReducers} from 'redux';
import 'babel-polyfill'
import {setSessionData,getSessionData,getLocalData} from '../system/system';
const system = (state = {
    animating: false,
}, action)=> {
    switch (action.type) {
        case 'set_system_animating':
            return Object.assign({}, state, {
                animating: action.animating
            });
        default:
            return state;
    }
};
const navBar=(state={
    points:{
        left:true,
        leftClick:()=>{},
        rightContent:()=>{},
        right:false,
        color:'',
        iconName:'bars'
    },
    title:'全部'
},action)=>{
    switch (action.type){
        case 'set_navBar_points':
            return Object.assign({},state,{
                points:action.points
            });
        case 'set_navBar_title':
            return Object.assign({},state,{
                title:action.title
            });
        default:
            return state;
    }
};
const menu=(state={
    open:false,
},action)=>{
    switch (action.type){
        case 'set_menu_openState':
            return Object.assign({},state,{
                open:action.open
            });
        default:
            return state;
    }
};
const topics=(state={
    list:[],
    detail:{data:{},success:false},
    isLoadingMore:false,
    isRefreshing:false,
    page:0
},action)=>{
    switch (action.type){
        case 'set_topics_list':
            let newState = state;
            if (action.page === 1) {
                newState = Object.assign({}, state, {
                    list: action.list
                });
            } else {
                newState = Object.assign({}, state, {
                    list: state.list.concat(action.list)
                });
            }
            return newState;
        case 'set_topics_refresh':
            return Object.assign({}, state, {
                isRefreshing: action.isRefreshing
            });
        case 'set_topics_page':
            return Object.assign({}, state, {
                page: action.page
            });
        case 'set_topics_loadingMore':
            return Object.assign({}, state, {
                isLoadingMore: action.isLoadingMore
            });
        case 'set_topics_detail':
            return Object.assign({}, state, {
                detail: action.detail
            });
        default:
            return state;
    }
};
const loginModal=(state={
    isLogin:false,
    accessToken:getLocalData('accessToken')||'',
    visible:false,
},action)=>{
    switch (action.type){
        case 'set_loginModal_isLogin':
            return Object.assign({}, state, {
                isLogin: action.isLogin
            });
        case 'set_loginModal_visible':
            return Object.assign({}, state, {
                visible: action.visible
            });
        case 'set_loginModal_accessToken':
            return Object.assign({}, state, {
                accessToken: action.accessToken
            });
        default:
            return state;
    }
};
const account=(state={
    info:{
        avatar_url: "",
        id: "",
        loginname: "",
        success: false
    },
    collect:{
        data:[],
        success: false
    },
    detail:{

    },
    mesCount:0,
    messages:{
        hasnot_read_messages:[],
        has_read_messages:[]
    }
},action)=>{
    switch (action.type){
        case 'set_account_info':
            return Object.assign({}, state, {
                info: action.info
            });
        case 'set_account_collect':
            return Object.assign({}, state, {
                collect: action.collect
            });
        case 'set_account_detail':
            return Object.assign({}, state, {
                detail: action.detail
            });
        case 'set_account_mesCount':
            return Object.assign({}, state, {
                mesCount: action.mesCount
            });
        case 'set_account_messages':
            return Object.assign({}, state, {
                messages: action.messages
            });
        default:
            return state;
    }
};
const reducer = combineReducers({
    navBar,
    menu,
    topics,
    system,
    loginModal,
    account
});
export  default reducer
