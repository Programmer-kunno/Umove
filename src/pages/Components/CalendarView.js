import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Calendar, LocaleConfig } from 'react-native-calendars'
import { orangeColor } from '../constants'

LocaleConfig.locales[LocaleConfig.defaultLocale].dayNamesShort = ['S','M','T','W','T','F','S'];

export const CalendarView = ({onPressCalendarDate}) => {
  const [selectedDate, setSelectedDate] = useState(undefined);


  const onPressDate = (date) => {
    onPressCalendarDate?.(date);
    setSelectedDate(date);
  }

  const renderDay = props => {
    const selected = selectedDate === props.date.dateString;
    const splitAccessibilityLabel = props.accessibilityLabel.split(" ");
    const dayName = splitAccessibilityLabel[1];
    const isWeekends = dayName.match(/Sunday|Saturday/);
    const isDisabled = props?.state === 'disabled';

    if(isDisabled) {
      return (
        <View style={[styles.textDayContainer, selected && { backgroundColor: isDisabled ? 'gray' : 'white', borderRadius: 7 }]}>
          <Text style={[styles.textDay, { color: selected ? isDisabled ? 'white' : orangeColor : 'gray' }]}>
            {props.children}
          </Text>
        </View>
      )
    } else {
      return (
        <TouchableOpacity onPress={() => onPressDate(props.date.dateString)} style={[styles.textDayContainer, selected && { backgroundColor: 'white', borderRadius: 7 }]}>
          <Text style={[styles.textDay, { color: selected ? orangeColor : 'white' }, isWeekends && { color: orangeColor }]}>
            {props.children}
          </Text>
        </TouchableOpacity>
      )
    }
  }

  return (
    <View style={styles.container}>
      <Calendar
        style={{ backgroundColor: 'transparent' }}
        dayComponent={renderDay}
        theme={{
          'stylesheet.calendar.header': {
            monthText: {
              fontSize: 16,
              fontWeight: '700',
              color: 'white',
            },
            dayHeader: {
              marginVertical: 15,
              fontSize: 13,
              fontWeight: '700',
              color: orangeColor,
            },
            arrowImage: {
              tintColor: 'white'
            }
          },
          'stylesheet.calendar.main': {
            monthView: {
              backgroundColor: 'transparent',
            }
          },
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0,0,0,.5)', 
    marginHorizontal: 5, 
    marginVertical: 10, 
    borderRadius: 20, 
    paddingHorizontal: 30, 
    paddingVertical: 20
  },
  textDayContainer: {
    width: 35, 
    height: 30, 
    alignItems: 'center',
    justifyContent: 'center'
  },
  textDay: {
    fontWeight: '700'
  }
})