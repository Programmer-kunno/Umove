import React, { Component }  from 'react';
import { StyleSheet, View, ImageBackground, Image } from 'react-native';
import { EventRegister } from 'react-native-event-listeners'

import { CustomerApi } from '../api/customer'; 
import { connect } from 'react-redux';
import { resetNavigation } from '../utils/navigationHelper';

const bgImage = '../assets/bg-image.jpg';

class Landing extends Component {  
  constructor() {
    super();
    
    this.state = { 
      username: '',
      password: '', 
      user: {},
      remember: false,
      error: false,
    };
  }

  async componentDidMount() {
      setTimeout(() => {
        const user = this.props.userData
        console.log(user)
        if(user.access) {
          try{
            CustomerApi.refreshAccess(() => {
              if(user.customer_type == "corporate"){
                resetNavigation('DrawerNavigation')
              } else {
                resetNavigation('IndivDashboard')
              }
            })
          } catch(err) {
            console.log(err)
          }
        } else {
          this.init();
        }
      }, 2000)
  }

  componentWillUnmount() {
    EventRegister.removeEventListener(this.listener)
  }
  
  async init() {
    return this.props.navigation.navigate('Start1')
  }
  
  async loggedOut() {
    if (!this.listener) {
      this.listener = EventRegister.addEventListener('logout', (data) => {
        this.setState({username: ''})
        this.setState({password: ''})
        this.setState({remember: false})
      });
    }
  }

  render() {
    return(
      <View style={styles.container}>
        <View style={styles.innerContainer}>
          <View style={styles.content}>

            {/* Logo */}
            <View style={styles.alignItemCenter}>
              <Image
                source={require('../assets/logo/logo-primary.png')}
                style={styles.logo}
                resizeMode={'contain'}
              />
            </View>

          </View>
        </View>
      </View>
    )
  }
}

export default connect(
  state => {
    return {
      userData: state.userOperations.userData
    };
  },
)(Landing);


const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'center',
    backgroundColor: 'rgb(238, 241, 217)',
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
  logo: {
    height: 90,
    width: '80%',
  },
})