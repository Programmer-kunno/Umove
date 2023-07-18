import React, { Component, useEffect, useRef, useState }  from 'react';
import { 
  StyleSheet, 
  View, 
  Image, 
  Text, 
  TextInput, 
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
  ScrollView
} from 'react-native';
import { CustomerApi } from '../../../api/customer';
import { TextSize, emailRegex, mobileNumberRegex, normalize } from '../../../utils/stringHelper';
import { UMColors } from '../../../utils/ColorHelper';
import { UMIcons } from '../../../utils/imageHelper';
import { Loader } from '../../Components/Loader';
import { setLoading } from '../../../redux/actions/Loader';
import { dispatch } from '../../../utils/redux';
import { showError } from '../../../redux/actions/ErrorModal';
import ErrorWithCloseButtonModal from '../../Components/ErrorWithCloseButtonModal';
import KeyboardAvoidingView from '../../Components/KeyboardAvoidingView';
import { navigate } from '../../../utils/navigationHelper';
import { FetchApi } from '../../../api/fetch';
import ModalSelector from 'react-native-modal-selector-searchable';

const deviceWidth = Dimensions.get('screen').width

export default SignUpScreen1 = (props) => { 

  const [registerData, setRegisterData] = useState({})
  const [regionList, setRegionList] = useState([])
  const [provinceList, setProvinceList] = useState([])
  const [cityList, setCityList] = useState([])
  const [barangayList, setBarangayList] = useState([])
  const [error, setError] = useState({ value: false, message: '' })
  const scrollViewScroll = useRef()
  const setScrollViewScroll = (ref) => { scrollViewScroll.current = ref; }

  useEffect(() => {
    setRegisterData(props.route?.params?.register)
    loadRegion()
    dispatch(setLoading(false))
    
  }, [])

  const register = async() => {
    dispatch(setLoading(true))
    if(!emailRegex(registerData?.email)){
      setError({value: true, message: "Please enter a valid email"})
      dispatch(setLoading(false))
    } else if(!mobileNumberRegex(registerData?.mobileNumber)) {
      setError({value: true, message: "Please enter a valid contact number"})
      dispatch(setLoading(false))
    } else {
      let res = await CustomerApi.signUp(registerData)
      if(res == undefined){
        dispatch(setLoading(false))
        dispatch(showError(true))
      } else {
        if(res?.data?.message?.username) {
          setError({value: true, message: "Username already taken"})
          dispatch(setLoading(false))
        } else if(res?.data?.message?.email) {
          setError({value: true, message: res?.data?.message?.email[0] == "This field must be unique." ? "Email Already Taken" : res?.data?.message?.email[0] })
          dispatch(setLoading(false))
        } else if(res?.data?.message?.mobile_number) {
          setError({value: true, message: "Contact Number already taken"})
          dispatch(setLoading(false))
        } else {
          dispatch(setLoading(false))
          setError({value: false, message: ''})
          if(registerData.customerType == 'corporate'){
            navigate('SignUpScreen2', { register: registerData })
          } else {
            navigate('SignUpScreen4', { register: registerData })
          }
        }
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

  const checkIsEmptyInputs = () => {
    if( registerData.firstName == '' || registerData.lastName == '' || 
        registerData.username == '' || registerData.email == '' || 
        registerData.mobileNumber == '' || registerData.streetAddress == '' || 
        registerData.region == '' || registerData.zipcode == '' ||
        registerData.province == '' || registerData.city == '' ||
        registerData.barangay == '' ){
      return true 
    } else {
      return false
    }
  }

  const renderUserInfoInputs = () => {
    return (
      <ScrollView
        ref={setScrollViewScroll} 
        style={styles.middleContainer} 
        contentContainerStyle={{ alignItems: 'center', paddingBottom: 50 }}
      >
        <View style={styles.inputPart}> 
          <Text style={styles.inputTitleTxt}>First Name</Text>
          <TextInput
            style={styles.input}
            onChangeText={(val) => setRegisterData({ ...registerData, firstName: val })} 
          />
        </View>
        <View style={styles.inputPart}> 
          <Text style={styles.inputTitleTxt}>Middle Name</Text>
          <TextInput
            style={styles.input}
            onChangeText={(val) => setRegisterData({ ...registerData, middleName: val })}  
            placeholder='Optional' 
          />
        </View>
        <View style={styles.inputPart}> 
          <Text style={styles.inputTitleTxt}>Last Name</Text>
          <TextInput
            style={styles.input}
            onChangeText={(val) => setRegisterData({ ...registerData, lastName: val })}                        
          />
        </View>
        <View style={styles.inputPart}> 
          <Text style={styles.inputTitleTxt}>Username</Text>
          <TextInput
            style={styles.input}
            onChangeText={(val) => {
              setRegisterData({ ...registerData, username: val })
            }}
          />
        </View>
        <View style={styles.inputPart}> 
          <Text style={styles.inputTitleTxt}>Email Address</Text>
          <TextInput
            importantForAutofill='no'
            style={styles.input}
            keyboardType='email-address'
            onChangeText={(val) => setRegisterData({ ...registerData, email: val })}                        
          />
        </View>
        <View style={styles.inputPart}> 
          <Text style={styles.inputTitleTxt}>Mobile Number</Text>
          <View style={{ flexDirection: 'row', width: '100%', height: 45 }}>
            <TextInput
              style={styles.mobileNumberCodeInput}
              editable={false}
              placeholder={'+63'}
            />
            <TextInput
              style={styles.mobileNumberInput}
              keyboardType='number-pad'
              onChangeText={(val) => setRegisterData({ ...registerData, mobileNumber: '+' + 63 + val })}
              maxLength={10}
            />
          </View>
        </View>
        <View style={styles.billingContainer}>
          <View style={[styles.inputContainer]}>
            {/* Header */}
            <Text style={styles.title}>
              Billing / Legal Address
            </Text>
            
              {/* Street Address */}
              <TextInput
                style={[styles.fullWidthInput, { paddingHorizontal: 18 }]}
                onChangeText={(val) => setRegisterData({ ...registerData, streetAddress: val })}
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
                setRegisterData({ ...registerData, region: region.name })
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
                setRegisterData({ ...registerData, zipcode: val })
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
              disabled={!registerData.region}
              data={provinceList}
              keyExtractor= {province => province.code}
              labelExtractor= {province => province.name}
              initValue="Select Province"
              onChange={(province) => {
                setRegisterData({ ...registerData, province: province.name })
                loadCity(province.code)
              }}  
              searchText={'Search'}
              cancelText={'Cancel'}
              style={registerData.region !== '' ? styles.fullWidthInput : styles.disabledFullWidthInput}
              initValueTextStyle={styles.initValueTextStyle}
              searchStyle={styles.searchStyle}
              selectStyle={registerData.region !== '' ? styles.selectStyle1 : styles.disabledSelectStyle}
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
              disabled={!registerData.province}
              data={cityList}
              keyExtractor= {city => city.code}
              labelExtractor= {city => city.name}
              initValue="Select City"
              onChange={(city) => {
                setRegisterData({ ...registerData, city: city.name })
                loadBarangay(city.code)
              }}  
              searchText={'Search'}
              cancelText={'Cancel'}
              style={registerData.province !== '' ? styles.fullWidthInput : styles.disabledFullWidthInput}
              initValueTextStyle={styles.initValueTextStyle}
              searchStyle={styles.searchStyle}
              selectStyle={registerData.province !== '' ? styles.selectStyle1 : styles.disabledSelectStyle}
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
              disabled={!registerData.city}
              data={barangayList}
              keyExtractor= {barangay => barangay.code}
              labelExtractor= {barangay => barangay.name}
              initValue="Select Barangay"
              onChange={(barangay) => {
                setRegisterData({ ...registerData, barangay: barangay.name})
              }} 
              searchText={'Search'}
              cancelText={'Cancel'}
              style={registerData.city !== '' ? styles.fullWidthInput : styles.disabledFullWidthInput}
              initValueTextStyle={styles.initValueTextStyle}
              searchStyle={styles.searchStyle}
              selectStyle={registerData.city !== '' ? styles.selectStyle1 : styles.disabledSelectStyle}
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
    <KeyboardAvoidingView>
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
            <Text style={styles.signUpText}>Sign Up</Text>
            {error.value && <View style={styles.errorContainer}><Text style={styles.errorMessage}>{error.message}</Text></View>}
          </View>

          {renderUserInfoInputs()}

          {/* Next Button */}
          <View style={styles.footerContainer}>
            <View style={styles.nextBtnContainer}>
              {/* Make button gray when not all inputs are filled out, orange when filled out */}
              <TouchableOpacity 
                style={[styles.signUpButton, !checkIsEmptyInputs() && {backgroundColor: UMColors.primaryOrange}]} 
                disabled={checkIsEmptyInputs()}
                onPress={() => register()}
              >
                <Text style={styles.signUpButtonText}>NEXT</Text>
              </TouchableOpacity>
            </View>

            {/* Login with */}
            <View style={styles.bottomContainer}>
              <Text style={styles.signUpWithText}> or Sign Up with </Text>
              <View style={styles.row}>
                <TouchableOpacity onPress={() => alert('Sign Up w/ google')}>
                  <Image
                    source={UMIcons.googleIcon}
                    style={styles.socials}
                    resizeMode={'contain'}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => alert('Sign Up w/ facebook')}>
                  <Image
                    source={UMIcons.facebookIcon}
                    style={styles.socials}
                    resizeMode={'contain'}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => alert('Sign Up w/ apple')}>  
                  <Image
                    source={UMIcons.appleIcon}
                    style={styles.socials}
                    resizeMode={'contain'}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => alert('Sign Up w/ fingerprint')}>  
                  <Image
                    source={require('../../../assets/socials/fingerprint.png')}
                    style={styles.socials}
                    resizeMode={'contain'}
                  />
                </TouchableOpacity>
              </View>
              <View style={[styles.row, { marginVertical: 15 }]}>
                  <Text style={styles.loginText}>
                    Already have an account? {" "}
                  </Text>
                  <TouchableOpacity 
                    onPress={() => {
                      navigate('Login')
                      // scrollViewScroll.current.scrollToEnd({ animated: true })
                    }}
                  >
                      <Text style={styles.underline}>
                        Log In
                      </Text>
                  </TouchableOpacity>
              </View>
            </View>
          </View>
          <Loader/>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}


const styles = StyleSheet.create({
  mainContainer: {
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: UMColors.BGOrange, 
  },
  upperContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '16%',
    marginBottom: 48,
  },
  logo: {
    height: 60,
    width: '80%',
  },
  signUpText: {
    fontSize: normalize(TextSize('L')),
    color: 'black',
  },
  middleContainer: {
    width: deviceWidth,
  },
  inputPart: {
    width: '80%',
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  inputTitleTxt: {
    fontSize: normalize(TextSize('Normal')),
    paddingLeft: 8,
    paddingVertical: 5,
    color: 'black'
  }, 
  input: {
    fontSize: normalize(TextSize('Normal')),
    height: 45,
    width: '100%',
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 25,
    borderColor: UMColors.primaryOrange,
    borderWidth: 1,
    backgroundColor: 'white',
  },
  mobileNumberCodeInput: {
    fontSize: normalize(TextSize('Normal')),
    height: '100%',
    width: '15%',
    textAlign: 'right',
    paddingVertical: 0,
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 25,
    borderTopColor: UMColors.primaryOrange,
    borderBottomColor: UMColors.primaryOrange,
    borderLeftColor: UMColors.primaryOrange,
    borderRightWidth: 0,
    borderWidth: 1,
    backgroundColor: 'white',
  },
  mobileNumberInput: {
    fontSize: normalize(TextSize('Normal')),
    height: '100%',
    width: '85%',
    paddingVertical: 0,
    borderTopRightRadius: 25,
    borderBottomRightRadius: 25,
    borderTopColor: UMColors.primaryOrange,
    borderBottomColor: UMColors.primaryOrange,
    borderLeftWidth: 0,
    borderRightColor: UMColors.primaryOrange,
    borderWidth: 1,
    backgroundColor: 'white',
    paddingLeft: 10
  },
  nextBtnContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    height: 45,
  },
  signUpButton: {
    height: '100%',
    width: '70%',
    borderRadius: 25,
    justifyContent:'center',
    alignItems: 'center',
    backgroundColor: UMColors.primaryGray,
    elevation: 5
  },
  bottomContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  signUpButtonText: {
    color: 'white',
    fontSize: normalize(TextSize('Normal')),
    fontWeight:'bold'
  },
  signUpWithText: {
    color: 'black',
    fontSize: normalize(TextSize('Normal')),
    marginVertical: 15
  },
  socials: {
    marginHorizontal: 8,
    height: 25,
    width: 25
  },
  row: {
    flexDirection: 'row',
  },
  loginText: {
    color: 'black',
    fontSize: normalize(TextSize('Normal')),
  },
  underline: {
    color: 'black',
    fontSize: normalize(TextSize('Normal')),
    textDecorationLine: 'underline',
  },
  errorContainer:{
    width: '70%',
    height: 35,
    borderWidth: 2,
    borderRadius: 5,
    borderColor: UMColors.red,
    backgroundColor: '#ffcdd2',
    position: 'absolute',
    bottom: -40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  errorMessage:{
    fontSize: normalize(TextSize('Normal')),
    textAlign: 'center',
    color: '#d32f2f'
  },
  footerContainer: {
    width: deviceWidth, 
    elevation: 20,
    paddingVertical: 10,
    backgroundColor: UMColors.BGOrange,
    shadowColor: UMColors.black,
  },
  billingContainer: {
    marginTop: 30,
    width: '90%',
    justifyContent: 'center'
  },
  row: {
    flexDirection: 'row',
  },
  marginTop: {
    marginTop: '2%'
  },
  inputContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: normalize(TextSize('L')),
    color: 'black',
    marginBottom: 10,
  }, 
  fullWidthInput: {
    fontSize: normalize(TextSize('Normal')),
    backgroundColor: 'white',
    width: '90%',
    height: 45,
    borderRadius: 25,
    borderColor: 'rgb(223,131,68)',
    borderWidth: 1,
  },
  regionInput: {
    width: '62%',
  },
  zipInput: {
    backgroundColor: 'white',
    width: '25%',
    height: 45,
    borderRadius: 25,
    borderColor: 'rgb(223,131,68)',
    borderWidth: 1,
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
  disabledFullWidthInput: {
    backgroundColor: 'rgb(222, 223, 228)',
    width: '90%',
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
})