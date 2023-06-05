import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView,
  Image,
  Dimensions,
  TouchableOpacity 
} from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { UMColors } from '../utils/ColorHelper'
import { UMIcons } from '../utils/imageHelper'
import { dispatch } from '../utils/redux'
import { setLoading } from '../redux/actions/Loader'
import { refreshTokenHelper } from '../api/helper/userHelper'
import { BookingApi } from '../api/booking'
import ErrorWithCloseButtonModal from '../pages/Components/ErrorWithCloseButtonModal'
import ErrorOkModal from '../pages/Components/ErrorOkModal'
import { Loader } from '../pages/Components/Loader'
import { showError } from '../redux/actions/ErrorModal'
import { moneyFormat } from '../utils/stringHelper'
import RBSheet from 'react-native-raw-bottom-sheet';
import OrangeConfirmationModal from '../pages/Components/OrangeConfirmationModal'
import { navigate, resetNavigation } from '../utils/navigationHelper'

const deviceWidth = Dimensions.get('screen').width

export default DeliveredScreen = (props) => {
  const bookingNumber = props.route.params?.bookingNumber
  const isDoneRating = props.route.params?.isDoneRating
  const [bookingData, setBookingData] = useState(undefined)
  const transactionFee = 0
  const RBSheetRef = useRef(null)
  const setRef = (ref) => { RBSheetRef.current = ref; }
  const [showModal, setShowModal] = useState(false)
  const [error, setError] = useState({ value: false, message: '' })
  const [isConfirmed, setIsConfirmed] = useState(false)

  useEffect(() => {
    getBookingData()
  }, [])

  const getBookingData = () => {
    dispatch(setLoading(true))
    const data = {
      booking_number: bookingNumber
    }
    refreshTokenHelper(async() => {
      const response = await BookingApi.getBooking(data)
      if(response == undefined){
        dispatch(showError(true))
        dispatch(setLoading(false))
      } else {
        if(response?.data?.success){
          setBookingData(response?.data?.data)
          dispatch(setLoading(false))
        } else {
          setError({ value: false, message: response?.data?.message || response?.data })
          dispatch(setLoading(false))
        }
      }
    })
  }

  const renderBodyComponent = () => {
    return (
      bookingData && 
        <View style={styles.bodyContainer}>
          <Image
            style={{ width: deviceWidth / 1.3, height: 67 }}
            source={UMIcons.mainLogo}
            resizeMode='contain'
          />
          <View style={styles.deliveredContainer}>
            <Image
              style={{ width: 100, height: 100 }}
              source={UMIcons.boxCheckIcon}
              resizeMode='contain'
            />
            <Text style={styles.deliveredTxt}>Delivered</Text>
          </View>
          <Text style={styles.bookingNumberTxt}>{'Booking No. ' + bookingData.booking_number}</Text>
          <View style={styles.computationContainer}>
            <View style={styles.computationSubContainer}>
              <Text style={styles.computationTxt}>Amount</Text>
              <Text style={styles.computationTxt}>{'₱ ' + moneyFormat(bookingData.total_price)}</Text>
            </View>
            <View style={styles.computationSubContainer}>
              <Text style={styles.computationTxt}>Transaction Fee</Text>
              <Text style={styles.computationTxt}>{'₱ ' + moneyFormat(transactionFee)}</Text>
            </View>
            <View style={{ borderTopWidth: 1, borderTopColor: UMColors.black, marginVertical: 15 }}/>
            <View style={[styles.computationSubContainer, { marginTop: 0 }]}>
              <Text style={styles.computationTxt}>Total</Text>
              <Text style={styles.computationTxt}>{'₱ ' + moneyFormat(bookingData.total_price)}</Text>
            </View>
          </View>
        </View>
    )
  }

  const renderButtons = () => {
    return (
      <View style={styles.btnContainer}>
        {
          !isConfirmed && !isDoneRating &&
            <TouchableOpacity
              style={[styles.btnMainStyle, { backgroundColor: UMColors.BGOrange, borderWidth: 2, borderColor: UMColors.primaryOrange}]}
              onPress={() => RBSheetRef.current.open()}
            >
              <Text style={[styles.btnTxt, { color: UMColors.primaryOrange }]}>View Booking Details</Text>
            </TouchableOpacity>
        }
        <TouchableOpacity
          style={styles.btnMainStyle}
          onPress={() => {
            if(!isDoneRating){
              if(isConfirmed){
                navigate('RateScreen', {  bookingNumber: bookingNumber })
              } else {
                setShowModal(true)
              }
            } else {
              resetNavigation('DrawerNavigation')
            }
          }}
        >
          <Text style={styles.btnTxt}>
            {
              !isDoneRating ? 
                isConfirmed ? 'Rate' : 'Confirm' 
              :
                'Back to Home'
            }
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  const bookDetailsModal = () => {
      return(
        <RBSheet
          ref={setRef}
          height={320}
          openDuration={250}
          customStyles={{
            container: {
              justifyContent: "center",
              alignItems: "center",
              borderTopLeftRadius: 15,
              borderTopRightRadius: 15,
            }
          }}
        >
          <View style={styles.mdlDetailsContainer}>
            <Text style={styles.mdlTitle}>Booking Information</Text>
            <View style={styles.mdlInfoContainer}>
              <View style={styles.mdlInfo}>
                <Text style={styles.mdlInfoTxtLeft}>Type of Goods:</Text>
                <Text style={styles.mdlInfoTxtLeft}>Packaging Type:</Text>
                <Text style={styles.mdlInfoTxtLeft}>Quantity:</Text>
                <Text style={styles.mdlInfoTxtLeft}>Weight:</Text>
                <Text style={styles.mdlInfoTxtLeft}>Lenght:</Text>
                <Text style={styles.mdlInfoTxtLeft}>Width:</Text>
                <Text style={styles.mdlInfoTxtLeft}>Heigth:</Text>
              </View>
              <View style={[styles.mdlInfo, { alignItems: 'flex-end' }]}>
                <Text style={styles.mdlInfoTxtRight}>{bookingData.booking_items[0]?.subcategory.value}</Text>
                <Text style={styles.mdlInfoTxtRight}>{bookingData.booking_items[0]?.uom.value}</Text>
                <Text style={styles.mdlInfoTxtRight}>{bookingData.booking_items[0]?.quantity}</Text>
                <Text style={styles.mdlInfoTxtRight}>{bookingData.booking_items[0]?.weight}</Text>
                <Text style={styles.mdlInfoTxtRight}>{bookingData.booking_items[0]?.length}</Text>
                <Text style={styles.mdlInfoTxtRight}>{bookingData.booking_items[0]?.width}</Text>
                <Text style={styles.mdlInfoTxtRight}>{bookingData.booking_items[0]?.height}</Text>
              </View>
            </View>
          </View>
        </RBSheet>
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
      <OrangeConfirmationModal
        visible={showModal}
        message={'Would you like to confirm delivery?'}
        onNo={() => setShowModal(false)}
        onYes={() => {
          setShowModal(false)
          setIsConfirmed(true)
        }}
      />
      {renderBodyComponent()}
      {renderButtons()}
      { bookingData && bookDetailsModal()}
      <Loader/>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: UMColors.BGOrange,
    alignItems: 'center',
  },
  bodyContainer: {
    width: deviceWidth,
    alignItems: 'center',
    marginTop: '30%'
  },
  deliveredContainer: {
    alignItems: 'center',
    marginVertical: 20
  },
  deliveredTxt: {
    fontSize: 23,
    color: UMColors.primaryOrange,
  },
  bookingNumberTxt: {
    fontSize: 19,
    fontWeight: 'bold',
    color: UMColors.black,
    marginTop: 20
  },
  computationContainer: {
    width: '80%',
    marginTop: '8%'
  },
  computationSubContainer: {
    width: '100%', 
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10
  },
  computationTxt: {
    fontSize: 17,
    marginHorizontal: 6,
    color: UMColors.black
  },
  btnContainer: {
    position: 'absolute',
    bottom: 50
  },
  btnMainStyle: {
    width: deviceWidth / 1.2,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    marginVertical: 5,
    backgroundColor: UMColors.primaryOrange,
    elevation: 7
  },
  btnTxt: {
    fontSize: 15,
    fontWeight: 'bold',
    color: UMColors.white
  },
  mdlMainContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  mdlDetailsContainer: {
    width: '100%',
    height: '108%',
    alignItems: 'center'
  },
  mdlTitle: {
    marginTop: '7%',
    fontSize: 18,
    fontWeight: 'bold',
  },
  mdlInfoContainer: {
    width: '95%',
    height: '75%',
    marginTop: '3%',
    flexDirection: 'row'
  },
  mdlInfo: {
    width: '50%',
    height: '100%',
  },
  mdlInfoTxtLeft: {
    fontSize: 16,
    marginTop: '6%',
    marginLeft: '12%',
  },
  mdlInfoTxtRight: {
    fontSize: 16,
    marginTop: '6%',
    marginRight: '12%',
    fontWeight: 'bold',
    color: UMColors.primaryOrange
  }
})
