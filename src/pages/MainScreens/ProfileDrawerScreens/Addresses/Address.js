import { 
  View, 
  Text, 
  SafeAreaView, 
  StyleSheet, 
  Image,
  Dimensions,
  ScrollView
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { UMColors } from '../../../../utils/ColorHelper'
import CustomNavbar from '../../../Components/CustomNavbar'
import { UMIcons } from '../../../../utils/imageHelper'
import { refreshTokenHelper } from '../../../../api/helper/userHelper'
import { CustomerApi } from '../../../../api/customer'
import { dispatch } from '../../../../utils/redux'
import { showError } from '../../../../redux/actions/ErrorModal'
import { setLoading } from '../../../../redux/actions/Loader'
import ErrorWithCloseButtonModal from '../../../Components/ErrorWithCloseButtonModal'
import ErrorOkModal from '../../../Components/ErrorOkModal'
import { Loader } from '../../../Components/Loader'
import { navigate } from '../../../../utils/navigationHelper'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useIsFocused } from '@react-navigation/native'
import ConfirmationModal from '../../../Components/ConfirmationModal'
import { Searchbar } from 'react-native-paper'

const deviceWidth = Dimensions.get('screen').width
const deviceHeight = Dimensions.get('screen').height

export default Address = (props) => {
  const navigatingTo = props?.route?.params?.from
  const currentBooking = props?.route?.params?.booking
  const [addresses, setAddresses] = useState([])
  const isFocused = useIsFocused()
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedAddressID, setSelectedAddressID] = useState(0)
  const [searchValue, setSearchValue] = useState('')
  const [error, setError] = useState({ value: false, message: '' })

  useEffect(() => {
    if(isFocused){
      console.log(currentBooking)
      getSavedAddresses()
    }
  }, [isFocused])

  const getSavedAddresses = () => {
    dispatch(setLoading(true))
    refreshTokenHelper(async() => {
      const response = await CustomerApi.getSavedAddresses()
      if(response == undefined){
        dispatch(showError(true))
        dispatch(setLoading(false))
      } else {
        if(response?.data?.success){
          setAddresses(response?.data?.data)
          dispatch(setLoading(false))
        } else {
          setError({ value: true, message: response?.data?.message || response?.data})
          dispatch(setLoading(false))
        }
      }
    })
  }

  const deleteAddress = (addressID) => {
    dispatch(setLoading(true))
    refreshTokenHelper(async() => {
      const response = await CustomerApi.deleteSavedAddress(addressID)
      if(response == undefined){
        dispatch(showError(true))
        dispatch(setLoading(false))
      } else {
        if(response?.data?.success){
          getSavedAddresses()
          dispatch(setLoading(false))
        } else {
          setError({ value: true, message: response?.data?.message || response?.data})
          dispatch(setLoading(false))
        }
      }
    })
  }

  const renderEmptyAddress = () => {
    return (
      <View style={styles.noSavedContainer}>
        <Image
          style={styles.noSavedAddressesImg}
          source={UMIcons.noSavedAddresses}
          resizeMode='contain'
        />
      </View>
    )
  }

  const renderAddresses = () => {
    const searchArr =  addresses.filter( 
      item => item.formatted_address.toLowerCase().includes(searchValue.toLowerCase()) 
              || 
              item.label.toLowerCase().includes(searchValue.toLowerCase())
              ||
              item.address.toLowerCase().includes(searchValue.toLowerCase())
              ||
              item.barangay.toLowerCase().includes(searchValue.toLowerCase())
      );

    return (
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        style={{ width: deviceWidth }} 
        contentContainerStyle={{ alignItems: 'center' }}
      >
        {
          searchArr.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={[styles.addressCardContainer, searchArr.length === index + 1 && { marginBottom: 20 }]}
              onPress={() => {
                if(navigatingTo === 'pickUp'){
                  console.log(item)
                  navigate('BookingPickUpScreen', { 
                    booking: {
                      ...currentBooking,
                      pickupName: item.name,
                      pickupRegion: item.region,
                      pickupCity: item.city,
                      pickupProvince: item.province,
                      pickupBarangay: item.barangay,
                      pickupStreetAddress: item.address,
                      pickupZipcode: item.zip_code,
                      pickupLatitude: item.latitude,
                      pickupLongitude: item.longitude,
                      fromSaveAddress: true
                    }
                  })
                }
                if(navigatingTo === 'dropOff'){
                  navigate('BookingDropOffScreen', { 
                    booking: {
                      ...currentBooking,
                      dropoffName: item.name,
                      dropoffRegion: item.region,
                      dropoffCity: item.city,
                      dropoffProvince: item.province,
                      dropoffBarangay: item.barangay,
                      dropoffStreetAddress: item.address,
                      dropoffZipcode: item.zip_code,
                      dropoffLatitude: item.latitude,
                      dropoffLongitude: item.longitude,
                      fromSaveAddress: true
                    }
                  })
                }
              }}
            >
              <Image
                style={{width: 20, height: 20, marginTop: 5, tintColor: UMColors.primaryOrange }}
                resizeMode='contain'
                source={ 
                  item.label === 'Home' ? UMIcons.homeIcon :
                  item.label === 'Work' ? UMIcons.workIcon : 
                  item.label === 'Favorite' ? UMIcons.heartIcon :
                  UMIcons.addressIcon
                }
              />
              <View style={styles.addressDetailContainer}>
                <Text style={styles.labelTxt}>{item.label.toUpperCase()}</Text>
                <Text style={styles.addressTxt}>
                  {item.address + ' ' + item.barangay + ' ' + item.city + ' ' + item.province + ', ' + item.zip_code}
                </Text>
              </View>
              <View style={styles.editDeleteContainer}>
                <TouchableOpacity
                  onPress={() => {
                    navigate('AddAddress', { addressData: item })
                  }}
                >
                  <Image
                    style={{ width: 18, height: 18, tintColor: UMColors.primaryOrange }}
                    source={UMIcons.whitePencil}
                    resizeMode='contain'
                  />
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => {
                    setSelectedAddressID(item.id)
                    setModalVisible(true)
                  }}
                >
                  <Image
                    style={{ width: 18, height: 18, marginLeft: 15 }}
                    source={UMIcons.trashIcon}
                    resizeMode='contain'
                  />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        }
      </ScrollView>
    )
  }

  return (
    <SafeAreaView style={styles.mainContainer}>
      <ErrorWithCloseButtonModal/>
      <ErrorOkModal
        Visible={error.value}
        ErrMsg={error.message}
        OkButton={() => setError({ value: false, message: '' })}
      />
      <ConfirmationModal
        visible={modalVisible}
        message={'Are you sure you want to delete this address?'}
        onYes={() => {
          setModalVisible(false)
          deleteAddress(selectedAddressID)
        }}
        onNo={() => setModalVisible(false)}
      />
      <CustomNavbar
        Title={'Addresses'}
        rightBtnImage={UMIcons.orangePlusIcon}
        onRightPress={() => navigate('AddAddress')}
      />
      <Searchbar
        placeholder="Search"
        onChangeText={(value) => setSearchValue(value)}
        value={searchValue}
        icon={() => <Image source={UMIcons.magnefyingGlassIcon} style={{ width: 15., height: 15}} resizeMode='contain'/>}
        style={styles.searchContainerStyle}
        inputStyle={styles.searchInputStyle}
        clearIcon={() => searchValue && <Image source={UMIcons.xIcon} style={{ width: 15., height: 15}} resizeMode='contain'/>}
      />
      {addresses.length == 0 ? renderEmptyAddress() : renderAddresses()}
      <Loader/>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: UMColors.BGOrange,
    alignItems: 'center'
  },
  noSavedContainer: {
    width: deviceWidth,
    height: '90%',
    justifyContent: 'center',
  },
  noSavedAddressesImg: {
    width: '100%',
    height: '18%'
  },
  addressCardContainer: {
    width: '95%',
    backgroundColor: UMColors.darkerBgOrange,
    flexDirection: 'row',
    paddingVertical: 12,
    marginTop: 12,
    justifyContent: 'space-evenly',
    elevation: 7,
    borderRadius: 5
  },
  labelTxt: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  addressTxt: {
    fontSize: 13
  },
  addressDetailContainer: {
    width: '55%'
  },
  editDeleteContainer: {
    flexDirection: 'row',
    alignSelf: 'center'
  },
  searchContainerStyle: {
    width: '95%',
    marginTop: 10,
    justifyContent:'center', 
    height: 45,
    borderRadius: 10
  },
  searchInputStyle: {
    fontSize: 15,
    minHeight: 10
  }
})