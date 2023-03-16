import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import React from 'react'
import { UMColors } from '../../utils/ColorHelper'
import { useSelector } from 'react-redux'

export const Loader = () => {
  const loading = useSelector(state => state.loadingReducer.loading);
  
  if(!loading) return;

  return (
    <View style={styles.container}>
      <View style={styles.loadingView}>
        <ActivityIndicator color={UMColors.primaryOrange} size={"large"} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,.5)',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  loadingView: {
    width: '20%',
    height: '10%',
    backgroundColor: UMColors.BGOrange,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  }
})