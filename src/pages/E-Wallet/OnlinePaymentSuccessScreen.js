import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView,
  StatusBar,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { UMColors } from '../../utils/ColorHelper'
import { useIsFocused } from '@react-navigation/native'
import { UMIcons } from '../../utils/imageHelper'
import { navigate, resetNavigation } from '../../utils/navigationHelper'
import { TextSize, normalize } from '../../utils/stringHelper'

const deviceWidth = Dimensions.get('screen').width
const deviceHeight = Dimensions.get('screen').height

export default OnlinePaymentSuccessScreen = (props) => {
  const data = props.route.params?.data
  const price = props.route.params?.price
  const transactionFee = props.route.params?.transactionFee
  const selectedPaymentMethod = props.route.params?.selectedPaymentMethod
  const [isLoading, setIsLoading] = useState(true)
  const isFocused = useIsFocused()

  useEffect(() => {
    if(isFocused){
      console.log(props.route.params)
      setTimeout(() => {
        setIsLoading(false)
      }, 2000);
    }
  }, [isFocused])

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar translucent backgroundColor={'transparent'} barStyle={'dark-content'} />
        <View style={styles.bodyContainer}>
          <Image
            source={UMIcons.mainLogo}
            style={styles.mainLogo}
            resizeMode='contain'
          />
          { isLoading ?
            <View style={styles.alignItemCenter}>
              <ActivityIndicator size="large" color={UMColors.primaryOrange}/>
              <View style={styles.textContainer1}>
                <Text style={styles.text}>Please wait while we process your payment.</Text>
              </View>
            </View>
            :
            <View style={styles.alignItemCenter}>
                <Image source={UMIcons.greenCheck} style={styles.greenCheck}/>
                <View style={styles.textContainer2}>
                  <Text style={styles.text}>Transaction Successfully Completed!</Text>
                </View>
            </View>
          }
          {/* Book Button */}
          {
            !isLoading &&
              <TouchableOpacity style={styles.bookButtonOrange} onPress={() => {
                navigate('CreditReceiptScreen', { data: data, price: price, transactionFee: transactionFee, selectedPaymentMethod: selectedPaymentMethod})
              }}>
                <Text style={styles.buttonText}>Continue</Text>
              </TouchableOpacity>
          }
        </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: UMColors.BGOrange,
    alignItems: 'center'
  },
  bodyContainer: {
    width: deviceWidth,
    height: '100%',
    borderWidth: 1,
    alignItems: 'center'
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    flex: 1,
  },
  alignItemCenter: {
    alignItems: 'center',
  },
  mainLogo: {
    height: 75,
    width: '80%',
    marginTop: '40%',
    marginBottom: '20%',
  },
  textContainer1: {
    marginTop: '15%',
  },
  textContainer2: {
    marginTop: '10%',
    width: '90%'
  },
  text: {
    textAlign: 'center',
    color: 'black',
    fontSize: normalize(TextSize('M'))
  },
  greenCheck: {
    height: 65,
    width: 65,
  },
  bookButtonOrange: {
    position: 'absolute',
    bottom: 45,
    height: 50,
    width: deviceWidth / 1.20,
    borderRadius: 25,
    justifyContent:'center',
    alignItems: 'center',
    backgroundColor: 'rgb(223,131,68)',
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 6},
    shadowOpacity: 0.9,
    shadowRadius: 3,
    elevation: 7
  },
  buttonText: {
    color: 'white',
    fontSize: normalize(TextSize('M')),
    fontWeight:'bold',
  },
})