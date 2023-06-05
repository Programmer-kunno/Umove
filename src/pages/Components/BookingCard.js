import React from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { BookingApi } from '../../api/booking';
import { refreshTokenHelper } from '../../api/helper/userHelper';
import { showError } from '../../redux/actions/ErrorModal';
import { setLoading } from '../../redux/actions/Loader';
import { UMColors } from '../../utils/ColorHelper';
import { UMIcons } from '../../utils/imageHelper';
import { navigate } from '../../utils/navigationHelper';
import { dispatch } from '../../utils/redux';
import { moneyFormat } from '../../utils/stringHelper';
import { Loader } from './Loader';
import BookingItemScreen from '../MainScreens/Booking/BookingItemScreen';

const BookingCard = (props) => {
  const { data, index, length, type, keyProp } = props;
  const bookingRoutes = data?.booking_routes[0] || {};
  const rebookData = {
    bookingType: data?.booking_type,
    vehicleType: data?.vehicle_type.id,
    pickupName: bookingRoutes.shipper,
    pickupStreetAddress: bookingRoutes.origin_address,
    pickupRegion: bookingRoutes.origin_region,
    pickupProvince: bookingRoutes.origin_province,
    pickupCity: bookingRoutes.origin_city,
    pickupBarangay: bookingRoutes.origin_barangay,
    pickupZipcode: bookingRoutes.origin_zip_code,
    dropoffName: bookingRoutes.receiver,
    dropoffStreetAddress: bookingRoutes.destination_address,
    dropoffRegion: bookingRoutes.destination_region,
    dropoffProvince: bookingRoutes.destination_province,
    dropoffCity: bookingRoutes.destination_city,
    dropoffBarangay: bookingRoutes.destination_barangay,
    dropoffZipcode: bookingRoutes.destination_zip_code,
  }

  const getBookingItems = () => {
    dispatch(setLoading(true))
    refreshTokenHelper(async() => {
      const response = await BookingApi.getBooking(data)
      if(response == undefined){
        dispatch(showError(true))
        dispatch(setLoading(false))
      } else {
        if(response?.data?.success) {
          if(type === "ongoing"){
            navigate('BookingAndDriverDescription', { booking: response?.data?.data })
          } else {

          } 
          dispatch(setLoading(false))
        } else {

        }
      }
    })
  }

  const returnSecondColumn = () => {
    return (
      <View key={keyProp} style={[styles.secondColumn, type === "ongoing" && { justifyContent: 'center' }]}>
        {
          type === "ongoing" &&
            <TouchableOpacity onPress={getBookingItems} style={styles.trackButton}>
              <Text style={styles.buttonText}>Track</Text>
              <Image 
                source={UMIcons.track}
                style={styles.trackIcon}
              />
            </TouchableOpacity>
        }
        {
          type === "past" &&
            <View style={styles.pastButtonContainer}>
              <View style={styles.pastButtonFirstRow}>
                <TouchableOpacity style={styles.trackButton} onPress={() => {
                  navigate('BookingItemScreen', { rebookData: rebookData, isRebook: true })}}>
                  <Text style={styles.buttonText}>Book</Text>
                </TouchableOpacity>
                {/* <Text>₱   {moneyFormat(data.total_price)}</Text> */}
                {/* <Image 
                  source={UMIcons.save}
                  style={styles.saveIcon}
                /> */}
              </View>
            {/*                 
              <TouchableOpacity style={styles.saveButton} onPress={() => {
                navigate('BookingItemScreen', { rebookData: rebookData, isRebook: true })}}>
                <Text style={[styles.buttonText, {color: UMColors.primaryOrange}]}>Save</Text>
              </TouchableOpacity> */}
            </View>
        }
      </View>
    )
  }

  return (
    <View style={[styles.container, index === 0 && { marginTop: 30 }, index === length - 1 && { marginBottom: 30}]}>
      <View style={styles.cardButton}>
        <View style={styles.firstColumn}>
          <Text style={styles.typeText}>{data.booking_number}</Text>
          <Text style={styles.subTypeText}>{data.booking_type} Booking</Text>
          <Text style={styles.destinationText}>{bookingRoutes?.destination_barangay}, {bookingRoutes?.destination_city}</Text>
        </View>
        {returnSecondColumn()}
      </View>
    </View>
  )
}

export default BookingCard

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  cardButton: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: UMColors.darkerBgOrange,
    shadowColor: UMColors.black,
    shadowOpacity: 0.1,
    shadowOffset: {
      width: 0,
      height: 4
    },
    elevation: 7
  },
  firstColumn: {
    flex: 1
  },
  typeText: {
    fontSize: 15, 
    fontWeight: 500
  },
  subTypeText: {
    fontSize: 12, 
    color: UMColors.primaryOrange,
    marginTop: 5, 
    marginBottom: 10, 
    fontWeight: 500
  },
  destinationText: {
    fontSize: 12, 
    fontWeight: 500
  },
  secondColumn: {
    height: '100%'
  },
  trackButton: {
    paddingHorizontal: 30, 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 5, 
    backgroundColor: UMColors.primaryOrange, 
    borderRadius: 50,
    shadowColor: UMColors.black,
    shadowOpacity: 0.1,
    shadowOffset: {
      width: 0,
      height: 4
    },
    elevation: 7
  },
  saveButton: {
    paddingHorizontal: 30, 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 5, 
    borderRadius: 50,
  },
  pastButtonContainer: {
    justifyContent: 'space-between', 
    height: '100%'
  },
  pastButtonFirstRow: {
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between'
  },
  saveIcon: {
    height: 18, 
    width: 18
  },
  buttonText: {
    fontSize: 13, 
    color: UMColors.white
  },
  trackIcon: {
    height: 15, 
    width: 15, 
    marginLeft: 4
  }
})