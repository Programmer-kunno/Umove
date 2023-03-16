import { Text, View, StyleSheet, Image, TouchableOpacity, StatusBar } from 'react-native'
import React, { Component } from 'react'

import { UMColors } from '../../utils/ColorHelper';
import { UMIcons } from '../../utils/imageHelper';
import ErrorOkModal from '../Components/ErrorOkModal';
import { BookingApi } from '../../api/booking';
import { navigate } from '../../utils/navigationHelper';

export default class QuickQuotateScreen extends Component {
  constructor(props){
    super(props);

    this.state ={
      booking: this.props.route.params.booking,
      errorMsg: '',
      errorModalVisible: false
    }

  }

  async booking() {
    let booking = this.state.booking
    const data = {
      "vehicle_type": booking.vehicleType,
      "booking_routes":  [
        {
          "origin_address": booking.pickupStreetAddress,
          "origin_region": booking.pickupRegion,
          "origin_province": booking.pickupProvince,
          "origin_city": booking.pickupCity,
          "origin_barangay": booking.pickupBarangay,
          "origin_zip_code": booking.dropoffZipcode,
          "destination_address": booking.dropoffStreetAddress,
          "destination_region": booking.dropoffRegion,
          "destination_province": booking.dropoffProvince,
          "destination_city": booking.dropoffCity,
          "destination_barangay": booking.dropoffBarangay,
          "destination_zip_code": booking.pickupZipcode
        }
      ],
      "booking_items":  [
        {
          "subcategory": booking.productSubcategory,
          "uom": booking.packagingType,
          "length": booking.length,
          "width": booking.width,
          "height": booking.height,
          "weight": booking.weight,
          "quantity": booking.quantity
        }
      ]
    }

    const response = await BookingApi.quickQuotate(data)
    if(response.success){
      navigate('QuickQuotatePriceScreen', { price: response.data.price })
    } else {
      this.setState({ errorMsg: response.message, errorModalVisible: true })
    }
  }

  render() {
    return (
      
      <View style={styles.mainContainer}>
        <StatusBar translucent backgroundColor={'transparent'} barStyle={'dark-content'} />
        <ErrorOkModal
          Visible={this.state.errorModalVisible}
          ErrMsg={this.state.errorMsg}
          OkButton={() => {
            this.setState({ errorModalVisible: false })
          }}
        />
        <View style={styles.logoContainer}>
          <Image
            style={styles.logo}
            source={UMIcons.mainLogo}
            resizeMode={'contain'}
          />
        </View>
        <View style={styles.bodyContainer}>
          <Text style={styles.bodyTxt}>
            Note: Here's the Booking Details 
            based on the cargo details, pickup 
            & delivery address provided. If you 
            want greater value we offer shared 
            ride options than can provide 
            cheaper delivery rate by sharing the 
            delivery space and cost on the same 
            destination.
          </Text>
        </View>
        <View style={styles.btnContainer}>
          <TouchableOpacity
            style={styles.quickQouteBtn}
            onPress={() => {
              this.booking()
            }}
          >
            <Image
              style={styles.quickQuoteImg}
              source={UMIcons.quickQuotateIcon}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: UMColors.BGOrange,
    alignItems: 'center'
  },
  logoContainer: {
    height: '20%',
    width: '90%',
    marginTop: '20%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  logo: {
    width: '70%'
  },
  bodyContainer: {
    height: '30%',
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  bodyTxt: {
    width: '80%',
    fontSize: 18,
    textAlign: 'justify'
  },
  btnContainer: {
    height: '25%',
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickQouteBtn: {
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickQuoteImg: {
    width: '100%',
  }
})
