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
import GrayNavbar from '../../../Components/GrayNavbar'
import { navigate } from '../../../../utils/navigationHelper'
import { dispatch } from '../../../../utils/redux'
import { saveUserChanges } from '../../../../redux/actions/User'
import { useSelector } from 'react-redux'

const deviceWidth = Dimensions.get('screen').width

export default EditName = (props) => {
  const userChangesData = useSelector((state) => state.userOperations.userChangesData)
  const [firstName, setFirstName] = useState(props.route.params?.firstName)
  const [middleName, setMiddleName] = useState(props.route.params?.middleName)
  const [lastName, setLastName] = useState(props.route.params?.lastName)

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.mainContainer}>
        <GrayNavbar
          Title={'Edit Name'}
        />
        <View style={[styles.componentContainer, { marginTop: 20 }]}>
          <Text style={styles.componentTitle}>First Name</Text>
          <TextInput
            value={firstName}   
            style={styles.valueTxtInput}
            onChangeText={val => setFirstName(val)}
          />
        </View>
        <View style={styles.componentContainer}>
          <Text style={styles.componentTitle}>Middle Name</Text>
          <TextInput
            value={middleName}
            style={styles.valueTxtInput}
            placeholder='(Optional)'
            onChangeText={val => setMiddleName(val)}
          />
        </View>
        <View style={styles.componentContainer}>
          <Text style={styles.componentTitle}>Last Name</Text>
          <TextInput
            value={lastName}
            style={styles.valueTxtInput}
            onChangeText={val => setLastName(val)}
          />
        </View>
        <TouchableOpacity
          style={styles.updateBtn}
          onPress={() => {
            dispatch(saveUserChanges({ 
              ...userChangesData, 
              userDetails: {
                ...userChangesData.userDetails,
                firstName: firstName,
                middleName: middleName,
                lastName: lastName
              }
            }))
            navigate('UserProfileScreen', )
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