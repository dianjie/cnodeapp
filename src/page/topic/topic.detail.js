import React,{Component} from 'react'
import {connect} from 'react-redux'
import {Link,hashHistory} from 'react-router'
import {setLoginModalVisible,setNavBarTitle,setNavBarPoints,resetNavBarPoints,loadTopicDetail,setTopicDetail,menuOpenChange,loginTips,collectTopic,deleteTopic,setSystemFinish} from 'REDUX/action'
import {getTopicAndBg,dateDiff,replaceContent,getParameterByName} from 'SYSTEM/tool'
import {Toast,Icon} from 'antd-mobile'
import TopicReply from './topic.reply'
import Editor from '../editor'
class TopicsDetail extends  Component{
    constructor(props){
        super(props);
        this.handleCollect=this.handleCollect.bind(this);
    }
    //获取文章内容
    loadDetail(id){
        let {dispatch}=this.props;
        //修改头部标题
        dispatch(setNavBarTitle("文章详情"));
        //设置头部要素
        dispatch(setNavBarPoints({
            left:true,
            right:false,
            color:'',
            iconName:'left'
        }));
        dispatch(loadTopicDetail(id))
    }
    //消息回复定位
    setMesScroll(){
        let mesId=getParameterByName('id');
        if(!mesId) return;
        let mesCon=document.getElementById(mesId);
        if(!mesCon) return;
        console.log(mesCon);
        document.body.scrollTop=document.documentElement.scrollTop=mesCon.offsetTop-mesCon.offsetHeight
    }
    componentWillMount(){
        let {params:{topicId}}=this.props;
        this.loadDetail(topicId)
    }
    //文章id更改时，滚动条归零，再次获取文章内容
    componentWillReceiveProps(nextProps){
        if(nextProps.topics.detail.success || this.props.params.topicId !== nextProps.params.topicId){
            window.setTimeout(this.setMesScroll.bind(this),100);
        }
        if(this.props.params.topicId !== nextProps.params.topicId){
            //滚动条归0
            document.body.scrollTop=document.documentElement.scrollTop=0;
            this.loadDetail(nextProps.params.topicId)
        }
    }
    // 卸载组件清除store的数据
    componentWillUnmount(){
        let {dispatch}=this.props;
        dispatch(setTopicDetail({success:false}))
    }
    handleCollect(){
        let {dispatch,loginModal:{isLogin},topics:{detail:{data}},params:{topicId}}=this.props;
        //未登录提示登录
        if(!isLogin){
            dispatch(loginTips());
        }else if(data.is_collect) {
        //    收藏就请求取消接口
            dispatch(deleteTopic(topicId));
        }else {
        //    否则请求收藏接口
            dispatch(collectTopic(topicId));
        }
    }
    renderEdit(){
        let {account:{info:{id}},topics:{detail:{success,data}}}=this.props;
        if(data.author_id!==id){
          return '';
        }else{
          return (
            <button onClick={()=>{hashHistory.push(`/topics/${data.id}/edit`)}} style={{marginRight:'.2rem'}} className="btn-common btn-success pull-right">编辑</button>
          )
        }
    }
    renderContent(){
        let {topics}=this.props;
        const {detail:{success,data}}=topics;
        const self=this;
        if(success){
            let obj=getTopicAndBg(data);
            return(
                <div className="detail_content">
                    <div className="header topic_header">
                        <div className="topic_full_title">
                            <span className="topics_tab" style={{backgroundColor:obj.bgColor}}>{obj.type}</span>
                            {data.title}
                        </div>
                        <div className="changes clearfix">
                            <span className="text">发布于{dateDiff(data.create_at)}</span>
                            <span className="text">作者：<Link to={`user/${data.author.loginname}`} >{data.author.loginname}</Link></span>
                            <span className="text">{data.visit_count}次浏览</span>
                            <button onClick={this.handleCollect} style={{marginRight:'.2rem'}} className={data.is_collect?"btn-common pull-right":"btn-common btn-success pull-right"}>{data.is_collect?'已收藏':'收藏'}</button>
                            {this.renderEdit()}
                        </div>
                    </div>
                    <div className="topic_detail" dangerouslySetInnerHTML={{__html: replaceContent(data.content)}} />
                    <div className="reply">
                        <div className="reply-count">
                            <span>{data.replies.length?data.replies.length+'    回复':'添加回复'}</span>
                        </div>
                        <div className="x_inner">
                            {
                                data.replies.map(function (item, key) {
                                    return(
                                        <TopicReply key={key} index={key} reply={item} topicId={data.id}/>
                                    )
                                })
                            }
                        </div>
                        <Editor topicId={data.id}/>
                    </div>
                </div>
            )
        }else {
            return(
                <div className="detail_content"/>
            )
        }
    }
    render(){
        return(
            <div className="pt_09">
                {this.renderContent()}
            </div>
        )
    }
}
export default connect(state=>({
    topics:state.topics,
    loginModal:state.loginModal,
    account:state.account
}))(TopicsDetail)
