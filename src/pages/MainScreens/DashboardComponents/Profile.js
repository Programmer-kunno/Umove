import React, { useEffect, useRef, useState }  from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Dimensions, StatusBar, Modal } from 'react-native';
import { UMColors } from '../../../utils/ColorHelper';
import { UMIcons } from '../../../utils/imageHelper';
import { useSelector } from 'react-redux';
import { CustomerApi } from '../../../api/customer';
import { TextInput } from 'react-native-gesture-handler';
import { Loader } from '../../Components/Loader';
import { dispatch } from '../../../utils/redux';
import { saveUser, saveUserChanges, userLogout } from '../../../redux/actions/User';
import { setLoading } from '../../../redux/actions/Loader';
import { navigate, resetNavigation } from '../../../utils/navigationHelper';
import { refreshTokenHelper } from '../../../api/helper/userHelper';
import ErrorWithCloseButtonModal from '../../Components/ErrorWithCloseButtonModal';
import { showError } from '../../../redux/actions/ErrorModal';
import ImagePicker from 'react-native-image-crop-picker';
import RBSheet from 'react-native-raw-bottom-sheet';
import DocumentPicker from 'react-native-document-picker'
import getPath from '@flyerhq/react-native-android-uri-path';
import { canAccessCamera, canReadMedia } from '../../../utils/mediaHelper';
import ErrorOkModal from '../../Components/ErrorOkModal';

const deviceWidth = Dimensions.get('screen').width
const deviceHeight = Dimensions.get('screen').height

