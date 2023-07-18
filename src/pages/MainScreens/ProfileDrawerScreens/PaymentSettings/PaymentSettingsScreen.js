import { 
  View, 
  Text, 
  SafeAreaView, 
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList
} from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomNavbar from '../../../Components/CustomNavbar'
import { UMColors } from '../../../../utils/ColorHelper'
import { UMIcons } from '../../../../utils/imageHelper'
import { TextSize, capitalizeFirst, moneyFormat, normalize } from '../../../../utils/stringHelper'
import { dispatch } from '../../../../utils/redux'
import { setLoading } from '../../../../redux/actions/Loader'
import { refreshTokenHelper } from '../../../../api/helper/userHelper'
import { CardPayment } from '../../../../api/paymentCard'
import { showError } from '../../../../redux/actions/ErrorModal'
import { Loader } from '../../../Components/Loader'
import { FetchApi } from '../../../../api/fetch'
import { navigate } from '../../../../utils/navigationHelper'
import { useIsFocused } from '@react-navigation/native'
import { color } from 'react-native-reanimated'

const deviceWidth = Dimensions.get('screen').width



export default PaymentSettingsScreen = () => {

  const[paymentMethod, setPaymentMethod] = useState(undefined)
  const[paymentHistoryData, setPaymentHistoryData] = useState([])
  const[error, setError] = useState({ value: false, message: '' })
  const isFocused = useIsFocused()

  useEffect(() => {
    if(isFocused){
      getPayMethods()
      getPaymentHistory()
    }
  }, [isFocused])

  const getPayMethods = () => {
    dispatch(setLoading(true))
    refreshTokenHelper(async() => {
      const response = await CardPayment.getPaymentMetods()
      if(response == undefined){
        dispatch(showError(true))
        dispatch(setLoading(false))
      } else {
        if(response?.data?.success){
          response?.data?.data?.map((item, index) => {
            if(item.default){
              setPaymentMethod(item)
            }
          })
          dispatch(setLoading(false))
          console.log(paymentMethod)
        } else {
          setError({ value: false, message: response?.data?.message || response?.data })
          dispatch(setLoading(false))
        }
      }
    })
  }

  const getPaymentHistory = () => {
    dispatch(setLoading(true))
    refreshTokenHelper(async() => {
      const response = await FetchApi.PaymentsHistory()
      if(response == undefined){
        dispatch(showError(true))
        dispatch(setLoading(false))
      } else {
        if(response?.data?.success){
          setPaymentHistoryData(response?.data?.data)
          dispatch(setLoading(false))
        } else {
          setError({ value: true, message: response?.data?.message || response?.data })
          dispatch(setLoading(false))
        }
      }
    })
  }

  const renderTransaction = ({ item, index }) => {
    return (
      <View style={styles.transactionDetailsContainer}>
        <View style={styles.transactionLeftDetails}>
          <Image
            style={{ width: 40, height: 50 }}
            source={UMIcons.transactionSheetIcon}
            resizeMode='contain'
          />
          <View style={{ marginLeft: 5 }}>
            <Text style={{ fontSize: normalize(TextSize('Normal')), fontWeight: 'bold' }}>{item.cheque == 'None' ? 'Online Payment' : 'Cheque'}</Text>
            <Text style={{ fontSize: normalize(TextSize('S')) }}>{item.status}</Text>
          </View>
        </View>
        <Text style={{ fontSize: normalize(TextSize('Normal')), marginRight: 10 }}>{'₱ ' + moneyFormat(parseInt(item.amount))}</Text>
      </View>
    )
  }

  return (
      <SafeAreaView style={styles.mainContainer}>
        <CustomNavbar
          Title={'Payment'}
        />
        <View style={styles.changePaymentContainer}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              style={{ width: 30, height: 30 }}
              source={UMIcons.creditCardLogo}
              resizeMode='contain'
            />
            <Text style={[styles.changePaymentTxt, { marginLeft: 5 }]}>Saved payment methods</Text>
          </View>
          <TouchableOpacity
            onPress={() => navigate('PaymentMethodScreen')}
          >
            <Text style={[styles.changePaymentTxt, { fontWeight: 'bold', color: UMColors.primaryOrange }]}>
              Change
            </Text>
          </TouchableOpacity>
        </View>
        {
          paymentMethod ? 
          <View style={styles.cardDetailsContainer}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                style={{ width: 45, height: 45 }}
                source={paymentMethod.cardType == 'master-card' ? UMIcons.masterCardLogo : paymentMethod.cardType == 'visa' ? UMIcons.visaLogo : UMIcons.creditCardLogo}
                resizeMode='contain'
              />
              <View style={{ marginLeft: 10 }}>
                <Text style={[styles.changePaymentTxt, { fontWeight: 'bold' }]}>{capitalizeFirst(paymentMethod.cardType.replace('-', ''))}</Text>
                <Text style={styles.changePaymentTxtSmall}>{'**** ' + paymentMethod.last4}</Text>
              </View>
            </View>
            <Text style={[styles.changePaymentTxt, { backgroundColor: UMColors.ligthGray, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 50 }]}>
              Primary
            </Text>
          </View>
          :
          <View style={styles.cardDetailsContainer}>
            <Text style={styles.noCardTxt}>No Primary Payment Method</Text>
          </View>
        }
        <View style={styles.transactionsContainer}> 
          <View style={{ flexDirection: 'row', width: deviceWidth / 1.28, justifyContent: 'space-between'}}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                style={{ width: 20, height: 20 }}
                source={UMIcons.pastTransactionIcon}
                resizeMode='contain'
              />
              <Text style={styles.transactionsTxt}>Transactions</Text>
            </View>
            <TouchableOpacity>
              <Text style={[styles.transactionsTxt, { color: UMColors.BGOrange, fontWeight: 'bold',}]}>
                View All
              </Text>
            </TouchableOpacity>
          </View>
          {
            paymentHistoryData.length == 0 ?
            <Text style={[styles.noCardTxt, { marginTop: '20%'}]}>No Payment History</Text>
            :
            <FlatList
              data={paymentHistoryData}
              style={styles.historyList}
              renderItem={renderTransaction}
            />
          }
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
  changePaymentContainer: {
    flexDirection: 'row',
    width: deviceWidth / 1.15,
    marginVertical: '6%',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  changePaymentTxt: {
    color: UMColors.black,
    fontSize: normalize(TextSize('Normal'))
  },
  changePaymentTxtSmall: {
    color: UMColors.black,
    fontSize: normalize(TextSize('S'))
  },
  cardDetailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: deviceWidth / 1.25,
    justifyContent: 'space-between',
  },
  noCardTxt: {
    fontSize: normalize(TextSize('Normal')),
    color: UMColors.primaryGray,
    width: '100%',
    textAlign: 'center'
  },
  transactionsContainer: {
    alignItems: 'center',
    marginTop: '12%',
  },
  transactionsTxt: {
    fontSize: 16,
    marginLeft: 3,
    color: UMColors.black
  },
  transactionDetailsContainer: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    width: deviceWidth / 1.3,
    justifyContent: 'space-between'
  },
  transactionLeftDetails: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  historyList: {
    maxWidth: '100%',
    maxHeight: '60%'
  },
})