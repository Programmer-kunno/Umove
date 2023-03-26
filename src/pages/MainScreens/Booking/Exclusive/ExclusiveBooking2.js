import React, { Component }  from 'react';
import { StatusBar, StyleSheet, View, Modal, TouchableWithoutFeedback, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView, Keyboard, Image } from 'react-native';
import ModalSelector from 'react-native-modal-selector-searchable';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment/moment';
import { UMColors } from '../../../../utils/ColorHelper';
import { FetchApi } from '../../../../api/fetch';
import GrayNavbar from '../../../Components/GrayNavbar';
import { navigate } from '../../../../utils/navigationHelper';
import { dispatch } from '../../../../utils/redux';
import { showError } from '../../../../redux/actions/ErrorModal';
import ErrorWithCloseButtonModal from '../../../Components/ErrorWithCloseButtonModal';

export default class ExclusiveBooking2 extends Component {  
  constructor(props) {
    super(props);
    
    this.state = { 
      booking: this.props.route?.params?.booking,
      date: new Date(),
      newDate: '',
      time: new Date(),
      newTime: '',
      dateModalVisible: false,
      timeModalVisible: false,
      regionList: [],
      provinceList: [],
      cityList: [],
      barangayList: []
    };
  }

  async componentDidMount() {
    this.loadRegion();
  }

  async booking() {
    console.log(this.state.booking)
    navigate('ExclusiveBooking3', { booking: this.state.booking })
  }

  async loadRegion() {
    let response = await FetchApi.regions()
    if(response == undefined){
      dispatch(showError(true))
    } else {
      if(response?.data?.success) {
        let regionList = response?.data?.data
        this.setState({regionList})
      } else {
        console.log(response?.message)
      }
    }
  }

  async loadProvince(regionCode) {
    let response = await FetchApi.provinces(regionCode)
    if(response == undefined){
      dispatch(showError(true))
    } else {
      if(response?.data?.success) {
        let provinceList = response?.data?.data
        this.setState({provinceList})
      } else {
        console.log(response?.message)
      }
    }
  }

  async loadCity(provinceCode) {
    let response = await FetchApi.cities(provinceCode)
    if(response == undefined){
      dispatch(showError(true))
    } else {
      if(response?.data?.success) {
        let cityList = response?.data?.data
        this.setState({cityList})
      } else {
        console.log(response?.message)
      }
    }
  }

  async loadBarangay(cityCode) {
    let response = await FetchApi.barangays(cityCode)
    if(response == undefined){
      dispatch(showError(true))
    } else {
      if(response?.data?.success) {
        let barangayList = response?.data?.data
        this.setState({barangayList})
      } else {
        console.log(response?.message)
      }
    }
  }

  showDatePicker = (visible) => {
    this.setState({ dateModalVisible: visible });
  }
  
  showTimePicker = (visible) => {
    this.setState({ timeModalVisible: visible });
  }

  onChangeDate = (event, date) => {
    this.setState({dateModalVisible: false})
    const selectedDate = date.toLocaleDateString('zh-Hans-CN');
    let unformattedDate = selectedDate
      let rawDate = unformattedDate.replaceAll('/', '-') 
      let nDate = new Date(rawDate)
      this.setState({ newDate: nDate })

      let booking = this.state.booking
      booking.pickupDate = moment(this.state.newDate).format("YYYY-MM-DD")
      this.setState({ booking }); 
  };

  onChangeTime = (event, time) => {
    this.setState({timeModalVisible: false})
    const selectedTime = time.toLocaleTimeString('en-GB', {hour: '2-digit', minute:'2-digit'});

      let unformattedTime = selectedTime
      this.setState({ newTime: unformattedTime })

      let booking = this.state.booking
      booking.pickupTime = selectedTime
      this.setState({ booking });
  }
  
