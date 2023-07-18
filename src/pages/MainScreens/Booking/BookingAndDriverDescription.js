import { 
  Text, 
  View, 
  StyleSheet, 
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView
} from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { UMColors } from '../../../utils/ColorHelper'
import RBSheet from 'react-native-raw-bottom-sheet'
import { navigate, resetNavigation } from '../../../utils/navigationHelper';
import { UMIcons } from '../../../utils/imageHelper';
import { openNumber } from '../../../utils/phone';
import { TextSize, normalize } from '../../../utils/stringHelper';

const deviceWidth = Dimensions.get('screen').width

export default BookingAndDriverDescription = (props) => {

  const [bookingData, setBookingData] = useState(null)
  const [appointmentData, setAppointmentData] = useState(null)
  const [userProfileData, setUserProfileData] = useState(null)
  const [userVehicleData, setUserVehicleData] = useState(null)
  const [driverLocation, setDriverLocation] = useState(null)
  const [visibleDetailsModal, setVisibleDetailsModal] = useState(false)
  const [selectedItemIndex, setSelectedItemIndex] = useState(0)
  const RBSheetRef = useRef(null)

  const setRef = (ref) => {
    RBSheetRef.current = ref;
  }

  useEffect(() => {
    init()
  }, [])

  const init = () => {
    setBookingData(props.route.params?.booking)
    setAppointmentData(props.route.params?.booking?.booking_routes[0]?.booking_appointments[0])
    setUserVehicleData(props.route.params?.booking?.booking_routes[0]?.booking_appointments[0]?.vehicle)
    setUserProfileData(props.route.params?.booking?.booking_routes[0]?.booking_appointments[0]?.driver?.user?.user_profile)
  }

  const onPressCall = () => {
    openNumber(userProfileData.mobile_number)
  }

  const onPressChat = () => {
    navigate('ChatScreen', { data: userProfileData.account_number })
  }

  const bookDetailsModal = () => {
    if(!bookingData?.booking_items) {
      return null
    } else {
      return(
        <RBSheet
          ref={setRef}
          height={320}
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
          <View style={styles.mdlDetailsContainer}>
            <Text style={styles.mdlTitle}>Booking Information</Text>
            <ScrollView 
              style={styles.mdlItemPagesContainer}
              contentContainerStyle={{ alignItems: 'center' }}
              horizontal={true}
            >
              {
                bookingData?.booking_items.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.mdlItemPagesBtn, index === selectedItemIndex && { backgroundColor: UMColors.primaryOrange }]}
                    onPress={() => setSelectedItemIndex(index)}
                  >
                    <Text style={styles.mdlItemPagesTxt}>{'Item ' + (index + 1)}</Text>
                  </TouchableOpacity>
                ))
              }
            </ScrollView>
            <View style={styles.mdlInfoContainer}>
              <View style={styles.mdlInfo}>
                <Text style={styles.mdlInfoTxtLeft}>Type of Goods:</Text>
                <Text style={styles.mdlInfoTxtLeft}>Packaging Type:</Text>
                <Text style={styles.mdlInfoTxtLeft}>Quantity:</Text>
                <Text style={styles.mdlInfoTxtLeft}>Weight:</Text>
                <Text style={styles.mdlInfoTxtLeft}>Lenght:</Text>
                <Text style={styles.mdlInfoTxtLeft}>Width:</Text>
                <Text style={styles.mdlInfoTxtLeft}>Heigth:</Text>
              </View>
              <View style={[styles.mdlInfo, { alignItems: 'flex-end' }]}>
                <Text style={styles.mdlInfoTxtRight}>{bookingData?.booking_items[selectedItemIndex]?.subcategory.value}</Text>
                <Text style={styles.mdlInfoTxtRight}>{bookingData?.booking_items[selectedItemIndex]?.uom.value}</Text>
                <Text style={styles.mdlInfoTxtRight}>{bookingData?.booking_items[selectedItemIndex]?.quantity}</Text>
                <Text style={styles.mdlInfoTxtRight}>{bookingData?.booking_items[selectedItemIndex]?.weight}</Text>
                <Text style={styles.mdlInfoTxtRight}>{bookingData?.booking_items[selectedItemIndex]?.length}</Text>
                <Text style={styles.mdlInfoTxtRight}>{bookingData?.booking_items[selectedItemIndex]?.width}</Text>
                <Text style={styles.mdlInfoTxtRight}>{bookingData?.booking_items[selectedItemIndex]?.height}</Text>
              </View>
            </View>
          </View>
        </RBSheet>
      )
    }
  }

  return (
    <View style={styles.mainContainer}>
      {
        appointmentData !== null &&
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <View style={styles.mainLogoContainer}>
            <Image
              style={styles.headerLogo}
              source={UMIcons.mainLogo}
              resizeMode={'contain'}
            />  
          </View>
          <View style={styles.courierDetailsContainer}>
            <View style={styles.courierDetails}>
              <View style={styles.driverDetails}>
                <Text style={{ fontSize: normalize(TextSize('Normal')), fontWeight: 'bold'}}>{userProfileData?.first_name + ' ' + userProfileData?.last_name}</Text>
                <Text style={{ fontSize: normalize(TextSize('S')), marginBottom: '10%' }}>{userProfileData?.mobile_number}</Text>
                <Image
                  style={{ width: '80%', height: '60%', borderRadius: 15 }}
                  source={{ uri: userProfileData?.profile_image }}
                  resizeMode={'contain'}
                />
              </View>
              <View style={styles.rideDetails}>
                <Image 
                  style={{ width: '80%', height: '60%', borderRadius: 15 }}
                  source={{ uri: userVehicleData?.vehicle_image[0]?.image }}
                  resizeMode={'contain'}
                />
                <Text style={{fontSize: normalize(TextSize('Normal')), marginTop: '10%'}}>{userVehicleData?.plate_number}</Text>
                <Text style={{fontSize: normalize(TextSize('S'))}}>{userVehicleData?.vehicle_name}</Text>
              </View>
            </View>
            <View style={styles.vacStatusContainer}>
                <Image
                  style={{ height: '80%', marginRight: 10 }}
                  source={UMIcons.fullVaccinatedIcon}
                  resizeMode={'contain'}
                />
                <Text style={{ fontSize: normalize(TextSize('M')), fontWeight: 'bold'}}>Fully Vaccinated</Text>
            </View>
          </View>
          <View style={styles.contactDriverContainter}>
            <TouchableOpacity
              style={styles.contactBtn}
              onPress={() => onPressCall()}
            >
              <Image
                style={{ width: '90%' }}
                source={UMIcons.callIcon}
                resizeMode={'contain'}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.contactBtn}
              onPress={() => onPressChat()}
            >
              <Image
                style={{ width: '90%' }}
                source={UMIcons.messageIcon}
                resizeMode={'contain'}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.contactBtn}
              onPress={() => {
                navigate('BookingDriverLocation', {
                  bookingNumber: bookingData?.booking_number,
                  destination: {
                    latitude: bookingData?.booking_routes[0]?.destination_latitude,
                    longitude: bookingData?.booking_routes[0]?.destination_longitude
                  },
                  origin: {
                    latitude: bookingData?.booking_routes[0]?.origin_latitude,
                    longitude: bookingData?.booking_routes[0]?.origin_longitude
                  },
                  driverLocation: driverLocation
                })
              }}
            >
              <Image
                style={{ width: '90%' }}
                source={UMIcons.locationIcon}
                resizeMode={'contain'}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.bookingDetailsContainer}>
            <Text style={{ fontSize: normalize(TextSize('L')), color: 'rgb(223,131,68)', fontWeight: '400' }}>{bookingData?.status}</Text>
            <View style={styles.bookigRefContainer}>
              <Text style={styles.bookingRefTxt}>Booking No.</Text>
              <Text style={[styles.bookingRefTxt, { textAlign: 'right' }]}>{bookingData?.booking_number}</Text>
            </View>
          </View>
          <View style={styles.bottomBtnContainer}>
            <TouchableOpacity
              style={styles.bottomBtn}
              onPress={() => {
                RBSheetRef.current.open()
                setVisibleDetailsModal(true)
              }}
            >
              <Text style={styles.btmBtnTxt}>View Details</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.bottomBtn}
              onPress={() => {
                resetNavigation('DrawerNavigation')
              }}
            >
              <Text style={styles.btmBtnTxt}>Okay</Text>
            </TouchableOpacity>
          </View>
        </View>
      }
      {bookDetailsModal()}
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'rgb(238, 241, 217)',
    alignItems: 'center'
  },
  mainLogoContainer: {
    marginTop: '5%',
    height: '7%',
  },
  headerLogo: {
    height: '100%',
  },
  courierDetailsContainer: {
    marginTop: '5%',
    height: '34%',
    width: '90%'
  },
  courierDetails: {
    width: '100%',
    height: '80%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  rideDetails: {
    width: '45%',
    height: '90%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  driverDetails: {
    justifyContent: 'center',
    width: '45%',
    height: '90%',
    alignItems: 'center',
  },
  vacStatusContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: '20%'
  },
  contactDriverContainter: {
    width: '90%',
    height: '8%',
    marginTop: '5%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly'
  },
  contactBtn: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5
  },
  bookingDetailsContainer: {
    width: '90%',
    height: '15%',
    marginTop: '10%',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  bookigRefContainer: {
    width: '90%',
    height: '70%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  bookingRefTxt: {
    width: '45%',
    fontSize: normalize(TextSize('M')),
    marginTop: '5%'
  },
  bottomBtnContainer: {
    marginTop: '10%',
    width: '90%',
    height: '10%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly'
  },
  bottomBtn: {
    height: '65%',
    width: 140,
    borderRadius: 10,
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgb(223,131,68)',
  },
  btmBtnTxt: {
    fontSize: normalize(TextSize('M')),
    color: 'white',
    fontWeight: '500'
  },
  mdlMainContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  mdlDetailsContainer: {
    width: '100%',
    height: '108%',
    alignItems: 'center'
  },
  mdlTitle: {
    marginTop: '7%',
    fontSize: normalize(TextSize('M')),
    fontWeight: 'bold',
  },
  mdlInfoContainer: {
    width: '95%',
    height: '75%',
    flexDirection: 'row'
  },
  mdlInfo: {
    width: '50%',
    height: '100%',
  },
  mdlInfoTxtLeft: {
    fontSize: normalize(TextSize('Normal')),
    marginTop: '6%',
    marginLeft: '12%',
  },
  mdlInfoTxtRight: {
    fontSize: normalize(TextSize('Normal')),
    marginTop: '6%',
    marginRight: '12%',
    fontWeight: 'bold',
    color: UMColors.primaryOrange
  },
  mdlItemPagesContainer: {
    height: 30,
    width: '80%',
    marginTop: 7,
  },
  mdlItemPagesBtn: {
    backgroundColor: UMColors.primaryGray,
    padding: 5,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    marginRight: 5
  },
  mdlItemPagesTxt: {
    fontSize: normalize(TextSize('Normal')),
    color: UMColors.white,
  }
})
