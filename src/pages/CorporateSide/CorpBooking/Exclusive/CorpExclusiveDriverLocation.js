import React, { Component }  from 'react';
import { StyleSheet, StatusBar, View, Text, TouchableOpacity, Image } from 'react-native';

import NavbarComponent from '../../../Components/NavbarComponent';

import { UMIcons } from '../../../../utils/imageHelper';
import { UMColors } from '../../../../utils/ColorHelper';
import { startTask, finishTask } from '../../../../utils/taskManagerHelper';

import { DriverApi } from '../../../../api/driver';
import { getStorage, setStorage } from '../../../../api/helper/storage';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';

export default class CorpExclusiveDriverLocation extends Component {  
  constructor(props) {
    super(props);

    this.state = {
      bookingNumber: this.props.route.params.bookingNumber,
      destination: this.props.route.params.destination,
      origin: this.props.route.params.origin,
    }
    
    this.mapView = null
  }

  componentDidMount() {
    try {
      finishTask('GET_LOCATION')
      startTask('GET_LOCATION', async() => {
        const response = await DriverApi.driverLocation(this.state.bookingNumber)
        console.log(response)
        if(response.success && response.data.latitude && response.data.longitude){
          this.setState({ origin: {
            latitude: parseFloat(response.data.latitude),
            longitude: parseFloat(response.data.longitude)
          }})
        } else {
          console.log(response)
        }
      }, 30000)
    } catch(e) {
      console.log(e);
    }
  }

 
  render() {
    return(
      <View style={styles.mainContainer}>
        <NavbarComponent
          goBack={() => {
            finishTask('GET_LOCATION')
            this.props.navigation.navigate('CorpExclusive7')
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
              apikey={"AIzaSyCjh5lmz5CQu1MKjEKaLa552Cq5fCXTlCo"}
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