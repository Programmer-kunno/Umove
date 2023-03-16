import React, { Component }  from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ImageBackground, Image } from 'react-native';
import { EventRegister } from 'react-native-event-listeners'
import TopDashboardNavbar from '../../Components/TopDashboardNavbar';

import { CustomerApi } from '../../../api/customer'; 
import { getStorage, setStorage } from '../../../api/helper/storage';

const bgImage = '../../../assets/bg-image.jpg';

export default class Calendar extends Component {  
  constructor() {
    super();
    
    this.state = { 
      balance: '00.00',
      user: []
    };
  }

  async componentDidMount() {
    this.init();
  }
  
  async init() {
    let user = await getStorage('user');
    this.setState({user})
  }

  async logOut() {
    let user = await getStorage('user');
    await CustomerApi.logout(user.refresh);
    this.props.navigation.navigate('Login');
    EventRegister.emit('logout', true);
  }

  render() {
    return(
      <View style={styles.container}>
        <ImageBackground source={require(bgImage)} resizeMode='cover' style={styles.image}>
          <View style={styles.innerContainer}>

           {/* Header */}
           <TopDashboardNavbar
              LogOut={() => this.logOut()}
              Title={'Corporate'}
            />

            <View style={styles.content}>

              {/* Placeholder */}
              <View style={styles.alignItemCenter}>
                <View style={styles.placeholder}>
                  <View style={styles.placeholderContainer}>
                    <Text style={styles.placeholderText}>
                      Calendar
                    </Text>
                  </View>
                </View>
              </View>

            </View>
          </View>
        </ImageBackground>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'center',
    backgroundColor: 'rgb(238, 241, 217)', 
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
    justifyContent: 'center'
  },
  alignItemCenter: {
    alignItems: 'center',
  },
  placeholder: {
    width: '60%',
    height: 100,
    marginBottom: '20%',
    justifyContent: 'space-evenly',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 15
  },
  placeholderContainer: {
    alignItems: 'center'
  },
  placeholderText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '300'
  },
})