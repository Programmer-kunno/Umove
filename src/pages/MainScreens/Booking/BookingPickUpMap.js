import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView,
  Dimensions,
  Image,
  TouchableOpacity
} from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { UMColors } from '../../../utils/ColorHelper'
import CustomNavbar from '../../Components/CustomNavbar'
import MapView, { Marker } from 'react-native-maps'
import { PROVIDER_GOOGLE } from 'react-native-maps'
import { dispatch } from '../../../utils/redux'
import { setLoading } from '../../../redux/actions/Loader'
import { BookingApi } from '../../../api/booking'
import { showError } from '../../../redux/actions/ErrorModal'
import { useIsFocused } from '@react-navigation/native'
import { UMIcons } from '../../../utils/imageHelper'
import ErrorWithCloseButtonModal from '../../Components/ErrorWithCloseButtonModal'
import ErrorOkModal from '../../Components/ErrorOkModal'
import { Loader } from '../../Components/Loader'
import { navigate } from '../../../utils/navigationHelper'
import { TextSize, normalize } from '../../../utils/stringHelper'

const deviceWidth = Dimensions.get('screen').width
const deviceHeigth = Dimensions.get('screen').height

export default BookingPickUpMap = (props) => {
  const bookingData = props.route.params?.booking
  const MapRef = useRef(null)
  const [locationData, setLocationData] = useState(null)
  const [error, setError] = useState({ value: false, message: '' })

  useEffect(() => {
    if(bookingData?.pickupLatitude !== '' && bookingData?.pickupLongitude !== ''){
      setLocationData({ latitude: bookingData?.pickupLatitude, longitude: bookingData?.pickupLongitude })
    } else {
      getLocation()
    }
  }, [])

  const getLocation = async() => {
    const data = {
      'address': bookingData?.pickupStreetAddress,
      'region': bookingData?.pickupRegion,
      'province': bookingData?.pickupProvince,
      'city': bookingData?.pickupCity,
      'barangay': bookingData?.pickupBarangay,
      'zip_code': bookingData?.pickupZipcode
    }
    dispatch(setLoading(true))
    const response = await BookingApi.getAddressLocation(data)
    console.log(response?.data)
    if(response == undefined){
      dispatch(showError(true))
      dispatch(setLoading(false))
    } else {
      if(response?.data?.success){
        setLocationData(response?.data?.data)
        dispatch(setLoading(false))
      } else {
        setError({ value: true, message: response?.data?.message || response?.data })
        dispatch(setLoading(false))
      }
    }
  }

  const renderMap = () => {
    return (
      locationData &&
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            showsUserLocation={true}
            provider={PROVIDER_GOOGLE}
            ref={MapRef}
            initialRegion={{
              latitude: parseFloat(locationData.latitude),
              longitude: parseFloat(locationData.longitude),
              latitudeDelta: 0.014310590401560574,
              longitudeDelta: 0.009320341050639058
            }}
            onRegionChangeComplete={location => {
              setLocationData({ latitude: parseFloat(location.latitude).toFixed(4), longitude: parseFloat(location.longitude).toFixed(4) })
            }}
          >
          </MapView>
          <View style={styles.markerContainer}>
            <Text style={styles.markerTxt}>Move the map to edit location</Text>
            <Image
              style={styles.customMarker}
              source={UMIcons.locationIcon}
              resizeMode={'contain'}
            />
          </View>
          <Text style={styles.nextTipTxt}>
            Press next without editing the map to use the default pickup location
          </Text>
        </View>
    )
  }

  return (
    <SafeAreaView style={styles.mainContainer}>
      <ErrorWithCloseButtonModal/>
      <ErrorOkModal
        Visible={error.value}
        ErrMsg={error.message}
        OkButton={() => {
          setError({ value: false, message: '' })
        }}
      />
      <CustomNavbar
        Title={'Delivery Address'}
      />
      {renderMap()}
      <TouchableOpacity
        style={styles.nextBtn}
        onPress={() => {
          navigate('BookingDropOffScreen', { 
            booking: {
              ...bookingData,
              pickupLatitude: parseFloat(locationData.latitude).toFixed(4),
              pickupLongitude: parseFloat(locationData.longitude).toFixed(4)
            }
          })
        }}
      >
        <Text style={styles.btnTxt}>Next</Text>
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
  mapContainer: {
    marginTop: 10,
    width: deviceWidth / 1.10,
    height: deviceHeigth / 1.50,
    alignItems: 'center'
  },
  map: {
    height: '100%',
    width: '100%',
  },
  customMarker: { 
    height: 40,
    width: 30 
  },
  markerContainer: {
    position: 'absolute',
    top: '34%',
    left: '37%',
    alignItems: 'center',
    height: 50,
    width: 90,
  },
  markerTxt: {
    fontSize: normalize(TextSize('XS')),
    color: UMColors.white,
    backgroundColor: UMColors.darkerGray,
    borderRadius: 10,
    textAlign: 'center',
    width: '100%',
    padding: 10,
    marginBottom: 5
  },
  nextBtn: {
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
    fontSize: normalize(TextSize('M')),
    fontWeight: 'bold',
    color: UMColors.white
  },
  nextTipTxt: {
    marginTop: 5,
    fontSize: normalize(TextSize('S')),
    fontStyle: 'italic'
  }
})