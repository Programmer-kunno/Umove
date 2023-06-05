import { 
  View, 
  Text, 
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Animated,
  Image
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { UMIcons } from '../utils/imageHelper'
import { UMColors } from '../utils/ColorHelper'
import { useIsFocused } from '@react-navigation/native'
import { navigate } from '../utils/navigationHelper'

export default RateLoadingScreen = (props) => {
  const bookingNumber = props.route.params?.bookingNumber
  const fadeInAnimation = new Animated.Value(0)
  const isFocused = useIsFocused()

  useEffect(() => {
    if(isFocused){
      fadeIn()
      setTimeout(() => {
        navigate('DeliveredScreen', { bookingNumber: bookingNumber, isDoneRating: true })
      }, 3000)
    }
  }, [isFocused])

  const fadeIn = () => {
    Animated.timing(fadeInAnimation, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true
    }).start();
  }

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar translucent barStyle={'light-content'}/>
        <Animated.Text style={[styles.thankYouTxt, {opacity: fadeInAnimation}]}>Thank You!</Animated.Text>
        <Image
          style={{ width: 150, height: 150 }}
          source={UMIcons.openedBoxIcon}
          resizeMode='contain'
        />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: UMColors.black,
    justifyContent: 'center',
    alignItems: 'center'
  },
  thankYouTxt: {
    color: UMColors.white,
    fontSize: 27,
    marginBottom: 20
  }
})