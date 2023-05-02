import { View, Text, SafeAreaView, StyleSheet, Dimensions, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { UMColors } from '../../../utils/ColorHelper'
import CustomNavbar from '../../Components/CustomNavbar'
import { UMIcons } from '../../../utils/imageHelper'
import { useSelector } from 'react-redux'
import { ScrollView } from 'react-native-gesture-handler'
import { navigate, resetNavigation } from '../../../utils/navigationHelper'
import { dispatch } from '../../../utils/redux'
import { saveUser, saveUserChanges } from '../../../redux/actions/User'
import { refreshTokenHelper } from '../../../api/helper/userHelper'
import { CustomerApi } from '../../../api/customer'
import { showError } from '../../../redux/actions/ErrorModal'
import { setLoading } from '../../../redux/actions/Loader'
import ErrorWithCloseButtonModal from '../../Components/ErrorWithCloseButtonModal'
import ErrorOkModal from '../../Components/ErrorOkModal'
import SuccessOkModal from '../../Components/SuccessOkModal'
import { Loader } from '../../Components/Loader'

const deviceWidth = Dimensions.get('screen').width

export default UserProfileScreen = (props) => {

  const userChangesData = useSelector((state) => state.userOperations.userChangesData)
  const updateUserData = useSelector((state) => state.userOperations.updateUserData)
  const [error, setError] = useState({
    value: false,
    message: ''
  })
  const [success, setSuccess] = useState({
    value: false,
    message: ''
  })
  const fullname = userChangesData?.userDetails?.firstName + ' ' + 
                   userChangesData?.userDetails?.lastName
  const username = userChangesData?.userDetails?.username
  const email = userChangesData?.userDetails?.email
  const mobileNumber = userChangesData?.userDetails?.mobileNumber
  const legalAddress = userChangesData?.userDetails?.address + ' ' +
                       userChangesData?.userDetails?.barangay + ' ' +
                       userChangesData?.userDetails?.city + ' ' +
                       userChangesData?.userDetails?.province + ', ' +
                       userChangesData?.userDetails?.zipCode

  const updateUser = () => {
    console.log(updateUserData)
    dispatch(setLoading(true))
    refreshTokenHelper(async() => {
      const response = await CustomerApi.updateCustomer(updateUserData, userChangesData?.userDetails?.customerType, userChangesData?.userDetails?.accountNumber)
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
          setSuccess({ value: true, message: 'User Update Success!'})
          dispatch(setLoading(false))
        } else {
          setError({ value: true, message: response?.data?.message || response?.data })
          dispatch(setLoading(false))
        }
      }
    })
  }

  return (
    <SafeAreaView style={styles.mainContainer}>
      <ErrorWithCloseButtonModal/>
      <ErrorOkModal
        Visible={error.value}
        ErrMsg={error.message}
        OkButton={() => {
          setError({ value: false, message: '' })
        }}
      />
      <SuccessOkModal
         Visible={success.value}
         SuccessMsg={success.message}
         OkButton={() => {
          setSuccess({ value: false, message: '' })
          resetNavigation('DrawerNavigation')
         }}
      />
      <CustomNavbar
        Title={'User Profile'}
      />
      <ScrollView showsVerticalScrollIndicator={false} style={{ width: deviceWidth }} contentContainerStyle={{ alignItems: 'center' }}>
        <View style={[styles.detailsContainer, { marginTop: 20 }]}>
          <Text style={styles.detailsTitle}>Name</Text>
          <Text style={styles.detailsValue}>{fullname}</Text>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => {
              navigate('EditName', { 
                  firstName: userChangesData?.userDetails?.firstName,
                  middleName: userChangesData?.userDetails?.middleName,
                  lastName: userChangesData?.userDetails?.lastName 
                })
            }}
          >
            <Image
              style={styles.editIcon}
              source={UMIcons.whitePencil}
              resizeMode='contain'
            />
          </TouchableOpacity>
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.detailsTitle}>Username</Text>
          <Text style={styles.detailsValue}>{username}</Text>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => {
              navigate('EditUsername', {
                username: username
              })
            }}
          >
            {/* <Image
              style={styles.editIcon}
              source={UMIcons.whitePencil}
              resizeMode='contain'
            /> */}
          </TouchableOpacity>
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.detailsTitle}>Email Address</Text>
          <Text style={styles.detailsValue}>{email}</Text>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => {
              navigate('EditEmail', {
                email: email
              })
            }}
          >
            <Image
              style={styles.editIcon}
              source={UMIcons.whitePencil}
              resizeMode='contain'
            />
          </TouchableOpacity>
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.detailsTitle}>Mobile Number</Text>
          <Text style={styles.detailsValue}>{mobileNumber}</Text>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => {
              navigate('EditMobileNumber', {
                mobileNumber: mobileNumber
              })
            }}
          >
            <Image
              style={styles.editIcon}
              source={UMIcons.whitePencil}
              resizeMode='contain'
            />
          </TouchableOpacity>
        </View>
        <View style={[styles.detailsContainer, userChangesData?.userDetails?.customerType === 'individual' && { marginBottom: 50 }]}>
          <Text style={styles.detailsTitle}>Billing / Legal Address</Text>
          <Text style={styles.detailsValue}>{legalAddress}</Text>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => {
              navigate('EditAddress', {
                address: userChangesData?.userDetails?.address,
                barangay: userChangesData?.userDetails?.barangay,
                city: userChangesData?.userDetails?.city,
                province: userChangesData?.userDetails?.province,
              })
            }}
          >
            <Image
              style={styles.editIcon}
              source={UMIcons.whitePencil}
              resizeMode='contain'
            />
          </TouchableOpacity>
        </View>
        {
          userChangesData?.userDetails?.customerType !== 'individual' && 
            <View style={[styles.detailsContainer, { marginBottom: 50}]}>
              <Text style={styles.detailsTitle}>Valid ID</Text>
              {
                userChangesData?.userDetails?.validID ?
                  <Image
                    style={styles.idImage}
                    source={{ uri: userChangesData?.userDetails?.validID?.uri || userChangesData?.userDetails?.validID }}
                    resizeMode='contain'
                  />
                :
                  <Text style={styles.noValidIDTxt}>No Valid ID</Text>
              }
              <TouchableOpacity
                style={styles.editBtn}
                onPress={() => {
                  navigate('EditValidID', {
                    validID: {
                      uri: userChangesData?.userDetails?.validID
                    }
                  })
                }}
              >
                <Image
                  style={styles.editIcon}
                  source={UMIcons.whitePencil}
                  resizeMode='contain'
                />
              </TouchableOpacity>
            </View>
        }
      </ScrollView>
      <TouchableOpacity
        style={styles.saveBtn}
        onPress={() => updateUser()}
      >
        <Text style={styles.saveBtnTxt}>Save</Text>
      </TouchableOpacity>
      <Loader/>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: UMColors.BGOrange,
    alignItems: 'center'
  },
  detailsContainer: {
    borderRadius: 7,
    marginTop: 10,
    width: deviceWidth / 1.15,
    height: 'auto',
    justifyContent: 'center',
    borderColor: UMColors.black,
    backgroundColor: UMColors.BGOrange,
    elevation: 3,
  },
  detailsTitle: {
    fontSize: 14,
    color: UMColors.black,
    marginBottom: 6,
    marginLeft: 13,
    marginTop: 15
  },
  detailsValue: {
    fontSize: 14,
    color: UMColors.primaryOrange,
    fontWeight: 'bold',
    marginLeft: 13,
    marginBottom: 15
  },
  editIcon: {
    width: 13,
    height: 13,
    tintColor: UMColors.primaryOrange
  },
  idImage: {
    width: '60%',
    height: 100,
    alignSelf: 'center',
    marginVertical: 10
  },
  editBtn: {
    height: 20,
    width: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 10,
    right: 10
  },
  noValidIDTxt: {
    color: UMColors.primaryGray,
    width: '60%',
    height: 100,
    alignSelf: 'center',
    marginVertical: 10,
    textAlign: 'center',
    textAlignVertical: 'center'
  },
  saveBtn: {
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
  saveBtnTxt: {
    color: UMColors.white,
    fontSize: 15,
    fontWeight: 'bold'
  }
})