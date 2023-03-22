import React, { Component }  from 'react';
import { StyleSheet, View, ImageBackground, Image } from 'react-native';
import { connect } from 'react-redux';
import { navigate, resetNavigation } from '../utils/navigationHelper';
import { refreshTokenHelper } from '../api/helper/userHelper';

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
      if(user.access) {   
        refreshTokenHelper(() => {
          resetNavigation('DrawerNavigation')
        })
      } else {
        resetNavigation('Start1')
      }
    }, 2000)
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