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
import { emailRegex } from '../../../../utils/stringHelper'
import ErrorOkModal from '../../../Components/ErrorOkModal'
import { Loader } from '../../../Components/Loader'
import ErrorWithCloseButtonModal from '../../../Components/ErrorWithCloseButtonModal'

const deviceWidth = Dimensions.get('screen').width

export default EditCompanyEmail = (props) => {
  const userChangesData = useSelector((state) => state.userOperations.userChangesData)
  const updateUserData = useSelector((state) => state.userOperations.updateUserData)
  const [companyEmail, setCompanyEmail] = useState(props.route.params?.companyEmail)
  const [error, setError] = useState({
    value: false,
    message: ''
  })

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
          <Text style={styles.componentTitle}>Email Address</Text>
          <TextInput
            value={companyEmail}   
            style={styles.valueTxtInput}
            onChangeText={val => setCompanyEmail(val)}
          />
        </View>
        <TouchableOpacity
          style={[styles.updateBtn, { 
                backgroundColor: props.route.params?.companyEmail === companyEmail || companyEmail.length === 0 ? 
                                 UMColors.primaryGray  : UMColors.primaryOrange 
                                }]}
          disabled={props.route.params?.companyEmail === companyEmail || companyEmail.length === 0 ? true : false}
          onPress={() => {
            if(!emailRegex(companyEmail)){
              setError({ value: true, message: 'Email is not valid' })
            } else {
              dispatch(saveUserChanges({ 
                ...userChangesData, 
                companyDetails: {
                  ...userChangesData.companyDetails,
                  companyEmail: companyEmail
                }
              }))
              dispatch(forUpdateUserData({
                ...updateUserData,
                companyEmail: companyEmail
              }))
              navigate('CompanyProfileScreen')
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