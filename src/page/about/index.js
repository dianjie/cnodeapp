import React, {Component} from 'react'
import {connect} from 'react-redux'
import {setNavBarTitle,setNavBarPoints} from 'REDUX/action'
class UserHome extends Component {
    constructor(props) {
        super(props)

    }
    componentWillMount(){
        let {dispatch}=this.props;
        //修改头部标题
        dispatch(setNavBarTitle('关于'));
        //设置头部要素
        dispatch(setNavBarPoints({
            left:true,
            right:false,
            color:'',
            iconName:'left'
        }));
    }
    render() {
        return (
            <div className="pt_09">
                <div className="detail_content">
                    <div>
                        <h3>关于项目</h3>
                        <p>该项目是基于<a href="https://cnodejs.org">Cnodejs</a>的api</p>
                    </div>
                    <div>
                        <h3>项目地址</h3>
                        <p><a href="https://github.com/dianjie/cnodeapp" target="_blank">https://github.com/dianjie/cnodeapp</a></p>
                    </div>
                    <div>
                        <h3>问题反馈</h3>
                        <p className="lh">
                            <a href="https://github.com/dianjie/cnodeapp/issues">https://github.com/dianjie/cnodeapp/issues</a>
                        </p>
                    </div>
                    <div>
                        <h3>版本</h3>
                        <p>I don't not!</p>
                    </div>
                </div>
            </div>
        )
    }
}
export default connect(state=>({

}))(UserHome)

