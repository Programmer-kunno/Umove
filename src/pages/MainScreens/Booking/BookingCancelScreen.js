import { 
  StyleSheet, 
  StatusBar, 
  View, 
  Image, 
  Text, 
  ActivityIndicator, 
  TouchableOpacity, 
  Alert 
} from 'react-native'
import React, { Component } from 'react'

import { UMIcons } from '../../../utils/imageHelper';
import { BookingApi } from '../../../api/booking';

export default class BookingCancelScreen extends Component {
  constructor(props) {
    super(props);
    
    this.state = { 
      isLoading: true,
    };
  }

  async componentDidMount() {
    setTimeout(() => {
      this.setState({isLoading: false})
    }, 1000);
  }


  render() {
    return(
      <View style={styles.mainContainer}>
        <View style={styles.mainLogoContainer}>
          <Image
            style={styles.logo}
            source={UMIcons.mainLogo}
            resizeMode={'contain'}
          />
        </View>
        <View style={styles.bodyContainer}>
          {
            this.state.isLoading ?
              <ActivityIndicator size="large" color="rgb(223,131,68)"/>
            :
              <Image
                style={styles.greenCheck}
                source={UMIcons.greenCheck}
                resizeMode={'contain'}
              />
          }
          {
            this.state.isLoading ?
              <Text style={styles.statusTxt}>Please wait while we process{'\n'}your request.</Text>
            :
              <Text style={styles.statusTxt}>Cancelled</Text>
          }
        </View>
        <View style={styles.btnContainer}>
          {
            !this.state.isLoading &&
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => {
                this.props.navigation.navigate('Dashboard')
              }}
            >
              <Text style={styles.backBtnTxt}>Back to Home</Text>
            </TouchableOpacity>
          }

        </View>
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
    height: '20%',
    width: '90%',
    marginTop: '20%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  logo: {
    width: '80%'
  },
  bodyContainer: {
    marginTop: '10%',
    width: '90%',
    height: '25%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  greenCheck: {
    width: '20%',
  },
  statusTxt: {
    fontSize: 19,
    textAlign: 'center',
    marginTop: '10%',
    fontWeight: '400'
  },
  btnContainer: {
    width: '90%',
    height: '15%',
    marginTop: '45%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  backBtn: {
    backgroundColor: 'rgb(223,131,68)',
    width: '100%',
    height: '40%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50
  },
  backBtnTxt: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white'
  }
})
