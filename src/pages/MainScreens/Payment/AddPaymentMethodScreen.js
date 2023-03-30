import { 
  View, 
  Text, 
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Image,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native'
import React, { useEffect, useState } from 'react'
import GrayNavbar from '../../Components/GrayNavbar'
import { UMColors } from '../../../utils/ColorHelper'
import { UMIcons } from '../../../utils/imageHelper'
import { CardPayment } from '../../../api/paymentCard'
import { cardExpiryDateRegex, cardNumberRegex } from '../../../utils/stringHelper'
import ErrorWithCloseButtonModal from '../../Components/ErrorWithCloseButtonModal'
import { refreshTokenHelper } from '../../../api/helper/userHelper'
import { RadioButton } from 'react-native-paper'
import { dispatch } from '../../../utils/redux'
import { setLoading } from '../../../redux/actions/Loader'
import { showError } from '../../../redux/actions/ErrorModal'
import { goBack, navigate } from '../../../utils/navigationHelper'
import ErrorOkModal from '../../Components/ErrorOkModal'
import { useSelector } from 'react-redux'
import { useIsFocused } from '@react-navigation/native'
import { isPaymentSuccess } from '../../../redux/actions/PaymentChecker'
import SuccessOkModal from '../../Components/SuccessOkModal'

export default AddPaymentMethodScreen = () => {
  const payment = useSelector(state => state.paymentCheckerReducer.payment)
  const isFocused = useIsFocused()
  const [accountName, setAccountName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [CVC, setCVC] = useState('');
  const [expDate, setExpDate] = useState('');
  const [isDefault, setIsDefault] = useState(false)
  const [error, setError] = useState({
    value: false,
    message: ''
  })
  const [success, setSuccess] = useState({
    value: false,
    message: ''
  })

  useEffect(() => {
    if(isFocused){
      if(payment === 'failure'){
        setError({ value: true, message: 'Add Card Failed!' })
        dispatch(isPaymentSuccess(''))
      } else if(payment === 'success') {
        setSuccess({ value: true, message: 'Card Successfully Added!'})
        dispatch(isPaymentSuccess(''))
      }
    }
  }, [isFocused])

  const addCard = () => {
    dispatch(setLoading(true))
    const splittedExpDate = expDate.split('/');
    const data = {
      card_number: cardNumber.replaceAll(' ', ''),
      cvc: CVC,
      exp_month: splittedExpDate[0],
      exp_year: new Date().getFullYear().toString().substr(0, 2) + splittedExpDate[1],
      is_default: isDefault
    }
    refreshTokenHelper(async() => {
      const response = await CardPayment.addPaymentMethod(data);
      if(response == undefined){
        dispatch(setLoading(false))
        dispatch(showError(true))
      } else {
        if(response?.data?.success) {
          navigate('AddPaymentMethodWebView', { data: response.data })
          dispatch(setLoading(false))
        } else {
          setError({ value: true, message: response?.data?.data?.message || response?.data })
          dispatch(setLoading(false))
        }
      }
    })
  }

  const onSuccessBack = () => {
    setSuccess({ ...success, value: false })
    goBack()
  } 

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.mainContainer}>
        <ErrorWithCloseButtonModal/>
        <ErrorOkModal
          Visible={error.value}
          ErrMsg={error.message}
          OkButton={() => {
            setError({ ...error, value: false })
          }}
        />
        <SuccessOkModal
          Visible={success.value}
          SuccessMsg={success.message}
          OkButton={() => {
            onSuccessBack()
          }}
        />
        <GrayNavbar
          Title={'Add Card'}
        />
        <TextInput
          style={[styles.cardTxtInput, { marginTop: '10%' }]}
          placeholder={'Account Name'}
          onChangeText={val => setAccountName(val)}
        />
        <TextInput 
          style={styles.cardTxtInput}
          placeholder={'Card Number'}
          keyboardType={'number-pad'}
          value={cardNumber}
          maxLength={19}
          onChangeText={val => setCardNumber(cardNumberRegex(val))}
        />
        <View style={{flexDirection: 'row', width: '90%', justifyContent: 'space-between'}}>
          <TextInput
            style={styles.expiryDateInput}
            placeholder={'MM/YY'}
            keyboardType={'number-pad'}
            value={expDate}
            maxLength={5}
            onChangeText={val => setExpDate(cardExpiryDateRegex(val))}
          />
          <TextInput
            style={styles.cvcInput}
            placeholder={'CVC'}
            keyboardType={'number-pad'}
            maxLength={3}
            onChangeText={val => setCVC(val)}
          />
        </View>
        <View style={styles.defaultContainer}>
          <RadioButton
            value={isDefault}
            status={isDefault ? 'checked' : 'unchecked'}
            onPress={() => {
              setIsDefault(!isDefault)
            }}
            color={UMColors.primaryOrange}
            uncheckedColor={UMColors.primaryOrange}
          />
          <Text style={styles.defaultTxt}>Set as primary card</Text>
        </View>
        <TouchableOpacity
          style={[styles.addBtn,
            accountName === '' && cardNumber === '' && expDate === '' && CVC === '' ?
              { backgroundColor: UMColors.primaryGray }
            :
              { backgroundColor: UMColors.primaryOrange }
          ]}
          disabled={ accountName === '' && cardNumber === '' && expDate === '' && CVC === '' ? true : false }
          onPress={() => {
            addCard()
          }}
        >
          <Text style={styles.addBtnTxt}>Add</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: UMColors.BGOrange,
    alignItems: 'center'
  },
  cardTxtInput: {
    width: '90%',
    borderWidth: 1,
    borderColor: UMColors.primaryOrange,
    backgroundColor: UMColors.white,
    marginTop: 10,
    paddingHorizontal: 20,
    borderRadius: 6
  }, 
  expiryDateInput: {
    width: '40%',
    borderWidth: 1,
    borderColor: UMColors.primaryOrange,
    backgroundColor: UMColors.white,
    marginTop: 10,
    textAlign: 'center',
    borderRadius: 6
  },
  cvcInput: {
    width: '25%',
    borderWidth: 1,
    borderColor: UMColors.primaryOrange,
    backgroundColor: UMColors.white,
    marginTop: 10,
    textAlign: 'center',
    borderRadius: 6
  },
  addBtn: {
    position: 'absolute',
    bottom: 100,
    width: '75%',
    height: 50,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8
  },
  addBtnTxt: {
    fontSize: 22,
    fontWeight: 'bold',
    color: UMColors.white
  },
  defaultContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    marginTop: 10
  },
  defaultTxt: {
    fontSize: 15,
    color: UMColors.black
  }
})