import React, { Component }  from 'react';
import { StyleSheet, View, Image, Text, ActivityIndicator } from 'react-native';

import { FetchApi } from '../../../api/fetch';
import { getStorage, setStorage } from '../../../api/helper/storage';

const bgImage = '../../../assets/bg-image.jpg';

export default class Exclusive4 extends Component {  
  constructor(props) {
    super(props);
    
    this.state = { 
      booking: {},
      isLoading: true
    };
  }

  async componentDidMount() {
    this.init();

    setTimeout(() => {
      this.setState({isLoading: false})
    }, 1000);
  }

  async init() {
    let booking = await getStorage('booking');
    this.setState({ booking })
  }

  async booking() {
    let booking = this.state.booking;
    await setStorage('booking', booking)
  }

  render() {
    return(
      <View style={styles.container}>
        <View style={styles.innerContainer}>
          <View style={styles.content}>

              
            { this.state.isLoading ?
              <View style={styles.alignItemCenter}>
                <View style={styles.alignItemCenter}>
                  <Image
                    source={require('../../../assets/logo/logo.png')}
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
                <View style={styles.alignItemCenter}>
                  <Image
                    source={require('../../../assets/logo/logo.png')}
                    style={styles.logo2}
                  />
                </View>
                <View style={styles.alignItemCenter}>
                  <Image source={require('../../../assets/icons/green-check.png')} style={styles.greenCheck}/>
                  <View style={styles.textContainer2}>
                    <Text style={styles.text}>We are pleased to inform you that your booking has been received and confirmed.</Text>
                  </View>
                </View>
              </View>
            }
              
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: 'rgb(38, 43, 52)',
    alignItems: 'center',
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  innerContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  alignItemCenter: {
    alignItems: 'center',
  },
  logo1: {
    height: 50,
    width: 240,
    marginBottom: '70%',
  },
  logo2: {
    height: 50,
    width: 240,
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
    color: 'white',
    fontSize: 14
  },
  greenCheck: {
    height: 35,
    width: 35,
  },
})