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
import GrayNavbar from '../../../Components/GrayNavbar'
import { navigate } from '../../../../utils/navigationHelper'
import { dispatch } from '../../../../utils/redux'
import { saveUserChanges } from '../../../../redux/actions/User'
import { useSelector } from 'react-redux'
import ModalSelector from 'react-native-modal-selector-searchable'
import { FetchApi } from '../../../../api/fetch'

const deviceWidth = Dimensions.get('screen').width

export default EditAddress = (props) => {
  const userChangesData = useSelector((state) => state.userOperations.userChangesData)
  const [address, setAddress] = useState('')
  const [barangay, setBarangay] = useState('')
  const [city, setCity] = useState('')
  const [province, setProvince] = useState('')
  const [region, setRegion] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [regionList, setRegionList] = useState([])
  const [provinceList, setProvinceList] = useState([])
  const [cityList, setCityList] = useState([])
  const [barangayList, setBarangayList] = useState([])

  useEffect(() => {
    loadRegion()
  }, [])

  const loadRegion = async() => {
    let response = await FetchApi.regions()
    if(response == undefined){
      dispatch(showError(true))
    } else {
      if(response?.data?.success) {
        let regionList = response?.data?.data
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

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.mainContainer}>
        <GrayNavbar
          Title={'Edit Address'}
        />
        <View style={styles.bodyContainer}>
          <Text style={styles.TitleTxt}>Billing/Legal Address</Text>
          <View style={styles.provinceContainer}>
            <TextInput
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
              labelExtractor= {region => region.name}
              initValue="Select Region"
              onChange={async(region) => {
                await loadProvince(region.code)
                setRegion(region.name)                
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
                setZipCode(val)
              }}  
              placeholder='ZIP Code'
              placeholderTextColor={'#808080'}                        
              keyboardType='number-pad'
              returnKeyType='done'
              maxLength={4}
            />
          </View>
          <View style={styles.provinceContainer}>
            {
              region ?
              <ModalSelector
                data={provinceList}
                keyExtractor= {province => province.code}
                labelExtractor= {province => province.name}
                initValue="Select Province"
                onChange={async(province) => {
                  await loadCity(province.code)
                  setProvince(province.name)
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
          <View style={styles.provinceContainer}>
            {
              province ?
              <ModalSelector
                data={cityList}
                keyExtractor= {city => city.code}
                labelExtractor= {city => city.name}
                initValue="Select City"
                onChange={async(city) => {
                  await loadBarangay(city.code)
                  setCity(city.name)
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
          <View style={styles.provinceContainer}>
            {
              city ?
              <ModalSelector
                data={barangayList}
                keyExtractor= {barangay => barangay.code}
                labelExtractor= {barangay => barangay.name}
                initValue="Select Barangay"
                onChange={(barangay) => {
                  setBarangay(barangay.name)
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
        </View>
        <TouchableOpacity
          style={[styles.updateBtn, { backgroundColor: !address || !region || !zipCode || !province || !city || !barangay ? UMColors.primaryGray : UMColors.primaryOrange }]}
          disabled={ !address || !region || !zipCode || !province || !city || !barangay ? true : false }
          onPress={() => {
            dispatch(saveUserChanges({ 
              ...userChangesData, 
              userDetails: {
                ...userChangesData.userDetails,
                address: address,
                region: region,
                zipCode: zipCode,
                province: province,
                city: city,
                barangay: barangay
              }
            }))
            navigate('UserProfileScreen')
          }}
        >
          <Text style={styles.updateBtnTxt}>Update</Text>
        </TouchableOpacity>
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
    width: '45%',
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
  provinceContainer: {
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
    height: 50,
    borderRadius: 25,
    borderColor: 'rgb(223,131,68)',
    borderWidth: 1,
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
    height: 48,
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
    borderColor: 'rgb(223,131,68)',
    borderWidth: 1,    
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
    padding: '5%', 
    justifyContent: 'center', 
    backgroundColor: 'rgba(0,0,0,0.7)' 
  },
  disabledFullWidthInput: {
    backgroundColor: 'rgb(222, 223, 228)',
    width: '90%',
    height: 50,
    borderRadius: 25,
    borderColor: 'rgb(223,131,68)',
    borderWidth: 1,
    paddingLeft: '5%'
  },
  disabledSelectStyle: {
    backgroundColor: 'rgb(222, 223, 228)',
    width: '100%',
    height: 48,
    borderRadius: 25,
    borderWidth: 0,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
})
