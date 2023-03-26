import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  Image, 
  StatusBar 
} from 'react-native'
import React, { useEffect, useState } from 'react'
import GrayNavbar from '../../Components/GrayNavbar'
import { UMColors } from '../../../utils/ColorHelper'
import { RadioButton } from 'react-native-paper'
import { UMIcons } from '../../../utils/imageHelper'
import ErrorOkModal from '../../Components/ErrorOkModal'
import { navigate } from '../../../utils/navigationHelper'
import { CardPayment } from '../../../api/paymentCard'
import ErrorWithCloseButtonModal from '../../Components/ErrorWithCloseButtonModal'
import { capitalizeFirst } from '../../../utils/stringHelper'
import { dispatch } from '../../../utils/redux'
import { setLoading } from '../../../redux/actions/Loader'
import { refreshTokenHelper } from '../../../api/helper/userHelper'
import { useIsFocused } from '@react-navigation/native'

export default SelectPaymentScreen = () => {
  const [useWallet, setUseWallet] = useState(false)
  const [balance, setBalance] = useState('00.00')
  const [selectPaymentRadio, setSelectPaymentRadio] = useState()
  const [paymentMethod, setPaymanetMethod] = useState([])
  const isFocused = useIsFocused()
  const [error, setError] = useState({
    value: false,
    message: '',
  })

  useEffect(() => {
    if(isFocused){
      getPaymentMethods()
      setSelectPaymentRadio()
    } 
  }, [isFocused])

  const getPaymentMethods = () => {
    dispatch(setLoading(true))
    refreshTokenHelper(async() => {
      const response = await CardPayment.getPaymentMetods()
      if(response == undefined){
        dispatch(setLoading(false))
        dispatch(showError(true))
      } else {
        if(response?.data?.success){
          console.log(response.data.data)
          setPaymanetMethod(response?.data?.data)
          dispatch(setLoading(false))
        } else {
          dispatch(setLoading(false))
        }
      }
    })
  }

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar barStyle={'light-content '}/>
      <ErrorWithCloseButtonModal/>
      <ErrorOkModal
        Visible={error.value}
        ErrMsg={error.message}
        OkButton={() => {

        }}
      />
      {/* Header */}
      <GrayNavbar
        Title={'Select Payment'}
      />
      <View style={styles.headerGrayExtention}>
        {/* Amount Container */}
        <View style={styles.amountContainer}>
          <View style={styles.amountHeaderContainer}>
            <View style={styles.useWalletRadioContainer}>
              <RadioButton
                value={useWallet}
                status={useWallet ? 'checked' : 'unchecked'}
                onPress={() => {
                  setUseWallet(!useWallet)
                  setSelectPaymentRadio('')
                }}
                color={UMColors.primaryOrange}
                uncheckedColor={UMColors.primaryOrange}
              />
              <Text style={styles.walletRadioBtnLabel}>Use Wallet</Text>
            </View>
            <TouchableOpacity
              style={styles.topUpBtn}
            >
              <Text style={styles.topUpLabel}>Top up</Text>
              <Image
                style={styles.topUpImage}
                source={UMIcons.topUpWalletIcon}
                resizeMode={'contain'}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.priceText}>₱</Text>
            <Text style={styles.priceText}>{balance}</Text>
          </View>
          <Text style={styles.availableBalanceTxt}>Available Balance</Text>
        </View>
      </View>
      {/* Payment Method */}
      <View style={styles.selectPaymentContainer}>
        {
          paymentMethod ?
            paymentMethod.map((result, index) => (
              result.default &&
                <TouchableOpacity
                  style={styles.selectPaymentBtn}
                  key={index}
                  onPress={() => {
                    setSelectPaymentRadio(result.id)
                  }}
                >
                  <View style={styles.radioBtnSection}>
                    <RadioButton
                      value={result.id}
                      status={selectPaymentRadio === result.id ? 'checked' : 'unchecked'}
                      onPress={() => {
                        setSelectPaymentRadio(result.id)
                        setUseWallet(false)
                      }}
                      color={UMColors.primaryOrange}
                      uncheckedColor={UMColors.primaryOrange}
                    />
                    <Text style={styles.paymentTitle}>{capitalizeFirst(result.cardType.replace('-', ''))}</Text>
                    <Text style={styles.cardNumber}>{'**** ' + result.last4}</Text>
                  </View>
                  <Image
                    style={styles.paymentLogo}
                    source={result.cardType == 'visa' ? UMIcons.visaLogo : result.cardType == 'master-card' ? UMIcons.masterCardLogo : UMIcons.creditCardLogo}
                    resizeMode={'contain'}
                  />
                </TouchableOpacity>
            ))
          :
          <Text style={styles.noPayMethodTxt}>No Payment Method Available</Text>
        }
        <TouchableOpacity
          style={styles.selectPaymentBtn}
          onPress={() => {
            navigate('PaymentMethodScreen')
          }}
        >
          <Text style={styles.paymentTitle}>Other Payment Method</Text>
          <Image
            style={styles.otherPaymentArrowImage}
            source={UMIcons.backIconOrange}
            resizeMode={'contain'}
          />
        </TouchableOpacity>
      </View>
      {/* Voucher */}
      <TouchableOpacity
        style={styles.voucherBtn}
        onPress={() => {}}
      >
        <Image
          style={styles.voucherIcon}
          source={UMIcons.voucherIcon}
          resizeMode={'contain'}
        />
        <Text style={styles.voucherTxt}>Use Voucher</Text>
      </TouchableOpacity>
      {/* Next Button */}
      <TouchableOpacity
        style={[styles.nextBtn, 
          useWallet || selectPaymentRadio ?  
          { backgroundColor: UMColors.primaryOrange }
          :
          { backgroundColor: UMColors.primaryGray }
        ]}
        disabled={!useWallet || selectPaymentRadio === '' ? false : true}
        onPress={() => {

        }}
      >
        <Text style={styles.nextBtnTxt}>Next</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: UMColors.BGOrange,
    alignItems: 'center'
  },
  headerGrayExtention: {
    width: '100%',
    height: '15%',
    backgroundColor: UMColors.darkerGray,
    alignItems: 'center'
  },
  amountContainer: {
    width: '95%',
    height: '130%',
    position: 'absolute',
    bottom: -50,
    backgroundColor: UMColors.white,
    borderRadius: 8,
    elevation: 10,
  },
  amountHeaderContainer: {
    width: '100%',
    height: '20%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: 5
  },
  useWalletRadioContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  walletRadioBtnLabel: {
    fontSize: 14,
    color: UMColors.black
  },
  topUpBtn: {
    width: 100,
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  topUpLabel: {
    fontSize: 16,
    color: UMColors.primaryOrange,
    fontWeight: 'bold'
  },
  topUpImage: {
    width: 26,
    height: 26,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  priceText: {
    fontSize: 40,
    color: UMColors.black,
    fontWeight: '500',
    padding: 15
  },
  availableBalanceTxt: {
    color: UMColors.black,
    alignSelf: 'center',
    position: 'absolute',
    bottom: 10,
    fontSize: 12
  },
  selectPaymentContainer: {
    width: '100%',
    marginTop: '20%'
  },
  selectPaymentBtn: {
    flexDirection: 'row',
    height: 60,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: UMColors.ligthGray,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 25
  },
  radioBtnSection: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  paymentTitle: {
    fontSize: 17,
    color: UMColors.black,
    fontWeight: 'bold'
  },
  paymentLogo: {
    width: 40,
    height: 40
  },
  otherPaymentArrowImage: {
    width: 14,
    height: 14,
    transform: [
      { scaleX: -1 }
    ]
  },
  voucherBtn: {
    width: '88%',
    height: '10%',
    borderWidth: 2,
    marginTop: '10%',
    borderStyle: 'dashed',
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  voucherIcon: {
    width: 60,
    height: '70%'
  },
  voucherTxt: {
    fontSize: 25,
    color: UMColors.black,
    fontWeight: 'bold',
    marginLeft: 20
  },
  nextBtn: {
    width: '88%',
    justifyContent: 'center',
    alignItems: 'center',
    height: 55,
    borderRadius: 50,
    position: 'absolute',
    bottom: 60
  },
  nextBtnTxt: {
    fontSize: 16,
    fontWeight: 'bold',
    color: UMColors.white
  },
  noPayMethodTxt: {
    alignSelf: 'center', 
    fontSize: 15, 
    padding: 20, 
    color: UMColors.primaryGray
  },
  cardNumber: {
    fontSize: 10,
    color: UMColors.primaryGray,
    marginLeft: 10
  },
})