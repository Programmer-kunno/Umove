import React, { Component, useEffect, useState }  from 'react';
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
  Alert,
  Dimensions
} from 'react-native';
import { UMColors } from '../../../utils/ColorHelper';
import { UMIcons } from '../../../utils/imageHelper';
import TopDashboardNavbar from '../../Components/TopDashboardNavbar';
import ErrorWithCloseButtonModal from '../../Components/ErrorWithCloseButtonModal';
import ErrorOkModal from '../../Components/ErrorOkModal';
import { useSelector } from 'react-redux';
import { navigate } from '../../../utils/navigationHelper';
import SelectPaymentScreen from '../Payment/SelectPaymentScreen';
import { moneyFormat } from '../../../utils/stringHelper';
import { decode } from '@googlemaps/polyline-codec';
import { saveUser } from '../../../redux/actions/User';
import { dispatch } from '../../../utils/redux';
import { showError } from '../../../redux/actions/ErrorModal';
import { CustomerApi } from '../../../api/customer';
import { refreshTokenHelper } from '../../../api/helper/userHelper';

const bgImage = '../../../assets/bg-image.jpg';
const deviceWidth = Dimensions.get('screen').width

export default Home = () => {  
  const userDetailsData = useSelector(state => state.userOperations.userDetailsData)
  const [wallet, setWallet] = useState({
    balance: '1,000.00',
    points: '0.00'
  })
  const [modalVisible, setModalVisible] = useState(false)
  const [error, setError] = useState({
    value: false,
    message: ''
  })
  const [isVerified, setIsVerified] = useState(true)

  const chooseTypeBooking = () => {
    if(isVerified){
      setModalVisible(true) 
    } else {
      setError({ value: true, message: 'Account not Validated, Please validate your account first' })
    }
  }

  useEffect(() => {
    updateRedux()
  }, [])

  const updateRedux = () => {
    refreshTokenHelper(async() => {
      const response = await CustomerApi.getCustomerData()
      if(response == undefined){
        dispatch(showError(true))
      } else {
        if(response?.data?.success) {
          dispatch(saveUser(response?.data?.data))
        } else {
          setError({ value: true, message: response?.data?.message || response?.data })
        }
      }
    })
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
                        navigate('BookingItemScreen', { bookingType: 'Exclusive' })
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
                        navigate('BookingItemScreen', { bookingType: 'Shared' })
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
            <TouchableOpacity 
              style={styles.walletContainer}
              onPress={() => navigate('WalletScreen')}
            >
              <View style={styles.balanceContainer}>
                <View style={styles.balanceTxtContainer}>
                  <Text style={styles.balanceTxt}>{moneyFormat(userDetailsData.remaining_credits)}</Text>
                </View>
                <Text style={[{ fontSize: 14, marginTop: 5, color: UMColors.white, alignSelf: 'center' }]}>
                  Credit Limit Available Balance
                </Text>
              </View>
              <View style={styles.pontsContainer}>
                <Text style={styles.pointsTxt}>Points</Text>
                <Text style={styles.pointsTxt}>{wallet.points}</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.paragraphContainer}>
              <Text style={styles.paragraphTitle}>Send{'\n'}anything{'\n'}fast</Text>
              <Text style= {styles.paragraph}>There is no transfer, {'\n'}leading to the destination, {'\n'}real-time monitoring, first compensation {'\n'}guarantee and peace of mind.</Text>
            </View>
            <View style={styles.chooseMoveContainer}>
              <Text style={styles.chooseMoveTitle}>Choose how you make your move</Text>
              <View style={styles.chooseMoveBtnContainer}>
                <TouchableOpacity
                  style={styles.chooseMoveBtn}
                  onPress={() => {
                    navigate('BookingSelectVehicle', { bookingType: 'Exclusive' })
                  }}
                >
                  <Image
                    style={styles.chooseMoveImg}
                    source={UMIcons.exclusiveTruckIcon}
                    resizeMode='contain'
                  />
                  <Text style={styles.chooseMoveTxt}>Exclusive</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.chooseMoveBtn}
                  onPress={() => {
                    navigate('BookingSelectVehicle', { bookingType: 'Shared' })
                  }}
                >
                  <Image
                    style={styles.chooseMoveImg}
                    source={UMIcons.sharedTruckIcon}
                    resizeMode='contain'
                  />
                  <Text style={styles.chooseMoveTxt}>Shared</Text>
                </TouchableOpacity>
              </View>
            </View>
            {/* <TouchableOpacity
              style={styles.bookBtn}
              onPress={() => {
                chooseTypeBooking()
                // navigate('SelectPaymentScreen')
              }}
            >
              <Text style={styles.bookBtnTxt}>Book</Text>
            </TouchableOpacity> */}
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
    width: deviceWidth / 1.10,
    height: '25%',
    marginTop: '1%',
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
    alignItems: 'center'
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
    width: '100%',
    height: '20%',
    marginTop: 5,
    backgroundColor: 'rgba(67, 71, 77, 0.8)',
    flexDirection: 'row',
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    justifyContent: 'space-between'
  },
  pointsTxt: {
    color: UMColors.white,
    fontSize: 15,
    marginHorizontal: 15,
  },
  paragraphContainer: {
    width: '90%',
    marginTop: '5%',
  },
  paragraphTitle: {
    color: UMColors.white,
    fontSize: 30
  },
  paragraph: {
    marginTop: 15,
    color: UMColors.white,
    fontSize: 15,
    lineHeight: 23,
  },
  chooseMoveContainer: {
    marginTop: 25,
    width: deviceWidth
  },
  chooseMoveTitle: {
    color: UMColors.white,
    fontSize: 16,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 11
  },
  chooseMoveBtnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  chooseMoveBtn: {
    width: '35%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  chooseMoveImg: {
    width: '100%',
    height: 80
  },
  chooseMoveTxt: {
    color: UMColors.primaryOrange,
    fontSize: 16
  },
  // bookBtn: {
  //   marginTop: '15%',
  //   width: '80%',
  //   height: '8%',
  //   backgroundColor: UMColors.primaryOrange,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   borderRadius: 100
  // },
  bookBtnTxt: {
    color: UMColors.white,
    fontSize: 20
  }
})