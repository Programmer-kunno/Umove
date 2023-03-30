import React, { Component }  from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  ImageBackground, 
  Image 
} from 'react-native';
import TopDashboardNavbar from '../../Components/TopDashboardNavbar';

const bgImage = '../../../assets/bg-image.jpg';

export default class Messages extends Component {  
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

  }

  render() {
    return(
      <View style={styles.container}>
        <ImageBackground source={require(bgImage)} resizeMode='cover' style={styles.image}>
          <View style={styles.innerContainer}>

            {/* Header */}
            <TopDashboardNavbar
              CustomerService={() => {}}
            />

            <View style={styles.content}>

              {/* Placeholder */}
              <View style={styles.alignItemCenter}>
                <View style={styles.placeholder}>
                  <View style={styles.placeholderContainer}>
                    <Text style={styles.placeholderText}>
                      Messages
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