import { 
  View, 
  Text, 
  SafeAreaView, 
  StyleSheet, 
  Dimensions, 
  Image,
  FlatList, 
  TouchableOpacity 
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { UMColors } from '../../utils/ColorHelper'
import CustomNavbar from '../Components/CustomNavbar'
import { UMIcons } from '../../utils/imageHelper'
import { moneyFormat } from '../../utils/stringHelper'
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

const deviceWidth = Dimensions.get('screen').width

export default WalletScreen = () => {
  const userDetailsData = useSelector(state => state.userOperations.userDetailsData)
  const [error, setError] = useState({ value: false, message: ''})
  const [transactionList, setTransactionList] = useState([
    {
      transaction_id: 'UMC890',
      booking_type: 'Shared Booking',
      price: 125
    },
    {
      transaction_id: 'UMC109',
      booking_type: 'Exclusive Booking',
      price: 1250
    },
    {
      transaction_id: 'UMC025',
      booking_type: 'Exclusive Booking',
      price: 2015
    },
    {
      transaction_id: 'UMC023',
      booking_type: 'Shared Booking',
      price: 825
    },
    {
      transaction_id: 'UMC003',
      booking_type: 'Refund',
      price: 525
    },
  ])

  useEffect(() => {
    getCustomerData()
    console.log(userDetailsData?.outstanding_balance)
  }, [])

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

  const renderTransaction = ({ item, index }) => {
    return (
      <View style={styles.transactionDetailsContainer}>
        <View style={styles.transactionLeftDetails}>
          <Image
            style={{ width: 40, height: 50 }}
            source={ item.booking_type == 'Refund' ? UMIcons.refundIcon : UMIcons.transactionSheetIcon}
            resizeMode='contain'
          />
          <View style={{ marginLeft: 5 }}>
            <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{item.transaction_id}</Text>
            <Text style={{ fontSize: 10 }}>{item.booking_type}</Text>
          </View>
        </View>
        <Text style={{ fontSize: 13 }}>{'-₱ ' + moneyFormat(item.price)}</Text>
      </View>
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
            <TouchableOpacity style={styles.renewBtn}>
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
              <Text style={[styles.transactionsTxt, { color: UMColors.primaryOrange, fontWeight: 'bold'}]}>
                View All
              </Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={transactionList}
            renderItem={renderTransaction}
          />
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
    alignItems: 'center'
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
    fontSize: 40,
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
    fontSize: 13,
    color: UMColors.black
  },
  renewBtn: {
    flexDirection: 'row',
    alignItems: 'center'
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
    fontSize: 11,
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
    fontSize: 18,
    fontWeight: 'bold',
    color: UMColors.white
  }
})