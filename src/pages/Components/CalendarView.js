import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native'
import { Calendar, LocaleConfig } from 'react-native-calendars'
import { UMColors } from '../../utils/ColorHelper';
import { TextSize, normalize } from '../../utils/stringHelper';

LocaleConfig.locales[LocaleConfig.defaultLocale].dayNamesShort = ['S','M','T','W','T','F','S'];

const deviceWidth = Dimensions.get('screen').width

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
        <View style={[styles.textDayContainer, selected && { backgroundColor: isDisabled ? UMColors.primaryGray : UMColors.white, borderRadius: 7 }]}>
          <Text style={[styles.textDay, { color: selected ? isDisabled ? UMColors.white : UMColors.primaryOrange : UMColors.primaryGray }]}>
            {props.children}
          </Text>
        </View>
      )
    } else {
      return (
        <TouchableOpacity onPress={() => onPressDate(props.date.dateString)} style={[styles.textDayContainer, selected && { backgroundColor: UMColors.white, borderRadius: 7 }]}>
          <Text style={[styles.textDay, { color: selected ?UMColors.primaryOrange : UMColors.white }, isWeekends && { color:UMColors.primaryOrange }]}>
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
              fontSize: normalize(TextSize('Normal')),
              fontWeight: '700',
              color: UMColors.white,
            },
            dayHeader: {
              marginVertical: 10,
              fontSize: normalize(TextSize('S')),
              fontWeight: '700',
              color: UMColors.primaryOrange,
            },
            arrowImage: {
              tintColor: UMColors.primaryOrange
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
    marginVertical: 5, 
    borderRadius: 20, 
    paddingHorizontal: 30, 
    paddingVertical: 10,
    width: deviceWidth / 1.05,
    alignSelf: 'center'
  },
  textDayContainer: {
    width: 25, 
    height: 25, 
    alignItems: 'center',
    justifyContent: 'center'
  },
  textDay: {
    fontWeight: '700'
  }
})