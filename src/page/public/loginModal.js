import React,{Component} from 'react'
import {connect} from 'react-redux'
import {setLoginModalVisible,setLoginAccessToken,handleLogin} from 'REDUX/action'
import {Modal} from 'antd-mobile'
class LoginModal extends Component{
    constructor(props){
        super(props);
        this.onClose=this.onClose.bind(this);
        this.handleChange=this.handleChange.bind(this);
        this.handlePress=this.handlePress.bind(this)
    }
    onClose() {
        const {dispatch,loginModal}=this.props;
        dispatch(setLoginModalVisible(!loginModal.visible));
        dispatch(setLoginAccessToken(''));
    }
    handleChange(event){
        const {dispatch}=this.props;
        dispatch(setLoginAccessToken(event.target.value))
    }
    handlePress(){
        const {dispatch,loginModal}=this.props;
        if(!loginModal.accessToken){
            this.onClose();
            return ;
        }
        dispatch(handleLogin(loginModal.accessToken));
        this.onClose();
    }
    render(){
        const {loginModal}=this.props;
        const {visible,accessToken}=loginModal;
        return(
            <Modal
                closable
                maskClosable
                transparent
                onClose={this.onClose}
                visible={visible}
                footer={[{ text: '确定', onPress: () => {this.handlePress()} }]}
            >
               <div className="loginModal">
                   <input
                       type="text"
                       placeholder="access token"
                       value={accessToken} onChange={this.handleChange}
                   />
               </div>
            </Modal>
        )
    }
}
export default connect(state=>({
    loginModal:state.loginModal
}))(LoginModal)