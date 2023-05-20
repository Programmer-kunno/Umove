import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  Dimensions,
  TextInput,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  Modal
} from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { UMColors } from '../../utils/ColorHelper'
import CustomNavbar from '../Components/CustomNavbar'
import DropDownPicker from 'react-native-dropdown-picker'
import { capitalizeFirst, make12HoursFormat, mobileNumberRegex, moneyFormat } from '../../utils/stringHelper'
import { useSelector } from 'react-redux'
import ModalSelector from 'react-native-modal-selector-searchable'
import { FetchApi } from '../../api/fetch'
import { dispatch } from '../../utils/redux'
import { showError } from '../../redux/actions/ErrorModal'
import { UMIcons } from '../../utils/imageHelper'
import { launchCamera } from 'react-native-image-picker'
import { canAccessCamera } from '../../utils/mediaHelper'
import RBSheet from 'react-native-raw-bottom-sheet'
import DocumentPicker from 'react-native-document-picker'
import getPath from '@flyerhq/react-native-android-uri-path';
import { setLoading } from '../../redux/actions/Loader'
import { refreshTokenHelper } from '../../api/helper/userHelper'
import { PayCreditApi } from '../../api/creditPayment'
import ErrorWithCloseButtonModal from '../Components/ErrorWithCloseButtonModal'
import ErrorOkModal from '../Components/ErrorOkModal'
import { Loader } from '../Components/Loader'
import { useIsFocused } from '@react-navigation/native'
import { navigate } from '../../utils/navigationHelper'
import { CardPayment } from '../../api/paymentCard'
import { RadioButton } from 'react-native-paper'
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment'
import { userLogout } from '../../redux/actions/User'

const deviceWidth = Dimensions.get('screen').width
const deviceHeight = Dimensions.get('screen').height

