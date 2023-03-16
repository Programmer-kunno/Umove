import React, { Component }  from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView, Keyboard, Image } from 'react-native';
import Constants from 'expo-constants';
import ModalSelector from 'react-native-modal-selector-searchable'

import { FetchApi } from '../../../api/fetch';
import { getStorage, setStorage } from '../../../api/helper/storage';

export default class Exclusive3 extends Component {  
  constructor(props) {
    super(props);
    
    this.state = { 
      booking: {},
      regionList: [],
      provinceList: [],
      cityList: [],
      barangayList: []
    };
  }

  async componentDidMount() {
    this.init();
    this.loadRegion();
  }

  async init() {
    let booking = await getStorage('booking');
    this.setState({ booking })
  }

  async booking() {
    let booking = this.state.booking;
    await setStorage('booking', booking)
  }

  async loadRegion() {
    let [regionList, err] = await FetchApi.regions()
    if(regionList) {
      this.setState({regionList})
    } 
    if(err) {
      console.log(err)
    }
  }

  async loadProvince(regionCode) {
    let [provinceList, err] = await FetchApi.provinces(regionCode)
    if(provinceList) {
      this.setState({provinceList})
    } 
    if(err) {
      console.log(err)
    }
  }

  async loadCity(provinceCode) {
    let [cityList, err] = await FetchApi.cities(provinceCode)
    if(cityList) {
      this.setState({cityList})
    } 
    if(err) {
      console.log(err)
    }
  }

  async loadBarangay(cityCode) {
    let [barangayList, err] = await FetchApi.barangays(cityCode)
    if(barangayList) {
      this.setState({barangayList})
    }
    if(err) {
      console.log(err)
    }
  }

