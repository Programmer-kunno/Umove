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
  ScrollView, 
  KeyboardAvoidingView 
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { CustomerApi } from '../../../api/customer';
import { emailRegex, mobileNumberRegex } from '../../../utils/stringHelper';
import { UMColors } from '../../../utils/ColorHelper';

export default class CorpSignUp1 extends Component { 
  constructor() {
    super();
    
    this.state = { 
      register: {
        customerType: 'corporate',
        firstName: '',
        middleName: '',
        lastName: '',
        username: '',
        email: '',
        mobileNumber: "",
        streetAddress: '',
        region: '',
        province: '',
        city: '',
        barangay: '',
        zipcode: '',
        companyName: '',
        companyType: '',
        companyEmail: '',
        companyMobileNumber: '',
        companyAddress: '',
        officeAddress: '',
        officeRegion: '',
        officeProvince: '',
        officeCity: '',
        officeBarangay: '',
        officeZipcode: '',
        password: '',
        confirmPassword: '', 
        bir: null,
        dti: null,
        validId: null
      },
      error: false,
      message: ""
    };

    this.scrollView = null;
  }

  async register() {
    let register = this.state.register;
    if(!mobileNumberRegex(register.mobileNumber)) {
      this.setState({error: true, message: "Please enter a valid contact number"})
    } else {
      let res = await CustomerApi.corporateSignup(register)
      console.log(res)
      if(res.message.username) {
        this.setState({error: true, message: "Username already taken"})
      } else if(res.message.email) {
        this.setState({error: true, message: res.message.email[0] == "This field must be unique." ? "Email Already Taken" : "Please enter a valid email"})
      } else if(res.message.mobile_number) {
      this.setState({error: true, message: "Contact Number already taken"})
      } else {
        this.setState({error: false})
        this.props.navigation.navigate('CorpSignUp2', {
          register: this.state.register
        })
      }
    }
  }

  render() {
    let register = this.state.register;
    return(
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.mainContainer}>

          {/* Logo */}
          <View style={styles.upperContainer}>
            <Image
              source={require('../../../assets/logo/logo-primary.png')}
              style={styles.logo}
              resizeMode={'contain'}
            />
            {this.state.error && <View style={styles.errorContainer}><Text style={styles.errorMessage}>{this.state.message}</Text></View>}
          </View>

          {/* Sign Up input */}
          <View style={styles.middleContainer}>
            <Text style={styles.signUpText}>Sign Up</Text>
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
            { register.firstName == '' || register.lastName == '' || register.username == '' || register.email == '' || register.mobileNumber == ''  ?
            <TouchableOpacity style={styles.signUpButtonGray} disabled={true}>
              <Text style={styles.signUpButtonText}>NEXT</Text>
            </TouchableOpacity>
            :
            <TouchableOpacity style={styles.signUpButtonOrange} onPress={() => this.register() }>
              <Text style={styles.signUpButtonText}>NEXT</Text>
            </TouchableOpacity>
            }
          </View>

          {/* Login with */}
          <View style={styles.bottomContainer}>
            <Text style={styles.signUpWithText}> or Sign Up with </Text>
            <View style={styles.row}>
              <TouchableOpacity onPress={() => alert('Sign Up w/ google')}>
                <Image
                  source={require('../../../assets/socials/google.png')}
                  style={styles.socials}
                  resizeMode={'contain'}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => alert('Sign Up w/ facebook')}>
                <Image
                  source={require('../../../assets/socials/facebook.png')}
                  style={styles.socials}
                  resizeMode={'contain'}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => alert('Sign Up w/ apple')}>  
                <Image
                  source={require('../../../assets/socials/apple.png')}
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
        </View>
      </TouchableWithoutFeedback>
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
    height: '18%',
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  logo: {
    height: '50%',
    width: '80%',
  },
  signUpText: {
    fontSize: 20,
    fontWeight: 'bold',
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
  },
  nextBtnContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    height: '10%'
  },
  signUpButtonGray: {
    height: '55%',
    width: '70%',
    borderRadius: 25,
    justifyContent:'center',
    alignItems: 'center',
    backgroundColor: UMColors.primaryGray,
    elevation: 5
  },
  signUpButtonOrange: {
    height: '55%',
    width: '70%',
    borderRadius: 25,
    justifyContent:'center',
    alignItems: 'center',
    backgroundColor: UMColors.primaryOrange,
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
    width: '90%',
    height: '20%',
    borderWidth: 2,
    borderRadius: 5,
    borderColor: UMColors.red,
    backgroundColor: '#ffcdd2',
    position: 'absolute',
    bottom: 5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  errorMessage:{
    fontSize: 15,
    textAlign: 'center',
    color: '#d32f2f'
  }
})