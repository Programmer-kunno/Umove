import { 
  SafeAreaView, 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  Dimensions, 
  TouchableOpacity, 
  TouchableWithoutFeedback, 
  Keyboard 
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { UMColors } from '../../../../utils/ColorHelper'
import CustomNavbar from '../../../Components/CustomNavbar'
import { navigate } from '../../../../utils/navigationHelper'
import { dispatch } from '../../../../utils/redux'
import { forUpdateUserData, saveUserChanges } from '../../../../redux/actions/User'
import { useSelector } from 'react-redux'
import { emailRegex } from '../../../../utils/stringHelper'
import ErrorOkModal from '../../../Components/ErrorOkModal'
import { setLoading } from '../../../../redux/actions/Loader'
import { CustomerApi } from '../../../../api/customer'
import { showError } from '../../../../redux/actions/ErrorModal'
import { refreshTokenHelper } from '../../../../api/helper/userHelper'
import { Loader } from '../../../Components/Loader'
import ErrorWithCloseButtonModal from '../../../Components/ErrorWithCloseButtonModal'

const deviceWidth = Dimensions.get('screen').width

export default EditEmail = (props) => {
  const userChangesData = useSelector((state) => state.userOperations.userChangesData)
  const updateUserData = useSelector((state) => state.userOperations.updateUserData)
  const [email, setEmail] = useState(props.route.params?.email)
  const [error, setError] = useState({
    value: false,
    message: ''
  })

  useEffect(() => {
    dispatch(setLoading(false))
  }, [])

  const checkEmail = () => {
    dispatch(setLoading(true))
    const data = {
      email: email
    }
    refreshTokenHelper(async() => {
      const response = await CustomerApi.validateUser(data)
      if(response == undefined){
        dispatch(showError(true))
        dispatch(setLoading(false))
      } else {
        if(response?.data?.success){
          dispatch(saveUserChanges({ 
            ...userChangesData, 
            userDetails: {
              ...userChangesData.userDetails,
              email: email
            }
          }))
          dispatch(forUpdateUserData({
            ...updateUserData,
            email: email
          }))
          navigate('UserProfileScreen')
          dispatch(setLoading(false))
        } else {
          setError({ value: true, message: 'Email Already Taken' })
          dispatch(setLoading(false))
        }
      }
    })
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.mainContainer}>
        <ErrorWithCloseButtonModal/>
        <ErrorOkModal
          Visible={error.value}
          ErrMsg={error.message}
          OkButton={() => setError({ value: false, message: '' })}
        />
        <CustomNavbar
          Title={'Edit Email'}
        />
        <View style={[styles.componentContainer, { marginTop: 20 }]}>
          <Text style={styles.componentTitle}>Email</Text>
          <TextInput
            value={email}   
            style={styles.valueTxtInput}
            onChangeText={val => setEmail(val)}
          />
        </View>
        <TouchableOpacity
          style={[styles.updateBtn, { 
                backgroundColor: props.route.params?.email === email || email.length === 0 ? 
                                 UMColors.primaryGray  : UMColors.primaryOrange 
                                }]}
          disabled={props.route.params?.email === email || email.length === 0 ? true : false}
          onPress={() => {
            if(!emailRegex(email)){
              setError({ value: true, message: 'Email is not valid' })
            } else {
              checkEmail()
            }
          }}
        >
          <Text style={styles.updateBtnTxt}>Update</Text>
        </TouchableOpacity>
        <Loader/>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: UMColors.BGOrange,
    alignItems: 'center'
  },            
  componentContainer: {
    width: deviceWidth / 1.2,
    alignItems: 'center'
  },
  componentTitle: {
    width: '80%',
    paddingLeft: 5,
    fontSize: 13
  },
  valueTxtInput: {
    borderWidth: 1,
    borderColor: UMColors.primaryOrange,
    width: '80%',
    height: 40,
    borderRadius: 50,
    paddingLeft: 20,
    backgroundColor: UMColors.white,
    fontSize: 13,
    marginBottom: 10
  },
  updateBtn: {
    width: '45%',
    height: 40,
    backgroundColor: UMColors.primaryOrange,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    position: 'absolute',
    bottom: 40,
    elevation: 7
  },
  updateBtnTxt: {
    color: UMColors.white,
    fontSize: 15,
    fontWeight: 'bold'
  }
})
