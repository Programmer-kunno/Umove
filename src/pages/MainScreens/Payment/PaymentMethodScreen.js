import { 
  View, 
  Text, 
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Image
} from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomNavbar from '../../Components/CustomNavbar'
import { UMColors } from '../../../utils/ColorHelper'
import { UMIcons } from '../../../utils/imageHelper'
import { navigate } from '../../../utils/navigationHelper'
import { CardPayment } from '../../../api/paymentCard'
import { dispatch } from '../../../utils/redux'
import { showError } from '../../../redux/actions/ErrorModal'
import ErrorWithCloseButtonModal from '../../Components/ErrorWithCloseButtonModal'
import { refreshTokenHelper } from '../../../api/helper/userHelper'
import { TextSize, capitalizeFirst, normalize } from '../../../utils/stringHelper'
import { RadioButton } from 'react-native-paper'
import { useIsFocused } from '@react-navigation/native'
import { setLoading } from '../../../redux/actions/Loader'
import { Loader } from '../../Components/Loader'
import { color } from 'react-native-reanimated'
import ErrorOkModal from '../../Components/ErrorOkModal'

export default PaymentMethodScreen = () => {
  const [cardList, setCardList] = useState([])
  const [primary, setPrimary] = useState(0)
  const isFocused = useIsFocused()
  const [error, setError] = useState({
    value: false,
    message: ''
  })
  
  useEffect(() => {
    if(isFocused){
      getPaymentMethods()
    } 
  }, [isFocused])


  const getPaymentMethods = () => {
    dispatch(setLoading(true))
    refreshTokenHelper(async() => {
      const response = await CardPayment.getPaymentMetods()
      console.log(response)
      if(response == undefined){
        dispatch(setLoading(false))
        dispatch(showError(true))
      } else {
        if(response?.data?.success){
          response?.data?.data.map((data) => {
            if(data.default){
              setPrimary(data.id)
            } else {
              setPrimary(0)
            }
          })
          const mapReverse = response?.data?.data
          .slice(0)
          .reverse()
          .map(element => {
            return element;
          });
          setCardList(mapReverse)
          dispatch(setLoading(false))
        } else {
          setError({ value: true, message: response?.data?.data?.message || response?.data })
          dispatch(setLoading(false))
        }
      }
    })
  }

  const setPrimaryCard = (paymentMethodId) => {
    setPrimary(paymentMethodId)
    dispatch(setLoading(true))
    refreshTokenHelper(async() => {
      const response = await CardPayment.updatePaymentMethod(paymentMethodId)
      if(response == undefined){
        dispatch(setLoading(false))
        dispatch(showError(true))
      } else {
        if(response?.data?.success){
          dispatch(setLoading(false))
          getPaymentMethods()
        } else {
          dispatch(setLoading(false))
          setError({ value: true, message: response?.data?.message })
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
          setError({...error, value: false})
        }}
      />
      <StatusBar barStyle={'light-content'}/>
      <CustomNavbar
        Title={'Payment Methods'}
      />
      <View style={styles.titleContainer}>
        <Text style={styles.titleTxt}>Cards</Text>
      </View>
      <View style={styles.cardListContainer}>
        {
          cardList ?
            cardList.map((result, index) => (
              <TouchableOpacity
                key={index}
                style={styles.methodBtn}
                onPress={() => {

                }}
              >
                <View style={styles.cardContainer}>
                  <RadioButton
                    marginLeft={10}
                    value={result.id}
                    status={primary === result.id ? 'checked' : 'unchecked'}
                    onPress={() => {
                      setPrimaryCard(result.id)
                    }}
                    color={UMColors.primaryOrange}
                    uncheckedColor={UMColors.primaryOrange}
                  />
                  <Image
                    style={styles.methodImg}
                    source={result.cardType == 'visa' ? UMIcons.visaLogo : result.cardType == 'master-card' ? UMIcons.masterCardLogo : UMIcons.creditCardLogo}
                    resizeMode={'contain'}
                  />
                  <View style={{marginLeft: 10}}>
                    <Text style={styles.cardName}>{capitalizeFirst(result.cardType.replace('-', ''))}</Text>
                    <Text style={styles.cardNumber}>{'**** ' + result.last4}</Text>
                  </View>
                </View>
                { result.default && <Text style={styles.primaryTxt}>primary</Text> }
                <Image
                  style={styles.arrowImage}
                  source={UMIcons.backIconOrange}
                  resizeMode={'contain'}
                />
              </TouchableOpacity>
            ))
          :
          <Text style={styles.noCardMethodTxt}>No Card Available</Text>
        }
        <TouchableOpacity
          style={styles.addItemBtn}
          onPress={() => {
            navigate('AddPaymentMethodScreen')
          }}
        >
          <Text style={styles.addItemTxt}>Add</Text>
        </TouchableOpacity>
      </View>
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
  titleContainer: {
    width: '90%',
    marginTop: '5%'
  },
  titleTxt: {
    fontSize: normalize(TextSize('Normal')),
    color: UMColors.black,
    fontWeight: 'bold',
  },
  cardListContainer: {
    marginTop: 5,
    width: '90%',
    alignItems: 'center'
  },
  methodBtn: {
    width: '100%',
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
  },
  methodImg: {
    width: 40,
    height: 30,
  },
  addItemBtn: {
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '20%',
    height: 27,
    borderRadius: 7,
    borderColor: UMColors.primaryOrange,
    marginTop: 15
  },
  addItemTxt: {
    color: UMColors.primaryOrange,
    fontSize: normalize(TextSize('Normal'))
  },
  cardName:{
    fontSize: normalize(TextSize('Normal')),
    color: UMColors.black,
    fontWeight: 'bold'
  },
  cardNumber: {
    fontSize: normalize(TextSize('S')),
    color: UMColors.primaryGray
  },
  cardContainer: {
    width: '94%',
    flexDirection: 'row',
    alignItems: 'center'
  },
  arrowImage: {
    width: 14,
    height: 14,
    transform: [
      { scaleX: -1 }
    ]
  },
  noCardMethodTxt: {
    alignSelf: 'center', 
    fontSize: normalize(TextSize('Normal')), 
    padding: 20, 
    color: UMColors.primaryGray
  },
  primaryTxt: {
    fontStyle: 'italic',
    fontSize: normalize(TextSize('Normal')),
    position: 'absolute',
    right: 40,
    top: 10
  }
})