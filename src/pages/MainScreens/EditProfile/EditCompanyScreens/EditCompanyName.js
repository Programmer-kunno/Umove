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

const deviceWidth = Dimensions.get('screen').width

export default EditCompanyName = (props) => {
  const userChangesData = useSelector((state) => state.userOperations.userChangesData)
  const updateUserData = useSelector((state) => state.userOperations.updateUserData)
  const [companyName, setCompanyName] = useState(props.route.params?.companyName)

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.mainContainer}>
        <CustomNavbar
          Title={'Edit Company Name'}
        />
        <View style={[styles.componentContainer, { marginTop: 20 }]}>
          <Text style={styles.componentTitle}>Company Name</Text>
          <TextInput
            value={companyName}   
            style={styles.valueTxtInput}
            onChangeText={val => setCompanyName(val)}
          />
        </View>
        <TouchableOpacity
          style={[styles.updateBtn, { 
            backgroundColor: props.route.params?.companyName === companyName || 
                             companyName.length === 0 ? UMColors.primaryGray : UMColors.primaryOrange 
                          }]}
          disabled={
            props.route.params?.companyName === companyName || 
            companyName.length === 0 ? true : false
          }
          onPress={() => {
            dispatch(saveUserChanges({ 
              ...userChangesData, 
              companyDetails: {
                ...userChangesData.companyDetails,
                companyName: companyName
              }
            }))
            dispatch(forUpdateUserData({
              ...updateUserData,
              companyName: companyName
            }))
            navigate('CompanyProfileScreen')
          }}
        >
          <Text style={styles.updateBtnTxt}>Update</Text>
        </TouchableOpacity>
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