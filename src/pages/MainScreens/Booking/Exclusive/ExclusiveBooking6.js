import React, { Component }  from 'react';
import { 
  StyleSheet, 
  StatusBar, 
  View, 
  Image, 
  Text, 
  ActivityIndicator, 
  TouchableOpacity, 
  Dimensions,
  Modal
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { PROVIDER_GOOGLE } from 'react-native-maps';
import { BookingApi } from '../../../../api/booking';
import { returnIcon } from '../../../../utils/imageHelper';
import { moneyFormat } from '../../../../utils/stringHelper';
import { connect } from 'react-redux';
import { navigate } from '../../../../utils/navigationHelper';
import { refreshTokenHelper } from '../../../../api/helper/userHelper';
import { UMColors } from '../../../../utils/ColorHelper';
import { dispatch } from '../../../../utils/redux';
import { showError } from '../../../../redux/actions/ErrorModal';
import ErrorWithCloseButtonModal from '../../../Components/ErrorWithCloseButtonModal';
import { setLoading } from '../../../../redux/actions/Loader';
import { Loader } from '../../../Components/Loader';
import ErrorOkModal from '../../../Components/ErrorOkModal';

export class ExclusiveBooking5 extends Component {  
  constructor(props) {
    super(props);
    
    this.state = { 
      isLoading: true,
      bookingData: this.props.bookingData,
      computeRates: "",
      origin: null,
      destination: null,
      bookingRes: null,
      confirmationModal: false,
      errMessage: '',
      errorOkModalVisible: false
    };

    this.mapView = null
  }

  async componentDidMount() {
    let bookingData = this.state.bookingData
    if(bookingData != ''){
      this.setState({ 
        origin: {
          latitude: bookingData?.booking_routes[0]?.origin_latitude,
          longitude: bookingData?.booking_routes[0]?.origin_longitude
        },
        destination: {
          latitude: bookingData?.booking_routes[0]?.destination_latitude,
          longitude: bookingData?.booking_routes[0]?.destination_longitude
        }
      })
      this.init();
      this.setState({ loading: false })
    }
  }

  async init() {
    this.computeRates()
    console.log(this.state.bookingData)
    dispatch(setLoading(false))
  }
  
  async computeRates() {
    refreshTokenHelper(async() => {
      const data = {
        booking_number: this.state.bookingData?.booking_number
      }
      const response = await BookingApi.computeRates(data)
      console.log(response.data.data.vehicle_type)
      if(response == undefined){
        dispatch(showError(true))
        this.setState({isLoading: false, errMessage: 'Cant Connect to the server'})
      } else {
        if(response?.data?.success) {
          this.setState({ bookingRes: response?.data?.data, isLoading: false })
        }
        else {
          this.setState({ isLoading: false, errMessage: response?.data?.message || response?.data, errorOkModalVisible: true })
          dispatch(setLoading(false))
        }
      }
    })
  }

  async confimBooking() {
    dispatch(setLoading(true))
    refreshTokenHelper(async() => {
      const response = await BookingApi.confirmBooking(this.state.bookingData?.booking_number)
      if(response == undefined){
        dispatch(showError(true))
        dispatch(setLoading(false))
      } else {
        if(response?.data?.success){
          if(this.state.bookingData.customer.billing_type === 'Per Booking') {
            navigate('SelectPaymentScreen', { bookingNumber: this.state.bookingData?.booking_number, price: this.state.bookingRes.total_price, booking: response?.data?.data })
          } else {
            navigate('ExclusiveBooking7', { booking: response?.data?.data })
          }
          dispatch(setLoading(false))
        } else {
          this.setState({ errMessage: response?.data?.message, errorOkModalVisible: true })
          dispatch(setLoading(false))
        }
      }
    })
  }

  async cancelBooking() {
    this.setState({ confirmationModal: false })
    dispatch(setLoading(true))
    refreshTokenHelper(async() => {
      const response = await BookingApi.cancelBooking(this.state.bookingData?.booking_number)
      console.log(response.data)
      if(response == undefined){
        dispatch(showError(true))
        dispatch(setLoading(false))
      } else {
        if(response?.data?.success){
          navigate('ExclusiveBookingCancelScreen')
          dispatch(setLoading(false))
        } else {
          this.setState({ errMessage: response?.data?.message, errorOkModalVisible: true })
          dispatch(setLoading(false))
        }
      }
    })
  }

  cancelConfirmModal() {
    return(
      <Modal
        visible={this.state.confirmationModal}
        animationType='none'
        statusBarTranslucent
        transparent={true}
      >
        <View style={styles.mainMdlContainer}>
          <View style={styles.mdlContainer}>
            <View style={styles.mdlTxtContainer}>
              <Text style={styles.mdlTxt}>Are you sure you want to cancel?</Text>
            </View>
            <View style={styles.mdlBtnContainer}>
              <TouchableOpacity
                style={styles.mdlBtn}
                onPress={() => {
                  this.cancelBooking()
                }}
              >
                <Text style={styles.mdlBtnTxt}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.mdlBtn}
                onPress={() => {
                  this.setState({ confirmationModal: false })
                }}
              >
                <Text style={styles.mdlBtnTxt}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    )
  }

  toRender() {
    if(!this.state.bookingRes) {
      return (
        <View style={styles.alignItemCenter}>
          {this.cancelConfirmModal()}
          <View style={styles.bookRefContainer}>
            <View style ={{flexDirection: 'row'}}>
              <Text style={{fontSize: 12, color: 'black', width: '45%'}}>Booking No:</Text>
              <Text style={{fontSize: 12, color: 'black', width: '45%', textAlign: 'right'}}>{this.state.bookingData?.booking_number}</Text>
            </View>
          </View>
            {
              this.state.isLoading && <ActivityIndicator size="large" color="rgb(223,131,68)"/>
            }
            <View style={styles.textContainer2}>
              { this.state.isLoading ?
                <Text style={styles.infoTxt}>Please wait while we{"\n"}find you a courier</Text>
                :
                <Text style={styles.infoTxt}>{this.state.errMessage}</Text>
              }
            </View>
            {/* Assign/Cancel Button */}
            {
              !this.state.isLoading && 
              <View style={styles.btnContainer}>
                <TouchableOpacity style={styles.cancelButtonRed} 
                onPress={() => {
                  this.setState({ confirmationModal: true })
                }}
                >
                  <Text style={styles.buttonText}> Cancel </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.waitButtonOrange} onPress={() => {
                  this.setState({ isLoading: true })
                  setTimeout(() => {
                    this.computeRates()
                  }, 2000);
                }}>
                  <Text style={styles.buttonText}> Try Again </Text>
                </TouchableOpacity>
              </View>
            }
        </View>
      )
    } else {
      return(
        <View style={styles.foundDriverContainer}>
          {this.cancelConfirmModal()}
          <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
            <View style={{ minWidth: '40%', left: -20, alignItems: 'center', justifyContent: 'center'}}>
              <Image
                style={{ height: '60%', width: '100%' }}
                source={returnIcon(this.state.bookingRes.vehicle_type)}
                resizeMode={"contain"}
              />
              <Text style={{ fontSize: 10 }}>U-MOVE {this.state.bookingRes.vehicle_type.value}</Text>
            </View>
            <View style={{ textAlign: 'center', justifyContent: 'center', }}>
              <Text style={{ fontSize: 28 }}>₱ {moneyFormat(this.state.bookingRes.total_price)}</Text>
            </View>
          </View>
          <View style={{flex: 1, alignItems: 'center'}}>
            <View style={{ width: '90%', height: '80%', alignItems: 'center', justifyContent: 'space-evenly'}}>
              <TouchableOpacity
                style={{ backgroundColor: 'red', width: '80%', height: 45, borderRadius: 10, alignItems: 'center', justifyContent: 'center', elevation: 3}}
                onPress={() => {
                  this.setState({ confirmationModal: true })
                }}
              >
                <Text style={{ color: "white", fontWeight: "600" }}>CANCEL</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ backgroundColor: 'rgb(223,131,68)', width: '80%', height: 45, borderRadius: 10, alignItems: 'center', justifyContent: 'center', elevation: 3}}
                onPress={() => {
                  this.confimBooking()
                }}
              >
                <Text style={{ color: "white", fontWeight: "600" }}>BOOK NOW</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )
    }
  }

  render() {
    return(
      <View style={styles.container}>
        <ErrorWithCloseButtonModal/>
        {/* <ErrorOkModal
          Visible={this.state.errorOkModalVisible}
          ErrMsg={this.state.errMessage}
          OkButton={() => {
            this.setState({ errorOkModalVisible: false })
          }}
        /> */}
        <StatusBar translucent backgroundColor={'transparent'} barStyle={'dark-content'} />
        {
          this.state.origin !== null &&
            <MapView style={styles.map} 
                showsUserLocation={true}
                provider={PROVIDER_GOOGLE}
                initialRegion={{
                  latitude: parseFloat(this.state.origin.latitude),
                  longitude: parseFloat(this.state.origin.longitude),
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421
                }}
                ref={ref => this.mapView = ref}
                onMapLoaded={() => this.mapView.fitToCoordinates([{
                    latitude: parseFloat(this.state.origin.latitude),
                    longitude: parseFloat(this.state.origin.longitude)
                  },
                  {
                    latitude: parseFloat(this.state.destination.latitude),
                    longitude: parseFloat(this.state.destination.longitude)
                  }])}
            >
            <Marker
              coordinate={{
                latitude: parseFloat(this.state.origin.latitude),
                longitude: parseFloat(this.state.origin.longitude)
              }}
            >
              <Image
                style={{ height: 30}}
                source={require('../../../../assets/truck/exclusive.png')}
                resizeMode={'contain'}
              />
            </Marker>
            <Marker
              coordinate={{
                latitude: parseFloat(this.state.destination.latitude),
                longitude: parseFloat(this.state.destination.longitude)
              }}
            >
              <Image
                style={{ height: 30}}
                source={require('../../../../assets/icons/location-icon.png')}
                resizeMode={'contain'}
              />
            </Marker>
            <MapViewDirections
              origin={{
                latitude: parseFloat(this.state.origin.latitude),
                longitude: parseFloat(this.state.origin.longitude)
              }}
              destination={{
                latitude: parseFloat(this.state.destination.latitude),
                longitude: parseFloat(this.state.destination.longitude)
              }}
              apikey={"AIzaSyCjh5lmz5CQu1MKjEKaLa552Cq5fCXTlCo"}
              strokeColor={"rgb(223,131,68)"}
              strokeWidth={4}
            /> 
            </MapView> 
        }
        { this.toRender() }
        <Loader/>
      </View>
    )
  }
}

