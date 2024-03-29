import { View, Text, StyleSheet, SafeAreaView, FlatList, Image, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { UMColors } from '../../../utils/ColorHelper'
import CustomNavbar from '../../Components/CustomNavbar'
import { dispatch } from '../../../utils/redux'
import { setLoading } from '../../../redux/actions/Loader'
import { FetchApi } from '../../../api/fetch'
import { showError } from '../../../redux/actions/ErrorModal'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { UMIcons } from '../../../utils/imageHelper'
import { navigate } from '../../../utils/navigationHelper'
import { Loader } from '../../Components/Loader'
import ErrorWithCloseButtonModal from '../../Components/ErrorWithCloseButtonModal'
import ErrorOkModal from '../../Components/ErrorOkModal'
import { TextSize, normalize } from '../../../utils/stringHelper'

const deviceWidth = Dimensions.get('screen').width

export default BookingSelectVehicle = (props) => {
  const bookingType = props?.route?.params?.bookingType
  const [vehicleList, setVehicleList] = useState()
  const [error, setError] = useState({
    value: false,
    message: ''
  })

  useEffect(() => {
    getVehicles()
  }, [])

  const getVehicles = async() => {
    dispatch(setLoading(true))
    const response = await FetchApi.getVehicles()
    if(response == undefined){
      dispatch(showError(true))
      dispatch(setLoading(false))
    } else {
      if(response?.data?.success){
        console.log(response.data)
        setVehicleList(response?.data?.data)
        dispatch(setLoading(false))
      } else {
        setError({ value: true, message: response?.data?.message || response?.data })
        dispatch(setLoading(false))
      }
    }
  }

  const renderVehicles = ({ item, index }) => {
    return(
      <TouchableOpacity 
        style={styles.vehicleBtn}
        onPress={() => {
          navigate('BookingItemScreen', { vehicleType: item.id, bookingType: bookingType })
        }}
      >
        <Image
          style={{ width: 120, height: 90, marginHorizontal: 25 }}
          source={
            item.type_name == 'Truck' ? UMIcons.UMoveTruckIcon : 
            item.type_name == 'Car' ? UMIcons.UMoveCarIcon :
            item.type_name == 'Motorcycle' ? UMIcons.UMoveMotorcycleIcon :
            UMIcons.UMoveTruckIcon
          }
          resizeMode='contain'
        />
        <Text style={styles.vehicleTypeTxt}>{item.type_name == 'Truck' ? 'Truck' + '(' + item.wheels_qty + 'w)' : item.type_name}</Text>
      </TouchableOpacity>
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
      <CustomNavbar
        Title={'Select Vehicle'}
      />
      <FlatList
        data={vehicleList}
        renderItem={renderVehicles}
      />
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
  vehicleBtn: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    alignItems: 'center',
    width: deviceWidth / 1.10,
    marginTop: 10
  }, 
  vehicleTypeTxt: {
    fontWeight: 'bold',
    fontSize: normalize(TextSize('Normal')),
    marginLeft: 10
  }
})