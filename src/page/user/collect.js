import React,{Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import {getCollectList,setNavBarTitle,setNavBarPoints,setAccountCollect} from 'REDUX/action'
import {getTopicAndBg,dateDiff} from 'SYSTEM/tool'
import { ListView } from 'antd-mobile'
class UserCollect extends Component{
    constructor(props){
        super(props);
    }
    getListAction(loginName){
        let {dispatch}=this.props;
        dispatch(getCollectList(loginName));
        dispatch(setNavBarTitle(`@${loginName}的收藏话题`));
        dispatch(setNavBarPoints({
            left:true,
            right:false,
            color:'',
            iconName:'left'
        }));
    }
    componentDidMount(){
        let {params:{loginName}}=this.props;
        this.getListAction(loginName)
    }
    componentWillUnmount(){
        let {dispatch}=this.props;
        dispatch(setAccountCollect({data:[], success: false}));
    }
    //登录名变，请求数据
    componentWillReceiveProps(nextProps){
        if(this.props.params.loginName !== nextProps.params.loginName){
            //滚动条归0
            document.body.scrollTop=document.documentElement.scrollTop=0;
            this.getListAction(nextProps.params.loginName)
        }
    }
    _renderRow(rowData,SectionId,rowID) {
        let obj=getTopicAndBg(rowData);
        return(
            <div className="list_item" key={rowID}>
                <Link className="item_title" to={'topic/'+rowData.id}><span className="topics_tab" style={{backgroundColor:obj.bgColor}}>{obj.type}</span>{rowData.title}</Link>
                <div className="content_wrapper item_avatar">
                    <Link to={`user/${rowData.author.loginname}`}>
                        <img className="border_img" src={rowData.author.avatar_url} />
                    </Link>
                    <p>{`${rowData.reply_count}/${rowData.visit_count}`}</p>
                    <p>{dateDiff(rowData.last_reply_at)}</p>
                </div>
            </div>
        )
    }
    render(){
        let {account:{collect}}=this.props;
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        return(
            <div className="pt_09">
                <ListView
                    dataSource={ds.cloneWithRows(collect.data)}
                    initialListSize={10}
                    useBodyScroll
                    renderRow={this._renderRow.bind(this)}
                    pageSize={7}
                    renderSeparator={(sectionID, rowID)=>{return(
                        <div key={`${sectionID}-${rowID}`} style={{height:'.15rem',backgroundColor:"#f5f5f9"}}></div>
                    )}}
                    scrollRenderAheadDistance={900}
                    onEndReached={()=>{return false}}
                    onEndReachedThreshold={10}
                    scrollEventThrottle={30}
                />
            </div>
        )
    }
}
export default connect(state=>({
    account:state.account
}))(UserCollect)