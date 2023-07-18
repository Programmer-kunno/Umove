import {
  SafeAreaView, 
  Text, 
  StyleSheet, 
  Dimensions, 
  View
} from 'react-native'
import React from 'react'
import CustomNavbar from '../../Components/CustomNavbar'
import { UMColors } from '../../../utils/ColorHelper'
import DeviceInfo from 'react-native-device-info'

const deviceWidth = Dimensions.get('screen').width

export default AppVersion = () => {

  return (
    <SafeAreaView style={styles.mainContainer}>
      <CustomNavbar
        Title={'App Version'}
      />
      <View style={styles.bodyContainer}>
        <View style={styles.bodySubContainer}>
          <Text style={styles.bodyTxt}>Application Name</Text>
          <Text style={styles.bodyTxt}>{DeviceInfo.getApplicationName()}</Text>          
        </View>
        <View style={styles.bodySubContainer}>
          <Text style={styles.bodyTxt}>Build Number</Text>
          <Text style={styles.bodyTxt}>{DeviceInfo.getBuildNumber()}</Text>          
        </View>
        <View style={styles.bodySubContainer}>
          <Text style={styles.bodyTxt}>Application Version</Text>
          <Text style={styles.bodyTxt}>{DeviceInfo.getVersion()}</Text>          
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: UMColors.BGOrange,
    alignItems: 'center',
  },
  bodyContainer: {
    alignItems: 'center',
    width: deviceWidth / 1.10,
    marginTop: '5%'
  },
  bodySubContainer: {
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'space-between',
    marginVertical: 5
  },
  bodyTxt: {
    color: UMColors.black,
    fontSize: 14,
    fontStyle: 'italic'
  }
})