  render() {
    let booking = this.state.booking;
    return(
      <View style={styles.container}>

        <KeyboardAvoidingView behavior='position' keyboardVerticalOffset={20}>
            {/* Header for Delivery Address */}
            <View style={[styles.header, styles.row]}>
              <TouchableOpacity style={styles.arrowContainer} onPress={() => { this.props.navigation.navigate('Exclusive2') }}>
                <Image
                  source={require('../../../assets/icons/arrow-back.png')}
                  style={styles.headerArrow}
                />
              </TouchableOpacity>
              <Text style={styles.headerText}>Delivery Address</Text>
            </View>

          <ScrollView>

            <View style={styles.labelContainer}>
              <Text style={styles.labelText}> Drop Off Details </Text>
            </View>

            {/* Date and Time */}
            <View style={[styles.inputContainer, styles.row, styles.marginTop]}>
              <TextInput
                style={styles.dateInput}
                onChangeText={(date) => {
                  booking.dropoffDate = date;
                  this.setState({ booking })
                }}
                placeholder='March 22, 2022'
                placeholderTextColor={'#808080'}
              />
              <TextInput
                style={styles.timeInput}
                onChangeText={(time) => {
                  booking.dropoffTime = time;
                  this.setState({ booking })
                }}
                placeholder='ASAP'
                placeholderTextColor={'#808080'}
              />
            </View>

            <View style={styles.inputContainer}>
              {/* Street Address */}
              <TextInput
                style={[styles.fullWidthInput, styles.marginTop]}
                onChangeText={(streetAddress) => {
                  booking.dropoffStreetAddress = streetAddress;
                  this.setState({ booking })
                }}
                placeholder='House No., Lot, Street'
                placeholderTextColor={'#808080'}
              />
            </View>
            {/* Region and Zip Code */}
            <View style={[styles.inputContainer, styles.marginTop, styles.row]}>
              {/* Region */}
              <ModalSelector
                data={this.state.regionList}
                keyExtractor= {region => region.code}
                labelExtractor= {region => region.name}
                initValue="Select Region"
                onChange={(region) => {
                  booking.dropoffRegion = region.name;
                  this.setState({booking}, async () => {
                    await this.loadProvince(region.code);
                  });
                }}  
                searchText={'Search'}
                cancelText={'Cancel'}
                style={styles.regionInput}
                initValueTextStyle={styles.initValueTextStyle}
                searchStyle={styles.searchStyle}
                selectStyle={styles.selectStyle2}
                selectTextStyle={styles.selectTextStyle}
                sectionTextStyle={styles.sectionTextStyle}
                cancelStyle={styles.cancelStyle}
                cancelTextStyle={styles.cancelTextStyle}
                overlayStyle={styles.overlayStyle}
                touchableActiveOpacity={styles.touchableActiveOpacity}
              />
              {/* ZIP Code */}
              <TextInput
                  style={[styles.zipInput]}
                  onChangeText={(val) => {
                    booking.dropoffZipcode = val;
                    this.setState({booking})
                  }}  
                  placeholder='ZIP Code'
                  placeholderTextColor={'#808080'}                        
                  keyboardType='number-pad'
                  returnKeyType='done'
                  maxLength={4}
                />
            </View>
            {/* Province */}
            <View style={[styles.inputContainer, styles.marginTop, styles.row]}>
              { booking.dropoffRegion !== '' ? 
              <ModalSelector
                data={this.state.provinceList}
                keyExtractor= {province => province.code}
                labelExtractor= {province => province.name}
                initValue="Select Province"
                onChange={(province) => {
                  booking.dropoffProvince = province.name;
                  this.setState({booking}, async () => {
                    await this.loadCity(province.code);
                  });
                }}
                searchText={'Search'}
                cancelText={'Cancel'}
                style={styles.fullWidthInput}
                initValueTextStyle={styles.initValueTextStyle}
                searchStyle={styles.searchStyle}
                selectStyle={styles.selectStyle1}
                selectTextStyle={styles.selectTextStyle}
                sectionTextStyle={styles.sectionTextStyle}
                cancelStyle={styles.cancelStyle}
                cancelTextStyle={styles.cancelTextStyle}
                overlayStyle={styles.overlayStyle}
                touchableActiveOpacity={styles.touchableActiveOpacity}
              />
              :
              <ModalSelector
                disabled={true}
                data={this.state.provinceList}
                initValue="Select Province"
                searchText={'Search'}
                cancelText={'Cancel'}
                style={styles.disabledFullWidthInput}
                initValueTextStyle={styles.initValueTextStyle}
                searchStyle={styles.searchStyle}
                selectStyle={styles.disabledSelectStyle}
                selectTextStyle={styles.selectTextStyle}
                sectionTextStyle={styles.sectionTextStyle}
                cancelStyle={styles.cancelStyle}
                cancelTextStyle={styles.cancelTextStyle}
                overlayStyle={styles.overlayStyle}
                touchableActiveOpacity={styles.touchableActiveOpacity}
              />
              }
            </View>

          {/* City */}
          <View style={[styles.inputContainer, styles.marginTop]}>
            { booking.dropoffProvince !== '' ?
              <ModalSelector
                data={this.state.cityList}
                keyExtractor= {city => city.code}
                labelExtractor= {city => city.name}
                initValue="Select City"
                onChange={(city) => {
                  booking.dropoffCity = city.name;
                  this.setState({booking}, async () => {
                    await this.loadBarangay(city.code);
                  });
                }}  
                searchText={'Search'}
                cancelText={'Cancel'}
                style={styles.fullWidthInput}
                initValueTextStyle={styles.initValueTextStyle}
                searchStyle={styles.searchStyle}
                selectStyle={styles.selectStyle1}
                selectTextStyle={styles.selectTextStyle}
                sectionTextStyle={styles.sectionTextStyle}
                cancelStyle={styles.cancelStyle}
                cancelTextStyle={styles.cancelTextStyle}
                overlayStyle={styles.overlayStyle}
              />
              :
              <ModalSelector
                disabled={true}
                initValue="Select City"
                searchText={'Search'}
                cancelText={'Cancel'}
                style={styles.disabledFullWidthInput}
                initValueTextStyle={styles.initValueTextStyle}
                searchStyle={styles.searchStyle}
                selectStyle={styles.disabledSelectStyle}
                selectTextStyle={styles.selectTextStyle}
                sectionTextStyle={styles.sectionTextStyle}
                cancelStyle={styles.cancelStyle}
                cancelTextStyle={styles.cancelTextStyle}
                overlayStyle={styles.overlayStyle}
                touchableActiveOpacity={styles.touchableActiveOpacity}
              />
            }
          </View>

          {/* Barangay */}
          <View style={[styles.inputContainer, styles.marginTop]}>
            { booking.dropoffCity !== '' ? 
              <ModalSelector
                data={this.state.barangayList}
                keyExtractor= {barangay => barangay.code}
                labelExtractor= {barangay => barangay.name}
                initValue="Select Barangay"
                onChange={(barangay) => {
                  booking.dropoffBarangay = barangay.name;
                  this.setState({booking});
                }} 
                searchText={'Search'}
                cancelText={'Cancel'}
                style={styles.fullWidthInput}
                initValueTextStyle={styles.initValueTextStyle}
                searchStyle={styles.searchStyle}
                selectStyle={styles.selectStyle1}
                selectTextStyle={styles.selectTextStyle}
                sectionTextStyle={styles.sectionTextStyle}
                cancelStyle={styles.cancelStyle}
                cancelTextStyle={styles.cancelTextStyle}
                overlayStyle={styles.overlayStyle}
              />
              :
              <ModalSelector
                disabled={true}
                initValue="Select Barangay"
                searchText={'Search'}
                cancelText={'Cancel'}
                style={styles.disabledFullWidthInput}
                initValueTextStyle={styles.initValueTextStyle}
                searchStyle={styles.searchStyle}
                selectStyle={styles.disabledSelectStyle}
                selectTextStyle={styles.selectTextStyle}
                sectionTextStyle={styles.sectionTextStyle}
                cancelStyle={styles.cancelStyle}
                cancelTextStyle={styles.cancelTextStyle}
                overlayStyle={styles.overlayStyle}
                touchableActiveOpacity={styles.touchableActiveOpacity}
              />
            }
          </View>

            {/* Landmarks */}
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.fullWidthInput, styles.marginTop]}
                onChangeText={(landmark) => {
                  booking.dropoffLandmark = landmark;
                  this.setState({booking})
                }}
                placeholder='Landmarks (Optional)'
                placeholderTextColor={'#808080'}
              />
            </View>
            {/* Special Instruction */}
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.marginTop, styles.specialInstructions]}
                onChangeText={(specialInstructions) => {
                  booking.dropoffSpecialInstructions = specialInstructions;
                  this.setState({booking})
                }}
                placeholder='Special Instruction (Optional)'
                placeholderTextColor={'#808080'}
                multiline={true}
                returnKeyType='done'
                blurOnSubmit={true}
                onSubmitEditing={()=>{Keyboard.dismiss()}}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        <View style={styles.alignItemCenter}>
          {/* Select from Saved Addresses */}
          <TouchableOpacity style={styles.nextButtonOrange} onPress={() => { alert('Saved Addresses') }}>
              <Text style={styles.buttonText}> Select from Saved Addresses </Text>
          </TouchableOpacity>
          {/* Next Button */}
            {/* Make button gray when not all inputs are filled out, orange when filled out */}
          { booking.dropoffStreetAddress == '' || booking.dropoffBarangay == '' || booking.dropoffCity == '' || booking.dropoffProvince == '' || booking.dropoffRegion == '' || booking.dropoffZipcode == '' ?
          <TouchableOpacity style={styles.nextButtonGray} disabled={true}>
            <Text style={styles.buttonText}> NEXT </Text>
          </TouchableOpacity>
          :
          <TouchableOpacity style={styles.nextButtonOrange} onPress={() => {
            this.booking();
            this.props.navigation.navigate('Exclusive4')
          }}>
            <Text style={styles.buttonText}> NEXT </Text>
          </TouchableOpacity>
          }
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
  arrowContainer: {
    marginLeft: '3%',
    marginRight: '26%'
  },
  headerArrow: {
    width: 12,
    height: 20,
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    marginTop: '5%',
    marginBottom: '5%',
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
  inputContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  alignItemCenter: {
    alignItems: 'center',
    zIndex: 0
  },
  zIndex: {
    zIndex: 1
  },
  row: {
    flexDirection: 'row',
  },
  marginTop: {
    marginTop: '3%'
  },
  marginRight: {
    marginRight: '2%'
  },
  dateInput: {
    backgroundColor: 'white',
    width: '59%',
    marginRight: 7,
    height: 50,
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 25,
    paddingLeft: '5%'
  },
  timeInput: {
    backgroundColor: 'white',
    width: '29%',
    height: 50,
    borderTopRightRadius: 25,
    borderBottomRightRadius: 25,
    textAlign: 'center'
  },
  fullWidthInput: {
    backgroundColor: 'white',
    width: '90%',
    height: 50,
    borderRadius: 25,
    paddingLeft: '5%'
  },
  regionInput: {
    width: '62%',
  },
  zipInput: {
    backgroundColor: 'white',
    width: '25%',
    height: 50,
    borderRadius: 25,
    textAlign: 'center',
    marginLeft: '3%'
  },
  specialInstructions: {
    backgroundColor: 'white',
    width: '90%',
    height: 90,
    borderRadius: 25,
    paddingRight: '5%',
    paddingLeft: '5%',
    paddingTop: '5%',
  },
  initValueTextStyle: {
    fontSize: 14,
    color: "#808080"
  },
  searchStyle: {
    borderColor: 'black',
    height: 40,
    marginTop: '5%'
  },
  selectStyle1: {
    backgroundColor: 'white',
    width: '100%',
    height: 50,
    borderRadius: 25,
    borderWidth: 0,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  selectStyle2: {
    backgroundColor: 'white',
    width: '100%',
    height: 50,
    borderRadius: 25,
    borderWidth: 0,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: '10%'
  },
  selectTextStyle: {
    fontSize: 14,
    color: 'black'
  },
  sectionTextStyle: {
    fontSize: 18,
    fontWeight: '500'
  },
  cancelStyle: {
    justifyContent: 'center',
    height: 50,
  },
  cancelTextStyle: {
    color: 'red',
    fontSize: 16,
    fontWeight: '500'
  },
  overlayStyle: {
    flex: 1, 
    marginTop: Constants.statusBarHeight,
    padding: '5%', 
    justifyContent: 'center', 
    backgroundColor: 'rgba(0,0,0,0.7)' 
  },
  disabledFullWidthInput: {
    backgroundColor: 'rgb(222, 223, 228)',
    width: '90%',
    height: 50,
    borderRadius: 25,
    paddingLeft: '5%'
  },
  disabledSelectStyle: {
    backgroundColor: 'rgb(222, 223, 228)',
    width: '100%',
    height: 50,
    borderRadius: 25,
    borderWidth: 0,
    justifyContent: 'center',
    alignItems: 'flex-start',
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