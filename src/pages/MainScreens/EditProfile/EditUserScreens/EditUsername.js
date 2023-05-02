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
import React, { useState } from 'react'
import { UMColors } from '../../../../utils/ColorHelper'
import CustomNavbar from '../../../Components/CustomNavbar'
import { navigate } from '../../../../utils/navigationHelper'
import { dispatch } from '../../../../utils/redux'
import { forUpdateUserData, saveUserChanges } from '../../../../redux/actions/User'
import { useSelector } from 'react-redux'
import ErrorWithCloseButtonModal from '../../../Components/ErrorWithCloseButtonModal'
import ErrorOkModal from '../../../Components/ErrorOkModal'
import { Loader } from '../../../Components/Loader'
import { setLoading } from '../../../../redux/actions/Loader'
import { CustomerApi } from '../../../../api/customer'
import { showError } from '../../../../redux/actions/ErrorModal'
import { refreshTokenHelper } from '../../../../api/helper/userHelper'

const deviceWidth = Dimensions.get('screen').width

export default EditUsername = (props) => {
  const userChangesData = useSelector((state) => state.userOperations.userChangesData)
  const updateUserData = useSelector((state) => state.userOperations.updateUserData)
  const [username, setUsername] = useState(props.route.params?.username)
  const [error, setError] = useState({
    value: false,
    message: ''
  })

  const checkEmail = () => {
    dispatch(setLoading(true))
    const data = {
      username: username
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
              username: username
            }
          }))
          dispatch(forUpdateUserData({
            ...updateUserData,
            username: username
          }))
          navigate('UserProfileScreen')
          dispatch(setLoading(false))
        } else {
          setError({ value: true, message: response?.data?.message || response?.data })
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
          OkButton={() => {
            setError({ value: false, message: '' })
          }}
        />
        <CustomNavbar
          Title={'Edit Username'}
        />
        <View style={[styles.componentContainer, { marginTop: 20 }]}>
          <Text style={styles.componentTitle}>Username</Text>
          <TextInput
            value={username}   
            style={styles.valueTxtInput}
            onChangeText={state => setUsername(state)}
          />
        </View>
        <TouchableOpacity
          style={[styles.updateBtn, { 
            backgroundColor: props.route.params?.username === username ||
                             username.length < 8 ? UMColors.primaryGray : UMColors.primaryOrange 
          }]}
          disabled={props.route.params?.username === username || username.length < 8 ? true : false}
          onPress={() => {
            checkEmail()
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
