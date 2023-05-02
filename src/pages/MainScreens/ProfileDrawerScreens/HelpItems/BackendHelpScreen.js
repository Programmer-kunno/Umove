import { View, Text, StyleSheet, SafeAreaView, ScrollView, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { UMColors } from '../../../../utils/ColorHelper'
import CustomNavbar from '../../../Components/CustomNavbar'
import { dispatch } from '../../../../utils/redux'
import { setLoading } from '../../../../redux/actions/Loader'
import { FetchApi } from '../../../../api/fetch'
import { showError } from '../../../../redux/actions/ErrorModal'
import ErrorWithCloseButtonModal from '../../../Components/ErrorWithCloseButtonModal'
import ErrorOkModal from '../../../Components/ErrorOkModal'
import { Loader } from '../../../Components/Loader'

const deviceWidth = Dimensions.get('screen').width

export default BackendHelpScreen = (props) => {

  const [questionAnswerList, setQuestionAnswerList] = useState([])
  const [error, setError] = useState({
    value: false,
    message: ''
  })

  useEffect(() => {
    getHelpItems()
  }, [])

  const getHelpItems = async() => {
    dispatch(setLoading(true))
    const response = await FetchApi.helpList(props.route.params?.data?.id)
    if(response == undefined){
      dispatch(showError(true))
      dispatch(setLoading(false))
    } else {
      if(response?.data?.success){
        setQuestionAnswerList(response?.data?.data)
        dispatch(setLoading(false))
      } else {
        setError({ value: true, message: response?.data?.message || response?.data })
        dispatch(setLoading(false))
      }
    }
  }

  const renderQuestionAnswer = () => {
    return (
      <ScrollView style={styles.bodyContainer}>
        {
          questionAnswerList.map((items, index) => (
            <View key={index} style={{ marginTop: 10, width: '100%' }}>
              <Text style={styles.questionTxt}>{items.question}</Text>
              <Text style={styles.answerTxt}>{items.answer}</Text>
            </View>
          ))
        }
      </ScrollView>
    )
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
        Title={props.route.params?.data?.category_name}
      />
      {renderQuestionAnswer()}
      <Loader/>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: UMColors.BGOrange,
    alignItems: 'center'
  },
  bodyContainer: {
    width: deviceWidth / 1.10,
    marginTop: 15
  },
  questionTxt: {
    marginTop: 5,
    color: UMColors.primaryOrange,
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 12
  }, 
  answerTxt: {
    color: UMColors.black,
    fontSize: 14,
  }
})