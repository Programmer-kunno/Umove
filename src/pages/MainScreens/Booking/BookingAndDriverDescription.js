import { 
  Text, 
  View, 
  StyleSheet, 
  Image,
  TouchableOpacity,
} from 'react-native'
import React, { Component } from 'react'
import { UMColors } from '../../../utils/ColorHelper'
import RBSheet from 'react-native-raw-bottom-sheet'
import { navigate, resetNavigation } from '../../../utils/navigationHelper';
import { dispatch } from '../../../utils/redux';
import { setLoading } from '../../../redux/actions/Loader';
import { BookingApi } from '../../../api/booking';
import { showError } from '../../../redux/actions/ErrorModal';
import { UMIcons } from '../../../utils/imageHelper';

export default class BookingAndDriverDescription extends Component {
  constructor(props){
    super(props);

    this.state = {
      booking: this.props.route?.params?.booking,
      appointment: null,
      userProfile: null,
      userVehicle: null,
      driverLocation: null,
      visibleDetailsModal: false,
    }

    this.RBSheet = null
  }

  async componentDidMount () {
    this.init()
  }

  async init() {
    const bookRes = this.state.booking
    this.setState({ 
      appointment: bookRes?.booking_routes[0]?.booking_appointments[0],
      userProfile: bookRes?.booking_routes[0]?.booking_appointments[0]?.driver?.user?.user_profile,
      userVehicle: bookRes?.booking_routes[0]?.booking_appointments[0]?.vehicle,
    })
  }

  bookDetailsModal() {
    if(!this.state.booking?.booking_items) {
      return null
    } else {
      return(
        <RBSheet
          ref={ref => this.RBSheet = ref}
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
                <Text style={styles.mdlInfoTxtRight}>{this.state.booking?.booking_items[0]?.subcategory.value}</Text>
                <Text style={styles.mdlInfoTxtRight}>{this.state.booking?.booking_items[0]?.uom.value}</Text>
                <Text style={styles.mdlInfoTxtRight}>{this.state.booking?.booking_items[0]?.quantity}</Text>
                <Text style={styles.mdlInfoTxtRight}>{this.state.booking?.booking_items[0]?.weight}</Text>
                <Text style={styles.mdlInfoTxtRight}>{this.state.booking?.booking_items[0]?.length}</Text>
                <Text style={styles.mdlInfoTxtRight}>{this.state.booking?.booking_items[0]?.width}</Text>
                <Text style={styles.mdlInfoTxtRight}>{this.state.booking?.booking_items[0]?.height}</Text>
              </View>
            </View>
          </View>
        </RBSheet>
      )
    }
  }

  render() {
    return (
      <View style={styles.mainContainer}>
        {
          this.state.appointment !== null &&
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
                  <Text style={{ fontSize: 15, fontWeight: 'bold'}}>{this.state.userProfile?.first_name + ' ' + this.state.userProfile?.last_name}</Text>
                  <Text style={{ fontSize: 12, marginBottom: '10%' }}>{this.state.userProfile?.mobile_number}</Text>
                  <Image
                    style={{ width: '80%', height: '60%', borderRadius: 15 }}
                    source={{ uri: this.state.userProfile?.profile_image }}
                    resizeMode={'contain'}
                  />
                </View>
                <View style={styles.rideDetails}>
                  <Image 
                    style={{ width: '80%', height: '60%', borderRadius: 15 }}
                    source={{ uri: this.state.userVehicle?.vehicle_image[0]?.image }}
                    resizeMode={'contain'}
                  />
                  <Text style={{fontSize: 17, marginTop: '10%'}}>{this.state.userVehicle?.plate_number}</Text>
                  <Text style={{fontSize: 12}}>{this.state.userVehicle?.vehicle_name}</Text>
                </View>
              </View>
              <View style={styles.vacStatusContainer}>
                  <Image
                    style={{ height: '80%', marginRight: 10 }}
                    source={UMIcons.fullVaccinatedIcon}
                    resizeMode={'contain'}
                  />
                  <Text style={{ fontSize: 17, fontWeight: 'bold'}}>Fully Vaccinated</Text>
              </View>
            </View>
            <View style={styles.contactDriverContainter}>
              <TouchableOpacity
                style={styles.contactBtn}
                onPress={() => {}}
              >
                <Image
                  style={{ width: '90%' }}
                  source={UMIcons.callIcon}
                  resizeMode={'contain'}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.contactBtn}
                onPress={() => {}}
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
                    bookingNumber: this.state.booking?.booking_number,
                    destination: {
                      latitude: this.state.booking?.booking_routes[0]?.destination_latitude,
                      longitude: this.state.booking?.booking_routes[0]?.destination_longitude
                    },
                    origin: {
                      latitude: this.state.booking?.booking_routes[0]?.origin_latitude,
                      longitude: this.state.booking?.booking_routes[0]?.origin_longitude
                    },
                    driverLocation: this.state.driverLocation
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
              <Text style={{ fontSize: 25, color: 'rgb(223,131,68)', fontWeight: '400' }}>On its way</Text>
              <View style={styles.bookigRefContainer}>
                <Text style={styles.bookingRefTxt}>Booking No.</Text>
                <Text style={[styles.bookingRefTxt, { textAlign: 'right' }]}>{this.state.booking?.booking_number}</Text>
              </View>
            </View>
            <View style={styles.bottomBtnContainer}>
              <TouchableOpacity
                style={styles.bottomBtn}
                onPress={() => {
                  this.RBSheet.open()
                  this.setState({ visibleDetailsModal: true })
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
        {this.bookDetailsModal()}
      </View>
    )
  }
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
    fontSize: 17,
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
    fontSize: 16,
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
    fontSize: 18,
    fontWeight: 'bold',
  },
  mdlInfoContainer: {
    width: '95%',
    height: '75%',
    marginTop: '3%',
    flexDirection: 'row'
  },
  mdlInfo: {
    width: '50%',
    height: '100%',
  },
  mdlInfoTxtLeft: {
    fontSize: 16,
    marginTop: '6%',
    marginLeft: '12%',
  },
  mdlInfoTxtRight: {
    fontSize: 16,
    marginTop: '6%',
    marginRight: '12%',
    fontWeight: 'bold',
    color: UMColors.primaryOrange
  }
})
