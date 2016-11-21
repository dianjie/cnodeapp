import {combineReducers} from 'redux';
import 'babel-polyfill'
import {setSessionData,getSessionData,getLocalData} from '../system/system';
const system = (state = {
    animating: false,
    network:'',
    finish:false,
    noLoadImg:false
}, action)=> {
    switch (action.type) {
        case 'set_system_animating':
            return Object.assign({}, state, {
                animating: action.animating
            });
        case 'set_system_network':
            return Object.assign({}, state, {
                network: action.network
            });
        case 'set_system_finish':
            return Object.assign({}, state, {
                finish: action.finish
            });
        case 'set_system_noLoadImg':
            return Object.assign({}, state, {
                noLoadImg: action.noLoadImg
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
    all:{list:[],page:0},
    good:{list:[],page:0},
    share:{list:[],page:0},
    ask:{list:[],page:0},
    job:{list:[],page:0},
    detail:{data:{},success:false},
    isLoadingMore:false
},action)=>{
    switch (action.type){
        case 'set_topics_list':
            let obj={list: state[action.tabName].list.concat(action.tabData.list),page:action.tabData.page};
            switch (action.tabName){
                case 'all':
                    return Object.assign({}, state, {
                        all: obj
                    });
                case 'good':
                    return Object.assign({}, state, {
                        good: obj
                    });
                case 'share':
                    return Object.assign({}, state, {
                        share: obj
                    });
                case 'ask':
                    return Object.assign({}, state, {
                        ask: obj
                    });
                case 'job':
                    return Object.assign({}, state, {
                        job: obj
                    });
                default:
                    return state;
            }
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
