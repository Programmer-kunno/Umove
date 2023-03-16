import React, { Component }  from 'react';
import { StyleSheet, View, ImageBackground, Image, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';

import { CustomerApi } from '../../../api/customer'; 
import { getStorage, setStorage } from '../../../api/helper/storage';

export default class IndivSignUp3 extends Component {  
  constructor() {
    super();
    
    this.state = { 
      register: {},
      error1: false,
      error2: false,
      error3: false,
      message: []
    };
  }

  async componentDidMount() {
    this.init();
  }

  async init() {
    let register = await getStorage('register')
    this.setState({register})
  }

  async signUp() {
    let register = this.state.register
    await setStorage('register', register)
    let res = await CustomerApi.individualSignup()
    console.log(res);
    // this.setState({message: res}, async () => {
    //   let response = this.state.message;
    //   if(register.password.length < 8) {
    //     this.setState({error1: true})
    //   } else if(register.password !== register.confirmPassword) {
    //     this.setState({error1: false})
    //     this.setState({error2: true})
    //   } else if(response.message.password) {
    //     this.setState({error1: false})
    //     this.setState({error2: false})
    //     this.setState({error3: true})
    //   } else {
    //     this.setState({error1: false})
    //     this.setState({error2: false})
    //     this.setState({error3: false})

    //     let loginInfo = [register.username, register.password]
    //     await setStorage('remember', 'true')
    //     await setStorage('loginInfo', loginInfo)
    
    //     let user = loginInfo[0].toString()
    //     let pass = loginInfo[1].toString()

    //     let [r, e] = await CustomerApi.login(user, pass);
    //     if(r) {
    //       await setStorage('user', r)
    //       this.props.navigation.navigate('IndivDashboard');
    //     }
    //   }
    // })
  } 

  render() {
    let register = this.state.register;
    let response = this.state.message;
    return(
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.container}>
            <View style={styles.innerContainer}> 


            {this.state.error1 ? <View style={styles.errorContainer}><Text style={styles.errorMessage}> This password is too short. It must contain at least 8 characters. </Text></View> : null}
            {this.state.error2 ? <View style={styles.errorContainer}><Text style={styles.errorMessage}> Password and Confirm Password do not match, try again.  </Text></View> : null}
            {this.state.error3 ? <View style={styles.errorContainer}><Text style={styles.errorMessage}> {console.log(response)}  </Text></View> : null}

              <View style={styles.content}>


                {/* Logo */}
                <View style={styles.alignItemCenter}>
                  <Image
                    source={require('../../../assets/logo/logo-primary.png')}
                    style={styles.logo}
                  />
                  <Text style={styles.signUpHeader}>Sign Up</Text>
                </View>

                {/* Sign Up input */}
                <View style={styles.alignItemCenter}>
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
                <View style={styles.alignItemCenter}>
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
                </View>

                {/* Continue Button */}
                <View style={styles.alignItemCenter}>
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
              </View>

            </View>
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
    alignItems: 'center',
  },
  logo: {
    height: 70,
    width: 250
  },
  signUpHeader: {
    fontSize: 25,
    fontWeight: 'bold',
    letterSpacing: 1,
    color: 'black',
    marginTop: '5%',
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
  conditionsContainer: {
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
  signUpButtonGray: {
    marginTop: '4%',
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
  signUpButtonOrange: {
    marginTop: '4%',
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
  signUpButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight:'bold'
  },
  errorContainer:{
    width: '100%',
    backgroundColor: '#ffcdd2',
    marginTop: '10%',
  },
  errorMessage:{
    textAlign: 'center',
    padding: 10,
    color: '#d32f2f'
  }
})