import React, { useEffect, useState }  from 'react';
import { 
  StatusBar, 
  StyleSheet, 
  View, 
  Modal, 
  TouchableWithoutFeedback, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Keyboard
} from 'react-native';
import ModalSelector from 'react-native-modal-selector-searchable';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment/moment';
import { UMColors } from '../../../utils/ColorHelper';
import { FetchApi } from '../../../api/fetch';
import CustomNavbar from '../../Components/CustomNavbar';
import { navigate } from '../../../utils/navigationHelper';
import { dispatch } from '../../../utils/redux';
import { showError } from '../../../redux/actions/ErrorModal';
import ErrorWithCloseButtonModal from '../../Components/ErrorWithCloseButtonModal';
import { make12HoursFormat } from '../../../utils/stringHelper';
import { BookingApi } from '../../../api/booking';
import { setLoading } from '../../../redux/actions/Loader';
import { Loader } from '../../Components/Loader';
import ErrorOkModal from '../../Components/ErrorOkModal';
import { useIsFocused } from '@react-navigation/native';

export default BookingPickUpScreen = (props) => { 
  const [bookingData, setBookingData] = useState({})
  const [date, setDate] = useState(new Date())
  const [newDate, setNewDate] = useState('')
  const [time, setTime] = useState(new Date())
  const [newTime, setNewTime] = useState('')
  const [dateModalVisible, setDateModalVisible] = useState(false)
  const [timeModalVisible, setTimeModalVisible] = useState(false)
  const [regionList, setRegionList] = useState()
  const [provinceList, setProvinceList] = useState()
  const [cityList, setCityList] = useState()
  const [barangayList, setBarangayList] = useState()
  const isFocused = useIsFocused()
  const [error, setError] = useState({
    value: false,
    message: ''
  })

  useEffect(() => {
    if(isFocused){
      dispatch(setLoading(false))
      setBookingData(props.route.params.booking)
      if(props.route.params?.booking?.fromSaveAddress){
        updateDataFromSaveAddress()
      }
    }
  }, [isFocused])

  const booking = () => {
    checkTimeDate()
  }

  const checkTimeDate = async() => {
    dispatch(setLoading(true))
    const response = await BookingApi.book(bookingData)
    if(response == undefined){
      dispatch(setLoading(false))
      dispatch(showError(true))
    } else {
      if(!response?.data?.message?.pickup_time){
        navigate('BookingDropOffScreen', { booking: { ...bookingData, fromSaveAddress: false } })
        dispatch(setLoading(false))
      } else {
        setError({ value: true, message: 'Pick Up Time passed or too soon' })
        dispatch(setLoading(false))
      }
    }
  }

  const loadRegion = async() => {
    const response = await FetchApi.regions()
    if(response == undefined){
      dispatch(showError(true))
    } else {
      if(response?.data?.success) {
        setRegionList(response?.data?.data)
      } else {
        console.log(response?.message)
      }
    }
  }

  const loadProvince = async(regionCode) => {
    const response = await FetchApi.provinces(regionCode)
    if(response == undefined){
      dispatch(showError(true))
    } else {
      if(response?.data?.success) {
        setProvinceList(response?.data?.data)
      } else {
        console.log(response?.message)
      }
    }
  }

  const loadCity = async(provinceCode) => {
    const response = await FetchApi.cities(provinceCode)
    if(response == undefined){
      dispatch(showError(true))
    } else {
      if(response?.data?.success) {
        setCityList(response?.data?.data)
      } else {
        console.log(response?.message)
      }
    }
  }

  const loadBarangay = async(cityCode) => {
    const response = await FetchApi.barangays(cityCode)
    if(response == undefined){
      dispatch(showError(true))
    } else {
      if(response?.data?.success) {
        setBarangayList(response?.data?.data)
      } else {
        console.log(response?.message)
      }
    }
  }

  const showDatePicker = (visible) => {
    setDateModalVisible(visible);
  }
  
  const showTimePicker = (visible) => {
    setTimeModalVisible(visible);
  }

  const onChangeDate = (event, date) => {
    setDateModalVisible(false)
    const selectedDate = date?.toLocaleDateString('zh-Hans-CN');
    let rawDate = selectedDate.replaceAll('/', '-') 
    let nDate = new Date(rawDate)
    setNewDate(nDate)

    setBookingData({
      ...bookingData,
      pickupDate: moment(nDate).format("YYYY-MM-DD")
    })
  };

  const onChangeTime = (event, time) => {
    setTimeModalVisible(false)
    const selectedTime = time?.toLocaleTimeString('en-GB', {hour: '2-digit', minute:'2-digit'});

      let unformattedTime = selectedTime
      setNewTime(unformattedTime)

      setBookingData({
        ...bookingData,
        pickupTime: selectedTime
      })
  }

  const updateDataFromSaveAddress = async() => {
    await loadRegion();
    if(regionList){
      regionList.map(async(item, index) => {
        if(item.name === bookingData?.pickupRegion){
         await loadProvince(item.code)
        }
      })
    }
    if(provinceList){
      provinceList.map(async(item, index) => {
        if(item.name === bookingData?.pickupProvince){
          console.log(item)
          await loadCity(item.code)
        }
      })
    }
    if(cityList){
      cityList.map(async(item, index) => {
        if(item.name === bookingData?.pickupCity){
          console.log(item)
          await loadBarangay(item.code)
        }
      })
    }
  }
  
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

  return(
    <View style={styles.container}>
      <StatusBar translucent backgroundColor={'transparent'} barStyle={'light-content'} />
      <ErrorWithCloseButtonModal/>
      <ErrorOkModal
        Visible={error.value}
        ErrMsg={error.message}
        OkButton={() => {
          setError({ value: false, message: '' })
        }}
      />
      {/* Date Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={dateModalVisible}
          onRequestClose={() => setDateModalVisible(false) }
        >
          <View style={styles.blurContainer}>
            <TouchableWithoutFeedback onPress={() => setDateModalVisible(false) }>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <DateTimePicker
                    display="default" 
                    mode="date"
                    minimumDate={new Date().setDate(new Date().getDate())}
                    themeVariant="light"
                    value={date}
                    onChange={onChangeDate}
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
        onRequestClose={() => setTimeModalVisible(false) }
      >
        <View style={styles.blurContainer}> 
          <TouchableWithoutFeedback onPress={() => setTimeModalVisible(false) }>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <DateTimePicker 
                  display="default" 
                  mode="time"
                  themeVariant="light"
                  is24Hour={false}
                  value={time}
                  onChange={onChangeTime}
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
          <CustomNavbar
            Title={'Pick Up Address'}
            onBack={() => {
              navigate('BookingItemScreen')
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
                value={bookingData?.pickupName}
                style={[styles.fullWidthInput, styles.marginTop, { paddingLeft: '5%' }]}
                onChangeText={(pickupName) => {
                  setBookingData({
                    ...bookingData,
                    pickupName: pickupName
                  })
                }}
                placeholder="Sender's Name"
                placeholderTextColor={'#808080'}
              />
            </View>

            {/* Date and Time */}
            <View style={[styles.inputContainer, styles.row, styles.marginTop]}>
              <TouchableOpacity style={styles.dateInput} onPress={() => showDatePicker(true)}>
                { newDate == '' ?
                  <Text style={{ color:'#808080' }}>
                    Pick Up Date
                  </Text>
                :
                  <Text style={{ color:'black' }}>
                    {moment(newDate).format("YYYY-MM-DD")}
                    {/* { dateFormat.format(this.state.newDate) } */}
                  </Text>
                }
              </TouchableOpacity>
              <TouchableOpacity style={styles.timeInput} onPress={() => showTimePicker(true)}>
                { newTime == '' ?
                  <Text style={{ color:'#808080' }}>
                    Time
                    {/* { timeFormat.format(time) } */}
                  </Text>
                :
                  <Text style={{ color:'black' }}>
                    {make12HoursFormat(newTime)}
                    {/* { timeFormat.format(newTime) } */}
                  </Text>
                }
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              {/* Street Address */}
              <TextInput
                value={bookingData?.pickupStreetAddress}
                style={[styles.fullWidthInput, styles.marginTop, { paddingLeft: '5%' }]}
                onChangeText={(streetAddress) => {
                  setBookingData({
                    ...bookingData,
                    pickupStreetAddress: streetAddress
                  })
                }}
                placeholder='House No., Lot, Street'
                placeholderTextColor={'#808080'}
              />
            </View>
            {/* Region and Zip Code */}
            <View style={[styles.inputContainer, styles.marginTop, styles.row]}>
              {/* Region */}
              <ModalSelector
                data={regionList}
                onModalOpen={() => {
                  loadRegion();
                }}
                keyExtractor= {region => region.code}
                labelExtractor= {region => region.name}
                initValue={bookingData?.isRebook || bookingData?.fromSaveAddress ? bookingData?.pickupRegion : "Select Region"}
                disabled={bookingData?.isRebook ? true : false}
                onChange={async(region) => {
                  setBookingData(
                    bookingData?.pickupRegion === region.name ?
                      { ...bookingData, pickupRegion: region.name }
                    :
                      {
                        ...bookingData, 
                        pickupRegion: region.name,
                        pickupProvince: '',
                        pickupCity: '',
                        pickupBarangay: '',
                      }
                  ), 
                  await loadProvince(region.code);
                }}  
                searchText={'Search'}
                cancelText={'Cancel'}
                style={styles.regionInput}
                initValueTextStyle={[styles.initValueTextStyle, bookingData?.fromSaveAddress && { color: UMColors.black }]}
                searchStyle={styles.searchStyle}
                selectStyle={[styles.selectStyle2, { backgroundColor: bookingData?.isRebook ? UMColors.ligthGray : UMColors.white}]}
                selectTextStyle={styles.selectTextStyle}
                sectionTextStyle={styles.sectionTextStyle}
                cancelStyle={styles.cancelStyle}
                cancelTextStyle={styles.cancelTextStyle}
                overlayStyle={styles.overlayStyle}
                touchableActiveOpacity={styles.touchableActiveOpacity}
              />
              {/* ZIP Code */}
              <TextInput
                value={bookingData?.pickupZipcode}
                style={[styles.zipInput, { backgroundColor: bookingData?.isRebook ? UMColors.ligthGray : UMColors.white}]}
                editable={bookingData?.isRebook ? false : true}
                onChangeText={(val) => {
                  setBookingData({
                    ...bookingData,
                    pickupZipcode: val
                  })
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
              { bookingData?.pickupRegion != '' ? 
              <ModalSelector
                data={provinceList}
                keyExtractor= {province => province.code}
                labelExtractor= {province => province.name}
                initValue={bookingData?.isRebook || bookingData?.fromSaveAddress ? bookingData?.pickupProvince : "Select Province"}
                disabled={bookingData?.isRebook ? true : false}
                onChange={async(province) => {
                  setBookingData(
                    bookingData?.pickupProvince === province.name ?
                      { ...bookingData, pickupProvince: province.name }
                    :
                      {
                        ...bookingData, 
                        pickupProvince: province.name,
                        pickupCity: '',
                        pickupBarangay: '',
                      }
                  ), 
                  await loadCity(province.code);
                }}
                searchText={'Search'}
                cancelText={'Cancel'}
                style={styles.fullWidthInput}
                initValueTextStyle={[styles.initValueTextStyle, bookingData?.fromSaveAddress && { color: UMColors.black }]}
                searchStyle={styles.searchStyle}
                selectStyle={[styles.selectStyle1, { backgroundColor: bookingData?.isRebook ? UMColors.ligthGray : UMColors.white}]}
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
                data={provinceList}
                initValue={"Select Province"}
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
            { bookingData?.pickupProvince != '' ?
              <ModalSelector
                data={cityList}
                keyExtractor= {city => city.code}
                labelExtractor= {city => city.name}
                initValue={bookingData?.isRebook || bookingData?.fromSaveAddress ? bookingData?.pickupCity : "Select City"}
                disabled={bookingData?.isRebook ? true : false}
                onChange={async(city) => {
                  setBookingData(
                    bookingData?.pickupCity === city.name ?
                      { ...bookingData, pickupCity: city.name }
                    :
                      {
                        ...bookingData, 
                        pickupCity: city.name,
                        pickupBarangay: '',
                      }
                  ), 
                  await loadBarangay(city.code);
                }}  
                searchText={'Search'}
                cancelText={'Cancel'}
                style={styles.fullWidthInput}
                initValueTextStyle={[styles.initValueTextStyle, bookingData?.fromSaveAddress && { color: UMColors.black }]}
                searchStyle={styles.searchStyle}
                selectStyle={[styles.selectStyle1, { backgroundColor: bookingData?.isRebook ? UMColors.ligthGray : UMColors.white}]}
                selectTextStyle={styles.selectTextStyle}
                sectionTextStyle={styles.sectionTextStyle}
                cancelStyle={styles.cancelStyle}
                cancelTextStyle={styles.cancelTextStyle}
                overlayStyle={styles.overlayStyle}
              />
              :
              <ModalSelector
                disabled={true}
                initValue={"Select City"}
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
            { bookingData?.pickupCity != '' ? 
              <ModalSelector
                data={barangayList}
                keyExtractor= {barangay => barangay.code}
                labelExtractor= {barangay => barangay.name}
                initValue={bookingData?.isRebook || bookingData?.fromSaveAddress ? bookingData?.pickupBarangay : "Select Barangay"}
                disabled={bookingData?.isRebook ? true : false}
                onChange={(barangay) => {
                  setBookingData({
                    ...bookingData,
                    pickupBarangay: barangay.name
                  })
                }} 
                searchText={'Search'}
                cancelText={'Cancel'}
                style={styles.fullWidthInput}
                initValueTextStyle={[styles.initValueTextStyle, bookingData?.fromSaveAddress && { color: UMColors.black }]}
                searchStyle={styles.searchStyle}
                selectStyle={[styles.selectStyle1, { backgroundColor: bookingData?.isRebook ? UMColors.ligthGray : UMColors.white}]}
                selectTextStyle={styles.selectTextStyle}
                sectionTextStyle={styles.sectionTextStyle}
                cancelStyle={styles.cancelStyle}
                cancelTextStyle={styles.cancelTextStyle}
                overlayStyle={styles.overlayStyle}
              />
              :
              <ModalSelector
                disabled={true}
                initValue={"Select Barangay"}
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
                value={bookingData?.pickupLandmark}
                style={[styles.fullWidthInput, styles.marginTop, { paddingLeft: '5%' }]}
                onChangeText={(landmark) => {
                  setBookingData({
                    ...bookingData,
                    pickupLandmark: landmark
                  })
                }}
                placeholder='Landmarks (Optional)'
                placeholderTextColor={'#808080'}
              />
            </View>
            {/* Special Instruction */}
            <View style={styles.inputContainer}>
              <TextInput
                value={bookingData?.pickupSpecialInstructions}
                style={[styles.marginTop, styles.specialInstructions]}
                onChangeText={(specialInstructions) => {
                  setBookingData({
                    ...bookingData,
                    pickupSpecialInstructions: specialInstructions
                  })
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
        <TouchableOpacity 
          style={[styles.nextButtonOrange, styles.buttonMargin]}
          onPress={() => navigate('Address', { from: 'pickUp', booking: bookingData })}
        >
          <Text style={styles.buttonText}> Select from Saved Addresses </Text>
        </TouchableOpacity>
        
        {/* Next Button */}
          {/* Make button gray when not all inputs are filled out, orange when filled out */}
        { bookingData?.pickupDate == '' || bookingData?.pickupTime == '' || bookingData?.pickupStreetAddress == '' || bookingData?.pickupBarangay == '' || bookingData?.pickupCity == '' || bookingData?.pickupProvince == '' || bookingData?.pickupRegion == '' || bookingData?.pickupZipcode == '' ?
        <TouchableOpacity style={styles.nextButtonGray} disabled={true}>
          <Text style={styles.buttonText}> NEXT </Text>
        </TouchableOpacity>
        :
        <TouchableOpacity style={styles.nextButtonOrange} onPress={() => {
          booking()
        }}>
          <Text style={styles.buttonText}> NEXT </Text>
        </TouchableOpacity>
        }
      </View>
      <Loader/>
    </View>
  )
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
    justifyContent: 'center',
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
    height: '100%',
    borderRadius: 25,
    borderWidth: 0,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: '5%',
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
    paddingLeft: '7%'
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