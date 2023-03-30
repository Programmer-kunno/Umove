import React, { Component }  from 'react';
import { StyleSheet, View, Image, Text, TextInput, Dimensions, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { EventRegister } from 'react-native-event-listeners'
import CheckBox from '@react-native-community/checkbox';

import { CustomerApi } from '../../api/customer'; 
import { UMColors } from '../../utils/ColorHelper';
import { dispatch } from '../../utils/redux';
import { saveUserDetailsRedux } from '../../redux/actions/User';
import { resetNavigation } from '../../utils/navigationHelper';
import { Loader } from '../Components/Loader';
import { setLoading } from '../../redux/actions/Loader';
import ErrorWithCloseButtonModal from '../Components/ErrorWithCloseButtonModal';
import { showError } from '../../redux/actions/ErrorModal';
import { UMIcons } from '../../utils/imageHelper';

const deviceWidth = Dimensions.get('screen').width

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

  async logIn() {
    dispatch(setLoading(true))
    this.setState({ error: false });
    const data = {
      username: this.state.username,
      password: this.state.password
    }
    const response = await CustomerApi.login(data);
    console.log(response)
    if(response == undefined){
      dispatch(setLoading(false))
      dispatch(showError(true))
    } else {
      if(!response?.data?.success) {
        this.setState({ error: true, errMsg: response?.data?.message });
        dispatch(setLoading(false))
      } else {
        dispatch(saveUserDetailsRedux(response?.data?.data))
        resetNavigation('DrawerNavigation')
        dispatch(setLoading(false))
      }
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
    return(
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.mainContainer}>
          <ErrorWithCloseButtonModal/>
              {/* Logo */}
              <View style={styles.mainLogoContainer}>
                <Image
                  source={UMIcons.mainLogo}
                  style={styles.logo}
                  resizeMode={'contain'}
                />
              </View>

              {/* Username and Password */}
              <View style={styles.inputContainer}>
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
                <View style={styles.rememberForgotContainer}>
                  <View style={styles.rememberContainer}>
                    <CheckBox
                      checkedColor='green'
                      value={this.state.remember}
                      onValueChange={() => {this.setState({remember: !this.state.remember})}}
                      style={styles.checkbox}
                    />
                    <Text style={styles.rememberMeTxt}>Remember Me</Text>
                  </View>
                  <TouchableOpacity onPress={() => this.props.navigation.navigate('ForgotPassword')}>
                    <Text style={styles.forgotPassword}>Forgot Password?</Text>
                  </TouchableOpacity>
                </View>
                {this.state.error && <View style={styles.errorContainer}><Text style={styles.errorMessage}>{this.state.errMsg}</Text></View>}

              </View>

              {/* Login Button */}
              <View style={styles.logInBtnContainer}>
                {/* Make button gray when not all inputs are filled out, orange when filled out */}
                { this.state.username == '' || this.state.password == '' ?
                <TouchableOpacity style={styles.loginButtonGray} disabled={true}>
                  <Text style={styles.loginButtonText}>LOG IN</Text>
                </TouchableOpacity>
                :
                <TouchableOpacity style={styles.loginButtonOrange} 
                  onPress={() => {
                    Keyboard.dismiss() 
                    this.logIn() 
                  }}
                >
                  <Text style={styles.loginButtonText}>LOG IN</Text>
                </TouchableOpacity>
                }
              </View>

              {/* Login with */}
              <View style={styles.altLogInContainer}>
                <Text style={styles.loginWithText}> or Log In with </Text>
                <View style={styles.row}>
                  <TouchableOpacity onPress={() => alert('Log In w/ google')}>
                    <Image
                      source={UMIcons.googleIcon}
                      style={styles.socials}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => alert('Log In w/ facebook')}>
                    <Image
                      source={UMIcons.facebookIcon}
                      style={styles.socials}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => alert('Log In w/ apple')}>  
                    <Image
                      source={UMIcons.appleIcon}
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
          <Loader/>
        </View>
      </TouchableWithoutFeedback>
    )
  }
}


const styles = StyleSheet.create({
  mainContainer: {
    flex: 1, 
    alignItems: 'center',
    backgroundColor: UMColors.BGOrange,
  },
  mainLogoContainer: {
    marginTop: '30%',
    alignItems: 'center',
    width: '100%',
    height: '15%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  logo: {
    height: '60%',
    width: '65%',
  },
  inputContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 15
  },
  inputPart: {
    margin: 5,
    width: '75%',
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
    height: 45,
    width: '100%',
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 25,
    borderColor: UMColors.primaryOrange,
    borderWidth: 1,
    backgroundColor: UMColors.white
  },
  rememberForgotContainer: {
    width: '75%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    marginVertical: 5
  },
  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center'
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
    color: UMColors.black,
  },
  forgotPassword: {
    fontStyle: 'italic',
    fontSize: 12,
    color: UMColors.black,
    paddingLeft: 30
  }, 
  logInBtnContainer: {
    width: '100%',
    alignItems: 'center'
  },
  loginButtonGray: {
    marginTop: '15%',
    height: 50,
    width: '70%',
    borderRadius: 25,
    justifyContent:'center',
    alignItems: 'center',
    backgroundColor: UMColors.primaryGray,
    elevation: 8
  },
  loginButtonOrange: {
    marginTop: '15%',
    height: 50,
    width: '70%',
    borderRadius: 25,
    justifyContent:'center',
    alignItems: 'center',
    backgroundColor: UMColors.primaryOrange,
    elevation: 8
  },
  loginButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight:'bold'
  },
  loginWithText: {
    color: 'black',
    fontSize: 12,
    marginTop: '10%',
    marginBottom: '3%'
  },
  altLogInContainer: {
    width: '100%',
    alignItems: 'center'
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
    height: 40,
    borderWidth: 1,
    borderColor: UMColors.red,
    borderRadius: 10,
    backgroundColor: '#ffcdd2',
    justifyContent: 'center',
  },
  errorMessage:{
    fontSize: 14,
    textAlign: 'center',
    color: UMColors.red
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  checkbox: {
    height: 20,
    width: 20,
    marginRight: 5
  }
})