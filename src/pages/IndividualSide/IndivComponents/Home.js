import React, { Component }  from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ImageBackground, Image, Modal, TouchableWithoutFeedback } from 'react-native';
import { EventRegister } from 'react-native-event-listeners'
import { CustomerApi } from '../../../api/customer'; 
import { getStorage, setStorage } from '../../../api/helper/storage';

import TopDashboardNavbar from '../../Components/TopDashboardNavbar';

const bgImage = '../../../assets/bg-image.jpg';

export default class Home extends Component {  
  constructor() {
    super();
    
    this.state = { 
      balance: '00.00',
      user: [],
      modalVisible: false
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

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  }

  render() {
    const { modalVisible } = this.state;
    return(
      <View style={styles.container}>
        <ImageBackground source={require(bgImage)} resizeMode='cover' style={styles.image}>
          <View style={styles.innerContainer}>

            {/* Header */}
            <TopDashboardNavbar
              LogOut={() => this.logOut()}
              Title={'Corporate'}
            />

            {/* Modal */}
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => this.setState({modalVisible: false}) }
            >
              <TouchableWithoutFeedback onPress={() => this.setState({modalVisible: false}) }>
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <View style={styles.modalRow}>
                      <TouchableOpacity style={styles.alignItemCenter}
                        onPress={() => this.setState({modalVisible: false}, () => {
                          this.props.navigation.navigate('Exclusive1')
                      })}>
                        <Image source={require('../../../assets/truck/exclusive.png')} style={styles.exclusiveTruck}/>
                        <View style={[styles.button, styles.modalButton]}>
                          <Text style={styles.textStyle}>Exclusive</Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.alignItemCenter}
                        onPress={() => this.setState({modalVisible: false}, () => {
                          alert('Shared')
                      })}>
                        <Image source={require('../../../assets/truck/shared.png')} style={styles.sharedTruck}/>
                        <View style={[styles.button, styles.modalButton]}>
                          <Text style={styles.textStyle}>Shared</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </Modal>

            <View style={styles.content}>

              {/* Balance */}
              <View style={styles.flexEnd}>
                <View style={styles.balance}>
                  <View style={styles.balanceContainer}>
                    <Text style={styles.balanceText}>
                      Balance
                    </Text>
                  </View>
                  <View style={styles.moneyContainer}>
                    <View style={styles.symbol}>
                      <Text style={styles.moneyText}>
                        ₱ 
                      </Text>
                    </View>
                    <View style={styles.value}>
                      <Text style={styles.moneyText}>
                        {this.state.balance}
                      </Text>
                    </View>
                  </View>
                </View> 
              </View>

              {/* Caption */}
              <View style={styles.textContatiner}>
                <View style={styles.bigTextContainer}>
                  <Text style={styles.bigText}>
                    Send anything fast.
                  </Text>
                </View>
                <View style={styles.smallTextContainer}>
                  <Text style={styles.smallText}>
                    There is no transfer, leading to the destination, real-time monitoring, first compensation guarantee and peace of mind.
                  </Text>
                </View>
              </View>

              {/* Booking Button */}
              <View style={styles.alignItemCenter}>
                <TouchableOpacity style={styles.bookingButton} onPress={() => this.setModalVisible(true)}>
                  <Text style={styles.bookingButtonText}> Book </Text>
                </TouchableOpacity>
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
  buttonText: {
    color: 'white',
    fontSize: 13,
    fontWeight:'bold'
  },
  content: {
    flex: 1,
    justifyContent: 'center'
  },
  alignItemCenter: {
    alignItems: 'center',
  },
  flexEnd: {
    alignItems: 'flex-end',
  }, 
  balance: {
    width: '60%',
    height: 100,
    marginRight: '10%',
    marginBottom: '20%',
    justifyContent: 'space-evenly',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 15
  },
  balanceContainer: {
    alignItems: 'center'
  },
  moneyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  balanceText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '300'
  },
  moneyText: {
    color: 'white',
    fontSize: 30,
    fontWeight: '100'
  },
  textContatiner: {
    marginLeft: '10%',
  },
  bigTextContainer: {
    width: '35%'
  },
  bigText: {
    color: 'white',
    fontSize: 35,
    fontWeight: '100',
    lineHeight: 50
  },
  smallTextContainer: {
    width: '55%'
  },
  smallText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '100'
  },
  bookingButton: {
    backgroundColor: '#ED7D31',
    width: '70%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
    marginTop: '35%'
  },
  bookingButtonText: {
    fontSize: 25,
    fontWeight: '600',
    color: 'white',
    paddingTop: '3%',
    paddingBottom: '3%'
  },
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: "45%"
  },
  modalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    borderColor: 'rgb(223,131,68)',
    borderWidth: 1,
    padding: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    margin: 15,
    marginBottom: -10
  },
  modalButton: {
    backgroundColor: "rgb(223,131,68)",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 15
  },
  exclusiveTruck: {
    width: 100,
    height: 45
  },
  sharedTruck: {
    width: 90,
    height: 45
  },
})