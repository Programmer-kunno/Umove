import React, { Component }  from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { Dimensions } from 'react-native'

import { UMColors } from '../../utils/ColorHelper';
import { UMIcons } from '../../utils/imageHelper';

let deviceWidth = Dimensions.get('window').width

export default class Start2 extends Component {  
  constructor(props) {
    super(props);
    
    this.state = { 
      chooseMove: this.props.route.params.vehicle_type,
    };
  }

  render() {
    return (
      <View style={styles.mainContainer}>
        <View style={styles.upperHalfContainer}>
          <Image
            style={styles.welcomeImg}
            source={UMIcons.welcomeBG}
            resizeMode={'contain'}
          />
        </View>
        <View style={styles.lowerHalfContainer}>
          <Text style={styles.signUpTxt}>Choose how you make your move</Text>
          <View style={styles.signUpChoicesContainer}>
            <View style={styles.btnContainer}>
              <TouchableOpacity
                style={styles.choiceBtn}
                onPress={() => {
                  this.props.navigation.navigate('QuickQuotationSelectVehicle')
                }}
              >
                <Image
                  style={{width: '100%'}}
                  source={UMIcons.quickQuoteStartIcon}
                  resizeMode={'contain'}
                />
              </TouchableOpacity>
              <Text style={styles.choiceTxt}>Quick Quotation</Text>
            </View>
            <View style={styles.btnContainer}>
              <TouchableOpacity
                style={styles.choiceBtn}
                onPress={() => {
                  this.props.navigation.navigate('Login')
                }}
              >
                <Image
                  style={{width: '100%'}}
                  source={UMIcons.loginStartIcon}
                  resizeMode={'contain'}
                />
              </TouchableOpacity>
              <Text style={styles.choiceTxt}>Log In</Text>
            </View>
          </View>
          <View style={styles.logInContainer}>
            <Text style={styles.logInTxt}>Don't have account? </Text>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('SignUpScreen')
              }}
            >
              <Text style={[styles.logInTxt, { textDecorationLine: 'underline' }]}>Sign Up</Text>
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