import { 
  Text, 
  View, 
  StyleSheet,
  Image,
  TouchableOpacity
} from 'react-native'
import React, { Component } from 'react'

import { UMColors } from '../../utils/ColorHelper'
import { UMIcons } from '../../utils/imageHelper'

import ErrorOkModal from '../Components/ErrorOkModal'

export default class SignUpScreen extends Component {
  constructor(props){
    super(props);

    this.state = {
      commingSoonVisible: false,
    }

  }

  render() {
    return (
      <View style={styles.mainContainer}>
        <ErrorOkModal
          Visible={this.state.commingSoonVisible}
          ErrMsg={"this feature will be available soon"}
          OkButton={() => {
            this.setState({ commingSoonVisible: false })
          }}
        />
        <View style={styles.upperHalfContainer}>
          <Image
            style={styles.welcomeImg}
            source={UMIcons.welcomeBG}
            resizeMode={'contain'}
          />
        </View>
        <View style={styles.lowerHalfContainer}>
          <Text style={styles.signUpTxt}>Sign Up</Text>
          <View style={styles.signUpChoicesContainer}>
            <View style={styles.btnContainer}>
              <TouchableOpacity
                style={styles.choiceBtn}
                onPress={() => {
                  this.props.navigation.navigate('CorpSignUp1')
                }}
              >
                <Image
                  style={{width: '100%'}}
                  source={UMIcons.corporateStartIcon}
                  resizeMode={'contain'}
                />
              </TouchableOpacity>
              <Text style={styles.choiceTxt}>Corporate</Text>
            </View>
            <View style={styles.btnContainer}>
              <TouchableOpacity
                style={styles.choiceBtn}
                
                onPress={() => {
                  // this.props.navigation.navigate('IndivSignUp1')
                  this.setState({ commingSoonVisible: true })
                }}
              >
                <Image
                  style={{width: '100%'}}
                  source={UMIcons.individualStartIcon}
                  resizeMode={'contain'}
                />
              </TouchableOpacity>
              <Text style={styles.choiceTxt}>Individual</Text>
            </View>
          </View>
          <View style={styles.logInContainer}>
            <Text style={styles.logInTxt}>Already have an account? </Text>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('Login')
              }}
            >
              <Text style={[styles.logInTxt, { textDecorationLine: 'underline' }]}>Log In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: UMColors.BGGray,
    alignItems:'center'
  },
  upperHalfContainer: {
    width: '100%',
    height: '57%',
  },
  welcomeImg: {
    width: '100%',
    height: '100%'
  },
  lowerHalfContainer: {
    width: '100%',
    height: '43%',
    alignItems: 'center',
  },
  signUpTxt: {
    color: UMColors.white,
    fontSize: 18,
    fontWeight: 'bold'
  },
  signUpChoicesContainer: {
    width: '100%',
    height: '45%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '8%',
    flexDirection: 'row'
  },
  btnContainer: {
    height: '100%',
    width: '40%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  choiceBtn: {
    width: '75%',
    height: '75%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  choiceTxt: {
    color: UMColors.white,
    fontSize: 14,
    marginTop: '2%'
  },
  logInContainer: {
    width: '100%',
    height: '10%',
    marginTop: '7%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  logInTxt: {
    fontSize: 15,
    color: UMColors.white
  }
})