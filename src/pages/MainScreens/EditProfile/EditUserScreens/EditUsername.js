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

export default EditUsername = (props) => {
  const userChangesData = useSelector((state) => state.userOperations.userChangesData)
  const [username, setUsername] = useState(props.route.params?.username)

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.mainContainer}>
        <GrayNavbar
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
          style={[styles.updateBtn, { backgroundColor: username ? UMColors.primaryOrange : UMColors.primaryGray }]}
          disabled={username ? false : true}
          onPress={() => {
            dispatch(saveUserChanges({ 
              ...userChangesData, 
              userDetails: {
                ...userChangesData.userDetails,
                username: username
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
