import { 
  View, 
  Text, 
  SafeAreaView, 
  StyleSheet, 
  Dimensions, 
  Image, 
  TouchableOpacity 
} from 'react-native'
import React, { useState } from 'react'
import { UMColors } from '../../../utils/ColorHelper'
import CustomNavbar from '../../Components/CustomNavbar'
import { UMIcons } from '../../../utils/imageHelper'
import { useSelector } from 'react-redux'
import { ScrollView } from 'react-native-gesture-handler'
import { navigate, resetNavigation } from '../../../utils/navigationHelper'
import { dispatch } from '../../../utils/redux'
import { setLoading } from '../../../redux/actions/Loader'
import { refreshTokenHelper } from '../../../api/helper/userHelper'
import { CustomerApi } from '../../../api/customer'
import { showError } from '../../../redux/actions/ErrorModal'
import ErrorWithCloseButtonModal from '../../Components/ErrorWithCloseButtonModal'
import ErrorOkModal from '../../Components/ErrorOkModal'
import SuccessOkModal from '../../Components/SuccessOkModal'
import { Loader } from '../../Components/Loader'
import { saveUser } from '../../../redux/actions/User'

const deviceWidth = Dimensions.get('screen').width

export default CompanyProfileScreen = () => {

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
  const companyName = userChangesData?.companyDetails?.companyName
  const companyEmail = userChangesData?.companyDetails?.companyEmail
  const companyMobileNumber = userChangesData?.companyDetails?.companyMobileNumber
  const legalAddress = userChangesData?.companyDetails?.officeAddress + ' ' +
                       userChangesData?.companyDetails?.officeBarangay + ' ' +
                       userChangesData?.companyDetails?.officeCity + ' ' +
                       userChangesData?.companyDetails?.officeProvince + ', ' +
                       userChangesData?.companyDetails?.officeZipCode

  const updateUser = () => {
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
          setSuccess({ value: true, message: 'Company Update Success!'})
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
        Title={'Company Profile'}
      />
      <ScrollView showsVerticalScrollIndicator={false} style={{ width: deviceWidth }} contentContainerStyle={{ alignItems: 'center' }}>
        <TouchableOpacity
          style={styles.editCompanyLogoBtn}
          onPress={() => {
            navigate('EditCompanyLogo', {
              companyLogo: {
                uri: userChangesData?.companyDetails?.companyLogo
              }
            })
          }}
        >
          <Image
            style={styles.idImage}
            source={{ uri: userChangesData?.companyDetails?.companyLogo?.uri || userChangesData?.companyDetails?.companyLogo }}
            resizeMode='contain'
          />
        </TouchableOpacity>
        <View style={[styles.detailsContainer, { marginTop: 20 }]}>
          <Text style={styles.detailsTitle}>Company Name</Text>
          <Text style={styles.detailsValue}>{companyName}</Text>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => {
              navigate('EditCompanyName', { companyName: companyName })
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
          <Text style={styles.detailsTitle}>Email Address</Text>
          <Text style={styles.detailsValue}>{companyEmail}</Text>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => {
              navigate('EditCompanyEmail', { companyEmail: companyEmail })
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
          <Text style={styles.detailsValue}>{companyMobileNumber}</Text>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => {
              navigate('EditCompanyMobileNumber', { companyMobileNumber: companyMobileNumber })
            }}
          >
            <Image
              style={styles.editIcon}
              source={UMIcons.whitePencil}
              resizeMode='contain'
            />
          </TouchableOpacity>
        </View>
        <View style={[styles.detailsContainer, { marginBottom: 20 }]}>
          <Text style={styles.detailsTitle}>Billing / Legal Address</Text>
          <Text style={styles.detailsValue}>{legalAddress}</Text>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => {
              navigate('EditCompanyAddress', {
                address: userChangesData?.companyDetails?.officeAddress,
                barangay: userChangesData?.companyDetails?.officeBarangay,
                city: userChangesData?.companyDetails?.officeCity,
                province: userChangesData?.companyDetails?.officeProvince,
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
      </ScrollView>
      <TouchableOpacity
        style={styles.saveBtn}
        onPress={() => {
          updateUser()
        }}
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
  editCompanyLogoBtn: {
    width: 140,
    height: 140,
    borderWidth: 1,
    borderColor: UMColors.primaryOrange,
    borderRadius: 7,
    marginTop: 20,
    overflow: 'hidden'
  },
  idImage: {
    width: 140,
    height: 140,
    alignSelf: 'center',
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
  editBtn: {
    height: 20,
    width: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 10,
    right: 10
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