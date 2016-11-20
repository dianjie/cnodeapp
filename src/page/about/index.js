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
                        <h3>项目地址</h3>
                        <p><a href="https://github.com/dianjie/cnodeapp" target="_blank">https://github.com/dianjie/cnodeapp</a></p>
                    </div>
                    <div>
                        <h3>开发初衷</h3>
                        <p className="lh">
                            虽github上开源了好多版本的，但自己没亲自写，都是云里云雾的，就搞一个给自己玩的app!
                            一弄起来,发觉很多东西要弄的，处理域内外链接问题，流量消耗问题、链接能在app上打开问题各种毛病；所以代码还是要多写！！
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

