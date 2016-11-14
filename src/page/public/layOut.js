import React, {PropTypes, Component} from 'react';
import {connect} from 'react-redux';
import {hashHistory} from 'react-router';
import Menu from 'PAGE/menu/menu';
import LoginModal from './loginModal';
import {menuOpenChange,handleLogin,resetNavBarPoints} from 'REDUX/action';
import {getLocalData} from 'SYSTEM/system';
import {NavBar, Icon,ActivityIndicator} from 'antd-mobile';
class LayOut extends Component {
    static propTypes = {
        children: PropTypes.element
    };
    onOpenChange() {
        let {dispatch}=this.props;
        dispatch(menuOpenChange())
    }
    componentWillMount(){
        let {dispatch}=this.props;
        let accessToken=getLocalData("accessToken");
        if(!accessToken) return;
        dispatch(handleLogin(accessToken))
    }
    renderNavBar() {
        let {dispatch}=this.props;
        let {points, title}=this.props.navBar;
        let {left, leftClick, right, color, iconName,rightContent}=points;
        if (left && iconName == '') {
            iconName = 'left'
        }
        if(iconName == 'bars'){
            leftClick=this.onOpenChange.bind(this);
        }else if(iconName == 'left'){
            leftClick=()=>{hashHistory.goBack()}
        }
        if (left && right) {
            return (
                <NavBar className="app_bar" iconName={iconName} style={{backgroundColor: color}} onLeftClick={leftClick}
                        rightContent={rightContent()}>{title}</NavBar>
            )
        } else if (left && !right) {
            return (
                <NavBar className="app_bar" iconName={iconName} style={{backgroundColor: color}} onLeftClick={leftClick}
                >{title}</NavBar>
            )
        } else if (!left && right) {
            return (
                <NavBar className="app_bar" iconName={iconName} style={{backgroundColor: color}}
                        rightContent={rightContent()}>{title}</NavBar>
            )
        } else {
            return (
                <NavBar className="app_bar" iconName={""} style={{backgroundColor: color}}>{title}</NavBar>
            )
        }
    };
    render() {
        return (
            <div>
                {this.renderNavBar()}
                <Menu/>
                <ActivityIndicator
                    toast
                    text="正在加载"
                    animating={this.props.system.animating}
                />
                <LoginModal/>
                <div className="overflow_at app_content">
                    {this.props.children}
                </div>

            </div>
        );
    }
}
export default connect(state=>({
    system:state.system,
    loginModal:state.loginModal,
    navBar: state.navBar
}))(LayOut);