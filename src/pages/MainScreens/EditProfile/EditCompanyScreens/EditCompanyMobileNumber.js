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
import { mobileNumberRegex } from '../../../../utils/stringHelper'
import ErrorOkModal from '../../../Components/ErrorOkModal'
import { Loader } from '../../../Components/Loader'

const deviceWidth = Dimensions.get('screen').width

export default EditCompanyMobileNumber = (props) => {
  const userChangesData = useSelector((state) => state.userOperations.userChangesData)
  const updateUserData = useSelector((state) => state.userOperations.updateUserData)
  const [companyMobileNumber, setCompanyMobileNumber] = useState(props.route.params?.companyMobileNumber.replace('+63', ''))
  const [error, setError] = useState({
    value: false,
    message: ''
  })

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.mainContainer}>
        <ErrorOkModal
          Visible={error.value}
          ErrMsg={error.message}
          OkButton={() => {
            setError({ value: false, message: '' })
          }}
        />
        <CustomNavbar
          Title={'Edit Mobile Number'}
        />
        <View style={[styles.componentContainer, { marginTop: 20 }]}>
          <Text style={styles.componentTitle}>Mobile Number</Text>
          <View style={{ flexDirection: 'row', width: '80%', height: 40 }}>
            <TextInput
              style={styles.mobileNumberCodeInput}
              editable={false}
              placeholder={'+63'}
            />
            <TextInput
              style={styles.mobileNumberInput}
              value={companyMobileNumber}
              keyboardType='number-pad'
              onChangeText={(val) => {
                setCompanyMobileNumber(val)
              }}
              maxLength={10}
            />
          </View>
        </View>
        <TouchableOpacity
          style={[styles.updateBtn, { 
            backgroundColor: props.route.params?.companyMobileNumber === companyMobileNumber || companyMobileNumber.length === 0 ? 
                             UMColors.primaryGray  : UMColors.primaryOrange 
                            }]}
          disabled={props.route.params?.companyMobileNumber === companyMobileNumber || companyMobileNumber.length === 0 ? true : false}
          onPress={() => {
            if(!mobileNumberRegex('+63' + companyMobileNumber)){
              setError({ value: true, message: 'Mobile Number is not valid'})
            } else {
              dispatch(saveUserChanges({ 
                ...userChangesData, 
                companyDetails: {
                  ...userChangesData.companyDetails,
                  companyMobileNumber: '+63' + companyMobileNumber
                }
              }))
              dispatch(forUpdateUserData({
                ...updateUserData,
                companyMobileNumber: '+63' + companyMobileNumber
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
  mobileNumberCodeInput: {
    fontSize: 13,
    height: '100%',
    width: '15%',
    textAlign: 'right',
    paddingVertical: 0,
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 25,
    borderTopColor: UMColors.primaryOrange,
    borderBottomColor: UMColors.primaryOrange,
    borderLeftColor: UMColors.primaryOrange,
    borderRightWidth: 0,
    borderWidth: 1,
    backgroundColor: 'white',
  },
  mobileNumberInput: {
    fontSize: 13,
    height: '100%',
    width: '85%',
    paddingVertical: 0,
    borderTopRightRadius: 25,
    borderBottomRightRadius: 25,
    borderTopColor: UMColors.primaryOrange,
    borderBottomColor: UMColors.primaryOrange,
    borderLeftWidth: 0,
    borderRightColor: UMColors.primaryOrange,
    borderWidth: 1,
    backgroundColor: 'white',
    paddingLeft: 10
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