  render() {
    let booking = this.state.booking;
    const { dateModalVisible } = this.state;
    const { timeModalVisible } = this.state;
    
    //For-IOS
    // dateFormat = new Intl.DateTimeFormat('en-US', {
    //   year:  'numeric',
    //   month: 'long',
    //   day:   'numeric',
    // });

    // timeFormat = new Intl.DateTimeFormat('en-GB', {
    //   hour: '2-digit',
    //   minute: '2-digit',
    // });
    tommorowDate = () => {
      const today = new Date()
      let tomorrow =  new Date()
      tomorrow.setDate(today.getDate() + 1)
      return tomorrow
    }


    return(
      <View style={styles.container}>
        <StatusBar translucent backgroundColor={'transparent'} barStyle={'light-content'} />
        <ErrorWithCloseButtonModal/>
        {/* Date Modal */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={dateModalVisible}
            onRequestClose={() => this.setState({dateModalVisible: false}) }
          >
            <View style={styles.blurContainer}>
              <TouchableWithoutFeedback onPress={() => this.setState({dateModalVisible: false}) }>
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <DateTimePicker
                      display="default" 
                      mode="date"
                      minimumDate={new Date().setDate(new Date().getDate() + 1)}
                      themeVariant="light"
                      value={this.state.date}
                      onChange={this.onChangeDate}
                    />
                    {
                    //IOS
                    /* <View style={styles.alignItemCenter}>
                      <TouchableOpacity
                        style={styles.modalButton}
                        onPress={() => this.setState({dateModalVisible: false}, () => {
                          let booking = this.state.booking
                          if(booking.pickupDate != '') {
                            let unformattedDate = booking.pickupDate
                            let rawDate = unformattedDate.replaceAll('/', '-') 
                            let date = new Date(unformattedDate)

                            this.setState({ newDate: date })
                          } else {
                            let date = new Date()
                            this.setState({ newDate: date })
                            
                            const selectedDate = date.toLocaleDateString('zh-Hans-CN');
                            let booking = this.state.booking
                            booking.pickupDate = selectedDate
                            this.setState({ booking }); 
                          }
                        })}
                      >
                        <Text style={styles.textStyle}> Done </Text>
                      </TouchableOpacity>
                    </View> */}
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </Modal>

        {/* Time Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={timeModalVisible}
          onRequestClose={() => this.setState({timeModalVisible: false}) }
        >
          <View style={styles.blurContainer}> 
            <TouchableWithoutFeedback onPress={() => this.setState({timeModalVisible: false}) }>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <DateTimePicker 
                    display="default" 
                    mode="time"
                    themeVariant="light"
                    is24Hour={true}
                    value={this.state.time}
                    onChange={this.onChangeTime}
                  />
                  {/* <View style={styles.alignItemCenter}>
                    <TouchableOpacity
                      style={styles.modalButton}
                      onPress={() => this.setState({timeModalVisible: false}, () => {
                        let booking = this.state.booking
                        if(booking.pickupTime != '') {
                          let unformattedTime = booking.pickupTime
                          let time = new Date( 'March, 28 2001 ' + unformattedTime )

                          this.setState({ newTime: time })
                        } else {
                          let time = new Date()
                          this.setState({ newTime: time })
                          
                          const selectedTime = time.toLocaleTimeString('en-GB');
                          let booking = this.state.booking
                          booking.pickupTime = selectedTime
                          this.setState({ booking });
                        }
                      })}
                    >
                      <Text style={styles.textStyle}> Done </Text>
                    </TouchableOpacity>
                  </View> */}
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </Modal>

            {/* Header for Delivery Address */}
            <GrayNavbar
              Title={'Pick Up Address'}
              onBack={() => {
                this.props.navigation.navigate('ExclusiveBooking1')
              }}
            />
          <View style={{width: '100%', height: '71%', alignItems: 'center'}}>
            <ScrollView style={{width: '100%'}}>

              <View style={styles.labelContainer}>
                <Text style={styles.labelText}> Pick Up Details </Text>
              </View>

              <View style={styles.inputContainer}>
                {/* Sender Name */}
                <TextInput
                  style={[styles.fullWidthInput, styles.marginTop]}
                  onChangeText={(pickupName) => {
                    booking.pickupName = pickupName;
                    this.setState({ booking })
                  }}
                  placeholder="Sender's Name"
                  placeholderTextColor={'#808080'}
                />
              </View>

              {/* Date and Time */}
              <View style={[styles.inputContainer, styles.row, styles.marginTop]}>
                <TouchableOpacity style={styles.dateInput} onPress={() => this.showDatePicker(true)}>
                  { this.state.newDate == '' ?
                    <Text style={{ color:'#808080' }}>
                      Date
                    </Text>
                  :
                    <Text style={{ color:'black' }}>
                      {moment(this.state.newDate).format("YYYY-MM-DD")}
                      {/* { dateFormat.format(this.state.newDate) } */}
                    </Text>
                  }
                </TouchableOpacity>
                <TouchableOpacity style={styles.timeInput} onPress={() => this.showTimePicker(true)}>
                  { this.state.newTime == '' ?
                    <Text style={{ color:'#808080' }}>
                      Time
                      {/* { timeFormat.format(this.state.time) } */}
                    </Text>
                  :
                    <Text style={{ color:'black' }}>
                      {this.state.newTime}
                      {/* { timeFormat.format(this.state.newTime) } */}
                    </Text>
                  }
                </TouchableOpacity>
              </View>

              <View style={styles.inputContainer}>
                {/* Street Address */}
                <TextInput
                  style={[styles.fullWidthInput, styles.marginTop]}
                  onChangeText={(streetAddress) => {
                    booking.pickupStreetAddress = streetAddress;
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
                    booking.pickupRegion = region.name;
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
                      booking.pickupZipcode = val;
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
                { booking.pickupRegion != '' ? 
                <ModalSelector
                  data={this.state.provinceList}
                  keyExtractor= {province => province.code}
                  labelExtractor= {province => province.name}
                  initValue="Select Province"
                  onChange={(province) => {
                    booking.pickupProvince = province.name;
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
              { booking.pickupProvince != '' ?
                <ModalSelector
                  data={this.state.cityList}
                  keyExtractor= {city => city.code}
                  labelExtractor= {city => city.name}
                  initValue="Select City"
                  onChange={(city) => {
                    booking.pickupCity = city.name;
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
              { booking.pickupCity != '' ? 
                <ModalSelector
                  data={this.state.barangayList}
                  keyExtractor= {barangay => barangay.code}
                  labelExtractor= {barangay => barangay.name}
                  initValue="Select Barangay"
                  onChange={(barangay) => {
                    booking.pickupBarangay = barangay.name;
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
                    booking.pickupLandmark = landmark;
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
                    booking.pickupSpecialInstructions = specialInstructions;
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
          </View>
          

        <View style={styles.btnContainer}>
          {/* Select from Saved Addresses */}
          <TouchableOpacity style={[styles.nextButtonGray, styles.buttonMargin]} disabled={true}>
              <Text style={styles.buttonText}> Select from Saved Addresses </Text>
          </TouchableOpacity>
          
          {/* Next Button */}
            {/* Make button gray when not all inputs are filled out, orange when filled out */}
          { booking.pickupDate == '' || booking.pickupTime == '' || booking.pickupStreetAddress == '' || booking.pickupBarangay == '' || booking.pickupCity == '' || booking.pickupProvince == '' || booking.pickupRegion == '' || booking.pickupZipcode == '' ?
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
  container: {
    flex: 1, 
    backgroundColor: UMColors.BGOrange,
    alignItems: 'center'
  },
  labelContainer: {
    marginTop: '4%',
    marginLeft: '6%'
  },
  labelText: {
    color: 'black',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 1
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
    height: 40,
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 25,
    borderWidth: 1,
    borderColor: 'rgb(223,131,68)',
    paddingLeft: '5%',
    justifyContent: 'center'
  },
  timeInput: {
    backgroundColor: 'white',
    width: '29%',
    height: 40,
    borderTopRightRadius: 25,
    borderBottomRightRadius: 25,
    borderWidth: 1,
    borderColor: 'rgb(223,131,68)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  fullWidthInput: {
    backgroundColor: 'white',
    width: '90%',
    height: 40,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgb(223,131,68)',
    paddingLeft: '5%'
  },
  regionInput: {
    width: '62%',
  },
  zipInput: {
    backgroundColor: 'white',
    width: '25%',
    height: 40,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgb(223,131,68)',
    textAlign: 'center',
    marginLeft: '3%'
  },
  specialInstructions: {
    backgroundColor: 'white',
    width: '90%',
    height: 100,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgb(223,131,68)',
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
    height: 38,
    borderRadius: 25,
    borderWidth:0,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  selectStyle2: {
    backgroundColor: 'white',
    width: '100%',
    height: 38,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgb(223,131,68)',
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
    marginTop: '10%',
    padding: '5%', 
    justifyContent: 'center', 
    backgroundColor: 'rgba(0,0,0,0.7)' 
  },
  disabledFullWidthInput: {
    backgroundColor: 'rgb(222, 223, 228)',
    width: '90%',
    height: 40,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgb(223,131,68)',
    paddingLeft: '5%'
  },
  disabledSelectStyle: {
    backgroundColor: 'rgb(222, 223, 228)',
    width: '100%',
    height: 38,
    borderRadius: 25,
    borderWidth: 0,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  nextButtonGray: {
    marginTop: '2%',
    height: 50,
    width: '90%',
    borderRadius: 25,
    justifyContent:'center',
    alignItems: 'center',
    backgroundColor: 'gray',
    elevation: 5,
  },
  nextButtonOrange: {
    marginTop: '2%',
    height: 50,
    width: '90%',
    borderRadius: 25,
    justifyContent:'center',
    alignItems: 'center',
    backgroundColor: 'rgb(223,131,68)',
    elevation: 5
  },
  buttonMargin: {
    marginTop: '2%'
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
    fontWeight:'bold'
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    width: '90%',
    backgroundColor: "white",
    borderRadius: 20,
    borderColor: 'rgb(223,131,68)',
    borderWidth: 1,
    elevation: 5
  },
  modalButton: {
    borderRadius: 20,
    width: '40%',
    margin: 10,
    padding: 10,
    elevation: 2,
    backgroundColor: "rgb(223,131,68)",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 15
  },
  blurContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)'
  },
  dateTimeSpinner: {
    color: 'black',
    borderRadius: 10,
  },
  btnContainer: {
    alignItems: 'center',
    zIndex: 0,
    width: '100%',
  }
})