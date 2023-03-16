import React, { Component }  from 'react';
import { StyleSheet, StatusBar, View, Text, TouchableOpacity, Image } from 'react-native';
import RadioButtonGroup, { RadioButtonItem } from "expo-radio-button";
import GrayNavbar from '../../../Components/GrayNavbar';
import { connect } from 'react-redux';
import { navigate } from '../../../../utils/navigationHelper';

import { UMColors } from '../../../../utils/ColorHelper';

export class CorpExclusive4 extends Component {  
  constructor(props) {
    super(props);
    
    this.state = { 
      booking: this.props.route.params.booking,
      computeRates: {},
      distance: ''
    };
  }

  async componentDidMount() {
    this.init();
    // this.computeRates();
    }

  async init() {
    let bookingOverall = this.props.bookingData
    console.log(bookingOverall)
    this.setState({ distance: bookingOverall.booking_routes[0].distance / 1000 })
  }

  render() {
    let booking = this.state.booking;
    let pickupAddress = booking.pickupStreetAddress + ', ' + booking.pickupBarangay + ', ' + booking.pickupCity + ', ' + booking.pickupProvince;
    let dropoffAddress = booking.dropoffStreetAddress + ', ' + booking.dropoffBarangay + ', ' + booking.dropoffCity + ', ' + booking.dropoffProvince;

    return(
      <View style={styles.container}>
        <StatusBar translucent backgroundColor={'transparent'} barStyle={'light-content'} />

        {/* Header for Booking Summary */}
        <GrayNavbar
          Title={'Booking Summary'}
          onBack={() => {
            navigate('CorpExclusive3')
          }}
        />

        {/* Booking Summary Content */}
        <View style={styles.innerContent}>

          {/* Payment */}
          {/* <View style={styles.contentContainer1}>
            <View style={[styles.alignItemCenter, styles.part1Padding]}>
              <Text style={styles.priceText}> The fare for this booking: </Text>
            </View>
            <View style={[styles.alignItemCenter, styles.part1Padding]}>
              <Text style={styles.priceText}> ₱ {" " + computeRates.total_price} </Text>
            </View>
          </View> */}

          {/* Part 1 */}
          <View style={styles.contentContainer2}>
            <View style={[styles.row, styles.alignItemCenter, styles.justifyContentSpaceBetween, styles.part1Padding]}>
              <View style={[styles.row, styles.alignItemCenter]}>
                <Image
                      source={require('../../../../assets/vehicles/exclusive_nobg.png')}
                      style={styles.bookingVehicle}
                />
              </View>
              <View>
                <Text style={styles.contentText}> {booking.bookingType} </Text>
              </View>
            </View>
            <View style={[styles.row, styles.alignItemCenter, styles.justifyContentSpaceBetween, styles.part1Padding]}>
              <View style={[styles.row, styles.alignItemCenter]}>
                <Text style={styles.contentText}>Pick Up:</Text>
              </View>
              <View>
                <Text style={styles.contentText}>{booking.pickupTime} - {booking.pickupDate}</Text>
              </View>
            </View>
            <View style={[styles.row, styles.alignItemCenter, styles.justifyContentSpaceBetween]}>
              <View style={[styles.row, styles.alignItemCenter]}>
                <Text style={styles.contentText}>Distance:</Text>
              </View>
              <View>
                <Text style={styles.contentText}>{this.state.distance} km</Text>
              </View>
            </View>
          </View>
          
          {/* Part 2 */}
          <View style={styles.contentContainer2}>
            <View style={[styles.row, styles.alignItemCenter, styles.justifyContentSpaceBetween, styles.borderPart2]}>
              <View>
                <Text style={styles.contentText}> Require Signatures</Text>
                <Text style={styles.contentSubText}> Applies to all locations</Text>
              </View>
              <RadioButtonGroup
                selected={booking.signature}
                onSelected={(value) => {
                  booking.signature = value;
                  this.setState({booking})
                }}
                radioBackground="green"
              >
                <RadioButtonItem value="true" label={""}/>
              </RadioButtonGroup>
            </View>
            <RadioButtonGroup
              containerStyle={{ margin: 10 }}
              selected={booking.paymentAddress}
              onSelected={(value) => {
                booking.paymentAddress = value;
                this.setState({booking})
              }}
              radioBackground="green"
            >
              <Text style={styles.contextAddressText}> {pickupAddress} </Text>
              <RadioButtonItem 
                style={{marginBottom: 40, marginTop: 10}}
                value="pickup" 
                label={
                  <Text style={styles.contextPaymentText1}>Responsible For Payment</Text>
                }
              />
              <Text style={styles.contentText}> {dropoffAddress} </Text>
              <RadioButtonItem
                style={{marginTop: 10}}
                value="dropoff"
                label={
                  <Text style={styles.contextPaymentText2}>Responsible For Payment</Text>
                }
              />
            </RadioButtonGroup>
          </View>
        </View>

        <View style={styles.alignItemCenter}>
          {/* Book Button */}
          <TouchableOpacity style={styles.bookButtonOrange} onPress={() => {
            navigate('CorpExclusive5')
          }}>
            <Text style={styles.buttonText}> BOOK </Text>
          </TouchableOpacity>
        </View>
            
      </View>
    )
  }
}

