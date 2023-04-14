import React, { Component }  from 'react';
import { StyleSheet, StatusBar, View, Image, Text, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { navigate } from '../../../utils/navigationHelper';

import { UMColors } from '../../../utils/ColorHelper';
import { UMIcons } from '../../../utils/imageHelper';

export default class BookingProcessingScreen extends Component {  
  constructor(props) {
    super(props);
    
    this.state = { 
      isLoading: true,
    };
  }

  async componentDidMount() {
    setTimeout(() => {
      this.setState({isLoading: false})
    }, 2000);
  }


  render() {
    return(
      <View style={styles.container}>
        <StatusBar translucent backgroundColor={'transparent'} barStyle={'dark-content'} />

              
        { this.state.isLoading ?
          <View style={styles.alignItemCenter}>
            <View style={styles.alignItemCenter}>
              <Image
                source={UMIcons.mainLogo}
                style={styles.logo1}
              />
            </View>
            <View style={styles.alignItemCenter}>
            <ActivityIndicator size="large" color="rgb(223,131,68)"/>
              <View style={styles.textContainer1}>
                <Text style={styles.text}>Please wait while process your booking.</Text>
              </View>
            </View>
          </View>
        :
          <View style={styles.alignItemCenter}>
              <Image
                source={UMIcons.mainLogo}
                style={styles.logo2}
              />
              <Image source={UMIcons.greenCheck} style={styles.greenCheck}/>
              <View style={styles.textContainer2}>
                <Text style={styles.text}>We are pleased to inform you that your booking{'\n'}has been received and confirmed.</Text>
              </View>
              {/* Book Button */}
              <TouchableOpacity style={styles.bookButtonOrange} onPress={() => {
                navigate('BookingFindingDriverScreen')
              }}>
                <Text style={styles.buttonText}> Continue </Text>
              </TouchableOpacity>
          </View>
        }
              
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: 'rgb(238, 241, 217)',
    justifyContent: 'center',
  },
  image: {
    flex: 1,
    justifyContent: 'center',
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
  },
  textContainer2: {
    marginTop: '10%',
    width: '90%'
  },
  text: {
    textAlign: 'center',
    color: 'black',
    fontSize: 14
  },
  greenCheck: {
    height: 35,
    width: 35,
  },
  bookButtonOrange: {
    marginTop: '30%',
    height: 50,
    width: '70%',
    borderRadius: 5,
    justifyContent:'center',
    alignItems: 'center',
    backgroundColor: 'rgb(223,131,68)',
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 6},
    shadowOpacity: 0.9,
    shadowRadius: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
    fontWeight:'bold',
    borderRadius: 5
  },
})