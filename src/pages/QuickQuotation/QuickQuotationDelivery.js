import React, { Component }  from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Keyboard, 
  StatusBar 
} from 'react-native';
import ModalSelector from 'react-native-modal-selector-searchable'
import GrayNavbar from '../Components/GrayNavbar';
import { UMColors } from '../../utils/ColorHelper';
import { FetchApi } from '../../api/fetch';
import { navigate } from '../../utils/navigationHelper';

export default class QuickQuotationDelivery extends Component {  
  constructor(props) {
    super(props);
    
    this.state = { 
      booking: this.props.route.params.booking,
      regionList: [],
      provinceList: [],
      cityList: [],
      barangayList: []
    };
  }

  async componentDidMount() {
    console.log(this.state.booking)
    this.loadRegion();
  }

  async booking() {
    navigate('QuickQuotateScreen', { booking: this.state.booking })
  }

  async loadRegion() {
    let response = await FetchApi.regions()
    if(response.success) {
      let regionList = response.data
      this.setState({regionList})
    } else {
      console.log(response.message)
    }
  }

  async loadProvince(regionCode) {
    let response = await FetchApi.provinces(regionCode)
    if(response.success) {
      let provinceList = response.data
      this.setState({provinceList})
    } else {
      console.log(response.message)
    }
  }

  async loadCity(provinceCode) {
    let response = await FetchApi.cities(provinceCode)
    if(response.success) {
      let cityList = response.data
      this.setState({cityList})
    } else {
      console.log(response.message)
    }
  }

  async loadBarangay(cityCode) {
    let response = await FetchApi.barangays(cityCode)
    if(response.success) {
      let barangayList = response.data
      this.setState({barangayList})
    } else {
      console.log(response.message)
    }
  }

  render() {
    let booking = this.state.booking;
    return(
      <View style={styles.mainContainer}>
        <StatusBar translucent backgroundColor={'transparent'} barStyle={'light-content'} />

            {/* Header for Delivery Address */}
            <GrayNavbar
              Title={'Delivery Address'}
              onBack={() => {
                this.props.navigation.navigate('QuickQuotationPickUp')
              }}
            />

            <View style={{width: '100%', height: '71%', alignItems: 'center'}}>
              <ScrollView style={{width: '100%'}}>

              <View style={styles.labelContainer}>
                <Text style={styles.labelText}> Drop Off Details </Text>
              </View>

              {/* Date and Time */}
              {/* <View style={[styles.inputContainer, styles.row, styles.marginTop]}>
                <TextInput
                  style={styles.dateInput}
                  onChangeText={(date) => {this.setState({date})}}
                  placeholder='March 22, 2022'
                  placeholderTextColor={'#808080'}
                />
                <TextInput
                  style={styles.timeInput}
                  onChangeText={(time) => {this.setState({time})}}
                  placeholder='ASAP'
                  placeholderTextColor={'#808080'}
                />
              </View> */}
              <View style={{width: '100%'}}>
                <View style={styles.inputContainer}>
                  {/* Street Address */}
                  <TextInput
                    style={[styles.fullWidthInput, styles.marginTop,  { paddingLeft: '5%' }]}
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
                    selectStyle={styles.selectStyleRegion}
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
                    selectStyle={styles.selectStyle}
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
                    selectStyle={styles.selectStyle}
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
                    selectStyle={styles.selectStyle}
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
                    style={[styles.fullWidthInput, styles.marginTop,  { paddingLeft: '5%' }]}
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
              </View>
            </ScrollView>
          </View>

        <View style={styles.btnContainer}>
        {/* Next Button */}
          {/* Make button gray when not all inputs are filled out, orange when filled out */}
          { booking.dropoffStreetAddress == '' || booking.dropoffBarangay == '' || booking.dropoffCity == '' || booking.dropoffProvince == '' || booking.dropoffRegion == '' || booking.dropoffZipcode == '' ?
          <TouchableOpacity style={styles.nextButtonGray} disabled={true}>
            <Text style={styles.buttonText}> NEXT </Text>
          </TouchableOpacity>
          :
          <TouchableOpacity style={styles.nextButtonOrange} onPress={() => {
            this.booking();
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
  mainContainer: {
    flex: 1, 
    backgroundColor: UMColors.BGOrange,
  },
  labelContainer: {
    marginTop: '7%',
    marginBottom: '3%',
    marginLeft: '6%'
  },
  labelText: {
    color: 'white',
    fontSize: 15,
    color: UMColors.primaryOrange,
    fontWeight: 'bold'
  },
  inputContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnContainer: {
    alignItems: 'center',
    zIndex: 0,
    width: '100%'
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
  // dateInput: {
  //   backgroundColor: 'white',
  //   width: '59%',
  //   marginRight: 7,
  //   height: 50,
  //   borderTopLeftRadius: 25,
  //   borderBottomLeftRadius: 25,
  //   paddingLeft: '5%'
  // },
  // timeInput: {
  //   backgroundColor: 'white',
  //   width: '29%',
  //   height: 50,
  //   borderTopRightRadius: 25,
  //   borderBottomRightRadius: 25,
  //   textAlign: 'center'
  // },
  fullWidthInput: {
    backgroundColor: 'white',
    width: '90%',
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: UMColors.primaryOrange,
    justifyContent: 'center',
  },
  regionInput: {
    backgroundColor: UMColors.white,
    width: '62%',
    height: 50,
    justifyContent: 'center',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: UMColors.primaryOrange,
    justifyContent: 'center',
  },
  zipInput: {
    backgroundColor: 'white',
    width: '25%',
    height: 50,
    borderRadius: 25,
    textAlign: 'center',
    marginLeft: '3%',
    borderWidth: 1,
    borderColor: UMColors.primaryOrange
  },
  specialInstructions: {
    backgroundColor: 'white',
    width: '90%',
    height: 90,
    borderRadius: 25,
    paddingRight: '5%',
    paddingLeft: '5%',
    marginBottom: '15%',
    borderWidth: 1,
    borderColor: UMColors.primaryOrange
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
  selectStyle: {
    backgroundColor: UMColors.white,
    width: '85%',
    height: '100%',
    borderRadius: 25,
    borderWidth: 0,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginLeft: '3%'
  },
  selectStyleRegion: {
    backgroundColor: UMColors.white,
    width: '80%',
    height: '100%',
    borderRadius: 25,
    borderWidth: 0,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: '5%',
    marginLeft: '2%',
  },
  selectTextStyle: {
    fontSize: 14,
    color: UMColors.black
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
    marginTop: '10%',
    padding: '5%', 
    justifyContent: 'center', 
    backgroundColor: 'rgba(0,0,0,0.7)' 
  },
  disabledFullWidthInput: {
    backgroundColor: UMColors.ligthGray,
    width: '90%',
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: UMColors.primaryOrange,
    justifyContent: 'center',
  },
  disabledSelectStyle: {
    backgroundColor: UMColors.ligthGray,
    width: '85%',
    height: '100%',
    borderRadius: 25,
    borderWidth: 0,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginLeft: '3%'
  },
  nextButtonGray: {
    marginTop: '5%',
    height: 50,
    width: '90%',
    borderRadius: 25,
    justifyContent:'center',
    alignItems: 'center',
    backgroundColor: UMColors.primaryGray,
    elevation: 5,
  },
  nextButtonOrange: {
    marginTop: '5%',
    height: 50,
    width: '90%',
    borderRadius: 25,
    justifyContent:'center',
    alignItems: 'center',
    backgroundColor: UMColors.primaryOrange,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
    fontWeight:'bold'
  },
})