export default Profile = () => {  
  
  const user = useSelector((state) => state.userOperations.userData)
  const userDetailsData = useSelector((state) => state.userOperations.userDetailsData)
  const editUserData = {
    customerType: userDetailsData.customer_type?.includes('Corporate' || 'corporate') ? 'corporate' : 'individual',
    accountNumber: userDetailsData?.user?.user_profile?.account_number,
    firstName: userDetailsData?.user?.user_profile?.first_name,
    middleName: userDetailsData?.user?.user_profile?.middle_name,
    lastName: userDetailsData?.user?.user_profile?.last_name,
    username: userDetailsData?.user?.username,
    email: userDetailsData?.user?.user_profile?.email,
    mobileNumber: userDetailsData?.user?.user_profile?.mobile_number,
    address: userDetailsData?.user?.user_profile?.address,
    barangay: userDetailsData?.user?.user_profile?.barangay,
    city: userDetailsData?.user?.user_profile?.city,
    province: userDetailsData?.user?.user_profile?.province,
    region: userDetailsData?.user?.user_profile?.region,
    zipCode: userDetailsData?.user?.user_profile?.zip_code,
    validID: userDetailsData?.valid_id
  }
  const editCompanyData = userDetailsData?.company ? {
    companyName: userDetailsData?.company?.company_name,
    companyEmail: userDetailsData?.company?.company_email,
    companyMobileNumber: userDetailsData?.company?.company_mobile_number,
    officeAddress: userDetailsData?.company?.office_address,
    officeBarangay: userDetailsData?.company?.office_barangay,
    officeCity: userDetailsData?.company?.office_city,
    officeProvince: userDetailsData?.company?.office_province,
    officeZipCode: userDetailsData?.company?.office_zip_code,
    companyLogo: userDetailsData?.company?.company_logo,
    bir: userDetailsData?.company?.company_requirement?.bir,
    dti: userDetailsData?.company?.company_requirement?.dti
  } : null
  const RBSheetRef = useRef(null)
  const setRef = (ref) => { RBSheetRef.current = ref; }
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [cancelModalVisible, setCancelModalVisible] = useState(false)
  const [profilePic, setProfilePic] = useState('')
  const [errorPass, setErrorPass] = useState({
    value: false,
    message: ''
  })
  const [error, setError] = useState({
    value: false,
    message: ''
  })

  useEffect(() => {
    dispatch(setLoading(false))
    setName(userDetailsData?.user?.user_profile?.first_name.charAt(0).toUpperCase() + userDetailsData?.user?.user_profile?.first_name.slice(1) + ' ' + 
            userDetailsData?.user?.user_profile?.last_name.charAt(0).toUpperCase() + userDetailsData?.user?.user_profile?.last_name.slice(1))
  }, [])

  const deleteUser = () => {
    dispatch(setLoading(true))
    refreshTokenHelper(async() => {
      const data = {
        password: password
      }
      const response = await CustomerApi.deleteUser(data)
      console.log(response)
      if(response == undefined){
        dispatch(setLoading(false))
        dispatch(showError(true))
      } else {
        if(response.data.success){
          resetNavigation('Landing')
          dispatch(userLogout())
          dispatch(setLoading(false))
        } else {
          setErrorPass({ value: true, message: 'Password is incorrect' })
          dispatch(setLoading(false))
          setCancelModalVisible(true)
        }
      }
    })
  }

  const cancelConfirmModal = () => {
    return(
      <Modal
        visible={cancelModalVisible}
        animationType='none'
        statusBarTranslucent
        transparent={true}
      >
        <View style={styles.mainMdlContainer}>
          <View style={styles.mdlContainer}>
            <View style={styles.mdlTxtContainer}>
              <Text style={styles.mdlTxt}>{errorPass.value ? errorPass.message : 'Input your password to confirm'}</Text>
              <TextInput
                style={styles.mdlPasswordInput}
                secureTextEntry={true}
                onChangeText={(val) => {
                  setPassword(val)
                }}
              />
            </View>
            <View style={styles.mdlBtnContainer}>
              <TouchableOpacity
                style={styles.mdlBtn}
                onPress={() => {
                  setCancelModalVisible(false)
                  deleteUser()
                }}
              >
                <Text style={styles.mdlBtnTxt}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.mdlBtn}
                onPress={() => {
                  setCancelModalVisible(false)
                  setErrorPass({ value: false })
                }}
              >
                <Text style={styles.mdlBtnTxt}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    )
  }

  const updateUser = (imgData) => {
    dispatch(setLoading(true))
    const data ={
      profilePicture: imgData
    }
    refreshTokenHelper(async() => {
      const response = await CustomerApi.updateCustomer(data, editUserData.customerType, editUserData.accountNumber)
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
          dispatch(setLoading(false))
        } else {
          setError({ value: true, message: response?.data?.message || response?.data })
          dispatch(setLoading(false))
        }
      }
    })
  }

  const onPressImage = async () => {
    RBSheetRef.current.close()
    const granted = await canAccessCamera();
    
    if(granted){
      ImagePicker.openCamera({
        width: 400,
        height: 400,
        cropping: true
      }).then(image => {
        console.log(image);
        let result = image
        let filename = result.path.substring(result.path.lastIndexOf('/') + 1, result.path.length);
        const imageData = {
          uri: result.path,
          type: result.mime,
          name: filename
        }
        updateUser(imageData)
      }).catch(err => {
        console.log(err)
      });
    } else {
      return;
    }
  }

  const onChooseGallery = async() => {
    RBSheetRef.current.close()
    const granted = await canReadMedia();
    
    if(granted){
      ImagePicker.openPicker({
        width: 400,
        height: 400,
        cropping: true
      }).then(image => {
        console.log(image);
        let result = image
        let filename = result.path.substring(result.path.lastIndexOf('/') + 1, result.path.length);
        const imageData = {
          uri: result.path,
          type: result.mime,
          name: filename
        }
        updateUser(imageData)
      }).catch(err => {
        console.log(err)
      });
    } else {
      return;
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
  

  return(
    <View style={styles.mainContainer}>
    <ErrorWithCloseButtonModal/>
    <ErrorOkModal
      Visible={error.value}
      ErrMsg={error.message}
      OkButton={() => setError({ value: false, message: '' })}
    />
    {cancelConfirmModal()}
    <StatusBar translucent barStyle={'light-content'}/>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitleTxt}>Profile</Text>
      </View>

      {/* Body */}
      <View style={styles.bodyContainer}>
        {/* Profile */}
        <View style={styles.profileContainer}>
          <TouchableOpacity
            style={{ overflow: 'hidden' , width: 110, height: 110, borderRadius: 100 }}
            onPress={() => RBSheetRef.current.open()}
          >
            <Image
              style={styles.profilePicture}
              source={userDetailsData?.user?.user_profile?.profile_image ? {uri: userDetailsData?.user?.user_profile?.profile_image} : UMIcons.userBlankProfile }
              resizeMode={'contain'}
            />
            <View style={styles.profileCameraContainer}>
              <Image
                style={{ width: 25, height: 25, marginVertical: 5 }}
                source={UMIcons.cameraWhiteIcon}
                resizeMode='contain'
              />
            </View>
          </TouchableOpacity>
          <Text style={styles.profileName}>{name}</Text>
          {
            userDetailsData.customer_type?.includes('Corporate' || 'corporate') &&
              <Text style={styles.companyName}>{userDetailsData?.company?.company_name}</Text>
          }
          <View style={styles.editButtonsContainer}>
            <TouchableOpacity
              style={styles.editProfileBtn}
              onPress={() => {
                if(user?.customer_type === "corporate") {
                  navigate('ChooseToEditScreen')
                  dispatch(saveUserChanges({ userDetails: editUserData, companyDetails: editCompanyData }))
                } else {
                  navigate('UserProfileScreen')
                  dispatch(saveUserChanges({ userDetails: editUserData }))
                }
              }}
            >
              <Text style={styles.editProfileBtnTxt}>Edit Profile</Text>
            </TouchableOpacity>
            {
              userDetailsData.customer_type?.includes('Corporate' || 'corporate') &&
                <TouchableOpacity
                  style={styles.editProfileBtn}
                  onPress={() => {
                    navigate('EditDocuments')
                    dispatch(saveUserChanges({ userDetails: editUserData, companyDetails: editCompanyData }))
                  }}
                >
                  <Text style={styles.editProfileBtnTxt}>Upload Documents</Text>
                </TouchableOpacity>
            }
          </View>
          {/* <View style={[styles.contactContainer, { marginTop: 12 }]}>
            <Text style={[styles.contactTxt, { textAlign: 'left' }]}>Email Address:</Text>
            <Text style={styles.contactTxt}>{userDetailsData?.user?.user_profile?.email}</Text>
          </View>
          <View style={styles.contactContainer}>
            <Text style={[styles.contactTxt, { textAlign: 'left' }]}>Phone Number:</Text>
            <Text style={styles.contactTxt}>{userDetailsData?.user?.user_profile?.mobile_number}</Text>
          </View> */}
        </View>
        {/* Connected Accounts */}
        <View style={styles.connectedAcctContainer}>
          <Text style={styles.connectedAcctTxt}>Connected Accounts</Text>
          <TouchableOpacity
            style={styles.acctsBtn}
            onPress={() => {}}
          >
            <View style={styles.acctIconContainer}>
              <Image
                style={styles.socialIcon}
                source={UMIcons.googleIcon}
                resizeMode={'contain'}
              />
              <Text style={styles.socialTxt}>Google</Text>
            </View>
            <Text style={styles.socialConnectTxt}>Connect</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.acctsBtn}
            onPress={() => {}}
          >
            <View style={styles.acctIconContainer}>
              <Image
                style={styles.socialIcon}
                source={UMIcons.facebookIcon}
                resizeMode={'contain'}
              />
              <Text style={styles.socialTxt}>Facebook</Text>
            </View>
            <Text style={styles.socialConnectTxt}>Connect</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.acctsBtn}
            onPress={() => {}}
          >
            <View style={styles.acctIconContainer}>
              <Image
                style={styles.socialIcon}
                source={UMIcons.appleIcon}
                resizeMode={'contain'}
              />
              <Text style={styles.socialTxt}>Apple</Text>
            </View>
            <Text style={styles.socialConnectTxt}>Connect</Text>
          </TouchableOpacity>
        </View>
        {/* Delete Account */}
        <TouchableOpacity
          style={styles.deleteAcctBtn}
          onPress={() => {
            setCancelModalVisible(true)
          }}
        >
          <Text style={styles.deleteBtnTxt}>Delete Account</Text>
        </TouchableOpacity>
      </View>
      {bottomSheet()}
      <Loader/>
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1, 
    backgroundColor: UMColors.BGOrange, 
  },
  headerContainer: {
    height: '12%',
    width: deviceWidth,
    backgroundColor: UMColors.darkerGray,
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  headerTitleTxt: {
    color: UMColors.white,
    fontSize: 22,
    marginBottom: 15,
    fontWeight: 'bold'
  },
  bodyContainer: {
    borderWidth: 1,
    flex: 1,
    alignItems: 'center'
  },
  profileContainer: {
    width: deviceWidth / 1.2,
    marginTop: '5%',
    height: '42%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePicture: {
    width: 110,
    height: 110,
    borderRadius: 100
  },
  profileName: {
    fontSize: 25,
    color: UMColors.primaryOrange,
    marginTop: 5,
    fontWeight: 'bold',
  },
  companyName: {
    fontSize: 15,
    color: UMColors.primaryGray,
  },
  editButtonsContainer: {
    width: deviceWidth,
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  editProfileBtn: {
    backgroundColor: UMColors.BGOrange,
    width: '38%',
    height: 37,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 15,
    marginBottom: 10,
    elevation: 10,
  },
  editProfileBtnTxt: {
    fontSize: 14,
    color: UMColors.black
  },
  profileCameraContainer: {
    width: 110,
    backgroundColor: 'rgba(27, 32, 39, 0.5)',
    alignItems: 'center',
    position: 'absolute',
    alignSelf: 'center',
    bottom: 0, 
  },
  contactContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: 8
  },
  contactTxt: {
    width: '50%',
    textAlign: 'right',
    fontSize: 12,
    color: UMColors.black
  },
  connectedAcctContainer: {
    width: deviceWidth / 1.1,
    marginTop: '10%',
    height: '30%',
    justifyContent: 'center',
  },
  connectedAcctTxt: {
    color: UMColors.primaryOrange,
    fontSize: 13,
    marginLeft: '5%',
    marginBottom: 10
  },
  acctsBtn: {
    backgroundColor: UMColors.darkerBgOrange,
    width: '90%',
    height: '23%',
    alignSelf: 'center',
    borderRadius: 5,
    elevation: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 7
  },
  acctIconContainer: {
    width: '40%',
    height: '95%',
    alignItems: 'center',
    flexDirection: 'row'
  },
  socialIcon: {
    height: '50%',
    width: '25%',
    marginLeft: 15
  },
  socialTxt: {
    fontSize: 13,
    color: UMColors.black,
    marginLeft: 10,
  },
  socialConnectTxt: {
    fontSize: 13,
    color: UMColors.primaryOrange,
    marginLeft: 10,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginRight: 20
  },
  deleteAcctBtn: {
    width: '50%',
    height: '6%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    position: 'absolute',
    bottom: 40
  },
  deleteBtnTxt: {
    fontSize: 15,
    color: UMColors.red,
    fontWeight: 'bold'
  },
  mainMdlContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  mdlContainer: {
    width: '80%',
    height: '25%',
    backgroundColor: 'rgb(27, 32, 39)',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center'
  },
  mdlTxtContainer: {
    width: '85%',
    justifyContent: 'center',
  },
  mdlTxt: {
    color: 'white',
    fontSize: 18,
    fontWeight: '400',
    alignSelf: 'center',
    textAlign: 'center'
  },
  mdlBtnContainer: {
    width: '100%',
    height: '35%',
    marginTop: '5%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  mdlBtn: {
    width: '38%',
    backgroundColor: 'white',
    height: '65%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7,
    marginHorizontal: 10
  },
  mdlBtnTxt: {
    fontSize: 16,
    color: 'black'
  },
  mdlPasswordInput: {
    backgroundColor: UMColors.white,
    color: UMColors.black,
    height: 40,
    borderRadius: 5,
    marginTop: 6,
    fontSize: 14,
    paddingLeft: 10
  },
  rbSheetBtn: {
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