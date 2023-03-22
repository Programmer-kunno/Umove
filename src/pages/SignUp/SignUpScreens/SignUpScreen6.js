import React, { Component }  from 'react';
import { StyleSheet, View, ImageBackground, Image, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';

import { CustomerApi } from '../../../api/customer'; 
import { saveUserDetailsRedux } from '../../../redux/actions/User';
import { dispatch } from '../../../utils/redux';
import { setLoading } from '../../../redux/actions/Loader';
import { Loader } from '../../Components/Loader';
import { UMColors } from '../../../utils/ColorHelper';
import { resetNavigation } from '../../../utils/navigationHelper';
import ErrorWithCloseButtonModal from '../../Components/ErrorWithCloseButtonModal';
import { showError } from '../../../redux/actions/ErrorModal';

export default class SignUpScreen6 extends Component {  
  constructor(props) {
    super(props);
    
    this.state = { 
      register: this.props.route?.params?.register,
      error: false,
      message: "",
      isLoading: false
    };
  }

  async componentDidMount() {
    this.init();
    console.log(this.state.register)
  }

  async init() {
    dispatch(setLoading(false))
  }

  async signUp() {
    dispatch(setLoading(true))
    try {
      let register = this.state.register
      if(register.password.length < 8) {
        dispatch(setLoading(false))
        this.setState({error: true, message: "Password must be 8 characters long"})
      } else if(register.password !== register.confirmPassword) {
        dispatch(setLoading(false))
        this.setState({error: true, message: "Password do not match, try again"})
      } else {
        let response = await CustomerApi.corporateSignup(register)
        console.log(response.data)
        if(response == undefined){
          dispatch(setLoading(false))
          dispatch(showError(true))
        } else {
          if(response?.data?.message?.password) {
            dispatch(setLoading(false))
            this.setState({error: true, message: response?.data?.message?.password[0]})
          } 
          else if(response?.data?.success) {
            const data = {
              username: register.username,
              password: register.password
            }
            let response = await CustomerApi.login(data);
            if(response == undefined){
              dispatch(setLoading(false))
              dispatch(showError(true))
            } else {
              if(response?.data?.success) {
                dispatch(saveUserDetailsRedux(response?.data?.data))
                resetNavigation('DrawerNavigation')
                this.setState({error: false})
                dispatch(setLoading(false))
              } else {
                dispatch(setLoading(false))
                this.setState({error: true, message: 'Something went wrong try again later'})
              }
            }
          }
        }
      }
    } catch (err) {
      console.log(err)
    }
  } 

  render() {
    let register = this.state.register;
    let response = this.state.message;
    return(
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.mainContainer}>
        <ErrorWithCloseButtonModal/>
            {/* Logo */}
            <View style={styles.logoContainer}>
              <Image
                source={require('../../../assets/logo/logo-primary.png')}
                style={styles.logo}
                resizeMode={'contain'}
              />
            {
              this.state.error && 
              <View style={styles.errorContainer}>
                <Text style={styles.errorMessage}>{this.state.message}</Text>
              </View>
            }
            </View>

            {/* Sign Up input */}
            <View style={styles.bodyContainer}>
              <Text style={styles.signUpHeader}>Sign Up</Text>
              <View style={styles.inputPart}> 
                <Text style={styles.text}>
                  Password
                </Text>
                <TextInput
                  secureTextEntry={true}
                  style={styles.input}
                  onChangeText={(val) => {
                    register.password = val;
                    this.setState({register})
                  }}  
                />
              </View>
              <View style={styles.inputPart}> 
                <Text style={styles.text}>
                  Confirm Password
                </Text>
                <TextInput
                  secureTextEntry={true}
                  style={styles.input}
                  onChangeText={(val) => {
                    register.confirmPassword = val;
                    this.setState({register})
                  }}   
                />
              </View>
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
            <View style={styles.continueBtnContainer}>
              {/* Make button gray when not all inputs are filled out, orange when filled out */}
              { register.password == '' || register.confirmPassword == ''  ?
              <TouchableOpacity style={styles.signUpButtonGray} disabled={true}>
                <Text style={styles.signUpButtonText}>CONTINUE</Text>
              </TouchableOpacity>
              :
              <TouchableOpacity style={styles.signUpButtonOrange} onPress={() => this.signUp()}>
                <Text style={styles.signUpButtonText}>CONTINUE</Text>
              </TouchableOpacity>
              }
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgb(238, 241, 217)',
  },
  logoContainer: {
    width: '90%',
    height: '20%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  logo: {
    height: '50%',
    width: '100%',
  },
  bodyContainer: {
    width: '90%',
    height: '35%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  signUpHeader: {
    fontSize: 22,
    fontWeight: 'bold',
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
  conditionsContainer: {
    width: '90%',
    height: '8%',
    marginTop: '30%',
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
    fontSize: 10,
    alignItems: 'center',
  },
  underline: {
    color: 'black',
    fontSize: 10,
    textDecorationLine: 'underline',
  },
  continueBtnContainer: {
    width: '90%',
    height: '10%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  signUpButtonGray: {
    height: 50,
    width: '90%',
    borderRadius: 25,
    justifyContent:'center',
    alignItems: 'center',
    backgroundColor: 'gray',
    elevation: 5
  },
  signUpButtonOrange: {
    height: 50,
    width: '90%',
    borderRadius: 25,
    justifyContent:'center',
    alignItems: 'center',
    backgroundColor: 'rgb(223,131,68)',
    elevation: 5
  },
  signUpButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight:'bold'
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
    fontSize: 15,
    textAlign: 'center',
    color: '#d32f2f'
  }
})