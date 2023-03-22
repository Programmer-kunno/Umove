import React, { useEffect, useState }  from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  TextInput, 
  TouchableWithoutFeedback, 
  Keyboard 
} from 'react-native';
import { UMColors } from '../../utils/ColorHelper';
import { UMIcons } from '../../utils/imageHelper';
import { goBack } from '../../utils/navigationHelper';
import { emailRegex } from '../../utils/stringHelper';
import { navigate } from '../../utils/navigationHelper';
import { CustomerApi } from '../../api/customer';
import { dispatch } from '../../utils/redux';
import { showError } from '../../redux/actions/ErrorModal';
import ErrorWithCloseButtonModal from '../Components/ErrorWithCloseButtonModal';
import { Loader } from '../Components/Loader';
import { setLoading } from '../../redux/actions/Loader';

export default ForgotPassword = () => {  

  const[email, setEmail] = useState('')
  const[emailSent, setEmailSent] = useState(false)
  const[err, setErr] = useState({
    value: false,
    message: ''
  })

  useEffect(() => {
    dispatch(setLoading(false))
  }, [])

  resetPassword = async() => {
    dispatch(setLoading(true))
    if(!emailRegex(email)) {
      setErr({ value: true, message: 'Please enter a valid email' })
      dispatch(setLoading(false))
    } else {
      const data = { email: email }
      const response = await CustomerApi.resetPassword(data)
      console.log(response)
      if(response == undefined){
        dispatch(showError(true))
        dispatch(setLoading(false))
      } else {
        if(response.data.success){
          setErr({...err, value: false })
          setEmailSent(true)
          dispatch(setLoading(false))
        } else {
          setErr({ value: true, message: 'Email not found' })
          dispatch(setLoading(false))
        }
      }
    }
  }

  return(
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.mainContainer}>
        <ErrorWithCloseButtonModal/>
          {/* Header */}
          <View style={styles.headerContainer}>           
            <View style={styles.headerBackContainer}>
              <TouchableOpacity
                style={styles.headerBackBtn}
                onPress={() => {
                  goBack()
                }}
              >
                <Image
                  style={{width: 50}}
                  source={UMIcons.backIconOrange}
                  resizeMode={'contain'}
                />
              </TouchableOpacity>          
            </View>
          </View>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image
              source={UMIcons.mainLogo}
              style={styles.logo}
              resizeMode={'contain'}
            />
            {err.value && <View style={styles.errorContainer}><Text style={styles.errorMessage}>{err.message}</Text></View>}
          </View>

          {/* Body */}
          <View style={styles.bodyContainer}>
            { !emailSent ?
              <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
                <Text style={styles.forgotTxt}>
                  Forgot your Password?
                </Text>
                <Text style={styles.forgotBodyTxt}>
                  Enter your registered email below to receive password reset instruction
                </Text>                
                <TextInput
                  style={styles.input}
                  onChangeText={(val) => {setEmail(val)}}  
                  keyboardType={'email-address'}
                />
              </View>
              :
              <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
                <Image
                  style={styles.sentIcon}
                  source={UMIcons.sentIcon}
                  resizeMode={'contain'}
                />
                <Text style={styles.emailSentTxt}>
                  Email has been sent!
                </Text>
                <Text style={styles.emailSentBodyTxt}>
                  Please check your inbox and click the link to reset a password.
                </Text>  
              </View>
            } 
          </View>

          {/* Send Button */}
          <View style={styles.btnContainer}>
            {/* Make button gray when not all inputs are filled out, orange when filled out */}
            { email == ''  ?
            <TouchableOpacity style={styles.sendButtonGray} disabled={true}>
              <Text style={styles.sendButtonText}>SEND</Text>
            </TouchableOpacity>
            : emailSent ?
            <TouchableOpacity style={styles.sendButtonOrange} onPress={() => {
              navigate('Login')
            }}>
              <Text style={styles.sendButtonText}>Log In</Text>
            </TouchableOpacity>
            : 
            <TouchableOpacity style={styles.sendButtonOrange} onPress={() => {
              resetPassword()
            }}>
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
            }
          </View>
        <Loader/>
      </View>
    </TouchableWithoutFeedback>
  )
}


const styles = StyleSheet.create({
  mainContainer: {
    flex: 1, 
    backgroundColor: UMColors.BGOrange,
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '15%',
    marginTop: '5%'
  },
  logo: {
    height: '60%',
    width: '100%',
  },
  bodyContainer: {
    width: '100%',
    height: '30%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  input: {
    fontSize: 15,
    height: 50,
    width: '75%',
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 25,
    borderColor: UMColors.primaryOrange,
    borderWidth: 1,
    backgroundColor: UMColors.white
  },
  forgotTxt: {
    color: UMColors.black,
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 15,
  },
  forgotBodyTxt: {
    fontSize: 15,
    color: UMColors.black,
    textAlign: 'center',
    marginBottom: 30,
    width: '75%'
  },
  btnContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '10%',
    marginTop: '20%'
  },
  sendButtonGray: {
    height: 50,
    width: '70%',
    borderRadius: 25,
    justifyContent:'center',
    alignItems: 'center',
    backgroundColor: UMColors.primaryGray,
    elevation: 10 
  },
  sendButtonOrange: {
    height: 50,
    width: '70%',
    borderRadius: 25,
    justifyContent:'center',
    alignItems: 'center',
    backgroundColor: UMColors.primaryOrange,
    elevation: 10
  },
  sendButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold'
  },
  headerContainer: {
    height: '11%',
    width: '100%',
    backgroundColor: UMColors.BGOrange,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingTop: '10%'
  },
  headerLeft: {
    flex: 1,
    alignItems: 'flex-start',
  },
  headerLeftBtn: {
    width: '40%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBackContainer: {
    marginLeft: 5
  },
  //Email sent style
  sentIcon: {
    width: '12%',
    height: '25%'
  },
  emailSentTxt: {
    color: UMColors.black,
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 15,
    marginTop: 10
  },
  emailSentBodyTxt: {
    fontSize: 16,
    color: UMColors.black,
    textAlign: 'center',
    marginBottom: 30,
    width: '65%'
  },
  errorContainer:{
    width: '70%',
    height: '30%',
    borderWidth: 2,
    borderRadius: 5,
    borderColor: UMColors.red,
    backgroundColor: '#ffcdd2',
    position: 'absolute',
    bottom: -20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  errorMessage:{
    fontSize: 15,
    textAlign: 'center',
    color: '#d32f2f'
  }
})