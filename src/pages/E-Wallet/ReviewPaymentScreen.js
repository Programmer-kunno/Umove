import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  Dimensions,
  Image,
  TouchableOpacity
} from 'react-native'
import React from 'react'
import { UMColors } from '../../utils/ColorHelper'
import CustomNavbar from '../Components/CustomNavbar'
import { capitalizeFirst, moneyFormat } from '../../utils/stringHelper'
import { UMIcons } from '../../utils/imageHelper'
import { navigate } from '../../utils/navigationHelper'

const deviceWidth = Dimensions.get('screen').width

export default ReviewPaymentScreen = (props) => {
  const price = parseFloat(props.route.params?.price)
  const selectedPaymentMethod = props.route.params?.selectedPaymentMethod

  return (
    <SafeAreaView style={styles.mainContainer}>
      <CustomNavbar
        Title={'Review'}
      />
      <View style={styles.bodyContainer}>
        <Text style={[styles.standardFont, { marginTop: 50 }]}>You are about to pay</Text>
        <Text style={styles.priceTxt}>{'Php ' + moneyFormat(price)}</Text>
        <Text style={styles.standardFont}>Via</Text>
        <View style={styles.cardContainer}>
          <Image
            style={styles.cardIcon}
            source={selectedPaymentMethod.cardType == 'visa' ? UMIcons.visaLogo : selectedPaymentMethod.cardType == 'master-card' ? UMIcons.masterCardLogo : UMIcons.creditCardLogo}
            resizeMode={'contain'}
          />
          <Text style={styles.cardName}>{capitalizeFirst(selectedPaymentMethod.cardType.replace('-', ''))}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.confirmBtn}
        onPress={() => navigate('ConfirmationPaymentScreen', { selectedPaymentMethod: selectedPaymentMethod, price: price })}
      >
        <Text style={styles.confirmBtnTxt}>Confirm</Text>
      </TouchableOpacity>
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
    height: '100%',
    width: deviceWidth,
    alignItems: 'center',
    borderWidth: 2
  },
  standardFont: {
    fontSize: 17,
    color: UMColors.black,
    marginVertical: 30
  },
  priceTxt: {
    color: UMColors.primaryOrange,
    fontSize: 35,
    fontWeight: 'bold'
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardIcon: {
    width: 45,
    height: 32
  },
  cardName: {
    fontSize: 18,
    color: UMColors.black,
    fontWeight: 'bold',
    marginLeft: 5
  },
  confirmBtn: {
    position: 'absolute',
    bottom: 50,
    width: deviceWidth / 1.20,
    height: 50,
    backgroundColor: UMColors.primaryOrange,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 7
  },
  confirmBtnTxt: {
    fontSize: 18,
    fontWeight: 'bold',
    color: UMColors.white
  }
})
