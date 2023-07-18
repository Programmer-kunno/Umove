import React, { Component, useEffect, useState }  from 'react';
import { 
  StyleSheet, 
  View, 
  ImageBackground, 
  Image, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  TouchableWithoutFeedback, 
  Keyboard,
  Dimensions
} from 'react-native';
import { CustomerApi } from '../../../api/customer'; 
import { saveUserDetailsRedux, updateUserAccess } from '../../../redux/actions/User';
import { dispatch } from '../../../utils/redux';
import { setLoading } from '../../../redux/actions/Loader';
import { Loader } from '../../Components/Loader';
import { UMColors } from '../../../utils/ColorHelper';
import { navigate, resetNavigation } from '../../../utils/navigationHelper';
import ErrorWithCloseButtonModal from '../../Components/ErrorWithCloseButtonModal';
import { showError } from '../../../redux/actions/ErrorModal';
import { TextSize, normalize } from '../../../utils/stringHelper';
import { UMIcons } from '../../../utils/imageHelper';
import ErrorOkModal from '../../Components/ErrorOkModal';

const deviceWidth = Dimensions.get('screen').width

export default SignUpScreen4 = (props) => {  

  const [registerData, setRegisterData] = useState({})
  const [error, setError] = useState({ value: false, message: '' })
  const [isLoading, setIsLoading] = useState(false)
  const [securePass, setSecurePass] = useState(true)
  const [secureConfirmPass, setSecureConfirmPass] = useState(true)

  useEffect(() => {
    dispatch(setLoading(false))
    setRegisterData(props.route?.params?.register)
  }, [])

  const signUpNext = async() => {
    dispatch(setLoading(true))
    try {
      if(registerData.password.length < 8) {
        dispatch(setLoading(false))
        setError({ value: true, message: "Password must be 8 characters long" })
      } else if(registerData.password !== registerData.confirmPassword) {
        dispatch(setLoading(false))
        setError({ value: true, message: "Password do not match, try again" })
      } else {
        const response = await CustomerApi.signUp(registerData)
        if(response == undefined){
          dispatch(setLoading(false))
          dispatch(showError(true))
        } else {
          if(response?.data?.message?.password) {
            dispatch(setLoading(false))
            setError({ value: true, message: response?.data?.message?.password[0] })
          } 
          if(response?.data?.success) {
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
                navigate('OTPScreen', { userData: { ...response?.data?.data, verify: 'email' }, registerData: registerData })
                dispatch(setLoading(false))
              } else {
                setError({ value: true, message: otpResponse?.data?.message || otpResponse?.data })
                dispatch(setLoading(false))
              }
            }
            // const data = {
            //   username: registerData.username,
            //   password: registerData.password
            // }
            // let response = await CustomerApi.login(data);
            // if(response == undefined){
            //   dispatch(setLoading(false))
            //   dispatch(showError(true))
            // } else {
            //   if(response?.data?.success) {
            //     dispatch(saveUserDetailsRedux(response?.data?.data))
            //     resetNavigation('DrawerNavigation')
            //     this.setState({error: false})
            //     dispatch(setLoading(false))
            //   } else {
            //     dispatch(setLoading(false))
            //     this.setState({error: true, message: 'Something went wrong try again later'})
            //   }
            // }
          }
        }
      }
    } catch (err) {
      console.log(err)
    }
  } 

  const checkIsEmptyInputs = () => {
    if( registerData.password == '' || registerData.confirmPassword == '' ){
      return true 
    } else {
      return false
    }
  }

  return(
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.mainContainer}>
      <ErrorWithCloseButtonModal/>
      <ErrorOkModal
        Visible={error.value}
        ErrMsg={error.message}
        OkButton={() => setError({ value: false, message: '' })}
      />
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image
              source={require('../../../assets/logo/logo-primary.png')}
              style={styles.logo}
              resizeMode={'contain'}
            />
          </View>

          {/* Sign Up input */}
          <View style={styles.bodyContainer}>
            <Text style={styles.signUpHeader}>Sign Up</Text>
            <View style={styles.inputPart}> 
              <Text style={styles.text}>
                Password
              </Text>
              <TextInput
                secureTextEntry={securePass}
                style={styles.input}
                onChangeText={(val) => {
                  setRegisterData({ ...registerData, password: val })
                }}  
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
            <View style={styles.inputPart}> 
              <Text style={styles.text}>
                Confirm Password
              </Text>
              <TextInput
                secureTextEntry={secureConfirmPass}
                style={styles.input}
                onChangeText={(val) => {
                  setRegisterData({ ...registerData, confirmPassword: val })
                }}   
              />
              <TouchableOpacity
                style={styles.showPassBtn}
                onPress={() => setSecureConfirmPass(!secureConfirmPass)}
              >
                <Image
                  style={{ width: 20, height: 20 }}
                  source={ secureConfirmPass ? UMIcons.eyeClosedIcon : UMIcons.eyeICon }
                  resizeMode='contain'
                />
              </TouchableOpacity>
            </View>
            {
              error.value && 
              <View style={styles.errorContainer}>
                <Text style={styles.errorMessage}>{error.message}</Text>
              </View>
            }
          </View>

          {/* Terms and Conditions & Privacy Policy */}
          <View style={styles.conditionsContainer}>
            <View style={styles.row}>
              <Text style={styles.conditionsText}>
                By clicking CONTINUE, you agree to our 
              </Text>
                <TouchableOpacity onPress={() => alert('Terms and Conditions')}>
                  <Text style={styles.underline}>
                    {" "} Terms and Conditions {" "}
                  </Text>
                </TouchableOpacity>
                <Text style={styles.conditionsText}>
                and that you have read our 
                </Text>
                <TouchableOpacity onPress={() => alert('Privacy Policy')}>
                  <Text style={styles.underline}>
                    {" "} Privacy Policy
                  </Text>
                </TouchableOpacity>
              <Text style={styles.conditionsText}>
                .
              </Text>
            </View>
          </View>

          {/* Continue Button */}
          <View style={styles.nextButtonContainer}>
            {/* Make button gray when not all inputs are filled out, orange when filled out */}
            <TouchableOpacity 
              style={[styles.nextButton, !checkIsEmptyInputs() && {backgroundColor: UMColors.primaryOrange}]} 
              disabled={checkIsEmptyInputs()}
              onPress={() => signUpNext()}
            >
              <Text style={styles.nextButtonText}>CONTINUE</Text>
            </TouchableOpacity>
          </View>
        <Loader/>
      </View>
    </TouchableWithoutFeedback>
  )
}


