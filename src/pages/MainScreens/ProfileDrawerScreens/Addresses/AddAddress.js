import { 
  SafeAreaView, 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  Dimensions, 
  TouchableOpacity, 
  TouchableWithoutFeedback, 
  Keyboard 
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { UMColors } from '../../../../utils/ColorHelper'
import CustomNavbar from '../../../Components/CustomNavbar'
import { FetchApi } from '../../../../api/fetch'
import { dispatch } from '../../../../utils/redux'
import { showError } from '../../../../redux/actions/ErrorModal'
import ModalSelector from 'react-native-modal-selector-searchable'
import { Image } from 'react-native-elements'
import { UMIcons } from '../../../../utils/imageHelper'
import { refreshTokenHelper } from '../../../../api/helper/userHelper'
import { CustomerApi } from '../../../../api/customer'
import { setLoading } from '../../../../redux/actions/Loader'
import { goBack } from '../../../../utils/navigationHelper'
import ErrorWithCloseButtonModal from '../../../Components/ErrorWithCloseButtonModal'
import ErrorOkModal from '../../../Components/ErrorOkModal'
import SuccessOkModal from '../../../Components/SuccessOkModal'
import { Loader } from '../../../Components/Loader'
import { mobileNumberRegex } from '../../../../utils/stringHelper'
import { useIsFocused } from '@react-navigation/native'

const deviceWidth = Dimensions.get('screen').width

export default AddAddress = (props) => {
  const addressData = props.route.params?.addressData
  const addressID = props.route.params?.addressData?.id
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [mobileNumber, setMobileNumber] = useState('')
  const [barangay, setBarangay] = useState('')
  const [barangayCode, setBarangayCode] = useState('')
  const [city, setCity] = useState('')
  const [cityCode, setCityCode] = useState('')
  const [province, setProvince] = useState('')
  const [provinceCode, setProvinceCode] = useState('')
  const [region, setRegion] = useState('')
  const [regionCode, setRegionCode] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [landmark, setLandmark] = useState('')
  const [regionList, setRegionList] = useState()
  const [provinceList, setProvinceList] = useState()
  const [cityList, setCityList] = useState()
  const [barangayList, setBarangayList] = useState()
  const [selectedLabel, setSelectedLabel] = useState('')
  const [customLabel, setCustomLabel] = useState('')
  const isFocused = useIsFocused()
  const [error, setError] = useState({
    value: false,
    message: ''
  })
  const [success, setSuccess] = useState({
    value: false,
    message: ''
  })
  const labelList = [
    {
      name: 'Home',
      image: UMIcons.homeIcon
    },
    {
      name: 'Work',
      image: UMIcons.workIcon
    },
    {
      name: 'Favorite',
      image: UMIcons.heartIcon
    },
    {
      name: 'Other',
      image: UMIcons.plusIcon
    },
  ]

  useEffect(() => {
    if(isFocused){
      if(props.route.params?.addressData){
        setName(addressData.name)
        setAddress(addressData.address)
        setRegion(addressData.region)
        setProvince(addressData.province)
        setCity(addressData.city)
        setBarangay(addressData.barangay)
        setZipCode(addressData.zip_code)
        setLandmark(addressData.landmark)
        setMobileNumber(addressData.mobile_number.replace('+63', ''))
        if(addressData.label === 'Home' || addressData.label === 'Work' || addressData.label === 'Favorite' ){
          setSelectedLabel(addressData.label)
        } else {
          setSelectedLabel('Other')
          setCustomLabel(addressData.label)
        }
      }
      loadRegion()
    }
  }, [isFocused])

  const loadRegion = async() => {
    let response = await FetchApi.regions()
    if(response == undefined){
      dispatch(showError(true))
    } else {
      if(response?.data?.success) {
        let regionList = response?.data?.data
        if(region){
          regionList.map((item, index) => {
            if(item.name === region){
              setRegionCode(item.code)
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
        console.log('wow')
        let provinceList = response?.data?.data
        if(province){
          provinceList.map((item, index) => {
           if(item.name === province){
             setProvinceCode(item.code)
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
        if(city){
          cityList.map((item, index) => {
           if(item.name === city){
             setCityCode(item.code)
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

  const saveAddress = () => {
    dispatch(setLoading(true))
    const data = {
      label: selectedLabel === 'Other' ? customLabel : selectedLabel,
      name: name,
      mobile_number: '+63' + mobileNumber,
      address: address,
      region: region,
      province: province,
      city: city,
      barangay: barangay,
      zip_code: zipCode,
      landmark: landmark
    }
    refreshTokenHelper(async() => {
      const response = await CustomerApi.createSavedAddresses(data)
      if(response == undefined){
        dispatch(showError(true))
        dispatch(setLoading(false))
      } else {
        if(response?.data?.success){
          setSuccess({ value: true, message: 'Address Added'})
          dispatch(setLoading(false))
        } else {
          setError({ value: true, message: response?.data?.message || response?.data })
          dispatch(setLoading(false))
        }
      }
    })
  }

  const updateAddress = () => {
    dispatch(setLoading(true))
    const data = {
      label: selectedLabel === 'Other' ? customLabel : selectedLabel,
      name: name,
      mobile_number: '+63' + mobileNumber,
      address: address,
      region: region,
      province: province,
      city: city,
      barangay: barangay,
      zip_code: zipCode,
      landmark: landmark
    }
    refreshTokenHelper(async() => {
      const response = await CustomerApi.updateSavedAddresses(addressID, data)
      if(response == undefined){
        dispatch(showError(true))
        dispatch(setLoading(false))
      } else {
        if(response?.data?.success){
          setSuccess({ value: true, message: 'Address Updated'})
          dispatch(setLoading(false))
        } else {
          setError({ value: true, message: response?.data?.message || response?.data })
          dispatch(setLoading(false))
        }
      }
    })
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
        <SuccessOkModal
          Visible={success.value}
          SuccessMsg={success.message}
          OkButton={() => {
            setSuccess({ value: false, message: '' })
            goBack()
          }}
        />
        <CustomNavbar
          Title={addressID ? 'Update Address' : 'Add Address'}
        />
        <View style={styles.bodyContainer}>
          <View style={styles.fullWidthContainer}>
            <TextInput
              value={name}
              style={[styles.fullWidthInput, styles.marginTop, { paddingLeft: '5%' }]}
              onChangeText={(name) => {
                setName(name)
              }}
              placeholder="Name"
              placeholderTextColor={'#808080'}
            />
          </View>
          <View style={styles.fullWidthContainer}>
            <View style={{ flexDirection: 'row', width: '90%', height: 40 }}>
              <TextInput
                style={styles.mobileNumberCodeInput}
                editable={false}
                placeholder={'+63'}
                placeholderTextColor={'#808080'}
              />
              <TextInput
                style={styles.mobileNumberInput}
                value={mobileNumber}
                keyboardType='number-pad'
                onChangeText={(val) => {
                  setMobileNumber(val)
                }}
                maxLength={10}
              />
            </View>
          </View>
          <View style={styles.fullWidthContainer}>
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
              keyExtractor= {newRegion => newRegion.code}
              labelExtractor= {newRegion => newRegion.name}
              initValue={ addressData ? region : "Select Region"}
              onChange={async(newRegion) => {
                await loadProvince(newRegion.code)
                region === newRegion.name ?
                    setRegion(newRegion.name)
                  :
                    setRegion(newRegion.name)
                    setProvince('')
                    setCity('')
                    setBarangay('')
              }}  
              searchText={'Search'}
              cancelText={'Cancel'}
              style={styles.regionInput}
              initValueTextStyle={[styles.initValueTextStyle, addressData && { color: UMColors.black }]}
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
              value={zipCode}
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
          <View style={styles.fullWidthContainer}>
            {
              region ?
              <ModalSelector
                data={provinceList}
                onModalOpen={async() => {
                  await loadProvince(regionCode);
                }}
                keyExtractor= {newProvince => newProvince.code}
                labelExtractor= {newProvince => newProvince.name}
                initValue={ addressData ? province : "Select Province"}
                onChange={async(newProvince) => {
                  await loadCity(newProvince.code)
                  province === newProvince.name ?
                    setProvince(newProvince.name)
                  :
                    setProvince(newProvince.name)
                    setCity('')
                    setBarangay('')
                }}
                searchText={'Search'}
                cancelText={'Cancel'}
                style={styles.fullWidthInput}
                initValueTextStyle={[styles.initValueTextStyle, addressData && { color: UMColors.black }]}
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
          <View style={styles.fullWidthContainer}>
            {
              province ?
              <ModalSelector
                data={cityList}
                onModalOpen={async() => {
                  await loadCity(provinceCode);
                }}
                keyExtractor= {newCity => newCity.code}
                labelExtractor= {newCity => newCity.name}
                initValue={ addressData ? city : "Select City"}
                onChange={async(newCity) => {
                  await loadBarangay(newCity.code)
                  city === newCity.name ?
                    setCity(newCity.name)
                  :
                    setCity(newCity.name)
                    setBarangay('')
                }}
                searchText={'Search'}
                cancelText={'Cancel'}
                style={styles.fullWidthInput}
                initValueTextStyle={[styles.initValueTextStyle, addressData && { color: UMColors.black }]}
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
                data={cityList}
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
          <View style={styles.fullWidthContainer}>
            {
              city ?
              <ModalSelector
                data={barangayList}
                onModalOpen={async() => {
                  await loadBarangay(cityCode);
                }}
                keyExtractor= {newBarangay => newBarangay.code}
                labelExtractor= {newBarangay => newBarangay.name}
                initValue={ addressData ? barangay : "Select Barangay"}
                onChange={(newBarangay) => {
                  setBarangay(newBarangay.name)
                }}
                searchText={'Search'}
                cancelText={'Cancel'}
                style={styles.fullWidthInput}
                initValueTextStyle={[styles.initValueTextStyle, addressData && { color: UMColors.black }]}
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
                data={barangayList}
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
          <View style={styles.fullWidthContainer}>
            <TextInput
              textAlignVertical={'top'}
              multiline={true}
              style={[styles.fullWidthInput, styles.marginTop, { paddingLeft: '4%', paddingRight: '3%', height: 80, borderRadius: 20 }]}
              onChangeText={(data) => {
                setLandmark(data)
              }}
              placeholder="Landmark (Optional)"
              placeholderTextColor={'#808080'}
            />
          </View>
          <View style={[styles.fullWidthContainer, { marginTop: 17 }]}>
            <Text style={styles.labelTitle}>Choose Label</Text>
            <View style={styles.labelListContainer}>
              {
                labelList.map((data, index) => (
                  <TouchableOpacity 
                    key={index}
                    style={[styles.labelBtn, { backgroundColor: selectedLabel == data.name ? UMColors.primaryOrange : UMColors.white }]}
                    onPress={() => {
                      setSelectedLabel(data.name)
                    }}
                  >
                    <Image
                      style={{ width: 25, height: 25, tintColor: selectedLabel == data.name ? UMColors.white : UMColors.primaryOrange }}
                      source={data.image}
                      resizeMode='contain'
                    />
                    <Text style={styles.labelTxt}>{data.name}</Text>
                  </TouchableOpacity>
                ))
              }
            </View>
            {
              selectedLabel === 'Other' &&
                <TextInput
                  style={styles.otherTxtInput}
                  value={customLabel}
                  placeholder='eg. Neighbor'
                  onChangeText={(textData) => {
                    setCustomLabel(textData)
                  }}
                />
            }
          </View>
        </View>
        <TouchableOpacity
          style={[styles.updateBtn, 
            { backgroundColor: !name || !mobileNumber || !address || !region || !zipCode || !province || !city || !barangay || !selectedLabel ? 
                UMColors.primaryGray : UMColors.primaryOrange }]}
          disabled={ !name || !mobileNumber || !address || !region || !zipCode || !province || !city || !barangay || !selectedLabel ? true : false }
          onPress={() => {
            if(!mobileNumberRegex('+63' + mobileNumber)){
              setError({ value: true, message: 'Mobile Number is not valid!' })
            } else {
              if(selectedLabel === 'Other' && customLabel === ''){
                setError({ value: true, message: 'Custom label must not left empty!' })
              } else {
                if(addressID){
                  updateAddress()
                } else {
                  saveAddress()
                }
              }
            }
          }}
        >
          <Text style={styles.updateBtnTxt}>Save</Text>
        </TouchableOpacity>
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
  componentContainer: {
    width: deviceWidth / 1.2,
    alignItems: 'center'
  },
  TitleTxt: {
    fontSize: 18,
    marginTop: 20,
    fontWeight: 'bold'
  },
  valueTxtInput: {
    borderWidth: 1,
    borderColor: UMColors.primaryOrange,
    width: '80%',
    height: 40,
    borderRadius: 50,
    paddingLeft: 20,
    backgroundColor: UMColors.white,
    fontSize: 13,
    marginBottom: 10
  },
  updateBtn: {
    width: '90%',
    height: 40,
    backgroundColor: UMColors.primaryOrange,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    position: 'absolute',
    bottom: 40,
    elevation: 7
  },
  updateBtnTxt: {
    color: UMColors.white,
    fontSize: 15,
    fontWeight: 'bold'
  },
  bodyContainer: {
    width: deviceWidth,
    alignItems: 'center',
  },
  regionZipContainer: {
    marginTop: 10, 
    flexDirection: 'row',
    width: deviceWidth / 1.1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidthContainer: {
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
    width: '90%',
    height: 40,
    borderRadius: 25,
    borderColor: 'rgb(223,131,68)',
    borderWidth: 1,
    paddingLeft: '2%'
  },
  regionInput: {
    width: '62%',
  },
  zipInput: {
    backgroundColor: 'white',
    width: '25%',
    height: 40,
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
    backgroundColor: 'white',
    width: '100%',
    height: 38,
    borderRadius: 25,
    borderWidth: 0,    
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  selectStyle2: {
    backgroundColor: 'white',
    width: '100%',
    height: 40,
    borderRadius: 25,
    borderColor: 'rgb(223,131,68)',
    borderWidth: 1,    
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
    padding: '5%', 
    justifyContent: 'center', 
    backgroundColor: 'rgba(0,0,0,0.7)' 
  },
  disabledFullWidthInput: {
    backgroundColor: 'rgb(222, 223, 228)',
    width: '90%',
    height: 40,
    borderRadius: 25,
    borderColor: 'rgb(223,131,68)',
    borderWidth: 1,
    paddingLeft: '2%'
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
  labelTitle: {
    fontSize: 15,
    fontWeight: 'bold'
  },
  labelBtn: {
    width: 42,
    height: 42,
    marginHorizontal: 8,
    marginTop: 15,
    backgroundColor: UMColors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    elevation: 10
  },
  labelTxt: {
    position: 'absolute',
    fontSize: 11,
    fontWeight: 'bold',
    bottom: -22
  },
  labelListContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  otherTxtInput: {
    backgroundColor: UMColors.white,
    width: '80%',
    height: 37,
    borderWidth: 1,
    borderColor: UMColors.primaryOrange,
    borderRadius: 50,
    marginTop: 30,
    paddingLeft: 20
  },
  mobileNumberCodeInput: {
    fontSize: 13,
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
    fontSize: 13,
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
})