import React, { Component }  from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { Dimensions } from 'react-native'

import { UMColors } from '../../utils/ColorHelper';
import { UMIcons } from '../../utils/imageHelper';

let deviceWidth = Dimensions.get('window').width

export default class Start1 extends Component {  
  constructor(props) {
    super(props);
    
    this.state = { 
      chooseMove: 0,
      modalVisible: false
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
          <Text style={styles.titleTxt}>Choose how you make your move</Text>
          <View style={styles.rideChoicesContainer}>
            <View style={styles.rideListHalfContainer}>
              <View style={styles.btnContainer}>
                <TouchableOpacity
                  style={styles.choiceBtn}
                  onPress={() => {
                   this.setState({ chooseMove: 1 })
                  }}
                >
                  <Image
                    style={[
                      {width: '90%'}, 
                      this.state.chooseMove == 0 || this.state.chooseMove == 1 ? 
                        {opacity: 1}
                      :
                        {opacity: 0.5}
                    ]}
                    source={UMIcons.shipStartIcon}
                    resizeMode={'contain'}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.btnContainer}>
                <TouchableOpacity
                  style={styles.choiceBtn}
                  onPress={() => {
                   this.setState({ chooseMove: 2 })
                  }}
                >
                  <Image
                    style={[
                      {width: '80%'},
                      this.state.chooseMove == 0 || this.state.chooseMove == 2 ? 
                        {opacity: 1}
                      :
                        {opacity: 0.5}
                    ]}
                    source={UMIcons.truckStartIcon}
                    resizeMode={'contain'}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={[styles.rideListHalfContainer, { width: '50%', marginTop: '2%' }]}>
                <TouchableOpacity
                  style={styles.choiceBtn}
                  onPress={() => {
                   this.setState({ chooseMove: 3 })
                  }}
                >
                  <Image
                    style={[
                      {width: 100, height: 100},
                      this.state.chooseMove == 0 || this.state.chooseMove == 3 ? 
                        {opacity: 1}
                      :
                        {opacity: 0.5}
                    ]}
                    source={UMIcons.motorStartIcon}
                    resizeMode={'contain'}
                  />
                </TouchableOpacity>
            </View>
          </View>
          <View style={styles.continueLogInContainer}>
            <TouchableOpacity
              style={[
                styles.continueBtn,
                this.state.chooseMove == 0 && 
                { backgroundColor: UMColors.primaryGray }
              ]}
              disabled={this.state.chooseMove == 0 ? true : false}
              onPress={() => {
                this.props.navigation.navigate('Start2', {
                  vehicle_type: this.state.chooseMove
                })
              }}
            >
              <Text style={styles.continueBtnTxt}>Continue</Text>
            </TouchableOpacity>
            <View style={styles.logInContainer}>
              <Text style={styles.signUpTxt}>Don't have account? </Text>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('SignUpScreen')
                }}
              >
                <Text style={[styles.signUpTxt, { textDecorationLine: 'underline' }]}>Sign Up</Text>
              </TouchableOpacity>
            </View>
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
  titleTxt: {
    color: UMColors.white,
    fontSize: 18,
    fontWeight: 'bold'
  },
  rideChoicesContainer: {
    width: '100%',
    height: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '3%',
  },
  rideListHalfContainer: {
    width: '100%',
    height: '49%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', 
    alignItems: 'center'
  },
  btnContainer: {
    height: '100%',
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  choiceBtn: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  choiceTxt: {
    color: UMColors.white,
    fontSize: 14,
    marginTop: '2%'
  },
  continueLogInContainer: {
    width: '100%',
    height: '30%',
    alignItems: 'center',
    marginTop: '2%'
  },
  signUpTxt: {
    fontSize: 13,
    color: UMColors.white
  },
  continueBtn: {
    width: '70%',
    height: '40%',
    marginTop: '3%',
    borderRadius: 50,
    elevation: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: UMColors.primaryOrange,
  },
  continueBtnTxt: {
    fontSize: 18,
    fontWeight: 'bold',
    color: UMColors.white
  },
  logInContainer: {
    width: '100%',
    height: '30%',
    marginTop: '3%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  }
})