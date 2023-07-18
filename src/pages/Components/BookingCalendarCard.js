import React from 'react'
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native'
import { DateTimeContainer } from './DateTimeContainer'
import { RouteDetails } from './RouteDetails'
import { UMColors } from '../../utils/ColorHelper'
import { TextSize, normalize } from '../../utils/stringHelper'

export const OneBookingCard = ({ length, data, index, onPress, disabled }) => {
  const isCancelled = data.status === 'Cancelled';

  const checkCancelStatus = () => {
    if(isCancelled) {
      return <View style={styles.cancelledContainer}>
        <Text style={styles.cancelledText}>Cancelled</Text>
      </View>
    }

    return <DateTimeContainer data={data} />
  }

  return (
    <TouchableOpacity onPress={onPress} disabled={disabled || isCancelled} activeOpacity={.8}>
      <View style={styles.container(index, length)}>
        <View style={styles.firstRow}>
          <RouteDetails data={data} />
          {checkCancelStatus()}
        </View>

        <View style={styles.secondRow}>
          <Text style={styles.bookingNumberText}>{'Booking No. ' + data.booking_number}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export const MultipleBookingCard = ({ length, data, index, onPress, disabled }) => {
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled} activeOpacity={.8}>
      <View style={[styles.container(index, length), { paddingHorizontal: 20 }]}>
        <Text style={styles.sharedHeaderText}>Shared</Text>
        <View style={styles.bookingIDContainer}>
          <View style={styles.firstColumn}>
            <Text style={styles.bookingNumberPlaceHolder}>Booking No.</Text>
            {data.bookings.map(booking => (
              <Text style={styles.sharedBookingNumberText}>{booking.booking_number}</Text>
            ))}
          </View>
          <View style={styles.secondColumn}></View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: (index, length) => {
    return {
      padding: 10,
      flex: 1,
      borderRadius: 15,
      marginTop: index === 0 ? 20 : 0,
      marginBottom: index === length - 1 ? 20 : 5,
      backgroundColor: UMColors.BGOrange
    }
  },
  bookingNumberPlaceHolder: {
    fontSize: normalize(TextSize('Normal')), 
    marginVertical: 3 
  },
  sharedBookingNumberText: {
    fontSize: normalize(TextSize('Normal')), 
    marginVertical: 3, 
    fontWeight: 'bold', 
    color: UMColors.primaryOrange
  },
  sharedHeaderText: {
    alignSelf: 'center', 
    fontSize: normalize(TextSize('L')), 
    fontWeight: 'bold'
  },
  firstColumn: {
    flex: 1
  },
  secondColumn: {
    flex: 1
  },
  bookingIDContainer: {
    flexDirection: 'row'
  },
  firstRow: {
    flex: 1,
    flexDirection: 'row'
  },
  secondRow: {
    flex: 1,
    marginTop: 10,
    alignItems: 'center'
  },
  bookingNumberText: {
    color: UMColors.primaryOrange,
    fontSize: normalize(TextSize('S'))
  },
  cancelledContainer: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  cancelledText: {
    fontSize: normalize(TextSize('M')), 
    fontWeight: 'bold', 
    color: UMColors.primaryOrange 
  }
})