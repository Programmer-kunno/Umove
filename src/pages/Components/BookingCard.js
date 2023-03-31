import React from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { UMColors } from '../../utils/ColorHelper';
import { UMIcons } from '../../utils/imageHelper';
import { navigate } from '../../utils/navigationHelper';
import { moneyFormat } from '../../utils/stringHelper';

const BookingCard = (props) => {
  const { data, index, length, type, keyProp } = props;

  const bookingRoutes = data?.booking_routes[0] || {};

  const returnSecondColumn = () => {
    return (
      <View key={keyProp} style={[styles.secondColumn, type === "ongoing" && { justifyContent: 'center' }]}>
        {
          type === "ongoing" &&
            <TouchableOpacity onPress={() => navigate('ExclusiveBooking7', { booking: data })} style={styles.trackButton}>
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
                <Text>₱   {moneyFormat(data.total_price)}</Text>
                <Image 
                  source={UMIcons.save}
                  style={styles.saveIcon}
                />
              </View>

              <TouchableOpacity style={styles.trackButton}>
                <Text style={styles.buttonText}>Rebook</Text>
              </TouchableOpacity>
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
    height: '100%'
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