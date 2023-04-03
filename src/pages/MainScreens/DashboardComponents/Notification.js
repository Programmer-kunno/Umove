import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useState }  from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView,
  StatusBar,
  ScrollView
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

export default Notification = () => { 

  const isFocused = useIsFocused()
  const [notifData, setNotifData] = useState([])
  const [error, setError] = useState({
    value: false,
    message: ''
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
      console.log(response.data)
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

  const renderNotifications = () => {
    const onPressNotification = () => {

    }

    if(!notifData) {
      return (
        <View style={styles.emptyNotifContainer}>
          <Text style={styles.emptyNotifTxt}>Empty</Text>
        </View>
      )
    } else {
      console.log(notifData)
      return (
        notifData.map((data, index) => (
          <TouchableOpacity onPress={onPressNotification} style={styles.notifContainer} key={index}>
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
    <SafeAreaView style={styles.mainContainer}>
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
      <Loader/>
    </SafeAreaView>
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
  }
})