import { View, Text, SafeAreaView, StyleSheet, ScrollView} from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomNavbar from '../../Components/CustomNavbar'
import { UMColors } from '../../../utils/ColorHelper'
import { SettingsApi } from '../../../api/settings'
import { dispatch } from '../../../utils/redux'
import { showError } from '../../../redux/actions/ErrorModal'
import { Loader } from '../../Components/Loader'
import ErrorWithCloseButtonModal from '../../Components/ErrorWithCloseButtonModal'
import { setLoading } from '../../../redux/actions/Loader'
import ErrorOkModal from '../../Components/ErrorOkModal'

export default DataPrivacy = () => {

  const [dataPrivacy, setDataPrivacy] = useState('')
  const [error, setError] = useState({
    value: false,
    message: ''
  })

  useEffect(() => {
    getTerms()
  }, [])

  const getTerms = async() => {
    dispatch(setLoading(true))
    const response = await SettingsApi.settings()
    if(response == undefined){
      dispatch(showError(true))
      dispatch(setLoading(false))
    } else {
      if(response?.data?.success){
        setDataPrivacy(response?.data?.data?.data_policy)
        dispatch(setLoading(false))
      } else {
        setError({ value: false, message: response?.data?.message || response?.data })
        dispatch(setLoading(false))
      }
    }
  }

  return (
    <SafeAreaView style={styles.mainContainer}>
      <ErrorWithCloseButtonModal/>
      <ErrorOkModal
        Visible={error.value}
        ErrMsg={error.message}
        OkButton={() => setError({ value: false, message: '' })}
      />
      <CustomNavbar
        Title={'Data Privacy'}
      />
      <ScrollView style={styles.termsBody}>
        <Text style={styles.termsTxt}>{dataPrivacy}</Text>
      </ScrollView>
      <Loader/>
    </SafeAreaView>
  )
}
 
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: UMColors.BGOrange,
  },
  termsBody: {
    padding: 20,
  },
  termsTxt: {
    color: UMColors.black,
    fontSize: 16
  }
})