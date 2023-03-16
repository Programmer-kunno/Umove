import React, { Component }  from 'react';
import { StyleSheet, View, Image, Text, TextInput, Modal, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { EventRegister } from 'react-native-event-listeners'
// import { CheckBox } from 'react-native-elements';
import CheckBox from '@react-native-community/checkbox';

import { CustomerApi } from '../../api/customer'; 
import { getStorage, setStorage } from '../../api/helper/storage';
import { UMColors } from '../../utils/ColorHelper';

import { dispatch } from '../../utils/redux';
import { saveUserDetailsRedux } from '../../redux/actions/User';
import { resetNavigation } from '../../utils/navigationHelper';
import { Loader } from '../Components/Loader';
import { setLoading } from '../../redux/actions/Loader';


export default class Login extends Component {  
  constructor() {
    super();
    
    this.state = { 
      username: '',
      password: '', 
      remember: false,
      error: false,
      errMsg: '',
      modalVisible: false
    };
  }

  async componentDidMount() {
    dispatch(setLoading(false))
    this.loggedOut();
  }

  componentWillUnmount() {
    EventRegister.removeEventListener(this.listener)
  }

  async componentDidUpdate() {
    if(this.state.remember || !this.state.remember) {
      await setStorage('remember', JSON.stringify(this.state.remember));
    }
  }
  
  async logIn() {
    dispatch(setLoading(true))
    this.setState({ error: false });
    const data = {
      username: this.state.username,
      password: this.state.password
    }
    const res = await CustomerApi.login(data);
    if(!res.success) {
      this.setState({ error: true, errMsg: res.message });
      dispatch(setLoading(false))
    } else {
      dispatch(saveUserDetailsRedux(res.data))
      this.customerTypeRouting(res.data);
    }
  }

  async customerTypeRouting(res) {
    let customerType = res.customer_type.toLowerCase()
    if(customerType == 'individual') {
      resetNavigation('IndivDashboard')
      dispatch(setLoading(false))
    } else if (customerType == 'corporate') {
      resetNavigation('DrawerNavigation')
      dispatch(setLoading(false))
    }
  }

  async loggedOut() {
    if (!this.listener) {
      this.listener = EventRegister.addEventListener('logout', () => {
        this.setState({username: ''})
        this.setState({password: ''})
        this.setState({remember: false})
      });
    }
  }

  render() {
    const { modalVisible } = this.state;
    return(
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <View style={styles.innerContainer}>
            <View style={styles.content}>

              {/* Logo */}
              <View style={styles.alignItemCenter}>
                <Image
                  source={require('../../assets/logo/logo-primary.png')}
                  style={styles.logo}
                />
              </View>

              {/* Username and Password */}
              <View style={styles.alignItemCenter}>
                <View style={styles.inputPart}> 
                  <Text style={styles.text}>
                    Email or Username
                  </Text>
                  <TextInput
                    style={styles.input}
                    value={this.state.username}
                    onChangeText={(val) => {this.setState({username: val})}}  
                  />
                </View>
                <View style={styles.inputPart}> 
                  <Text style={styles.text}>
                    Password
                  </Text>
                  <TextInput
                    style={styles.input}
                    secureTextEntry={true}
                    value={this.state.password}
                    onChangeText={(val) => {this.setState({password: val})}}  
                  />
                </View>
                
                {/* Remember Me and Forgot Password */}
                <View style={[styles.spaceBetween, styles.row]}>
                  <CheckBox
                    checkedColor='green'
                    value={this.state.remember}
                    onValueChange={() => {this.setState({remember: !this.state.remember})}}
                    style={styles.checkbox}
                  />
                  <Text style={styles.rememberMeTxt}>Remember Me</Text>
                  <TouchableOpacity onPress={() => this.props.navigation.navigate('ForgotPassword')}>
                    <Text style={styles.forgotPassword}>Forgot Password?</Text>
                  </TouchableOpacity>
                </View>
                {this.state.error ? <View style={styles.errorContainer}><Text style={styles.errorMessage}>{this.state.errMsg}</Text></View> : null}

              </View>

              {/* Login Button */}
              <View style={styles.alignItemCenter}>
                {/* Make button gray when not all inputs are filled out, orange when filled out */}
                { this.state.username == '' || this.state.password == '' ?
                <TouchableOpacity style={styles.loginButtonGray} disabled={true}>
                  <Text style={styles.loginButtonText}>LOG IN</Text>
                </TouchableOpacity>
                :
                <TouchableOpacity style={styles.loginButtonOrange} onPress={() => { this.logIn() }}>
                  <Text style={styles.loginButtonText}>LOG IN</Text>
                </TouchableOpacity>
                }
              </View>

              {/* Login with */}
              <View style={styles.alignItemCenter}>
                <Text style={styles.loginWithText}> or Log In with </Text>
                <View style={styles.row}>
                  <TouchableOpacity onPress={() => alert('Log In w/ google')}>
                    <Image
                      source={require('../../assets/socials/google.png')}
                      style={styles.socials}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => alert('Log In w/ facebook')}>
                    <Image
                      source={require('../../assets/socials/facebook.png')}
                      style={styles.socials}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => alert('Log In w/ apple')}>  
                    <Image
                      source={require('../../assets/socials/apple.png')}
                      style={styles.socials}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => alert('Log In w/ fingerprint')}>  
                    <Image
                      source={require('../../assets/socials/fingerprint.png')}
                      style={styles.socials}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Sign Up */}
              <View style={styles.alignItemCenter}>
                <View style={styles.signUpContainer}>
                  <View style={styles.row}>
                    <Text style={styles.signUpText}>
                      Don't have an account? {" "}
                    </Text>
                    <TouchableOpacity onPress={() => {
                      this.props.navigation.navigate('SignUpScreen')
                    }}>
                      <Text style={styles.underline}>
                        Sign Up
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

            </View>
          </View>
          <Loader/>
        </View>
      </TouchableWithoutFeedback>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'center',
    backgroundColor: 'rgb(238, 241, 217)',
  },
  innerContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  alignItemCenter: {
    alignItems: 'center'
  },
  logo: {
    height: 60,
    width: 275,
    marginTop: '20%',
    marginBottom: '20%',
  },
  inputPart: {
    margin: 5,
    width: '70%',
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  text: {
    fontSize: 15,
    paddingLeft: 8,
    paddingBottom: 3,
    color: 'black'
  }, 
  input: {
    fontSize: 15,
    height: 50,
    width: '100%',
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 25,
    borderColor: 'rgb(223,131,68)',
    borderWidth: 1,
    backgroundColor: 'white'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',    
  },
  spaceBetween: {
    justifyContent:'space-between',
  },
  rememberMeTxt: {
    fontSize: 13,
    color: 'black',
  },
  forgotPassword: {
    fontStyle: 'italic',
    fontSize: 12,
    color: 'black',
    paddingLeft: 30
  }, 
  loginButtonGray: {
    marginTop: '15%',
    height: 50,
    width: '70%',
    borderRadius: 25,
    justifyContent:'center',
    alignItems: 'center',
    backgroundColor: 'gray',
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 6},
    shadowOpacity: 0.9,
    shadowRadius: 3,
  },
  loginButtonOrange: {
    marginTop: '15%',
    height: 50,
    width: '70%',
    borderRadius: 25,
    justifyContent:'center',
    alignItems: 'center',
    backgroundColor: 'rgb(223,131,68)',
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 6},
    shadowOpacity: 0.9,
    shadowRadius: 3,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight:'bold'
  },
  loginWithText: {
    color: 'black',
    fontSize: 12,
    marginTop: '25%',
    marginBottom: '3%'
  },
  socials: {
    margin: 8,
    height: 25,
    width: 25
  },
  signUpContainer: {
    marginTop: '5%',
    alignItems: 'center',
    justifyContent:'center',
  },
  signUpText: {
    color: 'black',
    fontSize: 14,
  },
  underline: {
    color: 'black',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  errorContainer:{
    position: 'absolute',
    bottom: -45,
    width: '70%',
    borderWidth: 1,
    borderColor: UMColors.red,
    borderRadius: 10,
    backgroundColor: '#ffcdd2',
  },
  errorMessage:{
    textAlign: 'center',
    padding: 10,
    color: '#d32f2f'
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    borderColor: 'rgb(223,131,68)',
    borderWidth: 1,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalRow: {
    marginTop: '5%',
    flexDirection: 'row',
    alignItems: 'center',    
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    margin: 5
  },
  modalButton: {
    backgroundColor: "rgb(223,131,68)",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 15
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
    fontWeight: 'bold'
  },
})