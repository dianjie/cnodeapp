import React,{Component} from 'react'
import {connect} from 'react-redux'
import TopicCreate from './topic.create'
class TopicEdit extends Component{
    constructor(props){
        super(props);
    }
    render(){
        const {params} = this.props;
        return(
            <TopicCreate topicId={params.topicId}></TopicCreate>
        )
    }
}
export default connect(state=>({
    
}))(TopicEdit)