export default connect(
  state => {
    return {
      bookingData: state.bookingDetails.booking
    };
  },
)(ExclusiveBooking5);

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: 'rgb(238, 241, 217)',
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  map: {
    marginBottom: 30,
    width: Dimensions.get('window').width,
    height: "50%",
  },
  content: {
    alignItems: 'center',
    flex: 1,
  },
  alignItemCenter: {
    alignItems: 'center',
  },
  logo1: {
    height: 60,
    width: 275,
    marginBottom: '45%',
  },
  logo2: {
    height: 60,
    width: 275,
    marginTop: '45%',
    marginBottom: '45%',
  },
  textContainer1: {
    marginTop: '15%',
    alignItems: 'center',
  },
  textContainer2: {
    alignItems: 'center',
    marginTop: '10%',
    width: '90%'
  },
  bookRefContainer: {
    marginTop: '2%',
    marginBottom: '15%',
    width: '60%',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  infoTxt: {
    textAlign: 'center',
    color: 'rgb(223,131,68)',
    fontSize: 20
  },
  text: {
    color: 'black',
    fontSize: 14
  },
  greenCheck: {
    height: 35,
    width: 35,
  },
  waitButtonOrange: {
    height: 50,
    width: '40%',
    borderRadius: 5,
    justifyContent:'center',
    alignItems: 'center',
    backgroundColor: 'rgb(223,131,68)',
    shadowColor: '#171717',
    elevation: 2
  },
  cancelButtonRed : {
    height: 50,
    width: '40%',
    borderRadius: 5,
    justifyContent:'center',
    alignItems: 'center',
    backgroundColor: 'red',
    shadowColor: '#171717',
    elevation: 2
  },
  btnContainer: {
    marginTop: '20%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '90%'
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
    fontWeight:'bold',
    borderRadius: 5
  },
  foundDriverContainer: {
    flex: 1
  },
  mainMdlContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  mdlContainer: {
    width: '80%',
    height: '25%',
    backgroundColor: 'rgb(27, 32, 39)',
    borderRadius: 15,
    alignItems: 'center',
  },
  mdlTxtContainer: {
    flex: 2,
    justifyContent: 'center'
  },
  mdlTxt: {
    color: 'white',
    fontSize: 18,
    fontWeight: '400',
  },
  mdlBtnContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  mdlBtn: {
    width: '35%',
    backgroundColor: 'white',
    height: '65%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7,
    marginHorizontal: 10
  },
  mdlBtnTxt: {
    fontSize: 16,
    color: 'black'
  }
})