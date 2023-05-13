import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  Dimensions,
  Image,
  TouchableOpacity
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { UMColors } from '../../utils/ColorHelper'
import CustomNavbar from '../Components/CustomNavbar'
import { capitalizeFirst, moneyFormat } from '../../utils/stringHelper'
import { UMIcons } from '../../utils/imageHelper'
import { navigate, resetNavigation } from '../../utils/navigationHelper'
import { useIsFocused } from '@react-navigation/native'
import ErrorWithCloseButtonModal from '../Components/ErrorWithCloseButtonModal'
import ErrorOkModal from '../Components/ErrorOkModal'
import { Loader } from '../Components/Loader'

const deviceWidth = Dimensions.get('screen').width

export default CreditReceiptScreen = (props) => {
  const data = props.route.params?.data
  const price = props.route.params?.price
  const transactionFee = props.route.params?.transactionFee
  const selectedPaymentMethod = props.route.params?.selectedPaymentMethod
  const isFocused = useIsFocused()
  const [total, setTotal] = useState(0)
  const [error, setError] = useState({ value: false, message: '' })

  useEffect(() => {
    if(isFocused){
      console.log(data)
      const totalPrice = price + transactionFee
      setTotal(totalPrice)
    }
  }, [])


  return (
    <SafeAreaView style={styles.mainContainer}>
      <CustomNavbar
        Title={'Receipt'}
      />
      <View style={styles.bodyContainer}>
        <Image
          style={{ marginTop: 25, width: 150, height: 50 }}
          source={UMIcons.mainLogo}
          resizeMode='contain'
        />
        <View style={styles.referenceNumberContainer}>
          <Text style={styles.referenceNoTxt}>{data.request_reference_number}</Text>
          <Text style={styles.referenceNoTitle}>Reference No.</Text>
        </View>
        <View style={styles.computationContainer}>
          <View style={styles.computationSubContainer}>
            <Text style={styles.computationTxt}>Amount</Text>
            <Text style={styles.computationTxt}>{'₱ ' + moneyFormat(price)}</Text>
          </View>
          <View style={styles.computationSubContainer}>
            <Text style={styles.computationTxt}>Transaction Fee</Text>
            <Text style={styles.computationTxt}>{'₱ ' + moneyFormat(transactionFee)}</Text>
          </View>
          <View style={{ borderTopWidth: 1, borderTopColor: UMColors.black, marginVertical: 10 }}/>
          <View style={styles.computationSubContainer}>
            <Text style={styles.computationTxt}>Total</Text>
            <Text style={styles.computationTxt}>{'₱ ' + moneyFormat(total)}</Text>
          </View>
        </View>
        <View style={styles.cardContainer}>
          <Text style={[styles.standardFont, { marginRight: 10 }]}>Paid Via</Text>
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
        onPress={() => resetNavigation('DrawerNavigation')}
      >
        <Text style={styles.confirmBtnTxt}>Done</Text>
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
  referenceNumberContainer: {
    alignItems: 'center',
    marginTop: 20
  },
  referenceNoTxt: {
    color: UMColors.primaryOrange,
    fontWeight: 'bold',
    fontSize: 18
  },
  referenceNoTitle: { 
    fontSize: 15,
    color: UMColors.black,
    marginTop: 5
  },
  computationContainer: {
    width: '80%',
    marginTop: '10%'
  },
  computationSubContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10
  },
  computationTxt: {
    fontSize: 17,
    marginHorizontal: 6,
    color: UMColors.black
  },
  standardFont: {
    fontSize: 15,
    color: UMColors.black,
  },
  priceTxt: {
    color: UMColors.primaryOrange,
    fontSize: 35,
    fontWeight: 'bold'
  },
  cardContainer: {
    marginTop: '10%',
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