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
import { CustomerApi } from '../../api/customer'; 
import { dispatch } from '../../utils/redux';
import { setLoading } from '../../redux/actions/Loader';
import { Loader } from '../Components/Loader';
import { UMColors } from '../../utils/ColorHelper';
import { navigate, resetNavigation } from '../../utils/navigationHelper';
import ErrorWithCloseButtonModal from '../Components/ErrorWithCloseButtonModal';
import { showError } from '../../redux/actions/ErrorModal';
import { TextSize, normalize } from '../../utils/stringHelper';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import ErrorOkModal from '../Components/ErrorOkModal';
import SuccessOkModal from '../Components/SuccessOkModal';
import jwtDecode from "jwt-decode";
import { UMIcons } from '../../utils/imageHelper';
import { useIsFocused } from '@react-navigation/native';
import { saveUser, saveUserDetailsRedux, updateUserAccess } from '../../redux/actions/User';

const deviceWidth = Dimensions.get('screen').width

export default OTPScreen = (props) => {  

  const [userData, setUserData] = useState({})
  const [error, setError] = useState({ value: false, message: '' })
  const [success, setSuccess] = useState({ value: false, message: '' })
  const [verificationCode, setVerificationCode] = useState('')
  const [registerData, setRegisterData] = useState(undefined)
  const isFocused = useIsFocused()
  

  useEffect(() => {
    if(isFocused){
      dispatch(setLoading(false))
      setUserData(props.route?.params?.userData)
      if(props.route?.params?.registerData){
        setRegisterData(props.route?.params?.registerData)
        console.log(props.route?.params?.registerData)
      }
    }
  }, [isFocused])

  const verifyOTP = async() => {
    dispatch(setLoading(true))
    const data = {
      method: userData?.verify,
      otp: verificationCode.toString()
    }
    const response = await CustomerApi.verifyOTP(data, userData?.access)
    if(response == undefined){
      dispatch(showError(true))
      dispatch(setLoading(false))
    } else {
      if(response?.data?.success){
        if(registerData == undefined){
          dispatch(updateUserAccess(userData?.access))
          resetNavigation('Landing')
          dispatch(setLoading(false))
        } else {
          logIn()
        }
      } else {
        setError({ value: true, message: response?.data?.message || response?.data})
        dispatch(setLoading(false))
      }
    }
  }

  const requestOTP = async() => {
    dispatch(setLoading(true))
    const data = {
      method: userData?.verify
    }
    const otpResponse = await CustomerApi.requestOTP(data, userData?.access)
    if(otpResponse == undefined){
      dispatch(showError(true))
      dispatch(setLoading(false))
    } else {
      if(otpResponse?.data?.success){
        dispatch(setLoading(false))
        setSuccess({ value: true, message: 'Request Sent' })
      } else {
        setError({ value: true, message: otpResponse?.data?.message || otpResponse?.data })
        dispatch(setLoading(false))
      }
    }
  }

  const logIn = async() => {
    const data = {
      username: registerData.username,
      password: registerData.password
    }
    const response = await CustomerApi.login(data);
    if(response == undefined){
      dispatch(setLoading(false))
      dispatch(showError(true))
    } else {
      if(response?.data?.success) {
        dispatch(saveUserDetailsRedux(response?.data?.data))
        resetNavigation('Landing')
        dispatch(setLoading(false))
      } else {
        dispatch(setLoading(false))
        setError({value: true, message: response?.data?.message || response?.data })
      }
    }
  }



  const refreshToken = async(callback) => {
    const refreshData = {
      refresh: userData?.refresh
    }
    const decodedToken = jwtDecode(userData?.access)
    const expiry = decodedToken.exp
    const isExpired = (expiry * 1000) <= new Date().getTime()
    if(isExpired){
      const response = await CustomerApi.refreshAccess(refreshData)
      if(response?.data?.success){
        setUserData({ ...userData, access: response?.data?.data?.access})
        callback?.()
      } else {
        setError({ value: true, message: response?.data?.message || response?.data })
      }
    } else {
      callback?.()
    }
  }

  const checkIsEmptyInputs = () => {
    if( verificationCode.toString().length !== 6 ){
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
      <SuccessOkModal
        Visible={success.value}
        SuccessMsg={success.message}
        OkButton={() => setSuccess({ value: false, message: '' })}
      />
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image
              source={UMIcons.mainLogo}
              style={styles.logo}
              resizeMode={'contain'}
            />
          </View>

          {/* Sign Up input */}
          <View style={styles.bodyContainer}>
            <Text style={styles.headerTxt}>OTP Verification</Text>
            <Text style={styles.normalTxt}>
              {`Please enter the verfication code sent to your ` + (userData?.verify == 'sms' ? 'mobile number' : 'email') }
              <Text style={{ fontSize: normalize(TextSize('M')), color: UMColors.primaryOrange }}>
                { ' ' + (userData?.verify == 'sms' ? userData?.mobile_number : userData?.user?.user_profile?.email || userData?.email) }
              </Text>
            </Text>
            <OTPInputView
              style={{ width: '80%', height: 120 }}
              onCodeChanged={code => {
                setVerificationCode(code)
              }}
              editable={true}
              pinCount={6}
              autoFocusOnLoad
              codeInputFieldStyle={styles.underlineStyleBase}
              codeInputHighlightStyle={styles.underlineStyleHighLighted}
            />
            <View style={styles.resendContainer}>
              <Text style={styles.resendTxt}>
                {`Didn't receive the OTP? `}
              </Text>
              <TouchableOpacity
                style={styles.resendBtn}
                onPress={() => {
                  refreshToken(requestOTP)
                }}
              >
                <Text style={[styles.resendTxt, { textDecorationLine: 'underline' }]}>Resend</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Continue Button */}
          <View style={styles.nextButtonContainer}>
            {/* Make button gray when not all inputs are filled out, orange when filled out */}
            <TouchableOpacity 
              style={[styles.nextButton, !checkIsEmptyInputs() && {backgroundColor: UMColors.primaryOrange}]} 
              disabled={checkIsEmptyInputs()}
              onPress={() => refreshToken(verifyOTP)}
            >
              <Text style={styles.nextButtonText}>VERIFY</Text>
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
  headerTxt: {
    fontSize: normalize(TextSize('L')),
    fontWeight: 'bold',
    color: 'black',
    marginVertical: '5%',
  },
  normalTxt: {
    width: '90%',
    color: UMColors.black,
    fontSize: normalize(TextSize('M')),
    textAlign: 'center',
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
    marginTop: '15%'
  },
  errorContainer:{
    width: '90%',
    height: '20%',
    borderWidth: 2,
    borderRadius: 5,
    borderColor: UMColors.red,
    backgroundColor: '#ffcdd2',
    position: 'absolute',
    bottom: 0,
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
  borderStyleBase: {
    width: 30,
    height: 45
  },
  borderStyleHighLighted: {
    borderColor: "#03DAC6",
  },
  underlineStyleBase: {
    color: UMColors.black,
    fontSize: normalize(TextSize('Normal')),
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: UMColors.primaryOrange,
    borderRadius: 100,
    backgroundColor: UMColors.white,
    elevation: 7
  },
  underlineStyleHighLighted: {
    backgroundColor: UMColors.white,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  resendTxt: {
    fontSize: normalize(TextSize('Normal')),
  }
})