import React, { useState } from 'react'
import {
  View,
  ImageBackground,
  StatusBar,
  StyleSheet
} from 'react-native'
import { CalendarView } from '../../Components/CalendarView'
import { Bookings } from './CalendarBookings/Bookings'
import { UMIcons } from '../../../utils/imageHelper'

export default Calendar = () => {
  const [selectedDate, setSelectedDate] = useState(undefined);
  
  const onChangeDate = (date) => {
    setSelectedDate(date);
  }

  return (
    <View style={styles.container}>
      <TopDashboardNavbar/>
      <StatusBar translucent barStyle={'dark-content'}/>
      <ImageBackground 
        source={UMIcons.bgImage} 
        resizeMode='cover' 
        style={styles.image}
      >
        <CalendarView 
          onPressCalendarDate={onChangeDate}
        />
        <Bookings 
          selectedDate={selectedDate}
        />
      </ImageBackground>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'center',
    backgroundColor: 'rgb(238, 241, 217)', 
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
})