import React, { Component }  from 'react';
import { 
  StyleSheet, 
  View, 
  Image, 
  Text, 
  TextInput, 
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { CustomerApi } from '../../../api/customer';
import { emailRegex, mobileNumberRegex } from '../../../utils/stringHelper';
import { UMColors } from '../../../utils/ColorHelper';
import { UMIcons } from '../../../utils/imageHelper';
import { Loader } from '../../Components/Loader';
import { setLoading } from '../../../redux/actions/Loader';
import { dispatch } from '../../../utils/redux';
import { showError } from '../../../redux/actions/ErrorModal';
import ErrorWithCloseButtonModal from '../../Components/ErrorWithCloseButtonModal';
import KeyboardAvoidingView from '../../Components/KeyboardAvoidingView';

export default class SignUpScreen1 extends Component { 
  constructor(props) {
    super(props);
    
    this.state = { 
      register: this.props.route?.params?.register,
      error: false,
      message: ""
    };

    this.scrollView = null;
  }

  componentDidMount() {
    dispatch(setLoading(false))
    console.log(this.state.register)
  }

  async register() {
    dispatch(setLoading(true))
    let register = this.state.register;
    if(!emailRegex(register?.email)){
      this.setState({error: true, message: "Please enter a valid email"})
      dispatch(setLoading(false))
    } else if(!mobileNumberRegex(register?.mobileNumber)) {
      this.setState({error: true, message: "Please enter a valid contact number"})
      dispatch(setLoading(false))
    } else {
      let res = await CustomerApi.signUp(register)
      console.log(res)
      if(res == undefined){
        dispatch(setLoading(false))
        dispatch(showError(true))
      } else {
        if(res?.data?.message?.username) {
          this.setState({error: true, message: "Username already taken"})
          dispatch(setLoading(false))
        } else if(res?.data?.message?.email) {
          this.setState({error: true, message: res?.data?.message?.email[0] == "This field must be unique." ? "Email Already Taken" : res?.data?.message?.email[0] })
          dispatch(setLoading(false))
        } else if(res?.data?.message?.mobile_number) {
          this.setState({error: true, message: "Contact Number already taken"})
          dispatch(setLoading(false))
        } else {
          this.setState({error: false})
          this.props.navigation.navigate('SignUpScreen2', {
            register: this.state.register
          })
          dispatch(setLoading(false))
        }
      }
    }
  }

  checkIsEmptyInputs() {
    const register = this.state.register
    if(register.firstName == '' || register.lastName == '' || register.username == '' || register.email == '' || register.mobileNumber == ''){
      return true 
    } else {
      return false
    }
  }

  render() {
    let register = this.state.register;
    return(
      <KeyboardAvoidingView>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.mainContainer}>
            <ErrorWithCloseButtonModal/>
            {/* Logo */}
            <View style={styles.upperContainer}>
              <Image
                source={require('../../../assets/logo/logo-primary.png')}
                style={styles.logo}
                resizeMode={'contain'}
              />
              <Text style={styles.signUpText}>Sign Up</Text>
              {this.state.error && <View style={styles.errorContainer}><Text style={styles.errorMessage}>{this.state.message}</Text></View>}
            </View>
            {/* Sign Up input */}
            <View style={styles.middleContainer}>
              <View style={styles.inputPart}> 
                <Text style={styles.text}>First Name</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={(val) => {
                    register.firstName = val;
                    this.setState({register})
                  }} 
                />
              </View>
              <View style={styles.inputPart}> 
                <Text style={styles.text}>Middle Name</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={(val) => {
                    register.middleName = val;
                    this.setState({register})
                  }}  
                  placeholder='Optional' 
                />
              </View>
              <View style={styles.inputPart}> 
                <Text style={styles.text}>Last Name</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={(val) => {
                    register.lastName = val;
                    this.setState({register})
                  }}                        
                />
              </View>
              <View style={styles.inputPart}> 
                <Text style={styles.text}>Username</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={(val) => {
                    register.username = val;
                    this.setState({register: register, error2: false})
                  }}    
                />
              </View>
              <View style={styles.inputPart}> 
                <Text style={styles.text}>Email Address</Text>
                <TextInput
                  importantForAutofill='no'
                  style={styles.input}
                  keyboardType='email-address'
                  onChangeText={(val) => {
                    register.email = val;
                    this.setState({register: register, error1: false})
                  }}                        
                />
              </View>
              <View style={styles.inputPart}> 
                <Text style={styles.text}>Mobile Number</Text>
                <View style={{ flexDirection: 'row', width: '100%', height: '50%' }}>
                  <TextInput
                    style={styles.mobileNumberCodeInput}
                    editable={false}
                    placeholder={'+63'}
                  />
                  <TextInput
                    style={styles.mobileNumberInput}
                    keyboardType='number-pad'
                    onChangeText={(val) => {
                      register.mobileNumber = '+' + 63 + val;
                      this.setState({register: register, error3: false})
                    }}
                    maxLength={10}
                  />
                </View>
              </View>
            </View>

            {/* Next Button */}
            <View style={styles.nextBtnContainer}>
              {/* Make button gray when not all inputs are filled out, orange when filled out */}
              <TouchableOpacity 
                style={[styles.signUpButton, !this.checkIsEmptyInputs() && {backgroundColor: UMColors.primaryOrange}]} 
                disabled={this.checkIsEmptyInputs()}
                onPress={() => this.register()}
              >
                <Text style={styles.signUpButtonText}>NEXT</Text>
              </TouchableOpacity>
            </View>

            {/* Login with */}
            <View style={styles.bottomContainer}>
              <Text style={styles.signUpWithText}> or Sign Up with </Text>
              <View style={styles.row}>
                <TouchableOpacity onPress={() => alert('Sign Up w/ google')}>
                  <Image
                    source={UMIcons.googleIcon}
                    style={styles.socials}
                    resizeMode={'contain'}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => alert('Sign Up w/ facebook')}>
                  <Image
                    source={UMIcons.facebookIcon}
                    style={styles.socials}
                    resizeMode={'contain'}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => alert('Sign Up w/ apple')}>  
                  <Image
                    source={UMIcons.appleIcon}
                    style={styles.socials}
                    resizeMode={'contain'}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => alert('Sign Up w/ fingerprint')}>  
                  <Image
                    source={require('../../../assets/socials/fingerprint.png')}
                    style={styles.socials}
                    resizeMode={'contain'}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.row}>
                  <Text style={styles.loginText}>
                    Already have an account? {" "}
                  </Text>
                  <TouchableOpacity onPress={() => this.props.navigation.navigate('Login') }>
                      <Text style={styles.underline}>
                        Log In
                      </Text>
                  </TouchableOpacity>
              </View>
            </View>
            <Loader/>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    )
  }
}