export default connect(
  state => {
    return {
      bookingData: state.bookingDetails.booking
    };
  },
)(CorpExclusive4);


const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: 'rgb(238, 241, 217)',
  },
  header: {
    width: '100%',
    paddingTop: '10%',
    backgroundColor: 'rgb(29, 32, 39)', 
    shadowColor: '#171717',
    shadowOffset: {height: 5},
    shadowOpacity: 0.3,
    alignItems: 'center',
    zIndex: 1
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    marginTop: '5%',
    marginBottom: '5%',
  },
  arrowContainer: {
    marginLeft: '3%',
    marginRight: '24%'
  },
  headerArrow: {
    width: 12,
    height: 20,
  },
  labelContainer: {
    marginTop: '7%',
    marginBottom: '3%',
    marginLeft: '6%'
  },
  priceText: {
    color: 'white',
    fontSize: 20,
    marginTop: '5%',
  },
  labelText: {
    color: 'white',
    fontSize: 15
  },
  innerContent: {
    //
  },
  bookingVehicle: {
    height: 60,
    width: 60,
    marginRight: 10
  },
  alignItemCenter: {
    alignItems: 'center',
    zIndex: 0
  },
  row: {
    flexDirection: 'row',
  },
  justifyContentSpaceBetween: {
    justifyContent: 'space-between'
  },
  contentContainer1: {
    backgroundColor: 'rgb(28, 32, 38)',
    marginTop: '6%',
    marginRight: '3%',
    marginBottom: '3%',
    marginLeft: '3%',
    padding: '5%',
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 6},
    shadowOpacity: 0.7,
    shadowRadius: 3,
  },
  contentContainer2: {
    backgroundColor: 'rgb(28, 32, 38)',
    margin: '3%',
    padding: '5%',
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 6},
    shadowOpacity: 0.7,
    shadowRadius: 3,
  },
  contentText: {
    color: 'white'
  },
  contentSubText: {
    color: 'white',
    fontSize: 11
  },
  contextAddressText: {
    color: 'white',
    marginTop: 15,
  },
  contextPaymentText1: {
    color: 'white',
    marginTop: 10,
    marginBottom: 40,
    paddingLeft: 10
  },
  contextPaymentText2: {
    color: 'white',
    marginTop: 10,
    paddingLeft: 10
  },
  part1Padding: {
    marginBottom: '3%'
  },
  part2Padding: {
    marginBottom: '3%'
  },
  borderPart2: {
    paddingBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: 'rgb(38, 43, 52)'
  },
  bookButtonOrange: {
    marginTop: '5%',
    height: 50,
    width: '70%',
    borderRadius: 5,
    justifyContent:'center',
    alignItems: 'center',
    backgroundColor: 'rgb(223,131,68)',
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 6},
    shadowOpacity: 0.9,
    shadowRadius: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
    fontWeight:'bold'
  },
})