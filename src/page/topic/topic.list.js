import React, {Component} from 'react'
import {Link,hashHistory} from 'react-router'
import {connect} from 'react-redux'
import {loadTopics,setNavBarTitle,setNavBarPoints} from 'REDUX/action'
import {getTopicAndBg,dateDiff} from 'SYSTEM/tool'
import { ListView,Icon} from 'antd-mobile'
class TopicsList extends Component {
    constructor(props){
        super(props);
    }
    componentDidMount(){
        this._loadMoreData();
        const {dispatch,params} = this.props;
        let topics=getTopicAndBg(params.tabName).type;
        dispatch(setNavBarTitle(topics));
        dispatch(setNavBarPoints({
            left:true,
            right:true,
            rightContent:()=>{return (<Icon onClick={()=>{hashHistory.push('topics/create')}} type="plus-square" />)},
            color:'',
            iconName:'bars'
        }));
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
    _loadMoreData() {
        const {dispatch,params,topics} = this.props;
        dispatch(loadTopics(params.tabName,++topics.page));
    }
    onEndReached() {
        let {topics}=this.props;
        if (topics.isLoadingMore ||topics.isRefreshing) {
            return;
        };
        this._loadMoreData();
    }
    render() {
        let {topics}=this.props;
        let {list}=topics;
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        return (
            <div className="pt_09">
                <ListView
                    dataSource={ds.cloneWithRows(list)}
                    initialListSize={10}
                    useBodyScroll
                    renderRow={this._renderRow.bind(this)}
                    pageSize={7}
                    renderSeparator={(sectionID, rowID)=>{return(
                    <div key={`${sectionID}-${rowID}`} style={{height:'.15rem',backgroundColor:"#f5f5f9"}}></div>
                    )}}
                    scrollRenderAheadDistance={900}
                    onEndReached={this.onEndReached.bind(this)}
                    onEndReachedThreshold={10}
                    scrollEventThrottle={30}
                />
            </div>
        )
    }
}
export default connect(state=>({
    topics: state.topics
}))(TopicsList)
