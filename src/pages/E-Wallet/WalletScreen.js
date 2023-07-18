import { 
  View, 
  Text, 
  SafeAreaView, 
  StyleSheet, 
  Dimensions, 
  Image,
  FlatList, 
  TouchableOpacity,
  Modal,
  TextInput
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { UMColors } from '../../utils/ColorHelper'
import CustomNavbar from '../Components/CustomNavbar'
import { UMIcons } from '../../utils/imageHelper'
import { TextSize, moneyFormat, normalize } from '../../utils/stringHelper'
import { refreshTokenHelper } from '../../api/helper/userHelper'
import { CustomerApi } from '../../api/customer'
import { dispatch } from '../../utils/redux'
import { showError } from '../../redux/actions/ErrorModal'
import { saveUser } from '../../redux/actions/User'
import { navigate, resetNavigation } from '../../utils/navigationHelper'
import { setLoading } from '../../redux/actions/Loader'
import ErrorWithCloseButtonModal from '../Components/ErrorWithCloseButtonModal'
import ErrorOkModal from '../Components/ErrorOkModal'
import { Loader } from '../Components/Loader'
import { useSelector } from 'react-redux'
import { FetchApi } from '../../api/fetch'
import { useIsFocused } from '@react-navigation/native'
import { PayCreditApi } from '../../api/creditPayment'

const deviceWidth = Dimensions.get('screen').width
const deviceHeight = Dimensions.get('screen').height

export default WalletScreen = () => {
  const userDetailsData = useSelector(state => state.userOperations.userDetailsData)
  const [error, setError] = useState({ value: false, message: ''})
  const [paymentHistoryData, setPaymentHistoryData] = useState([])
  const isFocused = useIsFocused()
  const [renewModal, setRenewModal] = useState(false)
  const [renewInputModal, setRenewInputModal] = useState(false)
  const [amount, setAmount] = useState('')

  useEffect(() => {
    getCustomerData()
    getPaymentHistory()
  }, [])
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
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

  const getCustomerData = () => {
    dispatch(setLoading(true))
    refreshTokenHelper(async() => {
      const response = await CustomerApi.getCustomerData()
      if(response == undefined){
        dispatch(showError(true))
        dispatch(setLoading(false))
      } else {
        if(response?.data?.success) {
          dispatch(saveUser(response?.data?.data))
          dispatch(setLoading(false))
        } else {
          setError({ value: true, message: response?.data?.message || response?.data })
          dispatch(setLoading(false))
        }
      }
    })
  }

  const requestCreditIncrease = () => {
    setRenewInputModal(false)
    dispatch(setLoading(true))
    const data = {
      amount: amount
    }
    refreshTokenHelper(async() => {
      const response = await PayCreditApi.requestRenew(data)
      if(response == undefined){
        dispatch(showError(true))
        dispatch(setLoading(false))
      } else {
        if(response?.data?.success) {
          setRenewModal(true)
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
  
  const creditInputModal = () => {
    return(
      <Modal
        visible={renewInputModal}
        animationType='none'
        statusBarTranslucent
        transparent={true}
      >
        <View style={styles.mainMdlContainer}>
          <View style={styles.mdlContainer}>
            <View style={styles.mdlTxtContainer}>
              <Text style={[styles.mdlTxt, { marginTop: 30 }]}>{'Input desired credit increase'}</Text>
              <TextInput
                keyboardType='numeric'
                style={styles.mdlRequestInput}
                onChangeText={(val) => {
                  setAmount(val)
                }}
              />
            </View>
            <View style={[styles.mdlBtnContainer, { marginBottom: 30 }]}>
              <TouchableOpacity
                onPress={() => requestCreditIncrease()}
              >
                <Text style={styles.mdlBtnTxt}>Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setRenewInputModal(false)
                }}
              >
                <Text style={[styles.mdlBtnTxt, { color: UMColors.red }]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    )
  }

  const requestRenewModal = () => {
    return(
      <Modal
        visible={renewModal}
        animationType='none'
        statusBarTranslucent
        transparent={true}
      >
        <View style={styles.mainMdlContainer}>
          <View style={[styles.mdlContainer, { width: '90%' }]}>
            <View style={styles.mdlTxtContainer}>
              <Text style={[styles.mdlTxt, { marginTop: 30 }]}>{'You have requested for the renewal of your Credit Limit.'}</Text>
              <Text style={[styles.mdlTxt, { marginTop: 20 }]}>{'Your Credit limit will renew once approved'}</Text>
            </View>
              <TouchableOpacity onPress={() => setRenewModal(false)}>
                <Text style={[styles.mdlBtnTxt, { marginVertical: 30, fontSize: normalize(TextSize('M')) }]}>Okay</Text>
              </TouchableOpacity>
          </View>
        </View>
      </Modal>
    )
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
        Title={'UMOVE Wallet'}
      />
      <View style={styles.navBarGrayExtend}>
        <View style={styles.walletCreditContainer}>
          <Text style={styles.creditBalance}>{moneyFormat(userDetailsData?.remaining_credits)}</Text>
          <View style={styles.walletCreditBottomContainer}>
            <Text style={styles.bottomPartTxt}>Current Credit Limit</Text>
            <TouchableOpacity 
              style={styles.renewBtn}
              onPress={() => setRenewInputModal(true)}
            >
              <Text style={[styles.bottomPartTxt, { color: UMColors.primaryOrange, fontWeight: 'bold', marginRight: 8}]}>
                Request Renew
              </Text>
              <Image
                style={{ width: 15, height: 15 }}
                source={UMIcons.renewIcon}
                resizeMode='contain'
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.walletBodyContainer}>
        <View style={styles.toPayContainer}>
          <Text style={styles.toPayTxt}>{'To Pay: ₱ ' + moneyFormat(userDetailsData?.outstanding_balance)}</Text>
          {/* <Text style={styles.toPayTxt}>Due Date: March 28, 2023</Text> */}
        </View>
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
              <Text style={[styles.noHistoryTxt, { marginTop: '20%' }]}>No Payment History</Text>
            :
            <FlatList
              data={paymentHistoryData}
              style={styles.historyList}
              renderItem={renderTransaction}
            />
          }
        </View>
      </View>
        {
          userDetailsData?.outstanding_balance != 0 &&
            <TouchableOpacity
              style={styles.payBtn}
              onPress={() => navigate('ToPayScreen')}
            >
              <Text style={styles.payBtnTxt}>Pay</Text>
            </TouchableOpacity>
        }
      {creditInputModal()}
      {requestRenewModal()}
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
  navBarGrayExtend: {
    backgroundColor: UMColors.darkerGray,
    width: deviceWidth,
    height: '7%',
    alignItems: 'center',
    zIndex: 1
  },
  walletCreditContainer: {
    width: deviceWidth / 1.05,
    height: 150,
    backgroundColor: UMColors.white,
    borderRadius: 10,
    position: 'absolute',
    alignItems: 'center',
    top: 10,
    elevation: 7
  },
  creditBalance: {
    fontSize: normalize(TextSize('XXL')),
    fontWeight: '400',
    width: '90%',
    textAlign: 'right',
    textAlignVertical: 'center',
    height: '65%',
    marginTop: 10
  },
  walletCreditBottomContainer: {
    flexDirection: 'row',
    width: '88%',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  bottomPartTxt: {
    fontSize: normalize(TextSize('Normal')),
    color: UMColors.black
  },
  renewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toPayContainer: {
    marginTop: 120,
    width: deviceWidth / 1.1
  },
  transactionsContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  toPayTxt:{
    fontSize: normalize(TextSize('Normal')),
    color: UMColors.black
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
  payBtn: {
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
  payBtnTxt: {
    fontSize: normalize(TextSize('M')),
    fontWeight: 'bold',
    color: UMColors.white
  },
  historyList: {
    maxWidth: '100%',
    maxHeight: '65%'
  },
  mainMdlContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  mdlContainer: {
    width: '80%',
    backgroundColor: UMColors.white,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center'
  },
  mdlTxtContainer: {
    width: '85%',
    justifyContent: 'center',
  },
  mdlTxt: {
    color: UMColors.black,
    fontSize: normalize(TextSize('M')),
    fontWeight: '400',
    alignSelf: 'center',
    textAlign: 'center'
  },
  mdlBtnContainer: {
    width: '50%',
    marginTop: '5%',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  mdlBtnTxt: {
    fontSize: normalize(TextSize('M')),
    fontWeight: 'bold',
    color: UMColors.primaryOrange
  },
  mdlRequestInput: {
    backgroundColor: UMColors.white,
    borderWidth: 1,
    borderColor: UMColors.primaryOrange,
    color: UMColors.black,
    height: 40,
    borderRadius: 5,
    marginTop: 10,
    fontSize: normalize(TextSize('Normal')),
    paddingLeft: 10,
    elevation: 7
  },
  renewModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  mdlSubContainer: {
    width: '90%',
    height: 200,
    backgroundColor: UMColors.white
  },
  noHistoryTxt: {
    fontSize: normalize(TextSize('Normal')),
    color: UMColors.primaryGray,
    width: '100%',
    textAlign: 'center'
  },
})