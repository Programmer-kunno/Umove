import { Text, View, StyleSheet, Image, TouchableOpacity, StatusBar } from 'react-native'
import React, { useState } from 'react'

import { UMColors } from '../../utils/ColorHelper';
import { UMIcons } from '../../utils/imageHelper';
import ErrorOkModal from '../Components/ErrorOkModal';
import { BookingApi } from '../../api/booking';
import { navigate } from '../../utils/navigationHelper';
import { dispatch } from '../../utils/redux';
import { showError } from '../../redux/actions/ErrorModal';

export default QuickQuotateScreen = (props) => {
  const bookingData = props.route.params?.booking
  const [error, setError] = useState({ value: false, message: '' })

  const booking = async() => {
    const response = await BookingApi.quickQuotation(bookingData)
    console.log(response?.data)
    if(response == undefined){
      dispatch(showError(true))
    } else {
      if(response?.data?.success){
        navigate('QuickQuotatePriceScreen', { price: response?.data?.data?.price, vehicleName: bookingData?.vehicleName })
      } else {
        setError({ value: true, message: response?.data?.message || response?.data})
      }
    }
  }

  return (
    <View style={styles.mainContainer}>
      <StatusBar translucent backgroundColor={'transparent'} barStyle={'dark-content'} />
      <ErrorOkModal
        Visible={error.value}
        ErrMsg={error.message}
        OkButton={() => setError({ value: false, message: '' })}
      />
      <View style={styles.logoContainer}>
        <Image
          style={styles.logo}
          source={UMIcons.mainLogo}
          resizeMode={'contain'}
        />
      </View>
      <View style={styles.bodyContainer}>
        <Text style={styles.bodyTxt}>
          Note: Here's the Booking Details 
          based on the cargo details, pickup 
          & delivery address provided. If you 
          want greater value we offer shared 
          ride options than can provide 
          cheaper delivery rate by sharing the 
          delivery space and cost on the same 
          destination.
        </Text>
      </View>
      <View style={styles.btnContainer}>
        <TouchableOpacity
          style={styles.quickQouteBtn}
          onPress={() => {
            booking()
          }}
        >
          <Image
            style={styles.quickQuoteImg}
            source={UMIcons.quickQuotateIcon}
            resizeMode={'contain'}
          />
          <Text style={styles.quickQuotateTxt}>Quick Quote</Text>
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
    height: '30%',
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  bodyTxt: {
    width: '80%',
    fontSize: 18,
    textAlign: 'justify'
  },
  btnContainer: {
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickQouteBtn: {
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickQuoteImg: {
    width: '100%',
  },
  quickQuotateTxt: {
    fontSize: 21,
    fontWeight: 'bold',
    color: UMColors.white,
    position: 'absolute',
    top: '31%',
    right: '21%'
  }
})
