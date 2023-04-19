import React, { Component }  from 'react';
import { StyleSheet, StatusBar, View, Text, TouchableOpacity, Image } from 'react-native';

import NavbarComponent from '../../Components/NavbarComponent';

import { UMIcons } from '../../../utils/imageHelper';
import { UMColors } from '../../../utils/ColorHelper';
import { startTask, finishTask } from '../../../utils/taskManagerHelper';

import { DriverApi } from '../../../api/driver';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { refreshTokenHelper } from '../../../api/helper/userHelper';
import { dispatch } from '../../../utils/redux';
import { showError } from '../../../redux/actions/ErrorModal';
import { goBack } from '../../../utils/navigationHelper';
import ErrorOkModal from '../../Components/ErrorOkModal';

export default class BookingDriverLocation extends Component {  
  constructor(props) {
    super(props);

    this.state = {
      bookingNumber: this.props.route?.params?.bookingNumber,
      destination: this.props.route?.params?.destination,
      origin: this.props.route?.params?.origin,
      errModalVisible: false,
      errMessage: '',
    }
    
    this.mapView = null
  }

  componentDidMount() {
    refreshTokenHelper(async() => {
      finishTask('GET_LOCATION')
      startTask('GET_LOCATION', async() => {
        const response = await DriverApi.driverLocation(this.state.bookingNumber)
        if(response == undefined){
          dispatch(showError(true))
        } else {
          if(response?.data?.success && response?.data?.data?.latitude && response?.data?.data?.longitude){
            this.setState({ origin: {
              latitude: parseFloat(response?.data?.data?.latitude),
              longitude: parseFloat(response?.data?.data?.longitude)
            }})
          } else {

          }
        }
      }, 30000)
    })
  }

 
  render() {
    return(
      <View style={styles.mainContainer}>
        <ErrorOkModal
          Visible={this.state.errModalVisible}
          ErrMsg={this.state.errMessage}
          OkButton={() => {
            this.setState({ errModalVisible: false })
          }}
        />
        <NavbarComponent
          goBack={() => {
            finishTask('GET_LOCATION')
            goBack()
          }}
          // backButton={this.props.navigation.pop()}
        />
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            showsUserLocation={true}
            provider="google"
            ref={ref => this.mapView = ref}
            initialRegion={{
              latitude: parseFloat(this.state.origin?.latitude),
              longitude: parseFloat(this.state.origin?.longitude),
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421
            }}
            onMapLoaded={() => this.mapView.fitToCoordinates([{
              latitude: parseFloat(this.state.origin?.latitude),
              longitude: parseFloat(this.state.origin?.longitude)
            },
            {
              latitude: parseFloat(this.state.destination?.latitude),
              longitude: parseFloat(this.state.destination?.longitude)
            }])}
          >
          
          <Marker
            coordinate={{
              latitude: parseFloat(this.state.origin?.latitude),
              longitude: parseFloat(this.state.origin?.longitude)
            }}
          >
            <Image
              style={{ height: 30}}
              source={UMIcons.truckIcon}
              resizeMode={'contain'}
            />
          </Marker>
          <Marker
            coordinate={{
              latitude: parseFloat(this.state.destination?.latitude),
              longitude: parseFloat(this.state.destination?.longitude)
            }}
          >
            <Image
              style={{ height: 30}}
              source={UMIcons.locationIcon}
              resizeMode={'contain'}
            />
          </Marker>
          <MapViewDirections
              origin={{
                latitude: this.state.origin?.latitude,
                longitude: this.state.origin?.longitude
              }}
              destination={{
                latitude: this.state.destination?.latitude,
                longitude: this.state.destination?.longitude
              }}
              apikey={"AIzaSyBTKmk04d6UkPSY2j3l3OUqGPRlZzalN2w"}
              strokeColor={"rgb(223,131,68)"}
              strokeWidth={4}
            /> 
          </MapView>
        </View>
      </View>
    )
  }
}


const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'rgb(238, 241, 217)',
    alignItems: 'center',
  },
  mapContainer: {
    marginTop: '10%',
    height: '70%',
    width: '90%'
  },
  map: {
    width: '100%',
    height: '100%'
  }
})