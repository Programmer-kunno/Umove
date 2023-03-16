import React, { Component }  from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Dimensions, TouchableWithoutFeedback, Keyboard } from 'react-native';
import Constants from 'expo-constants';
import DropDownPicker from 'react-native-dropdown-picker';

import { getStorage, setStorage } from '../../../api/helper/storage';

var deviceWidth = Dimensions.get('window').width

export default class Exclusive1 extends Component {  
  constructor(props) {
    super(props);
    
    this.state = { 
      booking: {
        typeOfGood: '',
        quantity: 0,
        width: '',
        length: '',
        weight: '',
        packagingType: '',
        pickupStreetAddress: '',
        pickupDate: '',
        pickupTime: '',
        pickupRegion: '',
        pickupProvince: '',
        pickupCity: '',
        pickupBarangay: '',
        pickupZipcode: '',
        pickupLandmark: '',
        pickupSpecialInstructions: '',
        dropoffDate: '',
        dropoffTime: '',
        dropoffStreetAddress: '',
        dropoffRegion: '',
        dropoffProvince: '',
        dropoffCity: '',
        dropoffBarangay: '',
        dropoffZipcode: '',
        dropoffLandmark: '',
        dropoffSpecialInstructions: '',
        paymentAddress: 'pickup',
        signature: 'true'  
      },
      typeValue: '',
      typeOpen: false,
      typeItems: [
        {label: 'Perishable Goods', value: 'perishable goods'},
        {label: 'Dry Goods', value: 'dry goods'},
        {label: 'Equipments', value: 'equipments'},
        {label: 'Liquids', value: 'liquids'},
        {label: 'Livestocks', value: 'livestocks'},
      ],
      packagingTypeValue: '',
      packagingOpen: false,
      packagingItems: [
        {label: 'Carton', value: 'carton'},
        {label: 'Drum', value: 'drum'},
        {label: 'Crates', value: 'crates'},
        {label: 'Sacks', value: 'sacks'},
      ],    
    };
  }

  async componentDidMount() {
    await setStorage('booking', null)
  }

  async booking() {
    let booking = this.state.booking;
    await setStorage('booking', booking)
  }

  plusQuantity = () => {
    let booking = this.state.booking;
    booking.quantity += 1
    this.setState({ booking });
  }

  minusQuantity = () => {
    let booking = this.state.booking;
    booking.quantity -= 1
    this.setState({ booking });
  }

