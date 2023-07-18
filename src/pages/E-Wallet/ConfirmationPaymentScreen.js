import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  Dimensions,
  Image,
  TouchableOpacity
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { UMColors } from '../../utils/ColorHelper'
import CustomNavbar from '../Components/CustomNavbar'
import { TextSize, capitalizeFirst, moneyFormat, normalize } from '../../utils/stringHelper'
import { UMIcons } from '../../utils/imageHelper'
import { navigate } from '../../utils/navigationHelper'
import { useIsFocused } from '@react-navigation/native'
import { dispatch } from '../../utils/redux'
import { setLoading } from '../../redux/actions/Loader'
import { PayCreditApi } from '../../api/creditPayment'
import { showError } from '../../redux/actions/ErrorModal'
import ErrorWithCloseButtonModal from '../Components/ErrorWithCloseButtonModal'
import ErrorOkModal from '../Components/ErrorOkModal'
import { Loader } from '../Components/Loader'
import { refreshTokenHelper } from '../../api/helper/userHelper'

const deviceWidth = Dimensions.get('screen').width

export default ConfirmationPaymentScreen = (props) => {
  const price = parseFloat(props.route.params?.price)
  const transactionFee = 0
  const selectedPaymentMethod = props.route.params?.selectedPaymentMethod
  const isFocused = useIsFocused()
  const [total, setTotal] = useState(0)
  const [error, setError] = useState({ value: false, message: '' })

  useEffect(() => {
    if(isFocused){
      dispatch(setLoading(false))
      const totalPrice = price + transactionFee
      setTotal(totalPrice)
    }
  }, [isFocused])

  const payCredit = () => {
    dispatch(setLoading(true))
    const data = {
      payment_method: selectedPaymentMethod.id,
      amount: total
    }
    refreshTokenHelper(async() => {
      const response = await PayCreditApi.creditOnlinePayment(data)
      console.log(response?.data)
      if(response == undefined){
        dispatch(showError(true))
        dispatch(setLoading(false))
      } else {
        if(response?.data?.success){
          navigate('OnlinePaymentSuccessScreen', { data: response?.data?.data, price: price, transactionFee: transactionFee, selectedPaymentMethod: selectedPaymentMethod })
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
        OkButton={() => setError({ value: false, message: '' })}
      />
      <CustomNavbar
        Title={'Confirmation'}
      />
      <View style={styles.bodyContainer}>
        <Image
          style={{ marginTop: 25, width: 150, height: 50 }}
          source={UMIcons.mainLogo}
          resizeMode='contain'
        />
        <View style={styles.computationContainer}>
          <View style={styles.computationSubContainer}>
            <Text style={styles.computationTxt}>Amount</Text>
            <Text style={styles.computationTxt}>{'₱ ' + moneyFormat(price)}</Text>
          </View>
          <View style={styles.computationSubContainer}>
            <Text style={styles.computationTxt}>Transaction Fee</Text>
            <Text style={styles.computationTxt}>{'₱ ' + moneyFormat(transactionFee)}</Text>
          </View>
          <View style={{ borderTopWidth: 1, borderTopColor: UMColors.black, marginVertical: 10 }}/>
          <View style={styles.computationSubContainer}>
            <Text style={styles.computationTxt}>Total</Text>
            <Text style={styles.computationTxt}>{'₱ ' + moneyFormat(total)}</Text>
          </View>
        </View>
        <View style={styles.cardContainer}>
          <Text style={[styles.standardFont, { marginRight: 10 }]}>Paid Via</Text>
          <Image
            style={styles.cardIcon}
            source={selectedPaymentMethod.cardType == 'visa' ? UMIcons.visaLogo : selectedPaymentMethod.cardType == 'master-card' ? UMIcons.masterCardLogo : UMIcons.creditCardLogo}
            resizeMode={'contain'}
          />
          <Text style={styles.cardName}>{capitalizeFirst(selectedPaymentMethod.cardType.replace('-', ''))}</Text>
        </View>
        <View style={{ borderTopWidth: 3, borderTopColor: UMColors.black, borderStyle: 'dotted', marginTop: 30, width: '90%' }}/>
      </View>
      <TouchableOpacity
        style={styles.confirmBtn}
        onPress={() => payCredit()}
      >
        <Text style={styles.confirmBtnTxt}>Confirm</Text>
      </TouchableOpacity>
      <Loader/>
    </SafeAreaView>
  )
}
 
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: UMColors.BGOrange,
    alignItems: 'center'
  },
  bodyContainer: {
    height: '100%',
    width: deviceWidth,
    alignItems: 'center',
    borderWidth: 2
  },
  computationContainer: {
    width: '80%',
    marginTop: '10%'
  },
  computationSubContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10
  },
  computationTxt: {
    fontSize: normalize(TextSize('M')),
    marginHorizontal: 6,
    color: UMColors.black
  },
  standardFont: {
    fontSize: normalize(TextSize('Normal')),
    color: UMColors.black,
  },
  priceTxt: {
    color: UMColors.primaryOrange,
    fontSize: normalize(TextSize('XL')),
    fontWeight: 'bold'
  },
  cardContainer: {
    marginTop: '10%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardIcon: {
    width: 45,
    height: 32
  },
  cardName: {
    fontSize: normalize(TextSize('M')),
    color: UMColors.black,
    fontWeight: 'bold',
    marginLeft: 5
  },
  confirmBtn: {
    position: 'absolute',
    bottom: 50,
    width: deviceWidth / 1.20,
    height: 50,
    backgroundColor: UMColors.primaryOrange,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 7
  },
  confirmBtnTxt: {
    fontSize: normalize(TextSize('M')),
    fontWeight: 'bold',
    color: UMColors.white
  }
})