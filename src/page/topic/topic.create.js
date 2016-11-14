import React,{Component} from 'react'
import {connect} from 'react-redux'
import {Link,hashHistory} from 'react-router'
import {setNavBarTitle,setNavBarPoints,loginTips} from 'REDUX/action'
import {getTopicAndBg,dateDiff,replaceContent} from 'SYSTEM/tool'
import { List,Picker,Button,Toast} from 'antd-mobile'
import {apiHostUrl} from 'SYSTEM/system'
import ajax from '@fdaciuk/ajax'
class TopicCreate extends Component{
    constructor(props){
        super(props);
        this.state={
            value:['none'],
            disabled:false,
            buttonText:'提交',
            title:""
        };
        this.editor=null;
    }
    //获取主题详情
    getTopicDetail(id){
      let self=this;
      let {account:{info}}=this.props;
        ajax().get(`${apiHostUrl}/topic/${id}?mdrender=false`).then(function (res) {
            console.log(res)
            if(res.data.author_id!==info.id){
              Toast.info('非自己的主题，不能编辑！！',2);
              hashHistory.goBack();
            }else{
              self.setState({
                title:res.data.title,
                value:[res.data.tab]
              });
              self.editor.value(res.data.content)
            }
        }).catch(function (req) {
            Toast.info(req.error_msg,2);
        })
    }
    //判断是编辑还是新增
    handleEditOrCreate(){
        this.editor = new SimpleMDE({ element: document.getElementById('editor_text')});
        const {topicId} = this.props;
        if(topicId){
            this.getTopicDetail(topicId)
        }
    }
    componentDidMount(){
        const {dispatch,topicId} = this.props;
        dispatch(setNavBarTitle(topicId?'编辑话题':'创建话题'));
        dispatch(setNavBarPoints({
            left:true,
            right:false,
            color:'',
            iconName:'left'
        }));
        this.handleEditOrCreate();
    }
    resetState(){
        this.setState({
            disabled:false, buttonText:'提交'
        });
    }
    editAction(content){
        if(!content) return ;
        let self=this;
        let {dispatch,loginModal:{accessToken},topicId}=this.props;
        let {value,title}=this.state;
        this.setState({
            disabled:true, buttonText:'提交中...'
        })
        let ajaxUrl=`${apiHostUrl}/topics`;
        let obj={
          accesstoken:accessToken,
          content:content,
          tab:value[0],
          title:title
        }
        if(topicId){
          obj.topic_id=topicId;
          ajaxUrl=`${apiHostUrl}/topics/update`;
        }
        ajax().post(ajaxUrl,obj).then(function (res) {
            hashHistory.replace(`topic/${res.topic_id}`)
        }).catch(function (req) {
            Toast.info(req.error_msg,2);
            self.resetState()
        })
    }
    handleEdit(content){
        let {value,title}=this.state;
        let {dispatch,loginModal:{isLogin}}=this.props;
        //未登录提示登录
        if(!isLogin){
            dispatch(loginTips());
        }else {
            if(value[0]=='none'){
                Toast.info('请选择版块',1.5);
                return;
            }
            if(!title){
                Toast.info('请填写标题',1.5);
                return;
            }
            if(!content){
                Toast.info('请填写话题内容',1.5);
                return;
            }
            this.editAction(content)
        }
    }
    render(){
      const data=[
        {
          value:'none',
          label:'请选择'
        },
        {
          value:'share',
          label:'分享'
        },
        {
          value:'ask',
          label:'问答'
        },
        {
          value:'job',
          label:'招聘',
        },

      ];
        let {value,disabled,buttonText,title}=this.state;
        let self=this;
        return(
            <div className="pt_09">
                <div className="detail_content topic-edit">
                    <List>
                        <Picker data={data} cols={1} title='选择版块' value={value} onChange={(value)=>{
                        self.setState({value:value})
                        }}>
                            <List.Item arrow="horizontal">选择版块</List.Item>
                        </Picker>
                    </List>
                    <textarea name="title" id="title" value={title} onChange={(event)=>{this.setState({title:event.target.value})}} className="title" placeholder="标题字数 10 字以上" rows="1"></textarea>
                    <textarea className="none" id='editor_text'></textarea>
                    <Button onClick={()=>{this.handleEdit(this.editor.value())}}  disabled={disabled} type="primary" inline size="large">{buttonText}</Button>
                </div>
            </div>

        )
    }
}
export default connect(state=>({
    loginModal:state.loginModal,
    account:state.account
}))(TopicCreate)
