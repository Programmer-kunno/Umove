import React from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { UMColors } from '../../utils/ColorHelper';
import { UMIcons } from '../../utils/imageHelper';
import { navigate } from '../../utils/navigationHelper';

const BookingCard = (props) => {
  const { data, index, length } = props;
  
  const bookingRoutes = data?.booking_routes[0] || {};

  return (
    <View style={[styles.container, index === 0 && { marginTop: 30 }, index === length - 1 && { marginBottom: 30}]}>
      <View style={styles.cardButton}>
        <View style={styles.firstColumn}>
          <Text style={styles.typeText}>{data.booking_type} Booking</Text>
          <Text style={styles.subTypeText}>Scheduled</Text>
          <Text style={styles.destinationText}>{bookingRoutes?.destination_barangay}, {bookingRoutes?.destination_city}</Text>
        </View>
        <View style={styles.secondColumn}>
          <TouchableOpacity onPress={() => navigate('ExclusiveBooking7', { booking: data })} style={styles.trackButton}>
            <Text style={{fontSize: 13, color: UMColors.white}}>Track</Text>
            <Image 
              source={UMIcons.track}
              style={{height: 15, width: 15, marginLeft: 4}}
            />
          </TouchableOpacity>
        </View>
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
    }
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
    height: '100%', 
    justifyContent: 'center'
  },
  trackButton: {
    paddingHorizontal: 30, 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 5, 
    backgroundColor: UMColors.primaryOrange, 
    borderRadius: 5,
    shadowColor: UMColors.black,
    shadowOpacity: 0.1,
    shadowOffset: {
      width: 0,
      height: 4
    }
  }
})