  render() {
    let booking = this.state.booking;
    return(
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>

          {/* Header for Quick Quotation */}
          <View style={[styles.header, styles.justifyContent]}>
            <Text style={styles.label}>Exclusive Booking</Text>
          </View>

            {/* Dropdown for Type of Goods */}
            <View style={styles.dropDownContainer}>
              <DropDownPicker
                placeholder="Types of Good"
                placeholderStyle={styles.placeholderStyle}
                style={styles.typeDropdownStyle}
                containerStyle={styles.typeDropdownContainerStyle}
                open={this.state.typeOpen} 
                items={this.state.typeItems}
                value={this.state.typeValue}
                setOpen={() => {this.setState({typeOpen: !this.state.typeOpen})}}
                setValue={(callback) => {this.setState(state => ({
                  typeValue: callback(state.typeValue)}), () => {
                    booking.typeOfGood = this.state.typeValue;
                    this.setState({ booking })
                  })
                }}
                setItems={(callback) => {this.setState(state => ({
                  typeItems: callback(state.typeItems)}))}}
              />
            </View> 

            {/* Quantity */}
            <View style={styles.quantityContainer}>
              <View style={[styles.row, styles.alignItemCenter]}>
                <Text style={styles.inputLabel}> Quantity </Text>
                {/* Make minus sign gray when quantity is 0, orange when 1 or more*/}
                { booking.quantity == 0 ?
                  <TouchableOpacity style={styles.quantityButtonGray} disabled={true}>
                    <Text style={styles.quantityButtonText}> - </Text>
                  </TouchableOpacity>
                  :
                  <TouchableOpacity style={styles.quantityButtonOrange} onPress={this.minusQuantity}>
                    <Text style={styles.quantityButtonText}> - </Text>
                  </TouchableOpacity>
                }
                {/* Display quantity */}
                <Text style={styles.quantityText}> {booking.quantity} </Text>
                {/* Add quantity sign */}
                <TouchableOpacity style={styles.quantityButtonOrange} onPress={this.plusQuantity}>
                  <Text style={styles.quantityButtonText}> + </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Width and Length */}
            <View style={[styles.inputContainer, styles.row]}>
              {/* weight */}
              <View style={[styles.widthWeight, styles.row]}>
                <View style={styles.alignItemCenter}>
                  <Text style={styles.inputLabel}>Width</Text>
                  <Text style={styles.unitOfMeasurement}>(mm)</Text>
                </View>
                <TextInput
                  style={styles.widthLengthWeightInput}
                  onChangeText={(width) => {
                    booking.width = width;
                    this.setState({ booking })
                  }}
                  placeholder="00.00 mm"
                  placeholderTextColor={'#C3C3C3'}
                  keyboardType='decimal-pad'
                  returnKeyType='done'
                />
              </View>

              {/* length */}
              <View style={[styles.length, styles.row]}>
                <View style={styles.alignItemCenter}>
                  <Text style={styles.inputLabel}>Length</Text>
                  <Text style={styles.unitOfMeasurement}>(mm)</Text>  
                </View>
                <TextInput
                    style={styles.widthLengthWeightInput}
                    onChangeText={(length) => {
                      booking.length = length;
                      this.setState({ booking })
                    }}
                    placeholder="00.00 mm"
                    placeholderTextColor={'#C3C3C3'}
                    keyboardType='decimal-pad'
                    returnKeyType='done'
                  />
              </View>
            </View>

            {/* Weight and Packaging Type */}
            <View style={[styles.inputContainer, styles.row, styles.marginBottom]}>
              {/* weight */}
              <View style={[styles.widthWeight, styles.row]}>
                <View style={styles.alignItemCenter}>
                  <Text style={styles.inputLabel}>Weight</Text>
                  <Text style={styles.unitOfMeasurement}>(kg)</Text>
                </View>
                  <TextInput
                    style={styles.widthLengthWeightInput}
                    onChangeText={(weight) => {
                      booking.weight = weight;
                      this.setState({ booking })
                    }}
                    placeholder="00.00 kg"
                    placeholderTextColor={'#C3C3C3'}
                    keyboardType='decimal-pad'
                    returnKeyType='done'
                  />
              </View>
              {/* dropdown for packaging type */}
              <View style={styles.dropDownContainer}>
                <DropDownPicker
                  placeholder="Packaging Type"
                  placeholderStyle={styles.placeholderStyle}
                  style={styles.packagingDropdownStyle}
                  containerStyle={styles.packagingDropdownContainerStyle}
                  open={this.state.packagingOpen} 
                  items={this.state.packagingItems}
                  value={this.state.packagingTypeValue}
                  setOpen={() => {this.setState({packagingOpen: !this.state.packagingOpen})}}
                  setValue={(callback) => {this.setState(state => ({
                    packagingTypeValue: callback(state.packagingTypeValue)}), () => {
                      booking.packagingType = this.state.packagingTypeValue;
                      this.setState({ booking })
                    })
                  }}
                  setItems={(callback) => {this.setState(state => ({
                    packagingItems: callback(state.packagingItems)}))}}
                />
              </View> 
            </View>
          
          <View style={styles.alignItemCenter}>
          {/* Add Additional Items Button */}
            {/* Make button gray when not all inputs are filled out, orange when filled out */}
            { booking.typeValue == '' || booking.quantity == 0 || booking.width == '' || booking.length == '' || booking.weight == '' || booking.packagingValue == '' ?
            <TouchableOpacity style={styles.addButtonGray} disabled={true}>
              <Text style={styles.buttonText}> Add Additional Item </Text>
            </TouchableOpacity>
            :
            // Leave Disabled for Now
            // <TouchableOpacity style={styles.addButtonOrange} onPress={() => alert('Add Item')}>
            //   <Text style={styles.buttonText}> Add Additional Item </Text>
            // </TouchableOpacity>
            <TouchableOpacity style={styles.addButtonGray} disabled={true}>
              <Text style={styles.buttonText}> Add Additional Items </Text>
            </TouchableOpacity>
            }

          {/* Next Button */}
            {/* Make button gray when not all inputs are filled out, orange when filled out */}
            { booking.typeOfGood == '' || booking.quantity == 0 || booking.width == '' || booking.length == '' || booking.weight == '' || booking.packagingType == '' ?
            <TouchableOpacity style={styles.nextButtonGray} disabled={true}>
              <Text style={styles.buttonText}> NEXT </Text>
            </TouchableOpacity>
            :
            <TouchableOpacity style={styles.nextButtonOrange} onPress={() => {
              this.booking();
              this.props.navigation.navigate('Exclusive2')
            }}>
              <Text style={styles.buttonText}> NEXT </Text>
            </TouchableOpacity>
            }
          </View>
        </View>
      </TouchableWithoutFeedback>
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
  },
  label: {
    color: 'white',
    fontSize: 20,
    marginTop: '5%',
    marginBottom: '5%',
    marginLeft: '9%',
  },
  alignItemCenter: {
    alignItems: 'center',
    zIndex: 0
  },
  row: {
    flexDirection: 'row',
  },
  dropDownContainer: {
    alignItems: 'center',
    zIndex: 1000,
  },
  marginBottom: {
    marginBottom: '65%'
  },
  typeDropdownStyle: {
    paddingLeft: 20,
    borderRadius: 25,
  },
  typeDropdownContainerStyle: {
    width: '90%',
    marginTop: '5%',
  },
  inputContainer: {
    marginTop: '5%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 0
  },
  inputLabel: {
    fontSize: 15,
    color: 'white',
    paddingRight: '3%'
  },
  unitOfMeasurement: {
    fontSize: 13,
    color: 'white',
    paddingRight: '3%'
  },
  quantityContainer: {
    marginTop: '5%',
    marginLeft: '6%',
    zIndex: 0
  },
  quantityText: {
    fontSize: 15,
    color: 'white',
    fontWeight: 'bold',
    paddingRight: 5,
    paddingLeft: 5
  },
  quantityButtonText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  quantityButtonOrange: {
    backgroundColor: 'rgb(223,131,68)',
    height: 23,
    width: 23,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 2,
  },
  quantityButtonGray: {
    backgroundColor: 'gray',
    height: 23,
    width: 23,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 2,
  },
  widthWeight: {
    alignItems: 'center'
  },
  length: {
    alignItems: 'center',
    marginLeft: '3%',
  },
  widthLengthWeightInput: {
    backgroundColor: 'white',
    width: 115,
    height: 50,
    borderRadius: 25,
    textAlign: 'center'
  },
  packagingDropdownStyle: {
    borderRadius: 25,
  },
  packagingDropdownContainerStyle: {
    marginLeft: 20,
    width: deviceWidth/2.6,
  },
  addButtonGray: {
    marginTop: '5%',
    height: 50,
    width: '90%',
    borderRadius: 7,
    justifyContent:'center',
    alignItems: 'center',
    backgroundColor: 'gray',
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 6},
    shadowOpacity: 0.9,
    shadowRadius: 3,
  },
  addButtonOrange: {
    marginTop: '5%',
    height: 50,
    width: '90%',
    borderRadius: 7,
    justifyContent:'center',
    alignItems: 'center',
    backgroundColor: 'rgb(223,131,68)',
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 6},
    shadowOpacity: 0.9,
    shadowRadius: 3,
  },
  nextButtonGray: {
    marginTop: '5%',
    height: 50,
    width: '90%',
    borderRadius: 25,
    justifyContent:'center',
    alignItems: 'center',
    backgroundColor: 'gray',
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 6},
    shadowOpacity: 0.9,
    shadowRadius: 3,
  },
  nextButtonOrange: {
    marginTop: '5%',
    height: 50,
    width: '90%',
    borderRadius: 25,
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