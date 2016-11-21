import React,{Component} from 'react'
import {connect} from 'react-redux'
import {setLoginModalVisible,setLoginAccessToken,handleLogin} from 'REDUX/action'
import {Modal,Toast} from 'antd-mobile'
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
    handleScan(){
        let self=this;
        self.onClose();
        const {dispatch}=this.props;
        cordova.plugins.barcodeScanner.scan(
            function (result) {
                if (!result) return;
                dispatch(handleLogin(result.text));
            },
            function (error) {
                self.onClose();
                Toast.fail(`扫描失败：${error}`);
            },
            {
                "preferFrontCamera" : false, // iOS and Android
                "showFlipCameraButton" : false, // iOS and Android
                "prompt" : "码快来到扫描区域内...", // supported on Android only
                "formats" : "all", // default: all but PDF_417 and RSS_EXPANDED
                "orientation" : "portrait" // Android only (portrait|landscape), default unset so it rotates with the device
            }
        );
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
                footer={[
                    { text: 'token登录', onPress: () => {this.handlePress()} },
                    { text: '扫码', onPress: () => {this.handleScan()} }
                ]}
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