const styles = StyleSheet.create({
  mainContainer: {
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: UMColors.BGOrange, 
  },
  upperContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    height: 60,
    width: '80%',
  },
  signUpText: {
    fontSize: 20,
    color: 'black',
  },
  middleContainer: {
    width: '100%',
    height: '55%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputPart: {
    height: '15.5%',
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
    fontSize: 13,
    height: '50%',
    width: '100%',
    paddingLeft: 20,
    paddingRight: 20,
    paddingVertical: 0,
    borderRadius: 25,
    borderColor: UMColors.primaryOrange,
    borderWidth: 1,
    backgroundColor: 'white',
  },
  mobileNumberCodeInput: {
    fontSize: 13,
    height: '100%',
    width: '15%',
    textAlign: 'right',
    paddingVertical: 0,
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 25,
    borderTopColor: UMColors.primaryOrange,
    borderBottomColor: UMColors.primaryOrange,
    borderLeftColor: UMColors.primaryOrange,
    borderRightWidth: 0,
    borderWidth: 1,
    backgroundColor: 'white',
  },
  mobileNumberInput: {
    fontSize: 13,
    height: '100%',
    width: '85%',
    paddingVertical: 0,
    borderTopRightRadius: 25,
    borderBottomRightRadius: 25,
    borderTopColor: UMColors.primaryOrange,
    borderBottomColor: UMColors.primaryOrange,
    borderLeftWidth: 0,
    borderRightColor: UMColors.primaryOrange,
    borderWidth: 1,
    backgroundColor: 'white',
    paddingLeft: 10
  },
  nextBtnContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    height: 45,
    marginBottom: 10
  },
  signUpButton: {
    height: '100%',
    width: '70%',
    borderRadius: 25,
    justifyContent:'center',
    alignItems: 'center',
    backgroundColor: UMColors.primaryGray,
    elevation: 5
  },
  bottomContainer: {
    width: '100%',
    height: '11%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  signUpButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight:'bold'
  },
  signUpWithText: {
    color: 'black',
    fontSize: 12,
    marginBottom: '2%'
  },
  socials: {
    margin: 8,
    height: 25,
    width: 25
  },
  row: {
    flexDirection: 'row',
  },
  loginText: {
    color: 'black',
    fontSize: 14,
  },
  underline: {
    color: 'black',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  errorContainer:{
    width: '70%',
    height: 35,
    borderWidth: 2,
    borderRadius: 5,
    borderColor: UMColors.red,
    backgroundColor: '#ffcdd2',
    position: 'absolute',
    bottom: -40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  errorMessage:{
    fontSize: 15,
    textAlign: 'center',
    color: '#d32f2f'
  }
})