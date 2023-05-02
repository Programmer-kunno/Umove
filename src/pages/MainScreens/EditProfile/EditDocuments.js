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
import { UMColors } from '../../../utils/ColorHelper'
import CustomNavbar from '../../Components/CustomNavbar'
import { goBack, navigate, resetNavigation } from '../../../utils/navigationHelper'
import { dispatch } from '../../../utils/redux'
import { forUpdateUserData, saveUser, saveUserChanges } from '../../../redux/actions/User'
import { useSelector } from 'react-redux'
import { Image } from 'react-native-elements'
import { launchCamera } from 'react-native-image-picker'
import { canAccessCamera } from '../../../utils/mediaHelper'
import RBSheet from 'react-native-raw-bottom-sheet'
import DocumentPicker from 'react-native-document-picker'
import getPath from '@flyerhq/react-native-android-uri-path';
import { refreshTokenHelper } from '../../../api/helper/userHelper'
import { setLoading } from '../../../redux/actions/Loader'
import { CustomerApi } from '../../../api/customer'
import { showError } from '../../../redux/actions/ErrorModal'
import ErrorWithCloseButtonModal from '../../Components/ErrorWithCloseButtonModal'
import ErrorOkModal from '../../Components/ErrorOkModal'
import SuccessOkModal from '../../Components/SuccessOkModal'
import { Loader } from '../../Components/Loader'

const deviceWidth = Dimensions.get('screen').width
const deviceHeight = Dimensions.get('screen').height

export default EditDocuments = () => {
  const userChangesData = useSelector((state) => state.userOperations.userChangesData)
  console.log(userChangesData)
  const [newBir, setNewBir] = useState(undefined)
  const [newDti, setNewDti] = useState(undefined)
  const [itemSelected, setItemSelected] = useState()
  const RBSheetRef = useRef(null)
  const [error, setError] = useState({
    value: false,
    message: ''
  })
  const [success, setSuccess] = useState({
    value: false,
    message: ''
  })

  const setRef = (ref) => {
    RBSheetRef.current = ref;
  }

  const updateUser = () => {
    dispatch(setLoading(true))
    const data = {
      dti: newDti ? newDti : null,
      bir: newBir ? newBir : null
    }
    refreshTokenHelper(async() => {
      const response = await CustomerApi.updateCustomer(data, userChangesData?.userDetails?.customerType, userChangesData?.userDetails?.accountNumber)
      if(response == undefined){
        dispatch(showError(true))
        dispatch(setLoading(false))
      } else {
        if(response?.data?.success){
          updateRedux()
        } else {
          setError({ value: true, message: response?.data?.message || response?.data })
          dispatch(setLoading(false))
        }
      }
    })
  }

  const updateRedux = () => {
    refreshTokenHelper(async() => {
      const response = await CustomerApi.getCustomerData()
      if(response == undefined){
        dispatch(showError(true))
        dispatch(setLoading(false))
      } else {
        if(response?.data?.success) {
          dispatch(saveUser(response?.data?.data))
          setSuccess({ value: true, message: 'Document Update Success!'})
          dispatch(setLoading(false))
        } else {
          setError({ value: true, message: response?.data?.message || response?.data })
          dispatch(setLoading(false))
        }
      }
    })
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
          if(itemSelected === 'bir'){
            setNewBir(imageData)
          }
          if(itemSelected === 'dti'){
            setNewDti(imageData)
          }
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
      if(itemSelected === 'bir'){
        setNewBir(imgData)
      }
      if(itemSelected === 'dti'){
        setNewDti(imgData)
      }
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
        <ErrorWithCloseButtonModal/>
        <ErrorOkModal
          Visible={error.value}
          ErrMsg={error.message}
          OkButton={() => setError({ value: false, message: '' })}
        />
        <SuccessOkModal
          Visible={success.value}
          SuccessMsg={success.message}
          OkButton={() => {
            setSuccess({ value: false, message:'' })
            resetNavigation('DrawerNavigation')
          }}
        />
        <CustomNavbar
          Title={'Edit Documents'}
        />
        <View style={[styles.componentContainer, { marginTop: 20 }]}>
          <Text style={styles.componentTitle}>BIR</Text>
          <TouchableOpacity
            style={styles.validIDBtn}
            onPress={() => {
              setItemSelected('bir')
              RBSheetRef.current.open()
            }}
          >
            <Image
              style={styles.validIDImage}
              source={{ uri: newBir ? newBir.uri : userChangesData?.companyDetails?.bir }}
              resizeMode='contain'
            />
          </TouchableOpacity>
        </View>
        <View style={[styles.componentContainer, { marginTop: 20 }]}>
          <Text style={styles.componentTitle}>DTI</Text>
          <TouchableOpacity
            style={styles.validIDBtn}
            onPress={() => {
              setItemSelected('dti')
              RBSheetRef.current.open()
            }}
          >
            <Image
              style={styles.validIDImage}
              source={{ uri: newDti ? newDti.uri : userChangesData?.companyDetails?.dti }}
              resizeMode='contain'
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[styles.updateBtn, { backgroundColor: newDti || newBir ? UMColors.primaryOrange : UMColors.primaryGray }]}
          disabled={newDti || newBir ? false : true}
          onPress={() => {
            updateUser()
          }}
        >
          <Text style={styles.updateBtnTxt}>Update</Text>
        </TouchableOpacity>
        {bottomSheet()}
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
    height: 120,
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