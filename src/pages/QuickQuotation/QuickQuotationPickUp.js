import React, { useEffect, useState }  from 'react';
import { 
  StatusBar, 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
} from 'react-native';
import ModalSelector from 'react-native-modal-selector-searchable';
import { UMColors } from '../../utils/ColorHelper';
import { FetchApi } from '../../api/fetch';
import CustomNavbar from '../Components/CustomNavbar';
import { navigate } from '../../utils/navigationHelper';
import { dispatch } from '../../utils/redux';
import { showError } from '../../redux/actions/ErrorModal';
import ErrorWithCloseButtonModal from '../Components/ErrorWithCloseButtonModal';
import ErrorOkModal from '../Components/ErrorOkModal';
import { useIsFocused } from '@react-navigation/native';
import { UMIcons } from '../../../utils/imageHelper';

export default QuickQuotationPickUp = (props) => { 
  const [bookingData, setBookingData] = useState({})
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
      setBookingData(props.route.params.booking)
    }
  }, [isFocused])

  useEffect(() => {
    loadRegion()
  }, [bookingData])

  const booking = async() => {
    navigate('QuickQuotationPickUpMap', { booking: bookingData })
  }

  const loadRegion = async() => {
    const response = await FetchApi.regions()
    if(response == undefined){
      dispatch(showError(true))
    } else {
      if(response?.data?.success) {
        let regionList = response?.data?.data
        if(bookingData?.fromSaveAddress || bookingData?.isRebook){
          regionList.map(async(data, index) => {
            if(data.name == bookingData?.pickupRegion){
              await loadProvince(data.code)
            }
          })
        }
        setRegionList(response?.data?.data)
      } else {
        setError({ value: true, message: response?.data?.message || response?.data })
      }
    }
  }

  const loadProvince = async(regionCode) => {
    const response = await FetchApi.provinces(regionCode)
    if(response == undefined){
      dispatch(showError(true))
    } else {
      if(response?.data?.success) {
        let provinceList = response?.data?.data
        if(bookingData?.fromSaveAddress || bookingData?.isRebook){
          provinceList.map(async(data, index) => {
            if(data.name == bookingData?.pickupProvince){
              await loadCity(data.code)
            }
          })
        }
        setProvinceList(response?.data?.data)
      } else {
        setError({ value: true, message: response?.data?.message || response?.data })
      }
    }
  }

  const loadCity = async(provinceCode) => {
    const response = await FetchApi.cities(provinceCode)
    if(response == undefined){
      dispatch(showError(true))
    } else {
      if(response?.data?.success) {
        let cityList = response?.data?.data
        if(bookingData?.fromSaveAddress || bookingData?.isRebook){
          cityList.map(async(data, index) => {
            if(data.name == bookingData?.pickupCity){
              await loadBarangay(data.code)
            }
          })
        }
        setCityList(response?.data?.data)
      } else {
        setError({ value: true, message: response?.data?.message || response?.data })
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
        setError({ value: true, message: response?.data?.message || response?.data })
      }
    }
  }

  const checkInputs = () => {
    if( bookingData?.pickupStreetAddress == '' || bookingData?.pickupBarangay == '' || 
        bookingData?.pickupCity == '' || bookingData?.pickupProvince == '' || 
        bookingData?.pickupRegion == '' || bookingData?.pickupZipcode == ''
      ){
        return true
      } else {
        return false
      }
  }

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

      {/* Header for Delivery Address */}
      <CustomNavbar
        Title={'Delivery Address'}
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
              placeholderTextColor={UMColors.primaryGray}
            />
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
              placeholderTextColor={UMColors.primaryGray}
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
              initValue={
                bookingData.pickupRegion
                ? 
                bookingData?.pickupRegion || !bookingData?.pickupRegion && "Select Region" 
                : 
                "Select Region"
              }
              onChange={async(region) => {
                if(bookingData?.pickupRegion === region.name){
                  setBookingData({ ...bookingData, pickupRegion: region.name })
                } else {
                  setBookingData({
                    ...bookingData, 
                    pickupRegion: region.name,
                    pickupProvince: '',
                    pickupCity: '',
                    pickupBarangay: '',
                  })
                }
                await loadProvince(region.code)
              }}  
              searchText={'Search'}
              cancelText={'Cancel'}
              style={styles.regionInput}
              initValueTextStyle={[styles.initValueTextStyle, bookingData.pickupRegion && { color: UMColors.black }]}
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
              value={bookingData?.pickupZipcode}
              style={styles.zipInput}
              onChangeText={(val) => {
                setBookingData({
                  ...bookingData,
                  pickupZipcode: val
                })
              }}  
              placeholder='ZIP Code'
              placeholderTextColor={UMColors.primaryGray}                        
              keyboardType='number-pad'
              returnKeyType='done'
              maxLength={4}
            />
          </View>
          {/* Province */}
          <View style={[styles.inputContainer, styles.marginTop, styles.row]}>
            <ModalSelector
              disabled={!provinceList}
              data={provinceList}
              keyExtractor= {province => province.code}
              labelExtractor= {province => province.name}
              initValue={
                bookingData?.isRebook || bookingData?.fromSaveAddress 
                ? 
                bookingData?.pickupProvince || !bookingData?.pickupProvince && "Select Province" 
                : 
                "Select Province"
              }
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
              style={bookingData?.pickupRegion ? styles.fullWidthInput : styles.disabledFullWidthInput}
              initValueTextStyle={[styles.initValueTextStyle, bookingData?.pickupRegion && bookingData?.pickupProvince && { color: UMColors.black }]}
              searchStyle={styles.searchStyle}
              selectStyle={bookingData?.pickupRegion ? styles.selectStyle1 : styles.disabledSelectStyle}
              selectTextStyle={styles.selectTextStyle}
              sectionTextStyle={styles.sectionTextStyle}
              cancelStyle={styles.cancelStyle}
              cancelTextStyle={styles.cancelTextStyle}
              overlayStyle={styles.overlayStyle}
              touchableActiveOpacity={styles.touchableActiveOpacity}
            />
          </View>

          {/* City */}
          <View style={[styles.inputContainer, styles.marginTop]}>
            <ModalSelector
              disabled={!cityList}
              data={cityList}
              keyExtractor= {city => city.code}
              labelExtractor= {city => city.name}
              initValue={
                bookingData?.isRebook || bookingData?.fromSaveAddress 
                ? 
                bookingData?.pickupCity || !bookingData?.pickupCity && "Select City" 
                : 
                "Select City"}
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
                await loadBarangay(city.code)
              }}  
              searchText={'Search'}
              cancelText={'Cancel'}
              style={bookingData?.pickupProvince ? styles.fullWidthInput : styles.disabledFullWidthInput}
              initValueTextStyle={[styles.initValueTextStyle, bookingData?.pickupProvince && bookingData?.pickupCity &&  { color: UMColors.black }]}
              searchStyle={styles.searchStyle}
              selectStyle={bookingData?.pickupProvince ? styles.selectStyle1 : styles.disabledSelectStyle}
              selectTextStyle={styles.selectTextStyle}
              sectionTextStyle={styles.sectionTextStyle}
              cancelStyle={styles.cancelStyle}
              cancelTextStyle={styles.cancelTextStyle}
              overlayStyle={styles.overlayStyle}
            />
          </View>
          {/* Barangay */}
          <View style={[styles.inputContainer, styles.marginTop]}>
            <ModalSelector
              disabled={!barangayList}
              data={barangayList}
              keyExtractor= {barangay => barangay.code}
              labelExtractor= {barangay => barangay.name}
              initValue={
                bookingData?.isRebook || bookingData?.fromSaveAddress 
                ? 
                bookingData?.pickupBarangay || !bookingData?.pickupBarangay && "Select Barangay" 
                : 
                "Select Barangay"}
              onChange={(barangay) => {
                setBookingData({
                  ...bookingData,
                  pickupBarangay: barangay.name
                })
              }} 
              searchText={'Search'}
              cancelText={'Cancel'}
              style={bookingData?.pickupCity ? styles.fullWidthInput : styles.disabledFullWidthInput}
              initValueTextStyle={[styles.initValueTextStyle, bookingData?.pickupCity && bookingData?.pickupBarangay && { color: UMColors.black }]}
              searchStyle={styles.searchStyle}
              selectStyle={bookingData?.pickupCity ? styles.selectStyle1 : styles.disabledSelectStyle}
              selectTextStyle={styles.selectTextStyle}
              sectionTextStyle={styles.sectionTextStyle}
              cancelStyle={styles.cancelStyle}
              cancelTextStyle={styles.cancelTextStyle}
              overlayStyle={styles.overlayStyle}
            />
          </View>

          {/* Landmarks */}
          <View style={styles.inputContainer}>
            <TextInput
              value={bookingData?.pickupLandmark}
              style={[styles.landmarkTxtInput, styles.marginTop, { paddingLeft: '5%', textAlignVertical: 'top'}]}
              multiline={true}
              onChangeText={(landmark) => {
                setBookingData({
                  ...bookingData,
                  pickupLandmark: landmark
                })
              }}
              placeholder='Landmark (Optional)'
              placeholderTextColor={UMColors.primaryGray}
            />
          </View>
        </ScrollView>
      </View>

      <View style={styles.btnContainer}>
        {/* Next Button */}
          {/* Make button gray when not all inputs are filled out, orange when filled out */}
        <TouchableOpacity 
          style={checkInputs() ? styles.nextButtonGray : styles.nextButtonOrange} 
          disabled={checkInputs()}
          onPress={() => booking()}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
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
    color: UMColors.primaryOrange,
    fontSize: 14,
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
    backgroundColor: UMColors.white,
    width: '48%',
    marginRight: 7,
    height: 40,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: UMColors.primaryOrange,
    paddingLeft: '5%',
    paddingRight: '5%',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row'
  },
  timeInput: {
    backgroundColor: UMColors.white,
    width: '40%',
    height: 40,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: UMColors.primaryOrange,
    paddingLeft: '5%',
    paddingRight: '5%',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row'
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
  landmarkTxtInput: {
    backgroundColor: 'white',
    width: '90%',
    height: 100,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgb(223,131,68)',
    paddingHorizontal: 10
  },
  initValueTextStyle: {
    fontSize: 14,
    color: UMColors.primaryGray
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
    justifyContent: 'center',
  },
  disabledSelectStyle: {
    backgroundColor: 'rgb(222, 223, 228)',
    width: '100%',
    height: '100%',
    borderRadius: 25,
    borderWidth: 0,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: '5%',
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
  btnContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 0,
    width: '100%',
    position: 'absolute',
    bottom: 45
  }
})