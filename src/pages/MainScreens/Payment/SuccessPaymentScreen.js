import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, SafeAreaView, Image, TouchableOpacity, BackHandler } from 'react-native'
import { UMColors } from '../../../utils/ColorHelper'
import { UMIcons } from '../../../utils/imageHelper'
import CustomNavbar from '../../Components/CustomNavbar'
import ErrorOkModal from '../../Components/ErrorOkModal'
import {resetNavigation } from '../../../utils/navigationHelper'
import { TextSize, capitalizeFirst, moneyFormat, normalize } from '../../../utils/stringHelper'
import ConfirmationModal from '../../Components/ConfirmationModal'
import { useIsFocused } from '@react-navigation/native'

export default SuccessPaymentScreen = (props) => {
  const { selectedPaymentMethod, data, bookingNumber, booking } = props.route.params;
  const [isGoingBack, setIsGoingBack] = useState(false)
  const [error, setError] = useState({
    value: false,
    message: ''
  })

  const isFocused = useIsFocused()

  useEffect(() => {
    if(isFocused){
      BackHandler.addEventListener('hardwareBackPress', backHanderBtn)
    }
    
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', backHanderBtn)
    }
  }, [isFocused])

  const backHanderBtn = () => {
    setIsGoingBack(true)
    return true
  }

  return (
    <SafeAreaView style={styles.mainContainer}>
      <ErrorOkModal
        Visible={error.value}
        ErrMsg={error.message}
        OkButton={() => {
          setError({
            value: false,
            message: ''
          })
        }}
      />
      <ConfirmationModal
        visible={isGoingBack}
        message={'Are you sure you want to go back?\nYou will be directed to Home'}
        onYes={() => {
          resetNavigation('DrawerNavigation')
        }}
        onNo={() => {
          setIsGoingBack(false)
        }}
      />
      <CustomNavbar
        Title={'Receipt'}
        onGoBack={() => {
          setIsGoingBack(true)
        }}
      />
      <View style={styles.recieptContainer}>
        <Image
          style={{width: '40%', height: 70}}
          source={UMIcons.mainLogo}
          resizeMode={'contain'}
          tintColor='gray'
        />
        <View style={styles.bookingRefContainer}>
          <Text style={styles.bookingRefTxt}>Booking No:</Text>
          <Text style={styles.bookingRefTxt}>{bookingNumber}</Text>
        </View>
        <View style={styles.amountContainer}>
          <Text style={styles.amountTxt}>Amount</Text>
          <Text style={styles.amountTxt}>{'₱ ' + data.data?.amount}</Text>
        </View>
        <View style={styles.paidViaContainer}>
          <Text style={styles.cardName}>Paid Via</Text>
          <View style={styles.cardContainer}>
            <Image
              style={styles.cardIcon}
              source={selectedPaymentMethod.cardType == 'visa' ? UMIcons.visaLogo : selectedPaymentMethod.cardType == 'master-card' ? UMIcons.masterCardLogo : UMIcons.creditCardLogo}
              resizeMode={'contain'}
              tintColor='black'
            />
            <Text style={styles.cardName}>{capitalizeFirst(selectedPaymentMethod.cardType.replace('-', ''))}</Text>
          </View>
        </View>
        <View style={styles.dottedBottom}/>
      </View>
      <TouchableOpacity onPress={() => { resetNavigation('BookingAndDriverDescription', { booking: booking })} } style={styles.confirmBtn}>
        <Text style={styles.confirmBtnTxt}>Confirm</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: UMColors.BGOrange
  },
  recieptContainer: {
    width: '90%',
    height: '60%',
    alignItems: 'center',
    marginTop: 40,
    backgroundColor: UMColors.white,
    elevation: 10
  },
  bookingRefContainer: {
    flexDirection: 'row',
    width: '80%',
    justifyContent: 'space-between',
    marginTop: '5%'
  },
  bookingRefTxt: {
    fontSize: normalize(TextSize('M')),
    color: UMColors.black
  },
  amountContainer: {
    flexDirection: 'row',
    width: '80%',
    justifyContent: 'space-between',
    marginTop: '20%'
  },
  amountTxt: {
    fontSize: normalize(TextSize('Normal')),
    color: UMColors.black
  },
  paidViaContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 110
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10
  },
  cardIcon: {
    width: 35,
    height: 22
  },
  cardName: {
    fontSize: normalize(TextSize('Normal')),
    color: UMColors.black
  },
  dottedBottom: {
    borderStyle: 'dashed',
    borderWidth: 2,
    width: '100%',
    borderColor: UMColors.BGGray,
    position: 'absolute',
    bottom: 80
  },
  confirmBtn: {
    width: '90%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 45,
    backgroundColor: UMColors.primaryOrange,
    position: 'absolute',
    bottom: 60,
    elevation: 10
  },
  confirmBtnTxt: {
    fontSize: normalize(TextSize('Normal')),
    fontWeight: 'bold',
    color: UMColors.white
  }
})