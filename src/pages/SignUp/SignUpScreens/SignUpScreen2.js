import React, { Component, useEffect, useRef, useState }  from 'react';
import { 
  StyleSheet, 
  View, 
  Image, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  PermissionsAndroid,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  Dimensions,
  ScrollView
} from 'react-native';
import ModalSelector from 'react-native-modal-selector-searchable'
import ImagePicker from 'react-native-image-crop-picker';
import { FetchApi }  from '../../../api/fetch'
import { TextSize, emailRegex, mobileNumberRegex, normalize} from '../../../utils/stringHelper';
import { UMColors } from '../../../utils/ColorHelper';
import { dispatch } from '../../../utils/redux';
import { showError } from '../../../redux/actions/ErrorModal';
import ErrorWithCloseButtonModal from '../../Components/ErrorWithCloseButtonModal';
import DocumentPicker from 'react-native-document-picker'
import { navigate } from '../../../utils/navigationHelper';
import { useIsFocused } from '@react-navigation/native';
import { UMIcons } from '../../../utils/imageHelper';
import getPath from '@flyerhq/react-native-android-uri-path';

const deviceWidth = Dimensions.get('screen').width

export default SignUpScreen2 = (props) => {  

  const [registerData, setRegisterData] = useState({})
  const [companyTypeList, setCompanyTypeList] = useState([])
  const [regionList, setRegionList] = useState([])
  const [provinceList, setProvinceList] = useState([])
  const [cityList, setCityList] = useState([])
  const [barangayList, setBarangayList] = useState([])
  const [error, setError] = useState({ value: false, message: '' })
  const scrollViewScroll = useRef()
  const setScrollViewScroll = (ref) => { scrollViewScroll.current = ref; }
  const isFocused = useIsFocused()

  useEffect(() => {
    if(isFocused){
      setRegisterData(props.route?.params?.register)
      loadComapnyType()
      loadRegion()
    }
  }, [isFocused])

  const signUpNext = () => {
    if(!emailRegex(registerData.companyEmail)) {
      setError({ value: true, message: "Please enter a valid email" });
    } 
    else if(!mobileNumberRegex(registerData.companyMobileNumber)) {
      setError({ value: true, message: "Please enter a valid contact number" });
    } else {
      // console.log('success')
      navigate('SignUpScreen3', { register: registerData })
    }
  }

  const loadComapnyType = async() => {
    let response = await FetchApi.companyTypes()
    if(response == undefined){
      dispatch(showError(true))
    } else {
      if(response?.data?.success) {
        setCompanyTypeList(response?.data?.data)
      } else {
        console.log(response.message)
      }
    }
  }

  const loadRegion = async() => {
    let response = await FetchApi.regions()
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
    let response = await FetchApi.provinces(regionCode)
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
    let response = await FetchApi.cities(provinceCode)
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
    let response = await FetchApi.barangays(cityCode)
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

  const selectCompanyLogo = async() => {
    try {
      if(Platform.OS === 'android') {
        const OsVer = Platform.constants['Release']
        let data;
        if(OsVer <= 12){
          data = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE); 
        } else {
          data = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES);
        }
        
        if (data === "granted") {
          const response = await DocumentPicker.pick({
            type: [DocumentPicker.types.images],
          });
          const origPath = getPath(response[0].uri)
          const fileOrigPath = `file://${origPath}`
          setRegisterData({ ...registerData, companyLogo: { path: fileOrigPath, name: response[0].name, type: response[0].type }})
        }
      } else {
        const response = await DocumentPicker.pick({
          type: [DocumentPicker.types.images],
        });
        const origPath = getPath(response[0].uri)
        setRegisterData({ ...registerData, companyLogo: { path: origPath, name: response[0].name, type: response[0].type }})
      }
    } catch (err) {
      console.warn(err);
    }
  }

  const checkIsEmptyInputs = () => {
    if( registerData.companyLogo == undefined || registerData.companyName == '' || 
        registerData.companyType == '' || registerData.companyEmail == '' || 
        registerData.companyMobileNumber == '' || registerData.companyAddress == '' ||
        registerData.officeRegion == '' || registerData.officeZipcode == '' ||
        registerData.officeProvince == '' || registerData.officeCity == '' ||
        registerData.officeBarangay == '' || registerData.officeAddress == '' ){
      return true 
    } else {
      return false
    }
  }

  const renderScrollBody = () => {
    return (
      <ScrollView 
        ref={setScrollViewScroll} 
        style={styles.bodyContainer} 
        contentContainerStyle={{ alignItems: 'center', paddingBottom: 10 }}
      >
        <View style={styles.inputContainer}>        
          {/* Company Name */}
          <TextInput
            style={[styles.input, { paddingHorizontal: 20 }]}
            onChangeText={(val) => setRegisterData({ ...registerData, companyName: val })}
            placeholder='Company Name'
            placeholderTextColor={'#808080'}
          />
        </View>

        {/* Company Email */}
        <View style={styles.inputContainer}>                        
          <TextInput
            importantForAutofill='no'
            style={[styles.input, { paddingHorizontal: 20 }]}
            keyboardType='email-address'
            onChangeText={(val) => {
              setRegisterData({ ...registerData, companyEmail: val })
              setError({ value: false, message: '' })
            }}
            placeholder='Company Email Address'
            placeholderTextColor={'#808080'}
          />
        </View>

        {/* Company Mobile Number */}
        <View style={styles.inputContainer}>                    
          <TextInput
            style={[styles.input, { paddingHorizontal: 20 }]}
            keyboardType='number-pad'
            onChangeText={(val) => {
              setRegisterData({ ...registerData, companyMobileNumber: val })
              setError({ value: false, message: '' })
            }}
            placeholder='Company Mobile Number'
            placeholderTextColor={'#808080'}
            maxLength={11}
          />
        </View>

        {/* Company Address */}
        <View style={styles.inputContainer}>                
          <TextInput
            style={[styles.input, { paddingHorizontal: 20 }]}
            onChangeText={(val) => setRegisterData({ ...registerData, companyAddress: val })}
            placeholder='Building Name, Block, Lot, Street'
            placeholderTextColor={'#808080'}
            />
        </View>

        {/* Company Type */}
        <View style={[styles.inputContainer, styles.row]}>
          <ModalSelector
            data={companyTypeList}
            keyExtractor= {companyType => companyType.id}
            labelExtractor= {companyType => companyType.type_name}
            initValue="Select Company Type"
            onChange={(companyType) => setRegisterData({ ...registerData, companyType: companyType.id })} 
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
        </View>
        <View style={styles.officeAddressContainer}>
          <View style={[styles.inputContainer]}>
            {/* Header */}
            <Text style={styles.title}>
              Office Address
            </Text>
            
              {/* Street Address */}
              <TextInput
                style={[styles.fullWidthInput, { paddingHorizontal: 18 }]}
                onChangeText={(val) => {
                  setRegisterData({ ...registerData, officeAddress: val })
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
              keyExtractor= {region => region.code}
              labelExtractor= {region => region.name}
              initValue="Select Region"
              onChange={(region) => {
                setRegisterData({ ...registerData, officeRegion: region.name })
                loadProvince(region.code)
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
                setRegisterData({ ...registerData, officeZipcode: val })
              }}  
              placeholder='ZIP Code'
              placeholderTextColor={'#808080'}                        
              keyboardType='number-pad'
              returnKeyType='done'
              maxLength={4}
            />
          </View>

          {/* Province */}
          <View style={[styles.inputContainer, styles.marginTop]}>
            <ModalSelector
              disabled={!registerData.officeRegion}
              data={provinceList}
              keyExtractor= {province => province.code}
              labelExtractor= {province => province.name}
              initValue="Select Province"
              onChange={(province) => {
                setRegisterData({ ...registerData, officeProvince: province.name })
                loadCity(province.code)
              }}  
              searchText={'Search'}
              cancelText={'Cancel'}
              style={registerData.officeRegion !== '' ? styles.fullWidthInput : styles.disabledFullWidthInput}
              initValueTextStyle={styles.initValueTextStyle}
              searchStyle={styles.searchStyle}
              selectStyle={registerData.officeRegion !== '' ? styles.selectStyle1 : styles.disabledSelectStyle}
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
              disabled={!registerData.officeProvince}
              data={cityList}
              keyExtractor= {city => city.code}
              labelExtractor= {city => city.name}
              initValue="Select City"
              onChange={(city) => {
                setRegisterData({ ...registerData, officeCity: city.name })
                loadBarangay(city.code)
              }}  
              searchText={'Search'}
              cancelText={'Cancel'}
              style={registerData.officeProvince !== '' ? styles.fullWidthInput : styles.disabledFullWidthInput}
              initValueTextStyle={styles.initValueTextStyle}
              searchStyle={styles.searchStyle}
              selectStyle={registerData.officeProvince !== '' ? styles.selectStyle1 : styles.disabledSelectStyle}
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
              disabled={!registerData.officeCity}
              data={barangayList}
              keyExtractor= {barangay => barangay.code}
              labelExtractor= {barangay => barangay.name}
              initValue="Select Barangay"
              onChange={(barangay) => {
                setRegisterData({ ...registerData, officeBarangay: barangay.name})
              }} 
              searchText={'Search'}
              cancelText={'Cancel'}
              style={registerData.officeCity !== '' ? styles.fullWidthInput : styles.disabledFullWidthInput}
              initValueTextStyle={styles.initValueTextStyle}
              searchStyle={styles.searchStyle}
              selectStyle={registerData.officeCity !== '' ? styles.selectStyle1 : styles.disabledSelectStyle}
              selectTextStyle={styles.selectTextStyle}
              sectionTextStyle={styles.sectionTextStyle}
              cancelStyle={styles.cancelStyle}
              cancelTextStyle={styles.cancelTextStyle}
              overlayStyle={styles.overlayStyle}
            />
          </View>
        </View> 
      </ScrollView>
    )
  }

  return(
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <View style={styles.mainContainer}>
      <ErrorWithCloseButtonModal/>
      {/* Logo */}
      <View style={styles.upperContainer}>
        <Image
          source={require('../../../assets/logo/logo-primary.png')}
          style={styles.logo}
          resizeMode={'contain'}
        />
        <Text style={styles.upperContainerTitle}>Company Profile</Text>
        <TouchableOpacity 
          style={styles.companyLogoContainer}
          onPress={() => {
            selectCompanyLogo()
            console.log(registerData)
          }}
        >
          <Image
            style={{ width: '95%', height: registerData.companyLogo ? '95%' : 70 }}
            source={registerData.companyLogo ? { uri: registerData.companyLogo?.path } : UMIcons.uploadLogoImage}
            resizeMode='contain'
          />
        </TouchableOpacity>
        {error.value ? <View style={styles.errorContainer}><Text style={styles.errorMessage}>{error.message}</Text></View> : <View style={styles.nonErrorContainer}/>}
      </View>

      {renderScrollBody()}
      

      {/* Next Button */}
      <View style={styles.nextButtonContainer}>
        {/* Make button gray when not all inputs are filled out, orange when filled out */}
        <TouchableOpacity 
          style={[styles.nextButton, !checkIsEmptyInputs() && {backgroundColor: UMColors.primaryOrange}]} 
          disabled={checkIsEmptyInputs()}
          onPress={() => signUpNext()}
        >
          <Text style={styles.nextButtonText}>NEXT</Text>
        </TouchableOpacity>
      </View>
    </View>
    </TouchableWithoutFeedback>
  )
}


const styles = StyleSheet.create({
  mainContainer: {
    flex: 1, 
    alignItems: 'center',
    backgroundColor: UMColors.BGOrange,
  },
  upperContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '16%',
  },
  logo: {
    height: 60,
    width: '80%',
  },
  upperContainerTitle: {
    fontSize: normalize(TextSize('L')),
    color: 'black',
    marginVertical: 10
  },
  row: {
    flexDirection: 'row',
  },
  bodyContainer: {
    width: deviceWidth,
  },
  inputContainer: {
    width: '80%',
    marginVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: normalize(TextSize('Normal')),
    color: 'black',
    fontWeight: 'bold'
  }, 
  fullWidthInput: {
    fontSize: normalize(TextSize('Normal')),
    backgroundColor: 'white',
    width: '100%',
    height: 45,
    borderRadius: 25,
    borderColor: 'rgb(223,131,68)',
    borderWidth: 1,
  },
  regionInput: {
    width: '68%',
  },
  zipInput: {
    fontSize: normalize(TextSize('Normal')),
    backgroundColor: 'white',
    width: '25%',
    height: 50,
    borderRadius: 25,
    textAlign: 'center',
    marginLeft: '3%'
  },
  initValueTextStyle: {
    fontSize: normalize(TextSize('Normal')),
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
    height: 42,
    borderRadius: 25,
    borderWidth: 0,    
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 18
  },
  selectStyle2: {
    backgroundColor: 'white',
    height: 45,
    borderRadius: 25,
    borderColor: 'rgb(223,131,68)',
    borderWidth: 1,    
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 18
  },
  zipInput: {
    backgroundColor: 'white',
    width: '30%',
    height: 45,
    borderRadius: 25,
    borderColor: 'rgb(223,131,68)',
    borderWidth: 1,
    textAlign: 'center',
    marginLeft: '3%'
  },
  selectTextStyle: {
    fontSize: normalize(TextSize('Normal')),
    color: 'black'
  },
  sectionTextStyle: {
    fontSize: normalize(TextSize('Normal')),
    fontWeight: '500'
  },
  cancelStyle: {
    justifyContent: 'center',
    height: 50,
  },
  cancelTextStyle: {
    color: 'red',
    fontSize: normalize(TextSize('Normal')),
    fontWeight: '500'
  },
  overlayStyle: {
    flex: 1, 
    padding: '5%', 
    justifyContent: 'center', 
    backgroundColor: 'rgba(0,0,0,0.7)' 
  },
  nextButton: {
    height: 45,
    width: '70%',
    borderRadius: 25,
    marginTop: 15,
    justifyContent:'center',
    alignItems: 'center',
    backgroundColor: UMColors.primaryGray,
    elevation: 5
  },
  nextButtonText: {
    color: 'white',
    fontSize: normalize(TextSize('Normal')),
    fontWeight:'bold'
  },
  nextButtonContainer: {
    height: '20%',
    width: '100%',
    alignItems: 'center',
    elevation: 20,
    backgroundColor: UMColors.BGOrange
  },
  errorContainer:{
    width: '70%',
    height: 35,
    borderWidth: 2,
    borderRadius: 5,
    borderColor: UMColors.red,
    backgroundColor: '#ffcdd2',
    alignItems: 'center',
    justifyContent: 'center'
  },
  nonErrorContainer:{
    width: '70%',
    height: 35,
    borderWidth: 2,
    borderRadius: 5,
    borderColor: UMColors.BGOrange,
    backgroundColor: UMColors.BGOrange,
  },
  errorMessage:{
    fontSize: normalize(TextSize('Normal')),
    textAlign: 'center',
    color: '#d32f2f'
  },
  companyLogoContainer: {
    borderWidth: 2,
    borderColor: UMColors.primaryOrange,
    borderRadius: 5,
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: UMColors.BGOrange,
    marginBottom: 5,
    elevation: 7
  },
  officeAddressContainer: {
    marginTop: 30,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: normalize(TextSize('L')),
    color: 'black',
    marginBottom: 10,
  },
  disabledFullWidthInput: {
    backgroundColor: 'rgb(222, 223, 228)',
    width: '100%',
    height: 45,
    borderRadius: 25,
    borderColor: 'rgb(223,131,68)',
    borderWidth: 1,
  },
  disabledSelectStyle: {
    backgroundColor: 'rgb(222, 223, 228)',
    width: '100%',
    height: 42,
    borderRadius: 25,
    paddingHorizontal: 18,
    borderWidth: 0,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  input: {
    fontSize: normalize(TextSize('Normal')),
    height: 45,
    width: '100%',
    paddingLeft: 20,
    paddingRight: 20,
    paddingVertical: 0,
    borderRadius: 25,
    borderColor: UMColors.primaryOrange,
    borderWidth: 1,
    backgroundColor: 'white',
  },
})