const styles = StyleSheet.create({
  mainContainer: {
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgb(238, 241, 217)',
  },
  logoContainer: {
    width: deviceWidth,
    height: '9%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    height: '100%',
    width: '100%',
  },
  bodyContainer: {
    width: '90%',
    height: '35%',
    alignItems: 'center',
  },
  signUpHeader: {
    fontSize: normalize(TextSize('L')),
    letterSpacing: 1,
    color: 'black',
    marginBottom: '5%',
  },
  inputPart: {
    margin: 5,
    width: '80%',
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
    borderColor: 'rgb(223,131,68)',
    borderWidth: 1,
    backgroundColor: 'white'
  },
  conditionsContainer: {
    width: '90%',
    height: '8%',
    marginTop: '10%',
    justifyContent:'center',
    marginBottom: '1%',
  },
  row: {
    flexDirection: 'row',
    justifyContent:'center',
    flexWrap: 'wrap',
  },
  conditionsText: {
    color: 'black',
    fontSize: normalize(TextSize('S')),
    alignItems: 'center',
  },
  underline: {
    color: 'black',
    fontSize: normalize(TextSize('S')),
    textDecorationLine: 'underline',
  },
  nextButton: {
    height: 45,
    width: '80%',
    borderRadius: 25,
    justifyContent:'center',
    alignItems: 'center',
    backgroundColor: UMColors.primaryGray,
    elevation: 5
  },
  nextButtonText: {
    color: 'white',
    fontSize: normalize(TextSize('Normal')),
    fontWeight:'bold'
  },
  nextButtonContainer: {
    width: '90%',
    alignItems: 'center',
  },
  errorContainer:{
    width: '80%',
    height: 35,
    borderWidth: 2,
    borderRadius: 5,
    borderColor: UMColors.red,
    backgroundColor: '#ffcdd2',
    position: 'absolute',
    bottom: 25,
    alignItems: 'center',
    justifyContent: 'center'
  },
  errorMessage:{
    fontSize: normalize(TextSize('Normal')),
    textAlign: 'center',
    color: '#d32f2f'
  },
  showPassBtn: {
    position: 'absolute',
    bottom: '20%',
    right: '6%'
  },
})