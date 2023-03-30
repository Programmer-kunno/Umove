import { 
  StyleSheet, 
  StatusBar, 
  View, 
  Image, 
  Text, 
  ActivityIndicator, 
  TouchableOpacity, 
  Alert 
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { UMIcons } from '../../../utils/imageHelper';
import { UMColors } from '../../../utils/ColorHelper';
import { resetNavigation } from '../../../utils/navigationHelper';

export default PaymentLoadingScreen = (props) => {
  const { selectedPaymentMethod, bookingNumber, data, booking } = props.route.params;
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false)
    }, 1000);
  }, [])

  return(
    <View style={styles.mainContainer}>
      <View style={styles.mainLogoContainer}>
        <Image
          style={styles.logo}
          source={UMIcons.mainLogo}
          resizeMode={'contain'}
        />
      </View>
      <View style={styles.bodyContainer}>
        {
          isLoading ?
            <ActivityIndicator size="large" color="rgb(223,131,68)"/>
          :
            <Image
              style={styles.greenCheck}
              source={UMIcons.greenCheck}
              resizeMode={'contain'}
            />
        }
        {
          isLoading ?
            <Text style={styles.statusTxt}>Processing</Text>
          :
            <Text style={styles.statusTxt}>Transaction Processed{'\n'}Successfully!</Text>
        }
      </View>
      <View style={styles.btnContainer}>
        {
          !isLoading &&
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => {
              resetNavigation('SuccessPaymentScreen', { selectedPaymentMethod: selectedPaymentMethod, data: data,  bookingNumber: bookingNumber, booking: booking})
            }}
          >
            <Text style={styles.backBtnTxt}>Proceed</Text>
          </TouchableOpacity>
        }

      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1, 
    backgroundColor: UMColors.BGOrange,
    alignItems: 'center'
  },
  mainLogoContainer: {
    height: '20%',
    width: '90%',
    marginTop: '20%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  logo: {
    width: '80%'
  },
  bodyContainer: {
    marginTop: '10%',
    width: '90%',
    height: '25%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  greenCheck: {
    width: '20%',
  },
  statusTxt: {
    fontSize: 19,
    textAlign: 'center',
    marginTop: '10%',
    fontWeight: '400'
  },
  btnContainer: {
    width: '90%',
    height: '15%',
    marginTop: '45%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  backBtn: {
    backgroundColor: UMColors.primaryOrange,
    width: '100%',
    height: '40%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50
  },
  backBtnTxt: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white'
  }
})
