import { View, Text, StyleSheet, SafeAreaView, StatusBar,  } from 'react-native'
import React, { useEffect } from 'react'
import { UMColors } from '../../../utils/ColorHelper'
import GrayNavbar from '../../Components/GrayNavbar'
import WebView from 'react-native-webview'
import { goBack } from '../../../utils/navigationHelper'

export default AddPaymentMethodWebView = (props) => {

  const data = props.route.params.data

  const onNavigationStateChange = (data) => {
    console.log(data)
    if(data?.url.includes('success')){
      goBack()
    } else if(data?.url.includes('failure')) {
      goBack()
    }
  }

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar barStyle={'light-content'}/>
      <GrayNavbar
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