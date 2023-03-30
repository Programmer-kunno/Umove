import React from 'react'
import { View, Text, StyleSheet, SafeAreaView } from 'react-native'
import { UMColors } from '../../utils/ColorHelper'
import TransactionTabs from './TransactionTabs'

const Transactions = () => {
  return (
    <SafeAreaView style={styles.container}>
      <TransactionTabs />
    </SafeAreaView>
  )
}

export default Transactions

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: UMColors.BGOrange
  }
})