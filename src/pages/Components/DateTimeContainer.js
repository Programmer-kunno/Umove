import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { TextSize, make12HoursFormat, normalize, returnDate } from '../../utils/stringHelper'
import { UMColors } from '../../utils/ColorHelper'

export const DateTimeContainer = ({ data }) => {
  
  const splittedTime = data.pickup_time.split(' ')
  const splittedTimeHourMins = splittedTime[1].split(':')
  const reArragedTime = splittedTimeHourMins[0] + ':' + splittedTimeHourMins[1]

  return (
    <View style={styles.container}>
      <Text style={styles.timeText}>{make12HoursFormat(reArragedTime)}</Text>
      <Text style={styles.dateText}>{data.booking_type}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: .9,
    alignItems: 'center',
    justifyContent: 'center'
  },
  timeText: {
    color: UMColors.primaryOrange,
    fontSize: normalize(TextSize('L')),
    fontWeight: '700',
    marginBottom: 5
  },
  dateText: {
    fontSize: normalize(TextSize('M')),
    fontWeight: '700'
  }
})