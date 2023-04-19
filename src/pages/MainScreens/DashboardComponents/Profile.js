import React, { useEffect, useState }  from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Dimensions, StatusBar, Modal } from 'react-native';
import { UMColors } from '../../../utils/ColorHelper';
import { UMIcons } from '../../../utils/imageHelper';
import { useSelector } from 'react-redux';
import { CustomerApi } from '../../../api/customer';
import { TextInput } from 'react-native-gesture-handler';
import { Loader } from '../../Components/Loader';
import { dispatch } from '../../../utils/redux';
import { saveUserChanges, userLogout } from '../../../redux/actions/User';
import { setLoading } from '../../../redux/actions/Loader';
import { navigate, resetNavigation } from '../../../utils/navigationHelper';
import { refreshTokenHelper } from '../../../api/helper/userHelper';
import ErrorWithCloseButtonModal from '../../Components/ErrorWithCloseButtonModal';
import { showError } from '../../../redux/actions/ErrorModal';

const deviceWidth = Dimensions.get('screen').width

export default Profile = () => {  
  
  const user = useSelector((state) => state.userOperations.userData)
  const userDetailsData = useSelector((state) => state.userOperations.userDetailsData)
  console.log(userDetailsData.user)
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState({
    value: false,
    message: 'Password is incorrect'
  })
  const [cancelModalVisible, setCancelModalVisible] = useState(false)
  const editUserData = {
    customerType: userDetailsData.customer_type,
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
    companyLogo: userDetailsData?.company?.company_logo
  } : null 

  useEffect(() => {
    dispatch(setLoading(false))
    setName(user.first_name.charAt(0).toUpperCase() + user.first_name.slice(1) + ' ' + user.last_name.charAt(0).toUpperCase() + user.last_name.slice(1))
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
          setErr({
            ...err,
            value: true
          })
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
              <Text style={styles.mdlTxt}>{err.value ? err.message : 'Input your password to confirm'}</Text>
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
                  console.log(password)
                  deleteUser()
                }}
              >
                <Text style={styles.mdlBtnTxt}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.mdlBtn}
                onPress={() => {
                  setCancelModalVisible(false)
                  setErr({
                   ...err,
                   value: false
                  })
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
  

    return(
      <View style={styles.mainContainer}>
      <ErrorWithCloseButtonModal/>
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
            <Image
              style={styles.profilePicture}
              source={UMIcons.userBlankProfile}
              resizeMode={'contain'}
            />
            <Text style={styles.profileName}>{name}</Text>
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
            <View style={[styles.contactContainer, { marginTop: 12 }]}>
              <Text style={[styles.contactTxt, { textAlign: 'left' }]}>Email Address:</Text>
              <Text style={styles.contactTxt}>{user.email}</Text>
            </View>
            <View style={styles.contactContainer}>
              <Text style={[styles.contactTxt, { textAlign: 'left' }]}>Phone Number:</Text>
              <Text style={styles.contactTxt}>{user.mobile_number}</Text>
            </View>
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
    alignItems: 'center'
  },
  profilePicture: {
    width: 110,
    height: 110,
    borderRadius: 50
  },
  profileName: {
    fontSize: 21,
    color: UMColors.black,
    marginTop: 15
  },
  editProfileBtn: {
    backgroundColor: UMColors.white,
    width: 110,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    marginTop: 5,
    marginBottom: 10,
    elevation: 10
  },
  editProfileBtnTxt: {
    fontSize: 14,
    color: UMColors.black
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
    backgroundColor: UMColors.red,
    elevation: 10,
    marginTop: '14%'
  },
  deleteBtnTxt: {
    fontSize: 13,
    color: UMColors.white,
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
  }
})