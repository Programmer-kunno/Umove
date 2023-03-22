import React, { Component, useState }  from 'react';
import { 
  StyleSheet, 
  View,
  Text, 
  TouchableOpacity, 
  ImageBackground, 
  Image, 
  Modal, 
  TouchableWithoutFeedback ,
  StatusBar,
  Alert
} from 'react-native';
import { UMColors } from '../../../utils/ColorHelper';
import { UMIcons } from '../../../utils/imageHelper';
import TopDashboardNavbar from '../../Components/TopDashboardNavbar';
import ErrorWithCloseButtonModal from '../../Components/ErrorWithCloseButtonModal';
import ErrorOkModal from '../../Components/ErrorOkModal';
import { useSelector } from 'react-redux';
import { navigate } from '../../../utils/navigationHelper';

const bgImage = '../../../assets/bg-image.jpg';

export default Home = () => {  
  const user = useSelector(state => state.userOperations.userData)
  const [wallet, setWallet] = useState({
    balance: '1,000.00',
    points: '10.00'
  })
  const [modalVisible, setModalVisible] = useState(false)
  const [error, setError] = useState({
    value: false,
    message: ''
  })
  const [isVerified, setIsVerified] = useState(true)

  chooseTypeBooking = () => {
    console.log(user)
    if(user.customer_type === 'individual') {
      setError({ value: true, message: 'Individual booking will be available soon' })
    } else if(isVerified){
      setModalVisible(true) 
    } else {
      setError({ value: true, message: 'Account not Validated, Please validate your account first' })
    }
  }

  return(
    <View style={styles.container}>
      <ErrorWithCloseButtonModal/>
      <ErrorOkModal
        Visible={error.value}
        ErrMsg={error.message}
        OkButton={() => {
          setError({...error, value: false})
        }}
      />
      <StatusBar translucent barStyle={'dark-content'}/>
      <ImageBackground source={require(bgImage)} resizeMode='cover' style={styles.image}>
        <View style={styles.innerContainer}>

          {/* Header */}
          <TopDashboardNavbar
            CustomerService={() => {}}
          />

          {/* Modal */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false) }
          >
            <TouchableWithoutFeedback onPress={() => setModalVisible(false) }>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <View style={styles.modalRow}>
                    <TouchableOpacity style={styles.alignItemCenter}
                      onPress={() => {
                        setModalVisible(false)
                        navigate('CorpExclusive1')
                      }}
                      >
                      <Image source={require('../../../assets/truck/exclusive.png')} style={styles.exclusiveTruck}/>
                      <View style={[styles.button, styles.modalButton]}>
                        <Text style={styles.textStyle}>Exclusive</Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.alignItemCenter}
                      onPress={() => {
                        setModalVisible(false)
                        setError({ value: true, message: 'This feature will be available soon, stay tuned' })
                      }}
                    >
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

          {/* Body */}
          <View style={styles.bodyContainer}>
            <View style={styles.walletContainer}>
              <View style={styles.balanceContainer}>
                <View style={styles.balanceTxtContainer}>
                  <Text style={styles.balanceTxt}>₱</Text>
                  <Text style={styles.balanceTxt}>{wallet.balance}</Text>
                </View>
                <Text style={[styles.balanceTxt, { fontSize: 18, margin: 0, paddingLeft: 20 }]}>Balance</Text>
                <TouchableOpacity
                  style={styles.balancePlusBtn}
                >
                  <Image
                    style={{ width: '90%' }}
                    source={UMIcons.orangePlusIcon}
                    resizeMode={'contain'}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.pontsContainer}>
                <Text style={styles.pointsTxt}>{wallet.points}</Text>
                <Text style={styles.pointsTxt}>pts</Text>
              </View>
            </View>
            <View style={styles.paragraphContainer}>
              <Text style={styles.paragraphTitle}>Send{'\n'}anything{'\n'}fast</Text>
              <Text style= {styles.paragraph}>There is no transfer, {'\n'}leading to the destination, {'\n'}real-time monitoring, first compensation {'\n'}guarantee and peace of mind.</Text>
            </View>
            <TouchableOpacity
              style={styles.bookBtn}
              onPress={() => {
                chooseTypeBooking()
              }}
            >
              <Text style={styles.bookBtnTxt}>Book</Text>
            </TouchableOpacity>
          </View>
          
        </View>
      </ImageBackground>
    </View>
  )
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
  bodyContainer: {
    flex: 1,
    alignItems: 'center',
  },
  bodyTitleTxt: {
    fontSize: 30
  },
  walletContainer: {
    width: '55%',
    height: '25%',
    marginTop: '5%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  balanceContainer: {
    backgroundColor: 'rgba(67, 71, 77, 0.8)',
    width: '100%',
    height: '55%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  balanceTxtContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  balanceTxt: {
    color: UMColors.white,
    fontSize: 30,
    margin: 10
  },
  balancePlusBtn: {
    backgroundColor: UMColors.white,
    width: 30,
    height: 30,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: -10,
    right: 0
  },
  pontsContainer: {
    width: '82%',
    height: '20%',
    marginTop: 5,
    backgroundColor: 'rgba(67, 71, 77, 0.8)',
    flexDirection: 'row',
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 10,
  },
  pointsTxt: {
    color: UMColors.white,
    fontSize: 15,
    marginHorizontal: 5,
  },
  paragraphContainer: {
    width: '90%',
    height: '40%',
    marginTop: '10%'
  },
  paragraphTitle: {
    color: UMColors.white,
    fontSize: 35
  },
  paragraph: {
    marginTop: 15,
    color: UMColors.white,
    fontSize: 17,
    lineHeight: 23
  },
  bookBtn: {
    marginTop: '15%',
    width: '80%',
    height: '8%',
    backgroundColor: UMColors.primaryOrange,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100
  },
  bookBtnTxt: {
    color: UMColors.white,
    fontSize: 20
  }
})