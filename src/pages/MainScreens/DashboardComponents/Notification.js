import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useState }  from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView,
  StatusBar,
  ScrollView,
  Modal
} from 'react-native';
import { CustomerApi } from '../../../api/customer';
import { refreshTokenHelper } from '../../../api/helper/userHelper';
import { showError } from '../../../redux/actions/ErrorModal';
import { setLoading } from '../../../redux/actions/Loader';
import { UMColors } from '../../../utils/ColorHelper';
import { dispatch } from '../../../utils/redux';
import ErrorOkModal from '../../Components/ErrorOkModal';
import ErrorWithCloseButtonModal from '../../Components/ErrorWithCloseButtonModal';
import { Loader } from '../../Components/Loader';
import TopDashboardNavbar from '../../Components/TopDashboardNavbar';
import { make12HoursFormat } from '../../../utils/stringHelper';
import { reArrangeDate } from '../../../utils/stringHelper';
import { navigate } from '../../../utils/navigationHelper';
import { BookingApi } from '../../../api/booking';

export default Notification = () => { 

  const isFocused = useIsFocused()
  const [notifData, setNotifData] = useState([])
  const [error, setError] = useState({
    value: false,
    message: ''
  })
  const [confirmModal, setConfirmModal] = useState({
    value: false,
    data: {}
  })
  const [cancelModal, setCancelModal] = useState({
    value: false,
    data: null
  })

  useEffect(() => {
    if(isFocused){
      getNotif()
    }
  }, [isFocused])

  const getNotif = () => {
    dispatch(setLoading(true))
    refreshTokenHelper(async() => {
      const response = await CustomerApi.getNotification()
      if(response == undefined){
        dispatch(setLoading(false))
        dispatch(showError(true))
      } else {
        if(response?.data?.success){
          setNotifData(response?.data?.data)
          dispatch(setLoading(false))
        } else {
          setError({ value: true, message: response?.data?.message || response?.data })
          dispatch(setLoading(false))
        }
      }
    })
  }

  const confirmationModal = () => {
    const onPressConfirm = async () => {
      switch(confirmModal.data.type) {
        case "For Confirmation":
          dispatch(setLoading(true))
          setConfirmModal({
            value: false,
            data: {}
          })
          const target = confirmModal.data.target.split(" ")[1];
          const response = await BookingApi.getBooking({booking_number: target});
          if(response == undefined){
            dispatch(setLoading(false))
            dispatch(showError(true))
          } else {
            if(response?.data?.success) {
              navigate('BookingAndDriverDescription', { booking: response?.data?.data })
              dispatch(setLoading(false))
            } else {
              setListLoading(false);
              setError({ value: true, message: response.data.message || response.data })
            }
          }
          break;
        default:
          break; 
      }
    }

    return(
      <Modal
        visible={confirmModal.value}
        animationType='none'
        statusBarTranslucent
        transparent={true}
      >
        <View style={styles.mainMdlContainer}>
          <View style={styles.mdlContainer}>
            <View style={styles.mdlTxtContainer}>
              <Text style={styles.mdlTxt}>We are unable to find any booking to{'\n'}share with your Shared Booking.</Text>
            </View>
            <View style={styles.mdlSubTxtContainer}>
              <Text style={styles.mdlSubTxt}>Would you like to proceed?</Text>
            </View>
            <View style={styles.mdlBtnContainer}>
              <TouchableOpacity
                style={styles.mdlBtn}
                onPress={onPressConfirm}
              >
                <Text style={[styles.mdlBtnTxt, { color: UMColors.primaryOrange}]}>Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.mdlBtn}
                onPress={() => {
                  setCancelModal({
                    value: true,
                    data: confirmModal.data.target.split(" ")[1]
                  })
                  setConfirmModal({
                    value: false,
                    data: {}
                  })
                }}
              >
                <Text style={[styles.mdlBtnTxt, { color: UMColors.red}]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    )
  }

  const cancellationModal = () => {
    const onPressConfirm = async () => {
      dispatch(setLoading(true))
      setCancelModal({
        value: false,
        data: null
      })
      refreshTokenHelper(async() => {
        const response = await BookingApi.cancelBooking(cancelModal.value)
        if(response == undefined){
          dispatch(showError(true))
          dispatch(setLoading(false))
        } else {
          if(response?.data?.success){
            navigate('BookingCancelScreen')
            dispatch(setLoading(false))
          } else {
            setError({ value: true, message: response?.data?.message || response.data })
            dispatch(setLoading(false))
          }
        }
      })
    }
    
    return(
      <Modal
        visible={cancelModal.value}
        animationType='none'
        statusBarTranslucent
        transparent={true}
      >
        <View style={styles.mainMdlContainer}>
          <View style={styles.mdlContainer}>
            <View style={styles.mdlTxtContainer}>
              <Text style={[styles.mdlTxt, { fontSize: 23 }]}>Are you sure you{'\n'}want to Cancel?</Text>
            </View>
            <View style={styles.mdlBtnContainer}>
              <TouchableOpacity
                style={styles.mdlBtn}
                onPress={onPressConfirm}
              >
                <Text style={[styles.mdlBtnTxt, { color: UMColors.primaryOrange, fontSize: 23 }]}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.mdlBtn}
                onPress={() => {
                  setCancelModal({
                    value: false
                  })
                }}
              >
                <Text style={[styles.mdlBtnTxt, { color: UMColors.red, fontSize: 23 }]}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    )
  }

  const renderNotifications = () => {
    const onPressNotification = (data) => {
      if(data.notification_event.type === "For Confirmation") {
        setConfirmModal({
          value: true,
          data: data.notification_event
        })
      }
    }

    if(!notifData) {
      return (
        <View style={styles.emptyNotifContainer}>
          <Text style={styles.emptyNotifTxt}>Empty</Text>
        </View>
      )
    } else {
      return (
        notifData.map((data, index) => (
          <TouchableOpacity onPress={() => onPressNotification(data)} style={styles.notifContainer} key={index}>
            <View style={styles.notifContentContainer}>
              <Text style={styles.notifContentTimeTxt}>{make12HoursFormat(data.date_created.slice(10, 19)) + '  |  ' + reArrangeDate(data.date_created.slice(0, 10))}</Text>
              <Text style={styles.notifContentDetailsTxt}>{data.notification_event.title}</Text>
            </View>
          </TouchableOpacity>
        ))
      )
    }
  }

  return(
    <View style={styles.mainContainer}>
      <ErrorWithCloseButtonModal/>
      <ErrorOkModal
        Visible={error}
        ErrMsg={error.message}
        OkButton={() => {
          setError({ value: false, message: '' })
        }}
      />
      <StatusBar translucent barStyle={'dark-content'}/>
      <TopDashboardNavbar/>
      <View style={styles.titleContainer}>
        <Text style={styles.notificationTxt}>Notification</Text>
      </View>
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }}
      >
        {renderNotifications()}
      </ScrollView>
      {confirmationModal()}
      {cancellationModal()}
      <Loader/>
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: UMColors.BGOrange
  },
  titleContainer: {
    height: '7%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: UMColors.BGOrange
  },
  notificationTxt: {
    fontSize: 20,
    color: UMColors.black,
    fontWeight: '400'
  },
  emptyNotifContainer: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyNotifTxt: {
    fontSize: 22,
    color: UMColors.primaryGray
  },
  // notificationScrollView: {
  //   borderWidth: 1,
  //   borderColor: 'red',
  //   flex: 1,
  // }
  notifContainer: {
    maxHeight: 80,
    marginVertical: 10,
    width: '95%',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: UMColors.darkerBgOrange,
    elevation: 5
  },
  notifContentContainer: {
    flexDirection: 'row',
    height: '80%',
    width: '90%',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  notifContentTimeTxt: {
    fontSize: 9,
    color: UMColors.black,
    width: '40%',
    height: '95%',
    fontWeight: '400',
  },
  notifContentDetailsTxt: {
    fontSize: 12,
    color: UMColors.black,
    width: '60%',
    height: '80%',
    fontWeight: '400',
    lineHeight: 20
  },
  mainMdlContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  mdlContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  mdlTxtContainer: {
    marginTop: 50,
    marginBottom: 40,
    justifyContent: 'center'
  },
  mdlTxt: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '400',
  },
  mdlSubTxtContainer: {
    marginBottom: 60,
  },
  mdlSubTxt: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '400',
  },
  mdlBtnContainer: {
    flexDirection: 'row',
    marginBottom: 40,
    width: '100%',
    justifyContent: 'space-evenly'
  },
  mdlBtnTxt: {
    fontSize: 16,
    fontWeight: 'bold'
  }
})