import React,{Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import {Toast,Icon,Button} from 'antd-mobile'
import {dateDiff,replaceContent,setTail} from 'SYSTEM/tool'
import {apiHostUrl} from 'SYSTEM/system'
import {loginTips,loadTopicDetail} from 'REDUX/action';
import ajax from '@fdaciuk/ajax'
class Editor extends Component{
    constructor(props){
        super(props);
        this.state={
            disabled:false,
            buttonText:'回复'
        };
        this.editor=null;
    }
    componentDidMount(){
        this.editor = new SimpleMDE({ element: document.getElementById('editor_text') });
    }
    resetState(){
        this.setState({
            disabled:false, buttonText:'回复'
        })
    }
    resetAction(){
        this.resetState();
        this.editor.value('')
    }
    replyAction(content){
        if(!content) return ;
        let self=this;
        let {dispatch,loginModal:{accessToken},topicId}=this.props;
        this.setState({
            disabled:true, buttonText:'回复中...'
        });
        ajax().post(`${apiHostUrl}/topic/${topicId}/replies`,{accesstoken:accessToken,content:setTail(content)}).then(function () {
            dispatch(loadTopicDetail(topicId));
            self.resetAction()
        }).catch(function (req) {
            Toast.info(req.error_msg,2);
            self.resetState()
        })
    }
    handleReply(content){
        let {dispatch,loginModal:{isLogin}}=this.props;
        //未登录提示登录
        if(!isLogin){
            dispatch(loginTips());
        }else {
            this.replyAction(content)
        }
    }
    render(){
        let {disabled,buttonText}=this.state;
        return(
            <div id='editor_reply'  ref='editor_reply'>
                <textarea className="none" id='editor_text'></textarea>
                <Button onClick={()=>{this.handleReply(this.editor.value())}} disabled={disabled} type="primary" inline size="large">{buttonText}</Button>
            </div>
        )
    }
}
export default connect(state=>({
    loginModal:state.loginModal
}))(Editor)
