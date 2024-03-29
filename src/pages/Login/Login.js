import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Image, Text, TextInput, Dimensions, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { EventRegister } from 'react-native-event-listeners'
import CheckBox from '@react-native-community/checkbox';

import { CustomerApi } from '../../api/customer'; 
import { UMColors } from '../../utils/ColorHelper';
import { dispatch } from '../../utils/redux';
import { saveUserDetailsRedux, saveUserPass } from '../../redux/actions/User';
import { navigate, resetNavigation } from '../../utils/navigationHelper';
import { Loader } from '../Components/Loader';
import { setLoading } from '../../redux/actions/Loader';
import ErrorWithCloseButtonModal from '../Components/ErrorWithCloseButtonModal';
import { showError } from '../../redux/actions/ErrorModal';
import { UMIcons } from '../../utils/imageHelper';
import { useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';
import { TextSize, normalize } from '../../utils/stringHelper';
import { UMFont } from '../../utils/fontHelper';

const deviceWidth = Dimensions.get('screen').width

export default Login = (props) => {
  const logInData = useSelector(state => state.userOperations.logInData)
  const [username, setUsername] = useState( logInData ? logInData.username : '')
  const [password, setPassword] = useState( logInData ? logInData.password : '')
  const [remember, setRemember] = useState(false)
  const [securePass, setSecurePass] = useState(true)
  const isFocused = useIsFocused()
  const [error, setError] = useState({
    value: false,
    message: ''
  })
    
  useEffect(() => {
    if(isFocused) {
      dispatch(setLoading(false))
    }
  }, [isFocused])

  const logIn = async() => {
    dispatch(setLoading(true))
    setError({ ...error, value: false });
    const data = {
      username: username,
      password: password
    }
    const response = await CustomerApi.login(data);
    if(response == undefined){
      dispatch(setLoading(false))
      dispatch(showError(true))
    } else {
      if(!response?.data?.success) {
        setError({ value: true, message: response?.data?.message || response?.data });
        dispatch(setLoading(false))
      } else {
        if(response?.data?.data?.is_email_verified){
          dispatch(saveUserDetailsRedux({ ...response?.data?.data, rememberMe: remember }))
          resetNavigation('Landing', { savedLogInData: data })
        } else {
          const data = {
            'method': 'email'
          }
          const otpResponse = await CustomerApi.requestOTP(data, response?.data?.data?.access)
          if(otpResponse == undefined){
            dispatch(showError(true))
            dispatch(setLoading(false))
          } else {
            if(otpResponse?.data?.success){
              setError({ value: false, message: '' })
              navigate('OTPScreen', { userData: { ...response?.data?.data, rememberMe: remember, verify: 'email' } })
              dispatch(setLoading(false))
            } else {
              setError({ value: true, message: otpResponse?.data?.message || otpResponse?.data })
              dispatch(setLoading(false))
            }
          }
        }
        dispatch(setLoading(false))
      }
    }
  }

  const loggedOut = () => {

  }

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
                  value={username}
                  onChangeText={(val) => {setUsername(val)}}  
                />
              </View>
              <View style={styles.inputPart}> 
                <Text style={styles.text}>
                  Password
                </Text>
                <View style={styles.passwordInputContainer}>
                  <TextInput
                    style={[styles.input, { paddingRight: 50 }]}
                    secureTextEntry={securePass}
                    value={password}
                    onChangeText={(val) => {setPassword(val)}}  
                  />
                  <TouchableOpacity
                    style={styles.showPassBtn}
                    onPress={() => setSecurePass(!securePass)}
                  >
                    <Image
                      style={{ width: 20, height: 20 }}
                      source={ securePass ? UMIcons.eyeClosedIcon : UMIcons.eyeICon }
                      resizeMode='contain'
                    />
                  </TouchableOpacity>
                </View>
              </View>
              
              {/* Remember Me and Forgot Password */}
              <View style={styles.rememberForgotContainer}>
                <View style={styles.rememberContainer}>
                  <CheckBox
                    checkedColor='green'
                    value={remember}
                    onValueChange={() => {setRemember(!remember)}}
                    style={styles.checkbox}
                  />
                  <Text style={styles.rememberMeTxt}>Remember Me</Text>
                </View>
              </View>
              {error.value && <View style={styles.errorContainer}><Text style={styles.errorMessage}>{error.message}</Text></View>}
            </View>

            {/* Login Button */}
            <View style={styles.logInBtnContainer}>
              {/* Make button gray when not all inputs are filled out, orange when filled out */}
              <TouchableOpacity 
                style={username == '' || password == '' ? styles.loginButtonGray : styles.loginButtonOrange} 
                disabled={username == '' || password == '' ? true : false}
                onPress={() => {
                  Keyboard.dismiss() 
                  logIn() 
                }}
              >
                <Text style={styles.loginButtonText}>LOG IN</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigate('ForgotPassword')}>
                <Text style={styles.forgotPassword}>Forgot Password?</Text>
              </TouchableOpacity>
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
                    navigate('SignUpScreen')
                  }}>
                    <Text style={styles.underline}>
                      Sign Up
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <Text style={styles.versionTxt}>{'v' + DeviceInfo.getVersion()}</Text>
        <Loader/>
      </View>
    </TouchableWithoutFeedback>
  )
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
    fontSize: normalize(TextSize('Normal')),
    paddingLeft: 8,
    paddingBottom: 3,
    color: 'black'
  }, 
  input: {
    fontSize: normalize(TextSize('Normal')),
    height: 45,
    width: '100%',
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 25,
    borderColor: UMColors.primaryOrange,
    borderWidth: 1,
    backgroundColor: UMColors.white,
  },
  passwordInputContainer: {
    width: '100%'
  },
  showPassBtn: {
    position: 'absolute',
    bottom: '30%',
    right: '6%'
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
    marginLeft: 10,
    fontSize: normalize(TextSize('Normal')),
    color: UMColors.black,
  },
  forgotPassword: {
    marginTop: 10,
    fontSize: normalize(TextSize('Normal')),
    color: UMColors.black,
  }, 
  logInBtnContainer: {
    width: '100%',
    alignItems: 'center',
  },
  loginButtonGray: {
    marginTop: '13%',
    height: 50,
    width: '70%',
    borderRadius: 25,
    justifyContent:'center',
    alignItems: 'center',
    backgroundColor: UMColors.primaryGray,
    elevation: 8
  },
  loginButtonOrange: {
    marginTop: '13%',
    height: 45,
    width: '70%',
    borderRadius: 25,
    justifyContent:'center',
    alignItems: 'center',
    backgroundColor: UMColors.primaryOrange,
    elevation: 8
  },
  loginButtonText: {
    color: 'white',
    fontSize: normalize(TextSize('Normal')),
    fontWeight:'bold'
  },
  loginWithText: {
    color: 'black',
    fontSize: normalize(TextSize('Normal')),
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
    fontSize: normalize(TextSize('Normal')),
  },
  underline: {
    color: 'black',
    fontSize: normalize(TextSize('Normal')),
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
    fontSize: normalize(TextSize('Normal')),
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
  },
  versionTxt: {
    position: 'absolute',
    bottom: 10,
    fontSize: normalize(TextSize('S')),
    right: 10
  }
})