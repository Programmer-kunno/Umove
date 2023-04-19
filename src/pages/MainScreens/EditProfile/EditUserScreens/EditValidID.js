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
import { Image } from 'react-native-elements'

const deviceWidth = Dimensions.get('screen').width

export default EditValidID = (props) => {
  const userChangesData = useSelector((state) => state.userOperations.userChangesData)
  const [validID, setValidID] = useState(props.route.params?.validID)

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.mainContainer}>
        <GrayNavbar
          Title={'Edit Name'}
        />
        <View style={[styles.componentContainer, { marginTop: 20 }]}>
          <Text style={styles.componentTitle}>Valid ID</Text>
          <TouchableOpacity
            style={styles.validIDBtn}
          >
            <Image
              style={styles.validIDImage}
              source={{ uri: validID }}
              resizeMode='contain'
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.updateBtn}
          onPress={() => {
            // dispatch(saveUserChanges({ 
            //   ...userChangesData, 
            //   userDetails: {
            //     ...userChangesData.userDetails,
            //     firstName: firstName,
            //     middleName: middleName,
            //     lastName: lastName
            //   }
            // }))
            // navigate('UserProfileScreen')
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
    alignItems: 'center',
  },
  componentTitle: {
    width: '95%',
    paddingLeft: 5,
    fontSize: 15,
    marginBottom: 5
  },
  validIDImage: {
    width: 250,
    height: 150,
    marginVertical: 10
  },
  validIDBtn: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: UMColors.BGOrange,
    borderRadius: 10,
    elevation: 10,
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