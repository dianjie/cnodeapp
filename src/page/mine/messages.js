import React,{Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import {setNavBarTitle,setNavBarPoints,resetNavBarPoints,getMesList,setAllMesIsRead,setMesList} from 'REDUX/action'
import {List} from 'antd-mobile'
import {dateDiff,replaceContent,replaceImgUrl} from 'SYSTEM/tool'
class MyMessages extends Component{
    constructor(props){
        super(props);
        this.handleAllMesISRead=this.handleAllMesISRead.bind(this)
    }
    loadMes(){
        let {dispatch}=this.props;
        //修改头部标题
        dispatch(setNavBarTitle("消息"));
        //设置头部要素
        dispatch(setNavBarPoints({
            left:true,
            right:false,
            color:'',
            iconName:'left'
        }));
        dispatch(getMesList())
    }
    componentWillMount(){
        this.loadMes()
    }
    renderMes(array){
        if(array.length){
            return array.map(function (item, key) {
                    return(
                        <div className="list_item" key={key}>
                            <div className="content_wrapper item_avatar">
                                <Link>
                                    <img className="border_img" src={replaceImgUrl(item.author.avatar_url)} />
                                </Link>
                                <p style={{fontSize:'.26rem'}}><Link to={`user/${item.author.loginname}`}>{item.author.loginname}</Link>在话题 <Link to={`topic/${item.topic.id}?id=${item.reply.id}`}>{item.topic.title}</Link>中@了你</p>
                                <p>{dateDiff(item.reply.create_at)}</p>
                            </div>
                            <div className="reply_detail" dangerouslySetInnerHTML={{__html: replaceContent(item.reply.content)}} />
                        </div>
                    )
            })
        }else {
            return '无消息'
        }
    }
    handleAllMesISRead(){
        let {dispatch}=this.props;
        dispatch(setAllMesIsRead());
    }
    render(){
        let {account:{messages}}=this.props;
        return(
            <div className="pt_09">
                <div className="detail_content">
                    <div className="x_panel">
                        <div className="x_header">
                            <span>未读消息</span>
                            {messages.hasnot_read_messages.length?<button onClick={this.handleAllMesISRead} className="btn-common btn-success pull-right" style={{top: '-.15rem',
                                position: 'relative'}}>全部已读</button>:""}
                        </div>
                        <div className="x_inner">
                            {this.renderMes(messages.hasnot_read_messages)}
                        </div>
                    </div>
                    <div className="x_panel">
                        <div className="x_header">
                            <span>已读消息</span>
                        </div>
                        <div className="x_inner">
                            {this.renderMes(messages.has_read_messages)}
                        </div>
                    </div>

                </div>
            </div>
        )
    }
}
export default connect(state=>({
    account:state.account
}))(MyMessages)