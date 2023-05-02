import { 
  SafeAreaView, 
  StyleSheet, 
  Text, 
  View, 
  Dimensions, 
  TouchableOpacity, 
  TouchableWithoutFeedback, 
  Keyboard 
} from 'react-native'
import React, { useRef, useState } from 'react'
import { UMColors } from '../../../../utils/ColorHelper'
import CustomNavbar from '../../../Components/CustomNavbar'
import { navigate } from '../../../../utils/navigationHelper'
import { dispatch } from '../../../../utils/redux'
import { forUpdateUserData, saveUserChanges } from '../../../../redux/actions/User'
import { useSelector } from 'react-redux'
import { Image } from 'react-native-elements'
import { launchCamera } from 'react-native-image-picker'
import { canAccessCamera } from '../../../../utils/mediaHelper'
import RBSheet from 'react-native-raw-bottom-sheet'
import DocumentPicker from 'react-native-document-picker'
import getPath from '@flyerhq/react-native-android-uri-path';

const deviceWidth = Dimensions.get('screen').width
const deviceHeight = Dimensions.get('screen').height

export default EditValidID = (props) => {
  const userChangesData = useSelector((state) => state.userOperations.userChangesData)
  const updateUserData = useSelector((state) => state.userOperations.updateUserData)
  const validID = props.route.params?.validID?.uri
  const [newValidID, setNewValidID] = useState(undefined)
  const RBSheetRef = useRef(null)

  const setRef = (ref) => {
    RBSheetRef.current = ref;
  }

  const onPressImage = async () => {
    const granted = await canAccessCamera();
    
    if(granted){
      launchCamera().then(res => {
        console.log(res)
        if(res.didCancel) {
          return;
        } else if(res?.assets?.length > 0) {
          const mediaAsset = res.assets[0];
          const imageData = {
            uri: mediaAsset.uri,
            name: mediaAsset.fileName,
            type: mediaAsset.type
          }
          setNewValidID(imageData)
          RBSheetRef.current.close()
        }
      }).catch((e) => {
        console.log(e);
      })
    } else {
      return;
    }
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
      setNewValidID(imgData)
      RBSheetRef.current.close()
    } catch (err) {
      //Handling any exception (If any)
      if (DocumentPicker.isCancel(err)) {
        RBSheetRef.current.close()
        //If user canceled the document selection
      } else {
        //For Unknown Error
        RBSheetRef.current.close()
        alert('Unknown Error: ' + JSON.stringify(err));
      }
    }
  }

  const bottomSheet = () => {
    return(
      <RBSheet
        ref={setRef}
        height={deviceHeight / 4.5}
        openDuration={250}
        customStyles={{
          container: {
            justifyContent: "center",
            alignItems: "center",
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
          }
        }}
      >
        <TouchableOpacity
          style={styles.rbSheetBtn}
          onPress={() => onPressImage()}
        >
          <Text style={styles.rbSheetText}>Take a photo</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.rbSheetBtn}
          onPress={() => onChooseGallery()}
        >
          <Text style={styles.rbSheetText}>Choose from gallery</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.rbSheetBtn}
          onPress={() => RBSheetRef.current.close()}
        >
          <Text style={[styles.rbSheetText, { color: UMColors.red }]}>Cancel</Text>
        </TouchableOpacity>
      </RBSheet>
    )
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.mainContainer}>
        <CustomNavbar
          Title={'Edit Valid ID'}
        />
        <View style={[styles.componentContainer, { marginTop: 20 }]}>
          <Text style={styles.componentTitle}>Valid ID</Text>
          <TouchableOpacity
            style={styles.validIDBtn}
            onPress={() => {
              RBSheetRef.current.open()
            }}
          >
            <Image
              style={styles.validIDImage}
              source={{ uri: newValidID ? newValidID.uri : validID }}
              resizeMode='contain'
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[styles.updateBtn, { backgroundColor: newValidID ? UMColors.primaryOrange : UMColors.primaryGray }]}
          disabled={newValidID ? false : true}
          onPress={() => {
            dispatch(saveUserChanges({ 
              ...userChangesData, 
              userDetails: {
                ...userChangesData.userDetails,
                validID: {
                  uri: newValidID.uri,
                  name: newValidID.name,
                  type: newValidID.type
                }
              }
            }))
            dispatch(forUpdateUserData({
              ...updateUserData,
              validID: {
                uri: newValidID.uri,
                name: newValidID.name,
                type: newValidID.type
              }
            }))
            navigate('UserProfileScreen')
          }}
        >
          <Text style={styles.updateBtnTxt}>Update</Text>
        </TouchableOpacity>
        {bottomSheet()}
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