import React, { Component }  from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import Constants from 'expo-constants';
import RadioButtonGroup, { RadioButtonItem } from "expo-radio-button";

import { FetchApi } from '../../../api/fetch';
import { getStorage, setStorage } from '../../../api/helper/storage';

export default class Exclusive4 extends Component {  
  constructor(props) {
    super(props);
    
    this.state = { 
      booking: {},
    };
  }

  async componentDidMount() {
    this.init();
  }

  async init() {
    let booking = await getStorage('booking');
    this.setState({ booking })
  }

  async booking() {
    let booking = this.state.booking;
    await setStorage('booking', booking)
  }

  render() {
    let booking = this.state.booking;
    return(
      <View style={styles.container}>

        {/* Header for Booking Summary */}
        <View style={[styles.header, styles.row]}>
          <TouchableOpacity style={styles.arrowContainer} onPress={() => { this.props.navigation.navigate('Exclusive3') }}>
            <Image
              source={require('../../../assets/icons/arrow-back.png')}
              style={styles.headerArrow}
            />
          </TouchableOpacity>
          <Text style={styles.headerText}>Booking Summary</Text>
        </View>

        {/* Booking Summary Content */}
        <View style={styles.innerContent}>

          {/* Part 1 */}
          <View style={styles.contentContainer}>
            <View style={[styles.row, styles.alignItemCenter, styles.justifyContentSpaceBetween, styles.part1Padding]}>
              <View style={[styles.row, styles.alignItemCenter]}>
                <Image
                  source={require('../../../assets/booking/truck.png')}
                  style={styles.bookingVehicle}
                />
                <View>
                  <Text style={styles.contentText}>Truck</Text>
                  <Text style={styles.contentText}>Quick/ASAP</Text>
                </View>
              </View>
              <View>
                <Text style={styles.contentText}>Exclusive</Text>
              </View>
            </View>
            <View style={[styles.row, styles.alignItemCenter, styles.justifyContentSpaceBetween, styles.part1Padding]}>
              <View style={[styles.row, styles.alignItemCenter]}>
                <Text style={styles.contentText}>Pick Up:</Text>
              </View>
              <View>
                <Text style={styles.contentText}>02:00 PM - 03/29/2022</Text>
              </View>
            </View>
            <View style={[styles.row, styles.alignItemCenter, styles.justifyContentSpaceBetween]}>
              <View style={[styles.row, styles.alignItemCenter]}>
                <Text style={styles.contentText}>Distance:</Text>
              </View>
              <View>
                <Text style={styles.contentText}>0km (0m)</Text>
              </View>
            </View>
          </View>
          
          {/* Part 2 */}
          <View style={styles.contentContainer}>
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
              <Text style={styles.contextAddressText}> 296 San Vicente Street, Sta. Cruz, Manila </Text>
              <RadioButtonItem 
                style={{marginBottom: 40, marginTop: 10}}
                value="pickup" 
                label={
                  <Text style={styles.contextPaymentText1}>Responsible For Payment</Text>
                }
              />
              <Text style={styles.contentText}> 143 Kundiman Street, Brgy. Sampaloc, Manila </Text>
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
            this.booking();
            this.props.navigation.navigate('Exclusive5')
          }}>
            <Text style={styles.buttonText}> BOOK </Text>
          </TouchableOpacity>
        </View>
            
      </View>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: 'rgb(38, 43, 52)',
  },
  header: {
    width: '100%',
    paddingTop: Constants.statusBarHeight,
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
  contentContainer: {
    backgroundColor: 'rgb(28, 32, 38)',
    margin: '5%',
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
    marginTop: '35%',
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