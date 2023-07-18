import { Text, View, StyleSheet, Image, TouchableOpacity, TextInput } from 'react-native'
import React, { Component } from 'react'

import { UMColors } from '../../utils/ColorHelper';
import { UMIcons } from '../../utils/imageHelper';
import { moneyFormat } from '../../utils/stringHelper';
import { resetNavigation } from '../../utils/navigationHelper';
import { navigate } from '../../utils/navigationHelper';

export default QuickQuotatePriceScreen = (props) => {
  const price = props.route.params?.price
  const vehicleName = props.route.params?.vehicleName

  return (
    <View style={styles.mainContainer}>
      <View style={styles.logoContainer}>
        <Image
          style={styles.logo}
          source={UMIcons.mainLogo}
          resizeMode={'contain'}
        />
      </View>
      <View style={styles.bodyContainer}>
        <View style={styles.bodyPriceContainer}>
          <View style={styles.priceContainer}>
            <Text style={styles.priceTxt}>₱</Text>
            <Text style={styles.priceTxt}>{moneyFormat(price)}</Text>
            <Image
              style={styles.tagIcon}
              source={UMIcons.tagIcon}
              resizeMode={'contain'}
            />
          </View>
          
        </View>
        <Text style={styles.bodyTxt}>
          {          
            `This rate is exclusive quotation, a ` + vehicleName.toLowerCase() +
            ` vehicle has been selected to exclusively pick up and deliver without other customer's order co-loaded, cheaper options maybe available time to time when you book your parcels.`
          }
        </Text>
      </View>
      <View style={styles.btnContainer}>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => {
            navigate('Login')
          }}
        >
          <Text style={[styles.btnTxt, { color: UMColors.black }]}>Log In</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => {
            resetNavigation('StartScreen')
          }}
        >
          <Text style={[styles.btnTxt, { color: UMColors.primaryOrange }]}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: UMColors.BGOrange,
    alignItems: 'center'
  },
  logoContainer: {
    height: '20%',
    width: '90%',
    marginTop: '20%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  logo: {
    width: '70%'
  },
  bodyContainer: {
    height: '45%',
    width: '90%',
    alignItems: 'center'
  },
  bodyPriceContainer: {
    width: '95%',
    height: '35%',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  priceContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    width: '65%',
    height: '65%',
    borderRadius: 12,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: UMColors.cream,
    marginRight: '10%'
  },
  priceTxt: {
    margin: 10,
    fontSize: 25,
    color: UMColors.black
  },
  tagIcon: {
    position: 'absolute',
    bottom: -47,
    left: -47
  },
  bodyTxt: {
    marginTop: '17%',
    width: '80%',
    fontSize: 17,
    textAlign: 'justify'
  },
  btnContainer: {
    height: '10%',
    width: '90%',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    position: 'absolute',
    bottom: '10%'
  },
  btn: {
    width: '30%',
    height: '50%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  btnTxt: {
    fontSize: 25,
    fontWeight: 'bold'
  }
})