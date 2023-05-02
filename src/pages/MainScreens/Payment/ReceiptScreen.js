import React, { useState } from 'react'
import { View, Text, StyleSheet, SafeAreaView, Image, TouchableOpacity } from 'react-native'
import { UMColors } from '../../../utils/ColorHelper'
import { UMIcons } from '../../../utils/imageHelper'
import { dispatch } from '../../../utils/redux'
import { setLoading } from '../../../redux/actions/Loader'
import { refreshTokenHelper } from '../../../api/helper/userHelper'
import { BookingApi } from '../../../api/booking'
import CustomNavbar from '../../Components/CustomNavbar'
import ErrorOkModal from '../../Components/ErrorOkModal'
import { capitalizeFirst, moneyFormat } from '../../../utils/stringHelper'
import ErrorWithCloseButtonModal from '../../Components/ErrorWithCloseButtonModal'
import { Loader } from '../../Components/Loader'
import { resetNavigation } from '../../../utils/navigationHelper'

export default ReceiptScreen = (props) => {
  const { selectedPaymentMethod, bookingNumber, price, booking } = props.route.params;
  const [error, setError] = useState({
    value: false,
    message: ''
  })

  const onPressConfirm = () => {
    console.log(selectedPaymentMethod)
    dispatch(setLoading(true))
    refreshTokenHelper(async() => {
      const data = {
        payment_method: selectedPaymentMethod.id
      }
      const response = await BookingApi.payBooking(bookingNumber, data)
      if(response == undefined) {
        dispatch(setLoading(false))
        dispatch(showError(true))
      } else {
        if(response?.data?.success){
          resetNavigation('PaymentLoadingScreen', {selectedPaymentMethod: selectedPaymentMethod, data: response?.data,  bookingNumber: bookingNumber, booking: booking})
          dispatch(setLoading(false))
        } else { 
          setError({ value: true, message: response?.data?.message || response?.data })
          dispatch(setLoading(false))
        }
      }
    })
  }

  return (
    <SafeAreaView style={styles.mainContainer}>
      <ErrorWithCloseButtonModal/>
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
      <CustomNavbar
        Title={'Confirmation'}
      />
      <View style={styles.recieptContainer}>
        <Image
          style={{width: '40%', height: 70}}
          source={UMIcons.mainLogo}
          resizeMode={'contain'}
        />
        <View style={styles.bookingRefContainer}>
          <Text style={styles.bookingRefTxt}>Booking No:</Text>
          <Text style={styles.bookingRefTxt}>{bookingNumber}</Text>
        </View>
        <View style={styles.amountContainer}>
          <Text style={styles.amountTxt}>Amount</Text>
          <Text style={styles.amountTxt}>{'₱ ' + moneyFormat(price)}</Text>
        </View>
        <View style={styles.paidViaContainer}>
          <Text style={styles.cardName}>Paid Via</Text>
          <View style={styles.cardContainer}>
            <Image
              style={styles.cardIcon}
              source={selectedPaymentMethod.cardType == 'visa' ? UMIcons.visaLogo : selectedPaymentMethod.cardType == 'master-card' ? UMIcons.masterCardLogo : UMIcons.creditCardLogo}
              resizeMode={'contain'}
            />
            <Text style={styles.cardName}>{capitalizeFirst(selectedPaymentMethod.cardType.replace('-', ''))}</Text>
          </View>
        </View>
        <View style={styles.dottedBottom}/>
      </View>
      <TouchableOpacity onPress={onPressConfirm} style={styles.confirmBtn}>
        <Text style={styles.confirmBtnTxt}>Confirm</Text>
      </TouchableOpacity>
      <Loader/>
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
    fontSize: 20,
    color: UMColors.black
  },
  amountContainer: {
    flexDirection: 'row',
    width: '80%',
    justifyContent: 'space-between',
    marginTop: '20%'
  },
  amountTxt: {
    fontSize: 17,
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
    fontSize: 14,
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
    fontSize: 17,
    fontWeight: 'bold',
    color: UMColors.white
  }
})