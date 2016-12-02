import React, {Component} from 'react'
import {hashHistory} from 'react-router'
import {connect} from 'react-redux'
import {loadTopics,setNavBarTitle,setNavBarPoints} from 'REDUX/action'
import {getTopicAndBg,dateDiff,replaceImgUrl} from 'SYSTEM/tool'
import { ListView,Icon} from 'antd-mobile'
import {setSessionData,getSessionData} from 'SYSTEM/system';
class TopicsList extends Component {
    //备注：全部、精华、招聘、分享、问答共用一个路由，一个组件，所以写了一些很奇怪的方法
    constructor(props){
        super(props);
        let {params:{tabName},topics} = this.props;
        this.setScrollTop=this.setScrollTop.bind(this)
    }
    componentWillMount(){
        const {topics,params:{tabName}} = this.props;
        if(topics[tabName].page) return;
        this._loadMoreData();
    }
    //设置滚动条位置
    setScrollTop(){
        const {topics:{isLoadingMore},params:{tabName}} = this.props;
        let topicScroll= getSessionData('topicScroll')||[];
        let index=topicScroll.findIndex(function(value, index, arr) {
            return value.tabName == tabName;
        });
        let scroll=index==-1?0:topicScroll[index].scroll;
        if(isLoadingMore){
            //正在加载延时调用自己
            window.setTimeout(this.setScrollTop,150)
        }else {
            document.body.scrollTop=document.documentElement.scrollTop=scroll
        }

    }
    setHeaderTitle(title){
        const {dispatch,params} = this.props;
        let topics=getTopicAndBg(title||params.tabName).type;
        dispatch(setNavBarTitle(topics));
        dispatch(setNavBarPoints({
            left:true,
            right:true,
            rightContent:()=>{return (<Icon onClick={()=>{hashHistory.push('topics/create')}} type="plus-square" />)},
            color:'',
            iconName:'bars'
        }));
    }
    componentDidMount(){
        this.setHeaderTitle();
        this.setScrollTop()
    }
    //路由参数改变，重置之前版块的滚动条位置
    componentWillReceiveProps(nextProps){
        let self=this;
        if(this.props.params.tabName !== nextProps.params.tabName){
            this.saveScroll().then(function () {
                //先全部归零
                self.setHeaderTitle(nextProps.params.tabName);
                document.body.scrollTop=document.documentElement.scrollTop=0;
                window.setTimeout(self.setScrollTop,100)
            });
        }
    }
    //路由共用问题，路由参数改变不能及时更新组件，所以采取这笨拙的方法
    shouldComponentUpdate(nextProps){
        return true
    }
    //使用Promise主要是为了组件没卸载的时候能准确的先设置滚动条位置再返回之前版块的滚动条位置
    saveScroll(){
        return new Promise((resolve, reject) => {
            const {params:{tabName}} = this.props;
            let topicScroll= getSessionData('topicScroll')||[];
            let obj={};
            obj.tabName=tabName;
            obj.scroll=document.body.scrollTop||document.documentElement.scrollTop;
            let index=topicScroll.findIndex(function(value, index, arr) {
                return value.tabName == tabName;
            });
            if(index !== -1){
                topicScroll[index]=obj
            }else {
                topicScroll.push(obj)
            }
            setSessionData("topicScroll",topicScroll);
            resolve()
        });
    }
    //组件卸载，存储滚动条位置
    componentWillUnmount(){
        this.saveScroll();
    }
    _rowClick(rowData,e){
        e.target.tagName=='IMG'?hashHistory.push(`user/${rowData.author.loginname}`):hashHistory.push('topic/'+rowData.id)
    }
    _renderRow(rowData,SectionId,rowID) {
        let self=this;
        let obj=getTopicAndBg(rowData);
        return(
            <div className="list_item" key={rowID} onClick={self._rowClick.bind(this,rowData)}>
                <div className="item_title"><span className="topics_tab" style={{backgroundColor:obj.bgColor}}>{obj.type}</span>{rowData.title}</div>
                <div className="content_wrapper item_avatar">
                    <div>
                        <img className="border_img" src={replaceImgUrl(rowData.author.avatar_url)} />
                    </div>
                    <p>{`${rowData.reply_count}/${rowData.visit_count}`}</p>
                    <p>{dateDiff(rowData.last_reply_at)}</p>
                </div>
            </div>
        )
    }
    _loadMoreData() {
        let {dispatch,params:{tabName},topics} = this.props;
        let {page}=topics[tabName];
        dispatch(loadTopics(tabName, ++page));
    }
    onEndReached() {
        let {topics}=this.props;
        if (topics.isLoadingMore) {
            return;
        };
        this._loadMoreData();
    }
    render() {
        let {topics,params:{tabName}}=this.props;
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        let list=topics[tabName].list;
        return (
            <div className="pt_09">
                <ListView
                    dataSource={ds.cloneWithRows(list)}
                    useBodyScroll
                    renderRow={this._renderRow.bind(this)}
                    renderSeparator={(sectionID, rowID)=>{return(
                    <div key={`${sectionID}-${rowID}`} style={{height:'.15rem',backgroundColor:"#f5f5f9"}}></div>
                    )}}
                    scrollRenderAheadDistance={900}
                    onEndReached={this.onEndReached.bind(this)}
                    initialListSize={list.length-8}
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
