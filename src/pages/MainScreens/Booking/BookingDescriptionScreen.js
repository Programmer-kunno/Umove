import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, 
  StatusBar, 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  Dimensions,
  TextInput
} from 'react-native';
import CustomNavbar from '../../Components/CustomNavbar';
import { navigate } from '../../../utils/navigationHelper';
import { UMColors } from '../../../utils/ColorHelper';
import { UMIcons } from '../../../utils/imageHelper';
import { make12HoursFormat } from '../../../utils/stringHelper';
import { getPreciseDistance } from 'geolib';
import { RadioButton } from 'react-native-paper';
import { refreshTokenHelper } from '../../../api/helper/userHelper';
import { BookingApi } from '../../../api/booking';
import { dispatch } from '../../../utils/redux';
import { setLoading } from '../../../redux/actions/Loader';
import { showError } from '../../../redux/actions/ErrorModal';
import { Loader } from '../../Components/Loader';
import ErrorWithCloseButtonModal from '../../Components/ErrorWithCloseButtonModal';
import ErrorOkModal from '../../Components/ErrorOkModal';
import { saveBookingDetails } from '../../../redux/actions/Booking';

const deviceWidth = Dimensions.get('screen').width

export default BookingDescriptionScreen = (props) => {  
  const bookingData = props.route.params?.booking
  const [distance, setDistance] = useState(0)
  const [isSignatureRequired, setIsSignatureRequired] = useState(true)
  const [speacialInstruction, setSpecialInstruction] = useState('')
  const [error, setError] = useState({ value: false, message: '' })

  useEffect(() => {
    dispatch(setLoading(false))
    getDistance()
  }, [])

  const getDistance = () => {
    var distance = getPreciseDistance(
      { latitude: bookingData?.pickupLatitude, longitude: bookingData?.pickupLongitude },
      { latitude: bookingData?.dropoffLatitude, longitude: bookingData?.dropoffLongitude },
    )
    setDistance(distance) //Meter
  }

  const bookNow = () => {
    dispatch(setLoading(true))
    refreshTokenHelper(async() => {
      const response = await BookingApi.book({ ...bookingData, pickupSpecialInstructions: speacialInstruction, isSignatureRequired: isSignatureRequired })
      if(response == undefined){
        dispatch(setLoading(false))
        dispatch(showError(true))
      } else {
        if(response?.data?.success){
          dispatch(saveBookingDetails(response?.data?.data))
          navigate('BookingProcessingScreen')
          dispatch(setLoading(false))
        } else {
          if(response?.data?.message?.pickup_time){
            setError({ value: true, message: 'Pick up time passed or too soon' })
            dispatch(setLoading(false))
          } else {
            setError({ value: true, message: response?.data?.message || response?.data })
            dispatch(setLoading(false))
          }
        }
      }
    })
  }

  return(
    <View style={styles.mainContainer}>
      <StatusBar translucent backgroundColor={'transparent'} barStyle={'light-content'} />
      <ErrorWithCloseButtonModal/>
      <ErrorOkModal
        Visible={error.value}
        ErrMsg={error.message}
        OkButton={() => setError({ value: false, message: '' })}
      />

      {/* Header for Booking Summary */}
      <CustomNavbar
        Title={'Booking Summary'}
      />

      {/* Booking Summary Content */}
      <View style={styles.bodyContainer}>
        <View style={styles.bookingDetailsContainer}>
          <Image
            style={{ width: 120, height: 100 }}
            source={UMIcons.truckImg}
            resizeMode='contain'
          />
          <View style={styles.detailsTxtContainer}>
            <Text style={styles.detailsTxt}>Quick/ASAP</Text>
            <Text style={[styles.detailsTxt, { color: UMColors.primaryOrange, fontWeight: 'bold' }]}>
              {bookingData?.bookingType}
            </Text>
          </View>
          <View style={styles.detailsTxtContainer}>
            <Text style={styles.detailsTxt}>Pickup:</Text>
            <Text style={styles.detailsTxt}>
              {make12HoursFormat(bookingData?.pickupTime) + ' - ' + bookingData?.pickupDate}
            </Text>
          </View>
          <View style={[styles.detailsTxtContainer, { marginBottom: 10 }]}>
            <Text style={styles.detailsTxt}>Distance:</Text>
            <Text style={styles.detailsTxt}>{distance / 1000 + 'km' + ' ' + `(${distance}m)`}</Text>
          </View>
        </View>
        <View style={styles.signatureContainer}>
          <View style={styles.signatureSubContainer}>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 14, color: UMColors.black }}>Require Signature</Text>
              <Text style={{ fontSize: 11, color: UMColors.black }}>Applies to all locations</Text>
            </View>
            <RadioButton
              value={isSignatureRequired}
              status={isSignatureRequired ? 'checked' : 'unchecked'}
              onPress={() => {
                setIsSignatureRequired(!isSignatureRequired)
              }}
              color={UMColors.green}
              uncheckedColor={UMColors.primaryOrange}
            />
          </View>
        </View>
        <View style={styles.specialInputContainer}>
          <TextInput
            style={styles.specialTxtInput}
            placeholder='Special Instruction (Optional)'
            multiline={true}
            onChangeText={value => setSpecialInstruction(value)}
          />
        </View>
      </View>
      <TouchableOpacity
        style={styles.bookBtn}
        onPress={() => bookNow()}
      >
        <Text style={styles.btnTxt}>Book</Text>
      </TouchableOpacity>
      <Loader/>
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: UMColors.BGOrange,
    alignItems: 'center'
  },
  bodyContainer: {
    marginTop: 15,
    width: deviceWidth / 1.05,
    alignItems: 'center'
  },
  bookingDetailsContainer: {
    borderWidth: 1,
    width: '100%',
    borderColor: UMColors.primaryGray,
    alignItems: 'center'
  },
  detailsTxtContainer: {
    width: '93%',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  detailsTxt: {
    fontSize: 14,
    marginVertical: 2,
    color: UMColors.black,
  },
  signatureContainer: {
    marginTop: 10,
    borderWidth: 1,
    width: '100%',
    borderColor: UMColors.primaryGray,
    alignItems: 'center',
  }, 
  signatureSubContainer: {
    flexDirection: 'row',
    width: '93%',
    justifyContent: 'space-between',
    padding: 15
  },
  specialInputContainer: {
    width: deviceWidth,
    alignItems: 'center',
    height: '25%',
    marginTop: 20
  },
  specialTxtInput: {
    width: '95%',
    height: '100%',
    borderWidth: 1,
    borderColor: UMColors.primaryOrange,
    borderRadius: 7,
    textAlignVertical: 'top',
    backgroundColor: UMColors.white,
    paddingHorizontal: 15
  },
  bookBtn: {
    position: 'absolute',
    bottom: 40,
    backgroundColor: UMColors.primaryOrange,
    justifyContent: 'center',
    alignItems: 'center',
    width: deviceWidth / 1.2,
    borderRadius: 50,
    height: 50,
  },
  btnTxt: {
    fontSize: 17,
    fontWeight: 'bold',
    color: UMColors.white
  }
})