export default ToPayScreen = () => {
  const userDetailsData = useSelector(state => state.userOperations.userDetailsData)
  const userProfileData = useSelector(state => state.userOperations.userDetailsData?.user?.user_profile)
  const RBSheetRef = useRef(null)
  const setRef = (ref) => { RBSheetRef.current = ref; }
  const isFocused = useIsFocused()
  const [amountToPay, setAmountToPay] = useState('0')
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(undefined)
  const [paymentMethod, setPaymanetMethod] = useState([])
  const [chequeImg, setChequeImg] = useState(undefined)
  const [contactName, setContactName] = useState('')
  const [contactNumber, setContactNumber] = useState('')
  const [date, setDate] = useState(new Date())
  const [newDate, setNewDate] = useState('')
  const [time, setTime] = useState(new Date())
  const [newTime, setNewTime] = useState('')
  const [dateModalVisible, setDateModalVisible] = useState(false)
  const [timeModalVisible, setTimeModalVisible] = useState(false)
  const [address, setAddress] = useState('')
  const [barangayData, setBarangay] = useState('')
  const [cityData, setCity] = useState('')
  const [provinceData, setProvince] = useState('')
  const [regionData, setRegion] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [regionList, setRegionList] = useState([])
  const [provinceList, setProvinceList] = useState([])
  const [cityList, setCityList] = useState([])
  const [barangayList, setBarangayList] = useState([])
  const [paymentMehodOpen, setPaymentMehodOpen] = useState(false)
  const [paymentMethodValue, setPaymentMethodValue] = useState('')
  const [error, setError] = useState({ value: false, message: '' })
  const [showSecondInputs, setShowSecondInput] = useState(false)
  const [paymentCategoryItems, setPaymentCategoryItems] = useState([
    {
      id: 1,
      label: 'Upload Cheque and Pick Up Information',
      value: 1
    },
    {
      id: 2,
      label: 'Online Payment',
      value: 2
    },
    {
      id: 3,
      label: 'Deliver to UMove',
      value: 3
    },
  ])

  useEffect(() => {
    if(isFocused){
      setSelectedPaymentMethod(undefined)
      loadRegion()
      getPaymentMethods()
    }
  }, [isFocused])

  const onChequePayment = () => {
    dispatch(setLoading(true))
    const data = {
      cheque: chequeImg,
      type: paymentMethodValue == 1 ? 'pickup' : 'deliver',
      pickUpDateTime: paymentMethodValue == 1 ? moment(newDate).format("YYYY-MM-DD") + ' ' + newTime + ':00' : '',
      name: contactName,
      mobileNumber: contactNumber,
      address: address,
      region: regionData,
      province: provinceData,
      city: cityData,
      barangay: barangayData,
      zipCode: zipCode
    }
    refreshTokenHelper(async() => {
      const response = await PayCreditApi.chequePayment(data)
      if(response == undefined){
        dispatch(showError(true))
        dispatch(setLoading(false))
      } else {
        if(response?.data?.success){
          navigate('ChequePaymentSuccessScreen', { paymentMethodValue: paymentMethodValue })
          dispatch(setLoading(false))
        } else {
          setError({ value: true, message: response?.data?.message || response?.data })
          dispatch(setLoading(false))
        }
      }
    })
  }

  const chequePickUpTimeChecker = () => {
    dispatch(setLoading(true))
    const data = {
      cheque: chequeImg,
      zipCode: zipCode ? zipCode : '9999',
      type: paymentMethodValue == 1 ? 'pickup' : 'deliver',
      pickUpDateTime: moment(newDate).format("YYYY-MM-DD") + ' ' + newTime + ':00'
    }
    refreshTokenHelper(async() => {
      const response = await PayCreditApi.chequePayment(data)
      if(response == undefined){
        dispatch(showError(true))
        dispatch(setLoading(false))
      } else {
        if(!response?.data?.message?.pickup_time){
          setShowSecondInput(true)
          dispatch(setLoading(false))
        } else {
          setError({ value: true, message: 'Pick-up time passed or too soon' })
          dispatch(setLoading(false))
        }
      }
    })
  }

  const getPaymentMethods = () => {
    dispatch(setLoading(true))
    refreshTokenHelper(async() => {
      const response = await CardPayment.getPaymentMetods()
      if(response == undefined){
        dispatch(setLoading(false))
        dispatch(showError(true))
      } else {
        if(response?.data?.success){
          setPaymanetMethod(response?.data?.data)
          dispatch(setLoading(false))
        } else {
          setError({ value: true, message: response?.data?.data?.message || response?.data })
          dispatch(setLoading(false))
        }
      }
    })
  }

  const loadRegion = async() => {
    let response = await FetchApi.regions()
    if(response == undefined){
      dispatch(showError(true))
    } else {
      if(response?.data?.success) {
        let regionList = response?.data?.data
        if(paymentMethodValue == 1){
          regionList.map(async(data, index) => {
            if(data.name == userProfileData?.region){
              await loadProvince(data.code)
            }
          })
        }
        setRegionList(regionList)
      } else {
        console.log(response?.message)
      }
    }
  }

  const loadProvince = async(regionCode) => {
    let response = await FetchApi.provinces(regionCode)
    if(response == undefined){
      dispatch(showError(true))
    } else {
      if(response?.data?.success) {
        let provinceList = response?.data?.data
        console.log(provinceList)
        if(paymentMethodValue == 1){
          provinceList.map(async(data, index) => {
            if(data.name == userProfileData?.province){
              await loadCity(data.code)
            }
          })
        }
        setProvinceList(provinceList)
      } else {
        console.log(response?.message)
      }
    }
  }

  const loadCity = async(provinceCode) => {
    let response = await FetchApi.cities(provinceCode)
    if(response == undefined){
      dispatch(showError(true))
    } else {
      if(response?.data?.success) {
        let cityList = response?.data?.data
        if(paymentMethodValue == 1){
          cityList.map(async(data, index) => {
            if(data.name == userProfileData?.city){
              await loadBarangay(data.code)
            }
          })
        }
        setCityList(cityList)
      } else {
        console.log(response?.message)
      }
    }
  }

  const loadBarangay = async(cityCode) => {
    let response = await FetchApi.barangays(cityCode)
    if(response == undefined){
      dispatch(showError(true))
    } else {
      if(response?.data?.success) {
        let barangayList = response?.data?.data
        setBarangayList(barangayList)
      } else {
        console.log(response?.message)
      }
    }
  }

  const onPressImage = async () => {
    const granted = await canAccessCamera();
    
    if(granted){
      launchCamera().then(res => {
        if(res.didCancel) {
          return;
        } else if(res?.assets?.length > 0) {
          const mediaAsset = res.assets[0];
          const imageData = {
            uri: mediaAsset.uri,
            name: mediaAsset.fileName,
            type: mediaAsset.type
          }
          setChequeImg(imageData)
          RBSheetRef.current.close()
        }
      }).catch((e) => {
        console.log(e);
      })
    } else {
      return;
    }
  }

  const onChooseGallery = async() => {
    try {
      const response = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
      });  
      const origPath = getPath(response[0].uri)
      const fileOrigPath = Platform.OS === 'ios' ? origPath : `file://${origPath}`
      response[0].uri = fileOrigPath
      const imgData = {
        uri: fileOrigPath,
        name: response[0].name,
        type: response[0].type
      }
      setChequeImg(imgData)
      RBSheetRef.current.close()
    } catch (err) {
      //Handling any exception (If any)
      if (DocumentPicker.isCancel(err)) {
        RBSheetRef.current.close()
        //If user canceled the document selection
      } else {
        //For Unknown Error
        RBSheetRef.current.close()
        alert('Unknown Error: ' + JSON.stringify(err));
      }
    }
  }

  const paymentMethodChanged = () => {
    if(paymentMethodValue == 1){
      restoreAddressData()
    } else {
      setShowSecondInput(false)
      setContactName('')
      setContactNumber('')
      setAddress('')
      setRegion('')
      setZipCode('')
      setProvince('')
      setCity('')
      setBarangay('')
    }
  }

  const restoreAddressData = async() => {
    setShowSecondInput(false)
    setContactName(userProfileData?.first_name + ' ' + userProfileData?.last_name)
    setContactNumber(userProfileData?.mobile_number.replace('+63', '0'))
    setAddress(userProfileData?.address)
    setRegion(userProfileData?.region)
    setZipCode(userProfileData?.zip_code)
    setProvince(userProfileData?.province)
    setCity(userProfileData?.city)
    setBarangay(userProfileData?.barangay)
    await loadRegion()
  }

  const checkChequeInputs = () => {
    if(chequeImg && address && regionData && zipCode && provinceData && cityData && barangayData){
      return true
    } else {
      return false
    }
  }
  
  const checkChequeFirstInputs = () => {
    if(paymentMethodValue == 1){
      if(contactName && newDate && newTime && contactNumber && chequeImg){
        return true
      } else {
        return false
      }
    }
    if(paymentMethodValue == 3){
      if(contactName && contactNumber){
        return true
      } else {
        return false
      }
    }
  }

  const checkOnlinePaymentInputs = () => {
    if(selectedPaymentMethod && amountToPay != '0' && amountToPay != '0.00'){
      return true
    } else {
      return false
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
  };

  const onChangeTime = (event, time) => {
    setTimeModalVisible(false)
    const selectedTime = time?.toLocaleTimeString('en-GB', {hour: '2-digit', minute:'2-digit'});
    let unformattedTime = selectedTime
    setNewTime(unformattedTime)
  }

  const renderToPay = () => {
    return (
      <View style={styles.toPayContainer}>
        <Text style={styles.toPayTxt}>To Pay</Text>
        <Text style={styles.balanceTxt}>{'₱ ' + moneyFormat(userDetailsData?.outstanding_balance)}</Text>
      </View>
    )
  }

  const renderChequePayment = () => {
    return (
      <View style={styles.checkContainer}>
        <View style={styles.mainWidthContainer}>
          <TouchableOpacity 
            style={styles.uploadCheckBtn}
            onPress={() => RBSheetRef.current.open()}
          >
            <Image
              style={chequeImg ? { width: '90%', height: '90%' } : { width: 55, height: 55 }}
              source={chequeImg ? { uri: chequeImg.uri } : UMIcons.uploadIcon}
              resizeMode='contain'
            />
            { !chequeImg && <Text style={styles.uploadCheckBtnTxt}>Upload</Text> }
          </TouchableOpacity>
        </View>
        {
          !showSecondInputs ?
            <View style={styles.checkContainer}>
              <View style={[styles.mainWidthContainer, { marginTop: 20 }]}>
                <TextInput
                  value={contactName}
                  style={[styles.fullWidthInput, styles.marginTop, { paddingLeft: '5%' }]}
                  onChangeText={(value) => {
                    setContactName(value)
                  }}
                  placeholder="Contact Name"
                  placeholderTextColor={'#808080'}
                />
              </View>
              <View style={styles.mainWidthContainer}>
                <TextInput
                  value={contactNumber}
                  maxLength={11}
                  keyboardType='numeric'
                  style={[styles.fullWidthInput, styles.marginTop, { paddingLeft: '5%' }]}
                  onChangeText={(value) => {
                    setContactNumber(value)
                  }}
                  placeholder="Contact Number"
                  placeholderTextColor={'#808080'}
                />
              </View>
              {
                paymentMethodValue == 1 &&
                  <View style={[styles.mainWidthContainer, { flexDirection: 'row' }]}>
                    <TouchableOpacity style={styles.dateInput} onPress={() => showDatePicker(true)}>
                      { newDate == '' ?
                        <Text style={{ color:'#808080' }}>
                          Select Date
                        </Text>
                      :
                        <Text style={{ color:'black' }}>
                          {moment(newDate).format("YYYY-MM-DD")}
                          {/* { dateFormat.format(this.state.newDate) } */}
                        </Text>
                      }
                      <Image
                        style={{ width: 20, height: 20 }}
                        source={UMIcons.calendarInputIcon}
                        resizeMode='contain'
                      />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.timeInput} onPress={() => showTimePicker(true)}>
                      { newTime == '' ?
                        <Text style={{ color:'#808080' }}>
                          Select time
                        </Text>
                      :
                        <Text style={{ color:'black' }}>
                          {make12HoursFormat(newTime)}
                        </Text>
                      }
                      <Image
                        style={{ width: 17, height: 17 }}
                        source={UMIcons.timeInputIcon}
                        resizeMode='contain'
                      />
                    </TouchableOpacity>
                  </View>
              }
              <TouchableOpacity
                  disabled={!checkChequeFirstInputs()}
                  style={[styles.confirmBtn, checkChequeFirstInputs() && { backgroundColor: UMColors.primaryOrange }]}
                  onPress={() => {
                    if(!mobileNumberRegex(contactNumber)){
                      setError({ value: true, message: 'Invalid Contact Number'})
                    } else {
                      if(paymentMethodValue == 1){
                        chequePickUpTimeChecker()
                      } else {
                        setShowSecondInput(true)
                      }
                    }
                  }}
                >
                  <Text style={styles.confirmBtnTxt}>
                    Continue
                  </Text>
              </TouchableOpacity>
            </View>
          :
            <View style={styles.checkContainer}>
              <View style={[styles.mainWidthContainer, { marginTop: 20 }]}>
                <TextInput
                  value={address}
                  style={[styles.fullWidthInput, styles.marginTop, { paddingLeft: '5%' }]}
                  onChangeText={(address) => {
                    setAddress(address)
                  }}
                  placeholder="House No., Lot, Street"
                  placeholderTextColor={'#808080'}
                />
              </View>
              <View style={styles.regionZipContainer}>
                <ModalSelector
                  data={regionList}
                  keyExtractor= {region => region.code}
                  labelExtractor= {region =>  region.name}
                  initValue={ paymentMethodValue == 1 ? regionData : "Select Region"}
                  onChange={async(region) => {
                    if(paymentMethodValue == 1){
                      if(regionData !== region.name){
                        setProvince('')
                        setCity('')
                        setBarangay('')
                        setRegion(region.name)
                        await loadProvince(region.code)
                      } else {
                        setRegion(region.name)
                      }
                    } else {
                      setRegion(region.name)
                      await loadProvince(region.code)
                    }
                  }}  
                  searchText={'Search'}
                  cancelText={'Cancel'}
                  style={styles.regionInput}
                  initValueTextStyle={[styles.initValueTextStyle, paymentMethodValue == 1 && { color: UMColors.black }]}
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
                  value={zipCode}
                  style={[styles.zipInput]}
                  onChangeText={(val) => {
                    setZipCode(val)
                  }}  
                  placeholder='ZIP Code'
                  placeholderTextColor={'#808080'}                        
                  keyboardType='number-pad'
                  returnKeyType='done'
                  maxLength={4}
                />
              </View>
              <View style={styles.mainWidthContainer}>
                <ModalSelector
                  disabled={!provinceList}
                  data={provinceList}
                  keyExtractor= {province => province.code}
                  labelExtractor= {province => province.name}
                  initValue={paymentMethodValue == 1 ? provinceData || !provinceData && "Select Province"  : "Select Province"}
                  onChange={async(province) => {
                    if(paymentMethodValue == 1){
                      if(provinceData !== province.name){
                        setCity('')
                        setBarangay('')
                        setProvince(province.name)
                        await loadCity(province.code)
                      } else {
                        setProvince(province.name)
                      }
                    } else {
                      setProvince(province.name)
                      await loadCity(province.code)
                    }
                  }}
                  searchText={'Search'}
                  cancelText={'Cancel'}
                  style={ regionData ? styles.fullWidthInput : styles.disabledFullWidthInput }
                  initValueTextStyle={[styles.initValueTextStyle, paymentMethodValue == 1 && provinceData && { color: UMColors.black }]}
                  searchStyle={styles.searchStyle}
                  selectStyle={ regionData ? styles.selectStyle1 : styles.disabledSelectStyle }
                  selectTextStyle={styles.selectTextStyle}
                  sectionTextStyle={styles.sectionTextStyle}
                  cancelStyle={styles.cancelStyle}
                  cancelTextStyle={styles.cancelTextStyle}
                  overlayStyle={styles.overlayStyle}
                  touchableActiveOpacity={styles.touchableActiveOpacity}
                />
              </View>
              <View style={styles.mainWidthContainer}>
                <ModalSelector
                  disabled={!cityList}
                  data={cityList}
                  keyExtractor= {city => city.code}
                  labelExtractor= {city => city.name}
                  initValue={paymentMethodValue == 1 ? cityData || !cityData && "Select City" : "Select City"}
                  onChange={async(city) => {
                    if(paymentMethodValue == 1){
                      if(cityData !== city.name){
                        setBarangay('')
                        setCity(city.name)
                        await loadBarangay(city.code)
                      } else {
                        setCity(city.name)
                      }
                    } else {
                      setCity(city.name)
                      await loadBarangay(city.code)
                    }
                  }}
                  searchText={'Search'}
                  cancelText={'Cancel'}
                  style={ provinceData ? styles.fullWidthInput : styles.disabledFullWidthInput } 
                  initValueTextStyle={[styles.initValueTextStyle, paymentMethodValue == 1 && cityData && { color: UMColors.black }]}
                  searchStyle={styles.searchStyle}
                  selectStyle={ provinceData ? styles.selectStyle1 : styles.disabledSelectStyle }
                  selectTextStyle={styles.selectTextStyle}
                  sectionTextStyle={styles.sectionTextStyle}
                  cancelStyle={styles.cancelStyle}
                  cancelTextStyle={styles.cancelTextStyle}
                  overlayStyle={styles.overlayStyle}
                  touchableActiveOpacity={styles.touchableActiveOpacity}
                />
              </View>
              <View style={styles.mainWidthContainer}>
                <ModalSelector
                  disabled={!barangayList}
                  data={barangayList}
                  keyExtractor= {barangay => barangay.code}
                  labelExtractor= {barangay => barangay.name}
                  initValue={paymentMethodValue == 1 ? barangayData || !barangayData && "Select Province" : "Select Barangay"}
                  onChange={(barangay) => {
                    setBarangay(barangay.name)
                  }}
                  searchText={'Search'}
                  cancelText={'Cancel'}
                  style={ cityData ? styles.fullWidthInput : styles.disabledFullWidthInput } 
                  initValueTextStyle={[styles.initValueTextStyle, paymentMethodValue == 1 && barangayData && { color: UMColors.black }]}
                  searchStyle={styles.searchStyle}
                  selectStyle={ cityData ? styles.selectStyle1 : styles.disabledSelectStyle }
                  selectTextStyle={styles.selectTextStyle}
                  sectionTextStyle={styles.sectionTextStyle}
                  cancelStyle={styles.cancelStyle}
                  cancelTextStyle={styles.cancelTextStyle}
                  overlayStyle={styles.overlayStyle}
                  touchableActiveOpacity={styles.touchableActiveOpacity}
                />
              </View>
              <TouchableOpacity
                disabled={!checkChequeInputs()}
                style={[styles.confirmBtn, checkChequeInputs() && { backgroundColor: UMColors.primaryOrange }]}
                onPress={() => onChequePayment()}
              >
                <Text style={styles.confirmBtnTxt}>
                  Continue
                </Text>
              </TouchableOpacity>
            </View>
        }
        </View>
      )
  }

  const renderOnlinePayment = () => {
    return (
      <View style={styles.onlinePayContainer}>
        <View style={styles.amountContainer}>
          <Text style={styles.phpTxt}>PHP</Text>
          <TextInput
            value={amountToPay}
            style={styles.amountTxtInput}
            onEndEditing={() => setAmountToPay(moneyFormat(parseFloat(amountToPay)).toString())}
            onFocus={() => setAmountToPay(amountToPay.replaceAll(',', ''))}
            inputMode='numeric'
            onChangeText={(value) => setAmountToPay(value)}
          />
        </View>
        <View style={styles.onlineToPayContainer}>
          <Text style={styles.onlineToPayTxt}>{'To Pay:  ₱ ' + moneyFormat(userDetailsData?.outstanding_balance)}</Text>
        </View>
        <View style={styles.selectPaymentContainer}>
          <View style={styles.selectPaymentTxtContainer}>
            <Image
              style={{ width: 20, height: 20 }}
              source={UMIcons.creditCardLogo}
              resizeMode='contain'
            />
            <Text style={styles.selectPaymentTxt}>Select payment method</Text>
          </View>
          {renderShowCards()}
          <TouchableOpacity
            style={styles.selectPaymentBtn}
            onPress={() => {
              navigate('PaymentMethodScreen')
            }}
          >
            <Text style={styles.paymentTitle}>Other Payment Method</Text>
            <Image
              style={styles.otherPaymentArrowImage}
              source={UMIcons.backIconOrange}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          disabled={!checkOnlinePaymentInputs()}
          style={[styles.confirmBtn, checkOnlinePaymentInputs() && { backgroundColor: UMColors.primaryOrange }]}
          onPress={() => navigate('ReviewPaymentScreen', { selectedPaymentMethod: selectedPaymentMethod, price: amountToPay.replaceAll(',', '')} )}
        >
          <Text style={styles.confirmBtnTxt}>
            Pay
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  const renderShowCards = () => {
    const defaultPaymentMethod = paymentMethod.find(data => data.default === true);

    if(!defaultPaymentMethod) {
      return (
        <Text style={styles.noPayMethodTxt}>No Primary Payment Method Available</Text>
      )
    } else {
      return (
        <TouchableOpacity
          style={styles.selectPaymentBtn}
          onPress={() => {
            setSelectedPaymentMethod(defaultPaymentMethod)
          }}
        >
          <View style={styles.radioBtnSection}>
            <RadioButton
              value={defaultPaymentMethod?.id}
              status={selectedPaymentMethod?.id === defaultPaymentMethod?.id ? 'checked' : 'unchecked'}
              onPress={() => {
                setSelectedPaymentMethod(defaultPaymentMethod)
              }}
              color={UMColors.primaryOrange}
              uncheckedColor={UMColors.primaryOrange}
            />
            <Text style={styles.paymentTitle}>{capitalizeFirst(defaultPaymentMethod.cardType.replace('-', ''))}</Text>
            <Text style={styles.cardNumber}>{'**** ' + defaultPaymentMethod.last4}</Text>
          </View>
          <Image
            style={styles.paymentLogo}
            source={defaultPaymentMethod.cardType == 'visa' ? UMIcons.visaLogo : defaultPaymentMethod.cardType == 'master-card' ? UMIcons.masterCardLogo : UMIcons.creditCardLogo}
            resizeMode={'contain'}
          />
        </TouchableOpacity>
      )
    }
  }

  const bottomSheet = () => {
    return(
      <RBSheet
        ref={setRef}
        height={deviceHeight / 4.5}
        openDuration={250}
        customStyles={{
          container: {
            justifyContent: "center",
            alignItems: "center",
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
          }
        }}
      >
        <TouchableOpacity
          style={styles.rbSheetBtn}
          onPress={() => onPressImage()}
        >
          <Text style={styles.rbSheetText}>Take a photo</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.rbSheetBtn}
          onPress={() => onChooseGallery()}
        >
          <Text style={styles.rbSheetText}>Choose from gallery</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.rbSheetBtn}
          onPress={() => RBSheetRef.current.close()}
        >
          <Text style={[styles.rbSheetText, { color: UMColors.red }]}>Cancel</Text>
        </TouchableOpacity>
      </RBSheet>
    )
  }

  const dateModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={dateModalVisible}
        onRequestClose={() => setDateModalVisible(false) }
      >
        <View style={styles.centeredView}>
          <DateTimePicker
            display="default" 
            mode="date"
            minimumDate={new Date().setDate(new Date().getDate())}
            themeVariant="light"
            value={date}
            onChange={onChangeDate}
          />
        </View>
      </Modal>
    )
  }

  const timeModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={timeModalVisible}
        onRequestClose={() => setTimeModalVisible(false) }
      >
        <View style={styles.centeredView}>
          <DateTimePicker 
            display="default" 
            mode="time"
            themeVariant="light"
            is24Hour={false}
            value={time}
            onChange={onChangeTime}
          />
        </View>
      </Modal>
    )
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.mainContainer}>
        <ErrorWithCloseButtonModal/>
        <ErrorOkModal
          Visible={error.value}
          ErrMsg={error.message}
          OkButton={() => setError({ value: false, message: '' })}
        />
        <CustomNavbar
          Title={'Payment Method'}
        />
        <View style={styles.bodyContainer}>
          <DropDownPicker
            placeholder="Select Payment Method"
            placeholderStyle={styles.placeholderStyle}
            style={[styles.typeDropdownStyle, { position: 'relative', zIndex: 0}]}
            containerStyle={[styles.typeDropdownContainerStyle, { zIndex: 1 }]}
            open={paymentMehodOpen} 
            items={paymentCategoryItems}
            value={paymentMethodValue}
            setOpen={() => {
              setPaymentMehodOpen(!paymentMehodOpen)}}
            setValue={setPaymentMethodValue}
            setItems={setPaymentCategoryItems}
            onChangeValue={() => paymentMethodChanged()}
          />
          { !paymentMethodValue && renderToPay()}
          { paymentMethodValue == 1 && renderChequePayment()}
          { paymentMethodValue == 2 && renderOnlinePayment()}
          { paymentMethodValue == 3 && renderChequePayment()}
        </View>
        {dateModal()}
        {timeModal()}
        {bottomSheet()}
        <Loader/>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: UMColors.BGOrange,
    alignItems: 'center'
  },
  bodyContainer: {
    width: deviceWidth,
    height: '100%',
    alignItems: 'center',
  },
  placeholderStyle: {
    color: UMColors.primaryGray
  },
  typeDropdownStyle: {
    paddingLeft: 20,
    borderRadius: 5,
  },
  typeDropdownContainerStyle: {
    width: '85%',
    marginTop: 30
  },
  toPayContainer: {
    width: '85%',
    backgroundColor: UMColors.white, 
    height: 90,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    borderRadius: 5,
    zIndex: 0,
    elevation: 7
  },
  toPayTxt: {
    fontSize: 15,
    marginLeft: 12,
    color: UMColors.black
  },
  balanceTxt: {
    color: UMColors.primaryOrange,
    fontSize: 24,
    fontWeight: '500',
    marginRight: 12
  },
  confirmBtn: {
    position: 'absolute',
    bottom: 0,
    width: deviceWidth / 1.20,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: UMColors.primaryGray,
    elevation: 7
  },
  confirmBtnTxt: {
    fontSize: 18,
    color: UMColors.white,
    fontWeight: 'bold'
  },
  checkContainer: {
    width: '85%',
    marginTop: 10,
    alignItems: 'center',
    height: '72%'
  },
  onlinePayContainer: {
    width: '90%',
    marginTop: 20,
    alignItems: 'center',
    height: '72%',
  },
  uploadCheckBtn: {
    width: deviceWidth / 1.25,
    height: 140,
    borderWidth: 1.5,
    borderRadius: 10,
    borderColor: UMColors.primaryOrange,
    backgroundColor: UMColors.white,
    justifyContent: 'center',
    alignItems: 'center'
  },
  uploadCheckBtnTxt: {
    fontSize: 14,
    color: UMColors.primaryGray
  },
  regionZipContainer: {
    marginTop: 10, 
    flexDirection: 'row',
    width: deviceWidth / 1.1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainWidthContainer: {
    marginTop: 10, 
    width: deviceWidth / 1.1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 18,
    color: 'black',
    marginBottom: '5%',
    fontWeight: 'bold'
  }, 
  fullWidthInput: {
    backgroundColor: 'white',
    width: '95%',
    height: 50,
    borderRadius: 25,
    borderColor: 'rgb(223,131,68)',
    borderWidth: 1,
  },
  regionInput: {
    width: '67%',
  },
  zipInput: {
    backgroundColor: 'white',
    width: '25%',
    height: 50,
    borderRadius: 25,
    borderColor: 'rgb(223,131,68)',
    borderWidth: 1,
    textAlign: 'center',
    marginLeft: '3%'
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
    width: '95%',
    height: 48,
    borderRadius: 25,
    borderColor: UMColors.white,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: '5%'
  },
  selectStyle2: {
    backgroundColor: 'white',
    width: '95%',
    height: 50,
    borderRadius: 25,
    borderColor: 'rgb(223,131,68)',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: '8%'
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
    padding: '5%', 
    justifyContent: 'center', 
    backgroundColor: 'rgba(0,0,0,0.7)' 
  },
  disabledFullWidthInput: {
    backgroundColor: 'rgb(222, 223, 228)',
    width: '95%',
    height: 50,
    borderRadius: 25,
    borderColor: 'rgb(223,131,68)',
    borderWidth: 1,
  },
  disabledSelectStyle: {
    backgroundColor: 'rgb(222, 223, 228)',
    width: '95%',
    height: 48,
    borderRadius: 25,
    borderWidth: 0,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: '5%'
  },
  rbSheetBtn: {
    width: deviceWidth / 1.4,
    height: '22%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10
  },
  rbSheetText: {
    fontSize: 17,
    color: UMColors.primaryOrange
  },
  //Online Payment 
  amountContainer: {
    width: '100%',
    borderWidth: 1,
    borderColor: UMColors.primaryOrange,
    backgroundColor: UMColors.white,
    height: 90,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 10
  },
  amountTxtInput: {
    width: '80%',
    height: '80%',
    textAlign: 'right',
    fontSize: 30,
    marginRight: 10,
  },
  phpTxt: {
    marginLeft: 15,
    fontSize: 10,
    height: '70%',
    textAlignVertical: 'bottom'
  },
  onlineToPayContainer: {
    marginTop: 15,
    marginLeft: 10,
    width: deviceWidth / 1.1
  },
  onlineToPayTxt:{
    fontSize: 14,
    color: UMColors.black
  },
  selectPaymentContainer: {
    width: '100%',
    marginTop: 20
  },
  selectPaymentTxtContainer: {
    flexDirection: 'row',
    marginLeft: 10,
    alignItems: 'center'
  },
  selectPaymentTxt: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: 'bold'
  },
  selectPaymentBtn: {
    flexDirection: 'row',
    height: 60,
    width: '100%',
    borderBottomWidth: 0.5,
    borderBottomColor: UMColors.primaryGray,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15
  },
  radioBtnSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentTitle: {
    fontSize: 15,
    color: UMColors.black,
  },
  paymentLogo: {
    width: 40,
    height: 40
  },
  otherPaymentArrowImage: {
    width: 14,
    height: 14,
    transform: [
      { scaleX: -1 }
    ]
  },
  nextBtn: {
    width: '88%',
    justifyContent: 'center',
    alignItems: 'center',
    height: 55,
    borderRadius: 50,
    position: 'absolute',
    bottom: 60
  },
  nextBtnTxt: {
    fontSize: 16,
    fontWeight: 'bold',
    color: UMColors.white
  },
  noPayMethodTxt: {
    alignSelf: 'center', 
    fontSize: 15, 
    padding: 20, 
    color: UMColors.primaryGray
  },
  cardNumber: {
    fontSize: 10,
    color: UMColors.primaryGray,
    marginLeft: 10
  },
  dateInput: {
    backgroundColor: UMColors.white,
    width: '51%',
    marginRight: 7,
    height: 50,
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
    width: '42%',
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: UMColors.primaryOrange,
    paddingLeft: '5%',
    paddingRight: '5%',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row'
  },
  blurContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)'
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
})