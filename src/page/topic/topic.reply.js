import React,{Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import {Toast,Icon,Button} from 'antd-mobile'
import {dateDiff,replaceContent,setTail,replaceImgUrl} from 'SYSTEM/tool'
import {apiHostUrl} from 'SYSTEM/system'
import {loginTips,loadTopicDetail} from 'REDUX/action';
import ajax from '@fdaciuk/ajax'
class TopicReply extends Component{
    constructor(props){
        super(props);
        this.state={
            disabled:false,
            buttonText:'回复'
        };
        this.handleUp=this.handleUp.bind(this);
        this.handleReply=this.handleReply.bind(this);
        this.editor=null;
    }
    //自己是否已点赞
    isLike(ups){
        let {account:{info:{id}}}=this.props;
        if(ups.includes(id)){
            return {color:'#ff3b30'}
        }else {
            return {}
        }
    }
    upReply(){
        let {dispatch,loginModal:{accessToken},reply,topicId}=this.props;
        ajax().post(`${apiHostUrl}/reply/${reply.id}/ups`,{accesstoken:accessToken}).then(function () {
            dispatch(loadTopicDetail(topicId))
        }).catch(function (req) {
            Toast.info(req.error_msg,1)
        })
    }
    //点赞逻辑
    handleUp(){
        let {dispatch,loginModal:{isLogin}}=this.props;
        //未登录提示登录
        if(!isLogin){
            dispatch(loginTips());
        }else {
            this.upReply()
        }
    }
    handleReply(){
        let {dispatch,loginModal:{isLogin}}=this.props;
        //未登录提示登录
        if(!isLogin){
            dispatch(loginTips());
        }else {
            this.handleEditor()
        }
    }
    resetState(){
        this.setState({
            disabled:false, buttonText:'回复'
        })
    }
    resetAction(){
        this.resetState();
        this.handleEditor()
    }
    replyAction(content){
        if(!content) return ;
        let self=this;
        let {dispatch,loginModal:{accessToken},reply,topicId}=this.props;
        this.setState({
            disabled:true, buttonText:'回复中...'
        })
        ajax().post(`${apiHostUrl}/topic/${topicId}/replies`,{accesstoken:accessToken,content:setTail(content),reply_id:reply.id}).then(function () {
            dispatch(loadTopicDetail(topicId));
            self.resetAction()
        }).catch(function (req) {
            Toast.info(req.error_msg,2);
            self.resetState()
        })
    }
    handleEditor(){
        let {reply,index}=this.props;
        if(this.editor){
            this.refs[`editor_div${index}`].style.display='none';
            this.editor.toTextArea();
            this.editor=null;
        }else {
            this.refs[`editor_div${index}`].style.display='block';
            console.dir(document.getElementById(`editor_div${index}`));
            this.editor = new SimpleMDE({ element: document.getElementById(`editor${index}`) });
            let editor_div=document.getElementById(`editor_div${index}`)
            document.body.scrollTop=document.documentElement.scrollTop=editor_div.offsetTop-editor_div.offsetHeight;
            this.editor.value(`@${reply.author.loginname} `)
        }
    }
    render(){
        let {reply,index}=this.props;
        let {disabled,buttonText}=this.state
        return(
            <div className="list_item" key={index}>
                <div className="content_wrapper item_avatar">
                    <Link>
                        <img className="border_img" src={replaceImgUrl(reply.author.avatar_url)} />
                    </Link>
                    <p>{reply.author.loginname}</p>
                    <p>{index+1+"楼"}•{dateDiff(reply.create_at)}</p>
                    <p className="reply-action">
                            <span className="like" onClick={this.handleUp}>
                                <Icon type="like" style={this.isLike(reply.ups)}/>
                                {reply.ups.length ||''}
                            </span>
                        <Icon type="message" onClick={this.handleReply} />
                    </p>
                </div>
                <div className="reply_detail" dangerouslySetInnerHTML={{__html: replaceContent(reply.content)}} />
                <div id={`editor_div${index}`} className="editor_div" ref={`editor_div${index}`} style={{display:'none'}}>
                    <textarea className="none" id={`editor${index}`}></textarea>
                    <Button onClick={()=>{this.replyAction(this.editor.value())}} disabled={disabled} type="primary" inline size="large">{buttonText}</Button>
                </div>
            </div>
        )
    }
}
export default connect(state=>({
    account:state.account,
    loginModal:state.loginModal
}))(TopicReply)
