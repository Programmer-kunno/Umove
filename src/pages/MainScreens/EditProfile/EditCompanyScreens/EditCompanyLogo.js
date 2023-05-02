import { 
  SafeAreaView, 
  StyleSheet, 
  Text, 
  View, 
  Dimensions, 
  TouchableOpacity, 
  TouchableWithoutFeedback, 
  Keyboard,
  Platform
} from 'react-native'
import React, { useRef, useState } from 'react'
import { UMColors } from '../../../../utils/ColorHelper'
import CustomNavbar from '../../../Components/CustomNavbar'
import { navigate } from '../../../../utils/navigationHelper'
import { dispatch } from '../../../../utils/redux'
import { forUpdateUserData, saveUserChanges } from '../../../../redux/actions/User'
import { useSelector } from 'react-redux'
import { Image } from 'react-native-elements'
import DocumentPicker from 'react-native-document-picker'
import getPath from '@flyerhq/react-native-android-uri-path';

const deviceWidth = Dimensions.get('screen').width
const deviceHeight = Dimensions.get('screen').height

export default EditCompanyLogo = (props) => {
  const userChangesData = useSelector((state) => state.userOperations.userChangesData)
  const updateUserData = useSelector((state) => state.userOperations.updateUserData)
  const companyLogo = props.route.params?.companyLogo?.uri
  const [newCompanyLogo, setNewCompanyLogo] = useState(undefined)
  const RBSheetRef = useRef(null)

  const setRef = (ref) => {
    RBSheetRef.current = ref;
  }

  const onChooseGallery = async() => {
    try {
      const response = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
      });  
      console.log(response)
      const origPath = getPath(response[0].uri)
      const fileOrigPath = Platform.OS === 'ios' ? origPath : `file://${origPath}`
      response[0].uri = fileOrigPath
      const imgData = {
        uri: fileOrigPath,
        name: response[0].name,
        type: response[0].type
      }
      setNewCompanyLogo(imgData)
    } catch (err) {
      //Handling any exception (If any)
      if (DocumentPicker.isCancel(err)) {
        //If user canceled the document selection
      } else {
        //For Unknown Error
        alert('Unknown Error: ' + JSON.stringify(err));
      }
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.mainContainer}>
        <CustomNavbar
          Title={'Edit Company Logo'}
        />
        <View style={[styles.componentContainer, { marginTop: 20 }]}>
          <Text style={styles.componentTitle}>Company Logo</Text>
          <TouchableOpacity
            style={styles.companyLogoBtn}
            onPress={() => {
              onChooseGallery()
            }}
          >
            <Image
              style={styles.companyLogoImage}
              source={{ uri: newCompanyLogo ? newCompanyLogo.uri : companyLogo }}
              resizeMode='contain'
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[styles.updateBtn, { backgroundColor: newCompanyLogo ? UMColors.primaryOrange : UMColors.primaryGray }]}
          disabled={newCompanyLogo ? false : true}
          onPress={() => {
            dispatch(saveUserChanges({ 
              ...userChangesData, 
              companyDetails: {
                ...userChangesData.companyDetails,
                companyLogo: {
                  uri: newCompanyLogo.uri,
                  name: newCompanyLogo.name,
                  type: newCompanyLogo.type
                }
              }
            }))
            dispatch(forUpdateUserData({
              ...updateUserData,
              companyLogo: {
                uri: newCompanyLogo.uri,
                name: newCompanyLogo.name,
                type: newCompanyLogo.type
              }
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
    alignItems: 'center',
  },
  componentTitle: {
    width: '95%',
    paddingLeft: 5,
    fontSize: 15,
    marginBottom: 5
  },
  companyLogoImage: {
    width: 250,
    height: 150,
    marginVertical: 10
  },
  companyLogoBtn: {
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
  },
  rbSheetBtn: {
    borderBottomWidth: 0.5,
    width: deviceWidth / 1.4,
    height: '22%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10
  },
  rbSheetText: {
    fontSize: 17,
    color: UMColors.primaryOrange
  }
})