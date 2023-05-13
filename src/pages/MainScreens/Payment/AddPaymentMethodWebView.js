import { View, Text, StyleSheet, SafeAreaView, StatusBar,  } from 'react-native'
import React, { useEffect } from 'react'
import { UMColors } from '../../../utils/ColorHelper'
import CustomNavbar from '../../Components/CustomNavbar'
import WebView from 'react-native-webview'
import { focusedScreenName, goBack } from '../../../utils/navigationHelper'
import { dispatch } from '../../../utils/redux'
import { isPaymentSuccess } from '../../../redux/actions/PaymentChecker'
import { StackActions, useNavigation } from '@react-navigation/native'

export default AddPaymentMethodWebView = (props) => {

  const data = props.route.params.data

  const navigation = useNavigation()

  const onNavigationStateChange = (data) => {
    if(focusedScreenName() === 'AddPaymentMethodWebView') {
      if(data?.url.includes('success')){
        navigation.dispatch(StackActions.pop(1))
        dispatch(isPaymentSuccess('success'))
      }
      if(data?.url.includes('failure')) {
        navigation.dispatch(StackActions.pop(1))
        dispatch(isPaymentSuccess('failure'))
      }
    }
  }

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar barStyle={'light-content'}/>
      <CustomNavbar
        Title={'Payment'}
      />
      <WebView
        style={{flex: 1}}
        source={{ uri: data.data.verification_url }}
        onNavigationStateChange={onNavigationStateChange}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: UMColors.BGOrange
  }
})